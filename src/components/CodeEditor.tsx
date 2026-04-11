import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { sql } from "@codemirror/lang-sql";

const langMap: Record<string, () => any> = {
  python: () => python(),
  javascript: () => javascript(),
  js: () => javascript(),
  react: () => javascript({ jsx: true, typescript: true }),
  typescript: () => javascript({ typescript: true }),
  css: () => css(),
  sql: () => sql(),
  node: () => javascript(),
  "node.js": () => javascript(),
};

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

const CodeEditor = ({ value, onChange, language }: CodeEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const langExt = langMap[language.toLowerCase()]?.() ?? python();

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        bracketMatching(),
        closeBrackets(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        langExt,
        oneDark,
        keymap.of([...defaultKeymap, ...historyKeymap, ...closeBracketsKeymap] as any),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": { height: "100%", fontSize: "14px" },
          ".cm-scroller": { overflow: "auto", fontFamily: "'Fira Code', monospace" },
          ".cm-content": { padding: "16px 0" },
          ".cm-gutters": { backgroundColor: "transparent", border: "none" },
        }),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Intentionally only run on mount + language change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Sync external value changes (e.g. reset)
  useEffect(() => {
    const view = viewRef.current;
    if (view && view.state.doc.toString() !== value) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={containerRef} className="flex-1 min-h-0" />;
};

export default CodeEditor;
