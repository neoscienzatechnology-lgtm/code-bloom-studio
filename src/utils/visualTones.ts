// Paleta visual por linguagem de curso, compartilhada entre o infográfico
// (LessonVisualAid) e os diagramas de conceito dos cartões. Uma lição de
// Python tem cara de Python; uma de CSS, cara de CSS.

export type VisualTone = {
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  soft: string;
};

const languageTones: Record<string, VisualTone> = {
  python: {
    bg: "#f7fee7",
    primary: "#2563eb",
    secondary: "#facc15",
    accent: "#16a34a",
    text: "#172554",
    soft: "#dbeafe",
  },
  javascript: {
    bg: "#fef9c3",
    primary: "#ca8a04",
    secondary: "#111827",
    accent: "#0891b2",
    text: "#1f2937",
    soft: "#fef3c7",
  },
  react: {
    bg: "#ecfeff",
    primary: "#0891b2",
    secondary: "#7c3aed",
    accent: "#0f766e",
    text: "#164e63",
    soft: "#cffafe",
  },
  "react native": {
    bg: "#ecfeff",
    primary: "#0e7490",
    secondary: "#6d28d9",
    accent: "#0d9488",
    text: "#155e75",
    soft: "#cffafe",
  },
  css: {
    bg: "#eff6ff",
    primary: "#2563eb",
    secondary: "#ec4899",
    accent: "#f97316",
    text: "#1e3a8a",
    soft: "#dbeafe",
  },
  "node.js": {
    bg: "#f0fdf4",
    primary: "#15803d",
    secondary: "#365314",
    accent: "#0f766e",
    text: "#14532d",
    soft: "#dcfce7",
  },
  sql: {
    bg: "#eef2ff",
    primary: "#4f46e5",
    secondary: "#0f172a",
    accent: "#0284c7",
    text: "#312e81",
    soft: "#e0e7ff",
  },
  "dados e ia": {
    bg: "#eef2ff",
    primary: "#4338ca",
    secondary: "#0e7490",
    accent: "#7c3aed",
    text: "#312e81",
    soft: "#e0e7ff",
  },
  git: {
    bg: "#fff7ed",
    primary: "#ea580c",
    secondary: "#7c2d12",
    accent: "#dc2626",
    text: "#7c2d12",
    soft: "#fed7aa",
  },
  "lógica": {
    bg: "#f8fafc",
    primary: "#475569",
    secondary: "#7c3aed",
    accent: "#059669",
    text: "#0f172a",
    soft: "#e2e8f0",
  },
  jogos: {
    bg: "#fff7ed",
    primary: "#ea580c",
    secondary: "#7c3aed",
    accent: "#16a34a",
    text: "#7c2d12",
    soft: "#ffedd5",
  },
  html: {
    bg: "#fff1f2",
    primary: "#e11d48",
    secondary: "#fb923c",
    accent: "#2563eb",
    text: "#881337",
    soft: "#ffe4e6",
  },
};

export const baseVisualTone: VisualTone = {
  bg: "#f8fafc",
  primary: "#7c3aed",
  secondary: "#0f766e",
  accent: "#f59e0b",
  text: "#1f2937",
  soft: "#ede9fe",
};

export function getVisualTone(language?: string): VisualTone {
  return languageTones[(language || "").toLowerCase()] ?? baseVisualTone;
}
