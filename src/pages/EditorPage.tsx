import { useEffect, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAugmentedLesson } from "@/hooks/useAugmentedCourse";
import LessonView from "@/components/lesson/LessonView";
import { useEntitlement } from "@/contexts/EntitlementContext";
import { useProgress } from "@/hooks/useProgress";
import { MONETIZATION } from "@/config/monetization";
import { isDailyLimitReached, isLessonLocked } from "@/utils/entitlement";
import { toLocalDateKey } from "@/utils/studyStats";
import { track } from "@/lib/analytics";

const EditorPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { isPro, ready } = useEntitlement();
  const { lessonCompletedAt } = useProgress();
  const { data: augmented, loading } = useAugmentedLesson(courseId, lessonId);

  // Paywall (freemium "Equilibrado") — só atua com o flag ligado e usuário grátis.
  // A barreira acontece AQUI: quem é mandado para /pro já perdeu a aula, então é
  // aqui (e não lá) que dá para saber o que barrou e onde. #medir
  const gate = useMemo(() => {
    const lesson = augmented?.lesson;
    const course = augmented?.course;
    // Checkpoint sai antes por outra rota — não é barrado aqui (nem contado).
    if (!ready || !lesson || !course || lesson.kind === "checkpoint") return null;

    if (
      isLessonLocked({
        enabled: MONETIZATION.enabled,
        isPro,
        lessons: course.lessons,
        lessonId: lesson.id,
        freeModuleCount: MONETIZATION.freeModuleCount,
      })
    ) {
      return {
        to: "/pro",
        event: "paywall_blocked",
        props: { reason: "locked_module", courseId: course.id, lessonId: lesson.id },
      };
    }

    if (
      isDailyLimitReached({
        enabled: MONETIZATION.enabled,
        isPro,
        lessonCompletedAt,
        todayKey: toLocalDateKey(new Date()),
        lessonId: lesson.id,
        limit: MONETIZATION.freeDailyLessons,
      })
    ) {
      return {
        to: "/pro?reason=daily",
        event: "daily_limit_reached",
        props: { courseId: course.id, lessonId: lesson.id, limit: MONETIZATION.freeDailyLessons },
      };
    }

    return null;
  }, [augmented, ready, isPro, lessonCompletedAt]);

  useEffect(() => {
    if (gate) track(gate.event, gate.props);
  }, [gate]);

  // O conteúdo do curso chega sob demanda (#peso-5).
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-busy="true">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="sr-only">Carregando a aula…</span>
      </div>
    );
  }

  // Checkpoint lessons live on a dedicated route
  if (augmented?.lesson.kind === "checkpoint") {
    return <Navigate to={`/checkpoint/${courseId}/${lessonId}`} replace />;
  }
  if (!augmented?.lesson || !augmented?.course) return <Navigate to="/cursos" replace />;

  if (gate) return <Navigate to={gate.to} replace />;

  const { lesson, course } = augmented;
  const lessonIndex = augmented.lessonIndex ?? 0;

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
