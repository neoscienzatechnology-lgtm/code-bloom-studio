# CodeTier - rascunho de Data Safety

Este documento prepara as respostas para a seção Data Safety da Play Console. Revise antes de enviar, porque a declaração final precisa refletir o ambiente real de produção, SDKs ativos e provedores configurados.

## Respostas gerais

| Pergunta | Resposta sugerida |
| --- | --- |
| O app coleta ou compartilha dados de usuário? | Sim, coleta dados necessários para conta, progresso e personalização do aprendizado. |
| O app compartilha dados com terceiros? | Não declarar como compartilhamento quando o envio for apenas para provedores de infraestrutura que processam dados em nome do app. Confirmar contratos/provedores antes do envio. |
| Os dados são criptografados em trânsito? | Sim, o app usa HTTPS/Supabase e o Android está com `usesCleartextTraffic=false`. |
| O usuário pode solicitar exclusão dos dados? | Parcialmente pronto: a página `/excluir-conta` existe, mas o build de produção precisa de `VITE_SUPPORT_EMAIL` ou formulário oficial conectado. |
| O app segue a política para famílias/crianças? | Não marcar como direcionado a crianças sem revisão específica de Families Policy. |
| O app usa anúncios? | Não. |
| O app usa compras no app? | Não. |
| O app coleta localização? | Não. |
| O app coleta contatos, fotos, áudio, calendário ou SMS? | Não. |

## Dados coletados

| Categoria Google Play | Tipo | Coletado? | Obrigatório? | Finalidade | Observação |
| --- | --- | --- | --- | --- | --- |
| Informações pessoais | Endereço de e-mail | Sim | Obrigatório para login/cadastro | Funcionalidade do app, gerenciamento de conta | Usado pelo Supabase Auth. |
| Informações pessoais | Nome | Sim, se informado | Opcional | Personalização, gerenciamento de conta | Pode vir de `display_name` no perfil. |
| Informações pessoais | IDs de usuário | Sim | Obrigatório com login | Funcionalidade, segurança, gerenciamento de conta | `user_id` do Supabase vincula progresso à conta. |
| Atividade no app | Interações no app | Sim | Obrigatório para progresso | Funcionalidade, personalização | Aulas concluídas, XP, sequência, checkpoints, revisões e conquistas. |
| Atividade no app | Outro conteúdo gerado pelo usuário | Sim | Opcional/condicional | Funcionalidade, personalização | Código digitado pelo aluno pode ser salvo localmente e sincronizado em `user_progress.code` quando logado. |
| Atividade no app | Outras ações | Sim | Obrigatório para progresso | Funcionalidade, personalização | Tentativas, pontos fracos e domínio de conceitos. |

## Dados locais

O app usa `localStorage` para manter progresso, perfil de aprendizado, tentativas, código salvo e domínio de conceitos no dispositivo. Dados processados somente no dispositivo não entram como coleta no Data Safety, mas devem ser explicados na política de privacidade.

## Provedores e SDKs relevantes

- Supabase: autenticação, sessão e tabelas de progresso.
- Lovable Auth: integração de autenticação com Supabase.
- Capacitor Android: empacotamento Android.
- Vercel ou hospedagem web equivalente: entrega do app web e páginas públicas.

Não há SDK de anúncios, Firebase Analytics, localização, pagamentos, contatos ou mídia no estado atual do código.

## Exclusão de dados

Status antes de produção:

- Rota pública criada em `/excluir-conta`.
- Definir `VITE_SUPPORT_EMAIL` com o e-mail oficial de suporte ou conectar um formulário real.
- Explicar prazo de atendimento e quais dados serão apagados.
- Se possível, criar função backend segura para excluir dados de `user_progress`, `user_concept_mastery` e conta de autenticação.
- Inserir esse link na Play Console em Data Safety/Data deletion.

Sem canal real de envio, o app ainda pode ficar bloqueado na revisão por permitir criação de conta sem solicitação efetiva de exclusão.

## Declarações que não devem ser marcadas sem evidência

- Não declarar que o app não coleta dados, porque login e progresso sincronizado coletam dados.
- Não declarar certificado, auditoria de segurança independente ou conformidade Families sem revisão real.
- Não declarar que dados são anonimizados quando estão vinculados a `user_id`.
- Não declarar anúncios, pagamentos ou localização se essas funções não foram adicionadas.
