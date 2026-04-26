import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, CheckCircle2, PlayCircle, ChevronRight } from "lucide-react";
import { courses } from "@/data/mockData";
import { useProgress } from "@/hooks/useProgress";

type LessonStatus = "completed" | "available" | "locked";

const statusStyle: Record<LessonStatus, string> = {
  completed: "border-accent/40 bg-accent/5 hover:border-accent",
  available: "border-primary/40 bg-primary/5 hover:border-primary shadow-sm shadow-primary/10",
  locked: "border-border bg-card/50 opacity-60",
};

const statusBadge: Record<LessonStatus, { icon: JSX.Element; label: string; cls: string }> = {
  completed: {
    icon: <CheckCircle2 size={12} />,
    label: "Concluído",
    cls: "bg-accent/15 text-accent border-accent/30",
  },
  available: {
    icon: <PlayCircle size={12} />,
    label: "Disponível",
    cls: "bg-primary/15 text-primary border-primary/30",
  },
  locked: {
    icon: <Lock size={12} />,
    label: "Bloqueado",
    cls: "bg-secondary text-muted-foreground border-border",
  },
};

const RoadmapPage = () => {
  const { isCompleted } = useProgress();

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="mimo-section-title mb-1">Trilha de aprendizado</p>
          <h1 className="text-3xl font-black text-foreground sm:text-4xl">
            Sua jornada de programação
          </h1>
          <p className="mt-1 text-muted-foreground">
            Veja o caminho completo, o que você já dominou e o que vem a seguir.
          </p>
        </motion.div>

        <div className="space-y-12">
          {courses.map((course, courseIdx) => {
            // Determine status for each lesson sequentially
            let firstUnfinishedFound = false;
            const lessonsWithStatus = course.lessons.map((lesson) => {
              const done = isCompleted(lesson.id);
              let status: LessonStatus;
              if (done) {
                status = "completed";
              } else if (!firstUnfinishedFound) {
                status = "available";
                firstUnfinishedFound = true;
              } else {
                status = "locked";
              }
              return { lesson, status };
            });

            const completedCount = lessonsWithStatus.filter(
              (l) => l.status === "completed"
            ).length;
            const totalCount = course.lessons.length;
            const pct = Math.round((completedCount / totalCount) * 100);

            return (
              <motion.section
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: courseIdx * 0.08 }}
              >
                {/* Course header */}
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                    {course.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-xl font-extrabold text-foreground">
                        {course.title}
                      </h2>
                      <span className="shrink-0 rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        {course.level}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {completedCount} de {totalCount} lições · {pct}%
                    </p>
                  </div>
                </div>

                {/* Vertical roadmap */}
                <div className="relative ml-6 border-l-2 border-dashed border-border pl-6">
                  {lessonsWithStatus.map(({ lesson, status }, idx) => {
                    const badge = statusBadge[status];
                    const prereq =
                      idx > 0 ? lessonsWithStatus[idx - 1].lesson.title : null;

                    const inner = (
                      <div
                        className={`mimo-card relative flex items-center gap-4 border-2 p-4 transition-all ${statusStyle[status]}`}
                      >
                        {/* Step number */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                            status === "completed"
                              ? "bg-accent text-accent-foreground"
                              : status === "available"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {status === "completed" ? (
                            <CheckCircle2 size={18} />
                          ) : status === "locked" ? (
                            <Lock size={14} />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-foreground">
                              {lesson.title}
                            </h3>
                            <span
                              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.cls}`}
                            >
                              {badge.icon} {badge.label}
                            </span>
                          </div>
                          {prereq && status === "locked" && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Pré-requisito: {prereq}
                            </p>
                          )}
                          {status === "available" && (
                            <p className="mt-0.5 text-xs text-primary font-bold">
                              Você está aqui — comece esta lição
                            </p>
                          )}
                          {status === "completed" && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              +{lesson.xpReward} XP conquistados
                            </p>
                          )}
                        </div>

                        {status !== "locked" && (
                          <ChevronRight
                            size={18}
                            className="shrink-0 text-muted-foreground"
                          />
                        )}
                      </div>
                    );

                    // Connector dot on the timeline
                    const dotColor =
                      status === "completed"
                        ? "bg-accent"
                        : status === "available"
                        ? "bg-primary animate-pulse"
                        : "bg-border";

                    return (
                      <div key={lesson.id} className="relative mb-4 last:mb-0">
                        <span
                          className={`absolute -left-[33px] top-6 h-3 w-3 rounded-full ring-4 ring-background ${dotColor}`}
                        />
                        {status === "locked" ? (
                          <div className="cursor-not-allowed">{inner}</div>
                        ) : (
                          <Link
                            to={`/editor/${course.id}/${lesson.id}`}
                            className="block"
                          >
                            {inner}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
