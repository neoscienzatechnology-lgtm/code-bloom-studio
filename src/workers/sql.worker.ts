/// <reference lib="webworker" />
// Worker do SQLite (sql.js). Cria um banco NOVO a cada execução a partir do
// seed: assim um UPDATE/DELETE da tentativa anterior nunca contamina a
// próxima. O wasm é servido do próprio domínio (public/sql-wasm.wasm), então
// não precisa liberar CDN no CSP. #revisao-lote4
import initSqlJs, { type SqlJsStatic } from "sql.js";

interface RunRequest {
  id: number;
  seed: string;
  query: string;
  verify?: string;
}

let sqlPromise: Promise<SqlJsStatic> | null = null;

function getSql(): Promise<SqlJsStatic> {
  sqlPromise ??= initSqlJs({ locateFile: () => "/sql-wasm.wasm" });
  return sqlPromise;
}

self.onmessage = async (event: MessageEvent<RunRequest>) => {
  const { id, seed, query, verify } = event.data;
  try {
    const SQL = await getSql();
    const db = new SQL.Database();
    try {
      db.run(seed);
      // A query do aluno pode ser SELECT (devolve linhas) ou escrita (não).
      const results = db.exec(query);
      const source = verify ? db.exec(verify) : results;
      const last = source[source.length - 1];
      self.postMessage({
        id,
        result: last ? { columns: last.columns, values: last.values } : null,
      });
    } finally {
      db.close();
    }
  } catch (error) {
    self.postMessage({
      id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
