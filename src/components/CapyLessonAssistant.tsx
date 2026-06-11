import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Code2,
  Compass,
  Eye,
  Lightbulb,
  ListChecks,
  MousePointer2,
  Sparkles,
  Target,
} from "lucide-react";
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
  description?: string;
  expectedOutput?: string;
  hints?: string[];
  revealedHintCount?: number;
  commonMistake?: string;
  reference?: string[];
  lastFeedback?: string | null;
  attempts?: number;
  compact?: boolean;
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

const focusOptions = [
  { id: "goal", label: "Alvo", icon: Target },
  { id: "hint", label: "Dica", icon: Lightbulb },
  { id: "check", label: "Conferir", icon: ListChecks },
] as const;

function firstUsefulLine(text?: string | null) {
  return text
    ?.split("\n")
    .map((line) => line.trim())
    .find(Boolean);
}

const CapyLessonAssistant = ({
  title,
  mode = "lesson",
  state = "thinking",
  stageLabel,
  objective,
  description,
  expectedOutput,
  hints = [],
  revealedHintCount = 0,
  commonMistake,
  reference = [],
  lastFeedback,
  attempts = 0,
  compact = false,
  className,
  onRevealHint,
  onUseGuidedStarter,
  onRevealSolution,
  canRevealSolution = false,
}: CapyLessonAssistantProps) => {
  const [focus, setFocus] = useState<"goal" | "hint" | "check">("goal");
  const visibleHints = hints.slice(0, Math.max(0, revealedHintCount));
  const nextHint = hints[visibleHints.length];
  const hasMoreHints = Boolean(nextHint && onRevealHint);
  const feedbackLine = firstUsefulLine(lastFeedback);

  const capyMessage = useMemo(() => {
    if (state === "success") return "Boa. Agora confira por que funcionou antes de avançar.";
    if (state === "error") return nextHint ?? "Quase. Compare o resultado com a saída esperada e ajuste uma coisa por vez.";
    if (state === "loading") return "Estou acompanhando seu teste. Compare o resultado com calma.";
    if (mode === "checkpoint") return "Respire e revise pelo alvo: prática curta, feedback e nova tentativa.";
    if (mode === "project") return "Vamos quebrar o projeto em uma etapa pequena e verificável.";
    return "Primeiro entenda o alvo. Se travar, eu mostro uma pista por vez.";
  }, [mode, nextHint, state]);

  const currentHint = visibleHints[visibleHints.length - 1] ?? nextHint;
  const checklist = [
    objective ?? description,
    expectedOutput ? `Resultado que confirma a resposta: ${expectedOutput}` : null,
    commonMistake ? `Cuidado: ${commonMistake}` : null,
  ].filter((item): item is string => Boolean(item));

  const focusCopy = {
    goal: objective ?? description ?? `Entenda o objetivo da atividade "${title}" antes de mexer no código.`,
    hint: currentHint ?? "Peça uma dica quando travar. A Capy mostra uma pista por vez para não entregar a resposta cedo demais.",
    check: expectedOutput
      ? `A saída deve ficar equivalente a ${expectedOutput}. Se apareceu algo diferente, ajuste uma parte pequena do código e teste de novo.`
      : "Depois de responder, leia o feedback e confira se a ideia principal ficou clara.",
  };

  if (compact) {
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
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      <div className="absolute right-4 top-4 flex items-center gap-1 text-primary/25" aria-hidden="true">
        <Code2 size={16} />
        <Sparkles size={14} />
        <Compass size={15} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div>
          <MascoteCapivara state={state} variant="compact" message={capyMessage} className="shadow-none" />
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-primary">
              {stageLabel ?? modeLabel[mode]}
            </span>
            {attempts > 0 && (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
                Tentativas: {attempts}
              </span>
            )}
          </div>

          <h3 className="text-lg font-black leading-tight text-foreground sm:text-xl">{title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {description ?? "Use este painel como apoio: primeiro entenda o alvo, depois peça dicas e por fim confira o resultado."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {focusOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={focus === id}
                onClick={() => setFocus(id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  focus === id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background/70 text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-background/75 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-primary">
              <ArrowRight size={14} /> {focusOptions.find((option) => option.id === focus)?.label}
            </div>
            <p className="text-sm leading-relaxed text-foreground">{focusCopy[focus]}</p>
            {feedbackLine && (
              <div className="mt-3 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                {feedbackLine}
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-primary">
                <ListChecks size={14} /> Checklist da tentativa
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {checklist.map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-primary">
                <Lightbulb size={14} /> Dicas liberadas
              </div>
              {visibleHints.length > 0 ? (
                <div className="space-y-2">
                  {visibleHints.map((hint, index) => (
                    <p key={index} className="rounded-lg bg-quest-yellow/10 px-3 py-2 text-sm leading-relaxed text-foreground">
                      {index + 1}. {hint}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Tente primeiro. Se travar, peça uma dica e a Capy mostra só o próximo passo.
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {hasMoreHints && (
                  <Button type="button" size="sm" variant="outline" onClick={onRevealHint} className="rounded-full text-xs">
                    <Lightbulb size={13} /> Pedir dica
                  </Button>
                )}
                {canRevealSolution && onRevealSolution && (
                  <Button type="button" size="sm" variant="ghost" onClick={onRevealSolution} className="rounded-full text-xs">
                    <Eye size={13} /> Ver solução
                  </Button>
                )}
                {onUseGuidedStarter && (
                  <Button type="button" size="sm" variant="ghost" onClick={onUseGuidedStarter} className="rounded-full text-xs">
                    <Code2 size={13} /> Preparar editor
                  </Button>
                )}
              </div>
            </div>
          </div>

          {(commonMistake || reference.length > 0) && (
            <div className="mt-3 rounded-xl border border-quest-yellow/25 bg-quest-yellow/10 p-3">
              {commonMistake && (
                <p className="flex gap-2 text-sm leading-relaxed text-foreground">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-quest-yellow" />
                  <span>
                    <strong>Erro comum:</strong> {commonMistake}
                  </span>
                </p>
              )}
              {reference.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {reference.map((item) => (
                    <span key={item} className="rounded-full bg-background/70 px-2.5 py-1 text-xs font-bold text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CapyLessonAssistant;
