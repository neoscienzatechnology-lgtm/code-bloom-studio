// Lições que rodam JavaScript DE VERDADE no worker (`src/lib/jsRunner.ts`),
// em vez de passar pelo validador heurístico de texto.
//
// A lista não é escrita no olho: cada id aqui foi verificado executando a
// solução oficial e comparando a saída com `expectedOutput` — e o teste
// "lições marcadas como JS executável" refaz essa verificação a cada rodada.
// Ficam de fora as lições que dependem de DOM, rede, require/import ou de
// APIs que o worker não tem (React, Node com Express, React Native, CSS…).
// #revisao-lote3

export const JS_RUNTIME_LESSONS: ReadonlySet<string> = new Set([
  // curso 2
  "2-1",
  "2-2",
  "2-3",
  "2-4",
  "2-5",
  "2-6",
  "2-20",
  "2-7",
  "2-8",
  "2-9",
  "2-19",
  "2-11",
  "2-12",
  "2-13",
  "2-14",
  "2-15",
  "2-16",
  "2-17",
  "2-18",
  // curso 3
  "3-11",
  // curso 5
  "5-2",
  "5-8",
  "5-12",
  // curso 10
  "10-5",
  "10-6",
  "10-7",
  "10-8",
  "10-9",
  "10-11",
  "10-10",
  "10-12",
  "10-13",
  "10-14",
  "10-15",
  "10-16",
  "10-17",
  "10-18",
  "10-19",
  "10-20",
  "10-21",
  "10-22",
  "10-23",
  "10-24",
  // curso 11
  "11-5",
  // curso 13
  "13-1",
  "13-2",
  "13-3",
  "13-4",
  "13-5",
  "13-6",
  "13-7",
  "13-8",
]);

export function runsRealJs(lessonId: string): boolean {
  return JS_RUNTIME_LESSONS.has(lessonId);
}
