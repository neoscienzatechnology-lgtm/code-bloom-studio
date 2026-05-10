import { courses, type Course, type Lesson, type QuizQuestion } from "./mockData";

/**
 * Spaced-repetition checkpoints.
 *
 * After every 3 normal lessons we inject a synthetic "checkpoint" lesson
 * that revisits previous concepts via 3–5 quiz questions.
 *
 * We do NOT mutate the original `courses` array — we expose helpers that
 * return an augmented version with `kind: "checkpoint"` lessons interleaved.
 */

export type LessonKind = "lesson" | "checkpoint";

export interface AugmentedLesson extends Lesson {
  kind: LessonKind;
  /** For checkpoints: ids of the lessons being reviewed */
  reviewedLessonIds?: string[];
}

export interface AugmentedCourse extends Omit<Course, "lessons"> {
  lessons: AugmentedLesson[];
}

const CHECKPOINT_GROUP_SIZE = 3;

const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    question: "Por que é importante revisar conceitos antes de avançar?",
    options: [
      "Para fixar o aprendizado de longo prazo",
      "Para perder tempo",
      "Não é importante",
      "Apenas para ganhar XP",
    ],
    correctIndex: 0,
    explanation: "A revisão espaçada consolida o conhecimento na memória de longo prazo.",
  },
  {
    question: "Qual é a melhor atitude ao errar um exercício?",
    options: [
      "Desistir imediatamente",
      "Copiar a resposta sem entender",
      "Refletir sobre o erro e tentar de novo",
      "Pular a lição",
    ],
    correctIndex: 2,
    explanation: "Errar faz parte do aprendizado — o importante é entender o porquê.",
  },
  {
    question: "Praticar pouco e com frequência é...",
    options: [
      "Pior que estudar muitas horas de uma vez",
      "Mais eficaz que maratonar conteúdo",
      "Indiferente",
      "Apenas para iniciantes",
    ],
    correctIndex: 1,
    explanation: "Estudos mostram que prática distribuída supera prática massiva.",
  },
];

function buildLessonFallbackQuestion(lesson: Lesson, index: number): QuizQuestion {
  const concept = lesson.title.replace(/^[0-9.\s-]+/, "");
  const expected = lesson.expectedOutput || "resultado esperado";

  if (index % 3 === 0) {
    return {
      question: `Qual é a ideia principal da lição "${concept}"?`,
      options: [
        lesson.description,
        "Pular a prática e decorar a resposta",
        "Ignorar a saída esperada",
        "Usar qualquer comando sem pensar no objetivo",
      ],
      correctIndex: 0,
      explanation: "A descrição da lição resume o objetivo prático que precisa ser dominado antes de avançar.",
    };
  }

  if (index % 3 === 1) {
    return {
      question: `O que a saída esperada ajuda a verificar em "${concept}"?`,
      options: [
        "Se o código chegou ao comportamento pedido",
        "Se o aluno escreveu a maior quantidade de linhas",
        "Se a tela ficou colorida",
        "Se o projeto foi publicado automaticamente",
      ],
      correctIndex: 0,
      explanation: `A saída esperada funciona como evidência mínima de que o exercício produziu "${expected}".`,
    };
  }

  return {
    question: `Ao travar em "${concept}", qual é o melhor próximo passo?`,
    options: [
      "Ler a dica, comparar com a saída esperada e tentar novamente",
      "Copiar a solução sem testar",
      "Pular todos os checkpoints",
      "Trocar de curso imediatamente",
    ],
    correctIndex: 0,
    explanation: "Revisar a dica e testar de novo fortalece a aprendizagem ativa.",
  };
}

/**
 * Build a checkpoint lesson out of the previous group of lessons.
 * Pulls existing quiz questions when available, otherwise falls back.
 */
function buildCheckpoint(
  course: Course,
  groupLessons: Lesson[],
  groupIndex: number
): AugmentedLesson {
  const pool: QuizQuestion[] = groupLessons.flatMap((l) => l.quiz ?? []);

  // Pick up to 5 questions, distributed across the group
  const picked: QuizQuestion[] = [];
  const seen = new Set<string>();
  for (const q of pool) {
    if (picked.length >= 5) break;
    if (seen.has(q.question)) continue;
    seen.add(q.question);
    picked.push(q);
  }
  // Ensure at least 3 questions, preferring lesson-specific review over generic fallback.
  let i = 0;
  while (picked.length < 3) {
    const lesson = groupLessons[i % groupLessons.length];
    picked.push(lesson ? buildLessonFallbackQuestion(lesson, i) : FALLBACK_QUESTIONS[i % FALLBACK_QUESTIONS.length]);
    i++;
  }

  const titles = groupLessons.map((l) => l.title).join(" · ");

  return {
    kind: "checkpoint",
    id: `${course.id}-checkpoint-${groupIndex}`,
    title: `Checkpoint ${groupIndex} — Revisão`,
    description: `Revise os conceitos das lições anteriores: ${titles}. Responda corretamente para liberar o próximo bloco.`,
    theory: "",
    starterCode: "",
    solution: "",
    expectedOutput: "",
    hints: [],
    xpReward: 25,
    quiz: picked,
    reviewedLessonIds: groupLessons.map((l) => l.id),
  };
}

/**
 * Returns a course with checkpoint lessons interleaved every N normal lessons.
 */
export function augmentCourse(course: Course): AugmentedCourse {
  const out: AugmentedLesson[] = [];
  let group: Lesson[] = [];
  let groupIdx = 0;

  course.lessons.forEach((lesson, idx) => {
    out.push({ ...lesson, kind: "lesson" });
    group.push(lesson);

    const isLast = idx === course.lessons.length - 1;
    if (group.length === CHECKPOINT_GROUP_SIZE && !isLast) {
      groupIdx++;
      out.push(buildCheckpoint(course, group, groupIdx));
      group = [];
    }
  });

  return { ...course, lessons: out };
}

export function getAugmentedCourseById(courseId: string): AugmentedCourse | undefined {
  const course = courses.find((c) => c.id === courseId);
  return course ? augmentCourse(course) : undefined;
}

export function getAugmentedCourses(): AugmentedCourse[] {
  return courses.map(augmentCourse);
}

export function getAugmentedLessonById(
  courseId: string,
  lessonId: string
):
  | { course: AugmentedCourse; lesson: AugmentedLesson; lessonIndex: number }
  | undefined {
  const course = getAugmentedCourseById(courseId);
  if (!course) return undefined;
  const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex === -1) return undefined;
  return { course, lesson: course.lessons[lessonIndex], lessonIndex };
}

export function isCheckpoint(lesson: Pick<AugmentedLesson, "kind">): boolean {
  return lesson.kind === "checkpoint";
}
