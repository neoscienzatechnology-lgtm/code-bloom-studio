import { useId } from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

/** Emblema CodeTier: hexágono em verde neon (gradiente), o símbolo de código
 * `</>` no tom do texto (currentColor — legível em claro/escuro) e três barras
 * ascendentes (os "tiers"). Sem personagem/mascote. */
const Mark = ({ className }: { className?: string }) => {
  const id = useId();
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4DE84A" />
          <stop offset="1" stopColor="#1C8F2A" />
        </linearGradient>
      </defs>
      <path
        d="M32 9 L51.9 20.5 L51.9 43.5 L32 55 L12.1 43.5 L12.1 20.5 Z"
        stroke={`url(#${id})`}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path
        d="M27 24 L22 29 L27 34 M30.5 35 L34.5 23 M37 24 L42 29 L37 34"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="#37D32C">
        <rect x="25" y="45" width="3.6" height="4" rx="1" />
        <rect x="30.2" y="42" width="3.6" height="7" rx="1" />
        <rect x="35.4" y="39" width="3.6" height="10" rx="1" />
      </g>
    </svg>
  );
};

const BrandLogo = ({ compact = false, className }: BrandLogoProps) => {
  if (compact) {
    return <Mark className={cn("h-10 w-10 text-foreground", className)} />;
  }

  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <Mark className="h-9 w-9" />
      <span
        className="text-2xl font-bold leading-none"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", letterSpacing: "-0.03em" }}
      >
        CodeTier
      </span>
    </span>
  );
};

export default BrandLogo;
