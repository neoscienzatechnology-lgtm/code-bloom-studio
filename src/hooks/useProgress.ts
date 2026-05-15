import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { buildStudyStats, toLocalDateKey } from "@/utils/studyStats";

interface ProgressData {
  completedLessons: string[];
  savedCode: Record<string, string>;
  totalXp: number;
  activityDates: string[];
  lessonCompletedAt: Record<string, string>;
  lessonXpEarned: Record<string, number>;
}

const STORAGE_KEY = "code-bloom-studio-progress";
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

function normalizeProgress(data: Partial<ProgressData> | null | undefined): ProgressData {
  return {
    completedLessons: Array.isArray(data?.completedLessons) ? data.completedLessons : [],
    savedCode: data?.savedCode && typeof data.savedCode === "object" ? data.savedCode : {},
    totalXp: typeof data?.totalXp === "number" ? data.totalXp : 0,
    activityDates: Array.isArray(data?.activityDates) ? data.activityDates : [],
    lessonCompletedAt:
      data?.lessonCompletedAt && typeof data.lessonCompletedAt === "object" ? data.lessonCompletedAt : {},
    lessonXpEarned:
      data?.lessonXpEarned && typeof data.lessonXpEarned === "object" ? data.lessonXpEarned : {},
  };
}

function uniqueSortedDates(dates: string[]): string[] {
  return Array.from(new Set(dates.filter(Boolean))).sort();
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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeProgress(JSON.parse(raw));
  } catch {
    return EMPTY_PROGRESS;
  }
  return EMPTY_PROGRESS;
}

function saveLocalProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData>(loadLocalProgress);
  const [synced, setSynced] = useState(false);

  // Load from cloud when user logs in
  useEffect(() => {
    if (!user) {
      setSynced(false);
      return;
    }

    const loadCloud = async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("lesson_id, course_id, code, completed, xp_earned, updated_at")
        .eq("user_id", user.id);

      const cloudRows = data ?? [];
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

      // Merge local + cloud, then upload any local-only completions for continuity after login.
      const local = loadLocalProgress();
      const mergedLessons = [...new Set([...local.completedLessons, ...cloudLessons])];
      const mergedCode = { ...cloudCode, ...local.savedCode };
      const mergedXp = Math.max(local.totalXp, cloudXp);
      const mergedCompletedAt = { ...cloudCompletedAt, ...local.lessonCompletedAt };
      const mergedXpEarned = { ...cloudXpEarned, ...local.lessonXpEarned };
      const mergedDates = uniqueSortedDates([
        ...local.activityDates,
        ...cloudActivityDates,
        ...Object.values(mergedCompletedAt),
      ]);

      const merged = {
        completedLessons: mergedLessons,
        savedCode: mergedCode,
        totalXp: mergedXp,
        activityDates: mergedDates,
        lessonCompletedAt: mergedCompletedAt,
        lessonXpEarned: mergedXpEarned,
      };
      setProgress(merged);
      saveLocalProgress(merged);

      const localCompletions = local.completedLessons.map((lessonId) => ({
        user_id: user.id,
        lesson_id: lessonId,
        course_id: cloudCourseIds[lessonId] ?? resolveProgressCourseId(lessonId),
        code: mergedCode[lessonId] ?? "",
        completed: true,
        xp_earned: mergedXpEarned[lessonId] ?? 0,
      }));

      if (localCompletions.length > 0) {
        await supabase.from("user_progress").upsert(localCompletions, { onConflict: "user_id,lesson_id" });
      }
      setSynced(true);
    };

    loadCloud();
  }, [user]);

  // Save to localStorage on every change
  useEffect(() => {
    saveLocalProgress(progress);
  }, [progress]);

  const syncToCloud = useCallback(
    async (lessonId: string, courseId: string, code: string, completed: boolean, xp: number) => {
      if (!user) return;
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          code,
          completed,
          xp_earned: xp,
        },
        { onConflict: "user_id,lesson_id" }
      );
    },
    [user]
  );

  const completeLesson = useCallback(
    (lessonId: string, xp: number, courseId?: string) => {
      setProgress((prev) => {
        if (prev.completedLessons.includes(lessonId)) return prev;
        const completedAt = toLocalDateKey(new Date());
        const updated = {
          ...prev,
          completedLessons: [...prev.completedLessons, lessonId],
          totalXp: prev.totalXp + xp,
          activityDates: uniqueSortedDates([...prev.activityDates, completedAt]),
          lessonCompletedAt: {
            ...prev.lessonCompletedAt,
            [lessonId]: completedAt,
          },
          lessonXpEarned: {
            ...prev.lessonXpEarned,
            [lessonId]: xp,
          },
        };
        syncToCloud(lessonId, resolveProgressCourseId(lessonId, courseId), prev.savedCode[lessonId] || "", true, xp);
        return updated;
      });
    },
    [syncToCloud]
  );

  const saveCode = useCallback(
    (lessonId: string, code: string, courseId?: string) => {
      setProgress((prev) => ({
        ...prev,
        savedCode: { ...prev.savedCode, [lessonId]: code },
      }));
      if (courseId) {
        syncToCloud(lessonId, courseId, code, false, 0);
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

  return {
    ...progress,
    studyStats: buildStudyStats(progress),
    completeLesson,
    saveCode,
    isCompleted,
    getSavedCode,
    getCourseProgress,
    synced,
  };
}
