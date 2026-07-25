import { ChevronDown, Target } from "lucide-react";
import type { Lesson } from "@/data/mockData";

interface ChallengeBriefProps {
  lesson: Lesson;
  /** Idioma do curso — relabela "Saída esperada" para SQL (fragmento de query). */
  language?: string;
  /** No celular o enunciado começa recolhido para sobrar tela ao editor; a
   * SAÍDA ESPERADA continua sempre visível — é o alvo do exercício. */
  collapsible?: boolean;
  className?: string;
}

/**
 * Enunciado do desafio + saída esperada. Vive nos DOIS lados: no painel de
 * apoio do desktop e no topo do editor no celular — antes ele existia só no
 * desktop (`hidden lg:block`) e o aluno de celular digitava sem ver o alvo.
 * #revisao-3.1
 */
const ChallengeBrief = ({ lesson, language, collapsible = false, className = "" }: ChallengeBriefProps) => {
  const expectedLabel = language === "SQL" ? "Sua query deve conter: " : "Saída esperada: ";

  const target = (
    <div className="mt-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm">
      <span className="font-bold text-muted-foreground">{expectedLabel}</span>
      <code className="break-words font-mono text-primary">{lesson.expectedOutput}</code>
    </div>
  );

  if (collapsible) {
    return (
      <div className={`ct-surface rounded-2xl p-4 ${className}`}>
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-black text-primary">
              <Target size={13} aria-hidden="true" /> Desafio
            </span>
            <span className="inline-flex min-h-11 items-center gap-1 text-xs font-bold text-muted-foreground">
              Ver enunciado
              <ChevronDown size={14} className="transition-transform group-open:rotate-180" aria-hidden="true" />
            </span>
          </summary>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground">{lesson.description}</p>
        </details>
        {target}
      </div>
    );
  }

  return (
    <div className={`ct-surface rounded-2xl p-5 ${className}`}>
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-black text-primary">
        <Target size={13} aria-hidden="true" /> Desafio
      </div>
      <p className="whitespace-pre-line leading-relaxed text-foreground">{lesson.description}</p>
      {target}
    </div>
  );
};

export default ChallengeBrief;
