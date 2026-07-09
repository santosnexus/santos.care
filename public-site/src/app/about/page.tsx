import Link from "next/link";
import { Shield, Users, Heart, Award, ArrowRight, MessageCircle } from "lucide-react";
import { COMPANY, ADDRESS, getWhatsAppUrl } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Heal India Medi Tourism | Company & Mission",
  description: `Learn about ${COMPANY} — your trusted partner for medical treatment in India. JCI-accredited hospitals, expert surgeons, and Ayurveda recovery in Kerala.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-mesh animate-gradient-pan pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Heal India Medi Tourism</h1>
          <p className="text-xl text-brand-200 max-w-2xl">
            Your trusted partner for world-class medical treatment in India.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">
              Heal India Medi Tourism is a division of <strong>{COMPANY}</strong> (est. 2009), based in {ADDRESS}.
              We bridge the gap between international patients seeking quality, affordable healthcare and India&apos;s
              world-class medical infrastructure.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our unique value proposition combines treatment at JCI-accredited hospitals in Kochi with post-operative
              Ayurveda recovery at premium wellness retreats in Kerala. We believe that healing should not end at
              the hospital door — our integrated approach addresses the whole patient, not just the procedure.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { icon: <Shield className="w-6 h-6" />, number: "5+", label: "Partner Hospitals" },
              { icon: <Award className="w-6 h-6" />, number: "JCI", label: "Accredited Facilities" },
              { icon: <Users className="w-6 h-6" />, number: "15+", label: "Countries Served" },
              { icon: <Heart className="w-6 h-6" />, number: "70-90%", label: "Cost Savings" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-5 text-center">
                <div className="text-brand-600 mb-2 flex justify-center">{s.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{s.number}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To make world-class healthcare accessible and affordable for every patient, regardless of where they live.
              We believe that quality medical treatment should not be a privilege reserved for the wealthy.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Our Values</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Transparency", desc: "Clear, itemized pricing with no hidden costs. You deserve to know exactly what you're paying for." },
                { title: "Quality", desc: "We only partner with JCI and NABH accredited hospitals that meet international standards." },
                { title: "Compassion", desc: "Every patient is treated with dignity, respect, and personalized attention." },
                { title: "Integrity", desc: "We recommend treatments based on medical need, not commission. Your health comes first." },
              ].map((v) => (
                <div key={v.title} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{v.title}</h3>
                  <p className="text-sm text-gray-600">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 bg-gray-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-gray-600 mb-6">
              Get a free, no-obligation treatment plan within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors"
              >
                Free Consultation <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-whatsapp-light0 text-white px-8 py-3 rounded-lg font-semibold hover:bg-whatsapp-hover transition-colors"
              >
                <MessageCircle className="w-4 h-4 inline mr-1" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
