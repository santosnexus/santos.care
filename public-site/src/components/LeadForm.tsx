"use client";

import { useState } from "react";
import { Send, CheckCircle, MessageCircle } from "lucide-react";
import { cn, getWhatsAppUrl } from "@/lib/utils";

interface LeadFormProps {
  treatmentInterest?: string;
  source?: string;
  className?: string;
}

export default function LeadForm({ treatmentInterest, source = "WEBSITE", className }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    treatment: treatmentInterest || "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const opsHubUrl = process.env.NEXT_PUBLIC_OPS_HUB_URL || "https://ops.santos.care";
      const res = await fetch(`${opsHubUrl}/api/leads/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          treatmentInterest: form.treatment,
          source,
          message: form.message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        // Fall back to opening WhatsApp on error
        window.open(getWhatsAppUrl(`Hi! My name is ${form.name} and I'm interested in ${form.treatment || "treatment"} in India.`), "_blank");
        setSubmitted(true);
      }
    } catch {
      setError("Unable to submit. Opening WhatsApp instead...");
      setTimeout(() => {
        window.open(getWhatsAppUrl(), "_blank");
        setSubmitted(true);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={cn("text-center py-12", className)}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-4">
          We&apos;ve received your inquiry. Our team will contact you within 24 hours with a personalized treatment plan.
        </p>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
        >
          <MessageCircle className="w-4 h-4" /> Need faster response? Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
            placeholder="+254 712 345 678"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white text-sm"
          >
            <option value="">Select your country</option>
            <option value="Kenya">Kenya</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Uganda">Uganda</option>
            <option value="Nigeria">Nigeria</option>
            <option value="UAE">UAE</option>
            <option value="Oman">Oman</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="UK">United Kingdom</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="USA">United States</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Interested In</label>
        <select
          value={form.treatment}
          onChange={(e) => setForm({ ...form, treatment: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white text-sm"
        >
          <option value="">Select treatment</option>
          <option value="Cardiac Surgery">Cardiac Surgery</option>
          <option value="Orthopedic Surgery">Orthopedic Surgery</option>
          <option value="IVF & Fertility">IVF & Fertility</option>
          <option value="Cancer Treatment">Cancer Treatment</option>
          <option value="Cosmetic Surgery">Cosmetic Surgery</option>
          <option value="Dental Treatment">Dental Treatment</option>
          <option value="Weight Loss Surgery">Weight Loss Surgery</option>
          <option value="Neurology">Neurology</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none text-sm"
          placeholder="Tell us about your condition or ask a question..."
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-medium transition-all",
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-brand-700"
        )}
      >
        {loading ? "Sending..." : "Get Free Treatment Plan"}
        {!loading && <Send className="w-4 h-4" />}
      </button>
    </form>
  );
}
