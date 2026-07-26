import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { ArrowLeft, Check, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEntitlement } from "@/contexts/EntitlementContext";
import { MONETIZATION } from "@/config/monetization";
import { track } from "@/lib/analytics";

const ProPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isPro, purchasing, buyPro, restore, setProForTesting } = useEntitlement();
  const [message, setMessage] = useState<string | null>(null);
  const reason = params.get("reason");

  // Quem chega aqui viu a oferta. `reason` diz o que trouxe (limite diário,
  // módulo trancado ou curiosidade) — sem isso, /pro é só um pageview mudo.
  useEffect(() => {
    if (isPro) return;
    track("paywall_shown", { reason: reason ?? "direct", native: Capacitor.isNativePlatform() });
  }, [isPro, reason]);

  const handleSubscribe = async () => {
    setMessage(null);
    track("pro_purchase_started", { reason: reason ?? "direct", native: Capacitor.isNativePlatform() });
    const result = await buyPro();
    if (result.ok) {
      track("pro_purchase_completed", { reason: reason ?? "direct" });
      setMessage("Assinatura ativada. Bem-vindo ao Pro! 🎉");
      return;
    }
    // Hoje isto é sempre "indisponível" (a compra está dormente atrás do flag);
    // o evento existe para o dia em que a loja estiver ligada.
    track("pro_purchase_failed", { reason: result.reason ?? "unavailable" });
    setMessage(
      Capacitor.isNativePlatform()
        ? "As assinaturas serão ativadas em breve aqui no app."
        : "A assinatura ficará disponível no app Android. Em breve!",
    );
  };

  const handleRestore = async () => {
    setMessage(null);
    const ok = await restore();
    track("pro_restore", { ok });
    setMessage(ok ? "Compra restaurada com sucesso. 🎉" : "Nenhuma assinatura encontrada para restaurar.");
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 gap-1.5 rounded-full text-xs text-muted-foreground"
        >
          <ArrowLeft size={14} /> Voltar
        </Button>

        {isPro ? (
          <div className="rounded-3xl border border-accent/30 bg-accent/5 p-8 text-center">
            <Crown className="mx-auto mb-3 text-primary" size={40} />
            <h1 className="text-2xl font-black text-foreground">Você é CodeTier Pro 🎉</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Todos os cursos, sem anúncios e sem limites estão liberados. Bons estudos!
            </p>
            <Button onClick={() => navigate("/cursos")} className="mt-6 rounded-full font-black">
              Ir para os cursos
            </Button>
          </div>
        ) : (
          <>
            <header className="mb-6 text-center">
              <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Sparkles size={26} />
              </span>
              <h1 className="text-3xl font-black text-foreground">CodeTier Pro</h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {reason === "daily"
                  ? "Você atingiu o limite diário de lições do plano grátis. Assine o Pro para estudar sem limites."
                  : "Desbloqueie todo o conteúdo, estude sem limites e sem anúncios."}
              </p>
            </header>

            <ul className="mb-6 space-y-3 rounded-2xl border border-border bg-card p-6">
              {MONETIZATION.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mb-4 flex items-baseline justify-center gap-2">
              <span className="text-3xl font-black text-foreground">{MONETIZATION.price.monthly}</span>
              <span className="text-sm text-muted-foreground">/mês</span>
              <span className="ml-2 text-xs text-muted-foreground">ou {MONETIZATION.price.yearly}/ano</span>
            </div>

            <Button
              onClick={handleSubscribe}
              disabled={purchasing}
              className="w-full rounded-full py-6 text-base font-black"
            >
              {purchasing ? "Processando…" : "Assinar o Pro"}
            </Button>
            <button
              onClick={handleRestore}
              className="mx-auto mt-3 block text-xs font-bold text-muted-foreground underline-offset-2 hover:underline"
            >
              Restaurar compra
            </button>

            {message && (
              <p className="mt-4 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-center text-sm text-foreground">
                {message}
              </p>
            )}

            {import.meta.env.DEV && (
              <button
                onClick={() => setProForTesting(true)}
                className="mx-auto mt-6 block rounded-lg border border-dashed border-border px-3 py-1.5 text-[11px] font-bold text-muted-foreground"
              >
                [dev] Desbloquear Pro para teste
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProPage;
