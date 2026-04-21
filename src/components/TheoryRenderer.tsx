import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

function parseInlineFormatting(text: string): React.ReactNode[] {
  // Split on **bold**, `code`, or both (in order)
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
          className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[0.85em] text-accent font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?\s]+)/);
  return match ? match[1] : null;
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

    // Image: ![alt](url)
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const [, alt, src] = imgMatch;
      elements.push(
        <div key={`img-${i}`} className="my-4 overflow-hidden rounded-lg border border-border/20">
          <img src={src} alt={alt} loading="lazy" className="w-full object-cover" />
          {alt && (
            <div className="px-3 py-1.5 text-xs text-muted-foreground text-center bg-secondary/30">
              {alt}
            </div>
          )}
        </div>
      );
      i++;
      continue;
    }

    // Video: [video](url)
    const videoMatch = trimmed.match(/^\[video\]\(([^)]+)\)$/);
    if (videoMatch) {
      const url = videoMatch[1];
      const ytId = getYouTubeId(url);
      elements.push(
        <div key={`video-${i}`} className="my-4 overflow-hidden rounded-lg border border-border/20">
          <AspectRatio ratio={16 / 9}>
            {ytId ? (
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title="Vídeo da lição"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <video controls className="h-full w-full" src={url}>
                Seu navegador não suporta vídeo.
              </video>
            )}
          </AspectRatio>
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

    // Code block: lines starting with spaces/tab containing code patterns
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

    // Section title: ends with ":" (short line, not a list item)
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

    // List item: starts with • or -
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
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{parseInlineFormatting(item)}</span>
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
        {parseInlineFormatting(trimmed)}
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
