import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuizSection from "@/components/QuizSection";
import { buildLessonBlueprint } from "@/utils/pedagogy";
import { buildDailyReviewPlan } from "@/utils/dailyReview";
import type { Course, Lesson } from "@/data/mockData";

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

describe("pedagogy blueprint", () => {
  it("creates a beginner-friendly plan for every lesson", () => {
    const blueprint = buildLessonBlueprint(course, lesson);

    expect(blueprint.objective).toContain("print");
    expect(blueprint.steps).toHaveLength(3);
    expect(blueprint.terms.length).toBeGreaterThan(0);
    expect(blueprint.microChecks.length).toBeGreaterThan(0);
    expect(blueprint.successCriteria).toContain('A saída final é equivalente a "Olá, Mundo!".');
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
