# Code Bloom Studio

Aplicativo web de ensino de programacao com trilhas em mapa por curso, licoes praticas, checkpoints de revisao, projetos guiados, validacao de codigo, mascote CapyCoder e progresso persistente.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- CodeMirror para editor de codigo
- Supabase para autenticacao e sincronizacao de progresso
- Vitest e Playwright para validacao

## Rodar Localmente

```bash
npm install
cp .env.example .env
npm run dev
```

Configure `.env` com:

```bash
VITE_SUPABASE_PROJECT_ID=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_URL=...
```

## Scripts

```bash
npm run dev       # servidor local
npm run build     # build de producao
npm run preview   # preview do build
npm run lint      # ESLint
npm test          # testes unitarios
```

## Modelo Pedagogico

O produto foi estruturado para aprendizagem progressiva:

- diagnostico inicial por nivel, objetivo e tempo diario;
- cursos apresentados como mapas de mundo tematicos, com regioes, etapas bloqueadas e projeto final;
- mascote CapyCoder como guia leve para explicacoes curtas, foco e revisao;
- teoria curta antes da pratica;
- plano da licao com objetivo, passos pequenos, vocabulario e criterios de sucesso;
- aquecimento interativo antes do editor livre;
- pratica guiada com completar lacunas e ordenar linhas;
- exercicios com codigo inicial, solucao e saida esperada;
- feedback tolerante a pequenas variacoes;
- perguntas reflexivas quando o aluno erra;
- checkpoints de revisao espacada a cada bloco de licoes;
- sessao diaria de revisao curta;
- projetos guiados em etapas para consolidar conceitos;
- progresso local offline-first com sincronizacao Supabase quando autenticado.

## Rotas Principais

- `/onboarding`: diagnostico inicial e recomendacao de comeco.
- `/cursos`: catalogo.
- `/cursos/:courseId`: mapa de mundo do curso.
- `/trilha`: visao sequencial bloqueada/desbloqueada.
- `/editor/:courseId/:lessonId`: experiencia principal de licao.
- `/checkpoint/:courseId/:lessonId`: revisao obrigatoria.
- `/revisao`: sessao diaria curta.
- `/projeto/:projectId`: projeto guiado.
- `/dashboard`: progresso e revisao adaptativa.

## Pre-lancamento

Antes de publicar:

- Rodar `npm run lint`, `npm test` e `npm run build`.
- Confirmar variaveis Supabase no ambiente de deploy.
- Aplicar as migrations em `supabase/migrations`.
- Nao versionar `.env`.
- Revisar `npm audit` e planejar atualizacao de dependencias com quebra potencial.
- Testar fluxo principal: cadastro, login, cursos, mapa do curso, licao, checkpoint, projeto, dashboard e reset de senha.
