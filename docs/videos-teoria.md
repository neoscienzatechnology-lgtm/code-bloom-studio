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
2. **Subir para o Supabase Storage** com o helper (cria um bucket **público**
   e mantém o layout `<courseId>/<lessonId>.mp4`). As credenciais vêm do
   ambiente — a `service_role` nunca é commitada:

   ```powershell
   $env:SUPABASE_URL="https://<ref>.supabase.co"
   $env:SUPABASE_SERVICE_KEY="<chave service_role>"   # NÃO é a anon/publishable
   npm run video:upload
   ```

   Ao final ele imprime o valor exato de `VITE_THEORY_VIDEO_BASE`.
   (Egress: o plano grátis do Supabase tem limite de banda — para muitos
   acessos, considere um CDN de vídeo como Cloudflare R2/Stream ou Bunny.)
3. **Ligar no app**: defina `VITE_THEORY_VIDEO_BASE` com a URL impressa e faça
   o deploy. Pronto: o card "Teoria em vídeo" passa a aparecer nas lições que
   têm vídeo (índice em `src/data/theoryVideoIndex.ts`).
   > ⚠️ Só ligue a env depois do upload **100%** concluído (`npm run video:upload`
   > sem falhas) — o índice é estático, então lições sem o MP4 no bucket mostram
   > "Vídeo em breve" até subir. (checkup #11)

Sem `VITE_THEORY_VIDEO_BASE` o recurso fica **dormente** — nada muda na UI.

## Custo aproximado

~28s por vídeo · ~4 MB cada · ~188 lições ≈ **~750 MB** e dezenas de minutos de
render. Renderize em lotes (`--course=...`) e suba incrementalmente.
