/**
 * Quadro (PNG) de um Short vertical, para QA visual sem renderizar o vídeo.
 *   npm run shorts:still -- --id=<id> --frac=0.15     (o gancho)
 *   npm run shorts:still -- --id=<id> --frame=420
 *   npm run shorts:still -- --id=<id> --all           (um quadro por cena)
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const getArg = (n: string) => argv.find((x) => x.startsWith(`--${n}=`))?.split("=").slice(1).join("=");

const id = getArg("id");
const data = JSON.parse(readFileSync(join(root, "remotion", "shorts-data.json"), "utf8")) as Array<{ id: string }>;
const entry = data.find((e) => e.id === id) ?? data[0];
if (!entry) {
  console.log("Nenhum Short em remotion/shorts-data.json.");
  process.exit(1);
}

const narrationPath = join(root, "remotion", "shorts-narration.json");
const narration: Record<string, { scenes: Record<string, unknown> }> = existsSync(narrationPath)
  ? JSON.parse(readFileSync(narrationPath, "utf8"))
  : {};
const inputProps = { ...entry, narration: narration[entry.id]?.scenes };

const serveUrl = await bundle({
  entryPoint: join(root, "remotion", "index.ts"),
  publicDir: join(root, "remotion-audio"),
});
const composition = await selectComposition({ serveUrl, id: "Short", inputProps });
console.log(`${entry.id}: ${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(1)}s)`);

const total = composition.durationInFrames;
const frames = argv.includes("--all")
  ? [0.08, 0.3, 0.55, 0.78, 0.94].map((f) => Math.round(f * total))
  : [
      getArg("frame")
        ? parseInt(getArg("frame")!, 10)
        : Math.round(parseFloat(getArg("frac") ?? "0.15") * total),
    ];

mkdirSync(join(root, "out", "shorts-qa"), { recursive: true });
for (const frame of frames) {
  const output = join(root, "out", "shorts-qa", `${entry.id}-${frame}.png`);
  await renderStill({ composition, serveUrl, output, frame, inputProps });
  console.log(`→ out/shorts-qa/${entry.id}-${frame}.png`);
}
