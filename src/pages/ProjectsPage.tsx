import { Link } from "react-router-dom";
import { ArrowRight, Lock, Trophy } from "lucide-react";
import { projects } from "@/data/projects";
import { courses } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import CoachGuide from "@/components/CoachGuide";

const ProjectsPage = () => {
  const { isCompleted, getCourseProgress } = useProgress();
  const projectStats = projects.map((project) => {
    const course = courses.find((item) => item.id === project.courseId);
    const courseProgress = course ? getCourseProgress(course.lessons.map((lesson) => lesson.id)) : 0;
    return {
      project,
      course,
      courseProgress,
      projectDone: isCompleted(`project-${project.id}`),
      unlocked: courseProgress === 100,
    };
  });
  const hasDoneProject = projectStats.some((item) => item.projectDone);
  const hasUnlockedProject = projectStats.some((item) => item.unlocked);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="mimo-section-title mb-1">Projetos finais</p>
          <h1 className="text-3xl font-black text-foreground sm:text-4xl">Construa algo real para consolidar</h1>
          <p className="mt-2 text-muted-foreground">
            Projetos ficam ligados aos cursos para evitar pular base importante. Quando a rota estiver pronta, eles viram portfólio.
          </p>
        </div>

        <div className="mb-8 max-w-2xl">
          <CoachGuide
            state={hasDoneProject ? "celebrate" : hasUnlockedProject ? "success" : "thinking"}
            message={
              hasDoneProject
                ? "Projeto concluído! Esse é material real para mostrar no portfólio."
                : hasUnlockedProject
                  ? "Projeto liberado! Agora é hora de juntar as ideias em algo real."
                  : "Projeto bom não é prova de memória. É o momento de juntar várias ideias pequenas em uma construção clara."
            }
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {projectStats.map(({ project, course, projectDone, unlocked }) => {
            return (
              <div key={project.id} className={`rounded-2xl border bg-card p-5 ${unlocked ? "border-border" : "border-border opacity-75"}`}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-4xl">{project.emoji}</div>
                    <h2 className="mt-2 text-xl font-black text-foreground">{project.title}</h2>
                    <p className="text-sm font-bold text-primary">{course?.title ?? project.language}</p>
                  </div>
                  {projectDone ? (
                    <Trophy size={20} className="text-primary" />
                  ) : !unlocked ? (
                    <Lock size={20} className="text-muted-foreground" />
                  ) : null}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{project.goal}</p>
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-secondary/60 p-3">
                    <div className="text-[11px] font-bold text-muted-foreground">Etapas</div>
                    <div className="text-sm font-black">{project.steps.length}</div>
                  </div>
                  <div className="rounded-xl bg-secondary/60 p-3">
                    <div className="text-[11px] font-bold text-muted-foreground">Recompensa</div>
                    <div className="text-sm font-black">+{project.xpReward} XP</div>
                  </div>
                </div>
                {unlocked ? (
                  <Button asChild className="rounded-full font-black">
                    <Link to={`/projeto/${project.id}`}>
                      {projectDone ? "Refazer projeto" : "Começar projeto"} <ArrowRight size={16} />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="rounded-full font-black">
                    <Link to={`/cursos/${project.courseId}`}>
                      Concluir curso para liberar
                    </Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
