import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, Database, Mail, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SUPPORT_EMAIL,
  accountDeletionBody,
  accountDeletionMailto,
  hasSupportEmail,
} from "@/config/support";

const updatedAt = "15 de maio de 2026";

const deletedData = [
  "conta de acesso vinculada ao e-mail informado",
  "progresso de aulas, XP, sequência, conquistas e checkpoints",
  "domínio de conceitos, pontos fracos e histórico de revisão",
  "códigos, respostas e projetos salvos quando estiverem vinculados à conta",
];

const requestSteps = [
  {
    icon: Mail,
    title: "1. Envie a solicitação",
    description: hasSupportEmail
      ? `Use o botão abaixo ou escreva para ${SUPPORT_EMAIL} usando o e-mail da sua conta.`
      : "Defina o e-mail oficial de suporte antes de publicar o app na Play Store.",
  },
  {
    icon: CheckCircle2,
    title: "2. Confirme sua identidade",
    description:
      "Podemos pedir uma confirmação simples para evitar que outra pessoa apague sua conta sem autorização.",
  },
  {
    icon: Clock,
    title: "3. Aguarde o processamento",
    description:
      "Depois da confirmação, a exclusão deve ser processada conforme o prazo informado pelo suporte oficial.",
  },
];

const AccountDeletionPage = () => {
  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-8 sm:px-6 md:pb-12">
      <article className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 rounded-full px-3">
          <Link to="/perfil">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para o perfil
          </Link>
        </Button>

        <header className="mb-8 rounded-3xl border border-destructive/20 bg-gradient-to-br from-destructive/10 via-background to-accent/10 p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive text-destructive-foreground">
            <Trash2 size={24} aria-hidden="true" />
          </div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-destructive">
            Exclusão de conta
          </p>
          <h1 className="text-3xl font-black text-foreground sm:text-4xl">
            Solicite a exclusão da sua conta CodeTier
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Esta página explica como pedir a remoção dos dados vinculados à sua conta, incluindo
            progresso, XP, conquistas, respostas e registros de aprendizagem.
          </p>
          <p className="mt-4 text-xs font-bold text-muted-foreground">Última atualização: {updatedAt}</p>
        </header>

        {!hasSupportEmail && (
          <section className="mb-8 rounded-2xl border border-quest-yellow/30 bg-quest-yellow/10 p-5">
            <div className="flex gap-3">
              <ShieldAlert className="mt-0.5 shrink-0 text-quest-yellow" size={22} aria-hidden="true" />
              <div>
                <h2 className="mb-2 text-lg font-black text-foreground">Canal oficial pendente</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  O fluxo visual já está criado, mas a publicação na Play Store ainda precisa de um
                  e-mail ou formulário oficial. Configure `VITE_SUPPORT_EMAIL` no ambiente de build
                  para ativar o botão de solicitação por e-mail.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          {requestSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-2xl border border-border bg-card p-5">
                <Icon className="mb-3 text-primary" size={22} aria-hidden="true" />
                <h2 className="mb-2 text-base font-black text-foreground">{step.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </section>

        <section className="mb-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <Database className="text-primary" size={22} aria-hidden="true" />
            <h2 className="text-xl font-black text-foreground">Dados que podem ser excluídos</h2>
          </div>
          <ul className="space-y-3">
            {deletedData.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={17} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Dados que precisem ser mantidos por obrigação legal, segurança, prevenção de fraude ou
            resolução de conflitos podem ser retidos pelo período necessário. Dados salvos somente no
            dispositivo podem ser removidos limpando os dados do app ou desinstalando o CodeTier.
          </p>
        </section>

        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
          <h2 className="mb-3 text-xl font-black text-foreground">Enviar solicitação</h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Para acelerar o atendimento, envie a solicitação usando o mesmo e-mail cadastrado no app.
          </p>

          {hasSupportEmail ? (
            <Button asChild size="lg" className="rounded-full font-black">
              <a href={accountDeletionMailto}>
                Solicitar exclusão por e-mail <Mail size={18} className="ml-2" aria-hidden="true" />
              </a>
            </Button>
          ) : (
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="mb-3 text-sm font-bold text-foreground">
                Modelo de mensagem para conectar ao suporte oficial:
              </p>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
                {accountDeletionBody}
              </pre>
            </div>
          )}
        </section>
      </article>
    </main>
  );
};

export default AccountDeletionPage;
