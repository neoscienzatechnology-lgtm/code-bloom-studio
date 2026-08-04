import { Link } from "react-router-dom";
import { ArrowLeft, Code2, Database, Lock, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL, hasSupportEmail } from "@/config/support";

const updatedAt = "4 de agosto de 2026";

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
  {
    icon: Code2,
    title: "Código dos exercícios",
    description:
      "O que você escreve no editor é salvo junto com o progresso, para você retomar a lição de outro aparelho. Não escreva senhas nem dados pessoais ali.",
  },
];

const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-8 sm:px-6 md:pb-12">
      <article className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 rounded-full px-3">
          <Link to="/">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para o CodeTier
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
            Como o CodeTier cuida dos seus dados
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Esta política explica quais informações podem ser usadas pelo CodeTier para salvar seu
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
              O CodeTier é uma plataforma educacional da Code Bloom Studio. O app ajuda estudantes a
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
              progresso pode ser sincronizada com os serviços de infraestrutura usados pelo CodeTier,
              como autenticação, banco de dados e hospedagem.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Isso inclui o código que você escreve nos exercícios.</strong>{" "}
              Para você retomar uma lição de outro aparelho, o conteúdo do editor é salvo na sua conta
              junto com o progresso. Por isso, não escreva senhas nem dados pessoais dentro dos
              exercícios.
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
              Para melhorar o app, podemos coletar eventos de uso pseudonimizados (telas visitadas,
              progresso nas lições e erros técnicos) por meio do PostHog. Esses eventos são vinculados
              apenas ao identificador interno da sua conta — não incluem nome, e-mail nem o conteúdo do
              código que você escreve. Não usamos gravação de sessão.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Esta versão do CodeTier não exibe anúncios</strong> e
              não coleta identificador de publicidade — nem na web, nem no app Android. Se um dia
              passarmos a exibir anúncios pelo Google AdMob, atualizaremos esta política antes, e o
              Google poderá coletar o identificador de publicidade do dispositivo para veicular e medir
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
              exibir anúncios personalizados, e você pode recusá-los. A versão web do CodeTier não
              exibe anúncios.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">6. Certificado público</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ao concluir uma trilha, você pode compartilhar um certificado. O link gerado abre uma
              página <strong className="text-foreground">pública</strong> — sem login — que mostra o
              nome exibido na sua conta, o curso e a data de conclusão.{" "}
              <strong className="text-foreground">Seu nome aparece dentro do próprio endereço</strong>,
              então quem receber o link vê essa informação. Nada mais da sua conta vai nessa página, e
              o compartilhamento só acontece se você tocar em compartilhar.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">7. Dados de menores de idade</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O CodeTier é voltado ao aprendizado de iniciantes. Estudantes menores de idade devem usar
              o app com orientação de responsáveis. Não solicitamos dados sensíveis nos exercícios e
              recomendamos não inserir informações pessoais no editor de código.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">8. Seus direitos e exclusão de dados</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Você pode solicitar acesso, correção ou exclusão dos dados vinculados à sua conta pela
              página pública de{" "}
              <Link to="/excluir-conta" className="font-black text-primary hover:underline">
                exclusão de conta
              </Link>
              , dentro ou fora do app. A exclusão apaga a conta e os dados de aprendizagem ligados a
              ela — progresso, XP, sequência, respostas, código salvo nos exercícios e conquistas.
              Respondemos em até 30 dias.
            </p>
            {hasSupportEmail && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Dúvidas sobre privacidade e pedidos de dados:{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="font-black text-primary hover:underline">
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">9. Segurança</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Aplicamos medidas razoáveis para proteger as informações usadas pelo app. Nenhum sistema é
              totalmente imune a falhas, por isso mantemos a coleta limitada ao que é necessário para a
              experiência educacional.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-foreground">10. Mudanças nesta política</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Esta política pode ser atualizada conforme o CodeTier evoluir. Quando houver mudanças
              relevantes, a data de atualização será alterada nesta página.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
};

export default PrivacyPolicyPage;
