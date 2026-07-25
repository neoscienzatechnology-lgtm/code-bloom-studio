/**
 * Regrava o `expectedOutput` das lições de SQL executando a solução oficial no
 * SQLite de verdade (sql.js) contra `SQL_SEED`.
 *   npm run sql:sync           (mostra o que mudaria)
 *   npm run sql:sync -- --write (grava no arquivo do curso)
 *
 * Assim o gabarito nunca é escrito no olho: ele é a saída real do banco.
 */
import initSqlJs from "sql.js";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { courses } from "../src/data/mockData";
import { SQL_SEED, SQL_VERIFICATION_QUERIES } from "../src/data/sqlSandbox";
import { formatSqlResult } from "../src/utils/sqlOutput";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const write = process.argv.includes("--write");
const COURSE_FILE = join(root, "src", "data", "modernPythonSqlCourses.ts");

const SQL = await initSqlJs({
  locateFile: () => join(root, "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
});

const sqlCourse = courses.find((course) => course.language.trim().toLowerCase() === "sql");
if (!sqlCourse) throw new Error("curso de SQL não encontrado");

let source = readFileSync(COURSE_FILE, "utf8");
let changed = 0;

for (const lesson of sqlCourse.lessons) {
  const db = new SQL.Database();
  let expected: string;
  try {
    db.run(SQL_SEED);
    const own = db.exec(lesson.solution);
    const verify = SQL_VERIFICATION_QUERIES[lesson.id];
    const results = verify ? db.exec(verify) : own;
    expected = formatSqlResult(results.length ? results[results.length - 1] : null);
  } catch (error) {
    console.error(`✗ ${lesson.id}: ${(error as Error).message}`);
    continue;
  } finally {
    db.close();
  }

  if (expected === lesson.expectedOutput) {
    console.log(`= ${lesson.id} já está correto`);
    continue;
  }
  changed += 1;
  console.log(`~ ${lesson.id}: ${JSON.stringify(lesson.expectedOutput)} -> ${JSON.stringify(expected)}`);

  if (write) {
    const start = source.indexOf(`id: "${lesson.id}"`);
    if (start < 0) throw new Error(`lição ${lesson.id} não encontrada no arquivo`);
    const region = source.slice(start, start + 6000);
    const match = region.match(/expectedOutput: (['"])(?:\\.|(?!\1).)*\1,/);
    if (!match) throw new Error(`expectedOutput não encontrado para ${lesson.id}`);
    const replacement = `expectedOutput: ${JSON.stringify(expected)},`;
    source = source.slice(0, start) + region.replace(match[0], replacement) + source.slice(start + region.length);
  }
}

if (write && changed > 0) {
  writeFileSync(COURSE_FILE, source, "utf8");
  console.log(`\n${changed} lição(ões) atualizada(s) em modernPythonSqlCourses.ts`);
} else {
  console.log(`\n${changed} lição(ões) divergem${write ? "" : " (rode com --write para gravar)"}`);
}
