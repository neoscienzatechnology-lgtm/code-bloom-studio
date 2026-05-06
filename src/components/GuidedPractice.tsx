import { useMemo, useState } from "react";
import { CheckCircle2, GripVertical, Puzzle } from "lucide-react";
import type { Lesson } from "@/data/mockData";
import { Button } from "@/components/ui/button";

interface GuidedPracticeProps {
  lesson: Lesson;
}

function buildFillBlank(solution: string) {
  const candidates = ["print", "console.log", "return", "function", "def", "const", "let", "for", "if", "SELECT", "from"];
  const target = candidates.find((candidate) => solution.includes(candidate)) ?? solution.match(/[A-Za-z_][A-Za-z0-9_]*/)?.[0] ?? "";
  return {
    target,
    prompt: target ? solution.replace(target, "____") : solution,
  };
}

function solutionLines(solution: string): string[] {
  return solution
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
    .slice(0, 5);
}

const GuidedPractice = ({ lesson }: GuidedPracticeProps) => {
  const fill = useMemo(() => buildFillBlank(lesson.solution), [lesson.solution]);
  const lines = useMemo(() => solutionLines(lesson.solution), [lesson.solution]);
  const [answer, setAnswer] = useState("");
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [fillChecked, setFillChecked] = useState(false);
  const [orderChecked, setOrderChecked] = useState(false);

  const shuffled = useMemo(() => [...lines].sort((a, b) => b.localeCompare(a)), [lines]);
  const fillOk = answer.trim() === fill.target;
  const orderOk = selectedLines.join("\n") === lines.join("\n");

  if (!fill.target && lines.length < 2) return null;

  return (
    <section className="mb-6 rounded-2xl border border-accent/20 bg-accent/5 p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Puzzle size={18} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-accent">Prática guiada</p>
          <h3 className="text-base font-black text-foreground">Monte antes de escrever livremente</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Primeiro complete e organize. Depois escreva no editor com menos tentativa e erro.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {fill.target && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 text-sm font-black text-foreground">Complete a lacuna</div>
            <pre className="mb-3 overflow-x-auto rounded-lg bg-[#1e1e2e] p-3 text-xs text-[#cdd6f4]">
              {fill.prompt}
            </pre>
            <div className="flex gap-2">
              <input
                value={answer}
                onChange={(event) => {
                  setAnswer(event.target.value);
                  setFillChecked(false);
                }}
                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Digite a palavra que falta"
              />
              <Button size="sm" onClick={() => setFillChecked(true)} className="rounded-lg font-bold">
                Verificar
              </Button>
            </div>
            {fillChecked && (
              <div className={`mt-2 text-xs font-bold ${fillOk ? "text-accent" : "text-destructive"}`}>
                {fillOk ? "Correto. Essa palavra é a peça central da solução." : `Revise a sintaxe. A lacuna espera "${fill.target}".`}
              </div>
            )}
          </div>
        )}

        {lines.length >= 2 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 text-sm font-black text-foreground">Ordene as linhas</div>
            <div className="mb-3 space-y-2">
              {shuffled.map((line) => {
                const used = selectedLines.includes(line);
                return (
                  <button
                    key={line}
                    onClick={() => !used && setSelectedLines((current) => [...current, line])}
                    disabled={used}
                    className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${
                      used ? "border-border bg-muted/40 opacity-50" : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <GripVertical size={13} className="text-muted-foreground" />
                    {line}
                  </button>
                );
              })}
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <div className="mb-2 text-xs font-bold text-muted-foreground">Sua ordem</div>
              {selectedLines.length === 0 ? (
                <div className="text-xs text-muted-foreground">Clique nas linhas acima.</div>
              ) : (
                <ol className="space-y-1">
                  {selectedLines.map((line, index) => (
                    <li key={`${line}-${index}`} className="font-mono text-xs text-foreground">
                      {index + 1}. {line}
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setOrderChecked(true)} className="rounded-lg font-bold">
                Verificar ordem
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedLines([]);
                  setOrderChecked(false);
                }}
                className="rounded-lg"
              >
                Limpar
              </Button>
            </div>
            {orderChecked && (
              <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${orderOk ? "text-accent" : "text-destructive"}`}>
                {orderOk && <CheckCircle2 size={13} />}
                {orderOk ? "Ordem correta. Agora escreva no editor." : "A ordem ainda não representa a solução. Tente pensar no fluxo de cima para baixo."}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default GuidedPractice;

