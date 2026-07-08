"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/Reveal";

interface CostData {
  country: string;
  cost: number;
  currency?: string;
  flag?: string;
}

interface ProcedureCost {
  procedure: string;
  savings: string;
  countries: CostData[];
}

const categories = [
  { id: "cardiac", label: "Cardiac" },
  { id: "orthopedic", label: "Orthopedic" },
  { id: "fertility", label: "Fertility" },
  { id: "dental", label: "Dental" },
  { id: "cosmetic", label: "Cosmetic" },
  { id: "oncology", label: "Oncology" },
];

const procedures: Record<string, ProcedureCost[]> = {
  cardiac: [
    {
      procedure: "CABG (Bypass Surgery)",
      savings: "85%",
      countries: [
        { country: "USA", cost: 120000, flag: "🇺🇸" },
        { country: "UK", cost: 65000, flag: "🇬🇧" },
        { country: "Thailand", cost: 28000, flag: "🇹🇭" },
        { country: "India", cost: 10000, flag: "🇮🇳" },
      ],
    },
    {
      procedure: "Heart Valve Replacement",
      savings: "80%",
      countries: [
        { country: "USA", cost: 80000, flag: "🇺🇸" },
        { country: "UK", cost: 45000, flag: "🇬🇧" },
        { country: "Thailand", cost: 22000, flag: "🇹🇭" },
        { country: "India", cost: 8500, flag: "🇮🇳" },
      ],
    },
  ],
  orthopedic: [
    {
      procedure: "Hip Replacement",
      savings: "88%",
      countries: [
        { country: "USA", cost: 50000, flag: "🇺🇸" },
        { country: "UK", cost: 28000, flag: "🇬🇧" },
        { country: "Thailand", cost: 13000, flag: "🇹🇭" },
        { country: "India", cost: 6200, flag: "🇮🇳" },
      ],
    },
    {
      procedure: "Knee Replacement",
      savings: "86%",
      countries: [
        { country: "USA", cost: 55000, flag: "🇺🇸" },
        { country: "UK", cost: 30000, flag: "🇬🇧" },
        { country: "Thailand", cost: 14000, flag: "🇹🇭" },
        { country: "India", cost: 7000, flag: "🇮🇳" },
      ],
    },
  ],
  fertility: [
    {
      procedure: "IVF Cycle",
      savings: "70%",
      countries: [
        { country: "USA", cost: 18000, flag: "🇺🇸" },
        { country: "UK", cost: 10000, flag: "🇬🇧" },
        { country: "Thailand", cost: 6000, flag: "🇹🇭" },
        { country: "India", cost: 2800, flag: "🇮🇳" },
      ],
    },
  ],
  dental: [
    {
      procedure: "Dental Implants (per tooth)",
      savings: "75%",
      countries: [
        { country: "USA", cost: 5000, flag: "🇺🇸" },
        { country: "UK", cost: 3500, flag: "🇬🇧" },
        { country: "Thailand", cost: 1800, flag: "🇹🇭" },
        { country: "India", cost: 800, flag: "🇮🇳" },
      ],
    },
  ],
  cosmetic: [
    {
      procedure: "Tummy Tuck",
      savings: "80%",
      countries: [
        { country: "USA", cost: 15000, flag: "🇺🇸" },
        { country: "UK", cost: 12000, flag: "🇬🇧" },
        { country: "Thailand", cost: 5000, flag: "🇹🇭" },
        { country: "India", cost: 3500, flag: "🇮🇳" },
      ],
    },
  ],
  oncology: [
    {
      procedure: "Radiation Therapy (course)",
      savings: "75%",
      countries: [
        { country: "USA", cost: 40000, flag: "🇺🇸" },
        { country: "UK", cost: 25000, flag: "🇬🇧" },
        { country: "Thailand", cost: 12000, flag: "🇹🇭" },
        { country: "India", cost: 6000, flag: "🇮🇳" },
      ],
    },
  ],
};

function CostBar({ country, cost, flag, maxCost }: CostData & { maxCost: number }) {
  const width = (cost / maxCost) * 100;
  const isCheapest = cost === 0 ? false : cost <= Math.min(...procedures.cardiac.flatMap(p => p.countries.map(c => c.cost))); // simplified

  return (
    <div className="flex items-center gap-3 group">
      <span className="w-8 text-lg flex-shrink-0">{flag}</span>
      <span className="w-12 text-sm font-medium text-ink-muted flex-shrink-0">{country}</span>
      <div className="flex-1 h-7 bg-surface-soft rounded-pill overflow-hidden relative">
        <div
          className={cn(
            "h-full rounded-pill transition-all duration-1000 ease-out",
            isCheapest ? "bg-savings" : "bg-brand-200"
          )}
          style={{ width: `${100 - width + 10}%` }}
        />
      </div>
      <span className="w-24 text-right text-sm font-semibold text-ink tabular-nums">
        ${cost.toLocaleString()}
      </span>
    </div>
  );
}

export function InteractiveCostComparison() {
  const [activeCategory, setActiveCategory] = useState("cardiac");

  const currentProcedures = procedures[activeCategory] || [];

  return (
    <div className="my-8">
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200",
              activeCategory === cat.id
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-surface-soft text-ink-muted hover:bg-surface-muted"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {currentProcedures.map((proc, i) => {
          const maxCost = Math.max(...proc.countries.map(c => c.cost));
          const cheapest = proc.countries.reduce((min, c) => c.cost < min.cost ? c : min);

          return (
            <Reveal key={proc.procedure} variant="slide-up" delay={i * 100}>
              <div className="bg-surface rounded-card p-6 border border-gray-100 shadow-card">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-semibold text-ink">{proc.procedure}</h4>
                  <Badge variant="savings" size="lg">
                    Save {proc.savings}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {proc.countries.map((c) => (
                    <CostBar key={c.country} {...c} maxCost={maxCost} />
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-ink-muted">
                  Cheapest: <strong className="text-savings">{cheapest.flag} {cheapest.country}</strong> — ${cheapest.cost.toLocaleString()}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
