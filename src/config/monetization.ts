// Configuração da monetização (assinatura "CapyCode Pro" + anúncios no grátis).
//
// IMPORTANTE: `enabled` controla TODO o gating de paywall (lições Pro, limite
// diário, link "Seja Pro"). Vem DESLIGADO por padrão. Ligue só quando a
// cobrança estiver de fato no ar (conta RevenueCat + produtos na Play +
// VITE_REVENUECAT_ANDROID_KEY) — senão usuários grátis perderiam acesso à
// maioria das lições sem poder assinar. Para ligar: VITE_MONETIZATION_ENABLED=true.
//
// Modelo escolhido: Assinatura Pro + anúncios no grátis (freemium).
// Cobrança: Google Play via RevenueCat. Fronteira: "Equilibrado" (primeiros
// módulos de cada curso grátis + limite diário; Pro libera tudo, sem ads).
// Passos de go-live: ver docs/MONETIZACAO.md.

const flag = (value: string | undefined) => value?.trim() === "true";

export const MONETIZATION = {
  /** Liga o paywall/gating. Default OFF — o código fica dormente até o billing existir. */
  enabled: flag(import.meta.env.VITE_MONETIZATION_ENABLED),
  /** Quantos módulos iniciais de cada curso ficam grátis (fronteira "Equilibrado"). */
  freeModuleCount: 2,
  /** Máximo de lições que um usuário grátis conclui por dia. */
  freeDailyLessons: 5,
  /** Chave pública do RevenueCat (Android). Vazio = billing inativo (sem Pro real). */
  revenueCatAndroidKey: import.meta.env.VITE_REVENUECAT_ANDROID_KEY?.trim() || "",
  /** Id do entitlement configurado no RevenueCat. */
  entitlementId: "pro",
  /** Preço só para exibição no paywall (a cobrança real vem da Play/RevenueCat). */
  price: { monthly: "R$ 19,90", yearly: "R$ 119,90" },
  /** Benefícios listados no paywall. */
  benefits: [
    "Todos os cursos e lições, sem limite diário",
    "Sem anúncios",
    "Playground ilimitado",
    "Certificado de conclusão",
    "Protetores de ofensiva extras",
  ],
} as const;
