import type { Metadata } from "next";
import { COMPANY, EMAIL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy | Heal India Medi Tourism",
  description: "Privacy policy for Heal India Medi Tourism. Learn how we collect, use, and protect your personal and medical information.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-mesh animate-gradient-pan pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-brand-200">Last updated: January 2026</p>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <h2>1. Introduction</h2>
            <p>
              {COMPANY} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
              our website or use our medical tourism services.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide, including:</p>
            <ul>
              <li>Name, email address, phone number, and country of residence</li>
              <li>Medical history, reports, and treatment requirements</li>
              <li>Passport and visa information for travel coordination</li>
              <li>Payment information for service fees</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we may collect:</p>
            <ul>
              <li>IP address, browser type, and operating system</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website or source</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for the following purposes:</p>
            <ul>
              <li>To provide medical tourism coordination services</li>
              <li>To communicate with you regarding your treatment plan</li>
              <li>To coordinate with partner hospitals and healthcare providers</li>
              <li>To assist with visa applications and travel arrangements</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Partner hospitals and healthcare providers for treatment coordination</li>
              <li>Visa and immigration authorities as required for your travel</li>
              <li>Service providers who assist in our operations (e.g., translators, transport)</li>
              <li>Legal authorities if required by law</li>
            </ul>
            <p>
              We do <strong>not</strong> sell your personal or medical information to third parties.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal and medical
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and comply with
              legal obligations. Medical records are retained as required by applicable healthcare regulations.
            </p>

            <h2>7. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Request portability of your information</li>
            </ul>

            <h2>8. Cookies</h2>
            <p>
              Our website may use cookies for analytics and functionality. You can control cookie preferences
              through your browser settings.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an
              updated revision date.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p>
              Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
