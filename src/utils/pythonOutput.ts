// Compara a saída REAL do Python (rodado no Pyodide) com a saída esperada da
// lição. Puro e testável — sem dependência do runtime.

import type { ErrorKind } from "@/utils/codeValidator";

export interface PythonEval {
  correct: boolean;
  message: string;
  errorKind?: ErrorKind;
}

/** Normaliza para comparação: CRLF→LF, tira espaços no fim das linhas e
 * linhas em branco no fim. */
function normalize(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n+$/g, "")
    .trim();
}

/** Pega a linha final útil de um traceback Python (a mensagem do erro). */
function lastLine(text: string): string {
  return text.trim().split("\n").filter(Boolean).pop() ?? text.trim();
}

export function evaluatePythonRun(
  stdout: string,
  stderr: string,
  error: string | undefined,
  expected: string,
): PythonEval {
  if (error) {
    return { correct: false, message: `Erro ao rodar:\n${lastLine(error)}`, errorKind: "syntax" };
  }

  const got = normalize(stdout);
  const want = normalize(expected);

  if (got === want) return { correct: true, message: got };

  if (!got && stderr.trim()) {
    return { correct: false, message: `Erro:\n${lastLine(stderr)}`, errorKind: "syntax" };
  }

  return {
    correct: false,
    message: `Sua saída:\n${got || "(vazio)"}\n\nEsperado:\n${want}`,
    errorKind: "output_mismatch",
  };
}
