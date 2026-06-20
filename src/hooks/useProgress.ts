import { useState, useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { buildStudyStats, toLocalDateKey } from "@/utils/studyStats";
import {
  resolveStreakFreezes,
  freezeStatesEqual,
  DEFAULT_FREEZE_STATE,
  type FreezeState,
} from "@/utils/streakFreeze";
import { readJson, writeJson, STORAGE_KEYS } from "@/lib/storage";

export interface ProgressData {
  completedLessons: string[];
  savedCode: Record<string, string>;
  totalXp: number;
  activityDates: string[];
  lessonCompletedAt: Record<string, string>;
  lessonXpEarned: Record<string, number>;
}

interface ProgressRow {
  user_id: string;
  lesson_id: string;
  course_id: string;
  code: string;
  completed: boolean;
  xp_earned: number;
}

const STORAGE_KEY = STORAGE_KEYS.progress;
export const ACTIVITY_COURSE_IDS = {
  dailyReview: "__daily_review__",
  conceptTraining: "__concept_training__",
  quiz: "__quiz__",
  generic: "__activity__",
} as const;
const EMPTY_PROGRESS: ProgressData = {
  completedLessons: [],
  savedCode: {},
  totalXp: 0,
  activityDates: [],
  lessonCompletedAt: {},
  lessonXpEarned: {},
};

const completedLessonLocks = new Set<string>();
const progressListeners = new Set<(progress: ProgressData) => void>();
let progressSnapshot: ProgressData | null = null;

function uniqueStrings(items: string[]): string[] {
  return Array.from(new Set(items.filter(Boolean)));
}

function sanitizeXp(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function normalizeNumberRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => Boolean(key))
      .map(([key, item]) => [key, sanitizeXp(item)])
  );
}

function hydrateCompletionLocks(progress: ProgressData) {
  progress.completedLessons.forEach((lessonId) => completedLessonLocks.add(lessonId));
}

export function normalizeProgress(data: Partial<ProgressData> | null | undefined): ProgressData {
  const completedLessons = uniqueStrings(Array.isArray(data?.completedLessons) ? data.completedLessons : []);
  const lessonXpEarned = normalizeNumberRecord(data?.lessonXpEarned);
  const earnedTotal = completedLessons.reduce((total, lessonId) => total + (lessonXpEarned[lessonId] ?? 0), 0);
  const hasXpForEveryCompletedLesson =
    completedLessons.length > 0 &&
    completedLessons.every((lessonId) => Object.prototype.hasOwnProperty.call(lessonXpEarned, lessonId));

  return {
    completedLessons,
    savedCode: data?.savedCode && typeof data.savedCode === "object" ? data.savedCode : {},
    totalXp: hasXpForEveryCompletedLesson ? earnedTotal : Math.max(sanitizeXp(data?.totalXp), earnedTotal),
    activityDates: uniqueSortedDates(Array.isArray(data?.activityDates) ? data.activityDates : []),
    lessonCompletedAt:
      data?.lessonCompletedAt && typeof data.lessonCompletedAt === "object" ? data.lessonCompletedAt : {},
    lessonXpEarned,
  };
}

function uniqueSortedDates(dates: string[]): string[] {
  return Array.from(new Set(dates.filter(Boolean))).sort();
}

export function awardProgressOnce(
  currentProgress: Partial<ProgressData> | null | undefined,
  lessonId: string,
  xp: number,
  completedAt = toLocalDateKey(new Date())
): { progress: ProgressData; awarded: boolean } {
  const normalizedLessonId = lessonId.trim();
  const progress = normalizeProgress(currentProgress);

  if (!normalizedLessonId || progress.completedLessons.includes(normalizedLessonId)) {
    return { progress, awarded: false };
  }

  return {
    awarded: true,
    progress: normalizeProgress({
      ...progress,
      completedLessons: [...progress.completedLessons, normalizedLessonId],
      activityDates: uniqueSortedDates([...progress.activityDates, completedAt]),
      lessonCompletedAt: {
        ...progress.lessonCompletedAt,
        [normalizedLessonId]: completedAt,
      },
      lessonXpEarned: {
        ...progress.lessonXpEarned,
        [normalizedLessonId]: sanitizeXp(xp),
      },
    }),
  };
}

export function resolveProgressCourseId(lessonId: string, courseId?: string): string {
  if (courseId) return courseId;
  if (lessonId.startsWith("daily-review-")) return ACTIVITY_COURSE_IDS.dailyReview;
  if (lessonId.startsWith("concept-training-")) return ACTIVITY_COURSE_IDS.conceptTraining;
  const coursePrefix = lessonId.match(/^(\d+)-/);
  if (coursePrefix) return coursePrefix[1];
  if (lessonId.endsWith("-quiz")) return ACTIVITY_COURSE_IDS.quiz;
  return ACTIVITY_COURSE_IDS.generic;
}

function loadLocalProgress(): ProgressData {
  const raw = readJson<Partial<ProgressData> | null>(STORAGE_KEY, null);
  return raw ? normalizeProgress(raw) : EMPTY_PROGRESS;
}

function saveLocalProgress(data: ProgressData) {
  writeJson(STORAGE_KEY, data);
}

function getProgressSnapshot(): ProgressData {
  if (!progressSnapshot) {
    progressSnapshot = loadLocalProgress();
    hydrateCompletionLocks(progressSnapshot);
  }

  return progressSnapshot;
}

function replaceProgressSnapshot(nextProgress: Partial<ProgressData>): ProgressData {
  const normalized = normalizeProgress(nextProgress);
  progressSnapshot = normalized;
  hydrateCompletionLocks(normalized);
  saveLocalProgress(normalized);
  progressListeners.forEach((listener) => listener(normalized));
  return normalized;
}

function updateProgressSnapshot(updater: (progress: ProgressData) => Partial<ProgressData>): ProgressData {
  return replaceProgressSnapshot(updater(getProgressSnapshot()));
}

// Snapshot compartilhado do protetor de ofensiva — mesmo padrão do `progress`,
// para todas as instâncias de useProgress (dashboard, navbar, lição) verem o
// mesmo estado. Sem isso, cada instância tinha o seu `freezeState` e podia
// divergir até reconvergir (resolve é idempotente, mas gerava writes duplicados).
const freezeListeners = new Set<(state: FreezeState) => void>();
let freezeSnapshot: FreezeState | null = null;

function getFreezeSnapshot(): FreezeState {
  if (!freezeSnapshot) {
    freezeSnapshot = readJson<FreezeState>(STORAGE_KEYS.freeze, DEFAULT_FREEZE_STATE);
  }
  return freezeSnapshot;
}

function replaceFreezeSnapshot(next: FreezeState): FreezeState {
  freezeSnapshot = next;
  writeJson(STORAGE_KEYS.freeze, next);
  freezeListeners.forEach((listener) => listener(next));
  return next;
}

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData>(getProgressSnapshot);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    progressListeners.add(setProgress);
    setProgress(getProgressSnapshot());
    return () => {
      progressListeners.delete(setProgress);
    };
  }, []);

  // Cloud progress read — cached and retried by TanStack Query.
  const progressQuery = useQuery({
    queryKey: ["user-progress", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("lesson_id, course_id, code, completed, xp_earned, updated_at")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Cloud progress write — always a batch upsert (callers wrap a single row
  // as [row]). `mutate` is a stable reference (per TanStack Query), so
  // destructuring keeps consumers' useCallback deps stable; the full mutation
  // object would be a new ref each render.
  const { mutate: upsertProgressMutate } = useMutation({
    mutationFn: async (rows: ProgressRow[]) => {
      const { error } = await supabase
        .from("user_progress")
        .upsert(rows, { onConflict: "user_id,lesson_id" });
      if (error) throw error;
    },
  });

  useEffect(() => {
    if (!user) setSynced(false);
  }, [user]);

  // Merge cloud rows into the local-first snapshot once they arrive, then push
  // up any completions that only existed locally (continuity after login).
  useEffect(() => {
    if (!user || !progressQuery.data) return;

    const cloudRows = progressQuery.data;
    const cloudLessons = cloudRows.filter((d) => d.completed).map((d) => d.lesson_id);
    const cloudCode: Record<string, string> = {};
    const cloudCourseIds: Record<string, string> = {};
    const cloudCompletedAt: Record<string, string> = {};
    const cloudXpEarned: Record<string, number> = {};
    const cloudActivityDates: string[] = [];
    let cloudXp = 0;
    cloudRows.forEach((d) => {
      cloudCourseIds[d.lesson_id] = d.course_id;
      if (d.code) cloudCode[d.lesson_id] = d.code;
      if (d.completed) {
        const completedAt = d.updated_at ? toLocalDateKey(new Date(d.updated_at)) : toLocalDateKey(new Date());
        const earned = d.xp_earned || 0;
        cloudCompletedAt[d.lesson_id] = completedAt;
        cloudXpEarned[d.lesson_id] = earned;
        cloudActivityDates.push(completedAt);
        cloudXp += earned;
      }
    });

    const local = getProgressSnapshot();
    const mergedLessons = [...new Set([...local.completedLessons, ...cloudLessons])];
    const mergedCode = { ...cloudCode, ...local.savedCode };
    const mergedCompletedAt = { ...cloudCompletedAt, ...local.lessonCompletedAt };
    const mergedXpEarned = { ...cloudXpEarned, ...local.lessonXpEarned };
    const mergedDates = uniqueSortedDates([
      ...local.activityDates,
      ...cloudActivityDates,
      ...Object.values(mergedCompletedAt),
    ]);

    const merged = normalizeProgress({
      completedLessons: mergedLessons,
      savedCode: mergedCode,
      totalXp: Math.max(local.totalXp, cloudXp),
      activityDates: mergedDates,
      lessonCompletedAt: mergedCompletedAt,
      lessonXpEarned: mergedXpEarned,
    });
    replaceProgressSnapshot(merged);

    const localCompletions: ProgressRow[] = local.completedLessons.map((lessonId) => ({
      user_id: user.id,
      lesson_id: lessonId,
      course_id: cloudCourseIds[lessonId] ?? resolveProgressCourseId(lessonId),
      code: mergedCode[lessonId] ?? "",
      completed: true,
      xp_earned: mergedXpEarned[lessonId] ?? 0,
    }));

    if (localCompletions.length > 0) {
      upsertProgressMutate(localCompletions);
    }
    setSynced(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, progressQuery.data]);

  const syncToCloud = useCallback(
    (lessonId: string, courseId: string, code: string, completed: boolean, xp: number) => {
      if (!user) return;
      upsertProgressMutate([
        {
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          code,
          completed,
          xp_earned: xp,
        },
      ]);
    },
    [user, upsertProgressMutate]
  );

  const completeLesson = useCallback(
    (lessonId: string, xp: number, courseId?: string) => {
      const normalizedLessonId = lessonId.trim();
      if (!normalizedLessonId || completedLessonLocks.has(normalizedLessonId)) return false;

      completedLessonLocks.add(normalizedLessonId);
      const { progress: updated, awarded } = awardProgressOnce(getProgressSnapshot(), normalizedLessonId, xp);

      if (!awarded) return false;

      replaceProgressSnapshot(updated);
      syncToCloud(
        normalizedLessonId,
        resolveProgressCourseId(normalizedLessonId, courseId),
        updated.savedCode[normalizedLessonId] || "",
        true,
        updated.lessonXpEarned[normalizedLessonId] ?? 0
      );
      return true;
    },
    [syncToCloud]
  );

  const saveCode = useCallback(
    (lessonId: string, code: string, courseId?: string) => {
      const normalizedLessonId = lessonId.trim();
      if (!normalizedLessonId) return;

      const updated = updateProgressSnapshot((prev) => ({
        ...prev,
        savedCode: { ...prev.savedCode, [normalizedLessonId]: code },
      }));
      if (courseId) {
        const completed = updated.completedLessons.includes(normalizedLessonId);
        syncToCloud(normalizedLessonId, courseId, code, completed, updated.lessonXpEarned[normalizedLessonId] ?? 0);
      }
    },
    [syncToCloud]
  );

  const isCompleted = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  const getSavedCode = useCallback(
    (lessonId: string) => progress.savedCode[lessonId],
    [progress.savedCode]
  );

  const getCourseProgress = useCallback(
    (lessonIds: string[]) => {
      if (lessonIds.length === 0) return 0;
      const done = lessonIds.filter((id) => progress.completedLessons.includes(id)).length;
      return Math.round((done / lessonIds.length) * 100);
    },
    [progress.completedLessons]
  );

  // Protetor de ofensiva: cobre dias perdidos para a sequência não zerar.
  // Lê do snapshot compartilhado e escuta mudanças de outras instâncias.
  const [freezeState, setFreezeState] = useState<FreezeState>(getFreezeSnapshot);
  useEffect(() => {
    freezeListeners.add(setFreezeState);
    setFreezeState(getFreezeSnapshot());
    return () => {
      freezeListeners.delete(setFreezeState);
    };
  }, []);
  // `today` se atualiza quando o app volta ao foco (cobre a virada de meia-noite
  // num PWA que ficou aberto), em vez de congelar no horário de montagem.
  const [todayKey, setTodayKey] = useState(() => toLocalDateKey(new Date()));
  useEffect(() => {
    const sync = () => {
      const key = toLocalDateKey(new Date());
      setTodayKey((prev) => (prev === key ? prev : key));
    };
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);
  const today = useMemo(() => {
    const [year, month, day] = todayKey.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, [todayKey]);
  const resolvedFreezes = useMemo(
    () => resolveStreakFreezes(progress.activityDates, freezeState, today),
    [progress.activityDates, freezeState, today],
  );
  useEffect(() => {
    if (!freezeStatesEqual(resolvedFreezes.state, freezeState)) {
      replaceFreezeSnapshot(resolvedFreezes.state);
    }
  }, [resolvedFreezes.state, freezeState]);

  return {
    ...progress,
    studyStats: buildStudyStats({ ...progress, activityDates: resolvedFreezes.effectiveDates }),
    streakFreeze: {
      available: resolvedFreezes.state.available,
      frozenDates: resolvedFreezes.state.frozenDates,
    },
    completeLesson,
    saveCode,
    isCompleted,
    getSavedCode,
    getCourseProgress,
    synced,
  };
}
