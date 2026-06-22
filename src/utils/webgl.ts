// Capacidades do dispositivo para recursos 3D opcionais. O 3D é sempre
// enriquecimento: se não houver WebGL, o app cai no diagrama 2D sem ruído.

let webglCache: boolean | null = null;

/** WebGL disponível? Em SSR/jsdom/aparelho sem GPU retorna false sem lançar.
 * Libera o contexto de teste (navegadores limitam ~16 simultâneos) e cacheia
 * o resultado — várias telas chamam isto a cada montagem. */
export function isWebglAvailable(): boolean {
  if (webglCache !== null) return webglCache;
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    webglCache = Boolean(window.WebGLRenderingContext && gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return webglCache;
  } catch {
    webglCache = false;
    return false;
  }
}

/** Usuário pediu menos animação? Então não auto-giramos a cena. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
