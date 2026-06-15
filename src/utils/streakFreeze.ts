// "Protetor de ofensiva" (streak freeze): um escudo que cobre um dia perdido
// para a ofensiva não zerar. Determinístico e idempotente — recalcular sobre o
// mesmo estado não muda nada.
//
// Regras:
// - Ganha 1 protetor a cada 5 dias de ofensiva (no máximo MAX_FREEZES guardados).
// - Ao abrir o app, se houver buraco entre o último dia estudado e hoje e
//   houver protetores suficientes para cobrir TODOS os dias perdidos, eles são
//   gastos e a ofensiva é preservada. Se não der para cobrir tudo, não gasta
//   (não adianta queimar protetor numa ofensiva já perdida).

import { toLocalDateKey } from "@/utils/studyStats";

export interface FreezeState {
  available: number;
  frozenDates: string[];
  grantedBlocks: number;
}

export const MAX_FREEZES = 2;
const STREAK_PER_FREEZE = 5;

export const DEFAULT_FREEZE_STATE: FreezeState = { available: 0, frozenDates: [], grantedBlocks: 0 };

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const copy = startOfDay(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function walkStreak(active: Set<string>, today: Date): number {
  const todayKey = toLocalDateKey(today);
  const yesterdayKey = toLocalDateKey(addDays(today, -1));
  let cursor = active.has(todayKey)
    ? startOfDay(today)
    : active.has(yesterdayKey)
      ? addDays(today, -1)
      : null;
  let streak = 0;
  while (cursor && active.has(toLocalDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export interface ResolvedFreezes {
  state: FreezeState;
  effectiveDates: string[];
  streak: number;
}

export function resolveStreakFreezes(realDates: string[], state: FreezeState, today: Date): ResolvedFreezes {
  const realSet = new Set(realDates);
  const frozenSet = new Set(state.frozenDates);
  let available = state.available;
  const newlyFrozen: string[] = [];

  // Último dia REAL <= hoje (janela de 60 dias).
  let lastReal: Date | null = null;
  for (let i = 0; i <= 60; i += 1) {
    const day = addDays(today, -i);
    if (realSet.has(toLocalDateKey(day))) {
      lastReal = day;
      break;
    }
  }

  if (lastReal) {
    const missed: string[] = [];
    for (let day = addDays(lastReal, 1); day < startOfDay(today); day = addDays(day, 1)) {
      const key = toLocalDateKey(day);
      if (!realSet.has(key) && !frozenSet.has(key)) missed.push(key);
    }
    if (missed.length > 0 && missed.length <= available) {
      available -= missed.length;
      newlyFrozen.push(...missed);
    }
  }

  const allFrozen = [...state.frozenDates, ...newlyFrozen];
  const active = new Set([...realDates, ...allFrozen]);
  const effectiveDates = Array.from(active).sort();
  const streak = walkStreak(active, today);

  // Concede protetores pelos marcos da ofensiva atual (reseta junto com ela).
  const earnedBlocks = Math.floor(streak / STREAK_PER_FREEZE);
  if (earnedBlocks > state.grantedBlocks) {
    available = Math.min(MAX_FREEZES, available + (earnedBlocks - state.grantedBlocks));
  }

  return {
    state: { available, frozenDates: allFrozen, grantedBlocks: earnedBlocks },
    effectiveDates,
    streak,
  };
}

export function freezeStatesEqual(a: FreezeState, b: FreezeState): boolean {
  return (
    a.available === b.available &&
    a.grantedBlocks === b.grantedBlocks &&
    a.frozenDates.length === b.frozenDates.length &&
    a.frozenDates.every((date, index) => date === b.frozenDates[index])
  );
}
