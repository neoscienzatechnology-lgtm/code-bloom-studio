/**
 * Gera `src/data/lessonIndex.ts`: os ids de aula por curso, num arquivo leve.
 *   npm run lesson:index
 *
 * Por que existe: telas que só precisam do PROGRESSO de um curso (a vitrine
 * `/cursos`, por exemplo) precisavam importar `courses` — e isso arrasta os 5
 * arquivos de conteúdo (~523 KB no bundle) para uma rota pública que só mostra
 * títulos e barras de progresso. Com o índice, a vitrine fica leve.
 *
 * O arquivo é versionado e um teste garante que ele bate com o conteúdo real.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { courses } from "../src/data/mockData";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const DEFAULT_MINUTES = 6;

const entries = courses
  .map((course) => {
    const ids = course.lessons.map((lesson) => `"${lesson.id}"`).join(", ");
    const minutes = course.lessons.reduce((total, lesson) => total + (lesson.estimatedMinutes ?? DEFAULT_MINUTES), 0);
    return `  "${course.id}": { minutes: ${minutes}, lessonIds: [${ids}] },`;
  })
  .join("\n");

const file = `// GERADO por \`npm run lesson:index\` — não edite à mão.
//
// Ids de aula e minutos por curso, para telas que só precisam de progresso e
// duração sem carregar o conteúdo inteiro dos cursos (ver
// scripts/gen-lesson-index.ts). O teste "índice de aulas" mantém este arquivo
// em dia com o catálogo real.

export interface CourseIndexEntry {
  minutes: number;
  lessonIds: readonly string[];
}

export const COURSE_INDEX: Record<string, CourseIndexEntry> = {
${entries}
};

export function lessonIdsOf(courseId: string): readonly string[] {
  return COURSE_INDEX[courseId]?.lessonIds ?? [];
}

export function courseMinutesOf(courseId: string): number {
  return COURSE_INDEX[courseId]?.minutes ?? 0;
}
`;

writeFileSync(join(root, "src", "data", "lessonIndex.ts"), file, "utf8");
console.log(`lessonIndex.ts gerado: ${courses.length} cursos, ${courses.reduce((total, course) => total + course.lessons.length, 0)} aulas`);
