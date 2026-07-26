import { forwardRef } from "react";

// A arte do certificado, usada em duas telas: a do próprio aluno
// (/certificado/:courseId, que confere a conclusão) e a página pública de
// compartilhamento (/c/:courseId/:nome). Ficar num lugar só garante que o
// que o aluno vê é exatamente o que o amigo dele abre. #revisao-lote10

export interface CertificateArtProps {
  name: string;
  courseTitle: string;
  lessonCount: number;
  language: string;
  /** Já formatada em pt-BR; ausente esconde a data (melhor que mostrar errada). */
  dateText?: string | null;
}

const CertificateArt = forwardRef<SVGSVGElement, CertificateArtProps>(
  ({ name, courseTitle, lessonCount, language, dateText }, ref) => {
    const footer = [dateText ? `Concluído em ${dateText}` : null, `${lessonCount} lições`, language]
      .filter(Boolean)
      .join(" · ");

    return (
      <svg
        ref={ref}
        viewBox="0 0 1200 850"
        className="h-auto w-full"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Certificado de conclusão da trilha ${courseTitle} para ${name}`}
      >
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
        <text x="600" y="585" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="40" fontWeight="700" fill="#1F8A3A">{courseTitle}</text>

        <g transform="translate(600,680)">
          <circle cx="0" cy="0" r="46" fill="#44D62C" />
          <path d="M-20 0 L-7 14 L22 -16" fill="none" stroke="#0A2A06" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <text x="600" y="775" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="20" fill="#5B6571">{footer}</text>
      </svg>
    );
  },
);
CertificateArt.displayName = "CertificateArt";

export default CertificateArt;
