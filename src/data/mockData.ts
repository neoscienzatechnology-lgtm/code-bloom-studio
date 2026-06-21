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
  contrastExample?: {
    wrong: string;
    right: string;
    explanation: string;
  };
  testCases?: {
    call: string;
    expected: string;
  }[];
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
    | "contrastExample"
    | "testCases"
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
      createLesson({
        id: "11-6",
        title: "Entrada de Texto com TextInput",
        description: "Capture o que o usuário digita com um campo controlado.",
        theory: `# TextInput

Formulários mobile usam TextInput. Ele é um campo controlado: o valor vem do estado e cada tecla chama onChangeText.

Esse par value + onChangeText mantém o estado como única fonte da verdade do campo.

Login, busca e cadastro começam com esse padrão.`,
        starterCode: 'import { TextInput } from "react-native";\n\n// Crie um campo controlado com value e onChangeText\n',
        solution: 'import { TextInput } from "react-native";\n\n<TextInput value={nome} onChangeText={setNome} placeholder="Seu nome" />;',
        expectedOutput: "onChangeText",
        hints: ["Use value={nome}.", "Conecte onChangeText a setNome.", "placeholder mostra a dica do campo."],
        xpReward: 20,
        quiz: [makeQuiz("Qual prop recebe o texto digitado a cada tecla?", ["onChangeText", "onClick", "innerHTML", "href"], 0, "onChangeText entrega o novo texto para o estado a cada alteração.")],
      }),
      createLesson({
        id: "11-7",
        title: "Toques com Pressable",
        description: "Crie áreas tocáveis com feedback visual de pressionado.",
        theory: `# Pressable

Button resolve casos simples, mas Pressable dá controle total: qualquer conteúdo vira área de toque, e o estilo pode reagir enquanto o dedo pressiona.

A prop onPress dispara a ação; a função de estilo recebe pressed para dar feedback visual.

Feedback de toque é o que faz o app parecer responsivo.`,
        starterCode: 'import { Pressable, Text } from "react-native";\n\n// Crie um Pressable com um Text dentro\n',
        solution: 'import { Pressable, Text } from "react-native";\n\n<Pressable onPress={() => console.log("toque")}>\n  <Text>Tocar aqui</Text>\n</Pressable>;',
        expectedOutput: "Pressable",
        hints: ["Envolva o Text com Pressable.", "Use onPress para a ação.", "O conteúdo fica entre as tags."],
        xpReward: 20,
        quiz: [makeQuiz("Qual a vantagem do Pressable sobre o Button?", ["Qualquer conteúdo vira área de toque com feedback", "Ele cria banco de dados", "Ele dispensa onPress", "Ele só funciona na web"], 0, "Pressable envolve qualquer componente e permite estilo reativo ao toque.")],
      }),
      createLesson({
        id: "11-8",
        title: "Imagens na Tela",
        description: "Exiba imagens por URL com dimensões definidas.",
        theory: `# Image

O componente Image exibe imagens locais ou por URL. Para imagens remotas, o source recebe um objeto com uri.

Diferente da web, imagem remota precisa de width e height: sem dimensões, o React Native renderiza um espaço de tamanho zero.

Avatares, logos e capas seguem esse padrão.`,
        starterCode: 'import { Image } from "react-native";\n\n// Mostre uma imagem por URL com largura e altura\n',
        solution: 'import { Image } from "react-native";\n\n<Image source={{ uri: "https://exemplo.com/capy.png" }} style={{ width: 120, height: 120 }} />;',
        expectedOutput: "source",
        hints: ["source recebe { uri: ... }.", "Defina width e height no style.", "São duas chaves: source={{ uri }}."],
        xpReward: 20,
        quiz: [makeQuiz("Por que imagem remota precisa de width e height?", ["Sem dimensões o React Native renderiza tamanho zero", "Para baixar mais rápido", "Para virar texto", "Porque a web exige"], 0, "O layout nativo não conhece o tamanho da imagem remota antes de baixar; sem dimensões, nada aparece.")],
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
      createLesson({
        id: "12-6",
        title: "Filtrando Registros",
        description: "Selecione só os valores que atendem a uma regra.",
        theory: `# Filtros

Análise raramente usa todos os dados: você quer as vendas altas, os alunos aprovados, os erros do mês.

Em Python, a list comprehension filtra em uma linha: [v for v in vendas if v > 100] lê como "cada v de vendas, se v for maior que 100".

Filtrar antes de calcular evita que valores fora do recorte distorçam a métrica.`,
        starterCode: "vendas = [80, 120, 150, 90]\n# selecione as vendas acima de 100\n",
        solution: "vendas = [80, 120, 150, 90]\naltas = [v for v in vendas if v > 100]\nprint(altas)",
        expectedOutput: "[120, 150]",
        hints: ["Use [v for v in vendas].", "Adicione a condição if v > 100.", "Guarde em altas e mostre."],
        xpReward: 20,
        quiz: [makeQuiz("O que [v for v in vendas if v > 100] produz?", ["Uma nova lista só com os valores que passam na regra", "A soma das vendas", "Um erro de sintaxe", "A lista original alterada"], 0, "A comprehension cria uma lista nova com os itens que satisfazem a condição.")],
      }),
      createLesson({
        id: "12-7",
        title: "Agrupando com Dicionários",
        description: "Conte quantas vezes cada categoria aparece nos dados.",
        theory: `# Agrupamento

Perguntas como "quantas vendas por categoria?" pedem agrupamento: percorrer os registros somando em um dicionário.

O método get(chave, 0) devolve o valor atual ou zero se a chave ainda não existe — o padrão clássico de contador.

É a versão em Python do GROUP BY do SQL.`,
        starterCode: 'categorias = ["eletronicos", "livros", "eletronicos"]\n# conte quantas vezes eletronicos aparece\n',
        solution: 'categorias = ["eletronicos", "livros", "eletronicos"]\ncontagem = {}\nfor c in categorias:\n    contagem[c] = contagem.get(c, 0) + 1\nprint(f"eletronicos: {contagem[\'eletronicos\']}")',
        expectedOutput: "eletronicos: 2",
        hints: ["Comece com contagem = {}.", "Use contagem.get(c, 0) + 1.", "Mostre a chave eletronicos no final."],
        xpReward: 25,
        quiz: [makeQuiz("Para que serve o get(c, 0) no contador?", ["Devolver 0 quando a chave ainda não existe", "Apagar a chave", "Ordenar o dicionário", "Converter para texto"], 0, "get com valor padrão evita erro na primeira vez que a categoria aparece.")],
      }),
      createLesson({
        id: "12-8",
        title: "Lendo Linhas de CSV",
        description: "Separe os campos de uma linha de dados com split.",
        theory: `# CSV

Muitos dados chegam como texto separado por vírgulas: cada linha é um registro, cada vírgula separa um campo.

O método split(",") corta a linha em uma lista de campos, que você acessa por posição.

Esse é o primeiro passo de qualquer importação: transformar texto bruto em estrutura.`,
        starterCode: 'linha = "Ana,28,SP"\n# separe os campos e mostre o nome\n',
        solution: 'linha = "Ana,28,SP"\ncampos = linha.split(",")\nprint(campos[0])',
        expectedOutput: "Ana",
        hints: ['Use linha.split(",").', "O resultado é uma lista.", "O nome está na posição 0."],
        xpReward: 20,
        quiz: [makeQuiz('O que linha.split(",") devolve?', ["Uma lista com os campos da linha", "Um número", "A linha sem alterações", "Um arquivo novo"], 0, "split corta o texto em cada vírgula e devolve a lista de pedaços.")],
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
      createLesson({
        id: "13-6",
        title: "Vidas e Derrota",
        description: "Implemente a perda de vida e o fim de jogo.",
        theory: `# Derrota

Vitória sem risco não tem graça. Vidas modelam o erro: cada falha desconta uma, e zero vidas encerra o jogo.

A ordem importa: primeiro atualize o estado (desconte a vida), depois verifique a regra de fim.

Esse mesmo padrão controla tentativas em quizzes e limites em formulários.`,
        starterCode: "let vidas = 1;\n// desconte uma vida e mostre fim de jogo quando chegar a 0\n",
        solution: 'let vidas = 1;\nvidas = vidas - 1;\nif (vidas === 0) {\n  console.log("fim de jogo");\n}',
        expectedOutput: "fim de jogo",
        hints: ["Desconte com vidas = vidas - 1.", "Depois verifique if (vidas === 0).", "Mostre fim de jogo dentro do if."],
        xpReward: 20,
        quiz: [makeQuiz("Qual a ordem correta ao perder vida?", ["Atualizar o estado e depois verificar o fim", "Verificar o fim e nunca atualizar", "Mostrar mensagem antes de descontar", "Reiniciar o jogo sempre"], 0, "Primeiro o estado muda, depois a regra de fim olha o estado novo.")],
      }),
      createLesson({
        id: "13-7",
        title: "Fases e Progressão",
        description: "Suba de fase quando a pontuação atingir o limite.",
        theory: `# Fases

Progressão mantém o jogador motivado: ao atingir uma meta, o jogo sobe de fase e aumenta o desafio.

A regra é uma comparação com limite: se pontos chegarem ao alvo, fase aumenta. O limite da próxima fase costuma crescer.

Níveis, ligas e conquistas usam exatamente essa mecânica.`,
        starterCode: "let fase = 1;\nconst pontos = 30;\n// suba para a fase 2 quando pontos chegarem a 30\n",
        solution: 'let fase = 1;\nconst pontos = 30;\nif (pontos >= 30) {\n  fase = fase + 1;\n}\nconsole.log("fase " + fase);',
        expectedOutput: "fase 2",
        hints: ["Compare com pontos >= 30.", "Aumente com fase = fase + 1.", "Mostre a fase no final."],
        xpReward: 20,
        quiz: [makeQuiz("O que dispara a subida de fase?", ["A pontuação atingir o limite definido", "Qualquer clique", "O tempo parar", "Uma variável nova"], 0, "A progressão compara o estado atual com a meta da fase.")],
      }),
      createLesson({
        id: "13-8",
        title: "Placar e Recorde",
        description: "Compare a pontuação da partida com o recorde salvo.",
        theory: `# Recorde

O recorde dá motivo para jogar de novo: ao fim da partida, compare os pontos com o melhor resultado anterior.

Se a pontuação atual for maior, ela vira o novo recorde — e o jogador merece saber disso na hora.

Em um app real, o recorde seria salvo no armazenamento para sobreviver ao fechamento do jogo.`,
        starterCode: "const recorde = 80;\nconst pontos = 95;\n// mostre novo recorde se pontos superarem o recorde\n",
        solution: 'const recorde = 80;\nconst pontos = 95;\nif (pontos > recorde) {\n  console.log("novo recorde");\n}',
        expectedOutput: "novo recorde",
        hints: ["Compare pontos > recorde.", "Mostre a mensagem dentro do if.", "Maior que, não maior ou igual."],
        xpReward: 25,
        quiz: [makeQuiz("Quando a partida vira novo recorde?", ["Quando os pontos superam o melhor resultado anterior", "Quando o jogo abre", "Quando há empate sempre", "Quando as vidas acabam"], 0, "Recorde é comparação: só substitui quando o resultado atual é maior.")],
      }),
    ],
  };
}

const supplementalLessonEnhancements: Record<string, LessonEnhancement> = {
  "11-1": {
    contrastExample: {
      wrong: "export default function App() {\n  return <div><p>Olá, mobile!</p></div>;  // div/p não existem no celular\n}",
      right: "export default function App() {\n  return <View><Text>Olá, mobile!</Text></View>;\n}",
      explanation:
        "React Native **não renderiza HTML**: `div` e `p` não existem no celular e o app quebra. Use os componentes nativos `View` (container) e `Text` (texto) — texto solto fora de `Text` também é erro.",
    },
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
        code: "return <div><Text>CodeTier</Text></div>;",
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
    contrastExample: {
      wrong: 'const styles = StyleSheet.create({\n  container: { "background-color": "#fff" }  // nome de CSS web\n});',
      right: 'const styles = StyleSheet.create({\n  container: { backgroundColor: "#fff" }\n});',
      explanation:
        "Estilos no React Native são **objetos JavaScript**, não CSS: as propriedades usam camelCase (`backgroundColor`, `fontSize`). O nome com hífen não é aplicado.",
    },
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
    contrastExample: {
      wrong: 'let total = 0;\n<Button title="Somar" onPress={() => total = total + 1} />  // a tela não atualiza',
      right: 'const [total, setTotal] = useState(0);\n<Button title="Somar" onPress={() => setTotal(total + 1)} />',
      explanation:
        "Mudar uma variável comum **não redesenha a tela**: o React nem fica sabendo. Só `setTotal` avisa o React de que o estado mudou e a interface precisa atualizar.",
    },
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
    contrastExample: {
      wrong: "<ScrollView>\n  {tarefas.map((t) => <Text>{t}</Text>)}  /* renderiza TUDO de uma vez */\n</ScrollView>",
      right: "<FlatList data={tarefas} renderItem={({ item }) => <Text>{item}</Text>} />",
      explanation:
        "`map` dentro de ScrollView **renderiza todos os itens de uma vez** — com 1.000 itens o app trava. `FlatList` renderiza só o que está visível e recicla o resto.",
    },
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
    contrastExample: {
      wrong: 'let mostrarHome = true;\nlet mostrarDetalhes = false;\nlet mostrarPerfil = false;  // um booleano por tela vira bagunça',
      right: 'const telas = ["Home", "Detalhes", "Perfil"];\nlet telaAtual = "Home";  // um único estado diz onde o usuário está',
      explanation:
        "Um booleano por tela permite estados impossíveis (duas telas \"visíveis\" ao mesmo tempo). Modelar **uma tela atual** com nomes claros é a base que bibliotecas como React Navigation organizam para você.",
    },
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
    nextStep: "Agora capture o que o usuário digita com TextInput.",
    concepts: ["react-native", "navigation", "mobile-flow"],
  },
  "11-6": {
    contrastExample: {
      wrong: '<TextInput placeholder="Seu nome" />  // o texto digitado não vai para lugar nenhum',
      right: "<TextInput value={nome} onChangeText={setNome} placeholder=\"Seu nome\" />",
      explanation:
        "Sem `value` + `onChangeText`, o que o usuário digita **não entra no estado** — o app não consegue validar nem salvar. O par controlado mantém o estado como única fonte da verdade.",
    },
    module: "React Native: formulários",
    level: "Intermediário",
    estimatedMinutes: 9,
    learningObjective: "Capturar texto digitado com um campo controlado por estado.",
    analogy: "TextInput controlado é um interfone: cada tecla avisa o estado, e o estado decide o que aparece no campo.",
    example: "Uma tela de login usa dois TextInput controlados: e-mail e senha.",
    codeExample: "<TextInput value={nome} onChangeText={setNome} />",
    tryItPrompt: "Adicione um segundo TextInput para sobrenome com seu próprio estado.",
    commonMistake: "Usar onChange como na web. No React Native, a prop que entrega o texto direto é onChangeText.",
    reference: ["TextInput é o campo de texto nativo.", "value conecta o campo ao estado.", "onChangeText recebe o novo texto a cada tecla.", "placeholder mostra a dica antes de digitar."],
    practiceActivities: [
      {
        id: "11-6-fill-input",
        type: "fill-code",
        title: "Complete o campo controlado",
        prompt: "Complete a prop que recebe o texto digitado.",
        code: "<TextInput value={nome} ____={setNome} />",
        correctAnswer: "onChangeText",
        successFeedback: "Boa. onChangeText entrega cada alteração para o estado.",
        errorFeedback: "Quase. Na web seria onChange; no React Native é onChangeText.",
        hint: "O nome da prop termina com Text.",
      },
    ],
    summary: "Campos controlados mantêm o estado como única fonte da verdade do formulário.",
    nextStep: "Agora crie áreas tocáveis flexíveis com Pressable.",
    concepts: ["react-native", "forms", "state"],
  },
  "11-7": {
    contrastExample: {
      wrong: '<Pressable onPress={pular()}>  /* executa já na renderização */\n  <Text>Pular</Text>\n</Pressable>',
      right: '<Pressable onPress={pular}>\n  <Text>Pular</Text>\n</Pressable>',
      explanation:
        "`pular()` com parênteses **executa na hora** em que a tela renderiza, não no toque. Passe a **referência** (`pular`, sem parênteses) ou uma arrow `() => pular()`.",
    },
    module: "React Native: áreas de toque",
    level: "Intermediário",
    estimatedMinutes: 9,
    learningObjective: "Criar áreas de toque com feedback visual usando Pressable.",
    analogy: "Pressable é um adesivo sensível ao toque: cole sobre qualquer conteúdo e ele passa a reagir ao dedo.",
    example: "Um card de curso inteiro pode ser tocável envolvendo o conteúdo com Pressable.",
    codeExample: '<Pressable onPress={() => abrir()}><Text>Abrir</Text></Pressable>',
    tryItPrompt: "Envolva um card com Pressable e mude a opacidade enquanto pressionado.",
    commonMistake: "Chamar a função com parênteses dentro de onPress, executando a ação na renderização em vez de no toque.",
    reference: ["Pressable envolve qualquer conteúdo.", "onPress dispara a ação no toque.", "O estilo pode reagir ao estado pressed.", "Button é o atalho simples; Pressable é o flexível."],
    practiceActivities: [
      {
        id: "11-7-identify-press",
        type: "identify-error",
        title: "Ache o disparo errado",
        prompt: "Qual trecho faz a ação executar na renderização, não no toque?",
        code: "<Pressable onPress={salvar()}><Text>Salvar</Text></Pressable>",
        correctAnswer: "salvar()",
        successFeedback: "Isso. Os parênteses executam a função imediatamente.",
        errorFeedback: "Ainda não. Procure a chamada que acontece cedo demais.",
        hint: "Compare salvar com salvar().",
      },
    ],
    summary: "Pressable transforma qualquer componente em área de toque com feedback.",
    nextStep: "Agora exiba imagens com dimensões corretas.",
    concepts: ["react-native", "events", "mobile-ui"],
  },
  "11-8": {
    contrastExample: {
      wrong: '<Image source={{ uri: "https://exemplo.com/capy.png" }} />  /* nada aparece */',
      right: '<Image source={{ uri: "https://exemplo.com/capy.png" }} style={{ width: 120, height: 120 }} />',
      explanation:
        "Imagem remota **sem width/height renderiza com tamanho zero** — o bug clássico do \"cadê minha imagem?\". O layout nativo não conhece o tamanho antes de baixar; declare as dimensões.",
    },
    module: "React Native: mídia",
    level: "Intermediário",
    estimatedMinutes: 8,
    learningObjective: "Exibir imagens remotas com source e dimensões explícitas.",
    analogy: "Imagem remota é um quadro encomendado: reserve o espaço na parede antes de ele chegar, senão não há onde pendurar.",
    example: "Um avatar de perfil usa uri da foto e dimensões fixas com borderRadius.",
    codeExample: '<Image source={{ uri: url }} style={{ width: 96, height: 96 }} />',
    tryItPrompt: "Transforme a imagem em avatar redondo com borderRadius igual à metade da largura.",
    commonMistake: "Passar a URL como texto direto em source. Imagens remotas exigem o objeto { uri: url }.",
    reference: ["Image exibe imagens locais e remotas.", "source={{ uri }} carrega por URL.", "Imagem remota precisa de width e height.", "borderRadius arredonda o quadro."],
    practiceActivities: [
      {
        id: "11-8-fill-image",
        type: "fill-code",
        title: "Complete a origem",
        prompt: "Complete a chave que carrega a imagem por URL.",
        code: '<Image source={{ ____: "https://exemplo.com/capy.png" }} style={{ width: 96, height: 96 }} />',
        correctAnswer: "uri",
        successFeedback: "Boa. O objeto source usa a chave uri para imagens remotas.",
        errorFeedback: "Quase. A chave do endereço remoto tem três letras.",
        hint: "É a sigla de identificador uniforme de recurso.",
      },
    ],
    summary: "Imagens remotas pedem origem em { uri } e dimensões explícitas.",
    nextStep: "Combine componentes, estilos, estado, listas e navegação em um app simples.",
    concepts: ["react-native", "images", "mobile-ui"],
  },
  "12-1": {
    contrastExample: {
      wrong: "ids = [101, 102, 103]\nvendas = [100, 80, 120]\nprint(sum(ids))  # somou a coluna errada: 306 não é o total de vendas",
      right: "ids = [101, 102, 103]\nvendas = [100, 80, 120]\nprint(sum(vendas))  # 300",
      explanation:
        "Antes de calcular, entenda **o que cada coluna significa**. Somar a coluna errada produz um número que parece certo — e está completamente errado.",
    },
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
    contrastExample: {
      wrong: 'nome = "  ANA  "\nprint(nome == "ana")  # False: espaços e maiúsculas atrapalham',
      right: 'nome = "  ANA  "\nprint(nome.strip().lower() == "ana")  # True',
      explanation:
        "Dados reais vêm com espaços e capitalização misturada. Comparar **sem limpar** gera falsos negativos silenciosos — normalize com `strip()` e `lower()` antes de comparar.",
    },
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
    contrastExample: {
      wrong: "notas = [8, 7, 10]\nmedia = (8 + 7 + 10) / 3  # números copiados na mão",
      right: "notas = [8, 7, 10]\nmedia = sum(notas) / len(notas)",
      explanation:
        "Copiar os valores na mão quebra na primeira mudança da lista — e ninguém percebe. `sum()` e `len()` acompanham os dados reais, sempre.",
    },
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
    contrastExample: {
      wrong: 'prompt = "analise isso"  # sem objetivo, sem contexto, sem formato',
      right: 'prompt = "Resuma as vendas de março em 3 tópicos, destacando a maior queda e a causa provável."',
      explanation:
        "Prompt vago devolve resposta vaga. Um prompt bom é uma **especificação**: diz o objetivo, o dado, o formato da resposta e o critério do que importa.",
    },
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
    contrastExample: {
      wrong: 'print("Relatório: total 300, média 100")  # números digitados na mão, desatualizam',
      right: 'total = sum(vendas)\nmedia = total / len(vendas)\nprint(f"Relatório: total {total}, média {media}")',
      explanation:
        "Relatório com números **digitados** fica errado na primeira atualização dos dados. Calcule a partir da fonte e injete com f-string — o relatório se mantém sozinho.",
    },
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
    nextStep: "Agora filtre só os registros que importam para a análise.",
    concepts: ["automation", "reports", "workflow"],
  },
  "12-6": {
    contrastExample: {
      wrong: "vendas = [80, 120, 150, 90]\nmedia = sum(vendas) / len(vendas)  # a média mistura tudo, inclusive o que não interessa",
      right: "vendas = [80, 120, 150, 90]\naltas = [v for v in vendas if v > 100]\nmedia_altas = sum(altas) / len(altas)",
      explanation:
        "Calcular sobre **todos** os dados quando a pergunta é sobre um recorte distorce a resposta. Filtre primeiro, calcule depois.",
    },
    module: "Dados: preparação",
    level: "Intermediário",
    estimatedMinutes: 9,
    learningObjective: "Filtrar registros com list comprehension antes de calcular métricas.",
    analogy: "Filtrar é peneirar: primeiro separa o que interessa, depois pesa só o que ficou na peneira.",
    example: "Para analisar vendas altas, primeiro selecione as acima de 100, depois calcule a média delas.",
    codeExample: "altas = [v for v in vendas if v > 100]",
    tryItPrompt: "Filtre as vendas abaixo de 100 e calcule quantas são com len().",
    commonMistake: "Esquecer o if dentro da comprehension e copiar a lista inteira achando que filtrou.",
    reference: ["[v for v in lista] percorre a lista.", "if dentro da comprehension filtra.", "O resultado é uma lista nova.", "Filtre antes de calcular métricas."],
    practiceActivities: [
      {
        id: "12-6-predict-filter",
        type: "predict-output",
        title: "Preveja o filtro",
        prompt: "O que aparece?",
        code: "notas = [5, 8, 9, 4]\naprovadas = [n for n in notas if n >= 7]\nprint(aprovadas)",
        options: ["[8, 9]", "[5, 4]", "[5, 8, 9, 4]", "2"],
        correctAnswer: "[8, 9]",
        successFeedback: "Certo. Só 8 e 9 passam na regra n >= 7.",
        errorFeedback: "Ainda não. Aplique a condição a cada nota.",
        hint: "Quais notas são maiores ou iguais a 7?",
      },
    ],
    summary: "Você aprendeu a recortar os dados antes de calcular sobre eles.",
    nextStep: "Agora agrupe os registros por categoria.",
    concepts: ["lists", "filtering", "data-analysis"],
  },
  "12-7": {
    contrastExample: {
      wrong: 'contagem = {}\nfor c in categorias:\n    contagem[c] = contagem[c] + 1  # KeyError na primeira vez',
      right: 'contagem = {}\nfor c in categorias:\n    contagem[c] = contagem.get(c, 0) + 1',
      explanation:
        "Na primeira ocorrência da categoria, a chave **ainda não existe** e `contagem[c]` quebra com KeyError. `get(c, 0)` devolve zero quando a chave é nova.",
    },
    module: "Dados: análise",
    level: "Intermediário",
    estimatedMinutes: 10,
    learningObjective: "Agrupar e contar ocorrências por categoria usando dicionário.",
    analogy: "Agrupar é separar moedas em potes etiquetados: cada moeda nova vai para o pote da sua categoria, e no fim você conta cada pote.",
    example: "Contar vendas por categoria responde qual segmento mais vende.",
    codeExample: "contagem[c] = contagem.get(c, 0) + 1",
    tryItPrompt: "Some valores por categoria em vez de contar: total de vendas por segmento.",
    commonMistake: "Acessar a chave antes de ela existir. Use get(chave, 0) para inicializar contadores com segurança.",
    reference: ["Dicionário agrupa por chave.", "get(chave, 0) evita KeyError.", "O loop alimenta o agrupamento.", "É o GROUP BY do Python puro."],
    practiceActivities: [
      {
        id: "12-7-fill-counter",
        type: "fill-code",
        title: "Complete o contador",
        prompt: "Complete o método que devolve 0 para chaves novas.",
        code: "contagem[c] = contagem.____(c, 0) + 1",
        correctAnswer: "get",
        successFeedback: "Boa. get com valor padrão é o coração do contador.",
        errorFeedback: "Quase. É o método de leitura segura do dicionário.",
        hint: "Três letras, lê sem quebrar.",
      },
    ],
    summary: "Dicionários transformam listas de eventos em resumos por categoria.",
    nextStep: "Agora leia dados que chegam como texto separado por vírgulas.",
    concepts: ["dicts", "grouping", "data-analysis"],
  },
  "12-8": {
    contrastExample: {
      wrong: 'linha = "Ana,28,SP"\nprint(linha[0])  # imprime só a letra A',
      right: 'linha = "Ana,28,SP"\ncampos = linha.split(",")\nprint(campos[0])  # imprime Ana',
      explanation:
        "Indexar a **string** pega um caractere, não um campo. `split(\",\")` corta a linha em campos — aí sim a posição 0 é o nome inteiro.",
    },
    module: "Dados: importação",
    level: "Intermediário",
    estimatedMinutes: 9,
    learningObjective: "Transformar uma linha CSV em lista de campos com split.",
    analogy: "Uma linha CSV é um trem: a vírgula separa os vagões, e split desengata cada vagão para você acessar a carga.",
    example: "Cada linha de um relatório exportado vira uma lista de campos prontos para análise.",
    codeExample: 'campos = linha.split(",")',
    tryItPrompt: "Separe a linha e converta a idade para número com int(campos[1]).",
    commonMistake: "Esquecer que os campos separados continuam sendo texto. Converta números com int() ou float() antes de calcular.",
    reference: ['split(",") corta a linha em campos.', "O resultado é uma lista de strings.", "Acesse campos por posição.", "Converta números com int() ou float()."],
    practiceActivities: [
      {
        id: "12-8-predict-split",
        type: "predict-output",
        title: "Preveja o campo",
        prompt: "O que aparece?",
        code: 'linha = "Mouse,80,eletronicos"\ncampos = linha.split(",")\nprint(campos[2])',
        options: ["eletronicos", "Mouse", "80", "linha"],
        correctAnswer: "eletronicos",
        successFeedback: "Certo. A posição 2 guarda o terceiro campo.",
        errorFeedback: "Ainda não. Conte as posições a partir do zero.",
        hint: "0 é Mouse, 1 é 80...",
      },
    ],
    summary: "split transforma texto bruto em estrutura — o primeiro passo de toda importação.",
    nextStep: "Combine métricas, prompt e relatório em um mini projeto.",
    concepts: ["strings", "csv", "data-import"],
  },
  "13-1": {
    contrastExample: {
      wrong: "let pontos = 0;\nlet vidas = 3;\nlet fase = 1;\nlet tempo = 60;  // estado espalhado em variáveis soltas",
      right: "const jogo = { pontos: 0, vidas: 3, fase: 1, tempo: 60 };\nconsole.log(jogo.vidas);",
      explanation:
        "Estado espalhado em variáveis soltas dificulta salvar, reiniciar ou exibir o jogo. Um **objeto** agrupa tudo que descreve o momento atual em um lugar só.",
    },
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
    contrastExample: {
      wrong: "let pontos = 0;\nconst acertou = false;\npontos += 10;  // soma sempre, mesmo errando\nconsole.log(pontos);  // 10",
      right: "let pontos = 0;\nconst acertou = false;\nif (acertou) {\n  pontos += 10;\n}\nconsole.log(pontos);  // 0",
      explanation:
        "Regra é **condição + consequência**. Sem o `if`, a consequência acontece sempre — o jogador ganha ponto até errando, e o jogo perde o sentido.",
    },
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
    contrastExample: {
      wrong: 'console.log("rodada");\nconsole.log("rodada");\nconsole.log("rodada");  // e se forem 100 rodadas?',
      right: 'for (let rodada = 1; rodada <= 3; rodada++) {\n  console.log("rodada");\n}',
      explanation:
        "Copiar e colar a atualização não escala: 100 rodadas viram 100 linhas. O **loop** é o coração do jogo — repete a atualização com controle e um único lugar para mudar.",
    },
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
    contrastExample: {
      wrong: 'function pular() {\n  console.log("pulou");\n}\npular();  // pula sozinho, sem o jogador agir',
      right: 'function pular() {\n  console.log("pulou");\n}\nbotao.addEventListener("click", pular);  // pula quando o jogador clica',
      explanation:
        "Chamar a função direto executa a ação **no carregamento**, sem o jogador. Evento conecta a ação ao comando: o jogo só reage quando o jogador age. Note: `pular` sem parênteses — você entrega a função, não o resultado dela.",
    },
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
    contrastExample: {
      wrong: 'const pontos = 90;\nif (pontos = 100) {\n  console.log("venceu");  // = atribui, não compara: "vence" com 90 pontos\n}',
      right: 'const pontos = 90;\nif (pontos >= 100) {\n  console.log("venceu");\n}',
      explanation:
        "Um `=` sozinho **atribui** o valor (e o if vira sempre verdadeiro). A comparação usa `>=` ou `===` — a condição de vitória precisa testar o estado, não alterá-lo.",
    },
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
    nextStep: "Agora modele o outro lado: perda de vidas e derrota.",
    concepts: ["win-condition", "conditionals", "game-design"],
  },
  "13-6": {
    contrastExample: {
      wrong: 'let vidas = 1;\nif (vidas === 0) {\n  console.log("fim de jogo");  // verificou antes de descontar: nunca dispara\n}\nvidas = vidas - 1;',
      right: 'let vidas = 1;\nvidas = vidas - 1;\nif (vidas === 0) {\n  console.log("fim de jogo");\n}',
      explanation:
        "A **ordem** importa: verificando antes de descontar, a regra olha o estado antigo e o fim de jogo nunca dispara. Atualize o estado primeiro, verifique depois.",
    },
    module: "Jogos: risco e derrota",
    level: "Iniciante",
    estimatedMinutes: 8,
    learningObjective: "Implementar perda de vida e detecção de fim de jogo na ordem correta.",
    analogy: "É como descontar um crédito do cartão do fliperama: primeiro a máquina cobra, depois confere se ainda há saldo para continuar.",
    example: "O jogador erra a pergunta, perde uma vida e o jogo confere se acabou.",
    codeExample: 'vidas = vidas - 1;\nif (vidas === 0) { console.log("fim de jogo"); }',
    tryItPrompt: "Comece com 3 vidas e simule três erros seguidos até o fim de jogo.",
    commonMistake: "Verificar o fim de jogo antes de descontar a vida, lendo o estado desatualizado.",
    reference: ["Desconte a vida antes de verificar o fim.", "vidas === 0 detecta a derrota.", "Zero vidas encerra a rodada.", "O mesmo padrão limita tentativas em quizzes."],
    practiceActivities: [
      {
        id: "13-6-order-steps",
        type: "order-steps",
        title: "Ordene a perda de vida",
        prompt: "Coloque os passos na ordem correta.",
        options: ["Jogador erra", "Descontar uma vida", "Verificar se vidas chegou a 0", "Mostrar fim de jogo"],
        correctAnswer: ["Jogador erra", "Descontar uma vida", "Verificar se vidas chegou a 0", "Mostrar fim de jogo"],
        successFeedback: "Isso. Estado primeiro, verificação depois.",
        errorFeedback: "Quase. A verificação precisa olhar o estado já atualizado.",
        hint: "O desconto vem antes da conferência.",
      },
    ],
    summary: "Derrota é estado + ordem: desconta, depois verifica.",
    nextStep: "Agora recompense o progresso com fases.",
    concepts: ["game-state", "conditionals", "sequencing"],
  },
  "13-7": {
    contrastExample: {
      wrong: 'if (pontos >= 30) {\n  fase = 2;  // fixo: da fase 2 ela nunca mais sobe\n}',
      right: 'if (pontos >= 30) {\n  fase = fase + 1;  // sobe a partir da fase atual\n}',
      explanation:
        "Atribuir um número **fixo** trava a progressão: da fase 2 em diante a regra não muda mais nada. Incrementar a partir do estado atual funciona em qualquer fase.",
    },
    module: "Jogos: progressão",
    level: "Iniciante",
    estimatedMinutes: 8,
    learningObjective: "Subir de fase quando a pontuação atinge a meta.",
    analogy: "Fases são degraus de uma escada: a meta de pontos é a altura do degrau, e cada subida parte de onde você já está.",
    example: "Com 30 pontos o jogador passa da fase 1 para a 2; a próxima meta fica mais alta.",
    codeExample: "if (pontos >= meta) { fase = fase + 1; }",
    tryItPrompt: "Crie uma meta que dobra a cada fase: 30, 60, 120.",
    commonMistake: "Gravar a fase com número fixo em vez de incrementar a partir da fase atual.",
    reference: ["Compare pontos com a meta da fase.", "Incremente a fase a partir da atual.", "Metas crescentes mantêm o desafio.", "Ligas e níveis usam essa mecânica."],
    practiceActivities: [
      {
        id: "13-7-predict-fase",
        type: "predict-output",
        title: "Preveja a fase",
        prompt: "O que aparece?",
        code: 'let fase = 2;\nconst pontos = 50;\nif (pontos >= 30) {\n  fase = fase + 1;\n}\nconsole.log("fase " + fase);',
        options: ["fase 3", "fase 2", "fase 1", "fase 30"],
        correctAnswer: "fase 3",
        successFeedback: "Certo. A fase sobe a partir da atual: 2 vira 3.",
        errorFeedback: "Ainda não. A regra incrementa a fase atual, não volta para um número fixo.",
        hint: "fase = fase + 1 partindo de 2.",
      },
    ],
    summary: "Progressão é comparação com meta + incremento do estado atual.",
    nextStep: "Feche o ciclo comparando a partida com o recorde.",
    concepts: ["game-state", "progression", "conditionals"],
  },
  "13-8": {
    contrastExample: {
      wrong: 'if (pontos >= recorde) {\n  console.log("novo recorde");  // empate não é recorde novo\n}',
      right: 'if (pontos > recorde) {\n  console.log("novo recorde");\n}',
      explanation:
        "Empatar com o recorde **não** é superá-lo: com `>=` o jogo anuncia recorde novo em todo empate. Regras de borda (maior vs maior-ou-igual) merecem um teste mental com o caso exato.",
    },
    module: "Jogos: pontuação",
    level: "Iniciante",
    estimatedMinutes: 8,
    learningObjective: "Comparar a pontuação da partida com o recorde e anunciar superação.",
    analogy: "Recorde é a marca no batente da porta: só vale riscar uma nova quando a altura realmente passa da anterior.",
    example: "Fim de partida: 95 pontos contra recorde de 80 anuncia novo recorde.",
    codeExample: 'if (pontos > recorde) { console.log("novo recorde"); }',
    tryItPrompt: "Guarde o novo recorde em uma variável quando ele for superado.",
    commonMistake: "Usar >= e anunciar recorde novo em caso de empate com a marca anterior.",
    reference: ["Compare pontos > recorde.", "Empate não supera a marca.", "Atualize o recorde quando superado.", "Em apps reais, o recorde é salvo no armazenamento."],
    practiceActivities: [
      {
        id: "13-8-identify-record",
        type: "identify-error",
        title: "Ache a regra frouxa",
        prompt: "Qual operador faz o jogo anunciar recorde em empates?",
        code: 'if (pontos >= recorde) {\n  console.log("novo recorde");\n}',
        correctAnswer: ">=",
        successFeedback: "Isso. Maior ou igual aceita o empate; recorde pede maior estrito.",
        errorFeedback: "Ainda não. Olhe o operador da comparação.",
        hint: "Empate não deveria contar.",
      },
    ],
    summary: "Placar e recorde fecham o ciclo de motivação do jogador.",
    nextStep: "Use esses blocos para criar um protótipo jogável pequeno.",
    concepts: ["game-state", "comparison", "persistence"],
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
