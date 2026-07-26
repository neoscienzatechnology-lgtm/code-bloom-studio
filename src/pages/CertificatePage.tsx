import { useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useAugmentedCourse } from "@/hooks/useAugmentedCourse";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import CertificateArt from "@/components/CertificateArt";
import {
  certificatePath,
  courseCompletionDate,
  formatCertificateDate,
  isCourseComplete,
  toCertificateDateKey,
} from "@/utils/certificate";
import { track } from "@/lib/analytics";

const CertificatePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, loading } = useAugmentedCourse(courseId);
  const { completedLessons, lessonCompletedAt } = useProgress();
  const { user } = useAuth();
  const svgRef = useRef<SVGSVGElement>(null);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-busy="true">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="sr-only">Carregando o certificado…</span>
      </div>
    );
  }
  if (!course) return <Navigate to="/cursos" replace />;

  const lessonIds = course.lessons.map((lesson) => lesson.id);
  if (!isCourseComplete(lessonIds, completedLessons)) {
    return <Navigate to={`/cursos/${course.id}`} replace />;
  }

  const name = (user?.user_metadata?.display_name as string | undefined)?.trim() || "Estudante CodeTier";
  const completedOn = courseCompletionDate(lessonIds, lessonCompletedAt) ?? new Date();
  const dateText = formatCertificateDate(completedOn);
  // Link que outra pessoa consegue abrir (esta rota exige login). #revisao-lote10
  const publicUrl = `${window.location.origin}${certificatePath(course.id, name, toCertificateDateKey(completedOn))}`;

  const downloadPng = async () => {
    const svg = svgRef.current;
    if (!svg) return;
    try {
      await document.fonts.ready;
    } catch {
      /* segue sem esperar a fonte */
    }
    const xml = new XMLSerializer().serializeToString(svg);
    const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
    const fail = () => {
      setShareMsg("Não consegui gerar a imagem. Tente de novo.");
      setTimeout(() => setShareMsg(null), 2500);
    };
    const img = new Image();
    img.onerror = fail;
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = 1200 * scale;
      canvas.height = 850 * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return fail();
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, 1200, 850);
      canvas.toBlob((blob) => {
        if (!blob) return fail();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `certificado-codetier-${course.id}.png`;
        link.click();
        // Revoga depois para não cancelar um download que ainda vai começar.
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, "image/png");
    };
    img.src = src;
  };

  const share = async () => {
    const text = `Concluí a trilha ${course.title} no CodeTier! 🎓`;
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title: "Certificado CodeTier", text, url: publicUrl });
        track("certificate_shared", { courseId: course.id, via: "share" });
        return;
      } catch {
        /* usuário cancelou — cai no copiar */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${publicUrl}`);
      track("certificate_shared", { courseId: course.id, via: "clipboard" });
      setShareMsg("Link copiado!");
      setTimeout(() => setShareMsg(null), 2000);
    } catch {
      setShareMsg("Não consegui copiar o link.");
      setTimeout(() => setShareMsg(null), 2000);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link to={`/cursos/${course.id}`} className="mb-5 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Voltar à trilha
        </Link>

        <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
          <CertificateArt
            ref={svgRef}
            name={name}
            courseTitle={course.title}
            lessonCount={course.lessons.length}
            language={course.language}
            dateText={dateText}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={downloadPng} className="gap-2 rounded-full px-6 font-black">
            <Download size={16} /> Baixar certificado
          </Button>
          <Button onClick={share} variant="secondary" className="gap-2 rounded-full font-black">
            <Share2 size={16} /> Compartilhar
          </Button>
          {shareMsg && <span className="text-sm font-bold text-primary">{shareMsg}</span>}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          O link compartilhado abre uma página pública com seu nome, a trilha e a data — sem login e sem
          nenhum dado da sua conta.
        </p>
      </div>
    </div>
  );
};

export default CertificatePage;
