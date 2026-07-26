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

// ── Link público ───────────────────────────────────────────────────────────
// O botão "Compartilhar" mandava `window.location.href`, que é rota protegida:
// quem recebia caía no login e nunca via o certificado. O laço viral do app
// morria exatamente no momento de orgulho do aluno. Agora ele aponta para uma
// página pública que se descreve inteira pela URL — sem id de conta, sem
// consulta ao banco. #revisao-lote10

const NAME_MAX = 60;

/** Nome pronto para virar segmento de URL (sem barras/#/? e sem espaço duplo). */
export function certificateNameSlug(name: string): string {
  const clean = name
    .replace(/[\\/#?%]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, NAME_MAX);
  return clean.replace(/ /g, "-");
}

/** Caminho da página pública. `dateKey` é "AAAA-MM-DD" (opcional). */
export function certificatePath(courseId: string, name: string, dateKey?: string | null): string {
  const slug = encodeURIComponent(certificateNameSlug(name) || "Estudante-CodeTier");
  const query = dateKey && /^\d{4}-\d{2}-\d{2}$/.test(dateKey) ? `?d=${dateKey}` : "";
  return `/c/${encodeURIComponent(courseId)}/${slug}${query}`;
}

/** Desfaz o slug para exibição ("Maria-Silva" → "Maria Silva"). */
export function certificateNameFromSlug(slug: string | undefined): string {
  const name = (slug ?? "").replace(/-/g, " ").replace(/\s+/g, " ").trim().slice(0, NAME_MAX);
  return name || "Estudante CodeTier";
}

/** Chave "AAAA-MM-DD" no fuso local (a data que vai no link). */
export function toCertificateDateKey(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
