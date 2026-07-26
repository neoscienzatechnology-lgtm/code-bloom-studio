/**
 * Monta docs/shorts-copy.md: o que copiar e colar na hora de publicar cada
 * Short (título, descrição, hashtags, legenda curta) + a duração falada.
 * Assim a publicação não depende de abrir JSON nem de reescrever texto.
 *
 *   npm run shorts:copy
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

interface Short {
  id: string;
  courseId: string;
  lessonId: string;
  language: string;
  hook: string;
  hookType?: string;
  concept: string;
  points: string[];
  spokenWords?: number;
  platform: { title: string; description: string; hashtags: string[]; shortCaption: string };
}

const shorts: Short[] = JSON.parse(readFileSync(join(root, "remotion", "shorts-data.json"), "utf8"));
const narrationPath = join(root, "remotion", "shorts-narration.json");
const narration: Record<string, { scenes: Record<string, { durationInFrames: number }> }> = existsSync(narrationPath)
  ? JSON.parse(readFileSync(narrationPath, "utf8"))
  : {};

const seconds = (id: string) => {
  const scenes = narration[id]?.scenes;
  if (!scenes) return null;
  const frames = Object.values(scenes).reduce((total, clip) => total + (clip?.durationInFrames ?? 0), 0);
  return frames / 30;
};

const lines: string[] = [
  "# Shorts — o que publicar",
  "",
  "Gerado por `npm run shorts:copy` a partir de `remotion/shorts-data.json`.",
  "**Não edite à mão** — edite o JSON e rode de novo.",
  "",
  "Os MP4 ficam em `out/shorts/<id>.mp4` (fora do git). Ordem sugerida de publicação:",
  "um por dia útil, começando pelos de maior tensão no gancho.",
  "",
  "| # | Short | Curso | Gancho | Falado |",
  "|---|---|---|---|---|",
  ...shorts.map((s, i) => {
    const sec = seconds(s.id);
    return `| ${i + 1} | \`${s.id}\` | ${s.language} | ${s.hook} | ${sec ? `${sec.toFixed(0)}s` : "—"} |`;
  }),
  "",
];

shorts.forEach((s, i) => {
  const sec = seconds(s.id);
  lines.push(
    `## ${i + 1}. ${s.hook}`,
    "",
    `- **Arquivo**: \`out/shorts/${s.id}.mp4\``,
    `- **Origem**: curso ${s.courseId}, lição ${s.lessonId} (${s.language})`,
    `- **Tipo de gancho**: ${s.hookType ?? "—"}${sec ? ` · **duração falada**: ${sec.toFixed(1)}s` : ""}`,
    "",
    "**Título (YouTube Shorts)**",
    "",
    "```",
    s.platform.title,
    "```",
    "",
    "**Descrição**",
    "",
    "```",
    s.platform.description,
    "```",
    "",
    "**Legenda (TikTok / Reels)**",
    "",
    "```",
    `${s.platform.shortCaption} ${s.platform.hashtags.map((h) => `#${h}`).join(" ")}`,
    "```",
    "",
    "**Link com marcação de campanha** (use este na descrição/bio para o PostHog separar a origem)",
    "",
    "```",
    `https://codetier.vercel.app/cursos/${s.courseId}?utm_source=shorts&utm_campaign=${s.id}`,
    "```",
    "",
  );
});

lines.push(
  "## Checklist de publicação",
  "",
  "- [ ] Assistir com o som DESLIGADO antes de postar: a legenda queimada precisa contar a história sozinha.",
  "- [ ] Conferir que nada essencial fica atrás da interface (topo ~210px, rodapé ~260px).",
  "- [ ] Publicar como Short/Reels/TikTok nativo (upload direto, não link).",
  "- [ ] Responder os primeiros comentários na primeira hora — é o que decide o alcance.",
  "- [ ] Anotar visualizações em 24h e 7 dias para comparar ganchos.",
  "",
);

const out = join(root, "docs", "shorts-copy.md");
writeFileSync(out, lines.join("\n"), "utf8");
console.log(`docs/shorts-copy.md: ${shorts.length} Shorts`);
