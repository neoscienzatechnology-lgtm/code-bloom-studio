import { Code2, Lightbulb, Sparkles } from "lucide-react";

type MascotMood = "hello" | "thinking" | "success" | "focus";

interface BloomMascotProps {
  mood?: MascotMood;
  title?: string;
  message: string;
  compact?: boolean;
}

const moodCopy: Record<MascotMood, { color: string; icon: typeof Sparkles }> = {
  hello: {
    color: "from-primary/30 to-accent/20",
    icon: Sparkles,
  },
  thinking: {
    color: "from-quest-blue/25 to-primary/15",
    icon: Lightbulb,
  },
  success: {
    color: "from-accent/25 to-primary/15",
    icon: Sparkles,
  },
  focus: {
    color: "from-quest-yellow/25 to-primary/10",
    icon: Code2,
  },
};

const BloomMascot = ({
  mood = "hello",
  title = "CapyCoder",
  message,
  compact = false,
}: BloomMascotProps) => {
  const style = moodCopy[mood];
  const MoodIcon = style.icon;

  return (
    <div
      className={`flex gap-3 rounded-2xl border border-primary/15 bg-card p-3 shadow-sm ${
        compact ? "items-center" : "items-start"
      }`}
    >
      <div className="relative shrink-0">
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${style.color}`}>
          <svg viewBox="0 0 96 96" className="h-14 w-14 drop-shadow-sm" role="img" aria-label="CapyCoder">
            <path d="M19 52c0-19 13-33 31-33 16 0 28 12 28 29 0 20-13 34-31 34-17 0-28-12-28-30Z" fill="#c47a34" />
            <path d="M13 57c0-9 8-16 18-16h23c11 0 20 9 20 20v6c0 6-5 11-11 11H30c-10 0-17-8-17-21Z" fill="#d88a3d" />
            <path d="M18 37c0-6 5-11 11-11 5 0 9 4 9 9 0 6-5 10-10 10-6 0-10-3-10-8Z" fill="#7a451f" />
            <path d="M63 32c0-6 5-11 11-11 5 0 9 4 9 9 0 6-5 10-10 10-6 0-10-3-10-8Z" fill="#7a451f" />
            <path d="M25 38c0-2 2-5 5-5 2 0 4 2 4 4 0 3-2 5-5 5s-4-2-4-4Z" fill="#3b2314" />
            <path d="M69 33c0-2 2-5 5-5 2 0 4 2 4 4 0 3-2 5-5 5s-4-2-4-4Z" fill="#3b2314" />
            <path d="M33 54c0-8 6-14 15-14h14c9 0 15 6 15 14 0 10-8 17-22 17-13 0-22-7-22-17Z" fill="#a8642e" />
            <circle cx="46" cy="52" r="3" fill="#2f1a11" />
            <circle cx="62" cy="52" r="3" fill="#2f1a11" />
            <path d="M51 62c4 4 9 4 13 0" fill="none" stroke="#2f1a11" strokeWidth="3" strokeLinecap="round" />
            <circle cx="36" cy="43" r="7" fill="#fff8ef" />
            <circle cx="70" cy="43" r="7" fill="#fff8ef" />
            <circle cx="38" cy="44" r="3" fill="#24170f" />
            <circle cx="68" cy="44" r="3" fill="#24170f" />
            <path d="M31 43c12-7 26-7 40 0" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 45c15-8 40-10 64-5" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 71h56c-4 9-13 14-28 14-14 0-24-5-28-14Z" fill="#69d7a6" />
            <path d="M24 72c8 4 21 5 39 1" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
          </svg>
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
