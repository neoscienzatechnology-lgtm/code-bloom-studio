export interface Course {
  id: string;
  title: string;
  language: string;
  emoji: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  duration: string;
  students: number;
  progress: number;
  color: string;
  lessons: number;
  tags: string[];
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  rarity: "Comum" | "Raro" | "Épico" | "Lendário";
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
}

export const courses: Course[] = [
  { id: "1", title: "Python do Zero ao Herói", language: "Python", emoji: "🐍", level: "Iniciante", duration: "20h", students: 12400, progress: 65, color: "quest-yellow", lessons: 42, tags: ["Popular", "Novo"] },
  { id: "2", title: "JavaScript Moderno", language: "JavaScript", emoji: "⚡", level: "Intermediário", duration: "25h", students: 9800, progress: 30, color: "quest-yellow", lessons: 56, tags: ["Popular"] },
  { id: "3", title: "React & TypeScript", language: "React", emoji: "⚛️", level: "Intermediário", duration: "30h", students: 7200, progress: 0, color: "quest-blue", lessons: 48, tags: ["Em alta"] },
  { id: "4", title: "CSS Mágico", language: "CSS", emoji: "🎨", level: "Iniciante", duration: "15h", students: 5600, progress: 100, color: "quest-pink", lessons: 30, tags: [] },
  { id: "5", title: "Node.js Backend", language: "Node.js", emoji: "🚀", level: "Avançado", duration: "35h", students: 4300, progress: 10, color: "accent", lessons: 60, tags: ["Novo"] },
  { id: "6", title: "SQL & Bancos de Dados", language: "SQL", emoji: "🗄️", level: "Iniciante", duration: "18h", students: 6100, progress: 0, color: "quest-orange", lessons: 35, tags: ["Popular"] },
  { id: "7", title: "Git & GitHub Pro", language: "Git", emoji: "🔀", level: "Iniciante", duration: "10h", students: 8900, progress: 80, color: "quest-blue", lessons: 20, tags: [] },
  { id: "8", title: "Algoritmos & Estruturas", language: "Lógica", emoji: "🧠", level: "Avançado", duration: "40h", students: 3200, progress: 0, color: "primary", lessons: 70, tags: ["Em alta"] },
];

export const badges: Badge[] = [
  { id: "1", name: "Primeira Linha", emoji: "✍️", description: "Escreva sua primeira linha de código", unlocked: true, rarity: "Comum" },
  { id: "2", name: "Bug Hunter", emoji: "🐛", description: "Corrija 10 bugs em exercícios", unlocked: true, rarity: "Raro" },
  { id: "3", name: "Streak Master", emoji: "🔥", description: "Mantenha um streak de 7 dias", unlocked: true, rarity: "Raro" },
  { id: "4", name: "Pythonista", emoji: "🐍", description: "Complete o curso de Python", unlocked: false, rarity: "Épico" },
  { id: "5", name: "Full Stack", emoji: "🏗️", description: "Complete front-end e back-end", unlocked: false, rarity: "Lendário" },
  { id: "6", name: "Speed Coder", emoji: "⚡", description: "Complete 5 exercícios em menos de 10min", unlocked: true, rarity: "Épico" },
  { id: "7", name: "Maratonista", emoji: "🏃", description: "Estude por 4 horas seguidas", unlocked: false, rarity: "Raro" },
  { id: "8", name: "Mentor", emoji: "🌟", description: "Ajude 5 alunos no fórum", unlocked: false, rarity: "Lendário" },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Ana Silva", avatar: "👩‍💻", xp: 12450, level: 28 },
  { rank: 2, name: "Carlos Dev", avatar: "👨‍💻", xp: 11200, level: 25 },
  { rank: 3, name: "Maria Code", avatar: "👩‍🎓", xp: 10800, level: 24 },
  { rank: 4, name: "Pedro H.", avatar: "🧑‍💻", xp: 9500, level: 22 },
  { rank: 5, name: "Julia Santos", avatar: "👩‍🔬", xp: 8900, level: 20 },
];

export const userProfile = {
  name: "Lucas Mendes",
  avatar: "🧑‍💻",
  level: 15,
  xp: 7850,
  xpToNext: 10000,
  streak: 12,
  coursesCompleted: 3,
  exercisesDone: 156,
  rank: 8,
  joinedDate: "Mar 2024",
};

export const codeExercise = {
  title: "Olá, Mundo! em Python",
  description: "Seu primeiro programa! Use a função `print()` para exibir a mensagem **\"Olá, Mundo!\"** no console.",
  language: "python",
  starterCode: '# Escreva seu código aqui\nprint("Olá, Mundo!")',
  solution: 'print("Olá, Mundo!")',
  hints: [
    "Use a função print() para exibir texto",
    "O texto deve estar entre aspas",
    'A resposta é: print("Olá, Mundo!")',
  ],
  xpReward: 10,
  lessonProgress: 1,
  totalLessons: 42,
};
