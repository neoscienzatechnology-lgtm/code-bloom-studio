import { motion } from "framer-motion";
import { useMemo } from "react";
import { ArrowRight, CalendarCheck2, Flame, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { courses } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/hooks/useProgress";
import { useAttemptTracker } from "@/hooks/useAttemptTracker";
import { useAuth } from "@/contexts/AuthContext";
import AdaptiveReview from "@/components/AdaptiveReview";
import ConceptMasteryPanel from "@/components/ConceptMasteryPanel";
import DailyGoalRing from "@/components/DailyGoalRing";
import CoachGuide from "@/components/CoachGuide";
import { toLocalDateKey } from "@/utils/studyStats";
import { getPathById } from "@/data/learningPaths";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { Button } from "@/components/ui/button";
import { buildConceptMasteryPlan } from "@/utils/conceptMastery";
import { useConceptMasterySync } from "@/hooks/useConceptMasterySync";
import { selectNextLesson, selectNextPathCourse } from "@/utils/learningPathProgress";
import CourseCoverArt from "@/components/CourseCoverArt";
import LiveBackdrop from "@/components/LiveBackdrop";

const DashboardPage = () => {
  const { totalXp, getCourseProgress, completedLessons, savedCode, studyStats, lessonCompletedAt, streakFreeze } =
    useProgress();
  const { topErrors, attempts } = useAttemptTracker();
  const { user } = useAuth();
  const { profile } = useLearningProfile();
  const displayName = user?.user_metadata?.display_name ?? "estudante";
  const currentPath = getPathById(profile?.goal);

  const coursesWithProgress = courses.map((course) => ({
    ...course,
    realProgress: getCourseProgress(course.lessons.map((lesson) => lesson.id)),
  }));
  const inProgressCourses = coursesWithProgress.filter((course) => course.realProgress > 0 && course.realProgress < 100);
  const completedCoursesList = coursesWithProgress.filter((course) => course.realProgress === 100);
  const continueCourse = selectNextPathCourse(coursesWithProgress, currentPath);
  const currentLesson = selectNextLesson(continueCourse, completedLessons);
  const recommendedCourses = currentPath.recommendedCourses
    .map((id) => coursesWithProgress.find((course) => course.id === id))
    .filter(Boolean);
  const localConceptMastery = useMemo(
    () =>
      buildConceptMasteryPlan({
        courses,
        completedLessons,
        savedCode,
        attempts,
      }),
    [attempts, completedLessons, savedCode],
  );
  const { concepts: conceptMastery, syncLabel } = useConceptMasterySync(localConceptMastery);

  // Meta diária: a meta em minutos do onboarding vira lições (~6 min cada)
  const todayKey = toLocalDateKey(new Date());
  const lessonsToday = Object.entries(lessonCompletedAt).filter(
    ([lessonId, completedAt]) =>
      !lessonId.endsWith("-quiz") && toLocalDateKey(new Date(completedAt)) === todayKey,
  ).length;
  const goalLessons = Math.max(1, Math.round((profile?.dailyGoal ?? 10) / 6));

  return (
    <div className="relative min-h-screen px-4 py-10 sm:px-6">
      <img
        src="/atmos-codetier.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] w-full object-cover opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="mx-auto max-w-7xl">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ct-ambient relative mb-8 overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <LiveBackdrop posterClass="opacity-20" meshOpacity={0.22} />
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="mimo-section-title mb-1">Continue sua jornada</p>
              <h1 className="text-3xl font-black text-foreground">
                Olá, {displayName}. Hoje vamos continuar em {currentPath.shortTitle}
              </h1>
              <div className="ct-surface relative mt-5 rounded-2xl p-5">
                <CourseCoverArt course={continueCourse} className="mb-4 h-32 w-full" />
                <div className="mb-1 text-sm font-black text-primary">Próxima aula</div>
                <h2 className="text-xl font-black text-foreground">{currentLesson.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{continueCourse.title}</p>
                <div className="mt-4 max-w-md">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-bold text-primary">{continueCourse.realProgress}%</span>
                  </div>
                  <Progress value={continueCourse.realProgress} className="h-2 bg-secondary [&>div]:bg-primary" />
                </div>
                <Button asChild className="ct-glow mt-5 rounded-full font-black">
                  <Link to={`/editor/${continueCourse.id}/${currentLesson.id}`}>
                    Continuar aula <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <DailyGoalRing
                lessonsToday={lessonsToday}
                goalLessons={goalLessons}
                streak={studyStats.currentStreak}
              />
              <CoachGuide
                state={completedCoursesList.length > 0 ? "celebrate" : inProgressCourses.length > 0 ? "success" : "idle"}
                message={
                  completedCoursesList.length > 0
                    ? "Curso concluído! Agora vale reforçar com projeto e revisão."
                    : inProgressCourses.length > 0
                      ? "Você está quase liberando o próximo projeto. Uma aula curta hoje já mantém a trilha andando."
                      : "Escolha uma trilha e eu acompanho seu progresso aula por aula."
                }
              />
              <div className="ct-surface rounded-2xl p-4">
                <div className="mb-3 text-sm font-black text-foreground">Seu caminho atual</div>
                <div className="flex flex-wrap items-center gap-2">
                  {currentPath.steps.map((step, index) => (
                    <span key={`${step.label}-${index}`} className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-muted-foreground">
                      {step.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ct-surface rounded-2xl p-4">
                <div className="mb-3 text-sm font-black text-foreground">Cursos recomendados</div>
                <div className="space-y-2">
                  {recommendedCourses.slice(0, 3).map((course) => (
                    <Link
                      key={course!.id}
                      to={`/cursos/${course!.id}`}
                      className="flex items-center gap-3 rounded-lg bg-secondary/70 p-2 text-sm font-bold text-foreground hover:text-primary"
                    >
                      <CourseCoverArt course={course!} variant="thumb" className="h-12 w-16 shrink-0 rounded-lg" />
                      <span>{course!.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <AdaptiveReview topErrors={topErrors} />

            <ConceptMasteryPanel concepts={conceptMastery} syncLabel={syncLabel} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="mb-4 text-xl font-black">Cursos em andamento</h2>
              {inProgressCourses.length > 0 ? (
                <div className="space-y-3">
                  {inProgressCourses.map((course) => {
                    const lessonIdx = Math.floor((course.realProgress / 100) * course.lessons.length);
                    const lesson = course.lessons[Math.min(lessonIdx, course.lessons.length - 1)];
                    return (
                      <Link key={course.id} to={`/editor/${course.id}/${lesson.id}`} className="block">
                        <div className="card-hover flex items-center gap-4 rounded-xl border border-border/30 bg-card p-4">
                          <CourseCoverArt course={course} variant="thumb" className="shrink-0 rounded-xl" />
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-bold">{course.title}</h3>
                            <div className="mt-1.5 flex items-center gap-2">
                              <Progress
                                value={course.realProgress}
                                className="h-2 flex-1 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent"
                              />
                              <span className="whitespace-nowrap text-xs font-bold text-primary">{course.realProgress}%</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum curso em andamento.{" "}
                  <Link to="/cursos" className="font-bold text-primary hover:underline">
                    Comece um!
                  </Link>
                </p>
              )}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
              <Flame className="text-quest-orange" size={20} /> Ritmo de estudo
            </h2>
            <div className="ct-surface rounded-xl p-5">
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="mb-1 flex items-center gap-2 text-xs font-black text-quest-orange">
                    <Flame size={15} /> Sequência
                  </div>
                  <div className="text-2xl font-black text-foreground">{studyStats.currentStreak} dias</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {studyStats.studiedToday ? "Você já estudou hoje." : "Faça uma aula curta hoje para manter o ritmo."}
                  </p>
                  {streakFreeze.available > 0 && (
                    <span
                      className="mt-2 inline-flex items-center gap-1 rounded-full bg-quest-blue/10 px-2.5 py-0.5 text-[11px] font-black text-quest-blue"
                      title="Protetor de ofensiva: cobre um dia perdido para sua sequência não zerar."
                    >
                      <Shield size={12} /> {streakFreeze.available}{" "}
                      {streakFreeze.available === 1 ? "protetor" : "protetores"}
                    </span>
                  )}
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="mb-1 flex items-center gap-2 text-xs font-black text-primary">
                    <Zap size={15} /> Nível {studyStats.level}
                  </div>
                  <Progress
                    value={(studyStats.xpIntoLevel / studyStats.xpForNextLevel) * 100}
                    className="mt-2 h-2 bg-secondary [&>div]:bg-primary"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">{totalXp.toLocaleString()} XP reais acumulados.</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="mb-3 flex items-center gap-2 text-xs font-black text-primary">
                    <CalendarCheck2 size={15} /> Últimos 7 dias
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {studyStats.weeklyActivity.map((day) => (
                      <div key={day.date} className="text-center">
                        <div
                          className={`mx-auto mb-1 h-8 rounded-lg border ${
                            day.active
                              ? "border-accent/40 bg-accent"
                              : day.isToday
                                ? "border-primary/50 bg-primary/10"
                                : "border-border bg-secondary"
                          }`}
                          title={day.date}
                        />
                        <div className="text-[10px] font-bold text-muted-foreground">{day.label.slice(0, 3)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
