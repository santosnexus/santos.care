"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-4xl font-bold text-red-600">Critical Error</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              {error.message || "A critical error occurred. Please reload the page."}
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
