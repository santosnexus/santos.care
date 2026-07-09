import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Heart, Bone, Sparkles, Activity, Smile, Snowflake, Brain, Stethoscope, TrendingDown } from "lucide-react";
import { treatmentList } from "@/data/treatments";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Treatments in India | Heal India Medi Tourism",
  description:
    "Explore world-class medical treatments in India — cardiac, orthopedic, IVF, oncology, cosmetic, dental, weight loss, and neurosurgery at JCI-accredited hospitals in Kerala. Save 70-90%.",
  alternates: { canonical: "/treatments" },
  openGraph: {
    title: "Treatments in India | Heal India Medi Tourism",
    description:
      "World-class medical treatments in India at 70-90% less cost. JCI-accredited hospitals, expert surgeons, holistic Ayurveda recovery.",
  },
};

const ICONS: Record<string, typeof Heart> = {
  cardiac: Heart,
  orthopedics: Bone,
  ivf: Sparkles,
  oncology: Activity,
  cosmetic: Smile,
  dental: Snowflake,
  "weight-loss": TrendingDown,
  neurology: Brain,
};

export default function TreatmentsIndexPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-brand-800 to-brand-900">
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        <Container className="relative">
          <Reveal>
            <span className="inline-flex items-center gap-2 bg-white/10 text-brand-100 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur">
              <Stethoscope className="w-4 h-4" /> 8 Specialties · JCI-Accredited
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
              World-Class Medical Treatments in India
            </h1>
            <p className="mt-6 text-xl text-brand-100 max-w-2xl leading-relaxed">
              From life-saving cardiac surgery to transformative cosmetic care — delivered at JCI-accredited
              hospitals in Kerala, at 70-90% lower cost than the US, UK, or UAE.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button as="a" href="/contact" variant="accent" size="lg">
                Get Free Treatment Plan
              </Button>
              <Button as="a" href="/countries" variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                Explore Destinations
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container>
          <StaggerReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={80}>
            {treatmentList.map((t) => {
              const Icon = ICONS[t.slug] || Heart;
              return (
                <Link
                  key={t.slug}
                  href={`/treatments/${t.slug}`}
                  className="group relative bg-white rounded-card border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-ink mb-2 group-hover:text-brand-700 transition-colors">
                    {t.title}
                  </h2>
                  <p className="text-sm text-ink-muted mb-4 flex-1">{t.tagline}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-sm">
                      <TrendingDown className="w-4 h-4 text-savings" />
                      <span className="font-semibold text-ink">
                        ${t.costRange.from.toLocaleString()}+
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </StaggerReveal>
        </Container>
      </Section>

      <Section variant="brand">
        <Container className="text-center max-w-3xl">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Not Sure Which Treatment You Need?
            </h2>
            <p className="text-brand-100 text-lg mb-8">
              Share your medical reports and our specialists will recommend the right procedure, hospital, and
              recovery plan — with transparent pricing within 24 hours.
            </p>
            <Button as="a" href="/contact" variant="accent" size="lg">
              Talk to a Specialist
            </Button>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
