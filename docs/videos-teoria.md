# Vídeos de teoria (Remotion)

Vídeos curtos e animados (marca CodeTier) que resumem a **teoria** de cada
lição, mostrados como um card "Teoria em vídeo" logo após o objetivo. São
**mudos** (animação + texto na tela), gerados em código com
[Remotion](https://www.remotion.dev) — sem serviço de IA externo.

> ⚠️ **Licença Remotion**: grátis para indivíduos e empresas pequenas (~até 3
> pessoas) / sem fins lucrativos; acima disso exige licença comercial. Avalie
> antes de publicar vídeos em escala.

## Como funciona

```
src/data (catálogo real)
   └─ npm run video:extract  →  remotion/theory-data.json        (props de cada lição)
                             →  src/data/theoryVideoIndex.ts      (índice committed: que lições têm vídeo)
remotion/ (composição React) ──────────────────────────────────┐
   └─ npm run video:render   →  out/videos/<courseId>/<lessonId>.mp4
```

- **Composição**: `remotion/TheoryVideo.tsx` (data-driven). Cenas: capa →
  conceito → analogia → código digitando (+ saída quando faz sentido) →
  pontos-chave → outro. Duração calculada pelo conteúdo (`computeScenes`).
- **Conteúdo**: derivado dos campos reais da lição. `concept` =
  `learningObjective`/`summary`; `code` = `solution` (par casado com
  `expectedOutput`); a "saída" só aparece em linguagens com stdout
  (Python/JS/Node/SQL/Git/Lógica) — não em React/React Native/HTML/CSS.

## Comandos

```bash
npm run video:extract                       # (re)gera o manifesto + índice a partir do catálogo
npm run video:render -- --limit=5           # primeiros 5, para validar
npm run video:render -- --course=1          # um curso inteiro (ex.: Python)
npm run video:render -- --only=1__1-1,2__2-1 # lições específicas
npm run video:render                        # TODAS as lições (pesado)
npm run video:render -- --force             # re-renderiza mesmo se já existe
npm run video:still -- --key=1__1-1 --frac=0.6  # um quadro PNG (QA visual)
npm run video:studio                        # Remotion Studio (preview interativo)
```

Os MP4 vão para `out/videos/` (ignorado pelo git — **não** committar centenas
de MB no repo/Vercel).

## Hospedagem atual: Railway (serviço + volume)

Os vídeos moram num serviço dedicado no Railway (`railway-videos/`):
`https://codetier-videos-production.up.railway.app/<courseId>/<lessonId>.mp4`.
Um Volume em `/data` guarda os MP4 (o upload de código do Railway limita
~500MB, então os vídeos NÃO vão no deploy — são enviados via HTTP).

> Histórico: antes ficavam num projeto Supabase grátis dedicado, que foi
> **pausado por inatividade** (projetos free pausam após ~1 semana sem
> atividade) e derrubou os vídeos. O Railway não tem esse comportamento.

Os vídeos são **narrados** (TTS neural pt-BR via Edge-TTS, voz
`pt-BR-FranciscaNeural` — troque com `TTS_VOICE=<voz>`): um mp3 por cena em
`remotion-audio/` (gitignored) + manifesto `remotion/narration-manifest.json`;
cada cena estica para caber a fala.

Para (re)enviar vídeos após um novo render:

1. `npm run video:narrate` (gera/atualiza a narração; retoma onde parou).
2. `npm run video:render -- --force` (MP4s em `out/videos/`, com áudio).
3. `npm run video:upload -- --force` — PUT autenticado (sem `--force`, pula os
   que já existem). O token está em `railway-videos/upload-token.local` (gitignored);
   para rotacionar: gere outro, salve no arquivo e rode
   `railway variables --set "UPLOAD_TOKEN=..."` no serviço.
3. Nada mais muda: `VITE_THEORY_VIDEO_BASE` já aponta pro Railway (Vercel +
   `.env`), e o CSP (`vercel.json`, `media-src`) já libera o domínio.
   Obs.: o cache dos vídeos é de 1 dia (ETag revalida) — re-render com o mesmo
   nome aparece para todos em até 24h.
   > ⚠️ Só ligue a env depois do upload **100%** concluído (`npm run video:upload`
   > sem falhas) — o índice é estático, então lições sem o MP4 no bucket mostram
   > "Vídeo em breve" até subir. (checkup #11)

Sem `VITE_THEORY_VIDEO_BASE` o recurso fica **dormente** — nada muda na UI.

## Custo aproximado

~28s por vídeo · ~4 MB cada · ~188 lições ≈ **~750 MB** e dezenas de minutos de
render. Renderize em lotes (`--course=...`) e suba incrementalmente.
