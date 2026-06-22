/**
 * Renderiza um quadro (still PNG) de um vídeo de teoria, para QA visual.
 *   npm run video:still -- --key=10__10-2 --frac=0.7
 *   npm run video:still -- --key=2__2-1 --frame=300
 */
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const argv = process.argv.slice(2);
const getArg = (n: string) => {
  const a = argv.find((x) => x.startsWith(`--${n}=`));
  return a ? a.split("=").slice(1).join("=") : undefined;
};

const key = getArg("key");
const data = JSON.parse(readFileSync(join(root, "remotion", "theory-data.json"), "utf8")) as Array<{ key: string }>;
const entry = data.find((e) => e.key === key);
if (!entry) {
  console.log(`Lição "${key}" não encontrada.`);
  process.exit(1);
}

const serveUrl = await bundle({ entryPoint: join(root, "remotion", "index.ts") });
const composition = await selectComposition({ serveUrl, id: "TheoryVideo", inputProps: entry });
console.log(`${key}: ${composition.durationInFrames} frames`);

const fracArg = getArg("frac");
const frameArg = getArg("frame");
const frame = frameArg
  ? parseInt(frameArg, 10)
  : Math.round((fracArg ? parseFloat(fracArg) : 0.7) * composition.durationInFrames);

mkdirSync(join(root, "out"), { recursive: true });
const output = join(root, "out", `still-${key}-${frame}.png`);
await renderStill({ composition, serveUrl, output, frame, inputProps: entry });
console.log(`→ out/still-${key}-${frame}.png (frame ${frame})`);
