import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { AlertTriangle, ArrowLeft, Check, ChevronRight, Code2, Lightbulb, Sparkles, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import QuizSection from "@/components/QuizSection";
import GuidedPractice from "@/components/GuidedPractice";
import MascoteCapivara from "@/components/MascoteCapivara";
import LessonVisualAid from "@/components/LessonVisualAid";
import CardIllustration from "@/components/lesson/CardIllustration";
import ConceptDiagram from "@/components/lesson/ConceptDiagram";
import { ConfidenceCheck } from "@/components/Metacognition";
import { cardRequiresCompletion, contrastRightOnFirstPosition, type LessonCard } from "@/utils/lessonCards";
import { getConceptFamily } from "@/utils/conceptDiagram";
import {
  classifyTheoryLine,
  splitInlineTokens,
  stripLineMarker,
  stepNumber,
} from "@/utils/theoryMarkup";
import { track } from "@/lib/analytics";
import { feedbackCelebrate, feedbackCorrect, feedbackWrong } from "@/lib/feedback";
import { getVisualTone } from "@/utils/visualTones";
import type { Course, Lesson } from "@/data/mockData";

interface LessonCardPlayerProps {
  lesson: Lesson;
  course: Course;
  cards: LessonCard[];
  cardIndex: number;
  alreadyCompleted: boolean;
  /** Lesson-scoped flag owned by LessonView: confetti fires only once per
   * lesson, even though this player unmounts on every cards↔editor trip. */
  shouldCelebrate: boolean;
  onCelebrated: () => void;
  onAdvance: () => void;
  onBack: () => void;
  onEnterCode: () => void;
  onQuizPassed: () => void;
}

/** Prosa com marcação: keywords e chamadas viram pílulas de código,
 * **negrito** vira grifo de marca-texto. */
const inlineFormat = (text: string) =>
  splitInlineTokens(text).map((token, index) => {
    if (token.kind === "code") {
      return (
        <code
          key={index}
          className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[0.88em] font-semibold text-primary"
        >
          {token.value}
        </code>
      );
    }
    if (token.kind === "strong") {
      return (
        <strong key={index} className="rounded bg-quest-yellow/40 px-1 font-black">
          {token.value}
        </strong>
      );
    }
    return <span key={index}>{token.value}</span>;
  });

type TheoryBlock =
  | { kind: "code"; content: string }
  | { kind: "paragraph"; content: string }
  | { kind: "step"; content: string; number: string }
  | { kind: "bullet"; content: string }
  | { kind: "label"; content: string }
  | { kind: "opline"; content: string };

/** Revela a estrutura latente da teoria: passos numerados, listas, rótulos,
 * linhas de operadores e blocos de código — cada um com seu estilo. */
const TheoryText = ({ text }: { text: string }) => {
  const blocks: TheoryBlock[] = [];

  for (const line of text.split("\n")) {
    if (!line.trim()) continue;

    if (/^\s{2,}\S/.test(line)) {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "code") last.content += `\n${line.replace(/^\s{2}/, "")}`;
      else blocks.push({ kind: "code", content: line.replace(/^\s{2}/, "") });
      continue;
    }

    const kind = classifyTheoryLine(line);
    const content = stripLineMarker(line, kind);
    if (kind === "step") blocks.push({ kind, content, number: stepNumber(line) });
    else if (kind === "bullet" || kind === "label" || kind === "opline") blocks.push({ kind, content });
    else {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "paragraph") last.content += `\n${content}`;
      else blocks.push({ kind: "paragraph", content });
    }
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.kind === "code") {
          return (
            <pre
              key={index}
              className="overflow-x-auto rounded-xl bg-[#1e1e2e] px-4 py-3 font-mono text-sm leading-relaxed text-[#cdd6f4]"
            >
              {block.content}
            </pre>
          );
        }
        if (block.kind === "step") {
          return (
            <div key={index} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                {block.number}
              </span>
              <p className="leading-relaxed text-foreground">{inlineFormat(block.content)}</p>
            </div>
          );
        }
        if (block.kind === "bullet") {
          return (
            <div key={index} className="flex gap-2.5">
              <ChevronRight size={16} className="mt-1 shrink-0 text-accent" />
              <p className="leading-relaxed text-foreground">{inlineFormat(block.content)}</p>
            </div>
          );
        }
        if (block.kind === "label") {
          return (
            <div key={index} className="pt-1 text-xs font-black uppercase tracking-wide text-primary">
              {block.content.slice(0, -1)}
            </div>
          );
        }
        if (block.kind === "opline") {
          return (
            <code
              key={index}
              className="inline-block rounded-lg bg-[#1e1e2e] px-3 py-1.5 font-mono text-sm text-[#cdd6f4]"
            >
              {block.content}
            </code>
          );
        }
        return (
          <p key={index} className="whitespace-pre-line leading-relaxed text-foreground">
            {inlineFormat(block.content)}
          </p>
        );
      })}
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
  shouldCelebrate,
  onCelebrated,
  onAdvance,
  onBack,
  onEnterCode,
  onQuizPassed,
}: LessonCardPlayerProps) => {
  const card = cards[cardIndex];
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [contrastPick, setContrastPick] = useState<"first" | "second" | null>(null);

  // Pequena celebração ao fechar todos os cartões — o flag vive no
  // LessonView, então voltar do editor não dispara confetti de novo
  useEffect(() => {
    if (card?.kind !== "code-intro" || !shouldCelebrate) return;
    onCelebrated();
    feedbackCelebrate();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#0A7C78", "#7AD7A7", "#FF9F2F", "#169C93"],
    });
  }, [card?.kind, shouldCelebrate, onCelebrated]);

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

  const conceptFamily = getConceptFamily(lesson.concepts);
  const tone = getVisualTone(course.language);

  const advance = () => {
    setContrastPick(null);
    track("card_advanced", {
      lessonId: lesson.id,
      kind: card.kind,
      index: cardIndex,
      total: cards.length,
    });
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
              <p className="mb-4 leading-relaxed text-foreground">{card.text}</p>
              <LessonVisualAid
                courseTitle={course.title}
                language={course.language}
                lessonTitle={lesson.title}
                stacked
              />
            </CardShell>
          )}

          {card.kind === "theory" && (
            <CardShell icon={<Lightbulb size={13} />} label="Aprenda" tone="bg-primary/10 text-primary">
              {card.first &&
                (conceptFamily ? (
                  <ConceptDiagram family={conceptFamily} tone={tone} />
                ) : (
                  <CardIllustration kind="theory" />
                ))}
              <TheoryText text={card.text} />
            </CardShell>
          )}

          {card.kind === "analogy" && (
            <CardShell icon={<Sparkles size={13} />} label="Pense assim" tone="bg-quest-yellow/10 text-quest-yellow">
              <CardIllustration kind="analogy" />
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
              <CardIllustration kind="mistake" />
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
                        if (slot === contrastCorrectPick) feedbackCorrect();
                        else feedbackWrong();
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
              <CardIllustration kind="quiz" />
              <QuizSection
                key={lesson.id}
                quizId={lesson.id}
                questions={lesson.quiz}
                onComplete={(correct) => {
                  const passed = correct === lesson.quiz!.length;
                  track("quiz_completed", { lessonId: lesson.id, correct, total: lesson.quiz!.length, passed });
                  if (passed) {
                    feedbackCorrect();
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
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="mb-4 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3"
              >
                <span className="text-2xl" aria-hidden="true">🎉</span>
                <div>
                  <div className="text-sm font-black text-accent">Cartões concluídos!</div>
                  <div className="text-xs text-muted-foreground">Agora prove a ideia escrevendo o código de verdade.</div>
                </div>
              </motion.div>
              <MascoteCapivara
                state="celebrate"
                variant="compact"
                message="Você fechou os cartões! Agora é só codar."
                className="mb-4"
              />
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
