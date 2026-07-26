import type { ShortProps } from "./Short";

// Props padrão do Remotion Studio (`npm run video:studio`) para o Short.
// O lote real vem de remotion/shorts-data.json — este exemplo existe só para
// abrir a composição sem depender do manifesto gerado.
export const shortSample: ShortProps = {
  id: "exemplo-print-none",
  language: "Python",
  hook: "Por que isso imprime None?",
  concept: "print() mostra na tela, mas devolve None — quem devolve valor é o return.",
  code: 'def saudar():\n    print("Oi!")\n\nx = saudar()\nprint(x)',
  codeOutput: "Oi!\nNone",
  points: ["print mostra, return devolve", "Sem return, a função devolve None"],
  cta: "Aprenda funções na trilha de Python",
};
