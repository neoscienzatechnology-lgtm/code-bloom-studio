import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { ConceptMastery, ConceptStatus } from "@/utils/conceptMastery";

const CONCEPT_COLUMNS =
  "concept_id,label,mastery,status,total_lessons,completed_lessons,in_progress_lessons,failed_attempts,reason,review_course_id,review_lesson_id,review_lesson_title,updated_at";

interface ConceptMasteryRow {
  user_id: string;
  concept_id: string;
  label: string;
  mastery: number;
  status: ConceptStatus;
  total_lessons: number;
  completed_lessons: number;
  in_progress_lessons: number;
  failed_attempts: number;
  reason: string;
  review_course_id: string | null;
  review_lesson_id: string | null;
  review_lesson_title: string | null;
}

const STORAGE_KEY = "code-bloom-studio-concept-mastery";

interface ConceptMasterySnapshot {
  concepts: ConceptMastery[];
  updatedAt: string;
}

function hasLearningSignal(concepts: ConceptMastery[]): boolean {
  return concepts.some(
    (concept) =>
      concept.completedLessons > 0 ||
      concept.inProgressLessons > 0 ||
      concept.failedAttempts > 0 ||
      concept.status === "weak" ||
      concept.status === "learning" ||
      concept.status === "strong",
  );
}

function saveLocalSnapshot(concepts: ConceptMastery[]) {
  const snapshot: ConceptMasterySnapshot = {
    concepts,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  return snapshot;
}

function readLocalSnapshot(): ConceptMasterySnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function rowToConcept(row: {
  concept_id: string;
  label: string;
  mastery: number;
  status: string;
  total_lessons: number;
  completed_lessons: number;
  in_progress_lessons: number;
  failed_attempts: number;
  reason: string | null;
  review_course_id: string | null;
  review_lesson_id: string | null;
  review_lesson_title: string | null;
}): ConceptMastery {
  return {
    id: row.concept_id,
    label: row.label,
    mastery: row.mastery,
    status: row.status as ConceptStatus,
    totalLessons: row.total_lessons,
    completedLessons: row.completed_lessons,
    inProgressLessons: row.in_progress_lessons,
    failedAttempts: row.failed_attempts,
    reason: row.reason ?? "Snapshot sincronizado do seu progresso.",
    reviewLesson:
      row.review_course_id && row.review_lesson_id
        ? {
            courseId: row.review_course_id,
            lessonId: row.review_lesson_id,
            title: row.review_lesson_title ?? "Revisar conceito",
          }
        : undefined,
  };
}

export function useConceptMasterySync(localConcepts: ConceptMastery[]) {
  const { user } = useAuth();
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    const localSnapshot = readLocalSnapshot();
    if (localSnapshot) {
      setLastSyncedAt(localSnapshot.updatedAt);
    }
  }, []);

  const cloudQuery = useQuery({
    queryKey: ["concept-mastery", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_concept_mastery")
        .select(CONCEPT_COLUMNS)
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const cloudConcepts = useMemo(
    () => (cloudQuery.data?.length ? cloudQuery.data.map(rowToConcept) : []),
    [cloudQuery.data],
  );

  useEffect(() => {
    if (cloudQuery.data?.length) {
      setLastSyncedAt(cloudQuery.data[0].updated_at);
    }
  }, [cloudQuery.data]);

  const { mutate: syncMastery, isPending: syncing } = useMutation({
    mutationFn: async (rows: ConceptMasteryRow[]) => {
      const { error } = await supabase
        .from("user_concept_mastery")
        .upsert(rows, { onConflict: "user_id,concept_id" });
      if (error) throw error;
    },
    onSuccess: () => setLastSyncedAt(new Date().toISOString()),
  });

  // Persist a local snapshot whenever there is a real learning signal.
  useEffect(() => {
    if (!hasLearningSignal(localConcepts)) return;
    const snapshot = saveLocalSnapshot(localConcepts);
    setLastSyncedAt(snapshot.updatedAt);
  }, [localConcepts]);

  // Push local mastery to the cloud when signed in.
  useEffect(() => {
    if (!user || !hasLearningSignal(localConcepts)) return;
    const rows = localConcepts.map((concept) => ({
      user_id: user.id,
      concept_id: concept.id,
      label: concept.label,
      mastery: concept.mastery,
      status: concept.status,
      total_lessons: concept.totalLessons,
      completed_lessons: concept.completedLessons,
      in_progress_lessons: concept.inProgressLessons,
      failed_attempts: concept.failedAttempts,
      reason: concept.reason,
      review_course_id: concept.reviewLesson?.courseId ?? null,
      review_lesson_id: concept.reviewLesson?.lessonId ?? null,
      review_lesson_title: concept.reviewLesson?.title ?? null,
    }));
    syncMastery(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localConcepts, user]);

  const concepts = useMemo(() => {
    if (hasLearningSignal(localConcepts) || cloudConcepts.length === 0) return localConcepts;
    return cloudConcepts;
  }, [cloudConcepts, localConcepts]);

  const syncLabel = !user
    ? "Salvo neste dispositivo"
    : syncing
      ? "Sincronizando domínio..."
      : lastSyncedAt
        ? "Domínio sincronizado"
        : "Domínio pronto para sincronizar";

  return {
    concepts,
    syncLabel,
    syncing,
    lastSyncedAt,
  };
}
