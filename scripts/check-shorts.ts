/**
 * Confere remotion/shorts-data.json antes de gastar TTS e render.
 *
 *   npm run shorts:check
 *
 * O que ele pega (e que só apareceria depois, no vídeo pronto):
 * - texto que não cabe na tela vertical (gancho, pontos, colunas de código);
 * - Short apontando para um curso que não existe no catálogo;
 * - narração longa demais para os 45s de um Short;
 * - palavra sem acento nas falas — que sai errada na legenda E na pronúncia.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

interface Short {
  id: string;
  courseId: string;
  lessonId: string;
  language: string;
  hook: string;
  concept: string;
  code: string;
  codeOutput: string;
  points: string[];
  cta: string;
  narration: Record<string, string>;
  platform: { title: string; description: string; hashtags: string[]; shortCaption: string };
  spokenWords?: number;
}

const shorts: Short[] = JSON.parse(readFileSync(join(root, "remotion", "shorts-data.json"), "utf8"));
const catalogSrc = readFileSync(join(root, "src", "data", "courseCatalog.ts"), "utf8");
const courseIds = new Set(Array.from(catalogSrc.matchAll(/id: "(\d+)"/g)).map((m) => m[1]));

// Palavras que o autor costuma escrever sem acento; na legenda queimada e no
// TTS a diferença aparece. A lista é curta de propósito: só o que já escapou.
const ACENTOS: Array<[RegExp, string]> = [
  [/\bnao\b/i, "não"],
  [/\bvoce\b/i, "você"],
  [/\be\b(?=\s+(bug|texto|isso)\b)/i, "é"],
  [/\bsao\b/i, "são"],
  [/\bentao\b/i, "então"],
  [/\bcopia\b/i, "cópia"],
  [/\btambem\b/i, "também"],
  [/\bformulario\b/i, "formulário"],
  [/\bexpressao\b/i, "expressão"],
  [/\bcondicao\b/i, "condição"],
  [/\bproprio\b/i, "próprio"],
  [/\bpropria\b/i, "própria"],
  [/\besta\b(?=\s+entre\b)/i, "está"],
  [/\busuario/i, "usuário"],
  [/\blicao\b/i, "lição"],
  [/\bcodigo\b/i, "código"],
  [/\bpratica\b/i, "prática"],
  [/\bnumero\b/i, "número"],
  [/\bvariavel\b/i, "variável"],
  [/\bsera\b/i, "será"],
  [/\bja\b(?=\s)/i, "já"],
];

const problems: string[] = [];
const warn: string[] = [];
const seen = new Set<string>();

shorts.forEach((s, index) => {
  const where = `#${index + 1} ${s.id}`;
  if (seen.has(s.id)) problems.push(`${where}: id repetido`);
  seen.add(s.id);
  if (!/^[a-z0-9-]+$/.test(s.id)) problems.push(`${where}: id deve ser kebab-case`);
  if (!courseIds.has(s.courseId)) problems.push(`${where}: curso ${s.courseId} não existe no catálogo`);
  if (!new RegExp(`^${s.courseId}-\\d+$`).test(s.lessonId)) {
    warn.push(`${where}: lição ${s.lessonId} não parece ser do curso ${s.courseId}`);
  }

  if (s.hook.length > 54) problems.push(`${where}: gancho com ${s.hook.length} caracteres (máx 54)`);
  if (s.concept.length > 150) problems.push(`${where}: conceito com ${s.concept.length} caracteres (máx 150)`);
  if (s.cta.length > 60) problems.push(`${where}: CTA com ${s.cta.length} caracteres (máx 60)`);

  if (s.points.length < 2 || s.points.length > 3) problems.push(`${where}: ${s.points.length} pontos (esperado 2 ou 3)`);
  s.points.forEach((p) => {
    if (p.length > 42) problems.push(`${where}: ponto com ${p.length} caracteres (máx 42): "${p}"`);
  });

  const lines = s.code.split("\n");
  if (lines.length > 8) problems.push(`${where}: código com ${lines.length} linhas (máx 8)`);
  lines.forEach((line, i) => {
    if (line.length > 32) problems.push(`${where}: linha ${i + 1} com ${line.length} colunas (máx 32)`);
  });
  if (!s.codeOutput.trim()) warn.push(`${where}: sem saída — a cena de código perde o desfecho`);

  const spoken = Object.values(s.narration ?? {}).join(" ");
  const words = spoken.split(/\s+/).filter(Boolean).length;
  if (words < 70) warn.push(`${where}: só ${words} palavras faladas (curto demais para prender)`);
  if (words > 110) problems.push(`${where}: ${words} palavras faladas — passa dos 45s`);
  if (!/code tier ponto vercel ponto app/i.test(s.narration?.outro ?? "")) {
    warn.push(`${where}: o fecho não fala o domínio de forma falável`);
  }

  const textos: Array<[string, string]> = [
    ["hook", s.hook],
    ["concept", s.concept],
    ["cta", s.cta],
    ...s.points.map((p, i): [string, string] => [`points[${i}]`, p]),
    ...Object.entries(s.narration ?? {}).map(([k, v]): [string, string] => [`narration.${k}`, v]),
    ["platform.title", s.platform?.title ?? ""],
    ["platform.description", s.platform?.description ?? ""],
    ["platform.shortCaption", s.platform?.shortCaption ?? ""],
  ];
  textos.forEach(([campo, texto]) => {
    ACENTOS.forEach(([pattern, correto]) => {
      if (pattern.test(texto)) problems.push(`${where}: ${campo} tem "${pattern.source}" sem acento (deveria ser "${correto}")`);
    });
    if (/\p{Extended_Pictographic}/u.test(texto) && campo.startsWith("narration")) {
      problems.push(`${where}: ${campo} tem emoji — o TTS lê ou engasga`);
    }
  });

  if (s.platform?.hashtags?.some((h) => h.startsWith("#"))) {
    warn.push(`${where}: hashtags não devem incluir "#" (a copy adiciona)`);
  }
});

warn.forEach((w) => console.log(`⚠  ${w}`));
if (problems.length) {
  problems.forEach((p) => console.log(`✗  ${p}`));
  console.log(`\n${problems.length} problema(s) em ${shorts.length} Shorts.`);
  process.exit(1);
}
console.log(`✓ ${shorts.length} Shorts dentro das regras${warn.length ? ` (${warn.length} aviso[s])` : ""}.`);
