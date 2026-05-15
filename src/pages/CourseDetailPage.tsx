import { motion } from "framer-motion";
import { Link, Navigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Code2, GraduationCap, Play, Trophy } from "lucide-react";
import { getAugmentedCourseById } from "@/data/checkpoints";
import { getProjectsByCourse } from "@/data/projects";
import { getCourseMeta } from "@/data/learningPaths";
import { useProgress } from "@/hooks/useProgress";
import MascoteCapivara, { type MascoteCapivaraState } from "@/components/MascoteCapivara";
import CourseRoutePath from "@/components/CourseRoutePath";
import CourseCoverArt from "@/components/CourseCoverArt";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = getAugmentedCourseById(courseId || "");
  const { isCompleted } = useProgress();

  if (!course) return <Navigate to="/cursos" replace />;

  const completedLessons = course.lessons.filter((lesson) => isCompleted(lesson.id)).length;
  const progressPct = Math.round((completedLessons / course.lessons.length) * 100);
  const projects = getProjectsByCourse(course.id);
  const meta = getCourseMeta(course);
  const mascotState: MascoteCapivaraState = progressPct === 100 ? "celebrate" : progressPct > 0 ? "success" : "idle";
  const firstOpenIndex = course.lessons.findIndex((lesson) => !isCompleted(lesson.id));
  const currentLesson = course.lessons[firstOpenIndex === -1 ? course.lessons.length - 1 : firstOpenIndex];
  const currentLessonHref =
    currentLesson.kind === "checkpoint"
      ? `/checkpoint/${course.id}/${currentLesson.id}`
      : `/editor/${course.id}/${currentLesson.id}`;

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
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
            <CourseCoverArt course={course} variant="hero" loading="eager" />
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
                  <div className="text-sm font-black">{course.duration}</div>
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
                <span className="font-bold text-accent">{progressPct}%</span>
              </div>
              <Progress
                value={progressPct}
                className="h-2.5 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent"
              />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                A rota abre uma etapa por vez para reduzir distrações e manter a progressão clara.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mb-6">
          <MascoteCapivara
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
