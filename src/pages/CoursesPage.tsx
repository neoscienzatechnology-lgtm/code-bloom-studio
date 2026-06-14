import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Code2, Compass, Lock, Route, Sparkles } from "lucide-react";
import { courses } from "@/data/mockData";
import { getCourseMeta, learningPaths, type LearningPath } from "@/data/learningPaths";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import CoachGuide from "@/components/CoachGuide";
import CourseCoverArt from "@/components/CourseCoverArt";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { calculatePathProgress, selectPathStartCourse } from "@/utils/learningPathProgress";

const tabs = ["Trilhas", "Explorar"] as const;
const pathCoverCourseIds: Record<string, string> = {
  frontend: "9",
  "modern-web": "2",
  backend: "5",
  "python-ai": "12",
  mobile: "11",
  games: "13",
};

const exploreGroups = [
  { title: "Linguagens", match: ["HTML", "CSS", "JavaScript", "Python", "Lógica"] },
  { title: "Frameworks", match: ["React", "React Native", "Node.js"] },
  { title: "Especializações", match: ["Dados e IA", "Jogos"] },
  { title: "Ferramentas", match: ["Git", "SQL"] },
  { title: "Projetos", match: [] },
];

const isCourseUnlocked = (courseId: string, completedCourseIds: string[]) => {
  if (courseId === "3") return completedCourseIds.includes("2");
  if (courseId === "5") return completedCourseIds.includes("2");
  if (courseId === "4") return completedCourseIds.includes("9");
  if (courseId === "8") return completedCourseIds.includes("10");
  if (courseId === "11") return completedCourseIds.includes("3");
  if (courseId === "12") return completedCourseIds.includes("1");
  if (courseId === "13") return completedCourseIds.includes("2") && completedCourseIds.includes("10");
  return true;
};

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Trilhas");
  const navigate = useNavigate();
  const { getCourseProgress } = useProgress();
  const { profile, setProfile } = useLearningProfile();

  const courseProgress = useMemo(
    () =>
      courses.map((course) => ({
        course,
        progress: getCourseProgress(course.lessons.map((lesson) => lesson.id)),
      })),
    [getCourseProgress]
  );
  const completedCourseIds = courseProgress.filter((item) => item.progress === 100).map((item) => item.course.id);
  const coursesWithProgress = courseProgress.map(({ course, progress }) => ({
    ...course,
    realProgress: progress,
  }));

  const startPath = (path: LearningPath) => {
    const targetCourse = selectPathStartCourse(coursesWithProgress, path, profile?.goal);
    setProfile({
      experience: profile?.experience ?? "new",
      goal: path.id,
      dailyGoal: profile?.dailyGoal ?? 10,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
    });
    navigate(`/cursos/${targetCourse.id}`);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="mimo-section-title mb-1">Aprendizado guiado</p>
          <h1 className="text-3xl font-black text-foreground sm:text-4xl">Escolha pelo que você quer construir</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Primeiro escolha uma trilha com objetivo claro. Quando souber exatamente o que procura, use o catálogo por tecnologia.
          </p>
        </motion.div>

        <div className="mb-8 max-w-2xl">
          <CoachGuide
            state={activeTab === "Trilhas" ? "thinking" : "idle"}
            message="Minha sugestão: se você está começando, siga uma trilha. O catálogo fica aqui para quando você já souber qual tecnologia quer estudar."
          />
        </div>

        <div className="mb-8 flex w-fit rounded-xl border border-border bg-card p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-5 py-2 text-sm font-black transition ${
                activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Trilhas" ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {learningPaths.map((path, index) => {
              const pathCourses = path.steps
                .map((step) => courses.find((course) => course.id === step.courseId))
                .filter(Boolean);
              const pathProgress = calculatePathProgress(coursesWithProgress, path, learningPaths, profile?.goal);
              const coverCourseId = pathCoverCourseIds[path.id] ?? path.startCourseId;
              const startCourse = courses.find((course) => course.id === coverCourseId) ?? pathCourses[0];

              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  {startCourse && <CourseCoverArt course={startCourse} className="-m-5 mb-5 rounded-b-none border-0" />}
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-1 flex items-center gap-2 text-sm font-black text-primary">
                        <Route size={16} /> {path.objective}
                      </div>
                      <h2 className="text-xl font-black text-foreground">{path.title}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{path.description}</p>
                    </div>
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-black text-muted-foreground">
                      {path.level}
                    </span>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {path.technologies.map((tech) => (
                      <span key={tech} className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mb-5 rounded-xl border border-border bg-background p-4">
                    <div className="mb-3 flex items-center justify-between text-xs">
                      <span className="font-bold text-muted-foreground">Caminho guiado</span>
                      <span className="font-black text-primary">{pathProgress}%</span>
                    </div>
                    <Progress value={pathProgress} className="mb-4 h-2 bg-secondary [&>div]:bg-primary" />
                    <div className="flex flex-wrap items-center gap-2">
                      {path.steps.map((step, stepIndex) => (
                        <div key={`${path.id}-${step.label}`} className="flex items-center gap-2">
                          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-black text-foreground">
                            {step.label}
                          </span>
                          {stepIndex < path.steps.length - 1 && <ArrowRight size={14} className="text-muted-foreground" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-secondary/60 p-3">
                      <div className="text-[11px] font-bold text-muted-foreground">Duração</div>
                      <div className="text-sm font-black">{path.duration}</div>
                    </div>
                    <div className="rounded-xl bg-secondary/60 p-3 sm:col-span-2">
                      <div className="text-[11px] font-bold text-muted-foreground">Projeto final</div>
                      <div className="text-sm font-black">{path.finalProject}</div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => startPath(path)}
                    className="rounded-full font-black"
                  >
                    {profile?.goal === path.id ? "Continuar trilha" : "Começar trilha"} <ArrowRight size={16} />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8">
            {exploreGroups.map((group) => {
              const groupCourses =
                group.match.length > 0
                  ? courseProgress.filter(({ course }) => group.match.includes(course.language))
                  : [];

              if (group.title === "Projetos") {
                return (
                  <section key={group.title} className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-primary">
                      <Sparkles size={16} /> Projetos
                    </div>
                    <h2 className="text-xl font-black text-foreground">Projetos aparecem no final das trilhas</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Assim o aluno não pula direto para um projeto sem ter a base necessária.
                    </p>
                  </section>
                );
              }

              return (
                <section key={group.title}>
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-foreground">
                    <Compass size={16} className="text-primary" /> {group.title}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {groupCourses.map(({ course, progress }) => {
                      const meta = getCourseMeta(course);
                      const unlocked = isCourseUnlocked(course.id, completedCourseIds);
                      return (
                        <Link
                          key={course.id}
                          to={unlocked ? `/cursos/${course.id}` : "#"}
                          className={unlocked ? "block" : "pointer-events-none block"}
                        >
                          <div className={`card-hover h-full rounded-2xl border bg-card p-5 ${unlocked ? "border-border" : "border-border opacity-60"}`}>
                            <CourseCoverArt course={course} className="-m-5 mb-5 rounded-b-none border-0" />
                            <div className="mb-4 flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-black text-foreground">{course.title}</h3>
                                <p className="text-xs font-bold text-primary">{meta.kind}</p>
                              </div>
                              {progress === 100 ? (
                                <CheckCircle2 size={18} className="text-primary" />
                              ) : !unlocked ? (
                                <Lock size={18} className="text-muted-foreground" />
                              ) : null}
                            </div>
                            <div className="space-y-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Code2 size={13} /> Nível: {course.level}
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen size={13} /> Pré-requisito: {meta.prerequisite}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={13} /> Duração: {course.duration}
                              </div>
                            </div>
                            <div className="mt-4 rounded-lg bg-secondary/70 p-3 text-xs">
                              <span className="font-bold text-muted-foreground">Projeto final: </span>
                              <span className="font-black text-foreground">{meta.finalProject}</span>
                            </div>
                            {!unlocked && meta.lockedUntil && (
                              <div className="mt-3 text-xs font-black text-muted-foreground">
                                Bloqueado até concluir {meta.lockedUntil}
                              </div>
                            )}
                            {progress > 0 && (
                              <div className="mt-4">
                                <div className="mb-1 flex justify-between text-xs">
                                  <span className="text-muted-foreground">Progresso</span>
                                  <span className="font-bold text-primary">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-secondary [&>div]:bg-primary" />
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
