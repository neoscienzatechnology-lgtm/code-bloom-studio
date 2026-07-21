# Arte CodeTier — lista para gerar (ChatGPT / gpt-image)

Você gera no seu ChatGPT e me manda os PNGs (salve em `Downloads` e me diga os
nomes). Eu otimizo e ploto no app + deploy. Não invente texto/logo nas imagens.

**Estilo (colar em TODO prompt):**
> CodeTier style: dark premium developer brand. Pure near-black background #0A0E0C, neon green accents #37D32C to #4DE84A, white/off-white highlights. Abstract, geometric, minimal, high-end (Vercel/Linear/Raycast vibe), cinematic depth, soft volumetric glow, ultra-detailed. NO text, NO letters, NO logos, NO watermark, NO people, NO cartoon/childish look.

---

## P1 — Capas por trilha (maior alcance) — 16:9, ~1600×900, fundo escuro (sem transparência)
Deixe **espaço negativo no canto superior esquerdo** (o app sobrepõe um ícone + rótulo ali). Um motivo por trilha, mesmo estilo:

Prompt base (troque só o MOTIVO):
> [ESTILO]. Abstract 16:9 cover, lots of empty negative space in the top-left third. MOTIF: <motivo>. Subtle neon-green wireframe/particles, deep perspective, dark and premium.

Motivos por trilha (nome do arquivo → motivo):
- `cover-logica.png` → interlocking flow nodes and logic-gate paths
- `cover-python.png` → smooth intertwined neon data ribbons flowing diagonally
- `cover-javascript.png` → dynamic angular energy bursts and brackets of light
- `cover-html.png` → clean structural wireframe blocks / scaffolding grid
- `cover-css.png` → layered translucent glass panels with gradient edges
- `cover-react.png` → orbiting concentric rings with glowing component nodes
- `cover-reactnative.png` → a floating glass device frame emitting green light
- `cover-node.png` → interconnected server hexagons / mesh of nodes
- `cover-sql.png` → stacked glowing data layers / luminous table grid
- `cover-git.png` → a branching neon tree with merging paths
- `cover-algoritmos.png` → ascending sorted bars + graph traversal lines
- `cover-dadosia.png` → soft neural particle cloud / constellation
- `cover-jogos.png` → neon voxel/arcade geometry, playful but premium

## P1 — Emblemas de Tier (a identidade "Tier") — 1024×1024, **fundo transparente** (PNG)
Crestes hexagonais premium, escalando em riqueza (mais facetas/brilho a cada nível):
> [ESTILO]. A premium hexagonal badge/crest emblem, metallic dark with neon-green facets, centered, transparent background, soft inner glow. Tier: <nível>.
- `tier-1-basico.png` → minimal, one ring, calm glow (Básico)
- `tier-2-intermediario.png` → two layered rings, brighter edges (Intermediário)
- `tier-3-avancado.png` → faceted, sharper neon, small accents (Avançado)
- `tier-4-expert.png` → most ornate, intense neon, crown-like top facet (Expert)

---

## P2 — Ilustração de onboarding — quadrada ~1200×1200, fundo escuro
> [ESTILO]. Abstract "choose your path" scene: several glowing neon-green trails diverging from a single point into the dark, depth and bokeh, premium and calm. Square.
- `onboarding.png`

## P2 — Fundo do certificado — ~1600×1130 (paisagem), fundo escuro
> [ESTILO]. Elegant certificate background texture: subtle neon-green filigree/circuitry in the corners, large clean empty center for text, refined and formal, very low contrast.
- `cert-bg.png`

## P2 — Medalhas de conquista (3 raridades) — 1024×1024, **fundo transparente**
> [ESTILO]. A glossy geometric achievement medal, centered, transparent background, hexagon/shield silhouette, neon-green energy. Rarity: <raridade>.
- `badge-comum.png` → simple, matte, single green tone
- `badge-raro.png` → polished, brighter rim glow
- `badge-epico.png` → faceted, intense neon aura, premium

---

## P3 — Opcionais
- `feature-howitworks.png` (16:9) → [ESTILO]. Three abstract glowing steps/stations connected by a neon path, premium, lots of negative space.
- `og-rich.png` (1200×630) → [ESTILO]. Atmospheric hero banner, neon hex terrain receding into fog, empty center for a wordmark (eu adiciono o "CodeTier" depois).

---

### Como me entregar
Salve os PNGs em `Downloads` com **esses nomes** e me diga "prontos". Eu:
1. otimizo (tamanho/compressão), movo pra `public/` (ou `public/covers`, `public/tiers`, `public/badges`),
2. ploto (capas → `CourseCoverArt`; tiers → trilha/roadmap; badges → conquistas; onboarding/cert → respectivas telas),
3. tsc/lint/testes/build + deploy verificado.

Dica: gere primeiro **1 capa** (ex.: `cover-python.png`) e **1 tier** pra a gente validar o estilo antes de gerar o resto.
