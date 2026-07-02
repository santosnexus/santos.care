import Link from "next/link";
import { countryList } from "@/data/countries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Tourism to India by Country | Heal India",
  description: "See how patients from Kenya, UK, UAE, Tanzania, Nigeria, and Oman benefit from medical treatment in India. Country-specific cost comparisons and guides.",
};

export default function CountriesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Medical Tourism to India
          </h1>
          <p className="text-xl text-brand-200 max-w-2xl">
            Country-specific guides comparing healthcare costs and treatment options. See how much you can save.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {countryList.map((c) => (
              <Link
                key={c.slug}
                href={`/countries/${c.slug}`}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <h2 className="font-semibold text-gray-900">{c.name}</h2>
                    <p className="text-sm text-gray-500">{c.region}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{c.overview}</p>
                <div className="flex flex-wrap gap-2">
                  {c.treatments.map((t) => (
                    <span key={t} className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
