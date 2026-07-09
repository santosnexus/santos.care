import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle, Globe2, HeartPulse, IndianRupee, ShieldCheck, Stethoscope, ArrowRight, Plane } from "lucide-react";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { JsonLd, faqSchema } from "@/components/json-ld";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "What Is Medical Tourism in India? | Complete Guide 2026",
  description:
    "Medical tourism in India lets international patients access JCI-accredited hospitals and world-class specialists at 70-90% lower cost. Learn how it works, who it's for, costs, and the step-by-step process.",
  alternates: { canonical: "/medical-tourism-india" },
  openGraph: {
    title: "What Is Medical Tourism in India? | Complete Guide",
    description:
      "How medical tourism in India works — costs, process, safety, and why patients from Africa, the Gulf, and Europe choose Kerala's JCI-accredited hospitals.",
  },
};

const PILLARS = [
  {
    icon: IndianRupee,
    title: "Up to 90% lower cost",
    body: "The same procedure in India can cost a fraction of US, UK, or UAE prices — even after flights and stay.",
  },
  {
    icon: ShieldCheck,
    title: "JCI-accredited hospitals",
    body: "Partner hospitals hold Joint Commission International and NABH accreditation — the same global safety standards as top Western hospitals.",
  },
  {
    icon: Stethoscope,
    title: "World-class specialists",
    body: "Surgeons trained at leading international institutions, with high case volumes that drive better outcomes.",
  },
  {
    icon: HeartPulse,
    title: "Holistic recovery",
    body: "Ayurveda-based recovery in Kerala accelerates healing and reduces complications after surgery.",
  },
];

const STEPS = [
  { step: "1", title: "Share your reports", body: "Send your medical reports via WhatsApp. A specialist reviews them within 24 hours." },
  { step: "2", title: "Get a treatment plan", body: "Receive a written plan with itemized costs, hospital options, and expected outcomes — no hidden fees." },
  { step: "3", title: "Travel & treatment", body: "Fly to Kochi, Kerala. Airport pickup, hospital admission, and surgery are coordinated for you." },
  { step: "4", title: "Recover & return", body: "Heal at a partner recovery retreat, then fly home with follow-up guidance." },
];

const FAQS = [
  {
    question: "What is medical tourism in India?",
    answer:
      "Medical tourism in India is the practice of international patients travelling to India for medical treatment — typically to access high-quality care at a much lower cost than in their home country. India is among the world's top medical tourism destinations, known for JCI-accredited hospitals, experienced surgeons, and advanced technology.",
  },
  {
    question: "Why do patients choose India for medical treatment?",
    answer:
      "Patients choose India because it combines internationally accredited hospitals and specialist expertise with costs that are 70-90% lower than the US, UK, or UAE. Kerala in particular offers world-class cardiac, orthopedic, oncology, IVF, dental, and cosmetic care alongside peaceful Ayurveda recovery environments.",
  },
  {
    question: "Is medical treatment in India safe?",
    answer:
      "Yes. Leading Indian hospitals hold Joint Commission International (JCI) and NABH accreditation and follow the same infection-control, surgical-checklist, and patient-safety protocols as top Western hospitals. Many partner surgeons have trained at internationally recognised institutions.",
  },
  {
    question: "How much can I save with medical tourism in India?",
    answer:
      "Savings typically range from 70% to 90% compared with private treatment costs in the US, UK, or Gulf countries. For example, cardiac bypass in India often costs $5,000-$8,500 versus $90,000-$150,000 in the United States.",
  },
  {
    question: "What is the medical tourism process in India?",
    answer:
      "The process is: (1) share your medical reports, (2) receive a personalised treatment plan with transparent pricing within 24 hours, (3) travel to India with airport pickup and hospital coordination, and (4) recover at a partner retreat before returning home with follow-up guidance.",
  },
];

export default function MedicalTourismIndiaPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <section className="relative pt-32 pb-20 overflow-hidden bg-mesh animate-gradient-pan">
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        <Container className="relative">
          <Reveal>
            <span className="inline-flex items-center gap-2 bg-surface/10 text-brand-100 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur">
              <Globe2 className="w-4 h-4" /> Medical Tourism Explained
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
              What Is Medical Tourism in India?
            </h1>
            <p className="mt-6 text-xl text-brand-100 max-w-2xl leading-relaxed">
              A complete guide to how international patients access world-class, JCI-accredited treatment in
              India at 70-90% lower cost — and exactly how the journey works from first enquiry to recovery.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <Reveal>
                <h2 className="text-3xl font-bold text-ink mb-4">Medical tourism in India, simply explained</h2>
                <p className="text-ink-muted leading-relaxed mb-4">
                  <strong className="text-ink">Medical tourism in India</strong> is when a patient travels from
                  their home country to India to receive medical treatment. The appeal is twofold: India offers
                  hospitals and specialists that match global quality standards, but at a fraction of the price
                  patients would pay privately in the US, UK, or Gulf. For many families, it turns an
                  unaffordable procedure into a realistic, safe option.
                </p>
                <p className="text-ink-muted leading-relaxed mb-4">
                  Kerala — and Kochi in particular — has become a hub for international patients seeking cardiac,
                  orthopedic, oncology, IVF, dental, and cosmetic care. The region pairs advanced tertiary-care
                  hospitals with a calming environment and Ayurveda-based recovery that accelerates healing.
                </p>
                <p className="text-ink-muted leading-relaxed">
                  A medical tourism facilitator like Heal India bridges the gap: coordinating reviews of your
                  reports, hospital selection, transparent pricing, travel, accommodation, and post-operative
                  recovery so you can focus on getting well.
                </p>
              </Reveal>
            </div>
            <div className="bg-brand-50 rounded-card border border-brand-100 p-6">
              <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-brand-600" /> Why India
              </h3>
              <ul className="space-y-3 text-sm text-ink-muted">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-savings mt-0.5 flex-shrink-0" /> 70-90% cost savings</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-savings mt-0.5 flex-shrink-0" /> JCI & NABH accredited hospitals</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-savings mt-0.5 flex-shrink-0" /> English-speaking medical teams</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-savings mt-0.5 flex-shrink-0" /> Short waiting times</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-savings mt-0.5 flex-shrink-0" /> Ayurveda recovery in Kerala</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="soft">
        <Container>
          <Reveal>
            <h2 className="text-3xl font-bold text-ink text-center mb-10">What makes India a top destination</h2>
          </Reveal>
          <StaggerReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={80}>
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-surface rounded-card border border-surface-muted shadow-card p-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-ink mb-2">{p.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </StaggerReveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <h2 className="text-3xl font-bold text-ink text-center mb-4">How the medical tourism process works</h2>
            <p className="text-ink-muted text-center max-w-2xl mx-auto mb-10">
              From your first message to flying home — a simple, transparent four-step journey.
            </p>
          </Reveal>
          <StaggerReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" staggerDelay={80}>
            {STEPS.map((s) => (
              <div key={s.step} className="relative bg-surface rounded-card border border-surface-muted shadow-card p-6">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-ink mb-2 flex items-center gap-2">
                  {s.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </StaggerReveal>
        </Container>
      </Section>

      <Section variant="soft">
        <Container>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/treatments" className="group bg-surface rounded-card border border-surface-muted shadow-card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all">
              <Stethoscope className="w-7 h-7 text-brand-600 mb-3" />
              <h3 className="font-semibold text-ink mb-1 group-hover:text-brand-700 transition-colors">Explore Treatments</h3>
              <p className="text-sm text-ink-muted mb-3">Cardiac, orthopedic, IVF, oncology, dental & more.</p>
              <span className="text-sm font-medium text-brand-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">Browse <ArrowRight className="w-4 h-4" /></span>
            </Link>
            <Link href="/hospitals" className="group bg-surface rounded-card border border-surface-muted shadow-card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all">
              <ShieldCheck className="w-7 h-7 text-brand-600 mb-3" />
              <h3 className="font-semibold text-ink mb-1 group-hover:text-brand-700 transition-colors">Partner Hospitals</h3>
              <p className="text-sm text-ink-muted mb-3">JCI & NABH-accredited hospitals in Kochi, Kerala.</p>
              <span className="text-sm font-medium text-brand-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">View <ArrowRight className="w-4 h-4" /></span>
            </Link>
            <Link href="/visa-guide" className="group bg-surface rounded-card border border-surface-muted shadow-card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all">
              <Plane className="w-7 h-7 text-brand-600 mb-3" />
              <h3 className="font-semibold text-ink mb-1 group-hover:text-brand-700 transition-colors">Visa Guide</h3>
              <p className="text-sm text-ink-muted mb-3">Step-by-step India medical visa guidance.</p>
              <span className="text-sm font-medium text-brand-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">Read <ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-3xl font-bold text-ink text-center mb-8">Frequently asked questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((f) => (
              <details key={f.question} className="group bg-surface rounded-card border border-surface-muted p-5">
                <summary className="font-medium text-ink cursor-pointer list-none flex items-center justify-between">
                  {f.question}
                  <span className="text-brand-500 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="text-sm text-ink-muted leading-relaxed mt-3">{f.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="brand">
        <Container className="text-center max-w-3xl">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to explore your options?
            </h2>
            <p className="text-brand-100 text-lg mb-8">
              Get a free, personalised treatment plan with transparent pricing within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="a" href="/contact" variant="accent" size="lg">
                Get Free Plan
              </Button>
              <Button as="a" href={getWhatsAppUrl()} variant="outline" size="lg" className="border-white/40 text-white hover:bg-surface/10">
                WhatsApp Us
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
