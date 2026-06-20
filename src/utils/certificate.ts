// Lógica pura do certificado de conclusão de trilha — sem React, testável.

/** A trilha está concluída? (todas as lições feitas) */
export function isCourseComplete(lessonIds: string[], completedLessons: string[]): boolean {
  if (lessonIds.length === 0) return false;
  const done = new Set(completedLessons);
  return lessonIds.every((id) => done.has(id));
}

/** Faz parse de uma data salva como "YYYY-MM-DD" no fuso LOCAL (e não UTC, que
 * em fusos negativos como o do Brasil cairia no dia anterior). Aceita também
 * timestamps ISO completos. */
function parseLocal(value: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).getTime();
  return new Date(value).getTime();
}

/** Data de conclusão = a lição mais recente concluída da trilha (ou null). */
export function courseCompletionDate(
  lessonIds: string[],
  lessonCompletedAt: Record<string, string>,
): Date | null {
  const times = lessonIds
    .map((id) => lessonCompletedAt[id])
    .filter(Boolean)
    .map((iso) => parseLocal(iso))
    .filter((time) => !Number.isNaN(time));
  if (times.length === 0) return null;
  return new Date(Math.max(...times));
}

export function formatCertificateDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
