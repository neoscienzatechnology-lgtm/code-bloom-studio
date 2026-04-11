import React from "react";

function parseInlineCode(text: string): React.ReactNode[] {
  const parts = text.split(/`([^`]+)`/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[0.85em] text-accent font-semibold"
      >
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

interface TheoryRendererProps {
  text: string;
}

const TheoryRenderer: React.FC<TheoryRendererProps> = ({ text }) => {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let isFirstParagraph = true;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      i++;
      continue;
    }

    // Code block: lines starting with spaces and containing code-like patterns
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
          className="my-3 rounded-lg border border-accent/20 bg-[hsl(250,20%,8%)] px-4 py-3 font-mono text-sm leading-relaxed text-accent"
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

    // List item: starts with •
    if (trimmed.startsWith("•")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("•")) {
        listItems.push(lines[i].trim().slice(1).trim());
        i++;
      }
      elements.push(
        <div key={`list-${i}`} className="my-2 space-y-1.5">
          {listItems.map((item, j) => (
            <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{parseInlineCode(item)}</span>
            </div>
          ))}
        </div>
      );
      continue;
    }

    // Regular paragraph
    const paraClass = isFirstParagraph
      ? "text-[0.925rem] leading-relaxed text-foreground/80"
      : "text-sm leading-relaxed text-muted-foreground";
    elements.push(
      <p key={`p-${i}`} className={`my-2 ${paraClass}`}>
        {parseInlineCode(trimmed)}
      </p>
    );
    isFirstParagraph = false;
    i++;
  }

  return (
    <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5 p-5">
      {elements}
    </div>
  );
};

export default TheoryRenderer;
