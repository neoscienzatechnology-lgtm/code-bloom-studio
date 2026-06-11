import type { ReactNode } from "react";
import type { LessonCardKind } from "@/utils/lessonCards";

export type IllustrationKind = LessonCardKind | "checkpoint" | "trophy";

// Vinhetas SVG flat (estilo Duolingo) para os cartões de texto do player.
// Puramente decorativas: desenhadas em código (sem assets externos), com a
// paleta do app, e marcadas como aria-hidden.

const PALETTE = {
  teal: "#0A7C78",
  tealDark: "#0F3D3A",
  mint: "#7AD7A7",
  orange: "#FF9F2F",
  orangeDark: "#C9742C",
  yellow: "#F6C445",
  yellowDark: "#C99A1F",
  blue: "#4FA3D9",
  blueSoft: "#9CC3E4",
  green: "#2E9C77",
  red: "#E2554A",
  ink: "#7A4A12",
};

const SCENES: Partial<Record<IllustrationKind, ReactNode>> = {
  // Livro aberto + lâmpada: a ideia sendo estudada
  theory: (
    <>
      <rect width="520" height="150" rx="16" fill="#E7F4F0" />
      <circle cx="42" cy="118" r="26" fill={PALETTE.mint} opacity="0.35" />
      <circle cx="478" cy="32" r="18" fill={PALETTE.teal} opacity="0.18" />
      <path
        d="M150 55 Q190 40 230 55 L230 112 Q190 99 150 112 Z"
        fill="#ffffff"
        stroke={PALETTE.teal}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M310 55 Q270 40 230 55 L230 112 Q270 99 310 112 Z"
        fill="#ffffff"
        stroke={PALETTE.teal}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <line x1="230" y1="55" x2="230" y2="112" stroke={PALETTE.teal} strokeWidth="3" />
      <g stroke={PALETTE.mint} strokeWidth="5" strokeLinecap="round">
        <line x1="160" y1="70" x2="216" y2="66" />
        <line x1="160" y1="84" x2="216" y2="80" />
        <line x1="160" y1="98" x2="200" y2="95" />
        <line x1="244" y1="66" x2="300" y2="70" />
        <line x1="244" y1="80" x2="300" y2="84" />
        <line x1="260" y1="95" x2="300" y2="98" />
      </g>
      <g>
        <circle cx="352" cy="46" r="15" fill={PALETTE.yellow} stroke={PALETTE.yellowDark} strokeWidth="3" />
        <rect x="346" y="60" width="12" height="8" rx="3" fill={PALETTE.yellowDark} />
        <g stroke={PALETTE.yellowDark} strokeWidth="3" strokeLinecap="round">
          <line x1="352" y1="22" x2="352" y2="14" />
          <line x1="372" y1="30" x2="378" y2="24" />
          <line x1="332" y1="30" x2="326" y2="24" />
        </g>
      </g>
    </>
  ),

  // Código "igual a" objeto do dia a dia: a ponte da analogia
  analogy: (
    <>
      <rect width="520" height="150" rx="16" fill="#FBF3DC" />
      <circle cx="46" cy="36" r="20" fill={PALETTE.yellow} opacity="0.4" />
      <circle cx="476" cy="118" r="24" fill={PALETTE.orange} opacity="0.25" />
      <rect x="118" y="40" width="112" height="72" rx="14" fill="#ffffff" stroke={PALETTE.teal} strokeWidth="3.5" />
      <g stroke={PALETTE.teal} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M152 62 L138 76 L152 90" />
        <path d="M196 62 L210 76 L196 90" />
      </g>
      <line x1="180" y1="60" x2="168" y2="92" stroke={PALETTE.orange} strokeWidth="5" strokeLinecap="round" />
      <g fill={PALETTE.tealDark} opacity="0.75">
        <rect x="252" y="64" width="36" height="8" rx="4" />
        <rect x="252" y="80" width="36" height="8" rx="4" />
      </g>
      <rect x="310" y="40" width="112" height="72" rx="14" fill="#ffffff" stroke={PALETTE.orange} strokeWidth="3.5" />
      <path
        d="M366 54 L338 78 L348 78 L348 98 L384 98 L384 78 L394 78 Z"
        fill="#FFD9A8"
        stroke={PALETTE.orangeDark}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="360" y="84" width="12" height="14" rx="2" fill={PALETTE.orangeDark} />
    </>
  ),

  // Placa de atenção ao lado de uma linha de código com erro
  mistake: (
    <>
      <rect width="520" height="150" rx="16" fill="#FDEDE0" />
      <circle cx="478" cy="34" r="20" fill={PALETTE.orange} opacity="0.3" />
      <circle cx="44" cy="116" r="24" fill={PALETTE.yellow} opacity="0.3" />
      <path
        d="M168 102 L200 46 L232 102 Z"
        fill={PALETTE.yellow}
        stroke={PALETTE.orangeDark}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect x="196" y="62" width="8" height="20" rx="4" fill={PALETTE.ink} />
      <circle cx="200" cy="92" r="5" fill={PALETTE.ink} />
      <rect x="268" y="56" width="142" height="40" rx="11" fill="#ffffff" stroke={PALETTE.orangeDark} strokeWidth="3" />
      <line x1="282" y1="76" x2="354" y2="76" stroke={PALETTE.orange} strokeWidth="6" strokeLinecap="round" />
      <circle cx="410" cy="56" r="16" fill={PALETTE.red} stroke="#ffffff" strokeWidth="3.5" />
      <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round">
        <line x1="404" y1="50" x2="416" y2="62" />
        <line x1="416" y1="50" x2="404" y2="62" />
      </g>
    </>
  ),

  // Alternativas de quiz com a certa marcada
  quiz: (
    <>
      <rect width="520" height="150" rx="16" fill="#E8F1FA" />
      <circle cx="466" cy="120" r="24" fill={PALETTE.blue} opacity="0.25" />
      <circle cx="52" cy="34" r="18" fill={PALETTE.blue} opacity="0.3" />
      <rect x="166" y="32" width="188" height="26" rx="13" fill="#ffffff" stroke={PALETTE.blue} strokeWidth="2.5" />
      <line x1="180" y1="45" x2="280" y2="45" stroke={PALETTE.blueSoft} strokeWidth="5" strokeLinecap="round" />
      <rect x="166" y="66" width="188" height="26" rx="13" fill="#DFF3E8" stroke={PALETTE.green} strokeWidth="3" />
      <line x1="180" y1="79" x2="300" y2="79" stroke={PALETTE.green} strokeWidth="5" strokeLinecap="round" opacity="0.5" />
      <rect x="166" y="100" width="188" height="26" rx="13" fill="#ffffff" stroke={PALETTE.blue} strokeWidth="2.5" />
      <line x1="180" y1="113" x2="262" y2="113" stroke={PALETTE.blueSoft} strokeWidth="5" strokeLinecap="round" />
      <circle cx="376" cy="79" r="15" fill={PALETTE.green} />
      <path
        d="M369 79 L374 85 L384 71"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),

  // Marco no caminho: escudo de revisão antes do próximo bloco
  checkpoint: (
    <>
      <rect width="520" height="150" rx="16" fill="#E7F4F0" />
      <circle cx="46" cy="34" r="18" fill={PALETTE.mint} opacity="0.35" />
      <circle cx="476" cy="118" r="22" fill={PALETTE.teal} opacity="0.15" />
      <path d="M110 112 Q200 96 260 96 Q330 96 410 78" fill="none" stroke={PALETTE.teal} strokeWidth="5" strokeLinecap="round" strokeDasharray="2 14" />
      <circle cx="150" cy="106" r="9" fill={PALETTE.mint} stroke={PALETTE.teal} strokeWidth="3" />
      <circle cx="222" cy="98" r="9" fill={PALETTE.mint} stroke={PALETTE.teal} strokeWidth="3" />
      <path d="M260 34 L296 46 V76 Q296 102 260 116 Q224 102 224 76 V46 Z" fill="#ffffff" stroke={PALETTE.teal} strokeWidth="4" strokeLinejoin="round" />
      <path d="M244 74 L256 86 L278 58" fill="none" stroke={PALETTE.green} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="396" y1="78" x2="396" y2="36" stroke={PALETTE.orangeDark} strokeWidth="5" strokeLinecap="round" />
      <path d="M396 36 L430 45 L396 56 Z" fill={PALETTE.orange} />
    </>
  ),

  // Troféu do projeto concluído
  trophy: (
    <>
      <rect width="520" height="150" rx="16" fill="#FBF3DC" />
      <circle cx="48" cy="110" r="22" fill={PALETTE.yellow} opacity="0.35" />
      <circle cx="474" cy="38" r="18" fill={PALETTE.orange} opacity="0.25" />
      <path d="M226 36 H294 V64 Q294 92 260 100 Q226 92 226 64 Z" fill={PALETTE.yellow} stroke={PALETTE.yellowDark} strokeWidth="4" strokeLinejoin="round" />
      <path d="M226 44 H204 Q200 70 226 76 M294 44 H316 Q320 70 294 76" fill="none" stroke={PALETTE.yellowDark} strokeWidth="4" strokeLinecap="round" />
      <rect x="248" y="100" width="24" height="12" rx="3" fill={PALETTE.yellowDark} />
      <rect x="236" y="112" width="48" height="10" rx="4" fill={PALETTE.ink} opacity="0.8" />
      <path d="M260 52 L264 62 L275 62 L266 69 L269 80 L260 73 L251 80 L254 69 L245 62 L256 62 Z" fill="#ffffff" opacity="0.9" />
      <circle cx="180" cy="48" r="5" fill={PALETTE.teal} />
      <circle cx="344" cy="56" r="5" fill={PALETTE.red} />
      <circle cx="200" cy="92" r="4" fill={PALETTE.blue} />
      <circle cx="330" cy="96" r="4" fill={PALETTE.green} />
    </>
  ),
};

const CardIllustration = ({ kind }: { kind: IllustrationKind }) => {
  const scene = SCENES[kind];
  if (!scene) return null;

  return (
    <div aria-hidden="true" className="mb-4 overflow-hidden rounded-xl">
      <svg viewBox="0 0 520 150" role="presentation" className="h-auto w-full">
        {scene}
      </svg>
    </div>
  );
};

export default CardIllustration;
