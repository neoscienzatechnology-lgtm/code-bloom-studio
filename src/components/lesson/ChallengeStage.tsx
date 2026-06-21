import { motion, AnimatePresence } from "framer-motion";
import { Target } from "lucide-react";
import LessonGuide from "@/components/LessonGuide";
import PaceCoach from "@/components/PaceCoach";
import type { CoachState } from "@/components/CoachGuide";
import type { PaceMode } from "@/hooks/useLessonEditor";
import type { Lesson } from "@/data/mockData";

interface ChallengeStageProps {
  lesson: Lesson;
  mascotState: CoachState;
  revealedHintCount: number;
  lastFeedback: string | null;
  showSolution: boolean;
  solutionWarned: boolean;
  canRevealSolution: boolean;
  paceMode: PaceMode;
  bonusActive: boolean;
  onRevealHint: () => void;
  onUseGuidedStarter: () => void;
  onRevealSolution: () => void;
  onUseSimpler: () => void;
  onPaceRevealSolution: () => void;
  onAcceptBonus: () => void;
  onDismissPace: () => void;
}

/**
 * Calm support column for the code phase — matches the lesson cards:
 * one clean task card, the compact guide helper, and adaptive coaching that
 * only appears when the learner is stuck or breezing through.
 */
const ChallengeStage = ({
  lesson,
  mascotState,
  revealedHintCount,
  lastFeedback,
  showSolution,
  solutionWarned,
  canRevealSolution,
  paceMode,
  bonusActive,
  onRevealHint,
  onUseGuidedStarter,
  onRevealSolution,
  onUseSimpler,
  onPaceRevealSolution,
  onAcceptBonus,
  onDismissPace,
}: ChallengeStageProps) => (
  <>
    {/* Task card */}
    <div className="ct-surface mb-4 rounded-2xl p-5">
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-black text-primary">
        <Target size={13} /> Desafio
      </div>
      <p className="leading-relaxed text-foreground whitespace-pre-line">{lesson.description}</p>
      <div className="mt-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm">
        <span className="font-bold text-muted-foreground">Saída esperada: </span>
        <code className="font-mono text-primary">{lesson.expectedOutput}</code>
      </div>
    </div>

    <LessonGuide
      title={lesson.title}
      state={mascotState}
      stageLabel="Desafio"
      objective={lesson.learningObjective ?? lesson.description}
      hints={lesson.hints}
      revealedHintCount={revealedHintCount}
      lastFeedback={lastFeedback}
      onRevealHint={onRevealHint}
      onUseGuidedStarter={onUseGuidedStarter}
      onRevealSolution={onRevealSolution}
      canRevealSolution={canRevealSolution}
      className="mb-4"
    />

    <AnimatePresence>
      {solutionWarned && !showSolution && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 rounded-xl border border-quest-yellow/30 bg-quest-yellow/5 px-4 py-3 text-xs text-quest-yellow"
        >
          Ver a solução vai carregar o código no editor. Tente mais um pouco primeiro: você aprende mais corrigindo o erro.{" "}
          <button
            type="button"
            onClick={onRevealSolution}
            className="ml-1 font-bold underline hover:opacity-80"
          >
            Mostrar mesmo assim
          </button>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Personalização de ritmo: apoio extra ou desafio */}
    <PaceCoach
      mode={paceMode}
      altExplanation={
        lesson.hints[0]
          ? `Foque primeiro nisto: ${lesson.hints[0]} Tente reescrever o código em voz alta antes de digitar.`
          : "Releia o enunciado e tente descrever em uma frase o que o programa precisa fazer antes de codar."
      }
      bonusChallenge={`Conseguiu! Agora tente uma variação: faça o mesmo resultado, mas usando uma estrutura diferente (ex: outra forma de imprimir, uma variável intermediária, ou um pequeno loop). A resposta esperada continua sendo: ${lesson.expectedOutput}`}
      onUseSimpler={onUseSimpler}
      onRevealSolution={onPaceRevealSolution}
      onAcceptBonus={onAcceptBonus}
      onDismiss={onDismissPace}
    />

    {bonusActive && (
      <div className="mt-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground">
        <span className="font-bold text-primary">✨ Modo desafio ativo:</span>{" "}
        tente refazer este exercício de uma forma diferente antes de avançar.
      </div>
    )}
  </>
);

export default ChallengeStage;
