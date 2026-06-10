import { ArrowLeft, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CapyLessonAssistant from "@/components/CapyLessonAssistant";
import MascoteCapivara, { type MascoteCapivaraState } from "@/components/MascoteCapivara";
import type { Lesson } from "@/data/mockData";

interface CodeStageIntroProps {
  lesson: Lesson;
  mascotState: MascoteCapivaraState;
  attempts: number;
  revealedHintCount: number;
  lastFeedback: string | null;
  onRevealHint: () => void;
  onUseGuidedStarter: () => void;
  onBackToChallenge: () => void;
}

const CodeStageIntro = ({
  lesson,
  mascotState,
  attempts,
  revealedHintCount,
  lastFeedback,
  onRevealHint,
  onUseGuidedStarter,
  onBackToChallenge,
}: CodeStageIntroProps) => (
  <>
    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-accent">
        <Code2 size={16} /> Agora é código
      </div>
      <h2 className="text-2xl font-black text-foreground">{lesson.title}</h2>
      <p className="mt-2 leading-relaxed text-muted-foreground">
        Escreva a solução no editor, execute e compare com a saída esperada. Se travar,
        volte ao desafio ou peça uma dica.
      </p>
      <div className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
        <div className="mb-1 font-black text-muted-foreground">Saída esperada</div>
        <code className="font-mono text-accent">{lesson.expectedOutput}</code>
      </div>
      <Button
        variant="outline"
        onClick={onBackToChallenge}
        className="mt-4 gap-2 rounded-full font-bold"
      >
        <ArrowLeft size={16} /> Ver desafio
      </Button>
    </div>
    <MascoteCapivara state={mascotState} className="mt-5 hidden lg:block" />
    <CapyLessonAssistant
      title={lesson.title}
      state={mascotState}
      stageLabel="Código"
      objective={lesson.learningObjective ?? lesson.description}
      description={lesson.description}
      expectedOutput={lesson.expectedOutput}
      hints={lesson.hints}
      revealedHintCount={revealedHintCount}
      commonMistake={lesson.commonMistake}
      reference={lesson.reference}
      lastFeedback={lastFeedback}
      attempts={attempts}
      compact
      onRevealHint={onRevealHint}
      onUseGuidedStarter={onUseGuidedStarter}
      className="mt-4 hidden lg:block"
    />
  </>
);

export default CodeStageIntro;
