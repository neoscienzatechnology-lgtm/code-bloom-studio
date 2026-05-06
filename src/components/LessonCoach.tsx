import { useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, RotateCcw, Target, Lightbulb, ListChecks } from "lucide-react";
import type { Course, Lesson } from "@/data/mockData";
import { buildLessonBlueprint } from "@/utils/pedagogy";
import { Button } from "@/components/ui/button";

interface LessonCoachProps {
  course: Course;
  lesson: Lesson;
}

const LessonCoach = ({ course, lesson }: LessonCoachProps) => {
  const blueprint = useMemo(() => buildLessonBlueprint(course, lesson), [course, lesson]);
  const [currentCheck, setCurrentCheck] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const check = blueprint.microChecks[currentCheck];
  const answered = selected !== null;
  const correct = answered && selected === check.correctIndex;

  const next = () => {
    if (currentCheck >= blueprint.microChecks.length - 1) {
      setCompleted(true);
      return;
    }
    setCurrentCheck((value) => value + 1);
    setSelected(null);
  };

  const reset = () => {
    setCurrentCheck(0);
    setSelected(null);
    setCompleted(false);
  };

  return (
    <section className="mb-6 rounded-2xl border border-primary/20 bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Target size={18} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-primary">Plano da lição</p>
          <h3 className="text-base font-black text-foreground">{blueprint.objective}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{blueprint.whyItMatters}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {blueprint.steps.map((step, index) => (
          <div key={step.title} className="rounded-xl border border-border bg-background/70 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs font-black text-accent">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">{index + 1}</span>
              {step.title}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-border bg-secondary/30 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-muted-foreground">
            <Lightbulb size={14} /> Vocabulário útil
          </div>
          <div className="space-y-2">
            {blueprint.terms.map((term) => (
              <div key={term.term}>
                <div className="text-sm font-bold text-foreground">{term.term}</div>
                <div className="text-xs leading-relaxed text-muted-foreground">{term.meaning}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-quest-blue/20 bg-quest-blue/5 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-quest-blue">
              <ListChecks size={14} /> Aquecimento
            </div>
            {completed && (
              <button onClick={reset} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                <RotateCcw size={12} className="mr-1 inline" />
                refazer
              </button>
            )}
          </div>

          {completed ? (
            <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm font-bold text-accent">
              <CheckCircle2 size={16} className="mr-2 inline" />
              Aquecimento concluído. Agora escreva o código com mais segurança.
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-bold text-foreground">{check.prompt}</p>
              <div className="grid gap-2">
                {check.options.map((option, index) => {
                  const isSelected = selected === index;
                  const isCorrect = index === check.correctIndex;
                  const stateClass = !answered
                    ? "border-border bg-card hover:border-primary/40"
                    : isCorrect
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : isSelected
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-border bg-card opacity-50";

                  return (
                    <button
                      key={option}
                      onClick={() => !answered && setSelected(index)}
                      disabled={answered}
                      className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors ${stateClass}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className="space-y-2">
                  <div className={`rounded-lg px-3 py-2 text-xs font-bold ${correct ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                    {correct ? "Correto." : `Quase. A melhor resposta é: ${check.options[check.correctIndex]}`}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{check.explanation}</p>
                  <Button size="sm" onClick={next} className="h-8 rounded-full text-xs font-bold">
                    {currentCheck >= blueprint.microChecks.length - 1 ? "Ir para o código" : "Próximo aquecimento"}
                    <ChevronRight size={13} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background/70 p-3">
        <div className="mb-2 text-xs font-black uppercase tracking-wide text-muted-foreground">Critérios de sucesso</div>
        <div className="grid gap-2 sm:grid-cols-3">
          {blueprint.successCriteria.map((criterion) => (
            <div key={criterion} className="flex items-start gap-2 text-xs text-muted-foreground">
              <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-accent" />
              <span>{criterion}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LessonCoach;

