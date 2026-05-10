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
    duration: "10 a 12 semanas",
    finalProject: "Landing page responsiva para portfólio",
    startCourseId: "9",
    recommendedCourses: ["10", "7"],
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
    technologies: ["Lógica", "JavaScript", "React", "TypeScript"],
    level: "Intermediário",
    duration: "12 a 14 semanas",
    finalProject: "Dashboard interativo com componentes reutilizáveis",
    startCourseId: "10",
    recommendedCourses: ["7", "4"],
    steps: [
      { label: "Lógica", courseId: "10", note: "base para raciocínio" },
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
    technologies: ["Lógica", "JavaScript", "Node.js", "SQL", "Git"],
    level: "Intermediário",
    duration: "12 a 14 semanas",
    finalProject: "API de tarefas com CRUD e dados",
    startCourseId: "10",
    recommendedCourses: ["7", "8"],
    steps: [
      { label: "Lógica", courseId: "10", note: "entrada, decisão e repetição" },
      { label: "JavaScript", courseId: "2", note: "base da linguagem" },
      { label: "Node.js", courseId: "5", note: "servidor e rotas" },
      { label: "SQL", courseId: "6", note: "consultas e dados" },
      { label: "Git", courseId: "7", note: "versionamento profissional" },
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
    duration: "12 a 16 semanas",
    finalProject: "Automação que organiza dados e gera insights",
    startCourseId: "10",
    recommendedCourses: ["8"],
    steps: [
      { label: "Lógica", courseId: "10", note: "pensar em passos" },
      { label: "Python", courseId: "1", note: "sintaxe e automação" },
      { label: "SQL", courseId: "6", note: "buscar dados" },
      { label: "Dados e IA", courseId: "12", note: "relatórios, limpeza e prompts" },
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
    duration: "14 semanas",
    finalProject: "App de tarefas com telas e estado",
    startCourseId: "2",
    recommendedCourses: ["3", "7"],
    steps: [
      { label: "JavaScript", courseId: "2", note: "base da linguagem" },
      { label: "React", courseId: "3", note: "componentes e estado" },
      { label: "React Native", courseId: "11", note: "componentes mobile" },
      { label: "Git", courseId: "7", note: "versão e publicação" },
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
    technologies: ["Lógica", "JavaScript", "Jogos"],
    level: "Iniciante",
    duration: "10 semanas",
    finalProject: "Mini jogo com estado, pontuação e condição de vitória",
    startCourseId: "10",
    recommendedCourses: ["1", "8"],
    steps: [
      { label: "Lógica", courseId: "10", note: "regras do jogo" },
      { label: "JavaScript", courseId: "2", note: "eventos e interação" },
      { label: "Jogos", courseId: "13", note: "estado e loop de jogo" },
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
  const title = course.title.toLowerCase();
  if (language.includes("react native")) {
    return {
      kind: "Framework mobile",
      prerequisite: "React bÃ¡sico",
      finalProject: "App mobile com lista e estado",
      lockedUntil: "React",
    };
  }
  if (language.includes("dados") || title.includes("dados e ia")) {
    return {
      kind: "Dados e automaÃ§Ã£o",
      prerequisite: "Python bÃ¡sico",
      finalProject: "RelatÃ³rio automatizado",
      lockedUntil: "Python",
    };
  }
  if (language.includes("jogos")) {
    return {
      kind: "Jogos e interaÃ§Ã£o",
      prerequisite: "LÃ³gica + JavaScript",
      finalProject: "Mini jogo jogÃ¡vel",
      lockedUntil: "JavaScript",
    };
  }
  if (title.includes("algoritmos")) {
    return {
      kind: "Algoritmos avanÃ§ados",
      prerequisite: "LÃ³gica + uma linguagem",
      finalProject: "Desafio de estruturas de dados",
      lockedUntil: "LÃ³gica",
    };
  }
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
