import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, GraduationCap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type DailyGoal,
  type ExperienceLevel,
  type LearningGoal,
  useLearningProfile,
} from "@/hooks/useLearningProfile";
import { learningPaths } from "@/data/learningPaths";
import { courses } from "@/data/mockData";
import { selectPathStartCourse } from "@/utils/learningPathProgress";
import MascoteCapivara from "@/components/MascoteCapivara";

const experienceOptions: Array<{ value: ExperienceLevel; title: string; description: string }> = [
  { value: "new", title: "Nunca programei", description: "Começar devagar, com linguagem simples e muitos exemplos." },
  { value: "basic", title: "Sei o básico", description: "Revisar fundamentos e avançar com prática guiada." },
  { value: "intermediate", title: "Já construí algo", description: "Ir mais rápido para projetos e conceitos aplicados." },
];

const dailyOptions: Array<{ value: DailyGoal; label: string }> = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 25, label: "25 min" },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { setProfile } = useLearningProfile();
  const [experience, setExperience] = useState<ExperienceLevel>("new");
  const [goal, setGoal] = useState<LearningGoal>("frontend");
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>(10);

  const selectedPath = useMemo(
    () => learningPaths.find((path) => path.id === goal) ?? learningPaths[0],
    [goal]
  );

  const finish = () => {
    const targetCourse = selectPathStartCourse(
      courses.map((course) => ({ ...course, realProgress: 0 })),
      selectedPath,
      null,
    );
    setProfile({
      experience,
      goal,
      dailyGoal,
      createdAt: new Date().toISOString(),
    });
    navigate(`/cursos/${targetCourse.id}`);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="mimo-section-title mb-1">Comece pelo objetivo</p>
          <h1 className="text-3xl font-black text-foreground sm:text-4xl">
            O que você quer aprender a criar?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Em vez de escolher uma linguagem no escuro, escolha o resultado. O app monta a trilha certa para você.
          </p>
        </div>

        <div className="mb-8 max-w-2xl">
          <MascoteCapivara
            state="thinking"
            message="Boa escolha começa pelo objetivo. Depois eu mostro quais tecnologias entram em cada etapa."
          />
        </div>

        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-primary">
            <Target size={16} /> 1. Escolha o que você quer construir
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {learningPaths.map((path) => (
              <button
                key={path.id}
                onClick={() => setGoal(path.id)}
                className={`rounded-2xl border p-5 text-left transition-all ${
                  goal === path.id
                    ? "border-primary bg-primary/10 ring-1 ring-primary/20"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-foreground">{path.title}</div>
                    <div className="mt-1 text-xs font-bold text-primary">{path.technologies.join(" · ")}</div>
                  </div>
                  {goal === path.id && <CheckCircle2 size={18} className="shrink-0 text-primary" />}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{path.description}</p>
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section>
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-quest-blue">
                <GraduationCap size={16} /> 2. Qual é sua experiência?
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {experienceOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setExperience(option.value)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      experience === option.value
                        ? "border-quest-blue bg-quest-blue/10 ring-1 ring-quest-blue/20"
                        : "border-border bg-card hover:border-quest-blue/30"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="font-black text-foreground">{option.title}</div>
                      {experience === option.value && <CheckCircle2 size={16} className="text-quest-blue" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-accent">
                <Clock size={16} /> 3. Quanto tempo por dia?
              </div>
              <div className="flex flex-wrap gap-2">
                {dailyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDailyGoal(option.value)}
                    className={`rounded-full border px-5 py-2 text-sm font-black transition-all ${
                      dailyGoal === option.value
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-accent/40"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="mb-2 text-sm font-black text-primary">Comece por aqui</div>
            <h2 className="text-xl font-black text-foreground">{selectedPath.shortTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selectedPath.mentorTip}</p>
            <div className="my-5 space-y-2">
              {selectedPath.steps.map((step, index) => (
                <div key={`${step.label}-${index}`} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-xs font-black text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-sm font-black text-foreground">{step.label}</div>
                    {step.note && <div className="text-xs text-muted-foreground">{step.note}</div>}
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={finish} className="w-full rounded-full font-black">
              Começar minha trilha <ArrowRight size={16} />
            </Button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default OnboardingPage;
