// Ponte da thread principal para o worker do Pyodide. Cria o worker sob
// demanda, faz timeout (mata laço infinito ou carregamento travado) e recria o
// worker após uma falha. O primeiro run inclui o download do Pyodide, então usa
// um timeout generoso; os seguintes (worker quente) usam um curto.

export interface PythonRunResult {
  stdout: string;
  stderr: string;
  error?: string;
}

interface Pending {
  resolve: (value: PythonRunResult) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

const COLD_TIMEOUT_MS = 45_000; // 1ª vez: baixa ~10 MB do Pyodide
const WARM_TIMEOUT_MS = 8_000; // execuções seguintes: guarda contra laço infinito

let worker: Worker | null = null;
let ready = false;
let seq = 0;
const pending = new Map<number, Pending>();
// Serializa execuções: o Pyodide é uma instância única e o stdout/stderr é
// capturado por run, então dois runs concorrentes embaralhariam a saída.
let queue: Promise<unknown> = Promise.resolve();

export function isPythonRuntimeSupported(): boolean {
  return typeof Worker !== "undefined" && typeof WebAssembly !== "undefined";
}

function resetWorker(reason: Error) {
  for (const [, p] of pending) {
    clearTimeout(p.timer);
    p.reject(reason);
  }
  pending.clear();
  worker?.terminate();
  worker = null;
  ready = false;
}

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("../workers/pyodide.worker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (event: MessageEvent<{ id: number } & PythonRunResult>) => {
    const { id, stdout, stderr, error } = event.data;
    const p = pending.get(id);
    if (!p) return;
    clearTimeout(p.timer);
    pending.delete(id);
    ready = true;
    p.resolve({ stdout, stderr, error });
  };
  worker.onerror = () => resetWorker(new Error("Falha ao iniciar o Python."));
  return worker;
}

/** Roda o código Python e devolve stdout/stderr. Rejeita com:
 *  - "exec-timeout": o código rodou e estourou o tempo (provável laço infinito);
 *  - "load-timeout"/"load-failed": o Pyodide não carregou (cair na heurística).
 * Construir o worker fica DENTRO da Promise: uma falha síncrona (ex.: CSP
 * bloqueando o módulo) vira rejeição, em vez de estourar no chamador. */
export function runPython(code: string): Promise<PythonRunResult> {
  const task = () =>
    new Promise<PythonRunResult>((resolve, reject) => {
      let active: Worker;
      try {
        active = ensureWorker();
      } catch {
        reject(new Error("load-failed"));
        return;
      }
      const id = ++seq;
      const timeoutMs = ready ? WARM_TIMEOUT_MS : COLD_TIMEOUT_MS;
      const timer = setTimeout(() => {
        const wasReady = ready;
        pending.delete(id);
        resetWorker(new Error("timeout"));
        reject(new Error(wasReady ? "exec-timeout" : "load-timeout"));
      }, timeoutMs);
      pending.set(id, { resolve, reject, timer });
      active.postMessage({ type: "run", id, code });
    });

  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
