/**
 * Gera a NARRAÇÃO (TTS neural pt-BR via Edge-TTS, gratuito) dos vídeos de
 * teoria: um mp3 por cena (intro/concept/analogy/code/points/outro), a partir
 * de remotion/theory-data.json. Saída: remotion-audio/<key>/<cena>.mp3 +
 * manifesto remotion/narration-manifest.json com as durações (o Remotion
 * estica cada cena para caber a fala).
 *
 *   npm run video:narrate -- --only=1__1-1     (uma lição)
 *   npm run video:narrate                      (todas; retoma onde parou)
 *   npm run video:narrate -- --force           (regenera tudo)
 */
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { parseFile } from "music-metadata";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const audioRoot = join(root, "remotion-audio");
const manifestPath = join(root, "remotion", "narration-manifest.json");
const VOICE = process.env.TTS_VOICE || "pt-BR-FranciscaNeural";
const FPS = 30;

const argv = process.argv.slice(2);
const getArg = (n: string) => argv.find((a) => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=");
const only = getArg("only")?.split(",").map((s) => s.trim());
const force = argv.includes("--force");

type Entry = {
  key: string; title: string; module: string; concept: string; analogy: string;
  code: string; codeOutput: string; points: string[]; cta: string;
};
const data: Entry[] = JSON.parse(readFileSync(join(root, "remotion", "theory-data.json"), "utf8"));
let jobs = only ? data.filter((e) => only.includes(e.key)) : data;

const dot = (s: string) => {
  const t = (s || "").trim();
  if (!t) return "";
  return /[.!?…]$/.test(t) ? t : `${t}.`;
};

// Texto falado por cena — curto, natural, sem ler código literalmente.
function narrationTexts(e: Entry): Record<string, string> {
  const out: Record<string, string> = {};
  out.intro = dot(e.title);
  out.concept = dot(e.concept);
  if (e.analogy?.trim()) out.analogy = `Pense assim: ${dot(e.analogy)}`;
  if (e.code?.trim()) {
    const singleShort = e.codeOutput && !e.codeOutput.includes("\n") && e.codeOutput.length <= 48;
    out.code = singleShort
      ? `Agora veja na prática. Ao rodar este código, a saída é: ${dot(e.codeOutput)}`
      : "Agora veja na prática. Acompanhe o código na tela.";
  }
  const pts = (e.points || []).map((p) => p.replace(/[.]+$/, "")).filter(Boolean);
  if (pts.length) out.points = `Para levar com você: ${pts.join(". ")}.`;
  out.outro = dot(e.cta);
  return out;
}

async function ttsToFile(text: string, dest: string): Promise<void> {
  const tmpDir = `${dest}.tmpdir`;
  rmSync(tmpDir, { recursive: true, force: true });
  mkdirSync(tmpDir, { recursive: true });
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const { audioFilePath } = await tts.toFile(tmpDir, text);
  renameSync(audioFilePath, dest);
  rmSync(tmpDir, { recursive: true, force: true });
  tts.close();
}

async function withRetry(fn: () => Promise<void>, tries = 3): Promise<void> {
  for (let i = 1; ; i++) {
    try { return await fn(); } catch (err) {
      if (i >= tries) throw err;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

const manifest: Record<string, { voice: string; scenes: Record<string, { src: string; durationInFrames: number }> }> =
  existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

let done = 0;
let clips = 0;
for (const e of jobs) {
  const texts = narrationTexts(e);
  const dir = join(audioRoot, e.key);
  mkdirSync(dir, { recursive: true });
  const scenes: Record<string, { src: string; durationInFrames: number }> = {};
  for (const [scene, text] of Object.entries(texts)) {
    const dest = join(dir, `${scene}.mp3`);
    if (force || !existsSync(dest)) {
      await withRetry(() => ttsToFile(text, dest));
      clips++;
    }
    const meta = await parseFile(dest);
    const sec = meta.format.duration ?? 0;
    if (sec <= 0.2) throw new Error(`áudio suspeito (${sec}s): ${e.key}/${scene}`);
    scenes[scene] = { src: `${e.key}/${scene}.mp3`, durationInFrames: Math.ceil(sec * FPS) };
  }
  manifest[e.key] = { voice: VOICE, scenes };
  done++;
  if (done % 10 === 0 || done === jobs.length) {
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 1), "utf8");
    console.log(`progresso: ${done}/${jobs.length} lições (${clips} clipes novos)`);
  }
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 1), "utf8");
console.log(`FIM: ${done} lições, ${clips} clipes gerados, voz=${VOICE}`);
