import { Link } from "react-router-dom";
import { ArrowLeft, BookOpenCheck, FileText, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const updatedAt = "15 de maio de 2026";

const TermsPage = () => {
  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-8 sm:px-6 md:pb-12">
      <article className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 rounded-full px-3">
          <Link to="/">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para o CodeTier
          </Link>
        </Button>

        <header className="mb-8 rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-background to-primary/10 p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <FileText size={24} />
          </div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Termos de uso
          </p>
          <h1 className="text-3xl font-black text-foreground sm:text-4xl">
            Regras para usar o CodeTier
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Estes termos explicam o uso educacional do CodeTier, seus limites e os cuidados esperados
            ao estudar, criar uma conta e praticar com os exercícios do app.
          </p>
          <p className="mt-4 text-xs font-bold text-muted-foreground">Última atualização: {updatedAt}</p>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <BookOpenCheck className="mb-3 text-primary" size={22} aria-hidden="true" />
            <h2 className="mb-2 text-base font-black text-foreground">Uso educacional</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O CodeTier ensina programação por aulas, missões, quizzes, prática guiada e projetos
              progressivos. O conteúdo não substitui acompanhamento profissional ou certificações
              oficiais.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <ShieldAlert className="mb-3 text-primary" size={22} aria-hidden="true" />
            <h2 className="mb-2 text-base font-black text-foreground">Cuidado com dados pessoais</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Não coloque senhas, documentos, telefones, endereços ou informações sensíveis nos campos
              de código, quizzes ou projetos.
            </p>
          </div>
        </section>

        <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">1. Aceitação dos termos</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ao usar o CodeTier, você concorda com estes termos e com a política de privacidade do
              app. Se não concordar, não utilize a plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">2. Conta do usuário</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Algumas funções podem exigir cadastro ou login para salvar e sincronizar progresso. Você
              é responsável por manter suas credenciais seguras e por não compartilhar acesso de forma
              indevida.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">3. Conteúdo e progresso</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              XP, sequência de estudos, conquistas, pontos fracos e progresso são recursos de apoio ao
              aprendizado. Eles não têm valor financeiro e podem ser ajustados conforme o produto evolui.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">4. Exercícios, projetos e código</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O app pode pedir que você escreva, complete ou analise código. Esse material deve ser usado
              para estudo. Evite inserir dados pessoais, segredos de API, credenciais ou conteúdo de
              terceiros sem autorização.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">5. Uso permitido</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Você não deve tentar invadir, copiar indevidamente, prejudicar, automatizar abuso, burlar
              limitações técnicas ou usar o CodeTier de modo que comprometa outros usuários, a
              infraestrutura ou a experiência educacional.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">6. Disponibilidade do app</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O CodeTier pode passar por manutenção, mudanças de conteúdo, melhorias de interface e
              ajustes técnicos. Faremos esforços razoáveis para manter o serviço estável, mas não
              garantimos disponibilidade contínua.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">7. Serviços de terceiros</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A plataforma pode depender de serviços externos para autenticação, banco de dados,
              hospedagem, distribuição e análise técnica. O uso desses serviços segue também as regras e
              políticas dos respectivos provedores.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">8. Limites do conteúdo educacional</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O CodeTier ajuda na aprendizagem, mas não promete emprego, aprovação em processos seletivos,
              certificação oficial ou domínio completo de uma tecnologia apenas pelo uso do app.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">9. Contato e suporte</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Dúvidas, solicitações e pedidos relacionados à conta devem ser enviados pelos canais
              oficiais informados no site, na página do app ou na loja em que o CodeTier estiver
              disponível. Solicitações de remoção de dados podem começar pela página de{" "}
              <Link to="/excluir-conta" className="font-black text-primary hover:underline">
                exclusão de conta
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">10. Alterações nos termos</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Estes termos podem ser atualizados conforme o produto evoluir. A versão vigente será
              publicada nesta página com a data de atualização.
            </p>
          </section>

          <div className="rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
            Leia também a{" "}
            <Link to="/privacidade" className="font-black text-primary hover:underline">
              política de privacidade
            </Link>
            {" "}e a página de{" "}
            <Link to="/excluir-conta" className="font-black text-primary hover:underline">
              exclusão de conta
            </Link>
            .
          </div>
        </div>
      </article>
    </main>
  );
};

export default TermsPage;
