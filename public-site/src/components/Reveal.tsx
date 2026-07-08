"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type AnimationVariant = "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "rotate";

interface RevealProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

const variantStyles: Record<AnimationVariant, string> = {
  "fade": "opacity-0",
  "slide-up": "opacity-0 translate-y-10",
  "slide-down": "opacity-0 -translate-y-10",
  "slide-left": "opacity-0 translate-x-10",
  "slide-right": "opacity-0 -translate-x-10",
  "scale": "opacity-0 scale-95",
  "rotate": "opacity-0 rotate-3",
};

const variantVisible: Record<AnimationVariant, string> = {
  "fade": "opacity-100",
  "slide-up": "opacity-100 translate-y-0",
  "slide-down": "opacity-100 translate-y-0",
  "slide-left": "opacity-100 translate-x-0",
  "slide-right": "opacity-100 translate-x-0",
  "scale": "opacity-100 scale-100",
  "rotate": "opacity-100 rotate-0",
};

export function Reveal({
  children,
  variant = "slide-up",
  delay = 0,
  duration = 700,
  className,
  threshold = 0.1,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold, once]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out will-change-transform",
        visible ? variantVisible[variant] : variantStyles[variant],
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

export function StaggerReveal({
  children,
  variant = "slide-up",
  staggerDelay = 100,
  threshold = 0.05,
  className,
}: {
  children: React.ReactNode[];
  variant?: AnimationVariant;
  staggerDelay?: number;
  threshold?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} variant={variant} delay={i * staggerDelay} threshold={threshold}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
