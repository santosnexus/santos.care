import Link from "next/link";
import { ArrowRight, CheckCircle, Heart, Shield, DollarSign, Star, MessageCircle, Activity, Stethoscope, Microscope, Syringe, Bone } from "lucide-react";
import { treatmentList } from "@/data/treatments";
import { hospitals } from "@/data/hospitals";
import { testimonials } from "@/data/testimonials";
import { getWhatsAppUrl, WHATSAPP_NUMBER } from "@/lib/utils";
import LeadForm from "@/components/LeadForm";

const stats = [
  { label: "Partner Hospitals", value: "5+" },
  { label: "Treatments Offered", value: "8" },
  { label: "Countries Served", value: "15+" },
  { label: "Cost Savings", value: "70-90%" },
];

const icons: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-8 h-8" />,
  Bone: <Bone className="w-8 h-8" />,
  Activity: <Activity className="w-8 h-8" />,
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 mb-6">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-300 font-medium">JCI & NABH Accredited</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                World-Class Medical Treatment in India
                <span className="block text-brand-300 mt-2">at 70–90% Less Cost</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                JCI-accredited hospitals, internationally trained surgeons, and holistic Ayurveda recovery in
                Kerala. Get your free treatment plan within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white px-8 py-3.5 rounded-lg font-semibold transition-all"
                >
                  Get Free Treatment Plan <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-lg font-semibold transition-all"
                >
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Free Quote</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 24hr Response</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> No Obligation</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
                <h3 className="text-white text-xl font-semibold mb-4">Get Your Free Treatment Plan</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Share your details and medical reports. We&apos;ll respond within 24 hours.
                </p>
                <div className="space-y-3">
                  <input type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <select className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="" className="text-gray-900">Select Treatment</option>
                    {treatmentList.map((t) => (
                      <option key={t.slug} value={t.title} className="text-gray-900">{t.title}</option>
                    ))}
                  </select>
                  <button className="w-full bg-brand-500 hover:bg-brand-400 text-white py-3 rounded-lg font-semibold transition-all">
                    Submit →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-brand-600 mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Heal India */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Heal India?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine world-class medical care with holistic Ayurveda recovery and end-to-end concierge support.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section className="py-20 bg-white" id="treatments">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Treatments</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Specialized medical care across 8 major categories at JCI-accredited hospitals in Kochi, Kerala.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentList.map((t) => (
              <Link
                key={t.slug}
                href={`/treatments/${t.slug}`}
                className="group bg-gray-50 rounded-xl p-6 hover:bg-brand-50 border border-gray-100 hover:border-brand-200 transition-all"
              >
                <div className="text-brand-600 mb-3">{icons[t.icon] || <Heart className="w-8 h-8" />}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors mb-2">{t.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{t.description}</p>
                <div className="text-brand-600 text-sm font-medium">
                  From ${t.costRange.from.toLocaleString()} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Hospitals */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Partner Hospitals</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We work with JCI & NABH accredited hospitals in Kochi, Kerala — India&apos;s premier healthcare destination.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((h) => (
              <div key={h.slug} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">{h.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{h.location}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {h.accreditation.split(", ").map((a) => (
                    <span key={a} className="text-xs font-medium bg-brand-100 text-brand-700 px-2 py-0.5 rounded">
                      {a}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-3">{h.description}</p>
                <div className="text-xs text-gray-400">{h.beds} beds</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Patient Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from patients who transformed their health with Heal India.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.country} &middot; {t.treatment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with Lead Form */}
      <section className="py-20 bg-gradient-to-br from-brand-800 to-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Your Free Treatment Plan Awaits
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Share your medical reports and get a personalized treatment plan with transparent pricing within 24 hours.
                No commitment required.
              </p>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium">24-Hour Response</span>
                    <p className="text-sm text-gray-400">Written treatment plan with itemized costs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium">Multi-Hospital Comparison</span>
                    <p className="text-sm text-gray-400">Options across our partner hospital network</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium">Full Transparency</span>
                    <p className="text-sm text-gray-400">No hidden charges, no pressure, no obligation</p>
                  </div>
                </div>
              </div>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium mt-6 transition-colors"
              >
                <MessageCircle className="w-5 h-5" /> Or send reports directly on WhatsApp
              </a>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Request Free Consultation</h3>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-gray-600 mb-8">
            Contact us today for a free, no-obligation consultation. Our team responds within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-brand-700 transition-colors"
            >
              Request Free Consultation <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp: {WHATSAPP_NUMBER}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
