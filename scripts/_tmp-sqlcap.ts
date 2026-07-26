import initSqlJs from "sql.js";
import { join } from "node:path";
import { SQL_SEED } from "../src/data/sqlSandbox";
import { formatSqlResult } from "../src/utils/sqlOutput";

const SQL = await initSqlJs({ locateFile: () => join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm") });
const queries: Array<[string, string]> = [
  ["etapa1", "SELECT nome, estoque\nFROM produtos\nWHERE estoque > 0;"],
  ["etapa2", "SELECT nome, preco\nFROM produtos\nORDER BY preco DESC\nLIMIT 3;"],
  ["etapa3", "SELECT categoria, COUNT(*)\nFROM produtos\nGROUP BY categoria;"],
  ["etapa4", "SELECT pedidos.id, clientes.nome, pedidos.total\nFROM pedidos\nJOIN clientes ON pedidos.cliente_id = clientes.id;"],
  ["etapa5", "SELECT clientes.nome, SUM(pedidos.total) AS gasto\nFROM pedidos\nJOIN clientes ON pedidos.cliente_id = clientes.id\nGROUP BY clientes.nome\nORDER BY gasto DESC;"],
];
for (const [name, q] of queries) {
  const db = new SQL.Database();
  db.run(SQL_SEED);
  const res = db.exec(q);
  console.log(`--- ${name} ---`);
  console.log(JSON.stringify(formatSqlResult(res.length ? res[res.length - 1] : null)));
  db.close();
}
