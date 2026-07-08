"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  label,
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, end, duration]);

  return (
    <div ref={ref} className={cn("text-center", className)}>
      <div className="text-4xl md:text-5xl font-bold text-brand-600 tabular-nums">
        {prefix}
        {count.toFixed(decimals)}{suffix}
      </div>
      {label && <div className="text-sm text-ink-muted mt-1">{label}</div>}
    </div>
  );
}
