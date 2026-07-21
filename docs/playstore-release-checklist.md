# CodeTier - checklist de release Android

## Separação web e Android

- Web: continua usando Vite/Vercel com `npm run build`.
- Android: fica em `android/` e usa Capacitor com `npm run android:sync`.
- Assets nativos: ficam em `android/app/src/main/res/`.
- Assets da Play Store: ficam em `docs/playstore/assets/`.

## Status atual

- Capacitor configurado com `appId` `com.capycode.app`.
- Nome Android configurado como `CodeTier`.
- `targetSdkVersion` definido como `36` em `android/variables.gradle`.
- `android:usesCleartextTraffic="false"` configurado.
- Backup nativo e transferência de dispositivo desativados por `backup_rules.xml` e `data_extraction_rules.xml`.
- Ícone e splash Android configurados com a marca CodeTier.
- Política de privacidade criada em `/privacidade`.
- Termos de uso criados em `/termos`.
- Página pública de exclusão de conta criada em `/excluir-conta`.
- AAB release gerado em `android/app/build/outputs/bundle/release/app-release.aab`.
- `jarsigner -verify` retornou `jar verified`.
- `lintRelease` completo passou para o app Android.

## Validação local executada

- `npm.cmd run lint`
- `npm.cmd test`
- `npm.cmd run build`
- `npm.cmd run android:sync`
- `npm.cmd run android:bundle`
- `.\gradlew.bat :app:lintRelease`
- Smoke local das rotas `/`, `/privacidade`, `/termos` e `/perfil`.

## Antes de enviar para teste interno

- Confirmar que o domínio público está ativo e acessível.
- Confirmar que `https://codetier.vercel.app/privacidade` abre sem erro.
- Confirmar que `https://codetier.vercel.app/termos` abre sem erro.
- Definir `VITE_SUPPORT_EMAIL` com o e-mail oficial de suporte e refazer o build.
- Confirmar que `https://codetier.vercel.app/excluir-conta` abre sem erro e mostra o canal real.
- Preencher Data Safety com base em `docs/playstore-data-safety.md`.
- Configurar conta de teste na Play Console se o revisor precisar acessar login.
- Conferir screenshots em `docs/playstore/assets/screenshots/phone/`.
- Conferir feature graphic em `docs/playstore/assets/feature-graphic-1024x500.png`.
- Conferir ícone em `docs/playstore/assets/icon-512.png`.

## Bloqueador real para produção

Como o app permite cadastro/login, a Play Console exige um caminho de exclusão de conta dentro do app e um link público fora do app. A rota pública já existe em `/excluir-conta`, mas falta definir um canal real de suporte, como e-mail ou formulário, para ativar o envio sem inventar contato.

## QA mobile mínimo

- Cadastro.
- Login.
- Recuperação de senha.
- Onboarding.
- Lista de cursos.
- Detalhe da trilha Fundamentos da Programação.
- Aula em mini etapas.
- Exercício com editor de código e teclado aberto.
- Revisão diária.
- Treino de pontos fracos.
- Projetos.
- Perfil.
- Links de privacidade e termos.
- Link de exclusão de conta.
- Navegação inferior em telas pequenas.
- Sem overflow horizontal em telas de 360px a 430px.

## Ordem recomendada na Play Console

1. Criar app como Educação.
2. Subir `app-release.aab` em teste interno.
3. Preencher ficha da loja com `docs/playstore-listing.md`.
4. Enviar ícone, feature graphic e screenshots.
5. Preencher App Content e Data Safety.
6. Configurar política de privacidade.
7. Configurar link de exclusão de conta quando o canal oficial estiver pronto.
8. Rodar teste interno em aparelho real.
9. Corrigir pontos encontrados antes de teste fechado ou produção.
