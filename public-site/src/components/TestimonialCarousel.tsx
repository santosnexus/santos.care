"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Rating } from "@/components/ui/Rating";
import { Card } from "@/components/ui/Card";

interface Testimonial {
  name: string;
  country: string;
  treatment: string;
  content: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  interval = 6000,
  className,
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, next, testimonials.length]);

  const t = testimonials[index];
  if (!t) return null;

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {testimonials.map((item, i) => (
            <div key={i} className="w-full flex-shrink-0 px-1">
              <Card surface="white" padding="lg" className="h-full">
                <Quote className="w-10 h-10 text-brand-200 mb-4" />
                <div className="mb-5">
                  <Rating value={item.rating} />
                </div>
                <blockquote className="text-body-lg text-ink leading-relaxed mb-6">
                  &ldquo;{item.content}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-5 border-t border-surface-muted">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-semibold text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{item.name}</p>
                    <p className="text-body-sm text-ink-light">
                      {item.country} &middot; {item.treatment}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {testimonials.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 w-10 h-10 rounded-full bg-surface border border-surface-muted shadow-card flex items-center justify-center text-ink-muted hover:text-brand-600 hover:border-brand-200 transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 w-10 h-10 rounded-full bg-surface border border-surface-muted shadow-card flex items-center justify-center text-ink-muted hover:text-brand-600 hover:border-brand-200 transition-all active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === index ? "bg-brand-600 w-5" : "bg-surface-muted hover:bg-brand-300"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
