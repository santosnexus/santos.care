"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ChevronDown, ShieldCheck } from "lucide-react";
import { cn, getWhatsAppUrl, WHATSAPP_NUMBER } from "@/lib/utils";
import { treatmentList } from "@/data/treatments";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [treatmentsOpen, setTreatmentsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-white/60 shadow-[0_1px_0_rgba(15,23,36,0.04),0_8px_30px_-12px_rgba(15,23,36,0.15)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm">HC</span>
            </div>
            <div className="leading-tight">
              <span className={cn("font-bold text-lg tracking-tight transition-colors", scrolled ? "text-brand-800" : "text-white")}>
                Heal India
              </span>
              <span className={cn("text-[11px] block leading-tight transition-colors", scrolled ? "text-ink-light" : "text-white/60")}>
                Medi Tourism
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            <div className="relative group">
              <button
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors py-2",
                  scrolled ? "text-ink hover:text-brand-600" : "text-white/90 hover:text-white"
                )}
                onMouseEnter={() => setTreatmentsOpen(true)}
                onMouseLeave={() => setTreatmentsOpen(false)}
              >
                Treatments <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {treatmentsOpen && (
                <div
                  className="absolute top-full left-0 w-64 glass rounded-card shadow-float border border-white/60 py-2"
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
                      className="block px-4 py-2.5 text-sm text-ink hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    >
                      {t.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/countries" className={cn("text-sm font-medium transition-colors", scrolled ? "text-ink hover:text-brand-600" : "text-white/90 hover:text-white")}>
              Destinations
            </Link>
            <Link href="/blog" className={cn("text-sm font-medium transition-colors", scrolled ? "text-ink hover:text-brand-600" : "text-white/90 hover:text-white")}>
              Blog
            </Link>
            <Link href="/about" className={cn("text-sm font-medium transition-colors", scrolled ? "text-ink hover:text-brand-600" : "text-white/90 hover:text-white")}>
              About
            </Link>
            <Link href="/faq" className={cn("text-sm font-medium transition-colors", scrolled ? "text-ink hover:text-brand-600" : "text-white/90 hover:text-white")}>
              FAQ
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                scrolled ? "text-savings hover:text-green-700" : "text-white hover:text-white/80"
              )}
            >
              <Phone className="w-4 h-4" />
              {WHATSAPP_NUMBER}
            </a>
            <Link
              href="/contact"
              className="bg-brand-600 text-white px-5 py-2.5 rounded-pill text-sm font-semibold hover:bg-brand-700 hover:shadow-glow transition-all active:scale-95"
            >
              Free Consultation
            </Link>
          </div>

          <button className={cn("lg:hidden p-2", scrolled ? "text-ink" : "text-white")} onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass border-t border-white/60">
          <div className="px-4 py-4 space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-ink-light uppercase tracking-wider">Treatments</p>
              {treatmentList.map((t) => (
                <Link
                  key={t.slug}
                  href={`/treatments/${t.slug}`}
                  className="block py-2 text-sm text-ink hover:text-brand-600"
                  onClick={() => setOpen(false)}
                >
                  {t.title}
                </Link>
              ))}
            </div>
            <Link href="/countries" className="block py-2 text-sm font-medium text-ink" onClick={() => setOpen(false)}>
              Destinations
            </Link>
            <Link href="/blog" className="block py-2 text-sm font-medium text-ink" onClick={() => setOpen(false)}>
              Blog
            </Link>
            <Link href="/about" className="block py-2 text-sm font-medium text-ink" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/faq" className="block py-2 text-sm font-medium text-ink" onClick={() => setOpen(false)}>
              FAQ
            </Link>
            <Link
              href="/contact"
              className="block text-center bg-brand-600 text-white px-5 py-3 rounded-pill text-sm font-semibold"
              onClick={() => setOpen(false)}
            >
              Free Consultation
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-savings font-medium text-sm py-2"
            >
              <ShieldCheck className="w-4 h-4" /> WhatsApp: {WHATSAPP_NUMBER}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
