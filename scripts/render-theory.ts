/**
 * Renderiza os vídeos de teoria a partir do manifesto (remotion/theory-data.json).
 * Bundle uma vez, renderiza muitos (resume: pula MP4 já existente).
 *
 * Exemplos:
 *   npm run video:render -- --limit=5            (primeiros 5, para validar)
 *   npm run video:render -- --course=1           (curso inteiro, ex: Python)
 *   npm run video:render -- --only=1__1-1        (uma lição específica)
 *   npm run video:render                         (TODAS as lições)
 *   npm run video:render -- --force              (re-renderiza mesmo se já existe)
 */
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

// Narração TTS (opcional): gerada por `npm run video:narrate`. Quando o
// manifesto existe, cada lição renderiza com áudio (cenas esticam pra fala).
const narrationPath = join(root, "remotion", "narration-manifest.json");
const narration: Record<string, { scenes: Record<string, { src: string; durationInFrames: number }> }> =
  existsSync(narrationPath) ? JSON.parse(readFileSync(narrationPath, "utf8")) : {};

const argv = process.argv.slice(2);
const getArg = (name: string) => {
  const a = argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split("=").slice(1).join("=") : undefined;
};
const courseFilter = getArg("course");
const only = getArg("only");
const limitRaw = getArg("limit");
const limit = limitRaw ? parseInt(limitRaw, 10) : undefined;
const force = argv.includes("--force");

type Entry = { courseId: string; lessonId: string; key: string; [k: string]: unknown };
const data: Entry[] = JSON.parse(readFileSync(join(root, "remotion", "theory-data.json"), "utf8"));

let jobs = data;
if (courseFilter) jobs = jobs.filter((e) => e.courseId === courseFilter);
if (only) {
  const keys = only.split(",").map((k) => k.trim());
  jobs = jobs.filter((e) => keys.includes(e.key));
}
if (typeof limit === "number" && !Number.isNaN(limit)) jobs = jobs.slice(0, limit);

if (jobs.length === 0) {
  console.log("Nenhuma lição corresponde ao filtro. Rode `npm run video:extract` primeiro?");
  process.exit(0);
}

// Só o caminho completo reporta sucesso (ver nota em gen-narration.ts).
process.exitCode = 1;

console.log(`Empacotando o projeto Remotion uma vez... (narração: ${Object.keys(narration).length} lições)`);
const audioDir = join(root, "remotion-audio");
mkdirSync(audioDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: join(root, "remotion", "index.ts"), publicDir: audioDir });

console.log(`Renderizando ${jobs.length} vídeo(s)...`);
let done = 0;
for (const e of jobs) {
  const outDir = join(root, "out", "videos", e.courseId);
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, `${e.lessonId}.mp4`);
  done++;
  if (!force && existsSync(outFile)) {
    console.log(`  • [${done}/${jobs.length}] ${e.key} — já existe, pulando`);
    continue;
  }
  const inputProps = { ...e, narration: narration[e.key]?.scenes };
  // Watchdog: um render normal leva <2 min; se o Chrome headless emperrar,
  // derruba o processo e o orquestrador relança (resume pula os prontos).
  const watchdog = new Promise<never>((_, rej) =>
    setTimeout(() => rej(new Error(`watchdog: render de ${e.key} passou de 6min`)), 6 * 60_000),
  );
  await Promise.race([
    (async () => {
      const composition = await selectComposition({ serveUrl, id: "TheoryVideo", inputProps });
      await renderMedia({ composition, serveUrl, codec: "h264", outputLocation: outFile, inputProps });
    })(),
    watchdog,
  ]);
  console.log(`  ✓ [${done}/${jobs.length}] ${e.key} → out/videos/${e.courseId}/${e.lessonId}.mp4`);
}
console.log("Concluído.");
process.exitCode = 0;
