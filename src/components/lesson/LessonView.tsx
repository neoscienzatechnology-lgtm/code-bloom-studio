import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type CoachState } from "@/components/CoachGuide";
import LessonOnboardingBanner from "@/components/lesson/LessonOnboardingBanner";
import LessonTopBar from "@/components/lesson/LessonTopBar";
import LessonCardPlayer from "@/components/lesson/LessonCardPlayer";
import ChallengeStage from "@/components/lesson/ChallengeStage";
import CodeWorkspace from "@/components/lesson/CodeWorkspace";
import { useProgress } from "@/hooks/useProgress";
import { useEntitlement } from "@/contexts/EntitlementContext";
import { recordLessonCompletedAndMaybeShowAd } from "@/lib/ads";
import { track } from "@/lib/analytics";
import { scheduleStreakReminder } from "@/lib/notifications";
import { useLessonRunner } from "@/hooks/useLessonRunner";
import { buildLessonCards } from "@/utils/lessonCards";
import { calibrateXp } from "@/utils/xp";
import type { Course, Lesson } from "@/data/mockData";

interface LessonViewProps {
  course: Course;
  lesson: Lesson;
  lessonIndex: number;
  /** Route of the "next" CTA: next lesson, next checkpoint, or back to the course. */
  nextHref: string;
  hasNextLesson: boolean;
}

/**
 * Orchestrates a single lesson in two phases, Mimo/Duolingo style:
 * 1. "cards" — a sequence of small, single-idea cards (theory in bites,
 *    analogy, right-vs-wrong choice, quiz, guided practice);
 * 2. "code" — the real-editor challenge, the lesson's climax.
 * All state here is lesson-scoped: render with key={lesson.id}.
 */
const LessonView = ({ course, lesson, lessonIndex, nextHref, hasNextLesson }: LessonViewProps) => {
  const navigate = useNavigate();
  const { completeLesson, saveCode, isCompleted, getSavedCode, studyStats } = useProgress();
  const { isPro } = useEntitlement();

  const alreadyCompleted = isCompleted(lesson.id);
  const xpAward = calibrateXp(lesson.xpReward, lesson.level);
  const progressPercent = ((lessonIndex + 1) / course.lessons.length) * 100;

  const cards = useMemo(() => buildLessonCards(lesson, course.id), [lesson, course.id]);
  const [cardIndex, setCardIndex] = useState(0);
  const [phase, setPhase] = useState<"cards" | "code">("cards");
  // Vive aqui (escopo da lição, via key={lesson.id}) para que a celebração
  // não repita quando o player desmonta na ida e volta ao editor
  const celebratedRef = useRef(false);

  useEffect(() => {
    track("lesson_started", { lessonId: lesson.id, courseId: course.id, alreadyCompleted });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const [code, setCode] = useState(() => getSavedCode(lesson.id) ?? lesson.starterCode ?? "");

  const enterCodePhase = () => {
    setPhase("code");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const runner = useLessonRunner({
    lesson,
    course,
    alreadyCompleted,
    xpAward,
    code,
    setCode,
    completeLesson,
    forceCodeStage: () => setPhase("code"),
    goToCodeStage: enterCodePhase,
  });

  const { editor, patch, getAttempts, showSolution, solutionWarned } = runner;
  const { running, isCorrect, output, hintIndex, paceMode, bonusActive } = editor;

  // Save code as user types (debounced)
  useEffect(() => {
    patch({ codeSaved: false });
    const timer = setTimeout(() => {
      saveCode(lesson.id, code, course.id);
      patch({ codeSaved: true });
    }, 500);
    return () => clearTimeout(timer);
  }, [code, course.id, lesson.id, saveCode, patch]);

  const lessonReadyToAdvance = alreadyCompleted || isCorrect === true;
  const lessonMascotState: CoachState = running
    ? "loading"
    : alreadyCompleted
    ? "celebrate"
    : isCorrect === true
    ? "success"
    : isCorrect === false
    ? "error"
    : isCorrect === null && output
    ? "thinking"
    : "idle";

  const handleNext = () => {
    if (lessonReadyToAdvance) {
      // Intersticial com limite de frequência + lembrete de sequência
      // (ambos apenas no app Android; no-op na web). Pro não vê anúncios.
      if (!isPro) void recordLessonCompletedAndMaybeShowAd();
      void scheduleStreakReminder(studyStats.currentStreak);
    }
    navigate(nextHref);
  };

  const backToCards = () => {
    setPhase("cards");
    setCardIndex(cards.length - 1);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <LessonTopBar course={course} lessonIndex={lessonIndex} progressPercent={progressPercent} />

      {phase === "cards" ? (
        <div className="flex-1 bg-background">
          <LessonCardPlayer
            lesson={lesson}
            course={course}
            cards={cards}
            cardIndex={cardIndex}
            alreadyCompleted={alreadyCompleted}
            shouldCelebrate={!alreadyCompleted && !celebratedRef.current}
            onCelebrated={() => {
              celebratedRef.current = true;
            }}
            onAdvance={() => setCardIndex((index) => Math.min(index + 1, cards.length - 1))}
            onBack={() => setCardIndex((index) => Math.max(index - 1, 0))}
            onEnterCode={enterCodePhase}
            onQuizPassed={() => completeLesson(lesson.id + "-quiz", 5, course.id)}
          />
        </div>
      ) : (
        <>
          <LessonOnboardingBanner />
          <div className="grid flex-1 min-h-0 lg:grid-cols-2">
            {/* Challenge context (left panel, desktop) */}
            <div className="hidden border-border bg-background p-6 lg:block lg:overflow-auto lg:border-r">
              <Button
                variant="ghost"
                size="sm"
                onClick={backToCards}
                className="mb-4 gap-1.5 rounded-full text-xs text-muted-foreground"
              >
                <ArrowLeft size={14} /> Rever os cartões da lição
              </Button>
              <ChallengeStage
                lesson={lesson}
                mascotState={lessonMascotState}
                revealedHintCount={hintIndex + 1}
                lastFeedback={output}
                showSolution={showSolution}
                solutionWarned={solutionWarned}
                canRevealSolution={hintIndex >= 1 && !showSolution}
                paceMode={paceMode}
                bonusActive={bonusActive}
                onRevealHint={runner.handleHint}
                onUseGuidedStarter={runner.applyGuidedStarter}
                onRevealSolution={runner.handleRevealSolution}
                onUseSimpler={runner.applyPreparatoryStarter}
                onPaceRevealSolution={() => {
                  runner.handleRevealSolution();
                  patch({ paceMode: null });
                }}
                onAcceptBonus={() => {
                  patch({ bonusActive: true, paceMode: null });
                }}
                onDismissPace={() => patch({ paceMode: null })}
              />
            </div>

            {/* Editor (right panel; full width on mobile) */}
            <CodeWorkspace
              lesson={lesson}
              course={course}
              code={code}
              onCodeChange={setCode}
              editor={editor}
              mascotState={lessonMascotState}
              showSolution={showSolution}
              xpAward={xpAward}
              attempts={getAttempts(lesson.id)}
              alreadyCompleted={alreadyCompleted}
              lessonReadyToAdvance={lessonReadyToAdvance}
              hasNextLesson={hasNextLesson}
              revealedHintCount={hintIndex + 1}
              onRun={runner.handleRun}
              onReset={runner.handleReset}
              onNext={handleNext}
              onBackToChallenge={backToCards}
              onRevealHint={runner.handleHint}
              onUseGuidedStarter={runner.applyGuidedStarter}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LessonView;
