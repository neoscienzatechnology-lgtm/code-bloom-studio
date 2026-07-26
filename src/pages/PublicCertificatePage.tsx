import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CertificateArt from "@/components/CertificateArt";
import { getCourseCatalogItem } from "@/data/courseCatalog";
import { certificateNameFromSlug, formatCertificateDate } from "@/utils/certificate";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { track } from "@/lib/analytics";
import { useEffect } from "react";

// Página pública do certificado: é ela que o aluno compartilha. Não pede
// login, não consulta o banco e não carrega o conteúdo dos cursos — o nome e a
// data vêm da própria URL e o resto do catálogo leve. Nenhum dado de conta
// aparece aqui. #revisao-lote10
//
// Uma observação honesta: como a URL descreve o certificado, ela NÃO é uma
// verificação — qualquer um pode digitar outro nome. Por isso a página se
// apresenta como o registro de uma conquista, e não como documento validável;
// o dia em que isso importar, o caminho é guardar os certificados emitidos.

const PublicCertificatePage = () => {
  const { courseId, slug } = useParams<{ courseId: string; slug: string }>();
  const [params] = useSearchParams();
  const course = getCourseCatalogItem(courseId ?? "");
  const name = certificateNameFromSlug(slug);

  const dateParam = params.get("d");
  const dateText =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
      ? formatCertificateDate(
          new Date(Number(dateParam.slice(0, 4)), Number(dateParam.slice(5, 7)) - 1, Number(dateParam.slice(8, 10))),
        )
      : null;

  useDocumentMeta({
    title: course ? `${name} concluiu ${course.title} — CodeTier` : "Certificado CodeTier",
    description: course
      ? `${name} concluiu a trilha ${course.title} (${course.lessonCount} lições) no CodeTier.`
      : undefined,
    // Certificado é de uma pessoa só: não deve competir com os cursos no índice.
    noIndex: true,
  });

  useEffect(() => {
    if (course) track("certificate_viewed", { courseId: course.id });
  }, [course]);

  if (!course) return <Navigate to="/cursos" replace />;

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
          <CertificateArt
            name={name}
            courseTitle={course.title}
            lessonCount={course.lessonCount}
            language={course.language}
            dateText={dateText}
          />
        </div>

        <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-6 text-center">
          <h1 className="text-2xl font-black text-foreground">
            Você também pode aprender {course.language}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            O CodeTier ensina programação com aulas curtas, código que roda de verdade e uma trilha guiada
            do zero ao projeto final. A primeira aula é aberta — sem cadastro.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="gap-2 rounded-full px-6 font-black">
              <Link to="/experimentar" onClick={() => track("certificate_cta", { courseId: course.id })}>
                Fazer uma aula grátis <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full font-black">
              <Link to={`/cursos/${course.id}`}>Ver a trilha {course.title}</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PublicCertificatePage;
