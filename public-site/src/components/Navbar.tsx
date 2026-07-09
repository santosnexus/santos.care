"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn, getWhatsAppUrl, WHATSAPP_NUMBER } from "@/lib/utils";
import { treatmentList } from "@/data/treatments";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [treatmentsOpen, setTreatmentsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">HC</span>
            </div>
            <div>
              <span className="font-bold text-lg text-brand-800">Heal India</span>
              <span className="text-xs text-gray-500 block leading-tight">Medi Tourism</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors py-2"
                onMouseEnter={() => setTreatmentsOpen(true)}
                onMouseLeave={() => setTreatmentsOpen(false)}
              >
                Treatments <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {treatmentsOpen && (
                <div
                  className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                  onMouseEnter={() => setTreatmentsOpen(true)}
                  onMouseLeave={() => setTreatmentsOpen(false)}
                >
                  <Link
                    href="/treatments"
                    className="block px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
                  >
                    View all treatments →
                  </Link>
                  {treatmentList.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/treatments/${t.slug}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    >
                      {t.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/countries" className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
              Destinations
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
              About
            </Link>
            <Link href="/faq" className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
              FAQ
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              {WHATSAPP_NUMBER}
            </a>
            <Link
              href="/contact"
              className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Free Consultation
            </Link>
          </div>

          <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Treatments</p>
              {treatmentList.map((t) => (
                <Link
                  key={t.slug}
                  href={`/treatments/${t.slug}`}
                  className="block py-2 text-sm text-gray-700 hover:text-brand-600"
                  onClick={() => setOpen(false)}
                >
                  {t.title}
                </Link>
              ))}
            </div>
            <Link href="/countries" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setOpen(false)}>
              Destinations
            </Link>
            <Link href="/blog" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setOpen(false)}>
              Blog
            </Link>
            <Link href="/about" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/faq" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setOpen(false)}>
              FAQ
            </Link>
            <Link
              href="/contact"
              className="block text-center bg-brand-600 text-white px-5 py-3 rounded-lg text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              Free Consultation
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-green-600 font-medium text-sm py-2"
            >
              WhatsApp: {WHATSAPP_NUMBER}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
