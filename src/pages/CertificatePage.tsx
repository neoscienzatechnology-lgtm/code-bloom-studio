import { useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { getAugmentedCourseById } from "@/data/checkpoints";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { isCourseComplete, courseCompletionDate, formatCertificateDate } from "@/utils/certificate";

const CertificatePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = getAugmentedCourseById(courseId || "");
  const { completedLessons, lessonCompletedAt } = useProgress();
  const { user } = useAuth();
  const svgRef = useRef<SVGSVGElement>(null);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  if (!course) return <Navigate to="/cursos" replace />;

  const lessonIds = course.lessons.map((lesson) => lesson.id);
  if (!isCourseComplete(lessonIds, completedLessons)) {
    return <Navigate to={`/cursos/${course.id}`} replace />;
  }

  const name = (user?.user_metadata?.display_name as string | undefined)?.trim() || "Estudante CodeTier";
  const dateText = formatCertificateDate(courseCompletionDate(lessonIds, lessonCompletedAt) ?? new Date());

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
    const url = window.location.href;
    const text = `Concluí a trilha ${course.title} no CodeTier! 🎓`;
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title: "Certificado CodeTier", text, url });
        return;
      } catch {
        /* usuário cancelou — cai no copiar */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
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
          <svg ref={svgRef} viewBox="0 0 1200 850" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Certificado de conclusão da trilha ${course.title} para ${name}`}>
            <rect width="1200" height="850" fill="#FBFBFB" />
            <rect x="28" y="28" width="1144" height="794" rx="18" fill="none" stroke="#242424" strokeWidth="3" />
            <rect x="28" y="28" width="1144" height="10" rx="5" fill="#44D62C" />

            <g transform="translate(600,150)">
              <path d="M-26 -28 C-46 -10 -46 10 -26 28" fill="none" stroke="#242424" strokeWidth="9" strokeLinecap="round" />
              <path d="M-18 -28 C2 -10 2 10 -18 28" fill="none" stroke="#44D62C" strokeWidth="9" strokeLinecap="round" />
              <text x="34" y="13" fontFamily="'Space Grotesk',sans-serif" fontSize="40" fontWeight="700" letterSpacing="-2" fill="#242424">CodeTier</text>
            </g>

            <text x="600" y="270" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="22" fontWeight="600" letterSpacing="6" fill="#1F8A3A">CERTIFICADO DE CONCLUSÃO</text>

            <text x="600" y="345" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="22" fill="#5B6571">Este certificado é concedido a</text>
            <text x="600" y="430" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="66" fontWeight="700" letterSpacing="-1" fill="#242424">{name}</text>
            <rect x="380" y="455" width="440" height="3" rx="1.5" fill="#E2E4E2" />

            <text x="600" y="525" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="22" fill="#5B6571">por concluir a trilha</text>
            <text x="600" y="585" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="40" fontWeight="700" fill="#1F8A3A">{course.title}</text>

            <g transform="translate(600,680)">
              <circle cx="0" cy="0" r="46" fill="#44D62C" />
              <path d="M-20 0 L-7 14 L22 -16" fill="none" stroke="#0A2A06" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            <text x="600" y="775" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="20" fill="#5B6571">Concluído em {dateText} · {course.lessons.length} lições · {course.language}</text>
          </svg>
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
      </div>
    </div>
  );
};

export default CertificatePage;
