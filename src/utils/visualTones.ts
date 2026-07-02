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
};

const BG = "#0B120E";
const PANEL = "#131D16";
const SOFT = "#1B2C21";
const TEXT = "#D9E7DD";
const NEUTRAL = "#8FA79A";

const greenTone = (primary: string, accent: string): VisualTone => ({
  bg: BG,
  primary,
  secondary: NEUTRAL,
  accent,
  text: TEXT,
  soft: SOFT,
  panel: PANEL,
});

const languageTones: Record<string, VisualTone> = {
  python: greenTone("#3DD957", "#44D62C"),
  javascript: greenTone("#8BC926", "#A6E22E"),
  react: greenTone("#26C285", "#2ED38B"),
  "react native": greenTone("#2EC2A0", "#46D6B0"),
  css: greenTone("#1FB598", "#1FC9A6"),
  "node.js": greenTone("#31C24B", "#3DD957"),
  sql: greenTone("#25B491", "#29C7A0"),
  "dados e ia": greenTone("#4BCB3E", "#5BD94A"),
  git: greenTone("#7CBF22", "#8BD42C"),
  "lógica": greenTone("#37C24A", "#44D62C"),
  jogos: greenTone("#A3D239", "#B6E63E"),
  html: greenTone("#2AC258", "#2ED36A"),
};

export const baseVisualTone: VisualTone = greenTone("#37C24A", "#44D62C");

export function getVisualTone(language?: string): VisualTone {
  return languageTones[(language || "").toLowerCase()] ?? baseVisualTone;
}
