import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, MessageCircle, BookOpen, Clock } from "lucide-react";
import { countries, countryList } from "@/data/countries";
import { treatments } from "@/data/treatments";
import { getWhatsAppUrl } from "@/lib/utils";
import { getPostsByCountry } from "@/lib/mdx";

export function generateStaticParams() {
  return countryList.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = countries[params.slug];
  if (!c) return {};
  return {
    title: `Medical Treatment in India from ${c.name} | Cost & Guide`,
    description: c.overview,
  };
}

export default function CountryPage({ params }: { params: { slug: string } }) {
  const c = countries[params.slug];
  if (!c) notFound();

  const relatedPosts = getPostsByCountry(c.slug, 4);

  return (
    <>
      <section className="bg-mesh animate-gradient-pan pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/countries"
            className="inline-flex items-center gap-1 text-brand-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Countries
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{c.flag}</span>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">{c.name}</h1>
              <p className="text-brand-200 text-lg">{c.region}</p>
            </div>
          </div>
          <p className="text-lg text-brand-100 max-w-3xl">{c.overview}</p>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-ink mb-6">Healthcare Challenges in {c.name}</h2>
              <div className="space-y-3">
                {c.challenges.map((ch, i) => (
                  <div key={i} className="flex items-start gap-2 bg-accent-50 rounded-button p-3">
                    <span className="text-accent-600 font-bold text-sm mt-0.5">{i + 1}.</span>
                    <span className="text-sm text-ink-muted">{ch}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-ink mb-6">Why {c.name} Patients Choose India</h2>
              <div className="space-y-3">
                {c.whyIndia.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 bg-whatsapp-light rounded-button p-3">
                    <CheckCircle className="w-5 h-5 text-savings mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-ink-muted">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-ink mb-6">Recommended Treatments</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {c.treatments.map((slug) => {
                const t = treatments[slug];
                if (!t) return null;
                return (
                  <Link
                    key={slug}
                    href={`/treatments/${slug}`}
                    className="bg-surface-soft rounded-card p-5 border border-surface-muted hover:border-brand-200 hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-ink mb-1">{t.title}</h3>
                    <p className="text-sm text-ink-muted mb-2">From ${t.costRange.from.toLocaleString()}</p>
                    <p className="text-xs text-ink-light">{t.procedures.length} procedures</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-ink mb-2">Guides for Patients from {c.name}</h2>
              <p className="text-ink-muted mb-6">
                Practical reads to help you plan, budget, and travel with confidence.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-surface-soft rounded-card p-5 border border-surface-muted hover:border-brand-200 hover:shadow-card-hover transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-button bg-brand-50 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink group-hover:text-brand-700 transition-colors line-clamp-2 mb-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-ink-muted line-clamp-2 mb-2">{post.excerpt}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-ink-light">
                          <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 bg-surface-soft rounded-card p-6">
            <h3 className="text-lg font-semibold text-ink mb-2">Plan Your Treatment from {c.name}</h3>
            <p className="text-sm text-ink-muted mb-4">
              Contact us for a free treatment plan. We handle everything from visa support to airport pickup.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="bg-brand-600 text-white px-6 py-2.5 rounded-button text-sm font-medium hover:bg-brand-700 transition-colors text-center"
              >
                Get Free Consultation
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-whatsapp text-white px-6 py-2.5 rounded-button text-sm font-medium hover:bg-whatsapp-hover transition-colors text-center"
              >
                <MessageCircle className="w-4 h-4 inline mr-1" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
