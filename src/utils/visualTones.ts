// Paleta visual por linguagem de curso, compartilhada entre o infográfico
// (LessonVisualAid), os diagramas de conceito e o visualizador 3D. Alinhada à
// marca CodeTier (dark premium): base near-black, painéis charcoal-esverdeados
// e UMA voz neon por linguagem — o tom de verde varia, o resto é consistente.

export type VisualTone = {
  /** Fundo da cena (near-black esverdeado). */
  bg: string;
  /** Cor estrutural principal (traços/preenchimentos fortes). */
  primary: string;
  /** Cor de apoio neutra (funciona como traço em fundo escuro e bloco 3D). */
  secondary: string;
  /** Acento neon da linguagem. */
  accent: string;
  /** Texto/traços de leitura sobre o fundo escuro. */
  text: string;
  /** Preenchimento suave (áreas destacadas discretas). */
  soft: string;
  /** Painel/cartão escuro (substitui os antigos cartões brancos). */
  panel: string;
  /** Verde ESCURO da linguagem — contraponto ao neon (primary/accent são
   * ambos claros; use `deep` quando dois elementos precisam se distinguir,
   * ex.: bloco comum vs topo da pilha 3D). */
  deep: string;
};

const BG = "#0B120E";
const PANEL = "#131D16";
const SOFT = "#1B2C21";
const TEXT = "#D9E7DD";
const NEUTRAL = "#8FA79A";

const greenTone = (primary: string, accent: string, deep: string): VisualTone => ({
  bg: BG,
  primary,
  secondary: NEUTRAL,
  accent,
  text: TEXT,
  soft: SOFT,
  panel: PANEL,
  deep,
});

const languageTones: Record<string, VisualTone> = {
  python: greenTone("#3DD957", "#44D62C", "#1F8A3A"),
  javascript: greenTone("#8BC926", "#A6E22E", "#5E8F12"),
  react: greenTone("#26C285", "#2ED38B", "#0E8A6B"),
  "react native": greenTone("#2EC2A0", "#46D6B0", "#0E8A7A"),
  css: greenTone("#1FB598", "#1FC9A6", "#0F8A7A"),
  "node.js": greenTone("#31C24B", "#3DD957", "#1F8A3A"),
  sql: greenTone("#25B491", "#29C7A0", "#0F7A6A"),
  "dados e ia": greenTone("#4BCB3E", "#5BD94A", "#2A8A2A"),
  git: greenTone("#7CBF22", "#8BD42C", "#5E8F12"),
  "lógica": greenTone("#37C24A", "#44D62C", "#1F7A33"),
  jogos: greenTone("#A3D239", "#B6E63E", "#5E8F12"),
  html: greenTone("#2AC258", "#2ED36A", "#1F8A3A"),
};

export const baseVisualTone: VisualTone = greenTone("#37C24A", "#44D62C", "#1F7A33");

export function getVisualTone(language?: string): VisualTone {
  return languageTones[(language || "").toLowerCase()] ?? baseVisualTone;
}
