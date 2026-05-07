import { motion, useReducedMotion } from "framer-motion";
import { Code2, Lightbulb, Sparkles } from "lucide-react";

type MascotMood = "hello" | "thinking" | "success" | "focus";

interface BloomMascotProps {
  mood?: MascotMood;
  title?: string;
  message: string;
  compact?: boolean;
}

type SpriteConfig = {
  color: string;
  icon: typeof Sparkles;
  eyes: "open" | "happy" | "focus" | "thinking";
  mouth: "smile" | "wide" | "talk" | "flat";
  leftPaw: "wave" | "think" | "up" | "type";
  rightPaw: "rest" | "think" | "up" | "type";
  prop: "sparkles" | "thought" | "badge" | "laptop";
};

const spriteConfig: Record<MascotMood, SpriteConfig> = {
  hello: {
    color: "from-primary/30 to-accent/20",
    icon: Sparkles,
    eyes: "open",
    mouth: "talk",
    leftPaw: "wave",
    rightPaw: "rest",
    prop: "sparkles",
  },
  thinking: {
    color: "from-quest-blue/25 to-primary/15",
    icon: Lightbulb,
    eyes: "thinking",
    mouth: "flat",
    leftPaw: "think",
    rightPaw: "think",
    prop: "thought",
  },
  success: {
    color: "from-accent/25 to-primary/15",
    icon: Sparkles,
    eyes: "happy",
    mouth: "wide",
    leftPaw: "up",
    rightPaw: "up",
    prop: "badge",
  },
  focus: {
    color: "from-quest-yellow/25 to-primary/10",
    icon: Code2,
    eyes: "focus",
    mouth: "smile",
    leftPaw: "type",
    rightPaw: "type",
    prop: "laptop",
  },
};

const pawPath: Record<SpriteConfig["leftPaw"], string> = {
  wave: "M22 62c-12-4-14-14-9-19 6-6 14 2 13 13",
  think: "M24 65c-7-2-9-8-5-12 4-5 10-3 12 2",
  up: "M24 62c-11-9-12-20-4-24 8-5 13 8 12 18",
  type: "M21 66c8 2 16 2 23 0",
};

const rightPawPath: Record<SpriteConfig["rightPaw"], string> = {
  rest: "M73 63c8 4 10 12 5 16-6 5-15-1-16-12",
  think: "M72 65c7-2 9-8 5-12-4-5-10-3-12 2",
  up: "M71 62c11-9 12-20 4-24-8-5-13 8-12 18",
  type: "M52 66c8 2 16 2 23 0",
};

const Mouth = ({ kind }: { kind: SpriteConfig["mouth"] }) => {
  if (kind === "wide") {
    return <path d="M48 61c5 8 15 8 20 0" fill="none" stroke="#2f1a11" strokeWidth="3.2" strokeLinecap="round" />;
  }
  if (kind === "talk") {
    return <path d="M51 61c4 4 11 4 15 0" fill="none" stroke="#2f1a11" strokeWidth="3" strokeLinecap="round" />;
  }
  if (kind === "flat") {
    return <path d="M52 62h13" fill="none" stroke="#2f1a11" strokeWidth="3" strokeLinecap="round" />;
  }
  return <path d="M51 62c4 4 9 4 13 0" fill="none" stroke="#2f1a11" strokeWidth="3" strokeLinecap="round" />;
};

const Eyes = ({ kind, reducedMotion }: { kind: SpriteConfig["eyes"]; reducedMotion: boolean }) => {
  if (kind === "happy") {
    return (
      <>
        <path d="M43 51c3-4 7-4 10 0" fill="none" stroke="#24170f" strokeWidth="3" strokeLinecap="round" />
        <path d="M60 51c3-4 7-4 10 0" fill="none" stroke="#24170f" strokeWidth="3" strokeLinecap="round" />
      </>
    );
  }

  if (kind === "focus") {
    return (
      <>
        <rect x="38" y="47" width="13" height="10" rx="4" fill="#fff8ef" stroke="#0f172a" strokeWidth="2" />
        <rect x="61" y="47" width="13" height="10" rx="4" fill="#fff8ef" stroke="#0f172a" strokeWidth="2" />
        <path d="M51 52h10" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="44" cy="52" r="2.4" fill="#24170f" />
        <circle cx="67" cy="52" r="2.4" fill="#24170f" />
      </>
    );
  }

  if (kind === "thinking") {
    return (
      <>
        <path d="M39 45c4-3 8-3 12 0" fill="none" stroke="#2f1a11" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M61 45c4 2 8 1 12-2" fill="none" stroke="#2f1a11" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="45" cy="52" r="3" fill="#24170f" />
        <circle cx="67" cy="52" r="3" fill="#24170f" />
      </>
    );
  }

  return (
    <>
      <motion.g
        animate={reducedMotion ? undefined : { scaleY: [1, 1, 0.12, 1, 1] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.97, 1] }}
        style={{ transformOrigin: "45px 52px" }}
      >
        <circle cx="45" cy="52" r="3" fill="#24170f" />
      </motion.g>
      <motion.g
        animate={reducedMotion ? undefined : { scaleY: [1, 1, 0.12, 1, 1] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.97, 1] }}
        style={{ transformOrigin: "67px 52px" }}
      >
        <circle cx="67" cy="52" r="3" fill="#24170f" />
      </motion.g>
    </>
  );
};

const MoodProp = ({ prop, reducedMotion }: { prop: SpriteConfig["prop"]; reducedMotion: boolean }) => {
  if (prop === "thought") {
    return (
      <motion.g
        animate={reducedMotion ? undefined : { y: [0, -2, 0], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      >
        <circle cx="74" cy="18" r="4" fill="#ffffff" opacity="0.95" />
        <circle cx="83" cy="12" r="6" fill="#ffffff" opacity="0.95" />
        <circle cx="72" cy="7" r="3" fill="#ffffff" opacity="0.95" />
      </motion.g>
    );
  }

  if (prop === "badge") {
    return (
      <motion.g
        animate={reducedMotion ? undefined : { scale: [1, 1.12, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{ transformOrigin: "78px 19px" }}
      >
        <circle cx="78" cy="19" r="10" fill="#10b981" />
        <path d="M73 19l3 3 7-8" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    );
  }

  if (prop === "laptop") {
    return (
      <g>
        <rect x="25" y="66" width="50" height="18" rx="4" fill="#1e1e2e" />
        <path d="M32 74h11M49 74h15" stroke="#69d7a6" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 84h58" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  }

  return (
    <motion.g
      animate={reducedMotion ? undefined : { rotate: [0, 8, -6, 0], scale: [1, 1.06, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
      style={{ transformOrigin: "78px 18px" }}
    >
      <path d="M78 7l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5Z" fill="#f59e0b" />
      <path d="M65 21l1.3 3.5 3.7 1.5-3.7 1.3L65 31l-1.3-3.7L60 26l3.7-1.5Z" fill="#8b5cf6" />
    </motion.g>
  );
};

const CapyCoderSprite = ({ mood }: { mood: MascotMood }) => {
  const reducedMotion = Boolean(useReducedMotion());
  const config = spriteConfig[mood];

  return (
    <motion.svg
      viewBox="0 0 96 96"
      className="h-14 w-14 drop-shadow-sm"
      role="img"
      aria-label={`CapyCoder ${mood}`}
      animate={reducedMotion ? undefined : { y: [0, -2, 0] }}
      transition={{ duration: mood === "success" ? 1.4 : 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {config.prop !== "laptop" && <MoodProp prop={config.prop} reducedMotion={reducedMotion} />}

      <motion.path
        d={pawPath[config.leftPaw]}
        fill="none"
        stroke="#a8642e"
        strokeWidth="8"
        strokeLinecap="round"
        animate={config.leftPaw === "wave" && !reducedMotion ? { rotate: [-8, 12, -8] } : undefined}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "24px 55px" }}
      />
      <motion.path
        d={rightPawPath[config.rightPaw]}
        fill="none"
        stroke="#a8642e"
        strokeWidth="8"
        strokeLinecap="round"
        animate={config.rightPaw === "up" && !reducedMotion ? { rotate: [7, -5, 7] } : undefined}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "72px 55px" }}
      />

      <path d="M19 52c0-19 13-33 31-33 16 0 28 12 28 29 0 20-13 34-31 34-17 0-28-12-28-30Z" fill="#c47a34" />
      <path d="M13 57c0-9 8-16 18-16h23c11 0 20 9 20 20v6c0 6-5 11-11 11H30c-10 0-17-8-17-21Z" fill="#d88a3d" />
      <path d="M18 37c0-6 5-11 11-11 5 0 9 4 9 9 0 6-5 10-10 10-6 0-10-3-10-8Z" fill="#7a451f" />
      <path d="M63 32c0-6 5-11 11-11 5 0 9 4 9 9 0 6-5 10-10 10-6 0-10-3-10-8Z" fill="#7a451f" />
      <path d="M25 38c0-2 2-5 5-5 2 0 4 2 4 4 0 3-2 5-5 5s-4-2-4-4Z" fill="#3b2314" />
      <path d="M69 33c0-2 2-5 5-5 2 0 4 2 4 4 0 3-2 5-5 5s-4-2-4-4Z" fill="#3b2314" />
      <path d="M33 54c0-8 6-14 15-14h14c9 0 15 6 15 14 0 10-8 17-22 17-13 0-22-7-22-17Z" fill="#a8642e" />
      <circle cx="36" cy="43" r="7" fill="#fff8ef" />
      <circle cx="70" cy="43" r="7" fill="#fff8ef" />
      <Eyes kind={config.eyes} reducedMotion={reducedMotion} />
      <Mouth kind={config.mouth} />
      <path d="M31 43c12-7 26-7 40 0" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 45c15-8 40-10 64-5" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 71h56c-4 9-13 14-28 14-14 0-24-5-28-14Z" fill="#69d7a6" />
      <path d="M24 72c8 4 21 5 39 1" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
      {config.prop === "laptop" && <MoodProp prop={config.prop} reducedMotion={reducedMotion} />}
    </motion.svg>
  );
};

const BloomMascot = ({
  mood = "hello",
  title = "CapyCoder",
  message,
  compact = false,
}: BloomMascotProps) => {
  const style = spriteConfig[mood];
  const MoodIcon = style.icon;

  return (
    <div
      className={`flex gap-3 rounded-2xl border border-primary/15 bg-card p-3 shadow-sm ${
        compact ? "items-center" : "items-start"
      }`}
    >
      <div className="relative shrink-0">
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${style.color}`}>
          <CapyCoderSprite mood={mood} />
          <div className="absolute -right-1 -top-1 rounded-full bg-background p-1 text-accent shadow-sm">
            <MoodIcon size={12} />
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <div className="mb-0.5 text-sm font-black text-foreground">{title}</div>
        <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default BloomMascot;
