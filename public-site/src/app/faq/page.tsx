import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { faqs } from "@/data/faqs";
import { getWhatsAppUrl } from "@/lib/utils";
import { JsonLd, faqSchema } from "@/components/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Medical Treatment in India | Heal India",
  description: "Frequently asked questions about medical treatment in India — costs, hospitals, visas, recovery, and how our process works.",
};

const categories = [...new Set(faqs.map((f) => f.category))];

export default function FAQPage() {
  return (
    <>
      <JsonLd
        data={faqSchema(
          faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          }))
        )}
      />
      <section className="bg-mesh animate-gradient-pan pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-brand-200 max-w-2xl">
            Everything you need to know about medical treatment in India.
          </p>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <a
                key={cat}
                href={`#${cat.toLowerCase()}`}
                className="text-sm bg-surface-muted text-ink-muted px-3 py-1.5 rounded-button hover:bg-brand-100 hover:text-brand-700 transition-colors"
              >
                {cat}
              </a>
            ))}
          </div>
          {categories.map((cat) => (
            <div key={cat} id={cat.toLowerCase()} className="mb-10">
              <h2 className="text-xl font-bold text-ink mb-4">{cat}</h2>
              <div className="space-y-4">
                {faqs
                  .filter((f) => f.category === cat)
                  .map((faq, i) => (
                    <details key={i} className="group bg-surface-soft rounded-card overflow-hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-surface-muted transition-colors">
                        <span className="font-medium text-ink text-sm">{faq.question}</span>
                        <span className="text-ink-light group-open:rotate-180 transition-transform ml-4">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-4 pb-4">
                        <p className="text-sm text-ink-muted leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
              </div>
            </div>
          ))}

          <div className="mt-16 bg-brand-50 rounded-card p-8 text-center">
            <h2 className="text-2xl font-bold text-ink mb-4">Still Have Questions?</h2>
            <p className="text-ink-muted mb-6">
              Our medical team is ready to help. Get your personalized treatment plan within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-brand-600 text-white px-8 py-3 rounded-button font-semibold hover:bg-brand-700 transition-colors"
              >
                Contact Us
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-whatsapp text-white px-8 py-3 rounded-button font-semibold hover:bg-whatsapp-hover transition-colors"
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
