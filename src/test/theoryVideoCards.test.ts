import { describe, it, expect, vi } from "vitest";

// Liga o recurso de vídeo e finge que só a lição "1__1-1" tem vídeo.
vi.mock("@/config/theoryVideos", () => ({
  THEORY_VIDEO: { enabled: true, baseUrl: "https://cdn.test/videos" },
  hasTheoryVideo: (courseId: string, lessonId: string) => `${courseId}__${lessonId}` === "1__1-1",
  theoryVideoUrl: (courseId: string, lessonId: string) => `https://cdn.test/videos/${courseId}/${lessonId}.mp4`,
}));

import { buildLessonCards } from "@/utils/lessonCards";
import type { Lesson } from "@/data/mockData";

const baseLesson: Lesson = {
  id: "1-1",
  title: "Primeiro programa",
  description: "desc",
  theory: "## Ideia\nUm parágrafo de teoria.",
  starterCode: "",
  solution: "",
  expectedOutput: "",
  hints: [],
  xpReward: 10,
  learningObjective: "objetivo",
};

describe("card de teoria em vídeo", () => {
  it("insere o card de vídeo logo após o objetivo quando ligado e disponível", () => {
    const kinds = buildLessonCards(baseLesson, "1").map((c) => c.kind);
    expect(kinds[0]).toBe("confidence");
    expect(kinds[1]).toBe("objective");
    expect(kinds[2]).toBe("video");
  });

  it("não insere o card para lições sem vídeo", () => {
    const cards = buildLessonCards({ ...baseLesson, id: "9-9" }, "9");
    expect(cards.some((c) => c.kind === "video")).toBe(false);
  });

  it("não insere o card quando nenhum courseId é passado (ex.: testes/preview)", () => {
    expect(buildLessonCards(baseLesson).some((c) => c.kind === "video")).toBe(false);
  });
});
