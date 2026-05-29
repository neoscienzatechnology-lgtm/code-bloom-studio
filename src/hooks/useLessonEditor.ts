import { useCallback, useReducer } from "react";

export type PaceMode = "struggling" | "thriving" | null;

export interface LessonEditorState {
  running: boolean;
  isCorrect: boolean | null;
  output: string | null;
  reflectiveQ: string | null;
  hintIndex: number;
  showXP: boolean;
  codeSaved: boolean;
  paceMode: PaceMode;
  bonusActive: boolean;
}

const INITIAL: LessonEditorState = {
  running: false,
  isCorrect: null,
  output: null,
  reflectiveQ: null,
  hintIndex: -1,
  showXP: false,
  codeSaved: true,
  paceMode: null,
  bonusActive: false,
};

type Action =
  | { type: "PATCH"; patch: Partial<LessonEditorState> }
  | { type: "RESET" }
  | { type: "HINT_NEXT"; max: number };

function reducer(state: LessonEditorState, action: Action): LessonEditorState {
  switch (action.type) {
    case "PATCH":
      return { ...state, ...action.patch };
    case "RESET":
      return INITIAL;
    case "HINT_NEXT":
      return { ...state, hintIndex: Math.min(state.hintIndex + 1, action.max) };
  }
}

export function useLessonEditor() {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const patch = useCallback(
    (next: Partial<LessonEditorState>) => dispatch({ type: "PATCH", patch: next }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const advanceHint = useCallback((max: number) => dispatch({ type: "HINT_NEXT", max }), []);

  return { state, patch, reset, advanceHint };
}
