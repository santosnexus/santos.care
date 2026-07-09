"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-50 to-surface">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-brand-700 flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-xl">HC</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-800 mb-2">Something went wrong</h1>
          <p className="text-ink-light">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-surface text-brand-700 border border-brand-200 rounded-lg hover:bg-surface-soft transition-colors font-medium"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
