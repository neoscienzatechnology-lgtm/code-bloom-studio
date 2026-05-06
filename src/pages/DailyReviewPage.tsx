import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Flame, RefreshCw } from "lucide-react";
import { courses } from "@/data/mockData";
import QuizSection from "@/components/QuizSection";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { useAttemptTracker } from "@/hooks/useAttemptTracker";
import BloomMascot from "@/components/BloomMascot";

const DailyReviewPage = () => {
  const { completedLessons, completeLesson } = useProgress();
  const { topErrors } = useAttemptTracker();
  const [done, setDone] = useState(false);

  const reviewLessons = useMemo(() => {
    const allLessons = courses.flatMap((course) =>
      course.lessons.map((lesson) => ({ course, lesson })),
    );
    const completed = allLessons.filter(({ lesson }) => completedLessons.includes(lesson.id));
    const source = completed.length > 0 ? completed : allLessons.slice(0, 8);
    return source.slice(-5).reverse();
  }, [completedLessons]);

  const questions = useMemo(
    () =>
      reviewLessons.flatMap(({ lesson }) => lesson.quiz ?? []).slice(0, 5),
    [reviewLessons],
  );

  const fallbackQuestions = [
    {
      question: "Qual hábito ajuda mais quando você erra um exercício?",
      options: ["Trocar tudo de uma vez", "Ler o erro e testar uma mudança pequena", "Pular sempre", "Copiar sem entender"],
      correctIndex: 1,
      explanation: "Uma mudança pequena por vez ajuda a descobrir a causa real do erro.",
    },
    {
      question: "Antes de escrever código, o que você deve identificar?",
      options: ["A cor do botão", "A saída esperada", "O ranking", "A quantidade de XP"],
      correctIndex: 1,
      explanation: "A saída esperada é o alvo. Sem alvo, fica difícil saber se o código está correto.",
    },
    {
      question: "Por que revisar lições antigas?",
      options: ["Para consolidar memória", "Para atrasar o curso", "Para apagar progresso", "Para evitar prática"],
      correctIndex: 0,
      explanation: "Revisão espaçada fortalece memória de longo prazo.",
    },
  ];

  const activeQuestions = questions.length >= 3 ? questions : fallbackQuestions;

  const finishReview = (correct: number) => {
    setDone(true);
    if (correct / activeQuestions.length >= 0.7) {
      completeLesson(`daily-review-${new Date().toISOString().slice(0, 10)}`, 15);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="mimo-section-title mb-1">Sessão diária</p>
          <h1 className="text-3xl font-black text-foreground">Revise por 5 minutos</h1>
          <p className="mt-2 text-muted-foreground">
            Uma rodada curta para manter conceitos vivos e recuperar pontos fracos.
          </p>
        </div>

        <div className="mb-6">
          <BloomMascot
            mood="focus"
            message="Revisão curta funciona melhor que maratona. Se errar, ótimo: achei exatamente o ponto que vale reforçar hoje."
          />
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <Flame className="mb-2 text-quest-orange" size={18} />
            <div className="text-sm font-black">Ritmo curto</div>
            <p className="text-xs text-muted-foreground">Poucas perguntas, alta frequência.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <RefreshCw className="mb-2 text-primary" size={18} />
            <div className="text-sm font-black">Revisão espaçada</div>
            <p className="text-xs text-muted-foreground">Prioriza lições concluídas recentemente.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <CheckCircle2 className="mb-2 text-accent" size={18} />
            <div className="text-sm font-black">+15 XP</div>
            <p className="text-xs text-muted-foreground">Passe com 70% ou mais.</p>
          </div>
        </div>

        {topErrors.length > 0 && (
          <div className="mb-6 rounded-xl border border-quest-yellow/30 bg-quest-yellow/5 p-4 text-sm text-foreground">
            <span className="font-black text-quest-yellow">Foco de hoje:</span>{" "}
            revisar padrões ligados a {topErrors.slice(0, 2).join(" e ")}.
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-5">
          {!done ? (
            <QuizSection questions={activeQuestions} onComplete={finishReview} />
          ) : (
            <div className="text-center">
              <div className="mb-2 text-5xl">🎯</div>
              <h2 className="text-2xl font-black text-foreground">Revisão concluída</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Agora siga para a próxima lição ou refaça uma aula que você sentiu difícil.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button asChild className="rounded-full font-black">
                  <Link to="/editor/1/1-1">
                    Praticar agora <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/cursos">Ver cursos</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DailyReviewPage;
