import { useId } from "react";
import {
  Brain,
  Braces,
  Code2,
  Database,
  Gamepad2,
  GitBranch,
  Globe2,
  Layers3,
  Palette,
  Server,
  Smartphone,
  Sparkles,
  Table2,
  type LucideIcon,
} from "lucide-react";
import type { Course } from "@/data/mockData";

type CourseCoverVariant = "hero" | "card" | "thumb";

interface CourseCoverArtProps {
  course: Pick<Course, "id" | "title" | "language" | "emoji">;
  variant?: CourseCoverVariant;
  className?: string;
}

type CourseArtTheme = {
  icon: LucideIcon;
  accent: string;
  label: string;
};

// Acento por curso, sempre na família do verde: a base charcoal é igual para
// todas; o verde + o ícone distinguem a trilha.
const courseThemes: Record<string, CourseArtTheme> = {
  "10": { icon: Brain, accent: "#44D62C", label: "raciocínio lógico" },
  "9": { icon: Globe2, accent: "#2ED36A", label: "estrutura web" },
  "4": { icon: Palette, accent: "#1FC9A6", label: "layout visual" },
  "2": { icon: Braces, accent: "#A6E22E", label: "interação" },
  "3": { icon: Layers3, accent: "#2ED38B", label: "componentes" },
  "5": { icon: Server, accent: "#3DD957", label: "servidor e APIs" },
  "6": { icon: Database, accent: "#29C7A0", label: "dados" },
  "7": { icon: GitBranch, accent: "#8BD42C", label: "versionamento" },
  "8": { icon: Table2, accent: "#16C77A", label: "estratégia" },
  "11": { icon: Smartphone, accent: "#46D6B0", label: "mobile" },
  "12": { icon: Sparkles, accent: "#5BD94A", label: "dados e IA" },
  "13": { icon: Gamepad2, accent: "#B6E63E", label: "jogos" },
};

function fallbackTheme(course: CourseCoverArtProps["course"]): CourseArtTheme {
  if (course.language.toLowerCase().includes("python")) {
    return { icon: Code2, accent: "#3DD957", label: "programação" };
  }
  return { icon: Code2, accent: "#44D62C", label: course.language };
}

const variantClasses: Record<CourseCoverVariant, string> = {
  hero: "min-h-[220px] sm:min-h-[280px]",
  card: "aspect-[16/9]",
  thumb: "h-16 w-24",
};

const iconSize: Record<CourseCoverVariant, number> = { hero: 34, card: 24, thumb: 16 };

// "Lattice Ascension": malha de nós conectados (rede / circuito / grafo)
// adensando e brilhando rumo a um foco no canto superior-direito. A geometria
// é a MESMA para todas as capas (só o acento muda), então é pré-computada uma
// vez no load — custo zero por render.
const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const COVER_LATTICE = (() => {
  const fx = 262;
  const fy = 29;
  const s = 26;
  const maxD = 235;
  const maxConn = s * 1.5;
  const nodes: { x: number; y: number; d: number }[] = [];
  let idx = 1;
  for (let gy = -s; gy <= 180 + s; gy += s)
    for (let gx = -s; gx <= 320 + s; gx += s) {
      idx++;
      const x = gx + (rand(idx) - 0.5) * s * 0.55;
      const y = gy + (rand(idx + 97) - 0.5) * s * 0.55;
      nodes.push({ x, y, d: Math.hypot(x - fx, y - fy) });
    }
  const fall = (d: number) => Math.max(0, Math.pow(1 - Math.min(d / maxD, 1), 1.6));
  const dots: { x: number; y: number; r: number; o: string }[] = [];
  const lines: { x1: number; y1: number; x2: number; y2: number; o: string }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const opA = fall(a.d);
    if (opA < 0.05) continue;
    dots.push({ x: a.x, y: a.y, r: 0.5 + opA * 1.1, o: (opA * 0.85).toFixed(3) });
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      if (Math.abs(a.x - b.x) > maxConn || Math.abs(a.y - b.y) > maxConn) continue;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > maxConn) continue;
      const o = Math.min(opA, fall(b.d)) * (1 - dist / maxConn) * 0.6;
      if (o < 0.04) continue;
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, o: o.toFixed(3) });
    }
  }
  return { dots, lines };
})();

/** Capa de curso gerada em código (sem assets raster), na linguagem
 * "Lattice Ascension": base charcoal, malha de nós conectados no acento da
 * trilha rumo a um foco luminoso, e o ícone do curso como marca d'água. */
const CourseCoverArt = ({ course, variant = "card", className = "" }: CourseCoverArtProps) => {
  const theme = courseThemes[course.id] ?? fallbackTheme(course);
  const Icon = theme.icon;
  const isThumb = variant === "thumb";
  const uid = useId();

  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border border-white/10 ${variantClasses[variant]} ${className}`}
      style={{
        background: "radial-gradient(120% 130% at 82% 12%, #11201A 0%, #0A0E0C 48%, #070A08 100%)",
        boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05)",
      }}
    >
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}-glow`} cx="82%" cy="16%" r="70%">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.5" />
            <stop offset="36%" stopColor={theme.accent} stopOpacity="0.13" />
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="320" height="180" fill={`url(#${uid}-glow)`} />
        <g>
          {COVER_LATTICE.lines.map((l, i) => (
            <line key={`l${i}`} x1={l.x1.toFixed(1)} y1={l.y1.toFixed(1)} x2={l.x2.toFixed(1)} y2={l.y2.toFixed(1)} stroke={theme.accent} strokeWidth={0.6} opacity={l.o} />
          ))}
          {COVER_LATTICE.dots.map((d, i) => (
            <circle key={`d${i}`} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r.toFixed(1)} fill={theme.accent} opacity={d.o} />
          ))}
        </g>
      </svg>

      <Icon size={isThumb ? 64 : 140} strokeWidth={1.4} className="absolute -bottom-5 -right-4" style={{ color: theme.accent, opacity: 0.16 }} aria-hidden="true" />

      <div className={`absolute ${isThumb ? "left-2 top-2" : "left-4 top-4"} flex items-center gap-2`}>
        <div
          className={`flex items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur ${isThumb ? "h-8 w-8" : "h-11 w-11"}`}
          style={{ color: theme.accent }}
        >
          <Icon size={iconSize[variant]} strokeWidth={2.4} />
        </div>
        {!isThumb && (
          <span
            className="rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 ring-1 ring-white/12 backdrop-blur"
            style={{ fontFamily: "'Fira Code', ui-monospace, monospace" }}
          >
            {theme.label}
          </span>
        )}
      </div>

      {variant === "hero" && (
        <figcaption className="absolute bottom-5 left-5 right-5 max-w-lg">
          <div
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: theme.accent, fontFamily: "'Fira Code', ui-monospace, monospace" }}
          >
            // trilha CodeTier
          </div>
          <div className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">{course.title}</div>
          <div className="mt-1 text-sm font-bold text-white/80">{course.language} · {course.emoji}</div>
        </figcaption>
      )}
    </figure>
  );
};

export default CourseCoverArt;
