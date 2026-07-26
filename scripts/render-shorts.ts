/**
 * Renderiza os SHORTS verticais (1080x1920) a partir de remotion/shorts-data.json,
 * juntando a narração + marcação de palavra de remotion/shorts-narration.json.
 *
 *   npm run shorts:render                    (todos; pula MP4 já pronto)
 *   npm run shorts:render -- --only=<id>     (um Short)
 *   npm run shorts:render -- --limit=1       (o primeiro, para validar)
 *   npm run shorts:render -- --force         (re-renderiza)
 *
 * Saída: out/shorts/<id>.mp4 (fora do git — MP4 não entra no repo)
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const argv = process.argv.slice(2);
const getArg = (n: string) => argv.find((a) => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=");
const only = getArg("only")?.split(",").map((s) => s.trim());
const limitRaw = getArg("limit");
const limit = limitRaw ? parseInt(limitRaw, 10) : undefined;
const force = argv.includes("--force");

interface ShortEntry {
  id: string;
  language: string;
  hook: string;
  concept: string;
  code: string;
  codeOutput: string;
  points: string[];
  cta: string;
}

const data: ShortEntry[] = JSON.parse(readFileSync(join(root, "remotion", "shorts-data.json"), "utf8"));
const narrationPath = join(root, "remotion", "shorts-narration.json");
const narration: Record<string, { scenes: Record<string, unknown> }> = existsSync(narrationPath)
  ? JSON.parse(readFileSync(narrationPath, "utf8"))
  : {};

let jobs = data;
if (only) jobs = jobs.filter((e) => only.includes(e.id));
if (typeof limit === "number" && !Number.isNaN(limit)) jobs = jobs.slice(0, limit);

if (jobs.length === 0) {
  console.log("Nenhum Short corresponde ao filtro.");
  process.exit(0);
}

// Só o caminho completo reporta sucesso (mesma nota do render-theory.ts).
process.exitCode = 1;

const audioDir = join(root, "remotion-audio");
mkdirSync(audioDir, { recursive: true });
const outDir = join(root, "out", "shorts");
mkdirSync(outDir, { recursive: true });

const semNarracao = jobs.filter((e) => !narration[e.id]).map((e) => e.id);
if (semNarracao.length) {
  console.log(`⚠ sem narração (rode npm run shorts:narrate): ${semNarracao.join(", ")}`);
}

console.log(`Empacotando o projeto Remotion... (narração: ${Object.keys(narration).length} Shorts)`);
const serveUrl = await bundle({ entryPoint: join(root, "remotion", "index.ts"), publicDir: audioDir });

console.log(`Renderizando ${jobs.length} Short(s)...`);
let done = 0;
for (const entry of jobs) {
  const outFile = join(outDir, `${entry.id}.mp4`);
  done++;
  if (!force && existsSync(outFile)) {
    console.log(`  • [${done}/${jobs.length}] ${entry.id} — já existe, pulando`);
    continue;
  }
  // Só o que a composição usa: a copy de plataforma e os textos de narração
  // não precisam viajar para dentro do bundle.
  const inputProps = {
    id: entry.id,
    language: entry.language,
    hook: entry.hook,
    concept: entry.concept,
    code: entry.code,
    codeOutput: entry.codeOutput,
    points: entry.points,
    cta: entry.cta,
    narration: narration[entry.id]?.scenes,
  };
  const watchdog = new Promise<never>((_, rej) =>
    setTimeout(() => rej(new Error(`watchdog: render de ${entry.id} passou de 6min`)), 6 * 60_000),
  );
  await Promise.race([
    (async () => {
      const composition = await selectComposition({ serveUrl, id: "Short", inputProps });
      await renderMedia({ composition, serveUrl, codec: "h264", outputLocation: outFile, inputProps });
      console.log(
        `  ✓ [${done}/${jobs.length}] ${entry.id} → out/shorts/${entry.id}.mp4 ` +
          `(${(composition.durationInFrames / composition.fps).toFixed(1)}s)`,
      );
    })(),
    watchdog,
  ]);
}
console.log("Concluído.");
process.exitCode = 0;
