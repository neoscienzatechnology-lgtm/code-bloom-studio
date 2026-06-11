import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ChevronRight, Lightbulb, Play, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import CapyLessonAssistant from "@/components/CapyLessonAssistant";
import MascoteCapivara, { type MascoteCapivaraState } from "@/components/MascoteCapivara";
import { SelfExplain } from "@/components/Metacognition";
import type { LessonEditorState } from "@/hooks/useLessonEditor";
import type { Course, Lesson } from "@/data/mockData";

interface CodeWorkspaceProps {
  lesson: Lesson;
  course: Course;
  code: string;
  onCodeChange: (code: string) => void;
  editor: LessonEditorState;
  mascotState: MascoteCapivaraState;
  showSolution: boolean;
  xpAward: number;
  attempts: number;
  alreadyCompleted: boolean;
  lessonReadyToAdvance: boolean;
  hasNextLesson: boolean;
  revealedHintCount: number;
  onRun: () => void;
  onReset: () => void;
  onNext: () => void;
  onBackToChallenge: () => void;
  onRevealHint: () => void;
  onUseGuidedStarter: () => void;
}

const CodeWorkspace = ({
  lesson,
  course,
  code,
  onCodeChange,
  editor,
  mascotState,
  showSolution,
  xpAward,
  attempts,
  alreadyCompleted,
  lessonReadyToAdvance,
  hasNextLesson,
  revealedHintCount,
  onRun,
  onReset,
  onNext,
  onBackToChallenge,
  onRevealHint,
  onUseGuidedStarter,
}: CodeWorkspaceProps) => {
  const { running, isCorrect, output, reflectiveQ, showXP, codeSaved } = editor;

  return (
    <div className="flex min-h-0 flex-col">
      <CapyLessonAssistant
        title={lesson.title}
        state={mascotState}
        stageLabel="Código"
        objective={lesson.learningObjective ?? lesson.description}
        expectedOutput={lesson.expectedOutput}
        hints={lesson.hints}
        revealedHintCount={revealedHintCount}
        lastFeedback={output}
        attempts={attempts}
        compact
        onRevealHint={onRevealHint}
        onUseGuidedStarter={onUseGuidedStarter}
        className="m-4 mb-0 lg:hidden"
      />
      <div className="min-h-[430px] flex-1 p-4 lg:min-h-0">
        <div className="h-full rounded-2xl border border-border bg-[#1e1e2e] overflow-hidden flex flex-col shadow-sm">
          {/* Editor header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-quest-yellow/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-accent/60" />
              </div>
              <span className="text-xs text-[#585b70] font-mono">
                {course.language.toLowerCase()}
              </span>
              {showSolution && (
                <span className="text-xs rounded-full bg-quest-yellow/10 px-2 py-0.5 text-quest-yellow font-bold">
                  solução
                </span>
              )}
              <span className="flex items-center gap-1 text-[11px] text-[#585b70]" aria-live="polite">
                {codeSaved ? (
                  <>
                    <Check size={11} /> Salvo
                  </>
                ) : (
                  "Salvando…"
                )}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 gap-1 text-xs text-[#6c7086] hover:text-[#cdd6f4]"
            >
              <RotateCcw size={12} /> Reset
            </Button>
          </div>

          {/* Code Editor */}
          <CodeEditor value={code} onChange={onCodeChange} language={course.language} />

          {/* Output */}
          {output && (
            <div
              className={`border-t px-4 py-3 font-mono text-sm ${
                isCorrect === true
                  ? "border-accent/20 bg-accent/5 text-accent"
                  : isCorrect === null
                  ? "border-quest-yellow/20 bg-quest-yellow/5 text-quest-yellow"
                  : "border-destructive/20 bg-destructive/5 text-destructive"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isCorrect === true ? (
                  <Check size={14} />
                ) : isCorrect === null ? (
                  <Lightbulb size={14} />
                ) : (
                  <X size={14} />
                )}
                <span className="font-bold text-xs">
                  {isCorrect === true
                    ? "Correto!"
                    : isCorrect === null
                    ? "Quase lá:"
                    : "Atenção:"}
                </span>
              </div>
              <span className="whitespace-pre-wrap">{output}</span>
              {reflectiveQ && isCorrect !== true && (
                <div className="mt-3 rounded-lg border border-quest-blue/30 bg-quest-blue/5 px-3 py-2 text-xs text-quest-blue font-sans not-italic">
                  <span className="font-bold">🤔 Pense:</span> {reflectiveQ}
                </div>
              )}
              {attempts >= 2 && isCorrect !== true && (
                <div className="mt-2 text-[10px] text-muted-foreground font-sans">
                  Tentativas nesta lição: {attempts} — não desista, você está aprendendo!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isCorrect === true && (
        <div className="px-4">
          <SelfExplain lessonId={lesson.id} />
        </div>
      )}

      {/* Run bar — cola no fundo no mobile (a rota /editor não mostra o menu
          inferior, então não há barra para limpar) */}
      <div className="sticky bottom-0 z-20 border-t border-border/20 bg-[#181825] p-4 shadow-2xl lg:static lg:shadow-none">
        {(running || output || isCorrect !== null || alreadyCompleted) && (
          <MascoteCapivara
            state={mascotState}
            variant="compact"
            className="mb-3 border-white/10 font-sans shadow-none lg:hidden"
          />
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Button
                onClick={onRun}
                disabled={running}
                className="gap-2 rounded-full bg-gradient-to-r from-accent to-[hsl(160,80%,45%)] font-extrabold text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-xl"
              >
                <Play size={16} /> {running ? "Executando..." : "Executar"}
              </Button>
              <AnimatePresence>
                {showXP && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                    animate={{ opacity: 1, scale: 1.2, y: -20 }}
                    exit={{ opacity: 0, y: -40 }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 font-black text-accent text-lg pointer-events-none"
                  >
                    +{xpAward} XP! 🎉
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToChallenge}
              className="gap-1.5 rounded-full text-xs text-muted-foreground lg:hidden"
            >
              <ArrowLeft size={14} /> Ver desafio
            </Button>
          </div>
          <Button
            variant={lessonReadyToAdvance ? "default" : "ghost"}
            onClick={onNext}
            disabled={!lessonReadyToAdvance}
            className={`gap-1 text-sm ${
              lessonReadyToAdvance
                ? "bg-accent/20 text-accent font-bold hover:bg-accent/30"
                : "text-muted-foreground opacity-60"
            }`}
          >
            {hasNextLesson ? "Próxima lição" : "Voltar ao curso"}{" "}
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeWorkspace;
