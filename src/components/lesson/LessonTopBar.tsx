import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CourseCoverArt from "@/components/CourseCoverArt";
import type { Course } from "@/data/mockData";

interface LessonTopBarProps {
  course: Course;
  lessonIndex: number;
  progressPercent: number;
}

const LessonTopBar = ({ course, lessonIndex, progressPercent }: LessonTopBarProps) => (
  <div className="border-b border-border bg-card px-4 py-3">
    <div className="mx-auto flex max-w-screen-2xl items-center gap-4">
      <Link
        to={`/cursos/${course.id}`}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={18} />
      </Link>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="flex min-w-0 items-center gap-2 font-bold text-primary">
            <CourseCoverArt course={course} variant="thumb" className="h-8 w-12 shrink-0 rounded-lg" />
            <span className="truncate">{course.title}</span>
          </span>
          <span className="text-muted-foreground">
            Lição {lessonIndex + 1}/{course.lessons.length}
          </span>
        </div>
        <Progress
          value={progressPercent}
          className="h-2 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent"
        />
      </div>
    </div>
  </div>
);

export default LessonTopBar;
