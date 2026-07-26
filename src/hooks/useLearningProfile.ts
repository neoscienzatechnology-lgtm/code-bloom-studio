import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { readJson, writeJson, removeKey, STORAGE_KEYS } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

// ── Sync com a conta ───────────────────────────────────────────────────────
// O perfil (objetivo/nível/meta) vivia só no localStorage: trocar de celular
// devolvia o aluno ao padrão sem avisar, mesmo com XP e ofensiva intactos.
// Agora ele acompanha a conta. Se a migration ainda não tiver sido aplicada,
// as chamadas falham em silêncio e o app segue funcionando local.
// #revisao-lote9

async function fetchCloudProfile(userId: string): Promise<LearningProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("learning_goal, learning_experience, daily_goal, learning_profile_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) return null;

    const row = data as unknown as {
      learning_goal: string | null;
      learning_experience: string | null;
      daily_goal: number | null;
      learning_profile_at: string | null;
    };
    if (!row.learning_goal || !row.learning_experience) return null;

    return {
      goal: row.learning_goal as LearningGoal,
      experience: row.learning_experience as ExperienceLevel,
      dailyGoal: (row.daily_goal ?? DEFAULT_PROFILE.dailyGoal) as DailyGoal,
      createdAt: row.learning_profile_at ?? DEFAULT_PROFILE.createdAt,
    };
  } catch {
    return null;
  }
}

async function pushCloudProfile(userId: string, profile: LearningProfile): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any)
      .update({
        learning_goal: profile.goal,
        learning_experience: profile.experience,
        daily_goal: profile.dailyGoal,
        learning_profile_at: profile.createdAt,
      })
      .eq("user_id", userId);
  } catch {
    /* sem migration/offline: o perfil continua valendo localmente */
  }
}

export function useLearningProfile() {
  const { user } = useAuth();
  const [profile, setProfileState] = useState<LearningProfile | null>(readProfile);
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!user || syncedFor.current === user.id) return;
    syncedFor.current = user.id;
    let cancelled = false;

    void (async () => {
      const cloud = await fetchCloudProfile(user.id);
      if (cancelled) return;
      const local = readProfile();

      // Sem perfil na nuvem: este aparelho publica o que tem.
      if (!cloud) {
        if (local) void pushCloudProfile(user.id, local);
        return;
      }

      // Com os dois, vence o mais recente (o onboarding carimba createdAt).
      const cloudIsNewer = !local || Date.parse(cloud.createdAt) > Date.parse(local.createdAt);
      if (cloudIsNewer) {
        writeJson(STORAGE_KEY, cloud);
        setProfileState(cloud);
      } else if (local) {
        void pushCloudProfile(user.id, local);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const setProfile = useCallback(
    (next: LearningProfile) => {
      writeJson(STORAGE_KEY, next);
      setProfileState(next);
      if (user) void pushCloudProfile(user.id, next);
    },
    [user],
  );

  const clearProfile = useCallback(() => {
    removeKey(STORAGE_KEY);
    setProfileState(null);
  }, []);

  const recommendedStart = useMemo(() => firstLessonFor(profile ?? DEFAULT_PROFILE), [profile]);

  return {
    profile,
    hasProfile: Boolean(profile),
    recommendedStart,
    setProfile,
    clearProfile,
  };
}
