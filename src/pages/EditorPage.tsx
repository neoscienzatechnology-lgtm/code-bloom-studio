import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getLessonById } from "@/data/mockData";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import CodeEditor from "@/components/CodeEditor";
import TheoryRenderer from "@/components/TheoryRenderer";
import QuizSection from "@/components/QuizSection";
import { useProgress } from "@/hooks/useProgress";
import { useAttemptTracker } from "@/hooks/useAttemptTracker";
import { validateCode } from "@/utils/codeValidator";
import confetti from "canvas-confetti";

const ONBOARDING_KEY = "codequest_editor_onboarding_seen";

const EditorPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
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
  }, [code, lesson, saveCode]);

  if (!data || !lesson || !course) return <Navigate to="/cursos" replace />;

  const nextLesson = course.lessons[lessonIndex + 1];
  const progressPercent = ((lessonIndex + 1) / course.lessons.length) * 100;
  const alreadyCompleted = isCompleted(lesson.id);

  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#8B5CF6", "#10B981", "#F59E0B", "#EC4899"],
    });
  };

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      const result = validateCode(code, lesson.expectedOutput, lesson.solution);
      const correct = result.level === "exact" || result.level === "flexible";
      setIsCorrect(correct ? true : result.level === "close" ? null : false);

      if (correct) {
        setOutput(lesson.expectedOutput);
        setReflectiveQ(null);
        resetLesson(lesson.id);
        setShowXP(true);
        setTimeout(() => setShowXP(false), 1500);
        if (!alreadyCompleted) {
          completeLesson(lesson.id, lesson.xpReward, course.id);
          fireConfetti();
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
      }
      setRunning(false);
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
      navigate(`/editor/${course.id}/${nextLesson.id}`);
      window.location.href = `/editor/${course.id}/${nextLesson.id}`;
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
            <div className="mx-auto flex max-w-7xl items-center gap-4 flex-wrap">
              <Info size={18} className="shrink-0 text-primary" />
              <div className="flex flex-1 flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                <span>
                  <strong className="text-foreground">📖 Esquerda:</strong> leia a teoria e o exercício
                </span>
                <span>
                  <strong className="text-foreground">💻 Direita:</strong> escreva seu código
                </span>
                <span>
                  <strong className="text-foreground">▶ Executar:</strong> testa sua resposta
                </span>
                <span>
                  <strong className="text-foreground">💡 Dicas:</strong> aparecem se você travar
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissOnboarding}
                className="shrink-0 h-7 rounded-full text-xs"
              >
                Entendi ✓
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
              <span className="font-bold text-primary">
                {course.emoji} {course.title}
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

      {/* Main split layout */}
      <div className="flex-1 grid lg:grid-cols-2">
        {/* Instructions (left panel) */}
        <div className="border-b border-border bg-background p-6 lg:border-b-0 lg:border-r overflow-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
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

            {/* Theory section */}
            {lesson.theory && (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
                  <span>📖</span> Aprenda
                </div>
                <TheoryRenderer text={lesson.theory} />
              </div>
            )}

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
                      if (correct === lesson.quiz!.length) {
                        completeLesson(lesson.id + "-quiz", 5);
                      }
                    }}
                  />
                </div>
              </div>
            )}

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
          </motion.div>
        </div>

        {/* Editor (right panel) */}
        <div className="flex flex-col">
          <div className="flex-1 p-4">
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
                </div>
              )}
            </div>
          </div>

          {/* Run bar */}
          <div className="border-t border-border/20 bg-[#181825] p-4">
            <div className="flex items-center justify-between">
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
                variant={isCorrect === true ? "default" : "ghost"}
                onClick={handleNext}
                className={`gap-1 text-sm ${
                  isCorrect === true
                    ? "bg-accent/20 text-accent font-bold hover:bg-accent/30"
                    : "text-muted-foreground"
                }`}
              >
                {nextLesson ? "Próxima lição" : "Voltar ao curso"}{" "}
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
