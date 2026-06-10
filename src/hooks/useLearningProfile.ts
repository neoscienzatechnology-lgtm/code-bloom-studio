import { useCallback, useMemo, useState } from "react";
import { readJson, writeJson, removeKey, STORAGE_KEYS } from "@/lib/storage";

const STORAGE_KEY = STORAGE_KEYS.learningProfile;

export type ExperienceLevel = "new" | "basic" | "intermediate";
export type LearningGoal = "frontend" | "modern-web" | "backend" | "python-ai" | "mobile" | "games";
export type DailyGoal = 5 | 10 | 15 | 25;

export interface LearningProfile {
  experience: ExperienceLevel;
  goal: LearningGoal;
  dailyGoal: DailyGoal;
  createdAt: string;
}

const DEFAULT_PROFILE: LearningProfile = {
  experience: "new",
  goal: "frontend",
  dailyGoal: 10,
  createdAt: new Date().toISOString(),
};

function readProfile(): LearningProfile | null {
  const raw = readJson<Partial<LearningProfile> | null>(STORAGE_KEY, null);
  return raw ? { ...DEFAULT_PROFILE, ...raw } : null;
}

function firstLessonFor(profile: LearningProfile): string {
  if (profile.experience === "new") return "/editor/10/10-1";
  if (profile.goal === "frontend") return "/editor/9/9-1";
  if (profile.goal === "modern-web") return "/editor/2/2-1";
  if (profile.goal === "backend") return "/editor/5/5-1";
  if (profile.goal === "python-ai") return "/editor/1/1-1";
  if (profile.goal === "mobile") return "/editor/2/2-1";
  if (profile.goal === "games") return "/editor/8/8-1";
  if (profile.experience === "intermediate") return "/editor/2/2-1";
  return "/editor/9/9-1";
}

export function useLearningProfile() {
  const [profile, setProfileState] = useState<LearningProfile | null>(readProfile);

  const setProfile = useCallback((next: LearningProfile) => {
    writeJson(STORAGE_KEY, next);
    setProfileState(next);
  }, []);

  const clearProfile = useCallback(() => {
    removeKey(STORAGE_KEY);
    setProfileState(null);
  }, []);

  const recommendedStart = useMemo(
    () => firstLessonFor(profile ?? DEFAULT_PROFILE),
    [profile],
  );

  return {
    profile,
    hasProfile: Boolean(profile),
    recommendedStart,
    setProfile,
    clearProfile,
  };
}
