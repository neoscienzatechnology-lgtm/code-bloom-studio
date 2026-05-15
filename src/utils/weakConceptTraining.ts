import type { Course, Lesson, QuizQuestion } from "@/data/mockData";
import { getConceptLabel, getLessonConcepts, type ConceptMastery } from "@/utils/conceptMastery";

export interface ConceptTrainingLesson {
  courseId: string;
  lessonId: string;
  title: string;
  module?: string;
  objective: string;
  estimatedMinutes: number;
}

export interface ConceptTrainingSession {
  conceptId: string;
  label: string;
  headline: string;
  guide: string;
  targetLessons: ConceptTrainingLesson[];
  recommendedLesson?: ConceptTrainingLesson;
  questions: QuizQuestion[];
}

const GENERIC_DISTRACTORS = [
  "Decorar o código sem entender o motivo.",
  "Pular a prática e ir direto para o projeto.",
  "Trocar nomes sem observar o resultado.",
];

function uniqueQuestions(questions: QuizQuestion[], limit: number): QuizQuestion[] {
  const seen = new Set<string>();
  const result: QuizQuestion[] = [];

  for (const question of questions) {
    const key = question.question.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(question);
    if (result.length >= limit) break;
  }

  return result;
}

function lessonToTrainingLesson(course: Course, lesson: Lesson): ConceptTrainingLesson {
  return {
    courseId: course.id,
    lessonId: lesson.id,
    title: lesson.title,
    module: lesson.module,
    objective: lesson.learningObjective ?? lesson.description,
    estimatedMinutes: lesson.estimatedMinutes ?? 8,
  };
}
function buildObjectiveQuestion(lesson: Lesson, conceptLabel: string): QuizQuestion | null {
  const objective = lesson.learningObjective ?? lesson.description;
  if (!objective?.trim()) return null;

  return {
    question: `Nesta aula, qual é o ponto principal sobre ${conceptLabel}?`,
    options: [objective, ...GENERIC_DISTRACTORS],
    correctIndex: 0,
    explanation: "O objetivo da aula mostra o que você precisa conseguir fazer ao final da prática.",
    successFeedback: "Isso. Você identificou o alvo da prática antes de resolver o exercício.",
    errorFeedback: "Quase. Comece pelo objetivo: ele indica a habilidade que esta rodada quer fortalecer.",
    hint: "Procure a opção que descreve uma habilidade aplicável, não só uma ação mecânica.",
  };
}

function buildExpectedOutputQuestion(lesson: Lesson): QuizQuestion | null {
  if (!lesson.expectedOutput?.trim() || !lesson.solution?.trim()) return null;

  return {
    question: `Observe a solução da aula "${lesson.title}". Qual saída esperada confirma que ela funcionou?`,
    options: [lesson.expectedOutput, "undefined", "Erro de sintaxe", "Nada aparece na tela"],
    correctIndex: 0,
    explanation: "Prever a saída ajuda a conferir se o programa fez exatamente o que você planejou.",
    successFeedback: "Boa. Prever a saída é um sinal forte de entendimento, não só de tentativa.",
    errorFeedback: "Ainda não. Compare o código com o resultado que deveria aparecer no console ou na tela.",
    hint: "A resposta correta costuma ser o mesmo valor que a aula usa como saída esperada.",
  };
}

function enrichQuestion(question: QuizQuestion, conceptLabel: string): QuizQuestion {
  return {
    ...question,
    successFeedback:
      question.successFeedback ?? `Boa. Essa resposta reforça ${conceptLabel} do jeito certo.`,
    errorFeedback:
      question.errorFeedback ??
      `Quase. Revise ${conceptLabel} e procure a opção que explica o comportamento do código.`,
    hint:
      question.hint ??
      "Leia a pergunta como se estivesse explicando para alguém iniciante. A opção correta deve ser a mais prática e específica.",
  };
}

export function buildConceptTrainingSession(
  concept: ConceptMastery,
  courses: Course[],
  questionLimit = 5,
): ConceptTrainingSession {
  const label = concept.label || getConceptLabel(concept.id);
  const matched = courses.flatMap((course) =>
    course.lessons
      .filter((lesson) => getLessonConcepts(lesson).includes(concept.id))
      .map((lesson) => ({ course, lesson })),
  );

  const targetEntries =
    matched.length > 0
      ? matched
      : courses.slice(0, 1).flatMap((course) => course.lessons.slice(0, 3).map((lesson) => ({ course, lesson })));

  const recommended =
    targetEntries.find((entry) => entry.lesson.id === concept.reviewLesson?.lessonId) ?? targetEntries[0];

  const generatedQuestions = targetEntries.flatMap(({ lesson }) => {
    const questions: QuizQuestion[] = [];
    if (lesson.quiz?.length) {
      questions.push(...lesson.quiz.map((question) => enrichQuestion(question, label)));
    }

    const objectiveQuestion = buildObjectiveQuestion(lesson, label);
    if (objectiveQuestion) questions.push(objectiveQuestion);

    const outputQuestion = buildExpectedOutputQuestion(lesson);
    if (outputQuestion) questions.push(outputQuestion);

    return questions;
  });

  const fallbackQuestion: QuizQuestion = {
    question: `Qual é a melhor forma de revisar ${label}?`,
    options: [
      "Ler a explicação curta, prever o resultado e fazer uma prática pequena.",
      "Pular direto para uma aula avançada.",
      "Copiar a resposta sem executar.",
      "Ignorar os erros anteriores.",
    ],
    correctIndex: 0,
    explanation: "Revisão útil combina explicação, previsão e prática curta com feedback.",
    successFeedback: "Isso. Revisar bem é treinar uma habilidade específica com pouco atrito.",
    errorFeedback: "Quase. Revisão funciona melhor quando tem foco, prática e feedback.",
    hint: "Escolha a opção que transforma erro em uma próxima ação pequena.",
  };

  const questions = uniqueQuestions(
    generatedQuestions.length > 0 ? generatedQuestions : [fallbackQuestion],
    questionLimit,
  );

  return {
    conceptId: concept.id,
    label,
    headline: concept.status === "weak" ? `Reforço rápido: ${label}` : `Consolidar: ${label}`,
    guide:
      concept.status === "weak"
        ? "Faça esta rodada curta antes de continuar a trilha. O objetivo é destravar o conceito que apareceu como ponto fraco."
        : "Use esta prática para transformar entendimento inicial em memória mais firme.",
    targetLessons: targetEntries.slice(0, 4).map(({ course, lesson }) => lessonToTrainingLesson(course, lesson)),
    recommendedLesson: recommended ? lessonToTrainingLesson(recommended.course, recommended.lesson) : undefined,
    questions,
  };
}
