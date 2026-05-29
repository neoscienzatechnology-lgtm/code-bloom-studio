import { useCallback, useEffect, useState } from "react";
import type { ErrorKind } from "@/utils/codeValidator";

const STORAGE_KEY = "code-bloom-studio-attempts";

interface AttemptStats {
  /** failed attempts per lessonId in current session */
  attempts: Record<string, number>;
  /** lifetime count of each error kind across lessons */
  errorHistory: Record<ErrorKind, number>;
  /** per-concept error-kind histogram, for personalized weakness signals */
  conceptErrorHistory: Record<string, Partial<Record<ErrorKind, number>>>;
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
  conceptErrorHistory: {},
};

function load(): AttemptStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultStats,
        ...parsed,
        errorHistory: { ...defaultStats.errorHistory, ...parsed.errorHistory },
        conceptErrorHistory: { ...defaultStats.conceptErrorHistory, ...(parsed.conceptErrorHistory ?? {}) },
      };
    }
  } catch {
    return defaultStats;
  }
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

  const registerFailure = useCallback(
    (lessonId: string, kind: ErrorKind = "unknown", conceptIds: string[] = []) => {
      setStats((prev) => {
        const nextConceptErrors = { ...prev.conceptErrorHistory };
        for (const conceptId of conceptIds) {
          const previous = nextConceptErrors[conceptId] ?? {};
          nextConceptErrors[conceptId] = { ...previous, [kind]: (previous[kind] ?? 0) + 1 };
        }
        return {
          attempts: { ...prev.attempts, [lessonId]: (prev.attempts[lessonId] || 0) + 1 },
          errorHistory: { ...prev.errorHistory, [kind]: prev.errorHistory[kind] + 1 },
          conceptErrorHistory: nextConceptErrors,
        };
      });
    },
    [],
  );

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

  /** Top error kinds for a specific concept, ranked by frequency. */
  const topErrorsByConcept = useCallback(
    (conceptId: string): ErrorKind[] => {
      const histogram = stats.conceptErrorHistory[conceptId];
      if (!histogram) return [];
      return (Object.entries(histogram) as [ErrorKind, number][])
        .filter(([, count]) => count > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([kind]) => kind);
    },
    [stats.conceptErrorHistory],
  );

  return {
    registerFailure,
    resetLesson,
    getAttempts,
    topErrors,
    topErrorsByConcept,
    attempts: stats.attempts,
    conceptErrorHistory: stats.conceptErrorHistory,
  };
}
