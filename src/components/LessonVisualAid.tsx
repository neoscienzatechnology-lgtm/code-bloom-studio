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
  Layers3,
  ListTree,
  Network,
  Package,
  Palette,
  Play,
  Repeat2,
  Route,
  Server,
  ShieldCheck,
  Sparkles,
  Split,
  Table2,
  TerminalSquare,
  Workflow,
} from "lucide-react";

interface LessonVisualAidProps {
  courseTitle?: string;
  language?: string;
  lessonTitle?: string;
}

type VisualTone = {
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  soft: string;
};

type ConceptVisual = {
  title: string;
  subtitle: string;
  steps: string[];
  checkpoints: string[];
  icon: typeof Code2;
  pattern: "flow" | "layers" | "data" | "branch";
};

const languageTones: Record<string, VisualTone> = {
  python: {
    bg: "#f7fee7",
    primary: "#2563eb",
    secondary: "#facc15",
    accent: "#16a34a",
    text: "#172554",
    soft: "#dbeafe",
  },
  javascript: {
    bg: "#fef9c3",
    primary: "#ca8a04",
    secondary: "#111827",
    accent: "#0891b2",
    text: "#1f2937",
    soft: "#fef3c7",
  },
  react: {
    bg: "#ecfeff",
    primary: "#0891b2",
    secondary: "#7c3aed",
    accent: "#0f766e",
    text: "#164e63",
    soft: "#cffafe",
  },
  css: {
    bg: "#eff6ff",
    primary: "#2563eb",
    secondary: "#ec4899",
    accent: "#f97316",
    text: "#1e3a8a",
    soft: "#dbeafe",
  },
  "node.js": {
    bg: "#f0fdf4",
    primary: "#15803d",
    secondary: "#365314",
    accent: "#0f766e",
    text: "#14532d",
    soft: "#dcfce7",
  },
  sql: {
    bg: "#eef2ff",
    primary: "#4f46e5",
    secondary: "#0f172a",
    accent: "#0284c7",
    text: "#312e81",
    soft: "#e0e7ff",
  },
  git: {
    bg: "#fff7ed",
    primary: "#ea580c",
    secondary: "#7c2d12",
    accent: "#dc2626",
    text: "#7c2d12",
    soft: "#fed7aa",
  },
  "lógica": {
    bg: "#f8fafc",
    primary: "#475569",
    secondary: "#7c3aed",
    accent: "#059669",
    text: "#0f172a",
    soft: "#e2e8f0",
  },
  html: {
    bg: "#fff1f2",
    primary: "#e11d48",
    secondary: "#fb923c",
    accent: "#2563eb",
    text: "#881337",
    soft: "#ffe4e6",
  },
};

const baseTone: VisualTone = {
  bg: "#f8fafc",
  primary: "#7c3aed",
  secondary: "#0f766e",
  accent: "#f59e0b",
  text: "#1f2937",
  soft: "#ede9fe",
};

function normalize(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getTone(language?: string): VisualTone {
  return languageTones[(language || "").toLowerCase()] ?? baseTone;
}

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

  if (/if|else|condicion|where|validacao|validation|aria|acessibilidade/.test(key)) {
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

  if (/html|css|seletores|flex|grid|position|media|semantico|meta|seo|form|links|imagem/.test(key)) {
    return {
      title: "Camadas da interface",
      subtitle: "Estrutura, aparência e acessibilidade trabalham juntas.",
      steps: ["Estrutura", "Estilo", "Experiência"],
      checkpoints: ["Use semântica", "Organize o layout", "Cuide do acesso"],
      icon: FileCode2,
      pattern: "layers",
    };
  }

  if (/async|await|promise|fetch|express|rota|crud|jwt|api|server/.test(key)) {
    return {
      title: "Caminho da requisição",
      subtitle: "A chamada passa por etapas até voltar como resposta confiável.",
      steps: ["Pedido", "Processamento", "Resposta"],
      checkpoints: ["Trate erros", "Valide dados", "Responda com clareza"],
      icon: Route,
      pattern: "flow",
    };
  }

  if (/big o|sort|busca|recurs|hash|arvore|grafo|lista encadeada/.test(key)) {
    return {
      title: "Estratégia do algoritmo",
      subtitle: "Escolha a estrutura certa para reduzir trabalho e deixar a solução previsível.",
      steps: ["Entrada", "Estratégia", "Custo"],
      checkpoints: ["Meça o crescimento", "Use a estrutura certa", "Teste casos pequenos"],
      icon: Network,
      pattern: "data",
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

const PatternArtwork = ({ concept, tone }: { concept: ConceptVisual; tone: VisualTone }) => {
  const Icon = concept.icon;

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

const LessonVisualAid = ({ courseTitle, language, lessonTitle }: LessonVisualAidProps) => {
  const tone = getTone(language);
  const CourseIcon = getCourseIcon(language);
  const concept = buildConcept(lessonTitle, language);

  return (
    <figure className="mb-5 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
        <div className="relative min-h-[220px] bg-secondary/30 p-3">
          <PatternArtwork concept={concept} tone={tone} />
          <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-slate-900 shadow-sm">
            <CourseIcon size={15} />
            {language || courseTitle || "Aula"}
          </div>
        </div>

        <figcaption className="flex flex-col justify-center p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-primary">
            <Sparkles size={14} /> Infográfico autoral
          </div>
          <h3 className="text-lg font-black text-foreground">{concept.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{concept.subtitle}</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            {concept.steps.map((step, index) => (
              <div key={step} className="contents">
                <div className="min-h-16 min-w-0 rounded-xl border border-border bg-card px-3 py-3 text-center text-xs font-black text-foreground">
                  {step}
                </div>
                {index < concept.steps.length - 1 && (
                  <ArrowRight size={16} className="mx-auto rotate-90 text-muted-foreground sm:rotate-0" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {concept.checkpoints.map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-accent" />
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
