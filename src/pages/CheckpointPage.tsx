import { motion, AnimatePresence } from "framer-motion";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Lightbulb, ShieldCheck, Target, Trophy } from "lucide-react";
import { getAugmentedLessonById } from "@/data/checkpoints";
import QuizSection from "@/components/QuizSection";
import GuidedPractice from "@/components/GuidedPractice";
import CoachGuide from "@/components/CoachGuide";
import CardIllustration from "@/components/lesson/CardIllustration";
import { track } from "@/lib/analytics";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import CourseCoverArt from "@/components/CourseCoverArt";

const PASS_RATIO = 0.7; // 70% to pass

type CheckpointStep = "intro" | "practice" | "quiz";

const CheckpointPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const data = getAugmentedLessonById(courseId || "", lessonId || "");
  const { completeLesson, isCompleted } = useProgress();
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);
  const [step, setStep] = useState<CheckpointStep>("intro");
  const [practiceDone, setPracticeDone] = useState(false);
  const completionHandledRef = useRef(false);

  const hasPractice = Boolean(data?.lesson?.practiceActivities?.length);
  const steps = useMemo<CheckpointStep[]>(
    () => (hasPractice ? ["intro", "practice", "quiz"] : ["intro", "quiz"]),
    [hasPractice],
  );

  if (!data || !data.lesson || data.lesson.kind !== "checkpoint") {
    return <Navigate to="/cursos" replace />;
  }

  const { course, lesson, lessonIndex } = data;
  const questions = lesson.quiz ?? [];
  const alreadyDone = isCompleted(lesson.id);
  const nextLesson = course.lessons[lessonIndex + 1];
  const requiredCorrect = Math.ceil(questions.length * PASS_RATIO);

  const stepIndex = steps.indexOf(step);
  const stepProgress = result ? 100 : ((stepIndex + 1) / (steps.length + 1)) * 100;

  const handleComplete = (correct: number) => {
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;

    const total = questions.length;
    setResult({ correct, total });
    const passed = correct / total >= PASS_RATIO;
    track("checkpoint_completed", { checkpointId: lesson.id, courseId: course.id, correct, total, passed });
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

  const goToNextStep = () => {
    const next = steps[stepIndex + 1];
    if (next) {
      setStep(next);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  };

  const passed = result ? result.correct / result.total >= PASS_RATIO : false;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-xl">
        {/* Top bar + progress */}
        <div className="mb-5 flex items-center gap-3">
          <Link
            to={`/cursos/${course.id}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </Link>
          <CourseCoverArt course={course} variant="thumb" className="h-9 w-12 shrink-0 rounded-lg" />
          <Progress
            value={stepProgress}
            className="h-2 flex-1 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent"
          />
          <span className="text-xs font-bold text-muted-foreground">Checkpoint</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={result ? "result" : step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18 }}
          >
            {!result && step === "intro" && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                  <ShieldCheck size={13} /> Revisão obrigatória
                </div>
                <CardIllustration kind="checkpoint" />
                <h1 className="mb-2 text-xl font-black text-foreground">{lesson.title}</h1>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{lesson.description}</p>

                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 font-bold text-primary">
                    <Trophy size={12} /> +{lesson.xpReward} XP
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1 font-bold text-muted-foreground">
                    Acerte {requiredCorrect} de {questions.length} para passar
                  </span>
                  {alreadyDone && (
                    <span className="rounded-full bg-accent/15 px-3 py-1 font-bold text-primary">Já concluído</span>
                  )}
                </div>

                <CoachGuide state="thinking" variant="compact" />
              </div>
            )}

            {!result && step === "practice" && (
              <div>
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                  <Target size={13} /> Missão prática de revisão
                </div>
                <GuidedPractice lesson={lesson} onCompletionChange={setPracticeDone} />
              </div>
            )}

            {!result && step === "quiz" && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-quest-blue/10 px-3 py-1 text-xs font-black text-quest-blue">
                  <Lightbulb size={13} /> Quiz de passagem
                </div>
                <CardIllustration kind="quiz" />
                <QuizSection key={lesson.id} quizId={lesson.id} questions={questions} onComplete={handleComplete} />
              </div>
            )}

            {result && (
              <div
                className={`rounded-2xl border p-6 text-center ${
                  passed ? "border-accent/40 bg-accent/5" : "border-destructive/30 bg-destructive/5"
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
                    : `Você precisa acertar ao menos ${requiredCorrect} para avançar. Revise e tente de novo.`}
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
                          // Volta direto ao quiz: a missão prática já feita
                          // não precisa ser refeita a cada reprovação
                          completionHandledRef.current = false;
                          setResult(null);
                          setStep("quiz");
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
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {!result && step !== "quiz" && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {step === "practice" && !practiceDone && !alreadyDone ? "Complete a missão para continuar" : ""}
            </span>
            <Button
              onClick={goToNextStep}
              disabled={step === "practice" && !practiceDone && !alreadyDone}
              className="gap-2 rounded-full px-6 font-extrabold"
            >
              {step === "intro" ? "Começar" : "Ir para o quiz"} <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckpointPage;
