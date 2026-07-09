import type { Metadata } from "next";
import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Reveal } from "@/components/Reveal";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { JsonLd, reviewSchema } from "@/components/json-ld";

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

export default function TestimonialsPage() {
  return (
    <>
      <JsonLd
        data={reviewSchema(
          testimonials.map((t) => ({
            author: t.name,
            rating: t.rating,
            body: t.content,
            treatment: t.treatment,
          }))
        )}
      />
      <section className="relative pt-32 pb-20 overflow-hidden bg-mesh animate-gradient-pan">
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        <Container className="relative">
          <Reveal>
            <span className="inline-flex items-center gap-2 bg-white/10 text-brand-100 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur">
              <Star className="w-4 h-4 fill-current" /> {testimonials.length} Patient Stories
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
          <TestimonialCarousel testimonials={testimonials} className="max-w-3xl mx-auto" />
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
