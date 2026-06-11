import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Hammer,
  Play,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import CodeEditor from "@/components/CodeEditor";
import CapyLessonAssistant from "@/components/CapyLessonAssistant";
import { getProjectById } from "@/data/projects";
import { getCourseById } from "@/data/mockData";
import { validateCode } from "@/utils/codeValidator";
import { useProgress } from "@/hooks/useProgress";
import { readJson, writeJson, removeKey, STORAGE_KEYS } from "@/lib/storage";

const STORAGE_KEY_PREFIX = STORAGE_KEYS.projectPrefix;

interface ProjectState {
  currentStep: number;
  completedSteps: string[];
  codeByStep: Record<string, string>;
}

function loadState(projectId: string): ProjectState {
  return readJson<ProjectState>(STORAGE_KEY_PREFIX + projectId, {
    currentStep: 0,
    completedSteps: [],
    codeByStep: {},
  });
}

function saveState(projectId: string, state: ProjectState) {
  writeJson(STORAGE_KEY_PREFIX + projectId, state);
}

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = getProjectById(projectId || "");
  const linkedCourse = project ? getCourseById(project.courseId) : undefined;
  const { completeLesson, isCompleted } = useProgress();

  const [state, setState] = useState<ProjectState>(() =>
    loadState(projectId || "")
  );
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [stepStatus, setStepStatus] = useState<"idle" | "ok" | "err">("idle");
  const [hintIndex, setHintIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const runLockedRef = useRef(false);
  const advanceLockedRef = useRef(false);

  const step = project?.steps[state.currentStep];
  const allDone =
    project && state.completedSteps.length === project.steps.length;

  // Sync code editor when step changes
  useEffect(() => {
    if (!step) return;
    setCode(state.codeByStep[step.id] ?? step.starterCode);
    setOutput(null);
    setStepStatus("idle");
    setHintIndex(-1);
    runLockedRef.current = false;
    advanceLockedRef.current = false;
  }, [step, state.codeByStep]);

  // Persist state
  useEffect(() => {
    if (projectId) saveState(projectId, state);
  }, [state, projectId]);

  const totalConcepts = useMemo(
    () => (project ? Array.from(new Set(project.summary)) : []),
    [project]
  );

  if (!project) return <Navigate to="/cursos" replace />;
  if (!step && !allDone) return <Navigate to="/cursos" replace />;

  const progressPct = Math.round(
    (state.completedSteps.length / project.steps.length) * 100
  );
  const projectXpKey = `project-${project.id}`;
  const alreadyClaimed = isCompleted(projectXpKey);

  const handleRun = () => {
    if (!step || running || runLockedRef.current) return;
    runLockedRef.current = true;
    setRunning(true);
    setTimeout(() => {
      const result = validateCode(code, step.expectedOutput, step.solution, {
        starterCode: step.starterCode,
      });
      const correct = result.level === "exact" || result.level === "flexible";
      if (correct) {
        setOutput(`✅ ${step.expectedOutput}`);
        setStepStatus("ok");
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#0A7C78", "#7AD7A7"],
        });
      } else {
        setOutput(result.message);
        setStepStatus("err");
      }
      setRunning(false);
      runLockedRef.current = false;
    }, 500);
  };

  const handleAdvance = () => {
    if (!step || stepStatus !== "ok" || advanceLockedRef.current) return;
    advanceLockedRef.current = true;

    const nextCompleted = state.completedSteps.includes(step.id)
      ? state.completedSteps
      : [...state.completedSteps, step.id];
    const nextIndex = Math.min(state.currentStep + 1, project.steps.length);
    const updated: ProjectState = {
      currentStep: nextIndex,
      completedSteps: nextCompleted,
      codeByStep: { ...state.codeByStep, [step.id]: code },
    };
    setState(updated);

    // Final step → award XP
    if (nextCompleted.length === project.steps.length && !alreadyClaimed) {
      const awardedXp = completeLesson(projectXpKey, project.xpReward, project.courseId);
      if (!awardedXp) return;

      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#0A7C78", "#7AD7A7", "#FF9F2F"],
      });
    }
  };

  const handleReset = () => {
    if (!step) return;
    setCode(step.starterCode);
    setOutput(null);
    setStepStatus("idle");
  };

  const handleNextHint = () => {
    if (!step) return;
    setHintIndex((i) => Math.min(i + 1, step.hints.length - 1));
  };

  const useGuidedProjectStarter = () => {
    if (!step) return;
    setCode(
      `// Guia da Capy\n// Projeto: ${project.title}\n// Etapa: ${step.title}\n// Saída esperada: ${step.expectedOutput}\n// Resolva só esta etapa antes de avançar.\n\n${step.starterCode}`,
    );
    setOutput(null);
    setStepStatus("idle");
  };

  /* ── Final summary ─────────────────────────────────────────────── */
  if (allDone) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-primary/5 p-6 text-center sm:p-8"
          >
            <div className="mb-3 text-6xl">🏆</div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              Projeto concluído
            </p>
            <h1 className="text-3xl font-black text-foreground sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{project.goal}</p>

            <div className="mt-6 rounded-xl border border-border bg-card/60 p-5 text-left">
              <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-foreground">
                <Trophy size={16} className="text-accent" />
                Conceitos que você aplicou
              </div>
              <ul className="space-y-2">
                {totalConcepts.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CheckCircle2 size={14} className="shrink-0 text-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
              {alreadyClaimed ? "XP deste projeto já registrado" : `+${project.xpReward} XP disponível`}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button
                onClick={() => navigate(`/cursos/${project.courseId}`)}
                className="rounded-full bg-primary font-bold text-primary-foreground"
              >
                Voltar ao curso
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  removeKey(STORAGE_KEY_PREFIX + project.id);
                  setState({
                    currentStep: 0,
                    completedSteps: [],
                    codeByStep: {},
                  });
                }}
                className="rounded-full"
              >
                <RotateCcw size={14} /> Refazer projeto
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Active step ───────────────────────────────────────────────── */
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link
            to={`/cursos/${project.courseId}`}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-primary">
                <Hammer size={13} /> Projeto · {project.emoji} {project.title}
              </span>
              <span className="text-muted-foreground">
                Etapa {state.currentStep + 1}/{project.steps.length}
              </span>
            </div>
            <Progress
              value={progressPct}
              className="h-2 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-2">
        {/* Left: instructions + step list */}
        <div className="border-b border-border bg-background p-6 lg:border-b-0 lg:border-r overflow-auto">
          <motion.div
            key={step!.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Objetivo do projeto
            </p>
            <h1 className="mb-1 text-2xl font-black text-foreground">
              {project.title}
            </h1>
            <p className="mb-5 text-sm text-muted-foreground">{project.goal}</p>

            {/* Step chips (compact) */}
            <ol className="mb-6 flex flex-wrap items-center gap-2" aria-label="Etapas do projeto">
              {project.steps.map((s, i) => {
                const done = state.completedSteps.includes(s.id);
                const current = i === state.currentStep;
                return (
                  <li
                    key={s.id}
                    title={s.title}
                    aria-current={current ? "step" : undefined}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                      done
                        ? "bg-accent text-accent-foreground"
                        : current
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {done ? <Check size={13} /> : i + 1}
                  </li>
                );
              })}
            </ol>

            {/* Current step */}
            <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5">
              <h2 className="mb-2 text-lg font-extrabold text-foreground">
                {step!.title}
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {step!.description}
              </p>
              <div className="mt-3 rounded-lg border border-border/40 bg-secondary/40 px-3 py-2 text-xs">
                <span className="font-bold text-muted-foreground">
                  Saída esperada:{" "}
                </span>
                <code className="font-mono text-accent">
                  {step!.expectedOutput}
                </code>
              </div>

              <div className="mt-3 rounded-lg border border-quest-blue/20 bg-quest-blue/5 px-3 py-2 text-xs">
                <span className="text-muted-foreground">
                  Esta etapa pratica:{" "}
                  <span className="font-bold text-foreground">{step!.concepts.join(", ")}</span>.
                </span>{" "}
                {linkedCourse && (
                  <Link
                    to={`/cursos/${project.courseId}`}
                    className="font-bold text-quest-blue underline-offset-2 hover:underline"
                  >
                    Travou? Revise as lições de {linkedCourse.title}
                  </Link>
                )}
              </div>

              <CapyLessonAssistant
                mode="project"
                title={step!.title}
                state={running ? "loading" : stepStatus === "ok" ? "success" : stepStatus === "err" ? "error" : "thinking"}
                stageLabel={`Etapa ${state.currentStep + 1}`}
                objective={step!.description}
                hints={step!.hints}
                revealedHintCount={hintIndex + 1}
                lastFeedback={output}
                onRevealHint={handleNextHint}
                onUseGuidedStarter={useGuidedProjectStarter}
                className="mt-4"
              />

            </div>
          </motion.div>
        </div>

        {/* Right: editor */}
        <div className="flex min-h-0 flex-col">
          <div className="min-h-[430px] flex-1 p-4 lg:min-h-0">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-[#1e1e2e] shadow-sm">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                <span className="text-xs text-[#585b70] font-mono">
                  {project.language.toLowerCase()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-7 gap-1 text-xs text-[#6c7086] hover:text-[#cdd6f4]"
                >
                  <RotateCcw size={12} /> Reset
                </Button>
              </div>

              <CodeEditor
                value={code}
                onChange={setCode}
                language={project.language}
              />

              {output && (
                <div
                  className={`border-t px-4 py-3 font-mono text-sm ${
                    stepStatus === "ok"
                      ? "border-accent/20 bg-accent/5 text-accent"
                      : "border-destructive/20 bg-destructive/5 text-destructive"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    {stepStatus === "ok" ? <Check size={14} /> : <X size={14} />}
                    <span className="text-xs font-bold">
                      {stepStatus === "ok"
                        ? "Etapa concluída!"
                        : "Ainda não está certo"}
                    </span>
                  </div>
                  <span className="whitespace-pre-wrap">{output}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border/20 bg-[#181825] p-4">
            <div className="flex items-center justify-between gap-3">
              <Button
                onClick={handleRun}
                disabled={running}
                className="gap-2 rounded-full bg-gradient-to-r from-accent to-[hsl(160,80%,45%)] font-extrabold text-accent-foreground shadow-lg shadow-accent/20"
              >
                <Play size={16} /> {running ? "Validando..." : "Validar etapa"}
              </Button>

              <Button
                onClick={handleAdvance}
                disabled={stepStatus !== "ok"}
                className={`gap-1 rounded-full text-sm font-bold ${
                  stepStatus === "ok"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {state.currentStep === project.steps.length - 1
                  ? "Finalizar projeto"
                  : "Próxima etapa"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
