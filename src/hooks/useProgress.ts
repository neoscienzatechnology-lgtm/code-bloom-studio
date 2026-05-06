import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProgressData {
  completedLessons: string[];
  savedCode: Record<string, string>;
  totalXp: number;
}

const STORAGE_KEY = "code-bloom-studio-progress";

function loadLocalProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    return { completedLessons: [], savedCode: {}, totalXp: 0 };
  }
  return { completedLessons: [], savedCode: {}, totalXp: 0 };
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
        .select("lesson_id, code, completed, xp_earned")
        .eq("user_id", user.id);

      if (data && data.length > 0) {
        const cloudLessons = data.filter((d) => d.completed).map((d) => d.lesson_id);
        const cloudCode: Record<string, string> = {};
        let cloudXp = 0;
        data.forEach((d) => {
          if (d.code) cloudCode[d.lesson_id] = d.code;
          if (d.completed) cloudXp += d.xp_earned || 0;
        });

        // Merge local + cloud
        const local = loadLocalProgress();
        const mergedLessons = [...new Set([...local.completedLessons, ...cloudLessons])];
        const mergedCode = { ...cloudCode, ...local.savedCode };
        const mergedXp = Math.max(local.totalXp, cloudXp);

        const merged = { completedLessons: mergedLessons, savedCode: mergedCode, totalXp: mergedXp };
        setProgress(merged);
        saveLocalProgress(merged);
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
        const updated = {
          ...prev,
          completedLessons: [...prev.completedLessons, lessonId],
          totalXp: prev.totalXp + xp,
        };
        if (courseId) {
          syncToCloud(lessonId, courseId, prev.savedCode[lessonId] || "", true, xp);
        }
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
    completeLesson,
    saveCode,
    isCompleted,
    getSavedCode,
    getCourseProgress,
    synced,
  };
}
