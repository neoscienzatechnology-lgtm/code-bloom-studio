import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import type { ErrorKind } from "@/utils/codeValidator";
import { Button } from "@/components/ui/button";

interface AdaptiveReviewProps {
  topErrors: ErrorKind[];
  actionHref?: string;
}

const REVIEW_COPY: Record<ErrorKind, { title: string; drill: string; action: string }> = {
  empty: {
    title: "Começar sem travar",
    drill: "Antes de escrever tudo, complete só a primeira linha do exercício. Um passo pequeno reduz ansiedade.",
    action: "Escreva a menor linha possível",
  },
  no_print: {
    title: "Mostrar resultado",
    drill: "Se a tarefa pede uma saída, procure uma chamada como print(), console.log() ou return.",
    action: "Confira se existe saída visível",
  },
  case_or_punct: {
    title: "Comparação fina",
    drill: "Revise maiúsculas, acentos, vírgulas, espaços e pontuação. O conceito está perto, falta precisão.",
    action: "Compare caractere por caractere",
  },
  wrong_quotes: {
    title: "Aspas corretas",
    drill: "Strings precisam abrir e fechar com o mesmo tipo de aspas. Em JavaScript, crase tem função especial.",
    action: "Verifique aspas e crases",
  },
  missing_keyword: {
    title: "Palavra-chave ausente",
    drill: "Procure no enunciado se a solução precisa de def, function, if, for, return, let ou const.",
    action: "Marque a palavra-chave central",
  },
  output_mismatch: {
    title: "Saída diferente",
    drill: "Leia o código em voz alta e pergunte: que texto exatamente ele produz?",
    action: "Execute mentalmente a saída",
  },
  syntax: {
    title: "Sintaxe balanceada",
    drill: "Conte parênteses, chaves e colchetes. Toda abertura precisa de fechamento.",
    action: "Balanceie pares de símbolos",
  },
  unknown: {
    title: "Depuração básica",
    drill: "Mude uma coisa por vez, execute, observe o resultado e só então avance.",
    action: "Teste em passos pequenos",
  },
};

const AdaptiveReview = ({ topErrors, actionHref = "/revisao" }: AdaptiveReviewProps) => {
  const errors = topErrors.length > 0 ? topErrors : (["no_print", "output_mismatch", "syntax"] as ErrorKind[]);
  const hasHistory = topErrors.length > 0;

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <RefreshCw size={18} />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground">Revisão inteligente</h2>
          <p className="text-sm text-muted-foreground">
            {hasHistory
              ? "Baseada nos padrões de erro que apareceram durante seus exercícios."
              : "Comece com estes hábitos. Depois a revisão se adapta aos seus erros reais."}
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {errors.slice(0, 3).map((error) => {
          const item = REVIEW_COPY[error];
          return (
            <div key={error} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-black text-foreground">
                {hasHistory ? (
                  <AlertCircle size={15} className="text-quest-yellow" />
                ) : (
                  <CheckCircle2 size={15} className="text-accent" />
                )}
                {item.title}
              </div>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{item.drill}</p>
              <Button variant="outline" size="sm" className="h-8 rounded-full text-xs font-bold" asChild>
                <Link to={actionHref}>{item.action}</Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdaptiveReview;
