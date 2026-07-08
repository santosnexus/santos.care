"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm hover:shadow-card-hover",
  secondary:
    "bg-surface-soft text-ink hover:bg-surface-muted active:bg-gray-200 border border-gray-200",
  outline:
    "border-2 border-brand-600 text-brand-600 hover:bg-brand-50 active:bg-brand-100",
  ghost:
    "text-ink-muted hover:text-ink hover:bg-surface-soft active:bg-surface-muted",
  accent:
    "bg-accent text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm hover:shadow-float",
  savings:
    "bg-savings text-white hover:bg-green-700 active:bg-green-800 shadow-sm",
};

const sizes = {
  sm: "px-3 py-1.5 text-body-sm",
  md: "px-5 py-2.5 text-body-base",
  lg: "px-7 py-3.5 text-body-lg",
  xl: "px-8 py-4 text-body-lg",
};

type ButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "as">;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", as = "button", href, target, rel, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      variants[variant],
      sizes[size],
      className
    );

    if (as === "a" && href) {
      return (
        <a href={href} className={classes} target={target} rel={rel}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, variants, sizes };
export type { ButtonProps };
