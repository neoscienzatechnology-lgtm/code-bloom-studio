import type { Lesson } from "@/data/mockData";

const LEVEL_MULTIPLIER: Record<NonNullable<Lesson["level"]>, number> = {
  Iniciante: 1,
  "Intermediário": 1.25,
  "Avançado": 1.5,
};

// Scales the lesson's base XP by its difficulty level so harder lessons reward
// more than equally-priced beginner ones. Returns base XP if the level is missing.
export function calibrateXp(baseXp: number, level: Lesson["level"]): number {
  if (!level) return baseXp;
  return Math.round(baseXp * LEVEL_MULTIPLIER[level]);
}
