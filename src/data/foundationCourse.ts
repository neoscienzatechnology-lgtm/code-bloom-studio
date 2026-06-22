import type { Course, Lesson, PracticeActivity, QuizQuestion } from "./mockData";

function quiz(
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  successFeedback: string,
  errorFeedback: string,
  hint: string
): QuizQuestion {
  return { question, options, correctIndex, explanation, successFeedback, errorFeedback, hint };
}

function lesson(data: Lesson): Lesson {
  return data;
}

function solutionLines(solution: string): string[] {
  return solution
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
    .slice(0, 5);
}

function shuffleForLesson(items: string[], salt: string): string[] {
  return [...items].sort((a, b) => (b + salt).localeCompare(a + salt));
}

function firstKeyword(solution: string): string {
  const candidates = ["mostrar", "console.log", "return", "function", "const", "let", "for", "if", "true", "false"];
  return candidates.find((candidate) => solution.includes(candidate)) ?? "console.log";
}

function distractorsForOutput(expectedOutput: string): string[] {
  if (expectedOutput === "true") return ["false", "undefined", "Apenas salva o valor"];
  if (/^\d+$/.test(expectedOutput)) {
    const value = Number(expectedOutput);
    return [String(value + 1), String(Math.max(0, value - 1)), "NaN"];
  }
  return ["undefined", "O programa não mostra nada", "Erro de sintaxe"];
}

function buildPracticeActivity(currentLesson: Lesson, index: number): PracticeActivity {
  const lines = solutionLines(currentLesson.solution);
  const expected = currentLesson.expectedOutput;
  const keyword = firstKeyword(currentLesson.solution);
  const codeWithBlank = currentLesson.solution.replace(keyword, "____");
  const mode = index % 5;

  if (mode === 0) {
    return {
      id: `${currentLesson.id}-practice-fill`,
      type: "fill-code",
      title: "Complete a peça central",
      prompt: "Qual palavra ou comando completa o código sem mudar a ideia da solução?",
      code: codeWithBlank,
      correctAnswer: keyword,
      successFeedback: "Boa. Você identificou a ferramenta principal antes de escrever a solução inteira.",
      errorFeedback: "Quase. A lacuna precisa da peça que faz a ação central desta aula.",
      hint: currentLesson.hints[0],
    };
  }

  if (mode === 1 && lines.length >= 2) {
    return {
      id: `${currentLesson.id}-practice-order`,
      type: "order-steps",
      title: "Organize a lógica",
      prompt: "Coloque as linhas em uma ordem que faça sentido para o computador executar.",
      options: shuffleForLesson(lines, currentLesson.id),
      correctAnswer: lines,
      successFeedback: "Ordem correta. Você montou entrada, regra e saída em uma sequência coerente.",
      errorFeedback: "A sequência ainda está confusa. Leia de cima para baixo e veja se algum valor é usado antes de existir.",
      hint: "Comece pela linha que prepara os dados e deixe a saída para o final.",
    };
  }

  if (mode === 2) {
    return {
      id: `${currentLesson.id}-practice-predict`,
      type: "predict-output",
      title: "Preveja a saída",
      prompt: "Sem executar, escolha o que esse código deve mostrar.",
      code: currentLesson.codeExample ?? currentLesson.solution,
      options: [expected, ...distractorsForOutput(expected)].slice(0, 4),
      correctAnswer: expected,
      successFeedback: "Isso. Prever a saída mostra que você entendeu o fluxo antes de depender do botão executar.",
      errorFeedback: "Ainda não. Acompanhe os valores linha por linha e compare com a saída esperada.",
      hint: "Procure a última linha que mostra ou devolve um valor.",
    };
  }

  if (mode === 3) {
    return {
      id: `${currentLesson.id}-practice-error`,
      type: "identify-error",
      title: "Encontre o erro provável",
      prompt: "Um colega tentou resolver e travou. Qual revisão ajuda primeiro?",
      code: currentLesson.starterCode,
      options: [
        currentLesson.hints[0] ?? "Comparar com a saída esperada",
        "Trocar a linguagem do curso",
        "Apagar todas as variáveis",
        "Ignorar a ordem das linhas",
      ],
      correctAnswer: currentLesson.hints[0] ?? "Comparar com a saída esperada",
      successFeedback: "Boa leitura. Você escolheu uma dica que ataca o erro mais provável.",
      errorFeedback: "Não é o melhor primeiro passo. Antes de mudar tudo, procure a menor correção verificável.",
      hint: "A melhor revisão costuma estar ligada à primeira dica da aula.",
    };
  }

  return {
    id: `${currentLesson.id}-practice-mini`,
    type: "mini-challenge",
    title: "Evidência de sucesso",
    prompt: "Qual saída confirma que você resolveu o desafio desta aula?",
    code: currentLesson.solution,
    correctAnswer: expected,
    successFeedback: "Correto. Você sabe qual evidência prova que o exercício funcionou.",
    errorFeedback: "Quase. A resposta deve bater com a saída esperada da aula.",
    hint: "Olhe para o campo de saída esperada antes de responder.",
  };
}

function conceptsForLesson(currentLesson: Lesson): string[] {
  const id = currentLesson.id;
  const map: Record<string, string[]> = {
    "10-1": ["programming", "sequence"],
    "10-2": ["algorithm", "sequence"],
    "10-3": ["sequence", "algorithm"],
    "10-4": ["debugging", "sequence"],
    "10-5": ["variables", "data_types"],
    "10-6": ["data_types", "variables"],
    "10-7": ["operators", "variables"],
    "10-8": ["prediction", "variables", "operators"],
    "10-9": ["conditionals", "comparisons"],
    "10-10": ["conditionals", "comparisons"],
    "10-11": ["comparisons", "conditionals"],
    "10-12": ["conditionals", "operators"],
    "10-13": ["loops", "sequence"],
    "10-14": ["loops", "lists"],
    "10-15": ["counters", "loops"],
    "10-16": ["loops", "counters"],
    "10-17": ["functions", "sequence"],
    "10-18": ["functions", "parameters", "return_value"],
    "10-19": ["functions", "parameters"],
    "10-20": ["functions", "return_value", "operators"],
    "10-21": ["project_planning", "input_output"],
    "10-22": ["variables", "project_planning"],
    "10-23": ["conditionals", "project_planning"],
    "10-24": ["functions", "conditionals", "input_output"],
  };

  return map[id] ?? ["programming"];
}

function foundationTryItPrompt(currentLesson: Lesson): string {
  if (currentLesson.tryItPrompt) return currentLesson.tryItPrompt;
  if (currentLesson.example) {
    return `Antes de abrir o editor, explique com suas palavras: ${currentLesson.example}`;
  }
  return `Resolva em linguagem simples primeiro: ${currentLesson.description}`;
}

function foundationCommonMistake(currentLesson: Lesson): string {
  if (currentLesson.commonMistake) return currentLesson.commonMistake;
  const conceptList = conceptsForLesson(currentLesson);

  if (conceptList.includes("programming")) {
    return "Pular direto para decorar uma linguagem. Nesta trilha, o foco é entender o raciocínio antes da sintaxe completa.";
  }
  if (conceptList.includes("variables")) {
    return "Criar valores soltos sem nome. Variáveis existem para guardar uma informação com etiqueta clara.";
  }
  if (conceptList.includes("conditionals")) {
    return "Esquecer que a condição precisa virar verdadeiro ou falso antes do programa escolher um caminho.";
  }
  if (conceptList.includes("loops")) {
    return "Repetir linhas manualmente em vez de descrever a regra da repetição.";
  }
  if (conceptList.includes("functions")) {
    return "Escrever tudo em sequência e não separar uma ação reutilizável com entrada e saída.";
  }

  return "Tentar escrever código antes de dizer qual é a entrada, quais são os passos e qual saída deve aparecer.";
}

function foundationReference(currentLesson: Lesson): string[] {
  if (currentLesson.reference?.length) return currentLesson.reference;

  const reference = [
    `Objetivo: ${currentLesson.learningObjective ?? currentLesson.description}`,
    "Entrada é a informação inicial que o programa recebe.",
    "Processamento é a regra aplicada passo a passo.",
    `Saída esperada: ${currentLesson.expectedOutput || "resultado verificável"}.`,
  ];

  if (currentLesson.codeExample) {
    reference.splice(1, 0, `Exemplo-base: ${currentLesson.codeExample.split("\n")[0]}`);
  }

  return reference.slice(0, 5);
}

const commonTags = ["Base obrigatória", "Iniciante", "Guiado"];

export const foundationProgrammingCourse: Course = {
  id: "10",
  title: "Fundamentos da Programação",
  language: "Lógica",
  emoji: "🧠",
  level: "Iniciante",
  duration: "24 lições • 6 módulos",
  students: 8900,
  progress: 0,
  color: "quest-green",
  tags: commonTags,
  description:
    "Comece do zero: entenda algoritmos, variáveis, tipos, condições, loops, funções e finalize uma calculadora simples antes de entrar na trilha de JavaScript.",
  lessons: [
    lesson({
      id: "10-1",
      module: "Módulo 1 - Primeiros passos",
      level: "Iniciante",
      estimatedMinutes: 5,
      title: "O que é programação?",
      learningObjective: "Entender que programar é escrever instruções claras para o computador executar.",
      description: "Escreva uma instrução simples que mostre uma frase na tela.",
      analogy:
        "Programar é parecido com orientar alguém passo a passo. Se a instrução fica vaga, a pessoa se perde; se fica clara, ela consegue agir.",
      example: "Para pedir um café, você não diz apenas cafe. Você explica tamanho, tipo e se quer açúcar.",
      codeExample: 'mostrar("Estou aprendendo a programar");',
      theory: `# O que é programação?

## Ideia principal
Programar é dar instruções para o computador resolver uma tarefa. O computador não entende intenção escondida. Ele segue o que foi escrito, na ordem em que foi escrito.

No começo, o objetivo não é decorar comandos. O objetivo é aprender a pensar com clareza: qual problema quero resolver, quais passos preciso seguir e qual resultado espero ver.

## Na prática
Nesta primeira etapa, vamos usar pseudocódigo: uma forma simples de escrever a ideia antes da linguagem real. O comando mostrar representa "exibir algo na tela".

Exemplo:
  mostrar("Estou aprendendo a programar");

## Erro comum
Um erro comum é achar que programação começa pela linguagem. Na verdade, começa pelo raciocínio: entender a tarefa antes de escrever código.`,
      starterCode: "// Mostre a frase: Estou programando\n",
      solution: 'mostrar("Estou programando");',
      expectedOutput: "Estou programando",
      hints: [
        "Use mostrar para exibir uma mensagem.",
        "Textos precisam ficar entre aspas.",
        "A instrução termina com parênteses fechando a mensagem.",
      ],
      xpReward: 10,
      summary:
        "Você aprendeu que programação é escrever instruções claras e verificáveis. A primeira ferramenta prática foi mostrar uma mensagem na tela.",
      nextStep: "Agora vamos transformar tarefas do dia a dia em algoritmos.",
      contrastExample: {
        wrong: "mostrar(Estou programando);",
        right: 'mostrar("Estou programando");',
        explanation:
          "Sem **aspas**, o computador tenta interpretar `Estou programando` como um comando e se perde. As aspas marcam onde a frase começa e termina.",
      },
      quiz: [
        quiz(
          "Qual opção melhor descreve programação?",
          [
            "Dar instruções claras para resolver uma tarefa",
            "Decorar nomes de linguagens",
            "Criar imagens bonitas sem lógica",
            "Adivinhar o que o computador quer",
          ],
          0,
          "Programação é comunicação precisa com o computador: você descreve passos para chegar a um resultado.",
          "Boa. Você focou na ideia central: instruções claras.",
          "Não exatamente. Antes da linguagem vem a clareza dos passos.",
          "Pense em programação como uma receita: cada passo precisa estar claro."
        ),
      ],
    }),
    lesson({
      id: "10-2",
      module: "Módulo 1 - Primeiros passos",
      level: "Iniciante",
      estimatedMinutes: 6,
      title: "Algoritmos no dia a dia",
      learningObjective: "Reconhecer que algoritmo é uma sequência de passos para chegar a um objetivo.",
      description: "Mostre três passos simples de uma rotina usando pseudocódigo.",
      analogy:
        "Um algoritmo é como uma receita curta: se você troca a ordem dos passos, o resultado pode mudar.",
      example: "Escovar os dentes tem passos: pegar escova, colocar pasta, escovar, enxaguar.",
      codeExample: 'mostrar("pegar escova");\nmostrar("colocar pasta");',
      theory: `# Algoritmos no dia a dia

## Ideia principal
Um algoritmo é uma sequência de passos para resolver um problema. Ele pode existir em português, em desenho ou em código.

Antes de programar uma calculadora, um jogo ou uma página, você pode escrever o algoritmo em linguagem simples. Isso reduz a confusão.

## Na prática
Quando uma tarefa tem ordem, ela tem lógica. Para preparar um lanche, você não coloca o prato na mesa depois de comer. A ordem importa.

Exemplo:
  mostrar("separar ingredientes");
  mostrar("montar lanche");
  mostrar("servir");

## Dica
Se você travar, responda: qual é o primeiro passo visível que aproxima o programa do objetivo?`,
      starterCode: "// Mostre os passos: acordar, estudar, praticar\n",
      solution: 'mostrar("acordar");\nmostrar("estudar");\nmostrar("praticar");',
      expectedOutput: "acordar\nestudar\npraticar",
      hints: [
        "Use uma linha de mostrar para cada passo.",
        "Mantenha os passos na ordem do enunciado.",
        "A última mensagem deve ser praticar.",
      ],
      xpReward: 10,
      summary:
        "Você viu que algoritmos são passos organizados. Essa ideia aparece em qualquer linguagem e em qualquer projeto.",
      nextStep: "Vamos observar como a ordem das instruções afeta o resultado.",
      contrastExample: {
        wrong: 'mostrar("praticar");\nmostrar("estudar");\nmostrar("acordar");',
        right: 'mostrar("acordar");\nmostrar("estudar");\nmostrar("praticar");',
        explanation:
          "Os mesmos passos em ordem trocada formam outra rotina. Em um **algoritmo**, a ordem dos passos faz parte do resultado.",
      },
      quiz: [
        quiz(
          "Qual é o melhor exemplo de algoritmo?",
          [
            "Uma sequência de passos para preparar um café",
            "Uma cor de botão",
            "Um arquivo sem instruções",
            "Um texto aleatório sem ordem",
          ],
          0,
          "Algoritmo é uma sequência organizada de ações para alcançar um resultado.",
          "Isso mesmo. Você reconheceu uma tarefa com passos claros.",
          "Quase. Procure a opção que tem começo, sequência e objetivo.",
          "Pergunte: existe uma ordem de ações para chegar a um resultado?"
        ),
      ],
    }),
    lesson({
      id: "10-3",
      module: "Módulo 1 - Primeiros passos",
      level: "Iniciante",
      estimatedMinutes: 6,
      title: "Instruções em sequência",
      learningObjective: "Entender que o programa executa as instruções de cima para baixo.",
      description: "Organize duas mensagens em sequência: primeiro preparar, depois executar.",
      analogy:
        "Um programa lê como uma lista de tarefas. Ele termina uma linha e passa para a próxima.",
      example: "Se você manda calçar o sapato antes de colocar a meia, a ordem fica estranha.",
      codeExample: 'mostrar("preparar");\nmostrar("executar");',
      theory: `# Instruções em sequência

## Ideia principal
O computador executa o código em sequência: primeiro a linha de cima, depois a próxima. Essa ordem define o comportamento.

Em programas reais, sequência aparece em login, cadastro, cálculos e jogos. Você recebe dados, processa e mostra um resultado.

## Na prática
Leia este código de cima para baixo:
  mostrar("preparar");
  mostrar("executar");

O resultado também aparece nessa ordem.

## Erro comum
Trocar a ordem das linhas pode fazer o programa mostrar algo antes da hora ou calcular com dados que ainda não existem.`,
      starterCode: "// Primeiro mostre preparar, depois mostre executar\n",
      solution: 'mostrar("preparar");\nmostrar("executar");',
      expectedOutput: "preparar\nexecutar",
      hints: [
        "A primeira linha deve mostrar preparar.",
        "A segunda linha deve mostrar executar.",
        "Use mostrar nas duas linhas.",
      ],
      xpReward: 10,
      summary:
        "Você praticou sequência: uma instrução depois da outra. Isso prepara a base para variáveis, condições e funções.",
      nextStep: "Antes de avançar, vamos entender por que erros fazem parte do processo.",
      contrastExample: {
        wrong: 'mostrar("executar");\nmostrar("preparar");',
        right: 'mostrar("preparar");\nmostrar("executar");',
        explanation:
          "O programa executa de cima para baixo. Se `executar` vem antes de `preparar`, a ação acontece **antes** da preparação.",
      },
      quiz: [
        quiz(
          "Como um algoritmo executa duas instruções simples?",
          [
            "De cima para baixo",
            "Sempre de baixo para cima",
            "Em ordem aleatória",
            "Somente a segunda linha",
          ],
          0,
          "A leitura sequencial ajuda a prever o que acontece antes de executar.",
          "Correto. Prever a ordem é uma habilidade essencial.",
          "Não ainda. Pense em como você lê uma lista de instruções.",
          "Volte ao exemplo e leia as linhas uma por uma."
        ),
      ],
    }),
    lesson({
      id: "10-4",
      module: "Módulo 1 - Primeiros passos",
      level: "Iniciante",
      estimatedMinutes: 6,
      title: "Erros fazem parte do processo",
      learningObjective: "Aprender a encarar erros como pistas para corrigir o raciocínio.",
      description: "Corrija a instrução para mostrar a mensagem sem erro.",
      analogy:
        "Erro de código é como uma placa dizendo onde a rota ficou confusa. Ele não é fracasso, é informação.",
      example: "Se a receita pede forno ligado e você esquece, o bolo não assa. O erro aponta o passo faltante.",
      codeExample: 'mostrar("corrigi o erro");',
      theory: `# Erros fazem parte do processo

## Ideia principal
Todo programador erra. A diferença está em investigar. Um erro mostra que alguma instrução está incompleta, fora de ordem ou escrita de um jeito que a linguagem não entende.

Quando algo falhar, faça três perguntas:
1. O que eu esperava que acontecesse?
2. O que aconteceu de verdade?
3. Qual linha pode explicar a diferença?

## Na prática
Muitos erros de iniciante vêm de aspas, parênteses ou nomes digitados errado.

Exemplo correto:
  mostrar("corrigi o erro");

## Dica
Corrigir erro é treino de leitura. Leia devagar e compare com o exemplo.`,
      starterCode: 'mostrar("corrigi o erro"\n',
      solution: 'mostrar("corrigi o erro");',
      expectedOutput: "corrigi o erro",
      hints: [
        "A linha precisa fechar o parêntese.",
        "Textos começam e terminam com aspas.",
        "Compare a abertura e o fechamento de parênteses.",
      ],
      xpReward: 10,
      summary:
        "Você praticou depuração inicial: observar, comparar e corrigir. Errar com atenção acelera o aprendizado.",
      nextStep: "Agora vamos trocar o pseudocódigo pelo JavaScript de verdade — e guardar informações com variáveis.",
      contrastExample: {
        wrong: 'mostrar("corrigi o erro"',
        right: 'mostrar("corrigi o erro");',
        explanation:
          "Cada `(` espera um `)` correspondente. Sem o fechamento, o computador não sabe onde a chamada termina.",
      },
      quiz: [
        quiz(
          "Qual é uma boa atitude ao encontrar um erro?",
          [
            "Ler a mensagem, comparar com o exemplo e tentar corrigir",
            "Apagar tudo sem olhar",
            "Pular para uma linguagem mais difícil",
            "Decorar a solução sem entender",
          ],
          0,
          "Erros são pistas. Investigar ajuda você a entender o código de verdade.",
          "Boa. Você tratou o erro como informação útil.",
          "Ainda não. O objetivo é investigar, não fugir do erro.",
          "Procure a alternativa que transforma o erro em uma pista."
        ),
      ],
    }),
    lesson({
      id: "10-5",
      module: "Módulo 2 - Variáveis e dados",
      level: "Iniciante",
      estimatedMinutes: 7,
      title: "O que são variáveis?",
      learningObjective: "Criar uma variável para guardar uma informação e reutilizá-la depois.",
      description: "Crie uma variável chamada nome e mostre uma saudação usando esse valor.",
      analogy:
        "Variável é uma caixinha com etiqueta: a etiqueta é o nome, e o conteúdo é o valor guardado.",
      example: "Em vez de repetir Ana várias vezes, guardamos Ana em uma variável chamada nome.",
      codeExample: 'const nome = "Ana";\nconsole.log(nome);',
      theory: `# O que são variáveis?

## Do pseudocódigo para o JavaScript
Até aqui você treinou o raciocínio em pseudocódigo, usando mostrar() para exibir mensagens. A partir de agora vamos usar JavaScript como linguagem de apoio — a mesma lógica, com os nomes oficiais:

  mostrar("Olá")   vira   console.log("Olá")

Só o vocabulário muda. O raciocínio que você treinou continua valendo igual.

## Ideia principal
Uma variável guarda uma informação para o programa usar depois. Ela tem nome e valor.

Em JavaScript, const cria uma variável cujo valor não será trocado naquele momento. O nome deve explicar o que está guardado.

Exemplo:
  const nome = "Ana";
  console.log(nome);

## Por que importa
Sem variáveis, você repete valores soltos. Com variáveis, o código fica mais fácil de ler e mudar.

## Erro comum
Texto precisa ficar entre aspas. const nome = Ana dá erro porque JavaScript procura algo chamado Ana.`,
      starterCode: "// Crie a variável nome e mostre: Olá, Ana\n",
      solution: 'const nome = "Ana";\nconsole.log("Olá, " + nome);',
      expectedOutput: "Olá, Ana",
      hints: [
        "Use const nome = \"Ana\".",
        "Junte texto com variável usando +.",
        "Mostre o resultado com console.log.",
      ],
      xpReward: 15,
      summary:
        "Você aprendeu que variáveis guardam valores com nome. Isso permite reutilizar informações e escrever código mais claro.",
      nextStep: "Vamos separar os tipos de dados mais importantes.",
      contrastExample: {
        wrong: 'const nome = Ana;\nconsole.log("Olá, " + nome);',
        right: 'const nome = "Ana";\nconsole.log("Olá, " + nome);',
        explanation:
          "Sem **aspas**, o JS procura uma variável chamada `Ana` (que não existe). As aspas marcam que `Ana` é **texto**.",
      },
      quiz: [
        quiz(
          "Qual opção melhor descreve uma variável?",
          [
            "Um lugar com nome para guardar uma informação",
            "Uma imagem dentro do site",
            "Um erro no código",
            "Um botão da página",
          ],
          0,
          "Uma variável guarda um valor para o programa lembrar e reutilizar.",
          "Isso mesmo. Variável é uma caixinha com etiqueta.",
          "Não exatamente. Pense em nome + valor guardado.",
          "Pergunte: qual opção fala de guardar uma informação?"
        ),
      ],
    }),
    lesson({
      id: "10-6",
      module: "Módulo 2 - Variáveis e dados",
      level: "Iniciante",
      estimatedMinutes: 7,
      title: "Textos, números e verdadeiro/falso",
      learningObjective: "Diferenciar string, number e boolean em exemplos simples.",
      description: "Crie três variáveis: nome, idade e estudando. Depois mostre a idade.",
      analogy:
        "Tipos de dados são como tipos de peça: texto, número e decisão não encaixam do mesmo jeito.",
      example: "Nome é texto, idade é número, estudando pode ser verdadeiro ou falso.",
      codeExample: 'const nome = "Ana";\nconst idade = 25;\nconst estudando = true;',
      theory: `# Textos, números e verdadeiro/falso

## Ideia principal
Programas trabalham com tipos de dados. Os três primeiros que você precisa reconhecer são:

String: texto entre aspas.
Number: número usado em contas.
Boolean: verdadeiro ou falso.

## Na prática
  const nome = "Ana";
  const idade = 25;
  const estudando = true;

JavaScript trata "25" como texto, mas 25 como número. Essa diferença importa em cálculos.

## Erro comum
Colocar aspas em tudo. "10" + "5" junta textos e vira "105"; 10 + 5 calcula 15.`,
      starterCode: "// Crie nome, idade e estudando. Mostre a idade.\n",
      solution: 'const nome = "Ana";\nconst idade = 25;\nconst estudando = true;\nconsole.log(idade);',
      expectedOutput: "25",
      hints: [
        "Texto fica entre aspas.",
        "Número não precisa de aspas.",
        "Booleano usa true ou false sem aspas.",
      ],
      xpReward: 15,
      summary:
        "Você separou texto, número e booleano. Entender tipos evita bugs em contas, mensagens e decisões.",
      nextStep: "Com tipos claros, vamos calcular com operadores.",
      contrastExample: {
        wrong: 'const idade = "25";\nconsole.log(idade + 1);',
        right: "const idade = 25;\nconsole.log(idade + 1);",
        explanation:
          "Com aspas, `25` vira **texto** e `idade + 1` concatena para `\"251\"`. Sem aspas, é **número** e a soma dá `26`.",
      },
      quiz: [
        quiz(
          "Qual valor é um booleano em JavaScript?",
          ["\"true\"", "25", "true", "\"Ana\""],
          2,
          "true sem aspas é booleano. Com aspas, vira texto.",
          "Boa. Você identificou verdadeiro/falso como valor lógico.",
          "Quase. Verifique se o valor tem aspas ou representa verdadeiro/falso.",
          "Booleanos são true ou false sem aspas."
        ),
      ],
    }),
    lesson({
      id: "10-7",
      module: "Módulo 2 - Variáveis e dados",
      level: "Iniciante",
      estimatedMinutes: 7,
      title: "Operadores básicos",
      learningObjective: "Usar operadores para somar, subtrair, multiplicar e dividir valores.",
      description: "Calcule o total de dois produtos e mostre o resultado.",
      analogy:
        "Operadores são ferramentas de transformação: pegam valores e produzem outro valor.",
      example: "Se um produto custa 20 e outro 15, o total é 20 + 15.",
      codeExample: "const total = 20 + 15;\nconsole.log(total);",
      theory: `# Operadores básicos

## Ideia principal
Operadores fazem operações com valores. Os primeiros são:

+ soma
- subtração
* multiplicação
/ divisão

## Na prática
  const precoA = 20;
  const precoB = 15;
  const total = precoA + precoB;
  console.log(total);

## Por que importa
Apps calculam total de compra, média, desconto, pontuação, tempo e muitas outras coisas usando operadores.

## Erro comum
Confundir texto com número. "20" + 15 vira "2015", porque o + também junta textos.`,
      starterCode: "const precoA = 20;\nconst precoB = 15;\n// calcule o total\n",
      solution: "const precoA = 20;\nconst precoB = 15;\nconst total = precoA + precoB;\nconsole.log(total);",
      expectedOutput: "35",
      hints: [
        "Crie const total.",
        "Some precoA + precoB.",
        "Mostre total com console.log.",
      ],
      xpReward: 15,
      summary:
        "Você usou operadores para transformar dados. Programas reais fazem esse ciclo o tempo todo: recebem valores, calculam e mostram resultado.",
      nextStep: "Vamos treinar prever resultados sem executar primeiro.",
      contrastExample: {
        wrong: 'const precoA = "20";\nconst precoB = 15;\nconsole.log(precoA + precoB);',
        right: "const precoA = 20;\nconst precoB = 15;\nconsole.log(precoA + precoB);",
        explanation:
          "`\"20\" + 15` **junta** como texto e dá `\"2015\"`. Sem as aspas, `+` **soma** e dá `35`.",
      },
      quiz: [
        quiz(
          "Qual é o resultado de 4 * 3?",
          ["7", "12", "43", "1"],
          1,
          "O operador * multiplica. Quatro grupos de três formam doze.",
          "Correto. Você reconheceu multiplicação.",
          "Quase. O símbolo * não soma nem junta texto.",
          "Lembre: * é multiplicação."
        ),
      ],
    }),
    lesson({
      id: "10-8",
      module: "Módulo 2 - Variáveis e dados",
      level: "Iniciante",
      estimatedMinutes: 8,
      title: "Prevendo resultados",
      learningObjective: "Ler um pequeno código e prever a saída antes de executar.",
      description: "Complete o código para que a saída final seja 30.",
      analogy:
        "Prever saída é como simular mentalmente uma receita antes de cozinhar: você antecipa o resultado dos passos.",
      example: "Se total começa em 10 e depois soma 20, a saída deve ser 30.",
      codeExample: "let total = 10;\ntotal = total + 20;\nconsole.log(total);",
      theory: `# Prevendo resultados

## Ideia principal
Bons programadores não apenas executam. Eles leem o código e tentam prever o resultado.

Isso cria uma habilidade importante: encontrar erros antes de depender do botão executar.

## Na prática
  let total = 10;
  total = total + 20;
  console.log(total);

Leia assim: total começa em 10. Depois recebe o valor antigo de total mais 20. Então vira 30.

## Dica
Quando uma variável muda, acompanhe o valor com o dedo ou anote do lado.`,
      starterCode: "let total = 10;\n// some 20 ao total\nconsole.log(total);\n",
      solution: "let total = 10;\ntotal = total + 20;\nconsole.log(total);",
      expectedOutput: "30",
      hints: [
        "Use total = total + 20.",
        "let permite trocar o valor depois.",
        "Mostre total depois da atualização.",
      ],
      xpReward: 15,
      summary:
        "Você acompanhou a mudança de uma variável. Isso prepara decisões, loops e depuração.",
      nextStep: "Agora vamos fazer o programa escolher caminhos com condições.",
      contrastExample: {
        wrong: "let total = 10;\ntotal + 20;\nconsole.log(total);",
        right: "let total = 10;\ntotal = total + 20;\nconsole.log(total);",
        explanation:
          "À esquerda, `total + 20` calcula o valor mas **não guarda** em lugar nenhum — `total` continua `10`. À direita, `total = total + 20` **atualiza** a variável para `30`.",
      },
      quiz: [
        quiz(
          "O que aparece na tela?\nlet pontos = 5;\npontos = pontos + 2;\nconsole.log(pontos);",
          ["5", "2", "7", "pontos"],
          2,
          "A variável começa em 5 e recebe 5 + 2. O novo valor é 7.",
          "Boa. Você simulou a mudança da variável.",
          "Ainda não. Acompanhe o valor antigo antes de aplicar a soma.",
          "Anote: pontos começa em 5. Depois some 2."
        ),
      ],
    }),
    lesson({
      id: "10-9",
      module: "Módulo 3 - Decisões",
      level: "Iniciante",
      estimatedMinutes: 7,
      title: "O que é uma condição?",
      learningObjective: "Entender que condições permitem escolher caminhos conforme uma regra.",
      description: "Use uma comparação para mostrar se a pessoa pode entrar.",
      analogy:
        "Condição é uma porta com regra: se a regra for verdadeira, abre; se for falsa, outro caminho acontece.",
      example: "Se idade for maior ou igual a 18, liberar entrada.",
      codeExample: 'const idade = 18;\nconsole.log(idade >= 18);',
      theory: `# O que é uma condição?

## Ideia principal
Uma condição é uma pergunta que o programa responde com verdadeiro ou falso.

Exemplos:
idade >= 18
senha === "1234"
saldo > 0

## Na prática
  const idade = 18;
  console.log(idade >= 18);

A saída é true porque 18 é maior ou igual a 18.

## Por que importa
Condições aparecem em login, compra, jogos, formulários e permissões.`,
      starterCode: "const idade = 18;\n// mostre se idade é maior ou igual a 18\n",
      solution: "const idade = 18;\nconsole.log(idade >= 18);",
      expectedOutput: "true",
      hints: [
        "Use o operador >=.",
        "A comparação devolve true ou false.",
        "Mostre a comparação dentro de console.log.",
      ],
      xpReward: 15,
      summary:
        "Você aprendeu que condições respondem verdadeiro ou falso. Esse é o primeiro passo para decisões no código.",
      nextStep: "Vamos conhecer os operadores de comparação para escrever regras precisas.",
      contrastExample: {
        wrong: "let idade = 18;\nconsole.log(idade = 20);",
        right: "let idade = 18;\nconsole.log(idade >= 18);",
        explanation:
          "`idade = 20` **substitui** o valor e devolve `20`. `idade >= 18` **compara** e devolve `true` ou `false` — que é o que uma condição precisa.",
      },
      quiz: [
        quiz(
          "Qual expressão pergunta se idade é pelo menos 18?",
          ["idade = 18", "idade >= 18", "idade + 18", "idade texto 18"],
          1,
          ">= significa maior ou igual. É uma comparação, não uma atribuição.",
          "Correto. Você escolheu uma comparação.",
          "Quase. A condição precisa fazer uma pergunta de verdadeiro/falso.",
          "Procure o operador que compara maior ou igual."
        ),
      ],
    }),
    lesson({
      id: "10-11",
      module: "Módulo 3 - Decisões",
      level: "Iniciante",
      estimatedMinutes: 7,
      title: "Comparações",
      learningObjective: "Escolher operadores de comparação adequados para regras simples.",
      description: "Compare a senha digitada com a senha correta e mostre o resultado.",
      analogy:
        "Comparar é conferir se duas informações passam na mesma regra, como validar um código de entrada.",
      example: "senhaDigitada === senhaCorreta responde true quando os dois textos são iguais.",
      codeExample: 'const senhaDigitada = "capy";\nconst senhaCorreta = "capy";\nconsole.log(senhaDigitada === senhaCorreta);',
      theory: `# Comparações

## Ideia principal
Comparações produzem true ou false. Elas ajudam o programa a decidir.

Operadores importantes:
=== igual em valor e tipo
!== diferente
> maior que
< menor que
>= maior ou igual
<= menor ou igual

## Na prática
  const senhaDigitada = "capy";
  const senhaCorreta = "capy";
  console.log(senhaDigitada === senhaCorreta);

## Erro comum
Confundir = com ===. O primeiro guarda valor. O segundo compara.`,
      starterCode: 'const senhaDigitada = "capy";\nconst senhaCorreta = "capy";\n// compare as senhas\n',
      solution:
        'const senhaDigitada = "capy";\nconst senhaCorreta = "capy";\nconsole.log(senhaDigitada === senhaCorreta);',
      expectedOutput: "true",
      hints: [
        "Use === para comparar igualdade.",
        "Compare senhaDigitada com senhaCorreta.",
        "Coloque a comparação dentro de console.log.",
      ],
      xpReward: 15,
      summary:
        "Você praticou comparações. Elas são a matéria-prima de validações, filtros, permissões e jogos.",
      nextStep: "Agora vamos usar comparações para escolher caminhos com if e else.",
      contrastExample: {
        wrong: "console.log(senhaDigitada = senhaCorreta);",
        right: "console.log(senhaDigitada === senhaCorreta);",
        explanation:
          "`=` **substitui** `senhaDigitada` pelo valor de `senhaCorreta` e imprime esse valor. `===` **compara** os dois e imprime `true` ou `false` — sem alterar nada.",
      },
      quiz: [
        quiz(
          "Qual operador compara igualdade de forma segura em JavaScript?",
          ["=", "===", "+", "=>"],
          1,
          "=== compara valor e tipo. = apenas atribui um valor a uma variável.",
          "Correto. Você evitou a confusão mais comum.",
          "Ainda não. O operador de comparação segura tem três sinais.",
          "Lembre: um igual guarda; três iguais comparam."
        ),
      ],
    }),
    lesson({
      id: "10-10",
      module: "Módulo 3 - Decisões",
      level: "Iniciante",
      estimatedMinutes: 8,
      title: "if e else na prática",
      learningObjective: "Usar if e else para executar mensagens diferentes conforme uma condição.",
      description: "Mostre Liberado quando idade for 18 ou mais; caso contrário, mostre Bloqueado.",
      analogy:
        "if/else é uma bifurcação: se a condição for verdadeira, vá por um caminho; senão, vá pelo outro.",
      example: "Se a senha estiver correta, entrar. Senão, mostrar erro.",
      codeExample: 'if (idade >= 18) {\n  console.log("Liberado");\n} else {\n  console.log("Bloqueado");\n}',
      theory: `# if e else na prática

## Ideia principal
if executa um bloco quando a condição é verdadeira. else executa outro bloco quando a condição é falsa.

## Na prática
  const idade = 18;
  if (idade >= 18) {
    console.log("Liberado");
  } else {
    console.log("Bloqueado");
  }

## Erro comum
Usar = em vez de >= ou ===. Um sinal de igual atribui valor; comparação pergunta algo.`,
      starterCode: "const idade = 18;\n// use if/else para liberar ou bloquear\n",
      solution:
        'const idade = 18;\nif (idade >= 18) {\n  console.log("Liberado");\n} else {\n  console.log("Bloqueado");\n}',
      expectedOutput: "Liberado",
      hints: [
        "Comece com if (idade >= 18).",
        "Dentro do if, mostre Liberado.",
        "Use else para o caso contrário.",
      ],
      xpReward: 20,
      summary:
        "Você escreveu sua primeira decisão completa. Agora o programa não apenas calcula: ele escolhe caminhos.",
      nextStep: "Vamos juntar tudo em um desafio de tomada de decisão.",
      contrastExample: {
        wrong: 'if (idade = 18) {\n  console.log("Liberado");\n}',
        right: 'if (idade >= 18) {\n  console.log("Liberado");\n}',
        explanation:
          "Com `=` você **atribui** `18` à variável e o `if` sempre passa. Com `>=` você **compara** e o `if` decide com base na resposta.",
      },
      quiz: [
        quiz(
          "Quando o bloco else é executado?",
          [
            "Quando a condição do if é falsa",
            "Sempre antes do if",
            "Quando o código não tem variável",
            "Somente quando há erro de sintaxe",
          ],
          0,
          "else é o caminho alternativo quando a condição do if não passa.",
          "Boa. Você entendeu a bifurcação.",
          "Não exatamente. Pense no else como o caso contrário.",
          "Leia: if significa se; else significa senão."
        ),
      ],
    }),
    lesson({
      id: "10-12",
      module: "Módulo 3 - Decisões",
      level: "Iniciante",
      estimatedMinutes: 9,
      title: "Desafio: tomada de decisão",
      learningObjective: "Combinar variável, comparação e if/else para resolver uma regra prática.",
      description: "Se a nota for 7 ou mais, mostre Aprovado. Caso contrário, mostre Revisar.",
      analogy:
        "Uma decisão de programa é como uma regra de jogo: a condição define qual resultado acontece.",
      example: "Nota 8 passa na regra nota >= 7, então o resultado é Aprovado.",
      codeExample: 'const nota = 8;\nif (nota >= 7) {\n  console.log("Aprovado");\n}',
      theory: `# Desafio: tomada de decisão

## Ideia principal
Agora você vai juntar três peças:
1. variável para guardar a nota;
2. comparação para testar a regra;
3. if/else para escolher a mensagem.

## Na prática
Leia a regra em português antes de escrever:
Se nota for maior ou igual a 7, mostrar Aprovado. Senão, mostrar Revisar.

## Dica
Quando o exercício pedir decisão, escreva primeiro a condição entre parênteses.`,
      starterCode: "const nota = 8;\n// aplique a regra de aprovação\n",
      solution:
        'const nota = 8;\nif (nota >= 7) {\n  console.log("Aprovado");\n} else {\n  console.log("Revisar");\n}',
      expectedOutput: "Aprovado",
      hints: [
        "A condição é nota >= 7.",
        "Use if para o caso aprovado.",
        "Use else para mostrar Revisar.",
      ],
      xpReward: 20,
      summary:
        "Você completou um ciclo importante: dado, regra e resultado. Isso já resolve muitos problemas pequenos.",
      nextStep: "Agora vamos evitar repetição manual com loops.",
      contrastExample: {
        wrong: 'if (nota >= 7) {\n  console.log("Aprovado");\n}\nconsole.log("Revisar");',
        right: 'if (nota >= 7) {\n  console.log("Aprovado");\n} else {\n  console.log("Revisar");\n}',
        explanation:
          "Sem `else`, o `console.log(\"Revisar\")` roda **sempre** — até quando o aluno foi aprovado. Com `else`, só roda quando a condição do `if` falha.",
      },
      quiz: [
        quiz(
          "Qual é a condição correta para aprovar com nota 7 ou mais?",
          ["nota > 7", "nota >= 7", "nota = 7", "nota <= 7"],
          1,
          ">= inclui o 7. Usar apenas > deixaria a nota 7 de fora.",
          "Boa. Você percebeu que o limite também conta.",
          "Quase. A regra diz 7 ou mais, então o 7 precisa entrar.",
          "Procure o operador que significa maior ou igual."
        ),
      ],
    }),
    lesson({
      id: "10-13",
      module: "Módulo 4 - Repetições",
      level: "Iniciante",
      estimatedMinutes: 7,
      title: "Por que usamos loops?",
      learningObjective: "Entender que loops repetem uma ação sem copiar o mesmo código várias vezes.",
      description: "Use um loop para mostrar os números de 1 a 3.",
      analogy:
        "Loop é como uma esteira: a mesma ação acontece várias vezes enquanto a regra permitir.",
      example: "Em vez de escrever três console.log, o loop muda o número automaticamente.",
      codeExample: "for (let numero = 1; numero <= 3; numero++) {\n  console.log(numero);\n}",
      theory: `# Por que usamos loops?

## Ideia principal
Loops repetem uma ação. Eles evitam copiar e colar código.

Sem loop:
  console.log(1);
  console.log(2);
  console.log(3);

Com loop:
  for (let numero = 1; numero <= 3; numero++) {
    console.log(numero);
  }

## Por que importa
Apps percorrem listas, mensagens, produtos, tarefas, alunos, pontos e muitos outros dados.`,
      starterCode: "// Mostre os números de 1 a 3 usando for\n",
      solution: "for (let numero = 1; numero <= 3; numero++) {\n  console.log(numero);\n}",
      expectedOutput: "1\n2\n3",
      hints: [
        "Comece com let numero = 1.",
        "Repita enquanto numero <= 3.",
        "Use numero++ para avançar.",
      ],
      xpReward: 20,
      summary:
        "Você aprendeu por que loops existem: repetir com regra, sem copiar e colar.",
      nextStep: "Vamos repetir ações usando listas.",
      contrastExample: {
        wrong: "for (let numero = 1; numero < 3; numero++) {\n  console.log(numero);\n}",
        right: "for (let numero = 1; numero <= 3; numero++) {\n  console.log(numero);\n}",
        explanation:
          "Com `<`, o loop **para antes do 3** (mostra só `1` e `2`). Com `<=`, **inclui** o `3` — três voltas como o exercício pede.",
      },
      quiz: [
        quiz(
          "Qual problema um loop resolve?",
          [
            "Repetir ações com uma regra",
            "Trocar a fonte do app",
            "Apagar todos os dados",
            "Criar uma senha automaticamente",
          ],
          0,
          "Loop descreve repetição controlada. Isso reduz duplicação e melhora a lógica.",
          "Correto. Você captou a utilidade real do loop.",
          "Não exatamente. Procure a opção que fala de repetição.",
          "Pense em algo que você teria que copiar várias vezes."
        ),
      ],
    }),
    lesson({
      id: "10-14",
      module: "Módulo 4 - Repetições",
      level: "Iniciante",
      estimatedMinutes: 8,
      title: "Repetindo ações",
      learningObjective: "Percorrer uma lista simples com for...of.",
      description: "Mostre cada item da lista de tarefas.",
      analogy:
        "Percorrer uma lista é como conferir itens de uma mochila, um por vez.",
      example: "Para cada tarefa em tarefas, mostre a tarefa.",
      codeExample: 'const tarefas = ["ler", "praticar"];\nfor (const tarefa of tarefas) {\n  console.log(tarefa);\n}',
      theory: `# Repetindo ações

## Ideia principal
Quando você tem uma lista, pode repetir uma ação para cada item.

Em JavaScript, for...of ajuda a ler isso quase em português:
para cada tarefa dentro de tarefas, faça algo.

## Na prática
  const tarefas = ["ler", "praticar"];
  for (const tarefa of tarefas) {
    console.log(tarefa);
  }

## Erro comum
Confundir o nome da lista com o nome do item. tarefas é a lista inteira; tarefa é um item por vez.`,
      starterCode: 'const tarefas = ["ler", "praticar", "revisar"];\n// mostre cada tarefa\n',
      solution:
        'const tarefas = ["ler", "praticar", "revisar"];\nfor (const tarefa of tarefas) {\n  console.log(tarefa);\n}',
      expectedOutput: "ler\npraticar\nrevisar",
      hints: [
        "Use for (const tarefa of tarefas).",
        "Dentro do loop, mostre tarefa.",
        "O último item mostrado será revisar.",
      ],
      xpReward: 20,
      summary:
        "Você percorreu uma lista. Essa ideia aparece em catálogos, rankings, tarefas e feeds.",
      nextStep: "Vamos controlar repetições com contadores.",
      contrastExample: {
        wrong: "for (const tarefa of tarefas) {\n  console.log(tarefas);\n}",
        right: "for (const tarefa of tarefas) {\n  console.log(tarefa);\n}",
        explanation:
          "À esquerda mostramos a **lista inteira** a cada volta. À direita mostramos cada **item** (`tarefa`) — que é o que `for...of` foi feito para entregar.",
      },
      quiz: [
        quiz(
          "No código for (const tarefa of tarefas), o que é tarefa?",
          [
            "Um item da lista por vez",
            "A lista inteira sempre",
            "Um erro de sintaxe",
            "Um número fixo",
          ],
          0,
          "A variável tarefa recebe um item diferente da lista a cada volta.",
          "Boa. Você entendeu a diferença entre item e lista.",
          "Quase. A lista é tarefas; tarefa é o item atual.",
          "Leia como: para cada tarefa dentro de tarefas."
        ),
      ],
    }),
    lesson({
      id: "10-15",
      module: "Módulo 4 - Repetições",
      level: "Iniciante",
      estimatedMinutes: 8,
      title: "Contadores",
      learningObjective: "Usar uma variável acumuladora para contar ocorrências.",
      description: "Conte quantas tarefas existem na lista e mostre o total.",
      analogy:
        "Um contador é como riscar uma marca no papel toda vez que algo acontece.",
      example: "Comece em 0 e some 1 para cada tarefa encontrada.",
      codeExample: "let total = 0;\ntotal = total + 1;",
      theory: `# Contadores

## Ideia principal
Contador é uma variável que começa em um valor e muda aos poucos.

Para contar itens, normalmente começamos em 0 e somamos 1 a cada repetição.

## Na prática
  let total = 0;
  total = total + 1;

Dentro de um loop, essa soma acontece várias vezes.

## Por que importa
Contadores aparecem em placares, carrinhos, notificações, tentativas e relatórios.`,
      starterCode: 'const tarefas = ["ler", "praticar", "revisar"];\nlet total = 0;\n// conte as tarefas\n',
      solution:
        'const tarefas = ["ler", "praticar", "revisar"];\nlet total = 0;\nfor (const tarefa of tarefas) {\n  total = total + 1;\n}\nconsole.log(total);',
      expectedOutput: "3",
      hints: [
        "Comece com total em 0.",
        "Dentro do loop, use total = total + 1.",
        "Mostre total depois do loop.",
      ],
      xpReward: 20,
      summary:
        "Você criou um contador. Agora consegue transformar repetições em números úteis.",
      nextStep: "Vamos aplicar repetição sem copiar e colar.",
      contrastExample: {
        wrong: "let total = 0;\nfor (const tarefa of tarefas) {\n  console.log(tarefa);\n}\ntotal = total + 1;\nconsole.log(total);",
        right: "let total = 0;\nfor (const tarefa of tarefas) {\n  total = total + 1;\n}\nconsole.log(total);",
        explanation:
          "À esquerda, `total = total + 1` roda **uma vez** fora do loop — sempre 1, não importa o tamanho da lista. À direita roda **a cada volta** e conta de verdade.",
      },
      quiz: [
        quiz(
          "Por que total começa em 0?",
          [
            "Porque antes de contar não encontramos nenhum item",
            "Porque loops só aceitam zero",
            "Porque JavaScript proíbe outros números",
            "Porque 0 sempre aparece na tela",
          ],
          0,
          "Antes da contagem começar, nenhum item foi contado. Por isso o contador inicia em zero.",
          "Correto. Você entendeu a ideia de acumulador.",
          "Não exatamente. Pense no estado antes de percorrer a lista.",
          "Antes da primeira volta, quantos itens foram contados?"
        ),
      ],
    }),
    lesson({
      id: "10-16",
      module: "Módulo 4 - Repetições",
      level: "Iniciante",
      estimatedMinutes: 9,
      title: "Desafio: repetir sem copiar e colar",
      learningObjective: "Substituir instruções repetidas por um loop simples.",
      description: "Mostre a mensagem Praticar três vezes usando loop.",
      analogy:
        "Se uma música repete o refrão, você não precisa escrever o refrão inteiro toda vez. Você indica a repetição.",
      example: "for com contador permite repetir exatamente três vezes.",
      codeExample: 'for (let vez = 1; vez <= 3; vez++) {\n  console.log("Praticar");\n}',
      theory: `# Desafio: repetir sem copiar e colar

## Ideia principal
Copiar a mesma linha várias vezes funciona em exercícios pequenos, mas cria código frágil.

Loops deixam a intenção clara: repetir uma ação enquanto uma regra for verdadeira.

## Na prática
  for (let vez = 1; vez <= 3; vez++) {
    console.log("Praticar");
  }

## Dica
Identifique o que muda. Neste caso, a mensagem não muda; quem muda é o contador de repetições.`,
      starterCode: "// Mostre Praticar três vezes usando for\n",
      solution: 'for (let vez = 1; vez <= 3; vez++) {\n  console.log("Praticar");\n}',
      expectedOutput: "Praticar",
      hints: [
        "Use um contador chamado vez.",
        "A condição pode ser vez <= 3.",
        "Dentro do loop, mostre Praticar.",
      ],
      xpReward: 20,
      summary:
        "Você transformou repetição manual em lógica. Essa é uma virada importante para programas maiores.",
      nextStep: "Agora vamos nomear blocos de código com funções.",
      contrastExample: {
        wrong: 'console.log("Praticar");\nconsole.log("Praticar");\nconsole.log("Praticar");',
        right: 'for (let vez = 1; vez <= 3; vez++) {\n  console.log("Praticar");\n}',
        explanation:
          "Ambos imprimem o mesmo. Mas o `for` deixa claro **o que muda** (o contador) e **o que se mantém** (a mensagem). Para repetir 10 vezes, basta trocar um número.",
      },
      quiz: [
        quiz(
          "Qual parte do for faz o contador avançar?",
          ["let vez = 1", "vez <= 3", "vez++", "console.log"],
          2,
          "vez++ aumenta o contador em 1 ao final de cada volta.",
          "Boa. Você identificou o avanço do loop.",
          "Quase. Uma parte inicia, outra testa e outra avança.",
          "Procure a parte que soma 1 ao contador."
        ),
      ],
    }),
    lesson({
      id: "10-17",
      module: "Módulo 5 - Funções",
      level: "Iniciante",
      estimatedMinutes: 7,
      title: "O que é uma função?",
      learningObjective: "Entender função como um bloco de código com nome para executar uma tarefa.",
      description: "Crie uma função chamada saudar e chame essa função.",
      analogy:
        "Função é como um botão com nome: quando você aperta, uma tarefa conhecida acontece.",
      example: "saudar() pode guardar as instruções para mostrar Olá.",
      codeExample: 'function saudar() {\n  console.log("Olá");\n}\nsaudar();',
      theory: `# O que é uma função?

## Ideia principal
Função é um bloco de código com nome. Ela permite guardar uma tarefa e executar quando precisar.

## Na prática
  function saudar() {
    console.log("Olá");
  }

  saudar();

A primeira parte define a função. A chamada saudar() executa.

## Por que importa
Funções evitam repetição e deixam programas organizados em pequenas responsabilidades.`,
      starterCode: "// Crie a função saudar e chame a função\n",
      solution: 'function saudar() {\n  console.log("Olá");\n}\n\nsaudar();',
      expectedOutput: "Olá",
      hints: [
        "Comece com function saudar().",
        "Coloque console.log dentro das chaves.",
        "Depois chame saudar().",
      ],
      xpReward: 20,
      summary:
        "Você criou e chamou uma função. Agora consegue nomear tarefas em vez de espalhar linhas soltas.",
      nextStep: "Vamos aprender entrada e saída em funções.",
      contrastExample: {
        wrong: 'function saudar() {\n  console.log("Olá");\n}',
        right: 'function saudar() {\n  console.log("Olá");\n}\n\nsaudar();',
        explanation:
          "**Definir** a função só prepara o bloco — nada acontece ainda. É a **chamada** `saudar()` que executa o código dentro dela.",
      },
      quiz: [
        quiz(
          "O que acontece quando chamamos saudar()?",
          [
            "O código dentro da função é executado",
            "A função é apagada",
            "O JavaScript troca de linguagem",
            "Nada pode acontecer",
          ],
          0,
          "A chamada executa o bloco definido dentro da função.",
          "Correto. Definir é preparar; chamar é executar.",
          "Não exatamente. Pense na chamada como apertar o botão da função.",
          "Procure a opção que fala em executar o bloco."
        ),
      ],
    }),
    lesson({
      id: "10-18",
      module: "Módulo 5 - Funções",
      level: "Iniciante",
      estimatedMinutes: 8,
      title: "Entrada e saída",
      learningObjective: "Usar parâmetro como entrada e return como saída de uma função.",
      description: "Crie uma função dobro que recebe um número e devolve o dobro.",
      analogy:
        "Função com entrada e saída é como uma máquina: entra um valor, a máquina transforma e sai outro valor.",
      example: "dobro(5) recebe 5 e devolve 10.",
      codeExample: "function dobro(numero) {\n  return numero * 2;\n}",
      theory: `# Entrada e saída

## Ideia principal
Funções podem receber informações. Essas entradas se chamam parâmetros.

Funções também podem devolver resultado usando return.

## Na prática
  function dobro(numero) {
    return numero * 2;
  }

  console.log(dobro(5));

numero é a entrada. return numero * 2 é a saída.

## Erro comum
Confundir console.log com return. console.log mostra; return devolve um valor para o resto do programa usar.`,
      starterCode: "// Crie dobro(numero) e mostre dobro(5)\n",
      solution: "function dobro(numero) {\n  return numero * 2;\n}\n\nconsole.log(dobro(5));",
      expectedOutput: "10",
      testCases: [
        { call: "dobro(5)", expected: "10" },
        { call: "dobro(7)", expected: "14" },
        { call: "dobro(0)", expected: "0" },
      ],
      hints: [
        "A função recebe numero.",
        "Use return numero * 2.",
        "Mostre console.log(dobro(5)).",
      ],
      xpReward: 20,
      summary:
        "Você aprendeu entrada e saída em funções. Isso permite criar pequenas máquinas reutilizáveis.",
      nextStep: "Vamos reutilizar a mesma função com valores diferentes.",
      contrastExample: {
        wrong: "function dobro(numero) {\n  console.log(numero * 2);\n}\nconsole.log(dobro(5));",
        right: "function dobro(numero) {\n  return numero * 2;\n}\nconsole.log(dobro(5));",
        explanation:
          "Com `console.log` **dentro** da função, ela **mostra** o valor mas **devolve `undefined`** — o `console.log` de fora imprime `undefined`. Com `return`, a função devolve `10` e o `console.log` de fora imprime `10`.",
      },
      quiz: [
        quiz(
          "No código dobro(5), o que é 5?",
          [
            "A entrada enviada para a função",
            "O nome da função",
            "Um erro obrigatório",
            "A saída sempre fixa",
          ],
          0,
          "O valor 5 entra no parâmetro numero quando a função é chamada.",
          "Boa. Você identificou a entrada da função.",
          "Quase. O nome da função é dobro; 5 é o valor enviado.",
          "Pense na máquina: o que entra nela?"
        ),
      ],
    }),
    lesson({
      id: "10-19",
      module: "Módulo 5 - Funções",
      level: "Iniciante",
      estimatedMinutes: 8,
      title: "Reutilização de código",
      learningObjective: "Chamar a mesma função mais de uma vez com entradas diferentes.",
      description: "Use a função somar para calcular 2 + 3 e 10 + 5.",
      analogy:
        "Uma função reutilizável é como uma ferramenta: você não fabrica uma chave nova para cada parafuso.",
      example: "somar(2, 3) e somar(10, 5) usam a mesma regra com entradas diferentes.",
      codeExample: "function somar(a, b) {\n  return a + b;\n}",
      theory: `# Reutilização de código

## Ideia principal
Uma função boa resolve uma tarefa pequena e pode ser chamada várias vezes.

## Na prática
  function somar(a, b) {
    return a + b;
  }

  console.log(somar(2, 3));
  console.log(somar(10, 5));

## Por que importa
Reutilização evita duplicação, reduz erro e deixa o programa mais fácil de mudar.`,
      starterCode: "// Crie somar(a, b). Mostre 2+3 e 10+5.\n",
      solution:
        "function somar(a, b) {\n  return a + b;\n}\n\nconsole.log(somar(2, 3));\nconsole.log(somar(10, 5));",
      expectedOutput: "15",
      hints: [
        "A função deve receber a e b.",
        "Retorne a + b.",
        "Chame a função duas vezes com números diferentes.",
      ],
      xpReward: 20,
      summary:
        "Você reutilizou uma função. Esse hábito organiza projetos e prepara você para componentes, APIs e bibliotecas.",
      nextStep: "Vamos fechar o módulo criando uma função simples do zero.",
      contrastExample: {
        wrong: "function somar() {\n  return 2 + 3;\n}\nconsole.log(somar());\nconsole.log(somar());",
        right: "function somar(a, b) {\n  return a + b;\n}\nconsole.log(somar(2, 3));\nconsole.log(somar(10, 5));",
        explanation:
          "À esquerda, `somar` sempre devolve `5` — qualquer chamada dá o mesmo resultado. Com **parâmetros** (`a`, `b`), a mesma função funciona para qualquer par de números.",
      },
      quiz: [
        quiz(
          "Por que reutilizar funções é útil?",
          [
            "Porque evita repetir a mesma lógica em vários lugares",
            "Porque impede qualquer erro",
            "Porque elimina variáveis",
            "Porque só funciona em exercícios",
          ],
          0,
          "Funções reduzem duplicação e deixam a lógica centralizada.",
          "Correto. Você viu o ganho de organização.",
          "Ainda não. Reutilizar não elimina todos os erros, mas reduz repetição.",
          "Procure a opção que fala de evitar duplicação."
        ),
      ],
    }),
    lesson({
      id: "10-20",
      module: "Módulo 5 - Funções",
      level: "Iniciante",
      estimatedMinutes: 9,
      title: "Desafio: criar uma função simples",
      learningObjective: "Criar uma função com parâmetro, cálculo e retorno.",
      description: "Crie calcularDesconto(preco) para devolver o preço com 10 de desconto.",
      analogy:
        "A função aplica uma regra sempre do mesmo jeito, como um cupom automático no caixa.",
      example: "calcularDesconto(50) devolve 40.",
      codeExample: "function calcularDesconto(preco) {\n  return preco - 10;\n}",
      theory: `# Desafio: criar uma função simples

## Ideia principal
Agora você vai juntar função, parâmetro, operador e return.

Regra: receber um preço e devolver o preço com 10 de desconto.

## Na prática
  function calcularDesconto(preco) {
    return preco - 10;
  }

  console.log(calcularDesconto(50));

## Dica
Leia o nome da função. Ele deve explicar exatamente o que a função faz.`,
      starterCode: "// Crie calcularDesconto(preco) e teste com 50\n",
      solution:
        "function calcularDesconto(preco) {\n  return preco - 10;\n}\n\nconsole.log(calcularDesconto(50));",
      expectedOutput: "40",
      hints: [
        "A função recebe preco.",
        "Use return preco - 10.",
        "Mostre calcularDesconto(50).",
      ],
      xpReward: 25,
      summary:
        "Você criou uma função útil com entrada, processamento e saída. Essa estrutura é base para quase todo programa.",
      nextStep: "Vamos usar tudo isso em um mini projeto de calculadora.",
      contrastExample: {
        wrong: "function calcularDesconto() {\n  return 50 - 10;\n}\nconsole.log(calcularDesconto());",
        right: "function calcularDesconto(preco) {\n  return preco - 10;\n}\nconsole.log(calcularDesconto(50));",
        explanation:
          "À esquerda, a função **só serve para 50**. Com **parâmetro**, ela calcula desconto para qualquer preço — basta chamar com outro número.",
      },
      quiz: [
        quiz(
          "Qual linha devolve o preço com 10 de desconto?",
          ["return preco - 10;", "console.log(preco);", "preco === 10;", "function preco;"],
          0,
          "return preco - 10 devolve o valor transformado para quem chamou a função.",
          "Boa. Você separou mostrar de devolver.",
          "Quase. A função precisa devolver o valor calculado.",
          "Procure a linha que usa return e uma subtração."
        ),
      ],
    }),
    lesson({
      id: "10-21",
      module: "Módulo 6 - Mini projeto",
      level: "Iniciante",
      estimatedMinutes: 8,
      title: "Planejando uma calculadora simples",
      learningObjective: "Planejar entrada, processamento e saída antes de codar o mini projeto.",
      description: "Mostre o plano da calculadora em três mensagens: entrada, processamento e saída.",
      analogy:
        "Planejar é desenhar o mapa antes da viagem. Você ainda não chegou, mas já sabe a rota.",
      example: "Entrada: números. Processamento: soma. Saída: resultado.",
      codeExample:
        'console.log("entrada: números");\nconsole.log("processamento: soma");\nconsole.log("saída: resultado");',
      theory: `# Planejando uma calculadora simples

## Ideia principal
Antes de construir, planejamos. Um programa simples pode ser pensado como:

Entrada: dados que entram.
Processamento: regra aplicada.
Saída: resultado mostrado.

## Projeto
Nossa calculadora vai receber dois números, escolher uma operação e mostrar o resultado.

## Dica
Projeto bom não começa digitando. Começa entendendo quais peças precisam existir.`,
      starterCode: "// Mostre o plano: entrada, processamento e saída\n",
      solution:
        'console.log("entrada: números");\nconsole.log("processamento: soma");\nconsole.log("saída: resultado");',
      expectedOutput: "entrada: números\nprocessamento: soma\nsaída: resultado",
      hints: [
        "Use três console.log.",
        "Mostre uma mensagem para cada parte do plano.",
        "A última mensagem deve falar da saída.",
      ],
      xpReward: 15,
      summary:
        "Você planejou um mini projeto usando entrada, processamento e saída. Isso evita código solto.",
      nextStep: "Vamos criar as variáveis da calculadora.",
      quiz: [
        quiz(
          "Em uma calculadora, os números digitados são o quê?",
          ["Entrada", "Saída", "Erro", "Layout"],
          0,
          "Os números entram no programa para serem processados pela operação.",
          "Correto. Você identificou a entrada do sistema.",
          "Quase. Pense no que o programa recebe antes de calcular.",
          "Entrada é aquilo que o programa recebe."
        ),
      ],
    }),
    lesson({
      id: "10-22",
      module: "Módulo 6 - Mini projeto",
      level: "Iniciante",
      estimatedMinutes: 8,
      title: "Criando as variáveis",
      learningObjective: "Criar variáveis para representar os dados do mini projeto.",
      description: "Crie numeroA, numeroB e operacao. Depois mostre a operação.",
      analogy:
        "Variáveis do projeto são como etiquetas em uma mesa de trabalho: cada dado tem seu lugar.",
      example: "numeroA guarda 10, numeroB guarda 5 e operacao guarda soma.",
      codeExample: 'const numeroA = 10;\nconst numeroB = 5;\nconst operacao = "soma";',
      theory: `# Criando as variáveis

## Ideia principal
Projetos ficam mais claros quando cada dado importante tem um nome.

Nossa calculadora precisa de:
numeroA
numeroB
operacao

## Na prática
  const numeroA = 10;
  const numeroB = 5;
  const operacao = "soma";

## Erro comum
Usar nomes genéricos como x e y antes de entender o problema. Para iniciante, nomes descritivos ajudam muito.`,
      starterCode: "// Crie numeroA, numeroB e operacao. Mostre operacao.\n",
      solution:
        'const numeroA = 10;\nconst numeroB = 5;\nconst operacao = "soma";\nconsole.log(operacao);',
      expectedOutput: "soma",
      hints: [
        "numeroA e numeroB são números.",
        "operacao é texto, então use aspas.",
        "Mostre operacao com console.log.",
      ],
      xpReward: 15,
      summary:
        "Você criou os dados do projeto com nomes claros. Agora a regra de cálculo fica mais fácil.",
      nextStep: "Vamos usar condições para escolher a operação.",
      contrastExample: {
        wrong: 'const x = 10;\nconst y = 5;\nconst z = "soma";',
        right: 'const numeroA = 10;\nconst numeroB = 5;\nconst operacao = "soma";',
        explanation:
          "À esquerda, `x`, `y`, `z` não dizem nada — quem ler depois precisa adivinhar. **Nomes descritivos** explicam o que cada dado representa.",
      },
      quiz: [
        quiz(
          "Por que o valor soma fica entre aspas?",
          [
            "Porque é texto",
            "Porque é número",
            "Porque é uma condição",
            "Porque todo valor precisa de aspas",
          ],
          0,
          "soma descreve uma operação em texto. Números não precisam de aspas.",
          "Boa. Você diferenciou texto e número no projeto.",
          "Ainda não. A operação é uma palavra, não um cálculo.",
          "Pergunte: soma aqui é uma palavra ou um número?"
        ),
      ],
    }),
    lesson({
      id: "10-23",
      module: "Módulo 6 - Mini projeto",
      level: "Iniciante",
      estimatedMinutes: 9,
      title: "Criando as condições",
      learningObjective: "Usar if/else para escolher a operação da calculadora.",
      description: "Se operacao for soma, calcule numeroA + numeroB e mostre o resultado.",
      analogy:
        "A condição é como escolher a ferramenta certa: se a etiqueta diz soma, use adição.",
      example: "operacao === \"soma\" decide se a calculadora deve somar.",
      codeExample:
        'if (operacao === "soma") {\n  console.log(numeroA + numeroB);\n}',
      theory: `# Criando as condições

## Ideia principal
Uma calculadora precisa decidir qual operação aplicar. Para isso, usamos condição.

## Na prática
  if (operacao === "soma") {
    console.log(numeroA + numeroB);
  }

## Por que importa
Esse padrão aparece em menus, botões, filtros e jogos: olhar um valor e escolher uma ação.

## Dica
Compare texto com === e mantenha o texto entre aspas.`,
      starterCode: 'const numeroA = 10;\nconst numeroB = 5;\nconst operacao = "soma";\n// se for soma, mostre o resultado\n',
      solution:
        'const numeroA = 10;\nconst numeroB = 5;\nconst operacao = "soma";\nif (operacao === "soma") {\n  console.log(numeroA + numeroB);\n}',
      expectedOutput: "15",
      hints: [
        "A condição é operacao === \"soma\".",
        "Dentro do if, some numeroA + numeroB.",
        "Mostre a soma com console.log.",
      ],
      xpReward: 25,
      summary:
        "Você colocou decisão dentro do mini projeto. Agora a calculadora começa a ter comportamento.",
      nextStep: "Vamos finalizar com uma função reutilizável.",
      contrastExample: {
        wrong: 'if (operacao = "soma") {\n  console.log(numeroA + numeroB);\n}',
        right: 'if (operacao === "soma") {\n  console.log(numeroA + numeroB);\n}',
        explanation:
          "Com `=`, você **atribui** \"soma\" à variável e o `if` **sempre** entra. Com `===`, você **compara** e o `if` só age quando a operação realmente for `soma`.",
      },
      quiz: [
        quiz(
          "Qual comparação verifica se a operação é soma?",
          ['operacao === "soma"', "operacao = soma", "operacao + soma", "soma > operacao"],
          0,
          "=== compara o texto guardado em operacao com o texto soma.",
          "Correto. Essa condição ativa a operação certa.",
          "Quase. Texto precisa de aspas e comparação usa ===.",
          "Procure a opção que compara com o texto entre aspas."
        ),
      ],
    }),
    lesson({
      id: "10-24",
      module: "Módulo 6 - Mini projeto",
      level: "Iniciante",
      estimatedMinutes: 10,
      title: "Finalizando o projeto",
      learningObjective: "Finalizar a calculadora simples usando função, condição e retorno.",
      description: "Crie calcular(a, b, operacao) e use a operação soma para devolver 15.",
      analogy:
        "Finalizar o projeto é encaixar as peças: dados entram, a função decide, o resultado sai.",
      example: "calcular(10, 5, \"soma\") deve devolver 15.",
      codeExample:
        'function calcular(a, b, operacao) {\n  if (operacao === "soma") {\n    return a + b;\n  }\n  return 0;\n}',
      theory: `# Finalizando o projeto

## Ideia principal
Agora juntamos tudo:
variáveis, tipos, operadores, condição e função.

## Na prática
  function calcular(a, b, operacao) {
    if (operacao === "soma") {
      return a + b;
    }
    return 0;
  }

  console.log(calcular(10, 5, "soma"));

## O que você construiu
Você criou uma versão simples de uma calculadora. Pequena, mas real: ela recebe dados, aplica regra e devolve resultado.

## Próxima etapa
Depois desta base, HTML, CSS e JavaScript no navegador ficam muito mais fáceis de entender.`,
      starterCode: "// Finalize a calculadora com uma função calcular\n",
      solution:
        'function calcular(a, b, operacao) {\n  if (operacao === "soma") {\n    return a + b;\n  }\n  return 0;\n}\n\nconsole.log(calcular(10, 5, "soma"));',
      expectedOutput: "15",
      hints: [
        "A função recebe a, b e operacao.",
        "Se operacao for soma, retorne a + b.",
        "Mostre calcular(10, 5, \"soma\").",
      ],
      xpReward: 30,
      summary:
        "Você concluiu a trilha inicial com um mini projeto. Agora já entende o ciclo base de um programa: entrada, processamento, decisão e saída.",
      nextStep: "Siga para HTML/CSS se quiser criar páginas, ou JavaScript se quiser aprofundar lógica.",
      contrastExample: {
        wrong: 'function calcular(a, b, operacao) {\n  if (operacao === "soma") {\n    console.log(a + b);\n  }\n}\nconsole.log(calcular(10, 5, "soma"));',
        right: 'function calcular(a, b, operacao) {\n  if (operacao === "soma") {\n    return a + b;\n  }\n  return 0;\n}\n\nconsole.log(calcular(10, 5, "soma"));',
        explanation:
          "À esquerda, a função **mostra** o valor mas não devolve nada — o `console.log` de fora imprime `undefined` depois. À direita, `return` devolve `15` para quem chamou a função usar.",
      },
      quiz: [
        quiz(
          "Quais conceitos aparecem na calculadora final?",
          [
            "Função, parâmetros, condição, operador e retorno",
            "Apenas cor e imagem",
            "Somente HTML",
            "Banco de dados e deploy",
          ],
          0,
          "O projeto final junta os fundamentos que foram praticados nos módulos anteriores.",
          "Boa. Você reconheceu as peças do projeto.",
          "Ainda não. Releia o código e nomeie cada peça usada.",
          "Procure a opção que lista as partes do código final."
        ),
      ],
    }),
  ],
};

foundationProgrammingCourse.lessons = foundationProgrammingCourse.lessons.map((currentLesson, index) => ({
  ...currentLesson,
  tryItPrompt: foundationTryItPrompt(currentLesson),
  commonMistake: foundationCommonMistake(currentLesson),
  reference: foundationReference(currentLesson),
  concepts: conceptsForLesson(currentLesson),
  practiceActivities: [buildPracticeActivity(currentLesson, index)],
}));
