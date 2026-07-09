import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Heart, Shield, DollarSign, Star, MessageCircle, Activity, Stethoscope, Microscope, Syringe, Bone, Sparkles, Smile, Snowflake, TrendingDown, Brain } from "lucide-react";
import { treatmentList } from "@/data/treatments";
import { hospitals } from "@/data/hospitals";
import { testimonials } from "@/data/testimonials";
import { getWhatsAppUrl } from "@/lib/utils";
import LeadForm from "@/components/LeadForm";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ScrollProgress } from "@/components/ScrollProgress";
import { InteractiveCostComparison } from "@/components/InteractiveCostComparison";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section, Container } from "@/components/ui/Section";

const icons: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-8 h-8" />,
  Bone: <Bone className="w-8 h-8" />,
  Activity: <Activity className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
  Smile: <Smile className="w-8 h-8" />,
  Snowflake: <Snowflake className="w-8 h-8" />,
  TrendingDown: <TrendingDown className="w-8 h-8" />,
  Brain: <Brain className="w-8 h-8" />,
};

const whyChooseUs = [
  {
    icon: <Shield className="w-8 h-8 text-brand-600" />,
    title: "JCI-Accredited Hospitals",
    desc: "Our partner hospitals meet international standards for quality, safety, and infection control.",
  },
  {
    icon: <DollarSign className="w-8 h-8 text-savings" />,
    title: "70–90% Cost Savings",
    desc: "Premium medical care at a fraction of Western prices. Free, transparent quotes with no hidden fees.",
  },
  {
    icon: <Heart className="w-8 h-8 text-rose-500" />,
    title: "Ayurveda Recovery",
    desc: "Unique post-treatment Ayurveda therapies at Ayush Prana retreat in Kumarakom for holistic healing.",
  },
  {
    icon: <Star className="w-8 h-8 text-rating" />,
    title: "Top Surgeons",
    desc: "Internationally trained, board-certified surgeons with thousands of successful procedures.",
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-whatsapp" />,
    title: "Free Treatment Plan in 24hrs",
    desc: "Send your medical reports on WhatsApp. Get a written plan and cost estimate within one day.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-brand-600" />,
    title: "End-to-End Concierge",
    desc: "Visa support, airport pickup, accommodation, translators, and 24/7 patient coordinator.",
  },
];

export default function Home() {
  return (
    <>
      <ScrollProgress />

      {/* ───── HERO ───── */}
      <Section variant="mesh" padding="none" className="relative min-h-screen flex items-center overflow-hidden animate-gradient-pan">
        <div className="absolute inset-0 bg-grid opacity-20" />

        {/* floating patient-outcome photo — gaze-direction priming toward the CTA card */}
        <div className="hidden lg:block absolute right-[44%] top-24 w-44 h-44 rounded-full overflow-hidden border-4 border-white/20 shadow-float animate-float-slow">
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"
            alt="A happy patient who recovered through treatment in India"
            width={176}
            height={176}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="hidden lg:block absolute left-[6%] bottom-24 glass rounded-2xl px-5 py-3 shadow-float border border-white/20 animate-float-slow [animation-delay:1.5s]">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["KE", "GB", "AE", "US"].map((c) => (
                <span key={c} className="w-7 h-7 rounded-full bg-brand-500/80 border-2 border-white/70 flex items-center justify-center text-[10px] font-bold text-white">
                  {c}
                </span>
              ))}
            </div>
            <p className="text-white/90 text-sm font-medium leading-tight">
              Patients from<br />15+ countries
            </p>
          </div>
        </div>

        <Container className="pt-36 pb-28 relative">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <Reveal variant="slide-up" duration={800}>
              <Badge variant="white" size="lg" className="mb-6">
                <Shield className="w-4 h-4 text-whatsapp mr-1" />
                JCI & NABH Accredited
              </Badge>
              <h1 className="text-display-hero text-white leading-tight mb-6 text-balance">
                World-Class Medical Care in India,
                <span className="block text-gradient mt-2">at 70–90% Less Cost</span>
              </h1>
              <p className="text-body-lg text-white/75 mb-8 max-w-xl leading-relaxed">
                JCI-accredited hospitals, internationally trained surgeons, and holistic Ayurveda recovery in
                Kerala. Get your free, written treatment plan within 24 hours — no obligation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button as="a" href="/contact" size="xl">
                  Get Free Treatment Plan <ArrowRight className="w-5 h-5" />
                </Button>
                <Button as="a" href={getWhatsAppUrl()} variant="savings" size="xl" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 text-sm text-white/60">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-savings" /> Free Quote</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-savings" /> 24hr Response</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-savings" /> No Obligation</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-savings" /> 12,000+ Patients</span>
              </div>
            </Reveal>

            <Reveal variant="slide-up" delay={200} duration={800}>
              <div className="bg-white/10 backdrop-blur-xl rounded-card p-8 border border-white/20 shadow-float">
                <h3 className="text-white text-display-h3 mb-2">Get Your Free Treatment Plan</h3>
                <p className="text-white/60 text-body-sm mb-6">
                  Share your details and medical reports. We&apos;ll respond within 24 hours.
                </p>
                <LeadForm source="HERO" />
              </div>
            </Reveal>
          </div>
        </Container>

        {/* floating trust strip — authority + social-proof priming */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/10 backdrop-blur-sm">
          <Container className="py-4">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white/70 text-sm">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-savings" /> JCI Accredited</span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span>NABH Certified Hospitals</span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span>1,000+ Surgeries / Year</span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span>98%+ Success Rates</span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span>End-to-End Concierge</span>
            </div>
          </Container>
        </div>
      </Section>

      {/* ───── STATS ───── */}
      <Section variant="soft" padding="sm">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <AnimatedCounter end={5} suffix="+" label="Partner Hospitals" />
            <AnimatedCounter end={8} suffix="" label="Treatments Offered" decimals={0} />
            <AnimatedCounter end={15} suffix="+" label="Countries Served" />
            <AnimatedCounter end={90} suffix="%" label="Cost Savings" />
          </div>
        </Container>
      </Section>

      {/* ───── WHY CHOOSE US ───── */}
      <Section variant="default" padding="lg">
        <Container>
          <Reveal variant="slide-up">
            <div className="text-center mb-16">
              <Badge variant="default" size="lg" className="mb-4">Why Choose Us</Badge>
              <h2 className="text-display-h2 text-ink mb-4 text-balance">Why Choose Heal India?</h2>
              <p className="text-body-lg text-ink-muted max-w-2xl mx-auto">
                We combine world-class medical care with holistic Ayurveda recovery and end-to-end concierge support.
              </p>
            </div>
          </Reveal>

          <StaggerReveal variant="slide-up" staggerDelay={80} className="grid md:grid-cols-3 gap-6">
            {whyChooseUs.map((item) => (
              <Card key={item.title} surface="soft" hover padding="lg" className="group">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-display-h3 text-ink mb-2 group-hover:text-brand-700 transition-colors">{item.title}</h3>
                <p className="text-body-sm text-ink-muted leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </StaggerReveal>
        </Container>
      </Section>

      {/* ───── PATIENT JOURNEY (narrative priming) ───── */}
      <Section variant="sand" padding="lg" id="journey">
        <Container>
          <Reveal variant="slide-up">
            <div className="text-center mb-14">
              <Badge variant="default" size="lg" className="mb-4">Your Healing Journey</Badge>
              <h2 className="text-display-h2 text-ink mb-4 text-balance">Four Steps to World-Class Care</h2>
              <p className="text-body-lg text-ink-muted max-w-2xl mx-auto">
                From your first message to a full recovery in Kerala — we handle every detail so you can focus on healing.
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Free Consultation", desc: "Send your reports on WhatsApp. Get a written treatment plan with transparent pricing in 24 hours." },
              { step: "02", title: "Plan & Travel", desc: "We arrange your visa, flights, airport pickup, and accommodation near the hospital." },
              { step: "03", title: "World-Class Treatment", desc: "Surgery or therapy at a JCI-accredited hospital by internationally trained specialists." },
              { step: "04", title: "Recovery & Beyond", desc: "Holistic Ayurveda recovery in Kerala, then continued follow-up once you're home." },
            ].map((s, i) => (
              <Reveal key={s.step} variant="slide-up" delay={i * 80}>
                <div className="relative h-full bg-surface rounded-card border border-gray-100/60 shadow-card p-7 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                  <span className="text-5xl font-bold text-brand-100 tracking-tight">{s.step}</span>
                  <h3 className="text-display-h3 text-ink mt-3 mb-2">{s.title}</h3>
                  <p className="text-body-sm text-ink-muted leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ───── COST COMPARISON ───── */}
      <Section variant="soft" padding="lg" id="costs">
        <Container>
          <Reveal variant="slide-up">
            <div className="text-center mb-12">
              <Badge variant="savings" size="lg" className="mb-4">Compare Costs</Badge>
              <h2 className="text-display-h2 text-ink mb-4">Procedure Cost Comparison</h2>
              <p className="text-body-lg text-ink-muted max-w-2xl mx-auto">
                See how much you save by choosing India for your medical treatment.
              </p>
            </div>
          </Reveal>
          <Reveal variant="slide-up" delay={150}>
            <InteractiveCostComparison />
          </Reveal>
          <Reveal variant="fade" delay={300}>
            <div className="text-center mt-8">
              <p className="text-body-sm text-ink-muted mb-4">
                Indicative pricing — get a written, itemized quote for your specific case, free of charge.
              </p>
              <Button as="a" href="/contact">
                Get Your Personalised Quote <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ───── TREATMENTS ───── */}
      <Section variant="default" padding="lg" id="treatments">
        <Container>
          <Reveal variant="slide-up">
            <div className="text-center mb-16">
              <Badge variant="default" size="lg" className="mb-4">Our Treatments</Badge>
              <h2 className="text-display-h2 text-ink mb-4">Medical Procedures</h2>
              <p className="text-body-lg text-ink-muted max-w-2xl mx-auto">
                Specialized medical care across 8 major categories at JCI-accredited hospitals in Kochi, Kerala.
              </p>
            </div>
          </Reveal>

          <StaggerReveal variant="slide-up" staggerDelay={60} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {treatmentList.map((t) => (
              <Link
                key={t.slug}
                href={`/treatments/${t.slug}`}
                className="group relative bg-surface rounded-card p-6 border border-gray-100/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-brand-200 transition-all duration-300"
              >
                <div className="absolute top-4 right-4">
                  <Badge variant="savings" size="sm">Save up to 90%</Badge>
                </div>
                <div className="text-brand-600 mb-3">{icons[t.icon] || <Heart className="w-8 h-8" />}</div>
                <h3 className="font-semibold text-ink group-hover:text-brand-700 transition-colors mb-2 pr-20">{t.title}</h3>
                <p className="text-body-sm text-ink-muted mb-4 line-clamp-2">{t.description}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-body-sm text-ink-light">From</span>
                  <span className="text-lg font-bold text-brand-700">${t.costRange.from.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-brand-600 text-sm font-medium mt-1">
                  Explore treatment
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </StaggerReveal>
        </Container>
      </Section>

      {/* ───── HOSPITALS ───── */}
      <Section variant="soft" padding="lg">
        <Container>
          <Reveal variant="slide-up">
            <div className="text-center mb-16">
              <Badge variant="default" size="lg" className="mb-4">Our Network</Badge>
              <h2 className="text-display-h2 text-ink mb-4">Partner Hospitals</h2>
              <p className="text-body-lg text-ink-muted max-w-2xl mx-auto">
                We work with JCI & NABH accredited hospitals in Kochi, Kerala — India&apos;s premier healthcare destination.
              </p>
            </div>
          </Reveal>

          <StaggerReveal variant="slide-up" staggerDelay={80} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((h) => (
              <Card key={h.slug} surface="white" hover padding="md">
                <h3 className="font-semibold text-ink mb-1">{h.name}</h3>
                <p className="text-body-sm text-ink-muted mb-3">{h.location}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {h.accreditation.split(", ").map((a) => (
                    <Badge key={a} variant="default" size="sm">{a}</Badge>
                  ))}
                </div>
                <p className="text-body-sm text-ink-muted mb-3">{h.description}</p>
                <span className="text-body-sm text-ink-light">{h.beds} beds</span>
              </Card>
            ))}
          </StaggerReveal>
        </Container>
      </Section>

      {/* ───── TESTIMONIALS ───── */}
      <Section variant="default" padding="lg">
        <Container>
          <Reveal variant="slide-up">
            <div className="text-center mb-16">
              <Badge variant="default" size="lg" className="mb-4">Patient Stories</Badge>
              <h2 className="text-display-h2 text-ink mb-4">Real Stories, Real Results</h2>
              <p className="text-body-lg text-ink-muted max-w-2xl mx-auto">
                Hear from patients who transformed their health with Heal India.
              </p>
            </div>
          </Reveal>

          <Reveal variant="slide-up">
            <TestimonialCarousel testimonials={testimonials} className="max-w-3xl mx-auto" />
          </Reveal>
        </Container>
      </Section>

      {/* ───── CTA LEAD FORM ───── */}
      <Section variant="brand" padding="xl">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal variant="slide-right">
              <Badge variant="white" size="lg" className="mb-4">Free Consultation</Badge>
              <h2 className="text-display-h2 text-white mb-4 text-balance">
                Get Your Free Treatment Plan in 24 Hours
              </h2>
              <p className="text-body-lg text-white/80 mb-8">
                Share your medical reports and get a personalized treatment plan with transparent pricing.
                No commitment required.
              </p>
              <div className="space-y-5 text-white/80">
                {[
                  { title: "24-Hour Response", desc: "Written treatment plan with itemized costs" },
                  { title: "Multi-Hospital Comparison", desc: "Options across our partner hospital network" },
                  { title: "Full Transparency", desc: "No hidden charges, no pressure, no obligation" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-savings mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white font-medium">{item.title}</span>
                      <p className="text-sm text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                as="a"
                href={getWhatsAppUrl()}
                variant="savings"
                size="lg"
                className="mt-6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" /> Send Reports on WhatsApp
              </Button>
            </Reveal>

            <Reveal variant="slide-left" delay={150}>
              <div className="bg-surface rounded-card p-8 shadow-float">
                <h3 className="text-display-h3 text-ink mb-6">Request Free Consultation</h3>
                <LeadForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ───── BOTTOM CTA ───── */}
      <Section variant="soft" padding="lg">
        <Container className="text-center">
          <Reveal variant="scale">
            <Badge variant="default" size="lg" className="mb-4">Start Your Journey</Badge>
            <h2 className="text-display-h2 text-ink mb-4 text-balance">
              Ready to Start Your Healing Journey?
            </h2>
            <p className="text-body-lg text-ink-muted mb-8 max-w-xl mx-auto">
              Contact us today for a free, no-obligation consultation. Our team responds within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="a" href="/contact" size="xl">
                Request Free Consultation <ArrowRight className="w-5 h-5" />
              </Button>
              <Button as="a" href={getWhatsAppUrl()} variant="savings" size="xl" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
