import type { Metadata } from "next";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Patient Stories | Heal India Medi Tourism",
  description:
    "Real stories from patients across Africa, the Middle East, and Europe who saved 70-90% on world-class treatment in India with Heal India Medi Tourism.",
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: "Patient Stories | Heal India Medi Tourism",
    description:
      "Real patient stories from Kenya, UAE, UK, Nigeria, Oman, and Tanzania who chose India for life-changing treatment.",
  },
};

const FLAGS: Record<string, string> = {
  Kenya: "🇰🇪",
  UAE: "🇦🇪",
  "United Kingdom": "🇬🇧",
  Nigeria: "🇳🇬",
  Oman: "🇴🇲",
  Tanzania: "🇹🇿",
};

export default function TestimonialsPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-brand-800 to-brand-900">
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        <Container className="relative">
          <Reveal>
            <span className="inline-flex items-center gap-2 bg-white/10 text-brand-100 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur">
              <Star className="w-4 h-4 fill-current" /> {testimonials.length} Verified Patients
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
              Real Stories. Real Savings. Real Care.
            </h1>
            <p className="mt-6 text-xl text-brand-100 max-w-2xl leading-relaxed">
              Patients from across the world chose Heal India for life-changing treatment — and saved 70-90%
              compared to their home countries.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container>
          <StaggerReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={80}>
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="bg-white rounded-card border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-7 flex flex-col"
              >
                <Quote className="w-8 h-8 text-brand-200 mb-4" />
                <blockquote className="text-ink leading-relaxed mb-6 flex-1">
                  &ldquo;{t.content}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <figcaption className="font-semibold text-ink">{t.name}</figcaption>
                    <p className="text-sm text-ink-muted flex items-center gap-1.5">
                      <span>{FLAGS[t.country] || "🌍"}</span> {t.country} · {t.treatment}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </figure>
            ))}
          </StaggerReveal>
        </Container>
      </Section>

      <Section variant="accent">
        <Container className="text-center max-w-3xl">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
              Your Story Could Be Next
            </h2>
            <p className="text-ink-muted text-lg mb-8">
              Join hundreds of patients who chose world-class care in India without the world-class price tag.
            </p>
            <Button as="a" href="/contact" variant="primary" size="lg">
              Start Your Journey
            </Button>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
