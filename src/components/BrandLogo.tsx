import { cn } from "@/lib/utils";

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

const ACCENT = "#17B0A0";

/** Monograma "cc" reduzido a um par de colchetes — referência de código,
 * sem personagem. A parte em currentColor acompanha o tema; o acento é teal. */
const Mark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
    <path d="M31 14 C16 26 16 38 31 50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M35 14 C49 26 49 38 35 50" stroke={ACCENT} strokeWidth="7" strokeLinecap="round" />
  </svg>
);

const BrandLogo = ({ compact = false, className }: BrandLogoProps) => {
  if (compact) {
    return <Mark className={cn("h-10 w-10 text-foreground", className)} />;
  }

  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <Mark className="h-9 w-9" />
      <span
        className="text-2xl font-bold lowercase leading-none"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", letterSpacing: "-0.04em" }}
      >
        capycode
      </span>
    </span>
  );
};

export default BrandLogo;
