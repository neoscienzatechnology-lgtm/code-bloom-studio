export type CourseLevel = "Iniciante" | "Intermediário" | "Avançado";

export interface CourseCatalogItem {
  id: string;
  title: string;
  language: string;
  emoji: string;
  level: CourseLevel;
  duration: string;
  lessonCount: number;
  kind: string;
  prerequisite: string;
  finalProject: string;
  lockedUntil: string | null;
}

export const courseCatalog: CourseCatalogItem[] = [
  {
    id: "10",
    title: "Fundamentos da Programação",
    language: "Lógica",
    emoji: "🧠",
    level: "Iniciante",
    duration: "18h",
    lessonCount: 24,
    kind: "Base de programação",
    prerequisite: "Nenhum",
    finalProject: "Calculadora simples guiada",
    lockedUntil: null,
  },
  {
    id: "1",
    title: "Python Essencial",
    language: "Python",
    emoji: "🐍",
    level: "Iniciante",
    duration: "15h",
    lessonCount: 31,
    kind: "Linguagem de programação",
    prerequisite: "Nenhum",
    finalProject: "Automação de tarefas",
    lockedUntil: null,
  },
  {
    id: "2",
    title: "JavaScript Moderno",
    language: "JavaScript",
    emoji: "⚡",
    level: "Intermediário",
    duration: "18h",
    lessonCount: 19,
    kind: "Linguagem da web",
    prerequisite: "Lógica básica",
    finalProject: "Página interativa",
    lockedUntil: null,
  },
  {
    id: "9",
    title: "HTML Semântico",
    language: "HTML",
    emoji: "🏗️",
    level: "Iniciante",
    duration: "13h",
    lessonCount: 13,
    kind: "Fundamento web",
    prerequisite: "Nenhum",
    finalProject: "Página semântica",
    lockedUntil: null,
  },
  {
    id: "4",
    title: "CSS Moderno",
    language: "CSS",
    emoji: "🎨",
    level: "Iniciante",
    duration: "15h",
    lessonCount: 15,
    kind: "Estilo e layout",
    prerequisite: "HTML básico",
    finalProject: "Layout responsivo",
    lockedUntil: "HTML",
  },
  {
    id: "3",
    title: "React Profissional",
    language: "React",
    emoji: "⚛️",
    level: "Intermediário",
    duration: "18h",
    lessonCount: 11,
    kind: "Framework front-end",
    prerequisite: "JavaScript básico",
    finalProject: "Dashboard interativo",
    lockedUntil: "JavaScript",
  },
  {
    id: "5",
    title: "Node.js e APIs",
    language: "Node.js",
    emoji: "🟢",
    level: "Intermediário",
    duration: "18h",
    lessonCount: 12,
    kind: "Backend JavaScript",
    prerequisite: "JavaScript básico",
    finalProject: "API com CRUD",
    lockedUntil: "JavaScript",
  },
  {
    id: "6",
    title: "SQL para Devs",
    language: "SQL",
    emoji: "🗄️",
    level: "Iniciante",
    duration: "14h",
    lessonCount: 14,
    kind: "Banco de dados",
    prerequisite: "Lógica básica",
    finalProject: "Consultas para relatório",
    lockedUntil: null,
  },
  {
    id: "7",
    title: "Git e GitHub",
    language: "Git",
    emoji: "🌿",
    level: "Iniciante",
    duration: "11h",
    lessonCount: 11,
    kind: "Ferramenta profissional",
    prerequisite: "Nenhum",
    finalProject: "Repositório publicado",
    lockedUntil: null,
  },
  {
    id: "8",
    title: "Algoritmos e Estruturas",
    language: "Lógica",
    emoji: "🧩",
    level: "Intermediário",
    duration: "10h",
    lessonCount: 10,
    kind: "Algoritmos avançados",
    prerequisite: "Lógica + uma linguagem",
    finalProject: "Desafio de estruturas de dados",
    lockedUntil: "Lógica",
  },
  {
    id: "11",
    title: "React Native Essencial",
    language: "React Native",
    emoji: "📱",
    level: "Intermediário",
    duration: "24h",
    lessonCount: 8,
    kind: "Framework mobile",
    prerequisite: "React básico",
    finalProject: "App mobile com lista e estado",
    lockedUntil: "React",
  },
  {
    id: "12",
    title: "Dados e IA na Prática",
    language: "Dados e IA",
    emoji: "📊",
    level: "Iniciante",
    duration: "20h",
    lessonCount: 8,
    kind: "Dados e automação",
    prerequisite: "Python básico",
    finalProject: "Relatório automatizado",
    lockedUntil: "Python",
  },
  {
    id: "13",
    title: "Game Dev Lógico",
    language: "Jogos",
    emoji: "🎮",
    level: "Iniciante",
    duration: "16h",
    lessonCount: 8,
    kind: "Jogos e interação",
    prerequisite: "Lógica + JavaScript",
    finalProject: "Mini jogo jogável",
    lockedUntil: "JavaScript",
  },
];

export const appCatalogSummary = {
  courseCount: courseCatalog.length,
  lessonCount: courseCatalog.reduce((total, course) => total + course.lessonCount, 0),
  projectCount: 60,
  practiceTypeCount: 5,
};

export const landingTracks = [
  { id: "10", emoji: "🧠", name: "Fundamentos da Programação", language: "Lógica", level: "Iniciante", lessons: 24 },
  { id: "9", emoji: "🏗️", name: "HTML Semântico", language: "HTML", level: "Iniciante", lessons: 13 },
  { id: "4", emoji: "🎨", name: "CSS", language: "CSS", level: "Iniciante", lessons: 15 },
  { id: "2", emoji: "⚡", name: "JavaScript", language: "JavaScript", level: "Intermediário", lessons: 18 },
  { id: "1", emoji: "🐍", name: "Python", language: "Python", level: "Iniciante", lessons: 31 },
];

export function getCourseCatalogItem(courseId: string | null | undefined): CourseCatalogItem | undefined {
  return courseCatalog.find((course) => course.id === courseId);
}
