import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link, Navigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Clock, Code2, GraduationCap, Play, Trophy } from "lucide-react";
import { useAugmentedCourse } from "@/hooks/useAugmentedCourse";
import { getProjectsByCourse } from "@/data/projects";
import { getCourseMeta } from "@/data/learningPaths";
import { formatCourseDuration } from "@/utils/courseDuration";
import { useProgress } from "@/hooks/useProgress";
import CoachGuide, { type CoachState } from "@/components/CoachGuide";
import CourseRoutePath from "@/components/CourseRoutePath";
import CourseCoverArt from "@/components/CourseCoverArt";
import { getCourseCatalogItem } from "@/data/courseCatalog";
import { SITE_URL, useDocumentMeta, useJsonLd } from "@/hooks/useDocumentMeta";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, loading } = useAugmentedCourse(courseId);
  const { isCompleted } = useProgress();

  // Título/descrição vêm do catálogo leve, que já está carregado: assim a aba
  // e o buscador têm o nome do curso mesmo antes do conteúdo chegar. #seo
  const catalogItem = getCourseCatalogItem(courseId ?? "");
  useDocumentMeta({
    title: catalogItem
      ? `${catalogItem.title} — curso de ${catalogItem.language} | CodeTier`
      : "Curso — CodeTier",
    description: catalogItem
      ? `Trilha ${catalogItem.title}: ${catalogItem.lessonCount} aulas de ${catalogItem.language} com código rodando no navegador. Nível ${catalogItem.level.toLowerCase()}, projeto final "${catalogItem.finalProject}".`
      : undefined,
    canonicalPath: catalogItem ? `/cursos/${catalogItem.id}` : undefined,
  });
  useJsonLd(
    useMemo(
      () =>
        catalogItem
          ? {
              "@context": "https://schema.org",
              "@type": "Course",
              name: catalogItem.title,
              description: `Curso de ${catalogItem.language} com ${catalogItem.lessonCount} aulas práticas e projeto final.`,
              url: `${SITE_URL}/cursos/${catalogItem.id}`,
              inLanguage: "pt-BR",
              educationalLevel: catalogItem.level,
              teaches: catalogItem.language,
              isAccessibleForFree: true,
              provider: { "@type": "Organization", name: "CodeTier", url: SITE_URL },
            }
          : null,
      [catalogItem],
    ),
  );

  // O conteúdo do curso chega sob demanda (#peso-5): esqueleto enquanto isso.
  if (loading) {
    return (
      <div className="min-h-screen px-4 py-10 sm:px-6" role="status" aria-busy="true">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="mb-4 h-40 w-full rounded-2xl bg-muted" />
          <div className="mb-3 h-8 w-64 max-w-full rounded-lg bg-muted" />
          <div className="mb-8 h-4 w-80 max-w-full rounded bg-muted/70" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 w-full rounded-xl bg-muted/60" />
            ))}
          </div>
          <span className="sr-only">Carregando o curso…</span>
        </div>
      </div>
    );
  }
  if (!course) return <Navigate to="/cursos" replace />;

  const completedLessons = course.lessons.filter((lesson) => isCompleted(lesson.id)).length;
  const progressPct = Math.round((completedLessons / course.lessons.length) * 100);
  const projects = getProjectsByCourse(course.id);
  const meta = getCourseMeta(course);
  const mascotState: CoachState = progressPct === 100 ? "celebrate" : progressPct > 0 ? "success" : "idle";
  const firstOpenIndex = course.lessons.findIndex((lesson) => !isCompleted(lesson.id));
  const currentLesson = course.lessons[firstOpenIndex === -1 ? course.lessons.length - 1 : firstOpenIndex];
  const currentLessonHref =
    currentLesson.kind === "checkpoint"
      ? `/checkpoint/${course.id}/${currentLesson.id}`
      : `/editor/${course.id}/${currentLesson.id}`;

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
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 lg:hidden">
            <div className="mb-2 text-xs font-black uppercase tracking-wide text-primary">
              Próxima etapa
            </div>
            <div className="font-black text-foreground">{currentLesson.title}</div>
            <Button asChild className="mt-3 w-full rounded-full font-black">
              <Link to={currentLessonHref}>
                {progressPct > 0 ? "Continuar aula" : "Começar aula"} <Play size={16} />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.85fr)_1.15fr] lg:items-start xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1fr)_18rem]">
            <CourseCoverArt course={course} variant="hero" />
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black sm:text-3xl">{course.title}</h1>
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] font-bold">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="mb-4 max-w-2xl text-muted-foreground">{course.description}</p>

              <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-secondary/60 p-3">
                  <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                    <Code2 size={13} /> Tipo
                  </div>
                  <div className="text-sm font-black">{meta.kind}</div>
                </div>
                <div className="rounded-xl bg-secondary/60 p-3">
                  <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                    <GraduationCap size={13} /> Pré-requisito
                  </div>
                  <div className="text-sm font-black">{meta.prerequisite}</div>
                </div>
                <div className="rounded-xl bg-secondary/60 p-3">
                  <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                    <Clock size={13} /> Duração
                  </div>
                  <div className="text-sm font-black">{formatCourseDuration(course)}</div>
                </div>
                <div className="rounded-xl bg-secondary/60 p-3">
                  <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                    <Trophy size={13} /> Projeto
                  </div>
                  <div className="text-sm font-black">{meta.finalProject}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen size={14} /> {course.lessons.length} etapas
                </span>
                <span className="flex items-center gap-1">
                  <Code2 size={14} /> {projects.length} projetos
                </span>
                <Badge variant="outline" className="text-xs font-bold">
                  {course.level}
                </Badge>
              </div>

              <div className="mt-5 hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 lg:block">
                <div className="mb-2 text-xs font-black uppercase tracking-wide text-primary">
                  Próxima etapa
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="font-black text-foreground">{currentLesson.title}</div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {currentLesson.description}
                    </p>
                  </div>
                  <Button asChild className="shrink-0 rounded-full font-black">
                    <Link to={currentLessonHref}>
                      {progressPct > 0 ? "Continuar aula" : "Começar aula"} <Play size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full rounded-2xl border border-border bg-background p-4 lg:col-start-2 lg:w-full xl:col-start-auto">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Progresso do curso</span>
                <span className="font-bold text-primary">{progressPct}%</span>
              </div>
              <Progress
                value={progressPct}
                className="h-2.5 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent"
              />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                A rota abre uma etapa por vez para reduzir distrações e manter a progressão clara.
              </p>
              {progressPct === 100 && (
                <Button asChild className="mt-3 w-full gap-2 rounded-full font-black">
                  <Link to={`/certificado/${course.id}`}>
                    <Award size={16} /> Ver certificado
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="mb-6">
          <CoachGuide
            state={mascotState}
            message={
              progressPct === 100
                ? "Curso concluído! Você já pode partir para o projeto final ou revisar pontos-chave."
                : progressPct > 0
                  ? `Você já avançou ${progressPct}%. Continue pela próxima etapa liberada.`
                : `Para estudar ${course.language}, vamos seguir a rota em ordem e revisar antes dos projetos.`
            }
          />
        </div>

        <CourseRoutePath course={course} projects={projects} isCompleted={isCompleted} />
      </div>
    </div>
  );
};

export default CourseDetailPage;
