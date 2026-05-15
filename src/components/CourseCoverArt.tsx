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
} from "lucide-react";
import type { Course } from "@/data/mockData";

type CourseCoverVariant = "hero" | "card" | "thumb";

interface CourseCoverArtProps {
  course: Pick<Course, "id" | "title" | "language" | "emoji">;
  variant?: CourseCoverVariant;
  className?: string;
  loading?: "lazy" | "eager";
}

type CourseArtTheme = {
  image: string;
  icon: typeof Code2;
  accent: string;
  secondary: string;
  glow: string;
  position: string;
  label: string;
};

const baseCourseArt = "/course-art/capycode-learning-system.jpg";

const courseThemes: Record<string, CourseArtTheme> = {
  "10": {
    image: "/course-art/course-fundamentals.jpg",
    icon: Brain,
    accent: "#0A7C78",
    secondary: "#7AD7A7",
    glow: "rgba(122, 215, 167, 0.34)",
    position: "36% 50%",
    label: "raciocínio lógico",
  },
  "9": {
    image: "/course-art/course-html.jpg",
    icon: Globe2,
    accent: "#0A7C78",
    secondary: "#FF9F2F",
    glow: "rgba(255, 159, 47, 0.28)",
    position: "62% 48%",
    label: "estrutura web",
  },
  "4": {
    image: "/course-art/course-css.jpg",
    icon: Palette,
    accent: "#169C93",
    secondary: "#FF9F2F",
    glow: "rgba(22, 156, 147, 0.3)",
    position: "72% 54%",
    label: "layout visual",
  },
  "2": {
    image: "/course-art/course-javascript.jpg",
    icon: Braces,
    accent: "#FF9F2F",
    secondary: "#0A7C78",
    glow: "rgba(255, 159, 47, 0.32)",
    position: "70% 36%",
    label: "interação",
  },
  "3": {
    image: "/course-art/course-react.jpg",
    icon: Layers3,
    accent: "#0A7C78",
    secondary: "#7AD7A7",
    glow: "rgba(10, 124, 120, 0.28)",
    position: "58% 58%",
    label: "componentes",
  },
  "5": {
    image: "/course-art/course-node.jpg",
    icon: Server,
    accent: "#0F766E",
    secondary: "#FF9F2F",
    glow: "rgba(15, 118, 110, 0.3)",
    position: "66% 48%",
    label: "servidor e APIs",
  },
  "6": {
    image: "/course-art/course-sql.jpg",
    icon: Database,
    accent: "#0A7C78",
    secondary: "#7AD7A7",
    glow: "rgba(122, 215, 167, 0.24)",
    position: "78% 48%",
    label: "dados",
  },
  "7": {
    image: "/course-art/course-git.jpg",
    icon: GitBranch,
    accent: "#FF9F2F",
    secondary: "#0A7C78",
    glow: "rgba(255, 159, 47, 0.28)",
    position: "30% 52%",
    label: "versionamento",
  },
  "8": {
    image: "/course-art/course-algorithms.jpg",
    icon: Table2,
    accent: "#0A7C78",
    secondary: "#FF9F2F",
    glow: "rgba(10, 124, 120, 0.26)",
    position: "52% 38%",
    label: "estratégia",
  },
  "11": {
    image: "/course-art/course-react-native.jpg",
    icon: Smartphone,
    accent: "#169C93",
    secondary: "#7AD7A7",
    glow: "rgba(22, 156, 147, 0.3)",
    position: "42% 46%",
    label: "mobile",
  },
  "12": {
    image: "/course-art/course-data-ai.jpg",
    icon: Sparkles,
    accent: "#0A7C78",
    secondary: "#FF9F2F",
    glow: "rgba(255, 159, 47, 0.26)",
    position: "74% 42%",
    label: "dados e IA",
  },
  "13": {
    image: "/course-art/course-games.jpg",
    icon: Gamepad2,
    accent: "#FF9F2F",
    secondary: "#0A7C78",
    glow: "rgba(255, 159, 47, 0.3)",
    position: "52% 58%",
    label: "jogos",
  },
};

function fallbackTheme(course: CourseCoverArtProps["course"]): CourseArtTheme {
  const key = course.language.toLowerCase();
  if (key.includes("python")) {
    return {
      image: "/course-art/course-python.jpg",
      icon: Code2,
      accent: "#0A7C78",
      secondary: "#FF9F2F",
      glow: "rgba(10, 124, 120, 0.26)",
      position: "46% 48%",
      label: "programação",
    };
  }

  return {
    image: baseCourseArt,
    icon: Code2,
    accent: "#0A7C78",
    secondary: "#7AD7A7",
    glow: "rgba(122, 215, 167, 0.28)",
    position: "50% 50%",
    label: course.language,
  };
}

const variantClasses: Record<CourseCoverVariant, string> = {
  hero: "min-h-[220px] sm:min-h-[280px]",
  card: "aspect-[16/9]",
  thumb: "h-16 w-24",
};

const iconSize: Record<CourseCoverVariant, number> = {
  hero: 34,
  card: 24,
  thumb: 16,
};

const CourseCoverArt = ({ course, variant = "card", className = "", loading = "lazy" }: CourseCoverArtProps) => {
  const theme = courseThemes[course.id] ?? fallbackTheme(course);
  const Icon = theme.icon;
  const isThumb = variant === "thumb";

  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border border-white/40 bg-card shadow-sm ${variantClasses[variant]} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${theme.accent}18, ${theme.secondary}22)`,
      }}
    >
      <img
        src={theme.image}
        alt={`Arte autoral do curso ${course.title}`}
        loading={loading}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: theme.position }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-transparent to-[#073b39]/20" />
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl"
        style={{ backgroundColor: theme.glow }}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#073b39]/80 via-[#073b39]/20 to-transparent" />

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
          <div className="mb-2 text-xs font-black uppercase tracking-wide text-white/75">Imagem autoral CapyCode</div>
          <div className="text-2xl font-black leading-tight text-white sm:text-3xl">{course.title}</div>
          <div className="mt-1 text-sm font-bold text-white/80">{course.language} · {course.emoji}</div>
        </figcaption>
      )}
    </figure>
  );
};

export default CourseCoverArt;
