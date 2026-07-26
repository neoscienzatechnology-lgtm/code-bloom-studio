// GERADO por `npm run lesson:index` — não edite à mão.
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
  "10": { minutes: 182, lessonIds: ["10-1", "10-2", "10-3", "10-4", "10-5", "10-6", "10-7", "10-8", "10-9", "10-11", "10-10", "10-12", "10-13", "10-14", "10-15", "10-16", "10-17", "10-18", "10-19", "10-20", "10-21", "10-22", "10-23", "10-24"] },
  "1": { minutes: 210, lessonIds: ["1-1", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7", "1-8", "1-9", "1-10", "1-11", "1-12", "1-16", "1-13", "1-14", "1-15", "1-17", "1-18", "1-19", "1-20", "1-21", "1-22", "1-23", "1-24", "1-25", "1-26", "1-27", "1-28", "1-29", "1-30", "1-31", "1-32", "1-33", "1-34", "1-35"] },
  "2": { minutes: 124, lessonIds: ["2-1", "2-2", "2-3", "2-4", "2-5", "2-6", "2-20", "2-7", "2-8", "2-9", "2-19", "2-10", "2-11", "2-12", "2-13", "2-14", "2-15", "2-16", "2-17", "2-18"] },
  "9": { minutes: 82, lessonIds: ["9-1", "9-2", "9-3", "9-4", "9-5", "9-6", "9-7", "9-8", "9-9", "9-10", "9-11", "9-12", "9-13"] },
  "4": { minutes: 94, lessonIds: ["4-1", "4-2", "4-3", "4-4", "4-5", "4-6", "4-7", "4-8", "4-9", "4-10", "4-11", "4-12", "4-13", "4-14", "4-15"] },
  "3": { minutes: 77, lessonIds: ["3-1", "3-2", "3-3", "3-4", "3-5", "3-6", "3-7", "3-8", "3-9", "3-10", "3-11"] },
  "5": { minutes: 84, lessonIds: ["5-1", "5-2", "5-3", "5-4", "5-5", "5-6", "5-7", "5-8", "5-9", "5-10", "5-11", "5-12"] },
  "6": { minutes: 84, lessonIds: ["6-1", "6-2", "6-3", "6-4", "6-5", "6-6", "6-7", "6-8", "6-9", "6-10", "6-11", "6-12", "6-13", "6-14"] },
  "7": { minutes: 77, lessonIds: ["7-1", "7-2", "7-3", "7-4", "7-5", "7-6", "7-7", "7-8", "7-9", "7-10", "7-11"] },
  "8": { minutes: 80, lessonIds: ["8-1", "8-2", "8-3", "8-4", "8-5", "8-6", "8-7", "8-8", "8-9", "8-10"] },
  "11": { minutes: 72, lessonIds: ["11-1", "11-2", "11-3", "11-4", "11-5", "11-6", "11-7", "11-8"] },
  "12": { minutes: 74, lessonIds: ["12-1", "12-2", "12-3", "12-4", "12-5", "12-6", "12-7", "12-8"] },
  "13": { minutes: 68, lessonIds: ["13-1", "13-2", "13-3", "13-4", "13-5", "13-6", "13-7", "13-8"] },
};

export function lessonIdsOf(courseId: string): readonly string[] {
  return COURSE_INDEX[courseId]?.lessonIds ?? [];
}

export function courseMinutesOf(courseId: string): number {
  return COURSE_INDEX[courseId]?.minutes ?? 0;
}
