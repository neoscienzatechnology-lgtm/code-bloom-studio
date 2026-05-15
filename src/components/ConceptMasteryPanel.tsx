import { AlertTriangle, ArrowRight, Brain, CheckCircle2, CircleDot } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { ConceptMastery, ConceptStatus } from "@/utils/conceptMastery";

interface ConceptMasteryPanelProps {
  concepts: ConceptMastery[];
  syncLabel?: string;
}

const STATUS_COPY: Record<ConceptStatus, { label: string; className: string; icon: typeof CircleDot }> = {
  weak: {
    label: "Revisar",
    className: "bg-destructive/10 text-destructive",
    icon: AlertTriangle,
  },
  learning: {
    label: "Em prática",
    className: "bg-quest-yellow/10 text-quest-yellow",
    icon: CircleDot,
  },
  new: {
    label: "Novo",
    className: "bg-secondary text-muted-foreground",
    icon: CircleDot,
  },
  strong: {
    label: "Forte",
    className: "bg-accent/10 text-accent",
    icon: CheckCircle2,
  },
};

const ConceptMasteryPanel = ({ concepts, syncLabel }: ConceptMasteryPanelProps) => {
  const visible = concepts.slice(0, 6);
  const weakCount = concepts.filter((concept) => concept.status === "weak").length;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Brain size={18} />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground">Mapa de domínio</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O app acompanha conceitos, não só aulas concluídas. Assim a revisão fica mais precisa.
            </p>
          </div>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${weakCount > 0 ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}>
          {weakCount > 0 ? `${weakCount} pontos fracos` : "Base estável"}
        </span>
      </div>
      {syncLabel && (
        <div className="mb-4 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-muted-foreground">
          {syncLabel}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {visible.map((concept) => {
          const status = STATUS_COPY[concept.status];
          const Icon = status.icon;
          const href = `/pontos-fracos?concept=${encodeURIComponent(concept.id)}`;

          return (
            <div key={concept.id} className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="font-black text-foreground">{concept.label}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {concept.completedLessons}/{concept.totalLessons} aulas concluídas
                    {concept.failedAttempts > 0 ? ` · ${concept.failedAttempts} tentativas com erro` : ""}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${status.className}`}>
                  <Icon size={12} /> {status.label}
                </span>
              </div>
              <Progress value={concept.mastery} className="h-2 bg-secondary [&>div]:bg-primary" />
              <p className="mt-3 min-h-[40px] text-xs leading-relaxed text-muted-foreground">{concept.reason}</p>
              <Button asChild variant="ghost" size="sm" className="mt-2 h-8 rounded-full px-0 text-xs font-black text-primary hover:bg-transparent">
                <Link to={href}>
                  Treinar conceito <ArrowRight size={13} />
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ConceptMasteryPanel;
