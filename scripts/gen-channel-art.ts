/**
 * Arte do canal (YouTube / TikTok / Instagram) na linguagem "Lattice Ascension",
 * a mesma do ícone da Play Store e dos fundos do app.
 *   npm run channel:art
 *
 * Saída em out/canal/:
 *   avatar-codetier-800.png        800×800  — foto de perfil (as três plataformas)
 *   banner-youtube-2048x1152.png   2048×1152 — arte de canal do YouTube
 *   banner-preview-tv.png / -desktop / -mobile — como o banner é cortado
 *
 * Por que 2048×1152: o YouTube usa a MESMA imagem em TV, desktop e celular,
 * recortando de fora para dentro. Só a faixa central de 1235×338 aparece em
 * todos os aparelhos — texto e logo vivem lá dentro, o resto é atmosfera.
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "out", "canal");
mkdirSync(outDir, { recursive: true });

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Fira+Code:wght@600;700&display=swap" rel="stylesheet">`;

const DEFS = `
  <radialGradient id="bg" cx="40%" cy="38%" r="90%">
    <stop offset="0%" stop-color="#10211a"/>
    <stop offset="52%" stop-color="#0A0E0C"/>
    <stop offset="100%" stop-color="#050806"/>
  </radialGradient>
  <linearGradient id="neon" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#9CFFC0"/>
    <stop offset="44%" stop-color="#4DE84A"/>
    <stop offset="100%" stop-color="#155E26"/>
  </linearGradient>
  <linearGradient id="neonEmblem" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#86F5A6"/>
    <stop offset="48%" stop-color="#4DE84A"/>
    <stop offset="100%" stop-color="#1C8F2A"/>
  </linearGradient>
  <radialGradient id="summit" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#CFFFD9" stop-opacity="0.5"/>
    <stop offset="20%" stop-color="#7CF59A" stop-opacity="0.3"/>
    <stop offset="55%" stop-color="#2FAF3C" stop-opacity="0.11"/>
    <stop offset="100%" stop-color="#1C8F2A" stop-opacity="0"/>
  </radialGradient>
  <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="9" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`;

const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function lattice(w: number, h: number, fx: number, fy: number, s: number, jitter: number, lineOp: number, reach = 0.62) {
  const nodes: { x: number; y: number; d: number }[] = [];
  let idx = 1;
  for (let gy = -s; gy <= h + s; gy += s)
    for (let gx = -s; gx <= w + s; gx += s) {
      idx++;
      const x = gx + (rand(idx) - 0.5) * s * jitter;
      const y = gy + (rand(idx + 9973) - 0.5) * s * jitter;
      nodes.push({ x, y, d: Math.hypot(x - fx, y - fy) });
    }
  const maxD = Math.hypot(w, h) * reach;
  const fall = (d: number) => Math.max(0, Math.pow(1 - Math.min(d / maxD, 1), 1.6));
  const maxConn = s * 1.5;
  let lines = "";
  let dots = "";
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const opA = fall(a.d);
    if (opA < 0.04) continue;
    dots += `<circle cx="${a.x.toFixed(1)}" cy="${a.y.toFixed(1)}" r="${(1 + opA * 2.4).toFixed(1)}" fill="url(#neon)" opacity="${(opA * 0.9).toFixed(3)}"/>`;
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      if (Math.abs(a.x - b.x) > maxConn || Math.abs(a.y - b.y) > maxConn) continue;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > maxConn) continue;
      const o = Math.min(opA, fall(b.d)) * (1 - dist / maxConn) * lineOp;
      if (o < 0.02) continue;
      lines += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="url(#neon)" stroke-width="${(0.7 + o * 0.8).toFixed(2)}" opacity="${o.toFixed(3)}"/>`;
    }
  }
  return lines + dots;
}

/** hexágono "pointy-top" + glifo </> centrado em (cx,cy) */
function emblem(cx: number, cy: number, r: number, stroke = 14, glyph = r * 0.62) {
  const h = r * 1.06;
  const pts = [
    [cx, cy - h],
    [cx + r, cy - h * 0.5],
    [cx + r, cy + h * 0.5],
    [cx, cy + h],
    [cx - r, cy + h * 0.5],
    [cx - r, cy - h * 0.5],
  ]
    .map((q) => q.map((n) => n.toFixed(1)).join(","))
    .join(" ");
  return `
    <polygon points="${pts}" fill="rgba(77,232,74,0.07)" stroke="url(#neonEmblem)" stroke-width="${stroke}" stroke-linejoin="round" filter="url(#glow)"/>
    <text x="${cx}" y="${cy}" font-family="'Fira Code',monospace" font-weight="700" font-size="${glyph}" fill="url(#neonEmblem)" text-anchor="middle" dominant-baseline="central" filter="url(#glow)">&lt;/&gt;</text>`;
}

function tierBars(x: number, baseY: number, heights = [34, 56, 82], bw = 22, gap = 12) {
  return heights
    .map(
      (bh, i) =>
        `<rect x="${x + i * (bw + gap)}" y="${baseY - bh}" width="${bw}" height="${bh}" rx="${Math.max(3, bw / 4)}" fill="url(#neonEmblem)" opacity="${0.55 + i * 0.18}"/>`,
    )
    .join("");
}

// ── AVATAR ────────────────────────────────────────────────────────────────
// Cortado em CÍRCULO nas três plataformas e visto a ~40px numa lista de
// comentários: só o emblema, grande e centralizado. Nome escrito aqui viraria
// borrão — o nome do canal já aparece ao lado.
const avatar = `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>${DEFS}</defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <ellipse cx="400" cy="380" rx="360" ry="300" fill="url(#summit)"/>
  <g style="mask:radial-gradient(circle at 50% 46%, #000 26%, transparent 80%)">${lattice(800, 800, 400, 380, 62, 0.5, 0.5)}</g>
  ${emblem(400, 400, 236, 24, 182)}
  <rect width="800" height="800" filter="url(#grain)" opacity="0.045" style="mix-blend-mode:overlay"/>
</svg>`;

// ── BANNER DO YOUTUBE ─────────────────────────────────────────────────────
// 2048×1152 com a faixa segura central de 1235×338 (x 406..1641, y 407..745).
// Tudo que importa vive lá dentro; fora é só atmosfera, porque o celular corta.
const SAFE_X = (2048 - 1235) / 2;
const SAFE_Y = (1152 - 338) / 2;
const banner = `
<svg width="2048" height="1152" viewBox="0 0 2048 1152" xmlns="http://www.w3.org/2000/svg">
  <defs>${DEFS}</defs>
  <rect width="2048" height="1152" fill="url(#bg)"/>
  <ellipse cx="1024" cy="576" rx="820" ry="480" fill="url(#summit)"/>
  <g style="mask:radial-gradient(70% 90% at 50% 50%, #000, transparent 88%)">${lattice(2048, 1152, 1024, 540, 74, 0.5, 0.55, 0.55)}</g>
  ${emblem(760, 576, 132, 14, 100)}
  <text x="930" y="558" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="112" fill="#EAF2EC">Code<tspan fill="url(#neonEmblem)">Tier</tspan></text>
  <text x="936" y="626" font-family="'Space Grotesk',sans-serif" font-weight="500" font-size="38" fill="#8DA294">Programação em 30 segundos</text>
  <text x="936" y="692" font-family="'Fira Code',monospace" font-weight="600" font-size="32" fill="#4DE84A">codetier.vercel.app</text>
  <g>${tierBars(1330, 692, [18, 28, 40], 12, 8)}</g>
  <rect width="2048" height="1152" filter="url(#grain)" opacity="0.04" style="mix-blend-mode:overlay"/>
</svg>`;

// Recortes reais do YouTube, para conferir antes de subir.
const CORTES: Array<{ file: string; x: number; y: number; w: number; h: number; nome: string }> = [
  { file: "banner-preview-mobile.png", x: SAFE_X, y: SAFE_Y, w: 1235, h: 338, nome: "celular (faixa segura)" },
  { file: "banner-preview-desktop.png", x: 512, y: SAFE_Y, w: 1024, h: 338, nome: "desktop" },
  { file: "banner-preview-tv.png", x: 0, y: 0, w: 2048, h: 1152, nome: "TV (imagem inteira)" },
];

const browser = await chromium.launch();

async function shoot(svg: string, w: number, h: number, file: string) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>html,body{margin:0;padding:0;background:#0A0E0C}svg{display:block}</style></head><body>${svg}</body></html>`,
    { waitUntil: "networkidle" },
  );
  await page.waitForTimeout(300); // deixa a web font assentar antes do clique
  await page.screenshot({ path: join(outDir, file), type: "png", clip: { x: 0, y: 0, width: w, height: h } });
  await page.close();
  console.log(`✓ out/canal/${file}  (${w}×${h})`);
}

await shoot(avatar, 800, 800, "avatar-codetier-800.png");
await shoot(banner, 2048, 1152, "banner-youtube-2048x1152.png");

for (const corte of CORTES) {
  const page = await browser.newPage({ viewport: { width: corte.w, height: corte.h }, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>html,body{margin:0;padding:0;overflow:hidden;background:#0A0E0C}div{position:absolute;left:${-corte.x}px;top:${-corte.y}px}svg{display:block}</style></head><body><div>${banner}</div></body></html>`,
    { waitUntil: "networkidle" },
  );
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, corte.file), type: "png", clip: { x: 0, y: 0, width: corte.w, height: corte.h } });
  await page.close();
  console.log(`✓ out/canal/${corte.file}  — ${corte.nome}`);
}

await browser.close();
