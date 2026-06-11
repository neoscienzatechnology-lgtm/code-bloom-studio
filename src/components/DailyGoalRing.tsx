import { Flame } from "lucide-react";

interface DailyGoalRingProps {
  lessonsToday: number;
  goalLessons: number;
  streak: number;
}

/**
 * Anel de progresso da meta diária (Duolingo-style): fecha o ciclo do
 * hábito que o onboarding abre ao perguntar a meta de minutos por dia.
 */
const DailyGoalRing = ({ lessonsToday, goalLessons, streak }: DailyGoalRingProps) => {
  const ratio = Math.min(1, goalLessons > 0 ? lessonsToday / goalLessons : 0);
  const met = ratio >= 1;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="relative h-20 w-20 shrink-0" role="img" aria-label={`Meta de hoje: ${lessonsToday} de ${goalLessons} lições`}>
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" strokeWidth="8" className="stroke-secondary" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ratio)}
            className={met ? "stroke-accent" : "stroke-primary"}
            style={{ transition: "stroke-dashoffset 600ms ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-foreground">
          {met ? "🎉" : `${lessonsToday}/${goalLessons}`}
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-sm font-black text-foreground">
          {met ? "Meta de hoje batida!" : "Meta de hoje"}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {met
            ? "Continue se quiser — cada lição extra vira vantagem amanhã."
            : `${lessonsToday} de ${goalLessons} ${goalLessons === 1 ? "lição" : "lições"} concluídas.`}
        </p>
        {streak > 0 && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-quest-orange/10 px-2.5 py-0.5 text-xs font-black text-quest-orange">
            <Flame size={12} /> {streak} {streak === 1 ? "dia" : "dias"} seguidos
          </span>
        )}
      </div>
    </div>
  );
};

export default DailyGoalRing;
