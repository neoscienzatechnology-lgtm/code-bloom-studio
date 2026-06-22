import { useParams, Navigate } from "react-router-dom";
import { getLessonById } from "@/data/mockData";
import { getAugmentedLessonById } from "@/data/checkpoints";
import LessonView from "@/components/lesson/LessonView";
import { useEntitlement } from "@/contexts/EntitlementContext";
import { useProgress } from "@/hooks/useProgress";
import { MONETIZATION } from "@/config/monetization";
import { isDailyLimitReached, isLessonLocked } from "@/utils/entitlement";
import { toLocalDateKey } from "@/utils/studyStats";

const EditorPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { isPro, ready } = useEntitlement();
  const { lessonCompletedAt } = useProgress();
  const augmented = getAugmentedLessonById(courseId || "", lessonId || "");
  const data = getLessonById(courseId || "", lessonId || "");

  // Checkpoint lessons live on a dedicated route
  if (augmented?.lesson.kind === "checkpoint") {
    return <Navigate to={`/checkpoint/${courseId}/${lessonId}`} replace />;
  }
  if (!data?.lesson || !data?.course) return <Navigate to="/cursos" replace />;

  const { lesson, course } = data;
  const lessonIndex = data.lessonIndex ?? 0;

  // Paywall (freemium "Equilibrado") — só atua com o flag ligado e usuário grátis.
  if (
    ready &&
    isLessonLocked({
      enabled: MONETIZATION.enabled,
      isPro,
      lessons: course.lessons,
      lessonId: lesson.id,
      freeModuleCount: MONETIZATION.freeModuleCount,
    })
  ) {
    return <Navigate to="/pro" replace />;
  }
  if (
    ready &&
    isDailyLimitReached({
      enabled: MONETIZATION.enabled,
      isPro,
      lessonCompletedAt,
      todayKey: toLocalDateKey(new Date()),
      lessonId: lesson.id,
      limit: MONETIZATION.freeDailyLessons,
    })
  ) {
    return <Navigate to="/pro?reason=daily" replace />;
  }

  // Compute the next step from the augmented course (so checkpoints are inserted)
  const augCourse = augmented?.course ?? { lessons: [] as { id: string; kind: "lesson" | "checkpoint" }[] };
  const augIdx = augCourse.lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = augIdx >= 0 ? augCourse.lessons[augIdx + 1] : course.lessons[lessonIndex + 1];
  const nextHref = nextLesson
    ? "kind" in nextLesson && nextLesson.kind === "checkpoint"
      ? `/checkpoint/${course.id}/${nextLesson.id}`
      : `/editor/${course.id}/${nextLesson.id}`
    : `/cursos/${course.id}`;

  // key={lesson.id} remounts the view between lessons so every piece of
  // lesson-scoped state (code, stages, attempts UI, feedback) starts fresh.
  return (
    <LessonView
      key={lesson.id}
      course={course}
      lesson={lesson}
      lessonIndex={lessonIndex}
      nextHref={nextHref}
      hasNextLesson={Boolean(nextLesson)}
    />
  );
};

export default EditorPage;
