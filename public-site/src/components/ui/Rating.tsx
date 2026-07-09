import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function Rating({ value, max = 5, size = "md", className }: RatingProps) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Rating: ${value} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizes[size],
            i < value ? "fill-rating text-rating" : "text-surface-muted fill-none"
          )}
        />
      ))}
    </span>
  );
}
