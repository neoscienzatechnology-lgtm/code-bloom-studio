// Mapeia as tags de conceito das lições para 15 famílias de diagrama
// didático. As tags do conteúdo são fragmentadas (lists/arrays/collections…),
// então o diagrama é escolhido por família; medido sobre o conteúdo atual,
// ~88% das lições resolvem para uma família — o resto usa a vinheta genérica.

export type DiagramFamily =
  | "variable"
  | "text"
  | "list"
  | "loop"
  | "condition"
  | "func"
  | "dict"
  | "error"
  | "output"
  | "web"
  | "style"
  | "data"
  | "flow"
  | "algorithm"
  | "mobile";

const FAMILY_TAGS: Record<DiagramFamily, string[]> = {
  variable: ["variables", "variaveis", "state", "estado", "assignment", "types", "tipos", "booleans", "numbers", "conversion", "game-state"],
  text: ["strings", "f-strings", "template-literals", "text", "interpolation"],
  list: ["lists", "arrays", "collections", "iteration", "map", "filter", "deque", "stack", "queue", "pilha", "fila"],
  loop: ["loops", "for", "while", "range", "repeat", "game-loop", "progression"],
  condition: ["conditionals", "comparison", "conditions", "if", "logic", "boolean-logic", "win-condition", "validation", "sequencing"],
  func: ["functions", "funcoes", "return", "parameters", "argumentos", "components", "componentes", "props", "hooks", "destructuring"],
  dict: ["dicts", "objects", "properties", "data-model", "data-modeling", "json", "key-value", "grouping"],
  error: ["errors", "debugging", "try-except", "exceptions", "bugs", "depuracao"],
  output: ["print", "console", "output", "io", "saida", "reports", "display", "entrada"],
  web: ["html", "semantic-html", "elements", "attributes", "atributos", "forms", "dom", "events", "interaction", "accessibility", "document", "body", "links", "security"],
  style: ["css-basics", "layout", "responsive", "box-model", "cascade", "color", "flexbox", "grid", "estilos", "css-variables", "animation", "design-system", "card", "container", "display"],
  data: ["sql", "select", "where", "tables", "database", "create-table", "insert", "update", "delete", "constraints", "csv", "data-import", "data-cleaning", "data-analysis", "data-flow", "data-transformation", "count", "filtering", "metrics", "sum"],
  flow: ["git", "commit", "branch", "merge", "workflow", "collaboration", "conflict", "diff", "remote", "pull-request", "backend", "api", "rest", "http", "middleware", "routes", "request", "response", "status-codes", "environment", "config", "dependencies", "npm", "deploy", "checkout", "communication", "contract", "ai-productivity", "prompting"],
  algorithm: ["big-o", "complexity", "complexidade", "binary-search", "bubble-sort", "recursion", "base-case", "bfs", "dfs", "graphs", "adjacency-list", "sorting", "search", "memo", "algorithm", "strategy", "persistence"],
  mobile: ["react-native", "navigation", "stylesheet", "mobile-layout", "mobile-flow", "mobile-ui", "images", "controlled-input"],
};

const TAG_TO_FAMILY = new Map<string, DiagramFamily>();
for (const [family, tags] of Object.entries(FAMILY_TAGS) as [DiagramFamily, string[]][]) {
  for (const tag of tags) {
    if (!TAG_TO_FAMILY.has(tag)) TAG_TO_FAMILY.set(tag, family);
  }
}

/** A primeira tag da lição que resolve para uma família decide o diagrama. */
export function getConceptFamily(concepts?: string[]): DiagramFamily | null {
  for (const tag of concepts ?? []) {
    const family = TAG_TO_FAMILY.get(tag);
    if (family) return family;
  }
  return null;
}
