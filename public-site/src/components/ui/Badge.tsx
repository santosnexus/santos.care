import { cn } from "@/lib/utils";

const variants = {
  default: "bg-brand-100 text-brand-700",
  savings: "bg-savings-light text-savings",
  accent: "bg-accent-50 text-accent-600",
  success: "bg-savings-light text-savings",
  warning: "bg-amber-100 text-amber-700",
  neutral: "bg-surface-muted text-ink-muted",
  outline: "bg-transparent border border-surface-muted text-ink-muted",
  white: "bg-white/20 text-white backdrop-blur",
};

const sizes = {
  sm: "px-1.5 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}

export function Badge({ children, variant = "default", size = "md", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-pill",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
