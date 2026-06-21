import { lazy, Suspense, useState } from "react";
import { isWebglAvailable, prefersReducedMotion } from "@/utils/webgl";

const HeroCanvasLazy = lazy(() => import("@/components/HeroCanvas"));

interface LiveBackdropProps {
  /** Classe de opacidade do poster estático quando o 3D NÃO está ativo. */
  posterClass?: string;
  /** Opacidade da malha 3D (passada ao HeroCanvas). */
  meshOpacity?: number;
}

/**
 * Fundo "vivo" reutilizável: o poster estático (instantâneo) + a malha 3D neon
 * (three.js) por cima, lazy e só com WebGL + sem prefers-reduced-motion. Cobre
 * inset-0 atrás do conteúdo (-z-10) — coloque dentro de um ancestral posicionado.
 */
const LiveBackdrop = ({ posterClass = "opacity-50", meshOpacity }: LiveBackdropProps) => {
  const [enable3d] = useState(() => isWebglAvailable() && !prefersReducedMotion());
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <img
        src="/hero-codetier.png"
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover ${posterClass}`}
      />
      {enable3d && (
        <Suspense fallback={null}>
          <HeroCanvasLazy meshOpacity={meshOpacity} />
        </Suspense>
      )}
    </div>
  );
};

export default LiveBackdrop;
