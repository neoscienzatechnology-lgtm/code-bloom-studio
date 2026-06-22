import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/data/mockData";

interface QuizSectionProps {
  quizId?: string;
  questions: QuizQuestion[];
  onComplete: (correctCount: number) => void;
}

const QuizSection = ({ quizId, questions, onComplete }: QuizSectionProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const advanceLockedRef = useRef(false);
  const completionReportedRef = useRef(false);
  const quizIdentity =
    quizId ??
    questions
      .map((question) => `${question.question}:${question.correctIndex}:${question.options.join("|")}`)
      .join("||");

  useEffect(() => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setFinished(false);
    advanceLockedRef.current = false;
    completionReportedRef.current = false;
  }, [quizIdentity]);

  const q = questions[currentQ];
  const isLastQuestion = currentQ === questions.length - 1;
  const isCorrect = selected === q?.correctIndex;
  const correctOption = q?.options[q.correctIndex];

  const handleSelect = (idx: number) => {
    if (answered) return;
    advanceLockedRef.current = false;
    setSelected(idx);
    setAnswered(true);
  };

  const handleNext = () => {
    if (!answered || finished || advanceLockedRef.current) return;
    advanceLockedRef.current = true;

    const finalCorrectCount = correctCount + (isCorrect ? 1 : 0);
    if (isLastQuestion) {
      if (completionReportedRef.current) return;
      completionReportedRef.current = true;
      setCorrectCount(finalCorrectCount);
      setFinished(true);
      onComplete(finalCorrectCount);
    } else {
      setCorrectCount(finalCorrectCount);
      setCurrentQ((p) => p + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setFinished(false);
    advanceLockedRef.current = false;
    completionReportedRef.current = false;
  };

  /* ── Resultado final ─────────────────────────────────────────── */
  if (finished) {
    const allCorrect = correctCount === questions.length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl border p-5 text-center ${
          allCorrect ? "border-accent/30 bg-accent/5" : "border-border bg-muted/40"
        }`}
      >
        <div className="mb-2 text-4xl">{allCorrect ? "🎉" : "📝"}</div>
        <p className="text-sm font-extrabold text-foreground">
          {allCorrect ? "Perfeito!" : "Quiz concluído!"}{" "}
          <span className="text-primary">{correctCount}/{questions.length}</span> corretas
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {allCorrect
            ? "Você dominou o conceito. Agora aplique isso no exercício."
            : "Revise a explicação, observe o feedback dos erros e tente novamente."}
        </p>
        {!allCorrect && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            className="mt-4 gap-1.5 rounded-full text-xs"
          >
            <RefreshCw size={12} /> Tentar Novamente
          </Button>
        )}
      </motion.div>
    );
  }

  /* ── Pergunta ────────────────────────────────────────────────── */
  return (
    <div className="space-y-4">
      {/* Progress bar + counter */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
          {currentQ + 1}/{questions.length}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          className="space-y-3"
        >
          {/* Question */}
          <p className="text-sm font-bold text-foreground leading-snug">{q.question}</p>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const isThisCorrect = idx === q.correctIndex;
              const isThisSelected = idx === selected;

              let cls =
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all";

              if (!answered) {
                cls += " border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
              } else if (isThisCorrect) {
                cls += " border-accent/50 bg-accent/10 text-primary";
              } else if (isThisSelected) {
                cls += " border-destructive/40 bg-destructive/8 text-destructive";
              } else {
                cls += " border-border bg-card opacity-40";
              }

              return (
                <button key={idx} onClick={() => handleSelect(idx)} disabled={answered} className={cls}>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                      answered && isThisCorrect
                        ? "border-accent bg-accent text-white"
                        : answered && isThisSelected
                        ? "border-destructive bg-destructive text-white"
                        : "border-border"
                    }`}
                  >
                    {answered && isThisCorrect ? (
                      <Check size={12} />
                    ) : answered && isThisSelected && !isThisCorrect ? (
                      <X size={12} />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </span>
                  <span className="font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback after answering */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
                role="status"
                aria-live="polite"
              >
                {/* Result badge */}
                <div
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    isCorrect
                      ? "bg-accent/10 text-primary"
                      : "bg-destructive/8 text-destructive"
                  }`}
                >
                  {isCorrect
                    ? q.successFeedback ?? "Correto. Você escolheu a ideia que resolve o problema."
                    : q.errorFeedback ?? `Quase. A melhor resposta é: "${correctOption}"`}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-xs text-muted-foreground leading-relaxed">
                    Dica: {q.explanation}
                  </div>
                )}

                {!isCorrect && q.hint && (
                  <div className="rounded-xl border border-quest-yellow/30 bg-quest-yellow/5 px-4 py-2.5 text-xs font-semibold text-quest-yellow leading-relaxed">
                    Antes de tentar de novo: {q.hint}
                  </div>
                )}

                {/* Continue button */}
                <Button
                  onClick={handleNext}
                  disabled={finished}
                  className="w-full gap-2 rounded-xl bg-primary font-bold text-white hover:bg-primary/90"
                >
                  {isLastQuestion ? "Ver Resultado" : "Próxima"}
                  <ChevronRight size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizSection;
