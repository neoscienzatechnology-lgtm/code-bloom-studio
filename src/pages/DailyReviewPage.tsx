import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  RefreshCw,
  RotateCcw,
  Target,
} from "lucide-react";
import { courses } from "@/data/mockData";
import QuizSection from "@/components/QuizSection";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { useAttemptTracker } from "@/hooks/useAttemptTracker";
import MascoteCapivara from "@/components/MascoteCapivara";
import {
  buildDailyReviewPlan,
  ERROR_REVIEW_COPY,
  type ReviewReason,
} from "@/utils/dailyReview";

const reasonCopy: Record<ReviewReason, string> = {
  stuck: "Você teve tentativa recente aqui. Vale revisar antes de avançar.",
  in_progress: "Você já começou essa aula. Retomar agora reduz retrabalho.",
  completed: "Aula concluída recentemente. Boa para fortalecer memória.",
  starter: "Fundamento inicial recomendado para aquecer.",
};

const DailyReviewPage = () => {
  const { completedLessons, savedCode, completeLesson } = useProgress();
  const { topErrors, attempts } = useAttemptTracker();
  const [result, setResult] = useState<{ correct: number; passed: boolean } | null>(null);
  const [quizKey, setQuizKey] = useState(0);

  const reviewPlan = useMemo(
    () =>
      buildDailyReviewPlan({
        courses,
        completedLessons,
        savedCode,
        attempts,
        topErrors,
      }),
    [attempts, completedLessons, savedCode, topErrors],
  );

  const recommendedHref = `/editor/${reviewPlan.recommendedLesson.course.id}/${reviewPlan.recommendedLesson.lesson.id}`;
  const activeQuestions = reviewPlan.questions;
  const focusItems = reviewPlan.focusErrors.map((error) => ERROR_REVIEW_COPY[error]);

  const finishReview = (correct: number) => {
    const passed = correct / activeQuestions.length >= reviewPlan.passThreshold;
    setResult({ correct, passed });
    if (passed) {
      completeLesson(`daily-review-${new Date().toISOString().slice(0, 10)}`, reviewPlan.xpReward);
    }
  };

  const restartReview = () => {
    setResult(null);
    setQuizKey((key) => key + 1);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mimo-section-title mb-1">Sessão diária</p>
            <h1 className="text-3xl font-black text-foreground sm:text-4xl">Revisão inteligente</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Uma rodada curta montada com base nas aulas concluídas, no código salvo e nos erros que
              apareceram durante a prática.
            </p>
          </div>

          <MascoteCapivara
            state={result ? (result.passed ? "celebrate" : "error") : "thinking"}
            message={
              result
                ? result.passed
                  ? "Revisão concluída! Agora siga para a aula recomendada."
                  : "Quase! Revise o foco de hoje e tente uma rodada curta de novo."
                : reviewPlan.recommendedLesson.reason === "stuck"
                ? "Hoje vamos atacar o ponto que travou. Poucas perguntas, foco alto e retorno direto para a aula certa."
                : "Revisão curta funciona melhor que maratona. Se errar, ótimo: achamos exatamente o que reforçar."
            }
          />
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <Flame className="mb-2 text-quest-orange" size={18} />
            <div className="text-sm font-black">{activeQuestions.length} perguntas</div>
            <p className="text-xs text-muted-foreground">Curto o bastante para virar hábito.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <RefreshCw className="mb-2 text-primary" size={18} />
            <div className="text-sm font-black">Foco adaptativo</div>
            <p className="text-xs text-muted-foreground">Prioriza erros, aulas iniciadas e revisão espaçada.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <CheckCircle2 className="mb-2 text-accent" size={18} />
            <div className="text-sm font-black">+{reviewPlan.xpReward} XP</div>
            <p className="text-xs text-muted-foreground">Passe com 70% ou mais.</p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-primary">
              <Target size={16} /> Aula recomendada
            </div>
            <h2 className="text-xl font-black text-foreground">
              {reviewPlan.recommendedLesson.course.emoji} {reviewPlan.recommendedLesson.lesson.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {reasonCopy[reviewPlan.recommendedLesson.reason]}
            </p>
            <Button asChild className="mt-4 rounded-full font-black">
              <Link to={recommendedHref}>
                Abrir aula <ArrowRight size={16} />
              </Link>
            </Button>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-foreground">Foco de hoje</h2>
                <p className="text-sm text-muted-foreground">Três hábitos para corrigir o padrão mais provável.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {focusItems.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-1 text-sm font-black text-foreground">{item.label}</div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.drill}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-border bg-card p-5">
            {!result ? (
              <QuizSection key={quizKey} questions={activeQuestions} onComplete={finishReview} />
            ) : (
              <div className="text-center">
                <div className="mb-2 text-5xl">{result.passed ? "🎯" : "📝"}</div>
                <h2 className="text-2xl font-black text-foreground">
                  {result.passed ? "Revisão concluída" : "Boa tentativa"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Você acertou {result.correct}/{activeQuestions.length}.{" "}
                  {result.passed
                    ? `XP liberado. Agora siga para a aula recomendada.`
                    : "Revise o foco de hoje e tente outra rodada curta."}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Button asChild className="rounded-full font-black">
                    <Link to={recommendedHref}>
                      Praticar aula <ArrowRight size={16} />
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={restartReview} className="gap-2 rounded-full">
                    <RotateCcw size={15} /> Refazer revisão
                  </Button>
                </div>
              </div>
            )}
          </section>

          <aside className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-black text-foreground">Fila da revisão</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A ordem muda conforme você conclui aulas, salva código e registra erros.
            </p>
            <div className="mt-4 space-y-3">
              {reviewPlan.lessons.map((item, index) => (
                <Link
                  key={item.lesson.id}
                  to={`/editor/${item.course.id}/${item.lesson.id}`}
                  className="block rounded-xl border border-border bg-background p-3 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-black text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-black text-foreground">{item.lesson.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{reasonCopy[item.reason]}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default DailyReviewPage;
