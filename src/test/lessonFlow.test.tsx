import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLessonStages, splitTheorySlides } from "@/hooks/useLessonStages";
import { useLessonRunner } from "@/hooks/useLessonRunner";
import { readJson, writeJson, readString, writeString, removeKey } from "@/lib/storage";
import type { Course, Lesson } from "@/data/mockData";

vi.mock("@/utils/codeValidator", () => ({ validateCode: vi.fn() }));
vi.mock("@/utils/spacedRepetition", () => ({ recordReview: vi.fn() }));
vi.mock("@/utils/conceptMastery", () => ({ getLessonConcepts: vi.fn(() => []) }));
vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

import { validateCode } from "@/utils/codeValidator";
import { recordReview } from "@/utils/spacedRepetition";

const mockedValidateCode = vi.mocked(validateCode);

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  window.scrollTo = vi.fn();
});

describe("storage helpers", () => {
  it("round-trips JSON values", () => {
    writeJson("test-key", { a: 1, b: ["x"] });
    expect(readJson("test-key", null)).toEqual({ a: 1, b: ["x"] });
  });

  it("returns the fallback when the key is missing", () => {
    expect(readJson("missing", { fallback: true })).toEqual({ fallback: true });
  });

  it("returns the fallback when the stored value is corrupt", () => {
    localStorage.setItem("corrupt", "{not json");
    expect(readJson("corrupt", "fallback")).toBe("fallback");
  });

  it("reads, writes, and removes plain strings", () => {
    writeString("str", "value");
    expect(readString("str")).toBe("value");
    removeKey("str");
    expect(readString("str")).toBeNull();
  });
});

describe("splitTheorySlides", () => {
  it("splits theory into slides on ## headings", () => {
    const slides = splitTheorySlides("intro\n## Parte 1\ntexto\n## Parte 2\nmais");
    expect(slides).toHaveLength(3);
    expect(slides[1]).toMatch(/^## Parte 1/);
  });

  it("returns the whole theory as one slide when there are no headings", () => {
    expect(splitTheorySlides("apenas um bloco")).toEqual(["apenas um bloco"]);
  });
});

describe("useLessonStages", () => {
  const args = { theorySlides: ["a", "b"], hasQuiz: true, alreadyCompleted: false };

  it("builds plan → theory ×2 → quiz → practice → challenge → code", () => {
    const { result } = renderHook(() => useLessonStages(args));
    expect(result.current.stages.map((s) => s.kind)).toEqual([
      "plan",
      "theory",
      "theory",
      "quiz",
      "practice",
      "challenge",
      "code",
    ]);
    expect(result.current.currentStage.kind).toBe("plan");
  });

  it("omits the quiz stage when the lesson has no quiz", () => {
    const { result } = renderHook(() =>
      useLessonStages({ ...args, hasQuiz: false, theorySlides: ["a"] }),
    );
    expect(result.current.stages.map((s) => s.kind)).toEqual([
      "plan",
      "theory",
      "practice",
      "challenge",
      "code",
    ]);
  });

  it("blocks jumping to practice before the quiz is passed", () => {
    const { result } = renderHook(() => useLessonStages(args));
    act(() => result.current.goToStage("practice"));
    expect(result.current.currentStage.kind).toBe("plan");
    expect(result.current.stageNotice).toMatch(/acerte o quiz/i);
  });

  it("holds the learner on the quiz stage until it is passed", () => {
    const { result } = renderHook(() => useLessonStages(args));
    act(() => result.current.goToStage("quiz"));
    expect(result.current.currentStage.kind).toBe("quiz");

    act(() => result.current.goToNextStage());
    expect(result.current.currentStage.kind).toBe("quiz");
    expect(result.current.stageNotice).toMatch(/acerte o quiz/i);

    act(() => result.current.setQuizCompleted(true));
    act(() => result.current.goToNextStage());
    expect(result.current.currentStage.kind).toBe("practice");
  });

  it("blocks the challenge until guided practice is complete", () => {
    const { result } = renderHook(() => useLessonStages(args));
    act(() => result.current.setQuizCompleted(true));
    act(() => result.current.goToStage("challenge"));
    expect(result.current.currentStage.kind).toBe("plan");

    act(() => result.current.setPracticeCompleted(true));
    act(() => result.current.goToStage("challenge"));
    expect(result.current.currentStage.kind).toBe("challenge");
  });

  it("lets already-completed lessons skip every gate", () => {
    const { result } = renderHook(() => useLessonStages({ ...args, alreadyCompleted: true }));
    act(() => result.current.goToStage("code"));
    expect(result.current.currentStage.kind).toBe("code");
  });

  it("always allows navigating backwards", () => {
    const { result } = renderHook(() => useLessonStages({ ...args, alreadyCompleted: true }));
    act(() => result.current.goToStage("code"));
    act(() => result.current.goToStage("plan"));
    expect(result.current.currentStage.kind).toBe("plan");
  });
});

describe("useLessonRunner", () => {
  const lesson: Lesson = {
    id: "t-1",
    title: "Teste",
    description: "Imprima oi",
    theory: "## Teoria",
    starterCode: "// comece aqui",
    solution: 'console.log("oi")',
    expectedOutput: "oi",
    hints: ["use console.log", "passe a string oi"],
    xpReward: 10,
  };
  const course = { id: "c-1", language: "JavaScript", lessons: [] } as unknown as Course;

  const renderRunner = (overrides: { alreadyCompleted?: boolean; completeLesson?: () => boolean } = {}) => {
    const completeLesson = vi.fn(overrides.completeLesson ?? (() => true));
    const forceCodeStage = vi.fn();
    const goToCodeStage = vi.fn();
    const setCode = vi.fn();
    const hook = renderHook(() =>
      useLessonRunner({
        lesson,
        course,
        alreadyCompleted: overrides.alreadyCompleted ?? false,
        xpAward: 10,
        code: 'console.log("oi")',
        setCode,
        completeLesson,
        forceCodeStage,
        goToCodeStage,
      }),
    );
    return { hook, completeLesson, forceCodeStage, goToCodeStage, setCode };
  };

  afterEach(() => {
    vi.useRealTimers();
  });

  it("awards XP and schedules an SM-2 review on a correct run", () => {
    vi.useFakeTimers();
    mockedValidateCode.mockReturnValue({ level: "exact", message: "" } as ReturnType<typeof validateCode>);
    const { hook, completeLesson, forceCodeStage } = renderRunner();

    act(() => {
      hook.result.current.handleRun();
      vi.advanceTimersByTime(800);
    });

    expect(forceCodeStage).toHaveBeenCalled();
    expect(completeLesson).toHaveBeenCalledWith("t-1", 10, "c-1");
    expect(recordReview).toHaveBeenCalledWith("t-1", 5);
    expect(hook.result.current.editor.isCorrect).toBe(true);
    expect(hook.result.current.editor.output).toBe("oi");
  });

  it("does not re-award XP when the lesson is already completed", () => {
    vi.useFakeTimers();
    mockedValidateCode.mockReturnValue({ level: "exact", message: "" } as ReturnType<typeof validateCode>);
    const { hook, completeLesson } = renderRunner({ alreadyCompleted: true });

    act(() => {
      hook.result.current.handleRun();
      vi.advanceTimersByTime(800);
    });

    expect(completeLesson).not.toHaveBeenCalled();
    expect(hook.result.current.editor.isCorrect).toBe(true);
  });

  it("escalates a direct hint from the second failed attempt", () => {
    vi.useFakeTimers();
    mockedValidateCode.mockReturnValue({
      level: "wrong",
      message: "Saída diferente do esperado.",
      errorKind: "output_mismatch",
    } as ReturnType<typeof validateCode>);
    const { hook } = renderRunner();

    act(() => {
      hook.result.current.handleRun();
      vi.advanceTimersByTime(800);
    });
    expect(hook.result.current.editor.isCorrect).toBe(false);
    expect(hook.result.current.editor.output).not.toMatch(/Dica direta/);

    act(() => {
      hook.result.current.handleRun();
      vi.advanceTimersByTime(800);
    });
    expect(hook.result.current.editor.output).toMatch(/Dica direta: use console.log/);
    expect(hook.result.current.editor.hintIndex).toBe(0);
  });

  it("flags a struggling pace after three failed attempts", () => {
    vi.useFakeTimers();
    mockedValidateCode.mockReturnValue({
      level: "wrong",
      message: "erro",
      errorKind: "output_mismatch",
    } as ReturnType<typeof validateCode>);
    const { hook } = renderRunner();

    for (let i = 0; i < 3; i++) {
      act(() => {
        hook.result.current.handleRun();
        vi.advanceTimersByTime(800);
      });
    }
    expect(hook.result.current.editor.paceMode).toBe("struggling");
  });

  it("requires a confirmation before revealing the solution", () => {
    const { hook, setCode } = renderRunner();

    act(() => hook.result.current.handleRevealSolution());
    expect(hook.result.current.solutionWarned).toBe(true);
    expect(hook.result.current.showSolution).toBe(false);
    expect(setCode).not.toHaveBeenCalled();

    act(() => hook.result.current.handleRevealSolution());
    expect(hook.result.current.showSolution).toBe(true);
    expect(setCode).toHaveBeenCalledWith(lesson.solution);
  });

  it("resets code, feedback, and attempt count", () => {
    const { hook, setCode } = renderRunner();
    act(() => hook.result.current.handleReset());
    expect(setCode).toHaveBeenCalledWith(lesson.starterCode);
    expect(hook.result.current.editor.output).toBeNull();
    expect(hook.result.current.editor.hintIndex).toBe(-1);
  });
});
