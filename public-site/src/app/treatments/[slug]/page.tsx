import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, Hospital, TrendingDown, Star, MessageCircle, ShieldCheck, Stethoscope, Award, BookOpen } from "lucide-react";
import { treatments, treatmentList } from "@/data/treatments";
import { getWhatsAppUrl } from "@/lib/utils";
import { getPostsByTreatment } from "@/lib/mdx";
import LeadForm from "@/components/LeadForm";
import { JsonLd, productSchema } from "@/components/json-ld";
import { Section, Container } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function generateStaticParams() {
  return treatmentList.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const t = treatments[params.slug];
  if (!t) return {};
  return {
    title: `${t.title} in India | Cost, Hospitals & Recovery Guide`,
    description: t.description,
    openGraph: {
      title: `${t.title} in India | Cost Guide`,
      description: t.description,
    },
  };
}

export default function TreatmentPage({ params }: { params: { slug: string } }) {
  const t = treatments[params.slug];
  if (!t) notFound();

  const relatedPosts = getPostsByTreatment(t.slug, 4);
  const maxCost = Math.max(...t.costComparison.map((c) => c.to));
  const india = t.costComparison.find((c) => c.country === "India")!;
  const topWestern = t.costComparison[0];
  const savingsPct = Math.round((1 - india.from / topWestern.from) * 100);

  return (
    <>
      <JsonLd
        data={productSchema({
          name: `${t.title} in India`,
          description: t.description,
          url: `https://santos.care/treatments/${t.slug}`,
          minPrice: t.costRange.from,
          maxPrice: t.costRange.to,
        })}
      />

      {/* ───── HERO (mesh + outcome priming) ───── */}
      <section className="bg-mesh text-white pt-32 pb-20 animate-gradient-pan relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-15" />
        <Container className="relative">
          <Link
            href="/treatments"
            className="inline-flex items-center gap-1 text-brand-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Treatments
          </Link>
          <div className="max-w-3xl">
            <Badge variant="white" size="lg" className="mb-5">
              <ShieldCheck className="w-4 h-4 text-savings mr-1" /> JCI & NABH Accredited
            </Badge>
            <h1 className="text-display-hero text-white mb-4 text-balance">{t.title} in India</h1>
            <p className="text-xl text-brand-100 mb-8">{t.tagline}</p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-pill">
                <TrendingDown className="w-4 h-4 text-savings" />
                Save up to <span className="font-bold">{savingsPct}%</span> vs {topWestern.country}
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-pill">
                <Clock className="w-4 h-4 text-blue-300" />
                {t.recoveryDays}-day recovery
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-pill">
                <Hospital className="w-4 h-4 text-purple-300" />
                {t.hospitalStayDays}-day hospital stay
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-pill">
                <Star className="w-4 h-4 text-rating" />
                {t.successRate} success
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── BODY + COST ANCHORING ───── */}
      <Section variant="default" padding="lg">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div>
                {t.body.map((paragraph, i) => (
                  <p key={i} className="text-body-lg text-ink-muted leading-relaxed mb-5">{paragraph}</p>
                ))}
              </div>

              {/* Authority stack */}
              <div className="grid sm:grid-cols-3 gap-4 my-10">
                <Card surface="soft" padding="sm" className="text-center">
                  <Stethoscope className="w-7 h-7 text-brand-600 mx-auto mb-2" />
                  <p className="font-semibold text-ink">Internationally Trained</p>
                  <p className="text-body-sm text-ink-muted">Board-certified specialists</p>
                </Card>
                <Card surface="soft" padding="sm" className="text-center">
                  <Award className="w-7 h-7 text-brand-600 mx-auto mb-2" />
                  <p className="font-semibold text-ink">{t.successRate} Success</p>
                  <p className="text-body-sm text-ink-muted">Matched to global benchmarks</p>
                </Card>
                <Card surface="soft" padding="sm" className="text-center">
                  <Hospital className="w-7 h-7 text-brand-600 mx-auto mb-2" />
                  <p className="font-semibold text-ink">JCI-Accredited</p>
                  <p className="text-body-sm text-ink-muted">Hospitals in Kochi, Kerala</p>
                </Card>
              </div>

              <h2 className="text-display-h2 text-ink mt-4 mb-6">Procedures We Offer</h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-12">
                {t.procedures.map((p) => (
                  <div key={p} className="flex items-start gap-2.5 bg-surface-soft rounded-card p-3.5 border border-surface-muted/60">
                    <CheckCircle className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                    <span className="text-body-base text-ink">{p}</span>
                  </div>
                ))}
              </div>

              {/* Cost anchoring — Western prices first, India highlighted */}
              <h2 className="text-display-h2 text-ink mb-2">How Much You Save</h2>
              <p className="text-body-base text-ink-muted mb-6">
                The same procedure costs a fraction in India — even after flights, accommodation, and a companion&apos;s expenses.
              </p>
              <Card surface="white" padding="lg" className="mb-4">
                <div className="space-y-4">
                  {t.costComparison.map((c) => {
                    const isIndia = c.country === "India";
                    const pct = Math.round((c.to / maxCost) * 100);
                    return (
                      <div key={c.country} className="flex items-center gap-4">
                        <div className="w-32 flex items-center gap-2 flex-shrink-0">
                          <span className="text-lg">{c.flag}</span>
                          <span className={`text-sm font-semibold ${isIndia ? "text-brand-700" : "text-ink-muted"}`}>{c.country}</span>
                        </div>
                        <div className="flex-1 h-9 bg-surface-soft rounded-pill overflow-hidden">
                          <div
                            className={`h-full rounded-pill transition-all duration-700 ${isIndia ? "bg-gradient-to-r from-brand-500 to-brand-700" : "bg-surface-muted"}`}
                            style={{ width: `${Math.max(pct, 6)}%` }}
                          />
                        </div>
                        <div className="w-40 text-right">
                          <span className={`text-sm font-bold tabular-nums ${isIndia ? "text-brand-700" : "text-ink-muted"}`}>
                            ${c.from.toLocaleString()} – ${c.to.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3 pt-5 border-t border-surface-muted">
                  <Badge variant="savings" size="lg">You save up to {savingsPct}%</Badge>
                  <span className="text-body-sm text-ink-muted">
                    vs {topWestern.country} prices for the same quality of care.
                  </span>
                </div>
              </Card>
              <p className="text-body-sm text-ink-light mb-8">
                Indicative pricing — get a written, itemized quote for your specific case, free of charge.
              </p>
            </div>

            {/* Sticky lead form */}
            <div>
              <div className="bg-surface rounded-card border border-surface-muted/60 shadow-card p-7 sticky top-24">
                <h3 className="font-semibold text-ink mb-1 text-display-h3">Get a Free Treatment Plan</h3>
                <p className="text-body-sm text-ink-muted mb-5">
                  Share your medical reports and receive a personalized plan within 24 hours.
                </p>
                <LeadForm treatmentInterest={t.title} source="TREATMENT_PAGE" />
                <div className="mt-5 pt-5 border-t border-surface-muted">
                  <a
                    href={getWhatsAppUrl(`Hi! I'm interested in ${t.title} in India.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-whatsapp font-medium text-sm hover:text-whatsapp-hover transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Or send reports on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ───── RELATED GUIDES ───── */}
      {relatedPosts.length > 0 && (
        <Section variant="default" padding="lg">
          <Container>
            <h2 className="text-display-h2 text-ink mb-2">Related Guides</h2>
            <p className="text-body-base text-ink-muted mb-8 max-w-2xl">
              Deeper reads on {t.title.toLowerCase()} costs, hospitals, and patient experiences in India.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-surface-soft rounded-card p-5 border border-surface-muted hover:border-brand-200 hover:shadow-card-hover transition-all"
                >
                  <div className="w-10 h-10 rounded-button bg-brand-50 flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-ink group-hover:text-brand-700 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-ink-muted line-clamp-3 mb-3">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-ink-light">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ───── BOTTOM CTA ───── */}
      <Section variant="brand" padding="xl">
        <Container className="text-center">
          <h2 className="text-display-h2 text-white mb-4 text-balance">
            Ready for Your {t.title} in India?
          </h2>
          <p className="text-white/80 text-body-lg mb-8 max-w-xl mx-auto">
            Get a free, no-obligation treatment plan with transparent pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-brand-700 px-8 py-4 rounded-pill font-semibold hover:bg-brand-50 transition-all active:scale-95"
            >
              Get Free Consultation
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp text-white px-8 py-4 rounded-pill font-semibold hover:bg-whatsapp-hover transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 inline mr-1" /> WhatsApp Us
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}
