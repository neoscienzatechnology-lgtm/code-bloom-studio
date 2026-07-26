# Telemetria (PostHog) — como ativar

## O que já está implementado

- [`src/lib/analytics.ts`](../src/lib/analytics.ts): wrapper com **opt-in por
  env var** — sem `VITE_POSTHOG_KEY`, nenhum SDK é carregado e nenhum dado
  sai do aparelho (mesmo padrão do AdMob).
- Privacidade por padrão: autocapture **desligado**, gravação de sessão
  **desligada**, identificação só pelo id interno da conta (sem e-mail/nome).
  A política de privacidade (`/privacidade`) já cobre a coleta.
- Captura de erros: exceções não tratadas (`window.onerror`,
  `unhandledrejection`) e erros de renderização (ErrorBoundary) vão para o
  Error Tracking do PostHog.

## Eventos instrumentados

### Entrada e cadastro

| Evento | Quando | Propriedades |
|---|---|---|
| `$pageview` | troca de rota | `$current_url` |
| `trial_started` | abrir a aula grátis (`/experimentar`) | courseId, lessonId |
| `trial_to_signup` | sair da aula grátis para o cadastro | lessonId, completed |
| `signup_started` | o formulário de cadastro aparece | redirectTo, trialProgress |
| `signup_submitted` | enviar o cadastro | method (`email`/`google`), trialProgress |
| `signup_email_sent` | Supabase aceitou e mandou o link | method |
| `signup_resent` | pedir o link de novo | — |
| `signup_error` | falha no cadastro | method, reason, step |
| `email_confirmed` | **1ª sessão com e-mail confirmado** (1× por conta) | provider, minutesToConfirm |
| `login_submitted` / `login_error` | entrar numa conta existente | method, reason |

> `reason` é um rótulo curto e estável (`email_taken`, `invalid_credentials`,
> `email_not_confirmed`, `rate_limited`, `network`…) vindo de
> [`authErrorReason`](../src/utils/authErrors.ts) — **nunca** o texto cru do
> erro, que poderia carregar dado do aluno.

O par `signup_email_sent` → `email_confirmed` é o degrau que faltava: mostra
quanta gente se cadastra e **nunca abre o e-mail** (o suspeito nº 1 de perda em
app pt-BR mobile). `login_error` com `reason=email_not_confirmed` é o mesmo
problema visto pelo outro lado.

### Onboarding

| Evento | Quando | Propriedades |
|---|---|---|
| `onboarding_started` | abrir `/onboarding` | — |
| `onboarding_step` | escolher objetivo/experiência/meta | step, value |
| `onboarding_completed` | "Começar minha trilha" | goal, experience, dailyGoal, courseId |
| `onboarding_skipped` | "Pular por agora" | goal, experience, dailyGoal |

### Aprendizado

| Evento | Quando | Propriedades |
|---|---|---|
| `lesson_started` | abrir uma lição | lessonId, courseId, alreadyCompleted |
| `card_advanced` | avançar um cartão | lessonId, kind, index, total |
| `quiz_completed` | terminar o quiz do cartão | lessonId, correct, total, passed |
| `code_run` | clicar Executar | lessonId, courseId, correct, level, errorKind, attempts |
| `lesson_completed` | XP concedido na lição | lessonId, courseId, xp |
| `checkpoint_completed` | fechar um checkpoint | checkpointId, correct, total, passed |
| `project_completed` | concluir projeto | projectId, courseId, xp |

Com isso dá para montar o funil por lição (started → cards → quiz → code →
completed) e descobrir **em qual cartão os alunos abandonam**.

### Monetização (dormente até ligar o flag)

| Evento | Quando | Propriedades |
|---|---|---|
| `paywall_blocked` | aula trancada barrou o aluno | reason, courseId, lessonId |
| `daily_limit_reached` | limite diário do plano grátis barrou | courseId, lessonId, limit |
| `paywall_shown` | a página `/pro` foi vista | reason (`daily`/`direct`), native |
| `pro_purchase_started` / `pro_purchase_completed` / `pro_purchase_failed` | fluxo de assinatura | reason |
| `pro_restore` | restaurar compra | ok |
| `ad_shown` | intersticial exibido (Android) | format |

`paywall_blocked` e `daily_limit_reached` são disparados no
[`EditorPage`](../src/pages/EditorPage.tsx) — é lá que a barreira acontece; a
`/pro` não sabe qual aula ficou para trás.

## Para ativar

1. Criar conta em https://posthog.com (plano gratuito: 1M eventos/mês) e um
   projeto; copiar a **Project API Key** (`phc_…`).
2. Definir as env vars:
   - Local/build Android: no `.env` → `VITE_POSTHOG_KEY=phc_…`
     (e `VITE_POSTHOG_HOST=https://us.i.posthog.com`, ou `eu.` se preferir
     hospedagem na Europa).
   - Web: nas Environment Variables do projeto no Vercel + redeploy.
3. O CSP do `vercel.json` já libera `https://*.posthog.com`.

## Dashboards sugeridos no PostHog

- **Funil de aquisição** (o primeiro a montar): `$pageview /` →
  `trial_started` → `signup_started` → `signup_submitted` →
  `signup_email_sent` → `email_confirmed` → `onboarding_completed` →
  `lesson_completed`.
- **Funil de lição**: lesson_started → card_advanced (kind=quiz) →
  code_run (correct=true) → lesson_completed.
- **Lições problemáticas**: code_run agrupado por lessonId com correct=false,
  ordenado por volume; cruzar com errorKind.
- **Retenção**: usuários com lesson_completed em D0 que voltam em D1/D7.
- **Motivos de erro no cadastro**: `signup_error`/`login_error` por `reason` —
  um pico de `email_taken` significa gente tentando criar conta que já existe
  (falta um caminho melhor para "entrar"), e `rate_limited` indica limite do
  Supabase estourando.

### Origem da visita (campanhas)

O `$pageview` leva junto `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, `utm_term` e `ref` quando existem na URL. É assim que se separa
quem chegou por um Short de quem chegou por busca — os links prontos com
marcação ficam em [`shorts-copy.md`](./shorts-copy.md).

O caminho do certificado público (`/c/:courseId/:nome`) carrega o nome de uma
pessoa, então ele é **anonimizado antes de sair do aparelho**: a telemetria
recebe `/c/10/:nome`.

## Notas de implementação

- **Fila de eventos**: o SDK entra por `import()` dinâmico, então os primeiros
  eventos de uma sessão (`$pageview`, `signup_started`) acontecem antes de ele
  existir. `track()` guarda até 50 eventos numa fila e despeja quando o cliente
  fica pronto — sem isso, o começo do funil sumia.
- **`trackOnce(marcador, evento, props)`**: marcos que só valem uma vez
  (`email_confirmed` dispararia em todo login). O marcador fica no
  localStorage (`code-bloom-studio-analytics-milestones`); com a telemetria
  desligada nada é gravado.
