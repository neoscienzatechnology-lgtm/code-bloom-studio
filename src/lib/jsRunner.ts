// Executa JavaScript livre do playground capturando o console. Roda na thread
// principal (mesmo modelo do validador das lições). É o código do próprio aluno
// rodando no navegador dele — sem rede, sem acesso a segredos.

export interface JsRunResult {
  output: string;
  error?: string;
}

function format(args: unknown[]): string {
  return args
    .map((value) => {
      if (typeof value === "string") return value;
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    })
    .join(" ");
}

export function runJs(code: string): JsRunResult {
  const logs: string[] = [];
  const push = (...args: unknown[]) => logs.push(format(args));
  const sandboxConsole = { log: push, info: push, warn: push, error: push, debug: push };

  try {
    const fn = new Function("console", `"use strict";\n${code}`);
    fn(sandboxConsole);
    return { output: logs.join("\n") };
  } catch (err) {
    return {
      output: logs.join("\n"),
      error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    };
  }
}
