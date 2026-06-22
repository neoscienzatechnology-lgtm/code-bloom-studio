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

## Go-live (hospedar + ligar no app)

1. **Renderizar** os vídeos desejados (`npm run video:render`).
2. **Hospedar** os MP4 num bucket **público** — recomendado **Supabase
   Storage** (a base já usa Supabase), mantendo o layout
   `<courseId>/<lessonId>.mp4`. (Eu não faço upload nem crio bucket sem sua
   autorização/credenciais.)
3. **Ligar no app**: defina `VITE_THEORY_VIDEO_BASE` com a URL pública do
   bucket (sem barra final) e faça o deploy. Pronto: o card "Teoria em vídeo"
   passa a aparecer nas lições que têm vídeo (índice em
   `src/data/theoryVideoIndex.ts`).

Sem `VITE_THEORY_VIDEO_BASE` o recurso fica **dormente** — nada muda na UI.

## Custo aproximado

~28s por vídeo · ~4 MB cada · ~188 lições ≈ **~750 MB** e dezenas de minutos de
render. Renderize em lotes (`--course=...`) e suba incrementalmente.
