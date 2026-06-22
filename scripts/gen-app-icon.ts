/**
 * Gera o ícone do app Android (launcher) com a marca CodeTier, em todas as
 * densidades: foreground do adaptive icon + legados quadrado e redondo.
 * Escreve direto em android/app/src/main/res/mipmap-*.
 *   npm run icon:android
 * (depois é só rebuildar o app; não precisa de cap sync)
 */
import { chromium, type Browser } from "@playwright/test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const res = join(here, "..", "android", "app", "src", "main", "res");

const BG = "#0A0E0C";
const LEGACY: Record<string, number> = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
const FG: Record<string, number> = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };

const defs = (s: number) => `
  <linearGradient id="neon" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#86F5A6"/><stop offset="48%" stop-color="#4DE84A"/><stop offset="100%" stop-color="#1C8F2A"/>
  </linearGradient>
  <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="${(s * 0.02).toFixed(2)}" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;

// emblema (hexágono pointy-top + </>) centrado, raio r (meia-largura)
function emblem(cx: number, cy: number, r: number, stroke: number, glyph: number) {
  const h = r * 1.06;
  const pts = [
    [cx, cy - h], [cx + r, cy - h * 0.5], [cx + r, cy + h * 0.5],
    [cx, cy + h], [cx - r, cy + h * 0.5], [cx - r, cy - h * 0.5],
  ].map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");
  return `
    <polygon points="${pts}" fill="rgba(77,232,74,0.08)" stroke="url(#neon)" stroke-width="${stroke.toFixed(1)}" stroke-linejoin="round" filter="url(#glow)"/>
    <text x="${cx}" y="${cy}" font-family="'Fira Code',monospace" font-weight="700" font-size="${glyph.toFixed(0)}" fill="url(#neon)" text-anchor="middle" dominant-baseline="central" filter="url(#glow)">&lt;/&gt;</text>`;
}

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@700&display=swap" rel="stylesheet">`;

function svgForeground(s: number) {
  const r = s * 0.27;
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg"><defs>${defs(s)}</defs>${emblem(s / 2, s / 2, r, s * 0.035, r * 0.78)}</svg>`;
}
function svgSquare(s: number) {
  const r = s * 0.32;
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg"><defs>${defs(s)}</defs><rect width="${s}" height="${s}" rx="${s * 0.18}" fill="${BG}"/>${emblem(s / 2, s / 2, r, s * 0.04, r * 0.78)}</svg>`;
}
function svgRound(s: number) {
  const r = s * 0.3;
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg"><defs>${defs(s)}</defs><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}" fill="${BG}"/>${emblem(s / 2, s / 2, r, s * 0.04, r * 0.78)}</svg>`;
}

async function shoot(browser: Browser, svg: string, s: number, out: string) {
  const page = await browser.newPage({ viewport: { width: s, height: s }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><meta charset="utf-8">${FONTS}<style>html,body{margin:0;padding:0}svg{display:block}</style>${svg}`, { waitUntil: "networkidle" });
  await page.evaluate(() => (document as Document).fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: out, type: "png", omitBackground: true, clip: { x: 0, y: 0, width: s, height: s } });
  await page.close();
}

const browser = await chromium.launch();
for (const d of Object.keys(LEGACY)) {
  await shoot(browser, svgForeground(FG[d]), FG[d], join(res, `mipmap-${d}`, "ic_launcher_foreground.png"));
  await shoot(browser, svgSquare(LEGACY[d]), LEGACY[d], join(res, `mipmap-${d}`, "ic_launcher.png"));
  await shoot(browser, svgRound(LEGACY[d]), LEGACY[d], join(res, `mipmap-${d}`, "ic_launcher_round.png"));
  console.log(`✓ ${d}`);
}
await browser.close();
console.log("Ícones do app gerados.");
