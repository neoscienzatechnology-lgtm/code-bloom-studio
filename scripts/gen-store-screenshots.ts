/**
 * Monta screenshots de loja (1080×1920) no padrão CodeTier "Lattice Ascension":
 * fundo dark com malha de nós, moldura de celular com o print dentro e uma
 * legenda curta (Space Grotesk; *palavra* vira neon).
 *
 * Lê os prints crus de out/store/screenshots/raw/ conforme o manifesto SHOTS
 * abaixo e escreve os finais em out/store/screenshots/.
 *   npm run store:screens
 */
import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const base = join(dirname(fileURLToPath(import.meta.url)), "..", "out", "store", "screenshots");
const rawDir = join(base, "raw");
mkdirSync(rawDir, { recursive: true });

// Manifesto: raw → final + legenda (use *palavra* para o destaque neon).
// Ao receber prints do celular (telas logadas), salve-os em raw/ e adicione aqui.
const SHOTS: { raw: string; file: string; caption: string }[] = [
  { raw: "landing-hero.png", file: "shot-01-comece.png", caption: "Aprenda a *programar* do zero" },
  { raw: "landing-01-o-que-voc-quer-aprender.png", file: "shot-02-trilhas.png", caption: "Trilhas do zero ao *projeto*" },
  { raw: "landing-03-aprenda-fazendo.png", file: "shot-03-fazendo.png", caption: "Você aprende *fazendo*" },
  // Telas logadas (prints do celular do usuário) — descomente ao recebê-los:
  // { raw: "phone-dashboard.png", file: "shot-04-dashboard.png", caption: "Seu progresso, *todo dia*" },
  // { raw: "phone-aula.png", file: "shot-05-aula.png", caption: "Aulas curtas, *uma ideia* por vez" },
  // { raw: "phone-video.png", file: "shot-06-video.png", caption: "Teoria em *vídeo* antes da prática" },
  // { raw: "phone-editor.png", file: "shot-07-editor.png", caption: "Código *de verdade*, no celular" },
];

const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// malha de nós (mesma linguagem dos fundos), foco atrás da legenda
function lattice(w: number, h: number, fx: number, fy: number, grid: number): string {
  const s = grid;
  const nodes: { x: number; y: number; d: number }[] = [];
  let idx = 1;
  for (let gy = -s; gy <= h + s; gy += s)
    for (let gx = -s; gx <= w + s; gx += s) {
      idx++;
      const x = gx + (rand(idx) - 0.5) * s * 0.55;
      const y = gy + (rand(idx + 97) - 0.5) * s * 0.55;
      nodes.push({ x, y, d: Math.hypot(x - fx, y - fy) });
    }
  const maxD = Math.hypot(w, h) * 0.55;
  const fall = (d: number) => Math.max(0, Math.pow(1 - Math.min(d / maxD, 1), 1.6));
  const maxConn = s * 1.5;
  let out = "";
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const opA = fall(a.d);
    if (opA < 0.03) continue;
    out += `<circle cx="${a.x.toFixed(1)}" cy="${a.y.toFixed(1)}" r="${(1 + opA * 2).toFixed(1)}" fill="#4DE84A" opacity="${(opA * 0.7).toFixed(3)}"/>`;
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      if (Math.abs(a.x - b.x) > maxConn || Math.abs(a.y - b.y) > maxConn) continue;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > maxConn) continue;
      const o = Math.min(opA, fall(b.d)) * (1 - dist / maxConn) * 0.5;
      if (o < 0.02) continue;
      out += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="#4DE84A" stroke-width="0.8" opacity="${o.toFixed(3)}"/>`;
    }
  }
  return out;
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">`;

function captionHtml(caption: string): string {
  return caption.replace(/\*([^*]+)\*/g, '<span style="color:#4DE84A">$1</span>');
}

function pageHtml(rawPng: Buffer, caption: string): string {
  const W = 1080;
  const H = 1920;
  const screenW = 760;
  const bezel = 14;
  const frameW = screenW + bezel * 2;
  const dataUrl = `data:image/png;base64,${rawPng.toString("base64")}`;
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  html,body{margin:0;padding:0}
  .canvas{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:radial-gradient(120% 90% at 50% -8%, #10211A 0%, #0A0E0C 46%, #050806 100%)}
  .caption{position:absolute;top:96px;left:70px;right:70px;text-align:center;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:74px;line-height:1.14;color:#EAF2EC;letter-spacing:-0.5px}
  .phone{position:absolute;left:50%;transform:translateX(-50%);top:330px;width:${frameW}px;border-radius:64px;padding:${bezel}px;background:#101512;border:1px solid rgba(156,255,192,0.22);box-shadow:0 40px 120px rgba(0,0,0,0.75), 0 0 90px rgba(77,232,74,0.10), inset 0 1px 0 rgba(255,255,255,0.06)}
  .screen{display:block;width:${screenW}px;border-radius:50px;background:#000}
  .vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(90% 80% at 50% 42%, transparent 55%, rgba(0,0,0,0.66) 100%)}
  </style></head><body>
  <div class="canvas">
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0">${lattice(W, H, W / 2, 180, 88)}</svg>
    <div class="caption">${captionHtml(caption)}</div>
    <div class="phone"><img class="screen" src="${dataUrl}"/></div>
    <div class="vig"></div>
  </div></body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
let done = 0;
for (const s of SHOTS) {
  const rawPath = join(rawDir, s.raw);
  if (!existsSync(rawPath)) {
    console.log(`• pulei ${s.file} (raw ausente: raw/${s.raw})`);
    continue;
  }
  await page.setContent(pageHtml(readFileSync(rawPath), s.caption), { waitUntil: "networkidle" });
  await page.evaluate(() => (document as Document).fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(base, s.file), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  done++;
  console.log(`✓ out/store/screenshots/${s.file}`);
}
await browser.close();
console.log(`Concluído: ${done}/${SHOTS.length}.`);
