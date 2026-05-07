import React, { useMemo, useState } from "react";
import LessonVisualAid from "@/components/LessonVisualAid";

function parseInlineFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[0.85em] text-primary font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

interface TheoryRendererProps {
  text: string;
  courseTitle?: string;
  language?: string;
  lessonTitle?: string;
}

const TheoryRenderer: React.FC<TheoryRendererProps> = ({ text, courseTitle, language, lessonTitle }) => {
  const [expanded, setExpanded] = useState(false);
  const { introText, fullText, isLong } = useMemo(() => {
    const blocks = text.split(/\n(?=## )/);
    const compact = blocks.slice(0, 3).join("\n").trim();
    return {
      introText: compact || text,
      fullText: text,
      isLong: text.length > 1800 || blocks.length > 3,
    };
  }, [text]);

  const visibleText = isLong && !expanded ? introText : fullText;
  const lines = visibleText.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let isFirstParagraph = true;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Image: ![alt](url)
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const [, alt, src] = imgMatch;
      elements.push(
        <div key={`img-${i}`} className="my-4 overflow-hidden rounded-xl border border-border">
          <img src={src} alt={alt} loading="lazy" className="w-full object-cover" />
          {alt && (
            <div className="px-3 py-1.5 text-xs text-muted-foreground text-center bg-muted/50">
              {alt}
            </div>
          )}
        </div>
      );
      i++;
      continue;
    }

    // Heading: ## or #
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={`h2-${i}`} className="mt-5 mb-2 text-base font-extrabold text-foreground">
          {trimmed.slice(3)}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2 key={`h1-${i}`} className="mt-5 mb-2 text-lg font-extrabold text-foreground">
          {trimmed.slice(2)}
        </h2>
      );
      i++;
      continue;
    }

    // Code block: indented lines with code patterns
    if (
      (line.startsWith("  ") || line.startsWith("\t")) &&
      /[→=(){}[\]<>]|print|def |return |const |let |var |function |import |SELECT |FROM /.test(trimmed)
    ) {
      const codeLines: string[] = [];
      while (i < lines.length) {
        const cl = lines[i];
        const ct = cl.trim();
        if (
          ct &&
          (cl.startsWith("  ") || cl.startsWith("\t")) &&
          /[→=(){}[\]<>]|print|def |return |const |let |var |function |import |SELECT |FROM /.test(ct)
        ) {
          codeLines.push(ct);
          i++;
        } else {
          break;
        }
      }
      elements.push(
        <div
          key={`code-${i}`}
          className="my-3 rounded-xl border border-border bg-[#1e1e2e] px-4 py-3 font-mono text-sm leading-relaxed text-[#cba6f7]"
        >
          {codeLines.map((cl, j) => (
            <div key={j}>{cl}</div>
          ))}
        </div>
      );
      continue;
    }

    // Section title: ends with ":"
    if (trimmed.endsWith(":") && trimmed.length < 60 && !trimmed.startsWith("•")) {
      elements.push(
        <div
          key={`title-${i}`}
          className="mt-4 mb-2 flex items-center gap-2 text-sm font-bold text-primary"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          {trimmed}
        </div>
      );
      i++;
      continue;
    }

    // List item: • or -
    if (trimmed.startsWith("•") || trimmed.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length) {
        const lt = lines[i].trim();
        if (lt.startsWith("•") || lt.startsWith("- ")) {
          listItems.push(lt.startsWith("•") ? lt.slice(1).trim() : lt.slice(2).trim());
          i++;
        } else {
          break;
        }
      }
      elements.push(
        <div key={`list-${i}`} className="my-2 space-y-1.5">
          {listItems.map((item, j) => (
            <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              <span>{parseInlineFormatting(item)}</span>
            </div>
          ))}
        </div>
      );
      continue;
    }

    // Regular paragraph
    const paraClass = isFirstParagraph
      ? "text-[0.925rem] leading-relaxed text-foreground/90"
      : "text-sm leading-relaxed text-muted-foreground";
    elements.push(
      <p key={`p-${i}`} className={`my-2 ${paraClass}`}>
        {parseInlineFormatting(trimmed)}
      </p>
    );
    isFirstParagraph = false;
    i++;
  }

  return (
    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
      <LessonVisualAid courseTitle={courseTitle} language={language} lessonTitle={lessonTitle} />
      <div className="space-y-0.5">{elements}</div>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-4 rounded-full border border-primary/20 bg-background px-4 py-2 text-xs font-black text-primary transition-colors hover:bg-primary/10"
        >
          {expanded ? "Mostrar resumo" : "Ver teoria completa"}
        </button>
      )}
    </div>
  );
};

export default TheoryRenderer;
