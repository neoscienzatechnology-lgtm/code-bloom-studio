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
  secondary: string;
  label: string;
};

const courseThemes: Record<string, CourseArtTheme> = {
  "10": { icon: Brain, accent: "#0F766E", secondary: "#14B8A6", label: "raciocínio lógico" },
  "9": { icon: Globe2, accent: "#0E7490", secondary: "#22D3EE", label: "estrutura web" },
  "4": { icon: Palette, accent: "#1D4ED8", secondary: "#60A5FA", label: "layout visual" },
  "2": { icon: Braces, accent: "#B45309", secondary: "#F59E0B", label: "interação" },
  "3": { icon: Layers3, accent: "#0F766E", secondary: "#2DD4BF", label: "componentes" },
  "5": { icon: Server, accent: "#15803D", secondary: "#4ADE80", label: "servidor e APIs" },
  "6": { icon: Database, accent: "#4338CA", secondary: "#818CF8", label: "dados" },
  "7": { icon: GitBranch, accent: "#C2410C", secondary: "#FB923C", label: "versionamento" },
  "8": { icon: Table2, accent: "#0F766E", secondary: "#5EEAD4", label: "estratégia" },
  "11": { icon: Smartphone, accent: "#0E7490", secondary: "#34D399", label: "mobile" },
  "12": { icon: Sparkles, accent: "#6D28D9", secondary: "#A78BFA", label: "dados e IA" },
  "13": { icon: Gamepad2, accent: "#BE123C", secondary: "#FB7185", label: "jogos" },
};

function fallbackTheme(course: CourseCoverArtProps["course"]): CourseArtTheme {
  if (course.language.toLowerCase().includes("python")) {
    return { icon: Code2, accent: "#1D4ED8", secondary: "#38BDF8", label: "programação" };
  }
  return { icon: Code2, accent: "#0F766E", secondary: "#2DD4BF", label: course.language };
}

const variantClasses: Record<CourseCoverVariant, string> = {
  hero: "min-h-[220px] sm:min-h-[280px]",
  card: "aspect-[16/9]",
  thumb: "h-16 w-24",
};

const iconSize: Record<CourseCoverVariant, number> = { hero: 34, card: 24, thumb: 16 };

/** Capa de curso gerada em código (sem assets raster): gradiente da trilha,
 * um motivo geométrico de fluxo e o ícone do curso como marca d'água. */
const CourseCoverArt = ({ course, variant = "card", className = "" }: CourseCoverArtProps) => {
  const theme = courseThemes[course.id] ?? fallbackTheme(course);
  const Icon = theme.icon;
  const isThumb = variant === "thumb";

  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border border-white/10 ${variantClasses[variant]} ${className}`}
      style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.secondary})` }}
    >
      <svg
        viewBox="0 0 320 180"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <g fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2">
          <path d="M40 132 H120 a16 16 0 0 0 16-16 V84 a16 16 0 0 1 16-16 H236" />
          <path d="M70 150 H150 a16 16 0 0 0 16-16 V108" />
        </g>
        <g fill="#ffffff" fillOpacity="0.28">
          <circle cx="40" cy="132" r="5" />
          <circle cx="166" cy="108" r="5" />
          <circle cx="236" cy="68" r="5" />
          <circle cx="70" cy="150" r="4" />
        </g>
        <g fill="#ffffff" fillOpacity="0.1">
          <rect x="214" y="104" width="34" height="34" rx="8" />
          <rect x="252" y="128" width="22" height="22" rx="6" />
        </g>
      </svg>

      <Icon
        size={isThumb ? 64 : 132}
        strokeWidth={1.5}
        className="absolute -bottom-4 -right-3 text-white/15"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

      <div className={`absolute ${isThumb ? "left-2 top-2" : "left-4 top-4"} flex items-center gap-2`}>
        <div
          className={`flex items-center justify-center rounded-xl bg-white/92 text-slate-900 shadow-sm ${
            isThumb ? "h-8 w-8" : "h-11 w-11"
          }`}
        >
          <Icon size={iconSize[variant]} strokeWidth={2.4} />
        </div>
        {!isThumb && (
          <span className="rounded-full bg-white/88 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-900 shadow-sm">
            {theme.label}
          </span>
        )}
      </div>

      {variant === "hero" && (
        <figcaption className="absolute bottom-5 left-5 right-5 max-w-lg">
          <div className="mb-2 text-xs font-black uppercase tracking-wide text-white/75">Trilha CapyCode</div>
          <div className="text-2xl font-black leading-tight text-white sm:text-3xl">{course.title}</div>
          <div className="mt-1 text-sm font-bold text-white/80">{course.language} · {course.emoji}</div>
        </figcaption>
      )}
    </figure>
  );
};

export default CourseCoverArt;
