type ValidationResult = {
  level: "exact" | "flexible" | "close" | "wrong";
  message: string;
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
  const m = a.length, n = b.length;
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

export function validateCode(
  userCode: string,
  expectedOutput: string,
  solution: string
): ValidationResult {
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
    return { level: "flexible", message: "Correto! 🎉 (pequenas diferenças de acentuação ignoradas)" };
  }

  // Similarity check
  const simExpected = similarity(normUser, normExpected);
  const simSolution = similarity(normUser, normSolution);
  const bestSim = Math.max(simExpected, simSolution);

  if (bestSim >= 0.85) {
    return {
      level: "close",
      message: "Quase certo! Seu código está muito próximo. Verifique pequenos detalhes e tente novamente.",
    };
  }

  if (bestSim >= 0.6) {
    return {
      level: "close",
      message: "Você está no caminho certo! Revise seu código e tente novamente.",
    };
  }

  return {
    level: "wrong",
    message: "Erro: verifique seu código e tente novamente.",
  };
}
