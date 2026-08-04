# CodeTier — checklist até a publicação na Google Play

Levantado em **04/08/2026** cruzando o estado real do repo com as regras vigentes
da Play Console (fontes oficiais consultadas na data; os itens marcados
`a confirmar` são os que **não** achei afirmados em página oficial).

**Legenda de dono:** 🧑 só você pode (conta, pagamento, identidade, login) ·
🤖 eu faço (código, docs, artes, build) · 👥 os dois.

---

## Fase 0 — a decisão que define o cronograma

### 🧑 Escolher o tipo de conta: **organização** ou **pessoal**

Não dá para adiar nem para "criar pessoal só para testar": o tipo não é trivial
de trocar depois.

| | Organização (neoscienzatechnology) | Pessoal |
|---|---|---|
| Espera antes de publicar | **D-U-N-S: até 30 dias** (Google) | nenhuma |
| Teste fechado obrigatório | **não se aplica** | **12 testadores por 14 dias corridos** |
| Documentos | D-U-N-S + identidade + documento da empresa + **site público da empresa** | só identidade |
| Caminho até produção | teste interno → produção | teste interno → fechado (14 dias) → pedir produção (até +7 dias) |

A regra dos 12 testadores continua em vigor em 2026 e vale **só para contas
pessoais criadas depois de 13/11/2023** — a página oficial se chama literalmente
"App testing requirements for new personal developer accounts". A isenção da
conta de organização é por **ausência** na norma, não por afirmação expressa do
Google: trate como `a confirmar` no painel depois de criar a conta.

Qual é mais rápido depende do D-U-N-S: se a neoscienzatechnology já estiver na
base da Dun & Bradstreet, sai em dias e a organização ganha; se levar os 30 dias,
o caminho pessoal (≈21 dias) chega antes. **Peça o D-U-N-S hoje — é grátis e não
compromete nada** — e decida quando souber o prazo real.

- 🧑 Pedir o D-U-N-S (grátis) na Dun & Bradstreet
- 🧑 Pagar **US$ 25**, taxa **única** (não é anuidade). Cartão de crédito
  internacional; **pré-pago não é aceito**. Se o nome do cartão/documento não
  bater com o nome legal, a taxa **não é reembolsada**.
- 🧑 Concluir a verificação de identidade (organização = 3 comprovações)

### 🧑 Definir `VITE_SUPPORT_EMAIL`

Bloqueia produção e é assado no build: `npm run android:bundle` roda o `vite build`
antes do Gradle, então **sem o e-mail o app sobe com o botão de excluir conta
desabilitado** — e app com login sem caminho de exclusão é recusa certa.

### 👥 Decidir se a v1 sai **sem** monetização

Recomendo que sim: nada de assinatura ou anúncio é pré-requisito para publicar, e
ligar isso agora acrescenta conta AdMob, produtos na Play, RevenueCat e mais
declarações. Tudo já está implementado e dormente atrás dos flags.

---

## Fase 1 — o que eu conserto antes de gerar o AAB (🤖)

Ordenado por gravidade.

1. **`docs/PUBLICAR-PLAYSTORE.md` manda gerar uma chave NOVA.** Seguir o passo 3
   do guia criaria uma segunda keystore. A chave de upload real já existe
   (`~/.capycode/capycode-upload-key.jks`, alias `capycode-upload`, RSA 4096,
   válida até 2053 — a Play exige validade até pelo menos 2033). Usar outra
   depois do primeiro envio = AAB recusado.
2. **Apagar o `app-release.aab` do disco.** É de 15/05 e foi construído **antes do
   rebrand**: o pacote dentro dele é `com.capycode.app`. Subir esse arquivo
   criaria o app na Play com o id errado — e `applicationId` é permanente.
3. **Fechar a divergência de identificador nos docs.** O valor certo é
   `applicationId = com.codetier.app`; `com.capycode.app` é só o *namespace*
   interno (pacote Java), invisível para o usuário. Três documentos afirmam o
   contrário.
4. **Permissão `AD_ID` no manifest com anúncios desligados.** Ela obriga a
   declarar ID de publicidade no Data Safety, contradizendo o "sem anúncios" da
   ficha. Ou sai do manifest agora, ou a declaração muda.
5. **Política de privacidade incompleta:** não diz que o **código digitado sobe
   para a nuvem**, nem que a página pública de certificado **expõe o nome na
   URL**. Ambos são coleta/exposição real e precisam estar escritos.
6. **Ícone 512 reexportado** como PNG 32-bit com alpha; **screenshots** sem o
   usuário de teste "QA Capy" na tela, sem cabeçalho duplicado e sem corte.
7. **Ficha da loja:** existem duas versões de texto (escolher uma), um parágrafo
   "CODETIER PRO" que promete o que está desligado, menção a um mascote que não
   existe e um "funciona offline" forte demais.
8. **Tela grande:** em `targetSdk 36` o app não pode mais travar orientação nem
   redimensionamento — precisa ser verificado em tablet.
9. `versionCode`: mantém **1** no primeiro envio; **+1 a cada AAB enviado**,
   inclusive em teste interno. Não há automação: é edição manual no
   `android/app/build.gradle`.

✅ **Já resolvido hoje:** o `build.gradle` procurava a keystore só em
`~/.codetier` e `android/`, não achava nada, e o release sairia **sem
assinatura**. Corrigido para incluir `~/.capycode` e imprimir qual arquivo usou.

---

## Fase 2 — gerar e validar o pacote (👥)

- 🧑 **Backup offline da `.jks` e das senhas**, em dois lugares. Ela existe em um
  único lugar hoje e não pode ir para o git. Perder = só recuperando com o
  suporte da Play (dias), e apenas se o Play App Signing estiver ativo.
- 🤖 `npm run android:bundle` e conferir no log qual `key.properties` foi usado
- 🤖 `jarsigner -verify` no AAB novo e confirmar `com.codetier.app` no manifest
- 🤖 Rerodar `:app:lintRelease` (não roda desde antes do rebrand)
- 👥 Testar em aparelho real: login/volta do OAuth dentro do WebView, editor com
  teclado aberto, sem rolagem lateral entre 360 e 430px

> Não consegui rodar o Gradle neste ambiente (o daemon não abre socket local), então
> esta fase roda na sua máquina ou eu rodo com você acompanhando.

---

## Fase 3 — criar o app e a ficha (👥)

- 🧑 Criar o app: categoria **Educação**, pt-BR, gratuito
- 🧑 Ativar **Play App Signing** no primeiro upload (obrigatório para AAB novo) e
  guardar o fingerprint SHA-256 que a Console mostrar
- 🤖 Ficha: título, descrição curta (80) e completa (4000) — os textos atuais
  estão dentro dos limites
- 🤖 Ícone 512², feature graphic 1024×500, screenshots de celular (7 prontos)
- 🤖 **Screenshots de tablet 7" e 10"** — faltam, e sem eles a loja restringe a
  visibilidade em telas grandes
- 🧑 Política de privacidade: `https://codetier.vercel.app/privacidade`
- 🧑 Vídeo promocional: opcional, decidir se vale agora

---

## Fase 4 — declarações do App content (🧑, com meu apoio)

Todas obrigatórias. Duas são recentes e **bloqueiam atualização** se ficarem em
branco:

- **Financial features** — marcar "não tem" (em vigor desde 30/10/2025)
- **Health apps** — marcar "não tem" (obrigatória desde 31/08/2024)
- **Anúncios** — declarar **antes** das outras seções (muda o que elas perguntam)
- **App access** — criar uma conta de teste para o revisor. O `/experimentar`
  aberto ajuda, mas o revisor precisa ver o conteúdo protegido
- **Target audience and content** — manter **16+/18+**. Marcar faixa infantil
  puxa o app para a Families Policy, que exige trocar o stack de anúncios
- **Classificação indicativa** — questionário IARC (ClassInd no Brasil)
- **Data safety** — coleta (não compartilhamento) de e-mail, nome, id de usuário
  e atividade no app; e a seção **Data deletion** aponta para `/excluir-conta`
- News apps = não; COVID-19 = não; Government apps = `a confirmar` se aparece

---

## Fase 5 — testar e publicar (👥)

1. Subir o AAB em **teste interno** (revisão: de horas a 7 dias)
2. Se a conta for **pessoal**: teste fechado, 12 testadores opt-in por **14 dias
   corridos** — convidado que não instalou **não conta**, e o formulário de
   produção pergunta como você recrutou e que feedback recebeu (resposta fraca é
   motivo de recusa e reinicia a espera)
3. Promover para **produção** e enviar para revisão (até 7 dias, sem SLA)

---

## Prazos de terceiros (o que não dá para acelerar)

| Item | Espera |
|---|---|
| D-U-N-S (só organização) | até 30 dias |
| Verificação de identidade | "alguns dias"; forma de pagamento até 5 |
| Teste fechado (só conta pessoal) | 14 dias corridos |
| Revisão do pedido de produção | até 7 dias |
| Revisão de app novo | até 7 dias, podendo passar |

**Data dura a confirmar:** a verificação de desenvolvedor Android tem prazo
**30/09/2026** e o Brasil está na primeira leva — cerca de 8 semanas a partir de
hoje. Confirmar no painel se e como se aplica a este app.

✅ `targetSdkVersion 36` já cumpre a exigência de 31/08/2026.

---

## Depois de publicar: ligar a monetização (opcional)

Nada aqui bloqueia a v1. A ordem, quando for a hora: criar as assinaturas na Play
(exige um AAB já numa trilha de teste) → service account e notificações em tempo
real no RevenueCat → conta AdMob com ad units reais + `app-ads.txt` → trocar o
**AdMob App ID de teste** que hoje está no `strings.xml` → atualizar Data Safety
(histórico de compras, ID de publicidade), marcar "Contém anúncios" e revisar a
política de privacidade. Detalhes em [`MONETIZACAO.md`](./MONETIZACAO.md).

O RevenueCat instalado já atende à Play Billing Library 8 (exigida a partir de
31/08/2026). Cobrança alternativa fora do Play ainda não vale para o Brasil.

---

## QA mobile mínimo (antes do teste interno)

Cadastro · login · recuperação de senha · onboarding · lista de cursos · trilha
Fundamentos · aula em etapas · exercício com editor e teclado aberto · revisão
diária · pontos fracos · projetos · perfil · privacidade/termos/excluir conta ·
navegação inferior em telas pequenas · sem rolagem lateral de 360px a 430px.
