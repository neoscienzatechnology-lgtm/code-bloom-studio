import { motion } from "framer-motion";
import { useState } from "react";
import { courses } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Clock, Users, BookOpen, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

const levels = ["Todos", "Iniciante", "Intermediário", "Avançado"] as const;

const levelBadge: Record<string, string> = {
  "Iniciante":     "bg-accent/10 text-accent border-accent/20",
  "Intermediário": "bg-quest-blue/10 text-quest-blue border-quest-blue/20",
  "Avançado":      "bg-destructive/10 text-destructive border-destructive/20",
};

const CoursesPage = () => {
  const [filter, setFilter] = useState<string>("Todos");
  const { getCourseProgress } = useProgress();
  const filtered = filter === "Todos" ? courses : courses.filter((c) => c.level === filter);

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="mimo-section-title mb-1">Catálogo</p>
          <h1 className="text-3xl font-black text-foreground sm:text-4xl">Escolha seu curso</h1>
          <p className="mt-1 text-muted-foreground">Comece agora — todos os cursos são gratuitos.</p>
        </motion.div>

        {/* Level filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                filter === lvl
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course, i) => {
            const realProgress = getCourseProgress(course.lessons.map((l) => l.id));
            const done = realProgress === 100;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/cursos/${course.id}`} className="block h-full">
                  <div className="card-hover mimo-card flex h-full flex-col overflow-hidden">
                    {/* Top band */}
                    <div className="flex items-center justify-between bg-primary/5 px-5 py-4 border-b border-border">
                      <span className="text-4xl">{course.emoji}</span>
                      {done && (
                        <span className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                          <CheckCircle2 size={11} /> Concluído
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="font-extrabold leading-snug text-foreground">
                          {course.title}
                        </h3>
                        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${levelBadge[course.level]}`}>
                          {course.level}
                        </span>
                      </div>

                      <p className="mb-4 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>

                      <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                        <span className="flex items-center gap-1"><BookOpen size={12} /> {course.lessons.length} lições</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {(course.students / 1000).toFixed(1)}k</span>
                      </div>

                      <div className="mt-auto">
                        {realProgress > 0 ? (
                          <>
                            <div className="mb-1.5 flex justify-between text-xs">
                              <span className="text-muted-foreground">Progresso</span>
                              <span className="font-bold text-primary">{realProgress}%</span>
                            </div>
                            <Progress
                              value={realProgress}
                              className="h-2 bg-secondary [&>div]:bg-primary [&>div]:rounded-full"
                            />
                          </>
                        ) : (
                          <span className="text-xs font-bold text-primary">
                            Começar curso →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
