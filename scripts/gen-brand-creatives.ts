/**
 * "Lattice Ascension" — criativos de marca CodeTier (fundos do app).
 * Uma malha de nós conectados (rede / grafo / circuito) adensando e brilhando
 * em direção a um foco luminoso — estruturas de dados e conexões, ascendendo
 * para a luz. Voz neon única, profundidade atmosférica. SVG → Chromium → PNG.
 *   npm run brand:art
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "out", "criativos");
mkdirSync(outDir, { recursive: true });

const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type Variant = {
  file: string;
  w: number;
  h: number;
  cx: number; // foco (cume) x, fração
  cy: number; // foco y, fração
  grid: number; // espaçamento da malha
  jitter: number; // 0..1 desordem dos nós
  lineOpacity: number; // intensidade das conexões
  reach: number; // alcance da atmosfera (fração da diagonal)
  glow: number; // raio do brilho do foco (px)
};

// malha de nós: grade jitterada, conexões com vizinhos próximos, tudo
// adensando/brilhando em direção ao foco e sumindo na distância (atmosfera).
function lattice(v: Variant): string {
  const fx = v.cx * v.w;
  const fy = v.cy * v.h;
  const s = v.grid;
  const nodes: { x: number; y: number; d: number }[] = [];
  let idx = 1;
  for (let gy = -s; gy <= v.h + s; gy += s) {
    for (let gx = -s; gx <= v.w + s; gx += s) {
      idx++;
      const x = gx + (rand(idx) - 0.5) * s * v.jitter;
      const y = gy + (rand(idx + 9973) - 0.5) * s * v.jitter;
      nodes.push({ x, y, d: Math.hypot(x - fx, y - fy) });
    }
  }
  const maxD = Math.hypot(v.w, v.h) * v.reach;
  const fall = (d: number) => Math.max(0, Math.pow(1 - Math.min(d / maxD, 1), 1.6));
  const maxConn = s * 1.5;
  let lines = "";
  let dots = "";
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const opA = fall(a.d);
    if (opA < 0.02) continue;
    const r = (0.8 + opA * 2.1).toFixed(1);
    dots += `<circle cx="${a.x.toFixed(1)}" cy="${a.y.toFixed(1)}" r="${r}" fill="url(#neon)" opacity="${(opA * 0.95).toFixed(3)}"/>`;
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      if (Math.abs(dx) > maxConn || Math.abs(dy) > maxConn) continue;
      const dist = Math.hypot(dx, dy);
      if (dist > maxConn) continue;
      const lop = Math.min(opA, fall(b.d)) * (1 - dist / maxConn) * v.lineOpacity;
      if (lop < 0.015) continue;
      const sw = (0.6 + lop * 0.8).toFixed(2);
      lines += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="url(#neon)" stroke-width="${sw}" opacity="${lop.toFixed(3)}"/>`;
    }
  }
  return lines + dots;
}

function svg(v: Variant): string {
  const cx = v.cx * v.w;
  const cy = v.cy * v.h;
  return `<svg width="${v.w}" height="${v.h}" viewBox="0 0 ${v.w} ${v.h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="base" cx="${(v.cx * 100).toFixed(0)}%" cy="${(v.cy * 100).toFixed(0)}%" r="95%">
      <stop offset="0%" stop-color="#0E1A13"/>
      <stop offset="46%" stop-color="#0A0E0C"/>
      <stop offset="100%" stop-color="#050806"/>
    </radialGradient>
    <linearGradient id="neon" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="#9CFFC0"/>
      <stop offset="42%" stop-color="#4DE84A"/>
      <stop offset="100%" stop-color="#176A2A"/>
    </linearGradient>
    <radialGradient id="summit" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#CFFFD9" stop-opacity="0.55"/>
      <stop offset="16%" stop-color="#7CF59A" stop-opacity="0.34"/>
      <stop offset="46%" stop-color="#2FAF3C" stop-opacity="0.13"/>
      <stop offset="100%" stop-color="#1C8F2A" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="0.5"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <radialGradient id="vig" cx="50%" cy="46%" r="78%">
      <stop offset="54%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.74"/>
    </radialGradient>
  </defs>

  <rect width="${v.w}" height="${v.h}" fill="url(#base)"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${v.glow}" ry="${(v.glow * 0.78).toFixed(0)}" fill="url(#summit)"/>
  <g filter="url(#soft)">${lattice(v)}</g>
  <rect width="${v.w}" height="${v.h}" filter="url(#grain)" opacity="0.05" style="mix-blend-mode:overlay"/>
  <rect width="${v.w}" height="${v.h}" fill="url(#vig)"/>
</svg>`;
}

const variants: Variant[] = [
  // HERO — malha plena, foco no terço superior-central
  { file: "hero-codetier.png", w: 1920, h: 1080, cx: 0.5, cy: 0.32, grid: 82, jitter: 0.55, lineOpacity: 0.85, reach: 0.62, glow: 360 },
  // ATMOS — versão calma, foco no alto, muito espaço negativo embaixo (mascarado)
  { file: "atmos-codetier.png", w: 1920, h: 1080, cx: 0.4, cy: 0.16, grid: 92, jitter: 0.5, lineOpacity: 0.6, reach: 0.5, glow: 300 },
];

const browser = await chromium.launch();
for (const v of variants) {
  const page = await browser.newPage({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#050806}svg{display:block}</style>${svg(v)}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: join(outDir, v.file), type: "png", clip: { x: 0, y: 0, width: v.w, height: v.h } });
  await page.close();
  console.log(`✓ out/criativos/${v.file}`);
}
await browser.close();
