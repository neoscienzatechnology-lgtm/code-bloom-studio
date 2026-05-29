import type { Course, Lesson, QuizQuestion } from "@/data/mockData";

export interface PedagogyStep {
  title: string;
  detail: string;
}

export interface PedagogyTerm {
  term: string;
  meaning: string;
}

export interface MicroCheck {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonBlueprint {
  objective: string;
  whyItMatters: string;
  mentalModel: string;
  steps: PedagogyStep[];
  terms: PedagogyTerm[];
  microChecks: MicroCheck[];
  successCriteria: string[];
}

const LANGUAGE_OUTPUT: Record<string, string> = {
  Python: "print()",
  JavaScript: "console.log()",
  React: "renderizar ou retornar JSX",
  HTML: "marcação semântica",
  CSS: "seletores e propriedades visuais",
  SQL: "consulta estruturada",
  "Node.js": "entrada, processamento e resposta",
};

const TERM_BANK: Record<string, PedagogyTerm> = {
  print: {
    term: "Saída",
    meaning: "É a forma de mostrar um resultado para você conferir se o programa fez o que deveria.",
  },
  variable: {
    term: "Variável",
    meaning: "Um nome que guarda um valor para reutilizar depois.",
  },
  function: {
    term: "Função",
    meaning: "Um bloco de código com nome, feito para executar uma tarefa específica.",
  },
  loop: {
    term: "Repetição",
    meaning: "Uma estrutura que executa a mesma ideia várias vezes sem copiar código.",
  },
  condition: {
    term: "Condição",
    meaning: "Uma pergunta que decide qual caminho o código deve seguir.",
  },
  array: {
    term: "Coleção",
    meaning: "Um grupo de valores guardados na mesma estrutura.",
  },
  object: {
    term: "Objeto",
    meaning: "Uma estrutura que agrupa informações relacionadas por nome.",
  },
  component: {
    term: "Componente",
    meaning: "Uma parte reutilizável da interface, com estrutura e comportamento próprios.",
  },
  selector: {
    term: "Seletor",
    meaning: "A parte do CSS que escolhe quais elementos receberão um estilo.",
  },
  query: {
    term: "Consulta",
    meaning: "Uma pergunta feita ao banco de dados para buscar ou modificar informações.",
  },
};

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function firstSentence(text: string): string {
  const clean = text.replace(/\*\*/g, "").replace(/`/g, "").trim();
  return clean.split(/[.!?]\s/)[0]?.trim() || clean;
}

function detectTerms(lesson: Lesson): PedagogyTerm[] {
  const haystack = normalize(`${lesson.title} ${lesson.description} ${lesson.theory}`);
  const terms: PedagogyTerm[] = [];

  const checks: Array<[string, string[]]> = [
    ["print", ["print", "console.log", "echo", "saida", "exibir"]],
    ["variable", ["variavel", "const ", "let ", "atribui", "valor"]],
    ["function", ["funcao", "function", "def ", "return"]],
    ["loop", ["loop", "for ", "while ", "repet"]],
    ["condition", ["if ", "else", "condi"]],
    ["array", ["array", "lista", "vetor"]],
    ["object", ["objeto", "propriedade"]],
    ["component", ["componente", "jsx", "react"]],
    ["selector", ["seletor", "css", "classe"]],
    ["query", ["select", "from", "where", "sql", "banco"]],
  ];

  for (const [key, needles] of checks) {
    if (needles.some((needle) => haystack.includes(needle)) && TERM_BANK[key]) {
      terms.push(TERM_BANK[key]);
    }
    if (terms.length >= 4) break;
  }

  if (terms.length === 0) {
    terms.push({
      term: "Conceito central",
      meaning: "A ideia principal desta lição. Leia o objetivo e procure aplicá-lo em uma pequena mudança de código.",
    });
  }

  return terms;
}

function buildSteps(course: Course, lesson: Lesson): PedagogyStep[] {
  const outputTool = LANGUAGE_OUTPUT[course.language] ?? "o recurso principal da linguagem";
  if (lesson.example || lesson.codeExample) {
    return [
      {
        title: "Entenda a meta",
        detail: lesson.learningObjective ?? firstSentence(lesson.description),
      },
      {
        title: "Compare com o exemplo",
        detail: lesson.example ?? `Observe como ${outputTool} aparece no exemplo antes de escrever sua solução.`,
      },
      {
        title: "Teste e explique",
        detail: `Execute, compare com "${lesson.expectedOutput}" e tente explicar por que cada linha existe.`,
      },
    ];
  }

  return [
    {
      title: "Leia a meta",
      detail: firstSentence(lesson.description),
    },
    {
      title: "Encontre a ferramenta",
      detail: `Use ${outputTool} ou o conceito destacado na teoria para produzir o menor código que resolve a tarefa.`,
    },
    {
      title: "Compare com a saída esperada",
      detail: `Execute e ajuste até o resultado ficar equivalente a: ${lesson.expectedOutput}.`,
    },
  ];
}

function fromQuiz(quiz: QuizQuestion[] | undefined): MicroCheck[] {
  if (!quiz?.length) return [];
  return quiz.slice(0, 2).map((q) => ({
    prompt: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation ?? "Essa resposta confirma o conceito principal antes da prática.",
  }));
}

function generatedChecks(course: Course, _lesson: Lesson, terms: PedagogyTerm[]): MicroCheck[] {
  const outputTool = LANGUAGE_OUTPUT[course.language] ?? "a sintaxe correta";
  return [
    {
      prompt: "Antes de codar: qual é o primeiro passo mais seguro?",
      options: [
        "Identificar exatamente o resultado esperado",
        "Copiar a solução sem ler",
        "Mudar várias coisas ao mesmo tempo",
        "Pular a teoria",
      ],
      correctIndex: 0,
      explanation: "Bons programadores reduzem ambiguidade: primeiro entendem a meta, depois escrevem código.",
    },
    {
      prompt: `Nesta lição, qual ferramenta deve aparecer na sua solução?`,
      options: [outputTool, "Um banco de dados online", "Uma imagem decorativa", "Um novo curso"],
      correctIndex: 0,
      explanation: `A prática foi desenhada para você aplicar ${outputTool} em um exemplo pequeno.`,
    },
    {
      prompt: `Qual palavra melhor resume o conceito "${terms[0].term}"?`,
      options: [terms[0].meaning, "Um erro que sempre deve ser apagado", "Uma decoração visual", "Um arquivo de configuração"],
      correctIndex: 0,
      explanation: "Nomear o conceito ajuda a reconhecer a mesma ideia em exercícios futuros.",
    },
  ];
}

export function buildLessonBlueprint(course: Course, lesson: Lesson): LessonBlueprint {
  const terms = detectTerms(lesson);
  const quizChecks = fromQuiz(lesson.quiz);
  const generated = generatedChecks(course, lesson, terms);
  const microChecks = [...quizChecks, ...generated].slice(0, 3);
  const objective = lesson.learningObjective ?? firstSentence(lesson.description);
  const summary =
    lesson.summary ??
    `Esse padrão aparece de novo em ${course.language}. Dominar agora deixa as próximas lições mais leves.`;

  return {
    objective,
    whyItMatters: summary,
    mentalModel: lesson.analogy ?? "Pense em cada exercício como uma receita curta: entrada, transformação e resultado visível.",
    steps: buildSteps(course, lesson),
    terms,
    microChecks,
    successCriteria: [
      "O código executa sem erro de sintaxe.",
      `A saída final é equivalente a "${lesson.expectedOutput}".`,
      "Você consegue explicar em uma frase por que sua solução funciona.",
    ],
  };
}
