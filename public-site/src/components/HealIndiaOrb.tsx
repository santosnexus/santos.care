"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const LotusScene = dynamic(() => import("./LotusScene"), {
  ssr: false,
  loading: () => <HealIndiaOrbFallback />,
});

function HealIndiaOrbFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-400/30 via-accent-400/20 to-brand-600/30 blur-2xl animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-brand-300/40 to-accent-300/30 animate-[spin_12s_linear_infinite]" />
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-brand-200 to-accent-200 blur-sm" />
      </div>
    </div>
  );
}

export function HealIndiaOrb() {
  return (
    <div className="w-full h-full min-h-[320px] md:min-h-[480px]">
      <Suspense fallback={<HealIndiaOrbFallback />}>
        <LotusScene />
      </Suspense>
    </div>
  );
}
