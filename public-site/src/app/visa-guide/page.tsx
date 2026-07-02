import Link from "next/link";
import { CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "India Medical Visa Guide | How to Get a Medical Visa for India",
  description: "Complete step-by-step guide to getting an Indian medical visa. Eligibility, documents, fees, processing time, and how Heal India helps with the hospital invitation letter.",
};

export default function VisaGuidePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">India Medical Visa Guide</h1>
          <p className="text-xl text-brand-200 max-w-2xl">
            Everything you need to know about getting an Indian medical visa (M-visa) for treatment.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <h2>What is an Indian Medical Visa?</h2>
            <p>
              The Indian Medical Visa (M-visa) is a special visa category for foreign nationals seeking medical treatment
              at recognized hospitals in India. It allows the patient and up to two family members (Medical Attendant
              Visa) to travel to India for the duration of treatment.
            </p>

            <h2>Step-by-Step Process</h2>

            <h3>Step 1: Check Eligibility</h3>
            <p>Most nationalities are eligible for the Indian e-Medical Visa, including citizens of:</p>
            <ul>
              <li>African countries: Kenya, Tanzania, Uganda, Nigeria, Ethiopia, Rwanda, and more</li>
              <li>GCC countries: UAE, Saudi Arabia, Oman, Qatar, Bahrain, Kuwait</li>
              <li>European countries: UK, Germany, France, Italy, Spain, and most EU nations</li>
              <li>Asian countries: Bangladesh, Sri Lanka, Nepal, Maldives, and many more</li>
            </ul>

            <h3>Step 2: Get a Hospital Invitation Letter</h3>
            <p>
              This is the most critical document. The hospital invitation letter must come from a recognized Indian
              hospital and include your full name, passport number, nationality, and tentative treatment date.
            </p>
            <p>
              <strong>We handle this for you:</strong> Once you share your medical reports, we coordinate with our
              partner hospitals to issue your invitation letter within 24-48 hours.
            </p>

            <h3>Step 3: Gather Required Documents</h3>
            <ul>
              <li>Valid passport with at least 6 months validity and 2 blank pages</li>
              <li>Recent passport-size photograph (white background)</li>
              <li>Hospital invitation letter from the treating hospital</li>
              <li>Medical reports and referral from your local doctor</li>
              <li>Yellow fever vaccination certificate (required for travelers from endemic countries)</li>
            </ul>

            <h3>Step 4: Apply Online</h3>
            <p>Visit the official Government of India e-Visa portal at indianvisaonline.gov.in and:</p>
            <ol>
              <li>Complete the online application form</li>
              <li>Upload your photograph and documents</li>
              <li>Pay the visa fee (approximately $80-120 USD depending on nationality and duration)</li>
              <li>Save your application ID for tracking</li>
            </ol>

            <h3>Step 5: Receive and Travel</h3>
            <p>
              Processing typically takes 24-72 hours. Once approved, the e-Medical Visa is sent electronically.
              Print a copy to carry with you when traveling to India.
            </p>

            <h2>Important Notes</h2>
            <ul>
              <li>The e-Medical Visa is valid for 60 days from first arrival with triple entry</li>
              <li>If your treatment extends beyond 60 days, you may need to register with the FRRO within 14 days of arrival</li>
              <li>Up to two family members can apply for the linked Medical Attendant Visa</li>
              <li>Apply at least 7-10 days before your intended travel date</li>
            </ul>

            <h2>Common Reasons for Visa Delays</h2>
            <ul>
              <li>Blurry or incorrect photograph uploads</li>
              <li>Hospital letter missing required details (passport number, treatment dates)</li>
              <li>Name spelling mismatches between passport and application</li>
              <li>Insufficient passport validity or blank pages</li>
            </ul>

            <h2>How Heal India Helps with Your Visa</h2>
            <ul>
              <li>We coordinate with partner hospitals to issue your invitation letter within 24-48 hours</li>
              <li>We review your document set before submission to catch errors</li>
              <li>We provide guidance on visa category and application process</li>
              <li>We assist with FRRO registration if your stay extends beyond 60 days</li>
            </ul>
          </div>

          <div className="mt-12 bg-brand-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Visa Process?</h2>
            <p className="text-gray-600 mb-6">
              Share your medical reports and we&apos;ll help with your treatment plan and hospital invitation letter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors">
                Get Free Consultation <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                <MessageCircle className="w-4 h-4 inline mr-1" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
