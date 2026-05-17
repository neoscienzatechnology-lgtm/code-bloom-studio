import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  Flame,
  RefreshCw,
  RotateCcw,
  Target,
} from "lucide-react";
import MascoteCapivara from "@/components/MascoteCapivara";
import QuizSection from "@/components/QuizSection";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/mockData";
import { useAttemptTracker } from "@/hooks/useAttemptTracker";
import { useConceptMasterySync } from "@/hooks/useConceptMasterySync";
import { useProgress } from "@/hooks/useProgress";
import { buildConceptMasteryPlan, type ConceptMastery, type ConceptStatus } from "@/utils/conceptMastery";
import { buildConceptTrainingSession } from "@/utils/weakConceptTraining";
import { toLocalDateKey } from "@/utils/studyStats";

const statusCopy: Record<ConceptStatus, { label: string; className: string }> = {
  weak: { label: "Precisa revisar", className: "bg-destructive/10 text-destructive" },
  learning: { label: "Em consolidação", className: "bg-quest-yellow/10 text-quest-yellow" },
  new: { label: "Ainda novo", className: "bg-secondary text-muted-foreground" },
  strong: { label: "Forte", className: "bg-accent/10 text-accent" },
};

function chooseDefaultConcept(concepts: ConceptMastery[], selectedId: string | null) {
  const selected = concepts.find((concept) => concept.id === selectedId);
  if (selected) return selected;
  return (
    concepts.find((concept) => concept.status === "weak") ??
    concepts.find((concept) => concept.status === "learning") ??
    concepts.find((concept) => concept.status === "new") ??
    concepts[0]
  );
}

const WeakConceptsPage = () => {
  const { completedLessons, savedCode, completeLesson, isCompleted } = useProgress();
  const { attempts } = useAttemptTracker();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(() => searchParams.get("concept"));
  const [quizKey, setQuizKey] = useState(0);
  const [result, setResult] = useState<{ correct: number; passed: boolean; conceptId: string; awardedXp: boolean } | null>(null);
  const completionHandledRef = useRef(false);

  const localConcepts = useMemo(
    () =>
      buildConceptMasteryPlan({
        courses,
        completedLessons,
        savedCode,
        attempts,
      }),
    [attempts, completedLessons, savedCode],
  );
  const { concepts, syncLabel } = useConceptMasterySync(localConcepts);
  const activeConcept = chooseDefaultConcept(concepts, selectedId);
  const trainingSession = useMemo(
    () => (activeConcept ? buildConceptTrainingSession(activeConcept, courses) : null),
    [activeConcept],
  );

  const weakCount = concepts.filter((concept) => concept.status === "weak").length;
  const learningCount = concepts.filter((concept) => concept.status === "learning").length;
  const visibleConcepts = concepts
    .filter((concept) => concept.status !== "strong")
    .slice(0, 8);
  const conceptList = visibleConcepts.length > 0 ? visibleConcepts : concepts.slice(0, 8);
  const passed = result?.conceptId === activeConcept?.id && result.passed;
  const trainingRewardId = activeConcept ? `concept-training-${activeConcept.id}-${toLocalDateKey(new Date())}` : "";
  const trainingRewardClaimed = Boolean(trainingRewardId && isCompleted(trainingRewardId));
  const recommendedHref = trainingSession?.recommendedLesson
    ? `/editor/${trainingSession.recommendedLesson.courseId}/${trainingSession.recommendedLesson.lessonId}`
    : "/revisao";

  const handleSelectConcept = (conceptId: string) => {
    setSelectedId(conceptId);
    setSearchParams({ concept: conceptId });
    setResult(null);
    completionHandledRef.current = false;
    setQuizKey((key) => key + 1);
  };

  const finishTraining = (correct: number) => {
    if (!activeConcept || !trainingSession) return;
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;

    const isPassed = correct / trainingSession.questions.length >= 0.7;
    const awardedXp = isPassed && !trainingRewardClaimed ? completeLesson(trainingRewardId, 18) : false;
    setResult({ correct, passed: isPassed, conceptId: activeConcept.id, awardedXp });
  };

  const restartTraining = () => {
    setResult(null);
    completionHandledRef.current = false;
    setQuizKey((key) => key + 1);
  };

  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-8 sm:px-6 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mimo-section-title mb-1">Treino adaptativo</p>
            <h1 className="text-3xl font-black text-foreground sm:text-4xl">Pontos fracos</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              O CapyCode cruza aulas concluídas, código salvo e tentativas com erro para sugerir uma prática curta
              por conceito. A ideia é corrigir uma dificuldade por vez, sem virar uma página gigante.
            </p>
          </div>

          <MascoteCapivara
            variant="compact"
            state={passed ? "celebrate" : result ? "thinking" : "thinking"}
            message={
              passed
                ? "Boa! Esse conceito ficou mais firme. Agora volte para a aula recomendada."
                : "Vamos treinar só o ponto que mais precisa de atenção agora."
            }
          />
        </section>

        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <Brain className="mb-2 text-primary" size={18} />
            <div className="text-sm font-black">{concepts.length} conceitos mapeados</div>
            <p className="text-xs text-muted-foreground">{syncLabel}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <Flame className="mb-2 text-quest-orange" size={18} />
            <div className="text-sm font-black">{weakCount} pontos fracos</div>
            <p className="text-xs text-muted-foreground">Priorizados antes de avançar conteúdo novo.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <BookOpenCheck className="mb-2 text-accent" size={18} />
            <div className="text-sm font-black">{learningCount} em consolidação</div>
            <p className="text-xs text-muted-foreground">Bons candidatos para revisão espaçada.</p>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-foreground">Escolha o conceito</h2>
                <p className="text-sm text-muted-foreground">Comece pelo primeiro da lista para seguir a ordem recomendada.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full text-xs font-black">
                <Link to="/revisao">
                  Revisão diária <ArrowRight size={13} />
                </Link>
              </Button>
            </div>

            <div className="space-y-3">
              {conceptList.map((concept) => {
                const status = statusCopy[concept.status];
                const active = activeConcept?.id === concept.id;

                return (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => handleSelectConcept(concept.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      active
                        ? "border-primary/50 bg-primary/5 shadow-sm"
                        : "border-border bg-background hover:border-primary/30"
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-black text-foreground">{concept.label}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {concept.completedLessons}/{concept.totalLessons} aulas concluídas
                          {concept.failedAttempts > 0 ? ` · ${concept.failedAttempts} erros recentes` : ""}
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <Progress value={concept.mastery} className="h-2 bg-secondary [&>div]:bg-primary" />
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{concept.reason}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            {trainingSession && activeConcept ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-black text-primary">
                    <Target size={16} /> {trainingSession.headline}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{trainingSession.guide}</p>
                  {trainingSession.recommendedLesson && (
                    <div className="mt-4 rounded-xl border border-border bg-background p-3">
                      <div className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                        Aula recomendada depois do treino
                      </div>
                      <div className="mt-1 text-sm font-black text-foreground">
                        {trainingSession.recommendedLesson.title}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {trainingSession.recommendedLesson.objective}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {trainingSession.targetLessons.slice(0, 2).map((lesson) => (
                    <Link
                      key={lesson.lessonId}
                      to={`/editor/${lesson.courseId}/${lesson.lessonId}`}
                      className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
                    >
                      <div className="text-xs font-black text-primary">{lesson.module ?? "Aula de reforço"}</div>
                      <div className="mt-1 text-sm font-black text-foreground">{lesson.title}</div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{lesson.objective}</p>
                    </Link>
                  ))}
                </div>

                {!result || result.conceptId !== activeConcept.id ? (
                  <QuizSection key={`${activeConcept.id}-${quizKey}`} questions={trainingSession.questions} onComplete={finishTraining} />
                ) : (
                  <div className="rounded-2xl border border-border bg-background p-6 text-center">
                    <div className="mb-2 text-5xl">{result.passed ? "🎯" : "📝"}</div>
                    <h2 className="text-2xl font-black text-foreground">
                      {result.passed ? "Conceito reforçado" : "Ainda vale revisar"}
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                      Você acertou {result.correct}/{trainingSession.questions.length}.{" "}
                      {result.passed
                        ? result.awardedXp
                          ? "XP liberado. Agora aplique isso na aula recomendada para consolidar."
                          : "Treino registrado. O XP deste conceito hoje já tinha sido coletado."
                        : "Refaça a rodada ou abra a aula recomendada para rever a explicação com calma."}
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      <Button asChild className="rounded-full font-black">
                        <Link to={recommendedHref}>
                          Abrir aula <ArrowRight size={16} />
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={restartTraining} className="gap-2 rounded-full">
                        <RotateCcw size={15} /> Refazer treino
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-background p-6 text-center">
                <CheckCircle2 className="mx-auto mb-3 text-accent" size={32} />
                <h2 className="text-xl font-black text-foreground">Tudo estável por aqui</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Faça mais aulas para o app encontrar padrões reais de domínio e dificuldade.
                </p>
                <Button asChild className="mt-5 rounded-full font-black">
                  <Link to="/cursos">
                    Continuar trilha <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WeakConceptsPage;
