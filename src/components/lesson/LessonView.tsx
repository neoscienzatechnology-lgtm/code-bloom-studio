import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TheoryRenderer from "@/components/TheoryRenderer";
import QuizSection from "@/components/QuizSection";
import LessonCoach from "@/components/LessonCoach";
import GuidedPractice from "@/components/GuidedPractice";
import MascoteCapivara, { type MascoteCapivaraState } from "@/components/MascoteCapivara";
import LessonOnboardingBanner from "@/components/lesson/LessonOnboardingBanner";
import LessonTopBar from "@/components/lesson/LessonTopBar";
import LessonStageNav from "@/components/lesson/LessonStageNav";
import ChallengeStage from "@/components/lesson/ChallengeStage";
import CodeStageIntro from "@/components/lesson/CodeStageIntro";
import CodeWorkspace from "@/components/lesson/CodeWorkspace";
import { useProgress } from "@/hooks/useProgress";
import { recordLessonCompletedAndMaybeShowAd } from "@/lib/ads";
import { useLessonStages, splitTheorySlides, type LessonStageKind } from "@/hooks/useLessonStages";
import { useLessonRunner } from "@/hooks/useLessonRunner";
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
 * Orchestrates a single lesson. All state here is lesson-scoped: render it
 * with key={lesson.id} so navigating between lessons remounts and resets it.
 */
const LessonView = ({ course, lesson, lessonIndex, nextHref, hasNextLesson }: LessonViewProps) => {
  const navigate = useNavigate();
  const { completeLesson, saveCode, isCompleted, getSavedCode } = useProgress();

  const alreadyCompleted = isCompleted(lesson.id);
  const xpAward = calibrateXp(lesson.xpReward, lesson.level);
  const theorySlides = splitTheorySlides(lesson.theory);
  const progressPercent = ((lessonIndex + 1) / course.lessons.length) * 100;

  const [code, setCode] = useState(() => getSavedCode(lesson.id) ?? lesson.starterCode ?? "");

  const stages = useLessonStages({
    theorySlides,
    hasQuiz: Boolean(lesson.quiz?.length),
    alreadyCompleted,
  });

  const runner = useLessonRunner({
    lesson,
    course,
    alreadyCompleted,
    xpAward,
    code,
    setCode,
    completeLesson,
    forceCodeStage: () => stages.setActiveStage("code"),
    goToCodeStage: () => stages.goToStage("code"),
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
  const lessonMascotState: MascoteCapivaraState = running
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

  const stageSectionClass = (stage: LessonStageKind) =>
    stages.currentStage.kind === stage ? "block" : "hidden";

  const handleNext = () => {
    // Intersticial (apenas no app Android) com limite de frequência
    if (lessonReadyToAdvance) void recordLessonCompletedAndMaybeShowAd();
    navigate(nextHref);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <LessonOnboardingBanner />

      <LessonTopBar course={course} lessonIndex={lessonIndex} progressPercent={progressPercent} />

      <LessonStageNav
        stages={stages.stages}
        currentStage={stages.currentStage}
        activeStageIndex={stages.activeStageIndex}
        stageProgress={stages.stageProgress}
        stageNotice={stages.stageNotice}
        canEnterStageIndex={stages.canEnterStageIndex}
        onSelectStage={stages.goToStage}
      />

      {/* Main split layout */}
      <div className={`grid flex-1 min-h-0 ${stages.isCodeStage ? "lg:grid-cols-2" : ""}`}>
        {/* Instructions (left panel) */}
        <div
          className={`border-b border-border bg-background p-6 lg:block lg:border-b-0 lg:overflow-auto ${
            stages.isCodeStage ? "hidden lg:block lg:border-r" : "block mx-auto w-full max-w-screen-2xl"
          }`}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className={stageSectionClass("plan")}>
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  <span>✨</span> +{xpAward} XP
                </span>
                {alreadyCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                    <Check size={12} /> Concluída
                  </span>
                )}
              </div>
              <h2 className="mb-4 text-2xl font-black">{lesson.title}</h2>

              <MascoteCapivara state={lessonMascotState} className="mb-5" />

              <LessonCoach course={course} lesson={lesson} />
            </div>

            <div className={stageSectionClass("theory")}>
              {/* Theory section */}
              {lesson.theory && (
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
                    <span>📖</span> Aprenda
                  </div>
                  <TheoryRenderer
                    text={theorySlides[stages.currentStage.theoryIndex ?? 0] ?? lesson.theory}
                    courseTitle={course.title}
                    language={course.language}
                    lessonTitle={lesson.title}
                    contrastExample={
                      (stages.currentStage.theoryIndex ?? 0) === theorySlides.length - 1
                        ? lesson.contrastExample
                        : undefined
                    }
                  />
                </div>
              )}
            </div>

            <div className={stageSectionClass("quiz")}>
              {/* Quiz section */}
              {lesson.quiz && lesson.quiz.length > 0 && (
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-quest-blue">
                    <span>🧠</span> Teste seu conhecimento
                  </div>
                  <div className="rounded-xl border border-quest-blue/10 bg-quest-blue/5 p-4">
                    <QuizSection
                      key={lesson.id}
                      quizId={lesson.id}
                      questions={lesson.quiz}
                      onComplete={(correct) => {
                        const passed = correct === lesson.quiz!.length;
                        stages.setQuizCompleted(passed);
                        stages.setStageNotice(
                          passed
                            ? null
                            : "Revise o feedback da Capy e tente o quiz novamente para liberar a prática."
                        );
                        if (passed) {
                          completeLesson(lesson.id + "-quiz", 5, course.id);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={stageSectionClass("practice")}>
              <GuidedPractice
                lesson={lesson}
                onCompletionChange={(completed) => {
                  stages.setPracticeCompleted(completed);
                  if (completed) stages.setStageNotice(null);
                }}
              />
            </div>

            <div className={stageSectionClass("challenge")}>
              <ChallengeStage
                lesson={lesson}
                mascotState={lessonMascotState}
                attempts={getAttempts(lesson.id)}
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

            <div className={stageSectionClass("code")}>
              <CodeStageIntro
                lesson={lesson}
                mascotState={lessonMascotState}
                attempts={getAttempts(lesson.id)}
                revealedHintCount={hintIndex + 1}
                lastFeedback={output}
                onRevealHint={runner.handleHint}
                onUseGuidedStarter={runner.applyGuidedStarter}
                onBackToChallenge={() => stages.goToStage("challenge")}
              />
            </div>

            {!stages.isCodeStage && (
              <div className="z-20 -mx-6 mt-6 flex flex-col gap-2 border-t border-border bg-background/95 px-6 py-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between md:sticky md:bottom-0 lg:shadow-none">
                <Button
                  variant="outline"
                  onClick={stages.goToPreviousStage}
                  disabled={stages.isFirstStage}
                  className="gap-2 rounded-full font-bold"
                >
                  <ArrowLeft size={16} /> Voltar
                </Button>
                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                  {stages.stageRequirement && (
                    <div className="text-xs font-bold text-muted-foreground">{stages.stageRequirement}</div>
                  )}
                  <Button
                    onClick={stages.goToNextStage}
                    disabled={!stages.currentStageCanAdvance}
                    className="gap-2 rounded-full font-bold"
                  >
                    {stages.nextStageCta} <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Editor (right panel) */}
        {stages.isCodeStage && (
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
            onBackToChallenge={() => stages.goToStage("challenge")}
            onRevealHint={runner.handleHint}
            onUseGuidedStarter={runner.applyGuidedStarter}
          />
        )}
      </div>
    </div>
  );
};

export default LessonView;
