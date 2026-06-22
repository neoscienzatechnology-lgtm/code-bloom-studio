import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Flame, ShieldCheck, Star, TrendingUp, Trophy, UserX } from "lucide-react";
import { courses } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import CoachGuide from "@/components/CoachGuide";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/contexts/AuthContext";
import { buildAchievements, type AchievementRarity } from "@/utils/achievements";
import CourseCoverArt from "@/components/CourseCoverArt";

const rarityColors: Record<AchievementRarity, string> = {
  Comum: "border-muted-foreground/30 bg-muted/30",
  Raro: "border-quest-blue/40 bg-quest-blue/10",
  Épico: "border-primary/40 bg-primary/10",
  Lendário: "border-quest-yellow/40 bg-quest-yellow/10",
};

const ProfilePage = () => {
  const { user } = useAuth();
  const { totalXp, completedLessons, getCourseProgress, studyStats } = useProgress();
  const displayName = user?.user_metadata?.display_name ?? "Estudante CodeTier";
  const initials = displayName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const xpPercent = Math.min((studyStats.xpIntoLevel / studyStats.xpForNextLevel) * 100, 100);
  const completedCourses = courses.filter((course) => getCourseProgress(course.lessons.map((lesson) => lesson.id)) === 100);
  const activeCourses = courses
    .map((course) => ({
      ...course,
      realProgress: getCourseProgress(course.lessons.map((lesson) => lesson.id)),
    }))
    .filter((course) => course.realProgress > 0 && course.realProgress < 100);
  const achievements = buildAchievements({
    completedLessons,
    completedCoursesCount: completedCourses.length,
    totalXp,
    currentStreak: studyStats.currentStreak,
  });
  const unlockedAchievements = achievements.filter((achievement) => achievement.unlocked);

  return (
    <main className="relative min-h-screen bg-background px-4 pb-28 pt-10 sm:px-6 md:pb-10">
      <img
        src="/atmos-codetier.webp"
        loading="lazy"
        decoding="async"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] w-full object-cover opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="mx-auto max-w-7xl">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-[1fr_360px] lg:items-start"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#4DE84A] to-[#1C8F2A] text-3xl font-black text-white shadow-lg shadow-primary/20">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="mimo-section-title mb-1">Perfil</p>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-foreground">{displayName}</h1>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-bold text-primary">
                  Nível {studyStats.level}
                </span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                {studyStats.activeDays > 0
                  ? `${studyStats.activeDays} dias com estudo registrado`
                  : "Comece uma trilha para criar seu histórico real de estudo."}
              </p>
              <div className="max-w-xl">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">XP para o próximo nível</span>
                  <span className="font-bold text-primary">
                    {studyStats.xpIntoLevel.toLocaleString()} / {studyStats.xpForNextLevel.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={xpPercent}
                  className="h-3 bg-secondary [&>div]:rounded-full [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent"
                />
              </div>
            </div>
          </div>

          <CoachGuide
            state={completedCourses.length > 0 ? "celebrate" : activeCourses.length > 0 ? "success" : "idle"}
            message={
              completedCourses.length > 0
                ? "Seu perfil já tem conquistas reais. Agora vale reforçar com projetos."
                : activeCourses.length > 0
                  ? "Seu progresso está tomando forma. Continue pela próxima aula."
                  : "Comece uma trilha para preencher seu perfil com progresso real."
            }
          />
        </motion.section>

        <section className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <Flame className="mx-auto mb-2 text-quest-orange" size={22} />
            <div className="text-2xl font-black text-foreground">{studyStats.currentStreak}</div>
            <div className="text-xs font-bold text-muted-foreground">dias de sequência</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <Star className="mx-auto mb-2 text-quest-yellow" size={22} />
            <div className="text-2xl font-black text-foreground">{completedCourses.length}</div>
            <div className="text-xs font-bold text-muted-foreground">cursos concluídos</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <TrendingUp className="mx-auto mb-2 text-primary" size={22} />
            <div className="text-2xl font-black text-foreground">{completedLessons.length}</div>
            <div className="text-xs font-bold text-muted-foreground">atividades concluídas</div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <h2 className="mb-4 text-xl font-black text-foreground">Cursos em andamento</h2>
            {activeCourses.length > 0 ? (
              <div className="space-y-3">
                {activeCourses.map((course) => {
                  const currentLessonIdx = Math.floor((course.realProgress / 100) * course.lessons.length);
                  const currentLesson = course.lessons[Math.min(currentLessonIdx, course.lessons.length - 1)];

                  return (
                    <Link key={course.id} to={`/editor/${course.id}/${currentLesson.id}`} className="block">
                      <div className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40">
                        <div className="mb-3 flex items-center gap-3">
                          <CourseCoverArt course={course} variant="thumb" className="shrink-0 rounded-xl" />
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-black text-foreground">{course.title}</h3>
                            <p className="text-xs text-muted-foreground">{currentLesson.title}</p>
                          </div>
                          <ArrowRight size={16} className="text-primary" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={course.realProgress} className="h-2 flex-1 bg-secondary [&>div]:bg-primary" />
                          <span className="text-xs font-black text-primary">{course.realProgress}%</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
                Nenhum curso em andamento.{" "}
                <Link to="/cursos" className="font-black text-primary hover:underline">
                  Escolha uma trilha
                </Link>
                .
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-foreground">
              <Trophy size={20} className="text-quest-yellow" /> Conquistas
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`rounded-2xl border p-4 text-center transition ${
                    achievement.unlocked ? rarityColors[achievement.rarity] : "border-border/20 bg-muted/20 opacity-60 grayscale"
                  }`}
                >
                  <div className="mb-2 text-3xl">{achievement.emoji}</div>
                  <div className="truncate text-xs font-black text-foreground">{achievement.name}</div>
                  <div className="mt-1 text-[10px] font-bold text-muted-foreground">{achievement.rarity}</div>
                  {!achievement.unlocked && (
                    <div className="mt-2">
                      <Progress
                        value={(achievement.progress / achievement.target) * 100}
                        className="h-1.5 bg-secondary [&>div]:bg-primary"
                      />
                      <div className="mt-1 text-[10px] font-bold text-muted-foreground">
                        {achievement.progress}/{achievement.target}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {unlockedAchievements.length}/{achievements.length} conquistas liberadas com progresso real.
            </p>
          </section>
        </div>

        {completedCourses.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-black text-foreground">Cursos concluídos</h2>
            <div className="flex flex-wrap gap-3">
              {completedCourses.map((course) => (
                <Link key={course.id} to={`/cursos/${course.id}`}>
                  <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
                    <CourseCoverArt course={course} variant="thumb" className="h-8 w-10 shrink-0 rounded-lg" />
                    <span className="text-sm font-bold">{course.title}</span>
                    <span className="text-primary">✓</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-xl font-black text-foreground">Conta e segurança</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              to="/privacidade"
              className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4 transition hover:border-primary/40"
            >
              <ShieldCheck size={20} className="text-primary" />
              <div>
                <div className="font-black text-foreground">Política de privacidade</div>
                <p className="text-xs text-muted-foreground">Entenda como o CodeTier usa dados de conta e progresso.</p>
              </div>
            </Link>
            <Link
              to="/termos"
              className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4 transition hover:border-accent/40"
            >
              <FileText size={20} className="text-primary" />
              <div>
                <div className="font-black text-foreground">Termos de uso</div>
                <p className="text-xs text-muted-foreground">Veja as regras para estudar, praticar e salvar progresso.</p>
              </div>
            </Link>
            <Link
              to="/excluir-conta"
              className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4 transition hover:border-destructive/40"
            >
              <UserX size={20} className="text-destructive" />
              <div>
                <div className="font-black text-foreground">Excluir conta</div>
                <p className="text-xs text-muted-foreground">Solicite a remoção dos dados vinculados à sua conta.</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
