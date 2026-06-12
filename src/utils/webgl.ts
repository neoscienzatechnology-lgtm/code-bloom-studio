// Capacidades do dispositivo para recursos 3D opcionais. O 3D é sempre
// enriquecimento: se não houver WebGL, o app cai no diagrama 2D sem ruído.

/** WebGL disponível? Em SSR/jsdom/aparelho sem GPU retorna false sem lançar. */
export function isWebglAvailable(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
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
