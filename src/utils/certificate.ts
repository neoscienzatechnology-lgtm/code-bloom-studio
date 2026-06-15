// Lógica pura do certificado de conclusão de trilha — sem React, testável.

/** A trilha está concluída? (todas as lições feitas) */
export function isCourseComplete(lessonIds: string[], completedLessons: string[]): boolean {
  if (lessonIds.length === 0) return false;
  const done = new Set(completedLessons);
  return lessonIds.every((id) => done.has(id));
}

/** Data de conclusão = a lição mais recente concluída da trilha (ou null). */
export function courseCompletionDate(
  lessonIds: string[],
  lessonCompletedAt: Record<string, string>,
): Date | null {
  const times = lessonIds
    .map((id) => lessonCompletedAt[id])
    .filter(Boolean)
    .map((iso) => new Date(iso).getTime())
    .filter((time) => !Number.isNaN(time));
  if (times.length === 0) return null;
  return new Date(Math.max(...times));
}

export function formatCertificateDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
