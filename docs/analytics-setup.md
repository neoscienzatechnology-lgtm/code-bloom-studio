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

| Evento | Quando | Propriedades |
|---|---|---|
| `$pageview` | troca de rota | `$current_url` |
| `lesson_started` | abrir uma lição | lessonId, courseId, alreadyCompleted |
| `card_advanced` | avançar um cartão | lessonId, kind, index, total |
| `quiz_completed` | terminar o quiz do cartão | lessonId, correct, total, passed |
| `code_run` | clicar Executar | lessonId, courseId, correct, level, errorKind, attempts |
| `lesson_completed` | XP concedido na lição | lessonId, courseId, xp |
| `checkpoint_completed` | fechar um checkpoint | checkpointId, correct, total, passed |
| `project_completed` | concluir projeto | projectId, courseId, xp |
| `ad_shown` | intersticial exibido (Android) | format |

Com isso dá para montar o funil por lição (started → cards → quiz → code →
completed) e descobrir **em qual cartão os alunos abandonam**.

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

- **Funil de lição**: lesson_started → card_advanced (kind=quiz) →
  code_run (correct=true) → lesson_completed.
- **Lições problemáticas**: code_run agrupado por lessonId com correct=false,
  ordenado por volume; cruzar com errorKind.
- **Retenção**: usuários com lesson_completed em D0 que voltam em D1/D7.
