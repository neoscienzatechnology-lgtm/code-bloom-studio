/**
 * "Ascendant Strata" — criativos de marca CodeTier (fundos do app).
 * Contornos topográficos luminosos que sobem de um cume, lattice hexagonal
 * velado, uma única voz neon, profundidade atmosférica. SVG → Chromium → PNG.
 *   npm run brand:art
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "out", "criativos");
mkdirSync(outDir, { recursive: true });

// pseudo-aleatório determinístico
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
  rings: number;
  ringStep: number;
  r0: number;
  yScale: number;
  maxOpacity: number;
  glow: number; // raio do brilho do cume (px)
  particles: number;
};

// contornos topográficos orgânicos em torno do cume, esmaecendo com o raio
function contours(v: Variant): string {
  const cx = v.cx * v.w;
  const cy = v.cy * v.h;
  let out = "";
  for (let i = 0; i < v.rings; i++) {
    const r = v.r0 + i * v.ringStep;
    const seed = i * 7.13;
    const pts: string[] = [];
    const steps = 220;
    for (let s = 0; s <= steps; s++) {
      const a = (s / steps) * Math.PI * 2;
      // perturbação de baixa frequência → contorno orgânico, não círculo
      const wob =
        Math.sin(a * 3 + seed) * (r * 0.06) +
        Math.sin(a * 5 + seed * 1.7) * (r * 0.035) +
        Math.sin(a * 2 + seed * 0.5) * (r * 0.05);
      const rr = r + wob;
      const x = cx + rr * Math.cos(a);
      const y = cy + rr * Math.sin(a) * v.yScale;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    // esmaecimento atmosférico: anéis distantes somem
    const t = i / v.rings;
    const op = (v.maxOpacity * Math.pow(1 - t, 1.45)).toFixed(3);
    const sw = (1.6 - t * 0.9).toFixed(2);
    out += `<polyline points="${pts.join(" ")}" fill="none" stroke="url(#neon)" stroke-width="${sw}" opacity="${op}" stroke-linejoin="round"/>`;
  }
  return out;
}

function particles(v: Variant): string {
  let out = "";
  for (let i = 0; i < v.particles; i++) {
    const x = rand(i) * v.w;
    const y = rand(i + 91) * v.h;
    const s = 0.8 + rand(i + 7) * 2.2;
    const o = (0.06 + rand(i + 3) * 0.22).toFixed(3);
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${s.toFixed(1)}" fill="#9CFFC0" opacity="${o}"/>`;
  }
  return out;
}

function svg(v: Variant): string {
  const cx = v.cx * v.w;
  const cy = v.cy * v.h;
  return `<svg width="${v.w}" height="${v.h}" viewBox="0 0 ${v.w} ${v.h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="base" cx="${(v.cx * 100).toFixed(0)}%" cy="${(v.cy * 100).toFixed(0)}%" r="95%">
      <stop offset="0%" stop-color="#0E1A13"/>
      <stop offset="45%" stop-color="#0A0E0C"/>
      <stop offset="100%" stop-color="#050806"/>
    </radialGradient>
    <linearGradient id="neon" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="#9CFFC0"/>
      <stop offset="42%" stop-color="#4DE84A"/>
      <stop offset="100%" stop-color="#155E26"/>
    </linearGradient>
    <radialGradient id="summit" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#CFFFD9" stop-opacity="0.62"/>
      <stop offset="16%" stop-color="#7CF59A" stop-opacity="0.4"/>
      <stop offset="44%" stop-color="#2FAF3C" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#1C8F2A" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <pattern id="hex" width="60" height="68" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
      <path d="M30 0 L60 17 L60 51 L30 68 L0 51 L0 17 Z" fill="none" stroke="#4DE84A" stroke-width="1" opacity="0.18"/>
    </pattern>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.1"/></filter>
    <radialGradient id="vig" cx="50%" cy="46%" r="75%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.72"/>
    </radialGradient>
  </defs>

  <rect width="${v.w}" height="${v.h}" fill="url(#base)"/>
  <!-- lattice hexagonal velado, mascarado para sumir nas bordas -->
  <rect width="${v.w}" height="${v.h}" fill="url(#hex)" opacity="0.5"
        style="mask: radial-gradient(60% 60% at ${(v.cx * 100).toFixed(0)}% ${(v.cy * 100).toFixed(0)}%, #000, transparent 78%)"/>
  <!-- brilho do cume -->
  <ellipse cx="${cx}" cy="${cy}" rx="${v.glow}" ry="${(v.glow * v.yScale).toFixed(0)}" fill="url(#summit)"/>
  <!-- contornos topográficos -->
  <g filter="url(#soft)">${contours(v)}</g>
  ${particles(v)}
  <!-- grão: textura material, como uma chapa revelada -->
  <rect width="${v.w}" height="${v.h}" filter="url(#grain)" opacity="0.05" style="mix-blend-mode:overlay"/>
  <rect width="${v.w}" height="${v.h}" fill="url(#vig)"/>
</svg>`;
}

const variants: Variant[] = [
  // HERO — expressão plena, cume no terço superior-central
  { file: "hero-codetier.png", w: 1920, h: 1080, cx: 0.5, cy: 0.34, rings: 60, ringStep: 20, r0: 34, yScale: 0.6, maxOpacity: 0.72, glow: 340, particles: 44 },
  // ATMOS — versão calma, cume bem no alto, muito espaço negativo embaixo (é mascarado)
  { file: "atmos-codetier.png", w: 1920, h: 1080, cx: 0.42, cy: 0.18, rings: 44, ringStep: 24, r0: 32, yScale: 0.52, maxOpacity: 0.52, glow: 290, particles: 30 },
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
