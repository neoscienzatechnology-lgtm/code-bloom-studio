// Web Worker que roda o JavaScript livre do playground capturando o console.
// Fora da thread principal, um laço infinito do aluno pode ser interrompido
// (a thread principal dá timeout e termina o worker), sem travar a aba.

interface RunMessage {
  id: number;
  code: string;
}

const ctx = self as unknown as {
  onmessage: ((event: MessageEvent<RunMessage>) => void) | null;
  postMessage: (message: unknown) => void;
};

function format(args: unknown[]): string {
  return args
    .map((value) => {
      if (typeof value === "string") return value;
      if (typeof value === "undefined") return "undefined";
      if (typeof value === "function") return value.toString();
      try {
        const serialized = JSON.stringify(value);
        return serialized === undefined ? String(value) : serialized;
      } catch {
        return String(value);
      }
    })
    .join(" ");
}

ctx.onmessage = (event) => {
  const { id, code } = event.data;
  const logs: string[] = [];
  const push = (...args: unknown[]) => logs.push(format(args));
  const sandboxConsole = { log: push, info: push, warn: push, error: push, debug: push };

  try {
    const fn = new Function("console", `"use strict";\n${code}`);
    fn(sandboxConsole);
    ctx.postMessage({ id, output: logs.join("\n") });
  } catch (err) {
    ctx.postMessage({
      id,
      output: logs.join("\n"),
      error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    });
  }
};
