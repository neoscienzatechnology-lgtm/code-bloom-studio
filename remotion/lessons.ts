import type { TheoryProps } from "./TheoryVideo";

// Conteúdo derivado da lição real "1-1" (modernPythonSqlCourses.ts).
export const lesson11: TheoryProps = {
  module: "Python 1 · Começo seguro",
  title: "Primeiro programa em Python",
  concept:
    "Python lê o código de cima para baixo, uma instrução por vez. O comando print() envia uma mensagem para a saída — é o seu código falando com você.",
  analogy:
    "Pense no programa como uma receita: cada linha é um passo. Se a primeira linha manda mostrar algo, Python faz isso antes de seguir.",
  code: 'print("Olá, CodeTier!")',
  codeOutput: "Olá, CodeTier!",
  points: [
    "print(valor) mostra um valor no terminal",
    "Textos sempre ficam entre aspas",
    "Python executa linha por linha",
    "# cria um comentário",
  ],
  cta: "Continue na trilha de Python",
};
