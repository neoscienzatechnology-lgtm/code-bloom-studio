---
name: codetier-brand-implementer
description: Use quando o usuário pedir para aplicar, adaptar, revisar ou padronizar a identidade visual da CodeTier no app (tokens, tema, componentes, logo, UI/UX, microinterações). Mantém aparência séria, profissional, tecnológica e gamificada — dark-first premium com verde neon. Gatilhos: "aplicar marca CodeTier", "padronizar identidade", "deixar com cara de edtech premium", "rebrand visual", "revisar UI da marca".
---

# CodeTier Brand Implementer

Aplica a identidade visual da CodeTier neste app (Vite + React + TS + Tailwind/shadcn,
deploy na Vercel, wrapper Android via Capacitor) **preservando a lógica existente**.
CodeTier = plataforma séria de tecnologia para devs: fundo escuro premium, verde neon
como destaque sutil, gamificação discreta (níveis/progresso/badges), **sem mascote**.

> Esta é uma skill de **workflow** (não um driver de "rodar o app"): o entregável é a
> identidade aplicada + verificada, não um script. Para verificação visual, use o
> harness de E2E que já existe (ver "Verificação").

## Antes de tudo — leia as referências

- `references/manual_de_marca_codetier.pdf` — fonte principal das decisões visuais.
- `assets/logo_elegante_com_emblema_verde_neon.png` — logo oficial (emblema verde neon).

⚠️ Se esses arquivos não estiverem presentes, **pare e peça ao usuário** para adicioná-los
nas pastas `references/` e `assets/` desta skill. Sem o manual e o logo, não aplique a marca
"no escuro" — confirme paleta, tipografia e logo antes.

## Estado atual da marca neste repo (ponto de partida — JÁ AUDITADO)

O app já passou por um rebrand "estilo CODERS" (charcoal + lima `#44D62C`, sem capivara).
CodeTier é a evolução: **dark-first**, neon, e (decisão do usuário) possível troca do nome
**CapyCode → CodeTier**. Onde a marca vive hoje:

- **Tokens (CSS vars):** `src/index.css` — bloco `:root` (claro) e `.dark` (escuro).
  Hoje: `--primary` verde-escuro `134 66% 30%` (claro) / lima `112 64% 52%` (escuro);
  `--accent` lima `112 67% 51%`; `--background` escuro `150 6% 8%`. **Regra de ouro:**
  lima é cor de **fill/CTA/destaque**, NÃO de texto sobre fundo claro (ilegível) — texto
  estrutural usa `--primary`/`--foreground`.
- **Tokens Tailwind:** `tailwind.config.ts` (mapeia as CSS vars + `font-display`).
- **Logo:** `src/components/BrandLogo.tsx` — monograma `cc` (par de arcos, `currentColor`
  + acento `#44D62C`) e wordmark "capycode" em Space Grotesk. Trocar aqui para o logo/nome
  CodeTier (emblema verde neon).
- **Fontes:** importadas no topo de `src/index.css` (Inter corpo, Space Grotesk display,
  Fira Code mono). Ajustar aqui se o manual pedir outra sans moderna.
- **HTML/SEO/PWA:** `index.html` (title/meta/`theme-color` claro `#fbfbfb` / escuro
  `#161616`, `og:image`, `@capycode`); ícones em `public/` (`favicon.svg`,
  `brand-og.png`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-512x512.png`);
  manifest gerado pelo `vite-plugin-pwa` em `vite.config.ts`.
- **Componentes shadcn:** `src/components/ui/*` (`button`, `card`, `input`, `dialog`,
  `badge`, `progress`, …) — herdam os tokens; ajuste os tokens antes de mexer aqui.
- **Navbar:** `src/components/Navbar.tsx`. **Tema:** `next-themes` (App.tsx,
  `defaultTheme="system"`) — para dark-first, considere `defaultTheme="dark"`.
- **Capas/ilustração procedural:** `src/components/CourseCoverArt.tsx` +
  `src/utils/visualTones.ts` (paleta verde+charcoal por linguagem).

## Direção visual (CodeTier)

- Fundo escuro, tecnológico, premium; muito respiro; interface limpa.
- Verde neon = destaque/CTA/progresso, **sem excesso**.
- Branco/off-white para texto principal; cinzas escuros para superfícies/cards/bordas.
- Sans-serif moderna, forte, legível. Gamificação **profissional** (níveis Básico →
  Expert, progresso neon, badges geométricos discretos, streaks sem exagero).
- **Proibido:** mascote, cartoon, ícones fofos, visual infantil.

## Processo

1. **Auditoria** — confirme os caminhos acima ainda valem (`grep`/`Read`); liste os
   arquivos que vai tocar. Não mexa em regra de negócio, auth, API, rotas ou progresso.
2. **Tokens primeiro** — centralize tudo em `src/index.css` (`:root` + `.dark`) e
   `tailwind.config.ts`. Prefira nomes semânticos já existentes (`--primary`, `--accent`,
   `--background`, `--card`, `--border`, `--muted`, `--ring`, `--radius`). Não espalhe hex.
3. **Componentes** — padronize via tokens: botões (1º/2º), cards, inputs, navbar,
   login/cadastro, dashboard, cards de aula/módulo, barras de progresso, badges, estados
   hover/focus/active, loading e empty states.
4. **Gamificação premium** — trilha em cards escuros, níveis nomeados, progresso neon,
   badges discretos. Sem visual infantil.
5. **Logo** — aplique o logo CodeTier em navbar, tela inicial, login/cadastro, `favicon`,
   `og:image` e splash/PWA. Preserve proporção/respiro; nunca sobre fundo claro sem
   adaptação; sem efeitos exagerados. Atualize `index.html` (title/meta/theme-color) e
   `BrandLogo.tsx`. **Se trocar o nome (CapyCode → CodeTier), confirme com o usuário** —
   é decisão de produto, não só visual.
6. **A11y + responsivo** — contraste AA, foco visível, alvos de toque confortáveis,
   layout em mobile/tablet/desktop, sem texto cortado nem sobreposição. Cuidado com lima
   sobre claro (use só em fill).
7. **Preservar função** — não quebre login, navegação, formulários, estados globais,
   rotas, progresso nem testes. Na dúvida entre estética e função, **função vence**.

## Verificação (OBRIGATÓRIA antes de entregar/commitar)

Rode o gate do projeto (os comandos abaixo são os usados no fluxo padrão deste repo):

```bash
npx tsc --noEmit
npm run lint        # eslint .
npx vitest run
npx vite build
```

Verificação **visual** (o app é web; use o harness Playwright que já existe):

- Specs em `tests/e2e/` + `playwright-fixture.ts`; dev server em `http://localhost:8080`.
- Conta QA: `qa-capytest-2026@capycode.dev` / `CapyTest#2026`.
- Rode `npx playwright test` (sobe o dev server sozinho) e/ou abra telas e tire
  screenshots das principais (login, dashboard, curso, editor, `/pro`) para revisão.

Deploy é na Vercel (push na `main`). Confirme o deploy comparando o hash do entry de
`dist/index.html` com `https://code-bloom-studio.vercel.app` (disciplina deploy-by-hash).

## Estilo de resposta (ao finalizar)

Objetivo, em português: (1) resumo do que foi aplicado; (2) arquivos principais
modificados; (3) como testar; (4) pontos a refinar. Sem explicar demais.
