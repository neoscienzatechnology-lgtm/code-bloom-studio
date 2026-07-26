import { useEffect, useState } from "react";
import {
  loadAugmentedCourse,
  loadAugmentedLesson,
  type AugmentedCourse,
  type AugmentedLesson,
} from "@/data/checkpoints";

// Carrega o curso (com checkpoints) sob demanda. As telas que usam isto
// mostram um esqueleto enquanto o arquivo de conteúdo daquele curso chega —
// em troca, nenhuma delas baixa os 13 cursos. #peso-5

type Loadable<T> = { data: T | undefined; loading: boolean };

export function useAugmentedCourse(courseId: string | undefined): Loadable<AugmentedCourse> {
  const [state, setState] = useState<Loadable<AugmentedCourse>>({ data: undefined, loading: true });

  useEffect(() => {
    let cancelled = false;
    setState({ data: undefined, loading: true });
    void loadAugmentedCourse(courseId ?? "").then((course) => {
      if (!cancelled) setState({ data: course, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return state;
}

export interface AugmentedLessonResult {
  course: AugmentedCourse;
  lesson: AugmentedLesson;
  lessonIndex: number;
}

export function useAugmentedLesson(
  courseId: string | undefined,
  lessonId: string | undefined,
): Loadable<AugmentedLessonResult> {
  const [state, setState] = useState<Loadable<AugmentedLessonResult>>({ data: undefined, loading: true });

  useEffect(() => {
    let cancelled = false;
    setState({ data: undefined, loading: true });
    void loadAugmentedLesson(courseId ?? "", lessonId ?? "").then((result) => {
      if (!cancelled) setState({ data: result, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, [courseId, lessonId]);

  return state;
}
