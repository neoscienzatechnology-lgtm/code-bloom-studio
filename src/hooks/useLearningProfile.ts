import { useCallback, useMemo, useState } from "react";

const STORAGE_KEY = "code-bloom-studio-learning-profile";

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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

function firstLessonFor(profile: LearningProfile): string {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProfileState(next);
  }, []);

  const clearProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
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
