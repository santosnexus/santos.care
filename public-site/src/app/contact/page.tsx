import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER, EMAIL, PHONE, ADDRESS, COMPANY, getWhatsAppUrl } from "@/lib/utils";
import LeadForm from "@/components/LeadForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Heal India Medi Tourism",
  description: "Get your free treatment plan within 24 hours. Contact Heal India for cardiac, orthopedic, IVF, cancer, cosmetic, and dental treatment in India.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-mesh animate-gradient-pan pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-brand-200 max-w-2xl">
            Get your free treatment plan within 24 hours. No obligation, complete transparency.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-ink mb-6">Send Us Your Inquiry</h2>
              <p className="text-ink-muted mb-8">
                Fill out the form and our medical team will respond with a personalized treatment plan within 24 hours.
                For faster response, send your medical reports directly on WhatsApp.
              </p>
              <LeadForm />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-whatsapp-light flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-whatsapp" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone / WhatsApp</h3>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-whatsapp hover:text-whatsapp-hover font-medium"
                    >
                      {WHATSAPP_NUMBER}
                    </a>
                    <p className="text-sm text-gray-500">{PHONE}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:text-brand-700">
                      {EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">{COMPANY}</p>
                    <p className="text-gray-600">{ADDRESS}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Response Time</h3>
                    <p className="text-gray-600">Within 24 hours for treatment plans</p>
                    <p className="text-sm text-gray-500">WhatsApp: Immediate for urgent inquiries</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 bg-whatsapp-light rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-6 h-6 text-whatsapp mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Fastest Response: WhatsApp</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Send your medical reports directly on WhatsApp for the fastest response.
                    </p>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-whatsapp-light0 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-whatsapp-hover transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
