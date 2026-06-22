import { useEffect, useState } from "react";
import { Loader2, Play, RotateCcw, Terminal } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { runJs } from "@/lib/jsRunner";
import { isPythonRuntimeSupported, runPython } from "@/lib/pythonRunner";
import { readString, writeString } from "@/lib/storage";

type Lang = "python" | "javascript";

const STARTERS: Record<Lang, string> = {
  python: '# Brinque à vontade — isto roda Python de verdade.\nfor i in range(1, 6):\n    print("linha", i)\n',
  javascript: '// Brinque à vontade — use console.log para ver a saída.\nfor (let i = 1; i <= 5; i++) {\n  console.log("linha", i);\n}\n',
};

const storageKey = (lang: Lang) => `playground:${lang}`;
const loadCode = (lang: Lang) => readString(storageKey(lang)) ?? STARTERS[lang];

const PlaygroundPage = () => {
  const [lang, setLang] = useState<Lang>("python");
  const [code, setCode] = useState<string>(() => loadCode("python"));
  const [output, setOutput] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [running, setRunning] = useState(false);

  // Salva o código de cada linguagem automaticamente.
  useEffect(() => {
    writeString(storageKey(lang), code);
  }, [code, lang]);

  const switchLang = (next: Lang) => {
    if (next === lang) return;
    writeString(storageKey(lang), code);
    setLang(next);
    setCode(loadCode(next));
    setOutput("");
    setIsError(false);
  };

  const run = async () => {
    if (running) return;
    setRunning(true);
    setIsError(false);

    if (lang === "javascript") {
      const res = await runJs(code);
      const combined = `${res.output}${res.error ? `\n${res.error}` : ""}`.trimEnd();
      setOutput(combined || "(sem saída)");
      setIsError(Boolean(res.error));
      setRunning(false);
      return;
    }

    if (!isPythonRuntimeSupported()) {
      setOutput("Este navegador não suporta rodar Python aqui.");
      setIsError(true);
      setRunning(false);
      return;
    }

    setOutput("⏳ Carregando o Python e rodando seu código…");
    try {
      const res = await runPython(code);
      if (res.error) {
        setOutput(res.error);
        setIsError(true);
      } else {
        const combined = `${res.stdout}${res.stderr ? `\n${res.stderr}` : ""}`.trimEnd();
        setOutput(combined || "(sem saída)");
        setIsError(Boolean(res.stderr));
      }
    } catch {
      setOutput("Não consegui carregar o Python. Confira sua conexão e tente de novo.");
      setIsError(true);
    } finally {
      setRunning(false);
    }
  };

  const reset = () => {
    setCode(STARTERS[lang]);
    setOutput("");
    setIsError(false);
  };

  return (
    <div className="relative min-h-screen px-4 py-10 sm:px-6">
      <img
        src="/atmos-codetier.webp"
        loading="lazy"
        decoding="async"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] w-full object-cover opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <p className="mimo-section-title mb-1">sandbox</p>
          <h1 className="text-3xl font-black text-foreground">Playground</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Escreva e rode código livre — sem lição, sem pressão. O Python roda de verdade no seu navegador.
          </p>
        </header>

        <div className="mb-3 inline-flex rounded-xl border border-border bg-secondary/60 p-1">
          {(["python", "javascript"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => switchLang(option)}
              className={`rounded-lg px-4 py-1.5 text-sm font-black transition-colors ${
                lang === option ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option === "python" ? "Python" : "JavaScript"}
            </button>
          ))}
        </div>

        <div className="flex h-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-[#282c34]">
          <CodeEditor key={lang} value={code} onChange={setCode} language={lang} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={run} disabled={running} className="gap-2 rounded-full px-6 font-black">
            {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            Executar
          </Button>
          <Button onClick={reset} variant="ghost" disabled={running} className="gap-2 rounded-full">
            <RotateCcw size={15} /> Reiniciar
          </Button>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-2 text-xs font-black uppercase tracking-wide text-muted-foreground">
            <Terminal size={14} /> Saída
          </div>
          <pre
            className={`min-h-[96px] max-h-[280px] overflow-auto whitespace-pre-wrap bg-[#1e1e2e] px-4 py-3 font-mono text-sm leading-relaxed ${
              isError ? "text-red-300" : "text-[#cdd6f4]"
            }`}
          >
            {output || "Clique em Executar para ver a saída aqui."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
