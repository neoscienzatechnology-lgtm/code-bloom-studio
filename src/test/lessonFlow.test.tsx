import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { buildLessonCards, splitTheoryChunks, cardRequiresCompletion } from "@/utils/lessonCards";
import { getConceptFamily, isStackConcept } from "@/utils/conceptDiagram";
import { isWebglAvailable, prefersReducedMotion } from "@/utils/webgl";
import { classifyTheoryLine, splitInlineTokens } from "@/utils/theoryMarkup";
import { tokenizeCodeLine, buildAssembleData, TOKEN_SEP } from "@/utils/assembleBlocks";
import { courses } from "@/data/mockData";
import { useLessonRunner } from "@/hooks/useLessonRunner";
import { isInterstitialDue } from "@/lib/ads";
import { ADS_CONFIG } from "@/config/ads";
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

describe("theory markup", () => {
  it("marks calls and keywords as code inside Portuguese prose", () => {
    const tokens = splitInlineTokens("use sum(notas) e print para ver o total");
    expect(tokens).toContainEqual({ kind: "code", value: "sum(notas)" });
    expect(tokens).toContainEqual({ kind: "code", value: "print" });
  });

  it("does not treat the Portuguese verb 'for' as code", () => {
    const tokens = splitInlineTokens("se a regra for verdadeira, siga em frente");
    expect(tokens.every((token) => token.kind === "text")).toBe(true);
  });

  it("keeps backticks and bold as explicit markup", () => {
    const tokens = splitInlineTokens("o `valor` é **importante** aqui");
    expect(tokens).toContainEqual({ kind: "code", value: "valor" });
    expect(tokens).toContainEqual({ kind: "strong", value: "importante" });
  });

  it("classifies steps, bullets, labels and operator lines", () => {
    expect(classifyTheoryLine("1. Releia o objetivo")).toBe("step");
    expect(classifyTheoryLine("- item da lista")).toBe("bullet");
    expect(classifyTheoryLine("Exemplos:")).toBe("label");
    expect(classifyTheoryLine("idade >= 18")).toBe("opline");
    expect(classifyTheoryLine("saldo > 0")).toBe("opline");
    expect(classifyTheoryLine("Uma frase comum de teoria.")).toBe("text");
    expect(classifyTheoryLine("Uma frase longa que menciona algo: e segue explicando bem mais coisas.")).toBe("text");
  });
});

describe("analytics no-op safety", () => {
  it("never throws when no key is configured", async () => {
    const analytics = await import("@/lib/analytics");
    expect(analytics.isAnalyticsEnabled()).toBe(false);
    expect(() => analytics.track("evento", { a: 1 })).not.toThrow();
    expect(() => analytics.trackPageview("/x")).not.toThrow();
    expect(() => analytics.identifyUser("id")).not.toThrow();
    expect(() => analytics.resetAnalyticsUser()).not.toThrow();
    expect(() => analytics.captureError(new Error("boom"))).not.toThrow();
    await expect(analytics.initAnalytics()).resolves.toBeUndefined();
  });
});

describe("concept diagram mapping", () => {
  it("maps fragmented tags to the same family", () => {
    expect(getConceptFamily(["lists"])).toBe("list");
    expect(getConceptFamily(["arrays"])).toBe("list");
    expect(getConceptFamily(["conditionals"])).toBe("condition");
    expect(getConceptFamily(["comparison"])).toBe("condition");
    expect(getConceptFamily(["react-native"])).toBe("mobile");
    expect(getConceptFamily(["tag-inexistente"])).toBeNull();
    expect(getConceptFamily(undefined)).toBeNull();
  });

  it("lets the first matching tag decide the diagram", () => {
    expect(getConceptFamily(["tag-inexistente", "loops", "lists"])).toBe("loop");
  });

  it("resolves a diagram family for at least 80% of all lessons", () => {
    const lessons = courses.flatMap((course) => course.lessons);
    const covered = lessons.filter((lesson) => getConceptFamily(lesson.concepts) !== null).length;
    expect(covered / lessons.length).toBeGreaterThanOrEqual(0.8);
  });
});

describe("3D stack capability gating", () => {
  it("detects stack lessons by concept tag", () => {
    expect(isStackConcept(["stack", "lifo", "data-structures"])).toBe(true);
    expect(isStackConcept(["pilha"])).toBe(true);
    expect(isStackConcept(["queue", "fifo"])).toBe(false);
    expect(isStackConcept(undefined)).toBe(false);
  });

  it("at least one shipped lesson opts into the 3D stack", () => {
    const lessons = courses.flatMap((course) => course.lessons);
    expect(lessons.some((lesson) => isStackConcept(lesson.concepts))).toBe(true);
  });

  it("probes WebGL and reduced-motion without throwing in a headless env", () => {
    expect(() => isWebglAvailable()).not.toThrow();
    expect(typeof isWebglAvailable()).toBe("boolean");
    expect(() => prefersReducedMotion()).not.toThrow();
    expect(typeof prefersReducedMotion()).toBe("boolean");
  });
});

describe("ad frequency cap", () => {
  const NOW = 10_000_000;
  const quietMs = ADS_CONFIG.interstitialMinIntervalMinutes * 60_000;

  it("does not show before enough lessons are completed", () => {
    expect(
      isInterstitialDue({ lessonsSinceLastAd: ADS_CONFIG.interstitialEveryNLessons - 1, lastAdShownAt: 0 }, NOW),
    ).toBe(false);
  });

  it("shows after N lessons when no ad was shown yet", () => {
    expect(
      isInterstitialDue({ lessonsSinceLastAd: ADS_CONFIG.interstitialEveryNLessons, lastAdShownAt: 0 }, NOW),
    ).toBe(true);
  });

  it("respects the quiet interval after a recent ad", () => {
    const recent = NOW - quietMs + 1_000;
    expect(
      isInterstitialDue({ lessonsSinceLastAd: ADS_CONFIG.interstitialEveryNLessons, lastAdShownAt: recent }, NOW),
    ).toBe(false);
  });

  it("shows again once both lesson count and interval are satisfied", () => {
    const old = NOW - quietMs - 1_000;
    expect(
      isInterstitialDue({ lessonsSinceLastAd: ADS_CONFIG.interstitialEveryNLessons, lastAdShownAt: old }, NOW),
    ).toBe(true);
  });
});

describe("lesson cards (micro-learning flow)", () => {
  const fullLesson = {
    id: "c-1",
    title: "Teste",
    description: "Imprima oi",
    theory: "Explicação curta.\n\nExemplo prático:\nprint('oi')\n\nErro comum:\nEsquecer aspas.\n\nReferência rápida:\n- print exibe",
    starterCode: "",
    solution: "print('oi')",
    expectedOutput: "oi",
    hints: [],
    xpReward: 10,
    learningObjective: "Aprender a imprimir.",
    analogy: "É como falar em voz alta.",
    codeExample: "print('oi')",
    commonMistake: "Esquecer aspas.",
    contrastExample: { wrong: "print(oi)", right: "print('oi')", explanation: "Texto pede aspas." },
    quiz: [{ question: "?", options: ["a", "b"], correctIndex: 0, explanation: "" }],
    practiceActivities: [
      {
        id: "p1",
        type: "fill-code" as const,
        title: "t",
        prompt: "p",
        correctAnswer: "x",
        successFeedback: "s",
        errorFeedback: "e",
        hint: "h",
      },
    ],
  } as unknown as Lesson;

  it("starts with confidence + objective and ends with code-intro", () => {
    const kinds = buildLessonCards(fullLesson).map((card) => card.kind);
    expect(kinds[0]).toBe("confidence");
    expect(kinds[1]).toBe("objective");
    expect(kinds[kinds.length - 1]).toBe("code-intro");
  });

  it("includes one card per available pedagogical asset", () => {
    const kinds = buildLessonCards(fullLesson).map((card) => card.kind);
    for (const kind of ["theory", "analogy", "example", "mistake", "contrast", "quiz", "practice"]) {
      expect(kinds).toContain(kind);
    }
  });

  it("omits cards for missing assets", () => {
    const minimal = { ...fullLesson, analogy: undefined, contrastExample: undefined, quiz: undefined, practiceActivities: undefined } as unknown as Lesson;
    const kinds = buildLessonCards(minimal).map((card) => card.kind);
    expect(kinds).not.toContain("analogy");
    expect(kinds).not.toContain("contrast");
    expect(kinds).not.toContain("quiz");
    expect(kinds).not.toContain("practice");
  });

  it("strips builder-generated sections from theory chunks", () => {
    const chunks = splitTheoryChunks(fullLesson.theory);
    expect(chunks.join(" ")).not.toMatch(/Exemplo prático|Erro comum|Referência rápida/);
    expect(chunks[0]).toContain("Explicação curta.");
  });

  it("splits long markdown sections into bite-sized chunks", () => {
    const long = `# Título\n\n## Parte 1\n${"frase. ".repeat(80)}\n\n## Parte 2\ncurta`;
    const chunks = splitTheoryChunks(long);
    expect(chunks.length).toBeGreaterThan(2);
    expect(chunks.every((chunk) => !chunk.startsWith("#"))).toBe(true);
  });

  it("marks only the first theory card for the concept diagram", () => {
    const multi = { ...fullLesson, theory: "## Um\nprimeiro bloco\n\n## Dois\nsegundo bloco" } as unknown as Lesson;
    const theoryCards = buildLessonCards(multi).filter((card) => card.kind === "theory");
    expect(theoryCards.length).toBeGreaterThan(1);
    expect(theoryCards[0]).toMatchObject({ first: true });
    expect(theoryCards.slice(1).every((card) => card.kind === "theory" && !card.first)).toBe(true);
  });

  it("requires completion only on interactive cards", () => {
    expect(cardRequiresCompletion("contrast")).toBe(true);
    expect(cardRequiresCompletion("quiz")).toBe(true);
    expect(cardRequiresCompletion("practice")).toBe(true);
    expect(cardRequiresCompletion("assemble")).toBe(true);
    expect(cardRequiresCompletion("theory")).toBe(false);
    expect(cardRequiresCompletion("code-intro")).toBe(false);
  });

  it("adds an assemble card right before code-intro when the solution has a clean line", () => {
    const cards = buildLessonCards(fullLesson);
    const kinds = cards.map((card) => card.kind);
    expect(kinds).toContain("assemble");
    expect(kinds.indexOf("assemble")).toBe(kinds.indexOf("code-intro") - 1);

    const assemble = cards.find((card) => card.kind === "assemble");
    expect(assemble).toMatchObject({ kind: "assemble" });
    if (assemble?.kind === "assemble") {
      // O banco embaralhado é exatamente os tokens da resposta (sem distratores).
      expect([...assemble.shuffled].sort()).toEqual([...assemble.tokens].sort());
    }
  });
});

describe("assemble blocks engine", () => {
  it("tokenizes a code line keeping strings whole", () => {
    expect(tokenizeCodeLine("print('oi')")).toEqual(["print", "(", "'oi'", ")"]);
    expect(tokenizeCodeLine("const total = preco * qtd")).toEqual([
      "const",
      "total",
      "=",
      "preco",
      "*",
      "qtd",
    ]);
    expect(tokenizeCodeLine("idade >= 18")).toEqual(["idade", ">=", "18"]);
  });

  it("keeps a string with spaces and commas as a single block", () => {
    const tokens = tokenizeCodeLine('print("Olá, mundo!")');
    expect(tokens).toEqual(["print", "(", '"Olá, mundo!"', ")"]);
    // O separador de controle nunca colide com o conteúdo do bloco.
    expect(tokens.join(TOKEN_SEP).split(TOKEN_SEP)).toEqual(tokens);
  });

  it("builds a solvable, deterministic exercise from a solution", () => {
    const a = buildAssembleData("print('oi')", "c-1");
    const b = buildAssembleData("print('oi')", "c-1");
    expect(a).not.toBeNull();
    expect(a).toEqual(b); // mesma seed → mesma ordem
    if (a) {
      expect([...a.shuffled].sort()).toEqual([...a.tokens].sort());
      expect(a.shuffled.length).toBe(a.tokens.length);
    }
  });

  it("varies the shuffle across lessons", () => {
    const a = buildAssembleData("const total = preco * qtd", "10-4");
    const b = buildAssembleData("const total = preco * qtd", "6-2");
    expect(a?.shuffled.join(TOKEN_SEP)).not.toBe(b?.shuffled.join(TOKEN_SEP));
  });

  it("returns null when no line makes a good exercise", () => {
    expect(buildAssembleData("", "x")).toBeNull();
    expect(buildAssembleData("return <View><Text>oi</Text></View>;", "x")).toBeNull();
    expect(buildAssembleData("ok", "x")).toBeNull(); // poucos blocos
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
