"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  scrolled?: boolean;
}

export function ThemeToggle({ className, scrolled = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Avoid hydration mismatch: render a placeholder until mounted
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const iconColor = scrolled
    ? "text-ink hover:text-brand-600"
    : "text-white/90 hover:text-white";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className={cn(
        "relative inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        iconColor,
        className
      )}
    >
      <Sun
        className={cn(
          "w-5 h-5 transition-all duration-300",
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "absolute w-5 h-5 transition-all duration-300",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        )}
      />
    </button>
  );
}
