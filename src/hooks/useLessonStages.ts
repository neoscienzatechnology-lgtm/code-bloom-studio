import { useState } from "react";
import { BookOpen, Check, Code2, Lightbulb, ListChecks, Target } from "lucide-react";

export type LessonStageKind = "plan" | "theory" | "quiz" | "practice" | "challenge" | "code";
export type LessonStageId = "plan" | `theory-${number}` | "quiz" | "practice" | "challenge" | "code";

export interface LessonStage {
  id: LessonStageId;
  kind: LessonStageKind;
  label: string;
  icon: typeof ListChecks;
  theoryIndex?: number;
}

export function splitTheorySlides(theory: string): string[] {
  const blocks = theory
    .split(/\n(?=##\s+)/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.length > 0 ? blocks : [theory];
}

interface UseLessonStagesArgs {
  theorySlides: string[];
  hasQuiz: boolean;
  alreadyCompleted: boolean;
}

/**
 * Stage machine for a lesson: plan → theory slides → quiz → practice →
 * challenge → code, with quiz/practice gates that block forward navigation.
 * Lesson-scoped state — mount it inside a component keyed by lesson id.
 */
export function useLessonStages({ theorySlides, hasQuiz, alreadyCompleted }: UseLessonStagesArgs) {
  const [activeStage, setActiveStage] = useState<LessonStageId>("plan");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [stageNotice, setStageNotice] = useState<string | null>(null);

  const stages: LessonStage[] = [
    { id: "plan", kind: "plan", label: "Plano", icon: ListChecks },
    ...theorySlides.map((_, index) => ({
      id: `theory-${index}` as LessonStageId,
      kind: "theory" as const,
      label: theorySlides.length === 1 ? "Teoria" : `Teoria ${index + 1}`,
      icon: BookOpen,
      theoryIndex: index,
    })),
    ...(hasQuiz ? [{ id: "quiz", kind: "quiz", label: "Quiz", icon: Lightbulb } as LessonStage] : []),
    { id: "practice", kind: "practice", label: "Prática", icon: Target },
    { id: "challenge", kind: "challenge", label: "Desafio", icon: Check },
    { id: "code", kind: "code", label: "Código", icon: Code2 },
  ];

  const activeStageIndex = Math.max(
    stages.findIndex((stage) => stage.id === activeStage),
    0,
  );
  const currentStage = stages[activeStageIndex] ?? stages[0];
  const stageProgress = ((activeStageIndex + 1) / stages.length) * 100;
  const isFirstStage = activeStageIndex === 0;
  const isCodeStage = currentStage.kind === "code";

  const quizGatePassed = !hasQuiz || quizCompleted || alreadyCompleted;
  const practiceGatePassed = practiceCompleted || alreadyCompleted;

  const nextStageKind = stages[activeStageIndex + 1]?.kind;
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

  const stageRequirement =
    currentStage.kind === "quiz" && !quizGatePassed
      ? "Acerte o quiz para liberar a prática."
      : currentStage.kind === "practice" && !practiceGatePassed
      ? "Complete a prática guiada para liberar o desafio."
      : null;
  const currentStageCanAdvance = !stageRequirement;

  const canEnterStageIndex = (index: number) => {
    const targetStage = stages[index];
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
    const stageIndex = stages.findIndex((item) => item.id === stage);
    const targetStage = stages[stageIndex];
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
    const nextStage = stages[Math.min(Math.max(index, 0), stages.length - 1)];
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

  return {
    stages,
    activeStageIndex,
    currentStage,
    stageProgress,
    isFirstStage,
    isCodeStage,
    stageNotice,
    setStageNotice,
    setActiveStage,
    quizGatePassed,
    practiceGatePassed,
    setQuizCompleted,
    setPracticeCompleted,
    stageRequirement,
    currentStageCanAdvance,
    nextStageCta,
    canEnterStageIndex,
    goToStage,
    goToNextStage,
    goToPreviousStage,
  };
}
