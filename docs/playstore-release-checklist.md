# CapyCode Play Store Checklist

## Separacao Web e Android

- Web: continua usando Vite/Vercel com `npm run build`.
- Android: fica em `android/` e usa Capacitor com `npm run android:sync`.
- Assets nativos: ficam em `resources/` e `android/app/src/main/res/`.

## Status Atual

- Capacitor configurado com `appId` `com.capycode.app`.
- Projeto Android criado em `android/`.
- Icone e splash Android gerados com a marca CapyCode.
- `targetSdkVersion` definido como `36` em `android/variables.gradle`.
- APK debug validado localmente.
- AAB release gerado localmente, ainda sem chave de upload.

## Antes de Enviar Para a Play Store

- Criar chave de upload da Play Store.
- Copiar `android/key.properties.example` para `android/key.properties`.
- Preencher `android/key.properties` com os dados reais da chave.
- Nunca versionar `.jks`, `.keystore`, `.p12` ou `key.properties`.
- Rodar `npm run android:bundle`.
- Validar o `.aab` assinado antes de enviar.

## Play Console

- Categoria: Education.
- Criar politica de privacidade publica.
- Preencher Data Safety.
- Preencher App Content.
- Configurar conta de teste se o app exigir login.
- Subir primeiro para teste interno.
- Depois subir para teste fechado.
- So publicar em producao depois de validar o fluxo completo no aparelho.

## QA Mobile Minimo

- Cadastro, login e recuperacao de senha.
- Onboarding.
- Lista de cursos.
- Aula em carrossel.
- Exercicio com editor de codigo e teclado aberto.
- Projetos.
- Perfil.
- Rotacao bloqueada ou validada em retrato.
- Sem overflow horizontal em telas pequenas.
