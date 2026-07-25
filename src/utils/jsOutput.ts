// Compara a saída REAL do JavaScript (rodado no worker) com a saída esperada
// da lição — espelho de `pythonOutput.ts`. Puro e testável. #revisao-lote3

import type { ErrorKind } from "@/utils/codeValidator";

export interface JsEval {
  correct: boolean;
  message: string;
  errorKind?: ErrorKind;
}

/** CRLF→LF, tira espaço no fim das linhas e linhas vazias no fim. */
function normalize(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n+$/g, "")
    .trim();
}

export function evaluateJsRun(output: string, error: string | undefined, expected: string): JsEval {
  const got = normalize(output);
  const want = normalize(expected);

  if (error) {
    // Erro real do motor JS (ReferenceError, SyntaxError…): mostra a mensagem
    // crua, que é justamente o que ensina o aluno a ler erro.
    return { correct: false, message: `Erro ao rodar:\n${error}`, errorKind: "syntax" };
  }

  if (got === want) return { correct: true, message: got };

  if (!got) {
    return {
      correct: false,
      message: "Seu código rodou, mas não mostrou nada. Use console.log() para exibir o resultado.",
      errorKind: "output_mismatch",
    };
  }

  return {
    correct: false,
    message: `Sua saída:\n${got}\n\nEsperado:\n${want}`,
    errorKind: "output_mismatch",
  };
}
