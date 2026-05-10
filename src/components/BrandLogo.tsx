import { cn } from "@/lib/utils";

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

const BrandLogo = ({ compact = false, className }: BrandLogoProps) => {
  return (
    <img
      src={compact ? "/capycode-mark.png" : "/capycode-logo.png"}
      alt="CapyCode"
      className={cn("block object-contain", compact ? "h-10 w-10" : "h-10 w-auto", className)}
    />
  );
};

export default BrandLogo;
