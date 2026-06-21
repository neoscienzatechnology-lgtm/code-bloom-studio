// Lógica PURA do freemium "Pro" (sem React, sem runtime) — testável.
//
// Fronteira "Equilibrado": os primeiros N módulos de cada curso são grátis;
// o resto exige Pro. Além disso, um usuário grátis conclui no máximo K lições
// por dia. Tudo é desligado quando `enabled` é false (flag global) ou quando o
// usuário é Pro.

const MODULE_DESC = "Aulas curtas com uma ideia principal, prática e feedback imediato.";

export interface LessonModuleGroup<T> {
  title: string;
  description: string;
  lessons: T[];
}

/**
 * Agrupa as lições em módulos — fonte ÚNICA de verdade do agrupamento, usada
 * tanto na exibição (CourseRoutePath) quanto no gating. Se alguma lição tem
 * `module`, agrupa por módulo (lições sem `module` herdam o anterior); senão
 * cai no fallback de três blocos.
 */
export function moduleGroups<T extends { id: string; module?: string }>(lessons: T[]): LessonModuleGroup<T>[] {
  if (lessons.some((lesson) => lesson.module)) {
    return lessons.reduce<LessonModuleGroup<T>[]>((groups, lesson) => {
      const last = groups[groups.length - 1];
      const title = lesson.module ?? last?.title ?? "Revisão";
      const current = last?.title === title ? last : { title, description: MODULE_DESC, lessons: [] as T[] };
      if (current !== last) groups.push(current);
      current.lessons.push(lesson);
      return groups;
    }, []);
  }

  const third = Math.max(3, Math.ceil(lessons.length / 3));
  return [
    { title: "Módulo 1: Fundamentos", description: "Conceitos essenciais em aulas curtas.", lessons: lessons.slice(0, third) },
    { title: "Módulo 2: Projeto Guiado", description: "Aplique os conceitos com mais contexto.", lessons: lessons.slice(third, third * 2) },
    { title: "Módulo 3: Desafio Final", description: "Revise, conecte ideias e prepare o projeto.", lessons: lessons.slice(third * 2) },
  ].filter((module) => module.lessons.length > 0);
}

/** Ids das lições que ficam atrás do paywall (a partir do (freeModuleCount+1)º módulo). */
export function proLessonIds<T extends { id: string; module?: string }>(
  lessons: T[],
  freeModuleCount: number,
): Set<string> {
  const locked = new Set<string>();
  moduleGroups(lessons)
    .slice(Math.max(0, freeModuleCount))
    .forEach((group) => group.lessons.forEach((lesson) => locked.add(lesson.id)));
  return locked;
}

export interface LessonLockOptions<T> {
  enabled: boolean;
  isPro: boolean;
  lessons: T[];
  lessonId: string;
  freeModuleCount: number;
}

/** A lição está bloqueada por ser Pro? (false se o gating está off ou o usuário é Pro). */
export function isLessonLocked<T extends { id: string; module?: string }>(opts: LessonLockOptions<T>): boolean {
  if (!opts.enabled || opts.isPro) return false;
  return proLessonIds(opts.lessons, opts.freeModuleCount).has(opts.lessonId);
}

/** Conta conclusões "de lição de verdade" numa data — ignora quiz e atividades avulsas. */
export function countLessonCompletionsOn(lessonCompletedAt: Record<string, string>, dateKey: string): number {
  return Object.entries(lessonCompletedAt).filter(([id, date]) => {
    if (date !== dateKey) return false;
    if (id.endsWith("-quiz")) return false;
    if (id.startsWith("daily-review-") || id.startsWith("concept-training-") || id.startsWith("__")) return false;
    return true;
  }).length;
}

export interface DailyLimitOptions {
  enabled: boolean;
  isPro: boolean;
  lessonCompletedAt: Record<string, string>;
  todayKey: string;
  lessonId: string;
  limit: number;
}

/** O usuário grátis já bateu o limite diário e está tentando abrir uma lição NOVA? */
export function isDailyLimitReached(opts: DailyLimitOptions): boolean {
  if (!opts.enabled || opts.isPro) return false;
  // Reabrir uma lição já concluída nunca é bloqueado.
  if (opts.lessonCompletedAt[opts.lessonId]) return false;
  return countLessonCompletionsOn(opts.lessonCompletedAt, opts.todayKey) >= opts.limit;
}
