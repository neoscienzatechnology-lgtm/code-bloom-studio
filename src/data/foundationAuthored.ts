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

  "10-7": {
    commonMistake:
      "Somar os nomes entre aspas — `\"precoA\" + \"precoB\"` — em vez das variáveis. Isso junta os dois textos e devolve `precoAprecoB`.",
    reference: [
      "`+` soma, `-` subtrai, `*` multiplica e `/` divide.",
      "Multiplicação e divisão acontecem antes de soma e subtração.",
      "Parênteses mudam a ordem: `(2 + 3) * 4` dá 20.",
      "O resultado pode ser guardado numa variável para ser usado depois.",
    ],
    practiceActivities: [
      {
        id: "10-7-practice-ordem",
        type: "predict-output",
        title: "Quem vem primeiro?",
        prompt: "Sem executar, qual é a saída deste código?",
        code: "console.log(2 + 3 * 4);",
        options: ["14", "20", "24", "9"],
        correctAnswer: "14",
        successFeedback: "Isso. A multiplicação acontece antes da soma: 3 * 4 = 12, depois 2 + 12.",
        errorFeedback: "Quase. Lembre que multiplicação vem antes de soma — para somar primeiro seriam necessários parênteses.",
        hint: "Faça a conta na ordem que a matemática manda, não da esquerda para a direita.",
      },
    ],
  },

  "10-8": {
    commonMistake:
      "Ler `total = total + 20` como uma equação impossível. Aqui o `=` não é igualdade: o computador calcula o lado direito e guarda o resultado na variável do lado esquerdo.",
    reference: [
      "`let` cria uma variável que PODE mudar depois.",
      "`const` cria uma variável que não pode ser trocada.",
      "Em `x = x + 20`, primeiro calcula-se `x + 20`, depois guarda-se em `x`.",
      "Prever a saída antes de rodar é o hábito que separa quem entende de quem chuta.",
    ],
    practiceActivities: [
      {
        id: "10-8-practice-prever",
        type: "predict-output",
        title: "Preveja antes de rodar",
        prompt: "Qual é o valor final mostrado?",
        code: "let x = 5;\nx = x + x;\nconsole.log(x);",
        options: ["10", "5", "25", "55"],
        correctAnswer: "10",
        successFeedback: "Exato. O lado direito vira 5 + 5 = 10 e só depois o valor é guardado em x.",
        errorFeedback: "Ainda não. Substitua x pelo valor atual (5) nos dois lugares do lado direito.",
        hint: "Troque cada x do lado direito pelo valor que ele tem naquele momento.",
      },
    ],
  },

  "10-9": {
    commonMistake:
      "Usar `=` (que guarda um valor) no lugar de `>=`, `===` e afins (que comparam). Comparação devolve verdadeiro ou falso; atribuição só guarda.",
    reference: [
      "Uma comparação sempre resulta em `true` ou `false`.",
      "`>=` é maior ou igual; `<=` é menor ou igual.",
      "`>` e `<` NÃO incluem o limite.",
      "O resultado da comparação pode ser guardado numa variável.",
    ],
    practiceActivities: [
      {
        id: "10-9-practice-comparar",
        type: "predict-output",
        title: "Verdadeiro ou falso?",
        prompt: "O que este código mostra?",
        code: "console.log(10 > 20);",
        options: ["false", "true", "10", "Erro de sintaxe"],
        correctAnswer: "false",
        successFeedback: "Isso. 10 não é maior que 20, então a comparação resulta em false.",
        errorFeedback: "Releia a comparação: ela pergunta se 10 é MAIOR que 20.",
        hint: "Leia em voz alta: '10 é maior que 20?'",
      },
    ],
  },

  "10-11": {
    commonMistake:
      "Escrever `if (senha = \"capy\")` com um `=` só. Isso GUARDA o texto na variável em vez de comparar — e a condição acaba sempre passando.",
    reference: [
      "`===` compara valor e tipo; `!==` é o contrário.",
      "Comparação de texto diferencia maiúscula de minúscula: `\"Capy\" !== \"capy\"`.",
      "Um espaço a mais também faz os textos serem diferentes.",
      "Um `=` guarda, dois ou três comparam.",
    ],
    practiceActivities: [
      {
        id: "10-11-practice-igualdade",
        type: "identify-error",
        title: "Qual linha compara de verdade?",
        prompt: "Você quer checar se a senha digitada é igual à correta. Qual linha faz isso?",
        code: 'const senha = "capy";',
        options: [
          'if (senha === "capy")',
          'if (senha = "capy")',
          'if (senha > "capy")',
          'if (senha "capy")',
        ],
        correctAnswer: 'if (senha === "capy")',
        successFeedback: "Boa. Três sinais de igual comparam valor e tipo, sem alterar a variável.",
        errorFeedback: "Cuidado: com um `=` só você estaria guardando o valor, não comparando.",
        hint: "Um sinal guarda; três comparam.",
      },
    ],
  },

  "10-10": {
    commonMistake:
      "Repetir a condição no `else`. O `else` já significa 'em todos os outros casos' — ele não leva pergunta nenhuma.",
    reference: [
      "`if (condição) { ... }` roda o bloco quando a condição é verdadeira.",
      "`else { ... }` cobre todo o resto, sem nova condição.",
      "Só UM dos dois blocos executa, nunca os dois.",
      "As chaves marcam onde começa e termina cada caminho.",
    ],
    practiceActivities: [
      {
        id: "10-10-practice-caminho",
        type: "predict-output",
        title: "E se a idade mudar?",
        prompt: "Com `idade = 15`, o que este código mostra?",
        code: 'const idade = 15;\nif (idade >= 18) {\n  console.log("Liberado");\n} else {\n  console.log("Bloqueado");\n}',
        options: ["Bloqueado", "Liberado", "Liberado\nBloqueado", "Não mostra nada"],
        correctAnswer: "Bloqueado",
        successFeedback: "Isso. A condição deu falso, então só o bloco do else roda.",
        errorFeedback: "Confira: 15 é maior ou igual a 18? O resultado dessa pergunta escolhe o caminho.",
        hint: "Responda primeiro se a condição é verdadeira ou falsa.",
      },
    ],
  },

  "10-12": {
    commonMistake:
      "Usar `>` quando a regra inclui o limite. Com `nota > 7`, quem tirou exatamente 7 seria reprovado — o certo é `>=`.",
    reference: [
      "`>=` inclui o valor do limite; `>` não.",
      "Sempre teste o caso da borda (aqui, a nota exatamente 7).",
      "Cada caminho do if/else mostra uma mensagem diferente.",
      "Regra de negócio vira condição: leia a regra em português antes de escrever.",
    ],
    practiceActivities: [
      {
        id: "10-12-practice-borda",
        type: "predict-output",
        title: "O caso da borda",
        prompt: "A regra é 'aprovado com 7 ou mais'. Com `nota = 7`, o que aparece?",
        code: 'const nota = 7;\nif (nota >= 7) {\n  console.log("Aprovado");\n} else {\n  console.log("Revisar");\n}',
        options: ["Aprovado", "Revisar", "Não mostra nada", "Erro"],
        correctAnswer: "Aprovado",
        successFeedback: "Isso. O `>=` inclui o 7 — e é justamente o caso que mais gera bug quando se usa `>`.",
        errorFeedback: "Olhe o operador: `>=` significa maior OU IGUAL, então o 7 entra.",
        hint: "O que muda entre `>` e `>=` exatamente no valor do limite?",
      },
    ],
  },

  "10-13": {
    commonMistake:
      "Esquecer o `numero++`. Sem alguém mudando o contador, a condição nunca fica falsa e o loop trava a página.",
    reference: [
      "O `for` tem três partes: início, condição e atualização.",
      "A condição é testada ANTES de cada volta.",
      "A atualização (`numero++`) é o que faz o loop terminar um dia.",
      "Loop existe para não repetir a mesma linha várias vezes na mão.",
    ],
    practiceActivities: [
      {
        id: "10-13-practice-fill",
        type: "fill-code",
        title: "Complete o loop",
        prompt: "Qual peça falta para este loop terminar?",
        code: "for (let n = 1; n <= 3; ____) {\n  console.log(n);\n}",
        correctAnswer: "n++",
        successFeedback: "Isso. Sem a atualização do contador, a condição `n <= 3` seria verdadeira para sempre.",
        errorFeedback: "Quase. A terceira parte do for é o que muda o contador a cada volta.",
        hint: "A terceira parte do for cuida de avançar o contador.",
      },
    ],
  },

  "10-14": {
    commonMistake:
      "Esperar a posição e receber o valor. O `for...of` entrega o ITEM da lista (`\"ler\"`), não o número da posição.",
    reference: [
      "`for (const item of lista)` percorre os valores, um por vez.",
      "O nome no singular (`tarefa`) deixa o código legível.",
      "O loop termina sozinho quando a lista acaba.",
      "A lista original não é alterada por percorrer.",
    ],
    practiceActivities: [
      {
        id: "10-14-practice-prever",
        type: "predict-output",
        title: "O que sai do for...of?",
        prompt: "Qual é a saída deste código?",
        code: 'const cores = ["azul", "verde"];\nfor (const cor of cores) {\n  console.log(cor);\n}',
        options: ["azul\nverde", "0\n1", "cor\ncor", "cores"],
        correctAnswer: "azul\nverde",
        successFeedback: "Isso. O for...of entrega o conteúdo de cada posição, na ordem da lista.",
        errorFeedback: "Não é a posição: essa forma de loop entrega o valor guardado em cada item.",
        hint: "A variável do for...of recebe o item, não o índice.",
      },
    ],
  },

  "10-15": {
    commonMistake:
      "Declarar `let total = 0` DENTRO do loop. Aí ele zera a cada volta e o resultado final é sempre 1.",
    reference: [
      "O acumulador é criado ANTES do loop.",
      "`total = total + 1` soma um ao que já existia.",
      "O resultado é mostrado DEPOIS do loop terminar.",
      "Contar e somar usam o mesmo padrão: acumulador + repetição.",
    ],
    practiceActivities: [
      {
        id: "10-15-practice-onde",
        type: "identify-error",
        title: "Onde criar o contador?",
        prompt: "Onde a linha `let total = 0;` precisa ficar para a contagem funcionar?",
        code: 'const tarefas = ["ler", "praticar", "revisar"];\n// onde entra o total?\nfor (const tarefa of tarefas) {\n  total = total + 1;\n}\nconsole.log(total);',
        options: [
          "Antes do loop, para não zerar a cada volta",
          "Dentro do loop, junto com a soma",
          "Depois do loop, antes do console.log",
          "Não precisa criar: o JavaScript cria sozinho",
        ],
        correctAnswer: "Antes do loop, para não zerar a cada volta",
        successFeedback: "Isso. O acumulador precisa sobreviver às voltas — por isso nasce fora do loop.",
        errorFeedback: "Se ele nascer dentro do loop, cada volta recomeça do zero e o total final vira 1.",
        hint: "Pergunte-se: o que acontece com o valor a cada nova volta?",
      },
    ],
  },

  "10-16": {
    commonMistake:
      "Copiar e colar a mesma linha três vezes. Funciona com três, mas quando forem cem repetições (ou o número mudar) o código vira um problema.",
    reference: [
      "O `for` repete o bloco enquanto a condição for verdadeira.",
      "O contador controla QUANTAS vezes, mesmo sem aparecer na mensagem.",
      "Mudar só o limite muda o número de repetições.",
      "Repetição na mão não escala; loop escala.",
    ],
    practiceActivities: [
      {
        id: "10-16-practice-prever",
        type: "predict-output",
        title: "Quantas vezes aparece?",
        prompt: "Qual é a saída deste loop?",
        code: 'for (let vez = 1; vez <= 2; vez++) {\n  console.log("oi");\n}',
        options: ["oi\noi", "oi", "oi\noi\noi", "1\n2"],
        correctAnswer: "oi\noi",
        successFeedback: "Isso. O contador vai de 1 a 2, então o bloco roda duas vezes — mesmo sem mostrar o contador.",
        errorFeedback: "Conte as voltas: com `vez` indo de 1 até 2, quantas vezes o bloco executa?",
        hint: "O contador não precisa aparecer na mensagem para controlar a repetição.",
      },
    ],
  },

  "10-17": {
    commonMistake:
      "Definir a função e esquecer de chamá-la. Definir é ensinar a receita; sem `saudar();` ninguém executa e nada aparece.",
    reference: [
      "`function nome() { ... }` DEFINE o que a função faz.",
      "`nome();` EXECUTA a função.",
      "Definir sem chamar não produz saída nenhuma.",
      "A mesma função pode ser chamada quantas vezes você quiser.",
    ],
    practiceActivities: [
      {
        id: "10-17-practice-chamada",
        type: "identify-error",
        title: "Por que não aparece nada?",
        prompt: "Este código roda sem erro, mas a tela fica vazia. Por quê?",
        code: 'function saudar() {\n  console.log("Olá");\n}',
        options: [
          "A função foi definida, mas nunca chamada",
          "Falta ponto e vírgula depois das chaves",
          "O nome saudar é reservado",
          "console.log não funciona dentro de função",
        ],
        correctAnswer: "A função foi definida, mas nunca chamada",
        successFeedback: "Isso. Definir é escrever a receita; chamar é cozinhar. Falta o `saudar();`.",
        errorFeedback: "O código está correto — o que falta é uma linha que MANDE a função executar.",
        hint: "O que precisa acontecer depois de definir, para a função rodar?",
      },
    ],
  },

  "10-18": {
    commonMistake:
      "Usar `console.log` dentro da função quando o que se queria era `return`. A mensagem aparece, mas quem chamou não recebe valor nenhum — e fica com `undefined`.",
    reference: [
      "Parâmetro é a ENTRADA da função.",
      "`return` é a SAÍDA: devolve o valor para quem chamou.",
      "Função sem `return` devolve `undefined`.",
      "O retorno pode ser guardado numa variável ou usado direto.",
    ],
    practiceActivities: [
      {
        id: "10-18-practice-return",
        type: "predict-output",
        title: "Mostrar não é devolver",
        prompt: "Esta função mostra o dobro, mas não devolve. O que aparece?",
        code: "function dobro(n) {\n  console.log(n * 2);\n}\n\nconst resultado = dobro(5);\nconsole.log(resultado);",
        options: ["10\nundefined", "10\n10", "undefined", "10"],
        correctAnswer: "10\nundefined",
        successFeedback: "Exato. O 10 veio do print de dentro; o `undefined` é o que a função devolveu — nada.",
        errorFeedback: "Repare que são DUAS saídas: uma de dentro da função e outra do valor devolvido.",
        hint: "O que uma função sem return entrega para quem a chamou?",
      },
    ],
  },

  "10-19": {
    commonMistake:
      "Criar uma função nova para cada par de números. A graça do parâmetro é justamente atender qualquer entrada com o mesmo código.",
    reference: [
      "A mesma função serve para entradas diferentes.",
      "Os parâmetros são os espaços que mudam a cada chamada.",
      "Cada chamada é independente das outras.",
      "Reutilizar significa: um lugar para corrigir quando houver bug.",
    ],
    practiceActivities: [
      {
        id: "10-19-practice-chamadas",
        type: "predict-output",
        title: "Duas chamadas, dois resultados",
        prompt: "Qual é a saída deste código?",
        code: "function somar(a, b) {\n  return a + b;\n}\n\nconsole.log(somar(1, 1));\nconsole.log(somar(2, 2));",
        options: ["2\n4", "1\n2", "2\n2", "4"],
        correctAnswer: "2\n4",
        successFeedback: "Isso. A função é a mesma; o que muda são os valores que entram em cada chamada.",
        errorFeedback: "Resolva uma chamada por vez, trocando a e b pelos valores passados.",
        hint: "Substitua a e b pelos números de cada chamada.",
      },
    ],
  },

  "10-20": {
    commonMistake:
      "Fazer a conta dentro da função mas esquecer o `return`. O cálculo acontece e o resultado é jogado fora.",
    reference: [
      "O nome da função diz o que ela faz (`calcularDesconto`).",
      "O parâmetro é o que varia entre uma chamada e outra.",
      "`return` entrega o resultado para quem chamou.",
      "Chamar com valores diferentes é a forma mais rápida de testar.",
    ],
    practiceActivities: [
      {
        id: "10-20-practice-outra-entrada",
        type: "predict-output",
        title: "Mesma função, outra entrada",
        prompt: "Com a função de desconto fixo de 10, o que aparece?",
        code: "function calcularDesconto(preco) {\n  return preco - 10;\n}\n\nconsole.log(calcularDesconto(30));",
        options: ["20", "30", "10", "40"],
        correctAnswer: "20",
        successFeedback: "Isso. A regra é a mesma; só a entrada mudou.",
        errorFeedback: "Aplique a regra da função ao número que foi passado: 30 menos 10.",
        hint: "Troque `preco` pelo valor da chamada.",
      },
    ],
  },

  "10-21": {
    commonMistake:
      "Abrir o editor e começar a digitar sem saber qual saída se espera. Sem definir a saída, não há como saber se o código funcionou.",
    reference: [
      "Entrada: o que o programa recebe para trabalhar.",
      "Processamento: a regra aplicada sobre a entrada.",
      "Saída: o resultado que aparece — e que prova que funcionou.",
      "Planejar em português antes de codar reduz retrabalho.",
    ],
    practiceActivities: [
      {
        id: "10-21-practice-ordem",
        type: "order-steps",
        title: "Planeje antes de codar",
        prompt: "Coloque as três partes do planejamento na ordem em que elas acontecem.",
        options: [
          'console.log("saída: resultado");',
          'console.log("entrada: números");',
          'console.log("processamento: soma");',
        ],
        correctAnswer: [
          'console.log("entrada: números");',
          'console.log("processamento: soma");',
          'console.log("saída: resultado");',
        ],
        successFeedback: "Isso. Todo programa segue esse trilho: recebe, transforma e devolve.",
        errorFeedback: "Pense no caminho do dado: por onde ele entra e por onde sai?",
        hint: "Nada pode ser processado antes de existir.",
      },
    ],
  },

  "10-22": {
    commonMistake:
      "Guardar o número entre aspas (`\"10\"`) ou a operação sem aspas (`soma`). O primeiro impede a conta; o segundo faz o computador procurar uma variável chamada soma.",
    reference: [
      "Números vão sem aspas: `const numeroA = 10;`.",
      "Texto vai entre aspas: `const operacao = \"soma\";`.",
      "`const` é para valores que não vão mudar.",
      "Nomes descritivos evitam confusão quando o código cresce.",
    ],
    practiceActivities: [
      {
        id: "10-22-practice-declaracao",
        type: "identify-error",
        title: "Qual declaração está errada?",
        prompt: "Na calculadora, qual destas linhas está com o tipo errado?",
        code: 'const numeroA = 10;\nconst numeroB = "5";\nconst operacao = "soma";',
        options: [
          'const numeroB = "5"; — é número, não deveria ter aspas',
          "const numeroA = 10; — todo valor precisa de aspas",
          'const operacao = "soma"; — texto não leva aspas',
          "Nenhuma: as três estão certas",
        ],
        correctAnswer: 'const numeroB = "5"; — é número, não deveria ter aspas',
        successFeedback: "Isso. Com aspas ele vira texto e `numeroA + numeroB` daria `105` em vez de 15.",
        errorFeedback: "Pergunte-se qual desses valores você vai precisar somar depois.",
        hint: "Só um dos três valores entra numa conta.",
      },
    ],
  },

  "10-23": {
    commonMistake:
      "Colocar a conta fora do `if`. Aí o resultado aparece mesmo quando a operação escolhida não é a soma.",
    reference: [
      "`===` compara o texto exatamente como está escrito.",
      "O bloco do `if` só executa quando a condição é verdadeira.",
      "A conta pode ir direto dentro do `console.log`.",
      "Se nenhuma condição casar, nada é mostrado — isso também é um resultado.",
    ],
    practiceActivities: [
      {
        id: "10-23-practice-valores",
        type: "predict-output",
        title: "Outros números, mesma regra",
        prompt: "Com `numeroA = 7` e `numeroB = 3`, o que este código mostra?",
        code: 'const numeroA = 7;\nconst numeroB = 3;\nconst operacao = "soma";\nif (operacao === "soma") {\n  console.log(numeroA + numeroB);\n}',
        options: ["10", "73", "4", "Não mostra nada"],
        correctAnswer: "10",
        successFeedback: "Isso. A condição passou e a soma foi calculada com os novos valores.",
        errorFeedback: "Confira duas coisas: a condição passou? E qual é a conta com esses números?",
        hint: "Primeiro veja se a condição é verdadeira; depois faça a conta.",
      },
    ],
  },

  "10-24": {
    commonMistake:
      "Esquecer o `return` dentro do `if`. A função calcula, ignora o resultado e cai no `return 0` do final — a resposta sai sempre zero.",
    reference: [
      "A função junta entrada (parâmetros), regra (if) e saída (return).",
      "O `return` encerra a função na hora em que executa.",
      "O `return 0` do fim é o caso 'nenhuma regra casou'.",
      "Chamar com uma operação desconhecida testa esse caminho.",
    ],
    practiceActivities: [
      {
        id: "10-24-practice-fallback",
        type: "predict-output",
        title: "E se a operação não existir?",
        prompt: "A calculadora só sabe somar. O que acontece ao pedir multiplicação?",
        code: 'function calcular(a, b, operacao) {\n  if (operacao === "soma") {\n    return a + b;\n  }\n  return 0;\n}\n\nconsole.log(calcular(4, 2, "multiplicacao"));',
        options: ["0", "8", "6", "undefined"],
        correctAnswer: "0",
        successFeedback: "Isso. Nenhuma regra casou, então a função caiu no return final — o plano B.",
        errorFeedback: "Siga o caminho do código: a condição do if é verdadeira para 'multiplicacao'?",
        hint: "Se a condição falha, qual linha da função executa?",
      },
    ],
  },
};
