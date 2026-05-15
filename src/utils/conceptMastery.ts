import type { Course, Lesson } from "@/data/mockData";

export type ConceptStatus = "strong" | "learning" | "weak" | "new";

export interface ConceptMastery {
  id: string;
  label: string;
  mastery: number;
  status: ConceptStatus;
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  failedAttempts: number;
  reason: string;
  reviewLesson?: {
    courseId: string;
    lessonId: string;
    title: string;
  };
}

interface BuildConceptMasteryInput {
  courses: Course[];
  completedLessons: string[];
  savedCode: Record<string, string>;
  attempts: Record<string, number>;
}

const CONCEPT_LABELS: Record<string, string> = {
  programming: "O que é programação",
  algorithm: "Algoritmos",
  sequence: "Sequência",
  debugging: "Depuração",
  variables: "Variáveis",
  data_types: "Tipos de dados",
  operators: "Operadores",
  prediction: "Prever saída",
  conditionals: "Condições",
  comparisons: "Comparações",
  loops: "Loops",
  lists: "Listas",
  counters: "Contadores",
  functions: "Funções",
  parameters: "Parâmetros",
  return_value: "Return",
  input_output: "Entrada e saída",
  project_planning: "Planejamento",
};

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function getLessonConcepts(lesson: Lesson): string[] {
  if (lesson.concepts?.length) return lesson.concepts;

  const haystack = normalize(`${lesson.title} ${lesson.description} ${lesson.theory}`);
  const concepts: string[] = [];
  const checks: Array<[string, string[]]> = [
    ["programming", ["programacao", "programar"]],
    ["algorithm", ["algoritmo", "passos"]],
    ["sequence", ["sequencia", "ordem", "cima para baixo"]],
    ["debugging", ["erro", "depur", "corrigir"]],
    ["variables", ["variavel", "const ", "let "]],
    ["data_types", ["tipo", "string", "number", "boolean", "verdadeiro", "falso"]],
    ["operators", ["operador", "soma", "subtracao", "multiplicacao", "+", "*"]],
    ["prediction", ["prever", "saida esperada"]],
    ["conditionals", ["condicao", "if", "else", "decisao"]],
    ["comparisons", ["comparacao", "===", ">=", "<=", "maior", "igual"]],
    ["loops", ["loop", "for ", "while ", "repet"]],
    ["lists", ["lista", "array", "tarefas"]],
    ["counters", ["contador", "total = total", "total + 1"]],
    ["functions", ["funcao", "function"]],
    ["parameters", ["parametro", "argumento"]],
    ["return_value", ["return", "devolve", "retorno"]],
    ["input_output", ["entrada", "processamento", "saida"]],
    ["project_planning", ["planej", "projeto"]],
  ];

  for (const [concept, needles] of checks) {
    if (needles.some((needle) => haystack.includes(needle))) concepts.push(concept);
    if (concepts.length >= 3) break;
  }

  return concepts.length > 0 ? concepts : ["programming"];
}

export function getConceptLabel(id: string): string {
  return CONCEPT_LABELS[id] ?? id.replace(/_/g, " ");
}

function statusFor(mastery: number, completed: number, failedAttempts: number): ConceptStatus {
  if (failedAttempts >= 2 && mastery < 80) return "weak";
  if (completed === 0 && failedAttempts === 0) return "new";
  if (mastery >= 80) return "strong";
  if (mastery < 50 || failedAttempts > 0) return "weak";
  return "learning";
}

function reasonFor(status: ConceptStatus, failedAttempts: number, completed: number, total: number): string {
  if (status === "strong") return "Você já concluiu a maior parte das aulas desse conceito.";
  if (failedAttempts > 0) return "Seus erros recentes indicam que vale revisar esse conceito.";
  if (completed === 0) return "Conceito ainda não praticado. Ele pode aparecer nas próximas aulas.";
  return `Você concluiu ${completed}/${total} aulas desse conceito. Continue para consolidar.`;
}

export function buildConceptMasteryPlan({
  courses,
  completedLessons,
  savedCode,
  attempts,
}: BuildConceptMasteryInput): ConceptMastery[] {
  const completedSet = new Set(completedLessons);
  const lessonEntries = courses.flatMap((course) =>
    course.lessons.flatMap((lesson) =>
      getLessonConcepts(lesson).map((concept) => ({
        concept,
        course,
        lesson,
        completed: completedSet.has(lesson.id),
        inProgress: Boolean(savedCode[lesson.id]?.trim()) && !completedSet.has(lesson.id),
        attempts: attempts[lesson.id] ?? 0,
      })),
    ),
  );

  const conceptIds = Array.from(new Set(lessonEntries.map((entry) => entry.concept)));

  return conceptIds
    .map((concept): ConceptMastery => {
      const entries = lessonEntries.filter((entry) => entry.concept === concept);
      const total = entries.length;
      const completed = entries.filter((entry) => entry.completed).length;
      const inProgress = entries.filter((entry) => entry.inProgress).length;
      const failedAttempts = entries.reduce((sum, entry) => sum + entry.attempts, 0);
      const completionScore = total > 0 ? (completed / total) * 100 : 0;
      const practiceBonus = total > 0 ? Math.min(15, (inProgress / total) * 25) : 0;
      const attemptPenalty = Math.min(45, failedAttempts * 10);
      const mastery = Math.max(0, Math.min(100, Math.round(completionScore + practiceBonus - attemptPenalty)));
      const status = statusFor(mastery, completed, failedAttempts);
      const reviewTarget =
        entries.find((entry) => entry.attempts > 0 && !entry.completed) ??
        entries.find((entry) => !entry.completed) ??
        entries[0];

      return {
        id: concept,
        label: getConceptLabel(concept),
        mastery,
        status,
        totalLessons: total,
        completedLessons: completed,
        inProgressLessons: inProgress,
        failedAttempts,
        reason: reasonFor(status, failedAttempts, completed, total),
        reviewLesson: reviewTarget
          ? {
              courseId: reviewTarget.course.id,
              lessonId: reviewTarget.lesson.id,
              title: reviewTarget.lesson.title,
            }
          : undefined,
      };
    })
    .sort((a, b) => {
      const statusWeight: Record<ConceptStatus, number> = { weak: 0, learning: 1, new: 2, strong: 3 };
      return statusWeight[a.status] - statusWeight[b.status] || a.mastery - b.mastery || b.failedAttempts - a.failedAttempts;
    });
}

export function getWeakConceptIds(items: ConceptMastery[], limit = 3): string[] {
  return items
    .filter((item) => item.status === "weak" || item.status === "learning")
    .slice(0, limit)
    .map((item) => item.id);
}
