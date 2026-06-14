import { motion, useReducedMotion, type Transition } from "framer-motion";
import {
  CheckCircle2,
  Lightbulb,
  Loader2,
  PartyPopper,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CoachState =
  | "idle"
  | "success"
  | "error"
  | "thinking"
  | "celebrate"
  | "loading";

interface CoachGuideProps {
  state: CoachState;
  className?: string;
  message?: string;
  variant?: "card" | "compact";
}

interface StateConfig {
  message: string;
  icon: LucideIcon;
  iconClassName: string;
  discClassName: string;
}

const stateConfig: Record<CoachState, StateConfig> = {
  idle: {
    message: "Pronto para estudar?",
    icon: CheckCircle2,
    iconClassName: "text-emerald-500",
    discClassName: "bg-emerald-500/10 ring-emerald-500/20",
  },
  success: {
    message: "Boa! Você mandou muito bem.",
    icon: CheckCircle2,
    iconClassName: "text-emerald-500",
    discClassName: "bg-emerald-500/10 ring-emerald-500/20",
  },
  error: {
    message: "Quase! Vamos tentar de novo?",
    icon: XCircle,
    iconClassName: "text-orange-500",
    discClassName: "bg-orange-500/10 ring-orange-500/20",
  },
  thinking: {
    message: "Hmm... pensa com calma.",
    icon: Lightbulb,
    iconClassName: "text-amber-500",
    discClassName: "bg-amber-500/10 ring-amber-500/20",
  },
  celebrate: {
    message: "Aula concluída! Bora para a próxima?",
    icon: PartyPopper,
    iconClassName: "text-fuchsia-500",
    discClassName: "bg-fuchsia-500/10 ring-fuchsia-500/20",
  },
  loading: {
    message: "Preparando sua atividade...",
    icon: Loader2,
    iconClassName: "text-sky-500",
    discClassName: "bg-sky-500/10 ring-sky-500/20",
  },
};

const confettiItems = [
  "left-[16%] top-[12%] bg-emerald-400",
  "right-[18%] top-[15%] bg-sky-400",
  "left-[28%] top-[8%] bg-orange-400",
  "right-[16%] bottom-[14%] bg-fuchsia-400",
  "left-[20%] bottom-[18%] bg-amber-400",
  "right-[28%] bottom-[10%] bg-emerald-400",
];

function getEmblemAnimation(state: CoachState, reducedMotion: boolean) {
  if (reducedMotion) return {};

  const loop: Transition = { duration: 2.6, repeat: Infinity, ease: "easeInOut" };

  if (state === "success") {
    return { animate: { y: [0, -14, 0], scale: [1, 1.06, 1] }, transition: { duration: 0.8, ease: "easeOut" } };
  }
  if (state === "error") {
    return { animate: { x: [0, -8, 8, -5, 5, 0] }, transition: { duration: 0.55, ease: "easeInOut" } };
  }
  if (state === "thinking") {
    return { animate: { y: [0, -4, 0], rotate: [0, -2, 2, 0] }, transition: loop };
  }
  if (state === "celebrate") {
    return {
      animate: { y: [0, -10, 0], scale: [1, 1.05, 1] },
      transition: { duration: 1.1, repeat: Infinity, repeatDelay: 0.7, ease: "easeInOut" },
    };
  }
  if (state === "loading") {
    return { animate: { y: [0, -5, 0] }, transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } };
  }
  return { animate: { y: [0, -4, 0], scale: [1, 1.01, 1] }, transition: loop };
}

/** Guia de estudo neutro (sem personagem): reage ao estado da atividade com um
 * emblema e uma mensagem curta. Mantém a API antiga (state/message/variant). */
const CoachGuide = ({ state, className, message, variant = "card" }: CoachGuideProps) => {
  const reducedMotion = useReducedMotion();
  const config = stateConfig[state];
  const Icon = config.icon;
  const emblemMotion = getEmblemAnimation(state, Boolean(reducedMotion));
  const messageText = message ?? config.message;
  const spinning = state === "loading" && !reducedMotion;

  if (variant === "compact") {
    return (
      <section
        aria-live="polite"
        aria-label={`Guia: ${messageText}`}
        className={cn(
          "relative isolate flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card p-2.5 shadow-sm",
          className,
        )}
      >
        <motion.span
          className={cn("relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1", config.discClassName)}
          {...emblemMotion}
        >
          <Icon size={22} className={cn(config.iconClassName, spinning && "animate-spin")} />
        </motion.span>
        <span className="relative z-10 min-w-0 flex-1 rounded-xl bg-secondary px-3 py-2 text-xs font-bold leading-snug text-foreground">
          {messageText}
        </span>
      </section>
    );
  }

  return (
    <section
      aria-live="polite"
      aria-label={`Guia: ${messageText}`}
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm",
        className,
      )}
    >

      {(state === "celebrate" || state === "success") &&
        confettiItems.map((item, index) => (
          <motion.span
            key={item}
            className={cn("pointer-events-none absolute z-10 h-2 w-1.5 rounded-full", item)}
            animate={
              reducedMotion
                ? undefined
                : { y: [0, 18, 4], x: [0, index % 2 === 0 ? -8 : 8, 0], rotate: [0, 160, 320], opacity: [0, 1, 0.2] }
            }
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.12, ease: "easeOut" }}
          />
        ))}

      <div className="relative z-20 mx-auto flex max-w-xs flex-col items-center text-center">
        <motion.span
          className={cn("flex h-20 w-20 items-center justify-center rounded-3xl ring-1", config.discClassName)}
          {...emblemMotion}
        >
          <Icon size={38} className={cn(config.iconClassName, spinning && "animate-spin")} />
        </motion.span>

        <motion.div
          key={state}
          initial={reducedMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-3 rounded-2xl border border-border bg-secondary px-4 py-3 text-sm font-bold leading-snug text-foreground shadow-sm"
        >
          {messageText}
        </motion.div>
      </div>
    </section>
  );
};

export default CoachGuide;
