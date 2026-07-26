import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { loadLesson } from "@/data/courseLoader";
import type { Course, Lesson } from "@/data/mockData";
import LessonView from "@/components/lesson/LessonView";
import { track } from "@/lib/analytics";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

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
  // Só o curso 10 é carregado (#peso-5): esta é a porta de entrada do visitante
  // e não pode baixar o conteúdo dos 13 cursos para mostrar uma aula.
  const [data, setData] = useState<{ course: Course; lesson: Lesson; lessonIndex: number } | null | undefined>(
    undefined,
  );

  useDocumentMeta({
    title: "Aula grátis de programação (sem cadastro) — CodeTier",
    description:
      "Faça uma aula inteira de lógica de programação agora, direto no navegador e sem criar conta. Escreva código, execute e veja o resultado.",
    canonicalPath: "/experimentar",
  });

  useEffect(() => {
    track("trial_started", TRIAL);
    let cancelled = false;
    void loadLesson(TRIAL.courseId, TRIAL.lessonId).then((result) => {
      if (!cancelled) setData(result ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (data === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-busy="true">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="sr-only">Carregando a aula…</span>
      </div>
    );
  }
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
