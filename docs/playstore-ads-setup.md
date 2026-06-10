# Anúncios (AdMob) — o que já está pronto e o que falta para a Play Store

## O que já está implementado

- Plugin `@capacitor-community/admob` 8.x instalado e sincronizado no projeto Android.
- `AndroidManifest.xml` com o meta-data `com.google.android.gms.ads.APPLICATION_ID`
  lendo de `@string/admob_app_id` (hoje aponta para o **App ID de teste** do Google).
- Serviço em [`src/lib/ads.ts`](../src/lib/ads.ts):
  - Inicialização com fluxo de consentimento UMP (GDPR/LGPD) no primeiro uso.
  - **Intersticial com limite de frequência**: no máximo 1 anúncio a cada
    4 lições concluídas E pelo menos 5 minutos desde o anterior
    (configurável em [`src/config/ads.ts`](../src/config/ads.ts)).
  - Banner implementado mas **não ativado** em nenhuma tela (banners
    sobrepõem a WebView e precisam de ajuste de layout por tela — ativar
    deliberadamente depois de testar em aparelho).
  - **Tudo é no-op na web**: o site no Vercel não carrega o SDK nem mostra anúncios.
- Gatilho: o intersticial é considerado ao tocar "Próxima lição" após concluir
  uma lição (nunca interrompe no meio do exercício).
- Por padrão (sem env vars), o app usa os **ad units de teste oficiais do
  Google** — pode desenvolver e instalar à vontade sem risco de violação.

## Checklist antes de publicar com anúncios reais

1. **Criar a conta/app no AdMob** (https://admob.google.com):
   - Registrar o app `com.capycode.app`.
   - Criar 1 bloco intersticial (e 1 banner, se for usar).
2. **Substituir os IDs**:
   - App ID real em `android/app/src/main/res/values/strings.xml`
     (`admob_app_id`, formato `ca-app-pub-XXXX~YYYY`).
   - Ad units reais no `.env` de build do app:
     `VITE_ADMOB_INTERSTITIAL_ID` (e `VITE_ADMOB_BANNER_ID`).
     Com o ID real definido, o modo de teste desliga sozinho.
3. **app-ads.txt**: publicar o arquivo indicado pelo AdMob na raiz do domínio
   do desenvolvedor (ex.: `https://code-bloom-studio.vercel.app/app-ads.txt` —
   basta colocar o arquivo em `public/`).
4. **Play Console — Data Safety**: declarar que o app exibe anúncios e que o
   SDK do Google coleta identificadores de dispositivo para publicidade.
5. **Play Console — Conteúdo do app**: na seção "Anúncios", marcar que o app
   contém anúncios.
6. **Política de privacidade**: a página `/privacidade` precisa citar a
   exibição de anúncios via Google AdMob e o uso de identificador de
   publicidade (já há um lembrete na seção correspondente do app).
7. **Público-alvo**: se o app for declarado para crianças/famílias, o AdMob
   exige configuração adicional (anúncios adequados à idade,
   `tagForChildDirectedTreatment`). Hoje o app assume público geral.
8. **Testar em aparelho** antes do release: instalar o AAB/APK, completar 4
   lições e verificar se o intersticial de teste aparece ao avançar.

## Ajustes de frequência

Edite `src/config/ads.ts`:

| Campo | Padrão | Efeito |
|---|---|---|
| `interstitialEveryNLessons` | 4 | Lições concluídas entre anúncios |
| `interstitialMinIntervalMinutes` | 5 | Intervalo mínimo entre anúncios |
