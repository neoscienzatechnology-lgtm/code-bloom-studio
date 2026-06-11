import { useRef, useState } from "react";
import confetti from "canvas-confetti";
import type { Course, Lesson } from "@/data/mockData";
import { useLessonEditor } from "@/hooks/useLessonEditor";
import { useAttemptTracker } from "@/hooks/useAttemptTracker";
import { validateCode } from "@/utils/codeValidator";
import { getLessonConcepts } from "@/utils/conceptMastery";
import { recordReview } from "@/utils/spacedRepetition";
import { track } from "@/lib/analytics";

interface UseLessonRunnerArgs {
  lesson: Lesson;
  course: Course;
  alreadyCompleted: boolean;
  xpAward: number;
  code: string;
  setCode: (code: string) => void;
  completeLesson: (lessonId: string, xp: number, courseId?: string) => boolean;
  /** Forces the stage machine onto the code stage (no gating/scroll) — used by run. */
  forceCodeStage: () => void;
  /** Navigates to the code stage through the stage machine (gating + scroll). */
  goToCodeStage: () => void;
}

function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.7 },
    colors: ["#0A7C78", "#7AD7A7", "#FF9F2F", "#169C93"],
  });
}

/**
 * Business logic of the lesson code challenge: running/validating the
 * student's code, awarding XP + spaced-repetition reviews, escalating hints
 * on repeated failures, and the solution-reveal flow.
 * Lesson-scoped state — mount it inside a component keyed by lesson id.
 */
export function useLessonRunner({
  lesson,
  course,
  alreadyCompleted,
  xpAward,
  code,
  setCode,
  completeLesson,
  forceCodeStage,
  goToCodeStage,
}: UseLessonRunnerArgs) {
  const { state: editor, patch, advanceHint } = useLessonEditor();
  const { registerFailure, resetLesson, getAttempts } = useAttemptTracker();
  const [showSolution, setShowSolution] = useState(false);
  const [solutionWarned, setSolutionWarned] = useState(false);
  const runLockedRef = useRef(false);

  const { running, hintIndex, paceMode, bonusActive } = editor;

  const handleRun = () => {
    if (running || runLockedRef.current) return;
    runLockedRef.current = true;
    forceCodeStage();
    patch({ running: true });
    setTimeout(() => {
      const result = validateCode(code, lesson.expectedOutput, lesson.solution, {
        starterCode: lesson.starterCode,
        testCases: lesson.testCases,
      });
      const correct = result.level === "exact" || result.level === "flexible";
      const nextIsCorrect = correct ? true : result.level === "close" ? null : false;
      track("code_run", {
        lessonId: lesson.id,
        courseId: course.id,
        correct,
        level: result.level,
        errorKind: correct ? undefined : result.errorKind,
        attempts: getAttempts(lesson.id) + (correct ? 0 : 1),
      });

      if (correct) {
        const priorAttempts = getAttempts(lesson.id);
        recordReview(lesson.id, Math.max(3, 5 - priorAttempts));
        resetLesson(lesson.id);
        const awardedXp = !alreadyCompleted && completeLesson(lesson.id, xpAward, course.id);
        if (awardedXp) track("lesson_completed", { lessonId: lesson.id, courseId: course.id, xp: xpAward });
        const nextPaceMode = priorAttempts === 0 && !alreadyCompleted && !bonusActive ? "thriving" : null;
        patch({
          isCorrect: nextIsCorrect,
          output: lesson.expectedOutput,
          reflectiveQ: null,
          paceMode: nextPaceMode,
          showXP: awardedXp,
          running: false,
        });
        if (awardedXp) {
          setTimeout(() => patch({ showXP: false }), 1500);
          fireConfetti();
        }
      } else {
        registerFailure(lesson.id, result.errorKind, getLessonConcepts(lesson));
        const attempts = getAttempts(lesson.id) + 1;
        let composed = result.message;
        let nextHintIndex = hintIndex;

        if (attempts >= 2 && lesson.hints.length > 0) {
          const nextHintIdx = Math.min(hintIndex + 1, lesson.hints.length - 1);
          if (nextHintIdx > hintIndex) nextHintIndex = nextHintIdx;
          composed += `\n\n💡 Dica direta: ${lesson.hints[nextHintIdx]}`;
        }

        patch({
          isCorrect: nextIsCorrect,
          output: composed,
          reflectiveQ: result.reflectiveQuestion ?? null,
          hintIndex: nextHintIndex,
          paceMode: attempts >= 3 ? "struggling" : paceMode,
          running: false,
        });
      }
      runLockedRef.current = false;
    }, 800);
  };

  const handleHint = () => {
    advanceHint(lesson.hints.length - 1);
  };

  const handleReset = () => {
    setCode(lesson.starterCode);
    patch({ output: null, reflectiveQ: null, isCorrect: null, hintIndex: -1 });
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

  const applyGuidedStarter = () => {
    const guide = `// Guia da Capy\n// 1. Releia o objetivo: ${lesson.learningObjective ?? lesson.description}\n// 2. Compare cada linha com a saída esperada: ${lesson.expectedOutput}\n// 3. Use uma dica por vez antes de testar de novo.\n\n${lesson.starterCode}`;
    setCode(guide);
    patch({ output: null, reflectiveQ: null, isCorrect: null, paceMode: null });
    goToCodeStage();
  };

  // "Versão preparatória": começa do starterCode com guia em comentário
  const applyPreparatoryStarter = () => {
    const guide = `// Versão guiada — siga os passos abaixo:\n// 1. Releia o exercício\n// 2. Use o exemplo da teoria como base\n// 3. Saída esperada: ${lesson.expectedOutput}\n\n${lesson.starterCode}`;
    setCode(guide);
    patch({ output: null, isCorrect: null, paceMode: null });
  };

  return {
    editor,
    patch,
    getAttempts,
    showSolution,
    solutionWarned,
    handleRun,
    handleHint,
    handleReset,
    handleRevealSolution,
    applyGuidedStarter,
    applyPreparatoryStarter,
  };
}
