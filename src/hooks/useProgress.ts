import { useState, useCallback, useEffect } from "react";

interface ProgressData {
  completedLessons: string[]; // lessonId[]
  savedCode: Record<string, string>; // lessonId -> code
  totalXp: number;
}

const STORAGE_KEY = "codequest-progress";

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedLessons: [], savedCode: {}, totalXp: 0 };
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completeLesson = useCallback((lessonId: string, xp: number) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        totalXp: prev.totalXp + xp,
      };
    });
  }, []);

  const saveCode = useCallback((lessonId: string, code: string) => {
    setProgress((prev) => ({
      ...prev,
      savedCode: { ...prev.savedCode, [lessonId]: code },
    }));
  }, []);

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
    completeLesson,
    saveCode,
    isCompleted,
    getSavedCode,
    getCourseProgress,
  };
}
