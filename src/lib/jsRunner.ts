// Executa o JavaScript livre do playground capturando o console. Roda num Web
// Worker para que um laço infinito do aluno possa ser interrompido por timeout
// (sem travar a aba). Se o navegador não suportar worker de módulo, cai num
// fallback síncrono na thread principal.

export interface JsRunResult {
  output: string;
  error?: string;
}

const JS_TIMEOUT_MS = 6000;

interface Pending {
  resolve: (value: JsRunResult) => void;
  timer: ReturnType<typeof setTimeout>;
}

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, Pending>();

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

function runJsSync(code: string): JsRunResult {
  const logs: string[] = [];
  const push = (...args: unknown[]) => logs.push(format(args));
  const sandboxConsole = { log: push, info: push, warn: push, error: push, debug: push };
  try {
    const fn = new Function("console", `"use strict";\n${code}`);
    fn(sandboxConsole);
    return { output: logs.join("\n") };
  } catch (err) {
    return { output: logs.join("\n"), error: err instanceof Error ? `${err.name}: ${err.message}` : String(err) };
  }
}

function resetWorker() {
  for (const [, p] of pending) {
    clearTimeout(p.timer);
    p.resolve({ output: "", error: "Execução interrompida." });
  }
  pending.clear();
  worker?.terminate();
  worker = null;
}

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("../workers/js.worker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (event: MessageEvent<{ id: number } & JsRunResult>) => {
    const { id, output, error } = event.data;
    const p = pending.get(id);
    if (!p) return;
    clearTimeout(p.timer);
    pending.delete(id);
    p.resolve({ output, error });
  };
  worker.onerror = () => resetWorker();
  return worker;
}

export function runJs(code: string): Promise<JsRunResult> {
  let active: Worker;
  try {
    active = ensureWorker();
  } catch {
    return Promise.resolve(runJsSync(code));
  }
  const id = ++seq;
  return new Promise<JsRunResult>((resolve) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      resetWorker();
      resolve({ output: "", error: "Tempo esgotado — verifique se há um laço infinito." });
    }, JS_TIMEOUT_MS);
    pending.set(id, { resolve, timer });
    active.postMessage({ id, code });
  });
}
