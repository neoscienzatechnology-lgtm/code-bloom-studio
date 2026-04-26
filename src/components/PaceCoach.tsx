import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Sparkles, ArrowDownCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaceCoachProps {
  /** "struggling" → many failures; "thriving" → first-try success; null → hide */
  mode: "struggling" | "thriving" | null;
  /** Plain-language alt explanation (e.g. simplified hint) */
  altExplanation?: string;
  /** Optional bonus challenge text */
  bonusChallenge?: string;
  onUseSimpler?: () => void;
  onRevealSolution?: () => void;
  onAcceptBonus?: () => void;
  onDismiss: () => void;
}

const PaceCoach = ({
  mode,
  altExplanation,
  bonusChallenge,
  onUseSimpler,
  onRevealSolution,
  onAcceptBonus,
  onDismiss,
}: PaceCoachProps) => {
  return (
    <AnimatePresence>
      {mode === "struggling" && (
        <motion.div
          key="struggling"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="relative mt-4 rounded-2xl border-2 border-quest-blue/30 bg-quest-blue/5 p-4"
        >
          <button
            onClick={onDismiss}
            className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dispensar"
          >
            <X size={14} />
          </button>
          <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-quest-blue">
            <Lightbulb size={16} />
            Vamos por outro caminho
          </div>
          <p className="text-sm text-foreground/90">
            Percebi que esse exercício está pegando — sem problema, faz parte!
            Aqui vai uma explicação mais simples:
          </p>
          {altExplanation && (
            <div className="mt-3 rounded-lg border border-border bg-card/60 px-3 py-2 text-sm leading-relaxed text-foreground">
              {altExplanation}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {onUseSimpler && (
              <Button
                size="sm"
                onClick={onUseSimpler}
                className="gap-1.5 rounded-full bg-quest-blue text-xs font-bold text-white hover:bg-quest-blue/90"
              >
                <ArrowDownCircle size={13} /> Versão preparatória
              </Button>
            )}
            {onRevealSolution && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRevealSolution}
                className="rounded-full text-xs"
              >
                Ver a solução
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {mode === "thriving" && (
        <motion.div
          key="thriving"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="relative mt-4 rounded-2xl border-2 border-accent/40 bg-accent/5 p-4"
        >
          <button
            onClick={onDismiss}
            className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dispensar"
          >
            <X size={14} />
          </button>
          <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-accent">
            <Sparkles size={16} />
            Mandou bem! Topa um desafio extra?
          </div>
          <p className="text-sm text-foreground/90">
            Você acertou de primeira. Quer subir um pouco a régua antes de seguir?
          </p>
          {bonusChallenge && (
            <div className="mt-3 rounded-lg border border-border bg-card/60 px-3 py-2 text-sm leading-relaxed text-foreground">
              <span className="font-bold text-accent">Desafio: </span>
              {bonusChallenge}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {onAcceptBonus && (
              <Button
                size="sm"
                onClick={onAcceptBonus}
                className="gap-1.5 rounded-full bg-accent text-xs font-bold text-accent-foreground hover:bg-accent/90"
              >
                <Sparkles size={13} /> Aceitar desafio
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="rounded-full text-xs"
            >
              Pular
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaceCoach;
