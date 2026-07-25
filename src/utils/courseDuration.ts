// Duração de curso DERIVADA do conteúdo real (soma de `estimatedMinutes` das
// aulas), em vez de uma string escrita à mão que envelhece e mente. Antes o
// catálogo anunciava "18h" para cursos que declaravam "4h". #revisao-1.4
import type { Course } from "@/data/mockData";

const DEFAULT_MINUTES_PER_LESSON = 6;

// Aceita tanto o curso puro quanto o "aumentado" (com checkpoints inseridos):
// os checkpoints são revisões, não aulas novas, então ficam de fora da conta
// para que /cursos e /cursos/:id mostrem o MESMO número.
type CountableCourse = { lessons: Array<{ estimatedMinutes?: number; kind?: string }> };

const realLessons = (course: CountableCourse) => course.lessons.filter((lesson) => lesson.kind !== "checkpoint");

export function courseMinutes(course: Course | CountableCourse): number {
  return realLessons(course).reduce(
    (total, lesson) => total + (lesson.estimatedMinutes ?? DEFAULT_MINUTES_PER_LESSON),
    0,
  );
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h${String(rest).padStart(2, "0")}`;
}

/** Ex.: "35 aulas · ~3h30" — o número de aulas é o que o aluno realmente recebe. */
export function formatCourseDuration(course: Course | CountableCourse): string {
  return `${realLessons(course).length} aulas · ~${formatMinutes(courseMinutes(course))}`;
}
