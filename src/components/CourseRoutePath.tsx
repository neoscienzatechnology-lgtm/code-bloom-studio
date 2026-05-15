import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, Hammer, Lock, Play, ShieldCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AugmentedCourse, AugmentedLesson } from "@/data/checkpoints";
import type { Project } from "@/data/projects";

interface CourseRoutePathProps {
  course: AugmentedCourse;
  projects: Project[];
  isCompleted: (lessonId: string) => boolean;
}

interface ModuleGroup {
  title: string;
  description: string;
  lessons: AugmentedLesson[];
}

function splitModules(lessons: AugmentedLesson[]): ModuleGroup[] {
  if (lessons.some((lesson) => lesson.module)) {
    return lessons.reduce<ModuleGroup[]>((groups, lesson) => {
      const lastGroup = groups[groups.length - 1];
      const title = lesson.module ?? lastGroup?.title ?? "Revisão";
      const current =
        lastGroup?.title === title
          ? lastGroup
          : {
              title,
              description: "Aulas curtas com uma ideia principal, prática e feedback imediato.",
              lessons: [],
            };

      if (current !== lastGroup) groups.push(current);
      current.lessons.push(lesson);
      return groups;
    }, []);
  }

  const third = Math.max(3, Math.ceil(lessons.length / 3));
  return [
    {
      title: "Módulo 1: Fundamentos",
      description: "Conceitos essenciais em aulas curtas.",
      lessons: lessons.slice(0, third),
    },
    {
      title: "Módulo 2: Projeto Guiado",
      description: "Aplique os conceitos com mais contexto.",
      lessons: lessons.slice(third, third * 2),
    },
    {
      title: "Módulo 3: Desafio Final",
      description: "Revise, conecte ideias e prepare o projeto.",
      lessons: lessons.slice(third * 2),
    },
  ].filter((module) => module.lessons.length > 0);
}

const CourseRoutePath = ({ course, projects, isCompleted }: CourseRoutePathProps) => {
  const modules = splitModules(course.lessons);
  const firstOpenIndex = course.lessons.findIndex((lesson) => !isCompleted(lesson.id));
  const currentLesson = course.lessons[firstOpenIndex === -1 ? course.lessons.length - 1 : firstOpenIndex];
  const projectUnlocked = course.lessons.every((lesson) => isCompleted(lesson.id));

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">{course.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Siga o caminho em ordem. Cada etapa prepara a próxima e checkpoints seguram a revisão.
          </p>
        </div>
        <Button asChild className="rounded-full font-black">
          <Link
            to={
              currentLesson.kind === "checkpoint"
                ? `/checkpoint/${course.id}/${currentLesson.id}`
                : `/editor/${course.id}/${currentLesson.id}`
            }
          >
            Continuar aula <Play size={16} />
          </Link>
        </Button>
      </div>

      <div className="space-y-7">
        {modules.map((module) => (
          <div key={module.title}>
            <div className="mb-3">
              <h3 className="font-black text-foreground">{module.title}</h3>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </div>
            <div className="relative space-y-3 pl-5">
              <div className="absolute bottom-6 left-[17px] top-6 w-0.5 bg-border" />
              {module.lessons.map((lesson) => {
                const lessonIndex = course.lessons.findIndex((item) => item.id === lesson.id);
                const done = isCompleted(lesson.id);
                const locked = lessonIndex > 0 && !isCompleted(course.lessons[lessonIndex - 1].id);
                const current = lesson.id === currentLesson.id && !done && !locked;
                const href =
                  lesson.kind === "checkpoint"
                    ? `/checkpoint/${course.id}/${lesson.id}`
                    : `/editor/${course.id}/${lesson.id}`;

                const row = (
                  <div
                    className={`relative flex items-center gap-4 rounded-xl border p-4 transition ${
                      done
                        ? "border-accent/30 bg-accent/5"
                        : current
                          ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                          : locked
                            ? "border-border bg-muted/30 opacity-70"
                            : "border-border bg-background hover:border-primary/30"
                    }`}
                  >
                    <span
                      className={`absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full border-2 bg-card ${
                        done
                          ? "border-accent text-accent"
                          : current
                            ? "border-primary text-primary"
                            : "border-border text-muted-foreground"
                      }`}
                    >
                      {done ? <CheckCircle2 size={13} /> : lesson.kind === "checkpoint" ? <ShieldCheck size={12} /> : null}
                    </span>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-black text-foreground">
                      {locked ? <Lock size={16} /> : lesson.kind === "checkpoint" ? <ShieldCheck size={17} /> : lessonIndex + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-black text-foreground">{lesson.title}</h4>
                        {lesson.kind === "checkpoint" && (
                          <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">
                            Checkpoint
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {lesson.description}
                      </p>
                      {lesson.estimatedMinutes && (
                        <div className="mt-2 text-[11px] font-bold text-muted-foreground">
                          {lesson.estimatedMinutes} min • {lesson.level ?? course.level}
                        </div>
                      )}
                    </div>
                    <div className="hidden items-center gap-3 sm:flex">
                      <span className="text-xs font-black text-accent">+{lesson.xpReward} XP</span>
                      {locked ? <Lock size={17} className="text-muted-foreground" /> : <ChevronRight size={18} className="text-primary" />}
                    </div>
                  </div>
                );

                return locked ? (
                  <div key={lesson.id}>{row}</div>
                ) : (
                  <Link key={lesson.id} to={href} className="block">
                    {row}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {projects.length > 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-black text-primary">
            <Trophy size={16} /> Projeto final
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            O projeto fecha a rota com algo real para portfólio. Ele fica bloqueado até a base estar completa.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((project) =>
              projectUnlocked ? (
                <Link key={project.id} to={`/projeto/${project.id}`} className="block">
                  <div className="rounded-xl border border-primary/30 bg-card p-4 transition hover:border-primary">
                    <div className="mb-1 flex items-center gap-2 font-black text-foreground">
                      <Hammer size={16} className="text-primary" /> {project.title}
                    </div>
                    <p className="text-xs text-muted-foreground">{project.goal}</p>
                  </div>
                </Link>
              ) : (
                <div key={project.id} className="rounded-xl border border-border bg-muted/40 p-4">
                  <div className="mb-1 flex items-center gap-2 font-black text-muted-foreground">
                    <Lock size={16} /> {project.title}
                  </div>
                  <p className="text-xs text-muted-foreground">Conclua a rota para desbloquear.</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CourseRoutePath;
