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

/** Roda o código Python e devolve stdout/stderr (ou error em traceback/timeout). */
export function runPython(code: string): Promise<PythonRunResult> {
  const active = ensureWorker();
  const id = ++seq;
  const timeoutMs = ready ? WARM_TIMEOUT_MS : COLD_TIMEOUT_MS;

  return new Promise<PythonRunResult>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      resetWorker(new Error("timeout"));
      reject(new Error("timeout"));
    }, timeoutMs);
    pending.set(id, { resolve, reject, timer });
    active.postMessage({ type: "run", id, code });
  });
}
