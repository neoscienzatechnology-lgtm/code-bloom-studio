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
  level: "Iniciante" | "Intermediario" | "Avancado";
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
    description: "Comece pela base visual da web e avance ate interfaces modernas.",
    technologies: ["HTML", "CSS", "JavaScript", "React", "Tailwind"],
    level: "Iniciante",
    duration: "8 a 10 semanas",
    finalProject: "Landing page responsiva para portfolio",
    startCourseId: "9",
    recommendedCourses: ["7", "8"],
    steps: [
      { label: "HTML", courseId: "9", note: "estrutura da pagina" },
      { label: "CSS", courseId: "4", note: "layout e responsividade" },
      { label: "JavaScript", courseId: "2", note: "interacao" },
      { label: "React", courseId: "3", note: "componentes" },
      { label: "Projeto Final", note: "landing page completa" },
    ],
    mentorTip: "Para criar sites, primeiro vamos dominar estrutura, visual e interacao antes de entrar em React.",
  },
  {
    id: "modern-web",
    title: "Apps Web Modernos",
    shortTitle: "Apps Web",
    objective: "Quero criar dashboards e apps de navegador",
    description: "Uma trilha para sair de JavaScript ate componentes e rotas.",
    technologies: ["JavaScript", "React", "TypeScript"],
    level: "Intermediario",
    duration: "10 a 12 semanas",
    finalProject: "Dashboard interativo com componentes reutilizaveis",
    startCourseId: "2",
    recommendedCourses: ["7", "4"],
    steps: [
      { label: "JavaScript", courseId: "2", note: "fundamentos da linguagem" },
      { label: "CSS", courseId: "4", note: "interface organizada" },
      { label: "React", courseId: "3", note: "estado e componentes" },
      { label: "Projeto Final", note: "dashboard interativo" },
    ],
    mentorTip: "Se React parecer dificil, revise funcoes, arrays e objetos em JavaScript antes de continuar.",
  },
  {
    id: "backend",
    title: "Backend e APIs",
    shortTitle: "Backend",
    objective: "Quero criar APIs e sistemas com banco de dados",
    description: "Aprenda logica, Node, rotas, dados e fundamentos de banco.",
    technologies: ["Logica", "JavaScript", "Node.js", "SQL"],
    level: "Intermediario",
    duration: "10 a 12 semanas",
    finalProject: "API de tarefas com CRUD e dados",
    startCourseId: "8",
    recommendedCourses: ["7", "6"],
    steps: [
      { label: "Logica", courseId: "8", note: "raciocinio e estruturas" },
      { label: "JavaScript", courseId: "2", note: "base da linguagem" },
      { label: "Node.js", courseId: "5", note: "servidor e rotas" },
      { label: "SQL", courseId: "6", note: "consultas e dados" },
      { label: "Projeto Final", note: "API completa" },
    ],
    mentorTip: "Backend fica mais simples quando voce entende entrada, processamento, saida e persistencia.",
  },
  {
    id: "python-ai",
    title: "Dados e IA",
    shortTitle: "Python e IA",
    objective: "Quero aprender Python, dados e automacao",
    description: "Comece com Python e evolua para automacoes, dados e IA.",
    technologies: ["Logica", "Python", "Dados", "IA"],
    level: "Iniciante",
    duration: "10 a 14 semanas",
    finalProject: "Automacao que organiza dados e gera insights",
    startCourseId: "1",
    recommendedCourses: ["8", "6"],
    steps: [
      { label: "Logica", courseId: "8", note: "pensar em passos" },
      { label: "Python", courseId: "1", note: "sintaxe e automacao" },
      { label: "SQL", courseId: "6", note: "buscar dados" },
      { label: "Projeto Final", note: "automacao com relatorio" },
    ],
    mentorTip: "Python e uma boa primeira linguagem porque permite focar na ideia antes da sintaxe pesada.",
  },
  {
    id: "mobile",
    title: "Apps Mobile",
    shortTitle: "Mobile",
    objective: "Quero criar aplicativos para celular",
    description: "Prepare a base web antes de entrar em interfaces mobile.",
    technologies: ["JavaScript", "React", "React Native"],
    level: "Intermediario",
    duration: "12 semanas",
    finalProject: "App de tarefas com telas e estado",
    startCourseId: "2",
    recommendedCourses: ["3", "7"],
    steps: [
      { label: "JavaScript", courseId: "2", note: "base da linguagem" },
      { label: "React", courseId: "3", note: "componentes e estado" },
      { label: "Publicacao", note: "preparacao para mobile" },
      { label: "Projeto Final", note: "app de tarefas" },
    ],
    mentorTip: "Antes do mobile, vale garantir que componentes e estado em React estao claros.",
  },
  {
    id: "games",
    title: "Jogos",
    shortTitle: "Jogos",
    objective: "Quero criar jogos simples",
    description: "Use logica, eventos e pequenos desafios para pensar em sistemas.",
    technologies: ["Logica", "JavaScript", "Python"],
    level: "Iniciante",
    duration: "8 semanas",
    finalProject: "Mini jogo de perguntas ou aventura de texto",
    startCourseId: "8",
    recommendedCourses: ["1", "2"],
    steps: [
      { label: "Logica", courseId: "8", note: "regras do jogo" },
      { label: "JavaScript", courseId: "2", note: "eventos e interacao" },
      { label: "Python", courseId: "1", note: "simulacoes simples" },
      { label: "Projeto Final", note: "mini jogo jogavel" },
    ],
    mentorTip: "Jogos ensinam logica rapido porque cada regra precisa virar comportamento visivel.",
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
      prerequisite: "JavaScript basico",
      finalProject: "Dashboard interativo",
      lockedUntil: "JavaScript",
    };
  }
  if (language.includes("node")) {
    return {
      kind: "Backend JavaScript",
      prerequisite: "JavaScript basico",
      finalProject: "API com CRUD",
      lockedUntil: "JavaScript",
    };
  }
  if (language.includes("sql")) {
    return {
      kind: "Banco de dados",
      prerequisite: "Logica basica",
      finalProject: "Consultas para relatorio",
      lockedUntil: null,
    };
  }
  if (language.includes("css")) {
    return {
      kind: "Estilo e layout",
      prerequisite: "HTML basico",
      finalProject: "Layout responsivo",
      lockedUntil: "HTML",
    };
  }
  if (language.includes("html")) {
    return {
      kind: "Fundamento web",
      prerequisite: "Nenhum",
      finalProject: "Pagina semantica",
      lockedUntil: null,
    };
  }
  if (language.includes("python")) {
    return {
      kind: "Linguagem de programacao",
      prerequisite: "Nenhum",
      finalProject: "Automacao de tarefas",
      lockedUntil: null,
    };
  }
  if (language.includes("git")) {
    return {
      kind: "Ferramenta profissional",
      prerequisite: "Nenhum",
      finalProject: "Repositorio publicado",
      lockedUntil: null,
    };
  }
  return {
    kind: "Fundamento de programacao",
    prerequisite: "Nenhum",
    finalProject: "Desafio pratico",
    lockedUntil: null,
  };
}
