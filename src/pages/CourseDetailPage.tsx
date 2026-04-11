import { motion } from "framer-motion";
import { useParams, Link, Navigate } from "react-router-dom";
import { getCourseById } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, BookOpen, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = getCourseById(courseId || "");

  if (!course) return <Navigate to="/cursos" replace />;

  const completedLessons = Math.floor((course.progress / 100) * course.lessons.length);

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

              {course.progress > 0 && (
                <div className="max-w-md">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-bold text-accent">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2.5 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Lessons list */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="mb-4 text-xl font-black">Lições do Curso 📚</h2>
          <div className="space-y-3">
            {course.lessons.map((lesson, i) => {
              const isCompleted = i < completedLessons;
              const isCurrent = i === completedLessons;
              const isLocked = i > completedLessons;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={isLocked ? "#" : `/editor/${course.id}/${lesson.id}`}
                    className={`block ${isLocked ? "pointer-events-none" : ""}`}
                  >
                    <div className={`card-hover flex items-center gap-4 rounded-xl border p-4 transition-all ${
                      isCompleted
                        ? "border-accent/30 bg-accent/5"
                        : isCurrent
                        ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/20 bg-card opacity-50"
                    }`}>
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                        isCompleted
                          ? "bg-accent/20 text-accent"
                          : isCurrent
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {isCompleted ? <CheckCircle2 size={20} /> : i + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate">{lesson.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">{lesson.description.slice(0, 80)}...</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden text-xs font-bold text-accent sm:block">+{lesson.xpReward} XP</span>
                        {isCurrent ? (
                          <Button size="sm" className="gap-1 rounded-full bg-primary text-primary-foreground">
                            <Play size={14} /> Iniciar
                          </Button>
                        ) : isCompleted ? (
                          <ChevronRight size={18} className="text-accent" />
                        ) : (
                          <span className="text-xs text-muted-foreground">🔒</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
