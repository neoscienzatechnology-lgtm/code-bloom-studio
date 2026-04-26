import { motion } from "framer-motion";
import { useParams, Link, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, BookOpen, ChevronRight, Play, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAugmentedCourseById } from "@/data/checkpoints";
import { useProgress } from "@/hooks/useProgress";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = getAugmentedCourseById(courseId || "");
  const { isCompleted } = useProgress();

  if (!course) return <Navigate to="/cursos" replace />;

  const completedLessons = course.lessons.filter((l) => isCompleted(l.id)).length;
  const progressPct = Math.round((completedLessons / course.lessons.length) * 100);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-border/30 bg-card p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-5xl">
              {course.emoji}
            </div>
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black sm:text-3xl">{course.title}</h1>
                {course.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[10px] font-bold">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">{course.description}</p>

              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                <span className="flex items-center gap-1"><Users size={14} /> {course.students.toLocaleString()} alunos</span>
                <span className="flex items-center gap-1"><BookOpen size={14} /> {course.lessons.length} lições</span>
                <Badge variant="outline" className="text-xs font-bold">{course.level}</Badge>
              </div>

              {progressPct > 0 && (
                <div className="max-w-md">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-bold text-accent">{progressPct}%</span>
                  </div>
                  <Progress value={progressPct} className="h-2.5 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Lessons list */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="mb-4 text-xl font-black">Lições do Curso 📚</h2>
          <div className="space-y-3">
            {(() => {
              let firstUnfinished = false;
              return course.lessons.map((lesson, i) => {
                const done = isCompleted(lesson.id);
                const current = !done && !firstUnfinished;
                if (current) firstUnfinished = true;
                const locked = !done && !current;
                const isCheckpoint = lesson.kind === "checkpoint";
                const href = isCheckpoint
                  ? `/checkpoint/${course.id}/${lesson.id}`
                  : `/editor/${course.id}/${lesson.id}`;

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={locked ? "#" : href}
                      className={`block ${locked ? "pointer-events-none" : ""}`}
                    >
                      <div className={`card-hover flex items-center gap-4 rounded-xl border p-4 transition-all ${
                        done
                          ? "border-accent/30 bg-accent/5"
                          : current
                          ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                          : "border-border/20 bg-card opacity-50"
                      } ${isCheckpoint ? "border-dashed" : ""}`}>
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                          done
                            ? "bg-accent/20 text-accent"
                            : current
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {done ? <CheckCircle2 size={20} /> : isCheckpoint ? <ShieldCheck size={18} /> : i + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold truncate">{lesson.title}</h3>
                            {isCheckpoint && (
                              <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                Checkpoint
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{lesson.description.slice(0, 80)}...</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="hidden text-xs font-bold text-accent sm:block">+{lesson.xpReward} XP</span>
                          {current ? (
                            <Button size="sm" className="gap-1 rounded-full bg-primary text-primary-foreground">
                              <Play size={14} /> Iniciar
                            </Button>
                          ) : done ? (
                            <ChevronRight size={18} className="text-accent" />
                          ) : (
                            <span className="text-xs text-muted-foreground">🔒</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              });
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
