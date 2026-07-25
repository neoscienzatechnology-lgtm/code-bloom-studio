export type CourseLevel = "Iniciante" | "Intermediário" | "Avançado";

export interface CourseCatalogItem {
  id: string;
  title: string;
  language: string;
  emoji: string;
  level: CourseLevel;
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
    lessonCount: 24,
    kind: "Base de programação",
    prerequisite: "Nenhum",
    finalProject: "Cofrinho de metas",
    lockedUntil: null,
  },
  {
    id: "1",
    title: "Python do Zero",
    language: "Python",
    emoji: "🐍",
    level: "Iniciante",
    lessonCount: 35,
    kind: "Linguagem de programação",
    prerequisite: "Nenhum",
    finalProject: "Relatório de gastos do mês",
    lockedUntil: null,
  },
  {
    id: "2",
    title: "JavaScript Essencial para Web",
    language: "JavaScript",
    emoji: "⚡",
    level: "Iniciante",
    lessonCount: 20,
    kind: "Linguagem da web",
    prerequisite: "Lógica básica",
    finalProject: "Carrinho de compras",
    lockedUntil: null,
  },
  {
    id: "9",
    title: "HTML Moderno e Semântico",
    language: "HTML",
    emoji: "🏗️",
    level: "Iniciante",
    lessonCount: 13,
    kind: "Fundamento web",
    prerequisite: "Nenhum",
    finalProject: "Página pessoal semântica",
    lockedUntil: null,
  },
  {
    id: "4",
    title: "CSS Moderno e Responsivo",
    language: "CSS",
    emoji: "🎨",
    level: "Iniciante",
    lessonCount: 15,
    kind: "Estilo e layout",
    prerequisite: "HTML básico",
    finalProject: "Cartão de perfil responsivo",
    lockedUntil: "HTML",
  },
  {
    id: "3",
    title: "React para Interfaces",
    language: "React",
    emoji: "⚛️",
    level: "Intermediário",
    lessonCount: 11,
    kind: "Framework front-end",
    prerequisite: "JavaScript básico",
    finalProject: "Painel de tarefas (guiado)",
    lockedUntil: "JavaScript",
  },
  {
    id: "5",
    title: "Node.js Backend",
    language: "Node.js",
    emoji: "🟢",
    level: "Intermediário",
    lessonCount: 12,
    kind: "Backend JavaScript",
    prerequisite: "JavaScript básico",
    finalProject: "Rotas de uma API de tarefas",
    lockedUntil: "JavaScript",
  },
  {
    id: "6",
    title: "SQL e Bancos de Dados",
    language: "SQL",
    emoji: "🗄️",
    level: "Iniciante",
    lessonCount: 14,
    kind: "Banco de dados",
    prerequisite: "Lógica básica",
    finalProject: "Relatório de biblioteca em SQL",
    lockedUntil: null,
  },
  {
    id: "7",
    title: "Git e GitHub Profissional",
    language: "Git",
    emoji: "🌿",
    level: "Iniciante",
    lessonCount: 11,
    kind: "Ferramenta profissional",
    prerequisite: "Nenhum",
    finalProject: "Fluxo de feature no Git",
    lockedUntil: null,
  },
  {
    id: "8",
    title: "Algoritmos e Estruturas",
    language: "Lógica",
    emoji: "🧩",
    level: "Intermediário",
    lessonCount: 10,
    kind: "Algoritmos avançados",
    prerequisite: "Lógica + uma linguagem",
    finalProject: "Escolha da estrutura de dados",
    lockedUntil: "Lógica",
  },
  {
    id: "11",
    title: "React Native Essencial",
    language: "React Native",
    emoji: "📱",
    level: "Intermediário",
    lessonCount: 8,
    kind: "Framework mobile",
    prerequisite: "React básico",
    finalProject: "Tela com lista e imagens",
    lockedUntil: "React",
  },
  {
    id: "12",
    title: "Dados e IA com Python",
    language: "Python",
    emoji: "📊",
    level: "Intermediário",
    lessonCount: 8,
    kind: "Dados e automação",
    prerequisite: "Python básico",
    finalProject: "Leitura de CSV linha a linha",
    lockedUntil: "Python",
  },
  {
    id: "13",
    title: "Jogos com JavaScript",
    language: "Jogos",
    emoji: "🎮",
    level: "Iniciante",
    lessonCount: 8,
    kind: "Jogos e interação",
    prerequisite: "Lógica + JavaScript",
    finalProject: "Placar e recorde do jogo",
    lockedUntil: "JavaScript",
  },
];

export const appCatalogSummary = {
  courseCount: courseCatalog.length,
  lessonCount: courseCatalog.reduce((total, course) => total + course.lessonCount, 0),
  projectCount: 50,
  practiceTypeCount: 5,
};

// `name` é um rótulo curto de vitrine (ex.: "CSS"); `level` e `lessons` são
// verificados contra o curso real pelo teste do catálogo. #revisao-1.4
export const landingTracks = [
  { id: "10", emoji: "🧠", name: "Fundamentos da Programação", language: "Lógica", level: "Iniciante", lessons: 24 },
  { id: "9", emoji: "🏗️", name: "HTML Semântico", language: "HTML", level: "Iniciante", lessons: 13 },
  { id: "4", emoji: "🎨", name: "CSS", language: "CSS", level: "Iniciante", lessons: 15 },
  { id: "2", emoji: "⚡", name: "JavaScript", language: "JavaScript", level: "Iniciante", lessons: 20 },
  { id: "1", emoji: "🐍", name: "Python", language: "Python", level: "Iniciante", lessons: 35 },
];

export function getCourseCatalogItem(courseId: string | null | undefined): CourseCatalogItem | undefined {
  return courseCatalog.find((course) => course.id === courseId);
}
