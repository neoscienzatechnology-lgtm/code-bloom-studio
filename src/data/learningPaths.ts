import { courses, type Course } from "@/data/mockData";

export type PathId = "frontend" | "modern-web" | "backend" | "python-ai" | "mobile" | "games";

export interface PathStep {
  label: string;
  courseId?: string;
  note?: string;
}

export interface LearningPath {
  id: PathId;
  title: string;
  shortTitle: string;
  objective: string;
  description: string;
  technologies: string[];
  level: "Iniciante" | "Intermediário" | "Avançado";
  duration: string;
  finalProject: string;
  startCourseId: string;
  recommendedCourses: string[];
  steps: PathStep[];
  mentorTip: string;
}

export const learningPaths: LearningPath[] = [
  {
    id: "frontend",
    title: "Sites e Landing Pages",
    shortTitle: "Front-end",
    objective: "Quero criar sites bonitos e responsivos",
    description: "Comece pela base visual da web e avance até interfaces modernas.",
    technologies: ["HTML", "CSS", "JavaScript", "React", "Tailwind"],
    level: "Iniciante",
    duration: "8 a 10 semanas",
    finalProject: "Landing page responsiva para portfólio",
    startCourseId: "9",
    recommendedCourses: ["7", "8"],
    steps: [
      { label: "HTML", courseId: "9", note: "estrutura da página" },
      { label: "CSS", courseId: "4", note: "layout e responsividade" },
      { label: "JavaScript", courseId: "2", note: "interação" },
      { label: "React", courseId: "3", note: "componentes" },
      { label: "Projeto Final", note: "landing page completa" },
    ],
    mentorTip: "Para criar sites, primeiro vamos dominar estrutura, visual e interação antes de entrar em React.",
  },
  {
    id: "modern-web",
    title: "Apps Web Modernos",
    shortTitle: "Apps Web",
    objective: "Quero criar dashboards e apps de navegador",
    description: "Uma trilha para sair de JavaScript até componentes e rotas.",
    technologies: ["JavaScript", "React", "TypeScript"],
    level: "Intermediário",
    duration: "10 a 12 semanas",
    finalProject: "Dashboard interativo com componentes reutilizáveis",
    startCourseId: "2",
    recommendedCourses: ["7", "4"],
    steps: [
      { label: "JavaScript", courseId: "2", note: "fundamentos da linguagem" },
      { label: "CSS", courseId: "4", note: "interface organizada" },
      { label: "React", courseId: "3", note: "estado e componentes" },
      { label: "Projeto Final", note: "dashboard interativo" },
    ],
    mentorTip: "Se React parecer difícil, revise funções, arrays e objetos em JavaScript antes de continuar.",
  },
  {
    id: "backend",
    title: "Backend e APIs",
    shortTitle: "Backend",
    objective: "Quero criar APIs e sistemas com banco de dados",
    description: "Aprenda lógica, Node, rotas, dados e fundamentos de banco.",
    technologies: ["Lógica", "JavaScript", "Node.js", "SQL"],
    level: "Intermediário",
    duration: "10 a 12 semanas",
    finalProject: "API de tarefas com CRUD e dados",
    startCourseId: "8",
    recommendedCourses: ["7", "6"],
    steps: [
      { label: "Lógica", courseId: "8", note: "raciocínio e estruturas" },
      { label: "JavaScript", courseId: "2", note: "base da linguagem" },
      { label: "Node.js", courseId: "5", note: "servidor e rotas" },
      { label: "SQL", courseId: "6", note: "consultas e dados" },
      { label: "Projeto Final", note: "API completa" },
    ],
    mentorTip: "Backend fica mais simples quando você entende entrada, processamento, saída e persistência.",
  },
  {
    id: "python-ai",
    title: "Dados e IA",
    shortTitle: "Python e IA",
    objective: "Quero aprender Python, dados e automação",
    description: "Comece com Python e evolua para automações, dados e IA.",
    technologies: ["Lógica", "Python", "Dados", "IA"],
    level: "Iniciante",
    duration: "10 a 14 semanas",
    finalProject: "Automação que organiza dados e gera insights",
    startCourseId: "1",
    recommendedCourses: ["8", "6"],
    steps: [
      { label: "Lógica", courseId: "8", note: "pensar em passos" },
      { label: "Python", courseId: "1", note: "sintaxe e automação" },
      { label: "SQL", courseId: "6", note: "buscar dados" },
      { label: "Projeto Final", note: "automação com relatório" },
    ],
    mentorTip: "Python é uma boa primeira linguagem porque permite focar na ideia antes da sintaxe pesada.",
  },
  {
    id: "mobile",
    title: "Apps Mobile",
    shortTitle: "Mobile",
    objective: "Quero criar aplicativos para celular",
    description: "Prepare a base web antes de entrar em interfaces mobile.",
    technologies: ["JavaScript", "React", "React Native"],
    level: "Intermediário",
    duration: "12 semanas",
    finalProject: "App de tarefas com telas e estado",
    startCourseId: "2",
    recommendedCourses: ["3", "7"],
    steps: [
      { label: "JavaScript", courseId: "2", note: "base da linguagem" },
      { label: "React", courseId: "3", note: "componentes e estado" },
      { label: "Publicação", note: "preparação para mobile" },
      { label: "Projeto Final", note: "app de tarefas" },
    ],
    mentorTip: "Antes do mobile, vale garantir que componentes e estado em React estão claros.",
  },
  {
    id: "games",
    title: "Jogos",
    shortTitle: "Jogos",
    objective: "Quero criar jogos simples",
    description: "Use lógica, eventos e pequenos desafios para pensar em sistemas.",
    technologies: ["Lógica", "JavaScript", "Python"],
    level: "Iniciante",
    duration: "8 semanas",
    finalProject: "Mini jogo de perguntas ou aventura de texto",
    startCourseId: "8",
    recommendedCourses: ["1", "2"],
    steps: [
      { label: "Lógica", courseId: "8", note: "regras do jogo" },
      { label: "JavaScript", courseId: "2", note: "eventos e interação" },
      { label: "Python", courseId: "1", note: "simulações simples" },
      { label: "Projeto Final", note: "mini jogo jogável" },
    ],
    mentorTip: "Jogos ensinam lógica rápido porque cada regra precisa virar comportamento visível.",
  },
];

export function getPathById(id: string | null | undefined): LearningPath {
  return learningPaths.find((path) => path.id === id) ?? learningPaths[0];
}

export function getCourseByPathStep(step: PathStep): Course | undefined {
  return step.courseId ? courses.find((course) => course.id === step.courseId) : undefined;
}

export function getCourseMeta(course: Course) {
  const language = course.language.toLowerCase();
  if (language.includes("react")) {
    return {
      kind: "Framework front-end",
      prerequisite: "JavaScript básico",
      finalProject: "Dashboard interativo",
      lockedUntil: "JavaScript",
    };
  }
  if (language.includes("node")) {
    return {
      kind: "Backend JavaScript",
      prerequisite: "JavaScript básico",
      finalProject: "API com CRUD",
      lockedUntil: "JavaScript",
    };
  }
  if (language.includes("sql")) {
    return {
      kind: "Banco de dados",
      prerequisite: "Lógica básica",
      finalProject: "Consultas para relatório",
      lockedUntil: null,
    };
  }
  if (language.includes("css")) {
    return {
      kind: "Estilo e layout",
      prerequisite: "HTML básico",
      finalProject: "Layout responsivo",
      lockedUntil: "HTML",
    };
  }
  if (language.includes("html")) {
    return {
      kind: "Fundamento web",
      prerequisite: "Nenhum",
      finalProject: "Página semântica",
      lockedUntil: null,
    };
  }
  if (language.includes("python")) {
    return {
      kind: "Linguagem de programação",
      prerequisite: "Nenhum",
      finalProject: "Automação de tarefas",
      lockedUntil: null,
    };
  }
  if (language.includes("git")) {
    return {
      kind: "Ferramenta profissional",
      prerequisite: "Nenhum",
      finalProject: "Repositório publicado",
      lockedUntil: null,
    };
  }
  return {
    kind: "Fundamento de programação",
    prerequisite: "Nenhum",
    finalProject: "Desafio prático",
    lockedUntil: null,
  };
}
