import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import { JsonLd, siteSchema } from "@/components/json-ld";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
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
    url: "https://santos.care",
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
  metadataBase: new URL("https://santos.care"),
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <JsonLd data={siteSchema()} />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ScrollToTop />
      </body>
    </html>
  );
}
