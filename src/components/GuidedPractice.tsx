import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, GripVertical, Puzzle, RotateCcw } from "lucide-react";
import type { Lesson, PracticeActivity } from "@/data/mockData";
import { Button } from "@/components/ui/button";

interface GuidedPracticeProps {
  lesson: Lesson;
  onCompletionChange?: (completed: boolean) => void;
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

function normalizeAnswer(value: string): string {
  return value
    .trim()
    .normalize("NFC")
    .replace(/[;.\s]+$/g, "")
    .toLowerCase();
}

function isActivityCorrect(activity: PracticeActivity, answer: string | string[] | undefined): boolean {
  if (Array.isArray(activity.correctAnswer)) {
    return Array.isArray(answer) && answer.join("\n") === activity.correctAnswer.join("\n");
  }

  if (typeof answer !== "string") return false;
  return normalizeAnswer(answer) === normalizeAnswer(activity.correctAnswer);
}

function activityBadge(type: PracticeActivity["type"]): string {
  const labels: Record<PracticeActivity["type"], string> = {
    "fill-code": "Completar",
    "order-steps": "Ordenar",
    "predict-output": "Prever saída",
    "identify-error": "Achar erro",
    "mini-challenge": "Mini desafio",
  };
  return labels[type];
}

const GuidedPractice = ({ lesson, onCompletionChange }: GuidedPracticeProps) => {
  const customActivities = lesson.practiceActivities ?? [];
  const fill = useMemo(() => buildFillBlank(lesson.solution), [lesson.solution]);
  const lines = useMemo(() => solutionLines(lesson.solution), [lesson.solution]);
  const [answer, setAnswer] = useState("");
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [fillChecked, setFillChecked] = useState(false);
  const [orderChecked, setOrderChecked] = useState(false);
  const [activityAnswers, setActivityAnswers] = useState<Record<string, string | string[]>>({});
  const [activityChecked, setActivityChecked] = useState<Record<string, boolean>>({});

  const shuffled = useMemo(() => [...lines].sort((a, b) => b.localeCompare(a)), [lines]);
  const fillOk = normalizeAnswer(answer) === normalizeAnswer(fill.target);
  const orderOk = selectedLines.join("\n") === lines.join("\n");
  const hasFallbackPractice = Boolean(fill.target || lines.length >= 2);
  const correctActivityCount = customActivities.filter((activity) =>
    activityChecked[activity.id] && isActivityCorrect(activity, activityAnswers[activity.id]),
  ).length;
  const customPracticeComplete = customActivities.length > 0 && correctActivityCount === customActivities.length;
  const fallbackPracticeComplete =
    !hasFallbackPractice ||
    ((!fill.target || (fillChecked && fillOk)) && (lines.length < 2 || (orderChecked && orderOk)));
  const practiceComplete = customActivities.length > 0 ? customPracticeComplete : fallbackPracticeComplete;

  useEffect(() => {
    onCompletionChange?.(practiceComplete);
  }, [onCompletionChange, practiceComplete]);

  if (customActivities.length > 0) {
    return (
      <section className="mb-6 rounded-2xl border border-accent/20 bg-accent/5 p-4">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-primary">
            <Puzzle size={18} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-primary">Prática guiada</p>
            <h3 className="text-base font-black text-foreground">Treine a ideia antes do editor</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Faça uma atividade curta, receba feedback e só depois escreva a solução completa.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {customActivities.map((activity) => {
            const checked = activityChecked[activity.id] ?? false;
            const currentAnswer = activityAnswers[activity.id];
            const ok = checked && isActivityCorrect(activity, currentAnswer);
            const selectedOrder = Array.isArray(currentAnswer) ? currentAnswer : [];
            const answerText = typeof currentAnswer === "string" ? currentAnswer : "";

            return (
              <div key={activity.id} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-black text-foreground">{activity.title}</div>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-black text-muted-foreground">
                    {activityBadge(activity.type)}
                  </span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{activity.prompt}</p>
                {activity.code && (
                  <pre className="mb-3 overflow-x-auto rounded-lg bg-[#1e1e2e] p-3 text-xs text-[#cdd6f4]">
                    {activity.code}
                  </pre>
                )}

                {activity.type === "order-steps" && activity.options ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {activity.options.map((option) => {
                        const used = selectedOrder.includes(option);
                        return (
                          <button
                            key={option}
                            onClick={() => {
                              if (used) return;
                              setActivityAnswers((current) => ({
                                ...current,
                                [activity.id]: [...selectedOrder, option],
                              }));
                              setActivityChecked((current) => ({ ...current, [activity.id]: false }));
                            }}
                            disabled={used}
                            className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${
                              used ? "border-border bg-muted/40 opacity-50" : "border-border bg-background hover:border-primary/40"
                            }`}
                          >
                            <GripVertical size={13} className="text-muted-foreground" />
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    <div className="rounded-lg border border-border bg-secondary/30 p-3">
                      <div className="mb-2 text-xs font-bold text-muted-foreground">Sua ordem</div>
                      {selectedOrder.length === 0 ? (
                        <div className="text-xs text-muted-foreground">Clique nas linhas acima.</div>
                      ) : (
                        <ol className="space-y-1">
                          {selectedOrder.map((line, index) => (
                            <li key={`${activity.id}-${line}-${index}`} className="font-mono text-xs text-foreground">
                              {index + 1}. {line}
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </div>
                ) : activity.options ? (
                  <div className="grid gap-2">
                    {activity.options.map((option) => {
                      const selected = answerText === option;
                      return (
                        <button
                          key={option}
                          onClick={() => {
                            setActivityAnswers((current) => ({ ...current, [activity.id]: option }));
                            setActivityChecked((current) => ({ ...current, [activity.id]: false }));
                          }}
                          className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-colors ${
                            selected ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/40"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    value={answerText}
                    onChange={(event) => {
                      setActivityAnswers((current) => ({ ...current, [activity.id]: event.target.value }));
                      setActivityChecked((current) => ({ ...current, [activity.id]: false }));
                    }}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    placeholder="Digite sua resposta"
                  />
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => setActivityChecked((current) => ({ ...current, [activity.id]: true }))}
                    className="rounded-lg font-bold"
                  >
                    Verificar
                  </Button>
                  {activity.type === "order-steps" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setActivityAnswers((current) => ({ ...current, [activity.id]: [] }));
                        setActivityChecked((current) => ({ ...current, [activity.id]: false }));
                      }}
                      className="gap-1 rounded-lg"
                    >
                      <RotateCcw size={13} /> Limpar
                    </Button>
                  )}
                </div>

                {checked && (
                  <div className={`mt-3 rounded-lg px-3 py-2 text-xs font-bold ${ok ? "bg-accent/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                    {ok ? activity.successFeedback : activity.errorFeedback}
                    {!ok && activity.hint && (
                      <div className="mt-1 font-medium opacity-90">Dica: {activity.hint}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold text-muted-foreground">
          {practiceComplete
            ? "Prática liberada. Agora você pode avançar para o desafio."
            : `Complete ${correctActivityCount}/${customActivities.length} atividades para liberar o desafio.`}
        </div>
      </section>
    );
  }

  if (!fill.target && lines.length < 2) return null;

  return (
    <section className="mb-6 rounded-2xl border border-accent/20 bg-accent/5 p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-primary">
          <Puzzle size={18} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-primary">Prática guiada</p>
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
              <div className={`mt-2 text-xs font-bold ${fillOk ? "text-primary" : "text-destructive"}`}>
                {fillOk
                  ? "Correto. Você reconheceu a ferramenta principal antes de escrever tudo sozinho."
                  : `Quase. A lacuna pede "${fill.target}" porque essa é a peça que executa a ação central da aula.`}
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
              <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${orderOk ? "text-primary" : "text-destructive"}`}>
                {orderOk && <CheckCircle2 size={13} />}
                {orderOk
                  ? "Ordem correta. Agora escreva no editor e explique a função de cada linha."
                  : "A ordem ainda não representa a solução. Pense no fluxo: preparar dados, aplicar a regra e mostrar o resultado."}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold text-muted-foreground">
        {practiceComplete
          ? "Prática liberada. Agora você pode avançar para o desafio."
          : "Resolva a prática guiada para liberar o desafio da aula."}
      </div>
    </section>
  );
};

export default GuidedPractice;
