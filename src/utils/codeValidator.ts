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

export interface LessonTestCase {
  call: string;
  expected: string;
}

type ValidationOptions = {
  starterCode?: string;
  testCases?: LessonTestCase[];
};

export interface TestCaseRunResult {
  passed: number;
  total: number;
  allPassed: boolean;
  firstFailure?: { call: string; expected: string; got: string };
}

// Runs the learner's JavaScript in a sandboxed Function, evaluating each
// `call` expression and comparing the result to `expected`. Suited to small
// pure functions; opt-in per lesson via the `testCases` field.
export function runJsTestCases(userCode: string, testCases: LessonTestCase[]): TestCaseRunResult {
  let passed = 0;
  let firstFailure: TestCaseRunResult["firstFailure"];

  for (const testCase of testCases) {
    let got: string;
    try {
      const run = new Function(`"use strict";\n${userCode}\n;return (${testCase.call});`);
      const value = run();
      got = value === undefined ? "undefined" : String(value);
    } catch (error) {
      got = error instanceof Error ? `erro: ${error.message}` : "erro";
    }

    if (got.trim() === testCase.expected.trim()) {
      passed += 1;
    } else if (!firstFailure) {
      firstFailure = { call: testCase.call, expected: testCase.expected, got };
    }
  }

  return { passed, total: testCases.length, allPassed: passed === testCases.length && testCases.length > 0, firstFailure };
}

function stripLineComment(line: string): string {
  let quote: string | null = null;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    const prev = line[i - 1];

    if ((char === '"' || char === "'" || char === "`") && prev !== "\\") {
      quote = quote === char ? null : quote ? quote : char;
      continue;
    }

    if (!quote && char === "/" && next === "/") return line.slice(0, i);
  }

  return line.trimStart().startsWith("#") ? "" : line;
}

function stripComments(code: string): string {
  return code
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map(stripLineComment)
    .join("\n");
}

function normalize(text: string, options: { stripCodeComments?: boolean } = {}): string {
  const source = options.stripCodeComments ? stripComments(text) : text;

  return source
    .normalize("NFC")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/['"`]/g, '"')
    .replace(/\t/g, " ")
    .replace(/[ ]+/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .toLowerCase();
}

function removeImportBoilerplate(code: string): string {
  return code
    .split("\n")
    .filter((line) => !/^\s*import\s/.test(line))
    .join("\n");
}

function removeAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function hasBalancedDelimiters(code: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  let quote: string | null = null;

  for (let i = 0; i < code.length; i += 1) {
    const char = code[i];
    const prev = code[i - 1];

    if ((char === '"' || char === "'" || char === "`") && prev !== "\\") {
      quote = quote === char ? null : quote ? quote : char;
      continue;
    }

    if (quote) continue;

    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else if (char === ")" || char === "]" || char === "}") {
      if (stack.pop() !== pairs[char]) return false;
    }
  }

  return stack.length === 0 && quote === null;
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
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i += 1) {
    let prev = i;
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val = Math.min(dp[j] + 1, prev + 1, dp[j - 1] + cost);
      dp[j - 1] = prev;
      prev = val;
    }
    dp[n] = prev;
  }
  return dp[n];
}

function splitOutsideQuotes(value: string, separator: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quote: string | null = null;

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    const prev = value[i - 1];

    if ((char === '"' || char === "'" || char === "`") && prev !== "\\") {
      quote = quote === char ? null : quote ? quote : char;
    }

    if (!quote && char === separator) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  parts.push(current);
  return parts;
}

function unquote(value: string): string | null {
  const trimmed = value.trim();
  const quote = trimmed[0];
  if ((quote === '"' || quote === "'" || quote === "`") && trimmed.at(-1) === quote) {
    return trimmed.slice(1, -1);
  }
  return null;
}

function buildEnvironment(code: string): Record<string, string | number | boolean | string[]> {
  const env: Record<string, string | number | boolean | string[]> = {};
  const activeCode = stripComments(code);
  const declarationRegex = /(?:\b(?:const|let|var)\s+|^\s*)([A-Za-z_$][\w$]*)\s*=\s*([^;\n]+)/gm;
  let match: RegExpExecArray | null;

  while ((match = declarationRegex.exec(activeCode))) {
    const name = match[1];
    const rawValue = match[2].trim();
    const stringValue = unquote(rawValue);

    if (stringValue !== null) {
      env[name] = stringValue;
    } else if (/^\d+(\.\d+)?$/.test(rawValue)) {
      env[name] = Number(rawValue);
    } else if (/^(true|false)$/i.test(rawValue)) {
      env[name] = rawValue.toLowerCase() === "true";
    } else if (/^\[[\s\S]*\]$/.test(rawValue)) {
      env[name] = rawValue
        .slice(1, -1)
        .split(",")
        .map((item) => unquote(item.trim()) ?? item.trim())
        .filter(Boolean);
    }
  }

  return env;
}

function applyStringMethods(value: string, methods: string): string {
  let result = value;
  if (/\.(trim|strip)\(\)/.test(methods)) result = result.trim();
  if (/\.(toLowerCase|lower)\(\)/.test(methods)) result = result.toLowerCase();
  if (/\.(toUpperCase|upper)\(\)/.test(methods)) result = result.toUpperCase();
  return result;
}

function evaluateExpression(
  expression: string,
  env: Record<string, string | number | boolean | string[]>,
): string | null {
  const expr = expression.trim().replace(/;$/, "");
  const directString = unquote(expr);
  if (directString !== null) return directString;
  if (/^\d+(\.\d+)?$/.test(expr) || /^(true|false)$/i.test(expr)) return expr;

  const methodMatch = expr.match(/^([A-Za-z_$][\w$]*)(\.(?:trim|strip|toLowerCase|lower|toUpperCase|upper)\(\))+$/);
  if (methodMatch && typeof env[methodMatch[1]] === "string") {
    return applyStringMethods(String(env[methodMatch[1]]), expr.slice(methodMatch[1].length));
  }

  const lengthMatch = expr.match(/^([A-Za-z_$][\w$]*)\.length$/);
  if (lengthMatch) {
    const value = env[lengthMatch[1]];
    if (Array.isArray(value)) {
      return String(value.length);
    }
  }

  if (Object.prototype.hasOwnProperty.call(env, expr)) return String(env[expr]);

  if (expr.startsWith("`") && expr.endsWith("`")) {
    return expr.slice(1, -1).replace(/\$\{([^}]+)\}/g, (_, inner) => evaluateExpression(inner, env) ?? "");
  }

  const concatParts = splitOutsideQuotes(expr, "+");
  if (concatParts.length > 1) {
    const evaluated = concatParts.map((part) => evaluateExpression(part, env));
    if (evaluated.every((part) => part !== null)) return evaluated.join("");
  }

  const arithmetic = expr.replace(/\b[A-Za-z_$][\w$]*\b/g, (name) =>
    typeof env[name] === "number" ? String(env[name]) : name,
  );
  if (/^[\d\s+\-*/().]+$/.test(arithmetic)) {
    try {
      const value = Function(`"use strict"; return (${arithmetic});`)();
      if (typeof value === "number" && Number.isFinite(value)) return String(value);
    } catch {
      return null;
    }
  }

  return null;
}

function findMatchingParen(code: string, openIndex: number): number {
  let depth = 0;
  let quote: string | null = null;

  for (let i = openIndex; i < code.length; i += 1) {
    const char = code[i];
    const prev = code[i - 1];

    if ((char === '"' || char === "'" || char === "`") && prev !== "\\") {
      quote = quote === char ? null : quote ? quote : char;
      continue;
    }

    if (quote) continue;
    if (char === "(") depth += 1;
    if (char === ")") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function extractCallArguments(code: string, callNames: string[]): string[] {
  const args: string[] = [];

  for (const name of callNames) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedName}\\s*\\(`, "g");
    let match: RegExpExecArray | null;

    while ((match = regex.exec(code))) {
      const openIndex = code.indexOf("(", match.index);
      const closeIndex = findMatchingParen(code, openIndex);
      if (closeIndex > openIndex) {
        args.push(code.slice(openIndex + 1, closeIndex));
        regex.lastIndex = closeIndex + 1;
      }
    }
  }

  return args;
}

function extractVisibleOutputs(code: string): string[] {
  const activeCode = stripComments(code);
  const env = buildEnvironment(activeCode);
  const outputs: string[] = [];
  const returnRegex = /\breturn\s+([^;\n]+)/g;
  const echoRegex = /\becho\s+([^;\n]+)/g;
  let match: RegExpExecArray | null;

  for (const argument of extractCallArguments(activeCode, ["console.log", "print", "mostrar", "alert", "res.end"])) {
    const value = evaluateExpression(argument, env);
    if (value !== null) outputs.push(value);
  }

  while ((match = echoRegex.exec(activeCode))) {
    const value = evaluateExpression(match[1], env);
    if (value !== null) outputs.push(value);
  }

  while ((match = returnRegex.exec(activeCode))) {
    if (match[1].trim().startsWith("<")) continue;
    const value = evaluateExpression(match[1], env);
    if (value !== null) outputs.push(value);
  }

  return outputs;
}

function solutionRequiresVisibleOutput(solution: string): boolean {
  return /\b(?:console\.log|print|mostrar|alert|res\.end|echo)\b/.test(solution);
}

function outputsContainExpected(outputs: string[], expectedOutput: string): boolean {
  const expected = normalize(expectedOutput);
  const expectedNoAccents = removeAccents(expected);

  return outputs.some((output) => {
    const normalizedOutput = normalize(output);
    return normalizedOutput === expected || removeAccents(normalizedOutput) === expectedNoAccents;
  });
}

function classifyError(userCode: string, expectedOutput: string, solution: string): { kind: ErrorKind; hint: string; question: string } {
  const activeCode = stripComments(userCode);
  const code = activeCode.toLowerCase();
  const expected = expectedOutput.toLowerCase();
  const sol = solution.toLowerCase();
  const solutionShowsOutput = solutionRequiresVisibleOutput(solution) || /\breturn\b/.test(sol);

  if (!activeCode.trim()) {
    return {
      kind: "empty",
      hint: "Você ainda não escreveu nada. Use a teoria como guia para começar.",
      question: "Qual é o primeiro comando que você precisa para mostrar algo na tela?",
    };
  }

  if (
    solutionShowsOutput &&
    !code.includes("print") &&
    !code.includes("console.log") &&
    !code.includes("mostrar") &&
    !code.includes("echo") &&
    !code.includes("return") &&
    !code.includes("res.end")
  ) {
    return {
      kind: "no_print",
      hint: "Parece que você não está exibindo nada na tela.",
      question: "Como você mostra um valor para o usuário ver? (dica: precisa de uma função de saída)",
    };
  }

  const userQuotes = (activeCode.match(/["'`]/g) || []).join("");
  const solQuotes = (solution.match(/["'`]/g) || []).join("");
  if (userQuotes && solQuotes && !userQuotes.split("").some((quote) => solQuotes.includes(quote))) {
    return {
      kind: "wrong_quotes",
      hint: "Você usou um tipo de aspa diferente do esperado.",
      question: "Em que situações usamos aspas simples, duplas ou crases nessa linguagem?",
    };
  }

  const noAccUser = removeAccents(code);
  const noAccExpected = removeAccents(expected);
  if (noAccExpected.length >= 3 && noAccUser.includes(noAccExpected.slice(0, Math.min(4, noAccExpected.length)))) {
    return {
      kind: "case_or_punct",
      hint: "Você está pertinho! O conteúdo está correto, mas há diferenças de pontuação, maiúsculas/minúsculas ou acentos.",
      question: "Compare letra por letra com a saída esperada: onde está a diferença?",
    };
  }

  const keywords = ["def ", "function", "if ", "for ", "while ", "return", "let ", "const ", "var "];
  for (const keyword of keywords) {
    if (sol.includes(keyword) && !code.includes(keyword.trim())) {
      return {
        kind: "missing_keyword",
        hint: `Sua solução parece esquecer uma palavra-chave importante: \`${keyword.trim()}\`.`,
        question: `Para que serve \`${keyword.trim()}\` nesse exercício?`,
      };
    }
  }

  if (!hasBalancedDelimiters(activeCode)) {
    return {
      kind: "syntax",
      hint: "Tem um parêntese, colchete ou chave que não fechou corretamente.",
      question: "Conte os abre e fecha: eles estão pareados?",
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
  solution: string,
  options: ValidationOptions = {},
): ValidationResult {
  const trimmedCode = userCode.trim();
  const activeCode = stripComments(userCode);

  if (!trimmedCode || !activeCode.trim()) {
    return {
      level: "wrong",
      message: "Escreva seu código antes de executar! Use a teoria acima como guia.",
      errorKind: "empty",
      reflectiveQuestion: "Qual é o primeiro comando que você precisa para mostrar algo na tela?",
    };
  }

  const normUser = normalize(activeCode, { stripCodeComments: true });
  const normMeaningfulUser = normalize(removeImportBoilerplate(activeCode), { stripCodeComments: true });
  const normExpected = normalize(expectedOutput);
  const normSolution = normalize(solution, { stripCodeComments: true });
  const normStarter = options.starterCode ? normalize(options.starterCode, { stripCodeComments: true }) : "";

  if (normStarter && normUser === normStarter && normStarter !== normSolution) {
    return {
      level: "wrong",
      message: "Você ainda está no código inicial. Faça uma alteração que resolva o desafio antes de executar.",
      errorKind: "unknown",
      reflectiveQuestion: "Qual parte do código inicial ainda precisa virar uma solução completa?",
    };
  }

  if (!hasBalancedDelimiters(activeCode)) {
    return {
      level: "wrong",
      message: "Tem um parêntese, colchete, chave ou aspa que não fechou corretamente.",
      errorKind: "syntax",
      reflectiveQuestion: "Conte os abre e fecha: eles estão pareados?",
    };
  }

  if (options.testCases?.length) {
    const cases = runJsTestCases(activeCode, options.testCases);
    if (cases.allPassed) {
      return { level: "exact", message: `Correto! Passou em ${cases.total}/${cases.total} casos de teste. 🎉` };
    }
    const failureDetail = cases.firstFailure
      ? ` Ex.: \`${cases.firstFailure.call}\` deveria dar \`${cases.firstFailure.expected}\`, mas deu \`${cases.firstFailure.got}\`.`
      : "";
    return {
      level: cases.passed > 0 ? "close" : "wrong",
      message:
        cases.passed > 0
          ? `Passou em ${cases.passed} de ${cases.total} casos.${failureDetail}`
          : `Ainda não passou nos casos de teste.${failureDetail}`,
      errorKind: "output_mismatch",
      reflectiveQuestion: "Sua função devolve o valor certo para cada entrada testada?",
    };
  }

  if (normUser.includes(normSolution)) {
    return { level: "exact", message: "Correto! 🎉" };
  }

  const visibleOutputs = extractVisibleOutputs(activeCode);
  const needsVisibleOutput = solutionRequiresVisibleOutput(solution);

  if (outputsContainExpected(visibleOutputs, expectedOutput)) {
    return { level: "exact", message: "Correto! 🎉" };
  }

  if (!needsVisibleOutput && normMeaningfulUser.includes(normExpected)) {
    return { level: "exact", message: "Correto! 🎉" };
  }

  const noAccUser = removeAccents(normUser);
  const noAccExpected = removeAccents(normExpected);
  const noAccSolution = removeAccents(normSolution);

  const noAccMeaningfulUser = removeAccents(normMeaningfulUser);

  if (noAccUser.includes(noAccSolution) || (!needsVisibleOutput && noAccMeaningfulUser.includes(noAccExpected))) {
    return {
      level: "flexible",
      message: "Correto! 🎉 (pequenas diferenças de acentuação ignoradas)",
    };
  }

  const classification = classifyError(activeCode, expectedOutput, solution);
  const simExpected = similarity(normUser, normExpected);
  const simSolution = similarity(normUser, normSolution);
  const bestSim = Math.max(simExpected, simSolution);

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
