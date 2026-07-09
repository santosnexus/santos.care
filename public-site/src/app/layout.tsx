import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { JsonLd, siteSchema, websiteSchema } from "@/components/json-ld";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://santos.care";

export const viewport = {
  themeColor: "#0d7377",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
  title: {
    default: "Heal India Medi Tourism | World-Class Medical Treatment in India",
    template: "%s | Heal India Medi Tourism",
  },
  description:
    "JCI-accredited hospitals, expert surgeons, and holistic Ayurveda recovery in Kerala. Save 70-90% on cardiac, orthopedic, IVF, cancer, cosmetic, and dental treatments. Free treatment plan in 24 hours.",
  keywords: [
    "medical tourism India",
    "treatment in India",
    "heart surgery India",
    "knee replacement India",
    "IVF treatment India",
    "cancer treatment India",
    "dental implants India",
    "Kerala medical tourism",
    "healthcare in India",
  ],
  openGraph: {
    title: "Heal India Medi Tourism | World-Class Medical Treatment in India",
    description:
      "JCI-accredited hospitals, expert surgeons, and holistic Ayurveda recovery in Kerala. Save 70-90% on treatment.",
    url: SITE_URL,
    siteName: "Heal India Medi Tourism",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heal India Medi Tourism",
    description: "World-class medical treatment in India at 70-90% less cost.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SmoothScroll>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
            >
              Skip to content
            </a>
            <JsonLd data={siteSchema()} />
            <JsonLd data={websiteSchema()} />
            <Navbar />
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <ScrollToTop />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
