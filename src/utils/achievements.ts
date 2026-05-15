export type AchievementRarity = "Comum" | "Raro" | "Épico" | "Lendário";

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  rarity: AchievementRarity;
  progress: number;
  target: number;
}

interface BuildAchievementsInput {
  completedLessons: string[];
  completedCoursesCount: number;
  totalXp: number;
  currentStreak: number;
}

function achievement(
  id: string,
  name: string,
  emoji: string,
  description: string,
  rarity: AchievementRarity,
  progress: number,
  target: number,
): Achievement {
  return {
    id,
    name,
    emoji,
    description,
    rarity,
    progress: Math.min(progress, target),
    target,
    unlocked: progress >= target,
  };
}

export function buildAchievements({
  completedLessons,
  completedCoursesCount,
  totalXp,
  currentStreak,
}: BuildAchievementsInput): Achievement[] {
  const completedCount = completedLessons.length;
  const hasProject = completedLessons.some((id) => id.startsWith("project-"));
  const hasDailyReview = completedLessons.some((id) => id.startsWith("daily-review-"));
  const hasConceptTraining = completedLessons.some((id) => id.startsWith("concept-training-"));
  const foundationLessons = completedLessons.filter((id) => /^10-\d+$/.test(id)).length;

  return [
    achievement(
      "first_lesson",
      "Primeira aula",
      "✨",
      "Conclua sua primeira aula real.",
      "Comum",
      completedCount,
      1,
    ),
    achievement(
      "foundation_start",
      "Base iniciada",
      "🧠",
      "Conclua 4 aulas de Fundamentos da Programação.",
      "Comum",
      foundationLessons,
      4,
    ),
    achievement(
      "daily_review",
      "Revisão feita",
      "🔁",
      "Complete uma revisão diária.",
      "Raro",
      hasDailyReview ? 1 : 0,
      1,
    ),
    achievement(
      "weak_point_training",
      "Ponto fraco treinado",
      "🎯",
      "Finalize um treino adaptativo de conceito.",
      "Raro",
      hasConceptTraining ? 1 : 0,
      1,
    ),
    achievement(
      "streak_3",
      "Ritmo de 3 dias",
      "🔥",
      "Estude em 3 dias seguidos.",
      "Raro",
      currentStreak,
      3,
    ),
    achievement(
      "first_project",
      "Primeiro projeto",
      "🛠️",
      "Conclua um projeto prático.",
      "Épico",
      hasProject ? 1 : 0,
      1,
    ),
    achievement(
      "xp_1000",
      "Mil XP",
      "⚡",
      "Acumule 1.000 XP reais no app.",
      "Épico",
      totalXp,
      1000,
    ),
    achievement(
      "course_complete",
      "Trilha concluída",
      "🏁",
      "Complete um curso inteiro.",
      "Lendário",
      completedCoursesCount,
      1,
    ),
  ];
}
