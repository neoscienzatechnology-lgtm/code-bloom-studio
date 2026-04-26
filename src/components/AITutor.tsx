import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

export interface LessonContext {
  courseTitle?: string;
  language?: string;
  lessonTitle?: string;
  description?: string;
  expectedOutput?: string;
  starterCode?: string;
  currentCode?: string;
  lastError?: string;
  /** Material teórico oficial da lição — usado para alinhar termos/analogias. */
  theory?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AITutorProps {
  lessonContext: LessonContext;
  /** Stable id for the lesson/exercise so we can keep separate chat histories. */
  contextId: string;
}

const SUGGESTED_QUESTIONS = [
  "Estou travado, por onde começo?",
  "Não entendi a teoria, pode explicar de novo?",
  "Por que meu código não está funcionando?",
  "Me dá um exemplo parecido?",
];

const AITutor = ({ lessonContext, contextId }: AITutorProps) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Reset chat when lesson changes
  useEffect(() => {
    setMessages([]);
    setInput("");
    setError(null);
    abortRef.current?.abort();
  }, [contextId]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;

    setError(null);
    const userMsg: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: nextMessages, lessonContext }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          setError("Muitas perguntas em sequência. Aguarde alguns segundos.");
        } else if (resp.status === 402) {
          setError("Créditos de IA esgotados no workspace.");
        } else {
          const t = await resp.text().catch(() => "");
          setError(`Erro do tutor (${resp.status}). ${t.slice(0, 120)}`);
        }
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantSoFar = "";
      let done = false;

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
            );
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const content: string | undefined = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // flush leftovers
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const json = raw.slice(6).trim();
          if (json === "[DONE]") continue;
          try {
            const parsed = JSON.parse(json);
            const content: string | undefined = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            /* ignore */
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        console.error("AITutor stream error:", e);
        setError("Não consegui falar com o tutor agora. Tente novamente em instantes.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const resetChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Floating action button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30"
        aria-label="Abrir Professor IA"
      >
        <Sparkles size={18} />
        Professor IA
      </motion.button>

      {/* Side panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-black">Professor IA</div>
                    <div className="text-xs text-muted-foreground">
                      Pergunte sobre a lição atual
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetChat}
                      title="Limpar conversa"
                      className="h-8 w-8"
                    >
                      <RotateCcw size={14} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                    className="h-8 w-8"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
                      <p className="mb-2 font-bold text-foreground">
                        👋 Oi! Eu sou seu tutor.
                      </p>
                      <p className="text-muted-foreground">
                        Eu não dou a resposta de cara — mas te ajudo a chegar nela. Pergunta o
                        que você não entendeu da lição{" "}
                        {lessonContext.lessonTitle && (
                          <span className="font-semibold text-foreground">
                            "{lessonContext.lessonTitle}"
                          </span>
                        )}
                        .
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Sugestões
                      </div>
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => send(q)}
                          className="block w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background text-foreground"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <div className="prose prose-sm prose-invert max-w-none [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[#1e1e2e] [&_pre]:p-3 [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5">
                          <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                        </div>
                      ) : (
                        <span className="whitespace-pre-wrap">{m.content}</span>
                      )}
                    </div>
                  </div>
                ))}

                {loading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground">
                      <Loader2 className="animate-spin" size={14} />
                      Pensando...
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                    {error}
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-border bg-card p-3"
              >
                <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-primary/50">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    placeholder="Pergunte algo sobre a lição..."
                    rows={1}
                    className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
                    aria-label="Enviar"
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                  </button>
                </div>
                <div className="mt-1.5 px-1 text-[10px] text-muted-foreground">
                  Shift+Enter para nova linha
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AITutor;
