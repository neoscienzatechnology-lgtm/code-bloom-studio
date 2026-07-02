/**
 * Infográficos das aulas na linguagem "Lattice Ascension" (CodeTier dark
 * premium): 22 diagramas conceituais em geometria pura (sem texto), um por
 * slug de LESSON_INFOGRAPHIC_SLUGS. SVG → Chromium → WebP direto em
 * public/lesson-infographics/<slug>.webp.
 *   npm run infographics
 */
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "lesson-infographics");
mkdirSync(outDir, { recursive: true });

const W = 1280;
const H = 720;
const NEON = "#4DE84A";
const SOFT = "#7BE99A";
const LIGHT = "#EAF2EC";
const AMBER = "#FFB84D";
const RED = "#FF6B5E";
const PANEL = "#101B14";
const PSTROKE = "rgba(125,233,150,0.5)";
const DIM = "rgba(125,233,150,0.35)";

const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// ---------- primitivas ----------
const panel = (x: number, y: number, w: number, h: number, r = 20, stroke = PSTROKE, sw = 3, fill = PANEL) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const dot = (x: number, y: number, r = 10, fill = NEON, op = 1) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${op}" filter="url(#glow)"/>`;
const seg = (x1: number, y1: number, x2: number, y2: number, stroke = SOFT, sw = 5, op = 1, dash = "") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" opacity="${op}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const harrow = (x1: number, x2: number, y: number, stroke = SOFT, sw = 5, op = 1, dash = "") => {
  const d = x2 > x1 ? 1 : -1;
  return (
    seg(x1, y, x2 - d * 14, y, stroke, sw, op, dash) +
    `<path d="M${x2 - d * 26} ${y - 13} L${x2} ${y} L${x2 - d * 26} ${y + 13}" fill="none" stroke="${stroke}" stroke-width="${sw}" opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`
  );
};
const hexagon = (cx: number, cy: number, r: number, stroke = NEON, sw = 5, fill = "rgba(77,232,74,0.06)") => {
  const h = r * 1.06;
  const pts = [
    [cx, cy - h], [cx + r, cy - h * 0.5], [cx + r, cy + h * 0.5],
    [cx, cy + h], [cx - r, cy + h * 0.5], [cx - r, cy - h * 0.5],
  ].map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");
  return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" filter="url(#glow)"/>`;
};
const gear = (cx: number, cy: number, r: number, stroke = NEON, sw = 5) => {
  let t = "";
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    t += seg(cx + Math.cos(a) * r, cy + Math.sin(a) * r, cx + Math.cos(a) * (r + 16), cy + Math.sin(a) * (r + 16), stroke, sw);
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PANEL}" stroke="${stroke}" stroke-width="${sw}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="none" stroke="${stroke}" stroke-width="${sw}"/>` + t;
};
const check = (cx: number, cy: number, s = 1, stroke = SOFT) =>
  `<path d="M${cx - 16 * s} ${cy} L${cx - 4 * s} ${cy + 13 * s} L${cx + 18 * s} ${cy - 14 * s}" fill="none" stroke="${stroke}" stroke-width="${6 * s}" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (cx: number, cy: number, s = 1, stroke = RED) =>
  seg(cx - 12 * s, cy - 12 * s, cx + 12 * s, cy + 12 * s, stroke, 6 * s) + seg(cx + 12 * s, cy - 12 * s, cx - 12 * s, cy + 12 * s, stroke, 6 * s);

// malha de fundo sutil (atmosfera da marca)
function backdropLattice(fx: number, fy: number): string {
  const s = 96;
  const nodes: { x: number; y: number; d: number }[] = [];
  let idx = 1;
  for (let gy = -s; gy <= H + s; gy += s)
    for (let gx = -s; gx <= W + s; gx += s) {
      idx++;
      const x = gx + (rand(idx) - 0.5) * s * 0.55;
      const y = gy + (rand(idx + 97) - 0.5) * s * 0.55;
      nodes.push({ x, y, d: Math.hypot(x - fx, y - fy) });
    }
  const maxD = Math.hypot(W, H) * 0.55;
  const fall = (d: number) => Math.max(0, Math.pow(1 - Math.min(d / maxD, 1), 1.6));
  let out = "";
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const opA = fall(a.d) * 0.3;
    if (opA < 0.02) continue;
    out += `<circle cx="${a.x.toFixed(1)}" cy="${a.y.toFixed(1)}" r="${(1 + opA * 4).toFixed(1)}" fill="${NEON}" opacity="${opA.toFixed(3)}"/>`;
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      if (Math.abs(a.x - b.x) > s * 1.5 || Math.abs(a.y - b.y) > s * 1.5) continue;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > s * 1.5) continue;
      const o = Math.min(opA, fall(b.d) * 0.3) * (1 - dist / (s * 1.5)) * 0.6;
      if (o < 0.015) continue;
      out += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${NEON}" stroke-width="0.8" opacity="${o.toFixed(3)}"/>`;
    }
  }
  return out;
}

// ---------- os 22 motivos ----------
const MOTIFS: Record<string, string> = {
  "programming-flow":
    panel(240, 290, 190, 140) + dot(335, 360, 26) +
    harrow(450, 530, 360) +
    panel(550, 290, 190, 140) + gear(645, 360, 34) +
    harrow(760, 840, 360) +
    panel(860, 290, 190, 140) +
    [0, 1, 2].map((i) => `<rect x="${905 + i * 40}" y="${400 - 34 - i * 24}" width="24" height="${34 + i * 24}" rx="7" fill="url(#neonv)" opacity="${0.6 + i * 0.2}"/>`).join(""),

  "variables-memory":
    dot(320, 400, 20, SOFT, 0.9) + harrow(360, 500, 400) +
    panel(520, 270, 240, 200) +
    `<rect x="560" y="242" width="120" height="40" rx="14" fill="rgba(77,232,74,0.2)" stroke="${NEON}" stroke-width="3"/>` +
    seg(585, 262, 655, 262, NEON, 5) +
    dot(640, 380, 30) +
    panel(820, 300, 180, 150, 20, DIM, 3) + dot(910, 375, 20, SOFT, 0.45),

  "data-types":
    panel(260, 290, 210, 150) +
    `<path d="M320 340 Q312 340 312 352 M340 340 Q332 340 332 352" fill="none" stroke="${NEON}" stroke-width="6" stroke-linecap="round"/>` +
    seg(310, 390, 420, 390, SOFT, 6) +
    panel(535, 290, 210, 150) +
    [0, 1, 2].map((i) => dot(590 + i * 50, 350, 12, NEON, 0.6 + i * 0.2)).join("") + seg(585, 395, 690, 395, SOFT, 6) +
    panel(810, 290, 210, 150) +
    `<rect x="855" y="340" width="120" height="48" rx="24" fill="rgba(77,232,74,0.15)" stroke="${NEON}" stroke-width="4"/>` +
    dot(950, 364, 17),

  "operators-transform":
    dot(340, 270, 22, SOFT, 0.85) + dot(340, 450, 22, SOFT, 0.85) +
    `<path d="M368 270 Q480 270 560 330 M368 450 Q480 450 560 390" fill="none" stroke="${SOFT}" stroke-width="5" stroke-linecap="round" opacity="0.8"/>` +
    `<circle cx="630" cy="360" r="52" fill="${PANEL}" stroke="${NEON}" stroke-width="5"/>` +
    seg(608, 360, 652, 360, NEON, 6) + seg(630, 338, 630, 382, NEON, 6) +
    harrow(700, 850, 360) + dot(900, 360, 30),

  "condition-branch":
    seg(240, 360, 500, 360, SOFT, 6) +
    `<rect x="512" y="308" width="104" height="104" rx="18" fill="${PANEL}" stroke="${NEON}" stroke-width="5" transform="rotate(45 564 360)"/>` +
    dot(564, 360, 12) +
    `<path d="M628 330 Q760 240 880 240" fill="none" stroke="${NEON}" stroke-width="6" stroke-linecap="round"/>` +
    `<path d="M628 392 Q760 480 880 480" fill="none" stroke="${SOFT}" stroke-width="5" stroke-linecap="round" opacity="0.5"/>` +
    `<circle cx="930" cy="240" r="34" fill="${PANEL}" stroke="${NEON}" stroke-width="5"/>` + check(930, 240) +
    `<circle cx="930" cy="480" r="34" fill="${PANEL}" stroke="rgba(255,107,94,0.7)" stroke-width="4"/>` + cross(930, 480, 1, "rgba(255,107,94,0.85)"),

  "loops-cycle":
    panel(565, 300, 150, 120) + dot(640, 360, 18) +
    `<path d="M500 300 A190 120 0 0 1 780 300" fill="none" stroke="${NEON}" stroke-width="6" stroke-linecap="round"/>` +
    `<path d="M756 288 L784 302 L764 322" fill="none" stroke="${NEON}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M780 430 A190 120 0 0 1 500 430" fill="none" stroke="${SOFT}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>` +
    `<path d="M524 442 L496 428 L516 408" fill="none" stroke="${SOFT}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>` +
    [0, 1, 2].map((i) => dot(880, 300 + i * 60, 12, NEON, 0.45 + i * 0.25)).join(""),

  "functions-block":
    panel(275, 325, 145, 70) + seg(305, 360, 390, 360, SOFT, 5) +
    harrow(430, 500, 360) +
    panel(520, 255, 240, 210) + gear(640, 360, 40) +
    harrow(770, 845, 360) +
    panel(860, 325, 150, 70, 20, NEON, 4) + seg(890, 360, 980, 360, NEON, 5),

  "arrays-collections":
    [0, 1, 2, 3, 4].map((i) =>
      panel(275 + i * 152, 290, 132, 132, 18, i === 2 ? NEON : PSTROKE, i === 2 ? 5 : 3, i === 2 ? "rgba(77,232,74,0.12)" : PANEL) +
      dot(341 + i * 152, 356, 15, NEON, i === 2 ? 1 : 0.45) +
      dot(341 + i * 152, 470, 6, SOFT, 0.3 + i * 0.14),
    ).join(""),

  "objects-state":
    panel(440, 210, 400, 300) +
    [0, 1, 2].map((i) =>
      `<rect x="470" y="${245 + i * 85}" width="340" height="62" rx="14" fill="${i === 1 ? "rgba(77,232,74,0.1)" : "rgba(255,255,255,0.02)"}" stroke="${i === 1 ? NEON : DIM}" stroke-width="${i === 1 ? 3.5 : 2.5}"/>` +
      `<rect x="490" y="${261 + i * 85}" width="84" height="30" rx="12" fill="rgba(77,232,74,0.22)"/>` +
      seg(600, 276 + i * 85, 770, 276 + i * 85, i === 1 ? SOFT : DIM, 5),
    ).join(""),

  "html-structure":
    panel(410, 170, 460, 380, 24) +
    `<rect x="440" y="200" width="400" height="52" rx="12" fill="rgba(77,232,74,0.16)" stroke="${NEON}" stroke-width="3"/>` +
    `<rect x="440" y="268" width="400" height="26" rx="10" fill="rgba(125,233,150,0.1)" stroke="${DIM}" stroke-width="2"/>` +
    panel(440, 310, 252, 160, 14, DIM, 2.5, "rgba(255,255,255,0.02)") +
    seg(462, 345, 660, 345, DIM, 5) + seg(462, 375, 620, 375, DIM, 5) + seg(462, 405, 645, 405, DIM, 5) +
    panel(708, 310, 132, 160, 14, PSTROKE, 3) + dot(774, 370, 18, NEON, 0.8) + seg(736, 425, 812, 425, SOFT, 5) +
    `<rect x="440" y="486" width="400" height="34" rx="12" fill="rgba(125,233,150,0.07)"/>`,

  "css-layout":
    panel(410, 185, 460, 350, 24) +
    [0, 1, 2].map((c) =>
      [0, 1].map((r) => {
        const hot = c === 1 && r === 0;
        return `<rect x="${438 + c * 140}" y="${215 + r * 150}" width="124" height="134" rx="14" fill="${hot ? "rgba(77,232,74,0.14)" : "rgba(255,255,255,0.02)"}" stroke="${hot ? NEON : DIM}" stroke-width="${hot ? 4 : 2.5}"/>`;
      }).join(""),
    ).join("") +
    dot(640, 282, 16),

  "box-model":
    `<rect x="400" y="185" width="480" height="350" rx="26" fill="none" stroke="${DIM}" stroke-width="3" stroke-dasharray="10 12"/>` +
    `<rect x="470" y="235" width="340" height="250" rx="20" fill="${PANEL}" stroke="${PSTROKE}" stroke-width="4"/>` +
    `<rect x="530" y="278" width="220" height="164" rx="16" fill="rgba(77,232,74,0.07)" stroke="${SOFT}" stroke-width="3"/>` +
    `<rect x="586" y="320" width="108" height="80" rx="12" fill="rgba(77,232,74,0.22)" stroke="${NEON}" stroke-width="4"/>` +
    seg(400, 360, 470, 360, SOFT, 3, 0.5) + seg(810, 360, 880, 360, SOFT, 3, 0.5) +
    seg(640, 185, 640, 235, SOFT, 3, 0.5) + seg(640, 485, 640, 535, SOFT, 3, 0.5),

  "dom-events":
    `<path d="M330 300 L330 372 L352 352 L368 388 L388 378 L372 344 L400 340 Z" fill="${LIGHT}" opacity="0.9"/>` +
    `<circle cx="340" cy="310" r="36" fill="none" stroke="${SOFT}" stroke-width="3" opacity="0.5"/>` +
    `<circle cx="340" cy="310" r="58" fill="none" stroke="${SOFT}" stroke-width="2.5" opacity="0.25"/>` +
    harrow(430, 520, 360) +
    `<rect x="540" y="325" width="180" height="70" rx="35" fill="rgba(77,232,74,0.18)" stroke="${NEON}" stroke-width="4"/>` +
    seg(585, 360, 675, 360, NEON, 6) +
    harrow(750, 830, 360) +
    panel(850, 290, 170, 140) + `<rect x="880" y="325" width="110" height="26" rx="10" fill="rgba(77,232,74,0.3)"/>` + seg(880, 385, 960, 385, SOFT, 5),

  "api-request":
    panel(255, 285, 175, 150) + seg(285, 325, 400, 325, SOFT, 5) + seg(285, 360, 375, 360, DIM, 5) + seg(285, 395, 390, 395, DIM, 5) +
    harrow(450, 545, 310, NEON, 5) +
    hexagon(660, 360, 85) + dot(660, 360, 16) +
    harrow(545, 450, 415, SOFT, 4, 0.6, "4 12") +
    harrow(775, 860, 360) +
    `<ellipse cx="945" cy="300" rx="65" ry="20" fill="${PANEL}" stroke="${PSTROKE}" stroke-width="3.5"/>` +
    `<path d="M880 300 V420 C880 432 909 442 945 442 C981 442 1010 432 1010 420 V300" fill="${PANEL}" stroke="${PSTROKE}" stroke-width="3.5"/>` +
    seg(905, 350, 985, 350, DIM, 4) + seg(905, 385, 985, 385, DIM, 4),

  "sql-data-flow":
    panel(255, 235, 280, 250, 20) +
    [0, 1, 2, 3].map((r) => seg(280, 285 + r * 50, 510, 285 + r * 50, r === 0 ? SOFT : DIM, r === 0 ? 5 : 3)).join("") +
    seg(350, 260, 350, 460, DIM, 3) + seg(440, 260, 440, 460, DIM, 3) +
    `<path d="M580 265 L790 265 L715 380 L715 460 L655 430 L655 380 Z" fill="rgba(77,232,74,0.08)" stroke="${NEON}" stroke-width="4" stroke-linejoin="round"/>` +
    panel(830, 290, 200, 150, 18) +
    `<rect x="852" y="318" width="156" height="30" rx="9" fill="rgba(77,232,74,0.24)"/>` +
    `<rect x="852" y="362" width="156" height="30" rx="9" fill="rgba(77,232,74,0.24)"/>` +
    seg(852, 425, 960, 425, DIM, 4),

  "git-versioning":
    seg(260, 430, 1020, 430, NEON, 6) +
    [300, 470, 810, 970].map((x) => `<circle cx="${x}" cy="430" r="16" fill="${PANEL}" stroke="${NEON}" stroke-width="5"/>`).join("") +
    `<path d="M470 430 Q520 290 610 290 L710 290 Q790 290 810 430" fill="none" stroke="${SOFT}" stroke-width="5" stroke-linecap="round" opacity="0.85"/>` +
    `<circle cx="610" cy="290" r="14" fill="${PANEL}" stroke="${SOFT}" stroke-width="4.5"/>` +
    `<circle cx="710" cy="290" r="14" fill="${PANEL}" stroke="${SOFT}" stroke-width="4.5"/>` +
    dot(970, 430, 8),

  "algorithms-strategy":
    [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${350 + i * 100}" y="${520 - 60 - i * 50}" width="68" height="${60 + i * 50}" rx="12" fill="url(#neonv)" opacity="${0.4 + i * 0.11}"/>`).join("") +
    `<path d="M584 380 Q634 320 684 355" fill="none" stroke="${LIGHT}" stroke-width="4" stroke-linecap="round" opacity="0.75" stroke-dasharray="2 10"/>` +
    `<circle cx="584" cy="388" r="9" fill="${LIGHT}" opacity="0.85"/><circle cx="684" cy="362" r="9" fill="${LIGHT}" opacity="0.85"/>`,

  "mobile-layers":
    panel(420, 225, 200, 330, 30, DIM, 2.5, "rgba(255,255,255,0.02)") +
    panel(480, 195, 210, 340, 32, PSTROKE, 3, "rgba(16,27,20,0.7)") +
    panel(550, 165, 220, 380, 34, NEON, 4) +
    `<rect x="612" y="188" width="96" height="10" rx="5" fill="${DIM}"/>` +
    `<rect x="580" y="222" width="160" height="90" rx="14" fill="rgba(77,232,74,0.14)" stroke="${SOFT}" stroke-width="3"/>` +
    seg(580, 350, 740, 350, DIM, 5) + seg(580, 385, 700, 385, DIM, 5) +
    `<rect x="580" y="440" width="106" height="46" rx="23" fill="rgba(77,232,74,0.28)" stroke="${NEON}" stroke-width="3.5"/>` +
    dot(724, 463, 14, NEON, 0.7),

  "games-loop":
    `<circle cx="640" cy="235" r="56" fill="${PANEL}" stroke="${NEON}" stroke-width="5"/>` + dot(640, 235, 14) +
    `<circle cx="435" cy="480" r="56" fill="${PANEL}" stroke="${PSTROKE}" stroke-width="4"/>` +
    `<path d="M415 458 L415 502 L452 480 Z" fill="${SOFT}" opacity="0.9"/>` +
    `<circle cx="845" cy="480" r="56" fill="${PANEL}" stroke="${PSTROKE}" stroke-width="4"/>` +
    `<rect x="815" y="455" width="26" height="50" rx="6" fill="${SOFT}" opacity="0.55"/><rect x="849" y="470" width="26" height="35" rx="6" fill="${SOFT}" opacity="0.9"/>` +
    `<path d="M575 265 Q460 330 442 415" fill="none" stroke="${SOFT}" stroke-width="5" stroke-linecap="round" opacity="0.8"/>` +
    `<path d="M436 402 L442 424 L460 410" fill="none" stroke="${SOFT}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>` +
    `<path d="M497 495 Q640 550 783 495" fill="none" stroke="${SOFT}" stroke-width="5" stroke-linecap="round" opacity="0.8"/>` +
    `<path d="M765 490 L787 494 L775 512" fill="none" stroke="${SOFT}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>` +
    `<path d="M838 415 Q820 330 705 265" fill="none" stroke="${SOFT}" stroke-width="5" stroke-linecap="round" opacity="0.8"/>` +
    `<path d="M723 258 L701 262 L713 280" fill="none" stroke="${SOFT}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>`,

  "ai-prompt":
    panel(280, 265, 270, 190) +
    seg(310, 310, 520, 310, SOFT, 5) + seg(310, 350, 480, 350, DIM, 5) + seg(310, 390, 500, 390, DIM, 5) +
    harrow(575, 640, 360) +
    `<path d="M700 300 L714 346 L760 360 L714 374 L700 420 L686 374 L640 360 L686 346 Z" fill="url(#neonv)" filter="url(#glow)"/>` +
    harrow(775, 830, 360) +
    panel(850, 245, 180, 230) +
    [0, 1, 2].map((i) => dot(880, 295 + i * 65, 10, NEON, 0.9) + seg(905, 295 + i * 65, 1000, 295 + i * 65, i === 2 ? DIM : SOFT, 5)).join(""),

  "data-pipeline":
    [
      [300, 270], [345, 340], [290, 410], [370, 450], [330, 500], [410, 300], [430, 390],
    ].map(([x, y], i) => dot(x, y, 8 + (i % 3) * 3, SOFT, 0.35 + (i % 4) * 0.12)).join("") +
    `<path d="M500 260 L710 260 L650 380 L650 460 L560 420 L560 380 Z" fill="rgba(77,232,74,0.08)" stroke="${NEON}" stroke-width="4" stroke-linejoin="round"/>` +
    panel(760, 250, 270, 220, 20) +
    `<path d="M790 430 L860 380 L905 400 L1000 300" fill="none" stroke="${NEON}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>` +
    dot(1000, 300, 11) + seg(790, 440, 1000, 440, DIM, 3),

  "automation-workflow":
    dot(330, 360, 22) +
    `<circle cx="330" cy="360" r="44" fill="none" stroke="${SOFT}" stroke-width="3" opacity="0.5"/>` +
    `<circle cx="330" cy="360" r="68" fill="none" stroke="${SOFT}" stroke-width="2.5" opacity="0.22"/>` +
    harrow(420, 500, 360) +
    gear(610, 380, 52) + gear(724, 300, 34, SOFT, 4) +
    harrow(800, 860, 360) +
    panel(875, 305, 165, 110, 18, NEON, 4) + check(957, 360, 1.2, NEON),
};

// ---------- render ----------
function svgFor(slug: string): string {
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="base" cx="50%" cy="34%" r="95%">
      <stop offset="0%" stop-color="#0E1A13"/><stop offset="48%" stop-color="#0A0E0C"/><stop offset="100%" stop-color="#050806"/>
    </radialGradient>
    <linearGradient id="neonv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9CFFC0"/><stop offset="45%" stop-color="#4DE84A"/><stop offset="100%" stop-color="#176A2A"/>
    </linearGradient>
    <radialGradient id="summit" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7CF59A" stop-opacity="0.22"/><stop offset="55%" stop-color="#2FAF3C" stop-opacity="0.07"/><stop offset="100%" stop-color="#1C8F2A" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <radialGradient id="vig" cx="50%" cy="46%" r="80%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.6"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#base)"/>
  ${backdropLattice(W / 2, 180)}
  <ellipse cx="${W / 2}" cy="330" rx="480" ry="300" fill="url(#summit)"/>
  ${MOTIFS[slug]}
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.05" style="mix-blend-mode:overlay"/>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;
}

const slugs = Object.keys(MOTIFS);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
for (const slug of slugs) {
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#050806}svg{display:block}</style>${svgFor(slug)}`);
  const webp: string = await page.evaluate(() => {
    const svg = document.querySelector("svg")!;
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    return new Promise<string>((resolve, reject) => {
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = 1280; c.height = 720;
        c.getContext("2d")!.drawImage(img, 0, 0);
        resolve(c.toDataURL("image/webp", 0.85));
      };
      img.onerror = reject;
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
    });
  });
  const buf = Buffer.from(webp.split(",")[1], "base64");
  writeFileSync(join(outDir, `${slug}.webp`), buf);
  console.log(`✓ ${slug}.webp ${(buf.length / 1024).toFixed(0)}KB`);
}
await browser.close();
console.log(`Concluído: ${slugs.length} infográficos.`);
