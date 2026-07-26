import type { LearningPath } from "@/data/learningPaths";
import type { Course, Lesson } from "@/data/mockData";

export type CourseWithProgress = Course & { realProgress: number };

/** O mínimo que as funções de trilha realmente usam. Assim a vitrine pública
 * pode passar o catálogo leve (sem arrastar o conteúdo dos 13 cursos) e as
 * telas logadas continuam passando o curso inteiro. #peso-1 */
export type CourseProgressLike = { id: string; realProgress: number };

export function getPathCourses<T extends CourseProgressLike>(
  coursesWithProgress: T[],
  path: LearningPath,
): T[] {
  const pathCourseIds = path.steps
    .map((step) => step.courseId)
    .filter((courseId): courseId is string => Boolean(courseId));

  return pathCourseIds
    .map((courseId) => coursesWithProgress.find((course) => course.id === courseId))
    .filter((course): course is T => Boolean(course));
}

function getPathCourseIds(path: LearningPath): string[] {
  return path.steps
    .map((step) => step.courseId)
    .filter((courseId): courseId is string => Boolean(courseId));
}

export function getSharedPathCourseIds(paths: LearningPath[]): Set<string> {
  const occurrences = paths.reduce<Record<string, number>>((acc, path) => {
    getPathCourseIds(path).forEach((courseId) => {
      acc[courseId] = (acc[courseId] ?? 0) + 1;
    });
    return acc;
  }, {});

  return new Set(Object.entries(occurrences).filter(([, count]) => count > 1).map(([courseId]) => courseId));
}

export function calculatePathProgress<T extends CourseProgressLike>(
  coursesWithProgress: T[],
  path: LearningPath,
  allPaths: LearningPath[],
  activePathId?: string | null,
): number {
  const pathCourses = getPathCourses(coursesWithProgress, path);
  if (pathCourses.length === 0) return 0;

  const sharedCourseIds = getSharedPathCourseIds(allPaths);
  const isActivePath = activePathId === path.id;

  const progressValues = pathCourses.map((course) =>
    isActivePath || !sharedCourseIds.has(course.id) ? course.realProgress : 0,
  );

  return Math.round(progressValues.reduce((sum, value) => sum + value, 0) / pathCourses.length);
}

export function selectNextPathCourse<T extends CourseProgressLike>(
  coursesWithProgress: T[],
  path: LearningPath,
): T {
  const pathCourses = getPathCourses(coursesWithProgress, path);
  const nextNotCompletedPathCourse = pathCourses.find((course) => course.realProgress < 100);

  return nextNotCompletedPathCourse ?? pathCourses[pathCourses.length - 1] ?? coursesWithProgress[0];
}

export function selectPathStartCourse<T extends CourseProgressLike>(
  coursesWithProgress: T[],
  path: LearningPath,
  currentPathId?: string | null,
): T {
  const pathCourses = getPathCourses(coursesWithProgress, path);
  const firstIncomplete = pathCourses.find((course) => course.realProgress < 100);

  if (!firstIncomplete) return pathCourses[pathCourses.length - 1] ?? coursesWithProgress[0];

  const firstCourse = pathCourses[0];
  const switchingPath = Boolean(currentPathId && currentPathId !== path.id);
  const continuingSharedBase =
    switchingPath &&
    firstCourse?.id === firstIncomplete.id &&
    firstIncomplete.realProgress > 0 &&
    firstIncomplete.realProgress < 100;

  if (!continuingSharedBase) return firstIncomplete;

  return pathCourses.find((course, index) => index > 0 && course.realProgress < 100) ?? firstIncomplete;
}

export function selectNextLesson(course: CourseWithProgress, completedLessons: string[]): Lesson {
  return (
    course.lessons.find((lesson) => !completedLessons.includes(lesson.id)) ??
    course.lessons[course.lessons.length - 1]
  );
}
