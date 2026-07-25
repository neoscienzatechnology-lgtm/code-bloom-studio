import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getLessonById } from "@/data/mockData";
import LessonView from "@/components/lesson/LessonView";
import { track } from "@/lib/analytics";

// Aula aberta de demonstração: o visitante faz uma lição INTEIRA antes de
// criar conta. O progresso fica no localStorage e sobe para a conta no
// primeiro merge depois do cadastro (useProgress) — nada a implementar aqui.
//
// A lição é FIXA de propósito (não vem da URL): assim esta rota nunca vira
// atalho para o conteúdo protegido nem para o gating de monetização.
// Obs.: `signOut` limpa o progresso local, mas um visitante nunca vê "Sair".
// #revisao-2.2
const TRIAL = { courseId: "10", lessonId: "10-1" };
const NEXT_AFTER_SIGNUP = "/editor/10/10-2";

const TryLessonPage = () => {
  const data = getLessonById(TRIAL.courseId, TRIAL.lessonId);

  useEffect(() => {
    track("trial_started", TRIAL);
  }, []);

  if (!data?.lesson || !data?.course) return <Navigate to="/cadastro" replace />;

  return (
    <LessonView
      key="trial"
      course={data.course}
      lesson={data.lesson}
      lessonIndex={data.lessonIndex ?? 0}
      nextHref={`/cadastro?redirect=${encodeURIComponent(NEXT_AFTER_SIGNUP)}`}
      hasNextLesson={false}
      nextLabel="Criar conta grátis e continuar"
      trial
    />
  );
};

export default TryLessonPage;
