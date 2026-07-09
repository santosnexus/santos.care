import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  surface?: "white" | "soft" | "warm";
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-5",
  md: "p-7",
  lg: "p-9",
};

const surfaces = {
  white: "bg-surface border-surface-muted dark:border-white/10",
  soft: "bg-surface-soft border-transparent",
  warm: "bg-surface-warm border-transparent",
};

export function Card({ children, className, hover = false, surface = "white", padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border shadow-card",
        surfaces[surface],
        hover && "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-brand-200",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
