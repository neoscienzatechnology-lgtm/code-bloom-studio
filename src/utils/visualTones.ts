// Paleta visual por linguagem de curso, compartilhada entre o infográfico
// (LessonVisualAid), os diagramas de conceito e o visualizador 3D. Alinhada à
// marca (estilo CODERS): tudo em verde + charcoal sobre papel claro; cada
// linguagem varia só o tom de verde, o resto é consistente.

export type VisualTone = {
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  soft: string;
};

const INK = "#1B2A22";
const PAPER = "#F1F7F3";
const SOFT = "#D7EFDD";
const CHARCOAL = "#243029";

const greenTone = (primary: string, accent: string): VisualTone => ({
  bg: PAPER,
  primary,
  secondary: CHARCOAL,
  accent,
  text: INK,
  soft: SOFT,
});

const languageTones: Record<string, VisualTone> = {
  python: greenTone("#1F8A3A", "#44D62C"),
  javascript: greenTone("#5E8F12", "#A6E22E"),
  react: greenTone("#0E8A6B", "#2ED38B"),
  "react native": greenTone("#0E8A7A", "#46D6B0"),
  css: greenTone("#0F8A7A", "#1FC9A6"),
  "node.js": greenTone("#1F8A3A", "#3DD957"),
  sql: greenTone("#0F7A6A", "#29C7A0"),
  "dados e ia": greenTone("#2A8A2A", "#5BD94A"),
  git: greenTone("#5E8F12", "#8BD42C"),
  "lógica": greenTone("#1F7A33", "#44D62C"),
  jogos: greenTone("#5E8F12", "#B6E63E"),
  html: greenTone("#1F8A3A", "#2ED36A"),
};

export const baseVisualTone: VisualTone = greenTone("#1F8A3A", "#44D62C");

export function getVisualTone(language?: string): VisualTone {
  return languageTones[(language || "").toLowerCase()] ?? baseVisualTone;
}
