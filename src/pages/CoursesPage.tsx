import { motion } from "framer-motion";
import { useState } from "react";
import { courses } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";

const levels = ["Todos", "Iniciante", "Intermediário", "Avançado"] as const;

const tagColors: Record<string, string> = {
  "Popular": "bg-quest-yellow/15 text-quest-yellow border-quest-yellow/30",
  "Novo": "bg-accent/15 text-accent border-accent/30",
  "Em alta": "bg-quest-pink/15 text-quest-pink border-quest-pink/30",
};

const CoursesPage = () => {
  const [filter, setFilter] = useState<string>("Todos");
  const filtered = filter === "Todos" ? courses : courses.filter((c) => c.level === filter);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="mb-2 text-3xl font-black sm:text-4xl">
            Catálogo de <span className="text-gradient">Cursos</span> 📚
          </h1>
          <p className="text-muted-foreground">Escolha sua próxima aventura e comece a codar!</p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                filter === lvl
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to="/editor" className="block">
                <div className="card-hover group rounded-2xl border border-border/30 bg-card overflow-hidden">
                  {/* Header band */}
                  <div className={`flex items-center justify-between bg-gradient-to-r from-${course.color}/20 to-transparent px-5 py-4`}>
                    <span className="text-4xl">{course.emoji}</span>
                    <div className="flex gap-1.5">
                      {course.tags.map((tag) => (
                        <span key={tag} className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tagColors[tag]}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="mb-1 font-extrabold leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <Badge variant="outline" className="mb-3 text-[10px] font-bold">
                      {course.level}
                    </Badge>

                    <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {course.students.toLocaleString()}</span>
                    </div>

                    {course.progress > 0 && (
                      <div>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-bold text-accent">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
                      </div>
                    )}
                    {course.progress === 0 && (
                      <div className="text-xs font-bold text-primary">Começar curso →</div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
