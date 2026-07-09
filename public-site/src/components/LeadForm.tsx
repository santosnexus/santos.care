"use client";

import { useState } from "react";
import { Send, CheckCircle, MessageCircle, ArrowRight, ArrowLeft, Stethoscope, User, FileText } from "lucide-react";
import { cn, getWhatsAppUrl } from "@/lib/utils";

interface LeadFormProps {
  treatmentInterest?: string;
  source?: string;
  className?: string;
}

const TREATMENTS = [
  "Cardiac Surgery",
  "Orthopedic Surgery",
  "IVF & Fertility",
  "Cancer Treatment",
  "Cosmetic Surgery",
  "Dental Treatment",
  "Weight Loss Surgery",
  "Neurology",
  "Other",
];

const COUNTRIES = [
  "Kenya", "Tanzania", "Uganda", "Nigeria", "UAE", "Oman", "Saudi Arabia",
  "UK", "Germany", "France", "USA", "Australia", "Other",
];

const STEPS = [
  { id: 1, label: "Treatment", icon: Stethoscope },
  { id: 2, label: "Details", icon: User },
  { id: 3, label: "Message", icon: FileText },
];

export default function LeadForm({ treatmentInterest, source = "WEBSITE", className }: LeadFormProps) {
  const [step, setStep] = useState(1);
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

  const inputCls =
    "w-full px-4 py-3 rounded-button border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-body-base bg-white";

  const canAdvance =
    (step === 1 && form.treatment) ||
    (step === 2 && form.name && form.email && form.phone) ||
    step === 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads/capture", {
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
        setError("We couldn't submit your request. Please message us on WhatsApp instead.");
        window.open(
          getWhatsAppUrl(`Hi! My name is ${form.name} and I'm interested in ${form.treatment || "treatment"} in India.`),
          "_blank"
        );
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
      <div className={cn("text-center py-10", className)}>
        <div className="w-16 h-16 rounded-full bg-savings-light flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-9 h-9 text-savings" />
        </div>
        <h3 className="text-xl font-bold text-ink mb-2">Thank You!</h3>
        <p className="text-ink-muted text-body-base mb-5">
          We&apos;ve received your inquiry. Our team will contact you within 24 hours with a personalized treatment plan.
        </p>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-savings hover:text-green-700 font-medium"
        >
          <MessageCircle className="w-4 h-4" /> Need a faster response? Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = step === s.id;
          const done = step > s.id;
          return (
            <div key={s.id} className="flex-1 flex items-center gap-2">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  done && "bg-brand-600 text-white",
                  active && "bg-brand-600 text-white ring-4 ring-brand-100",
                  !active && !done && "bg-gray-100 text-ink-light"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("h-0.5 flex-1 rounded-full transition-colors", done ? "bg-brand-600" : "bg-gray-100")} />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="animate-fade-in-up">
            <label className="block text-body-sm font-medium text-ink mb-1.5">Which treatment are you considering? *</label>
            <select
              required
              value={form.treatment}
              onChange={(e) => setForm({ ...form, treatment: e.target.value })}
              className={inputCls}
            >
              <option value="">Select treatment</option>
              {TREATMENTS.map((tr) => (
                <option key={tr} value={tr}>{tr}</option>
              ))}
            </select>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <label className="block text-body-sm font-medium text-ink mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium text-ink mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
                placeholder="your@email.com"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-sm font-medium text-ink mb-1.5">Phone *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputCls}
                  placeholder="+254 712 345 678"
                />
              </div>
              <div>
                <label className="block text-body-sm font-medium text-ink mb-1.5">Country</label>
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in-up">
            <label className="block text-body-sm font-medium text-ink mb-1.5">Anything we should know? (optional)</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={cn(inputCls, "resize-none")}
              placeholder="Tell us about your condition, or paste a summary of your medical reports..."
            />
            <div className="flex items-center gap-2 mt-3 text-body-sm text-ink-light">
              <CheckCircle className="w-4 h-4 text-savings" />
              Free, no-obligation plan within 24 hours.
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3 pt-1">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-pill text-ink-muted hover:text-ink transition-colors text-body-base font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => canAdvance && setStep(step + 1)}
              disabled={!canAdvance}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-pill font-semibold transition-all active:scale-[0.97]",
                canAdvance ? "hover:bg-brand-700 hover:shadow-glow" : "opacity-50 cursor-not-allowed"
              )}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-pill font-semibold transition-all active:scale-[0.97]",
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-brand-700 hover:shadow-glow"
              )}
            >
              {loading ? "Sending..." : "Get Free Treatment Plan"}
              {!loading && <Send className="w-4 h-4" />}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
