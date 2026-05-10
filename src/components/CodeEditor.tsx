import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState, type Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { sql } from "@codemirror/lang-sql";

const langMap: Record<string, () => Extension> = {
  python: () => python(),
  javascript: () => javascript(),
  js: () => javascript(),
  react: () => javascript({ jsx: true, typescript: true }),
  "react native": () => javascript({ jsx: true, typescript: true }),
  typescript: () => javascript({ typescript: true }),
  css: () => css(),
  sql: () => sql(),
  node: () => javascript(),
  "node.js": () => javascript(),
  "dados e ia": () => python(),
  "lógica": () => python(),
  jogos: () => javascript(),
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
        basicSetup,
        langExt,
        oneDark,
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
