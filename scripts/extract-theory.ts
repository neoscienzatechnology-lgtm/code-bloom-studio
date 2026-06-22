/**
 * Extrai a teoria de TODAS as lições do catálogo real (src/data) e gera um
 * manifesto (remotion/theory-data.json) que alimenta os vídeos do Remotion.
 * Rode: npm run video:extract
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { courses } from "../src/data/mockData";
import type { Lesson } from "../src/data/mockData";
import type { TheoryProps } from "../remotion/TheoryVideo";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

type Entry = TheoryProps & { courseId: string; lessonId: string; key: string };

// remove só ênfase markdown (negrito/itálico/código) — preserva _ (snake_case),
// # (comentário Python) e > (operadores), que têm significado no texto.
const stripMd = (s: string) =>
  (s ?? "")
    .replace(/`/g, "")
    .replace(/\*+/g, "")
    .replace(/\s+/g, " ")
    .trim();

// pega a introdução da teoria: remove o título markdown (# ...) e corta na
// próxima seção (outro heading ou os rótulos do makeLesson)
function theoryIntro(theory: string): string {
  if (!theory) return "";
  let t = theory.trim().replace(/^#{1,6}\s+[^\n]*\n+/, "");
  t = t.split(/\n#{1,6}\s|\n\n(?:Exemplo pr[aá]tico|Erro comum|Refer[eê]ncia)/i)[0];
  return t.trim();
}

// frase limpa e curta do "o que acontece": objetivo de aprendizado é o ideal
function pickConcept(lesson: Lesson): string {
  const base = lesson.learningObjective || lesson.summary || theoryIntro(lesson.theory) || lesson.description || "";
  const clean = stripMd(base);
  return clean.length > 300 ? clean.slice(0, 297).trimEnd() + "…" : clean;
}

// usa a SOLUÇÃO (par casado com expectedOutput pela regra do app), com fallback
function pickCode(lesson: Lesson): string {
  return (lesson.solution || lesson.codeExample || lesson.example || "").trim();
}

// markup/JSX/CSS não produzem saída de stdout
function looksMarkupOrJsx(code: string): boolean {
  if (!code) return false;
  if (/<[A-Za-z][^>]*>/.test(code)) return true; // <div>, <View>, <Text>
  if (/return\s*\(?\s*</.test(code)) return true; // return <...
  if (/from\s+["']react/.test(code)) return true; // import ... from "react..."
  if (/[.#][\w-]+\s*\{[^}]*:[^}]*\}/.test(code)) return true; // regra CSS
  return false;
}

// só mostra o bloco "// saída" para linguagens que realmente imprimem algo
function hasStdout(language: string, code: string): boolean {
  const lang = (language || "").toLowerCase();
  if (/react|html|css/.test(lang)) return false; // React, React Native, HTML, CSS
  return !looksMarkupOrJsx(code);
}

function pickPoints(lesson: Lesson, concept: string): string[] {
  // limpa bullets boilerplate que repetem o conceito/o código
  const ref = (lesson.reference ?? [])
    .filter(Boolean)
    .map(stripMd)
    .filter((r) => r && r !== concept && !/^objetivo:/i.test(r) && !/^exemplo-?base:/i.test(r));
  if (ref.length >= 2) return ref.slice(0, 4);
  // fallback quando a referência é fraca/ausente
  const alt = [lesson.summary, lesson.commonMistake, lesson.nextStep]
    .filter(Boolean)
    .map((x) => stripMd(x as string))
    .filter((x) => x && x !== concept);
  return [...ref, ...alt].slice(0, 4);
}

const entries: Entry[] = [];
for (const course of courses) {
  for (const lesson of course.lessons) {
    if ((lesson.id || "").endsWith("-quiz")) continue;
    const concept = pickConcept(lesson);
    if (!concept) continue; // sem teoria suficiente para um vídeo
    const code = pickCode(lesson);
    const codeOutput = hasStdout(course.language, code) ? (lesson.expectedOutput || "").trim() : "";
    entries.push({
      courseId: course.id,
      lessonId: lesson.id,
      key: `${course.id}__${lesson.id}`,
      module: lesson.module || course.title,
      title: lesson.title,
      concept,
      analogy: stripMd(lesson.analogy || ""),
      code,
      codeOutput,
      points: pickPoints(lesson, concept),
      cta: `Continue na trilha de ${course.language || course.title}`,
    });
  }
}

mkdirSync(join(root, "remotion"), { recursive: true });
writeFileSync(join(root, "remotion", "theory-data.json"), JSON.stringify(entries, null, 2), "utf8");

// índice (committed) das lições que possuem vídeo de teoria — o app usa para
// decidir quando exibir o card "Teoria em vídeo".
const keys = entries.map((e) => e.key).sort();
const indexTs = `// GERADO por scripts/extract-theory.ts — NÃO edite à mão (rode: npm run video:extract).
// Lições que possuem vídeo de teoria (Remotion). Veja docs/videos-teoria.md.
export const THEORY_VIDEO_KEYS: readonly string[] = [
${keys.map((k) => `  "${k}",`).join("\n")}
];
`;
writeFileSync(join(root, "src", "data", "theoryVideoIndex.ts"), indexTs, "utf8");

const byCourse = entries.reduce<Record<string, number>>((acc, e) => {
  acc[e.courseId] = (acc[e.courseId] ?? 0) + 1;
  return acc;
}, {});
console.log(`Extraídas ${entries.length} lições de ${courses.length} cursos.`);
console.log("Por curso:", byCourse);
