# Monetização — CapyCode Pro

Modelo: **assinatura "CapyCode Pro" + anúncios no grátis** (freemium).
Cobrança: **Google Play via RevenueCat**. Fronteira: **"Equilibrado"** — os
primeiros `freeModuleCount` módulos de cada curso são grátis + limite de
`freeDailyLessons` lições/dia; o Pro libera tudo, sem anúncios.

## Estado atual (já no ar, porém DORMENTE)

Todo o sistema está implementado e versionado, mas **desligado por um flag**
(`MONETIZATION.enabled`, default `false`). Com o flag desligado:

- nenhuma lição é trancada, não há limite diário, não aparece o link "Seja Pro";
- usuários grátis seguem vendo anúncios exatamente como hoje;
- a rota `/pro` existe e mostra o paywall, mas não é cobrável.

Isso evita o pior cenário: ligar o gating **antes** de existir uma forma de
pagar, o que trancaria todos os usuários grátis sem saída.

Peças:
- `src/config/monetization.ts` — flag, limites, preço, chave RevenueCat.
- `src/utils/entitlement.ts` — lógica pura do gating (testada).
- `src/contexts/EntitlementContext.tsx` — estado `isPro` compartilhado.
- `src/lib/revenuecat.ts` — bridge RevenueCat (hoje stub seguro).
- `src/pages/ProPage.tsx` — paywall (`/pro`).
- Gating: `EditorPage`, `CourseRoutePath`, `LessonView` (skip ads p/ Pro), `Navbar`.

Para testar localmente o gating: rode com `VITE_MONETIZATION_ENABLED=true` e use
o botão **[dev] Desbloquear Pro para teste** no `/pro` (ou
`localStorage["code-bloom-studio-entitlement"]="pro"`).

## Go-live (passos seus, fora do código)

1. **RevenueCat**: criar conta, criar um app Android, criar o entitlement `pro`
   e uma offering com os produtos de assinatura.
2. **Google Play Console**: publicar o app (pelo menos em teste interno) e criar
   os produtos de assinatura (mensal/anual) com os mesmos ids do RevenueCat.
3. **Plugin**: `npm i @revenuecat/purchases-capacitor` e `npx cap sync android`.
4. **Código**: preencher os `TODO go-live` em `src/lib/revenuecat.ts`
   (configure / getCustomerInfo / getOfferings+purchasePackage / restorePurchases).
5. **Env** (Vercel + build Android): `VITE_REVENUECAT_ANDROID_KEY=<chave pública>`
   e `VITE_MONETIZATION_ENABLED=true`.
6. **AdMob (anúncios do grátis)**: trocar os ad-units de teste pelos reais via
   `VITE_ADMOB_INTERSTITIAL_ID` / `VITE_ADMOB_BANNER_ID` e o App ID em
   `android/app/src/main/res/values/strings.xml` (ver `src/config/ads.ts`).

## Ajustes finos

- `freeModuleCount` e `freeDailyLessons` em `src/config/monetization.ts`.
- Benefícios e preço exibidos: mesmo arquivo.
- Web: a Play Store exige Play Billing dentro do app Android; para cobrar no
  navegador depois, dá para somar Stripe (RevenueCat Web Billing) sem mexer no gating.
