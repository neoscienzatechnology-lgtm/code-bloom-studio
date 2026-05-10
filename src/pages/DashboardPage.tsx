import { motion } from "framer-motion";
import { userProfile, courses, leaderboard } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useProgress } from "@/hooks/useProgress";
import { useAttemptTracker } from "@/hooks/useAttemptTracker";
import AdaptiveReview from "@/components/AdaptiveReview";
import MascoteCapivara from "@/components/MascoteCapivara";
import { getPathById } from "@/data/learningPaths";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const { totalXp, getCourseProgress } = useProgress();
  const { topErrors } = useAttemptTracker();
  const { profile } = useLearningProfile();
  const displayXp = userProfile.xp + totalXp;
  const currentPath = getPathById(profile?.goal);

  const coursesWithProgress = courses.map((c) => ({
    ...c,
    realProgress: getCourseProgress(c.lessons.map((l) => l.id)),
  }));
  const inProgressCourses = coursesWithProgress.filter((c) => c.realProgress > 0 && c.realProgress < 100);
  const completedCoursesList = coursesWithProgress.filter((c) => c.realProgress === 100);
  const fallbackCourse = coursesWithProgress.find((course) => course.id === currentPath.startCourseId) ?? coursesWithProgress[0];
  const continueCourse = inProgressCourses[0] ?? fallbackCourse;
  const currentLessonIdx = Math.floor((continueCourse.realProgress / 100) * continueCourse.lessons.length);
  const currentLesson = continueCourse.lessons[Math.min(currentLessonIdx, continueCourse.lessons.length - 1)];
  const recommendedCourses = currentPath.recommendedCourses
    .map((id) => coursesWithProgress.find((course) => course.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-accent/10 p-6 sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="mimo-section-title mb-1">Continue sua jornada</p>
              <h1 className="text-3xl font-black text-foreground">
                Olá, {userProfile.name}. Hoje vamos continuar em {currentPath.shortTitle}
              </h1>
              <div className="mt-5 rounded-2xl border border-border bg-card p-5">
                <div className="mb-1 text-sm font-black text-primary">Próxima aula</div>
                <h2 className="text-xl font-black text-foreground">{currentLesson.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{continueCourse.title}</p>
                <div className="mt-4 max-w-md">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-bold text-accent">{continueCourse.realProgress}%</span>
                  </div>
                  <Progress value={continueCourse.realProgress} className="h-2 bg-secondary [&>div]:bg-primary" />
                </div>
                <Button asChild className="mt-5 rounded-full font-black">
                  <Link to={`/editor/${continueCourse.id}/${currentLesson.id}`}>
                    Continuar aula <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <MascoteCapivara
                state={completedCoursesList.length > 0 ? "celebrate" : inProgressCourses.length > 0 ? "success" : "idle"}
                message={
                  completedCoursesList.length > 0
                    ? "Curso concluído! Agora vale reforçar com projeto e revisão."
                    : inProgressCourses.length > 0
                      ? "Você está quase liberando o próximo projeto. Uma aula curta hoje já mantém a trilha andando."
                      : "Escolha uma trilha e eu acompanho seu progresso aula por aula."
                }
              />
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-3 text-sm font-black text-foreground">Seu caminho atual</div>
                <div className="flex flex-wrap items-center gap-2">
                  {currentPath.steps.map((step, index) => (
                    <span key={`${step.label}-${index}`} className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-muted-foreground">
                      {step.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-3 text-sm font-black text-foreground">Cursos recomendados</div>
                <div className="space-y-2">
                  {recommendedCourses.slice(0, 3).map((course) => (
                    <Link key={course!.id} to={`/cursos/${course!.id}`} className="block rounded-lg bg-secondary/70 px-3 py-2 text-sm font-bold text-foreground hover:text-primary">
                      {course!.emoji} {course!.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left col */}
          <div className="lg:col-span-2 space-y-8">
            <AdaptiveReview topErrors={topErrors} />

            {/* In progress */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="mb-4 text-xl font-black">Cursos em andamento 📖</h2>
              {inProgressCourses.length > 0 ? (
                <div className="space-y-3">
                  {inProgressCourses.map((course) => {
                    const currentLessonIdx = Math.floor((course.realProgress / 100) * course.lessons.length);
                    const currentLesson = course.lessons[Math.min(currentLessonIdx, course.lessons.length - 1)];
                    return (
                      <Link key={course.id} to={`/editor/${course.id}/${currentLesson.id}`} className="block">
                        <div className="card-hover flex items-center gap-4 rounded-xl border border-border/30 bg-card p-4">
                          <span className="text-3xl">{course.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold truncate">{course.title}</h3>
                            <div className="mt-1.5 flex items-center gap-2">
                              <Progress value={course.realProgress} className="h-2 flex-1 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
                              <span className="text-xs font-bold text-accent whitespace-nowrap">{course.realProgress}%</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum curso em andamento. <Link to="/cursos" className="text-primary font-bold hover:underline">Comece um!</Link></p>
              )}
            </motion.div>

          </div>

          {/* Right col — Leaderboard */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h2 className="mb-4 text-xl font-black flex items-center gap-2">
              <Trophy className="text-quest-yellow" size={20} /> Ranking Semanal
            </h2>
            <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
              {leaderboard.map((entry, i) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-3 px-4 py-3.5 ${i < leaderboard.length - 1 ? "border-b border-border/20" : ""} ${
                    entry.rank <= 3 ? "bg-quest-yellow/5" : ""
                  }`}
                >
                  <span className={`w-6 text-center font-black ${
                    entry.rank === 1 ? "text-quest-yellow" :
                    entry.rank === 2 ? "text-muted-foreground" :
                    entry.rank === 3 ? "text-quest-orange" : "text-muted-foreground"
                  }`}>
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                  </span>
                  <span className="text-xl">{entry.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{entry.name}</div>
                    <div className="text-[10px] text-muted-foreground">Nível {entry.level}</div>
                  </div>
                  <span className="text-sm font-bold text-primary">{entry.xp.toLocaleString()} XP</span>
                </div>
              ))}

              {/* Current user */}
              <div className="border-t-2 border-primary/30 bg-primary/5 flex items-center gap-3 px-4 py-3.5">
                <span className="w-6 text-center text-xs font-bold text-primary">#{userProfile.rank}</span>
                <span className="text-xl">{userProfile.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{userProfile.name} <span className="text-xs text-primary">(você)</span></div>
                  <div className="text-[10px] text-muted-foreground">Nível {userProfile.level}</div>
                </div>
                <span className="text-sm font-bold text-primary">{displayXp.toLocaleString()} XP</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
