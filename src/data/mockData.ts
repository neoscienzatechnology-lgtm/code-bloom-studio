import { foundationProgrammingCourse } from "./foundationCourse";
import { modernWebCourses } from "./modernWebCourses";
import { modernPythonSqlCourses } from "./modernPythonSqlCourses";
import { modernProfessionalCourses } from "./modernProfessionalCourses";
import { modernAlgorithmCourse } from "./modernAlgorithmCourse";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  successFeedback?: string;
  errorFeedback?: string;
  hint?: string;
}

export type PracticeActivityType = "fill-code" | "order-steps" | "predict-output" | "identify-error" | "mini-challenge";

export interface PracticeActivity {
  id: string;
  type: PracticeActivityType;
  title: string;
  prompt: string;
  code?: string;
  options?: string[];
  correctAnswer: string | string[];
  successFeedback: string;
  errorFeedback: string;
  hint?: string;
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
  module?: string;
  level?: "Iniciante" | "Intermediário" | "Avançado";
  estimatedMinutes?: number;
  learningObjective?: string;
  analogy?: string;
  example?: string;
  codeExample?: string;
  summary?: string;
  nextStep?: string;
  tryItPrompt?: string;
  commonMistake?: string;
  reference?: string[];
  practiceActivities?: PracticeActivity[];
  concepts?: string[];
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

type LessonEnhancement = Partial<
  Pick<
    Lesson,
    | "module"
    | "level"
    | "estimatedMinutes"
    | "learningObjective"
    | "analogy"
    | "example"
    | "codeExample"
    | "summary"
    | "nextStep"
    | "tryItPrompt"
    | "commonMistake"
    | "reference"
    | "practiceActivities"
    | "concepts"
  >
>;

function enrichQuizFeedback(lesson: Lesson): QuizQuestion[] | undefined {
  return lesson.quiz?.map((question) => ({
    ...question,
    successFeedback:
      question.successFeedback ??
      `Boa. Você conectou a ideia de "${lesson.title}" com uma situação prática.`,
    errorFeedback:
      question.errorFeedback ??
      `Quase. Volte ao exemplo da lição e observe qual conceito a pergunta está testando.`,
    hint:
      question.hint ??
      `Procure no bloco de referência rápida da lição a regra que resolve esta dúvida.`,
  }));
}

function enrichCourse(course: Course, enhancements: Record<string, LessonEnhancement>): Course {
  return {
    ...course,
    lessons: course.lessons.map((lesson) => {
      const enhancement = enhancements[lesson.id];
      if (!enhancement) return lesson;

      return {
        ...lesson,
        ...enhancement,
        quiz: enrichQuizFeedback(lesson),
      };
    }),
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
    color: "quest-blue",
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
    color: "quest-orange",
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

const supplementalLessonEnhancements: Record<string, LessonEnhancement> = {
  "11-1": {
    module: "React Native: primeiros componentes",
    level: "Intermediário",
    estimatedMinutes: 8,
    learningObjective: "Entender a diferença entre componentes web e componentes nativos no React Native.",
    analogy: "Pense em View como uma caixa de layout e Text como uma etiqueta de texto. No celular, cada peça precisa usar o componente nativo certo.",
    example: "Uma tela inicial simples pode ser uma View com um Text de boas-vindas.",
    codeExample: 'return <View><Text>Olá, mobile!</Text></View>;',
    tryItPrompt: "Troque o texto exibido e adicione uma segunda linha usando outro componente Text.",
    commonMistake: "Usar div, p ou h1 no React Native. Esses elementos são da web, não da interface nativa.",
    reference: ["View organiza áreas da tela.", "Text exibe qualquer texto.", "Componentes nativos substituem tags HTML.", "Todo texto visível precisa ficar dentro de Text."],
    practiceActivities: [
      {
        id: "11-1-identify-native",
        type: "identify-error",
        title: "Ache o componente errado",
        prompt: "Qual parte deste código não pertence ao React Native?",
        code: "return <div><Text>CapyCode</Text></div>;",
        correctAnswer: "div",
        successFeedback: "Isso. div é um elemento da web; no React Native use View.",
        errorFeedback: "Ainda não. Procure uma tag que existe no HTML, mas não no React Native.",
        hint: "O container básico no React Native é View.",
      },
    ],
    summary: "React Native usa componentes próprios para renderizar interface no celular.",
    nextStep: "Depois dos componentes base, organize estilos com StyleSheet.",
    concepts: ["react-native", "components", "mobile-ui"],
  },
  "11-2": {
    module: "React Native: primeiros componentes",
    level: "Intermediário",
    estimatedMinutes: 9,
    learningObjective: "Aplicar estilos previsíveis em telas mobile usando StyleSheet.",
    analogy: "StyleSheet funciona como uma folha de estilos organizada em objetos, parecida com gavetas nomeadas para cada parte da tela.",
    example: "Um botão visual pode ter padding, borderRadius e backgroundColor definidos em styles.botao.",
    codeExample: "const styles = StyleSheet.create({ card: { padding: 16, borderRadius: 12 } });",
    tryItPrompt: "Crie um estilo chamado titulo com fontSize, fontWeight e color.",
    commonMistake: "Copiar propriedades CSS da web sem conferir o suporte mobile, como usar valores com seletores ou classes.",
    reference: ["StyleSheet.create organiza estilos.", "Nomes de propriedades usam camelCase.", "Unidades numéricas não usam px.", "Estilos podem ser combinados em arrays."],
    practiceActivities: [
      {
        id: "11-2-fill-style",
        type: "fill-code",
        title: "Complete o estilo",
        prompt: "Complete a propriedade que deixa o texto maior.",
        code: "const styles = StyleSheet.create({ titulo: { ___: 24 } });",
        correctAnswer: "fontSize",
        successFeedback: "Boa. fontSize controla tamanho de texto no React Native.",
        errorFeedback: "Quase. Em React Native a propriedade é camelCase, não font-size.",
        hint: "Pense em font-size escrito no formato JavaScript.",
      },
    ],
    summary: "Estilos mobile ficam mais legíveis quando cada parte da tela tem um nome claro.",
    nextStep: "Use estado para a tela reagir a toques.",
    concepts: ["react-native", "stylesheet", "mobile-layout"],
  },
  "11-3": {
    module: "React Native: interação",
    level: "Intermediário",
    estimatedMinutes: 10,
    learningObjective: "Conectar um botão a uma mudança de estado visível na tela.",
    analogy: "Estado é a memória curta da tela: quando o usuário toca, essa memória muda e a interface se redesenha.",
    example: "Um contador aumenta quando o aluno toca em Button.",
    codeExample: "const [contador, setContador] = useState(0);",
    tryItPrompt: "Altere o contador para subir de 2 em 2 a cada toque.",
    commonMistake: "Mudar uma variável comum e esperar que a tela atualize. Para renderizar de novo, use estado.",
    reference: ["useState guarda dados da tela.", "Button dispara onPress.", "setEstado agenda nova renderização.", "Texto deve mostrar o valor atualizado."],
    practiceActivities: [
      {
        id: "11-3-predict-state",
        type: "predict-output",
        title: "Preveja o contador",
        prompt: "Se contador começa em 0 e o botão chama setContador(contador + 1), qual valor aparece após um toque?",
        options: ["0", "1", "2"],
        correctAnswer: "1",
        successFeedback: "Certo. O estado sobe uma unidade e a tela mostra o novo valor.",
        errorFeedback: "Ainda não. Releia a expressão contador + 1.",
        hint: "Comece em 0 e some 1 uma vez.",
      },
    ],
    summary: "Interação mobile nasce da combinação de evento, estado e nova renderização.",
    nextStep: "Aplique essa ideia em listas de dados.",
    concepts: ["react-native", "state", "events"],
  },
  "11-4": {
    module: "React Native: dados na tela",
    level: "Intermediário",
    estimatedMinutes: 10,
    learningObjective: "Renderizar listas de forma adequada usando dados e índice mental de itens.",
    analogy: "FlatList é como uma esteira: ela recebe uma coleção e entrega item por item para a tela montar.",
    example: "Uma lista de tarefas pode ser um array de textos renderizado em sequência.",
    codeExample: 'const tarefas = ["Estudar", "Praticar"];',
    tryItPrompt: "Adicione uma terceira tarefa ao array e ajuste a renderização para mostrar todas.",
    commonMistake: "Tentar renderizar listas grandes com vários componentes copiados manualmente.",
    reference: ["Arrays guardam vários itens.", "FlatList é indicada para listas.", "Cada item precisa de uma chave estável.", "renderItem descreve como um item aparece."],
    practiceActivities: [
      {
        id: "11-4-order-list",
        type: "order-steps",
        title: "Monte a lista",
        prompt: "Ordene os passos para renderizar uma lista de tarefas.",
        options: ["Criar array de tarefas", "Passar dados para a lista", "Descrever como cada item aparece", "Exibir a tela"],
        correctAnswer: ["Criar array de tarefas", "Passar dados para a lista", "Descrever como cada item aparece", "Exibir a tela"],
        successFeedback: "Perfeito. Dados primeiro, renderização depois.",
        errorFeedback: "Quase. Antes de renderizar, a tela precisa receber os dados.",
        hint: "Comece criando a coleção.",
      },
    ],
    summary: "Listas conectam dados a componentes repetidos sem copiar código.",
    nextStep: "Use navegação para separar telas.",
    concepts: ["react-native", "lists", "arrays"],
  },
  "11-5": {
    module: "React Native: fluxo de telas",
    level: "Intermediário",
    estimatedMinutes: 9,
    learningObjective: "Entender navegação como mudança controlada entre telas do app.",
    analogy: "Navegação é o mapa interno do aplicativo: cada ação leva o aluno para uma tela combinada.",
    example: "Um botão em Home pode levar para Detalhes quando o usuário escolhe um item.",
    codeExample: 'const telas = ["Home", "Detalhes", "Perfil"];',
    tryItPrompt: "Crie uma lista com três telas e mostre a primeira tela no console.",
    commonMistake: "Pensar em navegação como troca de URL apenas. No mobile, ela controla pilhas, abas e histórico de telas.",
    reference: ["Apps mobile são divididos em telas.", "Stack guarda histórico de avanço e volta.", "Tabs expõem áreas principais.", "Ação do usuário decide a próxima tela."],
    practiceActivities: [
      {
        id: "11-5-mini-flow",
        type: "mini-challenge",
        title: "Desenhe o fluxo",
        prompt: "Descreva a sequência de telas para abrir um detalhe: Home -> Lista -> Detalhes.",
        correctAnswer: "Home -> Lista -> Detalhes",
        successFeedback: "Boa. Você descreveu um fluxo navegável e previsível.",
        errorFeedback: "Ainda não. Inclua a tela inicial, a lista e a tela final de detalhes.",
        hint: "Use setas para indicar a ordem.",
      },
    ],
    summary: "Navegação dá direção ao app e ajuda o aluno a prever onde cada ação leva.",
    nextStep: "Combine componentes, estilos, estado, listas e navegação em um app simples.",
    concepts: ["react-native", "navigation", "mobile-flow"],
  },
  "12-1": {
    module: "Dados e IA: fundamentos",
    level: "Iniciante",
    estimatedMinutes: 8,
    learningObjective: "Ler uma tabela simples como conjunto de registros e colunas.",
    analogy: "Uma tabela é como uma planilha bem organizada: cada linha conta um caso, cada coluna descreve uma característica.",
    example: "Em vendas, cada linha pode representar uma venda com produto, valor e data.",
    codeExample: 'const vendas = [{ produto: "Curso", valor: 80 }];',
    tryItPrompt: "Liste três colunas que fariam sentido em uma tabela de alunos.",
    commonMistake: "Misturar várias ideias na mesma coluna, como colocar nome e idade juntos no mesmo campo.",
    reference: ["Linha representa um registro.", "Coluna representa uma característica.", "Dados organizados facilitam análise.", "Perguntas boas começam com dados claros."],
    practiceActivities: [
      {
        id: "12-1-identify-record",
        type: "predict-output",
        title: "Linha ou coluna?",
        prompt: "Em uma tabela de alunos, 'idade' é linha ou coluna?",
        options: ["Linha", "Coluna", "Tabela inteira"],
        correctAnswer: "Coluna",
        successFeedback: "Certo. Idade descreve uma característica de cada aluno.",
        errorFeedback: "Quase. Pense se idade é um registro completo ou uma característica.",
        hint: "Cada aluno teria um valor para idade.",
      },
    ],
    summary: "Antes de automatizar ou usar IA, o aluno precisa enxergar a estrutura dos dados.",
    nextStep: "Depois de entender a tabela, limpe valores inconsistentes.",
    concepts: ["data", "tables", "records"],
  },
  "12-2": {
    module: "Dados e IA: fundamentos",
    level: "Iniciante",
    estimatedMinutes: 9,
    learningObjective: "Identificar dados inconsistentes que atrapalham análise e automação.",
    analogy: "Limpeza de dados é como arrumar uma bancada antes de cozinhar: sem isso, a receita sai confusa.",
    example: "Datas em formatos diferentes impedem comparação confiável.",
    codeExample: 'const dataNormalizada = "2026-05-13";',
    tryItPrompt: "Encontre dois problemas possíveis em uma lista de emails digitados manualmente.",
    commonMistake: "Começar pelo gráfico ou pela IA antes de verificar se os dados fazem sentido.",
    reference: ["Valores vazios precisam de decisão.", "Formatos devem ser consistentes.", "Duplicados podem distorcer contagens.", "Limpeza melhora confiança na resposta."],
    practiceActivities: [
      {
        id: "12-2-identify-error",
        type: "identify-error",
        title: "Ache a inconsistência",
        prompt: "Qual valor parece fora do padrão?",
        code: "datas = ['13/05/2026', '14/05/2026', '2026-05-15']",
        correctAnswer: "2026-05-15",
        successFeedback: "Isso. O formato ISO é válido, mas está diferente dos outros valores da lista.",
        errorFeedback: "Ainda não. Compare o formato de cada data, não apenas se ela parece uma data.",
        hint: "Dois valores usam barras e um usa hífens.",
      },
    ],
    summary: "Dados limpos tornam relatórios, automações e prompts muito mais confiáveis.",
    nextStep: "Com dados limpos, calcule métricas simples.",
    concepts: ["data-cleaning", "quality", "automation"],
  },
  "12-3": {
    module: "Dados e IA: análise simples",
    level: "Iniciante",
    estimatedMinutes: 10,
    learningObjective: "Calcular métricas básicas para responder uma pergunta de negócio.",
    analogy: "Métrica é o placar de uma pergunta: ela transforma vários registros em um número útil.",
    example: "Somar vendas do mês responde quanto entrou no período.",
    codeExample: "const total = vendas.reduce((soma, venda) => soma + venda.valor, 0);",
    tryItPrompt: "Escolha uma métrica para acompanhar estudos: total de XP, dias ativos ou aulas concluídas.",
    commonMistake: "Calcular um número sem saber qual pergunta ele responde.",
    reference: ["Soma mede total.", "Média mede valor típico.", "Contagem mede volume.", "Toda métrica precisa de uma pergunta clara."],
    practiceActivities: [
      {
        id: "12-3-predict-total",
        type: "predict-output",
        title: "Preveja a soma",
        prompt: "Qual é o total de [10, 20, 5]?",
        options: ["25", "30", "35"],
        correctAnswer: "35",
        successFeedback: "Correto. A soma transforma vários valores em um total.",
        errorFeedback: "Quase. Some todos os três valores, não apenas os dois primeiros.",
        hint: "10 + 20 + 5.",
      },
    ],
    summary: "Métricas simples já ajudam a tomar decisões melhores.",
    nextStep: "Use prompts para transformar perguntas em saídas úteis.",
    concepts: ["metrics", "analysis", "reports"],
  },
  "12-4": {
    module: "Dados e IA: produtividade",
    level: "Iniciante",
    estimatedMinutes: 9,
    learningObjective: "Escrever prompts com objetivo, contexto, formato e restrições.",
    analogy: "Prompt é um briefing: quanto mais claro o pedido, mais útil tende a ser a resposta.",
    example: "Gerar um resumo em 5 bullets para uma equipe exige dizer público, formato e limite.",
    codeExample: "Objetivo: resumir. Contexto: relatório de vendas. Formato: 5 bullets. Restrição: sem inventar números.",
    tryItPrompt: "Reescreva um pedido vago como um prompt com objetivo, contexto e formato.",
    commonMistake: "Pedir 'melhore isso' sem dizer para quem, com qual objetivo e em qual formato.",
    reference: ["Objetivo diz o que fazer.", "Contexto explica a situação.", "Formato define a saída.", "Restrições evitam respostas soltas."],
    practiceActivities: [
      {
        id: "12-4-order-prompt",
        type: "order-steps",
        title: "Monte o prompt",
        prompt: "Ordene os blocos de um prompt claro.",
        options: ["Objetivo", "Contexto", "Formato esperado", "Restrições"],
        correctAnswer: ["Objetivo", "Contexto", "Formato esperado", "Restrições"],
        successFeedback: "Boa. Essa estrutura deixa o pedido claro e verificável.",
        errorFeedback: "Quase. Comece dizendo o objetivo antes dos detalhes.",
        hint: "Primeiro diga o que você quer alcançar.",
      },
    ],
    summary: "Prompts bons reduzem retrabalho e deixam a IA mais útil no estudo e no trabalho.",
    nextStep: "Transforme dados e prompts em relatórios repetíveis.",
    concepts: ["ai-productivity", "prompting", "communication"],
  },
  "12-5": {
    module: "Dados e IA: produtividade",
    level: "Iniciante",
    estimatedMinutes: 10,
    learningObjective: "Planejar uma automação simples de relatório com entrada, cálculo e saída.",
    analogy: "Automação é uma receita que pode ser repetida: mesmos passos, menos trabalho manual.",
    example: "Ler vendas, somar valores e gerar uma mensagem pronta para a equipe.",
    codeExample: 'const resumo = `Total do mês: R$ ${total}`;',
    tryItPrompt: "Descreva entrada, transformação e saída para um relatório de frequência de estudos.",
    commonMistake: "Automatizar uma tarefa mal definida. Primeiro escreva os passos manualmente.",
    reference: ["Entrada é o dado inicial.", "Transformação calcula ou organiza.", "Saída é o resultado entregue.", "Automação precisa ser repetível."],
    practiceActivities: [
      {
        id: "12-5-mini-automation",
        type: "mini-challenge",
        title: "Planeje a automação",
        prompt: "Escreva uma sequência com entrada, transformação e saída para resumir vendas.",
        correctAnswer: "entrada, transformação, saída",
        successFeedback: "Boa. Você separou o fluxo essencial de uma automação.",
        errorFeedback: "Ainda não. Sua resposta precisa citar as três partes: entrada, transformação e saída.",
        hint: "Use as palavras entrada, transformação e saída.",
      },
    ],
    summary: "Automação útil começa pequena e clara, resolvendo uma tarefa repetitiva real.",
    nextStep: "Combine métricas, prompt e relatório em um mini projeto.",
    concepts: ["automation", "reports", "workflow"],
  },
  "13-1": {
    module: "Game Dev: regras e estado",
    level: "Iniciante",
    estimatedMinutes: 8,
    learningObjective: "Representar o estado básico de um jogo com variáveis simples.",
    analogy: "Estado é o placar interno do jogo: ele lembra pontos, vidas, fase e posição.",
    example: "Um jogo pode começar com pontos = 0 e vidas = 3.",
    codeExample: "let pontos = 0;\nlet vidas = 3;",
    tryItPrompt: "Crie três variáveis para representar um jogo de perguntas.",
    commonMistake: "Guardar tudo em texto solto em vez de separar cada informação importante.",
    reference: ["Estado descreve o momento atual.", "Variáveis guardam partes do estado.", "Ações mudam o estado.", "Interface mostra o estado ao jogador."],
    practiceActivities: [
      {
        id: "13-1-fill-state",
        type: "fill-code",
        title: "Complete a vida inicial",
        prompt: "Complete a variável para o jogo começar com 3 vidas.",
        code: "let vidas = ___;",
        correctAnswer: "3",
        successFeedback: "Certo. O estado inicial agora tem 3 vidas.",
        errorFeedback: "Quase. O valor precisa ser um número, sem texto.",
        hint: "Use o número 3.",
      },
    ],
    summary: "Jogos começam ficando claros quando o estado inicial está bem definido.",
    nextStep: "Depois do estado, defina regras que mudam pontos e vidas.",
    concepts: ["game-state", "variables", "rules"],
  },
  "13-2": {
    module: "Game Dev: regras e estado",
    level: "Iniciante",
    estimatedMinutes: 9,
    learningObjective: "Criar regras simples de pontuação usando condições.",
    analogy: "Regra de pontuação é o contrato do jogo: se o jogador faz X, o placar muda de Y.",
    example: "Se acertar, soma 10 pontos; se errar, perde uma vida.",
    codeExample: "if (acertou) { pontos += 10; }",
    tryItPrompt: "Escreva uma regra para dar bônus quando pontos chegarem a 100.",
    commonMistake: "Misturar várias regras em uma condição enorme antes de testar as regras pequenas.",
    reference: ["Condições escolhem consequências.", "Pontuação deve ter regra clara.", "Regras pequenas são mais testáveis.", "Feedback do jogador depende dessas regras."],
    practiceActivities: [
      {
        id: "13-2-predict-score",
        type: "predict-output",
        title: "Preveja os pontos",
        prompt: "pontos começa em 20. Depois de pontos += 10, qual é o valor?",
        options: ["10", "20", "30"],
        correctAnswer: "30",
        successFeedback: "Isso. += 10 soma dez ao valor atual.",
        errorFeedback: "Ainda não. Comece em 20 e adicione 10.",
        hint: "20 + 10.",
      },
    ],
    summary: "Regras pequenas deixam o jogo previsível e fácil de ajustar.",
    nextStep: "Use loop para atualizar o jogo continuamente.",
    concepts: ["game-rules", "conditionals", "score"],
  },
  "13-3": {
    module: "Game Dev: ciclo do jogo",
    level: "Iniciante",
    estimatedMinutes: 10,
    learningObjective: "Entender o loop de atualização como repetição controlada do jogo.",
    analogy: "O loop é o coração do jogo: ele bate várias vezes por segundo para atualizar e desenhar a cena.",
    example: "A cada ciclo, o jogo move o personagem, verifica colisões e redesenha a tela.",
    codeExample: "function atualizar() { mover(); desenhar(); }",
    tryItPrompt: "Liste três coisas que um jogo poderia atualizar a cada ciclo.",
    commonMistake: "Criar repetição sem condição de parada ou sem controlar o que muda em cada volta.",
    reference: ["Loop repete atualizações.", "Cada ciclo deve mudar algo claro.", "Renderização mostra o novo estado.", "Controle evita travamentos."],
    practiceActivities: [
      {
        id: "13-3-order-loop",
        type: "order-steps",
        title: "Ciclo básico",
        prompt: "Ordene um ciclo simples de jogo.",
        options: ["Ler entrada", "Atualizar estado", "Verificar regras", "Desenhar tela"],
        correctAnswer: ["Ler entrada", "Atualizar estado", "Verificar regras", "Desenhar tela"],
        successFeedback: "Boa. Esse ciclo explica a maioria dos jogos simples.",
        errorFeedback: "Quase. A tela deve ser desenhada depois que o estado foi atualizado.",
        hint: "Primeiro leia o que o jogador fez.",
      },
    ],
    summary: "Loop de jogo organiza a repetição que mantém a experiência viva.",
    nextStep: "Conecte eventos do jogador ao estado.",
    concepts: ["game-loop", "state-update", "rendering"],
  },
  "13-4": {
    module: "Game Dev: ciclo do jogo",
    level: "Iniciante",
    estimatedMinutes: 8,
    learningObjective: "Usar eventos para transformar ações do jogador em comportamento.",
    analogy: "Evento é uma campainha: quando o jogador toca, uma função acorda e faz algo.",
    example: "Pressionar espaço pode chamar uma função pular().",
    codeExample: 'function pular() { console.log("pulou"); }',
    tryItPrompt: "Crie uma função atacar que mostre 'atacou' no console.",
    commonMistake: "Criar a função, mas esquecer de chamar ou conectar ao evento.",
    reference: ["Evento representa ação.", "Função responde ao evento.", "Entrada pode ser teclado, clique ou toque.", "Feedback confirma que a ação aconteceu."],
    practiceActivities: [
      {
        id: "13-4-fill-event",
        type: "fill-code",
        title: "Complete a ação",
        prompt: "Complete a função para mostrar 'pulou'.",
        code: "function pular() {\n  console.log(___);\n}",
        correctAnswer: "\"pulou\"",
        successFeedback: "Certo. A função agora dá feedback da ação.",
        errorFeedback: "Quase. O console.log precisa receber o texto entre aspas.",
        hint: "Use \"pulou\".",
      },
    ],
    summary: "Eventos conectam o jogador ao sistema de regras do jogo.",
    nextStep: "Defina uma condição de vitória para fechar o ciclo.",
    concepts: ["events", "functions", "player-input"],
  },
  "13-5": {
    module: "Game Dev: ciclo do jogo",
    level: "Iniciante",
    estimatedMinutes: 9,
    learningObjective: "Definir uma condição clara de vitória ou encerramento.",
    analogy: "Condição de vitória é a linha de chegada: sem ela, o jogador corre sem saber quando venceu.",
    example: "Vencer quando pontos forem maiores ou iguais a 100.",
    codeExample: "if (pontos >= 100) { console.log('venceu'); }",
    tryItPrompt: "Escreva uma regra de vitória para um jogo com 5 perguntas corretas.",
    commonMistake: "Criar objetivo visual, mas não transformar esse objetivo em uma condição verificável no código.",
    reference: ["Vitória precisa de regra mensurável.", "Condição compara estado com objetivo.", "Fim de jogo também pode ser derrota.", "Mensagem final dá clareza ao jogador."],
    practiceActivities: [
      {
        id: "13-5-identify-win",
        type: "identify-error",
        title: "Regra incompleta",
        prompt: "Qual parte falta para essa vitória ser verificável?",
        code: "if (pontos) { console.log('venceu'); }",
        correctAnswer: "comparação com meta",
        successFeedback: "Isso. A regra precisa comparar pontos com uma meta, como pontos >= 100.",
        errorFeedback: "Ainda não. A condição existe, mas está vaga demais.",
        hint: "Pergunte: quantos pontos são suficientes para vencer?",
      },
    ],
    summary: "Um jogo simples fica completo quando estado, regras, eventos e fim conversam entre si.",
    nextStep: "Use esses blocos para criar um protótipo jogável pequeno.",
    concepts: ["win-condition", "conditionals", "game-design"],
  },
};

const modernCourseMap = new Map(
  [
    ...modernPythonSqlCourses,
    ...modernWebCourses,
    ...modernProfessionalCourses,
    modernAlgorithmCourse,
  ].map((course) => [course.id, course] as const),
);

function requireCourse(id: string): Course {
  const course = modernCourseMap.get(id);
  if (!course) throw new Error(`Missing course ${id}`);
  return course;
}

export const courses: Course[] = [
  foundationProgrammingCourse,
  requireCourse("1"),
  requireCourse("2"),
  requireCourse("9"),
  requireCourse("4"),
  requireCourse("3"),
  requireCourse("5"),
  requireCourse("6"),
  requireCourse("7"),
  requireCourse("8"),
  enrichCourse(createReactNativeCourse(), supplementalLessonEnhancements),
  enrichCourse(createDataAiCourse(), supplementalLessonEnhancements),
  enrichCourse(createGameDevCourse(), supplementalLessonEnhancements),
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
