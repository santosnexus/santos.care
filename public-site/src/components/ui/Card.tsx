import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className, hover = false, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-card shadow-card border border-gray-100/50",
        hover && "hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
