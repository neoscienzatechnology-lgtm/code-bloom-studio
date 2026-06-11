import { useMemo } from "react";
import { Code2, Eye, Lightbulb, MousePointer2 } from "lucide-react";
import MascoteCapivara, { type MascoteCapivaraState } from "@/components/MascoteCapivara";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AssistantMode = "lesson" | "project" | "checkpoint";

interface CapyLessonAssistantProps {
  title: string;
  mode?: AssistantMode;
  state?: MascoteCapivaraState;
  stageLabel?: string;
  objective?: string;
  hints?: string[];
  revealedHintCount?: number;
  lastFeedback?: string | null;
  className?: string;
  onRevealHint?: () => void;
  onUseGuidedStarter?: () => void;
  onRevealSolution?: () => void;
  canRevealSolution?: boolean;
}

const modeLabel: Record<AssistantMode, string> = {
  lesson: "Auxílio da Capy",
  project: "Capy no projeto",
  checkpoint: "Capy na revisão",
};

function firstUsefulLine(text?: string | null) {
  return text
    ?.split("\n")
    .map((line) => line.trim())
    .find(Boolean);
}

/**
 * Compact Capy helper: mascot with a contextual line, the current hint, and
 * up to three actions. Intentionally light — it sits beside the editor and
 * matches the calm of the lesson cards.
 */
const CapyLessonAssistant = ({
  title,
  mode = "lesson",
  state = "thinking",
  stageLabel,
  objective,
  hints = [],
  revealedHintCount = 0,
  lastFeedback,
  className,
  onRevealHint,
  onUseGuidedStarter,
  onRevealSolution,
  canRevealSolution = false,
}: CapyLessonAssistantProps) => {
  const visibleHints = hints.slice(0, Math.max(0, revealedHintCount));
  const nextHint = hints[visibleHints.length];
  const hasMoreHints = Boolean(nextHint && onRevealHint);
  const feedbackLine = firstUsefulLine(lastFeedback);
  const currentHint = visibleHints[visibleHints.length - 1] ?? nextHint;

  const capyMessage = useMemo(() => {
    if (state === "success") return "Boa. Agora confira por que funcionou antes de avançar.";
    if (state === "error") return nextHint ?? "Quase. Compare o resultado com a saída esperada e ajuste uma coisa por vez.";
    if (state === "loading") return "Estou acompanhando seu teste. Compare o resultado com calma.";
    if (mode === "checkpoint") return "Respire e revise pelo alvo: prática curta, feedback e nova tentativa.";
    if (mode === "project") return "Vamos quebrar o projeto em uma etapa pequena e verificável.";
    return "Primeiro entenda o alvo. Se travar, eu mostro uma pista por vez.";
  }, [mode, nextHint, state]);

  return (
    <section className={cn("rounded-2xl border border-primary/20 bg-card p-3 shadow-sm", className)}>
      <MascoteCapivara state={state} variant="compact" message={capyMessage} className="shadow-none" />
      <div className="mt-3 rounded-xl border border-border bg-background/70 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-primary">
          <MousePointer2 size={14} /> {stageLabel ?? modeLabel[mode]}
        </div>
        <p className="text-sm font-bold leading-relaxed text-foreground">{currentHint ?? objective ?? title}</p>
        {feedbackLine && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{feedbackLine}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {hasMoreHints && (
            <Button type="button" size="sm" variant="outline" onClick={onRevealHint} className="h-8 rounded-full text-xs">
              <Lightbulb size={13} /> Próxima dica
            </Button>
          )}
          {onUseGuidedStarter && (
            <Button type="button" size="sm" variant="ghost" onClick={onUseGuidedStarter} className="h-8 rounded-full text-xs">
              <Code2 size={13} /> Preparar editor
            </Button>
          )}
          {canRevealSolution && onRevealSolution && (
            <Button type="button" size="sm" variant="ghost" onClick={onRevealSolution} className="h-8 rounded-full text-xs">
              <Eye size={13} /> Ver solução
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CapyLessonAssistant;
