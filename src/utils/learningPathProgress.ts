import type { LearningPath } from "@/data/learningPaths";
import type { Course, Lesson } from "@/data/mockData";

export type CourseWithProgress = Course & { realProgress: number };

export function getPathCourses(
  coursesWithProgress: CourseWithProgress[],
  path: LearningPath,
): CourseWithProgress[] {
  const pathCourseIds = path.steps
    .map((step) => step.courseId)
    .filter((courseId): courseId is string => Boolean(courseId));

  return pathCourseIds
    .map((courseId) => coursesWithProgress.find((course) => course.id === courseId))
    .filter((course): course is CourseWithProgress => Boolean(course));
}

export function selectNextPathCourse(
  coursesWithProgress: CourseWithProgress[],
  path: LearningPath,
): CourseWithProgress {
  const pathCourses = getPathCourses(coursesWithProgress, path);
  const nextNotCompletedPathCourse = pathCourses.find((course) => course.realProgress < 100);

  return nextNotCompletedPathCourse ?? pathCourses[pathCourses.length - 1] ?? coursesWithProgress[0];
}

export function selectNextLesson(course: CourseWithProgress, completedLessons: string[]): Lesson {
  return (
    course.lessons.find((lesson) => !completedLessons.includes(lesson.id)) ??
    course.lessons[course.lessons.length - 1]
  );
}
