import { courses, type Course, type Lesson, type PracticeActivity, type QuizQuestion } from "./mockData";

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
  reviewedModule?: string;
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
    successFeedback: "Boa. Revisar antes de avançar reduz esquecimento e prepara o próximo bloco.",
    errorFeedback: "Ainda não. A revisão existe para fortalecer memória, não para atrasar o aluno.",
    hint: "Pense no que acontece quando você pratica um conceito em dias diferentes.",
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
    successFeedback: "Correto. O erro vira ferramenta quando você entende a causa e tenta de novo.",
    errorFeedback: "Quase. Copiar ou desistir não ensina o padrão que causou o erro.",
    hint: "Procure a opção que transforma o erro em informação.",
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
    successFeedback: "Isso. Prática curta e frequente costuma fixar melhor do que maratona.",
    errorFeedback: "Não exatamente. O app quer criar repetição útil, não estudo pesado de uma vez.",
    hint: "Pense em memória de longo prazo.",
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
      successFeedback: "Boa. Você conectou o título da aula ao objetivo prático.",
      errorFeedback: "Quase. A ideia principal costuma aparecer no objetivo da lição.",
      hint: "Procure a alternativa que descreve o que o aluno precisa saber fazer.",
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
      successFeedback: "Correto. A saída esperada é a prova mínima de que o código funcionou.",
      errorFeedback: "Ainda não. A saída esperada não mede quantidade de linhas; mede comportamento.",
      hint: "Pense no que você compara depois de executar.",
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
    successFeedback: "Boa. Esse é o ciclo certo: dica, comparação e nova tentativa.",
    errorFeedback: "Quase. O melhor próximo passo ajuda você a tentar de novo com mais direção.",
    hint: "Procure a opção que mantém você praticando.",
  };
}

function rotateOptions(correct: string, wrongOptions: string[], salt: string) {
  const options = Array.from(new Set([correct, ...wrongOptions].filter(Boolean))).slice(0, 4);
  while (options.length < 4) options.push(`Revisar conceito ${options.length + 1}`);
  const offset = Array.from(salt).reduce((sum, char) => sum + char.charCodeAt(0), 0) % options.length;
  const rotated = [...options.slice(offset), ...options.slice(0, offset)];
  return { options: rotated, correctIndex: rotated.indexOf(correct) };
}

function shuffled(items: string[], salt: string): string[] {
  return [...items].sort((a, b) => (b + salt).localeCompare(a + salt));
}

function buildCheckpointActivities(checkpointId: string, groupLessons: Lesson[]): PracticeActivity[] {
  const conceptOrder = groupLessons.map((lesson) => lesson.title);
  const anchor = groupLessons[groupLessons.length - 1];

  const activities: PracticeActivity[] = [
    {
      id: `${checkpointId}-module-order`,
      type: "order-steps",
      title: "Reconstrua o módulo",
      prompt: "Coloque os conceitos na ordem em que eles foram estudados. A ordem mostra a progressão do raciocínio.",
      options: shuffled(conceptOrder, checkpointId),
      correctAnswer: conceptOrder,
      successFeedback: "Boa. Você reconheceu a sequência de aprendizagem do módulo.",
      errorFeedback: "A ordem ainda não representa a progressão. Volte ao primeiro conceito e avance um passo por vez.",
      hint: "Comece pela aula mais introdutória e deixe o desafio do módulo para o fim.",
    },
  ];

  if (anchor?.expectedOutput) {
    const optionSet = rotateOptions(
      anchor.expectedOutput,
      ["O programa não mostra nada", "undefined", "Erro de sintaxe"],
      `${checkpointId}-output`,
    );

    activities.push({
      id: `${checkpointId}-module-evidence`,
      type: "predict-output",
      title: "Evidência prática",
      prompt: `Na aula "${anchor.title}", qual saída prova que a solução funcionou?`,
      code: anchor.solution,
      options: optionSet.options,
      correctAnswer: anchor.expectedOutput,
      successFeedback: "Certo. Você sabe qual resultado observar para validar o exercício.",
      errorFeedback: "Quase. A resposta precisa bater com a saída esperada da aula revisada.",
      hint: "Procure o que apareceria no console no final da solução.",
    });
  }

  return activities;
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
  const moduleName = groupLessons[0]?.module;
  const checkpointId = `${course.id}-checkpoint-${groupIndex}`;

  return {
    kind: "checkpoint",
    id: checkpointId,
    title: moduleName ? `Checkpoint ${groupIndex} - ${moduleName}` : `Checkpoint ${groupIndex} - Revisão`,
    description: `Revise os conceitos das lições anteriores: ${titles}. Faça a missão prática e responda corretamente para liberar o próximo bloco.`,
    theory: "",
    starterCode: "",
    solution: "",
    expectedOutput: "",
    hints: [],
    xpReward: 25,
    quiz: picked,
    module: moduleName,
    learningObjective: moduleName
      ? `Revisar e conectar os conceitos do ${moduleName}.`
      : "Revisar o bloco anterior antes de avançar.",
    analogy: "Checkpoint é como uma pausa no caminho: você confirma se a base está firme antes de subir o próximo nível.",
    summary: "A revisão mistura memória, ordem lógica e evidência prática para evitar avanço no piloto automático.",
    practiceActivities: buildCheckpointActivities(checkpointId, groupLessons),
    reviewedLessonIds: groupLessons.map((l) => l.id),
    reviewedModule: moduleName,
  };
}

/**
 * Returns a course with checkpoint lessons interleaved every N normal lessons.
 */
export function augmentCourse(course: Course): AugmentedCourse {
  const out: AugmentedLesson[] = [];
  let group: Lesson[] = [];
  let groupIdx = 0;
  const hasModuleStructure = course.lessons.some((lesson) => lesson.module);

  course.lessons.forEach((lesson, idx) => {
    out.push({ ...lesson, kind: "lesson" });
    group.push(lesson);

    const isLast = idx === course.lessons.length - 1;
    const nextLesson = course.lessons[idx + 1];
    const moduleEnded =
      hasModuleStructure &&
      !isLast &&
      lesson.module &&
      nextLesson?.module &&
      lesson.module !== nextLesson.module;
    const fallbackGroupEnded = !hasModuleStructure && group.length === CHECKPOINT_GROUP_SIZE && !isLast;

    if (moduleEnded || fallbackGroupEnded) {
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
