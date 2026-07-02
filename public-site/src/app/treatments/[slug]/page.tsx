import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, Hospital, TrendingDown, Star, MessageCircle } from "lucide-react";
import { treatments, treatmentList } from "@/data/treatments";
import { getWhatsAppUrl } from "@/lib/utils";

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

  return (
    <>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#treatments"
            className="inline-flex items-center gap-1 text-brand-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Treatments
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t.title} in India</h1>
            <p className="text-xl text-brand-200 mb-6">{t.tagline}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 bg-white/10 text-white px-3 py-1.5 rounded-full">
                <TrendingDown className="w-4 h-4 text-green-400" />
                From ${t.costRange.from.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 text-white px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4 text-blue-400" />
                {t.recoveryDays}-day recovery
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 text-white px-3 py-1.5 rounded-full">
                <Hospital className="w-4 h-4 text-purple-400" />
                {t.hospitalStayDays}-day hospital stay
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 text-white px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-yellow-400" />
                Success: {t.successRate}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {t.body.map((paragraph, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>
              ))}

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Procedures We Offer</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {t.procedures.map((p) => (
                  <div key={p} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{p}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cost Comparison</h2>
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-gray-700 mb-4">
                  {t.title} in India costs <strong>70-90% less</strong> than in the US, UK, or UAE — even after
                  including flights, accommodation, and a companion&apos;s expenses.
                </p>
                <div className="text-sm text-gray-600">
                  <p>India: <strong className="text-green-600">${t.costRange.from.toLocaleString()} – ${t.costRange.to.toLocaleString()}</strong></p>
                  <p>USA: $50,000 – $150,000+ (typical)</p>
                  <p>UK: £20,000 – £55,000+ (private)</p>
                  <p>UAE/GCC: $25,000 – $50,000+ (private)</p>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Get a Free Treatment Plan</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Share your medical reports and receive a personalized plan within 24 hours.
                </p>
                <div className="space-y-3">
                  <input type="text" placeholder="Your Name" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                  <input type="tel" placeholder="Phone Number" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                  <input type="email" placeholder="Email" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                  <button className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors text-sm">
                    Get Free Plan
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={getWhatsAppUrl(`Hi! I'm interested in ${t.title} in India.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-green-600 font-medium text-sm hover:text-green-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Or send reports on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready for Your {t.title} in India?
          </h2>
          <p className="text-brand-100 mb-8">
            Get a free, no-obligation treatment plan with transparent pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-brand-700 px-8 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-colors"
            >
              Get Free Consultation
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4 inline mr-1" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
