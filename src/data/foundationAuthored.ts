// Conteúdo AUTORAL das primeiras aulas de Fundamentos.
//
// O restante do curso ainda usa geradores (`foundationCommonMistake`,
// `foundationReference`, `buildPracticeActivity`), que produzem texto genérico:
// o mesmo "erro comum" para famílias inteiras de aula e distratores fixos como
// "Apagar todas as variáveis". Nas primeiras aulas — onde o iniciante decide se
// fica — isso não serve. Aqui cada aula tem erro comum, referência e prática
// escritos para ELA; os geradores continuam valendo para as demais e somem
// sozinhos conforme forem sendo escritas. #revisao-lote7
import type { PracticeActivity } from "@/data/mockData";

export interface AuthoredLessonExtras {
  commonMistake: string;
  reference: string[];
  practiceActivities: PracticeActivity[];
}

export const FOUNDATION_AUTHORED: Record<string, AuthoredLessonExtras> = {
  "10-1": {
    commonMistake:
      "Escrever a frase sem aspas — `mostrar(Estou programando)`. Sem aspas o computador acha que é um comando e não encontra nada com esse nome.",
    reference: [
      "`mostrar(\"texto\")` exibe uma mensagem na tela.",
      "Todo texto (string) fica entre aspas.",
      "A instrução termina com ponto e vírgula.",
      "Programar é dar instruções que o computador executa exatamente como escritas.",
    ],
    practiceActivities: [
      {
        id: "10-1-practice-aspas",
        type: "identify-error",
        title: "Por que este código não funciona?",
        prompt: "O programa abaixo dá erro. Qual é o problema?",
        code: 'mostrar(Bom dia);',
        options: [
          "O texto precisa estar entre aspas",
          "O nome mostrar está errado",
          "Falta criar uma variável antes",
          "Bom dia tem duas palavras",
        ],
        correctAnswer: "O texto precisa estar entre aspas",
        successFeedback: "Isso. As aspas marcam onde a frase começa e termina — sem elas o computador procura um comando chamado Bom.",
        errorFeedback: "Ainda não. Compare com o exemplo da aula: o que existe lá em volta da frase e falta aqui?",
        hint: "Olhe o que envolve a frase no exemplo da aula.",
      },
    ],
  },

  "10-2": {
    commonMistake:
      "Juntar os três passos numa linha só. Cada passo do algoritmo é uma instrução independente — e é isso que permite trocar a ordem ou remover um deles depois.",
    reference: [
      "Algoritmo é uma sequência de passos com um objetivo.",
      "Cada passo vira uma instrução própria.",
      "Uma linha de `mostrar` por passo deixa a sequência visível.",
      "A saída aparece na mesma ordem em que as instruções foram escritas.",
    ],
    practiceActivities: [
      {
        id: "10-2-practice-ordem",
        type: "order-steps",
        title: "Monte o algoritmo de fazer café",
        prompt: "Coloque os passos numa ordem que funcione de verdade.",
        options: ['mostrar("servir");', 'mostrar("ferver a água");', 'mostrar("colocar o pó");'],
        correctAnswer: ['mostrar("ferver a água");', 'mostrar("colocar o pó");', 'mostrar("servir");'],
        successFeedback: "Boa. Um algoritmo errado não é o que tem os passos errados — é o que tem os passos fora de ordem.",
        errorFeedback: "Pense no mundo real: dá para servir antes de ferver a água?",
        hint: "Comece pelo passo que não depende de nenhum outro.",
      },
    ],
  },

  "10-3": {
    commonMistake:
      "Achar que o computador entende a intenção. Ele executa de cima para baixo, na ordem escrita — se `executar` vier antes de `preparar`, é isso que vai aparecer.",
    reference: [
      "O programa roda de cima para baixo, uma linha por vez.",
      "A ordem das instruções muda o resultado.",
      "Cada `mostrar` só acontece quando a linha anterior terminou.",
      "Ler o código na ordem é a forma mais barata de prever a saída.",
    ],
    practiceActivities: [
      {
        id: "10-3-practice-prever",
        type: "predict-output",
        title: "Preveja a saída",
        prompt: "Sem executar, o que este programa mostra?",
        code: 'mostrar("fim");\nmostrar("começo");',
        options: ["fim\ncomeço", "começo\nfim", "começo", "Erro: ordem inválida"],
        correctAnswer: "fim\ncomeço",
        successFeedback: "Exato. O computador não reorganiza nada: ele obedece a ordem em que você escreveu.",
        errorFeedback: "Quase. Leia de cima para baixo e escreva o que cada linha mostra, na ordem.",
        hint: "A primeira linha do código é a primeira coisa que aparece.",
      },
    ],
  },

  "10-4": {
    commonMistake:
      "Apagar tudo e começar de novo quando aparece um erro. A mensagem de erro aponta a linha e o tipo de problema — quase sempre falta um parêntese, uma aspa ou o ponto e vírgula.",
    reference: [
      "Erro não é fracasso: é o computador dizendo onde não entendeu.",
      "Todo parêntese que abre precisa fechar.",
      "Toda aspa que abre precisa fechar.",
      "Corrija UMA coisa por vez e rode de novo para confirmar.",
    ],
    practiceActivities: [
      {
        id: "10-4-practice-erro",
        type: "identify-error",
        title: "Qual é a menor correção?",
        prompt: 'O código `mostrar("oi"` não roda. O que resolve?',
        code: 'mostrar("oi"',
        options: [
          "Fechar o parêntese no fim da linha",
          "Trocar as aspas por parênteses",
          "Escrever a frase sem espaços",
          "Colocar a linha dentro de outra instrução",
        ],
        correctAnswer: "Fechar o parêntese no fim da linha",
        successFeedback: "Isso. A menor correção verificável costuma ser a certa — e você confirma rodando de novo.",
        errorFeedback: "Não é isso. Conte quantos parênteses abrem e quantos fecham nessa linha.",
        hint: "Conte os parênteses: quantos abriram? Quantos fecharam?",
      },
    ],
  },

  "10-5": {
    commonMistake:
      "Repetir o valor em vez de usar a variável — escrever `\"Olá, Ana\"` direto. Aí, quando o nome mudar, você precisa caçar todos os lugares onde ele aparece.",
    reference: [
      "`const nome = \"Ana\";` guarda um valor com uma etiqueta.",
      "Depois de criada, use a variável pelo nome em qualquer lugar.",
      "O sinal `+` junta textos: `\"Olá, \" + nome`.",
      "Nome de variável descreve o conteúdo (`nome`, `idade`), não o tipo.",
    ],
    practiceActivities: [
      {
        id: "10-5-practice-reuso",
        type: "predict-output",
        title: "O valor mudou. E a saída?",
        prompt: "Se a primeira linha virar `const nome = \"Bruno\";`, o que este código mostra?",
        code: 'const nome = "Bruno";\nconsole.log("Olá, " + nome);',
        options: ["Olá, Bruno", "Olá, Ana", "Olá, nome", "Bruno, Olá"],
        correctAnswer: "Olá, Bruno",
        successFeedback: "Isso é o ponto da variável: você muda o valor num lugar só e todo o resto acompanha.",
        errorFeedback: "Releia: a saudação usa a variável, então ela mostra o que estiver guardado nela.",
        hint: "O que está entre aspas é fixo; o que vem da variável muda junto com ela.",
      },
    ],
  },

  "10-6": {
    commonMistake:
      "Colocar número entre aspas — `const idade = \"25\";`. Vira texto, e aí `idade + 1` resulta em `251` em vez de `26`.",
    reference: [
      "Texto (string) fica entre aspas: `\"Ana\"`.",
      "Número (number) vai sem aspas: `25`.",
      "Verdadeiro/falso (boolean) são `true` e `false`, sem aspas.",
      "O tipo define o que dá para fazer com o valor: somar, comparar, juntar.",
    ],
    practiceActivities: [
      {
        id: "10-6-practice-tipos",
        type: "identify-error",
        title: "Um destes tipos está errado",
        prompt: "Qual linha guarda o valor no tipo errado?",
        code: 'const nome = "Ana";\nconst idade = "25";\nconst estudando = true;',
        options: [
          'const idade = "25"; — número não leva aspas',
          'const nome = "Ana"; — texto não leva aspas',
          "const estudando = true; — precisa de aspas",
          "Nenhuma: as três estão certas",
        ],
        correctAnswer: 'const idade = "25"; — número não leva aspas',
        successFeedback: "Boa. Com aspas ele vira texto, e o computador deixa de conseguir fazer conta com ele.",
        errorFeedback: "Compare com a referência da aula: qual dos três tipos NÃO usa aspas?",
        hint: "Pense em qual valor você precisaria somar depois.",
      },
    ],
  },
};
