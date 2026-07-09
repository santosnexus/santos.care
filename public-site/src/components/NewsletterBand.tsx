"use client";

import { useState } from "react";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

export default function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email,
          source: "NEWSLETTER",
        }),
      });
      if (res.ok) setSubmitted(true);
      else setError("Something went wrong. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-warm border border-surface-muted/70 rounded-card p-7 sm:p-9 my-10">
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Mail className="w-3.5 h-3.5" /> Monthly insights
          </div>
          <h3 className="text-display-h3 text-ink mb-2">Get our medical-tourism guides in your inbox</h3>
          <p className="text-body-base text-ink-muted">
            Practical cost guides, real patient stories, and visa tips — once a month, no spam. Unsubscribe anytime.
          </p>
        </div>
        <div className="w-full md:w-auto md:min-w-[22rem]">
          {submitted ? (
            <div className="flex items-center gap-3 bg-savings-light text-savings rounded-pill px-5 py-3.5">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium text-sm">You&apos;re subscribed — welcome aboard!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 px-4 py-3 rounded-pill border border-surface-muted focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-body-base bg-surface"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-pill font-semibold hover:bg-brand-700 hover:shadow-glow transition-all active:scale-95 disabled:opacity-60 whitespace-nowrap"
              >
                {loading ? "..." : "Subscribe"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
