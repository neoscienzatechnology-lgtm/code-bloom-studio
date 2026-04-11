import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, HelpCircle } from "lucide-react";
import type { QuizQuestion } from "@/data/mockData";

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (correctCount: number) => void;
}

const QuizSection = ({ questions, onComplete }: QuizSectionProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[currentQ];
  const isCorrect = selected === q?.correctIndex;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const newCount = idx === q.correctIndex ? correctCount + 1 : correctCount;
    if (idx === q.correctIndex) setCorrectCount(newCount);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((prev) => prev + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        setFinished(true);
        onComplete(newCount);
      }
    }, 1200);
  };

  if (finished) {
    const allCorrect = correctCount === questions.length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-xl border p-5 text-center ${
          allCorrect
            ? "border-accent/30 bg-accent/5"
            : "border-quest-yellow/30 bg-quest-yellow/5"
        }`}
      >
        <div className="mb-2 text-3xl">{allCorrect ? "🎉" : "📝"}</div>
        <div className="text-sm font-bold">
          {allCorrect ? "Perfeito!" : "Quiz concluído!"} {correctCount}/{questions.length} corretas
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {allCorrect ? "Você dominou o conceito!" : "Revise a teoria e tente novamente o exercício!"}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Progress dots */}
      <div className="flex items-center gap-2">
        <HelpCircle size={14} className="text-quest-blue" />
        <span className="text-xs font-bold text-quest-blue">
          Pergunta {currentQ + 1} de {questions.length}
        </span>
        <div className="ml-auto flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-4 rounded-full transition-colors ${
                i < currentQ
                  ? "bg-accent"
                  : i === currentQ
                  ? "bg-quest-blue"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <p className="mb-3 text-sm font-bold text-foreground">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              let borderClass = "border-border/30 bg-card hover:border-quest-blue/50 hover:bg-quest-blue/5";
              if (answered) {
                if (idx === q.correctIndex) {
                  borderClass = "border-accent/50 bg-accent/10";
                } else if (idx === selected) {
                  borderClass = "border-destructive/50 bg-destructive/10";
                } else {
                  borderClass = "border-border/20 bg-card opacity-50";
                }
              } else if (idx === selected) {
                borderClass = "border-quest-blue/50 bg-quest-blue/5";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${borderClass}`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-bold">
                    {answered && idx === q.correctIndex ? (
                      <Check size={12} className="text-accent" />
                    ) : answered && idx === selected ? (
                      <X size={12} className="text-destructive" />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizSection;
