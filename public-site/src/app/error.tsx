"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-4xl font-bold text-red-600">Something went wrong</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
