/**
 * Narração dos SHORTS verticais (Edge-TTS pt-BR) COM marcação de palavra.
 *
 * A diferença para `video:narrate` é a legenda: aqui pedimos ao serviço os
 * "word boundaries" (offset e duração de cada palavra) e guardamos isso no
 * manifesto. Sem esse dado a legenda queimada não existiria — e no feed a
 * maioria assiste sem som.
 *
 *   npm run shorts:narrate                 (todos; retoma o que já existe)
 *   npm run shorts:narrate -- --only=id    (um Short)
 *   npm run shorts:narrate -- --force      (regenera tudo)
 *
 * Entrada:  remotion/shorts-data.json
 * Saída:    remotion-audio/shorts/<id>/<cena>.mp3
 *           remotion/shorts-narration.json
 */
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { parseFile } from "music-metadata";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const audioRoot = join(root, "remotion-audio", "shorts");
const dataPath = join(root, "remotion", "shorts-data.json");
const manifestPath = join(root, "remotion", "shorts-narration.json");
const VOICE = process.env.TTS_VOICE || "pt-BR-FranciscaNeural";
const FPS = 30;

const argv = process.argv.slice(2);
const getArg = (n: string) => argv.find((a) => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=");
const only = getArg("only")?.split(",").map((s) => s.trim());
const force = argv.includes("--force");

const SCENES = ["hook", "concept", "code", "points", "outro"] as const;
type SceneKey = (typeof SCENES)[number];

interface ShortEntry {
  id: string;
  narration: Record<SceneKey, string>;
}
interface Word {
  text: string;
  from: number;
  to: number;
}
interface Clip {
  src: string;
  durationInFrames: number;
  words: Word[];
}

const data: ShortEntry[] = JSON.parse(readFileSync(dataPath, "utf8"));
const jobs = only ? data.filter((e) => only.includes(e.id)) : data;

// Mesma proteção do gen-narration.ts: o ws interno pode estourar fora da
// promise e derrubar o processo; só o caminho feliz reporta sucesso.
process.on("uncaughtException", (e) => console.error("(ruído ws ignorado)", (e as Error)?.message));
process.on("unhandledRejection", (e) => console.error("(rejeição solta ignorada)", (e as Error)?.message));
process.exitCode = 1;

const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> =>
  Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`timeout ${ms}ms`)), ms))]);

/** O texto entra cru no SSML: `<h1>` quebraria o XML e a stream fecha sem áudio. */
function speakable(text: string): string {
  return text
    .replace(/<\/?([\w-]+)[^>]*>/g, " $1 ")
    .replace(/&/g, " e ")
    .replace(/[<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Metadata do Edge-TTS: offsets em unidades de 100ns. */
interface RawBoundary {
  Type?: string;
  Data?: { Offset?: number; Duration?: number; text?: { Text?: string; BoundaryType?: string } };
}

/**
 * Casa os tempos do TTS com o texto ORIGINAL.
 *
 * O serviço devolve as palavras sem pontuação, às vezes engole a última e
 * ainda manda uma marcação só com espaços no fim. Usar a lista crua deixaria a
 * legenda sem vírgulas e sem a última palavra da frase — então alinhamos por
 * ordem: cada marcação empresta o tempo para o token correspondente do texto
 * que nós escrevemos, e o que sobrar gruda na última palavra com tempo.
 */
function alignWords(text: string, metadataPath: string | null, clipFrames: number): Word[] {
  if (!metadataPath || !existsSync(metadataPath)) return [];
  const raw = JSON.parse(readFileSync(metadataPath, "utf8")) as { Metadata?: RawBoundary[] };
  const bounds = (raw.Metadata ?? [])
    .filter((m) => m.Type === "WordBoundary" && (m.Data?.text?.Text ?? "").trim().length > 0)
    .map((m) => {
      const offset = (m.Data?.Offset ?? 0) / 10_000_000; // ticks → segundos
      const duration = (m.Data?.Duration ?? 0) / 10_000_000;
      return {
        from: Math.max(0, Math.round(offset * FPS)),
        to: Math.round((offset + duration) * FPS),
      };
    });
  if (bounds.length === 0) return [];

  const tokens = speakable(text).split(/\s+/).filter(Boolean);
  const words: Word[] = [];
  tokens.forEach((token, index) => {
    const bound = bounds[index];
    if (bound) {
      words.push({ text: token, from: bound.from, to: bound.to });
    } else if (words.length > 0) {
      words[words.length - 1].text += ` ${token}`;
    }
  });

  // Estica cada palavra até a próxima: sem isso a legenda apaga nos silêncios
  // entre palavras e pisca a cada sílaba.
  return words.map((w, i) => ({
    ...w,
    to: Math.max(w.to, (words[i + 1]?.from ?? clipFrames) - 1),
  }));
}

async function ttsToFiles(text: string, destMp3: string, destMeta: string): Promise<void> {
  const tmpDir = `${destMp3}.tmpdir`;
  rmSync(tmpDir, { recursive: true, force: true });
  mkdirSync(tmpDir, { recursive: true });
  const tts = new MsEdgeTTS();
  try {
    await withTimeout(
      tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3, { wordBoundaryEnabled: true }),
      15_000,
    );
    const { audioFilePath, metadataFilePath } = await withTimeout(tts.toFile(tmpDir, speakable(text)), 45_000);
    copyFileSync(audioFilePath, destMp3);
    if (metadataFilePath && existsSync(metadataFilePath)) copyFileSync(metadataFilePath, destMeta);
  } finally {
    try {
      tts.close();
    } catch {
      /* socket já fechado */
    }
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function makeClip(text: string, destMp3: string, destMeta: string, tries = 4): Promise<{ sec: number }> {
  for (let i = 1; ; i++) {
    try {
      await ttsToFiles(text, destMp3, destMeta);
      const meta = await parseFile(destMp3);
      const sec = meta.format.duration ?? 0;
      if (sec <= 0.2) throw new Error(`áudio suspeito (${sec}s)`);
      return { sec };
    } catch (err) {
      rmSync(destMp3, { force: true });
      rmSync(destMeta, { force: true });
      if (i >= tries) throw err;
      await new Promise((r) => setTimeout(r, 2500 * i));
    }
  }
}

const manifest: Record<string, { voice: string; scenes: Partial<Record<SceneKey, Clip>> }> = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : {};

let clips = 0;
for (const entry of jobs) {
  const dir = join(audioRoot, entry.id);
  mkdirSync(dir, { recursive: true });
  const scenes: Partial<Record<SceneKey, Clip>> = {};

  for (const scene of SCENES) {
    const text = entry.narration?.[scene];
    if (!text || !text.trim()) continue;
    const destMp3 = join(dir, `${scene}.mp3`);
    const destMeta = join(dir, `${scene}.words.json`);

    let sec: number;
    if (force || !existsSync(destMp3) || !existsSync(destMeta)) {
      ({ sec } = await makeClip(text, destMp3, destMeta));
      clips++;
      await new Promise((r) => setTimeout(r, 250)); // ritmo: evita rate-limit
    } else {
      const meta = await parseFile(destMp3).catch(() => null);
      sec = meta?.format.duration ?? 0;
      if (sec <= 0.2) {
        ({ sec } = await makeClip(text, destMp3, destMeta));
        clips++;
      }
    }

    const durationInFrames = Math.ceil(sec * FPS);
    scenes[scene] = {
      src: `shorts/${entry.id}/${scene}.mp3`,
      durationInFrames,
      words: alignWords(text, destMeta, durationInFrames),
    };
  }

  manifest[entry.id] = { voice: VOICE, scenes };
  const spoken = Object.values(scenes).reduce((total, clip) => total + (clip?.durationInFrames ?? 0), 0);
  const legendadas = Object.values(scenes).every((clip) => (clip?.words?.length ?? 0) > 0);
  console.log(
    `  ✓ ${entry.id} — ${Object.keys(scenes).length} cenas, ${(spoken / FPS).toFixed(1)}s falados` +
      (legendadas ? "" : "  ⚠ SEM marcação de palavra em alguma cena"),
  );
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 1), "utf8");
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 1), "utf8");
console.log(`FIM: ${jobs.length} Shorts, ${clips} clipes novos, voz=${VOICE}`);
process.exitCode = 0;
