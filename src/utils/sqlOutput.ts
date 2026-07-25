// Formata e compara RESULTADOS de SQL (não o texto da query). Puro e testável
// — o mesmo código roda no app, no script que gera os gabaritos e nos testes.
// #revisao-lote4

import type { ErrorKind } from "@/utils/codeValidator";

export interface SqlResultSet {
  columns: string[];
  values: unknown[][];
}

export interface SqlEval {
  correct: boolean;
  message: string;
  errorKind?: ErrorKind;
}

function cell(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : String(value);
  return String(value);
}

/** Tabela de texto estável: cabeçalho, separador e linhas com " | ". */
export function formatSqlResult(result: SqlResultSet | null): string {
  if (!result || result.columns.length === 0) return "(nenhuma linha)";
  const header = result.columns.join(" | ");
  const rows = result.values.map((row) => row.map(cell).join(" | "));
  return [header, "-".repeat(header.length), ...rows].join("\n");
}

function normalize(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();
}

/** Comparação linha a linha; sem ORDER BY, a ordem não deve reprovar ninguém. */
function sameResult(got: string, want: string, orderMatters: boolean): boolean {
  const a = normalize(got);
  const b = normalize(want);
  if (a === b) return true;
  if (orderMatters) return false;

  const [headA, ...restA] = a.split("\n");
  const [headB, ...restB] = b.split("\n");
  if (headA !== headB) return false;
  const bodyA = [...restA].filter((line) => !/^-+$/.test(line)).sort();
  const bodyB = [...restB].filter((line) => !/^-+$/.test(line)).sort();
  return bodyA.length === bodyB.length && bodyA.every((line, index) => line === bodyB[index]);
}

export function evaluateSqlRun(
  result: SqlResultSet | null,
  error: string | undefined,
  expected: string,
  options: { orderMatters?: boolean } = {},
): SqlEval {
  if (error) {
    return { correct: false, message: `Erro no SQL:\n${error}`, errorKind: "syntax" };
  }

  const got = formatSqlResult(result);
  if (sameResult(got, expected, options.orderMatters ?? false)) {
    return { correct: true, message: got };
  }

  return {
    correct: false,
    message: `Seu resultado:\n${got}\n\nEsperado:\n${normalize(expected)}`,
    errorKind: "output_mismatch",
  };
}
