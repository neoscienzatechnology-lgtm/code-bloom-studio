// Central localStorage access for the app: one registry of keys and safe
// read/write helpers. localStorage can throw (private mode, quota, disabled
// storage in some WebViews), so every helper degrades to a no-op/fallback
// instead of crashing the caller — persistence here is always best-effort.

export const STORAGE_KEYS = {
  progress: "code-bloom-studio-progress",
  attempts: "code-bloom-studio-attempts",
  reviewSchedule: "code-bloom-studio-review-schedule",
  conceptMastery: "code-bloom-studio-concept-mastery",
  learningProfile: "code-bloom-studio-learning-profile",
  editorOnboarding: "code-bloom-studio_editor_onboarding_seen",
  ads: "code-bloom-studio-ads",
  reminder: "code-bloom-studio-reminder",
  oauthRedirect: "capycode:oauth-redirect",
  projectPrefix: "code-bloom-studio-project-",
  confidencePrefix: "capy-confidence-",
  selfExplainPrefix: "capy-explain-",
} as const;

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — persistence is best-effort */
  }
}

export function readString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — persistence is best-effort */
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
}
