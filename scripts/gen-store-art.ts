/**
 * Gera as artes da Play Store (ícone 512×512 + feature graphic 1024×500) com a
 * marca CodeTier na linguagem "Ascendant Strata": contornos topográficos
 * luminosos + emblema hexágono. SVG no Chromium headless. Saída em out/store/.
 *   npm run store:art
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "out", "store");
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

// contornos topográficos em torno de um cume, esmaecendo com o raio
function contours(cx: number, cy: number, count: number, r0: number, step: number, yScale: number, maxOp: number) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const r = r0 + i * step;
    const p: string[] = [];
    for (let k = 0; k <= 140; k++) {
      const a = (k / 140) * Math.PI * 2;
      const wob = Math.sin(a * 3 + i) * r * 0.07 + Math.sin(a * 5 + i * 1.7) * r * 0.04;
      const rr = r + wob;
      p.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a) * yScale).toFixed(1)}`);
    }
    const op = (maxOp * Math.pow(1 - i / count, 1.4)).toFixed(3);
    s += `<polyline points="${p.join(" ")}" fill="none" stroke="url(#neon)" stroke-width="${(1.5 - (i / count) * 0.9).toFixed(2)}" opacity="${op}" stroke-linejoin="round"/>`;
  }
  return s;
}

// hexágono "pointy-top" + glifo </> centrado em (cx,cy) com raio r
function emblem(cx: number, cy: number, r: number, stroke = 14, glyph = r * 0.62) {
  const h = r * 1.06;
  const pts = [
    [cx, cy - h], [cx + r, cy - h * 0.5], [cx + r, cy + h * 0.5],
    [cx, cy + h], [cx - r, cy + h * 0.5], [cx - r, cy - h * 0.5],
  ].map((q) => q.map((n) => n.toFixed(1)).join(",")).join(" ");
  return `
    <polygon points="${pts}" fill="rgba(77,232,74,0.07)" stroke="url(#neonEmblem)" stroke-width="${stroke}" stroke-linejoin="round" filter="url(#glow)"/>
    <text x="${cx}" y="${cy}" font-family="'Fira Code',monospace" font-weight="700" font-size="${glyph}" fill="url(#neonEmblem)" text-anchor="middle" dominant-baseline="central" filter="url(#glow)">&lt;/&gt;</text>`;
}

function tierBars(x: number, baseY: number, neon = "url(#neonEmblem)") {
  const bw = 22, gap = 12;
  return [34, 56, 82]
    .map((bh, i) => `<rect x="${x + i * (bw + gap)}" y="${baseY - bh}" width="${bw}" height="${bh}" rx="6" fill="${neon}" opacity="${0.55 + i * 0.18}"/>`)
    .join("");
}

const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>${DEFS}</defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <ellipse cx="256" cy="220" rx="230" ry="150" fill="url(#summit)"/>
  <g style="mask:radial-gradient(circle at 50% 44%, #000 28%, transparent 82%)">${contours(256, 220, 15, 70, 22, 0.62, 0.4)}</g>
  ${emblem(256, 230, 150, 16, 116)}
  <g transform="translate(256,0)">${tierBars(-67, 456)}</g>
  <rect width="512" height="512" filter="url(#grain)" opacity="0.045" style="mix-blend-mode:overlay"/>
  <rect width="512" height="512" fill="none" style="box-shadow:inset 0 0 120px 34px rgba(0,0,0,.62)"/>
</svg>`;

const featureSvg = `
<svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
  <defs>${DEFS}</defs>
  <rect width="1024" height="500" fill="url(#bg)"/>
  <ellipse cx="250" cy="250" rx="340" ry="240" fill="url(#summit)"/>
  <g style="mask:radial-gradient(95% 120% at 24% 50%, #000, transparent 86%)">${contours(250, 250, 22, 70, 26, 0.66, 0.42)}</g>
  ${emblem(250, 250, 130, 14, 100)}
  <text x="430" y="232" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="104" fill="#EAF2EC">Code<tspan fill="url(#neonEmblem)">Tier</tspan></text>
  <text x="436" y="296" font-family="'Space Grotesk',sans-serif" font-weight="500" font-size="34" fill="#8DA294">Aprenda a programar de verdade</text>
  <g>${tierBars(436, 360)}</g>
  <rect width="1024" height="500" filter="url(#grain)" opacity="0.04" style="mix-blend-mode:overlay"/>
</svg>`;

async function shoot(svg: string, w: number, h: number, file: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>html,body{margin:0;padding:0;background:#0A0E0C}svg{display:block}</style></head><body>${svg}</body></html>`,
    { waitUntil: "networkidle" },
  );
  await page.evaluate(() => (document as Document).fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(outDir, file), type: "png", clip: { x: 0, y: 0, width: w, height: h } });
  await browser.close();
  console.log(`✓ out/store/${file}`);
}

await shoot(iconSvg, 512, 512, "icon-512.png");
await shoot(featureSvg, 1024, 500, "feature-1024x500.png");
console.log("Concluído.");
