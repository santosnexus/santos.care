import Link from "next/link";
import { Stethoscope, ArrowRight } from "lucide-react";

export default function AuthorBio({ author }: { author?: string }) {
  const name = author || "Heal India Medical Team";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mt-12 rounded-card bg-surface-warm border border-surface-muted/70 p-7">
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="font-bold text-lg">{initials}</span>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-0.5">
            Medically reviewed by
          </p>
          <p className="font-bold text-ink text-lg">{name}</p>
          <p className="text-sm text-ink-muted mt-2 leading-relaxed">
            Our medical team comprises international patient coordinators and verified specialists across cardiac,
            orthopedic, oncology, IVF, and dental care in Kerala&apos;s JCI-accredited hospitals. Every guide is
            reviewed for clinical accuracy and current pricing.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/treatments"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:gap-2.5 transition-all"
            >
              Browse treatments <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-600 transition-colors"
            >
              <Stethoscope className="w-4 h-4" /> Get a free treatment plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
