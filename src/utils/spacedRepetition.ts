// Spaced repetition scheduling (SM-2 variant) for lesson recall.
// Additive layer: persists a per-lesson review schedule in localStorage and
// surfaces which lessons are "due" today. Does not replace the reactive
// daily-review scoring — it feeds into it.

import { readJson, writeJson, STORAGE_KEYS } from "@/lib/storage";

export interface ReviewSchedule {
  lessonId: string;
  repetitions: number;
  intervalDays: number;
  ease: number;
  dueDate: string; // local yyyy-mm-dd
  lastReviewed: string; // local yyyy-mm-dd
}

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

function loadAll(): Record<string, ReviewSchedule> {
  return readJson<Record<string, ReviewSchedule>>(STORAGE_KEYS.reviewSchedule, {});
}

function saveAll(map: Record<string, ReviewSchedule>) {
  writeJson(STORAGE_KEYS.reviewSchedule, map);
}

export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// Pure SM-2 step. quality 0–5: <3 means the recall failed.
export function nextSchedule(
  prev: ReviewSchedule | undefined,
  quality: number,
  now = new Date(),
): ReviewSchedule {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  const prevEase = prev?.ease ?? DEFAULT_EASE;
  const prevReps = prev?.repetitions ?? 0;
  const prevInterval = prev?.intervalDays ?? 0;

  let repetitions: number;
  let intervalDays: number;

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions = prevReps + 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.max(1, Math.round(prevInterval * prevEase));
  }

  const ease = Math.max(MIN_EASE, prevEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  return {
    lessonId: prev?.lessonId ?? "",
    repetitions,
    intervalDays,
    ease: Number(ease.toFixed(2)),
    dueDate: dateKey(addDays(now, intervalDays)),
    lastReviewed: dateKey(now),
  };
}

// Record a recall event for a lesson and persist its next schedule.
export function recordReview(lessonId: string, quality: number, now = new Date()): ReviewSchedule {
  const all = loadAll();
  const updated: ReviewSchedule = { ...nextSchedule(all[lessonId], quality, now), lessonId };
  all[lessonId] = updated;
  saveAll(all);
  return updated;
}

export function getSchedule(lessonId: string): ReviewSchedule | undefined {
  return loadAll()[lessonId];
}

export function getDueLessonIds(now = new Date()): string[] {
  const today = dateKey(now);
  return Object.values(loadAll())
    .filter((schedule) => schedule.dueDate <= today)
    .map((schedule) => schedule.lessonId);
}

export function getDueCount(now = new Date()): number {
  return getDueLessonIds(now).length;
}
