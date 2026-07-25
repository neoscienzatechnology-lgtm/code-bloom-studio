import { useRef, useState } from "react";
import confetti from "canvas-confetti";
import type { Course, Lesson } from "@/data/mockData";
import { useLessonEditor } from "@/hooks/useLessonEditor";
import { useAttemptTracker } from "@/hooks/useAttemptTracker";
import { validateCode, type ErrorKind } from "@/utils/codeValidator";
import { evaluatePythonRun } from "@/utils/pythonOutput";
import { evaluateJsRun } from "@/utils/jsOutput";
import { isPythonRuntimeSupported, runPython } from "@/lib/pythonRunner";
import { runJs } from "@/lib/jsRunner";
import { runsRealJs } from "@/data/jsRuntimeLessons";
import { evaluateSqlRun } from "@/utils/sqlOutput";
import { isSqlRuntimeSupported, runSql } from "@/lib/sqlRunner";
import { SQL_ORDER_MATTERS, SQL_SEED, SQL_VERIFICATION_QUERIES, isSqlLesson } from "@/data/sqlSandbox";
import { getLessonConcepts } from "@/utils/conceptMastery";
import { recordReview } from "@/utils/spacedRepetition";
import { track } from "@/lib/analytics";
import { feedbackCorrect, feedbackWrong } from "@/lib/feedback";

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

  // Aplica o resultado de uma execução (heurística ou Python real) ao estado.
  const finishRun = (params: {
    correct: boolean;
    nextIsCorrect: boolean | null;
    level: string;
    message: string;
    errorKind?: ErrorKind;
    reflectiveQuestion?: string | null;
  }) => {
    const { correct, nextIsCorrect, level, message, errorKind, reflectiveQuestion } = params;
    if (correct) feedbackCorrect();
    else if (nextIsCorrect === false) feedbackWrong();
    track("code_run", {
      lessonId: lesson.id,
      courseId: course.id,
      correct,
      level,
      errorKind: correct ? undefined : errorKind,
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
        output: message,
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
      registerFailure(lesson.id, errorKind, getLessonConcepts(lesson));
      const attempts = getAttempts(lesson.id) + 1;
      let composed = message;
      let nextHintIndex = hintIndex;

      if (attempts >= 2 && lesson.hints.length > 0) {
        const nextHintIdx = Math.min(hintIndex + 1, lesson.hints.length - 1);
        if (nextHintIdx > hintIndex) nextHintIndex = nextHintIdx;
        composed += `\n\n💡 Dica direta: ${lesson.hints[nextHintIdx]}`;
      }

      patch({
        isCorrect: nextIsCorrect,
        output: composed,
        reflectiveQ: reflectiveQuestion ?? null,
        hintIndex: nextHintIndex,
        paceMode: attempts >= 3 ? "struggling" : paceMode,
        running: false,
      });
    }
    runLockedRef.current = false;
  };

  // Caminho heurístico (JS e linguagens sem runtime): valida por padrões.
  const runValidator = () => {
    const result = validateCode(code, lesson.expectedOutput, lesson.solution, {
      starterCode: lesson.starterCode,
      testCases: lesson.testCases,
    });
    const correct = result.level === "exact" || result.level === "flexible";
    finishRun({
      correct,
      nextIsCorrect: correct ? true : result.level === "close" ? null : false,
      level: result.level,
      message: correct ? lesson.expectedOutput : result.message,
      errorKind: result.errorKind,
      reflectiveQuestion: result.reflectiveQuestion,
    });
  };

  const isPython = course.language.trim().toLowerCase() === "python";
  // JS também roda de verdade (worker), nas lições verificadas em
  // `jsRuntimeLessons.ts`. As demais seguem no validador heurístico.
  const isRealJs = !isPython && runsRealJs(lesson.id);
  const isSql = isSqlLesson(course.language);

  const handleRun = () => {
    if (running || runLockedRef.current) return;
    runLockedRef.current = true;
    forceCodeStage();
    patch({ running: true });

    // Python roda DE VERDADE no navegador (Pyodide, sob demanda). Se o runtime
    // não carregar (offline/sem suporte), cai no validador heurístico.
    if (isPython && isPythonRuntimeSupported()) {
      patch({ output: "⏳ Carregando o Python e rodando seu código…", isCorrect: null, reflectiveQ: null });
      runPython(code)
        .then((res) => {
          const ev = evaluatePythonRun(res.stdout, res.stderr, res.error, lesson.expectedOutput);
          finishRun({
            correct: ev.correct,
            nextIsCorrect: ev.correct,
            level: ev.correct ? "exact" : "wrong",
            message: ev.message,
            errorKind: ev.errorKind,
          });
        })
        .catch((err: unknown) => {
          // O código rodou e estourou o tempo (provável laço infinito) → erra,
          // não cai na heurística (que poderia marcar como certo sem rodar).
          if (err instanceof Error && err.message === "exec-timeout") {
            finishRun({
              correct: false,
              nextIsCorrect: false,
              level: "wrong",
              message: "Tempo esgotado. Seu código demorou demais — verifique se há um laço infinito.",
              errorKind: "syntax",
            });
          } else {
            // Pyodide indisponível (sem suporte/offline) → validador heurístico.
            runValidator();
          }
        });
      return;
    }

    // SQL roda num SQLite de verdade (sql.js) contra o banco-escola: a
    // correção compara o RESULTADO da consulta, não o texto dela.
    if (isSql && isSqlRuntimeSupported()) {
      patch({ output: "⏳ Abrindo o banco de dados e rodando sua consulta…", isCorrect: null, reflectiveQ: null });
      runSql(SQL_SEED, code, SQL_VERIFICATION_QUERIES[lesson.id])
        .then((res) => {
          if (res.error === "runtime-unavailable") {
            runValidator();
            return;
          }
          const ev = evaluateSqlRun(res.result, res.error, lesson.expectedOutput, {
            orderMatters: SQL_ORDER_MATTERS.has(lesson.id),
          });
          finishRun({
            correct: ev.correct,
            nextIsCorrect: ev.correct,
            level: ev.correct ? "exact" : "wrong",
            message: ev.message,
            errorKind: ev.errorKind,
          });
        })
        .catch(() => runValidator());
      return;
    }

    // JavaScript roda no worker: erro real do motor e comparação de saída de
    // verdade, em vez de semelhança de texto. Falhou o runtime → heurística.
    if (isRealJs) {
      runJs(code)
        .then((res) => {
          if (res.error && !res.output) {
            // "Execução interrompida"/timeout do runner não é erro do aluno
            if (/interrompida|Tempo esgotado/i.test(res.error)) {
              finishRun({
                correct: false,
                nextIsCorrect: false,
                level: "wrong",
                message: res.error,
                errorKind: "syntax",
              });
              return;
            }
          }
          const ev = evaluateJsRun(res.output, res.error, lesson.expectedOutput);
          finishRun({
            correct: ev.correct,
            nextIsCorrect: ev.correct,
            level: ev.correct ? "exact" : "wrong",
            message: ev.message,
            errorKind: ev.errorKind,
          });
        })
        .catch(() => runValidator());
      return;
    }

    setTimeout(runValidator, 800);
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
    const guide = `// Guia\n// 1. Releia o objetivo: ${lesson.learningObjective ?? lesson.description}\n// 2. Compare cada linha com a saída esperada: ${lesson.expectedOutput}\n// 3. Use uma dica por vez antes de testar de novo.\n\n${lesson.starterCode}`;
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
