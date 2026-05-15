const XP_PER_LEVEL = 600;

export interface StudyStatsInput {
  totalXp: number;
  completedLessons: string[];
  activityDates?: string[];
  today?: Date;
}

export interface WeeklyActivityDay {
  date: string;
  label: string;
  active: boolean;
  isToday: boolean;
}

export interface StudyStats {
  totalXp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  currentStreak: number;
  studiedToday: boolean;
  activeDays: number;
  completedCount: number;
  weeklyActivity: WeeklyActivityDay[];
  lastStudyDate: string | null;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const copy = startOfLocalDay(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dedupeDateKeys(dates: string[] | undefined): string[] {
  return Array.from(new Set((dates ?? []).filter(Boolean))).sort();
}

function calculateStreak(dateSet: Set<string>, today: Date): number {
  const todayKey = toLocalDateKey(today);
  const yesterdayKey = toLocalDateKey(addDays(today, -1));
  let cursor = dateSet.has(todayKey) ? startOfLocalDay(today) : dateSet.has(yesterdayKey) ? addDays(today, -1) : null;
  let streak = 0;

  while (cursor && dateSet.has(toLocalDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function buildStudyStats({
  totalXp,
  completedLessons,
  activityDates,
  today = new Date(),
}: StudyStatsInput): StudyStats {
  const dates = dedupeDateKeys(activityDates);
  const dateSet = new Set(dates);
  const todayKey = toLocalDateKey(today);
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = totalXp % XP_PER_LEVEL;

  const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
    const day = addDays(today, index - 6);
    const date = toLocalDateKey(day);
    return {
      date,
      label: day.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      active: dateSet.has(date),
      isToday: date === todayKey,
    };
  });

  return {
    totalXp,
    level,
    xpIntoLevel,
    xpForNextLevel: XP_PER_LEVEL,
    currentStreak: calculateStreak(dateSet, today),
    studiedToday: dateSet.has(todayKey),
    activeDays: dates.length,
    completedCount: completedLessons.length,
    weeklyActivity,
    lastStudyDate: dates.at(-1) ?? null,
  };
}
