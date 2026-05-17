import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuizSection from "@/components/QuizSection";
import GuidedPractice from "@/components/GuidedPractice";
import { buildLessonBlueprint } from "@/utils/pedagogy";
import { buildDailyReviewPlan } from "@/utils/dailyReview";
import { augmentCourse } from "@/data/checkpoints";
import { buildConceptMasteryPlan, getWeakConceptIds } from "@/utils/conceptMastery";
import { buildConceptTrainingSession } from "@/utils/weakConceptTraining";
import { buildAchievements } from "@/utils/achievements";
import { buildStudyStats } from "@/utils/studyStats";
import { ACTIVITY_COURSE_IDS, resolveProgressCourseId } from "@/hooks/useProgress";
import { courses, type Course, type Lesson } from "@/data/mockData";
import { appCatalogSummary, courseCatalog } from "@/data/courseCatalog";
import { learningPaths } from "@/data/learningPaths";
import { projects } from "@/data/projects";
import { buildReferenceIndex, filterReferenceEntries, getReferenceLanguages } from "@/utils/referenceIndex";
import { selectNextLesson, selectNextPathCourse, selectPathStartCourse } from "@/utils/learningPathProgress";
import { validateCode } from "@/utils/codeValidator";

const lesson: Lesson = {
  id: "lesson-1",
  title: "Olá, Mundo!",
  description: "Use print() para exibir Olá, Mundo!",
  theory: "print() mostra informações na tela.",
  starterCode: "",
  solution: 'print("Olá, Mundo!")',
  expectedOutput: "Olá, Mundo!",
  hints: ["Use print()."],
  xpReward: 10,
  quiz: [
    {
      question: "Qual função exibe texto?",
      options: ["input()", "print()", "len()", "range()"],
      correctIndex: 1,
      explanation: "print() mostra texto no console.",
    },
  ],
};

const course: Course = {
  id: "course-1",
  title: "Python",
  language: "Python",
  emoji: "PY",
  level: "Iniciante",
  duration: "1h",
  students: 1,
  progress: 0,
  color: "quest-yellow",
  lessons: [lesson],
  tags: [],
  description: "Curso de Python.",
};

const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".html", ".md", ".sql"]);

function listTextFiles(root: string): string[] {
  if (!existsSync(root)) return [];

  return readdirSync(root).flatMap((entry) => {
    const file = join(root, entry);
    const stat = statSync(file);

    if (stat.isDirectory()) return listTextFiles(file);
    return textExtensions.has(extname(file)) ? [file] : [];
  });
}

describe("portuguese text encoding", () => {
  it("does not ship common mojibake sequences in source text", () => {
    const suspicious = /(\u00C3[\u0080-\u00BF]|\u00C2[\u0080-\u00BF]|\u00F0\u0178[\u0080-\u00BF]|\u00EF\u00B8[\u0080-\u00BF]|\u00E2[\u0080-\u00BF]{1,2})/;
    const files = ["src", "public", "supabase"].flatMap((root) => listTextFiles(join(process.cwd(), root)));
    const offenders = files.filter((file) => suspicious.test(readFileSync(file, "utf8")));

    expect(offenders).toEqual([]);
  });
});

describe("study stats and achievements", () => {
  it("calculates streak, weekly activity and level from real progress", () => {
    const today = new Date(2026, 4, 11);
    const stats = buildStudyStats({
      totalXp: 750,
      completedLessons: ["10-1", "10-2"],
      activityDates: ["2026-05-09", "2026-05-10", "2026-05-11"],
      today,
    });

    expect(stats.level).toBe(2);
    expect(stats.xpIntoLevel).toBe(150);
    expect(stats.currentStreak).toBe(3);
    expect(stats.studiedToday).toBe(true);
    expect(stats.weeklyActivity.filter((day) => day.active)).toHaveLength(3);
  });

  it("unlocks achievements only when progress proves them", () => {
    const achievements = buildAchievements({
      completedLessons: ["10-1", "10-2", "10-3", "10-4", "daily-review-2026-05-11"],
      completedCoursesCount: 0,
      totalXp: 120,
      currentStreak: 1,
    });

    expect(achievements.find((item) => item.id === "first_lesson")?.unlocked).toBe(true);
    expect(achievements.find((item) => item.id === "foundation_start")?.unlocked).toBe(true);
    expect(achievements.find((item) => item.id === "daily_review")?.unlocked).toBe(true);
    expect(achievements.find((item) => item.id === "streak_3")?.unlocked).toBe(false);
  });

  it("maps non-course study events to virtual progress buckets for sync", () => {
    expect(resolveProgressCourseId("daily-review-2026-05-11")).toBe(ACTIVITY_COURSE_IDS.dailyReview);
    expect(resolveProgressCourseId("concept-training-variables-2026-05-11")).toBe(ACTIVITY_COURSE_IDS.conceptTraining);
    expect(resolveProgressCourseId("10-1-quiz")).toBe("10");
    expect(resolveProgressCourseId("loose-quiz")).toBe(ACTIVITY_COURSE_IDS.quiz);
    expect(resolveProgressCourseId("10-1", "10")).toBe("10");
  });
});

describe("pedagogy blueprint", () => {
  it("keeps the lightweight public catalog aligned with the full course content", () => {
    expect(courseCatalog).toHaveLength(courses.length);
    expect(appCatalogSummary.courseCount).toBe(courses.length);
    expect(appCatalogSummary.lessonCount).toBe(courses.reduce((total, item) => total + item.lessons.length, 0));
    expect(appCatalogSummary.projectCount).toBe(projects.length);
  });

  it("starts the first path with fundamentals even when stale JavaScript progress exists", () => {
    const frontendPath = learningPaths.find((path) => path.id === "frontend")!;
    const coursesWithProgress = courses.map((item) => ({
      ...item,
      realProgress: item.id === "2" ? 40 : 0,
    }));

    const nextCourse = selectNextPathCourse(coursesWithProgress, frontendPath);
    const nextLesson = selectNextLesson(nextCourse, []);

    expect(nextCourse.id).toBe("10");
    expect(nextLesson.id).toBe("10-1");
  });

  it("switches a new path away from partially completed shared fundamentals", () => {
    const backendPath = learningPaths.find((path) => path.id === "backend")!;
    const coursesWithProgress = courses.map((item) => ({
      ...item,
      realProgress: item.id === "10" ? 35 : 0,
    }));

    const targetCourse = selectPathStartCourse(coursesWithProgress, backendPath, "frontend");

    expect(targetCourse.id).toBe("2");
  });

  it("ships fundamentals as a logic-first W3-style course before JavaScript", () => {
    const fundamentals = courses.find((item) => item.id === "10");

    expect(fundamentals).toBeTruthy();
    expect(fundamentals!.language).toBe("Lógica");
    expect(fundamentals!.lessons.slice(0, 4).every((fundamentalLesson) => fundamentalLesson.solution.includes("mostrar"))).toBe(true);
    expect(fundamentals!.lessons[0].theory).not.toContain("JavaScript");
    expect(fundamentals!.lessons.slice(0, 4).every((fundamentalLesson) => !fundamentalLesson.commonMistake?.includes("JavaScript"))).toBe(true);
    expect(fundamentals!.lessons[4].theory).toContain("JavaScript como linguagem de apoio");
    fundamentals!.lessons.forEach((fundamentalLesson) => {
      expect(fundamentalLesson.tryItPrompt).toBeTruthy();
      expect(fundamentalLesson.commonMistake).toBeTruthy();
      expect(fundamentalLesson.reference?.length).toBeGreaterThanOrEqual(4);
      expect(fundamentalLesson.practiceActivities?.length).toBeGreaterThan(0);
      expect(fundamentalLesson.quiz?.[0]?.successFeedback).toBeTruthy();
      expect(fundamentalLesson.quiz?.[0]?.errorFeedback).toBeTruthy();
    });
  });

  it("creates a beginner-friendly plan for every lesson", () => {
    const blueprint = buildLessonBlueprint(course, lesson);

    expect(blueprint.objective).toContain("print");
    expect(blueprint.steps).toHaveLength(3);
    expect(blueprint.terms.length).toBeGreaterThan(0);
    expect(blueprint.microChecks.length).toBeGreaterThan(0);
    expect(blueprint.successCriteria).toContain('A saída final é equivalente a "Olá, Mundo!".');
  });

  it("ships the modern web courses with W3-inspired authorial learning structure", () => {
    const webCourses = ["9", "4", "2"].map((courseId) => courses.find((item) => item.id === courseId));

    expect(webCourses.every(Boolean)).toBe(true);
    webCourses.forEach((webCourse) => {
      expect(webCourse!.lessons.length).toBeGreaterThanOrEqual(12);
      webCourse!.lessons.forEach((webLesson) => {
        expect(webLesson.learningObjective).toBeTruthy();
        expect(webLesson.tryItPrompt).toBeTruthy();
        expect(webLesson.commonMistake).toBeTruthy();
        expect(webLesson.reference?.length).toBeGreaterThanOrEqual(4);
        expect(webLesson.practiceActivities?.length).toBeGreaterThan(0);
        expect(webLesson.quiz?.[0]?.successFeedback).toBeTruthy();
        expect(webLesson.quiz?.[0]?.errorFeedback).toBeTruthy();
      });
    });
  });

  it("ships Python and SQL as progressive reference-style courses", () => {
    const referenceCourses = ["1", "6"].map((courseId) => courses.find((item) => item.id === courseId));

    expect(referenceCourses.every(Boolean)).toBe(true);
    referenceCourses.forEach((referenceCourse) => {
      expect(referenceCourse!.lessons.length).toBeGreaterThanOrEqual(14);
      expect(referenceCourse!.lessons[0].level).toBe("Iniciante");
      referenceCourse!.lessons.forEach((referenceLesson) => {
        expect(referenceLesson.learningObjective).toBeTruthy();
        expect(referenceLesson.analogy).toBeTruthy();
        expect(referenceLesson.tryItPrompt).toBeTruthy();
        expect(referenceLesson.commonMistake).toBeTruthy();
        expect(referenceLesson.reference?.length).toBeGreaterThanOrEqual(4);
        expect(referenceLesson.practiceActivities?.[0]?.successFeedback).toBeTruthy();
        expect(referenceLesson.practiceActivities?.[0]?.errorFeedback).toBeTruthy();
        expect(referenceLesson.quiz?.[0]?.hint).toBeTruthy();
      });
    });
  });

  it("ships React, Node and Git with practical professional progression", () => {
    const professionalCourses = ["3", "5", "7"].map((courseId) => courses.find((item) => item.id === courseId));

    expect(professionalCourses.every(Boolean)).toBe(true);
    professionalCourses.forEach((professionalCourse) => {
      expect(professionalCourse!.lessons.length).toBeGreaterThanOrEqual(10);
      professionalCourse!.lessons.forEach((professionalLesson) => {
        expect(professionalLesson.learningObjective).toBeTruthy();
        expect(professionalLesson.summary).toBeTruthy();
        expect(professionalLesson.nextStep).toBeTruthy();
        expect(professionalLesson.tryItPrompt).toBeTruthy();
        expect(professionalLesson.commonMistake).toBeTruthy();
        expect(professionalLesson.reference?.length).toBeGreaterThanOrEqual(4);
        expect(professionalLesson.concepts?.length).toBeGreaterThan(0);
        expect(professionalLesson.practiceActivities?.[0]?.hint).toBeTruthy();
        expect(professionalLesson.quiz?.[0]?.successFeedback).toBeTruthy();
        expect(professionalLesson.quiz?.[0]?.errorFeedback).toBeTruthy();
      });
    });
  });

  it("ships algorithms as a practical strategy-focused course", () => {
    const algorithmCourse = courses.find((item) => item.id === "8");

    expect(algorithmCourse).toBeTruthy();
    expect(algorithmCourse!.lessons.length).toBeGreaterThanOrEqual(10);
    algorithmCourse!.lessons.forEach((algorithmLesson) => {
      expect(algorithmLesson.learningObjective).toBeTruthy();
      expect(algorithmLesson.analogy).toBeTruthy();
      expect(algorithmLesson.tryItPrompt).toBeTruthy();
      expect(algorithmLesson.commonMistake).toBeTruthy();
      expect(algorithmLesson.reference?.length).toBeGreaterThanOrEqual(4);
      expect(algorithmLesson.practiceActivities?.length).toBeGreaterThan(0);
      expect(algorithmLesson.quiz?.[0]?.successFeedback).toBeTruthy();
      expect(algorithmLesson.quiz?.[0]?.errorFeedback).toBeTruthy();
    });
  });

  it("keeps supplemental mobile, data and game courses aligned with the lesson structure", () => {
    const supplementalCourses = ["11", "12", "13"].map((courseId) => courses.find((item) => item.id === courseId));

    expect(supplementalCourses.every(Boolean)).toBe(true);
    supplementalCourses.forEach((supplementalCourse) => {
      supplementalCourse!.lessons.forEach((supplementalLesson) => {
        expect(supplementalLesson.learningObjective).toBeTruthy();
        expect(supplementalLesson.analogy).toBeTruthy();
        expect(supplementalLesson.tryItPrompt).toBeTruthy();
        expect(supplementalLesson.commonMistake).toBeTruthy();
        expect(supplementalLesson.reference?.length).toBeGreaterThanOrEqual(4);
        expect(supplementalLesson.practiceActivities?.[0]?.successFeedback).toBeTruthy();
        expect(supplementalLesson.practiceActivities?.[0]?.errorFeedback).toBeTruthy();
        expect(supplementalLesson.quiz?.[0]?.successFeedback).toBeTruthy();
        expect(supplementalLesson.quiz?.[0]?.errorFeedback).toBeTruthy();
      });
    });
  });

  it("builds a searchable quick reference from lesson metadata", () => {
    const referenceIndex = buildReferenceIndex(courses);
    const languages = getReferenceLanguages(referenceIndex);

    expect(referenceIndex.length).toBeGreaterThan(80);
    expect(languages).toContain("JavaScript");
    expect(languages).toContain("Python");
    expect(languages).toContain("SQL");
    expect(filterReferenceEntries(referenceIndex, "variavel", "Todos").length).toBeGreaterThan(0);
    expect(filterReferenceEntries(referenceIndex, "JOIN", "SQL").some((entry) => entry.courseLanguage === "SQL")).toBe(true);
  });
});

describe("QuizSection", () => {
  it("reports the last correct answer when finishing", async () => {
    const onComplete = vi.fn();

    render(
      <QuizSection
        questions={[
          { question: "1?", options: ["a", "b"], correctIndex: 0 },
          { question: "2?", options: ["c", "d"], correctIndex: 1 },
        ]}
        onComplete={onComplete}
      />,
    );

    fireEvent.click(screen.getByText("a"));
    fireEvent.click(screen.getByText("Próxima"));
    await waitFor(() => expect(screen.getByText("2?")).toBeInTheDocument());
    fireEvent.click(screen.getByText("d"));
    fireEvent.click(screen.getByText("Ver Resultado"));

    expect(onComplete).toHaveBeenCalledWith(2);
  });
});

describe("GuidedPractice", () => {
  it("reports completion only after the guided activity is answered correctly", async () => {
    const onCompletionChange = vi.fn();

    render(
      <GuidedPractice
        lesson={{
          ...lesson,
          practiceActivities: [
            {
              id: "predict-output",
              type: "predict-output",
              title: "Preveja a saída",
              prompt: "O que aparece?",
              options: ["Olá, Ana", "undefined"],
              correctAnswer: "Olá, Ana",
              successFeedback: "Boa previsão.",
              errorFeedback: "Ainda não.",
            },
          ],
        }}
        onCompletionChange={onCompletionChange}
      />,
    );

    expect(onCompletionChange).toHaveBeenLastCalledWith(false);
    fireEvent.click(screen.getByRole("button", { name: "Olá, Ana" }));
    fireEvent.click(screen.getByRole("button", { name: "Verificar" }));

    await waitFor(() => expect(onCompletionChange).toHaveBeenLastCalledWith(true));
  });
});

describe("code validation", () => {
  it("accepts official solutions and rejects unchanged starters across lessons and projects", () => {
    const rejectedSolutions: string[] = [];
    const acceptedStarters: string[] = [];

    courses.forEach((courseItem) => {
      courseItem.lessons.forEach((courseLesson) => {
        const solution = validateCode(courseLesson.solution, courseLesson.expectedOutput, courseLesson.solution, {
          starterCode: courseLesson.starterCode,
        });
        const starter = validateCode(courseLesson.starterCode, courseLesson.expectedOutput, courseLesson.solution, {
          starterCode: courseLesson.starterCode,
        });

        if (solution.level !== "exact" && solution.level !== "flexible") {
          rejectedSolutions.push(`${courseItem.id}/${courseLesson.id}`);
        }
        if (starter.level === "exact" || starter.level === "flexible") {
          acceptedStarters.push(`${courseItem.id}/${courseLesson.id}`);
        }
      });
    });

    projects.forEach((project) => {
      project.steps.forEach((step) => {
        const solution = validateCode(step.solution, step.expectedOutput, step.solution, {
          starterCode: step.starterCode,
        });
        const starter = validateCode(step.starterCode, step.expectedOutput, step.solution, {
          starterCode: step.starterCode,
        });

        if (solution.level !== "exact" && solution.level !== "flexible") {
          rejectedSolutions.push(`${project.id}/${step.id}`);
        }
        if (starter.level === "exact" || starter.level === "flexible") {
          acceptedStarters.push(`${project.id}/${step.id}`);
        }
      });
    });

    expect(rejectedSolutions).toEqual([]);
    expect(acceptedStarters).toEqual([]);
  });

  it("does not accept unchanged starter code just because it contains the expected text", () => {
    const result = validateCode(
      'mostrar("corrigi o erro"',
      "corrigi o erro",
      'mostrar("corrigi o erro");',
      { starterCode: 'mostrar("corrigi o erro"' },
    );

    expect(result.level).toBe("wrong");
    expect(result.errorKind).toBe("unknown");
  });

  it("ignores comments when checking structural answers", () => {
    const result = validateCode(
      '<!-- Crie um parágrafo com class="dica" -->',
      'class="dica"',
      '<p class="dica">HTML usa tags.</p>',
    );

    expect(result.level).toBe("wrong");
    expect(result.errorKind).toBe("empty");
  });

  it("accepts computed output instead of requiring the literal expected string", () => {
    const result = validateCode(
      'const nome = "Ana";\nconsole.log("Olá, " + nome);',
      "Olá, Ana",
      'console.log("Olá, Ana");',
    );

    expect(["exact", "flexible"]).toContain(result.level);
  });

  it("accepts simple string transformations inside output calls", () => {
    const result = validateCode(
      'nome = "  ANA  "\nprint(nome.strip().lower())',
      "ana",
      'nome = "  ANA  "\nprint(nome.strip().lower())',
    );

    expect(["exact", "flexible"]).toContain(result.level);
  });

  it("requires a real output command when the official solution outputs a value", () => {
    const result = validateCode(
      'const nome = "Ana";',
      "Ana",
      "console.log(nome);",
    );

    expect(result.level).not.toBe("exact");
    expect(result.level).not.toBe("flexible");
  });

  it("does not treat imports as completed structural work", () => {
    const result = validateCode(
      'import { View, Text } from "react-native";\n\nexport default function App() {}',
      "Text",
      'import { View, Text } from "react-native";\nexport default function App() {\n  return <View><Text>Olá</Text></View>;\n}',
    );

    expect(result.level).not.toBe("exact");
    expect(result.level).not.toBe("flexible");
  });
});

describe("daily review plan", () => {
  it("prioritizes lessons with recent failed attempts", () => {
    const secondLesson: Lesson = {
      ...lesson,
      id: "lesson-2",
      title: "Variáveis",
      expectedOutput: "Meu nome é Ana",
      quiz: [],
    };
    const reviewCourse: Course = { ...course, lessons: [lesson, secondLesson] };

    const plan = buildDailyReviewPlan({
      courses: [reviewCourse],
      completedLessons: ["lesson-1"],
      savedCode: {},
      attempts: { "lesson-2": 2 },
      topErrors: ["output_mismatch"],
    });

    expect(plan.recommendedLesson.lesson.id).toBe("lesson-2");
    expect(plan.recommendedLesson.reason).toBe("stuck");
    expect(plan.questions.length).toBeGreaterThan(0);
    expect(plan.focusErrors).toContain("output_mismatch");
  });
});

describe("module checkpoints", () => {
  it("inserts practical checkpoints at module boundaries", () => {
    const moduleCourse: Course = {
      ...course,
      id: "module-course",
      lessons: [
        { ...lesson, id: "m1-a", title: "Primeiro conceito", module: "Módulo 1", expectedOutput: "A" },
        { ...lesson, id: "m1-b", title: "Desafio do módulo", module: "Módulo 1", expectedOutput: "B" },
        { ...lesson, id: "m2-a", title: "Novo módulo", module: "Módulo 2", expectedOutput: "C" },
      ],
    };

    const augmented = augmentCourse(moduleCourse);
    const checkpoint = augmented.lessons.find((item) => item.kind === "checkpoint");

    expect(augmented.lessons.map((item) => item.id)).toEqual([
      "m1-a",
      "m1-b",
      "module-course-checkpoint-1",
      "m2-a",
    ]);
    expect(checkpoint?.reviewedModule).toBe("Módulo 1");
    expect(checkpoint?.reviewedLessonIds).toEqual(["m1-a", "m1-b"]);
    expect(checkpoint?.practiceActivities?.length).toBeGreaterThan(0);
  });
});

describe("concept mastery", () => {
  it("marks concepts with repeated failed attempts as weak and prioritizes them in review", () => {
    const variablesLesson: Lesson = {
      ...lesson,
      id: "variables-1",
      title: "Variáveis",
      concepts: ["variables"],
      expectedOutput: "Ana",
    };
    const loopLesson: Lesson = {
      ...lesson,
      id: "loops-1",
      title: "Loops",
      concepts: ["loops"],
      expectedOutput: "3",
    };
    const masteryCourse: Course = { ...course, lessons: [variablesLesson, loopLesson] };
    const concepts = buildConceptMasteryPlan({
      courses: [masteryCourse],
      completedLessons: [],
      savedCode: {},
      attempts: { "variables-1": 3 },
    });

    const weakConceptIds = getWeakConceptIds(concepts);
    const variables = concepts.find((concept) => concept.id === "variables");
    const plan = buildDailyReviewPlan({
      courses: [masteryCourse],
      completedLessons: [],
      savedCode: {},
      attempts: {},
      topErrors: [],
      weakConceptIds,
    });

    expect(variables?.status).toBe("weak");
    expect(weakConceptIds).toContain("variables");
    expect(plan.recommendedLesson.lesson.id).toBe("variables-1");
    expect(plan.recommendedLesson.reason).toBe("weak_concept");
  });

  it("builds a focused training session for a weak concept", () => {
    const variablesLesson: Lesson = {
      ...lesson,
      id: "variables-training",
      title: "Variáveis na prática",
      description: "Entenda variáveis guardando um nome para usar depois.",
      learningObjective: "Guardar uma informação em uma variável e reutilizar esse valor.",
      expectedOutput: "Olá, Ana",
      concepts: ["variables"],
      quiz: [
        {
          question: "Qual opção melhor descreve uma variável?",
          options: ["Um lugar com nome para guardar uma informação.", "Uma imagem.", "Um erro.", "Um botão."],
          correctIndex: 0,
        },
      ],
    };
    const masteryCourse: Course = { ...course, id: "training-course", lessons: [variablesLesson] };
    const [concept] = buildConceptMasteryPlan({
      courses: [masteryCourse],
      completedLessons: [],
      savedCode: {},
      attempts: { "variables-training": 2 },
    });

    const session = buildConceptTrainingSession(concept, [masteryCourse]);

    expect(session.conceptId).toBe("variables");
    expect(session.recommendedLesson?.lessonId).toBe("variables-training");
    expect(session.questions.length).toBeGreaterThanOrEqual(2);
    expect(session.questions[0].successFeedback).toBeTruthy();
    expect(session.targetLessons[0].objective).toContain("Guardar");
  });
});
