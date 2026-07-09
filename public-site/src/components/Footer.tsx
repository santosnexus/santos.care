import Link from "next/link";
import { Phone, Mail, MapPin, Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { WHATSAPP_NUMBER, EMAIL, ADDRESS, COMPANY, getWhatsAppUrl } from "@/lib/utils";
import { treatmentList } from "@/data/treatments";

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-gray-300">
      {/* CTA band — priming the final action */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-display-h3 mb-1">Ready to begin your healing journey?</h3>
              <p className="text-brand-200 text-body-base">Get a free, written treatment plan within 24 hours.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="bg-brand-600 text-white px-7 py-3.5 rounded-pill font-semibold hover:bg-brand-700 hover:shadow-glow transition-all active:scale-95 inline-flex items-center gap-2"
              >
                Get Free Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 text-white px-7 py-3.5 rounded-pill font-semibold hover:bg-white/20 transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-green-400" /> {WHATSAPP_NUMBER}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">HC</span>
              </div>
              <span className="font-bold text-lg text-white">Heal India</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-4">
              Your trusted partner for world-class medical treatment in India. JCI-accredited hospitals, expert surgeons,
              and holistic Ayurveda recovery in Kerala.
            </p>
            <div className="flex items-center gap-2 text-body-sm text-savings mb-4">
              <ShieldCheck className="w-4 h-4" /> JCI & NABH Accredited
            </div>
            <div className="space-y-2 text-sm">
              <a href={getWhatsAppUrl()} className="flex items-center gap-2 hover:text-green-400 transition-colors">
                <Phone className="w-4 h-4 text-green-400" /> {WHATSAPP_NUMBER}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-brand-300 transition-colors">
                <Mail className="w-4 h-4 text-brand-400" /> {EMAIL}
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" /> {ADDRESS}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Treatments</h3>
            <ul className="space-y-2.5 text-sm">
              {treatmentList.slice(0, 8).map((t) => (
                <li key={t.slug}>
                  <Link href={`/treatments/${t.slug}`} className="hover:text-white transition-colors">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/medical-tourism-india" className="hover:text-white transition-colors">What Is Medical Tourism</Link></li>
              <li><Link href="/treatments" className="hover:text-white transition-colors">All Treatments</Link></li>
              <li><Link href="/hospitals" className="hover:text-white transition-colors">Hospitals</Link></li>
              <li><Link href="/testimonials" className="hover:text-white transition-colors">Patient Stories</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/visa-guide" className="hover:text-white transition-colors">Medical Visa Guide</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Why Choose Us</h3>
            <ul className="space-y-3 text-sm">
              {[
                "JCI & NABH accredited hospitals",
                "70-90% cost savings",
                "Free treatment plan in 24 hours",
                "Post-op Ayurveda recovery",
                "24/7 patient support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {COMPANY}. All rights reserved.</p>
          <p className="text-xs">Your health journey, our commitment. Heal India Medi Tourism by {COMPANY}.</p>
          <p className="text-xs">
            <a href="https://ops.santos.care" className="hover:text-white transition-colors">Staff Login</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
