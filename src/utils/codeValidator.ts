export type ErrorKind =
  | "empty"
  | "no_print"
  | "case_or_punct"
  | "wrong_quotes"
  | "missing_keyword"
  | "output_mismatch"
  | "syntax"
  | "unknown";

type ValidationResult = {
  level: "exact" | "flexible" | "close" | "wrong";
  message: string;
  errorKind?: ErrorKind;
  reflectiveQuestion?: string;
};

function normalize(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/['"`]/g, '"')
    .replace(/\t/g, " ")
    .replace(/[ ]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join("\n")
    .toLowerCase();
}

function removeAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1;
  const dist = levenshtein(longer, shorter);
  return (longer.length - dist) / longer.length;
}

function levenshtein(a: string, b: string): number {
  const m = a.length,
    n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val = Math.min(dp[j] + 1, prev + 1, dp[j - 1] + cost);
      dp[j - 1] = prev;
      prev = val;
    }
    dp[n] = prev;
  }
  return dp[n];
}

function classifyError(userCode: string, expectedOutput: string, solution: string): { kind: ErrorKind; hint: string; question: string } {
  const code = userCode.toLowerCase();
  const expected = expectedOutput.toLowerCase();
  const sol = solution.toLowerCase();
  const solutionShowsOutput =
    sol.includes("print") ||
    sol.includes("console.log") ||
    sol.includes("echo") ||
    sol.includes("return");

  if (!userCode.trim()) {
    return {
      kind: "empty",
      hint: "Você ainda não escreveu nada. Use a teoria como guia para começar.",
      question: "Qual é o primeiro comando que você precisa para mostrar algo na tela?",
    };
  }

  if (solutionShowsOutput && !code.includes("print") && !code.includes("console.log") && !code.includes("echo") && !code.includes("return")) {
    return {
      kind: "no_print",
      hint: "Parece que você não está exibindo nada na tela.",
      question: "Como você mostra um valor para o usuário ver? (dica: precisa de uma função de saída)",
    };
  }

  // detect mismatched quotes (e.g. user used backticks but solution uses double quotes)
  const userQuotes = (userCode.match(/["'`]/g) || []).join("");
  const solQuotes = (solution.match(/["'`]/g) || []).join("");
  if (userQuotes && solQuotes && !userQuotes.split("").some((q) => solQuotes.includes(q))) {
    return {
      kind: "wrong_quotes",
      hint: "Você usou um tipo de aspa diferente do esperado.",
      question: "Em que situações usamos aspas simples, duplas ou crases nessa linguagem?",
    };
  }

  // detect close output (case/accent/punct)
  const noAccUser = removeAccents(code);
  const noAccExpected = removeAccents(expected);
  if (noAccExpected.length >= 3 && noAccUser.includes(noAccExpected.slice(0, Math.min(4, noAccExpected.length)))) {
    return {
      kind: "case_or_punct",
      hint: "Você está pertinho! O conteúdo está correto, mas há diferenças de pontuação, maiúsculas/minúsculas ou acentos.",
      question: "Compare letra por letra com a saída esperada — onde está a diferença?",
    };
  }

  // detect missing keyword from solution (e.g. forgot 'def', 'function', 'if')
  const keywords = ["def ", "function", "if ", "for ", "while ", "return", "let ", "const ", "var "];
  for (const kw of keywords) {
    if (sol.includes(kw) && !code.includes(kw.trim())) {
      return {
        kind: "missing_keyword",
        hint: `Sua solução parece esquecer uma palavra-chave importante: \`${kw.trim()}\`.`,
        question: `Para que serve \`${kw.trim()}\` nesse exercício?`,
      };
    }
  }

  // unbalanced parens/brackets/quotes
  const opens = (userCode.match(/[({[]/g) || []).length;
  const closes = (userCode.match(/[)}\]]/g) || []).length;
  if (opens !== closes) {
    return {
      kind: "syntax",
      hint: "Tem um parêntese, colchete ou chave que não fechou corretamente.",
      question: "Conte os abre e fecha — eles estão pareados?",
    };
  }

  return {
    kind: "output_mismatch",
    hint: `A saída esperada é \`${expectedOutput}\`, mas seu código produz algo diferente.`,
    question: "O que cada linha do seu código está realmente fazendo? Tente ler em voz alta passo a passo.",
  };
}

export function validateCode(
  userCode: string,
  expectedOutput: string,
  solution: string
): ValidationResult {
  const trimmedCode = userCode.trim();

  if (!trimmedCode || trimmedCode.startsWith("#") || trimmedCode.startsWith("//")) {
    return {
      level: "wrong",
      message: "Escreva seu código antes de executar! Use a teoria acima como guia.",
      errorKind: "empty",
      reflectiveQuestion: "Qual é o primeiro comando que você precisa para mostrar algo na tela?",
    };
  }

  // Exact match
  if (userCode.includes(expectedOutput) || userCode.includes(solution)) {
    return { level: "exact", message: "Correto! 🎉" };
  }

  const normUser = normalize(userCode);
  const normExpected = normalize(expectedOutput);
  const normSolution = normalize(solution);

  // Flexible match (normalized)
  if (normUser.includes(normExpected) || normUser.includes(normSolution)) {
    return { level: "flexible", message: "Correto! 🎉" };
  }

  // Try without accents
  const noAccUser = removeAccents(normUser);
  const noAccExpected = removeAccents(normExpected);
  const noAccSolution = removeAccents(normSolution);

  if (noAccUser.includes(noAccExpected) || noAccUser.includes(noAccSolution)) {
    return {
      level: "flexible",
      message: "Correto! 🎉 (pequenas diferenças de acentuação ignoradas)",
    };
  }

  const classification = classifyError(userCode, expectedOutput, solution);

  // Similarity check
  const simExpected = similarity(normUser, normExpected);
  const simSolution = similarity(normUser, normSolution);
  const bestSim = Math.max(simExpected, simSolution);

  if (bestSim >= 0.85) {
    return {
      level: "close",
      message: classification.hint,
      errorKind: classification.kind,
      reflectiveQuestion: classification.question,
    };
  }

  if (bestSim >= 0.6) {
    return {
      level: "close",
      message: classification.hint,
      errorKind: classification.kind,
      reflectiveQuestion: classification.question,
    };
  }

  return {
    level: "wrong",
    message: classification.hint,
    errorKind: classification.kind,
    reflectiveQuestion: classification.question,
  };
}
