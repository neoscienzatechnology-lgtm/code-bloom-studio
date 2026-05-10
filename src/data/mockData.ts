export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  theory: string;
  starterCode: string;
  solution: string;
  expectedOutput: string;
  hints: string[];
  xpReward: number;
  quiz?: QuizQuestion[];
}

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
  lessons: Lesson[];
  tags: string[];
  description: string;
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

type LessonDraft = Omit<Lesson, "quiz"> & { quiz?: QuizQuestion[] };

function createLesson(draft: LessonDraft): Lesson {
  return draft;
}

function makeQuiz(
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string
): QuizQuestion {
  return { question, options, correctIndex, explanation };
}

function createJavaScriptFoundationBridge(): Lesson[] {
  return [
    createLesson({
      id: "2-foundation-types",
      title: "Tipos, Operadores e Conversão",
      description: "Entenda números, textos, booleanos e conversão antes de avançar para recursos modernos do JavaScript.",
      theory: `# Tipos, operadores e conversão

Antes de usar arrow functions, promises ou frameworks, você precisa dominar os valores básicos da linguagem. JavaScript trabalha com tipos como string, number, boolean, null, undefined, array e object.

Operadores transformam esses valores: soma, comparação, concatenação e lógica. O ponto delicado é que JavaScript também converte valores automaticamente em alguns casos. Por isso, "2" + 3 vira "23", enquanto Number("2") + 3 vira 5.

Na prática, sempre pergunte: qual é o tipo do valor? Ele representa texto, número ou verdadeiro/falso? Se precisar calcular, converta explicitamente com Number(). Se precisar montar texto, use template literals.`,
      starterCode: 'const precoTexto = "20";\nconst taxa = 5;\n// Converta precoTexto e some com taxa\n',
      solution: 'const precoTexto = "20";\nconst taxa = 5;\nconst total = Number(precoTexto) + taxa;\nconsole.log(total);',
      expectedOutput: "25",
      hints: ["Use Number(precoTexto).", "Some o número convertido com taxa.", "Mostre o total com console.log()."],
      xpReward: 15,
      quiz: [
        makeQuiz("O que Number('2') + 3 retorna?", ["23", "5", "NaN", "2 + 3"], 1, "Number('2') converte o texto para número antes da soma."),
        makeQuiz("Por que é melhor converter explicitamente?", ["Para deixar a intenção clara", "Para deixar o código maior", "Para remover variáveis", "Para evitar funções"], 0, "Conversão explícita reduz bugs causados por coerção automática."),
      ],
    }),
    createLesson({
      id: "2-foundation-conditionals",
      title: "Condicionais com if/else",
      description: "Use decisões simples para escolher mensagens e caminhos no programa.",
      theory: `# Condicionais

Condicionais fazem o programa escolher um caminho. A pergunta central é: esta condição é verdadeira?

Use if para o primeiro teste, else if para alternativas e else para o caso final. Antes de criar uma condição, escreva em português a regra que o código precisa seguir. Exemplo: se a idade for maior ou igual a 18, liberar; caso contrário, bloquear.

Essa habilidade aparece em formulários, jogos, APIs, dashboards e praticamente qualquer app real.`,
      starterCode: "const idade = 18;\n// Mostre 'Liberado' se idade for 18 ou mais\n",
      solution: 'const idade = 18;\nif (idade >= 18) {\n  console.log("Liberado");\n} else {\n  console.log("Bloqueado");\n}',
      expectedOutput: "Liberado",
      hints: ["Use if (idade >= 18).", "Dentro do bloco, use console.log('Liberado').", "Crie um else para o caso contrário."],
      xpReward: 15,
      quiz: [
        makeQuiz("Qual operador significa maior ou igual?", [">", "=>", ">=", "=<"], 2, ">= compara se o valor da esquerda é maior ou igual ao da direita."),
      ],
    }),
    createLesson({
      id: "2-foundation-loops",
      title: "Loops com for",
      description: "Repita uma ação para percorrer valores sem copiar a mesma linha várias vezes.",
      theory: `# Loops

Loops resolvem tarefas repetitivas. Em vez de escrever cinco console.log(), você descreve uma regra de repetição.

O for clássico tem três partes: início, condição de continuação e incremento. Leia assim: comece em 1; enquanto for menor ou igual a 3; some 1 a cada volta.

Depois que isso estiver claro, métodos como map, filter e reduce fazem muito mais sentido.`,
      starterCode: "// Mostre os números de 1 a 3\n",
      solution: "for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}",
      expectedOutput: "3",
      hints: ["Comece com let i = 1.", "Use i <= 3.", "Use i++ para avançar."],
      xpReward: 15,
      quiz: [
        makeQuiz("Qual parte do for faz o contador avançar?", ["let i = 1", "i <= 3", "i++", "console.log"], 2, "i++ incrementa o contador no fim de cada repetição."),
      ],
    }),
    createLesson({
      id: "2-foundation-arrays",
      title: "Arrays Básicos",
      description: "Guarde vários itens em uma lista antes de usar métodos avançados como map e filter.",
      theory: `# Arrays básicos

Array é uma lista ordenada. Você usa arrays para tarefas, produtos, usuários, mensagens e muitos outros conjuntos.

Antes de map e filter, domine três ideias: criar a lista, acessar um item por índice e contar com length. Índices começam em 0, então o primeiro item está em lista[0].

Quando você entende array como coleção, os métodos modernos viram atalhos para transformar, buscar e filtrar dados.`,
      starterCode: 'const tarefas = ["estudar", "praticar", "revisar"];\n// Mostre quantas tarefas existem\n',
      solution: 'const tarefas = ["estudar", "praticar", "revisar"];\nconsole.log(tarefas.length);',
      expectedOutput: "3",
      hints: ["Use a propriedade length.", "A lista tem três itens.", "Mostre com console.log()."],
      xpReward: 15,
      quiz: [
        makeQuiz("Qual índice acessa o primeiro item de um array?", ["1", "0", "-1", "first"], 1, "Arrays em JavaScript começam no índice 0."),
      ],
    }),
    createLesson({
      id: "2-foundation-objects",
      title: "Objetos Básicos",
      description: "Agrupe informações relacionadas usando propriedades e valores.",
      theory: `# Objetos

Objetos representam coisas com características. Um usuário pode ter nome, email e ativo. Um produto pode ter título, preço e estoque.

A estrutura usa chaves: const produto = { nome: "Mouse", preco: 80 }. Para acessar uma propriedade, use produto.nome.

Objetos são essenciais em React, APIs, banco de dados, formulários e praticamente todo código JavaScript moderno.`,
      starterCode: "// Crie um objeto usuario com nome e ativo\n",
      solution: 'const usuario = { nome: "Ana", ativo: true };\nconsole.log(usuario.nome);',
      expectedOutput: "Ana",
      hints: ["Use chaves para criar o objeto.", "Crie a propriedade nome.", "Acesse com usuario.nome."],
      xpReward: 15,
      quiz: [
        makeQuiz("Como acessar a propriedade nome?", ["usuario[nome]", "usuario.nome", "usuario->nome", "nome.usuario"], 1, "A notação de ponto acessa propriedades pelo nome."),
      ],
    }),
    createLesson({
      id: "2-foundation-functions",
      title: "Funções Tradicionais",
      description: "Crie funções comuns antes de comparar com arrow functions.",
      theory: `# Funções

Funções empacotam uma ação com nome. Elas recebem entradas, processam e podem devolver uma saída com return.

Antes de arrow functions, pratique a forma tradicional: function dobrar(numero) { return numero * 2; }. Essa sintaxe deixa bem visível nome, parâmetro e retorno.

Depois, arrow functions serão apenas uma forma mais curta para escrever a mesma ideia.`,
      starterCode: "// Crie uma função dobrar que retorna o dobro de um número\n",
      solution: "function dobrar(numero) {\n  return numero * 2;\n}\nconsole.log(dobrar(4));",
      expectedOutput: "8",
      hints: ["Comece com function dobrar(numero).", "Use return numero * 2.", "Chame dobrar(4)."],
      xpReward: 20,
      quiz: [
        makeQuiz("Para que serve return?", ["Mostrar texto", "Devolver um resultado", "Criar variável global", "Apagar uma função"], 1, "return devolve o resultado para quem chamou a função."),
      ],
    }),
  ];
}

function createCssFoundationBridge(): Lesson[] {
  return [
    createLesson({
      id: "4-foundation-cascade",
      title: "Cascata e Especificidade",
      description: "Entenda por que uma regra CSS vence outra antes de avançar para layouts complexos.",
      theory: `# Cascata e especificidade

CSS significa folhas de estilo em cascata. Quando duas regras tentam estilizar o mesmo elemento, o navegador decide qual vence usando ordem, especificidade e importância.

Seletores de elemento são mais fracos, classes são mais específicas e ids são ainda mais fortes. Na prática, prefira classes para manter o CSS previsível.

Antes de usar Grid, Flexbox e animações, você precisa saber responder: qual regra está sendo aplicada e por quê?`,
      starterCode: ".titulo {\n  color: blue;\n}\n/* Crie uma regra mais específica para destaque */\n",
      solution: ".titulo {\n  color: blue;\n}\n.titulo.destaque {\n  color: orange;\n}",
      expectedOutput: ".titulo.destaque",
      hints: ["Combine duas classes no mesmo seletor.", "Use .titulo.destaque.", "Altere a cor na regra mais específica."],
      xpReward: 15,
      quiz: [
        makeQuiz("Qual seletor costuma ser mais específico?", [".card", "p", "*", "body"], 0, "Uma classe tem mais especificidade que um seletor de elemento."),
      ],
    }),
    createLesson({
      id: "4-foundation-box-model",
      title: "Box Model na Prática",
      description: "Aprenda conteúdo, padding, border e margin antes de montar telas responsivas.",
      theory: `# Box Model

Todo elemento visual no CSS é uma caixa. A caixa tem conteúdo, padding, border e margin.

Padding aumenta o espaço interno. Border desenha a borda. Margin cria espaço externo entre elementos. Com box-sizing: border-box, largura e altura ficam mais previsíveis porque padding e border entram na conta.

Dominar o Box Model evita layouts quebrados e espaçamentos estranhos.`,
      starterCode: ".card {\n  width: 240px;\n  /* complete o box model */\n}\n",
      solution: ".card {\n  width: 240px;\n  padding: 16px;\n  border: 1px solid #ddd;\n  margin: 12px;\n  box-sizing: border-box;\n}",
      expectedOutput: "box-sizing",
      hints: ["Use padding para espaço interno.", "Use margin para espaço externo.", "Adicione box-sizing: border-box."],
      xpReward: 15,
      quiz: [
        makeQuiz("Qual propriedade cria espaço interno?", ["margin", "padding", "border", "display"], 1, "padding cria espaço entre conteúdo e borda."),
      ],
    }),
    createLesson({
      id: "4-foundation-typography",
      title: "Cores e Tipografia",
      description: "Organize leitura, contraste e hierarquia visual antes de criar componentes avançados.",
      theory: `# Cores e tipografia

Interface boa começa com leitura. Tamanho, peso, altura de linha e contraste ajudam o usuário a entender o que importa.

Use font-size para tamanho, font-weight para peso, line-height para respiro e color/background para contraste. Evite depender só de cor para comunicar estado.

Esse fundamento prepara cards, dashboards, formulários e landing pages mais profissionais.`,
      starterCode: ".titulo {\n  /* configure a leitura */\n}\n",
      solution: ".titulo {\n  font-size: 24px;\n  font-weight: 700;\n  line-height: 1.2;\n  color: #1f2937;\n}",
      expectedOutput: "font-size",
      hints: ["Defina font-size.", "Use font-weight para hierarquia.", "line-height melhora leitura."],
      xpReward: 15,
      quiz: [
        makeQuiz("O que line-height controla?", ["Altura entre linhas", "Largura do elemento", "Cor do texto", "Tipo de display"], 0, "line-height controla o espaçamento vertical entre linhas."),
      ],
    }),
    createLesson({
      id: "4-foundation-display",
      title: "Display e Espaçamento",
      description: "Compare block, inline e flex para entender como elementos ocupam espaço.",
      theory: `# Display

display define como o elemento participa do layout. Elementos block ocupam a linha inteira. Elementos inline ocupam só o conteúdo. Flex organiza filhos em linha ou coluna.

Antes de usar Flexbox para tudo, entenda o comportamento padrão. Isso evita soluções exageradas e deixa o CSS mais limpo.

Espaçamento consistente vem de gap, margin e padding usados com intenção.`,
      starterCode: ".menu {\n  /* organize os links em linha */\n}\n",
      solution: ".menu {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n}",
      expectedOutput: "display: flex",
      hints: ["Use display: flex.", "gap cria espaço entre filhos.", "align-items alinha no eixo cruzado."],
      xpReward: 15,
      quiz: [
        makeQuiz("Qual propriedade cria espaço entre itens flex?", ["margin-only", "gap", "padding-left", "border-spacing"], 1, "gap cria espaço entre os filhos em layouts flex e grid."),
      ],
    }),
  ];
}

function createReactFoundationBridge(): Lesson[] {
  return [
    createLesson({
      id: "3-foundation-events",
      title: "Eventos e Renderização Condicional",
      description: "Faça a interface reagir a cliques e escolha o que aparece na tela.",
      theory: `# Eventos e renderização condicional

React brilha quando a interface reage ao usuário. Eventos como onClick chamam funções. Estado guarda o que mudou. Renderização condicional decide o que mostrar.

O fluxo mental é: usuário faz algo, o estado muda, o componente renderiza novamente com a nova informação.

Antes de context, reducer ou rotas, esse ciclo precisa estar claro.`,
      starterCode: 'import { useState } from "react";\n\nfunction Aviso() {\n  const [aberto, setAberto] = useState(false);\n  // renderize o aviso quando aberto for true\n}\n',
      solution: 'import { useState } from "react";\n\nfunction Aviso() {\n  const [aberto, setAberto] = useState(false);\n  return <button onClick={() => setAberto(true)}>{aberto ? "Aberto" : "Abrir"}</button>;\n}',
      expectedOutput: "onClick",
      hints: ["Use onClick no botão.", "Atualize o estado com setAberto(true).", "Use operador ternário para trocar o texto."],
      xpReward: 20,
      quiz: [
        makeQuiz("O que acontece quando o estado muda?", ["React renderiza de novo", "O navegador fecha", "O CSS é apagado", "A prop vira estado"], 0, "Mudanças de estado fazem o componente renderizar com novos dados."),
      ],
    }),
    createLesson({
      id: "3-foundation-forms",
      title: "Formulários Controlados",
      description: "Conecte input e estado para preparar formulários reais.",
      theory: `# Formulários controlados

Um formulário controlado tem o valor do input guardado no estado. O input mostra value={nome} e atualiza com onChange.

Essa abordagem permite validar, limpar, enviar e reutilizar dados com previsibilidade. É uma ponte essencial antes de autenticação, filtros e dashboards.

Se o usuário digita, o estado acompanha. Se o estado muda, o input mostra o novo valor.`,
      starterCode: 'import { useState } from "react";\n\nfunction Formulario() {\n  const [nome, setNome] = useState("");\n  // crie o input controlado\n}\n',
      solution: 'import { useState } from "react";\n\nfunction Formulario() {\n  const [nome, setNome] = useState("");\n  return <input value={nome} onChange={(event) => setNome(event.target.value)} />;\n}',
      expectedOutput: "onChange",
      hints: ["Use value={nome}.", "Use onChange para atualizar.", "event.target.value contém o texto digitado."],
      xpReward: 20,
      quiz: [
        makeQuiz("Qual evento acompanha a digitação no input?", ["onClick", "onSubmit", "onChange", "onLoad"], 2, "onChange dispara quando o valor do campo muda."),
      ],
    }),
    createLesson({
      id: "3-foundation-typed-props",
      title: "Props Tipadas",
      description: "Use TypeScript para deixar entradas de componentes mais claras.",
      theory: `# Props tipadas

Props são entradas de componentes. TypeScript ajuda a documentar e validar essas entradas antes do app rodar.

Crie um type ou interface para dizer quais props existem e seus tipos. Isso melhora autocomplete, evita erros e torna componentes reutilizáveis.

Em apps maiores, props tipadas são parte da qualidade da interface.`,
      starterCode: "type CardProps = {\n  titulo: string;\n};\n\n// Crie um componente que recebe titulo\n",
      solution: "type CardProps = {\n  titulo: string;\n};\n\nfunction Card({ titulo }: CardProps) {\n  return <h2>{titulo}</h2>;\n}",
      expectedOutput: "CardProps",
      hints: ["Use CardProps no parâmetro.", "Desestruture { titulo }.", "Retorne o título no JSX."],
      xpReward: 20,
      quiz: [
        makeQuiz("Por que tipar props?", ["Para evitar clareza", "Para documentar entradas", "Para remover JSX", "Para trocar CSS"], 1, "Tipos deixam explícito o contrato do componente."),
      ],
    }),
  ];
}

function createNodeFoundationBridge(): Lesson[] {
  return [
    createLesson({
      id: "5-foundation-npm",
      title: "npm, Scripts e Pacotes",
      description: "Entenda como projetos Node organizam dependências antes de criar APIs.",
      theory: `# npm e scripts

Node usa npm para instalar pacotes e rodar scripts. O arquivo package.json descreve o projeto, dependências e comandos.

Scripts como npm run dev e npm test padronizam tarefas do time. Antes de Express, é importante saber onde ficam comandos e bibliotecas.

Essa base deixa o backend mais previsível e profissional.`,
      starterCode: '{\n  "scripts": {\n    // adicione um script dev\n  }\n}\n',
      solution: '{\n  "scripts": {\n    "dev": "node server.js"\n  }\n}',
      expectedOutput: '"dev"',
      hints: ["Scripts ficam dentro de scripts.", "Crie a chave dev.", "O comando pode ser node server.js."],
      xpReward: 15,
      quiz: [
        makeQuiz("Onde ficam scripts de npm?", ["README.md", "package.json", "server.js", ".env"], 1, "package.json guarda scripts, dependências e metadados."),
      ],
    }),
    createLesson({
      id: "5-foundation-http",
      title: "HTTP: Request e Response",
      description: "Leia o ciclo de uma API antes de escrever rotas com Express.",
      theory: `# HTTP

Uma API recebe uma request e devolve uma response. A request contém método, rota, headers e, às vezes, body. A response devolve status e dados.

Express facilita esse ciclo, mas a ideia base continua a mesma: alguém pede algo, o servidor processa e responde.

Quando essa lógica está clara, rotas, middlewares e controllers deixam de parecer mágica.`,
      starterCode: 'const rota = "/tarefas";\nconst metodo = "GET";\n// Mostre a combinação método + rota\n',
      solution: 'const rota = "/tarefas";\nconst metodo = "GET";\nconsole.log(`${metodo} ${rota}`);',
      expectedOutput: "GET /tarefas",
      hints: ["Use template literal.", "Combine método e rota.", "Mostre com console.log()."],
      xpReward: 15,
      quiz: [
        makeQuiz("O que uma response devolve?", ["Status e dados", "Apenas CSS", "Um commit", "Um branch"], 0, "A resposta HTTP devolve status, headers e corpo de dados."),
      ],
    }),
  ];
}

function createSqlFoundationBridge(): Lesson[] {
  return [
    createLesson({
      id: "6-foundation-modeling",
      title: "Tabelas, Linhas e Chaves",
      description: "Entenda como dados são organizados antes de consultar e alterar registros.",
      theory: `# Modelagem básica

Banco relacional organiza dados em tabelas. Cada linha é um registro e cada coluna é uma informação. Chave primária identifica uma linha. Chave estrangeira conecta tabelas.

Antes de escrever JOIN, vale entender qual dado pertence a qual tabela e como uma tabela se relaciona com outra.

Essa visão evita consultas decoradas e ajuda a modelar sistemas reais.`,
      starterCode: "-- Crie uma tabela simples de alunos com id e nome\n",
      solution: "CREATE TABLE alunos (\n  id INTEGER PRIMARY KEY,\n  nome TEXT NOT NULL\n);",
      expectedOutput: "PRIMARY KEY",
      hints: ["Use CREATE TABLE.", "id deve ser PRIMARY KEY.", "nome pode ser TEXT NOT NULL."],
      xpReward: 15,
      quiz: [
        makeQuiz("Para que serve uma chave primária?", ["Identificar uma linha", "Apagar tabela", "Ordenar CSS", "Criar branch"], 0, "A chave primária identifica cada registro de forma única."),
      ],
    }),
    createLesson({
      id: "6-foundation-constraints",
      title: "Constraints e Integridade",
      description: "Use regras como NOT NULL e UNIQUE para proteger os dados.",
      theory: `# Constraints

Constraints são regras do banco. NOT NULL impede valor vazio. UNIQUE impede duplicidade. PRIMARY KEY identifica registros. FOREIGN KEY preserva relações.

Aplicar regras no banco evita dados inválidos mesmo quando a aplicação falha.

Em sistemas reais, integridade de dados é tão importante quanto escrever a consulta certa.`,
      starterCode: "-- Crie uma tabela usuarios com email único\n",
      solution: "CREATE TABLE usuarios (\n  id INTEGER PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL\n);",
      expectedOutput: "UNIQUE",
      hints: ["Use UNIQUE no email.", "Use NOT NULL para campo obrigatório.", "Use PRIMARY KEY no id."],
      xpReward: 15,
      quiz: [
        makeQuiz("Qual constraint evita duplicidade?", ["NOT NULL", "UNIQUE", "WHERE", "ORDER BY"], 1, "UNIQUE impede que dois registros tenham o mesmo valor naquela coluna."),
      ],
    }),
  ];
}

function createGitFoundationBridge(): Lesson[] {
  return [
    createLesson({
      id: "7-foundation-status-add",
      title: "status, add e diff",
      description: "Veja, prepare e compare mudanças antes de entrar em branches.",
      theory: `# Status, add e diff

git status mostra o estado do repositório. git diff mostra o que mudou. git add prepara arquivos para o próximo commit.

Esse trio é o painel de controle do Git. Antes de branch, merge e rebase, o aluno precisa saber enxergar o que está prestes a registrar.

Um bom fluxo é: status, diff, add, commit.`,
      starterCode: "# Escreva o comando que mostra arquivos alterados\n",
      solution: "git status",
      expectedOutput: "git status",
      hints: ["O comando começa com git.", "status mostra o estado atual.", "Use git status."],
      xpReward: 10,
      quiz: [
        makeQuiz("Qual comando mostra o estado do repositório?", ["git add", "git status", "git merge", "git push"], 1, "git status mostra arquivos alterados, staged e branch atual."),
      ],
    }),
    createLesson({
      id: "7-foundation-remote",
      title: "Remotos, push e pull",
      description: "Conecte o repositório local ao GitHub antes de abrir pull requests.",
      theory: `# Remotos

Um remoto é uma cópia do repositório em outro lugar, normalmente no GitHub. origin costuma ser o nome padrão.

git push envia commits locais. git pull busca commits remotos e integra ao seu trabalho. Pull request é uma conversa sobre mudanças, mas depende desse fluxo básico.

Sem entender remoto, PR vira ritual decorado.`,
      starterCode: "# Escreva o comando para enviar commits da branch main\n",
      solution: "git push origin main",
      expectedOutput: "git push origin main",
      hints: ["Use git push.", "Informe o remoto origin.", "Informe a branch main."],
      xpReward: 15,
      quiz: [
        makeQuiz("O que git push faz?", ["Envia commits", "Apaga branch", "Cria CSS", "Roda testes"], 0, "git push envia commits locais para o remoto."),
      ],
    }),
  ];
}

function createLogicFoundationsCourse(): Course {
  return {
    id: "10",
    title: "Lógica de Programação",
    language: "Lógica",
    emoji: "🧠",
    level: "Iniciante",
    duration: "18h",
    students: 8900,
    progress: 0,
    color: "quest-green",
    tags: ["Base", "Recomendado"],
    description: "Aprenda a pensar em passos, entradas, decisões, repetições e decomposição antes de escolher uma linguagem.",
    lessons: [
      createLesson({
        id: "10-1",
        title: "O que é um Algoritmo",
        description: "Transforme uma tarefa do mundo real em uma sequência clara de passos.",
        theory: `# Algoritmo

Um algoritmo é uma sequência de passos para resolver um problema. Não precisa começar com código. Antes de programar, você pode descrever o caminho em linguagem natural.

Exemplo: para fazer café, você separa água, aquece, coloca pó, filtra e serve. Em programação acontece o mesmo: você organiza a tarefa em etapas pequenas e verificáveis.

Pensar em algoritmo evita sair digitando sem saber o objetivo.`,
        starterCode: '# Complete a ideia com print\n# Passo 1: entender o problema\n',
        solution: 'print("entender o problema")',
        expectedOutput: "entender o problema",
        hints: ["Use print().", "Mostre o primeiro passo.", "O texto esperado é entender o problema."],
        xpReward: 10,
        quiz: [
          makeQuiz("O que é um algoritmo?", ["Uma sequência de passos", "Uma cor de tela", "Um banco de dados", "Um erro"], 0, "Algoritmo é um conjunto de passos para resolver um problema."),
        ],
      }),
      createLesson({
        id: "10-2",
        title: "Entrada, Processamento e Saída",
        description: "Separe o que entra, o que o programa faz e o que ele devolve.",
        theory: `# Entrada, processamento e saída

Quase todo programa pode ser lido em três partes. Entrada são os dados recebidos. Processamento é a transformação. Saída é o resultado.

Em um app de notas, a entrada são as notas, o processamento calcula a média, e a saída informa se o aluno passou.

Esse modelo ajuda a entender qualquer exercício sem travar na sintaxe.`,
        starterCode: "nota1 = 7\nnota2 = 9\n# calcule a média\n",
        solution: 'nota1 = 7\nnota2 = 9\nmedia = (nota1 + nota2) / 2\nprint(media)',
        expectedOutput: "8",
        hints: ["Some as duas notas.", "Divida por 2.", "Mostre a média."],
        xpReward: 10,
        quiz: [
          makeQuiz("No cálculo de média, as notas são o quê?", ["Entrada", "Saída", "Erro", "Layout"], 0, "As notas entram no programa para serem processadas."),
        ],
      }),
      createLesson({
        id: "10-3",
        title: "Variáveis como Caixinhas",
        description: "Guarde valores com nomes claros para reutilizar depois.",
        theory: `# Variáveis

Variável é um nome para um valor. Ela deixa o raciocínio mais claro porque você passa a falar de nome, idade, total ou status em vez de repetir valores soltos.

O nome da variável deve explicar o papel daquele dado. total é melhor que x quando o valor representa um total.

Boa lógica começa com nomes bons.`,
        starterCode: "# Crie uma variável chamada objetivo\n",
        solution: 'objetivo = "aprender lógica"\nprint(objetivo)',
        expectedOutput: "aprender lógica",
        hints: ["Use objetivo = ...", "Texto precisa estar entre aspas.", "Mostre com print()."],
        xpReward: 10,
        quiz: [
          makeQuiz("Por que nomes claros ajudam?", ["Facilitam leitura", "Diminuem a tela", "Mudam a linguagem", "Criam internet"], 0, "Nomes claros revelam a intenção do dado."),
        ],
      }),
      createLesson({
        id: "10-4",
        title: "Decisões com Se/Senão",
        description: "Escolha caminhos diferentes usando condições.",
        theory: `# Decisões

Programas precisam decidir. Se a senha está correta, entra. Senão, mostra erro. Se o carrinho está vazio, bloqueia a compra. Senão, continua.

Ao montar uma condição, escreva primeiro a regra em português. Depois traduza para comparação.

Esse padrão aparece em todos os apps reais.`,
        starterCode: 'idade = 16\n# se idade for 16 ou mais, mostre "pode começar"\n',
        solution: 'idade = 16\nif idade >= 16:\n    print("pode começar")\nelse:\n    print("aguarde")',
        expectedOutput: "pode começar",
        hints: ["Use if idade >= 16.", "Não esqueça dos dois pontos.", "Use else para o caso contrário."],
        xpReward: 15,
        quiz: [
          makeQuiz("Quando usamos uma condição?", ["Quando há decisão", "Quando só existe texto", "Para escolher cor aleatória", "Para apagar dados"], 0, "Condições são usadas quando o programa precisa escolher um caminho."),
        ],
      }),
      createLesson({
        id: "10-5",
        title: "Repetição sem Copiar Código",
        description: "Use repetição quando uma ação precisa acontecer várias vezes.",
        theory: `# Repetição

Se você precisa fazer a mesma ação muitas vezes, use repetição. Copiar e colar linhas torna o código frágil.

O segredo é identificar o padrão: o que muda em cada repetição e o que permanece igual?

Loops aparecem em listas de produtos, placares, formulários, arquivos e jogos.`,
        starterCode: "# Mostre os números de 1 a 3\n",
        solution: "for numero in range(1, 4):\n    print(numero)",
        expectedOutput: "3",
        hints: ["Use range(1, 4).", "O final do range fica de fora.", "Mostre numero dentro do loop."],
        xpReward: 15,
        quiz: [
          makeQuiz("Qual problema loops resolvem?", ["Repetição", "Cor de fundo", "Login automático", "Instalação"], 0, "Loops evitam repetir manualmente a mesma ação."),
        ],
      }),
      createLesson({
        id: "10-6",
        title: "Listas de Coisas",
        description: "Agrupe vários valores para percorrer, contar e transformar.",
        theory: `# Listas

Lista é uma coleção de valores. Em vez de criar fruta1, fruta2 e fruta3, você cria uma lista chamada frutas.

Depois você pode contar itens, acessar posições e repetir uma ação para cada item.

Listas são a ponte entre exercícios pequenos e apps com muitos dados.`,
        starterCode: "# Crie uma lista com três tarefas e mostre a quantidade\n",
        solution: 'tarefas = ["ler", "praticar", "revisar"]\nprint(len(tarefas))',
        expectedOutput: "3",
        hints: ["Use colchetes para a lista.", "Coloque três textos.", "Use len(tarefas)."],
        xpReward: 15,
        quiz: [
          makeQuiz("Para que serve uma lista?", ["Guardar vários valores", "Criar uma cor", "Apagar arquivos", "Abrir navegador"], 0, "Listas agrupam vários valores relacionados."),
        ],
      }),
      createLesson({
        id: "10-7",
        title: "Funções e Decomposição",
        description: "Quebre um problema em partes menores com nomes claros.",
        theory: `# Funções e decomposição

Decompor é dividir um problema grande em partes pequenas. Funções dão nome a essas partes.

Em vez de resolver tudo em uma linha enorme, crie funções como calcular_total, validar_email ou mostrar_resultado.

Isso deixa o raciocínio mais fácil de testar, corrigir e explicar.`,
        starterCode: "# Crie uma função dobro\n",
        solution: "def dobro(numero):\n    return numero * 2\n\nprint(dobro(5))",
        expectedOutput: "10",
        hints: ["Comece com def dobro(numero):", "Use return numero * 2.", "Chame dobro(5)."],
        xpReward: 20,
        quiz: [
          makeQuiz("O que é decompor um problema?", ["Dividir em partes menores", "Misturar tudo", "Remover nomes", "Pular teste"], 0, "Decomposição transforma um problema grande em passos menores."),
        ],
      }),
      createLesson({
        id: "10-8",
        title: "Depuração: Encontrando o Erro",
        description: "Aprenda a investigar valores e corrigir raciocínio passo a passo.",
        theory: `# Depuração

Depurar é investigar o que o programa está fazendo. O erro nem sempre está onde parece. Por isso, você testa hipóteses e observa valores.

Uma técnica simples é imprimir valores intermediários. Outra é ler o código em voz alta, linha por linha.

Bons programadores não acertam sempre de primeira. Eles sabem investigar.`,
        starterCode: 'preco = 10\nquantidade = 3\n# mostre o total correto\n',
        solution: 'preco = 10\nquantidade = 3\ntotal = preco * quantidade\nprint(total)',
        expectedOutput: "30",
        hints: ["Multiplique preço por quantidade.", "Guarde em total.", "Mostre total."],
        xpReward: 20,
        quiz: [
          makeQuiz("O que é depurar?", ["Investigar e corrigir erros", "Decorar respostas", "Ignorar saídas", "Apagar o projeto"], 0, "Depuração é o processo de entender e corrigir problemas."),
        ],
      }),
    ],
  };
}

function createReactNativeCourse(): Course {
  return {
    id: "11",
    title: "React Native Essencial",
    language: "React Native",
    emoji: "📱",
    level: "Intermediário",
    duration: "24h",
    students: 4200,
    progress: 0,
    color: "quest-blue",
    tags: ["Mobile", "Novo"],
    description: "Leve a base de React para interfaces mobile com componentes nativos, estado, listas e navegação.",
    lessons: [
      createLesson({
        id: "11-1",
        title: "View, Text e StyleSheet",
        description: "Entenda os componentes base de tela no React Native.",
        theory: `# Componentes nativos

React Native não usa div e p. Ele usa View para containers, Text para textos e StyleSheet para estilos.

A lógica de componentes continua parecida com React, mas os elementos renderizados são nativos do celular.

Comece simples: uma View contendo um Text.`,
        starterCode: 'import { View, Text } from "react-native";\n\nexport default function App() {\n  // retorne uma View com um Text\n}\n',
        solution: 'import { View, Text } from "react-native";\n\nexport default function App() {\n  return <View><Text>Olá, mobile!</Text></View>;\n}',
        expectedOutput: "Text",
        hints: ["Use View como container.", "Use Text para texto.", "Retorne JSX."],
        xpReward: 15,
        quiz: [makeQuiz("Qual componente exibe texto?", ["View", "Text", "Image", "Button"], 1, "Text é o componente de texto no React Native.")],
      }),
      createLesson({
        id: "11-2",
        title: "Estilos no Mobile",
        description: "Use StyleSheet para criar estilos previsíveis.",
        theory: `# StyleSheet

No React Native, estilos são objetos JavaScript. StyleSheet.create ajuda a organizar esses objetos.

Muitas propriedades lembram CSS, mas os nomes usam camelCase, como backgroundColor e fontSize.

Essa base prepara telas mais consistentes.`,
        starterCode: 'import { StyleSheet } from "react-native";\n\n// Crie styles.container\n',
        solution: 'import { StyleSheet } from "react-native";\n\nconst styles = StyleSheet.create({\n  container: {\n    padding: 16,\n    backgroundColor: "#fff"\n  }\n});',
        expectedOutput: "StyleSheet.create",
        hints: ["Use StyleSheet.create().", "Crie a chave container.", "Use backgroundColor em camelCase."],
        xpReward: 15,
        quiz: [makeQuiz("Como escrevemos background-color em React Native?", ["background-color", "backgroundColor", "bgColor", "background"], 1, "Estilos em objetos usam camelCase.")],
      }),
      createLesson({
        id: "11-3",
        title: "Estado e Botões",
        description: "Controle uma interação simples com useState e Button.",
        theory: `# Estado no mobile

useState funciona no React Native como funciona no React. O usuário toca, o estado muda e a tela atualiza.

Botões simples podem usar o componente Button com a prop onPress.

Esse padrão aparece em contadores, favoritos, checklists e formulários.`,
        starterCode: 'import { useState } from "react";\nimport { Button, Text } from "react-native";\n\n// Crie contador com onPress\n',
        solution: 'import { useState } from "react";\nimport { Button, Text } from "react-native";\n\nfunction Contador() {\n  const [total, setTotal] = useState(0);\n  return <><Text>{total}</Text><Button title="Somar" onPress={() => setTotal(total + 1)} /></>;\n}',
        expectedOutput: "onPress",
        hints: ["Use useState(0).", "Button usa onPress.", "Atualize com setTotal(total + 1)."],
        xpReward: 20,
        quiz: [makeQuiz("Qual evento de toque é comum no React Native?", ["onClick", "onPress", "onHover", "onRoute"], 1, "onPress é usado em botões e componentes tocáveis.")],
      }),
      createLesson({
        id: "11-4",
        title: "Listas com FlatList",
        description: "Renderize coleções de dados de forma eficiente.",
        theory: `# FlatList

FlatList renderiza listas no React Native com melhor performance que map em telas grandes.

Você passa data e renderItem. Cada item precisa de uma chave, geralmente via keyExtractor.

Listas são essenciais em apps de tarefas, chats, feeds e catálogos.`,
        starterCode: 'import { FlatList, Text } from "react-native";\nconst tarefas = ["Estudar", "Praticar"];\n// Renderize a lista\n',
        solution: 'import { FlatList, Text } from "react-native";\nconst tarefas = ["Estudar", "Praticar"];\n<FlatList data={tarefas} renderItem={({ item }) => <Text>{item}</Text>} />;',
        expectedOutput: "FlatList",
        hints: ["Use data={tarefas}.", "Use renderItem.", "Mostre item dentro de Text."],
        xpReward: 20,
        quiz: [makeQuiz("Qual componente é indicado para listas?", ["FlatList", "Paragraph", "Table", "Canvas"], 0, "FlatList é o componente de lista do React Native.")],
      }),
      createLesson({
        id: "11-5",
        title: "Navegação entre Telas",
        description: "Entenda a ideia de separar o app em telas conectadas.",
        theory: `# Navegação

Apps mobile são compostos por telas. A navegação controla para onde o usuário vai: Home, Detalhes, Perfil, Configurações.

Bibliotecas como React Navigation organizam stacks, tabs e drawers. A ideia base é simples: uma ação muda a tela atual.

Antes de configurar uma biblioteca, entenda nomes de telas e fluxo de usuário.`,
        starterCode: 'const telas = ["Home", "Detalhes"];\n// Mostre a primeira tela\n',
        solution: 'const telas = ["Home", "Detalhes"];\nconsole.log(telas[0]);',
        expectedOutput: "Home",
        hints: ["A primeira posição é 0.", "Use telas[0].", "Mostre com console.log()."],
        xpReward: 20,
        quiz: [makeQuiz("Para que serve navegação?", ["Trocar telas", "Criar banco", "Estilizar fonte", "Instalar Git"], 0, "Navegação controla o fluxo entre telas.")],
      }),
    ],
  };
}

function createDataAiCourse(): Course {
  return {
    id: "12",
    title: "Dados e IA com Python",
    language: "Dados e IA",
    emoji: "📊",
    level: "Intermediário",
    duration: "28h",
    students: 5100,
    progress: 0,
    color: "quest-purple",
    tags: ["Dados", "IA"],
    description: "Use Python para limpar dados, calcular métricas, ler arquivos e entender como preparar prompts e automações com IA.",
    lessons: [
      createLesson({
        id: "12-1",
        title: "Dados como Tabelas",
        description: "Pense em linhas, colunas e registros antes de automatizar análises.",
        theory: `# Dados tabulares

Muitos problemas de dados começam como uma tabela: cada linha é um registro e cada coluna é uma característica.

Antes de IA, dashboard ou automação, você precisa entender qual dado existe, o que cada coluna significa e qual pergunta quer responder.

Boas perguntas geram boas análises.`,
        starterCode: 'vendas = [100, 80, 120]\n# calcule o total\n',
        solution: 'vendas = [100, 80, 120]\nprint(sum(vendas))',
        expectedOutput: "300",
        hints: ["Use sum(vendas).", "Mostre o total.", "A soma é 300."],
        xpReward: 15,
        quiz: [makeQuiz("Em uma tabela, uma linha representa geralmente o quê?", ["Um registro", "Uma cor", "Uma função", "Uma branch"], 0, "Cada linha costuma representar um registro ou evento.")],
      }),
      createLesson({
        id: "12-2",
        title: "Limpeza de Dados",
        description: "Remova espaços e normalize textos antes de analisar.",
        theory: `# Limpeza de dados

Dados reais vêm bagunçados: espaços extras, letras maiúsculas misturadas, campos vazios e formatos diferentes.

Limpar dados é preparar entradas para que cálculos e automações sejam confiáveis.

Em Python, métodos como strip() e lower() resolvem muitos casos simples.`,
        starterCode: 'nome = "  ANA  "\n# limpe e deixe minúsculo\n',
        solution: 'nome = "  ANA  "\nprint(nome.strip().lower())',
        expectedOutput: "ana",
        hints: ["Use strip() para espaços.", "Use lower() para minúsculas.", "Encadeie os métodos."],
        xpReward: 15,
        quiz: [makeQuiz("O que strip() remove?", ["Espaços das pontas", "Números", "Arquivos", "Linhas da tabela"], 0, "strip() remove espaços no início e fim do texto.")],
      }),
      createLesson({
        id: "12-3",
        title: "Métricas Simples",
        description: "Calcule total, média, maior e menor valor.",
        theory: `# Métricas

Métricas resumem dados. Total mostra volume, média mostra tendência, máximo e mínimo mostram extremos.

Antes de criar modelos ou gráficos, confirme se as métricas básicas fazem sentido.

Análise boa começa simples e verificável.`,
        starterCode: 'notas = [8, 7, 10]\n# calcule a média\n',
        solution: 'notas = [8, 7, 10]\nmedia = sum(notas) / len(notas)\nprint(media)',
        expectedOutput: "8.333",
        hints: ["Some com sum().", "Divida por len().", "Guarde em media."],
        xpReward: 20,
        quiz: [makeQuiz("Qual função conta itens em uma lista?", ["sum", "len", "max", "min"], 1, "len(lista) retorna a quantidade de itens.")],
      }),
      createLesson({
        id: "12-4",
        title: "Prompt como Especificação",
        description: "Aprenda a pedir respostas melhores para ferramentas de IA.",
        theory: `# Prompt

Um prompt bom é uma especificação clara. Ele diz objetivo, contexto, formato esperado e restrições.

Em vez de pedir "analise isso", diga qual dado será analisado, que tipo de insight procura e como a resposta deve ser estruturada.

IA funciona melhor quando você dá direção, exemplos e critérios de qualidade.`,
        starterCode: 'objetivo = "resumir vendas"\nformato = "3 tópicos"\n# monte o prompt\n',
        solution: 'objetivo = "resumir vendas"\nformato = "3 tópicos"\nprint(f"Objetivo: {objetivo}. Formato: {formato}.")',
        expectedOutput: "Objetivo:",
        hints: ["Use f-string.", "Inclua objetivo e formato.", "Mostre o prompt."],
        xpReward: 20,
        quiz: [makeQuiz("O que melhora um prompt?", ["Objetivo e formato claros", "Menos contexto sempre", "Texto aleatório", "Remover restrições"], 0, "Objetivo, contexto e formato esperado ajudam a IA a responder melhor.")],
      }),
      createLesson({
        id: "12-5",
        title: "Automação de Relatórios",
        description: "Monte uma saída clara a partir de dados calculados.",
        theory: `# Relatórios automáticos

Automação transforma dados em uma saída repetível. O programa calcula, formata e entrega sempre do mesmo jeito.

Um relatório simples pode mostrar total, média e alerta. Depois você pode salvar em arquivo, enviar email ou conectar com uma API.

O importante é deixar cada etapa verificável.`,
        starterCode: 'total = 300\nmedia = 100\n# gere uma mensagem de relatório\n',
        solution: 'total = 300\nmedia = 100\nprint(f"Relatório: total {total}, média {media}")',
        expectedOutput: "Relatório:",
        hints: ["Use f-string.", "Inclua total e média.", "Comece com Relatório:"],
        xpReward: 20,
        quiz: [makeQuiz("Por que automatizar relatórios?", ["Para repetir com consistência", "Para evitar dados", "Para esconder cálculos", "Para remover contexto"], 0, "Automação torna tarefas repetíveis e consistentes.")],
      }),
    ],
  };
}

function createGameDevCourse(): Course {
  return {
    id: "13",
    title: "Jogos com JavaScript",
    language: "Jogos",
    emoji: "🎮",
    level: "Iniciante",
    duration: "20h",
    students: 4700,
    progress: 0,
    color: "quest-pink",
    tags: ["Jogos", "Criativo"],
    description: "Crie a lógica de jogos simples com estado, regras, eventos, pontuação e loop de atualização.",
    lessons: [
      createLesson({
        id: "13-1",
        title: "Estado do Jogo",
        description: "Modele pontuação, vidas e fase atual.",
        theory: `# Estado do jogo

Todo jogo tem estado: pontuação, vidas, posição, fase, tempo e inventário. O estado descreve como o jogo está agora.

Cada ação muda o estado. Quando o jogador acerta, a pontuação sobe. Quando erra, perde vida.

Modelar estado é o primeiro passo para criar regras claras.`,
        starterCode: "// Crie um objeto jogo com pontos e vidas\n",
        solution: "const jogo = { pontos: 0, vidas: 3 };\nconsole.log(jogo.vidas);",
        expectedOutput: "3",
        hints: ["Use um objeto.", "Crie pontos e vidas.", "Mostre jogo.vidas."],
        xpReward: 15,
        quiz: [makeQuiz("O que o estado representa?", ["Como o jogo está agora", "A fonte do texto", "Um commit", "Uma tabela SQL"], 0, "Estado é o conjunto de valores atuais do jogo.")],
      }),
      createLesson({
        id: "13-2",
        title: "Regras de Pontuação",
        description: "Transforme eventos do jogo em mudança de pontos.",
        theory: `# Regras

Regras conectam ações a consequências. Se acertar, soma pontos. Se errar, perde vida. Se chegar a zero vidas, acaba.

Regras pequenas são mais fáceis de testar que uma regra gigante.

Essa lógica aparece em quizzes, plataformas gamificadas e jogos reais.`,
        starterCode: "let pontos = 0;\nconst acertou = true;\n// some 10 pontos se acertou\n",
        solution: "let pontos = 0;\nconst acertou = true;\nif (acertou) {\n  pontos += 10;\n}\nconsole.log(pontos);",
        expectedOutput: "10",
        hints: ["Use if (acertou).", "Some com pontos += 10.", "Mostre pontos."],
        xpReward: 15,
        quiz: [makeQuiz("Qual estrutura escolhe uma consequência?", ["if", "font-size", "SELECT", "git push"], 0, "if permite executar uma ação se a condição for verdadeira.")],
      }),
      createLesson({
        id: "13-3",
        title: "Loop de Atualização",
        description: "Entenda a ideia de atualizar o jogo em ciclos.",
        theory: `# Loop de jogo

Jogos atualizam muitas vezes: ler entrada, atualizar estado, desenhar resultado. Esse ciclo é o game loop.

Em jogos simples, você pode simular rodadas com um loop comum. Em canvas, esse ciclo costuma usar requestAnimationFrame.

O conceito central é repetir atualização com controle.`,
        starterCode: "// Simule 3 rodadas e mostre 'rodada'\n",
        solution: 'for (let rodada = 1; rodada <= 3; rodada++) {\n  console.log("rodada");\n}',
        expectedOutput: "rodada",
        hints: ["Use for.", "Comece em 1 e vá até 3.", "Mostre a palavra rodada."],
        xpReward: 20,
        quiz: [makeQuiz("O que o game loop faz?", ["Atualiza o jogo em ciclos", "Cria banco", "Remove HTML", "Publica branch"], 0, "O loop mantém o jogo respondendo e atualizando.")],
      }),
      createLesson({
        id: "13-4",
        title: "Eventos do Jogador",
        description: "Reaja a comandos como clique, toque ou tecla.",
        theory: `# Eventos

Jogos respondem ao jogador. Clique, toque e teclado são entradas. O código transforma essa entrada em mudança de estado.

Na web, addEventListener conecta uma ação a uma função.

Sem eventos, o jogo não reage.`,
        starterCode: '// Crie uma função pular que mostra "pulou"\n',
        solution: 'function pular() {\n  console.log("pulou");\n}\npular();',
        expectedOutput: "pulou",
        hints: ["Crie function pular().", "Use console.log.", "Chame pular()."],
        xpReward: 20,
        quiz: [makeQuiz("O que um evento representa?", ["Uma ação do usuário ou sistema", "Uma cor fixa", "Um banco", "Uma branch"], 0, "Eventos são sinais que disparam comportamento.")],
      }),
      createLesson({
        id: "13-5",
        title: "Condição de Vitória",
        description: "Defina quando o jogo termina com sucesso.",
        theory: `# Vitória e fim de jogo

Um jogo precisa saber quando termina. Pode ser por pontuação, tempo, vidas ou objetivo concluído.

Condição de vitória é uma regra clara que transforma estado em resultado.

Sem fim, o jogador não entende o objetivo.`,
        starterCode: "const pontos = 100;\n// mostre venceu se pontos for 100 ou mais\n",
        solution: 'const pontos = 100;\nif (pontos >= 100) {\n  console.log("venceu");\n}',
        expectedOutput: "venceu",
        hints: ["Use if (pontos >= 100).", "Mostre venceu.", "A condição precisa ser verdadeira."],
        xpReward: 20,
        quiz: [makeQuiz("Para que serve condição de vitória?", ["Definir objetivo concluído", "Mudar fonte", "Criar SQL", "Instalar pacote"], 0, "Ela define quando o jogador alcançou o objetivo.")],
      }),
    ],
  };
}

export const courses: Course[] = [
  createLogicFoundationsCourse(),
  {
    id: "1",
    title: "Python do Zero ao Herói",
    language: "Python",
    emoji: "🐍",
    level: "Iniciante",
    duration: "28h",
    students: 12400,
    progress: 65,
    color: "quest-yellow",
    tags: ["Popular", "Novo"],
    description: "Aprenda Python do zero! Variáveis, funções, loops, listas e muito mais.",
    lessons: [
      {
        id: "1-1",
        title: "Olá, Mundo!",
        description: "Seu primeiro programa! Use a função `print()` para exibir a mensagem **\"Olá, Mundo!\"** no console.",
        theory: `# A função print()

## 💡 O que é
\`print()\` é a função do Python que **mostra informações na tela** (no terminal/console). É a primeira ferramenta que você aprende para "conversar" com o computador e ver o que seu código está fazendo.

![Terminal Python mostrando o print](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=300&fit=crop)

## 🌍 Analogia do mundo real
Pense em \`print()\` como o **microfone** do seu programa. Sem ele, o computador "pensa" em silêncio e você nunca descobre o que ele calculou. Quando você fala \`print("Olá")\`, é como apertar o botão do microfone para o público (você) ouvir.

## 🔧 Sintaxe e como funciona
A receita básica:
  print(valor)

• \`print\` → o nome da função (sempre minúsculo).
• \`(\` e \`)\` → os parênteses dizem ao Python "execute essa função".
• \`valor\` → o que você quer mostrar: um texto entre aspas, um número, ou o resultado de uma conta.

## 📚 Exemplos comentados
  print("Olá!")          # mostra: Olá!     (texto entre aspas)
  print('Python')        # mostra: Python   (aspas simples também valem)
  print(42)              # mostra: 42       (número não usa aspas)
  print(2 + 3)           # mostra: 5        (Python calcula antes de mostrar)
  print("A", "B")        # mostra: A B      (vírgula separa com espaço)
  print("Linha 1")
  print("Linha 2")       # cada print pula uma linha automaticamente

## ⚠️ Erros comuns
• **Esquecer os parênteses**: \`print "oi"\` → SyntaxError. Em Python 3, print é função, sempre precisa de \`( )\`.
• **Misturar aspas**: \`print("Olá')\` → SyntaxError. Comece e termine com o mesmo tipo (\`"\` ou \`'\`).
• **Aspas em números quando não deveria**: \`print("2" + "3")\` mostra "23" (junta texto), não 5.

## 🚀 Quando usar na prática
\`print()\` é seu melhor amigo na hora de **depurar** (encontrar bugs). Quando algo não funciona, espalhe \`print()\` pelo código para ver o valor das variáveis em cada etapa. Programadores profissionais usam print o tempo todo para investigar problemas antes de passar para ferramentas mais avançadas.`,
        starterCode: '# Escreva seu código aqui\n',
        solution: 'print("Olá, Mundo!")',
        expectedOutput: "Olá, Mundo!",
        hints: ["Use a função print() para exibir texto", "O texto deve estar entre aspas", 'A resposta é: print("Olá, Mundo!")'],
        xpReward: 10,
        quiz: [
          { question: "Qual função exibe texto no console em Python?", options: ["input()", "print()", "echo()", "write()"], correctIndex: 1, explanation: "print() é a função padrão do Python para saída de texto. input() lê do usuário, echo() é do PHP/shell, e write() não existe como função global." },
          { question: "Como exibir o texto 'Olá' em Python?", options: ["print Olá", "print('Olá')", "console.log('Olá')", "echo 'Olá'"], correctIndex: 1, explanation: "Em Python 3, print() é uma função — sempre precisa de parênteses. console.log é JavaScript e echo é PHP/shell." },
        ],
      },
      {
        id: "1-2",
        title: "Variáveis e Tipos",
        description: "Crie uma variável chamada `nome` com seu nome e outra chamada `idade` com sua idade. Depois use `print()` para exibir: **\"Meu nome é [nome] e tenho [idade] anos\"**.",
        theory: `# Variáveis e Tipos

## 💡 O que é
Uma **variável** é um nome que você dá para um valor guardado na memória do computador. Em vez de repetir o valor toda hora, você usa o nome. O **tipo** descreve a natureza do valor (texto, número inteiro, decimal, verdadeiro/falso).

## 🌍 Analogia do mundo real
Imagine **etiquetas coladas em potes** na cozinha. O pote é a memória do computador, o conteúdo (açúcar, sal, arroz) é o valor, e a etiqueta com o nome é a variável. Quando você fala "me passa o açúcar", ninguém precisa pegar todos os potes — vai direto na etiqueta certa.

## 🔧 Sintaxe e como funciona
A receita é sempre: **nome = valor**
  nome = "Lucas"
  idade = 20

O sinal \`=\` NÃO é "igualdade matemática" — é "atribuição": pega o valor da direita e coloca dentro da variável da esquerda.

**Os 4 tipos básicos:**
• \`str\` (string/texto): sempre entre aspas — \`"Lucas"\`, \`'oi'\`
• \`int\` (inteiro): números sem casas decimais — \`20\`, \`-7\`
• \`float\` (decimal): números com ponto — \`1.75\`, \`3.14\`
• \`bool\` (booleano): só dois valores — \`True\` ou \`False\` (com maiúscula!)

## 📚 Exemplos comentados
  nome = "Ana"              # str — texto entre aspas
  idade = 25                # int — número inteiro
  altura = 1.68             # float — decimal usa PONTO, não vírgula
  ativo = True              # bool — sem aspas, T maiúsculo
  print(type(nome))         # mostra: <class 'str'> (descobre o tipo)

  # f-string: a forma moderna de juntar texto com variáveis
  print(f"Eu sou {nome} e tenho {idade} anos")
  # mostra: Eu sou Ana e tenho 25 anos

  # Dentro de {} pode entrar qualquer expressão Python:
  print(f"Em 5 anos terei {idade + 5}")    # mostra: Em 5 anos terei 30

## ⚠️ Erros comuns
• **Esquecer aspas em texto**: \`nome = Lucas\` → NameError (Python procura uma variável "Lucas").
• **Vírgula em decimal**: \`altura = 1,68\` cria uma tupla (1, 68), não um decimal! Use **ponto**.
• **Esquecer o \`f\`**: \`print("Olá, {nome}")\` mostra literalmente "{nome}", sem trocar pelo valor.
• **\`true\`/\`false\` minúsculo**: dá NameError. Em Python é \`True\` e \`False\` com maiúscula.

## 🚀 Quando usar na prática
Variáveis são **a base de tudo**: armazenar entrada do usuário, guardar resultados de cálculos, manter o estado de um jogo, lembrar a configuração escolhida. Tipos certos evitam bugs (somar dois números é diferente de juntar dois textos!) e facilitam a leitura do código.`,
        starterCode: '# Crie as variáveis e exiba a mensagem\nnome = ""\nidade = 0\n',
        solution: 'nome = "Lucas"\nidade = 20\nprint(f"Meu nome é {nome} e tenho {idade} anos")',
        expectedOutput: "Meu nome é",
        hints: ["Atribua valores às variáveis nome e idade", "Use f-string: f\"texto {variavel}\"", 'print(f"Meu nome é {nome} e tenho {idade} anos")'],
        xpReward: 15,
        quiz: [
          { question: "Qual é o tipo de dado de 'Lucas' em Python?", options: ["int", "float", "str", "bool"], correctIndex: 2, explanation: "str (string) representa texto. int é número inteiro, float é decimal, e bool é True/False. Qualquer valor entre aspas é uma str." },
          { question: "O que o f antes das aspas ativa?", options: ["Formatação automática", "Interpolação de variáveis", "Conversão de tipo", "Modo debug"], correctIndex: 1, explanation: "f-strings (f\"...\") permitem inserir variáveis e expressões Python diretamente dentro do texto usando {chaves}. Ex: f\"Olá, {nome}!\"" },
        ],
      },
      {
        id: "1-3",
        title: "Operações Matemáticas",
        description: "Calcule a **soma**, **subtração**, **multiplicação** e **divisão** de dois números (10 e 3) e exiba cada resultado com `print()`.",
        theory: `# Operações Matemáticas

## 💡 O que é
Python é uma **calculadora poderosa**: tem operadores para fazer todas as contas matemáticas básicas e algumas especiais (resto da divisão, potência). Você pode calcular direto, ou guardar o resultado numa variável para usar depois.

## 🌍 Analogia do mundo real
Pense numa **calculadora científica**. Os botões \`+ - × ÷\` você já conhece. Python adiciona dois botões "secretos" muito úteis: o \`%\` que diz "quanto sobrou da divisão?" (igual quando você divide pizza e fica um pedaço) e o \`**\` que faz potência (multiplicar um número por ele mesmo várias vezes).

## 🔧 Sintaxe e como funciona
Os 7 operadores aritméticos:
• \`+\`  → soma          \`10 + 3\` = 13
• \`-\`  → subtração     \`10 - 3\` = 7
• \`*\`  → multiplicação \`10 * 3\` = 30
• \`/\`  → divisão       \`10 / 3\` = 3.333... (sempre float)
• \`//\` → divisão inteira \`10 // 3\` = 3 (descarta o resto)
• \`%\`  → módulo (resto) \`10 % 3\` = 1
• \`**\` → potência      \`2 ** 3\` = 8

A **ordem das operações** segue a matemática: parênteses → potência → \`*\` \`/\` \`%\` \`//\` → \`+\` \`-\`. Use \`( )\` para forçar a ordem que você quer.

## 📚 Exemplos comentados
  resultado = 10 + 3              # guarda 13 na variável
  print(resultado)                # mostra: 13

  print(7 / 2)                    # 3.5  (sempre vira decimal)
  print(7 // 2)                   # 3    (descarta o ".5")
  print(7 % 2)                    # 1    (sobra 1 ao dividir)

  print(2 + 3 * 4)                # 14   (multiplicação primeiro)
  print((2 + 3) * 4)              # 20   (parênteses forçam soma antes)

  preco = 100
  desconto = 0.15
  final = preco * (1 - desconto)  # 85.0
  print(f"Pagar: R$ {final:.2f}")  # mostra: Pagar: R$ 85.00

## ⚠️ Erros comuns
• **Confundir \`/\` com \`//\`**: \`10 / 2\` dá \`5.0\` (float), \`10 // 2\` dá \`5\` (int). Importa quando você precisa de inteiro.
• **Dividir por zero**: \`10 / 0\` → ZeroDivisionError. Sempre verifique o denominador antes.
• **Esquecer parênteses**: \`100 - 10 * 2\` é \`80\`, não \`180\`. Multiplicação vem primeiro.
• **Misturar tipos sem querer**: \`"5" + 3\` → TypeError. Converta com \`int("5") + 3\`.

## 🚀 Quando usar na prática
Praticamente todo programa faz contas: calcular preço com desconto, converter unidades, calcular médias e estatísticas, ajustar coordenadas em jogos, calcular paginação ("quantas páginas se cada uma tem 10 itens?" → \`total // 10\`). O operador \`%\` é especialmente útil para descobrir se um número é par (\`x % 2 == 0\`) ou para ciclar valores.`,
        starterCode: 'a = 10\nb = 3\n# Calcule e exiba os resultados\n',
        solution: 'a = 10\nb = 3\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a / b)',
        expectedOutput: "13",
        hints: ["Use os operadores +, -, *, /", "Faça um print() para cada operação", "print(a + b) para soma"],
        xpReward: 15,
      },
      {
        id: "1-4",
        title: "Condicionais (if/else)",
        description: "Crie uma variável `nota` com valor 7. Se a nota for >= 7, exiba **\"Aprovado!\"**, senão exiba **\"Reprovado!\"**.",
        theory: `# Condicionais (if / elif / else)

## 💡 O que é
Condicionais permitem que seu programa **tome decisões**. Em vez de executar tudo em sequência, o código escolhe um caminho ou outro dependendo de uma **condição** ser verdadeira ou falsa.

## 🌍 Analogia do mundo real
É exatamente como uma **bifurcação numa estrada com placas**: "Se está chovendo, pegue o caminho coberto; senão, vá pela praia." A condição é a placa; o \`if\` é a decisão; o \`else\` é o "senão". Quando há mais de duas opções (chuva, sol, neblina), entra o \`elif\` ("senão se").

## 🔧 Sintaxe e como funciona
A estrutura básica:
  if condição:
      # bloco que roda se for True
  elif outra_condição:
      # bloco que roda se a primeira foi False mas essa é True
  else:
      # bloco que roda se nenhuma das anteriores foi True

**Operadores de comparação** (sempre devolvem \`True\` ou \`False\`):
• \`==\` igual a       • \`!=\` diferente de
• \`>\`  maior que     • \`<\`  menor que
• \`>=\` maior ou igual • \`<=\` menor ou igual

**Operadores lógicos** para combinar condições:
• \`and\` → as duas precisam ser True
• \`or\`  → pelo menos uma True
• \`not\` → inverte (True vira False)

Dois detalhes que Python EXIGE: os **dois pontos \`:\`** ao final da linha do if/elif/else, e a **indentação de 4 espaços** para indicar o que está dentro do bloco.

## 📚 Exemplos comentados
  temperatura = 30
  if temperatura > 25:
      print("Está quente!")        # roda porque 30 > 25
  else:
      print("Está fresco.")

  nota = 8
  if nota >= 9:
      print("Excelente!")
  elif nota >= 7:
      print("Bom!")                 # roda — pula o if, cai no primeiro elif True
  else:
      print("Precisa melhorar")

  # Combinando condições
  idade = 20
  tem_carteira = True
  if idade >= 18 and tem_carteira:
      print("Pode dirigir")

## ⚠️ Erros comuns
• **Confundir \`=\` com \`==\`**: \`if x = 5:\` → SyntaxError. \`=\` é atribuição, \`==\` é comparação.
• **Esquecer os \`:\`**: \`if x > 5\` (sem dois pontos) → SyntaxError.
• **Indentação errada**: misturar tabs e espaços, ou indentar com 2 espaços onde o resto usa 4 → IndentationError.
• **Cobrir todos os casos**: se você só tem \`if\` e \`elif\` sem \`else\`, e nenhuma condição for True, NADA acontece — é uma fonte clássica de bug silencioso.

## 🚀 Quando usar na prática
Toda lógica de negócio nasce de condicionais: aplicar desconto se o cliente é VIP, mostrar tela de login se o usuário não está autenticado, decidir se um e-mail vai pra caixa de entrada ou pra spam, escolher a mensagem ("Bom dia/Boa tarde/Boa noite") com base na hora. Sempre que o código precisa **escolher**, é if/elif/else.`,
        starterCode: 'nota = 7\n# Use if/else para verificar\n',
        solution: 'nota = 7\nif nota >= 7:\n    print("Aprovado!")\nelse:\n    print("Reprovado!")',
        expectedOutput: "Aprovado!",
        hints: ["Use if nota >= 7:", "Não esqueça dos dois pontos (:) e da indentação", 'if nota >= 7:\n    print("Aprovado!")'],
        xpReward: 20,
        quiz: [
          { question: "O que acontece se a condição do if for falsa?", options: ["O programa para", "Executa o bloco else", "Dá erro", "Pula tudo"], correctIndex: 1, explanation: "Quando a condição do if é False, o Python vai para o bloco else (se existir). Se não houver else, simplesmente pula o bloco if e continua o programa." },
          { question: "Qual operador verifica 'maior ou igual'?", options: [">>", "=>", ">=", "=<"], correctIndex: 2, explanation: ">= é o operador 'maior ou igual a'. Note que o sinal de maior (>) vem antes do igual (=). => não existe em Python — é confundido com JavaScript." },
        ],
      },
      {
        id: "1-5",
        title: "Loops com for",
        description: "Use um loop `for` para exibir os números de **1 a 5**, cada um em uma linha.",
        theory: `# Loops com for

## 💡 O que é
O loop \`for\` **repete um bloco de código para cada item de uma sequência** (lista, texto, range de números). É a ferramenta certa quando você sabe sobre o que iterar — uma lista de e-mails, todas as letras de uma palavra, números de 1 a 100.

## 🌍 Analogia do mundo real
Imagine um **carteiro entregando cartas em uma rua**. Ele não escreve um código diferente para cada casa — ele tem UMA rotina ("toque a campainha, entregue a carta") e repete em cada casa do bairro. O loop \`for\` é a rotina; a sequência (\`range\`, lista, string) é a rua com suas casas.

## 🔧 Sintaxe e como funciona
A receita é:
  for variavel in sequência:
      # código que roda uma vez para cada item

A \`variavel\` recebe o valor de cada item, **um de cada vez**, na ordem.

A função \`range()\` é a fonte mais comum de sequências numéricas:
• \`range(5)\`        → 0, 1, 2, 3, 4 (sempre **começa em 0** e **para antes** do número)
• \`range(1, 6)\`     → 1, 2, 3, 4, 5 (de 1 até 6-1)
• \`range(0, 10, 2)\` → 0, 2, 4, 6, 8 (de 2 em 2 — terceiro argumento é o "passo")

## 📚 Exemplos comentados
  for i in range(3):
      print(i)
  # mostra: 0, 1, 2 (cada um em uma linha)

  for letra in "Python":
      print(letra)
  # mostra: P, y, t, h, o, n (string é iterável)

  cores = ["azul", "vermelho", "verde"]
  for cor in cores:
      print(f"Cor: {cor}")

  # Somando os números de 1 a 10
  total = 0
  for n in range(1, 11):
      total = total + n
  print(total)  # 55

## ⚠️ Erros comuns
• **\`range(1, 5)\` e esperar incluir 5**: o número final fica de fora! Para ir "até 5", use \`range(1, 6)\`.
• **Esquecer dois pontos ou indentação**: mesmas regras do \`if\` — \`:\` no fim e 4 espaços dentro.
• **Modificar a lista enquanto itera**: \`for x in lista: lista.remove(x)\` causa comportamento estranho. Crie uma nova lista em vez disso.
• **Usar \`for\` quando \`while\` seria melhor**: se você não sabe quantas vezes repetir (ex.: "até o usuário digitar sair"), use \`while\`, não \`for\`.

## 🚀 Quando usar na prática
\`for\` é onipresente: processar cada linha de um arquivo, somar todos os pedidos do mês, enviar e-mail para cada inscrito, validar cada campo de um formulário, desenhar cada inimigo de um jogo na tela. Sempre que tem uma **coleção de coisas para tratar uma a uma**, é \`for\`.`,
        starterCode: '# Use for para contar de 1 a 5\n',
        solution: 'for i in range(1, 6):\n    print(i)',
        expectedOutput: "1",
        hints: ["Use range(1, 6) para gerar números de 1 a 5", "for i in range(1, 6):", "print(i) dentro do loop"],
        xpReward: 20,
        quiz: [
          { question: "O que range(1, 6) gera?", options: ["0 a 6", "1 a 6", "1 a 5", "0 a 5"], correctIndex: 2, explanation: "range(início, fim) gera números do início até fim-1. Por isso range(1, 6) gera 1, 2, 3, 4, 5 — o número final (6) fica de fora." },
        ],
      },
      {
        id: "1-6",
        title: "Listas",
        description: "Crie uma lista chamada `frutas` com 3 frutas e use um loop `for` para exibir cada uma.",
        theory: `# Listas

## 💡 O que é
Uma **lista** é uma coleção **ordenada** e **modificável** de itens. Você pode guardar quantos itens quiser, de qualquer tipo (até misturar tipos!), e alterar a coleção depois (adicionar, remover, ordenar).

## 🌍 Analogia do mundo real
Pense numa **lista de compras numerada**: ela tem uma ordem clara (item 1, item 2, item 3...), você pode acrescentar coisas no fim, riscar itens do meio, e contar quantas faltam. Em Python, a numeração começa em **0** (não em 1) — o primeiro item é o de índice 0.

## 🔧 Sintaxe e como funciona
Criando: use **colchetes** \`[ ]\` e separe itens por vírgula.
  frutas = ["maçã", "banana", "uva"]
  numeros = [1, 2, 3, 4, 5]
  mista = ["texto", 42, True, 3.14]    # tipos diferentes, sem problema

**Acessando itens** (índice começa em 0):
  frutas[0]   → "maçã"   (primeiro)
  frutas[1]   → "banana"
  frutas[-1]  → "uva"    (último — índices negativos contam de trás pra frente)

**Métodos essenciais** (operações comuns):
  frutas.append("manga")   # adiciona no FINAL
  frutas.insert(0, "kiwi") # adiciona em uma posição específica
  frutas.remove("banana")  # remove pela primeira ocorrência do valor
  frutas.pop()             # remove e RETORNA o último
  len(frutas)              # quantos itens tem
  frutas.sort()            # ordena no lugar (alfabética/numérica)
  "uva" in frutas          # True/False — testa se contém

## 📚 Exemplos comentados
  notas = [7, 8, 9, 6, 10]
  print(notas[0])              # 7   (primeira nota)
  print(notas[-1])             # 10  (última)
  print(len(notas))            # 5   (quantidade)

  notas.append(8)              # agora tem 6 itens
  notas.sort()                 # [6, 7, 8, 8, 9, 10]
  media = sum(notas) / len(notas)
  print(f"Média: {media}")     # Média: 8.0

  # Iterando: o for percorre na ordem
  for nota in notas:
      print(nota)

  # Slicing (fatias) — pega pedaços
  print(notas[0:3])            # [6, 7, 8] — do índice 0 ao 2

## ⚠️ Erros comuns
• **Índice fora do tamanho**: \`notas[10]\` quando só tem 6 itens → IndexError.
• **Esquecer que começa em 0**: o "5º item" tem índice 4, não 5.
• **\`append\` vs \`extend\`**: \`lista.append([1,2])\` adiciona a lista \`[1,2]\` como UM item; \`lista.extend([1,2])\` adiciona 1 e 2 separadamente.
• **\`sort()\` retorna None**: \`x = lista.sort()\` deixa \`x\` como None! \`sort()\` ordena no lugar. Para obter cópia ordenada, use \`sorted(lista)\`.

## 🚀 Quando usar na prática
Listas estão em todo lugar: produtos de um carrinho, mensagens de um chat, registros lidos do banco, jogadores de uma partida, tarefas de um to-do. Sempre que você precisa de **uma sequência de itens onde a ordem importa e a quantidade pode variar**, listas são a escolha padrão.`,
        starterCode: '# Crie a lista e exiba cada fruta\n',
        solution: 'frutas = ["maçã", "banana", "uva"]\nfor fruta in frutas:\n    print(fruta)',
        expectedOutput: "maçã",
        hints: ["Crie a lista: frutas = [\"maçã\", \"banana\", \"uva\"]", "Use for fruta in frutas:", "print(fruta) dentro do loop"],
        xpReward: 20,
      },
      {
        id: "1-7",
        title: "Funções",
        description: "Crie uma função chamada `saudacao` que recebe um `nome` e retorna **\"Olá, [nome]!\"**. Depois chame a função e exiba o resultado.",
        theory: `# Funções

## 💡 O que é
Uma **função** é um pedaço de código com nome próprio que você define **uma vez** e chama **quantas vezes quiser**. Ela pode receber dados de entrada (parâmetros) e devolver um resultado (return).

## 🌍 Analogia do mundo real
Uma função é como uma **receita de bolo**: você escreve a receita uma vez ("misture A com B, asse por 30 min, devolva o bolo"). Depois, sempre que quiser bolo, basta chamar "fazer_bolo" — não precisa reescrever a receita. Os **ingredientes** que você passa são os parâmetros; o **bolo pronto** é o que a função retorna.

## 🔧 Sintaxe e como funciona
A receita:
  def nome_da_funcao(parametro1, parametro2):
      # corpo da função
      return resultado

• \`def\` → palavra-chave que diz "estou definindo uma função".
• \`nome_da_funcao\` → use verbo no infinitivo, em \`snake_case\`.
• \`parametros\` → entradas que a função recebe (opcional).
• \`return\` → devolve um valor (opcional). Sem return, a função devolve \`None\`.

**Definir vs chamar:**
  def somar(a, b):     # 1) DEFINE — o código não roda ainda
      return a + b
  somar(3, 5)          # 2) CHAMA — agora sim roda e devolve 8

## 📚 Exemplos comentados
  def somar(a, b):
      return a + b

  resultado = somar(3, 5)
  print(resultado)              # 8

  def cumprimentar(nome):
      return f"Olá, {nome}!"

  print(cumprimentar("Ana"))    # Olá, Ana!

  # Função sem return — só executa ações
  def exibir_menu():
      print("1 - Jogar")
      print("2 - Sair")

  exibir_menu()

  # Parâmetros com valor padrão
  def saudacao(nome, saudacao="Olá"):
      return f"{saudacao}, {nome}!"

  print(saudacao("Bruno"))                # Olá, Bruno!
  print(saudacao("Bruno", "Bom dia"))     # Bom dia, Bruno!

## ⚠️ Erros comuns
• **Confundir definir com chamar**: \`def somar(a, b): return a+b\` sozinho não faz nada — você precisa escrever \`somar(2, 3)\` em algum lugar.
• **Esquecer o \`return\`**: \`x = somar(2, 3)\` quando \`somar\` não tem return → \`x\` vira \`None\`, não 5.
• **Quantidade errada de argumentos**: \`somar(3)\` quando a função pede dois → TypeError.
• **Variáveis dentro da função somem fora**: o que é criado dentro de \`def\` é local. Para sair, use \`return\`.

## 🚀 Quando usar na prática
Funções são a base da **organização e reuso** de código: validar um e-mail, calcular o frete, formatar uma data, autenticar um usuário. Regra de ouro: se você está copiando e colando o mesmo trecho duas vezes, transforme em função. Bônus: funções pequenas com nomes claros tornam o código praticamente autoexplicativo — você lê \`calcular_imposto(salario)\` e já entende.`,
        starterCode: '# Defina a função e chame-a\n',
        solution: 'def saudacao(nome):\n    return f"Olá, {nome}!"\n\nprint(saudacao("Python"))',
        expectedOutput: "Olá,",
        hints: ["def saudacao(nome):", "Use return para retornar o valor", "print(saudacao(\"Python\"))"],
        xpReward: 25,
      },
      {
        id: "1-8",
        title: "Dicionários",
        description: "Crie um dicionário `aluno` com as chaves `nome`, `idade` e `curso`. Exiba o nome do aluno.",
        theory: `# Dicionários

## 💡 O que é
Um **dicionário** guarda dados em pares **chave: valor**. Em vez de acessar pela posição (como na lista), você acessa **pelo nome da chave**. É a estrutura ideal para representar "coisas com várias propriedades" (um aluno tem nome, idade, curso).

## 🌍 Analogia do mundo real
É exatamente como uma **agenda telefônica**: você não procura "o terceiro contato" — procura "Maria" e o catálogo te entrega o número dela. O nome (Maria) é a **chave**; o telefone é o **valor**. Outra analogia: o dicionário de verdade — você procura a palavra e encontra o significado.

## 🔧 Sintaxe e como funciona
Criando: use **chaves** \`{ }\` com pares \`chave: valor\` separados por vírgula.
  aluno = {
      "nome": "Lucas",
      "idade": 20,
      "curso": "Python"
  }

**Regras das chaves:**
• Devem ser únicas (se repetir, o último valor vence).
• Geralmente são strings, mas podem ser números ou tuplas.
• Listas NÃO podem ser chaves (são mutáveis).

**Operações principais:**
  aluno["nome"]              # acesso direto — KeyError se não existir
  aluno.get("idade")         # acesso seguro — devolve None se não existir
  aluno.get("email", "—")    # com valor padrão se não existir
  aluno["email"] = "l@x.com" # adiciona ou atualiza
  del aluno["idade"]         # remove uma chave
  "nome" in aluno            # True/False — testa se a chave existe
  len(aluno)                 # quantos pares tem

## 📚 Exemplos comentados
  aluno = {"nome": "Lucas", "idade": 20, "curso": "Python"}
  print(aluno["nome"])                      # Lucas
  print(aluno.get("email", "sem email"))    # sem email (chave não existe)

  # Modificando
  aluno["idade"] = 21          # altera valor
  aluno["email"] = "l@x.com"   # adiciona nova chave

  # Iterando — três formas
  for chave in aluno:                       # só as chaves
      print(chave)
  for valor in aluno.values():              # só os valores
      print(valor)
  for chave, valor in aluno.items():        # ambos (mais útil)
      print(f"{chave}: {valor}")

  # Dicionário aninhado (estrutura de dados real)
  usuario = {
      "nome": "Ana",
      "endereco": {"cidade": "Recife", "uf": "PE"}
  }
  print(usuario["endereco"]["cidade"])      # Recife

## ⚠️ Erros comuns
• **Acessar chave inexistente com \`[ ]\`**: \`aluno["telefone"]\` → KeyError. Use \`.get()\` quando não tem certeza.
• **Sintaxe parecida com JSON, mas não é**: chaves devem estar entre aspas em Python (\`"nome"\`, não \`nome\`). Aspas obrigatórias.
• **Confundir com set**: \`{1, 2, 3}\` é set (sem chave:valor); \`{}\` vazio é dict, não set.
• **Esperar ordem alfabética**: dicionários mantêm a ordem de inserção (Python 3.7+), não ordem alfabética.

## 🚀 Quando usar na prática
Dicionários são a estrutura nº 1 para **dados estruturados**: perfil de usuário, configurações de app, resposta de uma API (JSON vira dict naturalmente), inventário de jogo (\`{"poção": 5, "espada": 1}\`), contagem de palavras num texto. Sempre que pensar "preciso guardar várias informações sobre uma coisa", pense em dicionário.`,
        starterCode: '# Crie o dicionário e exiba o nome\n',
        solution: 'aluno = {"nome": "Lucas", "idade": 20, "curso": "Python"}\nprint(aluno["nome"])',
        expectedOutput: "Lucas",
        hints: ["Use chaves {} para criar dicionários", 'aluno = {"nome": "Lucas", "idade": 20, "curso": "Python"}', 'print(aluno["nome"])'],
        xpReward: 25,
      },
      {
        id: "1-9",
        title: "List Comprehension",
        description: "Use **list comprehension** para criar uma lista com os quadrados dos números de 1 a 5.",
        theory: `# List Comprehension

## 💡 O que é
**List comprehension** é uma forma compacta de criar uma nova lista **transformando** ou **filtrando** outra. O que normalmente seriam 3 linhas (criar lista vazia → loop → \`append\`) vira **uma linha** legível.

## 🌍 Analogia do mundo real
Pense numa **linha de produção**: você joga itens crus de um lado, eles passam por uma máquina (a transformação) — opcionalmente por um filtro — e saem itens prontos do outro. List comprehension é essa linha de produção descrita em uma frase: "para cada x da entrada, produza f(x), pulando os que não passam no filtro".

## 🔧 Sintaxe e como funciona
A receita base:
  nova_lista = [expressão for item in iterável]

Com filtro (condicional):
  nova_lista = [expressão for item in iterável if condição]

**Lê-se da esquerda para a direita** assim: "Para cada \`item\` em \`iterável\` (se passar na \`condição\`), coloque \`expressão\` na nova lista."

## 📚 Exemplos comentados
  # Versão tradicional (3 linhas)
  quadrados = []
  for x in range(1, 6):
      quadrados.append(x ** 2)
  # quadrados = [1, 4, 9, 16, 25]

  # Mesma coisa em list comprehension (1 linha)
  quadrados = [x ** 2 for x in range(1, 6)]

  # Transformando strings
  maiusculas = [nome.upper() for nome in ["ana", "bruno"]]
  # ["ANA", "BRUNO"]

  # Filtrando — só os pares
  pares = [x for x in range(10) if x % 2 == 0]
  # [0, 2, 4, 6, 8]

  # Combinando transformação + filtro
  notas = [4, 7, 5, 9, 6, 8]
  aprovados = [n for n in notas if n >= 7]
  # [7, 9, 8]

  # Expressão condicional NA expressão (não é filtro)
  status = ["par" if x % 2 == 0 else "ímpar" for x in range(5)]
  # ["par", "ímpar", "par", "ímpar", "par"]

## ⚠️ Erros comuns
• **Confundir os dois \`if\`**: \`[x for x in lista if x>0]\` é filtro; \`[x if x>0 else 0 for x in lista]\` é expressão condicional. A posição muda tudo.
• **Forçar lógica complexa numa linha**: se ficou com 3 condições e 2 transformações, volte ao loop normal — fica mais legível.
• **Esquecer dos colchetes**: \`x for x in range(5)\` (sem \`[ ]\`) cria um *generator*, não uma lista.
• **Recriar coisa que já existe**: \`[x for x in lista]\` é só uma cópia ineficiente — use \`list(lista)\` ou \`lista[:]\`.

## 🚀 Quando usar na prática
List comprehension é o jeito **idiomático Python** de transformar dados: extrair os e-mails de uma lista de usuários, converter strings para int, filtrar os produtos com estoque > 0, normalizar nomes para minúsculo. Programadores Python experientes leem \`[u.email for u in users if u.ativo]\` quase como uma frase em português.`,
        starterCode: '# Use list comprehension\n',
        solution: 'quadrados = [x**2 for x in range(1, 6)]\nprint(quadrados)',
        expectedOutput: "[1, 4, 9, 16, 25]",
        hints: ["Sintaxe: [expressão for x in range()]", "x**2 calcula o quadrado", "[x**2 for x in range(1, 6)]"],
        xpReward: 20,
        quiz: [
          { question: "Qual é a sintaxe de list comprehension?", options: ["list(x for x in range)", "[x for x in range()]", "for x in range: list.add(x)", "comprehend(x, range)"], correctIndex: 1, explanation: "List comprehension usa colchetes [ ] e a estrutura [expressão for variável in iterável]. É equivalente a um loop for com append, mas mais conciso." },
        ],
      },
      {
        id: "1-10",
        title: "Try/Except",
        description: "Use **try/except** para tentar converter a string **\"abc\"** em número e exibir **\"Erro: valor inválido!\"** se falhar.",
        theory: `# Try / Except (tratamento de erros)

## 💡 O que é
\`try / except\` permite **prever erros** e **reagir a eles** sem que o programa quebre. Em vez de o Python parar tudo com uma mensagem feia, você mostra uma mensagem amigável e segue em frente.

## 🌍 Analogia do mundo real
É como **dirigir com cinto de segurança**: você não dirige esperando bater, mas se algo der errado, o cinto te protege. O bloco \`try\` é a estrada normal; o \`except\` é o cinto que entra em ação quando há um acidente. Sem try/except, qualquer "buraco" (erro) joga seu programa para fora da pista.

## 🔧 Sintaxe e como funciona
Estrutura básica:
  try:
      # código que PODE dar erro
  except TipoDoErro:
      # o que fazer se DEU esse erro
  else:
      # roda se NÃO deu erro (opcional)
  finally:
      # roda SEMPRE, com ou sem erro (opcional)

**Tipos de erro mais comuns:**
• \`ValueError\`         → valor errado: \`int("abc")\`
• \`TypeError\`          → tipo errado: \`1 + "2"\`
• \`ZeroDivisionError\`  → divisão por zero
• \`FileNotFoundError\`  → arquivo não existe
• \`KeyError\`           → chave inexistente em dict
• \`IndexError\`         → índice fora da lista

Você pode capturar a mensagem do erro com \`as\`:
  except ValueError as e:
      print(f"Detalhe: {e}")

## 📚 Exemplos comentados
  # Caso 1: conversão pode falhar
  try:
      numero = int("abc")
  except ValueError:
      print("Valor inválido!")        # roda — int("abc") falha

  # Caso 2: vários excepts diferentes
  try:
      resultado = 10 / 0
  except ZeroDivisionError:
      print("Não pode dividir por zero!")
  except ValueError:
      print("Valor inválido!")

  # Caso 3: with else e finally
  try:
      x = int(input("Digite um número: "))
  except ValueError:
      print("Não era número!")
  else:
      print(f"Número válido: {x}")    # só roda se NÃO deu erro
  finally:
      print("Programa finalizado.")    # roda sempre

## ⚠️ Erros comuns
• **except genérico (\`except:\` sem tipo)**: pega TUDO, inclusive Ctrl+C e bugs reais. Sempre especifique o tipo.
• **try gigante**: colocar 50 linhas dentro do try torna impossível saber qual delas falhou. Mantenha o try **pequeno e focado**.
• **Engolir o erro**: \`except: pass\` esconde problemas e dificulta debug. No mínimo, faça \`print(e)\` ou \`logging\`.
• **Confundir \`else\` com \`else\` do if**: aqui, \`else\` significa "se não deu erro" — é raro, use só quando precisar.

## 🚀 Quando usar na prática
Use try/except em pontos onde **não dá pra confiar 100%** no que vem de fora: ler um arquivo (pode não existir), converter input do usuário (pode digitar errado), chamar uma API (a internet pode cair), acessar uma chave de dict opcional. **Não** use para tudo — código com try em volta de cada linha fica ilegível e esconde lógica.`,
        starterCode: '# Use try/except\n',
        solution: 'try:\n    numero = int("abc")\nexcept ValueError:\n    print("Erro: valor inválido!")',
        expectedOutput: "Erro: valor inválido!",
        hints: ["try: tenta executar o código", "except ValueError: captura o erro", "int(\"abc\") gera ValueError"],
        xpReward: 20,
        quiz: [
          { question: "O que o bloco 'finally' faz?", options: ["Roda só se der erro", "Roda só se NÃO der erro", "Roda SEMPRE", "Cancela o erro"], correctIndex: 2, explanation: "O bloco finally é executado independente do resultado — deu erro ou não. É ideal para fechar arquivos, conexões ou liberar recursos." },
        ],
      },
      {
        id: "1-11",
        title: "Trabalhando com Arquivos",
        description: "Abra um arquivo chamado **\"dados.txt\"**, escreva **\"Olá, arquivo!\"** nele e depois leia o conteúdo com `print()`.",
        theory: `# Trabalhando com Arquivos

## 💡 O que é
Manipular arquivos é como o programa **persiste informação** entre execuções. Sem isso, tudo que ele calcula some quando você fecha. Python usa \`open()\` para abrir o arquivo, e o bloco \`with\` para garantir que ele é fechado direitinho.

## 🌍 Analogia do mundo real
Pense num **caderno**: você precisa primeiro abrir (\`open\`), decidir se vai ler ou escrever (modo), fazer a ação, e depois fechar. Esquecer de fechar o caderno é como deixar a torneira aberta — desperdiça recursos. O bloco \`with\` é o "fecha sozinho quando termina" — você não precisa lembrar.

## 🔧 Sintaxe e como funciona
Forma recomendada (com \`with\`, sempre):
  with open("dados.txt", "r") as f:
      conteudo = f.read()
  # arquivo já está fechado aqui — automaticamente

**Modos principais** (segundo argumento do \`open\`):
• \`"r"\` → **read** (leitura). Padrão. Erro se o arquivo não existir.
• \`"w"\` → **write** (escrita). **APAGA** o conteúdo existente!
• \`"a"\` → **append** (adicionar). Escreve no final, sem apagar.
• \`"x"\` → **exclusive create**. Cria novo, erro se já existir.
• \`"r+"\` → leitura **e** escrita.
• Adicione \`"b"\` para binário (\`"rb"\`, \`"wb"\`) — imagens, PDFs.

**Métodos de leitura:**
  f.read()        → string com TUDO de uma vez
  f.readlines()   → lista de strings (uma por linha)
  for linha in f: → itera linha a linha (mais eficiente em arquivos grandes)

**Métodos de escrita:**
  f.write("texto")           → escreve sem pular linha
  f.writelines(lista_strs)   → escreve várias

## 📚 Exemplos comentados
  # Escrevendo
  with open("dados.txt", "w") as f:
      f.write("Linha 1\\n")            # \\n pula linha
      f.write("Linha 2\\n")

  # Lendo tudo de uma vez
  with open("dados.txt", "r") as f:
      conteudo = f.read()
      print(conteudo)

  # Lendo linha a linha (eficiente para arquivos grandes)
  with open("dados.txt", "r") as f:
      for linha in f:
          print(linha.strip())          # strip remove o \\n do final

  # Adicionando ao final sem apagar
  with open("dados.txt", "a") as f:
      f.write("Linha 3\\n")

  # Verificando se existe antes
  import os
  if os.path.exists("dados.txt"):
      print("Existe!")

## ⚠️ Erros comuns
• **Modo \`"w"\` apaga tudo**: abrir um arquivo com conteúdo importante em modo \`"w"\` zera ele. Use \`"a"\` para adicionar.
• **Esquecer de fechar (sem \`with\`)**: \`f = open(...)\` sem \`f.close()\` deixa o arquivo "preso" até o programa terminar. **Sempre use \`with\`.**
• **Codificação errada**: arquivos com acentos podem dar UnicodeDecodeError. Resolva com \`open(..., encoding="utf-8")\`.
• **Esquecer \`\\n\` no \`write\`**: \`write\` não pula linha sozinho — o que você escreve sai colado.

## 🚀 Quando usar na prática
Salvar configurações do app, exportar relatórios em CSV, registrar logs de erro, ler arquivos de input (planilhas, JSON, textos), fazer cache local de dados pesados. Para dados estruturados (listas, dicionários), prefira o módulo \`json\` (\`json.dump\`/\`json.load\`) — é muito mais prático que escrever linha por linha.`,
        starterCode: '# Escreva e leia o arquivo\n',
        solution: 'with open("dados.txt", "w") as f:\n    f.write("Olá, arquivo!")\n\nwith open("dados.txt", "r") as f:\n    print(f.read())',
        expectedOutput: "Olá, arquivo!",
        hints: ["Use open() com modo 'w' para escrever", "Use open() com modo 'r' para ler", "with garante que o arquivo é fechado"],
        xpReward: 25,
        quiz: [
          { question: "O que o modo 'a' faz ao abrir um arquivo?", options: ["Apaga o conteúdo", "Lê o arquivo", "Adiciona ao final", "Cria uma cópia"], correctIndex: 2, explanation: "Modo 'a' (append) adiciona conteúdo ao final do arquivo sem apagar o que existe. 'r' lê, 'w' escreve (apaga tudo antes) e 'x' cria (dá erro se existir)." },
          { question: "Por que usar 'with open()' em vez de 'open()' sozinho?", options: ["É mais rápido", "Fecha o arquivo automaticamente", "Não precisa de modo", "Cria backup"], correctIndex: 1, explanation: "with open() é um gerenciador de contexto que fecha o arquivo automaticamente ao sair do bloco, mesmo se ocorrer um erro. Evita vazamentos de recursos." },
        ],
      },
      {
        id: "1-12",
        title: "Módulos e Imports",
        description: "Importe o módulo **math** e calcule a raiz quadrada de **144** usando `math.sqrt()`. Exiba o resultado.",
        theory: `# Módulos e Imports

## 💡 O que é
Um **módulo** é um arquivo \`.py\` cheio de funções, classes e variáveis prontas para usar. Em vez de reinventar tudo, você **importa** o módulo e ganha acesso ao que tem dentro. Python já vem com **centenas** de módulos prontos (a "biblioteca padrão") — e ainda existem milhares no PyPI.

## 🌍 Analogia do mundo real
Imagine uma **caixa de ferramentas**: você não fabrica martelo do zero toda vez que precisa — abre a caixa e pega. O \`import math\` é exatamente isso: "abre a caixa de ferramentas matemáticas". \`math.sqrt(16)\` é "pega a ferramenta sqrt da caixa math". E \`pip install\` é ir até a loja comprar uma caixa nova.

## 🔧 Sintaxe e como funciona
**Quatro formas de importar:**
  import math
  math.sqrt(16)              # acesso pelo prefixo do módulo

  from math import sqrt
  sqrt(16)                   # importa só a função, sem prefixo

  from math import sqrt, pi  # importa várias de uma vez
  print(pi)

  import numpy as np         # alias (apelido) — convenção em libs grandes
  np.array([1, 2, 3])

**Como Python encontra o módulo:** procura no diretório atual, depois nos módulos da biblioteca padrão, depois nos pacotes instalados via \`pip\`.

## 📚 Exemplos comentados
  import math
  print(math.sqrt(144))        # 12.0
  print(math.pi)               # 3.141592...
  print(math.ceil(4.1))        # 5 (arredonda para cima)

  import random
  print(random.randint(1, 6))  # número entre 1 e 6 (dado!)
  print(random.choice(["pedra", "papel", "tesoura"]))

  from datetime import datetime
  agora = datetime.now()
  print(agora.strftime("%d/%m/%Y"))

  # Criando seu próprio módulo
  # arquivo: utils.py
  def saudacao(nome):
      return f"Olá, {nome}!"

  # arquivo: main.py
  from utils import saudacao
  print(saudacao("Ana"))

**Módulos da biblioteca padrão que vale conhecer:**
\`math\` (matemática), \`random\` (aleatórios), \`datetime\` (datas), \`os\` (sistema operacional), \`json\` (JSON), \`re\` (regex), \`collections\` (estruturas especiais), \`itertools\` (iteradores).

## ⚠️ Erros comuns
• **\`from módulo import *\`**: importa TUDO e polui o namespace — pode sobrescrever variáveis suas sem aviso. Evite.
• **Conflito de nome**: criar um arquivo \`math.py\` na sua pasta pode fazer Python importar o seu em vez do oficial. Não use nomes de módulos famosos.
• **Esquecer de instalar**: \`import requests\` falha se o pacote não foi instalado. Rode \`pip install requests\` primeiro.
• **Import circular**: A importa B que importa A → ImportError. Reorganize o código.

## 🚀 Quando usar na prática
**Sempre** que precisar de algo que provavelmente alguém já fez: cálculo de juros (\`decimal\`), parsing de URL (\`urllib\`), criptografia (\`hashlib\`), envio de e-mail (\`smtplib\`), manipulação de planilhas (\`openpyxl\`, via pip), requisições HTTP (\`requests\`). Antes de implementar do zero, pesquise — quase sempre tem módulo pronto.`,
        starterCode: '# Importe math e calcule\n',
        solution: 'import math\nprint(math.sqrt(144))',
        expectedOutput: "12.0",
        hints: ["import math importa o módulo", "math.sqrt() calcula raiz quadrada", "sqrt(144) = 12.0"],
        xpReward: 20,
        quiz: [
          { question: "Qual a diferença entre 'import math' e 'from math import sqrt'?", options: ["Nenhuma", "O segundo importa só sqrt, sem prefixo", "O primeiro é mais rápido", "O segundo importa tudo"], correctIndex: 1, explanation: "Com 'import math' você usa math.sqrt(). Com 'from math import sqrt' você usa sqrt() diretamente, sem o prefixo do módulo." },
        ],
      },
      {
        id: "1-13",
        title: "Orientação a Objetos",
        description: "Crie uma classe **Carro** com atributos `marca` e `modelo` e um método `info()` que retorna **\"[marca] [modelo]\"**.",
        theory: `# Orientação a Objetos

## 💡 O que é
**POO** (Programação Orientada a Objetos) é um jeito de organizar código em **objetos** que combinam **dados** (atributos) e **comportamentos** (métodos). Em vez de funções soltas e variáveis espalhadas, você junta tudo o que pertence a uma "coisa" no mesmo lugar.

## 🌍 Analogia do mundo real
Uma **classe** é como a **planta de um carro** desenhada pelo engenheiro. Um **objeto** (instância) é cada carro REAL fabricado a partir dessa planta. Todos seguem a mesma planta (mesmos atributos: cor, marca, modelo; mesmos métodos: ligar, frear), mas cada carro tem seus próprios valores (um vermelho, outro azul). \`__init__\` é a linha de montagem que dá os valores iniciais; \`self\` é o "este carro aqui" que cada método se refere.

## 🔧 Sintaxe e como funciona
Definindo uma classe:
  class Carro:
      def __init__(self, marca, modelo):
          self.marca = marca       # atributo
          self.modelo = modelo

      def info(self):              # método
          return f"{self.marca} {self.modelo}"

  meu_carro = Carro("Toyota", "Corolla")   # cria um objeto
  print(meu_carro.info())                  # Toyota Corolla

**Conceitos-chave:**
• \`class\` → palavra-chave para definir a planta. Use \`PascalCase\` no nome.
• \`__init__\` → o **construtor**, chamado automaticamente ao criar o objeto.
• \`self\` → referência ao próprio objeto. SEMPRE primeiro parâmetro dos métodos.
• \`atributo\` → dado guardado dentro do objeto (\`self.marca\`).
• \`método\` → função que pertence à classe.

**Herança** — uma classe pode reutilizar outra:
  class Veiculo:
      def __init__(self, marca):
          self.marca = marca
      def ligar(self):
          return "Ligado!"

  class Carro(Veiculo):                # Carro HERDA de Veiculo
      def __init__(self, marca, portas):
          super().__init__(marca)      # chama o init do pai
          self.portas = portas

  c = Carro("Ford", 4)
  print(c.ligar())  # "Ligado!" — método herdado

## 📚 Exemplos comentados
  class ContaBancaria:
      def __init__(self, titular, saldo=0):
          self.titular = titular
          self.saldo = saldo

      def depositar(self, valor):
          if valor > 0:
              self.saldo += valor
              return f"Depósito de R$ {valor}. Saldo: R$ {self.saldo}"
          return "Valor inválido"

      def sacar(self, valor):
          if 0 < valor <= self.saldo:
              self.saldo -= valor
              return f"Saque de R$ {valor}. Saldo: R$ {self.saldo}"
          return "Saldo insuficiente"

  conta = ContaBancaria("Ana", 100)
  print(conta.depositar(50))   # Saldo: R$ 150
  print(conta.sacar(30))       # Saldo: R$ 120

  # Métodos especiais (dunder)
  class Ponto:
      def __init__(self, x, y):
          self.x = x
          self.y = y
      def __str__(self):                         # define como print mostra
          return f"Ponto({self.x}, {self.y})"

  p = Ponto(3, 4)
  print(p)                # Ponto(3, 4)

## ⚠️ Erros comuns
• **Esquecer o \`self\`**: \`def info():\` em vez de \`def info(self):\` → TypeError.
• **Acessar atributo sem \`self.\` dentro do método**: \`return marca\` → NameError. Use \`return self.marca\`.
• **Confundir classe com instância**: \`Carro.ligar()\` em vez de \`meu_carro.ligar()\` → TypeError (faltou self).
• **Esquecer \`super().__init__()\`** na herança: o construtor do pai não roda e atributos somem.

## 🚀 Quando usar na prática
POO brilha quando você tem **muitas "coisas" do mesmo tipo** com estado próprio: usuários de um app (cada um tem nome, e-mail, histórico), produtos de uma loja, personagens de um jogo, requisições HTTP. Frameworks como Django, FastAPI e PyTorch são fortemente baseados em classes. Para scripts curtos sem estado complexo, funções soltas costumam ser suficientes — POO é ferramenta, não regra.`,
        starterCode: '# Crie a classe Carro\n',
        solution: 'class Carro:\n    def __init__(self, marca, modelo):\n        self.marca = marca\n        self.modelo = modelo\n    def info(self):\n        return f"{self.marca} {self.modelo}"\n\nc = Carro("Toyota", "Corolla")\nprint(c.info())',
        expectedOutput: "Toyota Corolla",
        hints: ["class NomeDaClasse:", "__init__ é o construtor", "self.atributo = valor"],
        xpReward: 30,
        quiz: [
          { question: "O que o __init__ faz?", options: ["Destrói o objeto", "Inicializa o objeto", "Herda de outra classe", "Cria um módulo"], correctIndex: 1, explanation: "__init__ é o construtor da classe — é chamado automaticamente quando você cria um objeto. Serve para definir os atributos iniciais do objeto." },
          { question: "O que 'self' representa?", options: ["A classe", "O módulo", "O próprio objeto", "O construtor"], correctIndex: 2, explanation: "'self' é uma referência à instância atual do objeto. Ao chamar cachorro.latir(), Python passa o objeto 'cachorro' automaticamente como 'self'." },
        ],
      },
      {
        id: "1-14",
        title: "Lambda e Map/Filter",
        description: "Use **lambda** com **map()** para triplicar cada número da lista `[2, 4, 6, 8]` e exiba o resultado.",
        theory: `# Lambda, map() e filter()

## 💡 O que é
**Lambda** é uma função pequena, de **uma linha**, sem nome. \`map()\` aplica uma função em **cada item** de uma sequência. \`filter()\` mantém apenas os itens que **passam num teste**. Juntos, formam o estilo "funcional" do Python.

## 🌍 Analogia do mundo real
Imagine uma **fábrica com esteiras**:
• \`map\` é a **estação de pintura**: cada item passa, recebe a pintura (a transformação) e segue.
• \`filter\` é o **inspetor de qualidade**: cada item passa, e só os aprovados continuam.
• \`lambda\` é o **operário simples** dessas estações — uma instrução curta, sem precisar de manual de 30 páginas (uma função normal com \`def\`).

## 🔧 Sintaxe e como funciona
**Lambda:**
  lambda parametros: expressão

Equivalente a:
  def funcao(parametros):
      return expressão

**map(função, iterável)** → aplica a função em cada item:
  list(map(funcao, lista))

**filter(função, iterável)** → mantém só onde a função devolve True:
  list(filter(funcao, lista))

(Tanto map quanto filter devolvem um *iterator preguiçoso*; envolva em \`list()\` para ver o resultado.)

## 📚 Exemplos comentados
  # Lambda básica
  dobro = lambda x: x * 2
  print(dobro(5))                       # 10

  soma = lambda a, b: a + b
  print(soma(3, 7))                     # 10

  # map: transforma cada item
  nums = [1, 2, 3, 4]
  dobros = list(map(lambda x: x * 2, nums))
  # [2, 4, 6, 8]

  # filter: mantém só os que passam
  pares = list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5, 6]))
  # [2, 4, 6]

  # sorted() com key= aceita lambda — ordena por critério customizado
  nomes = ["Carlos", "Ana", "Bruno"]
  por_tamanho = sorted(nomes, key=lambda x: len(x))
  # ["Ana", "Bruno", "Carlos"]

  alunos = [{"nome": "Ana", "nota": 8}, {"nome": "Bruno", "nota": 9}]
  por_nota = sorted(alunos, key=lambda a: a["nota"], reverse=True)
  # Bruno primeiro (nota maior)

  # Combinando map + filter
  numeros = [1, 2, 3, 4, 5, 6]
  quadrados_pares = list(map(lambda x: x**2, filter(lambda x: x%2==0, numeros)))
  # [4, 16, 36]

## ⚠️ Erros comuns
• **Lambda com lógica complexa**: se ficou ilegível, transforme em \`def\` com nome.
• **Esquecer \`list()\`**: \`map(...)\` sozinho devolve um objeto map, não uma lista. Para ver, envolva em \`list()\`.
• **\`filter(None, lista)\`**: passar \`None\` como função filtra valores "falsy" (0, "", None) — comportamento útil mas que pega gente desprevenida.
• **List comprehension às vezes é mais legível**: \`[x*2 for x in nums]\` é geralmente preferível a \`list(map(lambda x: x*2, nums))\` em código Python idiomático.

## 🚀 Quando usar na prática
\`lambda + sorted/min/max\` é o caso mais comum: ordenar uma lista de objetos por um campo (\`sorted(produtos, key=lambda p: p.preco)\`). \`map\` e \`filter\` aparecem muito em código que processa streams de dados (logs, eventos, registros de banco). Em código mais "Pythonic" do dia a dia, list comprehensions tendem a vencer — mas conhecer lambda é essencial porque APIs de bibliotecas (Pandas, sorted, etc.) pedem funções como argumento o tempo todo.`,
        starterCode: '# Use lambda com map\nnums = [2, 4, 6, 8]\n',
        solution: 'nums = [2, 4, 6, 8]\nresultado = list(map(lambda x: x * 3, nums))\nprint(resultado)',
        expectedOutput: "[6, 12, 18, 24]",
        hints: ["lambda x: x * 3 triplica", "map(função, lista) aplica a cada item", "list() converte o resultado em lista"],
        xpReward: 25,
      },
    
    ],
  },
  {
    id: "2",
    title: "JavaScript Moderno",
    language: "JavaScript",
    emoji: "⚡",
    level: "Intermediário",
    duration: "35h",
    students: 9800,
    progress: 30,
    color: "quest-yellow",
    tags: ["Popular"],
    description: "Domine o JavaScript moderno com ES6+, arrow functions, promises e mais.",
    lessons: [
      {
        id: "2-1",
        title: "Console.log",
        description: "Use `console.log()` para exibir **\"Olá, JavaScript!\"** no console.",
        theory: `# console.log

## 💡 O que é
\`console.log()\` é a função que **mostra valores no console** do navegador (DevTools, F12) ou do terminal Node.js. É a ferramenta nº 1 para "espiar" o que seu código está fazendo enquanto roda.

![JavaScript no console do navegador](https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=300&fit=crop)

## 🌍 Analogia do mundo real
Pense no console como o **painel de instrumentos do carro**: o motor (seu código) trabalha por baixo, mas o painel mostra velocidade, temperatura, gasolina. Sem painel, você dirige no escuro. \`console.log\` é como pedir ao painel: "mostra aí o valor dessa variável agora".

## 🔧 Sintaxe e como funciona
A receita:
  console.log(valor)

• \`console\` → o objeto global "console" (vem do navegador/Node).
• \`.log\` → o método para imprimir.
• \`(valor)\` → o que você quer ver: texto, número, variável, objeto, array, expressão.

Você pode passar **vários valores** separados por vírgula — saem com espaço entre eles:
  console.log("Nome:", nome, "Idade:", idade);

**Outros métodos do console** que vale conhecer:
  console.warn("aviso")     → linha amarela com ⚠️
  console.error("erro")     → linha vermelha com ❌
  console.table([...])      → mostra arrays/objetos como tabela bonita
  console.dir(objeto)       → expande propriedades de um objeto

## 📚 Exemplos comentados
  console.log("Olá!");                      // Olá!
  console.log(42);                          // 42 (número, sem aspas)
  console.log(true);                        // true (booleano)
  console.log(2 + 3);                       // 5 (calcula antes)
  console.log("Soma:", 2 + 3);              // Soma: 5

  const usuario = { nome: "Ana", idade: 25 };
  console.log(usuario);                     // {nome: 'Ana', idade: 25}
  console.table([usuario, { nome: "Bruno" }]); // tabela formatada

  // Strings: 3 tipos de aspas
  console.log('simples');
  console.log("duplas");
  console.log(\`crases\`);                    // template literal

## ⚠️ Erros comuns
• **\`Console.log\`** com C maiúsculo → ReferenceError. JavaScript é case-sensitive, é tudo minúsculo.
• **Esquecer parênteses**: \`console.log "oi"\` → SyntaxError. Sempre use \`(...)\`.
• **\`console.log(variavel)\` antes de declará-la**: ReferenceError. Declare a variável primeiro.
• **Confundir console.log com return**: \`console.log\` mostra na tela mas NÃO devolve o valor para o código que chamou.

## 🚀 Quando usar na prática
Em desenvolvimento, console.log é seu **detector de problemas**: imprima valores em pontos-chave para descobrir onde algo deu errado. Em código de produção, prefira ferramentas de logging adequadas (Sentry, LogRocket) e remova/silencie os console.log antes do deploy. Profissionais também usam \`console.table\` e \`console.dir\` para inspecionar arrays de objetos rapidamente.`,
        starterCode: '// Exiba a mensagem\n',
        solution: 'console.log("Olá, JavaScript!");',
        expectedOutput: "Olá, JavaScript!",
        hints: ["Use console.log()", "O texto deve estar entre aspas", 'console.log("Olá, JavaScript!")'],
        xpReward: 10,
        quiz: [
          { question: "Qual função exibe valores no console do navegador?", options: ["print()", "console.log()", "alert()", "document.write()"], correctIndex: 1, explanation: "console.log() exibe no console do DevTools (F12). print() é Python, alert() abre uma caixa de diálogo e document.write() insere HTML na página." },
        ],
      },
      {
        id: "2-2",
        title: "let, const e var",
        description: "Declare uma constante `PI` com valor 3.14 e uma variável `raio` com valor 5. Calcule a **área do círculo** (PI * raio²) e exiba o resultado.",
        theory: `# let, const e var

## 💡 O que é
São as **três formas de declarar variáveis** em JavaScript. Em código moderno (ES6+), use \`const\` por padrão, \`let\` quando precisar reatribuir, e **evite \`var\`** — ele tem comportamento confuso de escopo que causa bugs.

## 🌍 Analogia do mundo real
Pense em **etiquetas de produtos no estoque**:
• \`const\` é uma etiqueta **lacrada com cola permanente**: depois de colada, não muda de produto.
• \`let\` é uma etiqueta de **velcro**: você pode tirar e colar em outro produto quando quiser.
• \`var\` é a etiqueta antiga, **bagunçada**, que às vezes "vaza" para outras prateleiras (bug de escopo) — descontinuada na prática.

## 🔧 Sintaxe e como funciona
  const NOME = valor;       // não pode reatribuir
  let nome = valor;         // pode reatribuir
  var nome = valor;         // legado — evite

**Diferença crítica de escopo:**
• \`let\` e \`const\` têm **escopo de bloco** (\`{ }\`): existem só dentro do bloco onde foram criados (if, for, função).
• \`var\` tem **escopo de função**: vaza para fora de blocos. Causa surpresas.

**Regra de ouro:** Comece com \`const\`. Só troque para \`let\` se precisar reatribuir.

## 📚 Exemplos comentados
  const PI = 3.14;
  // PI = 4;            ← TypeError: Assignment to constant variable

  let pontuacao = 0;
  pontuacao = 10;        // OK, foi reatribuída
  pontuacao++;           // pontuacao = 11

  const usuario = { nome: "Ana" };
  usuario.nome = "Bruno";  // OK! Mudei a propriedade, não a variável
  // usuario = {};        ← Erro! Não posso reatribuir o objeto inteiro

  // Escopo de bloco com let
  if (true) {
    let x = 10;
  }
  // console.log(x);     ← ReferenceError: x não existe aqui

  // var "vaza" do bloco — comportamento bizarro
  if (true) { var y = 10; }
  console.log(y);        // 10 (vazou! não deveria existir aqui)

**Tipos de dados primitivos:**
  const texto = "string";       // String
  const numero = 42;            // Number (inteiro ou decimal)
  const booleano = true;        // Boolean
  const nulo = null;            // Null (intencionalmente vazio)
  const indef = undefined;      // Undefined (não foi atribuído)

## ⚠️ Erros comuns
• **Reatribuir \`const\`**: \`const x = 1; x = 2;\` → TypeError.
• **Esquecer que \`const\` em objeto/array protege a referência, não o conteúdo**: você pode mudar propriedades, só não pode trocar o objeto inteiro.
• **Usar variável antes de declarar**: \`console.log(x); let x = 5;\` → ReferenceError ("temporal dead zone").
• **Misturar \`var\` com \`let\` no mesmo código**: confunde escopo. Adote \`const\`/\`let\` em todo lugar.

## 🚀 Quando usar na prática
Em código real, **~90% das declarações são \`const\`**: importações, configurações, funções, componentes React, objetos com dados que você só lê. \`let\` aparece em contadores de loops e em estado mutável local. \`var\` só vai aparecer em códigos antigos que você precisa manter — em projetos novos, simplesmente não use.`,
        starterCode: '// Declare as variáveis e calcule\n',
        solution: 'const PI = 3.14;\nlet raio = 5;\nconsole.log(PI * raio * raio);',
        expectedOutput: "78.5",
        hints: ["Use const para valores fixos e let para variáveis", "Área = PI * raio * raio", "console.log(PI * raio * raio)"],
        xpReward: 15,
      },
      ...createJavaScriptFoundationBridge(),
      {
        id: "2-3",
        title: "Arrow Functions",
        description: "Crie uma arrow function chamada `dobro` que recebe um número e retorna o **dobro** dele. Exiba o resultado de `dobro(7)`.",
        theory: `# Arrow Functions

## 💡 O que é
**Arrow functions** (\`=>\`) são a forma moderna e compacta de escrever funções em JavaScript (ES6+). Mesmo comportamento de \`function\`, mas com sintaxe mais curta e uma diferença importante em \`this\`.

## 🌍 Analogia do mundo real
Imagine duas formas de assinar um documento:
• \`function\` é a **assinatura completa** com nome, RG e endereço — formal, longa, oficial.
• \`=>\` é a **rubrica rápida** — mesma validade, ocupa menos espaço, é o que você usa no dia a dia.

A "seta" \`=>\` literalmente aponta da entrada (parâmetros) para a saída (resultado).

## 🔧 Sintaxe e como funciona
**Função tradicional:**
  function somar(a, b) {
    return a + b;
  }

**Arrow function equivalente:**
  const somar = (a, b) => {
    return a + b;
  };

**Versão curta** (uma linha → \`return\` implícito):
  const somar = (a, b) => a + b;

**Variações:**
• Um parâmetro: parênteses opcionais → \`n => n * 2\`
• Sem parâmetros: parênteses vazios obrigatórios → \`() => "Olá"\`
• Vários parâmetros: parênteses obrigatórios → \`(a, b, c) => a + b + c\`
• Retornar objeto: envolva em parênteses → \`() => ({ x: 1 })\`  (sem isso, \`{}\` vira bloco)

**Diferença crítica:** arrow functions **NÃO têm seu próprio \`this\`** — herdam do contexto onde foram criadas. Isso é o motivo principal de usá-las em callbacks e React.

## 📚 Exemplos comentados
  // Sintaxes equivalentes — mesma coisa, mais curta
  const dobro = function(n) { return n * 2; };
  const dobro = (n) => { return n * 2; };
  const dobro = (n) => n * 2;
  const dobro = n => n * 2;          // parêntese opcional num só param

  // Como callback: extremamente comum
  const nums = [1, 2, 3];
  const dobros = nums.map(n => n * 2);   // [2, 4, 6]

  // Sem parâmetros
  const agora = () => Date.now();

  // Retornando objeto (cuidado com os parênteses!)
  const usuario = (nome) => ({ nome, ativo: true });

  // Diferença de "this"
  class Timer {
    constructor() {
      this.segundos = 0;
      // arrow function herda this da classe — funciona!
      setInterval(() => { this.segundos++; }, 1000);
      // function tradicional teria this errado — bug clássico
    }
  }

## ⚠️ Erros comuns
• **\`return\` numa arrow com bloco**: \`n => { n * 2 }\` retorna \`undefined\` (faltou \`return\`). Use \`n => n * 2\` (sem chaves) ou adicione \`return\`.
• **Retornar objeto sem parênteses**: \`() => { x: 1 }\` o JS lê \`{ }\` como bloco e dá erro. Envolva: \`() => ({ x: 1 })\`.
• **Usar arrow como método de classe esperando \`this\` próprio**: arrow herda — pode dar resultado inesperado se você queria o \`this\` do objeto.
• **Esquecer \`const\`** antes da arrow: ela precisa ser atribuída a uma variável (ou usada inline como callback).

## 🚀 Quando usar na prática
Arrow functions são o **padrão moderno** para: callbacks (\`map\`, \`filter\`, \`forEach\`), event handlers em React, funções pequenas utilitárias. Use \`function\` tradicional quando precisar de \`this\` dinâmico (raro), métodos de objeto/classe que dependam do \`this\` do dono, ou para hoisting (chamada antes da definição).`,
        starterCode: '// Crie a arrow function\n',
        solution: 'const dobro = (n) => n * 2;\nconsole.log(dobro(7));',
        expectedOutput: "14",
        hints: ["Sintaxe: const func = (param) => expressão", "const dobro = (n) => n * 2", "console.log(dobro(7))"],
        xpReward: 20,
        quiz: [
          { question: "Qual sintaxe define uma arrow function com um parâmetro?", options: ["function(n) => n*2", "const f = n => n*2", "const f = (n) -> n*2", "def f(n): n*2"], correctIndex: 1, explanation: "Arrow functions usam =>. Com um único parâmetro, os parênteses são opcionais. -> é Python/Haskell, def é Python." },
          { question: "Arrow functions têm seu próprio 'this'?", options: ["Sim, sempre", "Não, herdam do contexto", "Depende dos parâmetros", "Só em classes"], correctIndex: 1, explanation: "Arrow functions não criam seu próprio 'this' — herdam o 'this' do escopo onde foram definidas. Isso as torna ideais dentro de métodos de classe." },
        ],
      },
      {
        id: "2-4",
        title: "Template Literals",
        description: "Crie variáveis `nome` e `lang` e use template literals para exibir: **\"Olá, [nome]! Bem-vindo ao [lang].\"**",
        theory: `# Template Literals

## 💡 O que é
**Template literals** (template strings) são strings escritas com **crases** \`\` \`...\` \`\` em vez de aspas. Permitem **interpolar** variáveis e expressões diretamente no texto com \`\${...}\`, e suportam **múltiplas linhas** sem precisar de \`\\n\`.

## 🌍 Analogia do mundo real
É como **preencher um formulário com lacunas** em vez de colar pedacinhos com fita: em vez de \`"Olá, " + nome + "! Você tem " + idade + " anos."\` (frágil, difícil de ler), você escreve a frase inteira e marca os buracos: \\\`Olá, \${nome}! Você tem \${idade} anos.\\\`. O formulário é a string; \`\${}\` são as lacunas.

## 🔧 Sintaxe e como funciona
  const msg = \\\`texto comum \${expressão} mais texto\\\`;

• Use **crase** \\\` (não aspas).
• Dentro de \`\${...}\` cabe **qualquer expressão JavaScript**: variáveis, operações, chamadas de função, ternários.
• Quebras de linha dentro da crase **viram \\n no resultado** automaticamente.

## 📚 Exemplos comentados
  const nome = "Ana";
  const msg = \\\`Olá, \${nome}!\\\`;
  console.log(msg);                            // Olá, Ana!

  // Expressão dentro de \${ }
  const a = 10, b = 20;
  console.log(\\\`Soma: \${a + b}\\\`);              // Soma: 30
  console.log(\\\`Dobro: \${a * 2}\\\`);             // Dobro: 20

  // Chamando função
  const upper = (s) => s.toUpperCase();
  console.log(\\\`HEY \${upper("ana")}!\\\`);        // HEY ANA!

  // Strings multilinha — sem precisar de \\n
  const html = \\\`
    <div class="card">
      <h1>\${titulo}</h1>
      <p>\${conteudo}</p>
    </div>
  \\\`;

  // Ternário dentro da interpolação
  const idade = 17;
  console.log(\\\`Você é \${idade >= 18 ? "adulto" : "menor"}\\\`);

  // Comparação com a forma antiga (concatenação)
  // Antigo (frágil):
  "Olá, " + nome + "! Você tem " + idade + " anos.";
  // Moderno (limpo):
  \\\`Olá, \${nome}! Você tem \${idade} anos.\\\`;

## ⚠️ Erros comuns
• **Usar aspas em vez de crase**: \`"Olá, \${nome}"\` mostra literalmente \`\${nome}\` — só funciona com crase \\\`.
• **Esquecer o \`$\` antes de \`{ }\`**: \\\`Olá, {nome}\\\` mostra \`{nome}\` literal. Precisa ser \`\${...}\`.
• **Crase no meio do texto**: precisa escapar com \`\\\\\\\`\` ou trocar a estratégia.
• **Indentação aparece na saída**: tudo entre as crases é literal — espaços e quebras de linha viram parte da string.

## 🚀 Quando usar na prática
Template literals são **a forma padrão** de construir strings com variáveis em JS moderno: mensagens de log, queries SQL, HTML dinâmico, URLs com parâmetros, mensagens de erro. Em React, são onipresentes em \`className\`, atributos dinâmicos e textos. **Aprenda e use sempre** — concatenação com \`+\` virou estilo "antigo".`,
        starterCode: '// Use template literals\n',
        solution: 'const nome = "Dev";\nconst lang = "JavaScript";\nconsole.log(`Olá, ${nome}! Bem-vindo ao ${lang}.`);',
        expectedOutput: "Olá,",
        hints: ["Use crases em vez de aspas", "Interpolação: ${variavel}", 'console.log(`Olá, ${nome}!`)'],
        xpReward: 15,
      },
      {
        id: "2-5",
        title: "Desestruturação",
        description: "Dado o objeto `{nome: \"Ana\", idade: 25, cidade: \"SP\"}`, use desestruturação para extrair `nome` e `cidade`, e exiba ambas.",
        theory: `# Desestruturação (Destructuring)

## 💡 O que é
**Desestruturação** é uma sintaxe que extrai valores de **objetos** ou **arrays** para variáveis individuais, em uma linha só. Em vez de \`const nome = pessoa.nome\` repetido várias vezes, você escreve \`const { nome, idade } = pessoa\` — ganha legibilidade e menos código.

## 🌍 Analogia do mundo real
É como **descarregar uma caixa etiquetada**: em vez de tirar item por item dizendo "pega o açúcar, pega o sal, pega o arroz", você abre a caixa com um molde já etiquetado e cada item vai direto pro lugar certo na bancada. Nas listas (arrays), você usa o **lugar** (1º, 2º, 3º); nos objetos, você usa o **nome** da etiqueta.

## 🔧 Sintaxe e como funciona
**Objetos** — extrai pelo NOME da chave:
  const { chave1, chave2 } = objeto;

**Arrays** — extrai pela POSIÇÃO:
  const [primeiro, segundo] = array;

**Recursos extras:**
• Renomear: \`const { nome: firstName } = pessoa\`
• Valor padrão: \`const { email = "—" } = pessoa\`
• Pular itens em array: \`const [, , terceira] = cores\`
• Coletar o resto: \`const { nome, ...resto } = pessoa\`

## 📚 Exemplos comentados
  const pessoa = { nome: "Ana", idade: 25, cidade: "SP" };

  // Forma antiga (verbosa)
  const nome = pessoa.nome;
  const cidade = pessoa.cidade;

  // Com desestruturação (uma linha)
  const { nome, cidade } = pessoa;
  console.log(nome, cidade);                    // Ana SP

  // Renomeando — útil para evitar conflito de nomes
  const { nome: firstName, idade: age } = pessoa;
  // firstName = "Ana", age = 25

  // Valor padrão se a chave não existir
  const { email = "não informado" } = pessoa;
  // email = "não informado"

  // Arrays — pela posição
  const cores = ["vermelho", "verde", "azul"];
  const [primeira, segunda] = cores;            // primeira="vermelho", segunda="verde"
  const [, , terceira] = cores;                 // pula 2, pega "azul"

  // Direto nos parâmetros de função (muito comum em React)
  function Saudacao({ nome, sobrenome = "" }) {
    return \\\`Olá, \${nome} \${sobrenome}\\\`;
  }
  Saudacao({ nome: "Ana" });                    // "Olá, Ana "

  // Trocar valores sem variável temporária
  let a = 1, b = 2;
  [a, b] = [b, a];                              // a=2, b=1

  // Resto: pega uma chave + tudo o que sobrou
  const { nome, ...outras } = pessoa;
  // nome="Ana", outras={ idade: 25, cidade: "SP" }

## ⚠️ Erros comuns
• **Nome diferente da chave** sem renomear: \`const { fullName } = pessoa\` quando \`pessoa.fullName\` não existe → \`fullName\` vira \`undefined\`.
• **Confundir objeto com array**: usar \`{ }\` com array (\`const { 0: a } = arr\` funciona, mas é estranho); use \`[ ]\` para arrays.
• **Desestruturar \`null\` ou \`undefined\`**: \`const { x } = null\` → TypeError. Sempre verifique se o valor existe.
• **Esquecer parênteses ao usar inline depois de declarar**: \`{ a, b } = obj\` (sem \`const\`/\`let\`) precisa de parênteses → \`({ a, b } = obj)\`.

## 🚀 Quando usar na prática
**Onipresente em React e código moderno**:
• \`const [count, setCount] = useState(0)\` — array destructuring puro.
• \`function Botao({ label, onClick }) { ... }\` — extrai props nos parâmetros.
• \`const { data, error } = await fetch(...)\` — extrai resposta de APIs.
• Reorganizar dados de objetos retornados por bibliotecas em variáveis com nomes claros.`,
        starterCode: 'const pessoa = { nome: "Ana", idade: 25, cidade: "SP" };\n// Desestruture e exiba\n',
        solution: 'const pessoa = { nome: "Ana", idade: 25, cidade: "SP" };\nconst { nome, cidade } = pessoa;\nconsole.log(nome, cidade);',
        expectedOutput: "Ana",
        hints: ["const { nome, cidade } = pessoa", "Use console.log(nome, cidade)", "Desestruturação extrai valores do objeto"],
        xpReward: 20,
      },
      {
        id: "2-6",
        title: "Array Methods (map)",
        description: "Dado o array `[1, 2, 3, 4, 5]`, use `.map()` para criar um novo array com o **dobro** de cada número. Exiba o resultado.",
        theory: `# Array.map()

## 💡 O que é
\`.map()\` é um método de array que **cria um NOVO array** transformando cada item do original. Você passa uma função que define a transformação, e o map a aplica em cada elemento, na ordem.

## 🌍 Analogia do mundo real
Imagine uma **esteira numa fábrica de embalagens**: produtos crus entram, passam por uma máquina (a função de transformação) e saem embalados do outro lado. A esteira **não modifica** os produtos originais — gera uma nova fila de produtos transformados. \`.map()\` é exatamente isso: array de entrada → função de transformação → novo array de saída.

## 🔧 Sintaxe e como funciona
  const novoArray = arrayOriginal.map((item, index) => transformação);

• \`item\` → o valor atual sendo processado.
• \`index\` (opcional) → a posição (0, 1, 2...).
• A função deve **retornar** o novo valor — esquecer o return é o erro nº 1.
• \`.map()\` SEMPRE devolve array com o **mesmo tamanho** do original.

**Princípio importante: imutabilidade.** \`.map()\` NÃO altera o array original. Esse comportamento é a base do estilo "funcional" e do React.

## 📚 Exemplos comentados
  const nums = [1, 2, 3, 4, 5];

  // Dobrar cada número
  const dobros = nums.map(n => n * 2);
  // dobros = [2, 4, 6, 8, 10]
  // nums   = [1, 2, 3, 4, 5]   ← intacto

  // Transformar objetos — extrair um campo
  const usuarios = [
    { nome: "Ana", idade: 25 },
    { nome: "Bruno", idade: 30 }
  ];
  const nomes = usuarios.map(u => u.nome);
  // ["Ana", "Bruno"]

  // Usando o index
  const lista = ["maçã", "banana", "uva"];
  const numeradas = lista.map((item, i) => \\\`\${i + 1}. \${item}\\\`);
  // ["1. maçã", "2. banana", "3. uva"]

  // Em React: renderizar lista de componentes
  // posts.map(post => <Card key={post.id} title={post.title} />)

**Métodos parentes** (mesma família, vale conhecer):
  .filter(fn)   → mantém só os que passam no teste
  .reduce(fn,i) → acumula em um único valor
  .find(fn)     → retorna o primeiro que passa
  .forEach(fn)  → executa para cada um (sem retorno — uso para efeitos)

## ⚠️ Erros comuns
• **Esquecer o \`return\`**: \`nums.map(n => { n * 2 })\` retorna \`[undefined, undefined, ...]\`. Sem chaves: \`n => n * 2\` (return implícito) OU com chaves e \`return\` explícito.
• **Usar map só pelo efeito colateral**: se você não vai usar o array retornado, use \`.forEach()\` — comunica a intenção melhor.
• **Esperar que altere o original**: \`.map()\` retorna novo array. \`nums.map(...)\` sem \`const x =\` joga o resultado fora.
• **Em React, esquecer da \`key\`**: \`items.map(item => <Card />)\` sem \`key={item.id}\` gera warning e bugs de re-render.

## 🚀 Quando usar na prática
\`.map()\` é **provavelmente o método de array que você mais vai usar**: extrair campo específico de uma lista de objetos vinda de API, formatar valores para exibição, transformar dados antes de salvar, e — em React — renderizar listas de componentes (\`<ul>{items.map(...)}</ul>\`). Sempre que pensar "preciso transformar cada item desta lista", a resposta é \`.map\`.`,
        starterCode: 'const nums = [1, 2, 3, 4, 5];\n// Use map para dobrar\n',
        solution: 'const nums = [1, 2, 3, 4, 5];\nconst dobros = nums.map(n => n * 2);\nconsole.log(dobros);',
        expectedOutput: "2,4,6,8,10",
        hints: ["nums.map(n => n * 2)", "map() retorna um novo array", "console.log(dobros)"],
        xpReward: 20,
      },
      {
        id: "2-7",
        title: "Promises",
        description: "Crie uma Promise que resolve com **\"Dados carregados!\"** após 1 segundo. Use `.then()` para exibir a mensagem.",
        theory: `# Promises

## 💡 O que é
Uma **Promise** é um objeto que representa o **resultado futuro** de uma operação assíncrona — algo que VAI acontecer (com sucesso ou falha), mas não agora. Ela permite que você **espere** sem travar o resto do programa.

## 🌍 Analogia do mundo real
Imagine pedir comida num restaurante: você recebe uma **comanda numerada** (a Promise). Você não fica parado na cozinha esperando — pode conversar, mexer no celular. Quando a comida fica pronta, eles te chamam pelo número (\`.then\`). Se acabar o ingrediente, te avisam que não vai dar (\`.catch\`). A comanda em si não é a comida — é a **promessa de uma resposta futura**.

## 🔧 Sintaxe e como funciona
**Os 3 estados de uma Promise:**
• \`pending\` (pendente) → ainda processando (a comida está sendo preparada).
• \`fulfilled\` (resolvida) → terminou com sucesso (chegou a comida).
• \`rejected\` (rejeitada) → terminou com erro (acabou o ingrediente).

**Criando:**
  const promessa = new Promise((resolve, reject) => {
    // operação assíncrona aqui
    if (sucesso) resolve(valor);
    else         reject(erro);
  });

**Consumindo com \`.then\` / \`.catch\` / \`.finally\`:**
  promessa
    .then(valor => { /* chegou! */ })
    .catch(erro => { /* falhou */ })
    .finally(() => { /* roda sempre */ });

Cada \`.then\` pode **encadear** outro \`.then\` (chaining), passando seu retorno para o próximo.

## 📚 Exemplos comentados
  // Promise simples que sempre resolve
  const ok = new Promise((resolve) => {
    resolve("Dados carregados!");
  });
  ok.then(msg => console.log(msg));            // "Dados carregados!"

  // Simulando espera com setTimeout
  const carregar = new Promise((resolve) => {
    setTimeout(() => resolve("Pronto!"), 2000);
  });
  carregar.then(msg => console.log(msg));      // após 2s: "Pronto!"

  // Tratando sucesso E erro
  const dividir = (a, b) => new Promise((resolve, reject) => {
    if (b === 0) reject(new Error("Divisão por zero"));
    else         resolve(a / b);
  });

  dividir(10, 2)
    .then(r => console.log("Resultado:", r))   // Resultado: 5
    .catch(e => console.log("Erro:", e.message));

  // Encadeando .then (cada um recebe o resultado do anterior)
  fetch("/api/usuario")
    .then(res => res.json())                   // converte resposta em JSON
    .then(data => console.log(data.nome))      // usa o JSON
    .catch(err => console.error(err));

  // Promise.all — espera VÁRIAS promises ao mesmo tempo
  Promise.all([fetch("/a"), fetch("/b")])
    .then(([resA, resB]) => { /* ambas chegaram */ });

## ⚠️ Erros comuns
• **Esquecer o \`.catch\`**: erros silenciosos viram "UnhandledPromiseRejection". Sempre trate erros.
• **Não retornar dentro de \`.then\`**: o próximo \`.then\` recebe \`undefined\` se o anterior não retornar.
• **Confundir \`Promise\` com o valor**: \`const x = fetch(...)\` deixa \`x\` como Promise, NÃO como o resultado. Use \`.then\` ou \`await\`.
• **Criar Promise para algo síncrono**: se já tem o valor, não precisa de Promise — devolva direto.

## 🚀 Quando usar na prática
Promises são a base de **tudo o que demora** em JavaScript: chamadas a APIs (\`fetch\`), leitura de arquivos no Node, queries em banco de dados, animações com timer. Praticamente toda biblioteca moderna devolve Promises. Hoje, em código novo, você quase sempre vai usar Promises com \`async/await\` (próxima lição) — que é uma sintaxe ainda mais limpa por cima delas.`,
        starterCode: '// Crie uma Promise\n',
        solution: 'const promessa = new Promise((resolve) => {\n  setTimeout(() => resolve("Dados carregados!"), 1000);\n});\npromessa.then(msg => console.log(msg));',
        expectedOutput: "Dados carregados!",
        hints: ["new Promise((resolve) => { ... })", "Use setTimeout dentro da Promise", ".then(msg => console.log(msg))"],
        xpReward: 25,
      },
      {
        id: "2-8",
        title: "Async/Await",
        description: "Converta a Promise anterior para usar **async/await**. Crie uma função `async` que aguarda o resultado e exibe **\"Pronto!\"**.",
        theory: `# async / await

## 💡 O que é
\`async/await\` é uma **sintaxe moderna** para trabalhar com Promises. Faz código assíncrono **parecer e ler como código síncrono** — linha por linha, top-down — sem cadeias de \`.then\` aninhadas.

## 🌍 Analogia do mundo real
Lembra da analogia da comanda do restaurante (Promises)? Com \`.then\`, você fala: "quando a comida chegar, faça X; quando o suco chegar, faça Y". É como ficar passando bilhetes pro garçom. Com \`await\`, você simplesmente diz: **"espera a comida... agora come"**. O computador continua trabalhando em outras tarefas durante a espera, mas o SEU código fica linear, fácil de seguir.

## 🔧 Sintaxe e como funciona
**Duas palavras-chave:**
• \`async\` antes da função → essa função sempre devolve uma Promise e **permite usar \`await\` dentro**.
• \`await\` antes de uma Promise → **pausa** a função até a Promise resolver, e devolve o valor resolvido.

  async function buscar() {
    const resultado = await algumaPromise();
    console.log(resultado);
  }

**Tratando erros**: use \`try/catch\` (do JavaScript normal!).

## 📚 Exemplos comentados
  // Forma antiga com .then (chaining)
  fetch("/api/dados")
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));

  // Mesma coisa com async/await — linear, mais legível
  async function buscar() {
    try {
      const res = await fetch("/api/dados");
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error("Falhou:", err);
    }
  }

  // Aguardando múltiplas operações em série
  async function fluxo() {
    const usuario = await fetchUsuario();
    const posts = await fetchPosts(usuario.id);   // só roda quando usuario chegar
    return posts;
  }

  // Aguardando em PARALELO (mais rápido!)
  async function paralelo() {
    const [a, b] = await Promise.all([
      fetch("/api/a"),
      fetch("/api/b")
    ]);
    return { a, b };
  }

  // async function SEMPRE devolve Promise
  async function ola() { return "oi"; }
  ola().then(v => console.log(v));    // "oi"

## ⚠️ Erros comuns
• **\`await\` fora de \`async\`**: \`const x = await fetch(...)\` em escopo top-level antigo → SyntaxError (módulos modernos permitem top-level await; verifique seu setup).
• **Esquecer o \`await\`**: \`const data = res.json()\` deixa \`data\` como Promise, não como o JSON. Esquecer await é um bug clássico e silencioso.
• **Encadear awaits que poderiam ser paralelos**: dois \`await fetch(...)\` em sequência são lentos se um não depende do outro. Use \`Promise.all\`.
• **Esquecer try/catch**: erros em \`await\` viram exceções não tratadas. Sempre envolva em \`try/catch\` (ou trate com \`.catch\` no chamador).

## 🚀 Quando usar na prática
**Padrão moderno** para tudo que envolve espera: chamadas a APIs, leitura de arquivos no Node, queries em banco de dados, integrações com serviços externos. Em React, \`useEffect(() => { async function load() { const d = await fetch(...) } load(); }, [])\`. Em código novo, prefira sempre \`async/await\` em vez de \`.then\` — só use \`.then\` para uma transformação rápida em uma linha.`,
        starterCode: '// Use async/await\n',
        solution: 'async function carregar() {\n  const msg = await new Promise(resolve => setTimeout(() => resolve("Pronto!"), 1000));\n  console.log(msg);\n}\ncarregar();',
        expectedOutput: "Pronto!",
        hints: ["async function nomeDaFuncao() { ... }", "const resultado = await promise", "Não esqueça de chamar a função"],
        xpReward: 25,
      },
      {
        id: "2-9",
        title: "Spread e Rest",
        description: "Use o operador **spread** para combinar dois arrays `[1,2,3]` e `[4,5,6]` em um só. Depois crie uma função com **rest** que soma todos os argumentos.",
        theory: `# Spread e Rest

## 💡 O que é
\`...\` (três pontos) tem **dois usos opostos** dependendo do contexto:
• **Spread** → **expande** um array/objeto em itens individuais.
• **Rest** → **agrupa** vários itens em um array.

A sintaxe é igual; o que muda é **onde** você usa.

## 🌍 Analogia do mundo real
Imagine um **kit de talheres**:
• **Spread** é abrir o kit e **espalhar** garfo, faca e colher pela mesa.
• **Rest** é **juntar** garfo, faca e colher avulsos e fechar o kit de novo.

Mesma operação em sentido inverso. O JS sabe qual é qual pelo lugar onde aparece (do lado direito de \`=\` é spread; em parâmetros de função ou desestruturação é rest).

## 🔧 Sintaxe e como funciona
**Spread — em LITERAIS de array/objeto:**
  const c = [...a, ...b];                    // junta arrays
  const novo = { ...obj, prop: valor };      // copia + adiciona/altera

**Rest — em PARÂMETROS de função ou desestruturação:**
  function f(...args) { /* args é array */ }
  const [primeiro, ...resto] = lista;        // resto vira array
  const { a, ...outras } = objeto;           // outras vira objeto

## 📚 Exemplos comentados
  // SPREAD em arrays
  const a = [1, 2, 3];
  const b = [4, 5, 6];
  const c = [...a, ...b];                    // [1, 2, 3, 4, 5, 6]
  const copia = [...a];                      // cópia rasa de a
  const comExtra = [0, ...a, 4];             // [0, 1, 2, 3, 4]

  // SPREAD em objetos
  const usuario = { nome: "Ana", idade: 25 };
  const completo = { ...usuario, cidade: "SP" };
  // { nome: "Ana", idade: 25, cidade: "SP" }

  const atualizado = { ...usuario, idade: 26 };
  // { nome: "Ana", idade: 26 } — sobrescreve a chave existente

  // SPREAD para passar array como argumentos
  Math.max(...[3, 7, 1, 9]);                 // 9 (igual a Math.max(3,7,1,9))

  // REST em parâmetros — recebe N argumentos como array
  function somar(...numeros) {
    return numeros.reduce((acc, n) => acc + n, 0);
  }
  somar(1, 2, 3, 4);                         // 10

  // REST em desestruturação de array
  const [primeiro, ...resto] = [10, 20, 30, 40];
  // primeiro=10, resto=[20, 30, 40]

  // REST em desestruturação de objeto
  const { nome, ...outras } = { nome: "Ana", idade: 25, cidade: "SP" };
  // nome="Ana", outras={idade: 25, cidade: "SP"}

## ⚠️ Erros comuns
• **Confundir spread com cópia profunda**: \`{ ...obj }\` faz cópia **rasa** — objetos aninhados ainda compartilham referência. Para cópia profunda, use \`structuredClone(obj)\`.
• **Ordem importa**: \`{ a: 1, ...obj }\` vs \`{ ...obj, a: 1 }\` — quem vier depois sobrescreve.
• **Rest precisa ser o ÚLTIMO**: \`function(a, ...rest, b)\` → SyntaxError. \`...rest\` sempre fecha a lista.
• **Spread em \`null\`/\`undefined\`**: spread de array (\`[...null]\`) → TypeError; spread de objeto (\`{ ...null }\`) → ok (vira \`{}\`). Cuidado com os tipos.

## 🚀 Quando usar na prática
**Spread** é onipresente em React/Redux para atualizar estado **imutavelmente**: \`setUsuario({ ...usuario, nome: "Novo" })\`. Também é o jeito de copiar arrays/objetos antes de modificar. **Rest** brilha em funções flexíveis (\`function log(...args)\`) e em desestruturação para "pegar isso aqui e tudo o que sobrou". Os dois juntos são essenciais em código moderno.`,
        starterCode: '// Spread e Rest\n',
        solution: 'const a = [1, 2, 3];\nconst b = [4, 5, 6];\nconst combinado = [...a, ...b];\nconsole.log(combinado);\n\nfunction somar(...nums) {\n  return nums.reduce((acc, n) => acc + n, 0);\n}\nconsole.log(somar(1, 2, 3, 4));',
        expectedOutput: "1,2,3,4,5,6",
        hints: ["Spread: [...array1, ...array2]", "Rest: function f(...args)", "reduce para somar todos"],
        xpReward: 20,
        quiz: [
          { question: "O que o operador spread faz?", options: ["Coleta argumentos", "Expande um array/objeto", "Cria uma cópia profunda", "Remove duplicatas"], correctIndex: 1, explanation: "Spread (...) expande os elementos de um array ou propriedades de um objeto. Ex: [...arr1, ...arr2] junta dois arrays. Rest (...args) faz o oposto — coleta." },
        ],
      },
      {
        id: "2-10",
        title: "Classes",
        description: "Crie uma classe **Animal** com propriedades `nome` e `som`. Adicione um método `falar()` que retorna **\"[nome] faz [som]!\"**.",
        theory: `# Classes em JavaScript

## 💡 O que é
**Classes** (ES6+) são "moldes" para criar objetos que combinam **propriedades** (dados) e **métodos** (comportamentos). É a sintaxe moderna e organizada para POO em JavaScript — por baixo, ainda usa prototypes, mas a leitura fica muito mais clara.

## 🌍 Analogia do mundo real
Uma classe é a **planta de uma casa**: define os cômodos (propriedades) e o que dá pra fazer em cada um (métodos). Cada **objeto** criado a partir dela é uma **casa real construída** com aquela planta. Todas as casas seguem o mesmo molde, mas cada uma tem seus próprios moradores e estado (cor da parede, móveis). \`new\` é o construtor erguendo uma casa nova; \`this\` é "essa casa aqui".

## 🔧 Sintaxe e como funciona
  class Animal {
    constructor(nome, som) {
      this.nome = nome;     // propriedade
      this.som = som;
    }

    falar() {              // método
      return \\\`\${this.nome} faz \${this.som}!\\\`;
    }
  }

  const gato = new Animal("Gato", "miau");
  gato.falar();            // "Gato faz miau!"

**Conceitos-chave:**
• \`class\` → palavra-chave que define o molde. PascalCase no nome.
• \`constructor\` → método especial chamado automaticamente ao usar \`new\`.
• \`this\` → referência ao objeto sendo criado/usado no momento.
• \`new\` → operador que cria uma instância da classe.

**Herança** com \`extends\` e \`super\`:
  class Cachorro extends Animal {
    constructor(nome) {
      super(nome, "au au");    // chama o constructor pai
    }
    buscar(item) {
      return \\\`\${this.nome} buscou \${item}!\\\`;
    }
  }

## 📚 Exemplos comentados
  class Carrinho {
    constructor() {
      this.itens = [];           // estado inicial
    }

    adicionar(item) {
      this.itens.push(item);
    }

    total() {
      return this.itens.reduce((s, i) => s + i.preco, 0);
    }
  }

  const c = new Carrinho();
  c.adicionar({ nome: "Café", preco: 15 });
  c.adicionar({ nome: "Pão", preco: 5 });
  console.log(c.total());      // 20

  // Herança
  class CarrinhoVIP extends Carrinho {
    total() {
      return super.total() * 0.9;   // 10% desconto, reaproveita pai
    }
  }

  // Getters e setters — métodos que parecem propriedades
  class Pessoa {
    #idade = 0;                  // # = privado (ES2022)
    get idade() { return this.#idade; }
    set idade(v) {
      if (v < 0) throw new Error("Idade inválida");
      this.#idade = v;
    }
  }
  const p = new Pessoa();
  p.idade = 30;                  // chama o setter
  console.log(p.idade);          // 30 (chama o getter)

  // Métodos estáticos — pertencem à classe, não à instância
  class Util {
    static formatar(n) { return n.toFixed(2); }
  }
  Util.formatar(3.14159);        // "3.14" — sem precisar de new

## ⚠️ Erros comuns
• **Esquecer \`new\`**: \`Animal("Gato")\` (sem new) → TypeError ou \`undefined\` em \`this\`. Sempre use \`new\`.
• **Esquecer \`super()\` na herança**: classe filha sem \`super(...)\` no constructor → ReferenceError ao usar \`this\`.
• **Perder o \`this\` em callbacks**: \`btn.onClick = obj.metodo\` perde o \`this\`. Use arrow function ou \`.bind\`.
• **Achar que classes "criam" novos objetos imutáveis**: instâncias são **mutáveis** — modificar \`gato.nome = "X"\` funciona normalmente.

## 🚀 Quando usar na prática
Classes brilham quando você tem **muitas instâncias** com estado próprio: usuários, produtos, jogadores, conexões com banco, requisições. Frameworks como Angular, NestJS, e bibliotecas como Three.js usam classes intensivamente. Em React moderno, **componentes funcionais com hooks** substituíram quase todo uso de classes — mas você ainda vai encontrar classes em código legado, em libs OOP e em modelos de dados (ex.: Sequelize, Mongoose, TypeORM).`,
        starterCode: '// Crie a classe Animal\n',
        solution: 'class Animal {\n  constructor(nome, som) {\n    this.nome = nome;\n    this.som = som;\n  }\n  falar() {\n    return `${this.nome} faz ${this.som}!`;\n  }\n}\nconst gato = new Animal("Gato", "miau");\nconsole.log(gato.falar());',
        expectedOutput: "Gato faz miau!",
        hints: ["class NomeClasse { constructor() { } }", "this.propriedade = valor", "Métodos são funções dentro da classe"],
        xpReward: 25,
        quiz: [
          { question: "O que o constructor() faz?", options: ["Destrói o objeto", "Inicializa o objeto ao criá-lo", "Herda de outra classe", "Exporta a classe"], correctIndex: 1, explanation: "constructor() é chamado automaticamente quando você usa 'new MinhaClasse()'. É onde você define e atribui os valores iniciais dos atributos do objeto." },
        ],
      },
      {
        id: "2-11",
        title: "Array Methods Avançados",
        description: "Dado `[12, 5, 8, 130, 44]`, use **filter** para pegar números > 10, depois **reduce** para somá-los.",
        theory: `# Array Methods Avançados

## 💡 O que é
Além de \`.map()\`, JavaScript tem um **arsenal de métodos de array** para filtrar, agregar, buscar e transformar dados sem loops. Dominar \`filter\`, \`reduce\`, \`find\`, \`some\` e \`every\` muda completamente como você escreve código.

## 🌍 Analogia do mundo real
Pense numa **central de triagem de cartas dos Correios**:
• \`filter\` é o **selecionador** que separa cartas por critério (só as do CEP X).
• \`reduce\` é o **caixa contador** que vai somando o peso de cada uma até chegar no total.
• \`find\` é o **localizador** que para na primeira carta com determinado nome.
• \`some\`/\`every\` são os **inspetores**: "tem alguma com selo internacional?" / "todas estão fechadas?".

## 🔧 Sintaxe e como funciona
  .filter(fn)     → NOVO array com itens onde fn devolve true
  .reduce(fn, i)  → acumula em UM valor único (i = valor inicial)
  .find(fn)       → o PRIMEIRO item onde fn é true (ou undefined)
  .findIndex(fn)  → o ÍNDICE do primeiro item (ou -1)
  .some(fn)       → true se PELO MENOS UM passa
  .every(fn)      → true se TODOS passam
  .flat(depth)    → achata arrays aninhados
  .flatMap(fn)    → map seguido de flat (1 nível)
  .includes(v)    → true se contém o valor

A grande sacada: **todos esses métodos podem ser ENCADEADOS** (chaining) — saída de um vira entrada do próximo.

## 📚 Exemplos comentados
  const nums = [12, 5, 8, 130, 44];

  // filter — só os que passam no teste
  const grandes = nums.filter(n => n > 10);
  // [12, 130, 44]

  // reduce — acumula em UM valor (acc=acumulador, n=item, 0=inicial)
  const soma = nums.reduce((acc, n) => acc + n, 0);
  // 199

  // reduce mais avançado: contar ocorrências
  const frutas = ["maçã", "banana", "maçã", "uva"];
  const contagem = frutas.reduce((acc, f) => {
    acc[f] = (acc[f] || 0) + 1;
    return acc;
  }, {});
  // { maçã: 2, banana: 1, uva: 1 }

  // find — primeiro que passa
  nums.find(n => n > 10);          // 12
  nums.find(n => n > 9999);        // undefined

  // findIndex — posição do primeiro
  nums.findIndex(n => n > 100);    // 3

  // some / every — perguntas booleanas
  nums.some(n => n > 100);         // true (130 passa)
  nums.every(n => n > 0);          // true (todos positivos)

  // flat / flatMap — achatar
  [[1, 2], [3, 4]].flat();         // [1, 2, 3, 4]
  ["hello world", "foo bar"].flatMap(s => s.split(" "));
  // ["hello", "world", "foo", "bar"]

  // ENCADEAMENTO (chaining) — onde brilha de verdade
  const resultado = nums
    .filter(n => n > 10)           // [12, 130, 44]
    .map(n => n * 2)               // [24, 260, 88]
    .reduce((acc, n) => acc + n, 0); // 372

## ⚠️ Erros comuns
• **\`reduce\` sem valor inicial**: \`[].reduce((a,b)=>a+b)\` → TypeError. SEMPRE passe o segundo argumento.
• **Confundir \`find\` com \`filter\`**: \`find\` retorna **um item** (ou undefined); \`filter\` retorna **array** (vazio se nada passa).
• **\`some\` em array vazio = false; \`every\` em array vazio = true**: comportamento padrão, mas pega gente desprevenida.
• **Encadear muitos métodos**: legível, mas cada um cria array intermediário. Para arrays gigantes, considere um loop direto.

## 🚀 Quando usar na prática
**Todo dia**, em todo projeto: filtrar produtos por preço, somar valores de pedidos, buscar usuário por id, agrupar registros por categoria, validar se todos os campos estão preenchidos. Esses métodos substituem 90% dos loops \`for\` em JS moderno e tornam o código quase autoexplicativo: \`pedidos.filter(p => p.pago).reduce((s, p) => s + p.valor, 0)\` lê como uma frase.`,
        starterCode: 'const nums = [12, 5, 8, 130, 44];\n// filter e reduce\n',
        solution: 'const nums = [12, 5, 8, 130, 44];\nconst grandes = nums.filter(n => n > 10);\nconst soma = grandes.reduce((acc, n) => acc + n, 0);\nconsole.log(grandes);\nconsole.log(soma);',
        expectedOutput: "12,130,44",
        hints: [".filter(n => n > 10) filtra", ".reduce((acc, n) => acc + n, 0) soma", "Encadeie os métodos"],
        xpReward: 25,
        quiz: [
          { question: "O que .reduce() faz?", options: ["Filtra itens", "Transforma cada item", "Acumula um valor final", "Encontra um item"], correctIndex: 2, explanation: ".reduce() percorre o array acumulando um resultado único. Ex: [1,2,3].reduce((acc, n) => acc + n, 0) retorna 6 (soma de todos). .filter() filtra, .map() transforma." },
        ],
      },
      {
        id: "2-12",
        title: "Closures",
        description: "Crie uma função **criarContador()** que retorna uma função interna. Cada vez que a função interna é chamada, incrementa e retorna o valor.",
        theory: `# Closures

## 💡 O que é
Uma **closure** acontece quando uma função "lembra" das variáveis do **escopo onde foi criada**, mesmo depois daquele escopo ter terminado de executar. É um dos conceitos mais poderosos (e confusos) de JavaScript — entendê-lo desbloqueia React hooks, callbacks e módulos.

## 🌍 Analogia do mundo real
Imagine um **fotógrafo de formatura**: ele tira a foto da turma toda numa sala. Anos depois, mesmo a sala não existindo mais, a foto **ainda preserva** quem estava lá. A função interna é a foto; o escopo externo é a sala. Quando você executa a função interna depois, ela "olha pra foto" e ainda enxerga as variáveis daquela sala original.

## 🔧 Sintaxe e como funciona
A receita básica:
  function externa() {
    let memoria = 0;          // variável do escopo externo
    return function interna() {
      memoria++;              // lê e modifica a "memória"
      return memoria;
    };
  }

Quando \`externa()\` termina, \`memoria\` **não é destruída** — fica viva enquanto a função interna existir. Cada chamada a \`externa()\` cria um **escopo independente** (memória própria).

## 📚 Exemplos comentados
  // 1) Contador clássico — guarda estado privado
  function criarContador() {
    let count = 0;
    return function() {
      count++;
      return count;
    };
  }

  const contador = criarContador();
  console.log(contador());    // 1
  console.log(contador());    // 2
  console.log(contador());    // 3

  const outro = criarContador();
  console.log(outro());       // 1 — escopo INDEPENDENTE!

  // 2) Function factory — cria funções configuradas
  function multiplicador(fator) {
    return (n) => n * fator;       // "lembra" do fator
  }
  const dobro = multiplicador(2);
  const triplo = multiplicador(3);
  dobro(5);    // 10
  triplo(5);   // 15

  // 3) Encapsulamento — dados privados sem classes
  function criarConta(saldoInicial) {
    let saldo = saldoInicial;        // PRIVADO, ninguém acessa direto
    return {
      depositar: (v) => { saldo += v; },
      sacar:     (v) => { saldo -= v; },
      ver:       () => saldo
    };
  }
  const conta = criarConta(100);
  conta.depositar(50);
  conta.ver();                  // 150
  // conta.saldo               ← undefined! protegido pela closure

  // 4) Bug clássico em loops — closures num for com var
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
  }
  // Imprime: 3, 3, 3 (todos compartilham o mesmo i!)
  // Solução: trocar var por let → cada iteração ganha seu próprio escopo
  for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);  // 0, 1, 2 ✓
  }

## ⚠️ Erros comuns
• **Não perceber que cada chamada cria escopo novo**: \`criarContador()\` chamada duas vezes dá DUAS memórias separadas, não compartilhadas.
• **\`var\` em loops com closures**: o famoso bug "imprime sempre o último valor". Use \`let\`.
• **Closures retêm muita memória**: se a função interna lembra um objeto enorme, ele não é coletado pelo garbage collector. Cuidado em apps de longa duração.
• **Confundir closure com escopo léxico simples**: closure é especificamente quando a função sobrevive ao escopo onde foi criada (é retornada, salva, passada).

## 🚀 Quando usar na prática
Closures estão **escondidas em todo lugar** no código moderno:
• React hooks (\`useState\`, \`useCallback\`) usam closures internamente.
• Callbacks de eventos lembram do estado do componente.
• Módulos ES6 emulam variáveis privadas via closures.
• Frameworks de teste (jest mocks, spies) e bibliotecas funcionais (lodash, ramda) dependem delas.

Você não precisa criar closures conscientemente o tempo todo, mas precisa **reconhecê-las** para entender por que algumas coisas funcionam (e por que outras dão bug).`,
        starterCode: '// Crie a closure\n',
        solution: 'function criarContador() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst contador = criarContador();\nconsole.log(contador());\nconsole.log(contador());\nconsole.log(contador());',
        expectedOutput: "1",
        hints: ["A função externa define a variável", "A função interna acessa e modifica", "Cada chamada a criarContador() cria um escopo novo"],
        xpReward: 30,
      },
      {
        id: "2-13",
        title: "Módulos ES6",
        description: "Crie um módulo que **exporta** uma função `somar` e outra `subtrair`. Depois importe e use ambas.",
        theory: `# Módulos ES6 (import / export)

## 💡 O que é
**Módulos ES6** (ESM) permitem dividir seu código em **arquivos separados** que **exportam** funcionalidades e **importam** umas das outras. É o padrão moderno e oficial do JavaScript para organização de código.

## 🌍 Analogia do mundo real
Pense numa **caixa de ferramentas modular**: cada gaveta (arquivo) tem ferramentas específicas. Em vez de carregar uma caixa gigante com tudo dentro, você abre só a gaveta que precisa (\`import\`). Quem cria a gaveta decide quais ferramentas ficam visíveis (\`export\`). Resultado: código organizado, fácil de manter e mais leve para o navegador (só carrega o que usa).

## 🔧 Sintaxe e como funciona
**Named exports** — exportar várias coisas com nome:
  // math.js
  export function somar(a, b) { return a + b; }
  export function subtrair(a, b) { return a - b; }
  export const PI = 3.14;

  // outra forma — declarar e exportar separados
  function dobrar(n) { return n * 2; }
  export { dobrar };

  // main.js — chaves \`{ }\` obrigatórias, mesmo nome
  import { somar, subtrair, PI } from "./math.js";

**Default export** — UMA coisa principal por arquivo:
  // logger.js
  export default function log(msg) { console.log(\\\`[LOG] \${msg}\\\`); }

  // main.js — sem chaves, nome livre
  import log from "./logger.js";
  import qualquerNome from "./logger.js";  // funciona — você escolhe o nome

**Diferença visual:**
  Named:    export { x }       →  import { x } from "..."
  Default:  export default x   →  import x from "..."

## 📚 Exemplos comentados
  // utils.js — vários named + um default
  export const VERSION = "1.0";
  export function formatar(n) { return n.toFixed(2); }
  export default class App { /* ... */ }

  // main.js — combina tudo
  import App, { VERSION, formatar } from "./utils.js";

  // Renomear ao importar
  import { somar as add, subtrair as sub } from "./math.js";

  // Importar TUDO como namespace
  import * as Math from "./math.js";
  Math.somar(1, 2);

  // Re-export (barrel file — index.js que centraliza)
  // index.js
  export { somar, subtrair } from "./math.js";
  export { default as Logger } from "./logger.js";

  // Em outro arquivo
  import { somar, Logger } from "./index.js";

  // Comparação com CommonJS (Node.js antigo — evite em projetos novos)
  // CommonJS:
  module.exports = { somar };
  const { somar } = require("./math");

  // ESM (moderno):
  export { somar };
  import { somar } from "./math.js";

## ⚠️ Erros comuns
• **Esquecer chaves em named import**: \`import somar from "./math.js"\` quando \`somar\` é named → \`somar\` vira \`undefined\`.
• **Mais de um \`export default\`** no mesmo arquivo → SyntaxError. Default é único.
• **Path errado**: caminhos relativos precisam de \`./\` ou \`../\` (\`import x from "math"\` é tratado como pacote npm).
• **Esquecer extensão \`.js\`** em ambientes que exigem (Node ESM puro). Em bundlers (Vite, webpack), geralmente é opcional.
• **Importar circular** (A importa B que importa A): pode resultar em \`undefined\` em uma das pontas.

## 🚀 Quando usar na prática
**Em todo projeto JavaScript moderno**: cada arquivo é um módulo. React, Vue, Node.js, ferramentas de build (Vite, webpack) — todos usam ESM. Padrões úteis: um componente/utilitário por arquivo (default export), constantes e helpers como named exports, e \`index.js\` como "barrel" para reexportar tudo de uma pasta. Em projetos antigos de Node, você vai ver CommonJS (\`require\`/\`module.exports\`) — saiba reconhecer, mas em código novo prefira ESM sempre.`,
        starterCode: '// Crie exports e imports\n',
        solution: '// math.js\nexport function somar(a, b) { return a + b; }\nexport function subtrair(a, b) { return a - b; }\n\n// main.js\n// import { somar, subtrair } from "./math.js";\nconsole.log(somar(10, 5));\nconsole.log(subtrair(10, 5));',
        expectedOutput: "15",
        hints: ["export function para exportar", "import { func } from para importar", "Named exports usam chaves {}"],
        xpReward: 20,
        quiz: [
          { question: "Qual a diferença entre named e default export?", options: ["Named é mais rápido", "Default só pode ter um por arquivo", "Named não funciona com funções", "Default precisa de chaves"], correctIndex: 1, explanation: "Cada arquivo pode ter apenas um export default. Named exports usam { chaves } ao importar. Default exports podem ser importados com qualquer nome." },
        ],
      },
      {
        id: "2-14",
        title: "Error Handling",
        description: "Crie uma função **dividir(a, b)** que lança um **Error** se b for 0. Use **try/catch** para capturar o erro.",
        theory: `# Tratamento de Erros (try / catch / throw)

## 💡 O que é
Tratamento de erros permite **prever falhas** e **reagir a elas** sem que seu programa quebre. JavaScript usa \`try / catch / finally\` para capturar e \`throw\` para lançar erros, igual a outras linguagens.

## 🌍 Analogia do mundo real
É como **dirigir com cinto de segurança e airbag**: você não dirige esperando bater, mas se algo der errado, os sistemas de segurança entram em ação. \`try\` é a estrada normal; \`catch\` é o airbag que infla quando há acidente; \`finally\` é a equipe de limpeza que vai aparecer com ou sem batida; \`throw\` é o "alerta sonoro" que VOCÊ dispara quando detecta perigo.

## 🔧 Sintaxe e como funciona
  try {
    // código que PODE falhar
  } catch (erro) {
    // o que fazer SE falhar (erro tem .message, .name, .stack)
  } finally {
    // roda SEMPRE, com ou sem erro (opcional)
  }

**Lançando erros customizados:**
  throw new Error("Mensagem aqui");

**Tipos built-in que o JS pode disparar sozinho:**
• \`Error\`          → genérico
• \`TypeError\`      → tipo errado (\`null.toString()\`)
• \`RangeError\`     → valor fora do intervalo
• \`ReferenceError\` → variável não declarada
• \`SyntaxError\`    → erro de sintaxe (raro em runtime)

## 📚 Exemplos comentados
  // 1) Capturar erro de operação
  try {
    const data = JSON.parse(textoSuspeito);
  } catch (e) {
    console.error("JSON inválido:", e.message);
  }

  // 2) Lançar erro próprio
  function dividir(a, b) {
    if (b === 0) throw new Error("Divisão por zero!");
    return a / b;
  }

  try {
    console.log(dividir(10, 2));    // 5
    console.log(dividir(10, 0));    // dispara erro
  } catch (err) {
    console.log("Erro:", err.message);   // "Erro: Divisão por zero!"
  }

  // 3) Erros customizados (classes próprias)
  class ValidacaoError extends Error {
    constructor(campo, mensagem) {
      super(mensagem);
      this.name = "ValidacaoError";
      this.campo = campo;
    }
  }

  try {
    if (!email.includes("@")) {
      throw new ValidacaoError("email", "Email inválido");
    }
  } catch (e) {
    if (e instanceof ValidacaoError) {
      console.log(\\\`Campo \${e.campo}: \${e.message}\\\`);
    } else {
      throw e;   // re-lança se não é o esperado
    }
  }

  // 4) async/await — try/catch funciona normal
  async function buscar() {
    try {
      const res = await fetch("/api");
      if (!res.ok) throw new Error(\\\`HTTP \${res.status}\\\`);
      return await res.json();
    } catch (err) {
      console.error("Falha:", err.message);
      return null;
    }
  }

  // 5) Promise pura — use .catch
  fetch("/api")
    .then(res => res.json())
    .catch(err => console.error(err));

## ⚠️ Erros comuns
• **Engolir o erro com \`catch\` vazio**: \`catch(e) {}\` esconde problemas e dificulta debug. Pelo menos faça \`console.error(e)\`.
• **\`try\` gigante**: envolver 100 linhas em try torna impossível saber qual delas falhou. Mantenha \`try\` **pequeno e focado**.
• **Capturar tipo errado**: \`catch (e)\` pega TUDO. Se quer só um tipo, use \`if (e instanceof TipoX)\` e re-lance os outros.
• **\`throw "string"\`**: tecnicamente funciona mas é má prática. Sempre use \`throw new Error(...)\` para ter \`stack trace\`.
• **Esquecer \`await\` antes do \`fetch\`**: o erro vira "rejeição não tratada" porque o try terminou antes da Promise resolver.

## 🚀 Quando usar na prática
Use try/catch em pontos onde **não dá pra confiar 100%** no que vem de fora: parsing de JSON do usuário, chamadas a APIs (a internet pode cair), leitura de arquivos, validação de inputs. Não envolva tudo em try — código com try em cada linha fica ilegível e esconde lógica. Crie classes de erro customizadas para domínios importantes do seu app (ex.: \`PagamentoError\`, \`AutenticacaoError\`) — isso facilita reagir de forma diferente para cada caso.`,
        starterCode: '// Crie a função com error handling\n',
        solution: 'function dividir(a, b) {\n  if (b === 0) throw new Error("Divisão por zero!");\n  return a / b;\n}\n\ntry {\n  console.log(dividir(10, 2));\n  console.log(dividir(10, 0));\n} catch (err) {\n  console.log("Erro:", err.message);\n}',
        expectedOutput: "5",
        hints: ["throw new Error() lança um erro", "try/catch captura o erro", "err.message contém a mensagem"],
        xpReward: 25,
      },
    
    ],
  },
  {
    id: "3",
    title: "React & TypeScript",
    language: "React",
    emoji: "⚛️",
    level: "Intermediário",
    duration: "40h",
    students: 7200,
    progress: 0,
    color: "quest-blue",
    tags: ["Em alta"],
    description: "Construa aplicações modernas com React e TypeScript — componentes, hooks e estado.",
    lessons: [
      {
        id: "3-1",
        title: "Primeiro Componente",
        description: "Crie um componente funcional `Saudacao` que exibe **\"Olá, React!\"** em um `<h1>`. Exporte-o como default.",
        theory: `# Componentes em React

## 💡 O que é
Um **componente** é uma função JavaScript que retorna **JSX** (uma sintaxe parecida com HTML) e descreve um pedaço da interface. Toda tela em React é uma árvore de componentes encaixados uns nos outros.

## 🌍 Analogia do mundo real
Pense em **peças de LEGO**: cada peça (\`<Botao />\`, \`<Cartao />\`, \`<Avatar />\`) é pequena, faz uma coisa só, e se encaixa com outras para montar telas inteiras. Você desenha uma vez e reusa em todo lugar.

## 🔧 Sintaxe e como funciona
  function MeuComponente() {       // 1. função com nome em PascalCase
    return <h1>Olá!</h1>;          // 2. retorna UM elemento JSX
  }
  export default MeuComponente;    // 3. exporta para usar em outros arquivos

Regras de ouro:
• Nome **sempre** com letra maiúscula (\`Cartao\`, não \`cartao\`).
• Retorne **um único elemento raiz** (use \`<div>\` ou o fragmento \`<>...</>\` para agrupar vários).
• JSX troca alguns nomes do HTML: \`class\` → \`className\`, \`for\` → \`htmlFor\`, \`onclick\` → \`onClick\`.

## 📚 Exemplos comentados
  // 1. Componente puro estático
  function Titulo() {
    return <h1>Bem-vindo!</h1>;
  }

  // 2. Usando uma variável dentro do JSX com {}
  function Saudacao() {
    const nome = "React";
    return <h1>Olá, {nome}!</h1>;   // chaves = expressão JS
  }

  // 3. Compondo componentes (um dentro do outro)
  function App() {
    return (
      <div>
        <Titulo />
        <Saudacao />
      </div>
    );
  }

## ⚠️ Erros comuns
• Esquecer a **letra maiúscula** no nome → React trata como tag HTML desconhecida.
• Retornar **dois elementos irmãos sem agrupar** → erro de sintaxe; envolva em \`<>...</>\`.
• Usar \`class="..."\` em vez de \`className="..."\` → o atributo é ignorado e o estilo não aplica.

## 🚀 Quando usar na prática
**Sempre.** Toda UI em React é construída assim. Componentes pequenos e focados (um botão, um input, um card) são combinados em componentes maiores (formulário, página) — exatamente como construir um app inteiro com LEGO.`,
        starterCode: '// Crie o componente Saudacao\n',
        solution: 'function Saudacao() {\n  return <h1>Olá, React!</h1>;\n}\nexport default Saudacao;',
        expectedOutput: "Olá, React!",
        hints: ["function NomeComponente() { return ... }", "Use JSX: <h1>texto</h1>", "export default Saudacao"],
        xpReward: 10,
        quiz: [
          { question: "O que um componente React retorna?", options: ["HTML puro", "JSX", "Uma string", "Um objeto"], correctIndex: 1, explanation: "Componentes React retornam JSX — uma sintaxe parecida com HTML, mas que é convertida para JavaScript. JSX permite misturar UI e lógica de forma declarativa." },
          { question: "Componentes React devem começar com:", options: ["Letra minúscula", "Letra maiúscula", "Underscore", "Número"], correctIndex: 1, explanation: "React usa a letra inicial para distinguir componentes de tags HTML nativas. <Botao /> é um componente React, <botao /> seria uma tag HTML desconhecida." },
        ],
      },
      {
        id: "3-2",
        title: "Props",
        description: "Crie um componente `Cartao` que recebe uma prop `nome` (string) e exibe **\"Bem-vindo, [nome]!\"**.",
        theory: `# Props — passando dados entre componentes

## 💡 O que é
**Props** (de "properties") são os **dados que um componente pai envia para um filho**. Funcionam como argumentos de uma função: o pai entrega, o filho recebe e usa para renderizar.

## 🌍 Analogia do mundo real
Pense numa **carta** que você entrega para alguém: o envelope traz o nome do destinatário, o assunto, talvez uma foto. O destinatário (componente filho) **lê e exibe** o conteúdo, mas **não rasura** o que veio escrito. Props são exatamente isso: leitura apenas.

## 🔧 Sintaxe e como funciona
  // Pai: passa props como atributos JSX
  <Cartao nome="Ana" idade={25} />
    //    ↑ string         ↑ número (chaves para qualquer não-string)

  // Filho: recebe via desestruturação
  function Cartao({ nome, idade }: { nome: string; idade: number }) {
    return <p>{nome} tem {idade} anos</p>;
  }

Tipando com **interface** (recomendado em projetos sérios):
  interface CartaoProps {
    nome: string;
    idade: number;
    ativo?: boolean;   // ? = opcional
  }
  function Cartao({ nome, idade }: CartaoProps) { ... }

## 📚 Exemplos comentados
  // 1. Prop simples
  function Saudacao({ nome }: { nome: string }) {
    return <h1>Olá, {nome}!</h1>;       // usa a prop dentro do JSX
  }
  <Saudacao nome="Bruno" />              // pai entrega "Bruno"

  // 2. Várias props com valor padrão
  function Botao({ texto, cor = "azul" }: { texto: string; cor?: string }) {
    return <button style={{ background: cor }}>{texto}</button>;
  }
  <Botao texto="Salvar" />               // cor cai no padrão "azul"

  // 3. Prop especial: children (o que está entre as tags)
  function Caixa({ children }: { children: React.ReactNode }) {
    return <div className="caixa">{children}</div>;
  }
  <Caixa><p>Qualquer conteúdo aqui</p></Caixa>

## ⚠️ Erros comuns
• **Tentar mudar a prop dentro do filho** (\`props.nome = "X"\`) → props são **somente leitura**; mude no pai e ele re-renderiza o filho.
• Esquecer as **chaves** para valores não-string: \`idade="25"\` vira string em vez de número.
• **Nome da prop diferente** entre pai e filho (\`<Cartao name="Ana" />\` mas filho espera \`nome\`) → chega \`undefined\`.

## 🚀 Quando usar na prática
Toda vez que um componente precisa **exibir algo que vem de fora**: um título dinâmico, dados de um usuário, uma cor de tema, uma função de callback. Props são o "fio" que conecta os componentes da árvore — sem props, todo componente seria estático.`,
        starterCode: '// Componente com props\n',
        solution: 'function Cartao({ nome }: { nome: string }) {\n  return <p>Bem-vindo, {nome}!</p>;\n}',
        expectedOutput: "Bem-vindo,",
        hints: ["Desestruture as props: { nome }", "TypeScript: { nome: string }", "Use {nome} dentro do JSX"],
        xpReward: 15,
      },
      {
        id: "3-3",
        title: "useState",
        description: "Crie um **contador** com `useState`. O componente deve ter um botão que incrementa o valor e exibe o número atual.",
        theory: `# useState — estado em componentes

## 💡 O que é
\`useState\` é o hook que dá **memória** a um componente. Ele guarda um valor que pode mudar ao longo do tempo e, quando muda, **avisa o React para re-renderizar a tela** com o novo valor.

## 🌍 Analogia do mundo real
Pense num **placar de jogo de futebol**: o número visível é o estado, e o **juiz com o controle remoto** é a função \`setEstado\`. Quando o juiz aperta o botão, o placar atualiza para todo mundo ver. Você nunca pinta o placar com tinta direto (\`count = 5\` ❌) — sempre usa o controle (\`setCount(5)\` ✅).

## 🔧 Sintaxe e como funciona
  const [valor, setValor] = useState(valorInicial);
  //     ↑       ↑                    ↑
  //  estado  atualizador        valor da 1ª render

Fluxo a cada clique/evento:
1. Você chama \`setValor(novo)\`.
2. React agenda uma nova renderização.
3. A função do componente roda **de novo**, agora com \`valor === novo\`.
4. A tela é atualizada.

## 📚 Exemplos comentados
  // 1. Contador clássico
  function Contador() {
    const [count, setCount] = useState(0);              // começa em 0
    return (
      <button onClick={() => setCount(count + 1)}>     // clique → +1
        Cliques: {count}
      </button>
    );
  }

  // 2. Usando o valor anterior (mais seguro em updates rápidos)
  setCount(prev => prev + 1);   // recebe o valor mais recente como argumento

  // 3. Estado com objeto — sempre crie objeto NOVO (imutabilidade)
  const [user, setUser] = useState({ nome: "Ana", idade: 25 });
  setUser({ ...user, idade: 26 });   // spread copia + sobrescreve idade

## ⚠️ Erros comuns
• **Mutar o estado direto**: \`count = 5\` ou \`user.idade = 26\` → React não percebe a mudança e a tela não atualiza.
• **Usar valor desatualizado** em updates seguidos: \`setCount(count+1); setCount(count+1)\` só soma 1. Use \`setCount(prev => prev + 1)\`.
• **Chamar \`useState\` dentro de \`if\`** ou loop → quebra a regra dos hooks. Sempre no topo do componente.

## 🚀 Quando usar na prática
Em **qualquer dado que muda dentro de um componente** e precisa refletir na tela: valor de input, item selecionado, modal aberto/fechado, lista filtrada, contador, página atual. É o hook que você mais vai usar — sem \`useState\`, a UI seria sempre estática.`,
        starterCode: 'import { useState } from "react";\n// Crie o contador\n',
        solution: 'import { useState } from "react";\nfunction Contador() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}',
        expectedOutput: "useState",
        hints: ["const [valor, setValor] = useState(0)", "onClick={() => setCount(count + 1)}", "Exiba {count} no botão"],
        xpReward: 20,
      },
      ...createReactFoundationBridge(),
      {
        id: "3-4",
        title: "useEffect",
        description: "Use `useEffect` para exibir **\"Componente montado!\"** no console quando o componente for renderizado pela primeira vez.",
        theory: `# useEffect — efeitos colaterais

## 💡 O que é
\`useEffect\` é o hook para executar código **fora do fluxo normal de renderização**: chamadas a APIs, timers, listeners de eventos, manipulação direta do DOM, sincronização com sistemas externos.

## 🌍 Analogia do mundo real
Pense num **chef de cozinha**: ele monta o prato (renderização), serve, e **só depois** vai lavar a louça e desligar o forno (efeitos colaterais). \`useEffect\` é exatamente esse "depois que a tela já está na mesa, faça essas coisinhas extras". E quando o cliente vai embora (componente desmonta), o chef volta para **fechar o gás** — esse é o \`return\` de cleanup.

## 🔧 Sintaxe e como funciona
  useEffect(() => {
    // código do efeito (roda DEPOIS da renderização)
    return () => {
      // cleanup (roda antes do próximo efeito ou ao desmontar)
    };
  }, [dependencias]);

O **array de dependências** controla **quando** roda:
• \`[]\`  → uma vez só, na montagem.
• \`[x, y]\` → toda vez que \`x\` ou \`y\` mudarem.
• **sem array** → toda renderização (quase sempre é bug — gera loop).

## 📚 Exemplos comentados
  // 1. Roda só ao montar (carregar dados, log inicial)
  useEffect(() => {
    console.log("Componente montado!");
  }, []);

  // 2. Roda quando 'nome' muda (atualizar título da aba)
  useEffect(() => {
    document.title = \`Olá, \${nome}\`;
  }, [nome]);

  // 3. Timer com cleanup (essencial para não vazar memória)
  useEffect(() => {
    const id = setInterval(() => console.log("tick"), 1000);
    return () => clearInterval(id);   // limpa quando desmonta
  }, []);

## ⚠️ Erros comuns
• **Esquecer o array de dependências** → efeito roda em toda render. Se ele atualiza estado, vira **loop infinito**.
• **Esquecer o cleanup** em timers/listeners/subscriptions → bugs depois que o componente sai da tela (o \`setInterval\` continua rodando).
• **Omitir uma variável** que é usada dentro do efeito → o efeito usa um valor "congelado" e antigo (problema de stale closure).

## 🚀 Quando usar na prática
Buscar dados de API ao abrir uma tela, atualizar o título da aba, registrar/remover \`addEventListener\`, criar timers, sincronizar com \`localStorage\`. Para fetching mais complexo em projetos reais, **TanStack Query** (React Query) substitui boa parte do uso de \`useEffect\` com cache automático.`,
        starterCode: 'import { useEffect } from "react";\n// Use useEffect\n',
        solution: 'import { useEffect } from "react";\nfunction App() {\n  useEffect(() => {\n    console.log("Componente montado!");\n  }, []);\n  return <div>App</div>;\n}',
        expectedOutput: "Componente montado!",
        hints: ["useEffect(() => { ... }, [])", "Array vazio [] = executa só na montagem", "console.log dentro do useEffect"],
        xpReward: 20,
      },
      {
        id: "3-5",
        title: "Interfaces TypeScript",
        description: "Defina uma interface `Usuario` com `nome` (string), `idade` (number) e `ativo` (boolean). Crie um objeto e exiba o nome.",
        theory: `# Interfaces no TypeScript

## 💡 O que é
Uma **interface** descreve a **forma** de um objeto: quais campos existem, com quais tipos, e quais são opcionais. O TypeScript usa isso para te avisar **antes de rodar o código** se você esqueceu um campo ou passou o tipo errado.

## 🌍 Analogia do mundo real
Interface é como um **formulário oficial em papel**: tem campos obrigatórios (nome, CPF, idade), alguns opcionais (telefone), e cada um pede um tipo específico (idade só aceita número, não letras). Se você entrega o formulário com um campo errado, o atendente devolve **antes mesmo de começar a processar**.

## 🔧 Sintaxe e como funciona
  interface Usuario {
    nome: string;        // obrigatório, texto
    idade: number;       // obrigatório, número
    ativo: boolean;      // obrigatório, true/false
    email?: string;      // ? = OPCIONAL
  }

  const u: Usuario = { nome: "Ana", idade: 25, ativo: true };
  //      ↑ "anota" o tipo: TS verifica que tudo bate

Tipos primitivos mais usados: \`string\`, \`number\`, \`boolean\`, \`string[]\` (array), \`{ x: number }\` (objeto inline). Evite \`any\` (desliga as verificações).

## 📚 Exemplos comentados
  // 1. Interface simples + uso
  interface Produto { nome: string; preco: number; }
  const item: Produto = { nome: "Café", preco: 12 };

  // 2. Campo opcional e união de tipos
  interface Mensagem {
    texto: string;
    autor?: string;              // pode existir ou não
    status: "lido" | "novo";     // só aceita esses dois valores
  }

  // 3. Tipando props de componente React
  interface CartaoProps { titulo: string; destaque?: boolean; }
  function Cartao({ titulo, destaque }: CartaoProps) {
    return <h2 className={destaque ? "destaque" : ""}>{titulo}</h2>;
  }

## ⚠️ Erros comuns
• Esquecer um **campo obrigatório** → erro de compilação ("property 'idade' is missing").
• Confundir **\`?\` (opcional)** com **valor padrão** — interface só descreve a forma; valor default é responsabilidade do código.
• Usar \`any\` para "calar" o TypeScript → você perde toda a proteção; prefira \`unknown\` se realmente não souber o tipo.

## 🚀 Quando usar na prática
Para **toda estrutura de dados que circula no app**: respostas de API, props de componentes, estado complexo, parâmetros de funções utilitárias, formato de itens em uma lista. Interfaces transformam bugs em runtime ("Cannot read property X of undefined") em erros que aparecem **enquanto você digita**.`,
        starterCode: '// Defina a interface e crie o objeto\n',
        solution: 'interface Usuario {\n  nome: string;\n  idade: number;\n  ativo: boolean;\n}\nconst user: Usuario = { nome: "Ana", idade: 25, ativo: true };\nconsole.log(user.nome);',
        expectedOutput: "Ana",
        hints: ["interface NomeInterface { campo: tipo }", "const obj: Interface = { ... }", "Tipos: string, number, boolean"],
        xpReward: 20,
      },
      {
        id: "3-6",
        title: "Renderização de Listas",
        description: "Dado um array de nomes, renderize uma lista `<ul>` com um `<li>` para cada nome usando `.map()`.",
        theory: `# Renderização de listas com .map()

## 💡 O que é
Em React, transformar um **array de dados** numa **lista de elementos JSX** é feito com \`.map()\`. Cada item do array vira um elemento na tela, e o React precisa de uma \`key\` única para acompanhar quem é quem.

## 🌍 Analogia do mundo real
Imagine **etiquetas em um varal de roupas**: cada peça (item do array) precisa do seu **prendedor com nome** (\`key\`). Se você tirar uma camisa do meio, o varalista (React) consegue saber exatamente qual peça foi sem ter que reorganizar tudo. Sem prendedores, ele teria que **rebagunçar e remontar o varal inteiro** a cada mudança.

## 🔧 Sintaxe e como funciona
  {array.map(item => (
    <li key={item.id}>{item.nome}</li>
  ))}

• \`.map\` percorre cada \`item\` e retorna um JSX.
• \`{ }\` em volta porque é uma **expressão JavaScript dentro do JSX**.
• \`key\` deve ser **única dentro daquela lista** — geralmente o \`id\` do item, **nunca o índice se a lista for reordenada**.

## 📚 Exemplos comentados
  // 1. Lista simples de strings (key = o próprio texto, se não repetir)
  const nomes = ["Ana", "Bruno", "Carlos"];
  <ul>
    {nomes.map(n => <li key={n}>{n}</li>)}
  </ul>

  // 2. Lista de objetos (key = id estável vindo do backend)
  const users = [{ id: 1, nome: "Ana" }, { id: 2, nome: "Bruno" }];
  <ul>
    {users.map(u => <li key={u.id}>{u.nome}</li>)}
  </ul>

  // 3. Filtrar antes de mapear (mostrar só ativos)
  {users.filter(u => u.ativo).map(u => (
    <li key={u.id}>{u.nome}</li>
  ))}

## ⚠️ Erros comuns
• **Esquecer a \`key\`** → warning no console + bugs sutis em re-render.
• Usar **\`index\` como key** quando a lista é reordenada/filtrada → React pode reusar o item errado e a tela fica inconsistente. Use \`index\` só em listas estáticas.
• Esquecer as **chaves \`{ }\`** ao redor do \`.map\` no JSX → o array some da tela.

## 🚀 Quando usar na prática
Em **toda lista dinâmica**: feed de posts, lista de tarefas, resultados de busca, mensagens de chat, opções de um \`<select>\`, cards de produtos. Sempre que pensar "preciso renderizar N coisas a partir de um array", a resposta é \`.map\` com \`key\`.`,
        starterCode: 'const nomes = ["Ana", "Bruno", "Carlos"];\n// Renderize a lista\n',
        solution: 'const nomes = ["Ana", "Bruno", "Carlos"];\nfunction Lista() {\n  return <ul>{nomes.map(n => <li key={n}>{n}</li>)}</ul>;\n}',
        expectedOutput: "Ana",
        hints: ["Use .map() dentro do JSX", "Cada item precisa de uma key única", "<li key={nome}>{nome}</li>"],
        xpReward: 20,
      },
      {
        id: "3-7",
        title: "Custom Hooks",
        description: "Crie um custom hook **useContador** que encapsula a lógica de um contador com `incrementar`, `decrementar` e `resetar`.",
        theory: `# Custom Hooks — reutilizar lógica entre componentes

## 💡 O que é
Um **custom hook** é uma função JavaScript comum que **chama outros hooks** (\`useState\`, \`useEffect\`, etc.) e cujo nome **começa com \`use\`**. Ele serve para **empacotar uma lógica de estado reutilizável** e usar em vários componentes sem copiar e colar.

## 🌍 Analogia do mundo real
Pense numa **receita de bolo**: a primeira vez você descobre o passo a passo (misturar, bater, assar). Depois você **escreve a receita num cartão** (\`useBolo\`) e qualquer um na cozinha pode seguir. Sem precisar reaprender, sem variações que esquecem ingredientes — todo mundo faz **o mesmo bolo, do mesmo jeito**.

## 🔧 Sintaxe e como funciona
  function useContador(inicial = 0) {                  // nome começa com "use"
    const [count, setCount] = useState(inicial);       // pode usar hooks dentro
    const incrementar = () => setCount(c => c + 1);
    const resetar     = () => setCount(inicial);
    return { count, incrementar, resetar };            // devolve o que o componente precisa
  }

  // No componente:
  const { count, incrementar, resetar } = useContador(0);

Cada componente que chama \`useContador\` ganha **seu próprio estado independente** — o hook é uma "fábrica" de comportamentos, não um estado global.

## 📚 Exemplos comentados
  // 1. useToggle — alternar booleano
  function useToggle(inicial = false) {
    const [on, setOn] = useState(inicial);
    const toggle = () => setOn(v => !v);
    return [on, toggle] as const;
  }

  // 2. useLocalStorage — estado que persiste no navegador
  function useLocalStorage<T>(key: string, inicial: T) {
    const [valor, setValor] = useState<T>(() => {
      const salvo = localStorage.getItem(key);
      return salvo ? JSON.parse(salvo) : inicial;
    });
    useEffect(() => { localStorage.setItem(key, JSON.stringify(valor)); }, [key, valor]);
    return [valor, setValor] as const;
  }

  // 3. useFetch — buscar dados com loading/erro
  function useFetch(url: string) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      fetch(url).then(r => r.json()).then(setData).finally(() => setLoading(false));
    }, [url]);
    return { data, loading };
  }

## ⚠️ Erros comuns
• **Nome sem \`use\`** (ex.: \`fazerContador\`) → React não aplica as regras de hooks e o ESLint não consegue te ajudar.
• Chamar o hook **dentro de \`if\` ou loop** → quebra a regra "hooks sempre no topo".
• Esperar **estado compartilhado** entre componentes — cada chamada cria um estado próprio. Para compartilhar, combine com **Context**.

## 🚀 Quando usar na prática
Sempre que você notar a **mesma lógica de \`useState\` + \`useEffect\` repetida em vários componentes**: leitura/escrita no localStorage, debouncing de input, fetch com loading, escutar tamanho da janela, autenticação. Custom hooks são a forma idiomática de organizar lógica em React moderno.`,
        starterCode: 'import { useState } from "react";\n// Crie o custom hook\n',
        solution: 'import { useState } from "react";\n\nfunction useContador(inicial = 0) {\n  const [count, setCount] = useState(inicial);\n  const incrementar = () => setCount(c => c + 1);\n  const decrementar = () => setCount(c => c - 1);\n  const resetar = () => setCount(inicial);\n  return { count, incrementar, decrementar, resetar };\n}',
        expectedOutput: "useContador",
        hints: ["Custom hooks começam com 'use'", "Retorne estado e funções em um objeto", "Use useState internamente"],
        xpReward: 25,
      },
      {
        id: "3-8",
        title: "useContext",
        description: "Crie um **ThemeContext** com React Context API que fornece o tema atual ('dark' ou 'light') para componentes filhos.",
        theory: `# useContext — estado compartilhado sem prop drilling

## 💡 O que é
O **Context API** + \`useContext\` permite que **vários componentes em níveis diferentes da árvore** leiam um valor (tema, usuário logado, idioma) **sem ter que passar a prop manualmente** por cada nível intermediário.

## 🌍 Analogia do mundo real
Pense num **Wi-Fi do prédio**: o roteador (\`Provider\`) está no térreo e o sinal chega em todos os apartamentos. Os moradores (\`useContext\`) só precisam **conhecer a senha** para acessar — ninguém precisa **puxar um cabo** de um andar pro outro. Sem Context, você teria que **fazer um cabo passar por cada andar** (prop drilling: pai → filho → neto → bisneto).

## 🔧 Sintaxe e como funciona
  // 1. Criar o Context (uma vez, num arquivo separado)
  const ThemeContext = createContext<"light" | "dark">("light");

  // 2. Provider envolve a parte da árvore que vai usar
  function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [tema, setTema] = useState<"light" | "dark">("light");
    return (
      <ThemeContext.Provider value={{ tema, setTema }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  // 3. Qualquer descendente lê com useContext
  function Botao() {
    const { tema, setTema } = useContext(ThemeContext);
    return <button onClick={() => setTema("dark")}>Tema: {tema}</button>;
  }

## 📚 Exemplos comentados
  // 1. AuthContext — usuário logado disponível em toda a app
  const AuthContext = createContext<User | null>(null);
  <AuthContext.Provider value={user}><App /></AuthContext.Provider>
  // Em qualquer componente filho:
  const user = useContext(AuthContext);

  // 2. Combinando com custom hook (padrão recomendado)
  export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme deve estar dentro de ThemeProvider");
    return ctx;
  }

  // 3. Múltiplos contexts aninhados
  <AuthProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthProvider>

## ⚠️ Erros comuns
• Usar Context para **estado que muda muito rápido** (ex.: posição do mouse) → todos os consumers re-renderizam, fica lento. Para isso prefira state local ou bibliotecas como Zustand.
• Esquecer de envolver com o **Provider** → \`useContext\` devolve o valor padrão e nada funciona.
• Colocar **funções inline novas no \`value\`** a cada render (\`value={{ x, fn: () => ... }}\`) → consumers re-renderizam à toa. Use \`useMemo\`/\`useCallback\` se for crítico.

## 🚀 Quando usar na prática
Para **valores globais que mudam pouco**: tema (claro/escuro), idioma, usuário logado, configurações da conta, dados de localização. Não use para **tudo** — Context é uma faca afiada; estado local com \`useState\` ainda é o padrão para a maioria dos casos.`,
        starterCode: 'import { createContext, useContext } from "react";\n// Crie o context\n',
        solution: 'import { createContext, useContext, useState } from "react";\n\nconst ThemeContext = createContext("light");\n\nfunction ThemeProvider({ children }) {\n  const [tema, setTema] = useState("light");\n  return (\n    <ThemeContext.Provider value={tema}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}',
        expectedOutput: "ThemeContext",
        hints: ["createContext() cria o contexto", "Provider envolve os componentes filhos", "useContext(Context) consome o valor"],
        xpReward: 25,
        quiz: [
          { question: "Qual problema o useContext resolve?", options: ["Performance lenta", "Prop drilling", "Rerenders excessivos", "Falta de tipagem"], correctIndex: 1, explanation: "Prop drilling é quando você passa props por vários níveis de componentes só para chegar ao componente que precisa. useContext permite acessar dados globais diretamente." },
        ],
      },
      {
        id: "3-9",
        title: "useReducer",
        description: "Implemente um **gerenciador de tarefas** usando `useReducer` com ações ADD, TOGGLE e REMOVE.",
        theory: `# useReducer — estado complexo com regras claras

## 💡 O que é
\`useReducer\` é uma alternativa ao \`useState\` para quando o estado tem **muitos campos** ou as **transições são complexas**. Você descreve **ações** que podem acontecer (\`ADD\`, \`REMOVE\`, \`TOGGLE\`) e uma **função reducer** decide como o estado muda para cada ação.

## 🌍 Analogia do mundo real
Pense num **caixa eletrônico**: você não enfia a mão dentro do cofre para mexer no dinheiro (estado). Você aperta um **botão de ação** ("Sacar 100", "Depositar 50", "Consultar saldo") e uma **regra interna** decide como o saldo muda. \`dispatch\` é apertar o botão; o \`reducer\` é o software do caixa que processa cada operação de forma previsível e auditável.

## 🔧 Sintaxe e como funciona
  // 1. Função reducer (pura: mesma entrada → mesma saída, sem efeitos)
  function reducer(state, action) {
    switch (action.type) {
      case "INCREMENT": return { count: state.count + 1 };
      case "RESET":     return { count: 0 };
      default:          return state;     // sempre devolva algo
    }
  }

  // 2. Hook no componente
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  //     ↑ estado atual    ↑ "envia" uma ação    ↑ valor inicial

  // 3. Disparando ações
  dispatch({ type: "INCREMENT" });
  dispatch({ type: "ADD_TODO", payload: { text: "Estudar" } });

## 📚 Exemplos comentados
  // 1. Contador com várias ações
  const reducer = (s, a) => {
    if (a.type === "inc")   return { n: s.n + 1 };
    if (a.type === "dec")   return { n: s.n - 1 };
    if (a.type === "reset") return { n: 0 };
    return s;
  };
  const [s, dispatch] = useReducer(reducer, { n: 0 });

  // 2. Lista de tarefas (todo) — imutabilidade com spread/filter/map
  function todoReducer(state, action) {
    switch (action.type) {
      case "ADD":    return [...state, { id: Date.now(), text: action.text, done: false }];
      case "TOGGLE": return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
      case "REMOVE": return state.filter(t => t.id !== action.id);
      default:       return state;
    }
  }

  // 3. Estado de formulário com vários campos
  const inicial = { nome: "", email: "", erro: null };
  function form(state, a) {
    switch (a.type) {
      case "SET":    return { ...state, [a.field]: a.value };
      case "ERRO":   return { ...state, erro: a.msg };
      case "RESET":  return inicial;
      default:       return state;
    }
  }

## ⚠️ Erros comuns
• **Mutar o state direto** dentro do reducer (\`state.count++\`) → quebra a comparação de igualdade do React. Sempre retorne **objeto/array novo**.
• Esquecer o **\`default: return state\`** → ações desconhecidas fazem o estado virar \`undefined\`.
• Colocar **lógica assíncrona** dentro do reducer (\`fetch\`, \`setTimeout\`) → reducer deve ser **puro**. Faça async em \`useEffect\` ou no handler que chama \`dispatch\`.

## 🚀 Quando usar na prática
Quando o estado tem **3+ campos relacionados** que mudam juntos, quando há **muitas ações diferentes** (ex.: lista de tarefas, carrinho, wizard de várias etapas), ou quando você quer um **histórico claro** das mudanças. Para 1-2 valores simples, \`useState\` continua sendo melhor.`,
        starterCode: 'import { useReducer } from "react";\n// Crie o reducer e o componente\n',
        solution: 'import { useReducer } from "react";\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case "ADD":\n      return [...state, { id: Date.now(), text: action.text, done: false }];\n    case "TOGGLE":\n      return state.map(t => t.id === action.id ? {...t, done: !t.done} : t);\n    case "REMOVE":\n      return state.filter(t => t.id !== action.id);\n    default: return state;\n  }\n}',
        expectedOutput: "useReducer",
        hints: ["reducer recebe state e action", "dispatch({ type, payload })", "Retorne um NOVO estado (imutabilidade)"],
        xpReward: 30,
        quiz: [
          { question: "O que o reducer deve retornar?", options: ["undefined", "A ação", "O novo estado", "O dispatch"], correctIndex: 2, explanation: "O reducer recebe o estado atual e uma ação, e retorna o NOVO estado. Ele nunca modifica o estado diretamente — sempre retorna um objeto novo (imutabilidade)." },
        ],
      },
      {
        id: "3-10",
        title: "React Router",
        description: "Configure rotas com **React Router** para páginas Home (`/`), Sobre (`/sobre`) e Contato (`/contato`).",
        theory: `# React Router — navegação em SPAs

## 💡 O que é
**React Router** transforma sua aplicação React numa **SPA (Single Page Application)** com várias "páginas". O navegador **não recarrega** ao trocar de tela — só o conteúdo renderizado muda, deixando a navegação instantânea.

## 🌍 Analogia do mundo real
Pense num **livro de receitas com abas coloridas**: o livro (a aplicação) já está aberto na sua mesa. Você só **vira para a aba** "Sobremesas" ou "Massas" — não precisa **comprar um novo livro** a cada mudança. \`<Link>\` é a aba; \`<Routes>\` é o sumário que decide qual receita mostrar; a URL no navegador é a **fitinha de marcação** indicando a página atual.

## 🔧 Sintaxe e como funciona
  // 1. Instale: npm install react-router-dom
  import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

  function App() {
    return (
      <BrowserRouter>                    {/* envolve TUDO */}
        <nav>
          <Link to="/">Home</Link>       {/* navegação sem reload */}
          <Link to="/sobre">Sobre</Link>
        </nav>
        <Routes>                                            {/* qual rota mostrar */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="*" element={<NotFound />} />        {/* fallback 404 */}
        </Routes>
      </BrowserRouter>
    );
  }

## 📚 Exemplos comentados
  // 1. Rota dinâmica com parâmetro (:id) e useParams
  <Route path="/usuario/:id" element={<Perfil />} />
  function Perfil() {
    const { id } = useParams();          // pega o valor da URL
    return <h1>Usuário {id}</h1>;
  }

  // 2. Navegação programática com useNavigate (depois de submit, login, etc.)
  function Login() {
    const navigate = useNavigate();
    const aoEntrar = () => navigate("/dashboard");
    const voltar = () => navigate(-1);   // volta como o botão do navegador
    return <button onClick={aoEntrar}>Entrar</button>;
  }

  // 3. Rotas aninhadas com <Outlet />
  <Route path="/dashboard" element={<Dashboard />}>
    <Route path="perfil" element={<Perfil />} />        {/* /dashboard/perfil */}
    <Route path="config" element={<Config />} />        {/* /dashboard/config */}
  </Route>
  // Dashboard renderiza <Outlet /> onde a sub-rota deve aparecer.

## ⚠️ Erros comuns
• Usar **\`<a href="/...">\`** em vez de \`<Link to="/...">\` → faz **reload completo** e perde todo o estado da SPA.
• Esquecer o **\`<BrowserRouter>\`** envolvendo a aplicação → \`Link\`/\`useNavigate\` quebram com erro de "router context".
• Confundir **rota dinâmica** (\`:id\`) com **query string** (\`?id=1\`). \`useParams\` lê \`:id\`; \`useSearchParams\` lê o \`?\`.

## 🚀 Quando usar na prática
Em **toda aplicação React com mais de uma tela**: dashboards, e-commerce, área logada, blogs. Para apps de página única (landing page) sem navegação, não precisa. Em projetos modernos de Lovable/Vite, o \`react-router-dom\` é a escolha padrão.`,
        starterCode: '// Configure as rotas\n',
        solution: 'import { BrowserRouter, Routes, Route, Link } from "react-router-dom";\n\nfunction Home() { return <h1>Home</h1>; }\nfunction Sobre() { return <h1>Sobre</h1>; }\nfunction Contato() { return <h1>Contato</h1>; }\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <nav>\n        <Link to="/">Home</Link>\n        <Link to="/sobre">Sobre</Link>\n        <Link to="/contato">Contato</Link>\n      </nav>\n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/sobre" element={<Sobre />} />\n        <Route path="/contato" element={<Contato />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}',
        expectedOutput: "BrowserRouter",
        hints: ["BrowserRouter envolve toda a app", "Routes contém as Route", "Link navega sem recarregar"],
        xpReward: 25,
      },
      {
        id: "3-11",
        title: "Fetching Data com useEffect",
        description: "Crie um componente que busca dados de uma **API** usando `useEffect` + `fetch` e exibe uma lista de usuários.",
        theory: `# Buscando dados de APIs com useEffect + fetch

## 💡 O que é
O padrão clássico para **carregar dados externos** em um componente React: dispara um \`fetch\` dentro de \`useEffect\` quando o componente monta, guarda o resultado em \`useState\`, e renderiza **três telas possíveis** — carregando, erro, ou dados prontos.

## 🌍 Analogia do mundo real
É como **pedir comida por aplicativo**: você abre o app (componente monta), faz o pedido (\`fetch\`), e enquanto espera a tela mostra **"preparando seu pedido..."** (\`loading\`). Se o restaurante cancelar, aparece **"deu ruim"** (\`error\`). Quando chega, você vê **a comida na mesa** (os dados renderizados). Você nunca **fica olhando a porta sem fazer nada** — sempre tem um estado visual.

## 🔧 Sintaxe e como funciona
  function Usuarios() {
    const [users,   setUsers]   = useState<User[]>([]);  // os dados
    const [loading, setLoading] = useState(true);        // está carregando?
    const [erro,    setErro]    = useState<string | null>(null);

    useEffect(() => {
      fetch("https://api.exemplo.com/users")
        .then(res => {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(setUsers)
        .catch(e => setErro(e.message))
        .finally(() => setLoading(false));
    }, []);          // [] = busca só uma vez, ao montar

    if (loading) return <p>Carregando…</p>;
    if (erro)    return <p>Erro: {erro}</p>;
    return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
  }

## 📚 Exemplos comentados
  // 1. Versão com async/await (mais limpa)
  useEffect(() => {
    async function buscar() {
      try {
        const res = await fetch(URL);
        if (!res.ok) throw new Error("Falhou");
        setUsers(await res.json());
      } catch (e: any) { setErro(e.message); }
      finally { setLoading(false); }
    }
    buscar();
  }, []);

  // 2. Cancelar a requisição se o componente desmontar (evita warning + bug)
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(URL, { signal: ctrl.signal })
      .then(r => r.json()).then(setUsers)
      .catch(e => { if (e.name !== "AbortError") setErro(e.message); });
    return () => ctrl.abort();           // cleanup ao desmontar
  }, []);

  // 3. Refazer a busca quando uma dependência muda (ex.: termo de pesquisa)
  useEffect(() => {
    fetch(\`/api/buscar?q=\${termo}\`).then(r => r.json()).then(setResultados);
  }, [termo]);                            // re-busca quando 'termo' mudar

## ⚠️ Erros comuns
• **Esquecer o \`[]\`** → loop infinito: o fetch atualiza o estado, o componente re-renderiza, dispara fetch de novo…
• Não tratar **erro de rede** ou \`!res.ok\` → \`fetch\` **só rejeita em falha de rede**, não em status 4xx/5xx. Cheque \`res.ok\` manualmente.
• Tentar \`setUsers\` **depois que o componente desmontou** → warning de memory leak. Use \`AbortController\` ou flag de cancelamento.

## 🚀 Quando usar na prática
**Toda tela que carrega dados ao abrir**: feed, dashboard, perfil de usuário, página de detalhes. Para projetos sérios, em vez de \`useEffect\` + \`fetch\` cru, prefira **TanStack Query (React Query)** ou **SWR** — eles dão cache automático, retry, refetch em foco e elimina 80% do boilerplate de \`loading\`/\`error\`.`,
        starterCode: 'import { useState, useEffect } from "react";\n// Busque dados da API\n',
        solution: 'import { useState, useEffect } from "react";\n\nfunction Usuarios() {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch("https://jsonplaceholder.typicode.com/users")\n      .then(res => res.json())\n      .then(data => { setUsers(data); setLoading(false); });\n  }, []);\n\n  if (loading) return <p>Carregando...</p>;\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}',
        expectedOutput: "useEffect",
        hints: ["useEffect com [] vazio = roda uma vez", "fetch() retorna uma Promise", "Trate loading e error states"],
        xpReward: 30,
        quiz: [
          { question: "Por que usamos [] no useEffect para fetch?", options: ["Para rodar toda renderização", "Para rodar só na montagem", "Para evitar erros", "Para cancelar o fetch"], correctIndex: 1, explanation: "O array de dependências [] vazio indica que o efeito roda apenas uma vez, quando o componente é montado. Sem o [], rodaria após CADA renderização, causando loop infinito." },
        ],
      },
    
    ],
  },
  {
    id: "4",
    title: "CSS Mágico",
    language: "CSS",
    emoji: "🎨",
    level: "Iniciante",
    duration: "22h",
    students: 5600,
    progress: 100,
    color: "quest-pink",
    tags: [],
    description: "Domine CSS moderno: Flexbox, Grid, animações, variáveis e design responsivo.",
    lessons: [
      {
        id: "4-1",
        title: "Seletores Básicos",
        description: "Escreva CSS para deixar todos os `<h1>` com cor **azul** e todos os `<p>` com tamanho de fonte **18px**.",
        theory: `# Seletores CSS

## 💡 O que é
Um **seletor** diz **a quais elementos HTML** uma regra de estilo se aplica. Sem seletor, o navegador não sabe **onde** colorir, alinhar ou espaçar.

## 🌍 Analogia do mundo real
Pense num **professor entrando numa sala lotada**: para dar uma instrução, ele precisa dizer **a quem**. Pode falar com "todos os alunos da fileira da janela" (tag), "quem está com camiseta vermelha" (classe), ou "Pedro Silva" (id, único). O seletor é exatamente esse "endereçamento".

## 🔧 Sintaxe e como funciona
  seletor {
    propriedade: valor;       /* termina sempre com ; */
    outra: valor;
  }

Tipos principais:
• \`h1\` — **tag**: todos os \`<h1>\` da página.
• \`.destaque\` — **classe** (use \`.\`): elementos com \`class="destaque"\`. **O mais usado**.
• \`#titulo\` — **id** (use \`#\`): único, deve aparecer só uma vez.
• \`*\` — **universal**: todos os elementos.

**Especificidade** (quem ganha quando há conflito): \`id\` > \`classe\` > \`tag\`. Quanto mais específico, mais prioridade.

## 📚 Exemplos comentados
  /* 1. Por tag — afeta TODOS os parágrafos */
  p {
    color: #333;
    font-size: 16px;
  }

  /* 2. Por classe — só onde class="card" */
  .card {
    padding: 16px;
    border-radius: 8px;
  }

  /* 3. Combinando: descendentes, pseudo-classe e múltiplos seletores */
  .card p { color: gray; }     /* <p> dentro de .card */
  .card > p { color: black; }  /* só <p> filho DIRETO de .card */
  .botao:hover { opacity: 0.8; }/* quando o mouse passa por cima */
  h1, h2, h3 { font-family: serif; } /* aplica em vários ao mesmo tempo */

## ⚠️ Erros comuns
• Esquecer o **\`.\`** antes da classe (\`card { ... }\` em vez de \`.card { ... }\`) → a regra vira seletor de tag e provavelmente não casa com nada.
• Esquecer o **\`;\`** no fim das declarações → o navegador descarta a próxima regra silenciosamente.
• Abusar de \`#id\` em CSS → especificidade alta demais, difícil de sobrescrever depois. Prefira **classes**.

## 🚀 Quando usar na prática
Toda página estilizada usa seletores. Em projetos reais, **classes são o padrão** (Tailwind, BEM, CSS modules). Use \`tag\` para resets globais (\`body\`, \`*\`), \`#id\` raramente, e combine com pseudo-classes (\`:hover\`, \`:focus\`) para interatividade.`,
        starterCode: '/* Estilize h1 e p */\n',
        solution: 'h1 {\n  color: blue;\n}\np {\n  font-size: 18px;\n}',
        expectedOutput: "color: blue",
        hints: ["Use o seletor de tag: h1 { ... }", "font-size define o tamanho", "Não esqueça do ponto e vírgula"],
        xpReward: 10,
      },
      ...createCssFoundationBridge(),
      {
        id: "4-2",
        title: "Flexbox — Centralizando",
        description: "Use Flexbox para centralizar um elemento **horizontal e verticalmente** dentro do container.",
        theory: `# Flexbox — alinhamento em uma direção

## 💡 O que é
**Flexbox** é o sistema de layout do CSS para organizar itens em **uma linha ou uma coluna**, distribuindo espaço e alinhando do jeito que você quiser. É a ferramenta padrão para centralizar, fazer barras de navegação e qualquer arrumação 1D.

## 🌍 Analogia do mundo real
Imagine **uma prateleira ajustável de livros**: você decide se os livros ficam um do lado do outro (\`row\`) ou empilhados (\`column\`), se ficam **encostados à esquerda, centralizados ou espalhados** (\`justify-content\`), e se ficam **no topo, no meio ou na base** da prateleira (\`align-items\`). O Flexbox é exatamente esse "modo prateleira" para o navegador.

## 🔧 Sintaxe e como funciona
  .container {
    display: flex;                 /* ativa o modo flex no PAI */
    flex-direction: row;           /* row (padrão) | column */
    justify-content: center;       /* alinha no EIXO PRINCIPAL */
    align-items: center;           /* alinha no EIXO CRUZADO */
    gap: 16px;                     /* espaço entre os filhos */
  }

Eixos:
• \`flex-direction: row\` → eixo principal **horizontal** (justify=horizontal, align=vertical).
• \`flex-direction: column\` → eixo principal **vertical** (os papéis se invertem!).

## 📚 Exemplos comentados
  /* 1. Centralizar perfeitamente (o clássico) */
  .container {
    display: flex;
    justify-content: center;      /* horizontal */
    align-items: center;          /* vertical */
    height: 100vh;                /* precisa ter altura! */
  }

  /* 2. Barra de navegação: logo na esquerda, menu na direita */
  .navbar {
    display: flex;
    justify-content: space-between;  /* extremos opostos */
    align-items: center;
    padding: 16px;
  }

  /* 3. Coluna de cards com espaçamento uniforme */
  .lista {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

## ⚠️ Erros comuns
• Aplicar \`display: flex\` no **filho** em vez do **pai** → não funciona; flex se ativa no **container**.
• Tentar centralizar verticalmente sem dar **altura** ao container → o pai tem altura zero, então "centro vertical" é ele mesmo.
• Confundir \`justify-content\` e \`align-items\` quando \`flex-direction\` é \`column\` — os eixos **trocam de papel**.

## 🚀 Quando usar na prática
Em **quase toda barra de navegação, header, footer, lista de botões, cards lado a lado, formulários**. Sempre que pensar "preciso alinhar essas coisas em linha (ou coluna)", Flexbox é a primeira ferramenta. Para layouts 2D (linhas + colunas), use **Grid**.`,
        starterCode: '.container {\n  /* Centralize com Flexbox */\n  height: 100vh;\n}\n',
        solution: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}',
        expectedOutput: "justify-content: center",
        hints: ["display: flex ativa o Flexbox", "justify-content: center (horizontal)", "align-items: center (vertical)"],
        xpReward: 15,
      },
      {
        id: "4-3",
        title: "CSS Grid",
        description: "Crie um layout de **3 colunas iguais** usando CSS Grid com um gap de 16px.",
        theory: `# CSS Grid — layout em duas dimensões

## 💡 O que é
**CSS Grid** organiza elementos em **linhas E colunas ao mesmo tempo**. É a ferramenta certa para galerias de cards, layouts de página inteira (header/sidebar/main/footer) e qualquer coisa que pareça uma tabela visual.

## 🌍 Analogia do mundo real
Pense numa **caixa de ovos**: você define quantas **fileiras** e quantas **colunas** existem, e cada ovo (item) ocupa uma célula. Pode ter ovos pequenos (1 célula) ou um ovo gigante que ocupa **2 células de largura** — o quadro é planejado de antemão. Flexbox é uma prateleira (1D); Grid é a caixa de ovos (2D).

## 🔧 Sintaxe e como funciona
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);   /* 3 colunas iguais */
    grid-template-rows: 100px auto;          /* 1ª linha 100px, 2ª se ajusta */
    gap: 16px;                               /* espaço entre células */
  }

A unidade **\`fr\`** (fraction) divide o **espaço disponível**:
• \`1fr 1fr 1fr\` → três partes iguais.
• \`1fr 2fr 1fr\` → meio leva o dobro das laterais.
• \`200px 1fr\` → primeira coluna fixa, segunda preenche o resto.

## 📚 Exemplos comentados
  /* 1. Galeria de 3 colunas iguais */
  .galeria {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  /* 2. Grid responsivo SEM media query (mágico!) */
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    /* coloca quantas colunas couberem, cada uma com no mínimo 250px */
  }

  /* 3. Layout de página: header em cima, sidebar + main, footer embaixo */
  .pagina {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 60px 1fr 40px;
    grid-template-areas:
      "header header"
      "side   main"
      "footer footer";
  }
  .header { grid-area: header; }
  .side   { grid-area: side; }
  .main   { grid-area: main; }
  .footer { grid-area: footer; }

## ⚠️ Erros comuns
• Esquecer **\`display: grid\`** no container → as propriedades \`grid-template-*\` viram inúteis.
• Usar **\`px\` em todas as colunas** quando deveria ser \`fr\` → layout não se adapta a telas diferentes.
• Confundir \`gap\` com \`margin\` nos filhos → use **\`gap\`** no Grid; margem nos filhos vira sobreposição confusa.

## 🚀 Quando usar na prática
Galerias de produtos, dashboards com múltiplos painéis, layout de página inteira, listagens com cards de tamanhos variados. **Regra geral**: layouts em **uma direção** → Flexbox; layouts em **duas direções (linhas + colunas)** → Grid. Nada impede combinar os dois (Grid no pai, Flexbox dentro de cada célula).`,
        starterCode: '.grid {\n  /* Crie o grid */\n}\n',
        solution: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}',
        expectedOutput: "grid-template-columns",
        hints: ["display: grid ativa o Grid", "grid-template-columns: repeat(3, 1fr)", "gap: 16px para espaçamento"],
        xpReward: 20,
      },
      {
        id: "4-4",
        title: "Variáveis CSS",
        description: "Defina variáveis CSS `--cor-primaria` (roxo) e `--espacamento` (16px) no `:root` e use-as em um `.card`.",
        theory: `# Variáveis CSS (Custom Properties)

## 💡 O que é
Variáveis CSS guardam um **valor reutilizável** (cor, espaçamento, fonte) que você define **uma vez** e usa em toda a folha de estilo. Ao mudar a variável, **tudo que a usa muda junto**.

## 🌍 Analogia do mundo real
Pense num **interruptor central da casa**: você troca uma lâmpada do tipo "luz quente" no painel principal, e **todos os cômodos** que pegam dali mudam de tom. Sem variáveis, você teria que **subir em cada cômodo trocando lâmpada por lâmpada** (caçar e substituir cor por cor no CSS inteiro).

## 🔧 Sintaxe e como funciona
  /* 1. Definir no :root para virar global */
  :root {
    --cor-primaria: #6c5ce7;
    --espacamento: 16px;
    --raio: 8px;
  }

  /* 2. Usar com var() */
  .card {
    background: var(--cor-primaria);
    padding: var(--espacamento);
    border-radius: var(--raio);
  }

  /* 3. Valor fallback se a variável não existir */
  .link { color: var(--cor-link, blue); }

Variáveis **respeitam o escopo do CSS**: se você redefinir dentro de um seletor, ela vale só para os descendentes daquele elemento — base de **temas claro/escuro**.

## 📚 Exemplos comentados
  /* 1. Design tokens — paleta centralizada */
  :root {
    --primary: #6c5ce7;
    --primary-hover: #5a4bd1;
    --texto: #1a1a2e;
    --bg: #ffffff;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 32px;
  }

  /* 2. Tema escuro — sobrescreve as MESMAS variáveis */
  .dark {
    --bg: #1a1a2e;
    --texto: #eee;
  }
  body { background: var(--bg); color: var(--texto); }

  /* 3. Variável local a um componente */
  .alerta {
    --cor-alerta: red;
    border-left: 4px solid var(--cor-alerta);
    color: var(--cor-alerta);
  }

## ⚠️ Erros comuns
• Esquecer os **dois traços** no início (\`-cor: red\` em vez de \`--cor: red\`) → não vira variável.
• Usar a variável **fora do escopo** onde foi definida → cai no fallback ou herda \`undefined\` e o valor some.
• Tentar fazer **operações matemáticas** direto: \`padding: var(--x) * 2\` ❌. Use \`calc()\`: \`padding: calc(var(--x) * 2)\` ✅.

## 🚀 Quando usar na prática
**Sempre** em projetos reais: cores de marca, espaçamentos, raios de borda, tamanhos de fonte. É a base de **design systems** (Tailwind, shadcn/ui) e o jeito mais simples de implementar **tema claro/escuro** sem JavaScript pesado. Em projetos React/Vite, casa lindo com Tailwind via \`hsl(var(--primary))\`.`,
        starterCode: ':root {\n  /* Defina variáveis */\n}\n.card {\n  /* Use as variáveis */\n}\n',
        solution: ':root {\n  --cor-primaria: purple;\n  --espacamento: 16px;\n}\n.card {\n  color: var(--cor-primaria);\n  padding: var(--espacamento);\n}',
        expectedOutput: "--cor-primaria",
        hints: ["--nome-variavel: valor no :root", "var(--nome-variavel) para usar", "Variáveis começam com --"],
        xpReward: 20,
      },
      {
        id: "4-5",
        title: "Animações",
        description: "Crie uma animação `@keyframes` chamada `fadeIn` que vai de `opacity: 0` para `opacity: 1`. Aplique-a a `.elemento`.",
        theory: `# Animações com @keyframes

## 💡 O que é
\`@keyframes\` define **passos de uma animação** (de onde começa, por onde passa, onde termina) e a propriedade \`animation\` aplica esses passos a um elemento. Diferente do \`transition\` (que precisa de um gatilho como \`:hover\`), animações **rodam sozinhas**.

## 🌍 Analogia do mundo real
Pense num **flipbook** (aquele caderninho com desenhos que vira filme ao folhear): cada \`@keyframes\` é o **roteiro** dizendo "no quadro 1, está aqui; no quadro 50, está acolá". O \`animation\` é o **dedo folheando** — define em quanto tempo, com que ritmo e quantas vezes a cena se repete.

## 🔧 Sintaxe e como funciona
  /* 1. Definir o roteiro */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* 2. Aplicar */
  .elemento {
    animation: fadeIn 1s ease-out forwards;
    /*          nome  duração timing  fill-mode */
  }

Propriedades de \`animation\` (na shorthand):
• **duração**: \`1s\`, \`300ms\`.
• **timing**: \`ease\` (padrão, suave), \`linear\` (constante), \`ease-out\` (desacelera), \`cubic-bezier(...)\`.
• **delay**: \`0.5s\` antes de começar.
• **iteration-count**: número ou \`infinite\`.
• **fill-mode**: \`forwards\` mantém o estado final, \`backwards\` aplica o inicial antes de começar.

## 📚 Exemplos comentados
  /* 1. Fade-in simples (entrada de modal/card) */
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  .modal { animation: fadeIn 0.3s ease-out; }

  /* 2. Pulse infinito (bolinha de notificação) */
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.2); }
  }
  .badge { animation: pulse 1.5s ease-in-out infinite; }

  /* 3. Slide-in vindo da esquerda */
  @keyframes slideInLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
  .menu { animation: slideInLeft 0.4s ease-out forwards; }

## ⚠️ Erros comuns
• Esquecer **\`forwards\`** quando quer manter o estado final → o elemento "volta" ao estado original ao terminar.
• Animar propriedades **caras** como \`top\`, \`left\`, \`width\` → causa relayout e fica travado. Prefira **\`transform\`** e **\`opacity\`** (a GPU acelera).
• Usar animação muito longa em UI (\`3s\`) → parece lento. Para microinterações, **150–400ms** é o ideal.

## 🚀 Quando usar na prática
Entradas de modais, toasts e cards (fade-in/slide-in), loaders (spin), feedback de botão (pulse), destaque de notificações novas, animações de onboarding. Para interações simples (mudança de cor no hover), prefira **\`transition\`**; para animações **autônomas** ou com vários passos, use **\`@keyframes\`**.`,
        starterCode: '/* Crie a animação e aplique */\n',
        solution: '@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n.elemento {\n  animation: fadeIn 1s ease-in;\n}',
        expectedOutput: "@keyframes fadeIn",
        hints: ["@keyframes nome { from { } to { } }", "animation: nome duração timing", "Use from/to ou 0%/100%"],
        xpReward: 25,
      },
      {
        id: "4-6",
        title: "Media Queries",
        description: "Escreva uma media query que muda a cor de fundo do `body` para **escuro** quando a tela for menor que **768px**.",
        theory: `# Media Queries — design responsivo

## 💡 O que é
Uma **media query** aplica regras de CSS **só quando a tela atende uma condição** (ex.: largura abaixo de 768px). É o que faz seu site **se adaptar a celular, tablet e desktop** sem precisar de páginas separadas.

## 🌍 Analogia do mundo real
Pense num **camaleão**: dependendo do **ambiente** (galho, folha, pedra), ele muda de cor automaticamente. A media query é o "sensor" que diz "estou em ambiente celular, troco para layout compacto" — o site continua o mesmo, mas se **camufla** ao tamanho disponível.

## 🔧 Sintaxe e como funciona
  @media (condição) {
    /* regras CSS aplicadas SÓ quando a condição é verdadeira */
  }

Condições mais usadas:
• \`(max-width: 768px)\` → tela **até** 768px (mobile/tablet pequeno).
• \`(min-width: 1024px)\` → tela **de** 1024px **para cima** (desktop).
• \`(prefers-color-scheme: dark)\` → quando o SO está em modo escuro.

**Estratégia mobile-first** (recomendada): escreva o CSS base pensando em **celular** e use \`min-width\` para acrescentar estilos nas telas maiores. Vai por camadas, não por exceções.

## 📚 Exemplos comentados
  /* 1. Mudar fundo abaixo de 768px */
  @media (max-width: 768px) {
    body { background: #1a1a2e; }
  }

  /* 2. Mobile-first: padding cresce com a tela */
  .container { padding: 16px; }                      /* base = mobile */
  @media (min-width: 768px)  { .container { padding: 24px; } }
  @media (min-width: 1280px) { .container { padding: 48px; } }

  /* 3. Grid responsivo: 1 coluna no mobile, 3 no desktop */
  .cards { display: grid; grid-template-columns: 1fr; gap: 16px; }
  @media (min-width: 768px) {
    .cards { grid-template-columns: repeat(3, 1fr); }
  }

## ⚠️ Erros comuns
• **Misturar \`max-width\` e \`min-width\`** sem cuidado → regras se sobrepõem em ordens confusas. Adote **uma direção** (mobile-first com \`min-width\`).
• Usar **breakpoints fixos demais** (specíficos para iPhone X) → o ideal é usar valores **lógicos** (\`640\`, \`768\`, \`1024\`, \`1280\`) que cobrem famílias de dispositivos.
• Esquecer a **viewport meta tag** no HTML (\`<meta name="viewport" content="width=device-width, initial-scale=1">\`) → o celular renderiza como desktop minúsculo e a media query nem dispara.

## 🚀 Quando usar na prática
Em **todo site moderno**: layout muda de coluna única para grid de 3, menu vira hamburger, fontes diminuem, padding encolhe. Em projetos com Tailwind, em vez de \`@media\` cru, você usa as variantes \`sm:\`, \`md:\`, \`lg:\` — que **internamente são media queries**. Saber CSS puro te dá controle quando o framework não cobre o caso.`,
        starterCode: '/* Responsividade */\n',
        solution: '@media (max-width: 768px) {\n  body {\n    background-color: #1a1a2e;\n  }\n}',
        expectedOutput: "@media",
        hints: ["@media (max-width: 768px) { ... }", "Coloque as regras CSS dentro da media query", "max-width para telas menores que"],
        xpReward: 20,
      },
      {
        id: "4-7",
        title: "Pseudo-elementos",
        description: "Use **::before** para adicionar um emoji 🔥 antes de todo elemento `.destaque`.",
        theory: `# Pseudo-elementos (::before / ::after)

## 💡 O que é
Pseudo-elementos são **elementos "fantasmas"** que o CSS injeta **antes** ou **depois** do conteúdo real de um elemento, **sem precisar mexer no HTML**. Servem para ícones, ornamentos, tooltips e efeitos decorativos.

## 🌍 Analogia do mundo real
É como **pendurar um adesivo decorativo** num porta-retrato sem furar a parede: o porta-retrato (HTML) continua intacto, mas o visual ganha algo extra (o adesivo = pseudo-elemento). \`::before\` é colar o adesivo **antes**, \`::after\` é colar **depois** — e você pode estilizá-los como qualquer outro elemento.

## 🔧 Sintaxe e como funciona
  .destaque::before {
    content: "🔥 ";       /* OBRIGATÓRIO — sem isso, nada aparece */
    color: orange;
    margin-right: 4px;
  }

Pseudo-elementos disponíveis:
• \`::before\` — antes do conteúdo.
• \`::after\` — depois do conteúdo.
• \`::first-line\` — primeira linha de texto.
• \`::first-letter\` — primeira letra (estilo "capitular").
• \`::selection\` — texto selecionado pelo usuário.

⚠️ Use **dois pontos** (\`::\`) na sintaxe moderna; \`:\` ainda funciona para compatibilidade antiga.

## 📚 Exemplos comentados
  /* 1. Ícone antes do texto */
  .destaque::before { content: "🔥 "; }

  /* 2. Linha decorativa abaixo de um título */
  .titulo::after {
    content: "";              /* vazio, mas obrigatório */
    display: block;
    width: 48px; height: 3px;
    background: purple;
    margin-top: 8px;
  }

  /* 3. Tooltip lendo um atributo data-* do HTML */
  .info { position: relative; }
  .info::after {
    content: attr(data-tooltip);   /* puxa o texto do data-tooltip */
    position: absolute; bottom: 100%; left: 0;
    background: #333; color: white;
    padding: 4px 8px; border-radius: 4px;
    opacity: 0; transition: opacity .2s;
  }
  .info:hover::after { opacity: 1; }

## ⚠️ Erros comuns
• Esquecer **\`content\`** → o pseudo-elemento simplesmente **não renderiza**, mesmo com width/height/background definidos.
• Tentar adicionar pseudo-elemento em **elementos vazios** como \`<img>\`, \`<input>\`, \`<br>\` → não funciona; eles não têm "conteúdo" onde inserir.
• Esquecer **\`position: relative\`** no pai quando o \`::after\` usa \`position: absolute\` → o tooltip vaza para fora ou se ancora no lugar errado.

## 🚀 Quando usar na prática
Adicionar **ícones decorativos** sem poluir o HTML, criar **tooltips** simples só com CSS, fazer **bordas/divisores ornamentais**, números automáticos em listas customizadas, marcas d'água. Sempre que quiser **um detalhe visual extra** sem precisar criar uma \`<div>\` só para isso, pseudo-elementos são a resposta.`,
        starterCode: '/* Use pseudo-elementos */\n',
        solution: '.destaque::before {\n  content: "🔥 ";\n}',
        expectedOutput: "::before",
        hints: ["::before insere conteúdo antes", "content: é OBRIGATÓRIO", '.destaque::before { content: "🔥 "; }'],
        xpReward: 20,
      },
      {
        id: "4-8",
        title: "Transitions",
        description: "Crie um botão que muda de cor suavemente ao passar o mouse, usando **transition** com duração de 0.3s.",
        theory: `# Transitions — interpolação suave entre estados

## 💡 O que é
\`transition\` faz o navegador **interpolar suavemente** a mudança de uma propriedade CSS quando ela acontece (ex.: cor muda no \`:hover\`, tamanho muda quando ganha uma classe). Em vez de **pular** do valor A para B, vai **passando** por todos os valores intermediários no tempo definido.

## 🌍 Analogia do mundo real
Pense num **dimmer de lâmpada**: sem dimmer, a luz acende **estalando** do escuro para o claro (CSS sem transition). Com dimmer, ela vai **subindo gradualmente** ao longo de meio segundo. \`transition\` é o dimmer do CSS — você diz **qual luz**, **em quanto tempo** e **com que ritmo**.

## 🔧 Sintaxe e como funciona
  .botao {
    background: #6c5ce7;
    transition: background 0.3s ease;
    /*           ↑propriedade ↑duração ↑timing  */
  }
  .botao:hover { background: #5a4bd1; }   /* o gatilho: mudança de estado */

Shorthand completa:
  transition: <propriedade> <duração> <timing-function> <delay>;

Múltiplas propriedades de uma vez:
  transition: background 0.3s ease, transform 0.2s ease-out;

\`transition: all 0.3s ease;\` anima tudo, mas **evite** — pode animar coisas inesperadas (largura, altura) e ficar pesado.

## 📚 Exemplos comentados
  /* 1. Botão com hover suave */
  .botao {
    background: #6c5ce7; color: white; padding: 12px 24px;
    transition: background 0.3s ease;
  }
  .botao:hover { background: #5a4bd1; }

  /* 2. Card que sobe e ganha sombra ao passar o mouse */
  .card {
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
  }
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  }

  /* 3. Input destacando ao receber foco */
  input {
    border: 1px solid #ccc;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  input:focus {
    border-color: #6c5ce7;
    box-shadow: 0 0 0 3px rgba(108,92,231,0.2);
    outline: none;
  }

## ⚠️ Erros comuns
• Colocar a transition no **\`:hover\`** em vez de no estado normal → ao tirar o mouse, a volta é abrupta (pula sem suavizar). Sempre **declare \`transition\` no estado base**.
• Tentar animar propriedades **não-animáveis** (\`display: none\` → \`block\`) → não interpola. Use \`opacity\` + \`visibility\` ou \`max-height\` para ocultar/mostrar suavemente.
• Animar \`width\`/\`height\`/\`top\` quando podia usar \`transform\` → \`transform\` é **acelerado por GPU** e roda muito mais suave.

## 🚀 Quando usar na prática
**Microinterações** que dão polidez: hover de botões/cards, focus em inputs, abrir/fechar dropdowns, troca de tema. Para animações **autônomas** (sem gatilho do usuário) ou com vários passos, prefira **\`@keyframes\`**. Duração ideal para UI: **150–300ms**.`,
        starterCode: '.botao {\n  /* Adicione transition */\n}\n.botao:hover {\n  /* Estado hover */\n}\n',
        solution: '.botao {\n  background: #6c5ce7;\n  color: white;\n  padding: 12px 24px;\n  transition: background 0.3s ease;\n}\n.botao:hover {\n  background: #5a4bd1;\n}',
        expectedOutput: "transition",
        hints: ["transition: propriedade duração timing", "Defina o estado normal e o :hover", "0.3s é uma boa duração para hover"],
        xpReward: 20,
      },
      {
        id: "4-9",
        title: "Box Model",
        description: "Explique e aplique o **box model**: crie um `.card` com padding de **20px**, margin de **16px** e borda de **2px solid**. Use `box-sizing: border-box`.",
        theory: `# Box Model — a caixa de todo elemento

## 💡 O que é
Todo elemento HTML renderizado é uma **caixa retangular** com 4 camadas concêntricas: **content** (conteúdo), **padding** (espaço interno), **border** (borda), **margin** (espaço externo). Entender essa estrutura é o que permite **calcular tamanhos** sem surpresa.

## 🌍 Analogia do mundo real
Pense num **presente embrulhado**: o **brinquedo** é o content, o **papel-bolha** ao redor é o padding, a **caixa de papelão** é o border, e o **espaço vazio** entre essa caixa e os outros pacotes na mesa é o margin. Mexer em cada camada muda **só** aquela camada.

## 🔧 Sintaxe e como funciona
  .card {
    width: 300px;
    padding: 20px;        /* espaço dentro, ao redor do conteúdo */
    border: 2px solid #ccc;
    margin: 16px;         /* espaço fora, separando dos vizinhos */
  }

A grande pegadinha é o **\`box-sizing\`**:
• \`content-box\` (padrão antigo) → \`width: 300px\` é só o conteúdo. Padding e border **somam por fora** → caixa fica 300 + 40 + 4 = 344px.
• \`border-box\` (recomendado) → \`width: 300px\` **inclui** padding e border. O que você vê é o que você pede.

Reset universal (faça em todo projeto):
  *, *::before, *::after { box-sizing: border-box; }

## 📚 Exemplos comentados
  /* 1. Padding com 1, 2, 3 ou 4 valores */
  padding: 20px;              /* todos os lados */
  padding: 10px 20px;         /* vertical | horizontal */
  padding: 5px 10px 15px 20px; /* top | right | bottom | left (sentido horário) */

  /* 2. Centralizar bloco horizontalmente */
  .card { width: 600px; margin: 0 auto; }   /* auto nas laterais = centraliza */

  /* 3. Card típico com border-box */
  * { box-sizing: border-box; }
  .card {
    width: 100%; padding: 24px; border: 1px solid #eee;
    /* width continua 100%, sem estourar */
  }

## ⚠️ Erros comuns
• Esquecer **\`box-sizing: border-box\`** → seu card de \`width: 100%\` + \`padding: 20px\` **estoura o pai** porque vira 100% + 40px.
• **Margin collapse**: dois elementos verticais com margin colapsam — só vale o **maior**, não a soma. Não acontece com **padding** nem em flex/grid.
• Aplicar \`width: 100%\` num input com border e padding sem \`border-box\` → input fica maior que o container e quebra o layout.

## 🚀 Quando usar na prática
**Sempre** — toda página estilizada depende de entender o box model. O reset \`* { box-sizing: border-box }\` é prática padrão (incluído por defaut em frameworks como Tailwind). Quando algo "ficou maior do que devia" ou "tem espaço estranho que não some", **olhe primeiro padding, margin e box-sizing**.`,
        starterCode: '/* Aplique o box model */\n',
        solution: '* {\n  box-sizing: border-box;\n}\n.card {\n  padding: 20px;\n  margin: 16px;\n  border: 2px solid #6c5ce7;\n}',
        expectedOutput: "box-sizing",
        hints: ["box-sizing: border-box é essencial", "padding = espaço interno", "margin = espaço externo"],
        xpReward: 15,
        quiz: [
          { question: "O que box-sizing: border-box faz?", options: ["Remove bordas", "Inclui padding/border no width", "Duplica o margin", "Centraliza o elemento"], correctIndex: 1, explanation: "Com border-box, padding e border fazem parte do width declarado. Sem ele (content-box padrão), um elemento width:200px + padding:20px ficaria com 240px no total." },
        ],
      },
      {
        id: "4-10",
        title: "Posicionamento (position)",
        description: "Crie um elemento **fixo** no canto inferior direito da tela (como um botão de chat flutuante) usando `position: fixed`.",
        theory: `# Position — controlando onde os elementos ficam

## 💡 O que é
A propriedade \`position\` decide **como** o navegador posiciona um elemento e **a quem** ele se ancora. É a chave para fazer **overlays, modais, tooltips, navbars fixas, headers que grudam ao rolar** e botões flutuantes.

## 🌍 Analogia do mundo real
Pense num **mural de avisos**: a maioria dos papéis fica **no fluxo**, encostados um no outro (\`static\`). Você pode **deslocar levemente** um papel sem mexer nos vizinhos (\`relative\`), **fixar com tachinha em qualquer ponto do mural** (\`absolute\`), ou colar um papel no **vidro da sala** que não acompanha o mural quando ele desliza (\`fixed\`). \`sticky\` é o aviso que **rola junto até certo ponto e depois trava**.

## 🔧 Sintaxe e como funciona
  .elemento {
    position: <static | relative | absolute | fixed | sticky>;
    top: 0; right: 0; bottom: 0; left: 0;   /* só funcionam com position ≠ static */
    z-index: 10;                              /* qual fica "na frente" */
  }

Diferença essencial:
• \`static\` — padrão; \`top/left/...\` são ignorados.
• \`relative\` — desloca **a partir da posição original**, mas **mantém o espaço** no fluxo.
• \`absolute\` — **sai do fluxo** e se ancora no **ancestral mais próximo com \`position\` ≠ static** (ou no \`<html>\`, se nenhum tiver).
• \`fixed\` — fixo na **viewport**; não rola com a página.
• \`sticky\` — vira \`fixed\` ao **passar do offset \`top\`** durante o scroll.

## 📚 Exemplos comentados
  /* 1. Tooltip ancorado no card (clássico relative + absolute) */
  .card { position: relative; }                    /* "âncora" */
  .card .tooltip {
    position: absolute; top: -8px; right: -8px;    /* canto sup. direito */
  }

  /* 2. Botão de chat fixo no canto inferior direito da tela */
  .chat-btn {
    position: fixed; bottom: 20px; right: 20px;
    z-index: 100;
  }

  /* 3. Header que rola e depois gruda no topo */
  .header {
    position: sticky; top: 0;
    background: white; z-index: 50;
  }

  /* Bônus: overlay que cobre todo o pai */
  .overlay { position: absolute; inset: 0; background: rgba(0,0,0,.4); }

## ⚠️ Erros comuns
• Usar \`position: absolute\` no filho **sem dar \`position: relative\`** ao pai → o filho ancora no \`<html>\` e voa para o canto da página.
• Esquecer **\`z-index\`** em modais/dropdowns → ficam por baixo do header. Lembre: \`z-index\` **só funciona com position ≠ static**.
• Usar \`position: fixed\` em containers que precisam **rolar com o conteúdo** → vira "elemento que não some" no lugar errado.

## 🚀 Quando usar na prática
**\`relative\` + \`absolute\`** é o combo para **tooltips, badges, dropdowns, ícones sobrepostos**. **\`fixed\`** para **navbars sempre visíveis, botões flutuantes (chat/voltar ao topo), modais**. **\`sticky\`** para **headers de tabela, filtros laterais, menus de seção**. Em layouts modernos com Flexbox/Grid, você usa \`position\` **só para casos específicos** — não para layout principal.`,
        starterCode: '/* Crie o elemento fixo */\n',
        solution: '.chat-btn {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  z-index: 100;\n  padding: 16px;\n  border-radius: 50%;\n  background: #6c5ce7;\n  color: white;\n}',
        expectedOutput: "position: fixed",
        hints: ["position: fixed fixa na viewport", "bottom e right posicionam", "z-index controla sobreposição"],
        xpReward: 20,
      },
      {
        id: "4-11",
        title: "Flexbox Avançado",
        description: "Crie um layout com **sidebar fixa** (250px) e **conteúdo flexível** que ocupa o resto usando `flex-grow`.",
        theory: `# Flexbox avançado — controle fino com flex/grow/shrink

## 💡 O que é
As propriedades **dos filhos flex** (\`flex-grow\`, \`flex-shrink\`, \`flex-basis\`) decidem **como cada item ocupa o espaço sobrando** ou **como encolhe quando falta espaço**. Combinadas com \`flex-wrap\` e \`order\`, dão controle total do layout em uma direção.

## 🌍 Analogia do mundo real
Pense em **passageiros num banco de ônibus**: alguns são "magrinhos" e fixos (\`flex: 0 0 250px\` — sempre 250px, não cresce, não encolhe). Outros são **flexíveis** (\`flex: 1\` — esticam para preencher o resto do banco). Quando o ônibus enche e o banco aperta, \`flex-shrink\` decide **quem se espreme primeiro**. \`order\` é o **passageiro VIP** que pula para frente sem precisar mudar a fila original.

## 🔧 Sintaxe e como funciona
  /* Container */
  .layout { display: flex; }

  /* Filhos — shorthand: flex: <grow> <shrink> <basis> */
  .sidebar  { flex: 0 0 250px; }   /* não cresce, não encolhe, 250px fixos */
  .conteudo { flex: 1; }           /* = flex: 1 1 0% — ocupa o restante */

Significados:
• **flex-grow** (padrão 0) — quanto cresce do espaço sobrando. \`1\` = pega tudo; \`2\` ao lado de \`1\` = pega o dobro.
• **flex-shrink** (padrão 1) — quanto encolhe quando falta. \`0\` = nunca encolhe.
• **flex-basis** (padrão \`auto\`) — tamanho **inicial** antes de crescer/encolher.

Atalhos comuns:
• \`flex: 1\` — cresce igual aos irmãos.
• \`flex: 0 0 200px\` — fixo em 200px.
• \`flex: 1 1 300px\` — base 300px, cresce e encolhe.

## 📚 Exemplos comentados
  /* 1. Layout clássico: sidebar fixa + conteúdo elástico */
  .layout { display: flex; min-height: 100vh; }
  .sidebar  { flex: 0 0 250px; background: #1a1a2e; }
  .conteudo { flex: 1; padding: 24px; }

  /* 2. Grid responsivo SEM media query (cards quebram linha sozinhos) */
  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .cards > .card { flex: 1 1 280px; }   /* mínimo 280px, cresce até preencher */

  /* 3. Reordenar visualmente sem mexer no HTML */
  .item.destaque { order: -1; }          /* aparece primeiro, mesmo estando por último */

## ⚠️ Erros comuns
• Usar \`flex: 1\` na sidebar quando ela deveria ser **fixa** → ela vai esticar e empurrar o conteúdo. Use \`flex: 0 0 250px\`.
• Esquecer **\`flex-wrap: wrap\`** num grid de cards → tudo fica numa linha só, item espremido virando faixa fininha.
• Confundir \`flex-basis\` com \`width\` — em flexbox, \`basis\` é o **tamanho inicial considerado pelo cálculo de grow/shrink**; \`width\` muitas vezes é ignorada na presença de \`basis\`.

## 🚀 Quando usar na prática
**Layouts de aplicação web**: sidebar + main, header com logo à esquerda e ações à direita, listas de cards que quebram em várias linhas, splits redimensionáveis, timelines. Quando o **CSS Grid** parece exagero (não tem 2D), Flexbox avançado costuma resolver com 3 linhas.`,
        starterCode: '/* Layout sidebar + conteúdo */\n',
        solution: '.layout {\n  display: flex;\n  min-height: 100vh;\n}\n.sidebar {\n  flex: 0 0 250px;\n  background: #1a1a2e;\n}\n.conteudo {\n  flex: 1;\n  padding: 20px;\n}',
        expectedOutput: "flex: 1",
        hints: ["flex: 0 0 250px = tamanho fixo", "flex: 1 = ocupa o espaço restante", "O container precisa de display: flex"],
        xpReward: 25,
      },
    
    ],
  },
  {
    id: "5",
    title: "Node.js Backend",
    language: "Node.js",
    emoji: "🟢",
    level: "Intermediário",
    duration: "30h",
    students: 7800,
    progress: 0,
    color: "quest-blue",
    tags: ["Em alta"],
    description: "Construa APIs e servidores com Node.js e Express — rotas, middleware, autenticação e banco de dados.",
    lessons: [
      {
        id: "5-1",
        title: "Introdução ao Node.js",
        description: "Crie um servidor HTTP simples com Node.js que responde **\"Olá, Node!\"** na porta 3000.",
        theory: `# Node.js — JavaScript no servidor

## 💡 O que é
**Node.js** é um runtime que executa JavaScript **fora do navegador**, no servidor. Com ele, o mesmo JS que você usa para o front roda também no back: servidores HTTP, APIs, scripts, ferramentas de build (Vite, webpack), CLIs.

## 🌍 Analogia do mundo real
Imagine que **JavaScript** é um motor potente. No navegador ele move um **carrinho de brinquedo** (manipula a página). No Node, o mesmo motor é colocado num **caminhão** (servidor) — agora ele atende milhares de clientes ao mesmo tempo, lê arquivos, conversa com bancos de dados e roda 24h/dia. **Mesma linguagem, máquina diferente.**

## 🔧 Sintaxe e como funciona
  // server.js — servidor HTTP nativo, sem framework
  const http = require("http");                    // CommonJS (padrão antigo do Node)

  const server = http.createServer((req, res) => { // callback para cada requisição
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Olá, Node!");
  });

  server.listen(3000, () => console.log("rodando em http://localhost:3000"));

Conceitos-chave:
• **\`require()\`** — importa módulos (no estilo CommonJS). Em projetos modernos com \`"type": "module"\`, usa-se \`import\` (ESM).
• **\`req\`** — dados da requisição (URL, método, headers, body).
• **\`res\`** — objeto para **enviar** a resposta (status, headers, corpo).
• **npm** — gerenciador de pacotes: \`npm init -y\`, \`npm install express\`, \`npm install -D nodemon\`.
• **package.json** — manifesto do projeto (nome, scripts, dependências).

## 📚 Exemplos comentados
  // 1. Servidor mínimo
  const http = require("http");
  http.createServer((_, res) => res.end("ok")).listen(3000);

  // 2. Roteamento manual baseado em URL
  http.createServer((req, res) => {
    if (req.url === "/")        res.end("Home");
    else if (req.url === "/oi") res.end("Olá!");
    else { res.statusCode = 404; res.end("Não encontrado"); }
  }).listen(3000);

  // 3. Script utilitário (não é servidor)
  const fs = require("fs");
  const linhas = fs.readFileSync("./lista.txt", "utf-8").split("\\n");
  console.log(\`O arquivo tem \${linhas.length} linhas\`);

## ⚠️ Erros comuns
• Esquecer **\`server.listen(porta)\`** → o processo fica vivo mas **não escuta nada**.
• Misturar **\`require\`** (CommonJS) com **\`import\`** (ESM) no mesmo projeto sem configurar o \`package.json\` → erros estranhos de "Cannot use import statement outside a module".
• Bloquear o **event loop** com operações pesadas síncronas (\`while(true)\`, \`fs.readFileSync\` em loop) → o servidor para de responder a outros clientes.

## 🚀 Quando usar na prática
**APIs REST** (com Express/Fastify), **backends de SPA**, **edge functions**, **scripts de automação** (build, deploy, migrações), **CLIs** (\`npx create-...\`), **realtime** (WebSockets, Socket.io), **microserviços**. Para a maioria dos projetos web modernos, Node é o backend padrão — e mesmo se você usar outra linguagem no back, vai usar Node nas ferramentas de front.`,
        starterCode: 'const http = require("http");\n// Crie o servidor\n',
        solution: 'const http = require("http");\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { "Content-Type": "text/plain" });\n  res.end("Olá, Node!");\n});\n\nserver.listen(3000, () => {\n  console.log("Servidor na porta 3000");\n});',
        expectedOutput: "Olá, Node!",
        hints: ["http.createServer() cria o servidor", "res.end() envia a resposta", "server.listen(porta) inicia"],
        xpReward: 10,
        quiz: [
          { question: "O que é Node.js?", options: ["Um framework CSS", "Runtime JS no servidor", "Um banco de dados", "Um navegador"], correctIndex: 1, explanation: "Node.js permite executar JavaScript fora do navegador, no servidor. Usa o motor V8 do Chrome. É a base para Express, NestJS, ferramentas como npm e Vite." },
        ],
      },
      ...createNodeFoundationBridge(),
      {
        id: "5-2",
        title: "Express — Rotas",
        description: "Crie um servidor Express com rotas **GET** para `/` e `/api/users` que retorna uma lista de usuários em JSON.",
        theory: `# Express — Roteamento de APIs

## 💡 O que é
**Express** é o framework web minimalista mais popular do Node. Ele transforma o trabalhoso \`http.createServer\` em algo declarativo: você diz "quando vier um GET em /users, execute esta função" e pronto.

## 🌍 Analogia do mundo real
Pense num **recepcionista de hotel**: cada pessoa que chega (requisição) tem um pedido (URL + método). O recepcionista olha numa **tabela de procedimentos** (suas rotas) e direciona para o setor certo. Sem Express, você seria forçado a escrever um \`if/else\` gigante para cada URL — Express é essa tabela organizada.

## 🔧 Sintaxe e como funciona
  const express = require("express");
  const app = express();                  // cria a "central" do servidor

  app.get("/", (req, res) => res.send("Bem-vindo!"));
  app.post("/users", (req, res) => res.json(req.body));

  app.listen(3000, () => console.log("🚀 porta 3000"));

Anatomia de uma rota:
• **Método HTTP** — \`get\`, \`post\`, \`put\`, \`patch\`, \`delete\`. Cada um expressa uma **intenção** semântica.
• **Caminho (path)** — \`/users\`, \`/users/:id\` (o \`:id\` vira \`req.params.id\`), \`/search?q=...\` (vira \`req.query.q\`).
• **Handler** — função \`(req, res) => ...\` que produz a resposta.
• **\`res.json()\`** vs **\`res.send()\`** — \`json\` serializa objeto + define header \`Content-Type: application/json\`. \`send\` envia texto/HTML.

## 📚 Exemplos comentados
  // 1. Rota fixa
  app.get("/", (req, res) => res.send("Olá"));

  // 2. Parâmetro de rota (URL dinâmica)
  app.get("/users/:id", (req, res) => {
    const { id } = req.params;          // string vinda da URL
    res.json({ id, nome: "User " + id });
  });

  // 3. Query string + body (precisa do middleware de JSON)
  app.use(express.json());              // habilita parse de JSON no body
  app.post("/search", (req, res) => {
    const { q } = req.query;            // ?q=...
    const { filtros } = req.body;       // body do POST
    res.json({ q, filtros });
  });

## ⚠️ Erros comuns
• Esquecer **\`app.use(express.json())\`** → \`req.body\` vem \`undefined\` em POST.
• Confundir **\`req.params\`** (parte da URL: \`/users/:id\`) com **\`req.query\`** (após \`?\`: \`/users?id=1\`) com **\`req.body\`** (POST/PUT).
• Não chamar **\`res.send/json/end\`** → a requisição fica pendurada até o timeout do cliente.
• Definir duas rotas com o mesmo path → só a primeira é executada.

## 🚀 Quando usar na prática
Praticamente **toda API REST em Node** usa Express (ou Fastify, com sintaxe quase idêntica). Backends de SPAs, BFFs (Backend for Frontend), webhooks de Stripe/GitHub, microsserviços. Em Lovable Cloud, as **edge functions** Deno usam um padrão similar (\`Deno.serve\`).`,
        starterCode: 'const express = require("express");\nconst app = express();\n// Crie as rotas\n',
        solution: 'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Bem-vindo!");\n});\n\napp.get("/api/users", (req, res) => {\n  res.json([{ id: 1, nome: "Ana" }, { id: 2, nome: "Bruno" }]);\n});\n\napp.listen(3000);',
        expectedOutput: "express",
        hints: ["app.get(rota, callback)", "res.json() para retornar JSON", "res.send() para texto simples"],
        xpReward: 15,
      },
      {
        id: "5-3",
        title: "Middleware",
        description: "Crie um **middleware** de logging que exibe método, URL e timestamp de cada requisição.",
        theory: `# Middleware — Interceptando requisições

## 💡 O que é
**Middleware** é uma função que roda **entre** a chegada da requisição e a rota final. Ela pode logar, autenticar, validar, transformar — e decide se passa adiante (\`next()\`) ou corta a resposta ali mesmo.

## 🌍 Analogia do mundo real
Pense numa **fila de aeroporto**: check-in → raio-X → controle de passaporte → embarque. Cada balcão é um **middleware**. Algum pode te liberar (chamar \`next()\`) ou te barrar e devolver na hora (responder com 403). A "rota final" é o avião.

## 🔧 Sintaxe e como funciona
  function meuMiddleware(req, res, next) {
    // 1. faz algo (loga, valida, decora req...)
    // 2. chama next() para seguir, OU responde direto
    next();
  }

  app.use(meuMiddleware);              // global — todas as rotas
  app.get("/admin", autenticar, handler); // só nesta rota

Tipos de middleware:
• **Built-in**: \`express.json()\`, \`express.urlencoded()\`, \`express.static("public")\`.
• **Terceiros**: \`cors()\`, \`helmet()\`, \`morgan()\` (logs), \`compression()\`.
• **Próprios**: autenticação, validação, rate-limit, telemetria.
• **De erro** (assinatura com **4 parâmetros**): \`(err, req, res, next) => ...\`.

## 📚 Exemplos comentados
  // 1. Logger global
  app.use((req, res, next) => {
    console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
    next();                            // SEM isso, requisição trava
  });

  // 2. Middleware por rota (autenticação)
  function autenticar(req, res, next) {
    if (!req.headers.authorization) return res.status(401).json({ erro: "sem token" });
    next();
  }
  app.get("/perfil", autenticar, (req, res) => res.json({ ok: true }));

  // 3. Tratador de erro (sempre o ÚLTIMO app.use)
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ erro: "interno" });
  });

## ⚠️ Erros comuns
• **Esquecer \`next()\`** → a requisição fica pendurada para sempre.
• Chamar \`next()\` **e** responder no mesmo middleware → erro "Cannot set headers after they are sent".
• Registrar middleware **depois** das rotas → ele não roda nelas (ordem importa!).
• Esquecer os **4 parâmetros** no middleware de erro → Express trata como middleware normal.

## 🚀 Quando usar na prática
**Autenticação JWT**, **CORS**, **rate-limiting** (proteção contra abuse), **logs estruturados**, **compressão gzip**, **parsing de body**, **i18n** (idioma a partir do header), **tracing**/observabilidade. Praticamente toda funcionalidade transversal vira middleware.`,
        starterCode: 'const express = require("express");\nconst app = express();\n// Crie o middleware\n',
        solution: 'const express = require("express");\nconst app = express();\n\nfunction logger(req, res, next) {\n  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);\n  next();\n}\n\napp.use(logger);\napp.get("/", (req, res) => res.send("OK"));\napp.listen(3000);',
        expectedOutput: "logger",
        hints: ["Middleware recebe req, res, next", "next() passa para o próximo", "app.use() aplica globalmente"],
        xpReward: 20,
        quiz: [
          { question: "O que next() faz no middleware?", options: ["Encerra a requisição", "Retorna erro", "Passa para o próximo middleware/rota", "Reinicia o servidor"], correctIndex: 2, explanation: "Middlewares são funções encadeadas. Chamar next() passa o controle ao próximo middleware ou à rota final. Sem next(), a requisição fica presa e o cliente não recebe resposta." },
        ],
      },
      {
        id: "5-4",
        title: "CRUD com Express",
        description: "Implemente um **CRUD** completo (Create, Read, Update, Delete) para uma lista de tarefas usando Express.",
        theory: `# CRUD — As 4 operações de qualquer API

## 💡 O que é
**CRUD** = **C**reate, **R**ead, **U**pdate, **D**elete. São as 4 operações fundamentais sobre qualquer recurso (usuário, produto, post). Em REST, cada uma mapeia para um método HTTP específico.

## 🌍 Analogia do mundo real
Pense num **caderno de contatos**: você **adiciona** alguém (Create), **olha** a lista ou um contato (Read), **edita** o telefone de alguém (Update) e **apaga** quem você não fala mais (Delete). É exatamente o mesmo padrão de qualquer "lista de coisas" em software.

## 🔧 Sintaxe e como funciona
Mapeamento canônico HTTP → CRUD:
  POST   /todos       → Create  (cria um novo)
  GET    /todos       → Read    (lista todos)
  GET    /todos/:id   → Read    (busca um)
  PUT    /todos/:id   → Update  (substitui inteiro)
  PATCH  /todos/:id   → Update  (parcial)
  DELETE /todos/:id   → Delete  (apaga um)

Status codes corretos:
• **200 OK** — sucesso geral (GET, PUT)
• **201 Created** — recurso criado (POST)
• **204 No Content** — sucesso sem corpo (DELETE)
• **400 Bad Request** — dados inválidos
• **404 Not Found** — recurso não existe
• **500 Internal Server Error** — bug no servidor

## 📚 Exemplos comentados
  app.use(express.json());
  let todos = [{ id: 1, text: "Estudar", done: false }];
  let nextId = 2;

  // READ all
  app.get("/todos", (req, res) => res.json(todos));

  // READ one — 404 se não achar
  app.get("/todos/:id", (req, res) => {
    const t = todos.find(t => t.id === +req.params.id);
    if (!t) return res.status(404).json({ erro: "não encontrado" });
    res.json(t);
  });

  // CREATE — 201 com o recurso criado
  app.post("/todos", (req, res) => {
    const novo = { id: nextId++, text: req.body.text, done: false };
    todos.push(novo);
    res.status(201).json(novo);
  });

  // UPDATE parcial — só sobrescreve campos enviados
  app.patch("/todos/:id", (req, res) => {
    const t = todos.find(t => t.id === +req.params.id);
    if (!t) return res.status(404).json({ erro: "não encontrado" });
    Object.assign(t, req.body);        // mescla campos
    res.json(t);
  });

  // DELETE — 204 sem corpo
  app.delete("/todos/:id", (req, res) => {
    todos = todos.filter(t => t.id !== +req.params.id);
    res.status(204).send();
  });

## ⚠️ Erros comuns
• Retornar **200** em criação (deveria ser **201**) ou esquecer de devolver o recurso criado (com o \`id\` gerado).
• Não tratar **404** quando o \`:id\` não existe → cliente recebe \`null\` ou erro 500.
• Usar **PUT** quando o cliente manda só alguns campos → você sobrescreve o resto com \`undefined\`. Para parciais, use **PATCH**.
• Converter \`req.params.id\` esquecendo: ele vem como **string**, então \`id === 1\` é sempre \`false\`. Use \`+req.params.id\`.

## 🚀 Quando usar na prática
**Toda** API REST de gestão (admin, dashboards, e-commerce, blog, redes sociais) é basicamente CRUD em cima de várias entidades. Frameworks como NestJS, Strapi e o próprio PostgREST do Supabase geram CRUD automaticamente — entender o padrão é pré-requisito para usar qualquer um deles.`,
        starterCode: 'const express = require("express");\nconst app = express();\napp.use(express.json());\n// Implemente o CRUD\n',
        solution: 'const express = require("express");\nconst app = express();\napp.use(express.json());\n\nlet todos = [];\nlet id = 1;\n\napp.get("/todos", (req, res) => res.json(todos));\napp.post("/todos", (req, res) => {\n  const todo = { id: id++, text: req.body.text, done: false };\n  todos.push(todo);\n  res.status(201).json(todo);\n});\napp.delete("/todos/:id", (req, res) => {\n  todos = todos.filter(t => t.id !== +req.params.id);\n  res.status(204).send();\n});',
        expectedOutput: "express",
        hints: ["GET para ler, POST para criar", "req.params.id para parâmetro da URL", "res.status(201) para criação"],
        xpReward: 25,
      },
      {
        id: "5-5",
        title: "Validação de Dados",
        description: "Crie um middleware de **validação** que verifica se os campos `nome` e `email` existem no body antes de criar um usuário.",
        theory: `# Validação de dados — Nunca confie no cliente

## 💡 O que é
**Validação** é checar se os dados que chegaram do cliente fazem sentido **antes** de processá-los: campo obrigatório existe? email tem formato válido? idade é número positivo? Se não passar, retorne **400 Bad Request** com mensagens claras.

## 🌍 Analogia do mundo real
É o **porteiro de uma balada**: confere idade (número, ≥ 18), nome na lista, identidade válida. Quem não passa, **não entra** — e o porteiro explica o porquê. O segurança (sua rota) confia que **tudo lá dentro já foi checado**.

## 🔧 Sintaxe e como funciona
  function validarUsuario(req, res, next) {
    const { nome, email } = req.body;
    const erros = [];

    if (!nome || nome.trim().length < 2) erros.push({ campo: "nome", msg: "mínimo 2 letras" });
    if (!email || !email.includes("@")) erros.push({ campo: "email", msg: "email inválido" });

    if (erros.length) return res.status(400).json({ erros });
    next();                              // tudo certo, segue
  }

  app.post("/users", validarUsuario, (req, res) => {
    res.status(201).json(req.body);     // dados já confiáveis
  });

Dimensões da validação: **presença** (existe?), **tipo** (string/number/bool?), **formato** (regex de email/CPF), **tamanho** (min/max), **range** (entre X e Y), **unicidade** (já existe no banco?).

## 📚 Exemplos comentados
  // 1. Validação manual simples
  if (!req.body.email?.includes("@")) return res.status(400).json({ erro: "email" });

  // 2. Sanitização — limpa antes de salvar
  const email = req.body.email.trim().toLowerCase();
  const nome  = req.body.nome.trim();

  // 3. Validação com Zod (recomendado em projetos sérios)
  import { z } from "zod";
  const UserSchema = z.object({
    nome:  z.string().min(2),
    email: z.string().email(),
    idade: z.number().int().min(18).max(120),
  });
  app.post("/users", (req, res) => {
    const parsed = UserSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ erros: parsed.error.issues });
    // parsed.data agora é tipado!
  });

## ⚠️ Erros comuns
• **Confiar no front** ("já validei lá") — qualquer um faz \`curl\` direto. Valide **sempre** no backend.
• Retornar mensagem genérica ("dados inválidos") → frustra o usuário. Diga **qual** campo e **por quê**.
• Não **sanitizar** (trim, lowercase) → mesmo email aparece como "ana@x.com" e " Ana@X.com " no banco.
• Validar **depois** de tocar no banco → desperdício de query e brecha de segurança.

## 🚀 Quando usar na prática
**Toda** entrada do cliente: corpos de POST/PUT, query strings, params, headers, uploads de arquivo (tamanho/MIME). Em projetos modernos, **Zod** vira a fonte da verdade: o mesmo schema valida no backend e gera tipos TypeScript no frontend.`,
        starterCode: '// Crie o middleware de validação\n',
        solution: 'function validarUsuario(req, res, next) {\n  const { nome, email } = req.body;\n  const erros = [];\n  if (!nome || nome.trim().length < 2) erros.push("Nome inválido");\n  if (!email || !email.includes("@")) erros.push("Email inválido");\n  if (erros.length) return res.status(400).json({ erros });\n  next();\n}',
        expectedOutput: "validar",
        hints: ["Verifique cada campo obrigatório", "Retorne 400 com lista de erros", "next() se tudo estiver ok"],
        xpReward: 20,
      },
      {
        id: "5-6",
        title: "Conexão com Banco de Dados",
        description: "Conecte ao banco de dados usando um **pool de conexões** e faça uma query SELECT simples.",
        theory: `# Conexão com banco — Pool e queries seguras

## 💡 O que é
Para persistir dados de verdade (não em memória), o servidor abre conexões com um **banco de dados** (Postgres, MySQL...). Como abrir uma conexão é **caro**, usamos um **pool**: um conjunto de conexões prontas que são emprestadas e devolvidas.

## 🌍 Analogia do mundo real
Pense num **estacionamento de bicicletas compartilhadas**: em vez de cada cliente comprar uma bike (abrir conexão), você pega uma do **pool**, usa, devolve. Se 50 clientes querem ao mesmo tempo, eles **enfileiram** até alguém devolver. Muito mais rápido e sustentável que comprar bike nova toda vez.

## 🔧 Sintaxe e como funciona
  const { Pool } = require("pg");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,                            // máx. de conexões simultâneas
  });

  // SEMPRE com parâmetros ($1, $2) — nunca interpolação!
  const { rows } = await pool.query(
    "SELECT * FROM usuarios WHERE id = $1",
    [id]
  );

Por que parâmetros importam? Porque **interpolação direta abre SQL Injection**:
  ❌  pool.query(\`SELECT * FROM users WHERE name = '\${nome}'\`)
      // se nome = "'; DROP TABLE users; --"  → desastre
  ✅  pool.query("SELECT * FROM users WHERE name = $1", [nome])
      // o driver escapa automaticamente

## 📚 Exemplos comentados
  // 1. Buscar todos
  async function listarUsuarios() {
    const { rows } = await pool.query("SELECT id, nome, email FROM usuarios");
    return rows;
  }

  // 2. Inserir e devolver o registro criado (RETURNING)
  async function criarUsuario(nome, email) {
    const { rows } = await pool.query(
      "INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *",
      [nome, email]
    );
    return rows[0];
  }

  // 3. Transação — duas queries que precisam acontecer juntas
  async function transferir(de, para, valor) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("UPDATE contas SET saldo = saldo - $1 WHERE id = $2", [valor, de]);
      await client.query("UPDATE contas SET saldo = saldo + $1 WHERE id = $2", [valor, para]);
      await client.query("COMMIT");          // confirma as duas
    } catch (e) {
      await client.query("ROLLBACK");        // desfaz tudo
      throw e;
    } finally {
      client.release();                       // devolve a conexão ao pool
    }
  }

## ⚠️ Erros comuns
• **Interpolação de strings em queries** → SQL Injection (a vulnerabilidade #1 da web por décadas).
• Esquecer **\`client.release()\`** em transações → o pool esgota e o servidor trava.
• Abrir um **\`new Pool()\`** por requisição → defeating the purpose. Crie **um** pool global no boot.
• Não tratar erros assíncronos com \`try/catch\` → processo Node cai inteiro com "Unhandled promise rejection".

## 🚀 Quando usar na prática
**Toda** API que persiste dados. Em projetos com Lovable Cloud, você raramente escreve SQL bruto — o **Supabase JS client** já cuida do pool e dos parâmetros por você. Mas entender o conceito é essencial para debugar performance e segurança.`,
        starterCode: '// Conecte ao banco\n',
        solution: 'const { Pool } = require("pg");\n\nconst pool = new Pool({ connectionString: process.env.DATABASE_URL });\n\nasync function buscarUsuarios() {\n  const { rows } = await pool.query("SELECT * FROM usuarios");\n  return rows;\n}\n\nasync function criarUsuario(nome, email) {\n  const { rows } = await pool.query(\n    "INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *",\n    [nome, email]\n  );\n  return rows[0];\n}',
        expectedOutput: "pool.query",
        hints: ["Pool reutiliza conexões", "Use $1, $2 para parâmetros (previne SQL injection)", "RETURNING * retorna o registro criado"],
        xpReward: 25,
      },
      {
        id: "5-7",
        title: "JWT Auth",
        description: "Crie um middleware que verifica um **token JWT** no header Authorization e protege uma rota.",
        theory: `# JWT — Autenticação com tokens

## 💡 O que é
**JWT** (JSON Web Token) é uma string assinada que carrega informações do usuário (id, email, role). Após login, o servidor entrega um JWT e o cliente o envia em **toda** requisição protegida no header \`Authorization: Bearer <token>\`. O servidor verifica a **assinatura** sem precisar consultar o banco.

## 🌍 Analogia do mundo real
JWT é como uma **pulseira de festival** com um **lacre holográfico**: você prova quem é uma vez na entrada, recebe a pulseira, e em cada palco o segurança só olha o lacre — sem ligar para o escritório central. Se alguém tentar falsificar, o lacre não bate. A pulseira tem **validade** (\`expiresIn\`).

## 🔧 Sintaxe e como funciona
Um JWT tem 3 partes: **header.payload.signature** (Base64URL).

  const jwt = require("jsonwebtoken");
  const SECRET = process.env.JWT_SECRET;     // NUNCA hardcoded em produção

  // 1. Gerar (no login)
  const token = jwt.sign(
    { sub: user.id, email: user.email },     // payload (claims)
    SECRET,
    { expiresIn: "1h" }
  );

  // 2. Verificar (em cada request protegida)
  const decoded = jwt.verify(token, SECRET); // throw se inválido/expirado

## 📚 Exemplos comentados
  // 1. Rota de login — emite o token
  app.post("/login", async (req, res) => {
    const user = await validarCredenciais(req.body.email, req.body.senha);
    if (!user) return res.status(401).json({ erro: "credenciais inválidas" });
    const token = jwt.sign({ sub: user.id }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  });

  // 2. Middleware de autenticação
  function autenticar(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];   // "Bearer xxx"
    if (!token) return res.status(401).json({ erro: "sem token" });
    try {
      req.usuario = jwt.verify(token, SECRET);
      next();
    } catch {
      res.status(401).json({ erro: "token inválido ou expirado" });
    }
  }

  // 3. Rota protegida
  app.get("/perfil", autenticar, (req, res) => {
    res.json({ id: req.usuario.sub });
  });

## ⚠️ Erros comuns
• Guardar **dados sensíveis** no payload (senha, dados de cartão) — o payload é só **Base64**, qualquer um decodifica.
• Usar **SECRET fraco** ou versionado no Git → qualquer um forja tokens.
• Token **sem \`expiresIn\`** → vaza uma vez e vale para sempre.
• Aceitar JWT **sem verificar** (\`jwt.decode\` em vez de \`jwt.verify\`) → bypass total da autenticação.

## 🚀 Quando usar na prática
**Praticamente toda API moderna** (mobile, SPA, microsserviços). Em Lovable Cloud, o **Supabase Auth** já gerencia JWTs por você — login, refresh, RLS no Postgres tudo amarrado. Você raramente assina manualmente, mas precisa entender o conceito para debugar sessões.`,
        starterCode: 'const jwt = require("jsonwebtoken");\nconst SECRET = "segredo";\n// Crie o middleware\n',
        solution: 'const jwt = require("jsonwebtoken");\nconst SECRET = "segredo";\n\nfunction autenticar(req, res, next) {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) return res.status(401).json({ erro: "Token não fornecido" });\n  try {\n    req.usuario = jwt.verify(token, SECRET);\n    next();\n  } catch {\n    res.status(401).json({ erro: "Token inválido" });\n  }\n}',
        expectedOutput: "jwt.verify",
        hints: ["Extraia o token do header Authorization", "jwt.verify() valida o token", "Use try/catch para tokens inválidos"],
        xpReward: 25,
      },
      {
        id: "5-8",
        title: "Padrão MVC",
        description: "Organize uma rota de usuários seguindo o padrão **MVC**: crie um controller e um model separados.",
        theory: `# MVC — Organizando o código por responsabilidade

## 💡 O que é
**MVC** = **M**odel + **V**iew + **C**ontroller. É um padrão para separar o código em três camadas, cada uma com **uma única responsabilidade**: dados, apresentação e lógica. Em APIs Node, normalmente não há "View" tradicional (o front faz isso) — então adaptamos para **Routes → Controllers → Models**.

## 🌍 Analogia do mundo real
Pense num **restaurante**:
• **Garçom (Routes/Controller)** — recebe o pedido, traduz para a cozinha e entrega o prato. Não cozinha.
• **Cozinheiro (Service/Lógica)** — sabe a receita, combina ingredientes.
• **Despenseiro (Model/DB)** — sabe onde fica cada ingrediente. Não sabe o que está sendo cozinhado.

Trocar o garçom não muda a receita. Trocar o estoque não muda o garçom. Cada um faz uma coisa só.

## 🔧 Sintaxe e como funciona
Estrutura de pastas típica:
  src/
    routes/userRoutes.js          ← define URLs e qual controller chamar
    controllers/userController.js ← traduz HTTP <-> service
    services/userService.js       ← regras de negócio
    models/userModel.js           ← acesso ao banco

## 📚 Exemplos comentados
  // models/userModel.js — só conversa com o banco
  module.exports = {
    getAll:  ()        => pool.query("SELECT * FROM users").then(r => r.rows),
    create:  (data)    => pool.query("INSERT INTO users(nome) VALUES($1) RETURNING *", [data.nome]).then(r => r.rows[0]),
  };

  // controllers/userController.js — traduz req/res
  const UserModel = require("../models/userModel");
  module.exports = {
    listar: async (req, res) => {
      const users = await UserModel.getAll();
      res.json(users);
    },
    criar:  async (req, res) => {
      const novo = await UserModel.create(req.body);
      res.status(201).json(novo);
    },
  };

  // routes/userRoutes.js — só amarra URL ao controller
  const router = require("express").Router();
  const c = require("../controllers/userController");
  router.get("/",  c.listar);
  router.post("/", c.criar);
  module.exports = router;

  // app.js — monta tudo
  app.use("/users", require("./routes/userRoutes"));

## ⚠️ Erros comuns
• **Controller fazendo SQL direto** → você perde o motivo do MVC. Mantenha SQL no model.
• **Model sabendo de \`req\`/\`res\`** → ele vira inútil para reuso fora de rotas (jobs, CLIs).
• Camadas demais para projeto pequeno → começar com MVC simples e evoluir só quando dói.
• Importação circular (\`controller → service → controller\`) → quebra o boot do Node.

## 🚀 Quando usar na prática
Qualquer API que vai **crescer**. Para um endpoint de 5 linhas, MVC é overkill. Para um sistema com 30+ rotas e múltiplos devs, MVC (ou variações como **Clean Architecture** e **Hexagonal**) é o que mantém o código sustentável.`,
        starterCode: '// Organize em MVC\n',
        solution: '// Model\nconst users = [];\nconst getAll = () => users;\nconst create = (data) => { const u = {id: Date.now(), ...data}; users.push(u); return u; };\n\n// Controller\nconst listar = (req, res) => res.json(getAll());\nconst criar = (req, res) => res.status(201).json(create(req.body));',
        expectedOutput: "Controller",
        hints: ["Model cuida dos dados", "Controller cuida da lógica", "Routes conecta URLs aos controllers"],
        xpReward: 25,
      },
      {
        id: "5-9",
        title: "File System (fs)",
        description: "Use o módulo **fs** para ler e escrever um arquivo JSON com dados de usuários.",
        theory: `# fs — Lendo e escrevendo arquivos

## 💡 O que é
O módulo **\`fs\`** (File System) do Node permite ler, escrever, listar e apagar arquivos e pastas diretamente do disco do servidor. Quase tudo tem **duas versões**: síncrona (\`readFileSync\`) e assíncrona (\`fs/promises\`). **Em servidores, use sempre a assíncrona.**

## 🌍 Analogia do mundo real
\`fs\` síncrono é como **ir buscar um livro na biblioteca e parar a aula inteira** até voltar — ninguém aprende nada nesse meio tempo. \`fs\` assíncrono é mandar um **monitor** buscar enquanto a aula continua. Em um servidor com 100 alunos (requisições), essa diferença decide se ele atende todos ou trava.

## 🔧 Sintaxe e como funciona
  // Versão moderna (Promises) — preferida
  const fs = require("fs/promises");

  // Ler texto
  const txt = await fs.readFile("dados.json", "utf-8");
  const obj = JSON.parse(txt);

  // Escrever texto (sobrescreve)
  await fs.writeFile("users.json", JSON.stringify(obj, null, 2));

  // Outras operações úteis
  await fs.mkdir("uploads", { recursive: true });
  const arquivos = await fs.readdir(".");
  await fs.unlink("temp.txt");

Sem \`utf-8\` → você recebe um **Buffer** (bytes brutos) em vez de string.

## 📚 Exemplos comentados
  // 1. Ler JSON
  const fs = require("fs/promises");
  const data = JSON.parse(await fs.readFile("config.json", "utf-8"));

  // 2. Append em log (não sobrescreve)
  await fs.appendFile("acesso.log", \`\${new Date().toISOString()} - GET /\\n\`);

  // 3. Ler arquivo só se existir
  try {
    const conteudo = await fs.readFile("opcional.txt", "utf-8");
    console.log(conteudo);
  } catch (e) {
    if (e.code === "ENOENT") console.log("arquivo não existe — ok");
    else throw e;
  }

## ⚠️ Erros comuns
• Usar **versão sync** (\`readFileSync\`) em rotas de API → bloqueia o event loop e o servidor inteiro trava enquanto lê.
• Esquecer **\`"utf-8"\`** → recebe Buffer e \`JSON.parse\` quebra.
• Não tratar **\`ENOENT\`** (arquivo não existe) → erro 500 quando o normal seria criar/ignorar.
• Ler arquivo **enorme** com \`readFile\` → carrega tudo na RAM. Para arquivos grandes, use **streams** (\`fs.createReadStream\`).

## 🚀 Quando usar na prática
**Logs**, **uploads** salvos em disco, **caches**, **leitura de configs**, **geração de relatórios** (CSV, PDF), **scripts de automação**. Em ambientes serverless (Vercel, edge functions) o filesystem é **efêmero/somente-leitura** — para persistir, use storage de objetos (Supabase Storage, S3).`,
        starterCode: 'const fs = require("fs");\n// Leia e escreva JSON\n',
        solution: 'const fs = require("fs");\n\nconst usuarios = [{ nome: "Ana", idade: 25 }, { nome: "Bruno", idade: 30 }];\nfs.writeFileSync("users.json", JSON.stringify(usuarios, null, 2));\nconst data = fs.readFileSync("users.json", "utf-8");\nconsole.log(JSON.parse(data));',
        expectedOutput: "Ana",
        hints: ["writeFileSync para escrever", "readFileSync para ler", "JSON.stringify/parse para converter"],
        xpReward: 20,
      },
      {
        id: "5-10",
        title: "Async/Await no Node",
        description: "Use **Promise.all** para buscar usuários e produtos em paralelo.",
        theory: `# Async no Node — Promise.all, race e padrões

## 💡 O que é
No Node, quase **toda** I/O (rede, disco, banco) é assíncrona. \`async/await\` é a sintaxe limpa para esperar essas operações. Mas o segredo de performance é saber **paralelizar** com \`Promise.all\` em vez de esperar uma de cada vez.

## 🌍 Analogia do mundo real
Imagine pedir **café**, **pão** e **suco** no balcão.
• **Sequencial** (\`await\` um após o outro): pede café, espera 30s, pede pão, espera 30s, pede suco, espera 30s = **90s**.
• **Paralelo** (\`Promise.all\`): faz os 3 pedidos juntos, todos prontos em **30s**.
Mesma quantidade de trabalho, **3× mais rápido** — porque enquanto um fica pronto, os outros já estão sendo feitos.

## 🔧 Sintaxe e como funciona
  // ❌ Sequencial — lento
  const users    = await buscarUsuarios();    // 100ms
  const products = await buscarProdutos();    // 100ms  → total 200ms

  // ✅ Paralelo — rápido
  const [users, products] = await Promise.all([
    buscarUsuarios(),
    buscarProdutos(),
  ]);                                          // total ~100ms

Métodos importantes:
• **\`Promise.all([...])\`** — espera **todas**; se uma falhar, a Promise toda rejeita.
• **\`Promise.allSettled([...])\`** — espera todas; **nunca** rejeita; cada item vira \`{status, value|reason}\`.
• **\`Promise.race([...])\`** — resolve/rejeita com a **primeira** que terminar (útil para timeout).
• **\`Promise.any([...])\`** — resolve com a **primeira sucesso**, ignora falhas.

## 📚 Exemplos comentados
  // 1. Paralelo simples
  const [u, p] = await Promise.all([buscarUsuarios(), buscarProdutos()]);

  // 2. Tolerante a falhas
  const resultados = await Promise.allSettled([fetch("/a"), fetch("/b")]);
  resultados.forEach(r => r.status === "fulfilled" ? console.log(r.value) : console.error(r.reason));

  // 3. Retry com backoff exponencial
  async function comRetry(fn, tentativas = 3) {
    for (let i = 0; i < tentativas; i++) {
      try { return await fn(); }
      catch (err) {
        if (i === tentativas - 1) throw err;
        await new Promise(r => setTimeout(r, 1000 * 2 ** i));   // 1s, 2s, 4s
      }
    }
  }

## ⚠️ Erros comuns
• \`await\` em **loop** quando dava para paralelizar → API 10× mais lenta.
• Esquecer **\`await\`** antes de uma Promise → você grava \`Promise { <pending> }\` no banco.
• Usar \`Promise.all\` quando uma falha **não** deveria abortar as outras → use \`allSettled\`.
• Misturar \`async/await\` com \`.then()\` no mesmo bloco → código ilegível e propenso a bugs.

## 🚀 Quando usar na prática
**Sempre** que sua rota faz mais de uma chamada externa (banco + cache + API de terceiro), avalie se elas são **independentes** — se forem, \`Promise.all\` é grátis e drasticamente mais rápido. **Retry com backoff** é padrão para chamadas a APIs flaky (pagamento, envio de email).`,
        starterCode: '// Use async/await e Promise.all\n',
        solution: 'function buscarUsuarios() {\n  return new Promise(resolve => setTimeout(() => resolve(["Ana", "Bruno"]), 100));\n}\nfunction buscarProdutos() {\n  return new Promise(resolve => setTimeout(() => resolve(["Notebook", "Mouse"]), 100));\n}\n\nasync function main() {\n  const [users, products] = await Promise.all([buscarUsuarios(), buscarProdutos()]);\n  console.log("Usuários:", users);\n  console.log("Produtos:", products);\n}\nmain();',
        expectedOutput: "Usuários:",
        hints: ["Promise.all() executa em paralelo", "Desestruture o resultado", "Cada item é uma Promise"],
        xpReward: 25,
        quiz: [
          { question: "O que Promise.all faz?", options: ["Executa sequencialmente", "Executa em paralelo e espera todas", "Retorna a primeira", "Cancela as outras"], correctIndex: 1, explanation: "Promise.all dispara várias Promises ao mesmo tempo e aguarda TODAS terminarem. Se uma falhar, a promise toda falha. Promise.race retorna a primeira que terminar." },
        ],
      },
      {
        id: "5-11",
        title: "Variáveis de Ambiente",
        description: "Configure **variáveis de ambiente** com dotenv para armazenar a porta e uma chave de API.",
        theory: `# Variáveis de ambiente — Configuração fora do código

## 💡 O que é
**Variáveis de ambiente** são valores fornecidos pelo sistema operacional (ou pelo arquivo \`.env\`) ao processo Node, acessados via \`process.env.NOME\`. Servem para guardar **configurações que mudam por ambiente** (dev/staging/prod) e **segredos** (chaves de API, senhas) — coisas que **nunca** podem ir para o Git.

## 🌍 Analogia do mundo real
Pense numa **receita de bolo** publicada em livro: ela diz "use o forno na temperatura X". O código é a receita; **\`X\` muda a cada cozinha** (dev usa 180°, prod usa 220°). A receita não muda — quem muda é o ambiente. \`.env\` é a "etiqueta na sua cozinha" dizendo qual valor usar.

## 🔧 Sintaxe e como funciona
Arquivo **\`.env\`** (raiz do projeto, **gitignored**):
  PORT=3000
  DATABASE_URL=postgres://user:senha@host/db
  API_KEY=sk_live_xxx

No código:
  require("dotenv").config();           // carrega .env em process.env
  const port = process.env.PORT ?? 3000;
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY não configurada");

Convenção: **SCREAMING_SNAKE_CASE**, valores como string (Node não converte tipos sozinho).

## 📚 Exemplos comentados
  // 1. Carregar e validar no boot
  require("dotenv").config();
  const obrigatorias = ["DATABASE_URL", "JWT_SECRET"];
  for (const k of obrigatorias) if (!process.env[k]) throw new Error(\`falta \${k}\`);

  // 2. Defaults para dev
  const port = Number(process.env.PORT ?? 3000);
  const isProd = process.env.NODE_ENV === "production";

  // 3. Arquivo de exemplo versionado (.env.example)
  // PORT=
  // DATABASE_URL=
  // API_KEY=
  // → comitado no Git como template para novos devs

## ⚠️ Erros comuns
• **Comitar o \`.env\`** com chaves reais no Git → vazamento permanente (mesmo deletando depois, o histórico fica).
• Esquecer de criar **\`.env.example\`** → novo dev clona o projeto e não sabe quais variáveis configurar.
• Esperar que \`process.env.PORT\` seja **número** — sempre vem **string**. Use \`Number(...)\`.
• Chamar \`dotenv.config()\` **depois** de já ter usado \`process.env\` em outros arquivos.

## 🚀 Quando usar na prática
**Toda** configuração que: (a) muda entre ambientes (URLs, portas, flags) ou (b) é segredo (senhas, tokens, chaves). Em Lovable Cloud, secrets são gerenciados pela plataforma e injetados nas edge functions automaticamente — você nunca os vê no código.`,
        starterCode: '// Configure dotenv\n',
        solution: 'require("dotenv").config();\n\nconst PORT = process.env.PORT || 3000;\nconst API_KEY = process.env.API_KEY;\n\nconsole.log("Porta:", PORT);\nif (!API_KEY) console.log("⚠️ API_KEY não configurada!");',
        expectedOutput: "Porta:",
        hints: ["require('dotenv').config() carrega o .env", "process.env.VARIAVEL acessa o valor", "|| define valor padrão"],
        xpReward: 20,
      },
    ],
  },
  {
    id: "6",
    title: "SQL & Bancos de Dados",
    language: "SQL",
    emoji: "🗄️",
    level: "Iniciante",
    duration: "25h",
    students: 6100,
    progress: 0,
    color: "quest-orange",
    tags: ["Popular"],
    description: "Aprenda SQL do básico ao avançado: SELECT, JOIN, GROUP BY, subqueries e otimização.",
    lessons: [
      {
        id: "6-1",
        title: "SELECT Básico",
        description: "Escreva um SELECT para buscar **todos os campos** da tabela `usuarios`.",
        theory: `SQL (Structured Query Language) é a linguagem para interagir com bancos de dados relacionais. O SELECT é o comando mais usado — ele busca dados.

Sintaxe básica:
  SELECT colunas FROM tabela;

Exemplos:
  SELECT * FROM usuarios;
  -- * significa TODOS os campos

  SELECT nome, email FROM usuarios;
  -- Só os campos nome e email

  SELECT nome AS "Nome Completo" FROM usuarios;
  -- Renomeia a coluna no resultado (alias)

Conceitos de banco relacional:
• Tabela → como uma planilha (linhas e colunas)
• Linha (registro/row) → um dado completo
• Coluna (campo) → uma propriedade do dado
• Chave primária (PK) → identificador único (geralmente id)

Exemplo de tabela "usuarios":
  | id | nome    | email          | idade |
  |----|---------|----------------|-------|
  | 1  | Ana     | ana@mail.com   | 25    |
  | 2  | Bruno   | bruno@mail.com | 30    |

O ponto e vírgula (;) no final é obrigatório em SQL!`,
        starterCode: '-- Busque todos os dados\n',
        solution: 'SELECT * FROM usuarios;',
        expectedOutput: "SELECT * FROM",
        hints: ["SELECT seleciona dados", "* significa todos os campos", "FROM indica a tabela"],
        xpReward: 10,
      },
      ...createSqlFoundationBridge(),
      {
        id: "6-2",
        title: "WHERE — Filtrando",
        description: "Busque apenas os usuários com **idade maior que 18** da tabela `usuarios`.",
        theory: `WHERE filtra os resultados do SELECT com base em condições. Só retorna linhas que atendem ao critério.

Sintaxe:
  SELECT * FROM tabela WHERE condição;

Operadores de comparação:
  = igual           <> ou != diferente
  > maior que       >= maior ou igual
  < menor que       <= menor ou igual

Exemplos:
  SELECT * FROM usuarios WHERE idade > 18;
  SELECT * FROM usuarios WHERE nome = 'Ana';
  SELECT * FROM produtos WHERE preco <= 50;

Operadores lógicos:
  AND → ambas as condições:
    WHERE idade > 18 AND cidade = 'SP'

  OR → pelo menos uma condição:
    WHERE idade < 18 OR idade > 60

  NOT → nega a condição:
    WHERE NOT cidade = 'RJ'

Operadores especiais:
  BETWEEN → intervalo:
    WHERE idade BETWEEN 18 AND 30

  IN → lista de valores:
    WHERE cidade IN ('SP', 'RJ', 'MG')

  LIKE → busca por padrão:
    WHERE nome LIKE 'A%'   → começa com A
    WHERE nome LIKE '%ana' → termina com ana
    WHERE nome LIKE '%ar%' → contém "ar"

  IS NULL → campo vazio:
    WHERE email IS NULL`,
        starterCode: '-- Filtre por idade\n',
        solution: 'SELECT * FROM usuarios WHERE idade > 18;',
        expectedOutput: "WHERE idade",
        hints: ["Use WHERE para filtrar", "Operadores: >, <, =, >=, <=", "WHERE idade > 18"],
        xpReward: 15,
      },
      {
        id: "6-3",
        title: "INSERT INTO",
        description: "Insira um novo usuário na tabela `usuarios` com nome **\"Maria\"** e idade **25**.",
        theory: `INSERT INTO adiciona novas linhas (registros) em uma tabela.

Sintaxe:
  INSERT INTO tabela (coluna1, coluna2) VALUES (valor1, valor2);

Exemplos:
  INSERT INTO usuarios (nome, idade) VALUES ('Maria', 25);
  INSERT INTO produtos (nome, preco) VALUES ('Notebook', 2999.90);

Regras:
• Textos entre aspas simples: 'Maria'
• Números sem aspas: 25, 3.14
• A ordem dos valores deve bater com a ordem das colunas
• Colunas com DEFAULT ou auto-increment podem ser omitidas

Inserindo múltiplos registros:
  INSERT INTO usuarios (nome, idade) VALUES
    ('Ana', 22),
    ('Bruno', 28),
    ('Carlos', 35);

INSERT com SELECT (copiar dados):
  INSERT INTO usuarios_backup (nome, idade)
  SELECT nome, idade FROM usuarios WHERE ativo = true;

Se a coluna id for auto-increment (serial), não inclua:
  -- O banco gera o id automaticamente
  INSERT INTO usuarios (nome, idade) VALUES ('Maria', 25);
  -- id será 1, 2, 3... automaticamente`,
        starterCode: '-- Insira o registro\n',
        solution: "INSERT INTO usuarios (nome, idade) VALUES ('Maria', 25);",
        expectedOutput: "INSERT INTO",
        hints: ["INSERT INTO tabela (colunas) VALUES (valores)", "Texto entre aspas simples", "Números sem aspas"],
        xpReward: 15,
      },
      {
        id: "6-4",
        title: "UPDATE",
        description: "Atualize a idade do usuário **\"Maria\"** para **26** na tabela `usuarios`.",
        theory: `UPDATE modifica dados existentes em uma tabela. SEMPRE use WHERE para especificar quais registros atualizar!

Sintaxe:
  UPDATE tabela SET coluna = valor WHERE condição;

Exemplos:
  UPDATE usuarios SET idade = 26 WHERE nome = 'Maria';
  UPDATE produtos SET preco = 49.90 WHERE id = 5;

Atualizando múltiplas colunas:
  UPDATE usuarios SET idade = 26, cidade = 'RJ' WHERE id = 3;

⚠️ CUIDADO! Sem WHERE, atualiza TODOS os registros:
  UPDATE usuarios SET ativo = false;
  -- Desativa TODOS os usuários! Provavelmente não é o que você quer.

Boas práticas:
1. SEMPRE use WHERE com UPDATE e DELETE
2. Teste o WHERE com SELECT antes:
   SELECT * FROM usuarios WHERE nome = 'Maria';
   -- Confirme que retorna o registro certo
   UPDATE usuarios SET idade = 26 WHERE nome = 'Maria';

3. Use id (chave primária) quando possível:
   UPDATE usuarios SET idade = 26 WHERE id = 3;
   -- Mais seguro, pois id é único

UPDATE com cálculos:
  UPDATE produtos SET preco = preco * 1.10;
  -- Aumenta 10% em todos os preços`,
        starterCode: '-- Atualize o registro\n',
        solution: "UPDATE usuarios SET idade = 26 WHERE nome = 'Maria';",
        expectedOutput: "UPDATE",
        hints: ["UPDATE tabela SET campo = valor", "Use WHERE para filtrar qual registro", "Sem WHERE atualiza TODOS os registros!"],
        xpReward: 15,
      },
      {
        id: "6-5",
        title: "JOIN",
        description: "Faça um **INNER JOIN** entre `usuarios` e `pedidos` usando a coluna `usuario_id` para buscar nome e valor do pedido.",
        theory: `JOIN combina dados de duas ou mais tabelas baseado em uma relação entre elas. É uma das operações mais poderosas do SQL!

Tipos de JOIN:
  INNER JOIN → só retorna registros que existem em AMBAS as tabelas
  LEFT JOIN  → todos da esquerda + matches da direita (NULL se não tiver)
  RIGHT JOIN → todos da direita + matches da esquerda
  FULL JOIN  → todos de ambas as tabelas

Exemplo com INNER JOIN:
  Tabela usuarios: | id | nome  |
                   | 1  | Ana   |
                   | 2  | Bruno |

  Tabela pedidos:  | id | usuario_id | valor  |
                   | 1  | 1          | 99.90  |
                   | 2  | 1          | 49.90  |

  SELECT u.nome, p.valor
  FROM usuarios u
  INNER JOIN pedidos p ON u.id = p.usuario_id;

  Resultado: | nome | valor |
             | Ana  | 99.90 |
             | Ana  | 49.90 |
  (Bruno não aparece pois não tem pedidos)

Aliases (apelidos) são essenciais com JOINs:
  FROM usuarios u    → "u" é o alias de usuarios
  ON u.id = p.usuario_id → referencia usando o alias

LEFT JOIN incluiria Bruno com valor NULL.`,
        starterCode: '-- Faça o JOIN\n',
        solution: 'SELECT u.nome, p.valor\nFROM usuarios u\nINNER JOIN pedidos p ON u.id = p.usuario_id;',
        expectedOutput: "INNER JOIN",
        hints: ["INNER JOIN tabela ON condição", "Use aliases: usuarios u", "ON u.id = p.usuario_id"],
        xpReward: 25,
      },
      {
        id: "6-6",
        title: "GROUP BY e COUNT",
        description: "Conte quantos pedidos cada usuário fez, agrupando por `nome`.",
        theory: `GROUP BY agrupa registros que têm valores iguais e permite usar funções de agregação.

Funções de agregação:
  COUNT() → conta registros
  SUM()   → soma valores
  AVG()   → média dos valores
  MAX()   → maior valor
  MIN()   → menor valor

Sintaxe:
  SELECT coluna, FUNCAO(coluna)
  FROM tabela
  GROUP BY coluna;

Exemplos:
  -- Quantos pedidos por usuário
  SELECT u.nome, COUNT(p.id) as total_pedidos
  FROM usuarios u
  LEFT JOIN pedidos p ON u.id = p.usuario_id
  GROUP BY u.nome;

  -- Total gasto por cliente
  SELECT nome, SUM(valor) as total
  FROM pedidos
  GROUP BY nome;

HAVING — filtrar após o agrupamento:
  SELECT nome, COUNT(*) as total
  FROM pedidos
  GROUP BY nome
  HAVING COUNT(*) > 5;
  -- Só clientes com mais de 5 pedidos

WHERE vs HAVING:
• WHERE filtra ANTES do agrupamento
• HAVING filtra DEPOIS do agrupamento

Ordem das cláusulas:
  SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT`,
        starterCode: '-- Agrupe e conte\n',
        solution: 'SELECT u.nome, COUNT(p.id) as total_pedidos\nFROM usuarios u\nLEFT JOIN pedidos p ON u.id = p.usuario_id\nGROUP BY u.nome;',
        expectedOutput: "GROUP BY",
        hints: ["GROUP BY agrupa resultados", "COUNT() conta registros", "Use LEFT JOIN para incluir quem não tem pedidos"],
        xpReward: 25,
      },
      {
        id: "6-7",
        title: "Subqueries",
        description: "Use uma **subquery** para encontrar os usuários cuja idade é maior que a média de idade de todos os usuários.",
        theory: `Subqueries (subconsultas) são consultas dentro de outras consultas. Permitem usar o resultado de um SELECT como parte de outro.

Subquery no WHERE:
  SELECT * FROM usuarios
  WHERE idade > (SELECT AVG(idade) FROM usuarios);
  -- Retorna usuários acima da média de idade

Subquery no FROM (tabela derivada):
  SELECT nome, total
  FROM (
    SELECT u.nome, COUNT(p.id) as total
    FROM usuarios u
    LEFT JOIN pedidos p ON u.id = p.usuario_id
    GROUP BY u.nome
  ) as contagem
  WHERE total > 5;

Subquery com IN:
  SELECT * FROM produtos
  WHERE categoria_id IN (
    SELECT id FROM categorias WHERE ativa = true
  );

Subquery com EXISTS:
  SELECT * FROM usuarios u
  WHERE EXISTS (
    SELECT 1 FROM pedidos p WHERE p.usuario_id = u.id
  );
  -- Usuários que têm pelo menos um pedido

Dica: Subqueries podem ser lentas. Em muitos casos, JOIN é mais eficiente!`,
        starterCode: '-- Use subquery\n',
        solution: 'SELECT * FROM usuarios\nWHERE idade > (SELECT AVG(idade) FROM usuarios);',
        expectedOutput: "SELECT AVG",
        hints: ["Subquery fica entre parênteses", "AVG() calcula a média", "A subquery roda primeiro e o resultado é usado no WHERE"],
        xpReward: 25,
      },
      {
        id: "6-8",
        title: "CREATE TABLE",
        description: "Crie uma tabela **produtos** com campos: `id` (serial primary key), `nome` (varchar), `preco` (decimal) e `estoque` (integer com default 0).",
        theory: `CREATE TABLE define a estrutura de uma nova tabela no banco de dados.

Sintaxe:
  CREATE TABLE nome_tabela (
    coluna1 tipo restricoes,
    coluna2 tipo restricoes
  );

Tipos de dados comuns:
  INTEGER / INT      → números inteiros
  SERIAL             → inteiro auto-incremento (ideal para id)
  VARCHAR(n)         → texto com limite de n caracteres
  TEXT               → texto sem limite
  DECIMAL(p, s)      → número decimal (p dígitos, s casas)
  BOOLEAN            → true/false
  DATE               → data
  TIMESTAMP          → data + hora

Restrições (constraints):
  PRIMARY KEY → identificador único
  NOT NULL    → campo obrigatório
  UNIQUE      → valor único na tabela
  DEFAULT val → valor padrão
  REFERENCES  → chave estrangeira

Exemplo completo:
  CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INTEGER DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

Chave estrangeira:
  CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    valor DECIMAL(10, 2)
  );`,
        starterCode: '-- Crie a tabela\n',
        solution: 'CREATE TABLE produtos (\n  id SERIAL PRIMARY KEY,\n  nome VARCHAR(100) NOT NULL,\n  preco DECIMAL(10, 2) NOT NULL,\n  estoque INTEGER DEFAULT 0\n);',
        expectedOutput: "CREATE TABLE",
        hints: ["CREATE TABLE nome ( ... )", "SERIAL PRIMARY KEY para id auto-incremento", "DEFAULT define valor padrão"],
        xpReward: 20,
        quiz: [
          { question: "O que SERIAL faz?", options: ["Cria texto", "Gera ID auto-incremento", "Define chave estrangeira", "Valida formato"], correctIndex: 1, explanation: "SERIAL é um atalho para INTEGER com sequência auto-incrementada. Ideal para colunas de ID. Cada novo registro recebe automaticamente o próximo número." },
        ],
      },
      {
        id: "6-9",
        title: "ORDER BY e LIMIT",
        description: "Busque os **5 usuários mais novos** (menor idade) da tabela `usuarios`, ordenados por idade crescente.",
        theory: `ORDER BY ordena os resultados e LIMIT restringe a quantidade retornada. Essenciais para paginação e ranking!

ORDER BY:
  SELECT * FROM usuarios ORDER BY idade;        → crescente (ASC, padrão)
  SELECT * FROM usuarios ORDER BY idade DESC;   → decrescente
  SELECT * FROM usuarios ORDER BY nome ASC;     → alfabética

Múltiplas colunas:
  SELECT * FROM usuarios ORDER BY cidade, nome;
  -- Ordena por cidade primeiro, depois nome dentro da mesma cidade

LIMIT:
  SELECT * FROM usuarios LIMIT 10;              → primeiros 10
  SELECT * FROM usuarios LIMIT 10 OFFSET 20;    → pula 20, pega 10 (página 3)

Paginação:
  -- Página 1: LIMIT 10 OFFSET 0
  -- Página 2: LIMIT 10 OFFSET 10
  -- Página 3: LIMIT 10 OFFSET 20
  -- Fórmula: OFFSET = (página - 1) * itens_por_pagina

Combinando tudo:
  SELECT nome, idade
  FROM usuarios
  WHERE ativo = true
  ORDER BY idade ASC
  LIMIT 5;
  -- 5 usuários ativos mais jovens

TOP N por categoria (window functions):
  SELECT nome, cidade, idade,
    ROW_NUMBER() OVER (PARTITION BY cidade ORDER BY idade) as rank
  FROM usuarios;

DISTINCT — valores únicos:
  SELECT DISTINCT cidade FROM usuarios;
  SELECT COUNT(DISTINCT cidade) FROM usuarios;`,
        starterCode: '-- Busque os 5 mais novos\n',
        solution: 'SELECT * FROM usuarios\nORDER BY idade ASC\nLIMIT 5;',
        expectedOutput: "ORDER BY",
        hints: ["ORDER BY idade ASC para crescente", "LIMIT 5 para limitar", "ASC é o padrão, pode omitir"],
        xpReward: 15,
      },
      {
        id: "6-10",
        title: "ALTER TABLE e DELETE",
        description: "Adicione uma coluna **email** (varchar) à tabela `usuarios` e delete todos os usuários com idade menor que 18.",
        theory: `ALTER TABLE modifica a estrutura de uma tabela existente. DELETE remove registros.

ALTER TABLE — adicionar coluna:
  ALTER TABLE usuarios ADD COLUMN email VARCHAR(100);

ALTER TABLE — modificar coluna:
  ALTER TABLE usuarios ALTER COLUMN email SET NOT NULL;
  ALTER TABLE usuarios ALTER COLUMN idade SET DEFAULT 0;

ALTER TABLE — renomear:
  ALTER TABLE usuarios RENAME COLUMN nome TO full_name;
  ALTER TABLE usuarios RENAME TO clientes;

ALTER TABLE — remover coluna:
  ALTER TABLE usuarios DROP COLUMN email;

DELETE — remover registros:
  DELETE FROM usuarios WHERE idade < 18;

  ⚠️ CUIDADO! Sem WHERE, deleta TUDO:
  DELETE FROM usuarios;  -- apaga todos os registros!

TRUNCATE — mais rápido que DELETE para limpar tabela inteira:
  TRUNCATE TABLE usuarios;
  -- Remove tudo e reseta auto-increment

DROP TABLE — remove a tabela inteira:
  DROP TABLE IF EXISTS usuarios;
  -- Remove estrutura + dados!

Ordem de "perigo":
  UPDATE WHERE → atualiza registros específicos (seguro)
  DELETE WHERE → remove registros específicos (cuidado)
  DELETE       → remove TUDO (perigoso)
  TRUNCATE     → remove tudo + reseta (perigoso)
  DROP TABLE   → apaga a tabela inteira (irreversível!)

Dica: Sempre faça SELECT com o mesmo WHERE antes de DELETE!`,
        starterCode: '-- ALTER TABLE e DELETE\n',
        solution: 'ALTER TABLE usuarios ADD COLUMN email VARCHAR(100);\nDELETE FROM usuarios WHERE idade < 18;',
        expectedOutput: "ALTER TABLE",
        hints: ["ALTER TABLE ... ADD COLUMN", "DELETE FROM ... WHERE", "SEMPRE use WHERE com DELETE!"],
        xpReward: 20,
        quiz: [
          { question: "O que acontece com DELETE sem WHERE?", options: ["Nada", "Deleta a tabela", "Deleta TODOS os registros", "Dá erro"], correctIndex: 2, explanation: "DELETE sem WHERE apaga TODOS os registros da tabela (a estrutura permanece). Sempre verifique seu WHERE antes de executar! DROP TABLE remove a tabela inteira." },
        ],
      },
      {
        id: "6-11",
        title: "Índices e Performance",
        description: "Crie um **índice** na coluna `email` da tabela `usuarios` para acelerar buscas por email.",
        theory: `Índices são estruturas que aceleram drasticamente as buscas no banco de dados — como o índice de um livro!

Sem índice: o banco percorre TODAS as linhas (full table scan) — O(n)
Com índice: pula direto para o resultado — O(log n)

Criando índices:
  CREATE INDEX idx_email ON usuarios(email);
  CREATE UNIQUE INDEX idx_email_unico ON usuarios(email);
  CREATE INDEX idx_nome_cidade ON usuarios(nome, cidade);  -- composto

Quando criar índices:
  ✅ Colunas usadas frequentemente em WHERE
  ✅ Colunas usadas em JOIN (foreign keys)
  ✅ Colunas usadas em ORDER BY
  ✅ Colunas com alta cardinalidade (muitos valores únicos)

Quando NÃO criar:
  ❌ Tabelas muito pequenas (< 1000 linhas)
  ❌ Colunas raramente consultadas
  ❌ Colunas com poucos valores diferentes (ex: boolean)
  ❌ Tabelas com muitos INSERT/UPDATE (índices desaceleram escrita)

EXPLAIN — analisar performance:
  EXPLAIN ANALYZE SELECT * FROM usuarios WHERE email = 'ana@mail.com';
  -- Mostra se está usando índice ou full scan

Tipos de índice:
  B-tree (padrão) → comparações =, <, >, BETWEEN
  Hash → apenas igualdade (=)
  GIN → arrays, JSONB, full-text search
  GiST → dados geográficos

Removendo índice:
  DROP INDEX idx_email;

Regra de ouro: Crie índices para resolver queries lentas específicas, não "por precaução".`,
        starterCode: '-- Crie o índice\n',
        solution: 'CREATE INDEX idx_email ON usuarios(email);',
        expectedOutput: "CREATE INDEX",
        hints: ["CREATE INDEX nome ON tabela(coluna)", "Índices aceleram buscas", "Use EXPLAIN para verificar performance"],
        xpReward: 25,
      },
    
    ],
  },
  {
    id: "7",
    title: "Git & GitHub Pro",
    language: "Git",
    emoji: "🔀",
    level: "Iniciante",
    duration: "14h",
    students: 8900,
    progress: 80,
    color: "quest-blue",
    tags: [],
    description: "Domine Git e GitHub: commits, branches, merge, pull requests e workflows.",
    lessons: [
      {
        id: "7-1",
        title: "git init e primeiro commit",
        description: "Inicialize um repositório e faça o primeiro commit com a mensagem **\"Início do projeto\"**.",
        theory: `Git é um sistema de controle de versão — ele rastreia todas as mudanças no seu código, permite voltar no tempo e colaborar com outras pessoas.

Conceitos fundamentais:
• Repositório (repo) → pasta do projeto rastreada pelo Git
• Commit → um "snapshot" do código em um momento
• Staging area → área de preparação (entre edição e commit)

Fluxo básico:
  1. Edita arquivos
  2. git add → move para staging area
  3. git commit → salva o snapshot

Comandos iniciais:
  git init                    → cria um repo na pasta atual
  git status                  → mostra o estado dos arquivos
  git add arquivo.txt         → adiciona arquivo ao staging
  git add .                   → adiciona TODOS os arquivos
  git commit -m "mensagem"    → cria o commit com mensagem

Boas práticas de mensagem de commit:
  ✅ "Adiciona formulário de login"
  ✅ "Corrige bug no cálculo de frete"
  ❌ "fix"
  ❌ "alterações"

Use o presente do indicativo: "Adiciona" em vez de "Adicionado".`,
        starterCode: '# Comandos Git\n',
        solution: 'git init\ngit add .\ngit commit -m "Início do projeto"',
        expectedOutput: "git init",
        hints: ["git init cria o repositório", "git add . adiciona todos os arquivos", 'git commit -m "mensagem"'],
        xpReward: 10,
      },
      ...createGitFoundationBridge(),
      {
        id: "7-2",
        title: "Branches",
        description: "Crie uma nova branch chamada **\"feature/login\"** e mude para ela.",
        theory: `Branches (ramificações) permitem trabalhar em funcionalidades isoladas sem afetar o código principal.

Imagine como uma árvore:
  main ────●────●────●──── (código estável)
                 \\
                  ●────●── feature/login (nova funcionalidade)

Comandos:
  git branch                    → lista branches
  git branch feature/login      → cria nova branch
  git checkout feature/login    → muda para a branch
  git checkout -b feature/login → cria E muda (atalho!)
  git switch feature/login      → muda (comando moderno)
  git switch -c feature/login   → cria E muda (moderno)

Convenções de nome:
  feature/login     → nova funcionalidade
  bugfix/header     → correção de bug
  hotfix/seguranca  → correção urgente
  release/v2.0      → preparação de release

Fluxo típico:
  1. Crie uma branch para a tarefa
  2. Faça commits na branch
  3. Quando pronto, faça merge para main
  4. Delete a branch

A branch main (ou master) é a versão estável do projeto. Nunca faça commits direto nela em projetos com equipe!`,
        starterCode: '# Crie e mude de branch\n',
        solution: 'git checkout -b feature/login',
        expectedOutput: "checkout -b",
        hints: ["git branch nome cria a branch", "git checkout nome muda para ela", "git checkout -b faz os dois de uma vez"],
        xpReward: 15,
      },
      {
        id: "7-3",
        title: "Merge",
        description: "Volte para a branch `main` e faça merge da branch `feature/login`.",
        theory: `Merge combina as mudanças de uma branch em outra. É como "juntar" o trabalho feito separadamente.

Fluxo de merge:
  1. Vá para a branch que vai RECEBER as mudanças:
     git checkout main

  2. Faça o merge da branch com as mudanças:
     git merge feature/login

  3. (Opcional) Delete a branch após o merge:
     git branch -d feature/login

Tipos de merge:
  Fast-forward → quando main não mudou desde a criação da branch
    main:    A → B
    feature: A → B → C → D
    Resultado: main vira A → B → C → D (sem commit extra)

  Merge commit → quando ambas as branches mudaram
    main:    A → B → E
    feature: A → B → C → D
    Resultado: cria um commit de merge juntando as duas

Visualizando o histórico:
  git log --oneline --graph
  * abc1234 (HEAD -> main) Merge branch 'feature/login'
  |\\
  | * def5678 Adiciona validação
  | * ghi9012 Cria formulário de login
  |/
  * jkl3456 Commit anterior

O merge é uma operação segura — preserva todo o histórico.`,
        starterCode: '# Faça o merge\n',
        solution: 'git checkout main\ngit merge feature/login',
        expectedOutput: "git merge",
        hints: ["Primeiro volte para main", "git checkout main", "git merge nome-da-branch"],
        xpReward: 15,
      },
      {
        id: "7-4",
        title: "Resolvendo Conflitos",
        description: "Quando há conflito, o Git marca o arquivo. Descreva os passos para **resolver um conflito de merge**.",
        theory: `Conflitos acontecem quando duas branches modificam a MESMA linha do MESMO arquivo. O Git não sabe qual manter e pede sua ajuda.

Quando ocorre um conflito, o Git marca o arquivo assim:
  <<<<<<< HEAD
  código da sua branch (main)
  =======
  código da outra branch (feature)
  >>>>>>> feature/login

Passos para resolver:
  1. Abra o arquivo com conflito
  2. Encontre as marcações <<<<, ====, >>>>
  3. Decida qual código manter (ou combine ambos)
  4. REMOVA as marcações do Git
  5. git add arquivo-resolvido
  6. git commit (sem -m, o Git cria a mensagem)

Exemplo — antes:
  <<<<<<< HEAD
  const cor = "azul";
  =======
  const cor = "vermelho";
  >>>>>>> feature/tema

Exemplo — depois (resolvido):
  const cor = "roxo";  // ou qualquer decisão

Dicas:
• VSCode tem ferramentas visuais para resolver conflitos
• git merge --abort → cancela o merge e volta ao estado anterior
• Comunique-se com a equipe para entender a intenção de cada mudança
• Conflitos são normais em equipes — não é um erro!`,
        starterCode: '# Passos para resolver conflitos\n',
        solution: '# 1. Abra o arquivo com conflito\n# 2. Escolha qual código manter (remova <<<<, ====, >>>>)\n# 3. git add arquivo-resolvido\n# 4. git commit',
        expectedOutput: "git add",
        hints: ["O Git marca conflitos com <<<< ==== >>>>", "Edite o arquivo manualmente", "Depois faça git add e git commit"],
        xpReward: 20,
      },
      {
        id: "7-5",
        title: "Pull Request",
        description: "Descreva os passos para criar um **Pull Request** no GitHub após enviar uma branch.",
        theory: `Pull Request (PR) é a forma de propor mudanças no GitHub. Permite revisão de código antes de fazer merge na branch principal.

Fluxo completo:
  1. Crie uma branch localmente:
     git checkout -b feature/login

  2. Faça commits:
     git add .
     git commit -m "Adiciona formulário de login"

  3. Envie a branch para o GitHub:
     git push origin feature/login

  4. No GitHub:
     - Clique em "Compare & pull request"
     - Escreva título e descrição
     - Escolha reviewers
     - Clique "Create pull request"

  5. Após aprovação: Merge e delete da branch

Boas práticas de PR:
  ✅ Título claro: "Adiciona autenticação com Google"
  ✅ Descrição com contexto: O que fez? Por quê? Como testar?
  ✅ PRs pequenos e focados
  ✅ Screenshots para mudanças visuais
  ❌ PRs gigantes com 50 arquivos
  ❌ Sem descrição

Code review — ao revisar:
  • Leia o código com atenção
  • Deixe comentários construtivos
  • Aprove ou peça mudanças
  • Teste localmente se necessário`,
        starterCode: '# Passos para criar um PR\n',
        solution: '# 1. git push origin feature/login\n# 2. Acesse o repositório no GitHub\n# 3. Clique em "Compare & pull request"\n# 4. Descreva as mudanças e crie o PR',
        expectedOutput: "git push",
        hints: ["Primeiro faça push da branch", "No GitHub, clique em Compare & pull request", "Descreva suas mudanças no PR"],
        xpReward: 20,
      },
      {
        id: "7-6",
        title: "git stash",
        description: "Use **git stash** para salvar temporariamente mudanças não commitadas e depois restaurá-las.",
        theory: `git stash "guarda" suas mudanças em uma pilha temporária, deixando o diretório de trabalho limpo. Ideal para trocar de branch sem commitar trabalho incompleto.

Comandos:
  git stash            → guarda mudanças (tracked files)
  git stash -u         → inclui arquivos novos (untracked)
  git stash pop        → restaura E remove do stash
  git stash apply      → restaura mas MANTÉM no stash
  git stash list       → lista todos os stashes
  git stash drop       → remove o stash mais recente
  git stash clear      → remove todos os stashes

Fluxo típico:
  # Trabalhando na feature...
  git stash              # guarda mudanças
  git checkout main      # vai para main
  # Faz hotfix urgente...
  git checkout feature   # volta para feature
  git stash pop          # restaura mudanças

Stash com mensagem:
  git stash save "WIP: formulário de login"
  git stash list
  # stash@{0}: On feature: WIP: formulário de login

Aplicar stash específico:
  git stash apply stash@{2}

Dica: Stash é como um "ctrl+z temporário" — use para pausar o trabalho sem perder nada!`,
        starterCode: '# Use git stash\n',
        solution: 'git stash\n# ... faz outra coisa ...\ngit stash pop',
        expectedOutput: "git stash",
        hints: ["git stash guarda mudanças temporariamente", "git stash pop restaura as mudanças", "Útil para trocar de branch sem commit"],
        xpReward: 15,
      },
      {
        id: "7-7",
        title: "git rebase",
        description: "Descreva como usar **git rebase** para manter o histórico limpo em vez de merge.",
        theory: `Rebase reaplica seus commits SOBRE outra branch, criando um histórico linear (sem commits de merge).

Merge vs Rebase:
  Merge: preserva a história completa (com bifurcações)
    A → B → C → M (merge commit)
             ↗
        D → E

  Rebase: reescreve para parecer linear
    A → B → C → D' → E'

Usando rebase:
  git checkout feature
  git rebase main
  # Seus commits são reaplicados sobre o main atualizado

Fluxo seguro:
  1. git checkout main && git pull
  2. git checkout feature
  3. git rebase main
  4. Resolva conflitos (se houver)
  5. git rebase --continue
  6. git push --force-with-lease  (necessário após rebase!)

Interactive rebase — reorganizar commits:
  git rebase -i HEAD~3   # últimos 3 commits

  Opções:
    pick   → manter o commit
    squash → juntar com o anterior
    reword → alterar a mensagem
    drop   → remover o commit
    edit   → pausar para editar

Squash — juntar commits:
  pick abc1234 Adiciona formulário
  squash def5678 Corrige typo
  squash ghi9012 Ajusta estilo
  → Vira um só commit limpo!

⚠️ REGRA DE OURO: Nunca faça rebase em branches públicas/compartilhadas! Rebase reescreve o histórico — outros devs terão conflitos.`,
        starterCode: '# Use git rebase\n',
        solution: 'git checkout feature\ngit rebase main\n# Resolva conflitos se necessário\n# git rebase --continue',
        expectedOutput: "git rebase",
        hints: ["Rebase reaplica commits sobre outra branch", "Cria histórico linear", "Nunca rebase branches compartilhadas!"],
        xpReward: 20,
        quiz: [
          { question: "Qual a diferença principal entre merge e rebase?", options: ["Rebase é mais rápido", "Merge cria histórico linear", "Rebase cria histórico linear", "Não há diferença"], correctIndex: 2, explanation: "Rebase reaplica seus commits sobre outro branch, criando histórico linear e limpo. Merge preserva o histórico real com um commit de merge. Rebase é ideal para branches locais." },
        ],
      },
      {
        id: "7-8",
        title: ".gitignore e Boas Práticas",
        description: "Crie um **.gitignore** para um projeto Node.js que ignore `node_modules/`, `.env` e arquivos de build.",
        theory: `.gitignore diz ao Git quais arquivos/pastas NÃO rastrear. Essencial para manter o repositório limpo!

Sintaxe do .gitignore:
  # Comentário
  node_modules/       → ignora a pasta inteira
  *.log              → ignora todos os .log
  .env               → ignora arquivo específico
  dist/              → ignora pasta de build
  !important.log     → NÃO ignora (exceção com !)

.gitignore para Node.js:
  node_modules/
  .env
  .env.local
  dist/
  build/
  *.log
  .DS_Store
  coverage/
  .cache/

.gitignore para Python:
  __pycache__/
  *.pyc
  .env
  venv/
  .pytest_cache/

IMPORTANTE: .gitignore só funciona para arquivos NOVOS. Se já rastreou:
  git rm --cached arquivo.txt
  # Remove do Git mas mantém no disco

Boas práticas Git:
  1. Commits atômicos — cada commit faz UMA coisa
  2. Mensagens descritivas — "Adiciona validação de email no cadastro"
  3. Branches por feature — nunca commit direto na main
  4. Pull antes de push — git pull --rebase origin main
  5. Code review — todo código passa por revisão
  6. Conventional Commits:
     feat: nova funcionalidade
     fix: correção de bug
     docs: documentação
     style: formatação
     refactor: refatoração
     test: testes

  git commit -m "feat: adiciona autenticação com Google"`,
        starterCode: '# Crie o .gitignore\n',
        solution: '# .gitignore\nnode_modules/\n.env\n.env.local\ndist/\nbuild/\n*.log\n.DS_Store\ncoverage/',
        expectedOutput: "node_modules",
        hints: ["Cada linha é um padrão a ignorar", "* é wildcard para qualquer arquivo", "/ no final indica pasta"],
        xpReward: 15,
      },
    
    ],
  },
  {
    id: "8",
    title: "Algoritmos & Estruturas",
    language: "Lógica",
    emoji: "🧠",
    level: "Avançado",
    duration: "50h",
    students: 3200,
    progress: 0,
    color: "primary",
    tags: ["Em alta"],
    description: "Domine algoritmos, complexidade, ordenação, busca, árvores e grafos.",
    lessons: [
      {
        id: "8-1",
        title: "Big O Notation",
        description: "Qual a complexidade do algoritmo abaixo? Responda com a notação Big O.\n```\nfor i in range(n):\n    print(i)\n```",
        theory: `Big O Notation descreve a eficiência de um algoritmo — quanto tempo ou memória ele usa conforme o tamanho da entrada (n) cresce.

Complexidades comuns (do mais rápido ao mais lento):
  O(1)       → Constante: sempre o mesmo tempo
               Exemplo: acessar item por índice arr[5]

  O(log n)   → Logarítmica: divide o problema pela metade
               Exemplo: busca binária

  O(n)       → Linear: percorre todos os elementos uma vez
               Exemplo: for i in range(n): print(i)

  O(n log n) → Log-linear: divisão + percorrer
               Exemplo: merge sort, quicksort

  O(n²)      → Quadrática: loop dentro de loop
               Exemplo: bubble sort, dois for aninhados

  O(2ⁿ)      → Exponencial: dobra a cada elemento
               Exemplo: fibonacci recursivo sem cache

Como analisar:
  1. Conte os loops:
     - 1 loop = O(n)
     - 2 loops aninhados = O(n²)
     - Loop que divide por 2 = O(log n)

  2. Ignore constantes:
     - O(2n) → O(n)
     - O(n² + n) → O(n²)

  3. Considere o pior caso

Na prática: O(n log n) é bom. O(n²) é aceitável para n pequeno. O(2ⁿ) é quase sempre ruim.`,
        starterCode: '# Responda a complexidade\n# Exemplo: O(1), O(n), O(n^2), O(log n)\n',
        solution: 'O(n)',
        expectedOutput: "O(n)",
        hints: ["Um loop percorrendo n elementos", "Cada iteração faz trabalho constante", "Resposta: O(n)"],
        xpReward: 15,
      },
      {
        id: "8-2",
        title: "Bubble Sort",
        description: "Implemente o **Bubble Sort** em Python para ordenar a lista `[5, 3, 8, 1, 2]`.",
        theory: `Bubble Sort é o algoritmo de ordenação mais simples. Ele compara elementos adjacentes e troca se estiverem na ordem errada, repetindo até a lista estar ordenada.

Como funciona (exemplo: [5, 3, 8, 1, 2]):
  Passo 1: [3, 5, 1, 2, 8] → 8 "borbulha" para o final
  Passo 2: [3, 1, 2, 5, 8] → 5 vai para a posição
  Passo 3: [1, 2, 3, 5, 8] → ordenado!

Algoritmo:
  def bubble_sort(arr):
      n = len(arr)
      for i in range(n):           # repete n vezes
          for j in range(n - i - 1):  # compara adjacentes
              if arr[j] > arr[j+1]:   # se fora de ordem
                  arr[j], arr[j+1] = arr[j+1], arr[j]  # troca!
      return arr

Por que n - i - 1?
  A cada passada, o maior elemento "borbulha" para o final.
  Então não precisamos comparar os últimos i elementos (já estão ordenados).

Complexidade:
  Melhor caso: O(n) — já ordenado (com otimização)
  Pior caso: O(n²) — ordem invertida
  Espaço: O(1) — ordena "in-place"

Bubble Sort é didático mas LENTO para listas grandes. Na prática, use sort() do Python (usa Timsort, O(n log n)).`,
        starterCode: 'def bubble_sort(arr):\n    # Implemente aqui\n    pass\n\nprint(bubble_sort([5, 3, 8, 1, 2]))',
        solution: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nprint(bubble_sort([5, 3, 8, 1, 2]))',
        expectedOutput: "[1, 2, 3, 5, 8]",
        hints: ["Dois loops aninhados", "Compare elementos adjacentes", "Troque se estiverem na ordem errada"],
        xpReward: 25,
      },
      {
        id: "8-3",
        title: "Busca Binária",
        description: "Implemente a **busca binária** em Python. Busque o número **7** na lista `[1, 3, 5, 7, 9, 11]`.",
        theory: `Busca binária é um algoritmo eficiente para encontrar um elemento em uma lista ORDENADA. Divide o espaço de busca pela metade a cada passo.

Como funciona (buscar 7 em [1, 3, 5, 7, 9, 11]):
  Passo 1: meio = 5 → 7 > 5 → busca na metade direita [7, 9, 11]
  Passo 2: meio = 9 → 7 < 9 → busca na metade esquerda [7]
  Passo 3: meio = 7 → ENCONTROU! Índice 3

Algoritmo:
  def busca_binaria(arr, alvo):
      esq = 0
      dir = len(arr) - 1
      
      while esq <= dir:
          meio = (esq + dir) // 2
          
          if arr[meio] == alvo:
              return meio          # encontrou!
          elif arr[meio] < alvo:
              esq = meio + 1       # busca na direita
          else:
              dir = meio - 1       # busca na esquerda
      
      return -1  # não encontrou

Complexidade:
  Tempo: O(log n) — MUITO mais rápido que O(n)!
  Em 1 milhão de itens: busca linear = 1M comparações
                         busca binária = ~20 comparações!

PRÉ-REQUISITO: A lista DEVE estar ordenada! Se não estiver, ordene primeiro ou use busca linear.`,
        starterCode: 'def busca_binaria(arr, alvo):\n    # Implemente aqui\n    pass\n\nprint(busca_binaria([1, 3, 5, 7, 9, 11], 7))',
        solution: 'def busca_binaria(arr, alvo):\n    esq, dir = 0, len(arr) - 1\n    while esq <= dir:\n        meio = (esq + dir) // 2\n        if arr[meio] == alvo:\n            return meio\n        elif arr[meio] < alvo:\n            esq = meio + 1\n        else:\n            dir = meio - 1\n    return -1\n\nprint(busca_binaria([1, 3, 5, 7, 9, 11], 7))',
        expectedOutput: "3",
        hints: ["Divida o array ao meio a cada passo", "Compare o meio com o alvo", "Complexidade: O(log n)"],
        xpReward: 25,
      },
      {
        id: "8-4",
        title: "Pilha (Stack)",
        description: "Implemente uma **pilha** usando lista em Python com métodos `push`, `pop` e `peek`. Teste adicionando 1, 2, 3 e removendo um.",
        theory: `Uma Pilha (Stack) é uma estrutura de dados LIFO — Last In, First Out (último a entrar, primeiro a sair). Como uma pilha de pratos!

Operações:
  push(item) → adiciona no topo
  pop()      → remove e retorna o topo
  peek()     → vê o topo sem remover
  isEmpty()  → verifica se está vazia

Visualização:
  push(1): [1]
  push(2): [1, 2]
  push(3): [1, 2, 3]  ← topo
  pop():   [1, 2]     → retorna 3
  peek():  [1, 2]     → retorna 2 (sem remover)

Implementação em Python:
  class Pilha:
      def __init__(self):
          self.items = []
      
      def push(self, item):
          self.items.append(item)
      
      def pop(self):
          return self.items.pop()
      
      def peek(self):
          return self.items[-1]
      
      def is_empty(self):
          return len(self.items) == 0

Usos reais:
  • Ctrl+Z (desfazer) — cada ação vai para a pilha
  • Navegador — botão voltar usa uma pilha de URLs
  • Chamadas de função — a call stack é uma pilha!
  • Validação de parênteses: ({[]}) é válido?`,
        starterCode: 'class Pilha:\n    # Implemente aqui\n    pass\n',
        solution: 'class Pilha:\n    def __init__(self):\n        self.items = []\n    def push(self, item):\n        self.items.append(item)\n    def pop(self):\n        return self.items.pop()\n    def peek(self):\n        return self.items[-1]\n\np = Pilha()\np.push(1)\np.push(2)\np.push(3)\nprint(p.pop())\nprint(p.peek())',
        expectedOutput: "3",
        hints: ["Use lista como estrutura interna", "append para push, pop() para pop", "[-1] para peek (ver o topo)"],
        xpReward: 25,
      },
      {
        id: "8-5",
        title: "Recursão — Fibonacci",
        description: "Implemente a sequência de **Fibonacci** de forma recursiva. Exiba os 8 primeiros números.",
        theory: `Recursão é quando uma função chama a si mesma. Toda função recursiva precisa de dois componentes:

1. Caso base — quando PARAR (evita loop infinito)
2. Caso recursivo — quando chamar a si mesma

Fibonacci: cada número é a soma dos dois anteriores.
  0, 1, 1, 2, 3, 5, 8, 13, 21, 34...

  fib(0) = 0           (caso base)
  fib(1) = 1           (caso base)
  fib(n) = fib(n-1) + fib(n-2)  (caso recursivo)

Implementação:
  def fibonacci(n):
      if n <= 1:        # caso base
          return n
      return fibonacci(n-1) + fibonacci(n-2)  # recursivo

Árvore de chamadas para fib(4):
          fib(4)
         /      \\
      fib(3)    fib(2)
      /    \\    /    \\
   fib(2) fib(1) fib(1) fib(0)
   /    \\
 fib(1) fib(0)

⚠️ Problema: muitas chamadas repetidas! fib(2) é calculado várias vezes.
  Complexidade: O(2ⁿ) — muito lento!

Solução: Memoização (cache):
  from functools import lru_cache

  @lru_cache
  def fibonacci(n):
      if n <= 1: return n
      return fibonacci(n-1) + fibonacci(n-2)
  # Agora é O(n)!`,
        starterCode: 'def fibonacci(n):\n    # Implemente aqui\n    pass\n\nfor i in range(8):\n    print(fibonacci(i))',
        solution: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nfor i in range(8):\n    print(fibonacci(i))',
        expectedOutput: "0",
        hints: ["Caso base: n <= 1 retorna n", "Caso recursivo: fib(n-1) + fib(n-2)", "Os primeiros são: 0, 1, 1, 2, 3, 5, 8, 13"],
        xpReward: 30,
      },
      {
        id: "8-6",
        title: "Fila (Queue)",
        description: "Implemente uma **fila** usando lista em Python com `enqueue` e `dequeue`. Teste com os valores A, B, C.",
        theory: `Uma Fila (Queue) é uma estrutura de dados FIFO — First In, First Out (primeiro a entrar, primeiro a sair). Como uma fila de banco!

Operações:
  enqueue(item) → adiciona no FINAL
  dequeue()     → remove do INÍCIO
  front()       → vê o primeiro sem remover
  isEmpty()     → verifica se está vazia

Visualização:
  enqueue("A"): [A]
  enqueue("B"): [A, B]
  enqueue("C"): [A, B, C]
  dequeue():    [B, C]    → retorna "A"
  dequeue():    [C]       → retorna "B"

Implementação básica:
  class Fila:
      def __init__(self):
          self.items = []
      
      def enqueue(self, item):
          self.items.append(item)    # adiciona no final
      
      def dequeue(self):
          return self.items.pop(0)   # remove do início

Pilha vs Fila:
  Pilha (LIFO): último a entrar sai primeiro (pilha de pratos)
  Fila (FIFO): primeiro a entrar sai primeiro (fila de banco)

Usos reais:
  • Fila de impressão
  • Processamento de tarefas (job queue)
  • BFS (busca em largura) em grafos
  • Buffer de streaming

Nota: pop(0) é O(n). Para performance, use collections.deque!`,
        starterCode: 'class Fila:\n    # Implemente aqui\n    pass\n',
        solution: 'class Fila:\n    def __init__(self):\n        self.items = []\n    def enqueue(self, item):\n        self.items.append(item)\n    def dequeue(self):\n        return self.items.pop(0)\n\nf = Fila()\nf.enqueue("A")\nf.enqueue("B")\nf.enqueue("C")\nprint(f.dequeue())',
        expectedOutput: "A",
        hints: ["Fila: primeiro a entrar, primeiro a sair (FIFO)", "append para enqueue", "pop(0) para dequeue (remove do início)"],
        xpReward: 25,
      },
      {
        id: "8-7",
        title: "Hash Table",
        description: "Implemente uma **hash table** simples em Python com métodos `put` e `get`.",
        theory: `Hash Table (tabela hash) é uma estrutura que armazena pares chave-valor com acesso em O(1) — tempo constante!

Como funciona:
  1. Uma função hash converte a chave em um índice
  2. O valor é armazenado nesse índice
  3. Para buscar, aplica o hash na chave e acessa direto

Função hash simples:
  def hash_func(key, size):
      return sum(ord(c) for c in str(key)) % size

Implementação:
  class HashTable:
      def __init__(self, size=10):
          self.size = size
          self.table = [[] for _ in range(size)]

      def _hash(self, key):
          return hash(key) % self.size

      def put(self, key, value):
          idx = self._hash(key)
          # Atualiza se a chave já existe
          for i, (k, v) in enumerate(self.table[idx]):
              if k == key:
                  self.table[idx][i] = (key, value)
                  return
          self.table[idx].append((key, value))

      def get(self, key):
          idx = self._hash(key)
          for k, v in self.table[idx]:
              if k == key:
                  return v
          return None

Colisões: quando duas chaves geram o mesmo índice.
Soluções: chaining (lista encadeada) ou open addressing.

Em Python, dict É uma hash table! dict["chave"] usa hash internamente.`,
        starterCode: 'class HashTable:\n    # Implemente aqui\n    pass\n',
        solution: 'class HashTable:\n    def __init__(self):\n        self.size = 10\n        self.table = [[] for _ in range(self.size)]\n    def _hash(self, key):\n        return hash(key) % self.size\n    def put(self, key, value):\n        idx = self._hash(key)\n        for i, (k, v) in enumerate(self.table[idx]):\n            if k == key:\n                self.table[idx][i] = (key, value)\n                return\n        self.table[idx].append((key, value))\n    def get(self, key):\n        idx = self._hash(key)\n        for k, v in self.table[idx]:\n            if k == key:\n                return v\n        return None\n\nht = HashTable()\nht.put("nome", "Ana")\nprint(ht.get("nome"))',
        expectedOutput: "Ana",
        hints: ["Hash converte chave em índice", "Use lista de listas para colisões", "hash(key) % size gera o índice"],
        xpReward: 30,
      },
      {
        id: "8-8",
        title: "Árvore Binária",
        description: "Implemente uma **árvore binária de busca** com método `inserir` e percurso **in-order**.",
        theory: `Árvore Binária de Busca (BST) organiza dados de forma hierárquica. Cada nó tem no máximo 2 filhos.

Regra da BST:
  • Filho esquerdo < nó pai
  • Filho direito > nó pai

Exemplo (inserindo 5, 3, 7, 1, 4):
        5
       / \\
      3   7
     / \\
    1   4

Implementação:
  class No:
      def __init__(self, valor):
          self.valor = valor
          self.esquerda = None
          self.direita = None

  class ArvoreBST:
      def __init__(self):
          self.raiz = None

      def inserir(self, valor):
          if not self.raiz:
              self.raiz = No(valor)
          else:
              self._inserir(self.raiz, valor)

      def _inserir(self, no, valor):
          if valor < no.valor:
              if no.esquerda is None:
                  no.esquerda = No(valor)
              else:
                  self._inserir(no.esquerda, valor)
          else:
              if no.direita is None:
                  no.direita = No(valor)
              else:
                  self._inserir(no.direita, valor)

Percursos:
  In-order (esq → raiz → dir): visita em ordem crescente
  Pre-order (raiz → esq → dir): útil para copiar a árvore
  Post-order (esq → dir → raiz): útil para deletar

Complexidade: O(log n) para busca/inserção (árvore balanceada).`,
        starterCode: 'class No:\n    pass\n\nclass ArvoreBST:\n    # Implemente aqui\n    pass\n',
        solution: 'class No:\n    def __init__(self, valor):\n        self.valor = valor\n        self.esquerda = None\n        self.direita = None\n\nclass ArvoreBST:\n    def __init__(self):\n        self.raiz = None\n    def inserir(self, valor):\n        if not self.raiz:\n            self.raiz = No(valor)\n        else:\n            self._inserir(self.raiz, valor)\n    def _inserir(self, no, valor):\n        if valor < no.valor:\n            if no.esquerda is None:\n                no.esquerda = No(valor)\n            else:\n                self._inserir(no.esquerda, valor)\n        else:\n            if no.direita is None:\n                no.direita = No(valor)\n            else:\n                self._inserir(no.direita, valor)\n    def in_order(self, no):\n        if no:\n            self.in_order(no.esquerda)\n            print(no.valor, end=" ")\n            self.in_order(no.direita)\n\narv = ArvoreBST()\nfor v in [5, 3, 7, 1, 4]:\n    arv.inserir(v)\narv.in_order(arv.raiz)',
        expectedOutput: "1 3 4 5 7",
        hints: ["Menor vai para esquerda, maior para direita", "Use recursão para inserir", "In-order: esquerda → raiz → direita"],
        xpReward: 30,
      },
      {
        id: "8-9",
        title: "Lista Encadeada",
        description: "Implemente uma **lista encadeada** simples em Python com métodos `append` e `print_list`.",
        theory: `Lista Encadeada (Linked List) é uma sequência de nós onde cada nó aponta para o próximo. Diferente de arrays, os elementos NÃO ficam em posições contíguas na memória.

Estrutura:
  [dado|→] → [dado|→] → [dado|None]
   head                    tail

Nó (Node):
  class Node:
      def __init__(self, data):
          self.data = data
          self.next = None    # ponteiro para o próximo

Lista Encadeada:
  class LinkedList:
      def __init__(self):
          self.head = None

      def append(self, data):
          novo = Node(data)
          if not self.head:
              self.head = novo
              return
          atual = self.head
          while atual.next:
              atual = atual.next
          atual.next = novo

      def print_list(self):
          atual = self.head
          while atual:
              print(atual.data, end=" → ")
              atual = atual.next
          print("None")

Operações e complexidade:
  Acesso por índice: O(n) — precisa percorrer
  Inserção no início: O(1) — só muda o head!
  Inserção no final: O(n) — percorre até o final
  Remoção no início: O(1)
  Busca: O(n)

Array vs Linked List:
  Array: acesso O(1), inserção no meio O(n)
  Linked: acesso O(n), inserção no início O(1)

Variações:
  Duplamente encadeada: cada nó aponta para anterior E próximo
  Circular: o último nó aponta para o primeiro`,
        starterCode: 'class Node:\n    pass\n\nclass LinkedList:\n    # Implemente aqui\n    pass\n',
        solution: 'class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    def append(self, data):\n        novo = Node(data)\n        if not self.head:\n            self.head = novo\n            return\n        atual = self.head\n        while atual.next:\n            atual = atual.next\n        atual.next = novo\n    def print_list(self):\n        atual = self.head\n        while atual:\n            print(atual.data, end=" ")\n            atual = atual.next\n\nll = LinkedList()\nll.append(1)\nll.append(2)\nll.append(3)\nll.print_list()',
        expectedOutput: "1 2 3",
        hints: ["Cada Node tem data e next", "head aponta para o primeiro nó", "Percorra com while atual.next"],
        xpReward: 30,
      },
      {
        id: "8-10",
        title: "Merge Sort",
        description: "Implemente o **Merge Sort** em Python para ordenar `[38, 27, 43, 3, 9, 82, 10]`.",
        theory: `Merge Sort usa a estratégia "dividir para conquistar": divide a lista pela metade recursivamente, ordena cada metade e depois combina (merge).

Algoritmo:
  1. Se a lista tem 0 ou 1 elemento → já está ordenada
  2. Divida ao meio
  3. Ordene cada metade (recursão)
  4. Combine (merge) as duas metades ordenadas

Implementação:
  def merge_sort(arr):
      if len(arr) <= 1:
          return arr

      meio = len(arr) // 2
      esq = merge_sort(arr[:meio])
      dir = merge_sort(arr[meio:])
      return merge(esq, dir)

  def merge(esq, dir):
      resultado = []
      i = j = 0
      while i < len(esq) and j < len(dir):
          if esq[i] <= dir[j]:
              resultado.append(esq[i])
              i += 1
          else:
              resultado.append(dir[j])
              j += 1
      resultado.extend(esq[i:])
      resultado.extend(dir[j:])
      return resultado

Exemplo [38, 27, 43, 3]:
  [38, 27, 43, 3]
  [38, 27] [43, 3]
  [38][27] [43][3]
  [27, 38] [3, 43]    ← merge de cada par
  [3, 27, 38, 43]     ← merge final

Complexidade:
  Tempo: O(n log n) — sempre! (melhor, médio e pior caso)
  Espaço: O(n) — precisa de arrays auxiliares

Comparação:
  Bubble Sort: O(n²) — lento para listas grandes
  Merge Sort: O(n log n) — muito mais rápido
  Para 1 milhão de itens: n² = 10¹² vs n log n ≈ 2×10⁷`,
        starterCode: 'def merge_sort(arr):\n    # Implemente aqui\n    pass\n\nprint(merge_sort([38, 27, 43, 3, 9, 82, 10]))',
        solution: 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    meio = len(arr) // 2\n    esq = merge_sort(arr[:meio])\n    dir = merge_sort(arr[meio:])\n    return merge(esq, dir)\n\ndef merge(esq, dir):\n    resultado = []\n    i = j = 0\n    while i < len(esq) and j < len(dir):\n        if esq[i] <= dir[j]:\n            resultado.append(esq[i])\n            i += 1\n        else:\n            resultado.append(dir[j])\n            j += 1\n    resultado.extend(esq[i:])\n    resultado.extend(dir[j:])\n    return resultado\n\nprint(merge_sort([38, 27, 43, 3, 9, 82, 10]))',
        expectedOutput: "[3, 9, 10, 27, 38, 43, 82]",
        hints: ["Divida ao meio recursivamente", "Merge combina duas listas ordenadas", "Caso base: lista com 0 ou 1 elemento"],
        xpReward: 35,
      },
      {
        id: "8-11",
        title: "Grafos — BFS",
        description: "Implemente a **busca em largura (BFS)** em um grafo representado como dicionário de adjacência.",
        theory: `Grafos representam relações entre elementos. Cada elemento é um vértice (nó) e cada relação é uma aresta (conexão).

Representação com dicionário (lista de adjacência):
  grafo = {
      "A": ["B", "C"],
      "B": ["A", "D", "E"],
      "C": ["A", "F"],
      "D": ["B"],
      "E": ["B", "F"],
      "F": ["C", "E"]
  }

BFS (Breadth-First Search) — Busca em Largura:
  Explora todos os vizinhos de um nó ANTES de ir mais fundo.
  Usa uma FILA (queue) como estrutura auxiliar.

Implementação:
  from collections import deque

  def bfs(grafo, inicio):
      visitados = set()
      fila = deque([inicio])
      visitados.add(inicio)
      ordem = []

      while fila:
          vertice = fila.popleft()
          ordem.append(vertice)

          for vizinho in grafo[vertice]:
              if vizinho not in visitados:
                  visitados.add(vizinho)
                  fila.append(vizinho)

      return ordem

  bfs(grafo, "A")  → ["A", "B", "C", "D", "E", "F"]

BFS vs DFS:
  BFS (largura): usa Fila → encontra caminho mais curto
  DFS (profundidade): usa Pilha/Recursão → explora fundo primeiro

Usos de BFS:
  • Caminho mais curto em grafo sem peso
  • Nível de separação (ex: "6 graus de separação")
  • Verificar se grafo é conexo
  • Web crawling

Complexidade: O(V + E) onde V = vértices, E = arestas`,
        starterCode: 'from collections import deque\n\n# Implemente BFS\n',
        solution: 'from collections import deque\n\ndef bfs(grafo, inicio):\n    visitados = set()\n    fila = deque([inicio])\n    visitados.add(inicio)\n    ordem = []\n    while fila:\n        vertice = fila.popleft()\n        ordem.append(vertice)\n        for vizinho in grafo[vertice]:\n            if vizinho not in visitados:\n                visitados.add(vizinho)\n                fila.append(vizinho)\n    return ordem\n\ngrafo = {"A": ["B","C"], "B": ["A","D"], "C": ["A","D"], "D": ["B","C"]}\nprint(bfs(grafo, "A"))',
        expectedOutput: "A",
        hints: ["Use deque como fila", "set() para rastrear visitados", "popleft() remove o primeiro da fila"],
        xpReward: 35,
        quiz: [
          { question: "Qual estrutura o BFS usa?", options: ["Pilha", "Fila", "Árvore", "Hash Table"], correctIndex: 1, explanation: "BFS (busca em largura) usa uma fila (FIFO) para visitar nós nível por nível. DFS (busca em profundidade) usa uma pilha (LIFO) ou recursão para ir fundo primeiro." },
        ],
      },
    
    ],
  },
  {
    id: "9",
    title: "HTML Fundamentos",
    language: "HTML",
    emoji: "📄",
    level: "Iniciante",
    duration: "22h",
    students: 15200,
    progress: 0,
    color: "quest-yellow",
    tags: ["Novo"],
    description: "Aprenda HTML do zero — a linguagem base de toda página web. Estrutura, tags, formulários e semântica.",
    lessons: [
      {
        id: "9-1",
        title: "Estrutura Básica",
        description: "Crie a estrutura HTML básica com **DOCTYPE**, **html**, **head** (com título) e **body** com um parágrafo.",
        theory: `HTML (HyperText Markup Language) é a linguagem que estrutura toda página web. Não é uma linguagem de programação — é uma linguagem de MARCAÇÃO.

![Estrutura de uma página HTML](https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=600&h=300&fit=crop)


Estrutura básica de toda página HTML:
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Minha Página</title>
  </head>
  <body>
    <p>Conteúdo visível aqui!</p>
  </body>
  </html>

Explicando cada parte:
  <!DOCTYPE html> → diz ao navegador que é HTML5
  <html> → elemento raiz (contém tudo)
  <head> → metadados (título, charset, CSS, etc.)
  <body> → conteúdo visível da página

Tags funcionam em pares:
  <tag>conteúdo</tag>  → tag de abertura e fechamento

Algumas tags são auto-fechadas:
  <img />, <br />, <hr />, <input />

Atributos adicionam informações:
  <html lang="pt-BR">
  <meta charset="UTF-8">
  <a href="url">link</a>`,
        starterCode: '<!-- Crie a estrutura HTML -->\n',
        solution: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <title>Minha Página</title>\n</head>\n<body>\n  <p>Olá, HTML!</p>\n</body>\n</html>',
        expectedOutput: "<!DOCTYPE html>",
        hints: ["Comece com <!DOCTYPE html>", "<html> envolve tudo", "<head> para metadados, <body> para conteúdo"],
        xpReward: 10,
        quiz: [
          { question: "O que o <!DOCTYPE html> faz?", options: ["Cria um documento", "Informa que é HTML5", "Adiciona um título", "Importa CSS"], correctIndex: 1, explanation: "<!DOCTYPE html> diz ao navegador que o documento é HTML5, ativando o modo padrão de renderização. Sem ele, alguns navegadores entram em 'quirks mode' com comportamento imprevisível." },
          { question: "Onde fica o conteúdo visível da página?", options: ["<head>", "<meta>", "<body>", "<html>"], correctIndex: 2, explanation: "<body> contém todo o conteúdo visível (textos, imagens, botões). <head> contém metadados invisíveis como título, links de CSS e scripts." },
        ],
      },
      {
        id: "9-2",
        title: "Títulos e Parágrafos",
        description: "Crie um título **h1** com \"Meu Site\", um subtítulo **h2** com \"Sobre\" e um parágrafo descritivo.",
        theory: `HTML tem 6 níveis de títulos (headings) e a tag <p> para parágrafos.

Títulos — de h1 (maior) a h6 (menor):
  <h1>Título Principal</h1>     → o mais importante
  <h2>Subtítulo</h2>            → seções
  <h3>Sub-subtítulo</h3>        → subseções
  <h4>Nível 4</h4>
  <h5>Nível 5</h5>
  <h6>Nível 6</h6>              → o menor

Regras de SEO e acessibilidade:
  ✅ Use apenas UM h1 por página
  ✅ Siga a hierarquia: h1 → h2 → h3 (não pule níveis)
  ❌ Não use h1 só para deixar texto grande (use CSS)

Parágrafos:
  <p>Este é um parágrafo de texto. O navegador
  adiciona espaço automaticamente acima e abaixo.</p>

  <p>Segundo parágrafo. Cada <p> é um bloco separado.</p>

Outras tags de texto:
  <strong>negrito (importância)</strong>
  <em>itálico (ênfase)</em>
  <br> → quebra de linha (sem fechar)
  <hr> → linha horizontal separadora`,
        starterCode: '<!-- Títulos e parágrafos -->\n',
        solution: '<h1>Meu Site</h1>\n<h2>Sobre</h2>\n<p>Este é um site criado para aprender HTML.</p>',
        expectedOutput: "<h1>",
        hints: ["<h1> é o título principal", "<h2> para subtítulos", "<p> para parágrafos"],
        xpReward: 10,
      },
      {
        id: "9-3",
        title: "Links e Âncoras",
        description: "Crie um link para **https://google.com** com o texto \"Ir para o Google\" que abre em uma **nova aba**.",
        theory: `A tag <a> (âncora) cria links — a base da navegação na web!

Sintaxe:
  <a href="URL">Texto do link</a>

Exemplos:
  <a href="https://google.com">Google</a>
  <a href="/sobre">Sobre nós</a>
  <a href="#secao">Ir para seção</a>

Atributos importantes:
  href → destino do link (URL, caminho, âncora)
  target="_blank" → abre em nova aba
  rel="noopener noreferrer" → segurança com _blank
  title → tooltip ao passar o mouse

Link em nova aba (seguro):
  <a href="https://google.com"
     target="_blank"
     rel="noopener noreferrer">
    Google
  </a>

Tipos de links:
  Absoluto: https://site.com/pagina
  Relativo: /pagina, ./arquivo.html, ../outra-pasta
  Âncora: #id-do-elemento (scroll na mesma página)
  Email: mailto:email@site.com
  Telefone: tel:+5511999999999

Links para download:
  <a href="arquivo.pdf" download>Baixar PDF</a>`,
        starterCode: '<!-- Crie o link -->\n',
        solution: '<a href="https://google.com" target="_blank" rel="noopener noreferrer">Ir para o Google</a>',
        expectedOutput: '<a href=',
        hints: ["<a href=\"url\">texto</a>", "target=\"_blank\" abre em nova aba", "rel=\"noopener noreferrer\" para segurança"],
        xpReward: 15,
        quiz: [
          { question: "O que target=\"_blank\" faz?", options: ["Fecha a aba", "Abre em nova aba", "Remove o link", "Desabilita o link"], correctIndex: 1, explanation: "target=\"_blank\" abre o link em uma nova aba/janela. Sempre adicione rel=\"noopener noreferrer\" junto para segurança, pois _blank sozinho pode expor a página a ataques." },
        ],
      },
      {
        id: "9-4",
        title: "Imagens",
        description: "Adicione uma imagem com **src** apontando para \"foto.jpg\" e um texto alternativo (**alt**) descritivo.",
        theory: `A tag <img> exibe imagens na página. É uma tag auto-fechada (não tem </img>).

Sintaxe:
  <img src="caminho/imagem.jpg" alt="Descrição da imagem">

Atributos:
  src → caminho ou URL da imagem (obrigatório)
  alt → texto alternativo (obrigatório para acessibilidade!)
  width → largura em pixels
  height → altura em pixels
  loading → "lazy" para carregar sob demanda

Exemplos:
  <img src="foto.jpg" alt="Foto de paisagem">
  <img src="https://site.com/logo.png" alt="Logo da empresa">
  <img src="avatar.png" alt="Avatar do usuário" width="100" height="100">

  <!-- Lazy loading (carrega quando visível) -->
  <img src="foto.jpg" alt="Foto" loading="lazy">

Por que alt é importante:
  1. Acessibilidade — leitores de tela leem o alt
  2. SEO — buscadores indexam o alt
  3. Fallback — aparece se a imagem não carregar

Formatos de imagem:
  .jpg/.jpeg → fotos (boa compressão)
  .png → imagens com transparência
  .svg → gráficos vetoriais (escalam sem perder qualidade)
  .webp → formato moderno (menor tamanho)
  .gif → animações simples`,
        starterCode: '<!-- Adicione a imagem -->\n',
        solution: '<img src="foto.jpg" alt="Uma bela paisagem natural">',
        expectedOutput: '<img',
        hints: ["<img src=\"\" alt=\"\">", "src é o caminho da imagem", "alt descreve a imagem para acessibilidade"],
        xpReward: 15,
      },
      {
        id: "9-5",
        title: "Listas",
        description: "Crie uma **lista não-ordenada** com 3 frutas e uma **lista ordenada** com 3 passos de uma receita.",
        theory: `HTML tem dois tipos principais de listas:

Lista não-ordenada (bullets):
  <ul>
    <li>Maçã</li>
    <li>Banana</li>
    <li>Uva</li>
  </ul>

Lista ordenada (números):
  <ol>
    <li>Pré-aqueça o forno</li>
    <li>Misture os ingredientes</li>
    <li>Asse por 30 minutos</li>
  </ol>

Lista de definições:
  <dl>
    <dt>HTML</dt>
    <dd>Linguagem de marcação para web</dd>
    <dt>CSS</dt>
    <dd>Linguagem de estilização</dd>
  </dl>

Listas aninhadas:
  <ul>
    <li>Frutas
      <ul>
        <li>Maçã</li>
        <li>Banana</li>
      </ul>
    </li>
    <li>Legumes</li>
  </ul>

Atributos de <ol>:
  type="A" → letras maiúsculas (A, B, C)
  type="a" → letras minúsculas
  type="I" → números romanos
  start="5" → começa do 5
  reversed → ordem reversa`,
        starterCode: '<!-- Crie as listas -->\n',
        solution: '<ul>\n  <li>Maçã</li>\n  <li>Banana</li>\n  <li>Uva</li>\n</ul>\n<ol>\n  <li>Pré-aqueça o forno</li>\n  <li>Misture os ingredientes</li>\n  <li>Asse por 30 minutos</li>\n</ol>',
        expectedOutput: "<ul>",
        hints: ["<ul> para lista não-ordenada", "<ol> para lista ordenada", "<li> para cada item"],
        xpReward: 15,
        quiz: [
          { question: "Qual tag cria uma lista com números?", options: ["<ul>", "<ol>", "<li>", "<nl>"], correctIndex: 1, explanation: "<ol> (ordered list) cria lista numerada. <ul> (unordered list) cria lista com marcadores. <li> é o item dentro de ambas. <nl> não existe em HTML." },
        ],
      },
      {
        id: "9-6",
        title: "Tabelas",
        description: "Crie uma tabela com cabeçalho (Nome, Idade, Cidade) e **2 linhas** de dados.",
        theory: `Tabelas em HTML organizam dados em linhas e colunas.

Estrutura:
  <table>
    <thead>         → cabeçalho
      <tr>          → linha (table row)
        <th>Nome</th>    → célula de cabeçalho
        <th>Idade</th>
      </tr>
    </thead>
    <tbody>         → corpo da tabela
      <tr>
        <td>Ana</td>     → célula de dados
        <td>25</td>
      </tr>
    </tbody>
  </table>

Tags da tabela:
  <table>  → container da tabela
  <thead>  → grupo de cabeçalho
  <tbody>  → grupo do corpo
  <tfoot>  → grupo de rodapé
  <tr>     → linha (table row)
  <th>     → célula de cabeçalho (negrito e centralizado)
  <td>     → célula de dados (table data)

Mesclar células:
  colspan="2" → mescla 2 colunas
  rowspan="3" → mescla 3 linhas

  <td colspan="2">Ocupa duas colunas</td>

Dica: Use tabelas APENAS para dados tabulares. Para layout, use CSS Grid ou Flexbox!`,
        starterCode: '<!-- Crie a tabela -->\n',
        solution: '<table>\n  <thead>\n    <tr>\n      <th>Nome</th>\n      <th>Idade</th>\n      <th>Cidade</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Ana</td>\n      <td>25</td>\n      <td>São Paulo</td>\n    </tr>\n    <tr>\n      <td>Bruno</td>\n      <td>30</td>\n      <td>Rio de Janeiro</td>\n    </tr>\n  </tbody>\n</table>',
        expectedOutput: "<table>",
        hints: ["<table> contém tudo", "<tr> para linhas, <th> para cabeçalho", "<td> para dados"],
        xpReward: 20,
      },
      {
        id: "9-7",
        title: "Formulários",
        description: "Crie um formulário com campos de **nome** (text), **email** (email), e um botão de **enviar**.",
        theory: `Formulários (<form>) coletam dados do usuário — login, cadastro, pesquisa, etc.

Estrutura:
  <form action="/enviar" method="POST">
    <label for="nome">Nome:</label>
    <input type="text" id="nome" name="nome" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>

    <button type="submit">Enviar</button>
  </form>

Tipos de input:
  text     → texto livre
  email    → valida formato de email
  password → esconde caracteres
  number   → apenas números
  tel      → telefone
  date     → seletor de data
  checkbox → caixa de seleção
  radio    → escolha única (grupo)
  file     → upload de arquivo
  range    → slider
  color    → seletor de cor

Atributos úteis:
  required     → campo obrigatório
  placeholder  → texto de exemplo
  value        → valor padrão
  disabled     → desabilitado
  maxlength    → limite de caracteres
  min / max    → limites numéricos
  pattern      → regex de validação

Outros elementos de form:
  <textarea>   → texto multilinha
  <select>     → dropdown
  <option>     → opções do select`,
        starterCode: '<!-- Crie o formulário -->\n',
        solution: '<form>\n  <label for="nome">Nome:</label>\n  <input type="text" id="nome" name="nome" required>\n\n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required>\n\n  <button type="submit">Enviar</button>\n</form>',
        expectedOutput: "<form>",
        hints: ["<form> envolve todos os campos", "<input type=\"text\"> para texto", "<button type=\"submit\"> para enviar"],
        xpReward: 20,
        quiz: [
          { question: "Qual type valida formato de email?", options: ["text", "mail", "email", "address"], correctIndex: 2, explanation: "type=\"email\" faz o navegador validar automaticamente se o valor tem formato de email (com @). type=\"text\" aceita qualquer texto sem validação." },
          { question: "O que o atributo 'required' faz?", options: ["Desabilita o campo", "Torna obrigatório", "Adiciona placeholder", "Limita caracteres"], correctIndex: 1, explanation: "required impede o formulário de ser enviado se o campo estiver vazio. É uma validação do HTML — sempre combine com validação no servidor para segurança." },
        ],
      },
      {
        id: "9-8",
        title: "HTML Semântico",
        description: "Estruture uma página usando tags semânticas: **header**, **nav**, **main**, **section**, **article** e **footer**.",
        theory: `HTML semântico usa tags que descrevem o SIGNIFICADO do conteúdo, não apenas sua aparência.

Tags semânticas:
  <header>  → cabeçalho da página ou seção
  <nav>     → navegação (menu, links)
  <main>    → conteúdo principal (único por página)
  <section> → seção temática
  <article> → conteúdo independente (post, notícia)
  <aside>   → conteúdo lateral (sidebar)
  <footer>  → rodapé

Exemplo completo:
  <header>
    <h1>Meu Blog</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/sobre">Sobre</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>Posts Recentes</h2>
      <article>
        <h3>Aprendendo HTML</h3>
        <p>HTML é a base da web...</p>
      </article>
    </section>
  </main>

  <footer>
    <p>© 2024 Meu Blog</p>
  </footer>

Por que usar semântica?
  1. Acessibilidade — leitores de tela entendem a estrutura
  2. SEO — Google valoriza HTML semântico
  3. Manutenção — código mais legível

❌ Evite: <div> para tudo (div soup)
✅ Prefira: tags semânticas quando possível`,
        starterCode: '<!-- Use tags semânticas -->\n',
        solution: '<header>\n  <h1>Meu Site</h1>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/sobre">Sobre</a>\n  </nav>\n</header>\n<main>\n  <section>\n    <h2>Bem-vindo</h2>\n    <article>\n      <h3>Primeiro Post</h3>\n      <p>Conteúdo do post aqui.</p>\n    </article>\n  </section>\n</main>\n<footer>\n  <p>© 2024</p>\n</footer>',
        expectedOutput: "<header>",
        hints: ["<header> para o topo da página", "<main> para conteúdo principal", "<footer> para o rodapé"],
        xpReward: 20,
        quiz: [
          { question: "Quantas tags <main> devem existir por página?", options: ["Nenhuma", "Uma", "Quantas quiser", "Duas"], correctIndex: 1, explanation: "Deve existir apenas uma <main> por página. Ela representa o conteúdo principal e único da página, diferente do que se repete (header, nav, footer)." },
          { question: "Qual tag é usada para navegação?", options: ["<menu>", "<links>", "<nav>", "<navigate>"], correctIndex: 2, explanation: "<nav> é a tag semântica para blocos de navegação (menus, breadcrumbs). Ajuda leitores de tela e mecanismos de busca a entenderem a estrutura da página." },
        ],
      },
      {
        id: "9-9",
        title: "Acessibilidade (A11Y)",
        description: "Melhore a acessibilidade de um botão e uma imagem usando **atributos ARIA** e boas práticas de HTML acessível.",
        theory: `Acessibilidade (A11Y) garante que TODOS possam usar seu site — incluindo pessoas com deficiência visual, motora ou cognitiva.

Princípios WCAG:
  Perceptível → conteúdo visível/audível para todos
  Operável → navegável por teclado
  Compreensível → linguagem clara
  Robusto → funciona em tecnologias assistivas

Atributos ARIA:
  role → define o papel do elemento
    <div role="button">Clique</div>
    <div role="navigation">Menu</div>
    <div role="alert">Erro!</div>

  aria-label → nome acessível (quando texto visual não basta)
    <button aria-label="Fechar menu">✕</button>
    <input aria-label="Buscar produtos">

  aria-hidden → esconde de leitores de tela
    <span aria-hidden="true">🎨</span>  → decorativo

  aria-expanded → estado de menus/accordions
    <button aria-expanded="false">Menu</button>

  aria-live → anuncia mudanças dinâmicas
    <div aria-live="polite">3 resultados encontrados</div>

Boas práticas:
  ✅ Toda imagem tem alt descritivo (ou alt="" se decorativa)
  ✅ Formulários têm <label> associado ao <input>
  ✅ Contraste mínimo 4.5:1 (texto normal)
  ✅ Site 100% navegável por teclado (Tab, Enter, Esc)
  ✅ Foco visível em elementos interativos
  ✅ Textos de links descritivos ("Ler artigo" em vez de "Clique aqui")

  ❌ Não use só cor para comunicar informação
  ❌ Não remova outline de foco sem alternativa
  ❌ Não use tabindex > 0`,
        starterCode: '<!-- Melhore a acessibilidade -->\n',
        solution: '<button aria-label="Fechar modal" type="button">\n  <span aria-hidden="true">✕</span>\n</button>\n<img src="foto.jpg" alt="Equipe de desenvolvedores trabalhando em laptops">',
        expectedOutput: "aria-label",
        hints: ["aria-label dá nome acessível", "aria-hidden esconde decorações", "alt descreve a imagem"],
        xpReward: 20,
        quiz: [
          { question: "O que aria-hidden='true' faz?", options: ["Esconde visualmente", "Esconde de leitores de tela", "Remove o elemento", "Desabilita o elemento"], correctIndex: 1, explanation: "aria-hidden='true' torna o elemento invisível para leitores de tela, mas continua visualmente na tela. Usado em ícones decorativos que não agregam informação." },
        ],
      },
      {
        id: "9-10",
        title: "Meta Tags e SEO",
        description: "Crie um `<head>` completo com meta tags de **SEO**: charset, viewport, description, Open Graph e favicon.",
        theory: `Meta tags no <head> fornecem informações sobre a página para navegadores, buscadores e redes sociais.

Meta tags essenciais:
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Aprenda programação de forma gamificada">
    <meta name="keywords" content="programação, cursos, código">
    <meta name="author" content="Code Bloom Studio">
    <title>Code Bloom Studio — Aprenda Programação</title>
    <link rel="icon" href="/favicon.ico">
  </head>

Open Graph (como aparece no Facebook/LinkedIn):
  <meta property="og:title" content="Code Bloom Studio">
  <meta property="og:description" content="Plataforma gamificada de programação">
  <meta property="og:image" content="https://site.com/preview.jpg">
  <meta property="og:url" content="https://site.com">
  <meta property="og:type" content="website">

Twitter Card:
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Code Bloom Studio">
  <meta name="twitter:image" content="https://site.com/preview.jpg">

SEO on-page:
  ✅ Título com palavra-chave (< 60 caracteres)
  ✅ Meta description persuasiva (< 160 caracteres)
  ✅ UM h1 por página com keyword
  ✅ URLs amigáveis: /cursos/python (não /p?id=123)
  ✅ Imagens com alt text
  ✅ Site rápido (Core Web Vitals)
  ✅ Responsivo (mobile-friendly)
  ✅ HTTPS

Viewport — essencial para mobile:
  width=device-width → largura = tela do dispositivo
  initial-scale=1.0 → zoom inicial 100%`,
        starterCode: '<!-- Crie o head com meta tags -->\n',
        solution: '<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <meta name="description" content="Aprenda programação de forma gamificada com Code Bloom Studio">\n  <meta property="og:title" content="Code Bloom Studio">\n  <meta property="og:description" content="Plataforma gamificada de programação">\n  <meta property="og:image" content="https://code-bloom-studio.com/preview.jpg">\n  <title>Code Bloom Studio — Aprenda Programação</title>\n  <link rel="icon" href="/favicon.ico">\n</head>',
        expectedOutput: "<meta",
        hints: ["charset e viewport são obrigatórios", "description ajuda no Google", "Open Graph controla preview em redes sociais"],
        xpReward: 20,
      },
      {
        id: "9-11",
        title: "Multimídia HTML",
        description: "Adicione um **áudio** e um **vídeo** nativos com controles e uma mensagem de fallback.",
        theory: `HTML5 suporta áudio e vídeo nativamente, sem precisar de plugins como Flash!

Elemento <video>:
  <video controls width="640" height="360">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    Seu navegador não suporta vídeo.
  </video>

Atributos de video:
  controls   → exibe controles (play, pause, volume)
  autoplay   → inicia automaticamente (evite!)
  muted      → inicia sem som (necessário para autoplay)
  loop       → repete infinitamente
  poster     → imagem de preview antes de reproduzir
  preload    → none | metadata | auto

  <video controls poster="thumb.jpg" preload="metadata">
    <source src="video.mp4" type="video/mp4">
  </video>

Elemento <audio>:
  <audio controls>
    <source src="musica.mp3" type="audio/mpeg">
    <source src="musica.ogg" type="audio/ogg">
    Seu navegador não suporta áudio.
  </audio>

Elemento <iframe> — incorporar conteúdo externo:
  <iframe
    src="https://www.youtube.com/embed/VIDEO_ID"
    width="560" height="315"
    title="Título do vídeo"
    allowfullscreen>
  </iframe>

Formatos suportados:
  Vídeo: .mp4 (H.264), .webm (VP9), .ogg
  Áudio: .mp3, .ogg (Vorbis), .wav, .aac

Legendas:
  <video controls>
    <source src="video.mp4" type="video/mp4">
    <track src="legenda.vtt" kind="subtitles" srclang="pt" label="Português">
  </video>

Dica: Forneça múltiplos formatos com <source> para máxima compatibilidade!`,
        starterCode: '<!-- Adicione áudio e vídeo -->\n',
        solution: '<video controls width="640" poster="thumb.jpg">\n  <source src="video.mp4" type="video/mp4">\n  Seu navegador não suporta vídeo.\n</video>\n\n<audio controls>\n  <source src="musica.mp3" type="audio/mpeg">\n  Seu navegador não suporta áudio.\n</audio>',
        expectedOutput: "<video",
        hints: ["<video controls> com <source> dentro", "<audio controls> para áudio", "Mensagem de fallback entre as tags"],
        xpReward: 20,
        quiz: [
          { question: "Para que serve o atributo poster em <video>?", options: ["Define a legenda", "Imagem de preview", "Define o formato", "Silencia o vídeo"], correctIndex: 1, explanation: "poster define a imagem mostrada antes do vídeo começar a tocar (thumbnail). Sem ele, o navegador exibe o primeiro frame ou uma área vazia." },
        ],
      },
    
    ],
  },
  createReactNativeCourse(),
  createDataAiCourse(),
  createGameDevCourse(),
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

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}

export function getLessonById(courseId: string, lessonId: string): { course: Course; lesson: Lesson; lessonIndex: number } | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
  if (lessonIndex === -1) return undefined;
  return { course, lesson: course.lessons[lessonIndex], lessonIndex };
}
