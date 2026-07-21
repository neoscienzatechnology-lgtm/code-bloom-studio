# Publicar o CodeTier na Google Play

Guia de ponta a ponta. O **código já está pronto** (RevenueCat integrado, build
Android configurado, `applicationId = com.codetier.app`). O que falta são as
**suas etapas de conta/credenciais/publicação** — que eu não consigo fazer por
você (envolvem pagamento, identidade e segredos).

> ⏱️ **Comece HOJE pelo passo 1.** A verificação da conta Google Play e o teste
> fechado obrigatório (12 testadores por 14 dias, para contas pessoais novas)
> são o gargalo — somam ~2-3 semanas. O resto é rápido.

---

## ✅ O que já está feito (código)
- `applicationId`/package: **com.codetier.app** (permanente, alinhado à marca).
- Plugin **`@revenuecat/purchases-capacitor`** instalado e sincronizado no Android.
- `src/lib/revenuecat.ts`: configure / getOfferings / purchasePackage / restore /
  getCustomerInfo implementados (web é no-op).
- `EntitlementContext` já usa o RevenueCat como fonte da verdade no nativo.
- Assinatura release configurada (`android/app/build.gradle` lê de
  `~/.codetier/key.properties` ou `android/key.properties`, ambos gitignored).
- Tudo continua **DORMENTE** até você ligar (`VITE_MONETIZATION_ENABLED=true` +
  `VITE_REVENUECAT_ANDROID_KEY`), então nada quebra enquanto você monta as contas.

---

## Passo 1 — Conta Google Play Developer (gargalo, começe já)
1. Acesse https://play.google.com/console e crie a conta (**US$ 25**, uma vez).
2. Escolha tipo **pessoal** ou **organização**. Faça a **verificação de
   identidade** (documento) — pode levar dias.
3. ⚠️ Contas **pessoais** criadas recentemente exigem **teste fechado com 12+
   testadores por 14 dias seguidos** antes de liberar a produção. Já vá pensando
   em 12 e-mails (amigos/Google Groups) pra esse teste.

## Passo 2 — Conta RevenueCat
1. Crie conta grátis em https://www.revenuecat.com (plano free cobre bastante).
2. **Project → New → app Android**, package `com.codetier.app`.
3. Pegue a **Public SDK Key (Android)** — começa com `goog_...`. **Não é segredo**
   (pode ir em env público / Vercel).

## Passo 3 — Keystore de assinatura (você cria; senha é sua)
```bash
keytool -genkey -v -keystore codetier-upload.jks -alias upload \
        -keyalg RSA -keysize 2048 -validity 10000
```
- Mova a `.jks` pra `C:/Users/<voce>/.codetier/` e crie ali um `key.properties`
  (modelo em `android/key.properties.example`).
- 🔒 Guarde a `.jks` + senhas com segurança. Ative **Play App Signing** (a Play
  guarda a chave de app; você só gerencia a "upload key").

## Passo 4 — Criar o app + produtos na Play Console
1. **Criar app**: nome "CodeTier", idioma pt-BR, tipo App, grátis (com compras).
2. **Ficha da loja**: título, descrição curta/completa, ícone 512², feature
   graphic 1024×500, screenshots. (Texto sugerido em `docs/ficha-playstore.md`.)
3. **Política de privacidade**: aponte para a URL do app `/privacidade`
   (ex.: https://codetier.vercel.app/privacidade).
4. **Data safety / Content rating**: preencha os questionários.
5. **Monetização → Produtos → Assinaturas**: crie
   - `pro_monthly` (mensal) e `pro_yearly` (anual) — anote os **IDs**.

## Passo 5 — Ligar RevenueCat ↔ Play
1. No Google Cloud do projeto da Play, crie um **service account** com acesso à
   Play Developer API e baixe o **JSON**; cole no RevenueCat (app Android).
2. No RevenueCat: crie os **Products** com os mesmos IDs do passo 4, um
   **Entitlement `pro`** e uma **Offering** (default) com os 2 pacotes.

## Passo 6 — Ligar no app + gerar o AAB
1. Defina as variáveis (no `.env` local para o build Android, e no Vercel se
   quiser o paywall na web):
   ```
   VITE_MONETIZATION_ENABLED=true
   VITE_REVENUECAT_ANDROID_KEY=goog_xxx...   # a Public SDK Key do passo 2
   ```
2. (Anúncios do grátis) troque os ad-units de teste pelos reais:
   `VITE_ADMOB_BANNER_ID`, `VITE_ADMOB_INTERSTITIAL_ID` e o App ID em
   `android/app/src/main/res/values/strings.xml`.
3. Gere o pacote assinado:
   ```
   npm run android:bundle
   ```
   Saída: `android/app/build/outputs/bundle/release/app-release.aab`.

## Passo 7 — Subir e testar
1. Play Console → **Teste interno**: suba o `.aab`, adicione você como testador,
   instale e **valide a compra Pro** (use uma conta de teste de licença).
2. Faça o **teste fechado** (12+ testadores, 14 dias) se a conta exigir.
3. Promova para **Produção** e envie pra revisão.

---

## Lembretes
- **versionCode** sobe a cada envio (`android/app/build.gradle`, hoje `1`).
- Web vs. app: a Play exige Play Billing dentro do app. Para cobrar no navegador
  depois, dá pra somar Stripe (RevenueCat Web Billing) sem mexer no gating.
- Detalhes da fronteira freemium e flags: `docs/MONETIZACAO.md`.
