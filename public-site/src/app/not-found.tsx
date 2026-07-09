import Link from "next/link";
import { ArrowLeft, Stethoscope } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 flex items-center justify-center">
      <div className="text-center px-4 max-w-lg">
        <Stethoscope className="w-20 h-20 text-brand-300 mx-auto mb-6" />
        <h1 className="text-7xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-brand-200 mb-2">Page Not Found</p>
        <p className="text-brand-200/80 mb-8">
          This page doesn&apos;t exist or may have been moved. Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white px-6 py-3 rounded-lg font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all backdrop-blur"
          >
            Browse Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
