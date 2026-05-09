import { motion, useReducedMotion, type Transition } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Lightbulb,
  Loader2,
  PartyPopper,
  Sparkles,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type MascoteCapivaraState =
  | "idle"
  | "success"
  | "error"
  | "thinking"
  | "celebrate"
  | "loading";

interface MascoteCapivaraProps {
  state: MascoteCapivaraState;
  className?: string;
  message?: string;
  variant?: "card" | "compact";
}

interface SpritePosition {
  col: 0 | 1 | 2;
  row: 0 | 1;
}

interface StateConfig {
  message: string;
  icon: LucideIcon;
  iconClassName: string;
  glowClassName: string;
  sprite: SpritePosition;
}

const stateConfig: Record<MascoteCapivaraState, StateConfig> = {
  idle: {
    message: "Pronto para estudar?",
    icon: CheckCircle2,
    iconClassName: "text-emerald-600",
    glowClassName: "from-emerald-200/80 via-sky-100/70 to-white",
    sprite: { col: 0, row: 0 },
  },
  success: {
    message: "Boa! Você mandou muito bem.",
    icon: CheckCircle2,
    iconClassName: "text-emerald-600",
    glowClassName: "from-emerald-200/90 via-lime-100/80 to-white",
    sprite: { col: 1, row: 0 },
  },
  error: {
    message: "Quase! Vamos tentar de novo?",
    icon: XCircle,
    iconClassName: "text-orange-600",
    glowClassName: "from-orange-200/90 via-amber-100/80 to-white",
    sprite: { col: 2, row: 0 },
  },
  thinking: {
    message: "Hmm... pensa com calma.",
    icon: Lightbulb,
    iconClassName: "text-amber-500",
    glowClassName: "from-amber-200/90 via-sky-100/80 to-white",
    sprite: { col: 0, row: 1 },
  },
  celebrate: {
    message: "Aula concluída! Bora para a próxima?",
    icon: PartyPopper,
    iconClassName: "text-fuchsia-600",
    glowClassName: "from-fuchsia-200/80 via-emerald-100/80 to-white",
    sprite: { col: 1, row: 1 },
  },
  loading: {
    message: "Preparando sua atividade...",
    icon: Loader2,
    iconClassName: "text-sky-600",
    glowClassName: "from-sky-200/90 via-cyan-100/80 to-white",
    sprite: { col: 2, row: 1 },
  },
};

const floatingItems = [
  { label: "</>", className: "left-5 top-8 text-emerald-600", delay: 0 },
  { label: "{}", className: "right-6 top-10 text-sky-600", delay: 0.25 },
  { label: "→", className: "right-8 bottom-28 text-orange-500", delay: 0.45 },
  { label: "✦", className: "left-8 bottom-24 text-amber-500", delay: 0.1 },
];

const confettiItems = [
  "left-[16%] top-[16%] bg-emerald-400",
  "left-[26%] top-[9%] bg-orange-400",
  "right-[18%] top-[15%] bg-sky-400",
  "right-[28%] top-[8%] bg-fuchsia-400",
  "left-[18%] bottom-[30%] bg-amber-400",
  "right-[16%] bottom-[34%] bg-emerald-400",
];

function getMascotAnimation(state: MascoteCapivaraState, reducedMotion: boolean) {
  if (reducedMotion) return {};

  const loop: Transition = { duration: 2.6, repeat: Infinity, ease: "easeInOut" };

  if (state === "success") {
    return {
      animate: { y: [0, -18, 0], rotate: [0, -3, 2, 0], scale: [1, 1.05, 1] },
      transition: { duration: 0.8, ease: "easeOut" },
    };
  }

  if (state === "error") {
    return {
      animate: { x: [0, -8, 8, -5, 5, 0], rotate: [0, -2, 2, -1, 1, 0] },
      transition: { duration: 0.55, ease: "easeInOut" },
    };
  }

  if (state === "thinking") {
    return {
      animate: { y: [0, -4, 0], rotate: [0, -1.5, 1.5, 0] },
      transition: loop,
    };
  }

  if (state === "celebrate") {
    return {
      animate: { y: [0, -12, 0], rotate: [0, -4, 4, 0], scale: [1, 1.04, 1] },
      transition: { duration: 1.1, repeat: Infinity, repeatDelay: 0.7, ease: "easeInOut" },
    };
  }

  if (state === "loading") {
    return {
      animate: { y: [0, -6, 0], rotate: [0, 2, -2, 0] },
      transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
    };
  }

  return {
    animate: { y: [0, -5, 0], scale: [1, 1.01, 1] },
    transition: loop,
  };
}

const MascoteCapivara = ({ state, className, message, variant = "card" }: MascoteCapivaraProps) => {
  const reducedMotion = useReducedMotion();
  const config = stateConfig[state];
  const Icon = config.icon;
  const mascotMotion = getMascotAnimation(state, Boolean(reducedMotion));
  const spriteTransform = `translate(-${config.sprite.col * 33.333333}%, -${config.sprite.row * 50}%)`;
  const messageText = message ?? config.message;

  if (variant === "compact") {
    return (
      <section
        aria-live="polite"
        aria-label={`Mascote CapyCoder: ${messageText}`}
        className={cn(
          "relative isolate flex items-center gap-3 overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br p-2.5 shadow-lg shadow-primary/10",
          config.glowClassName,
          className,
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(255,255,255,0.95),transparent_62%)]" />
        <motion.div
          className="relative z-10 aspect-[1/0.78] w-16 shrink-0 overflow-hidden"
          {...mascotMotion}
        >
          <img
            src="/mascote-capivara.png"
            alt="Mascote CapyCoder, uma capivara estudante de programação"
            className="absolute left-0 top-0 w-[300%] max-w-none select-none"
            draggable={false}
            style={{ transform: spriteTransform }}
          />
        </motion.div>
        <div className="relative z-10 flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold leading-snug text-slate-800 shadow-sm">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-50">
            <Icon
              size={16}
              className={cn(config.iconClassName, state === "loading" && !reducedMotion ? "animate-spin" : "")}
            />
          </span>
          <span className="min-w-0">{messageText}</span>
        </div>
        {(state === "celebrate" || state === "success") &&
          confettiItems.slice(0, 4).map((item, index) => (
            <motion.span
              key={item}
              className={cn("pointer-events-none absolute z-10 h-2 w-1.5 rounded-full", item)}
              animate={
                reducedMotion
                  ? undefined
                  : {
                      y: [0, 12, 2],
                      x: [0, index % 2 === 0 ? -6 : 6, 0],
                      rotate: [0, 140, 260],
                      opacity: [0, 1, 0.15],
                    }
              }
              transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.1, ease: "easeOut" }}
            />
          ))}
      </section>
    );
  }

  return (
    <section
      aria-live="polite"
      aria-label={`Mascote CapyCoder: ${messageText}`}
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br p-4 shadow-xl shadow-primary/10",
        config.glowClassName,
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-x-8 top-10 h-28 rounded-full bg-white/50 blur-3xl" />

      {floatingItems.map((item) => (
        <motion.div
          key={item.label + item.className}
          className={cn(
            "pointer-events-none absolute z-10 rounded-2xl bg-white/75 px-2 py-1 text-xs font-black shadow-sm ring-1 ring-white/70 backdrop-blur",
            item.className,
          )}
          animate={
            reducedMotion
              ? undefined
              : { y: [0, -7, 0], rotate: [0, 5, -3, 0], opacity: [0.75, 1, 0.75] }
          }
          transition={{ duration: 2.8, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
        >
          {item.label}
        </motion.div>
      ))}

      {(state === "celebrate" || state === "success") &&
        confettiItems.map((item, index) => (
          <motion.span
            key={item}
            className={cn("pointer-events-none absolute z-10 h-2 w-1.5 rounded-full", item)}
            animate={
              reducedMotion
                ? undefined
                : {
                    y: [0, 18, 4],
                    x: [0, index % 2 === 0 ? -8 : 8, 0],
                    rotate: [0, 160, 320],
                    opacity: [0, 1, 0.2],
                  }
            }
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.12, ease: "easeOut" }}
          />
        ))}

      {state === "thinking" && (
        <motion.div
          className="absolute right-10 top-14 z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-lg shadow-amber-400/30"
          animate={reducedMotion ? undefined : { y: [0, -8, 0], rotate: [0, 8, -6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Lightbulb size={20} />
        </motion.div>
      )}

      {state === "loading" && (
        <motion.div
          className="absolute right-10 top-14 z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/30"
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 1.15, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={20} />
        </motion.div>
      )}

      <div className="relative z-20 mx-auto max-w-xs">
        <motion.div className="relative mx-auto aspect-[1/0.78] w-52 overflow-hidden sm:w-60" {...mascotMotion}>
          <img
            src="/mascote-capivara.png"
            alt="Mascote CapyCoder, uma capivara estudante de programação"
            className="absolute left-0 top-0 w-[300%] max-w-none select-none"
            draggable={false}
            style={{ transform: spriteTransform }}
          />
          <motion.div
            className="absolute left-[31%] top-[24%] h-2 w-8 rounded-full bg-white/70 blur-[2px]"
            animate={reducedMotion ? undefined : { opacity: [0.35, 0.95, 0.35] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          key={state}
          initial={reducedMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative -mt-1 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-slate-900/10 backdrop-blur"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50">
            <Icon
              size={18}
              className={cn(config.iconClassName, state === "loading" && !reducedMotion ? "animate-spin" : "")}
            />
          </span>
          <span className="min-w-0 leading-snug">{messageText}</span>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-5 z-10 flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[10px] font-black text-emerald-700 shadow-sm">
        <Code2 size={12} />
        prática
      </div>
      <div className="pointer-events-none absolute bottom-5 right-5 z-10 flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[10px] font-black text-orange-600 shadow-sm">
        <ArrowUpRight size={12} />
        evolução
      </div>
      <Sparkles className="pointer-events-none absolute left-6 top-24 z-10 text-amber-400" size={16} />
    </section>
  );
};

export default MascoteCapivara;
