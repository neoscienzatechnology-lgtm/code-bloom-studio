import {
  ArrowRight,
  Braces,
  Brain,
  Code2,
  Database,
  FileCode2,
  GitBranch,
  GitCommit,
  Globe2,
  LayoutGrid,
  Layers3,
  Network,
  Package,
  Palette,
  Play,
  Repeat2,
  Route,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Split,
  Table2,
  TerminalSquare,
  Workflow,
} from "lucide-react";

import { getVisualTone, type VisualTone } from "@/utils/visualTones";

interface LessonVisualAidProps {
  courseTitle?: string;
  language?: string;
  lessonTitle?: string;
  /** Single-column layout for narrow containers (e.g. the lesson card
   * player) — the default two-column grid assumes a wide panel. */
  stacked?: boolean;
}

export const LESSON_INFOGRAPHIC_SLUGS = [
  "programming-flow",
  "variables-memory",
  "data-types",
  "operators-transform",
  "condition-branch",
  "loops-cycle",
  "functions-block",
  "arrays-collections",
  "objects-state",
  "html-structure",
  "css-layout",
  "box-model",
  "dom-events",
  "api-request",
  "sql-data-flow",
  "git-versioning",
  "algorithms-strategy",
  "mobile-layers",
  "games-loop",
  "ai-prompt",
  "data-pipeline",
  "automation-workflow",
] as const;

export type LessonInfographicSlug = (typeof LESSON_INFOGRAPHIC_SLUGS)[number];

const LESSON_INFOGRAPHIC_BASE_PATH = "/lesson-infographics";

const LESSON_INFOGRAPHIC_ASSET_PATHS = Object.fromEntries(
  LESSON_INFOGRAPHIC_SLUGS.map((slug) => [slug, `${LESSON_INFOGRAPHIC_BASE_PATH}/${slug}.jpg`]),
) as Record<LessonInfographicSlug, string>;

function getLessonInfographicSrc(slug: LessonInfographicSlug) {
  return LESSON_INFOGRAPHIC_ASSET_PATHS[slug];
}

type ConceptVisual = {
  title: string;
  subtitle: string;
  steps: string[];
  checkpoints: string[];
  icon: typeof Code2;
  assetSlug?: LessonInfographicSlug;
  pattern:
    | "flow"
    | "layers"
    | "data"
    | "branch"
    | "variable"
    | "box"
    | "layout"
    | "dom"
    | "request"
    | "mobile"
    | "game"
    | "algorithm";
};

// Paleta por linguagem movida para @/utils/visualTones (compartilhada com os
// diagramas de conceito dos cartões).

function normalize(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const getTone = getVisualTone;

function getCourseIcon(language?: string) {
  const key = (language || "").toLowerCase();
  if (key.includes("python")) return TerminalSquare;
  if (key.includes("javascript")) return Braces;
  if (key.includes("react")) return Layers3;
  if (key.includes("css")) return Palette;
  if (key.includes("node")) return Server;
  if (key.includes("sql")) return Database;
  if (key.includes("git")) return GitBranch;
  if (key.includes("lógica") || key.includes("logica")) return Brain;
  if (key.includes("html")) return Globe2;
  return Code2;
}

function buildConcept(lessonTitle = "", language = ""): ConceptVisual {
  const key = normalize(`${lessonTitle} ${language}`);

  if (/estado do jogo|pontuacao|pontos/.test(key)) {
    return {
      title: "Estado e pontuação",
      subtitle: "O jogo guarda valores que mudam conforme o aluno joga.",
      steps: ["Estado", "Regra", "Placar"],
      checkpoints: ["Atualize valores", "Mostre retorno", "Reinicie quando preciso"],
      icon: TerminalSquare,
      pattern: "variable",
    };
  }

  if (/vitoria|derrota|fim de jogo/.test(key)) {
    return {
      title: "Condição de vitória",
      subtitle: "O jogo compara o estado atual para decidir se a partida terminou.",
      steps: ["Objetivo", "Teste", "Resultado"],
      checkpoints: ["Defina a regra", "Teste empate", "Evite final falso"],
      icon: Split,
      pattern: "branch",
    };
  }

  if (/eventos do jogador|tecla|controle|jogador/.test(key)) {
    return {
      title: "Entrada do jogador",
      subtitle: "Um comando do jogador dispara uma ação e altera a cena.",
      steps: ["Comando", "Função", "Movimento"],
      checkpoints: ["Escute o evento", "Limite a ação", "Mostre resposta"],
      icon: Play,
      pattern: "dom",
    };
  }

  if (/loop de atualizacao|game loop|canvas|sprite|colisao|collision/.test(key)) {
    return {
      title: "Loop do jogo",
      subtitle: "O jogo lê ações, atualiza o estado e desenha a próxima cena.",
      steps: ["Entrada", "Atualização", "Desenho"],
      checkpoints: ["Guarde o estado", "Repita em ciclos", "Teste colisões"],
      icon: Play,
      pattern: "game",
    };
  }

  if (/prompt/.test(key)) {
    return {
      title: "Prompt como especificação",
      subtitle: "Um bom prompt transforma intenção em instruções claras para a IA executar.",
      steps: ["Contexto", "Pedido", "Critério"],
      checkpoints: ["Dê objetivo", "Defina formato", "Revise a saída"],
      icon: Brain,
      pattern: "branch",
    };
  }

  if (/limpeza|metricas|relatorio|relatorios|dados como tabelas/.test(key)) {
    return {
      title: "Pipeline de dados",
      subtitle: "Dados ficam úteis quando passam por organização, limpeza e leitura.",
      steps: ["Entrada", "Tratamento", "Insight"],
      checkpoints: ["Padronize nomes", "Remova ruído", "Explique o resultado"],
      icon: Table2,
      pattern: "data",
    };
  }

  if (/automacao|automatizar/.test(key)) {
    return {
      title: "Automação guiada",
      subtitle: "Uma rotina automática pega dados, executa passos e entrega um resultado.",
      steps: ["Gatilho", "Processo", "Entrega"],
      checkpoints: ["Valide entrada", "Registre falhas", "Confira saída"],
      icon: Workflow,
      pattern: "request",
    };
  }

  if (/\bwhere\b|\band\b|\bor\b|\bnot\b(?!\s+null)|\bhaving\b|filtro|filtrar/.test(key)) {
    return {
      title: "Filtro de registros",
      subtitle: "A consulta testa cada linha e mantém apenas o que atende à regra.",
      steps: ["Linha", "Condição", "Resultado"],
      checkpoints: ["Filtre cedo", "Use parênteses", "Teste casos limite"],
      icon: Split,
      pattern: "branch",
    };
  }

  if (/join|juntar tabelas/.test(key)) {
    return {
      title: "Junção de tabelas",
      subtitle: "O JOIN conecta registros relacionados para responder perguntas maiores.",
      steps: ["Tabela A", "Chave", "Tabela B"],
      checkpoints: ["Escolha a chave", "Evite duplicar", "Confira nulos"],
      icon: Table2,
      pattern: "data",
    };
  }

  if (/insert|update|delete|create table|constraints|not null|unique/.test(key)) {
    return {
      title: "Mudança segura no banco",
      subtitle: "Antes de alterar dados, entenda o alvo e confirme o impacto.",
      steps: ["Alvo", "Alteração", "Conferência"],
      checkpoints: ["Visualize antes", "Use condição", "Confirme depois"],
      icon: Database,
      pattern: "request",
    };
  }

  if (/order by|limit|group by|count|relatorio|biblioteca/.test(key)) {
    return {
      title: "Resumo para leitura",
      subtitle: "Ordenar, limitar e agrupar transforma linhas soltas em informação útil.",
      steps: ["Dados", "Resumo", "Leitura"],
      checkpoints: ["Agrupe certo", "Ordene para comparar", "Mostre só o necessário"],
      icon: Table2,
      pattern: "data",
    };
  }

  if (/remoto|push|pull/.test(key)) {
    return {
      title: "Sincronização com remoto",
      subtitle: "Seu repositório local conversa com uma cópia online para compartilhar mudanças.",
      steps: ["Local", "Remoto", "Atualização"],
      checkpoints: ["Puxe antes", "Resolva conflitos", "Envie com clareza"],
      icon: Route,
      pattern: "request",
    };
  }

  if (/merge|conflito|pull request/.test(key)) {
    return {
      title: "Integração segura",
      subtitle: "Antes de juntar mudanças, revise o caminho e resolva divergências.",
      steps: ["Comparar", "Resolver", "Juntar"],
      checkpoints: ["Leia o diff", "Teste depois", "Explique o PR"],
      icon: GitCommit,
      pattern: "branch",
    };
  }

  if (/branches|branch/.test(key)) {
    return {
      title: "Ramo de trabalho",
      subtitle: "Uma branch separa uma ideia sem bagunçar a linha principal.",
      steps: ["Base", "Ramo", "Retorno"],
      checkpoints: ["Nomeie a tarefa", "Commits pequenos", "Integre no fim"],
      icon: GitBranch,
      pattern: "branch",
    };
  }

  if (/\bdiff\b|\blog\b/.test(key)) {
    return {
      title: "Histórico legível",
      subtitle: "O Git mostra o que mudou e quando, para você revisar com segurança.",
      steps: ["Mudança", "Comparação", "Registro"],
      checkpoints: ["Leia antes", "Procure intenção", "Volte se precisar"],
      icon: GitCommit,
      pattern: "data",
    };
  }

  if (/gitignore|arquivos locais/.test(key)) {
    return {
      title: "Arquivos rastreados",
      subtitle: "Nem todo arquivo precisa entrar no histórico do projeto.",
      steps: ["Arquivo", "Regra", "Histórico"],
      checkpoints: ["Ignore segredos", "Evite lixo local", "Revise status"],
      icon: FileCode2,
      pattern: "layers",
    };
  }

  if (/git|branch|merge|commit|pull request|stash|rebase|ignore|conflito/.test(key)) {
    return {
      title: "Linha do tempo do código",
      subtitle: "Cada mudança vira um ponto rastreável antes de entrar no projeto.",
      steps: ["Alteração", "Commit", "Integração"],
      checkpoints: ["Commits pequenos", "Histórico legível", "Revise antes de juntar"],
      icon: GitCommit,
      pattern: "branch",
    };
  }

  if (/sql|select|insert|update|join|group|table|tabela|database|banco|indice|índice/.test(key)) {
    return {
      title: "Fluxo dos dados",
      subtitle: "Dados entram, filtros reduzem ruído e a consulta entrega uma visão útil.",
      steps: ["Fonte", "Filtro/Junção", "Resultado"],
      checkpoints: ["Escolha colunas", "Filtre cedo", "Ordene para ler melhor"],
      icon: Table2,
      pattern: "data",
    };
  }

  if (/backend|request|response|requisicao|resposta|async|await|promise|fetch|\bexpress\b|rota|crud|jwt|api|server/.test(key)) {
    return {
      title: "Caminho da requisição",
      subtitle: "A chamada sai do cliente, passa pelo servidor e volta como resposta confiável.",
      steps: ["Pedido", "Processamento", "Resposta"],
      checkpoints: ["Trate erros", "Valide dados", "Responda com clareza"],
      icon: Route,
      pattern: "request",
    };
  }

  if (/variavel|variaveis|const|let|string|numero|number|boolean|texto|tipo de dado|tipos de dado|input|print|estado/.test(key)) {
    return {
      title: "Memória com nome",
      subtitle: "Uma variável guarda uma informação para o programa lembrar e reutilizar.",
      steps: ["Nome", "Valor", "Uso"],
      checkpoints: ["Nome claro", "Tipo correto", "Reutilize depois"],
      icon: TerminalSquare,
      pattern: "variable",
    };
  }

  if (/\bif\b|\belse\b|condicion|\bwhere\b|validacao|validation|\baria\b|acessibilidade|comparac/.test(key)) {
    return {
      title: "Mapa de decisão",
      subtitle: "Leia a condição, escolha o caminho e valide o resultado.",
      steps: ["Pergunta", "Teste lógico", "Caminho escolhido"],
      checkpoints: ["Compare com clareza", "Cubra o caso contrário", "Teste valores limite"],
      icon: Split,
      pattern: "branch",
    };
  }

  if (/loop|for|while|map|filter|listas|array|fila|pilha|stack|queue|bfs/.test(key)) {
    return {
      title: "Ciclo de repetição",
      subtitle: "Um bloco pequeno resolve muitos itens, um por vez.",
      steps: ["Coleção", "Item atual", "Ação repetida"],
      checkpoints: ["Defina o intervalo", "Atualize o estado", "Evite repetir código"],
      icon: Repeat2,
      pattern: "flow",
    };
  }

  if (/operador|expressao|expressões|calculo|calcular|aritmetica|resultado/.test(key)) {
    return {
      title: "Transformação de valores",
      subtitle: "Operadores combinam dados e geram um novo resultado para o programa usar.",
      steps: ["Valor A", "Operador", "Resultado"],
      checkpoints: ["Leia a ordem", "Confira o tipo", "Preveja a saída"],
      icon: Workflow,
      pattern: "flow",
    };
  }

  if (/func|arrow|lambda|custom hook|modulos|imports|component|props|middleware|mvc/.test(key)) {
    return {
      title: "Bloco reutilizável",
      subtitle: "Entrada clara, transformação previsível e saída fácil de testar.",
      steps: ["Entrada", "Responsabilidade", "Retorno"],
      checkpoints: ["Nomeie pela intenção", "Mantenha pequeno", "Teste isolado"],
      icon: Package,
      pattern: "layers",
    };
  }

  if (/react native|view|stylesheet|touch|flatlist|navegacao|mobile/.test(key)) {
    return {
      title: "Tela mobile em camadas",
      subtitle: "A interface combina estrutura, estilo e interação de toque em uma tela pequena.",
      steps: ["Componente", "Estilo", "Toque"],
      checkpoints: ["Respeite espaço", "Teste no celular", "Dê retorno visual"],
      icon: Smartphone,
      pattern: "mobile",
    };
  }

  if (/dom|evento|click|botao|button|alterando texto|tela|estado/.test(key)) {
    return {
      title: "Evento muda a tela",
      subtitle: "Uma ação do usuário dispara código e atualiza o que aparece na interface.",
      steps: ["Ação", "Função", "Mudança"],
      checkpoints: ["Escute o evento", "Atualize o estado", "Mostre feedback"],
      icon: Play,
      pattern: "dom",
    };
  }

  if (/box model|padding|margin|border|espacamento|largura|altura/.test(key)) {
    return {
      title: "Box model sem mistério",
      subtitle: "Cada elemento tem conteúdo, respiro interno, borda e distância externa.",
      steps: ["Conteúdo", "Padding/Borda", "Margin"],
      checkpoints: ["Meça o espaço", "Evite aperto", "Separe blocos"],
      icon: Palette,
      pattern: "box",
    };
  }

  if (/flex|grid|responsiv|media|position|layout/.test(key)) {
    return {
      title: "Layout responsivo",
      subtitle: "Organize blocos para a interface continuar clara em telas diferentes.",
      steps: ["Container", "Regras", "Adaptação"],
      checkpoints: ["Defina direção", "Controle quebras", "Teste larguras"],
      icon: LayoutGrid,
      pattern: "layout",
    };
  }

  if (/html|css|seletores|semantico|meta|seo|form|links|imagem|tag|heading|section/.test(key)) {
    return {
      title: "Camadas da interface",
      subtitle: "Estrutura, aparência e acessibilidade trabalham juntas.",
      steps: ["Estrutura", "Estilo", "Experiência"],
      checkpoints: ["Use semântica", "Organize o layout", "Cuide do acesso"],
      icon: FileCode2,
      pattern: "layers",
    };
  }

  if (/big o|complexidade|sort|ordenacao|busca|recurs|hash|arvore|grafo|lista encadeada/.test(key)) {
    return {
      title: "Estratégia do algoritmo",
      subtitle: "Escolha a estrutura certa para reduzir trabalho e deixar a solução previsível.",
      steps: ["Entrada", "Estratégia", "Custo"],
      checkpoints: ["Meça o crescimento", "Use a estrutura certa", "Teste casos pequenos"],
      icon: Network,
      pattern: "algorithm",
    };
  }

  return {
    title: "Ideia central da lição",
    subtitle: "Transforme o conceito em passos pequenos antes de escrever código.",
    steps: ["Conceito", "Exemplo", "Prática"],
    checkpoints: ["Entenda o nome", "Copie um padrão", "Adapte sozinho"],
    icon: Workflow,
    pattern: "flow",
  };
}

function resolveConceptAssetSlug(
  courseTitle = "",
  language = "",
  lessonTitle = "",
  concept: ConceptVisual,
): LessonInfographicSlug {
  const key = normalize(`${courseTitle} ${language} ${lessonTitle} ${concept.title} ${concept.subtitle}`);
  const conceptKey = normalize(`${concept.title} ${lessonTitle}`);

  if (/tipo de dado|tipos de dado|string|texto|numero|number|boolean|verdadeiro|falso/.test(key)) return "data-types";
  if (/memoria com nome|estado e pontuacao/.test(conceptKey)) return "variables-memory";
  if (/react native|mobile|view|stylesheet|touch|flatlist|navegacao|celular/.test(key)) return "mobile-layers";
  if (/jogo|game|pontuacao|vitoria|derrota|jogador|canvas|sprite|colisao/.test(key)) return "games-loop";
  if (/automacao|automatizar|workflow|gatilho/.test(key)) return "automation-workflow";
  if (/limpeza|metrica|metricas|relatorio|relatorios|pipeline de dados|dados como tabelas|insight/.test(key)) return "data-pipeline";
  if (/prompt|inteligencia artificial/.test(key) || /\bia\b/.test(conceptKey)) return "ai-prompt";
  if (/git|branch|branches|commit|merge|pull request|remoto|push|pull|diff|version/.test(key)) return "git-versioning";
  if (/big o|complexidade|sort|ordenacao|busca|recurs|hash|arvore|grafo|fila|pilha|algoritmo/.test(key)) return "algorithms-strategy";
  if (/sql|select|insert|update|delete|join|group|table|tabela|database|banco|where|having|consulta/.test(key)) return "sql-data-flow";
  if (/backend|request|response|requisicao|resposta|async|await|promise|fetch|express|rota|crud|jwt|api|server|servidor/.test(key)) return "api-request";
  if (/box model|padding|margin|border|espacamento|largura|altura/.test(key)) return "box-model";
  if (/css|flex|grid|responsiv|media|position|layout|seletores/.test(key)) return "css-layout";
  if (/html|semantico|semantica|meta|seo|\bform\b|formulario|links|imagem|tag|heading|section/.test(key)) return "html-structure";
  if (/dom|evento|click|botao|button|alterando texto|tela|usuario/.test(key)) return "dom-events";
  if (/array|arrays|lista|listas|colecao|colecoes|map|filter/.test(key)) return "arrays-collections";
  if (/objeto|objetos|object|objects|estado estruturado|propriedade/.test(key)) return "objects-state";
  if (/operador|expressao|expressoes|calculo|calcular|aritmetica|resultado|transformacao de valores/.test(key)) return "operators-transform";
  if (/condicao|condicional|decisao|\bif\b|\belse\b|validacao|validation|comparac|filtro/.test(key)) return "condition-branch";
  if (/loop|\bfor\b|\bwhile\b|repeti|ciclo/.test(key)) return "loops-cycle";
  if (/func|arrow|lambda|custom hook|modulos|imports|component|props|middleware|mvc|reutiliz/.test(key)) return "functions-block";
  if (/variavel|variaveis|const|let|input|print|memoria|estado/.test(key)) return "variables-memory";

  if (concept.pattern === "variable") return "variables-memory";
  if (concept.pattern === "branch") return "condition-branch";
  if (concept.pattern === "data") return "sql-data-flow";
  if (concept.pattern === "request") return "api-request";
  if (concept.pattern === "box") return "box-model";
  if (concept.pattern === "layout") return "css-layout";
  if (concept.pattern === "dom") return "dom-events";
  if (concept.pattern === "mobile") return "mobile-layers";
  if (concept.pattern === "game") return "games-loop";
  if (concept.pattern === "algorithm") return "algorithms-strategy";
  if (concept.pattern === "layers") return "functions-block";

  return "programming-flow";
}

export function getLessonVisualConcept(courseTitle = "", language = "", lessonTitle = ""): ConceptVisual & {
  assetSlug: LessonInfographicSlug;
} {
  const concept = buildConcept(lessonTitle, language);
  return {
    ...concept,
    assetSlug: resolveConceptAssetSlug(courseTitle, language, lessonTitle, concept),
  };
}

const PatternArtwork = ({ concept, tone }: { concept: ConceptVisual; tone: VisualTone }) => {
  const Icon = concept.icon;

  if (concept.pattern === "variable") {
    return (
      <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
        <rect width="520" height="250" rx="20" fill={tone.bg} />
        <rect x="62" y="72" width="132" height="106" rx="22" fill="#ffffff" stroke={tone.primary} strokeWidth="4" />
        <rect x="216" y="72" width="132" height="106" rx="22" fill="#ffffff" stroke={tone.secondary} strokeWidth="4" />
        <rect x="370" y="72" width="88" height="106" rx="22" fill="#ffffff" stroke={tone.accent} strokeWidth="4" />
        <path d="M88 104H168M88 132H148M242 104H322M242 132H302M392 108H434M392 136H426" stroke={tone.soft} strokeWidth="8" strokeLinecap="round" />
        <path d="M194 125H216M348 125H370" stroke={tone.text} strokeWidth="5" strokeLinecap="round" />
        <foreignObject x="256" y="101" width="52" height="52">
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
            <Icon size={28} />
          </div>
        </foreignObject>
      </svg>
    );
  }

  if (concept.pattern === "box") {
    return (
      <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
        <rect width="520" height="250" rx="20" fill={tone.bg} />
        <rect x="78" y="36" width="364" height="178" rx="28" fill="#ffffff" stroke={tone.accent} strokeWidth="5" />
        <rect x="122" y="66" width="276" height="120" rx="22" fill={tone.soft} stroke={tone.secondary} strokeWidth="5" />
        <rect x="178" y="98" width="164" height="58" rx="16" fill="#ffffff" stroke={tone.primary} strokeWidth="5" />
        <path d="M86 226H434M260 36V66M260 186V214M78 126H122M398 126H442" stroke={tone.text} strokeWidth="4" strokeLinecap="round" opacity="0.45" />
        <foreignObject x="234" y="103" width="52" height="52">
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
            <Icon size={28} />
          </div>
        </foreignObject>
      </svg>
    );
  }

  if (concept.pattern === "layout") {
    return (
      <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
        <rect width="520" height="250" rx="20" fill={tone.bg} />
        <rect x="56" y="46" width="408" height="158" rx="22" fill="#ffffff" stroke={tone.primary} strokeWidth="4" />
        <rect x="84" y="76" width="118" height="98" rx="16" fill={tone.soft} stroke={tone.secondary} strokeWidth="4" />
        <rect x="222" y="76" width="82" height="42" rx="14" fill="#ffffff" stroke={tone.accent} strokeWidth="4" />
        <rect x="222" y="136" width="82" height="38" rx="14" fill="#ffffff" stroke={tone.accent} strokeWidth="4" />
        <rect x="324" y="76" width="112" height="98" rx="16" fill={tone.soft} stroke={tone.secondary} strokeWidth="4" />
        <path d="M104 102H182M104 132H164M344 102H416M344 132H398" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
        <foreignObject x="238" y="100" width="48" height="48">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm">
            <Icon size={26} />
          </div>
        </foreignObject>
      </svg>
    );
  }

  if (concept.pattern === "dom") {
    return (
      <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
        <rect width="520" height="250" rx="20" fill={tone.bg} />
        <rect x="72" y="50" width="176" height="150" rx="22" fill="#ffffff" stroke={tone.primary} strokeWidth="4" />
        <rect x="96" y="78" width="128" height="18" rx="9" fill={tone.soft} />
        <rect x="96" y="118" width="92" height="34" rx="12" fill={tone.secondary} opacity="0.85" />
        <path d="M248 126C300 126 302 82 352 82" stroke={tone.accent} strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M248 126C300 126 302 170 352 170" stroke={tone.primary} strokeWidth="8" strokeLinecap="round" fill="none" />
        <rect x="352" y="54" width="102" height="58" rx="18" fill="#ffffff" stroke={tone.secondary} strokeWidth="4" />
        <rect x="352" y="142" width="102" height="58" rx="18" fill="#ffffff" stroke={tone.primary} strokeWidth="4" />
        <foreignObject x="136" y="110" width="48" height="48">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm">
            <Icon size={26} />
          </div>
        </foreignObject>
      </svg>
    );
  }

  if (concept.pattern === "request") {
    return (
      <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
        <rect width="520" height="250" rx="20" fill={tone.bg} />
        <rect x="58" y="72" width="110" height="100" rx="20" fill="#ffffff" stroke={tone.primary} strokeWidth="4" />
        <rect x="206" y="52" width="108" height="140" rx="22" fill="#ffffff" stroke={tone.secondary} strokeWidth="4" />
        <ellipse cx="410" cy="82" rx="58" ry="18" fill="#ffffff" stroke={tone.accent} strokeWidth="4" />
        <path d="M352 82V166C352 176 378 186 410 186C442 186 468 176 468 166V82" fill="#ffffff" stroke={tone.accent} strokeWidth="4" />
        <path d="M168 104H206M314 104H352M352 150H314M206 150H168" stroke={tone.text} strokeWidth="5" strokeLinecap="round" />
        <path d="M86 102H140M86 132H128M232 88H288M232 120H288M232 152H274" stroke={tone.soft} strokeWidth="8" strokeLinecap="round" />
        <foreignObject x="236" y="96" width="48" height="48">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm">
            <Icon size={26} />
          </div>
        </foreignObject>
      </svg>
    );
  }

  if (concept.pattern === "mobile") {
    return (
      <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
        <rect width="520" height="250" rx="20" fill={tone.bg} />
        <rect x="170" y="30" width="180" height="196" rx="34" fill="#ffffff" stroke={tone.primary} strokeWidth="5" />
        <rect x="194" y="66" width="132" height="40" rx="14" fill={tone.soft} />
        <rect x="194" y="122" width="132" height="32" rx="14" fill="#ffffff" stroke={tone.secondary} strokeWidth="4" />
        <rect x="194" y="168" width="84" height="32" rx="14" fill={tone.accent} opacity="0.85" />
        <circle cx="318" cy="184" r="18" fill="#ffffff" stroke={tone.accent} strokeWidth="4" />
        <path d="M112 106H166M354 106H408M380 130L430 160" stroke={tone.text} strokeWidth="5" strokeLinecap="round" opacity="0.55" />
        <foreignObject x="236" y="112" width="48" height="48">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm">
            <Icon size={26} />
          </div>
        </foreignObject>
      </svg>
    );
  }

  if (concept.pattern === "game") {
    return (
      <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
        <rect width="520" height="250" rx="20" fill={tone.bg} />
        <rect x="62" y="52" width="396" height="146" rx="22" fill="#ffffff" stroke={tone.primary} strokeWidth="4" />
        <rect x="92" y="150" width="142" height="28" rx="10" fill={tone.accent} opacity="0.9" />
        <rect x="294" y="132" width="72" height="46" rx="10" fill={tone.soft} stroke={tone.secondary} strokeWidth="4" />
        <circle cx="402" cy="88" r="18" fill={tone.secondary} opacity="0.9" />
        <path d="M144 126h28v-28h28v28h28v28h-84z" fill={tone.primary} opacity="0.9" />
        <path d="M260 86C300 58 342 58 382 86" stroke={tone.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray="12 12" fill="none" />
        <path d="M372 82l14 5-8 12" stroke={tone.accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <foreignObject x="236" y="104" width="48" height="48">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm">
            <Icon size={26} />
          </div>
        </foreignObject>
      </svg>
    );
  }

  if (concept.pattern === "algorithm") {
    return (
      <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
        <rect width="520" height="250" rx="20" fill={tone.bg} />
        {[80, 136, 192, 248, 304, 360].map((x, index) => (
          <rect
            key={x}
            x={x}
            y={154 - index * 14}
            width="34"
            height={48 + index * 14}
            rx="10"
            fill={index % 2 ? tone.secondary : tone.primary}
            opacity="0.82"
          />
        ))}
        <path d="M70 196H434" stroke={tone.text} strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        <circle cx="386" cy="84" r="34" fill="#ffffff" stroke={tone.accent} strokeWidth="5" />
        <path d="M410 108L448 146" stroke={tone.accent} strokeWidth="8" strokeLinecap="round" />
        <foreignObject x="362" y="60" width="48" height="48">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-white text-slate-900">
            <Icon size={26} />
          </div>
        </foreignObject>
      </svg>
    );
  }

  if (concept.pattern === "branch") {
    return (
      <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
        <rect width="520" height="250" rx="20" fill={tone.bg} />
        <path d="M130 125H240" stroke={tone.primary} strokeWidth="10" strokeLinecap="round" />
        <path d="M240 125C310 125 310 65 385 65" stroke={tone.secondary} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M240 125C310 125 310 185 385 185" stroke={tone.accent} strokeWidth="10" strokeLinecap="round" fill="none" />
        {[130, 240, 385, 385].map((cx, index) => (
          <circle key={index} cx={cx} cy={index === 2 ? 65 : index === 3 ? 185 : 125} r="29" fill="#ffffff" stroke={tone.primary} strokeWidth="4" />
        ))}
        <foreignObject x="102" y="97" width="56" height="56">
          <div className="flex h-full w-full items-center justify-center text-slate-900">
            <Icon size={28} />
          </div>
        </foreignObject>
        <text x="380" y="70" fill={tone.text} fontSize="18" fontWeight="800">sim</text>
        <text x="380" y="190" fill={tone.text} fontSize="18" fontWeight="800">não</text>
        <path d="M75 208H445" stroke={tone.soft} strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (concept.pattern === "data") {
    return (
      <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
        <rect width="520" height="250" rx="20" fill={tone.bg} />
        {[75, 190, 305].map((x, i) => (
          <g key={x}>
            <rect x={x} y={58 + i * 22} width="130" height="92" rx="16" fill="#ffffff" stroke={i === 1 ? tone.secondary : tone.primary} strokeWidth="4" />
            <path d={`M${x + 22} ${88 + i * 22}H${x + 108}`} stroke={tone.soft} strokeWidth="8" strokeLinecap="round" />
            <path d={`M${x + 22} ${116 + i * 22}H${x + 78}`} stroke={tone.accent} strokeWidth="8" strokeLinecap="round" />
          </g>
        ))}
        <path d="M180 105H214M295 130H329" stroke={tone.text} strokeWidth="5" strokeLinecap="round" />
        <foreignObject x="232" y="82" width="58" height="58">
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
            <Icon size={30} />
          </div>
        </foreignObject>
      </svg>
    );
  }

  if (concept.pattern === "layers") {
    return (
      <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
        <rect width="520" height="250" rx="20" fill={tone.bg} />
        <rect x="118" y="58" width="284" height="58" rx="18" fill="#ffffff" stroke={tone.primary} strokeWidth="4" />
        <rect x="92" y="104" width="336" height="62" rx="18" fill="#ffffff" stroke={tone.secondary} strokeWidth="4" />
        <rect x="66" y="154" width="388" height="66" rx="18" fill="#ffffff" stroke={tone.accent} strokeWidth="4" />
        <foreignObject x="230" y="104" width="60" height="60">
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
            <Icon size={30} />
          </div>
        </foreignObject>
        <path d="M135 82H385M116 128H210M310 128H404M100 181H420" stroke={tone.soft} strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 520 250" role="img" aria-label={concept.title} className="h-full w-full">
      <rect width="520" height="250" rx="20" fill={tone.bg} />
      {[82, 225, 368].map((x, i) => (
        <g key={x}>
          <rect x={x} y="72" width="92" height="92" rx="24" fill="#ffffff" stroke={i === 1 ? tone.secondary : tone.primary} strokeWidth="4" />
          <circle cx={x + 46} cy="118" r="21" fill={i === 2 ? tone.accent : tone.soft} />
          {i < 2 && <path d={`M${x + 105} 118H${x + 128}`} stroke={tone.text} strokeWidth="5" strokeLinecap="round" />}
        </g>
      ))}
      <foreignObject x="238" y="96" width="44" height="44">
        <div className="flex h-full w-full items-center justify-center text-slate-900">
          <Icon size={28} />
        </div>
      </foreignObject>
      <path d="M92 198H428" stroke={tone.soft} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};

const LessonVisualAid = ({ courseTitle, language, lessonTitle, stacked = false }: LessonVisualAidProps) => {
  const tone = getTone(language);
  const CourseIcon = getCourseIcon(language);
  const concept = getLessonVisualConcept(courseTitle, language, lessonTitle);
  const infographicSrc = getLessonInfographicSrc(concept.assetSlug);
  const infographicAlt = `Arte didática da aula ${lessonTitle || concept.title}: ${concept.subtitle}`;

  return (
    <figure className="mb-5 overflow-hidden rounded-xl border border-border bg-background shadow-sm sm:rounded-2xl">
      <div className={stacked ? "grid gap-0" : "grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]"}>
        <div className="relative min-h-[190px] overflow-hidden bg-secondary/30 p-2 sm:min-h-[250px] sm:p-3">
          <div className="absolute inset-2 overflow-hidden rounded-2xl opacity-70 sm:inset-3">
            <PatternArtwork concept={concept} tone={tone} />
          </div>
          <img
            src={infographicSrc}
            alt={infographicAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.opacity = "0";
              event.currentTarget.setAttribute("aria-hidden", "true");
            }}
          />
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-black text-slate-900 shadow-sm sm:left-5 sm:top-5 sm:text-xs">
            <CourseIcon size={15} />
            {language || courseTitle || "Aula"}
          </div>
        </div>

        <figcaption className="flex flex-col justify-center p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-primary">
            <Sparkles size={14} /> Infográfico premium
          </div>
          <h3 className="text-lg font-black text-foreground">{concept.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{concept.subtitle}</p>

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
            {concept.steps.map((step, index) => (
              <div key={step} className="contents">
                <div className="min-h-12 min-w-0 rounded-xl border border-border bg-card px-2 py-2 text-center text-[11px] font-black leading-tight text-foreground sm:min-h-16 sm:px-3 sm:py-3 sm:text-xs">
                  {step}
                </div>
                {index < concept.steps.length - 1 && (
                  <ArrowRight size={15} className="mx-auto text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          <div className={stacked ? "mt-4 grid grid-cols-3 gap-2" : "mt-4 grid grid-cols-3 gap-2 lg:grid-cols-1 xl:grid-cols-3"}>
            {concept.checkpoints.map((item) => (
              <div key={item} className="flex items-start gap-1.5 rounded-lg bg-secondary/60 px-2 py-2 text-[10px] leading-tight text-muted-foreground sm:gap-2 sm:px-3 sm:text-xs">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </figcaption>
      </div>
    </figure>
  );
};

export default LessonVisualAid;
