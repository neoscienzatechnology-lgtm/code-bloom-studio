/**
 * Captura seções PÚBLICAS da landing em resolução de celular (layout mobile
 * real, 412×892 @2.62 ≈ 1080px de largura). Saída: out/store/screenshots/raw/.
 *   npx tsx scripts/cap-landing.ts
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "out", "store", "screenshots", "raw");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 412, height: 892 },
  deviceScaleFactor: 2.62,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Mobile Safari/537.36",
});
await page.goto("https://code-bloom-studio.vercel.app/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// topo (hero)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);
await page.screenshot({ path: join(out, "landing-hero.png") });

// seções seguintes: rola cada heading de seção para o topo e captura
const anchors = await page.evaluate(() => {
  const hs = Array.from(document.querySelectorAll("section h2, section h3"));
  return hs.slice(0, 8).map((h) => ({
    text: (h.textContent || "").trim().slice(0, 40),
    top: Math.max(0, h.getBoundingClientRect().top + window.scrollY - 90),
  }));
});
let n = 0;
for (const a of anchors) {
  n++;
  await page.evaluate((y) => window.scrollTo(0, y), a.top);
  await page.waitForTimeout(900);
  const safe = a.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 28) || `sec${n}`;
  await page.screenshot({ path: join(out, `landing-${String(n).padStart(2, "0")}-${safe}.png`) });
  console.log(`✓ landing-${String(n).padStart(2, "0")}-${safe}.png  (${a.text})`);
}
await browser.close();
console.log("Concluído.");
