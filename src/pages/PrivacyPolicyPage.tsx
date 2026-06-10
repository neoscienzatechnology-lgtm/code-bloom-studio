import { Link } from "react-router-dom";
import { ArrowLeft, Database, Lock, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const updatedAt = "15 de maio de 2026";

const dataCategories = [
  {
    icon: UserCheck,
    title: "Conta e acesso",
    description:
      "Quando você cria uma conta, podemos armazenar e-mail, nome exibido e dados necessários para autenticação.",
  },
  {
    icon: Database,
    title: "Progresso de aprendizagem",
    description:
      "Guardamos aulas concluídas, XP, sequência de estudo, respostas, pontos fracos, domínio de conceitos e projetos iniciados.",
  },
  {
    icon: Lock,
    title: "Dados locais do app",
    description:
      "Parte do progresso pode ficar salva no próprio dispositivo para manter a experiência funcionando mesmo antes do login.",
  },
];

const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-8 sm:px-6 md:pb-12">
      <article className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 rounded-full px-3">
          <Link to="/">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para o CapyCode
          </Link>
        </Button>

        <header className="mb-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck size={24} />
          </div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Política de privacidade
          </p>
          <h1 className="text-3xl font-black text-foreground sm:text-4xl">
            Como o CapyCode cuida dos seus dados
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Esta política explica quais informações podem ser usadas pelo CapyCode para salvar seu
            progresso, personalizar revisões e manter a plataforma funcionando com segurança.
          </p>
          <p className="mt-4 text-xs font-bold text-muted-foreground">Última atualização: {updatedAt}</p>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          {dataCategories.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                <Icon className="mb-3 text-primary" size={22} aria-hidden="true" />
                <h2 className="mb-2 text-base font-black text-foreground">{item.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </section>

        <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">1. Quem opera o app</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O CapyCode é uma plataforma educacional da Code Bloom Studio. O app ajuda estudantes a
              aprender programação por trilhas, missões, exercícios, revisões e acompanhamento de
              progresso.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">2. Quais dados podem ser coletados</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Podemos tratar dados de conta, autenticação, progresso nas aulas, XP, sequência de
              estudos, tentativas em quizzes, pontos fracos, atividades concluídas, preferências de
              aprendizado e informações técnicas necessárias para manter o app estável e seguro.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">3. Como usamos essas informações</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Usamos os dados para permitir login, sincronizar progresso entre web e Android, indicar a
              próxima aula, montar revisões dos conceitos que precisam de reforço, liberar conquistas,
              corrigir problemas técnicos e melhorar a experiência educacional do produto.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">4. Armazenamento local e sincronização</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O app pode salvar progresso no próprio dispositivo. Ao entrar com uma conta, parte desse
              progresso pode ser sincronizada com os serviços de infraestrutura usados pelo CapyCode,
              como autenticação, banco de dados e hospedagem.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">5. Compartilhamento com terceiros</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Não vendemos dados pessoais. Alguns provedores técnicos, como serviços de autenticação,
              banco de dados, hospedagem e distribuição pela loja de aplicativos, podem processar dados
              apenas para operar e proteger o app.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No aplicativo Android, podemos exibir anúncios fornecidos pelo Google AdMob. Nesse caso,
              o Google pode coletar o identificador de publicidade do dispositivo para veicular e medir
              anúncios, conforme a{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-primary hover:underline"
              >
                política de privacidade do Google
              </a>
              . Quando exigido pela legislação aplicável, solicitamos o seu consentimento antes de
              exibir anúncios personalizados, e você pode recusá-los. A versão web do CapyCode não
              exibe anúncios.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">6. Dados de menores de idade</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O CapyCode é voltado ao aprendizado de iniciantes. Estudantes menores de idade devem usar
              o app com orientação de responsáveis. Não solicitamos dados sensíveis nos exercícios e
              recomendamos não inserir informações pessoais no editor de código.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">7. Seus direitos e exclusão de dados</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Você pode solicitar acesso, correção ou exclusão dos dados vinculados à sua conta pela
              página pública de{" "}
              <Link to="/excluir-conta" className="font-black text-primary hover:underline">
                exclusão de conta
              </Link>
              . O canal de suporte precisa estar configurado no ambiente de produção antes da publicação
              do app na loja.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">8. Segurança</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Aplicamos medidas razoáveis para proteger as informações usadas pelo app. Nenhum sistema é
              totalmente imune a falhas, por isso mantemos a coleta limitada ao que é necessário para a
              experiência educacional.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">9. Mudanças nesta política</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Esta política pode ser atualizada conforme o CapyCode evoluir. Quando houver mudanças
              relevantes, a data de atualização será alterada nesta página.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
};

export default PrivacyPolicyPage;
