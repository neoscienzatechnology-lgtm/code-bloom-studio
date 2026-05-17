import { motion } from "framer-motion";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Trophy } from "lucide-react";
import { getAugmentedLessonById } from "@/data/checkpoints";
import QuizSection from "@/components/QuizSection";
import GuidedPractice from "@/components/GuidedPractice";
import AITutor from "@/components/AITutor";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import confetti from "canvas-confetti";
import CourseCoverArt from "@/components/CourseCoverArt";

const PASS_RATIO = 0.7; // 70% to pass

const CheckpointPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const data = getAugmentedLessonById(courseId || "", lessonId || "");
  const { completeLesson, isCompleted } = useProgress();
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);
  const completionHandledRef = useRef(false);

  if (!data || !data.lesson || data.lesson.kind !== "checkpoint") {
    return <Navigate to="/cursos" replace />;
  }

  const { course, lesson, lessonIndex } = data;
  const questions = lesson.quiz ?? [];
  const alreadyDone = isCompleted(lesson.id);
  const nextLesson = course.lessons[lessonIndex + 1];

  const handleComplete = (correct: number) => {
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;

    const total = questions.length;
    setResult({ correct, total });
    const passed = correct / total >= PASS_RATIO;
    if (passed && !alreadyDone) {
      const awardedXp = completeLesson(lesson.id, lesson.xpReward, course.id);
      if (awardedXp) {
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#0A7C78", "#7AD7A7", "#FF9F2F"],
        });
      }
    }
  };

  const passed = result ? result.correct / result.total >= PASS_RATIO : false;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Top bar */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to={`/cursos/${course.id}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </Link>
          <CourseCoverArt course={course} variant="thumb" className="h-10 w-14 rounded-lg" />
          <span className="text-xs font-bold text-muted-foreground">{course.title} · Checkpoint</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-6 sm:p-8"
        >
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <ShieldCheck size={28} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Revisão obrigatória
              </p>
              <h1 className="text-2xl font-black text-foreground sm:text-3xl">
                {lesson.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{lesson.description}</p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-accent">
              <Trophy size={14} /> +{lesson.xpReward} XP
            </span>
            <span className="text-muted-foreground">
              · {lesson.practiceActivities?.length ?? 0} missões práticas · {questions.length} perguntas · acerte {Math.ceil(questions.length * PASS_RATIO)} para passar
            </span>
            {alreadyDone && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 font-bold text-accent">
                Já concluído
              </span>
            )}
          </div>

          {!result && lesson.practiceActivities && lesson.practiceActivities.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 text-sm font-black text-primary">Missão prática de revisão</div>
              <GuidedPractice lesson={lesson} />
            </div>
          )}

          {!result && (
            <div>
              <div className="mb-3 text-sm font-black text-primary">Quiz de passagem</div>
              <QuizSection questions={questions} onComplete={handleComplete} />
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border p-6 text-center ${
                passed
                  ? "border-accent/40 bg-accent/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <div className="mb-2 text-5xl">{passed ? "🎯" : "📚"}</div>
              <h3 className="text-xl font-black text-foreground">
                {passed ? "Checkpoint concluído!" : "Quase lá!"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Você acertou {result.correct} de {result.total} (
                {Math.round((result.correct / result.total) * 100)}%).
              </p>
              <p className="mt-3 text-sm text-foreground">
                {passed
                  ? "Próximo bloco de lições liberado."
                  : `Você precisa acertar ao menos ${Math.ceil(
                      result.total * PASS_RATIO
                    )} para avançar. Revise e tente de novo.`}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {passed ? (
                  <Button
                    onClick={() =>
                      nextLesson
                        ? navigate(`/editor/${course.id}/${nextLesson.id}`)
                        : navigate(`/cursos/${course.id}`)
                    }
                    className="rounded-full bg-primary font-bold text-primary-foreground"
                  >
                    Continuar para próxima lição
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        completionHandledRef.current = false;
                        setResult(null);
                      }}
                      className="rounded-full"
                    >
                      Tentar novamente
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/cursos/${course.id}`)}
                      className="rounded-full"
                    >
                      Voltar ao curso
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AITutor
        contextId={lesson.id}
        lessonContext={{
          courseTitle: course.title,
          language: course.language,
          lessonTitle: `Checkpoint: ${lesson.title}`,
          description: `Revisão das últimas lições. Responda às ${questions.length} perguntas e acerte ao menos 70% para avançar.`,
        }}
      />
    </div>
  );
};

export default CheckpointPage;
