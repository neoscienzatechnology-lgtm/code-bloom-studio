// Micro-learning card sequence (Mimo/Duolingo style).
//
// Derives a list of small, single-purpose cards from the structured fields
// every lesson already has — no content rewrite needed. Each card shows ONE
// idea and asks for ONE action; the code challenge stays as the lesson's
// final, separate phase.

import type { Lesson } from "@/data/mockData";
import { buildAssembleData } from "@/utils/assembleBlocks";

export type LessonCard =
  | { kind: "confidence" }
  | { kind: "objective"; title: string; text: string }
  | { kind: "theory"; text: string; first: boolean }
  | { kind: "analogy"; text: string }
  | { kind: "example"; code: string }
  | { kind: "mistake"; text: string }
  | { kind: "contrast"; wrong: string; right: string; explanation: string }
  | { kind: "quiz" }
  | { kind: "practice" }
  | { kind: "assemble"; line: string; tokens: string[]; shuffled: string[] }
  | { kind: "code-intro" };

export type LessonCardKind = LessonCard["kind"];

/** Sections appended by the modern-course lesson builder; they already exist
 * as dedicated cards, so they are stripped from the theory text. */
const GENERATED_SECTION_MARKERS = ["Exemplo prático:", "Erro comum:", "Referência rápida:"];

const MAX_CHUNK_LENGTH = 420;

function stripGeneratedSections(theory: string): string {
  let core = theory;
  for (const marker of GENERATED_SECTION_MARKERS) {
    const index = core.indexOf(marker);
    if (index !== -1) core = core.slice(0, index);
  }
  return core.trim();
}

/** Splits markdown-ish theory into bite-sized chunks: one per ## section,
 * long sections further split by paragraph. Top-level # titles are dropped
 * (the card header already names the lesson). */
export function splitTheoryChunks(theory: string): string[] {
  const core = stripGeneratedSections(theory);
  if (!core) return [];

  const sections = core
    .split(/\n(?=##\s+)/)
    .map((section) => section.replace(/^#{1,2}\s+.*$/m, "").trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const section of sections) {
    if (section.length <= MAX_CHUNK_LENGTH) {
      chunks.push(section);
      continue;
    }
    let current = "";
    const pieces = section
      .split(/\n\n+/)
      .flatMap((paragraph) =>
        paragraph.length > MAX_CHUNK_LENGTH && !/\n\s{2,}/.test(paragraph)
          ? paragraph.split(/(?<=[.!?])\s+/)
          : [paragraph],
      );
    for (const piece of pieces) {
      if (current && current.length + piece.length > MAX_CHUNK_LENGTH) {
        chunks.push(current.trim());
        current = piece;
      } else {
        current = current ? `${current}\n\n${piece}` : piece;
      }
    }
    if (current.trim()) chunks.push(current.trim());
  }

  return chunks;
}

export function buildLessonCards(lesson: Lesson): LessonCard[] {
  const cards: LessonCard[] = [];

  cards.push({ kind: "confidence" });
  cards.push({
    kind: "objective",
    title: lesson.title,
    text: lesson.learningObjective ?? lesson.description,
  });

  splitTheoryChunks(lesson.theory).forEach((chunk, index) => {
    cards.push({ kind: "theory", text: chunk, first: index === 0 });
  });

  if (lesson.analogy) cards.push({ kind: "analogy", text: lesson.analogy });

  const exampleCode = lesson.codeExample ?? lesson.example;
  if (exampleCode) cards.push({ kind: "example", code: exampleCode });

  if (lesson.commonMistake) cards.push({ kind: "mistake", text: lesson.commonMistake });

  if (lesson.contrastExample) {
    cards.push({
      kind: "contrast",
      wrong: lesson.contrastExample.wrong,
      right: lesson.contrastExample.right,
      explanation: lesson.contrastExample.explanation,
    });
  }

  if (lesson.quiz?.length) cards.push({ kind: "quiz" });
  if (lesson.practiceActivities?.length) cards.push({ kind: "practice" });

  // Antes de abrir o editor: montar uma linha real da solução tocando nos
  // blocos. Só entra quando a solução tem uma linha curta e limpa.
  const assemble = buildAssembleData(lesson.solution, lesson.id);
  if (assemble) {
    cards.push({ kind: "assemble", line: assemble.line, tokens: assemble.tokens, shuffled: assemble.shuffled });
  }

  cards.push({ kind: "code-intro" });

  return cards;
}

/** Cards that demand a correct interaction before the learner can advance. */
export function cardRequiresCompletion(kind: LessonCardKind): boolean {
  return kind === "contrast" || kind === "quiz" || kind === "practice" || kind === "assemble";
}

/** Deterministic side for the correct answer in the contrast card (stable
 * across re-renders, varied across lessons). */
export function contrastRightOnFirstPosition(lessonId: string): boolean {
  let hash = 0;
  for (let i = 0; i < lessonId.length; i += 1) hash = (hash * 31 + lessonId.charCodeAt(i)) | 0;
  return Math.abs(hash) % 2 === 0;
}
