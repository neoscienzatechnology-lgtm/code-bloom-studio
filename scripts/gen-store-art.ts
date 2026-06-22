/**
 * Gera as artes da Play Store (ícone 512×512 + feature graphic 1024×500) com a
 * marca CodeTier, renderizando SVG no Chromium headless. Saída em out/store/.
 *   npm run store:art
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const outDir = join(root, "out", "store");
mkdirSync(outDir, { recursive: true });

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Fira+Code:wght@600;700&display=swap" rel="stylesheet">`;

const DEFS = `
  <radialGradient id="bg" cx="50%" cy="40%" r="80%">
    <stop offset="0%" stop-color="#10211a"/>
    <stop offset="55%" stop-color="#0A0E0C"/>
    <stop offset="100%" stop-color="#060907"/>
  </radialGradient>
  <linearGradient id="neon" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#86F5A6"/>
    <stop offset="48%" stop-color="#4DE84A"/>
    <stop offset="100%" stop-color="#1C8F2A"/>
  </linearGradient>
  <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="9" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <pattern id="hexgrid" width="56" height="64" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
    <path d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z" fill="none" stroke="rgba(77,232,74,0.10)" stroke-width="1.5"/>
  </pattern>`;

// hexágono "pointy-top" + glifo </> centrado em (cx,cy) com raio r
function emblem(cx: number, cy: number, r: number, stroke = 14, glyph = r * 0.62) {
  const w = r, h = r * 1.06;
  const pts = [
    [cx, cy - h], [cx + w, cy - h * 0.5], [cx + w, cy + h * 0.5],
    [cx, cy + h], [cx - w, cy + h * 0.5], [cx - w, cy - h * 0.5],
  ].map((p) => p.join(",")).join(" ");
  return `
    <polygon points="${pts}" fill="rgba(77,232,74,0.07)" stroke="url(#neon)" stroke-width="${stroke}" stroke-linejoin="round" filter="url(#glow)"/>
    <text x="${cx}" y="${cy}" font-family="'Fira Code',monospace" font-weight="700" font-size="${glyph}" fill="url(#neon)" text-anchor="middle" dominant-baseline="central" filter="url(#glow)">&lt;/&gt;</text>`;
}

function tierBars(x: number, baseY: number, neon = "url(#neon)") {
  const bw = 22, gap = 12;
  return [34, 56, 82]
    .map((bh, i) => `<rect x="${x + i * (bw + gap)}" y="${baseY - bh}" width="${bw}" height="${bh}" rx="6" fill="${neon}" opacity="${0.55 + i * 0.18}"/>`)
    .join("");
}

const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>${DEFS}</defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#hexgrid)" opacity="0.5" style="mask:radial-gradient(circle at 50% 42%, #000 30%, transparent 78%)"/>
  <circle cx="256" cy="214" r="150" fill="rgba(55,211,44,0.16)" filter="url(#glow)"/>
  ${emblem(256, 226, 150, 16, 116)}
  <g transform="translate(256,0)">${tierBars(-67, 452)}</g>
  <rect width="512" height="512" fill="none" style="box-shadow:inset 0 0 120px 30px rgba(0,0,0,.6)"/>
</svg>`;

const featureSvg = `
<svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
  <defs>${DEFS}</defs>
  <rect width="1024" height="500" fill="url(#bg)"/>
  <rect width="1024" height="500" fill="url(#hexgrid)" opacity="0.6" style="mask:radial-gradient(120% 90% at 35% 45%, #000, transparent 80%)"/>
  <circle cx="250" cy="250" r="190" fill="rgba(55,211,44,0.14)" filter="url(#glow)"/>
  ${emblem(250, 250, 132, 14, 102)}
  <text x="430" y="232" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="104" fill="#EAF2EC">Code<tspan fill="url(#neon)">Tier</tspan></text>
  <text x="436" y="296" font-family="'Space Grotesk',sans-serif" font-weight="500" font-size="34" fill="#8DA294">Aprenda a programar de verdade</text>
  <g>${tierBars(436, 360)}</g>
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
