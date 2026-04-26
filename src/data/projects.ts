/**
 * Mini-guided projects.
 *
 * A "project" is a higher-level lesson made of numbered steps. Each step has
 * its own starter code, expected output and hints — the student gets feedback
 * after each step instead of only at the end.
 */

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  expectedOutput: string;
  hints: string[];
  /** Concept tags surfaced in the final summary */
  concepts: string[];
}

export interface Project {
  id: string;
  courseId: string;
  title: string;
  emoji: string;
  language: string;
  goal: string;
  description: string;
  xpReward: number;
  /** Concept summary shown at the end of the project */
  summary: string[];
  steps: ProjectStep[];
}

export const projects: Project[] = [
  {
    id: "proj-py-greeter",
    courseId: "1",
    title: "Saudador Personalizado",
    emoji: "👋",
    language: "Python",
    goal: "Construir um pequeno programa que cumprimenta um usuário pelo nome com mensagens variadas.",
    description:
      "Você vai juntar variáveis, strings e funções para criar um saudador. Cada etapa valida o que você fez antes de liberar a próxima.",
    xpReward: 60,
    summary: [
      "Variáveis e atribuição",
      "Concatenação de strings com f-strings",
      "Definição e uso de funções",
      "Chamadas com argumentos",
    ],
    steps: [
      {
        id: "step-1",
        title: "Etapa 1 — Crie a variável de nome",
        description:
          "Crie uma variável chamada `nome` com o valor `\"Ana\"` e exiba seu conteúdo com print().",
        starterCode: "# Crie a variável nome aqui\n\n",
        solution: 'nome = "Ana"\nprint(nome)',
        expectedOutput: "Ana",
        hints: [
          "Use `nome = \"Ana\"` para criar a variável.",
          "Depois passe a variável para print().",
        ],
        concepts: ["variáveis", "print"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Monte a saudação com f-string",
        description:
          "Use uma f-string para imprimir exatamente: `Olá, Ana!`",
        starterCode: 'nome = "Ana"\n# Imprima a saudação aqui\n',
        solution: 'nome = "Ana"\nprint(f"Olá, {nome}!")',
        expectedOutput: "Olá, Ana!",
        hints: [
          "f-strings começam com `f` antes das aspas.",
          "Coloque a variável entre chaves: `{nome}`.",
        ],
        concepts: ["f-strings", "interpolação"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Transforme em função",
        description:
          "Crie uma função `saudar(nome)` que devolve a saudação como string e chame-a com `\"Ana\"` dentro de um print().",
        starterCode: "# Defina a função saudar aqui\n\n",
        solution:
          'def saudar(nome):\n    return f"Olá, {nome}!"\n\nprint(saudar("Ana"))',
        expectedOutput: "Olá, Ana!",
        hints: [
          "Use `def saudar(nome):` para começar a função.",
          "Lembre de `return` em vez de print dentro da função.",
        ],
        concepts: ["funções", "return", "argumentos"],
      },
    ],
  },
  {
    id: "proj-js-counter",
    courseId: "2",
    title: "Contador Inteligente",
    emoji: "🔢",
    language: "JavaScript",
    goal: "Construir um pequeno contador que soma valores e mostra o total.",
    description:
      "Você vai praticar variáveis, operadores e console.log() construindo um contador em três etapas.",
    xpReward: 60,
    summary: [
      "Declaração com let/const",
      "Operadores aritméticos",
      "Saída com console.log",
      "Estrutura de loops básica",
    ],
    steps: [
      {
        id: "step-1",
        title: "Etapa 1 — Crie a variável total",
        description:
          "Declare uma variável `total` com valor inicial 0 e exiba-a com console.log().",
        starterCode: "// Crie a variável total aqui\n",
        solution: "let total = 0;\nconsole.log(total);",
        expectedOutput: "0",
        hints: [
          "Use `let` para declarar uma variável que pode mudar.",
          "Passe `total` para `console.log()`.",
        ],
        concepts: ["let", "console.log"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Some valores",
        description:
          "Some os valores 5, 10 e 15 ao total e mostre o resultado final (deve ser 30).",
        starterCode: "let total = 0;\n// Some os valores aqui\n",
        solution:
          "let total = 0;\ntotal += 5;\ntotal += 10;\ntotal += 15;\nconsole.log(total);",
        expectedOutput: "30",
        hints: [
          "Você pode usar `total = total + 5` ou `total += 5`.",
          "No final, exiba `total` com console.log().",
        ],
        concepts: ["operadores", "atribuição composta"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Use um loop",
        description:
          "Refaça a soma usando um for que itera de 1 a 5 e soma cada número ao total. O resultado deve ser 15.",
        starterCode: "let total = 0;\n// Escreva o for aqui\n",
        solution:
          "let total = 0;\nfor (let i = 1; i <= 5; i++) {\n  total += i;\n}\nconsole.log(total);",
        expectedOutput: "15",
        hints: [
          "Use `for (let i = 1; i <= 5; i++)`.",
          "Dentro do loop, faça `total += i`.",
        ],
        concepts: ["for", "iteração"],
      },
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectsByCourse(courseId: string): Project[] {
  return projects.filter((p) => p.courseId === courseId);
}
