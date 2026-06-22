// Vídeos de teoria (gerados com Remotion, ver docs/videos-teoria.md).
//
// DORMENTE por padrão: o card "Teoria em vídeo" só aparece quando
// VITE_THEORY_VIDEO_BASE aponta para a URL pública onde os MP4 estão
// hospedados (ex.: bucket público do Supabase Storage). Sem essa variável,
// nenhum vídeo é carregado e a experiência atual (cards) fica intacta.
//
// Layout esperado dos arquivos no bucket: <base>/<courseId>/<lessonId>.mp4
//
// CSP: o vercel.json precisa de `media-src` com o host dos vídeos (hoje só
// https://*.supabase.co). Se migrar de CDN (R2/Bunny), atualize o media-src lá,
// senão o navegador bloqueia os vídeos (falha silenciosa = "em breve"). #checkup-12
import { THEORY_VIDEO_KEYS } from "@/data/theoryVideoIndex";

const RAW = import.meta.env.VITE_THEORY_VIDEO_BASE?.trim();
const KEYS = new Set(THEORY_VIDEO_KEYS);

export const THEORY_VIDEO = {
  /** Liga o recurso. Default OFF até os vídeos estarem hospedados. */
  enabled: Boolean(RAW),
  /** Base pública dos vídeos, sem barra final. */
  baseUrl: (RAW ?? "").replace(/\/+$/, ""),
};

/** Esta lição tem vídeo de teoria gerado? (índice gerado na extração) */
export function hasTheoryVideo(courseId: string, lessonId: string): boolean {
  return KEYS.has(`${courseId}__${lessonId}`);
}

/** URL pública do MP4 da lição, ou null se o recurso está desligado. */
export function theoryVideoUrl(courseId: string, lessonId: string): string | null {
  if (!THEORY_VIDEO.baseUrl) return null;
  return `${THEORY_VIDEO.baseUrl}/${courseId}/${lessonId}.mp4`;
}
