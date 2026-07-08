import { cn } from "@/lib/utils";

type SectionVariant = "default" | "soft" | "brand" | "dark" | "accent";

const variants: Record<SectionVariant, string> = {
  default: "bg-surface",
  soft: "bg-surface-soft",
  brand: "bg-brand-600",
  dark: "bg-brand-900",
  accent: "bg-accent-50",
};

interface SectionProps {
  children: React.ReactNode;
  variant?: SectionVariant;
  className?: string;
  id?: string;
  padding?: "sm" | "md" | "lg" | "xl" | "none";
}

const paddings = {
  none: "",
  sm: "py-12",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-28",
  xl: "py-24 md:py-36",
};

export function Section({
  children,
  variant = "default",
  className,
  id,
  padding = "md",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(variants[variant], paddings[padding], className)}
    >
      {children}
    </section>
  );
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
