import Link from "next/link";
import { CalendarCheck, ArrowRight } from "lucide-react";

export default function InlineArticleCTA({ source }: { source?: string }) {
  return (
    <div className="my-10 rounded-card bg-gradient-to-br from-brand-700 to-brand-900 p-7 sm:p-9 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 text-brand-100 px-3 py-1 rounded-full text-xs font-medium mb-3 backdrop-blur">
            <CalendarCheck className="w-3.5 h-3.5" /> Free, no obligation
          </div>
          <h3 className="text-display-h3 text-white mb-2">Get a free treatment plan for your case</h3>
          <p className="text-white/75 text-body-base">
            Send your medical reports and our specialists will reply within 24 hours with a written plan and
            transparent pricing — tailored to your condition.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-surface text-brand-700 px-7 py-3.5 rounded-pill font-semibold hover:bg-surface-soft transition-all active:scale-95 whitespace-nowrap"
          >
            Get Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
