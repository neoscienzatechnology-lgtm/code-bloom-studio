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

// Acento por curso, mas sempre na família do verde (estilo CODERS): a base é
// charcoal para todas; o verde + o ícone distinguem a trilha.
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

/** Capa de curso gerada em código (sem assets raster), no estilo CODERS:
 * base charcoal, textura de pontos verdes e o ícone do curso como marca
 * d'água. O acento verde varia por trilha. */
const CourseCoverArt = ({ course, variant = "card", className = "" }: CourseCoverArtProps) => {
  const theme = courseThemes[course.id] ?? fallbackTheme(course);
  const Icon = theme.icon;
  const isThumb = variant === "thumb";
  const dotsId = useId();

  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border border-white/10 ${variantClasses[variant]} ${className}`}
      style={{ background: "linear-gradient(135deg, #15191a, #232a26)" }}
    >
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id={dotsId} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill={theme.accent} fillOpacity="0.5" />
          </pattern>
          <radialGradient id={`${dotsId}-glow`} cx="80%" cy="22%" r="60%">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.32" />
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="320" height="180" fill={`url(#${dotsId})`} />
        <rect width="320" height="180" fill={`url(#${dotsId}-glow)`} />
      </svg>

      <Icon size={isThumb ? 64 : 132} strokeWidth={1.5} className="absolute -bottom-4 -right-3" style={{ color: theme.accent, opacity: 0.22 }} aria-hidden="true" />

      <div className={`absolute ${isThumb ? "left-2 top-2" : "left-4 top-4"} flex items-center gap-2`}>
        <div className={`flex items-center justify-center rounded-xl bg-white/92 text-slate-900 shadow-sm ${isThumb ? "h-8 w-8" : "h-11 w-11"}`}>
          <Icon size={iconSize[variant]} strokeWidth={2.4} />
        </div>
        {!isThumb && (
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-sm ring-1 ring-white/15 backdrop-blur">
            {theme.label}
          </span>
        )}
      </div>

      {variant === "hero" && (
        <figcaption className="absolute bottom-5 left-5 right-5 max-w-lg">
          <div className="mb-2 text-xs font-black uppercase tracking-wide" style={{ color: theme.accent }}>Trilha CapyCode</div>
          <div className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">{course.title}</div>
          <div className="mt-1 text-sm font-bold text-white/80">{course.language} · {course.emoji}</div>
        </figcaption>
      )}
    </figure>
  );
};

export default CourseCoverArt;
