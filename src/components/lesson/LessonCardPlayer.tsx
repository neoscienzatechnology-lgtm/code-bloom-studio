import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowLeft, Check, ChevronRight, Code2, Lightbulb, Sparkles, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import QuizSection from "@/components/QuizSection";
import GuidedPractice from "@/components/GuidedPractice";
import MascoteCapivara from "@/components/MascoteCapivara";
import { ConfidenceCheck } from "@/components/Metacognition";
import { cardRequiresCompletion, contrastRightOnFirstPosition, type LessonCard } from "@/utils/lessonCards";
import type { Course, Lesson } from "@/data/mockData";

interface LessonCardPlayerProps {
  lesson: Lesson;
  course: Course;
  cards: LessonCard[];
  cardIndex: number;
  alreadyCompleted: boolean;
  onAdvance: () => void;
  onBack: () => void;
  onEnterCode: () => void;
  onQuizPassed: () => void;
}

/** Inline markdown: **bold** and `code` spans. */
const inlineFormat = (text: string) =>
  text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-secondary px-1 font-mono text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });

/** Renders markdown-ish theory text: indented lines become code blocks. */
const TheoryText = ({ text }: { text: string }) => {
  const blocks: { code: boolean; content: string }[] = [];
  for (const line of text.split("\n")) {
    const isCode = /^\s{2,}\S/.test(line);
    const last = blocks[blocks.length - 1];
    if (last && last.code === isCode) {
      last.content += `\n${line}`;
    } else {
      blocks.push({ code: isCode, content: line });
    }
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) =>
        block.code ? (
          <pre
            key={index}
            className="overflow-x-auto rounded-xl bg-[#1e1e2e] px-4 py-3 font-mono text-sm leading-relaxed text-[#cdd6f4]"
          >
            {block.content.replace(/^\s{2}/gm, "")}
          </pre>
        ) : (
          <p key={index} className="whitespace-pre-line leading-relaxed text-foreground">
            {inlineFormat(block.content.trim())}
          </p>
        ),
      )}
    </div>
  );
};

const CardShell = ({
  icon,
  label,
  tone,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  tone: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${tone}`}>
      {icon} {label}
    </div>
    {children}
  </div>
);

const LessonCardPlayer = ({
  lesson,
  course,
  cards,
  cardIndex,
  alreadyCompleted,
  onAdvance,
  onBack,
  onEnterCode,
  onQuizPassed,
}: LessonCardPlayerProps) => {
  const card = cards[cardIndex];
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [contrastPick, setContrastPick] = useState<"first" | "second" | null>(null);

  // Returns the SAME Set instance when nothing changes so React bails out of
  // the update — child effects depending on our callbacks won't loop.
  const markCompleted = () =>
    setCompletedCards((prev) => (prev.has(cardIndex) ? prev : new Set(prev).add(cardIndex)));

  const isLast = cardIndex === cards.length - 1;
  const needsCompletion = card ? cardRequiresCompletion(card.kind) : false;
  const canAdvance = !needsCompletion || completedCards.has(cardIndex) || alreadyCompleted;
  const progress = ((cardIndex + 1) / cards.length) * 100;

  if (!card) return null;

  const rightFirst = contrastRightOnFirstPosition(lesson.id);
  const contrastAnswered = contrastPick !== null || completedCards.has(cardIndex);
  const contrastCorrectPick = rightFirst ? "first" : "second";

  const advance = () => {
    setContrastPick(null);
    if (isLast) onEnterCode();
    else onAdvance();
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6">
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={cardIndex === 0}
          aria-label="Cartão anterior"
          className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ArrowLeft size={18} />
        </button>
        <Progress value={progress} className="h-2 flex-1 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
        <span className="text-xs font-bold text-muted-foreground">
          {cardIndex + 1}/{cards.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cardIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.18 }}
        >
          {card.kind === "confidence" && (
            <CardShell icon={<Target size={13} />} label="Para começar" tone="bg-primary/10 text-primary">
              <h2 className="mb-1 text-xl font-black text-foreground">{lesson.title}</h2>
              <p className="mb-4 text-sm text-muted-foreground">{course.title}</p>
              <ConfidenceCheck lessonId={lesson.id} />
              <MascoteCapivara state="idle" variant="compact" className="mt-3" />
            </CardShell>
          )}

          {card.kind === "objective" && (
            <CardShell icon={<Target size={13} />} label="Objetivo" tone="bg-primary/10 text-primary">
              <h2 className="mb-3 text-xl font-black text-foreground">{card.title}</h2>
              <p className="leading-relaxed text-foreground">{card.text}</p>
            </CardShell>
          )}

          {card.kind === "theory" && (
            <CardShell icon={<Lightbulb size={13} />} label="Aprenda" tone="bg-primary/10 text-primary">
              <TheoryText text={card.text} />
            </CardShell>
          )}

          {card.kind === "analogy" && (
            <CardShell icon={<Sparkles size={13} />} label="Pense assim" tone="bg-quest-yellow/10 text-quest-yellow">
              <p className="text-lg font-semibold leading-relaxed text-foreground">{card.text}</p>
            </CardShell>
          )}

          {card.kind === "example" && (
            <CardShell icon={<Code2 size={13} />} label="Na prática" tone="bg-accent/10 text-accent">
              <pre className="overflow-x-auto rounded-xl bg-[#1e1e2e] px-4 py-3 font-mono text-sm leading-relaxed text-[#cdd6f4]">
                {card.code}
              </pre>
            </CardShell>
          )}

          {card.kind === "mistake" && (
            <CardShell icon={<AlertTriangle size={13} />} label="Cuidado com isto" tone="bg-quest-orange/10 text-quest-orange">
              <p className="leading-relaxed text-foreground">{inlineFormat(card.text)}</p>
            </CardShell>
          )}

          {card.kind === "contrast" && (
            <CardShell icon={<Lightbulb size={13} />} label="Qual está certo?" tone="bg-quest-blue/10 text-quest-blue">
              <div className="space-y-3">
                {(["first", "second"] as const).map((slot) => {
                  const code = (slot === "first") === rightFirst ? card.right : card.wrong;
                  const isRightSlot = slot === contrastCorrectPick;
                  const picked = contrastPick === slot;
                  const border = !contrastAnswered
                    ? "border-border hover:border-primary/50"
                    : isRightSlot
                      ? "border-accent ring-1 ring-accent/40"
                      : picked
                        ? "border-destructive ring-1 ring-destructive/30 opacity-80"
                        : "border-border opacity-50";

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={contrastAnswered}
                      onClick={() => {
                        setContrastPick(slot);
                        markCompleted();
                      }}
                      className={`w-full rounded-xl border-2 bg-[#1e1e2e] px-4 py-3 text-left transition-colors ${border}`}
                    >
                      <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-[#cdd6f4]">{code}</pre>
                      {contrastAnswered && (
                        <span className={`mt-2 inline-flex items-center gap-1 text-xs font-black ${isRightSlot ? "text-accent" : "text-destructive"}`}>
                          {isRightSlot ? <Check size={12} /> : <X size={12} />}
                          {isRightSlot ? "Correto" : "Tem um problema aqui"}
                        </span>
                      )}
                    </button>
                  );
                })}
                {contrastAnswered && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      contrastPick === null || contrastPick === contrastCorrectPick
                        ? "bg-accent/10 text-foreground"
                        : "bg-quest-yellow/10 text-foreground"
                    }`}
                  >
                    {contrastPick !== null && contrastPick !== contrastCorrectPick && (
                      <span className="font-black">Quase! </span>
                    )}
                    {inlineFormat(card.explanation)}
                  </div>
                )}
              </div>
            </CardShell>
          )}

          {card.kind === "quiz" && lesson.quiz && (
            <CardShell icon={<Lightbulb size={13} />} label="Teste seu conhecimento" tone="bg-quest-blue/10 text-quest-blue">
              <QuizSection
                key={lesson.id}
                quizId={lesson.id}
                questions={lesson.quiz}
                onComplete={(correct) => {
                  if (correct === lesson.quiz!.length) {
                    markCompleted();
                    onQuizPassed();
                  }
                }}
              />
            </CardShell>
          )}

          {card.kind === "practice" && (
            <GuidedPractice
              lesson={lesson}
              onCompletionChange={(completed) => {
                if (completed) markCompleted();
              }}
            />
          )}

          {card.kind === "code-intro" && (
            <CardShell icon={<Code2 size={13} />} label="Agora é código" tone="bg-accent/10 text-accent">
              <p className="mb-3 leading-relaxed text-foreground whitespace-pre-line">{lesson.description}</p>
              <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm">
                <span className="font-bold text-muted-foreground">Saída esperada: </span>
                <code className="font-mono text-accent">{lesson.expectedOutput}</code>
              </div>
            </CardShell>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {needsCompletion && !canAdvance ? "Responda para continuar" : ""}
        </span>
        <Button onClick={advance} disabled={!canAdvance} className="gap-2 rounded-full px-6 font-extrabold">
          {isLast ? (
            <>
              Abrir editor <Code2 size={16} />
            </>
          ) : (
            <>
              Continuar <ChevronRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LessonCardPlayer;
