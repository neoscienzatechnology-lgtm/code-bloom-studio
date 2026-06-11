// Marcação tipográfica determinística para os textos de teoria.
//
// O conteúdo das lições é prosa com estrutura latente: passos numerados,
// listas, rótulos ("Exemplos:"), linhas de operadores e termos de código no
// meio das frases. Estas regras revelam essa estrutura sem tocar no
// conteúdo — e sem heurísticas arriscadas (ex.: "for" fica de fora da lista
// de keywords porque é verbo comum em português: "se a regra for…").

export type TheoryLineKind = "step" | "bullet" | "label" | "opline" | "text";

export interface InlineToken {
  kind: "text" | "code" | "strong";
  value: string;
}

/** Palavras que são inequivocamente código quando aparecem na prosa. */
const CODE_KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "def",
  "elif",
  "else",
  "if",
  "while",
  "return",
  "function",
  "print",
  "input",
  "import",
  "async",
  "await",
  "true",
  "false",
  "True",
  "False",
  "None",
  "null",
  "undefined",
  "useState",
  "useEffect",
  "fetch",
  "range",
  "len",
  "sum",
  "split",
  "strip",
  "lower",
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "INSERT",
  "UPDATE",
  "DELETE",
  "GROUP",
  "ORDER",
  "HAVING",
  "LIMIT",
]);

const CALL_PATTERN = String.raw`[A-Za-z_][\w.]*\([^()\n]{0,28}\)`;
const WORD_PATTERN = String.raw`[A-Za-z_][\w.]*`;
const INLINE_PATTERN = new RegExp(`(${CALL_PATTERN})|\`([^\`]+)\`|\\*\\*([^*]+)\\*\\*|(${WORD_PATTERN})`, "g");

/**
 * Quebra um trecho de prosa em tokens, marcando como código as chamadas
 * (`print()`, `usuario.nome()`), trechos entre crases, keywords da lista e
 * negrito (**…**) como destaque.
 */
export function splitInlineTokens(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;

  const pushText = (value: string) => {
    if (!value) return;
    const last = tokens[tokens.length - 1];
    if (last?.kind === "text") last.value += value;
    else tokens.push({ kind: "text", value });
  };

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const [full, call, backticked, bold, word] = match;
    pushText(text.slice(lastIndex, match.index));
    lastIndex = match.index + full.length;

    if (call) tokens.push({ kind: "code", value: call });
    else if (backticked !== undefined) tokens.push({ kind: "code", value: backticked });
    else if (bold !== undefined) tokens.push({ kind: "strong", value: bold });
    else if (word !== undefined && CODE_KEYWORDS.has(word)) tokens.push({ kind: "code", value: word });
    else pushText(full);
  }
  pushText(text.slice(lastIndex));

  return tokens;
}

const OPERATOR_LINE = /(===|!==|>=|<=|=>|\+=|-=|!=|\|\||&&|\w\s*[<>]\s*[\w"'])/;

/** Classifica uma linha de teoria (linhas indentadas viram bloco de código
 * antes de chegar aqui). */
export function classifyTheoryLine(line: string): TheoryLineKind {
  const trimmed = line.trim();
  if (/^\d+[.)]\s+/.test(trimmed)) return "step";
  if (/^[-•]\s+/.test(trimmed)) return "bullet";
  if (
    trimmed.length <= 48 &&
    trimmed.endsWith(":") &&
    !trimmed.slice(0, -1).includes(".") &&
    /^[A-ZÁÉÍÓÚÂÊÔ]/.test(trimmed)
  ) {
    return "label";
  }
  if (OPERATOR_LINE.test(trimmed) && trimmed.length <= 60 && !/[.!?]$/.test(trimmed)) return "opline";
  return "text";
}

/** Remove o marcador do início de passos e bullets. */
export function stripLineMarker(line: string, kind: TheoryLineKind): string {
  const trimmed = line.trim();
  if (kind === "step") return trimmed.replace(/^\d+[.)]\s+/, "");
  if (kind === "bullet") return trimmed.replace(/^[-•]\s+/, "");
  return trimmed;
}

export function stepNumber(line: string): string {
  return line.trim().match(/^(\d+)[.)]/)?.[1] ?? "•";
}
