import { Stethoscope } from "lucide-react";

export default function AuthorBio({ author }: { author?: string }) {
  return (
    <div className="flex items-start gap-4 bg-brand-50 rounded-xl p-5 mt-10 border border-brand-100">
      <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
        <Stethoscope className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-0.5">
          Medically reviewed by
        </p>
        <p className="font-semibold text-ink">{author || "Heal India Medical Team"}</p>
        <p className="text-sm text-ink-muted mt-1 leading-relaxed">
          The Heal India medical team comprises international patient coordinators and verified specialists
          across cardiac, orthopedic, oncology, IVF, and dental care in Kerala&apos;s JCI-accredited hospitals.
        </p>
      </div>
    </div>
  );
}
