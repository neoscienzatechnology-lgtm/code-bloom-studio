import { Progress } from "@/components/ui/progress";
import type { LessonStage, LessonStageId } from "@/hooks/useLessonStages";

interface LessonStageNavProps {
  stages: LessonStage[];
  currentStage: LessonStage;
  activeStageIndex: number;
  stageProgress: number;
  stageNotice: string | null;
  canEnterStageIndex: (index: number) => boolean;
  onSelectStage: (stage: LessonStageId) => void;
}

const LessonStageNav = ({
  stages,
  currentStage,
  activeStageIndex,
  stageProgress,
  stageNotice,
  canEnterStageIndex,
  onSelectStage,
}: LessonStageNavProps) => (
  <nav
    aria-label="Etapas da aula"
    className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur"
  >
    <div className="mx-auto max-w-screen-2xl">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-black text-primary">
          Etapa {activeStageIndex + 1}/{stages.length}: {currentStage.label}
        </span>
        <span className="text-muted-foreground">Uma ideia por vez</span>
      </div>
      <Progress value={stageProgress} className="mb-3 h-1.5 bg-secondary" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {stages.map((step, stepIndex) => {
          const Icon = step.icon;
          const active = currentStage.id === step.id;
          const unlocked = canEnterStageIndex(stepIndex);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStage(step.id)}
              disabled={!unlocked}
              aria-current={active ? "step" : undefined}
              aria-disabled={!unlocked}
              className={`flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-bold transition-colors ${
                active
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : !unlocked
                  ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/50"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} className="shrink-0" />
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>
      {stageNotice && (
        <div className="mt-3 rounded-xl border border-quest-yellow/30 bg-quest-yellow/5 px-3 py-2 text-xs font-bold text-quest-yellow">
          {stageNotice}
        </div>
      )}
    </div>
  </nav>
);

export default LessonStageNav;
