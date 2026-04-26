import { useCallback, useEffect, useState } from "react";
import type { ErrorKind } from "@/utils/codeValidator";

const STORAGE_KEY = "codequest-attempts";

interface AttemptStats {
  /** failed attempts per lessonId in current session */
  attempts: Record<string, number>;
  /** lifetime count of each error kind across lessons */
  errorHistory: Record<ErrorKind, number>;
}

const defaultStats: AttemptStats = {
  attempts: {},
  errorHistory: {
    empty: 0,
    no_print: 0,
    case_or_punct: 0,
    wrong_quotes: 0,
    missing_keyword: 0,
    output_mismatch: 0,
    syntax: 0,
    unknown: 0,
  },
};

function load(): AttemptStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultStats, ...parsed, errorHistory: { ...defaultStats.errorHistory, ...parsed.errorHistory } };
    }
  } catch {}
  return defaultStats;
}

function save(stats: AttemptStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function useAttemptTracker() {
  const [stats, setStats] = useState<AttemptStats>(load);

  useEffect(() => {
    save(stats);
  }, [stats]);

  const registerFailure = useCallback((lessonId: string, kind: ErrorKind = "unknown") => {
    setStats((prev) => ({
      attempts: { ...prev.attempts, [lessonId]: (prev.attempts[lessonId] || 0) + 1 },
      errorHistory: { ...prev.errorHistory, [kind]: prev.errorHistory[kind] + 1 },
    }));
  }, []);

  const resetLesson = useCallback((lessonId: string) => {
    setStats((prev) => {
      const { [lessonId]: _, ...rest } = prev.attempts;
      return { ...prev, attempts: rest };
    });
  }, []);

  const getAttempts = useCallback((lessonId: string) => stats.attempts[lessonId] || 0, [stats.attempts]);

  /** Most repeated error kinds (top 3) — for future personalization */
  const topErrors = Object.entries(stats.errorHistory)
    .filter(([, n]) => n > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => k as ErrorKind);

  return { registerFailure, resetLesson, getAttempts, topErrors };
}
