/**
 * Envia os vídeos de teoria (out/videos/<curso>/<lição>.mp4) para o serviço
 * Railway (PUT autenticado, com retomada — pula os que já existem).
 *   npm run video:upload
 * Token: railway-videos/upload-token.local (gitignored). Para rotacionar:
 * gere um novo, salve no arquivo e rode `railway variables --set "UPLOAD_TOKEN=..."`.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.THEORY_VIDEO_BASE?.trim() || "https://codetier-videos-production.up.railway.app";
const tokenFile = join(root, "railway-videos", "upload-token.local");
if (!existsSync(tokenFile)) {
  console.error("Token não encontrado em railway-videos/upload-token.local");
  process.exit(1);
}
const TOKEN = readFileSync(tokenFile, "utf8").trim();
const src = join(root, "out", "videos");
// --force: re-envia mesmo os que já existem no servidor (ex.: re-render com narração)
const force = process.argv.includes("--force");

let ok = 0, skip = 0, fail = 0;
const courses = readdirSync(src).filter((d) => statSync(join(src, d)).isDirectory());
for (const course of courses) {
  for (const file of readdirSync(join(src, course)).filter((f) => f.endsWith(".mp4"))) {
    const url = `${BASE}/${course}/${file}`;
    if (!force) {
      const head = await fetch(url, { method: "HEAD" }).catch(() => null);
      if (head?.ok) { skip++; continue; }
    }
    const body = readFileSync(join(src, course, file));
    let res = await fetch(`${BASE}/upload/${course}/${file}`, {
      method: "PUT", headers: { Authorization: `Bearer ${TOKEN}` }, body,
    }).catch(() => null);
    if (!res?.ok) {
      await new Promise((r) => setTimeout(r, 3000));
      res = await fetch(`${BASE}/upload/${course}/${file}`, {
        method: "PUT", headers: { Authorization: `Bearer ${TOKEN}` }, body,
      }).catch(() => null);
    }
    if (res?.ok) ok++; else { fail++; console.error(`FALHA ${course}/${file} (${res?.status ?? "rede"})`); }
    if ((ok + skip + fail) % 20 === 0) console.log(`progresso: ${ok + skip + fail} (ok=${ok} skip=${skip} fail=${fail})`);
  }
}
console.log(`FIM: ok=${ok} skip=${skip} fail=${fail}`);
if (fail > 0) process.exit(1);
