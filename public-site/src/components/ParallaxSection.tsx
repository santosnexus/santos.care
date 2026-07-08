"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  children: React.ReactNode;
  bgImage?: string;
  overlay?: boolean;
  overlayColor?: string;
  speed?: number;
  className?: string;
  height?: string;
}

export function ParallaxSection({
  children,
  bgImage,
  overlay = true,
  overlayColor = "from-brand-900/95 via-brand-800/90 to-brand-700/80",
  className,
  height = "min-h-[70vh]",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      className={cn("relative flex items-center overflow-hidden", height, className)}
    >
      {bgImage && (
        <div className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      {overlay && bgImage && (
        <div className={cn("absolute inset-0 bg-gradient-to-r", overlayColor)} />
      )}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
}
