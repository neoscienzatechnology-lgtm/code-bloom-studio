/**
 * Converte os PNGs de fundo gerados por `npm run brand:art` (out/criativos/)
 * para WebP em public/, via Chromium headless.
 *   npm run assets:webp
 */
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "out", "criativos");
const pub = join(root, "public");
const names = ["hero-codetier", "atmos-codetier"];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const name of names) {
  const png = readFileSync(join(src, `${name}.png`));
  const webpDataUrl: string = await page.evaluate(async (dataUrl) => {
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = () => res(null);
      img.onerror = rej;
      img.src = dataUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    return canvas.toDataURL("image/webp", 0.82);
  }, `data:image/png;base64,${png.toString("base64")}`);
  const out = Buffer.from(webpDataUrl.split(",")[1], "base64");
  writeFileSync(join(pub, `${name}.webp`), out);
  console.log(`${name}.webp ${(out.length / 1024).toFixed(0)}KB (was ${(png.length / 1024).toFixed(0)}KB)`);
}
await browser.close();
