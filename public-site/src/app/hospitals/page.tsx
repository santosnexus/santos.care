import Link from "next/link";
import type { Metadata } from "next";
import { Building2, Award, BedDouble, ArrowUpRight } from "lucide-react";
import { hospitals } from "@/data/hospitals";
import { treatments } from "@/data/treatments";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Partner Hospitals in Kerala | Heal India Medi Tourism",
  description:
    "Our network of JCI and NABH-accredited hospitals in Kochi and Kumarakom, Kerala — world-class infrastructure for cardiac, oncology, orthopedic, and more.",
  alternates: { canonical: "/hospitals" },
  openGraph: {
    title: "Partner Hospitals in Kerala | Heal India Medi Tourism",
    description:
      "JCI and NABH-accredited partner hospitals in Kochi and Kumarakom, Kerala — world-class care at a fraction of Western costs.",
  },
};

export default function HospitalsPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden bg-mesh animate-gradient-pan">
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        <Container className="relative">
          <Reveal>
            <span className="inline-flex items-center gap-2 bg-white/10 text-brand-100 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur">
              <Building2 className="w-4 h-4" /> {hospitals.length} Accredited Hospitals
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
              Our Partner Hospitals in Kerala
            </h1>
            <p className="mt-6 text-xl text-brand-100 max-w-2xl leading-relaxed">
              We partner exclusively with JCI and NABH-accredited hospitals in Kochi and Kumarakom — combining
              world-class infrastructure with Kerala&apos;s healing environment.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container>
          <StaggerReveal className="grid gap-6 lg:grid-cols-2" staggerDelay={80}>
            {hospitals.map((h) => (
              <div
                key={h.slug}
                className="bg-white rounded-card border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-7 flex flex-col"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-ink mb-1">{h.name}</h2>
                    <p className="text-sm text-ink-muted flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4" /> {h.location}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap">
                    <Award className="w-3.5 h-3.5" /> {h.accreditation}
                  </span>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">{h.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {h.specialties.map((s) => {
                    const t = treatments[s];
                    if (!t) return null;
                    return (
                      <Link
                        key={s}
                        href={`/treatments/${s}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-full transition-colors"
                      >
                        {t.title} <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    );
                  })}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-ink-muted pt-4 border-t border-gray-100 mt-auto">
                  <BedDouble className="w-4 h-4 text-brand-500" />
                  <span className="font-semibold text-ink">{h.beds}</span> beds
                </div>
              </div>
            ))}
          </StaggerReveal>
        </Container>
      </Section>

      <Section variant="brand">
        <Container className="text-center max-w-3xl">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Find the Right Hospital for Your Treatment
            </h2>
            <p className="text-brand-100 text-lg mb-8">
              Our medical team matches you with the best hospital for your condition, budget, and recovery needs.
            </p>
            <Button as="a" href="/contact" variant="accent" size="lg">
              Get a Personalized Plan
            </Button>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
