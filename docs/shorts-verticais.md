# Shorts verticais (aquisição)

Vídeos de 30 a 45 segundos em 1080×1920 para YouTube Shorts, Instagram Reels e
TikTok, gerados em código com [Remotion](https://www.remotion.dev) + narração
TTS pt-BR. São o braço de **aquisição** do projeto: o app já está pronto e
publicado, o gargalo é ninguém saber que ele existe.

> ⚠️ **Licença Remotion**: grátis para indivíduos e empresas pequenas (~até 3
> pessoas) / sem fins lucrativos. Acima disso exige licença comercial.

## Por que estes vídeos são diferentes dos de teoria

Os 188 vídeos de teoria (`docs/videos-teoria.md`) são 16:9, explicam uma lição
inteira e vivem **dentro** do app. Os Shorts são o contrário: vertical, curtos,
para quem **ainda não conhece** o CodeTier e está rolando o feed.

Três decisões vêm daí:

1. **Gancho, não resumo.** Os primeiros dois segundos mostram uma tensão —
   "Por que 25 + 1 virou 251?" — e não "Aprenda tipos em JavaScript". Sem
   tensão, o dedo continua rolando.
2. **Legenda queimada sincronizada por palavra.** A maior parte do feed roda
   sem som. O pipeline pede ao Edge-TTS os *word boundaries* (offset e duração
   de cada palavra) e a composição destaca a palavra falada.
3. **Áreas seguras.** A interface das plataformas cobre o topo e o rodapé. Todo
   conteúdo fica entre 250px e 1340px; a faixa de legenda vai logo abaixo e o
   rodapé fica vazio de propósito.

## Como funciona

```
remotion/shorts-data.json         (conteúdo dos Shorts: gancho, código, falas, copy)
   └─ npm run shorts:narrate   →  remotion-audio/shorts/<id>/<cena>.mp3
                               →  remotion/shorts-narration.json  (duração + palavra a palavra)
remotion/Short.tsx (composição)
   └─ npm run shorts:render    →  out/shorts/<id>.mp4
   └─ npm run shorts:copy      →  docs/shorts-copy.md  (título/descrição/hashtags para publicar)
```

Cada Short tem cinco blocos: **gancho → conceito → código digitando → pontos →
CTA**. A duração de cada bloco é calculada a partir da narração
(`computeShortScenes`), então a cena nunca corta a fala no meio.

## Comandos

```bash
npm run shorts:check                      # valida o JSON ANTES de gastar TTS e render
npm run shorts:narrate                    # narração + marcação de palavra (retoma o que já existe)
npm run shorts:narrate -- --only=<id>     # um Short
npm run shorts:still -- --id=<id> --all   # 5 quadros PNG para QA visual (out/shorts-qa/)
npm run shorts:render -- --limit=1        # renderiza o primeiro, para validar
npm run shorts:render                     # todos (pula MP4 já pronto)
npm run shorts:copy                       # regenera docs/shorts-copy.md
npm run video:studio                      # Remotion Studio: composição "Short"
```

Os MP4 vão para `out/shorts/` e **não** entram no git.

## Como o conteúdo é escolhido

`remotion/shorts-data.json` é escrito à mão (ou por agentes, com revisão), não
derivado automaticamente do catálogo — gancho é trabalho editorial. As regras
que valem para qualquer Short novo:

- entre **75 e 105 palavras faladas** no total (o TTS pt-BR fala ~2,6
  palavras/s: mais que isso estoura os 45s);
- `hook` ≤ 54 caracteres — cria tensão, não resume;
- `code` com **≤ 8 linhas e ≤ 32 colunas** (tela de celular em pé) e que roda
  sozinho;
- `codeOutput` é a saída **executada de verdade**, caractere por caractere —
  nunca escrita de cabeça;
- `points`: 2 ou 3, cada um ≤ 42 caracteres;
- português do Brasil **com acentos** em todos os campos: o texto da narração
  vira legenda na tela *e* entra no sintetizador de voz.

Cada Short aponta para a lição real que o originou (`courseId`/`lessonId`), e a
descrição leva para `codetier.vercel.app/cursos/<courseId>`.

`npm run shorts:check` cobra essas regras — rode antes de narrar, porque TTS e
render custam minutos e um gancho de 60 caracteres só apareceria cortado no
vídeo pronto.

## Publicação

O que copiar e colar está em [`shorts-copy.md`](./shorts-copy.md), gerado por
`npm run shorts:copy`. Antes de postar:

- assista **sem som** — se a legenda não conta a história, o vídeo não funciona;
- publique como conteúdo nativo (upload direto), nunca como link;
- um por dia útil, começando pelos de maior tensão;
- responda os primeiros comentários na primeira hora.

Para medir: os eventos `$pageview` e `trial_started` já existem
(`docs/analytics-setup.md`). Com a chave do PostHog ligada, dá para separar
quem chegou pelo Short (parâmetro `?utm_source=` na descrição) de quem chegou
por busca.

## Próximos temas (fila)

Levantados na revisão do primeiro lote, em ordem de retorno esperado:

1. **Erro de ambiente, não de código** — `'python' não é reconhecido como
   comando`, acento quebrando no terminal do Windows, `pip` que não acha o
   pacote. Trava mais gente no Brasil do que qualquer conceito e nenhum Short
   cobre.
2. **SQL** (curso 6) — `NULL` dentro de `WHERE`, `COUNT(*)` vs
   `COUNT(coluna)`. Porta de entrada de emprego real (analista de dados).
3. **Git** (curso 7) — "commitei a senha", "sumiu meu código". Universal, e
   quase ninguém ensina em 30 segundos.
4. **`input()` devolve texto** — `float("3,5")` explodindo por causa da vírgula
   decimal brasileira.

Regra ao montar o próximo lote: **variar a forma do gancho**. Se todos virarem
"Por que X deu Y?", o feed lê como um vídeo só, repetido.

## Limitações conhecidas

- **Sem trilha sonora.** Música licenciada é a maior fonte de dor de cabeça em
  vídeo automatizado; as plataformas oferecem áudio próprio no editor delas.
- **Voz sintética.** `pt-BR-FranciscaNeural` é boa, mas é TTS. Trocar com
  `TTS_VOICE=<voz>`.
- **Nada de rosto/câmera.** É uma escolha: o formato escala sem depender de
  ninguém gravar.
