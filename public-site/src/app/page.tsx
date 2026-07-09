import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Heart, Shield, DollarSign, Star, MessageCircle, Activity, Stethoscope, Microscope, Syringe, Bone } from "lucide-react";
import { treatmentList } from "@/data/treatments";
import { hospitals } from "@/data/hospitals";
import { testimonials } from "@/data/testimonials";
import { getWhatsAppUrl } from "@/lib/utils";
import LeadForm from "@/components/LeadForm";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ScrollProgress } from "@/components/ScrollProgress";
import { InteractiveCostComparison } from "@/components/InteractiveCostComparison";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Section, Container } from "@/components/ui/Section";

const icons: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-8 h-8" />,
  Bone: <Bone className="w-8 h-8" />,
  Activity: <Activity className="w-8 h-8" />,
};

const whyChooseUs = [
  {
    icon: <Shield className="w-8 h-8 text-brand-600" />,
    title: "JCI-Accredited Hospitals",
    desc: "Our partner hospitals meet international standards for quality, safety, and infection control.",
  },
  {
    icon: <DollarSign className="w-8 h-8 text-green-500" />,
    title: "70–90% Cost Savings",
    desc: "Premium medical care at a fraction of Western prices. Free, transparent quotes with no hidden fees.",
  },
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "Ayurveda Recovery",
    desc: "Unique post-treatment Ayurveda therapies at Ayush Prana retreat in Kumarakom for holistic healing.",
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    title: "Top Surgeons",
    desc: "Internationally trained, board-certified surgeons with thousands of successful procedures.",
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-green-500" />,
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
      <Section variant="dark" padding="none" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=80"
            alt="Modern hospital operating room"
            fill
            priority
            sizes="100vw"
            className="object-cover scale-105 animate-scale-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-800/90 to-brand-700/80" />
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>

        <Container className="py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal variant="slide-up" duration={800}>
              <Badge variant="white" size="lg" className="mb-6">
                <Shield className="w-4 h-4 text-green-400 mr-1" />
                JCI & NABH Accredited
              </Badge>
              <h1 className="text-display-hero text-white leading-tight mb-6 text-balance">
                World-Class Medical Treatment in India
                <span className="block text-brand-300 mt-2">at 70–90% Less Cost</span>
              </h1>
              <p className="text-body-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                JCI-accredited hospitals, internationally trained surgeons, and holistic Ayurveda recovery in
                Kerala. Get your free treatment plan within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button as="a" href="/contact" size="xl">
                  Get Free Treatment Plan <ArrowRight className="w-5 h-5" />
                </Button>
                <Button as="a" href={getWhatsAppUrl()} variant="savings" size="xl" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Free Quote</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 24hr Response</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> No Obligation</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 12,000+ Patients</span>
              </div>
            </Reveal>

            <Reveal variant="slide-up" delay={200} duration={800}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-float">
                <h3 className="text-white text-display-h3 mb-2">Get Your Free Treatment Plan</h3>
                <p className="text-gray-400 text-body-sm mb-6">
                  Share your details and medical reports. We&apos;ll respond within 24 hours.
                </p>
                <LeadForm source="HERO" />
              </div>
            </Reveal>
          </div>
        </Container>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-pill flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-pill animate-pulse" />
          </div>
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
              <div
                key={item.title}
                className="bg-surface rounded-card p-6 shadow-card border border-gray-100/50 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-display-h3 text-ink mb-2">{item.title}</h3>
                <p className="text-body-sm text-ink-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </StaggerReveal>
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
                className="group bg-surface-soft rounded-card p-6 hover:bg-brand-50 border border-gray-100/50 hover:border-brand-200 transition-all duration-200 shadow-card hover:shadow-card-hover"
              >
                <div className="text-brand-600 mb-3">{icons[t.icon] || <Heart className="w-8 h-8" />}</div>
                <h3 className="font-semibold text-ink group-hover:text-brand-700 transition-colors mb-2">{t.title}</h3>
                <p className="text-body-sm text-ink-muted mb-3 line-clamp-2">{t.description}</p>
                <div className="flex items-center gap-1 text-brand-600 text-sm font-medium">
                  From ${t.costRange.from.toLocaleString()}
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
              <div
                key={h.slug}
                className="bg-surface rounded-card p-6 shadow-card border border-gray-100/50 hover:shadow-card-hover transition-all duration-200"
              >
                <h3 className="font-semibold text-ink mb-1">{h.name}</h3>
                <p className="text-body-sm text-ink-muted mb-3">{h.location}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {h.accreditation.split(", ").map((a) => (
                    <Badge key={a} variant="default" size="sm">{a}</Badge>
                  ))}
                </div>
                <p className="text-body-sm text-ink-muted mb-3">{h.description}</p>
                <span className="text-body-sm text-ink-light">{h.beds} beds</span>
              </div>
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

          <StaggerReveal variant="slide-up" staggerDelay={80} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-surface-soft rounded-card p-6 border border-gray-100/50 hover:shadow-card-hover transition-all duration-200"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-body-sm text-ink-muted mb-4 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{t.name}</p>
                    <p className="text-body-sm text-ink-light">{t.country} &middot; {t.treatment}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerReveal>
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
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
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
