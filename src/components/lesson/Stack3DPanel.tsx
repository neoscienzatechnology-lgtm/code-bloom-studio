import { Suspense, lazy, useMemo, useState } from "react";
import { Box, Loader2 } from "lucide-react";
import type { VisualTone } from "@/utils/visualTones";
import { isWebglAvailable } from "@/utils/webgl";

// Entrada opt-in para a pilha 3D. O 2D já está na tela (ConceptDiagram); aqui
// só oferecemos um upgrade. O Three.js (chunk "three") só é baixado quando o
// aluno clica — custo zero de bundle para quem não usa.

const Stack3D = lazy(() => import("@/components/lesson/Stack3D"));

const Stack3DPanel = ({ tone }: { tone: VisualTone }) => {
  const [show, setShow] = useState(false);
  const canUse = useMemo(() => isWebglAvailable(), []);

  if (!canUse) return null; // sem WebGL: fica só o diagrama 2D, sem ruído

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-black text-primary transition-colors hover:bg-primary/10"
      >
        <Box size={13} /> Ver a pilha em 3D
      </button>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="mt-3 flex h-[120px] items-center justify-center rounded-xl border border-border bg-card text-sm text-muted-foreground">
          <Loader2 size={16} className="mr-2 animate-spin" /> Carregando 3D…
        </div>
      }
    >
      <Stack3D tone={tone} />
      <button
        type="button"
        onClick={() => setShow(false)}
        className="mt-2 text-xs font-bold text-muted-foreground underline-offset-2 hover:underline"
      >
        Voltar ao diagrama 2D
      </button>
    </Suspense>
  );
};

export default Stack3DPanel;
