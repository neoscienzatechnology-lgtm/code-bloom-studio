import type { Course, Lesson, QuizQuestion } from "@/data/mockData";
import type { ErrorKind } from "@/utils/codeValidator";
import { getLessonConcepts } from "@/utils/conceptMastery";

export type ReviewReason = "stuck" | "weak_concept" | "in_progress" | "scheduled" | "completed" | "starter";

export interface ReviewLesson {
  course: Course;
  lesson: Lesson;
  lessonIndex: number;
  reason: ReviewReason;
  attempts: number;
  score: number;
}

export interface DailyReviewPlan {
  lessons: ReviewLesson[];
  questions: QuizQuestion[];
  focusErrors: ErrorKind[];
  recommendedLesson: ReviewLesson;
  xpReward: number;
  passThreshold: number;
}

interface BuildDailyReviewPlanInput {
  courses: Course[];
  completedLessons: string[];
  savedCode: Record<string, string>;
  attempts: Record<string, number>;
  topErrors: ErrorKind[];
  weakConceptIds?: string[];
  dueLessonIds?: string[];
  maxLessons?: number;
  maxQuestions?: number;
}

export const ERROR_REVIEW_COPY: Record<ErrorKind, { label: string; focus: string; drill: string }> = {
  empty: {
    label: "Começar sem travar",
    focus: "Você parou antes de escrever a primeira ação.",
    drill: "Abra a aula e escreva a menor linha possível antes de tentar a solução inteira.",
  },
  no_print: {
    label: "Mostrar resultado",
    focus: "O código roda mentalmente, mas não exibe a saída pedida.",
    drill: "Procure o comando de saída da linguagem: print(), console.log(), return ou equivalente.",
  },
  case_or_punct: {
    label: "Precisão na saída",
    focus: "O conceito está perto; faltam acentos, maiúsculas, espaços ou pontuação.",
    drill: "Compare a saída esperada caractere por caractere antes de executar de novo.",
  },
  wrong_quotes: {
    label: "Aspas consistentes",
    focus: "Strings precisam abrir e fechar com o mesmo tipo de aspas.",
    drill: "Revise aspas simples, duplas e crases antes de mexer no resto do código.",
  },
  missing_keyword: {
    label: "Palavra-chave central",
    focus: "A solução provavelmente precisa de uma palavra-chave como if, for, def, return, let ou const.",
    drill: "Identifique a estrutura principal do exercício antes de completar os detalhes.",
  },
  output_mismatch: {
    label: "Saída diferente",
    focus: "O código produz algo, mas não o mesmo resultado esperado.",
    drill: "Leia cada linha em voz alta e diga exatamente o que aparece no console.",
  },
  syntax: {
    label: "Sintaxe balanceada",
    focus: "Parênteses, chaves, colchetes ou aspas podem estar incompletos.",
    drill: "Conte os pares de abertura e fechamento antes de procurar outro erro.",
  },
  unknown: {
    label: "Depuração em passos",
    focus: "O erro ainda não tem padrão claro.",
    drill: "Mude uma coisa por vez, execute e observe o resultado antes de avançar.",
  },
};

export function buildDailyReviewPlan({
  courses,
  completedLessons,
  savedCode,
  attempts,
  topErrors,
  weakConceptIds = [],
  dueLessonIds = [],
  maxLessons = 5,
  maxQuestions = 5,
}: BuildDailyReviewPlanInput): DailyReviewPlan {
  const completedSet = new Set(completedLessons);
  const completionOrder = new Map(completedLessons.map((id, index) => [id, index]));
  const savedWithWork = new Set(
    Object.entries(savedCode)
      .filter(([, code]) => code.trim().length > 0)
      .map(([lessonId]) => lessonId),
  );
  const weakConceptSet = new Set(weakConceptIds);
  const dueSet = new Set(dueLessonIds);

  const allLessons = courses.flatMap((course) =>
    course.lessons.map((lesson, lessonIndex) => {
      const attemptCount = attempts[lesson.id] ?? 0;
      const isCompleted = completedSet.has(lesson.id);
      const isInProgress = savedWithWork.has(lesson.id) && !isCompleted;
      const completedRank = completionOrder.get(lesson.id) ?? -1;
      const conceptMatch = getLessonConcepts(lesson).some((concept) => weakConceptSet.has(concept));

      let reason: ReviewReason = "starter";
      let score = Math.max(0, 12 - lessonIndex);

      if (isCompleted) {
        reason = "completed";
        score += 35 + completedRank;
      }
      if (dueSet.has(lesson.id)) {
        reason = "scheduled";
        score += 70;
      }
      if (conceptMatch) {
        reason = "weak_concept";
        score += 95;
      }
      if (isInProgress) {
        reason = "in_progress";
        score += 80;
      }
      if (attemptCount > 0) {
        reason = "stuck";
        score += 120 + Math.min(attemptCount, 6) * 14;
      }
      if ((lesson.quiz?.length ?? 0) > 0) score += 8;

      return { course, lesson, lessonIndex, reason, attempts: attemptCount, score };
    }),
  );

  const activePool = allLessons
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.lessonIndex - b.lessonIndex);

  const lessons = uniqueByLessonId(activePool.length > 0 ? activePool : allLessons).slice(0, maxLessons);
  const recommendedLesson = lessons[0] ?? allLessons[0];
  const focusErrors = topErrors.length > 0 ? topErrors.slice(0, 3) : (["no_print", "output_mismatch", "syntax"] as ErrorKind[]);
  const questions = buildReviewQuestions(lessons, allLessons, maxQuestions);

  return {
    lessons,
    questions,
    focusErrors,
    recommendedLesson,
    xpReward: 15,
    passThreshold: 0.7,
  };
}

function buildReviewQuestions(
  lessons: ReviewLesson[],
  allLessons: ReviewLesson[],
  maxQuestions: number,
): QuizQuestion[] {
  const quizQuestions = lessons.flatMap(({ lesson }) => lesson.quiz ?? []);
  const generatedQuestions = lessons.flatMap((item) => [
    buildExpectedOutputQuestion(item, allLessons),
    buildFirstStepQuestion(item),
  ]);

  const questions = uniqueQuestions([...quizQuestions, ...generatedQuestions]);
  return questions.slice(0, maxQuestions);
}

function buildExpectedOutputQuestion(item: ReviewLesson, allLessons: ReviewLesson[]): QuizQuestion {
  const wrongOutputs = allLessons
    .filter(({ lesson }) => lesson.id !== item.lesson.id)
    .map(({ lesson }) => lesson.expectedOutput)
    .filter(Boolean)
    .slice(0, 6);

  const optionSet = rotateOptions(
    item.lesson.expectedOutput,
    [...wrongOutputs, "O programa não mostra nada", "Apenas salva o arquivo"],
    item.lesson.id,
  );

  return {
    question: `Na aula "${item.lesson.title}", qual é a saída esperada?`,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    explanation: `A saída esperada é o alvo da aula. Antes de editar o código, compare tudo com "${item.lesson.expectedOutput}".`,
    successFeedback: "Boa. Você reconheceu a evidência que prova que o exercício funcionou.",
    errorFeedback: `Quase. Nesta aula, a saída que confirma a solução é "${item.lesson.expectedOutput}".`,
    hint: "Volte ao enunciado da aula e procure o campo de saída esperada.",
  };
}

function buildFirstStepQuestion(item: ReviewLesson): QuizQuestion {
  const firstHint = item.lesson.hints[0] ?? "Leia o enunciado e identifique a saída esperada.";
  const optionSet = rotateOptions(
    firstHint,
    [
      "Copiar a solução sem testar",
      "Trocar várias partes do código ao mesmo tempo",
      "Ignorar a saída esperada",
      "Avançar sem executar",
    ],
    `${item.lesson.id}-hint`,
  );

  return {
    question: `Qual é um bom primeiro passo para revisar "${item.lesson.title}"?`,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    explanation: "Uma revisão curta funciona melhor quando começa por uma ação pequena e verificável.",
    successFeedback: "Isso. Revisão boa começa com uma ação pequena, não com tentativa aleatória.",
    errorFeedback: "Ainda não é o melhor começo. Primeiro ataque a menor parte verificável do exercício.",
    hint: firstHint,
  };
}

function rotateOptions(correct: string, wrongOptions: string[], salt: string) {
  const options = uniqueStrings([correct, ...wrongOptions]).slice(0, 4);
  while (options.length < 4) options.push(`Revisar o conceito ${options.length + 1}`);

  const offset = Array.from(salt).reduce((sum, char) => sum + char.charCodeAt(0), 0) % options.length;
  const rotated = [...options.slice(offset), ...options.slice(0, offset)];

  return {
    options: rotated,
    correctIndex: rotated.indexOf(correct),
  };
}

function uniqueByLessonId(items: ReviewLesson[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.lesson.id)) return false;
    seen.add(item.lesson.id);
    return true;
  });
}

function uniqueQuestions(items: QuizQuestion[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.question)) return false;
    seen.add(item.question);
    return true;
  });
}

function uniqueStrings(items: string[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const normalized = item.trim();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}
