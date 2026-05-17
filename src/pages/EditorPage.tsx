import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getLessonById } from "@/data/mockData";
import { getAugmentedLessonById } from "@/data/checkpoints";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Lightbulb,
  ChevronRight,
  Check,
  X,
  RotateCcw,
  ArrowLeft,
  Eye,
  EyeOff,
  Info,
  BookOpen,
  Code2,
  ListChecks,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import CodeEditor from "@/components/CodeEditor";
import TheoryRenderer from "@/components/TheoryRenderer";
import QuizSection from "@/components/QuizSection";
import PaceCoach from "@/components/PaceCoach";
import AITutor from "@/components/AITutor";
import LessonCoach from "@/components/LessonCoach";
import GuidedPractice from "@/components/GuidedPractice";
import MascoteCapivara, { type MascoteCapivaraState } from "@/components/MascoteCapivara";
import CourseCoverArt from "@/components/CourseCoverArt";
import { useProgress } from "@/hooks/useProgress";
import { useAttemptTracker } from "@/hooks/useAttemptTracker";
import { validateCode } from "@/utils/codeValidator";
import confetti from "canvas-confetti";

const ONBOARDING_KEY = "code-bloom-studio_editor_onboarding_seen";

type LessonStageKind = "plan" | "theory" | "quiz" | "practice" | "challenge" | "code";
type LessonStageId = "plan" | `theory-${number}` | "quiz" | "practice" | "challenge" | "code";

interface LessonStage {
  id: LessonStageId;
  kind: LessonStageKind;
  label: string;
  icon: typeof ListChecks;
  theoryIndex?: number;
}

function splitTheorySlides(theory: string): string[] {
  const blocks = theory
    .split(/\n(?=##\s+)/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.length > 0 ? blocks : [theory];
}

const EditorPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const augmented = getAugmentedLessonById(courseId || "", lessonId || "");
  const data = getLessonById(courseId || "", lessonId || "");
  const { completeLesson, saveCode, isCompleted, getSavedCode } = useProgress();
  const { registerFailure, resetLesson, getAttempts } = useAttemptTracker();

  const lesson = data?.lesson;
  const course = data?.course;
  const lessonIndex = data?.lessonIndex ?? 0;

  const savedCode = lesson ? getSavedCode(lesson.id) : undefined;
  const [code, setCode] = useState(savedCode ?? lesson?.starterCode ?? "");
  const [output, setOutput] = useState<string | null>(null);
  const [reflectiveQ, setReflectiveQ] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintIndex, setHintIndex] = useState(-1);
  const [showXP, setShowXP] = useState(false);
  const [running, setRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionWarned, setSolutionWarned] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [paceMode, setPaceMode] = useState<"struggling" | "thriving" | null>(null);
  const [bonusActive, setBonusActive] = useState(false);
  const [activeStage, setActiveStage] = useState<LessonStageId>("plan");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [stageNotice, setStageNotice] = useState<string | null>(null);
  const runLockedRef = useRef(false);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) setShowOnboarding(true);
  }, []);

  const dismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setShowOnboarding(false);
  };

  // Save code as user types (debounced)
  useEffect(() => {
    if (!lesson) return;
    const timer = setTimeout(() => saveCode(lesson.id, code, course?.id), 500);
    return () => clearTimeout(timer);
  }, [code, course?.id, lesson, saveCode]);

  // Reset pace coach when changing lessons
  useEffect(() => {
    setPaceMode(null);
    setBonusActive(false);
    setActiveStage("plan");
    setQuizCompleted(false);
    setPracticeCompleted(false);
    setStageNotice(null);
    runLockedRef.current = false;
  }, [lessonId]);

  // Checkpoint lessons live on a dedicated route
  if (augmented?.lesson.kind === "checkpoint") {
    return <Navigate to={`/checkpoint/${courseId}/${lessonId}`} replace />;
  }
  if (!data || !lesson || !course) return <Navigate to="/cursos" replace />;

  // Compute the next step from the augmented course (so checkpoints are inserted)
  const augCourse = augmented?.course ?? { lessons: [] as { id: string; kind: "lesson" | "checkpoint" }[] };
  const augIdx = augCourse.lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = augIdx >= 0 ? augCourse.lessons[augIdx + 1] : course.lessons[lessonIndex + 1];
  const progressPercent = ((lessonIndex + 1) / course.lessons.length) * 100;
  const alreadyCompleted = isCompleted(lesson.id);
  const theorySlides = splitTheorySlides(lesson.theory);
  const availableStages: LessonStage[] = [
    { id: "plan", kind: "plan", label: "Plano", icon: ListChecks },
    ...theorySlides.map((_, index) => ({
      id: `theory-${index}` as LessonStageId,
      kind: "theory" as const,
      label: theorySlides.length === 1 ? "Teoria" : `Teoria ${index + 1}`,
      icon: BookOpen,
      theoryIndex: index,
    })),
    ...(lesson.quiz?.length ? [{ id: "quiz", kind: "quiz", label: "Quiz", icon: Lightbulb } as LessonStage] : []),
    { id: "practice", kind: "practice", label: "Prática", icon: Target },
    { id: "challenge", kind: "challenge", label: "Desafio", icon: Check },
    { id: "code", kind: "code", label: "Código", icon: Code2 },
  ];
  const activeStageIndex = Math.max(
    availableStages.findIndex((stage) => stage.id === activeStage),
    0,
  );
  const currentStage = availableStages[activeStageIndex] ?? availableStages[0];
  const stageProgress = ((activeStageIndex + 1) / availableStages.length) * 100;
  const stageSectionClass = (stage: LessonStageKind) =>
    currentStage.kind === stage ? "block" : "hidden";
  const lessonReadyToAdvance = alreadyCompleted || isCorrect === true;
  const isFirstStage = activeStageIndex === 0;
  const isCodeStage = currentStage.kind === "code";
  const quizRequired = Boolean(lesson.quiz?.length);
  const quizGatePassed = !quizRequired || quizCompleted || alreadyCompleted;
  const practiceGatePassed = practiceCompleted || alreadyCompleted;
  const nextStageKind = availableStages[activeStageIndex + 1]?.kind;
  const nextStageCta =
    nextStageKind === "quiz"
      ? "Responder quiz"
      : nextStageKind === "practice"
      ? "Ir para a prática"
      : nextStageKind === "challenge"
      ? "Ver desafio"
      : nextStageKind === "code"
      ? "Abrir editor"
      : currentStage.kind === "plan"
      ? "Começar aula"
      : "Continuar";
  const lessonMascotState: MascoteCapivaraState = running
    ? "loading"
    : alreadyCompleted
    ? "celebrate"
    : isCorrect === true
    ? "success"
    : isCorrect === false
    ? "error"
    : isCorrect === null && output
    ? "thinking"
    : "idle";

  const stageRequirement =
    currentStage.kind === "quiz" && !quizGatePassed
      ? "Acerte o quiz para liberar a prática."
      : currentStage.kind === "practice" && !practiceGatePassed
      ? "Complete a prática guiada para liberar o desafio."
      : null;
  const currentStageCanAdvance = !stageRequirement;

  const canEnterStageIndex = (index: number) => {
    const targetStage = availableStages[index];
    if (!targetStage) return false;
    if (index <= activeStageIndex) return true;
    if ((targetStage.kind === "practice" || targetStage.kind === "challenge" || targetStage.kind === "code") && !quizGatePassed) {
      return false;
    }
    if ((targetStage.kind === "challenge" || targetStage.kind === "code") && !practiceGatePassed) {
      return false;
    }
    return true;
  };

  const blockedStageMessage = (stage: LessonStage) => {
    if ((stage.kind === "practice" || stage.kind === "challenge" || stage.kind === "code") && !quizGatePassed) {
      return "Antes disso, acerte o quiz da aula.";
    }
    if ((stage.kind === "challenge" || stage.kind === "code") && !practiceGatePassed) {
      return "Antes disso, complete a prática guiada.";
    }
    return "Siga a ordem da aula para liberar esta etapa.";
  };

  const goToStage = (stage: LessonStageId) => {
    const stageIndex = availableStages.findIndex((item) => item.id === stage);
    const targetStage = availableStages[stageIndex];
    if (!targetStage) return;
    if (!canEnterStageIndex(stageIndex)) {
      setStageNotice(blockedStageMessage(targetStage));
      return;
    }
    setStageNotice(null);
    setActiveStage(stage);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const goToStageIndex = (index: number) => {
    const nextStage = availableStages[Math.min(Math.max(index, 0), availableStages.length - 1)];
    if (!nextStage) return;
    goToStage(nextStage.id);
  };

  const goToNextStage = () => {
    if (!currentStageCanAdvance) {
      setStageNotice(stageRequirement);
      return;
    }
    goToStageIndex(activeStageIndex + 1);
  };

  const goToPreviousStage = () => {
    goToStageIndex(activeStageIndex - 1);
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#0A7C78", "#7AD7A7", "#FF9F2F", "#169C93"],
    });
  };

  const handleRun = () => {
    if (running || runLockedRef.current) return;
    runLockedRef.current = true;
    setActiveStage("code");
    setRunning(true);
    setTimeout(() => {
      const result = validateCode(code, lesson.expectedOutput, lesson.solution, {
        starterCode: lesson.starterCode,
      });
      const correct = result.level === "exact" || result.level === "flexible";
      setIsCorrect(correct ? true : result.level === "close" ? null : false);

      if (correct) {
        const priorAttempts = getAttempts(lesson.id);
        setOutput(lesson.expectedOutput);
        setReflectiveQ(null);
        resetLesson(lesson.id);
        const awardedXp = !alreadyCompleted && completeLesson(lesson.id, lesson.xpReward, course.id);
        if (awardedXp) {
          setShowXP(true);
          setTimeout(() => setShowXP(false), 1500);
          fireConfetti();
        }
        // Personalização: acertou de primeira → oferece desafio extra
        if (priorAttempts === 0 && !alreadyCompleted && !bonusActive) {
          setPaceMode("thriving");
        } else {
          setPaceMode(null);
        }
      } else {
        registerFailure(lesson.id, result.errorKind);
        const attempts = getAttempts(lesson.id) + 1;
        let composed = result.message;

        if (attempts >= 2 && lesson.hints.length > 0) {
          const nextHintIdx = Math.min(hintIndex + 1, lesson.hints.length - 1);
          if (nextHintIdx > hintIndex) setHintIndex(nextHintIdx);
          composed += `\n\n💡 Dica direta: ${lesson.hints[nextHintIdx]}`;
        }

        setOutput(composed);
        setReflectiveQ(result.reflectiveQuestion ?? null);

        // Personalização: 3+ falhas seguidas → modo apoio
        if (attempts >= 3) {
          setPaceMode("struggling");
        }
      }
      setRunning(false);
      runLockedRef.current = false;
    }, 800);
  };

  const handleHint = () => {
    setHintIndex((prev) => Math.min(prev + 1, lesson.hints.length - 1));
  };

  const handleReset = () => {
    setCode(lesson.starterCode);
    setOutput(null);
    setReflectiveQ(null);
    setIsCorrect(null);
    setHintIndex(-1);
    setShowSolution(false);
    setSolutionWarned(false);
    resetLesson(lesson.id);
  };

  const handleRevealSolution = () => {
    if (!solutionWarned) {
      setSolutionWarned(true);
      return;
    }
    setShowSolution(true);
    setCode(lesson.solution);
  };

  const handleNext = () => {
    if (nextLesson) {
      const nextHref =
        "kind" in nextLesson && nextLesson.kind === "checkpoint"
          ? `/checkpoint/${course.id}/${nextLesson.id}`
          : `/editor/${course.id}/${nextLesson.id}`;
      navigate(nextHref);
    } else {
      navigate(`/cursos/${course.id}`);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Onboarding Banner */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border-b border-primary/20 bg-primary/5 px-4 py-3"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-3 sm:gap-4">
              <Info size={18} className="shrink-0 text-primary" />
              <div className="flex-1 text-xs text-muted-foreground">
                <div className="lg:hidden">
                  Avance pelas mini-etapas da aula: uma ideia, uma ação e um teste por vez.
                </div>
                <div className="hidden flex-wrap gap-x-6 gap-y-1 lg:flex">
                  <span>
                    <strong className="text-foreground">Esquerda:</strong> leia a teoria e o exercício
                  </span>
                  <span>
                    <strong className="text-foreground">Direita:</strong> escreva seu código
                  </span>
                  <span>
                    <strong className="text-foreground">Executar:</strong> testa sua resposta
                  </span>
                  <span>
                    <strong className="text-foreground">Dicas:</strong> aparecem se você travar
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissOnboarding}
                className="shrink-0 h-7 rounded-full text-xs"
              >
                Entendi
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link
            to={`/cursos/${course.id}`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="flex min-w-0 items-center gap-2 font-bold text-primary">
                <CourseCoverArt course={course} variant="thumb" className="h-8 w-12 shrink-0 rounded-lg" />
                <span className="truncate">{course.title}</span>
              </span>
              <span className="text-muted-foreground">
                Lição {lessonIndex + 1}/{course.lessons.length}
              </span>
            </div>
            <Progress
              value={progressPercent}
              className="h-2 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent"
            />
          </div>
        </div>
      </div>

      <nav
        aria-label="Etapas da aula"
        className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-black text-primary">
              Etapa {activeStageIndex + 1}/{availableStages.length}: {currentStage.label}
            </span>
            <span className="text-muted-foreground">Uma ideia por vez</span>
          </div>
          <Progress value={stageProgress} className="mb-3 h-1.5 bg-secondary" />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {availableStages.map((step) => {
              const Icon = step.icon;
              const active = currentStage.id === step.id;
              const stepIndex = availableStages.findIndex((item) => item.id === step.id);
              const unlocked = canEnterStageIndex(stepIndex);

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStage(step.id)}
                  disabled={!unlocked}
                  aria-current={active ? "step" : undefined}
                  aria-disabled={!unlocked}
                  className={`flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-bold transition-colors ${
                    active
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : !unlocked
                      ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/50"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
          {stageNotice && (
            <div className="mt-3 rounded-xl border border-quest-yellow/30 bg-quest-yellow/5 px-3 py-2 text-xs font-bold text-quest-yellow">
              {stageNotice}
            </div>
          )}
        </div>
      </nav>

      {/* Main split layout */}
      <div className={`grid flex-1 min-h-0 ${isCodeStage ? "lg:grid-cols-2" : ""}`}>
        {/* Instructions (left panel) */}
        <div
          className={`border-b border-border bg-background p-6 lg:block lg:border-b-0 lg:overflow-auto ${
            isCodeStage ? "hidden lg:block lg:border-r" : "block mx-auto w-full max-w-4xl"
          }`}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className={stageSectionClass("plan")}>
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  <span>✨</span> +{lesson.xpReward} XP
                </span>
                {alreadyCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                    <Check size={12} /> Concluída
                  </span>
                )}
              </div>
              <h2 className="mb-4 text-2xl font-black">{lesson.title}</h2>

              <MascoteCapivara state={lessonMascotState} className="mb-5" />

              <LessonCoach course={course} lesson={lesson} />
            </div>

            <div className={stageSectionClass("theory")}>
              {/* Theory section */}
              {lesson.theory && (
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
                    <span>📖</span> Aprenda
                  </div>
                  <TheoryRenderer
                    text={theorySlides[currentStage.theoryIndex ?? 0] ?? lesson.theory}
                    courseTitle={course.title}
                    language={course.language}
                    lessonTitle={lesson.title}
                  />
                </div>
              )}
            </div>

            <div className={stageSectionClass("quiz")}>
              {/* Quiz section */}
              {lesson.quiz && lesson.quiz.length > 0 && (
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-quest-blue">
                    <span>🧠</span> Teste seu conhecimento
                  </div>
                  <div className="rounded-xl border border-quest-blue/10 bg-quest-blue/5 p-4">
                    <QuizSection
                      questions={lesson.quiz}
                      onComplete={(correct) => {
                        const passed = correct === lesson.quiz!.length;
                        setQuizCompleted(passed);
                        setStageNotice(
                          passed
                            ? null
                            : "Revise o feedback da Capy e tente o quiz novamente para liberar a prática."
                        );
                        if (passed) {
                          completeLesson(lesson.id + "-quiz", 5, course.id);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={stageSectionClass("practice")}>
              <GuidedPractice
                lesson={lesson}
                onCompletionChange={(completed) => {
                  setPracticeCompleted(completed);
                  if (completed) setStageNotice(null);
                }}
              />
            </div>

            <div className={stageSectionClass("challenge")}>
            {/* Exercise description */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-accent">
                <span>🎯</span> Exercício
              </div>
              <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
                {lesson.description}
              </p>
              {/* Expected output reference */}
              <div className="mt-3 rounded-lg border border-border/30 bg-secondary/40 px-3 py-2 text-xs">
                <span className="font-bold text-muted-foreground">Saída esperada: </span>
                <code className="font-mono text-accent">{lesson.expectedOutput}</code>
              </div>
            </div>

            {/* Hints */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleHint}
                  className="gap-2 rounded-full text-xs"
                  disabled={hintIndex >= lesson.hints.length - 1}
                >
                  <Lightbulb size={14} /> Pedir dica ({Math.max(hintIndex + 1, 0)}/{lesson.hints.length})
                </Button>

                {/* Ver Solução button */}
                {hintIndex >= 1 && !showSolution && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRevealSolution}
                    className="gap-1.5 rounded-full text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Eye size={13} /> Ver Solução
                  </Button>
                )}
                {showSolution && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSolution(false)}
                    className="gap-1.5 rounded-full text-xs text-muted-foreground"
                  >
                    <EyeOff size={13} /> Ocultar Solução
                  </Button>
                )}
              </div>

              {/* Solution warning */}
              <AnimatePresence>
                {solutionWarned && !showSolution && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-lg border border-quest-yellow/30 bg-quest-yellow/5 px-4 py-3 text-xs text-quest-yellow"
                  >
                    ⚠️ Ver a solução vai carregar o código no editor. Tente mais um pouco primeiro — você aprende muito mais errando!{" "}
                    <button
                      onClick={handleRevealSolution}
                      className="ml-1 underline font-bold hover:opacity-80"
                    >
                      Mostrar mesmo assim
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {hintIndex >= 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    {lesson.hints.slice(0, hintIndex + 1).map((hint, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-quest-yellow/20 bg-quest-yellow/5 px-4 py-2.5 text-sm text-quest-yellow"
                      >
                        💡 {hint}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Personalização de ritmo: apoio extra ou desafio */}
            <PaceCoach
              mode={paceMode}
              altExplanation={
                lesson.hints[0]
                  ? `Foque primeiro nisto: ${lesson.hints[0]} Tente reescrever o código em voz alta antes de digitar.`
                  : "Releia o enunciado e tente descrever em uma frase o que o programa precisa fazer antes de codar."
              }
              bonusChallenge={`Conseguiu! Agora tente uma variação: faça o mesmo resultado, mas usando uma estrutura diferente (ex: outra forma de imprimir, uma variável intermediária, ou um pequeno loop). A resposta esperada continua sendo: ${lesson.expectedOutput}`}
              onUseSimpler={() => {
                // "Versão preparatória": começa do starterCode com guia em comentário
                const guide = `// Versão guiada — siga os passos abaixo:\n// 1. Releia o exercício\n// 2. Use o exemplo da teoria como base\n// 3. Saída esperada: ${lesson.expectedOutput}\n\n${lesson.starterCode}`;
                setCode(guide);
                setOutput(null);
                setIsCorrect(null);
                setPaceMode(null);
              }}
              onRevealSolution={() => {
                handleRevealSolution();
                setPaceMode(null);
              }}
              onAcceptBonus={() => {
                setBonusActive(true);
                setPaceMode(null);
              }}
              onDismiss={() => setPaceMode(null)}
            />

            {bonusActive && (
              <div className="mt-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground">
                <span className="font-bold text-accent">✨ Modo desafio ativo:</span>{" "}
                tente refazer este exercício de uma forma diferente antes de avançar.
              </div>
            )}

            </div>

            <div className={stageSectionClass("code")}>
              <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-accent">
                  <Code2 size={16} /> Agora é código
                </div>
                <h2 className="text-2xl font-black text-foreground">{lesson.title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Escreva a solução no editor, execute e compare com a saída esperada. Se travar,
                  volte ao desafio ou peça uma dica.
                </p>
                <div className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
                  <div className="mb-1 font-black text-muted-foreground">Saída esperada</div>
                  <code className="font-mono text-accent">{lesson.expectedOutput}</code>
                </div>
                <Button
                  variant="outline"
                  onClick={() => goToStage("challenge")}
                  className="mt-4 gap-2 rounded-full font-bold"
                >
                  <ArrowLeft size={16} /> Ver desafio
                </Button>
              </div>
              <MascoteCapivara state={lessonMascotState} className="mt-5 hidden lg:block" />
            </div>

            {!isCodeStage && (
              <div className="z-20 -mx-6 mt-6 flex flex-col gap-2 border-t border-border bg-background/95 px-6 py-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between md:sticky md:bottom-0 lg:shadow-none">
                <Button
                  variant="outline"
                  onClick={goToPreviousStage}
                  disabled={isFirstStage}
                  className="gap-2 rounded-full font-bold"
                >
                  <ArrowLeft size={16} /> Voltar
                </Button>
                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                  {stageRequirement && (
                    <div className="text-xs font-bold text-muted-foreground">{stageRequirement}</div>
                  )}
                  <Button
                    onClick={goToNextStage}
                    disabled={!currentStageCanAdvance}
                    className="gap-2 rounded-full font-bold"
                  >
                    {nextStageCta} <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Editor (right panel) */}
        {isCodeStage && (
        <div className="flex min-h-0 flex-col">
          <div className="min-h-[430px] flex-1 p-4 lg:min-h-0">
            <div className="h-full rounded-2xl border border-border bg-[#1e1e2e] overflow-hidden flex flex-col shadow-sm">
              {/* Editor header */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-quest-yellow/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                  </div>
                  <span className="text-xs text-[#585b70] font-mono">
                    {course.language.toLowerCase()}
                  </span>
                  {showSolution && (
                    <span className="text-xs rounded-full bg-quest-yellow/10 px-2 py-0.5 text-quest-yellow font-bold">
                      solução
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-7 gap-1 text-xs text-[#6c7086] hover:text-[#cdd6f4]"
                >
                  <RotateCcw size={12} /> Reset
                </Button>
              </div>

              {/* Code Editor */}
              <CodeEditor value={code} onChange={setCode} language={course.language} />

              {/* Output */}
              {output && (
                <div
                  className={`border-t px-4 py-3 font-mono text-sm ${
                    isCorrect === true
                      ? "border-accent/20 bg-accent/5 text-accent"
                      : isCorrect === null
                      ? "border-quest-yellow/20 bg-quest-yellow/5 text-quest-yellow"
                      : "border-destructive/20 bg-destructive/5 text-destructive"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {isCorrect === true ? (
                      <Check size={14} />
                    ) : isCorrect === null ? (
                      <Lightbulb size={14} />
                    ) : (
                      <X size={14} />
                    )}
                    <span className="font-bold text-xs">
                      {isCorrect === true
                        ? "Correto!"
                        : isCorrect === null
                        ? "Quase lá:"
                        : "Atenção:"}
                    </span>
                  </div>
                  <span className="whitespace-pre-wrap">{output}</span>
                  {reflectiveQ && isCorrect !== true && (
                    <div className="mt-3 rounded-lg border border-quest-blue/30 bg-quest-blue/5 px-3 py-2 text-xs text-quest-blue font-sans not-italic">
                      <span className="font-bold">🤔 Pense:</span> {reflectiveQ}
                    </div>
                  )}
                  {getAttempts(lesson.id) >= 2 && isCorrect !== true && (
                    <div className="mt-2 text-[10px] text-muted-foreground font-sans">
                      Tentativas nesta lição: {getAttempts(lesson.id)} — não desista, você está aprendendo!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Run bar */}
          <div className="sticky bottom-[70px] z-20 border-t border-border/20 bg-[#181825] p-4 shadow-2xl md:bottom-0 lg:static lg:shadow-none">
            {(running || output || isCorrect !== null || alreadyCompleted) && (
              <MascoteCapivara
                state={lessonMascotState}
                variant="compact"
                className="mb-3 border-white/10 font-sans shadow-none lg:hidden"
              />
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Button
                    onClick={handleRun}
                    disabled={running}
                    className="gap-2 rounded-full bg-gradient-to-r from-accent to-[hsl(160,80%,45%)] font-extrabold text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-xl"
                  >
                    <Play size={16} /> {running ? "Executando..." : "Executar"}
                  </Button>
                  <AnimatePresence>
                    {showXP && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 0 }}
                        animate={{ opacity: 1, scale: 1.2, y: -20 }}
                        exit={{ opacity: 0, y: -40 }}
                        className="absolute -top-2 left-1/2 -translate-x-1/2 font-black text-accent text-lg pointer-events-none"
                      >
                        +{lesson.xpReward} XP! 🎉
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToStage("challenge")}
                  className="gap-1.5 rounded-full text-xs text-muted-foreground lg:hidden"
                >
                  <ArrowLeft size={14} /> Ver desafio
                </Button>
              </div>
              <Button
                variant={lessonReadyToAdvance ? "default" : "ghost"}
                onClick={handleNext}
                disabled={!lessonReadyToAdvance}
                className={`gap-1 text-sm ${
                  lessonReadyToAdvance
                    ? "bg-accent/20 text-accent font-bold hover:bg-accent/30"
                    : "text-muted-foreground opacity-60"
                }`}
              >
                {nextLesson ? "Próxima lição" : "Voltar ao curso"}{" "}
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
        )}
      </div>

      <AITutor
        contextId={lesson.id}
        lessonContext={{
          courseTitle: course.title,
          language: course.language,
          lessonTitle: lesson.title,
          description: lesson.description,
          theory: lesson.theory,
          expectedOutput: lesson.expectedOutput,
          starterCode: lesson.starterCode,
          currentCode: code,
          lastError: isCorrect === false ? output ?? undefined : undefined,
        }}
      />
    </div>
  );
};

export default EditorPage;
