/**
 * Mini-guided projects.
 *
 * A "project" is a higher-level lesson made of numbered steps. Each step has
 * its own starter code, expected output and hints — the student gets feedback
 * after each step instead of only at the end.
 */

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  expectedOutput: string;
  hints: string[];
  /** Concept tags surfaced in the final summary */
  concepts: string[];
}

export interface Project {
  id: string;
  courseId: string;
  title: string;
  emoji: string;
  language: string;
  goal: string;
  description: string;
  xpReward: number;
  /** Concept summary shown at the end of the project */
  summary: string[];
  steps: ProjectStep[];
}

interface ProjectBlueprint {
  id: string;
  courseId: string;
  title: string;
  emoji: string;
  language: string;
  theme: string;
  goal: string;
  description: string;
  xpReward?: number;
  summary: string[];
}

function buildProjectSteps(language: string, theme: string): ProjectStep[] {
  if (language === "Python") {
    return [
      {
        id: "step-1",
        title: "Etapa 1 — Guarde o tema",
        description: `Crie uma variável \`tema\` com o valor \`"${theme}"\` e exiba no console.`,
        starterCode: "# Crie a variável tema aqui\n\n",
        solution: `tema = "${theme}"\nprint(tema)`,
        expectedOutput: theme,
        hints: ["Use uma variável chamada `tema`.", "Passe `tema` para print()."],
        concepts: ["variáveis", "print"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Crie uma função de resumo",
        description: "Crie uma função `resumo(tema)` que retorna `Projeto: [tema]` e imprima o resultado.",
        starterCode: `tema = "${theme}"\n# Crie a função resumo aqui\n`,
        solution: `tema = "${theme}"\n\ndef resumo(tema):\n    return f"Projeto: {tema}"\n\nprint(resumo(tema))`,
        expectedOutput: `Projeto: ${theme}`,
        hints: ["Comece com `def resumo(tema):`.", "Use `return` para devolver a string."],
        concepts: ["funções", "return", "f-strings"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Conte tarefas",
        description: "Crie uma lista com três tarefas do projeto e exiba `3 tarefas`.",
        starterCode: "# Crie a lista de tarefas\n\n",
        solution: 'tarefas = ["planejar", "construir", "testar"]\nprint(f"{len(tarefas)} tarefas")',
        expectedOutput: "3 tarefas",
        hints: ["Use uma lista com três textos.", "Use `len(tarefas)` para contar."],
        concepts: ["listas", "len", "f-strings"],
      },
    ];
  }

  if (language === "JavaScript") {
    return [
      {
        id: "step-1",
        title: "Etapa 1 — Declare o nome",
        description: `Crie uma constante \`nome\` com o valor \`"${theme}"\` e exiba com console.log().`,
        starterCode: "// Declare o nome do projeto\n",
        solution: `const nome = "${theme}";\nconsole.log(nome);`,
        expectedOutput: theme,
        hints: ["Use `const nome = ...`.", "Use `console.log(nome)`."],
        concepts: ["const", "console.log"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Monte um objeto",
        description: "Crie um objeto com `nome` e `status`, depois exiba `nome: ativo`.",
        starterCode: `const nome = "${theme}";\n// Crie o objeto aqui\n`,
        solution: `const project = { nome: "${theme}", status: "ativo" };\nconsole.log(project.nome + ": " + project.status);`,
        expectedOutput: `${theme}: ativo`,
        hints: ["Use chaves `{}` para criar o objeto.", "Acesse valores com `project.nome`."],
        concepts: ["objetos", "propriedades"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Conte tarefas",
        description: "Crie um array com três tarefas e exiba `3 tarefas`.",
        starterCode: "// Crie o array de tarefas\n",
        solution: 'const tarefas = ["planejar", "construir", "testar"];\nconsole.log(`${tarefas.length} tarefas`);',
        expectedOutput: "3 tarefas",
        hints: ["Arrays usam colchetes `[]`.", "Use `.length` para contar itens."],
        concepts: ["arrays", "length", "template literals"],
      },
    ];
  }

  if (language === "React") {
    return [
      {
        id: "step-1",
        title: "Etapa 1 — Componente base",
        description: `Crie um componente que renderiza \`<h1>${theme}</h1>\`.`,
        starterCode: "// Crie o componente aqui\n",
        solution: `function Projeto() {\n  return <h1>${theme}</h1>;\n}\n\nexport default Projeto;`,
        expectedOutput: `<h1>${theme}</h1>`,
        hints: ["Componentes React são funções.", "Retorne um elemento JSX."],
        concepts: ["componentes", "JSX"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Use props",
        description: "Adapte o componente para receber uma prop `titulo`.",
        starterCode: "function Projeto() {\n  return <h1></h1>;\n}\n",
        solution: "function Projeto({ titulo }) {\n  return <h1>{titulo}</h1>;\n}",
        expectedOutput: "titulo",
        hints: ["Receba `{ titulo }` nos parâmetros.", "Use `{titulo}` dentro do JSX."],
        concepts: ["props", "renderização"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Estado simples",
        description: "Adicione um estado chamado `concluido` usando `useState`.",
        starterCode: 'import { useState } from "react";\n\nfunction Projeto() {\n  // Crie o estado aqui\n}\n',
        solution: 'import { useState } from "react";\n\nfunction Projeto() {\n  const [concluido, setConcluido] = useState(false);\n  return <button onClick={() => setConcluido(true)}>{concluido ? "Feito" : "Fazer"}</button>;\n}',
        expectedOutput: "useState",
        hints: ["Importe `useState` de React.", "Crie `[concluido, setConcluido]`."],
        concepts: ["estado", "eventos"],
      },
    ];
  }

  if (language === "CSS") {
    return [
      {
        id: "step-1",
        title: "Etapa 1 — Cartão flexível",
        description: "Crie uma classe `.card` com `display: flex`.",
        starterCode: ".card {\n  /* organize o layout */\n}\n",
        solution: ".card {\n  display: flex;\n  gap: 16px;\n}",
        expectedOutput: "display: flex",
        hints: ["A propriedade principal é `display`.", "O valor precisa ser `flex`."],
        concepts: ["flexbox", "layout"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Grade responsiva",
        description: "Crie uma `.grid` com colunas responsivas usando `grid-template-columns`.",
        starterCode: ".grid {\n  display: grid;\n}\n",
        solution: ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n}",
        expectedOutput: "grid-template-columns",
        hints: ["Use CSS Grid.", "A propriedade procurada controla as colunas."],
        concepts: ["grid", "responsividade"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Movimento suave",
        description: "Adicione uma transição suave ao hover do cartão.",
        starterCode: ".card {\n  /* transição */\n}\n.card:hover {\n  /* estado */\n}\n",
        solution: ".card {\n  transition: transform 0.2s ease;\n}\n.card:hover {\n  transform: translateY(-4px);\n}",
        expectedOutput: "transition",
        hints: ["Use `transition` no estado normal.", "No hover, mude `transform`."],
        concepts: ["transições", "hover"],
      },
    ];
  }

  if (language === "Node.js") {
    return [
      {
        id: "step-1",
        title: "Etapa 1 — Servidor HTTP",
        description: "Crie um servidor básico usando `http.createServer`.",
        starterCode: 'const http = require("http");\n// Crie o servidor\n',
        solution: 'const http = require("http");\nconst server = http.createServer((req, res) => {\n  res.end("ok");\n});',
        expectedOutput: "http.createServer",
        hints: ["Importe `http`.", "Use `http.createServer()`."],
        concepts: ["http", "servidor"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Rota principal",
        description: "Adicione uma resposta para a rota principal com `res.end`.",
        starterCode: 'const http = require("http");\nconst server = http.createServer((req, res) => {\n  // responda aqui\n});\n',
        solution: 'const http = require("http");\nconst server = http.createServer((req, res) => {\n  res.end("API ativa");\n});',
        expectedOutput: "API ativa",
        hints: ["Use `res.end()`.", "A resposta deve conter o texto esperado."],
        concepts: ["request", "response"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Porta",
        description: "Faça o servidor escutar na porta 3000.",
        starterCode: "// Complete com listen\n",
        solution: 'server.listen(3000, () => console.log("Servidor na porta 3000"));',
        expectedOutput: "listen(3000",
        hints: ["Use `.listen()`.", "A porta pedida é 3000."],
        concepts: ["listen", "porta"],
      },
    ];
  }

  if (language === "SQL") {
    return [
      {
        id: "step-1",
        title: "Etapa 1 — Liste registros",
        description: "Busque todos os registros da tabela `tarefas`.",
        starterCode: "-- Escreva a consulta\n",
        solution: "SELECT * FROM tarefas;",
        expectedOutput: "SELECT * FROM tarefas;",
        hints: ["Use `SELECT *`.", "A tabela se chama `tarefas`."],
        concepts: ["SELECT", "FROM"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Filtre pendentes",
        description: "Filtre tarefas com status pendente usando WHERE.",
        starterCode: "SELECT * FROM tarefas\n-- adicione o filtro\n",
        solution: "SELECT * FROM tarefas WHERE status = 'pendente';",
        expectedOutput: "WHERE status",
        hints: ["Use `WHERE`.", "Compare a coluna `status`."],
        concepts: ["WHERE", "filtros"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Ordene por data",
        description: "Ordene as tarefas pela coluna `criado_em` em ordem decrescente.",
        starterCode: "SELECT * FROM tarefas\n-- ordene aqui\n",
        solution: "SELECT * FROM tarefas ORDER BY criado_em DESC;",
        expectedOutput: "ORDER BY",
        hints: ["Use `ORDER BY`.", "`DESC` deixa os mais recentes primeiro."],
        concepts: ["ORDER BY", "DESC"],
      },
    ];
  }

  if (language === "Git") {
    return [
      {
        id: "step-1",
        title: "Etapa 1 — Inicie o repositório",
        description: "Escreva o comando para iniciar um repositório Git.",
        starterCode: "# Comando Git\n",
        solution: "git init",
        expectedOutput: "git init",
        hints: ["O comando começa com `git`.", "Use `init` para iniciar."],
        concepts: ["git init", "repositório"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Crie uma branch",
        description: "Crie e entre em uma branch chamada `projeto`.",
        starterCode: "# Comando de branch\n",
        solution: "git checkout -b projeto",
        expectedOutput: "checkout -b",
        hints: ["Use `checkout` com `-b`.", "O nome da branch é `projeto`."],
        concepts: ["branch", "checkout"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Faça um commit",
        description: "Escreva um comando de commit com mensagem.",
        starterCode: "# Comando de commit\n",
        solution: 'git commit -m "inicia projeto"',
        expectedOutput: "git commit -m",
        hints: ["Use `git commit`.", "A mensagem vem depois de `-m`."],
        concepts: ["commit", "mensagem"],
      },
    ];
  }

  if (language === "HTML") {
    return [
      {
        id: "step-1",
        title: "Etapa 1 — Estrutura semântica",
        description: "Crie uma `<section>` para o projeto.",
        starterCode: "<!-- Crie a seção -->\n",
        solution: `<section>\n  <h1>${theme}</h1>\n</section>`,
        expectedOutput: "<section>",
        hints: ["Use tag semântica.", "A tag pedida é `section`."],
        concepts: ["semântica", "section"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Título principal",
        description: "Adicione um `<h1>` com o nome do projeto.",
        starterCode: "<section>\n  <!-- título -->\n</section>\n",
        solution: `<section>\n  <h1>${theme}</h1>\n</section>`,
        expectedOutput: "<h1>",
        hints: ["Use uma tag de título.", "O título principal é `h1`."],
        concepts: ["hierarquia", "h1"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Ação",
        description: "Adicione um link de ação com `href`.",
        starterCode: "<section>\n  <h1>Projeto</h1>\n  <!-- link -->\n</section>\n",
        solution: '<a href="/projetos">Ver projetos</a>',
        expectedOutput: "<a href=",
        hints: ["Links usam a tag `a`.", "O destino fica no atributo `href`."],
        concepts: ["links", "atributos"],
      },
    ];
  }

  if (language === "Lógica básica") {
    return [
      {
        id: "step-1",
        title: "Etapa 1 — Defina o problema",
        description: "Escreva uma saída que descreve o problema do projeto.",
        starterCode: "# Descreva o problema\n",
        solution: `print("${theme}")`,
        expectedOutput: theme,
        hints: ["Comece entendendo o objetivo.", "Use print() para mostrar o tema."],
        concepts: ["problema", "objetivo"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Separe entrada e saída",
        description: "Crie variáveis `entrada` e `saida`, depois mostre a saída.",
        starterCode: "# Crie entrada e saída\n",
        solution: 'entrada = "dados"\nsaida = "resultado"\nprint(saida)',
        expectedOutput: "resultado",
        hints: ["Entrada é o que chega ao programa.", "Saída é o que ele devolve."],
        concepts: ["entrada", "saída"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Organize passos",
        description: "Crie uma lista com três passos e mostre a quantidade.",
        starterCode: "# Liste os passos\n",
        solution: 'passos = ["entender", "resolver", "testar"]\nprint(len(passos))',
        expectedOutput: "3",
        hints: ["Use uma lista com três itens.", "Use len(passos)."],
        concepts: ["passos", "lista", "decomposição"],
      },
    ];
  }

  if (language === "React Native") {
    return [
      {
        id: "step-1",
        title: "Etapa 1 — Componente mobile",
        description: "Crie uma `View` com um `Text` para o projeto.",
        starterCode: 'import { View, Text } from "react-native";\n\n',
        solution: `function Projeto() {\n  return <View><Text>${theme}</Text></View>;\n}`,
        expectedOutput: "Text",
        hints: ["Use View como container.", "Use Text para texto."],
        concepts: ["View", "Text", "JSX"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Estilo base",
        description: "Crie um StyleSheet para organizar o container.",
        starterCode: 'import { StyleSheet } from "react-native";\n\n',
        solution: "const styles = StyleSheet.create({\n  container: {\n    padding: 16,\n  },\n});",
        expectedOutput: "StyleSheet.create",
        hints: ["Use StyleSheet.create().", "Crie a chave container."],
        concepts: ["StyleSheet", "estilos"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Interação",
        description: "Use `onPress` para representar uma ação do usuário.",
        starterCode: 'import { Button } from "react-native";\n\n',
        solution: '<Button title="Continuar" onPress={() => console.log("ok")} />',
        expectedOutput: "onPress",
        hints: ["Button usa onPress.", "A ação pode chamar uma função."],
        concepts: ["eventos", "onPress"],
      },
    ];
  }

  return [
    {
      id: "step-1",
      title: "Etapa 1 — Defina entrada",
      description: "Escreva uma variável ou anotação com a entrada do problema.",
      starterCode: "# Defina a entrada\n",
      solution: "entrada = [3, 1, 2]\nprint(entrada)",
      expectedOutput: "[3, 1, 2]",
      hints: ["Pense nos dados antes do algoritmo.", "Use uma lista simples."],
      concepts: ["entrada", "representação"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Descreva os passos",
      description: "Escreva uma função chamada `resolver`.",
      starterCode: "# Crie a função resolver\n",
      solution: "def resolver(valores):\n    return sorted(valores)\n\nprint(resolver([3, 1, 2]))",
      expectedOutput: "[1, 2, 3]",
      hints: ["Comece com `def resolver(valores):`.", "Retorne uma resposta transformada."],
      concepts: ["função", "transformação"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Analise complexidade",
      description: "Informe a complexidade esperada usando notação Big O.",
      starterCode: "# Escreva a complexidade\n",
      solution: "print('O(n log n)')",
      expectedOutput: "O(n log n)",
      hints: ["Ordenações comuns custam `n log n`.", "Use a notação com O maiúsculo."],
      concepts: ["Big O", "complexidade"],
    },
  ];
}

const projectBlueprints: ProjectBlueprint[] = [
  { id: "proj-py-expense-cli", courseId: "1", title: "Controle de Gastos CLI", emoji: "💰", language: "Python", theme: "Controle de Gastos", goal: "Criar um programa de terminal para registrar gastos e mostrar um resumo simples.", description: "Pratique variáveis, funções e listas simulando um controle financeiro em etapas curtas.", summary: ["Variáveis", "Funções", "Listas", "Resumo no terminal"] },
  { id: "proj-py-habit-tracker", courseId: "1", title: "Rastreador de Hábitos", emoji: "✅", language: "Python", theme: "Rastreador de Hábitos", goal: "Montar uma base para acompanhar hábitos diários e contar tarefas concluídas.", description: "Use estruturas simples para representar hábitos, contar itens e exibir progresso.", summary: ["Listas", "Contagem", "Funções", "Saída formatada"] },
  { id: "proj-py-quiz-maker", courseId: "1", title: "Gerador de Quiz", emoji: "🧠", language: "Python", theme: "Gerador de Quiz", goal: "Criar a base de um quiz de perguntas e respostas no terminal.", description: "Modele perguntas, conte etapas e organize a lógica inicial de um jogo de quiz.", summary: ["Strings", "Listas", "Funções", "Validação"] },
  { id: "proj-py-file-inventory", courseId: "1", title: "Inventário Simples", emoji: "📦", language: "Python", theme: "Inventário Simples", goal: "Organizar produtos e preparar um resumo de estoque.", description: "Construa pequenas partes de um inventário usando listas e funções.", summary: ["Coleções", "Funções", "Relatórios", "Terminal"] },
  { id: "proj-py-password-checker", courseId: "1", title: "Validador de Senhas", emoji: "🔐", language: "Python", theme: "Validador de Senhas", goal: "Criar uma lógica inicial para avaliar força de senha.", description: "Pratique funções e regras simples para transformar requisitos em código.", summary: ["Funções", "Condições", "Strings", "Regras"] },

  { id: "proj-js-todo-core", courseId: "2", title: "To-do no Console", emoji: "📝", language: "JavaScript", theme: "To-do no Console", goal: "Criar a lógica base de uma lista de tarefas.", description: "Pratique constantes, objetos e arrays com um app de tarefas em mini etapas.", summary: ["const", "Objetos", "Arrays", "Template literals"] },
  { id: "proj-js-cart-total", courseId: "2", title: "Carrinho de Compras", emoji: "🛒", language: "JavaScript", theme: "Carrinho de Compras", goal: "Calcular itens e preparar o total de um carrinho simples.", description: "Junte objetos, arrays e contagem para simular um fluxo de compra.", summary: ["Objetos", "Arrays", "Operadores", "Saída"] },
  { id: "proj-js-scoreboard", courseId: "2", title: "Placar de Jogo", emoji: "🎮", language: "JavaScript", theme: "Placar de Jogo", goal: "Criar uma lógica de placar para jogos e quizzes.", description: "Modele dados de pontuação e exiba status do jogador.", summary: ["Variáveis", "Objetos", "Arrays", "Estado"] },
  { id: "proj-js-weather-card", courseId: "2", title: "Card de Clima", emoji: "🌤️", language: "JavaScript", theme: "Card de Clima", goal: "Preparar dados para um cartão de previsão do tempo.", description: "Organize valores de clima e gere uma saída pronta para interface.", summary: ["Objetos", "Strings", "Arrays", "Formatação"] },
  { id: "proj-js-form-validator", courseId: "2", title: "Validador de Formulário", emoji: "📋", language: "JavaScript", theme: "Validador de Formulário", goal: "Criar regras iniciais para validar campos de formulário.", description: "Transforme requisitos de formulário em objetos e mensagens de estado.", summary: ["Objetos", "Condições", "Validação", "Mensagens"] },

  { id: "proj-react-profile-card", courseId: "3", title: "Card de Perfil", emoji: "👤", language: "React", theme: "Card de Perfil", goal: "Criar um componente reutilizável para mostrar informações de usuário.", description: "Pratique JSX, props e estado com um cartão de perfil.", summary: ["Componentes", "JSX", "Props", "Estado"] },
  { id: "proj-react-course-card", courseId: "3", title: "Card de Curso", emoji: "🎓", language: "React", theme: "Card de Curso", goal: "Montar um componente visual para cursos com título e ação.", description: "Crie uma peça de interface parecida com os cartões do app.", summary: ["Componentes", "Props", "Eventos", "UI"] },
  { id: "proj-react-tabs", courseId: "3", title: "Abas Interativas", emoji: "🗂️", language: "React", theme: "Abas Interativas", goal: "Criar o esqueleto de abas com estado local.", description: "Use estado para representar a aba ativa em um componente.", summary: ["useState", "Eventos", "Renderização condicional", "Componentes"] },
  { id: "proj-react-counter-widget", courseId: "3", title: "Widget de Contador", emoji: "🔢", language: "React", theme: "Widget de Contador", goal: "Criar um componente com botão e estado para contagem.", description: "Aplique estado e eventos para controlar uma pequena interação.", summary: ["useState", "onClick", "Estado", "JSX"] },
  { id: "proj-react-feedback-box", courseId: "3", title: "Caixa de Feedback", emoji: "💬", language: "React", theme: "Caixa de Feedback", goal: "Criar um componente para mensagens de sucesso, erro e aviso.", description: "Organize dados e estados visuais para feedback de interface.", summary: ["Props", "Estado", "Componentes", "Feedback"] },

  { id: "proj-css-pricing-grid", courseId: "4", title: "Grid de Preços", emoji: "💳", language: "CSS", theme: "Grid de Preços", goal: "Criar o layout de uma seção de preços responsiva.", description: "Pratique Flexbox, Grid e transições em cartões de preço.", summary: ["Flexbox", "Grid", "Hover", "Responsividade"] },
  { id: "proj-css-dashboard-cards", courseId: "4", title: "Cards de Dashboard", emoji: "📊", language: "CSS", theme: "Cards de Dashboard", goal: "Estilizar cartões de métricas para painel administrativo.", description: "Monte uma base visual para cards densos e responsivos.", summary: ["Layout", "Grid", "Transições", "UI"] },
  { id: "proj-css-landing-hero", courseId: "4", title: "Hero Responsivo", emoji: "🚀", language: "CSS", theme: "Hero Responsivo", goal: "Criar a base visual de um hero moderno e responsivo.", description: "Use regras de layout para adaptar uma seção inicial.", summary: ["Responsividade", "Flexbox", "Spacing", "Hover"] },
  { id: "proj-css-navbar", courseId: "4", title: "Navbar Adaptável", emoji: "🧭", language: "CSS", theme: "Navbar Adaptável", goal: "Construir estilos para uma navegação organizada.", description: "Pratique alinhamento, espaçamento e estados de interação.", summary: ["Flexbox", "Hover", "Transição", "Navegação"] },
  { id: "proj-css-gallery", courseId: "4", title: "Galeria Responsiva", emoji: "🖼️", language: "CSS", theme: "Galeria Responsiva", goal: "Criar uma grade de imagens adaptável a diferentes telas.", description: "Aplique Grid e transições em uma galeria simples.", summary: ["CSS Grid", "Responsividade", "Hover", "Cards"] },

  { id: "proj-node-health-api", courseId: "5", title: "API de Health Check", emoji: "🟢", language: "Node.js", theme: "API de Health Check", goal: "Criar a base de uma API que responde se o serviço está ativo.", description: "Pratique servidor HTTP, resposta e porta usando Node.js.", summary: ["HTTP", "Servidor", "Resposta", "Porta"] },
  { id: "proj-node-notes-api", courseId: "5", title: "API de Notas", emoji: "🗒️", language: "Node.js", theme: "API de Notas", goal: "Preparar uma API simples para listar notas.", description: "Construa a base de servidor e resposta para dados de notas.", summary: ["HTTP", "Rotas", "JSON", "listen"] },
  { id: "proj-node-task-api", courseId: "5", title: "API de Tarefas", emoji: "📌", language: "Node.js", theme: "API de Tarefas", goal: "Montar a base para uma API de tarefas.", description: "Modele a estrutura inicial de um backend com resposta textual.", summary: ["Servidor", "Rotas", "Response", "Porta"] },
  { id: "proj-node-webhook", courseId: "5", title: "Webhook Simples", emoji: "🔔", language: "Node.js", theme: "Webhook Simples", goal: "Criar a base de um endpoint para receber eventos.", description: "Pratique o ciclo de request/response com um caso real de webhook.", summary: ["Request", "Response", "Eventos", "HTTP"] },
  { id: "proj-node-auth-start", courseId: "5", title: "Base de Autenticação", emoji: "🛡️", language: "Node.js", theme: "Base de Autenticação", goal: "Preparar a estrutura inicial de uma API de login.", description: "Construa passos pequenos para organizar um backend de autenticação.", summary: ["HTTP", "Rotas", "Segurança", "Servidor"] },

  { id: "proj-sql-library", courseId: "6", title: "Consulta de Biblioteca", emoji: "📚", language: "SQL", theme: "Consulta de Biblioteca", goal: "Criar consultas para listar e filtrar livros.", description: "Pratique SELECT, WHERE e ORDER BY com dados de biblioteca.", summary: ["SELECT", "WHERE", "ORDER BY", "Filtros"] },
  { id: "proj-sql-sales-report", courseId: "6", title: "Relatório de Vendas", emoji: "🧾", language: "SQL", theme: "Relatório de Vendas", goal: "Preparar consultas para visualizar vendas recentes.", description: "Organize dados com filtros e ordenação para relatórios.", summary: ["Consultas", "Filtros", "Ordenação", "Relatórios"] },
  { id: "proj-sql-student-grade", courseId: "6", title: "Notas de Alunos", emoji: "🧑‍🎓", language: "SQL", theme: "Notas de Alunos", goal: "Consultar registros de alunos e ordenar resultados.", description: "Pratique comandos fundamentais de leitura em banco de dados.", summary: ["SELECT", "WHERE", "ORDER BY", "Dados"] },
  { id: "proj-sql-inventory", courseId: "6", title: "Estoque de Produtos", emoji: "🏷️", language: "SQL", theme: "Estoque de Produtos", goal: "Buscar produtos e priorizar itens por data.", description: "Monte consultas para visualizar dados de estoque.", summary: ["Tabelas", "Filtros", "Ordenação", "Relatórios"] },
  { id: "proj-sql-support-tickets", courseId: "6", title: "Tickets de Suporte", emoji: "🎫", language: "SQL", theme: "Tickets de Suporte", goal: "Listar e filtrar tickets pendentes.", description: "Use SQL para encontrar registros relevantes em uma fila de suporte.", summary: ["SELECT", "WHERE", "Status", "Ordenação"] },

  { id: "proj-git-feature-flow", courseId: "7", title: "Fluxo de Feature", emoji: "🌿", language: "Git", theme: "Fluxo de Feature", goal: "Praticar criação de branch e commit para uma feature.", description: "Passe por comandos essenciais de um fluxo de trabalho Git.", summary: ["git init", "branch", "commit", "histórico"] },
  { id: "proj-git-hotfix-flow", courseId: "7", title: "Fluxo de Hotfix", emoji: "🧯", language: "Git", theme: "Fluxo de Hotfix", goal: "Simular comandos para corrigir um problema urgente.", description: "Use init, branch e commit para organizar uma correção.", summary: ["Branch", "Commit", "Correção", "Git"] },
  { id: "proj-git-release-notes", courseId: "7", title: "Release Notes", emoji: "🏷️", language: "Git", theme: "Release Notes", goal: "Preparar comandos para registrar uma entrega.", description: "Pratique comandos que aparecem em fluxos de release.", summary: ["Commit", "Branch", "Histórico", "Entrega"] },
  { id: "proj-git-open-source", courseId: "7", title: "Contribuição Open Source", emoji: "🤝", language: "Git", theme: "Contribuição Open Source", goal: "Praticar a base de uma contribuição organizada.", description: "Treine comandos para iniciar, isolar e registrar uma mudança.", summary: ["Repositório", "Branch", "Commit", "Colaboração"] },
  { id: "proj-git-portfolio-versioning", courseId: "7", title: "Versionamento de Portfólio", emoji: "🧑‍💻", language: "Git", theme: "Versionamento de Portfólio", goal: "Versionar uma alteração de portfólio com Git.", description: "Aplique comandos essenciais em um cenário de portfólio.", summary: ["git init", "Branch", "Commit", "Portfólio"] },

  { id: "proj-logic-sort-visualizer", courseId: "8", title: "Visualizador de Ordenação", emoji: "📈", language: "Lógica", theme: "Visualizador de Ordenação", goal: "Pensar nos dados e passos de uma ordenação.", description: "Modele entrada, transformação e complexidade de um algoritmo.", summary: ["Entrada", "Função", "Ordenação", "Big O"] },
  { id: "proj-logic-search-engine", courseId: "8", title: "Busca em Lista", emoji: "🔎", language: "Lógica", theme: "Busca em Lista", goal: "Descrever uma estratégia de busca em dados simples.", description: "Pratique decomposição e análise de custo.", summary: ["Entrada", "Busca", "Funções", "Complexidade"] },
  { id: "proj-logic-queue-simulator", courseId: "8", title: "Simulador de Fila", emoji: "🚶", language: "Lógica", theme: "Simulador de Fila", goal: "Representar uma fila e pensar em operações básicas.", description: "Transforme uma situação real em dados e passos.", summary: ["Filas", "Entrada", "Transformação", "Big O"] },
  { id: "proj-logic-path-finder", courseId: "8", title: "Planejador de Caminho", emoji: "🗺️", language: "Lógica", theme: "Planejador de Caminho", goal: "Modelar a lógica inicial de um caminho entre pontos.", description: "Pratique representação de dados e resolução em etapas.", summary: ["Modelagem", "Funções", "Algoritmo", "Complexidade"] },
  { id: "proj-logic-cache", courseId: "8", title: "Cache Mental", emoji: "🧩", language: "Lógica", theme: "Cache Mental", goal: "Entender quando guardar resultados evita retrabalho.", description: "Modele entrada e análise de custo para uma ideia de cache.", summary: ["Entrada", "Memoização", "Funções", "Big O"] },

  { id: "proj-logic-beginner-flow", courseId: "10", title: "Mapa de Solução", emoji: "🧠", language: "Lógica básica", theme: "Mapa de Solução", goal: "Transformar um problema em entrada, passos e saída.", description: "Pratique raciocínio antes de escrever código complexo.", summary: ["Problema", "Entrada", "Passos", "Saída"] },
  { id: "proj-logic-decision-rules", courseId: "10", title: "Regras de Decisão", emoji: "🚦", language: "Lógica básica", theme: "Regras de Decisão", goal: "Descrever decisões simples usando se/senão.", description: "Modele regras de negócio de forma clara e testável.", summary: ["Condição", "Regra", "Saída", "Teste"] },
  { id: "proj-logic-study-plan", courseId: "10", title: "Plano de Estudos", emoji: "🗓️", language: "Lógica básica", theme: "Plano de Estudos", goal: "Organizar passos de estudo em uma sequência verificável.", description: "Aplique decomposição em um problema cotidiano.", summary: ["Sequência", "Lista", "Decomposição", "Revisão"] },

  { id: "proj-mobile-task-list", courseId: "11", title: "Lista de Tarefas Mobile", emoji: "📱", language: "React Native", theme: "Lista de Tarefas Mobile", goal: "Criar a base de uma tela mobile com lista e ação.", description: "Use View, Text, StyleSheet e onPress em uma experiência mobile simples.", summary: ["View", "Text", "StyleSheet", "onPress"] },
  { id: "proj-mobile-habit-card", courseId: "11", title: "Card de Hábito Mobile", emoji: "✅", language: "React Native", theme: "Card de Hábito Mobile", goal: "Montar um card mobile para acompanhar hábitos.", description: "Pratique estrutura visual e interação de toque.", summary: ["Componentes", "Estilo", "Estado", "Mobile"] },
  { id: "proj-mobile-profile-screen", courseId: "11", title: "Tela de Perfil Mobile", emoji: "👤", language: "React Native", theme: "Tela de Perfil Mobile", goal: "Estruturar uma tela de perfil com dados e botão.", description: "Conecte layout, texto e ação em uma tela mobile.", summary: ["Layout", "Text", "Button", "UI"] },

  { id: "proj-data-sales-summary", courseId: "12", title: "Resumo de Vendas", emoji: "📊", language: "Python", theme: "Resumo de Vendas", goal: "Calcular totais e gerar uma mensagem de relatório.", description: "Use listas, funções e saída formatada para transformar dados em insight.", summary: ["Listas", "sum", "Média", "Relatório"] },
  { id: "proj-data-clean-names", courseId: "12", title: "Limpeza de Cadastros", emoji: "🧼", language: "Python", theme: "Limpeza de Cadastros", goal: "Normalizar textos simples antes de gerar análises.", description: "Pratique limpeza de strings e preparação de dados.", summary: ["Strings", "strip", "lower", "Dados"] },
  { id: "proj-data-prompt-brief", courseId: "12", title: "Briefing de Prompt", emoji: "✨", language: "Python", theme: "Briefing de Prompt", goal: "Montar uma estrutura clara de prompt com objetivo e formato.", description: "Traduza necessidade de negócio em especificação para IA.", summary: ["Prompt", "Contexto", "Formato", "Automação"] },

  { id: "proj-game-score-loop", courseId: "13", title: "Loop de Pontuação", emoji: "🎮", language: "JavaScript", theme: "Loop de Pontuação", goal: "Simular rodadas de jogo e atualizar pontuação.", description: "Use estado simples, loops e condições para criar regras de jogo.", summary: ["Estado", "Loop", "Pontuação", "Condição"] },
  { id: "proj-game-quiz-rules", courseId: "13", title: "Quiz com Vidas", emoji: "❤️", language: "JavaScript", theme: "Quiz com Vidas", goal: "Criar regras de acerto, erro e fim de jogo.", description: "Pratique decisões e atualização de estado em jogos simples.", summary: ["if/else", "Estado", "Vidas", "Vitória"] },
  { id: "proj-game-adventure-state", courseId: "13", title: "Aventura de Texto", emoji: "🧭", language: "JavaScript", theme: "Aventura de Texto", goal: "Representar cenas e escolhas de uma aventura simples.", description: "Modele dados de jogo e decisões do jogador.", summary: ["Objetos", "Escolhas", "Estado", "Narrativa"] },

  { id: "proj-html-portfolio-section", courseId: "9", title: "Seção de Portfólio", emoji: "💼", language: "HTML", theme: "Seção de Portfólio", goal: "Criar a estrutura semântica de uma seção de portfólio.", description: "Use tags HTML para organizar conteúdo com título e ação.", summary: ["section", "h1", "links", "semântica"] },
  { id: "proj-html-product-card", courseId: "9", title: "Card de Produto", emoji: "🛍️", language: "HTML", theme: "Card de Produto", goal: "Montar a estrutura de um cartão de produto.", description: "Pratique seção, título e link de ação em HTML.", summary: ["Tags", "Semântica", "Atributos", "Links"] },
  { id: "proj-html-event-page", courseId: "9", title: "Página de Evento", emoji: "🎟️", language: "HTML", theme: "Página de Evento", goal: "Criar uma seção para divulgar um evento.", description: "Use HTML semântico para estruturar uma chamada de evento.", summary: ["section", "h1", "a", "atributos"] },
  { id: "proj-html-docs-page", courseId: "9", title: "Página de Documentação", emoji: "📄", language: "HTML", theme: "Página de Documentação", goal: "Estruturar uma página simples de documentação.", description: "Crie blocos semânticos com título e navegação.", summary: ["Semântica", "Títulos", "Links", "Estrutura"] },
  { id: "proj-html-course-overview", courseId: "9", title: "Visão Geral de Curso", emoji: "🧭", language: "HTML", theme: "Visão Geral de Curso", goal: "Montar a estrutura inicial de uma página de curso.", description: "Use HTML semântico para comunicar o objetivo de uma aula.", summary: ["HTML", "section", "h1", "href"] },
];

const generatedProjects: Project[] = projectBlueprints.map((project) => ({
  ...project,
  xpReward: project.xpReward ?? 80,
  steps: buildProjectSteps(project.language, project.theme),
}));

export const projects: Project[] = [
  {
    id: "proj-py-greeter",
    courseId: "1",
    title: "Saudador Personalizado",
    emoji: "👋",
    language: "Python",
    goal: "Construir um pequeno programa que cumprimenta um usuário pelo nome com mensagens variadas.",
    description:
      "Você vai juntar variáveis, strings e funções para criar um saudador. Cada etapa valida o que você fez antes de liberar a próxima.",
    xpReward: 60,
    summary: [
      "Variáveis e atribuição",
      "Concatenação de strings com f-strings",
      "Definição e uso de funções",
      "Chamadas com argumentos",
    ],
    steps: [
      {
        id: "step-1",
        title: "Etapa 1 — Crie a variável de nome",
        description:
          "Crie uma variável chamada `nome` com o valor `\"Ana\"` e exiba seu conteúdo com print().",
        starterCode: "# Crie a variável nome aqui\n\n",
        solution: 'nome = "Ana"\nprint(nome)',
        expectedOutput: "Ana",
        hints: [
          "Use `nome = \"Ana\"` para criar a variável.",
          "Depois passe a variável para print().",
        ],
        concepts: ["variáveis", "print"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Monte a saudação com f-string",
        description:
          "Use uma f-string para imprimir exatamente: `Olá, Ana!`",
        starterCode: 'nome = "Ana"\n# Imprima a saudação aqui\n',
        solution: 'nome = "Ana"\nprint(f"Olá, {nome}!")',
        expectedOutput: "Olá, Ana!",
        hints: [
          "f-strings começam com `f` antes das aspas.",
          "Coloque a variável entre chaves: `{nome}`.",
        ],
        concepts: ["f-strings", "interpolação"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Transforme em função",
        description:
          "Crie uma função `saudar(nome)` que devolve a saudação como string e chame-a com `\"Ana\"` dentro de um print().",
        starterCode: "# Defina a função saudar aqui\n\n",
        solution:
          'def saudar(nome):\n    return f"Olá, {nome}!"\n\nprint(saudar("Ana"))',
        expectedOutput: "Olá, Ana!",
        hints: [
          "Use `def saudar(nome):` para começar a função.",
          "Lembre de `return` em vez de print dentro da função.",
        ],
        concepts: ["funções", "return", "argumentos"],
      },
    ],
  },
  {
    id: "proj-js-counter",
    courseId: "2",
    title: "Contador Inteligente",
    emoji: "🔢",
    language: "JavaScript",
    goal: "Construir um pequeno contador que soma valores e mostra o total.",
    description:
      "Você vai praticar variáveis, operadores e console.log() construindo um contador em três etapas.",
    xpReward: 60,
    summary: [
      "Declaração com let/const",
      "Operadores aritméticos",
      "Saída com console.log",
      "Estrutura de loops básica",
    ],
    steps: [
      {
        id: "step-1",
        title: "Etapa 1 — Crie a variável total",
        description:
          "Declare uma variável `total` com valor inicial 0 e exiba-a com console.log().",
        starterCode: "// Crie a variável total aqui\n",
        solution: "let total = 0;\nconsole.log(total);",
        expectedOutput: "0",
        hints: [
          "Use `let` para declarar uma variável que pode mudar.",
          "Passe `total` para `console.log()`.",
        ],
        concepts: ["let", "console.log"],
      },
      {
        id: "step-2",
        title: "Etapa 2 — Some valores",
        description:
          "Some os valores 5, 10 e 15 ao total e mostre o resultado final (deve ser 30).",
        starterCode: "let total = 0;\n// Some os valores aqui\n",
        solution:
          "let total = 0;\ntotal += 5;\ntotal += 10;\ntotal += 15;\nconsole.log(total);",
        expectedOutput: "30",
        hints: [
          "Você pode usar `total = total + 5` ou `total += 5`.",
          "No final, exiba `total` com console.log().",
        ],
        concepts: ["operadores", "atribuição composta"],
      },
      {
        id: "step-3",
        title: "Etapa 3 — Use um loop",
        description:
          "Refaça a soma usando um for que itera de 1 a 5 e soma cada número ao total. O resultado deve ser 15.",
        starterCode: "let total = 0;\n// Escreva o for aqui\n",
        solution:
          "let total = 0;\nfor (let i = 1; i <= 5; i++) {\n  total += i;\n}\nconsole.log(total);",
        expectedOutput: "15",
        hints: [
          "Use `for (let i = 1; i <= 5; i++)`.",
          "Dentro do loop, faça `total += i`.",
        ],
        concepts: ["for", "iteração"],
      },
    ],
  },
  ...generatedProjects,
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectsByCourse(courseId: string): Project[] {
  return projects.filter((p) => p.courseId === courseId);
}
