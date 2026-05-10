# CapyCode

Aplicativo web de ensino de programação com trilhas em mapa por curso, lições práticas, checkpoints de revisão, projetos guiados, validação de código, mascote CapyCoder e progresso persistente.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- CodeMirror para editor de código
- Supabase para autenticação e sincronização de progresso
- Vitest e Playwright para validação

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
npm run build     # build de produção
npm run preview   # preview do build
npm run lint      # ESLint
npm test          # testes unitários
```

## Android

A versao web continua separada e usa o fluxo normal do Vite/Vercel. A versao Android fica isolada em `android/` e usa Capacitor para empacotar o build web de `dist/`.

```bash
npm run android:sync    # gera dist e sincroniza com android/
npm run android:open    # abre o projeto no Android Studio
npm run android:debug   # gera APK debug local
npm run android:bundle  # gera AAB release para a Play Store
```

Configuracao inicial:

- App name: `CapyCode`
- Package name: `com.capycode.app`
- Web dir: `dist`
- Android target: definido em `android/variables.gradle`

Para gerar o `.aab`, a maquina precisa ter Android Studio ou Android SDK instalado e JDK compativel com o Android Gradle Plugin.

Para assinar release, copie `android/key.properties.example` para `android/key.properties` e preencha com a chave de upload da Play Store. O arquivo real de chave e `key.properties` ficam fora do Git.

## Modelo Pedagógico

O produto foi estruturado para aprendizagem progressiva:

- diagnóstico inicial por nível, objetivo e tempo diário;
- cursos apresentados como mapas de mundo temáticos, com regiões, etapas bloqueadas e projeto final;
- mascote CapyCoder como guia leve para explicações curtas, foco e revisão;
- teoria curta antes da prática;
- plano da lição com objetivo, passos pequenos, vocabulário e critérios de sucesso;
- aquecimento interativo antes do editor livre;
- prática guiada com completar lacunas e ordenar linhas;
- exercícios com código inicial, solução e saída esperada;
- feedback tolerante a pequenas variações;
- perguntas reflexivas quando o aluno erra;
- checkpoints de revisão espaçada a cada bloco de lições;
- sessão diária de revisão curta;
- projetos guiados em etapas para consolidar conceitos;
- progresso local offline-first com sincronização Supabase quando autenticado.

## Rotas Principais

- `/onboarding`: diagnóstico inicial e recomendação de começo.
- `/cursos`: catálogo.
- `/cursos/:courseId`: mapa de mundo do curso.
- `/trilha`: visão sequencial bloqueada/desbloqueada.
- `/editor/:courseId/:lessonId`: experiência principal de lição.
- `/checkpoint/:courseId/:lessonId`: revisão obrigatória.
- `/revisao`: sessão diária curta.
- `/projeto/:projectId`: projeto guiado.
- `/dashboard`: progresso e revisão adaptativa.

## Pré-lançamento

Antes de publicar:

- Rodar `npm run lint`, `npm test` e `npm run build`.
- Confirmar variáveis Supabase no ambiente de deploy.
- Aplicar as migrations em `supabase/migrations`.
- Não versionar `.env`.
- Revisar `npm audit` e planejar atualização de dependências com quebra potencial.
- Testar fluxo principal: cadastro, login, cursos, mapa do curso, lição, checkpoint, projeto, dashboard e reset de senha.
