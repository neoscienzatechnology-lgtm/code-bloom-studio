// Ponte da thread principal para o worker do SQLite — mesmo padrão do
// pythonRunner: worker sob demanda, timeout (query travada não pendura a aba)
// e recriação do worker depois de uma falha. #revisao-lote4
import type { SqlResultSet } from "@/utils/sqlOutput";

export interface SqlRunResult {
  result: SqlResultSet | null;
  error?: string;
}

const COLD_TIMEOUT_MS = 20_000; // 1ª vez inclui o download do wasm (~1 MB)
const WARM_TIMEOUT_MS = 6_000;

interface Pending {
  resolve: (value: SqlRunResult) => void;
  timer: ReturnType<typeof setTimeout>;
}

let worker: Worker | null = null;
let ready = false;
let seq = 0;
const pending = new Map<number, Pending>();

export function isSqlRuntimeSupported(): boolean {
  return typeof Worker !== "undefined" && typeof WebAssembly !== "undefined";
}

function resetWorker(reason: string) {
  for (const [, p] of pending) {
    clearTimeout(p.timer);
    p.resolve({ result: null, error: reason });
  }
  pending.clear();
  worker?.terminate();
  worker = null;
  ready = false;
}

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("../workers/sql.worker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (event: MessageEvent<{ id: number } & SqlRunResult>) => {
    const { id, result, error } = event.data;
    ready = true;
    const p = pending.get(id);
    if (!p) return;
    clearTimeout(p.timer);
    pending.delete(id);
    p.resolve({ result: result ?? null, error });
  };
  worker.onerror = () => resetWorker("Não foi possível iniciar o banco de dados.");
  return worker;
}

export function runSql(seed: string, query: string, verify?: string): Promise<SqlRunResult> {
  let active: Worker;
  try {
    active = ensureWorker();
  } catch {
    return Promise.resolve({ result: null, error: "runtime-unavailable" });
  }
  const id = ++seq;
  const timeout = ready ? WARM_TIMEOUT_MS : COLD_TIMEOUT_MS;
  return new Promise<SqlRunResult>((resolve) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      resetWorker("Tempo esgotado ao executar a consulta.");
      resolve({ result: null, error: "Tempo esgotado ao executar a consulta." });
    }, timeout);
    pending.set(id, { resolve, timer });
    active.postMessage({ id, seed, query, verify });
  });
}
