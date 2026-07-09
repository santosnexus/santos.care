"use client";

import { useEffect, useState } from "react";
import { Linkedin, Twitter, MessageCircle, Link2, Check } from "lucide-react";

export default function ArticleShareRail({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const share = (network: string) => {
    const encoded = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const map: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${t}`,
      whatsapp: `https://api.whatsapp.com/send?text=${t}%20${encoded}`,
    };
    if (map[network]) window.open(map[network], "_blank", "noopener,noreferrer");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  const btn =
    "w-10 h-10 rounded-full flex items-center justify-center text-ink-muted hover:text-white transition-all duration-200 bg-white shadow-card border border-gray-100 hover:bg-brand-600 hover:border-brand-600 hover:shadow-glow";

  return (
    <div className="hidden xl:flex flex-col items-center gap-3 fixed right-6 top-1/2 -translate-y-1/2 z-30">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-light [writing-mode:vertical-rl] mb-1">
        Share
      </span>
      <button onClick={() => share("linkedin")} className={btn} aria-label="Share on LinkedIn">
        <Linkedin className="w-4 h-4" />
      </button>
      <button onClick={() => share("twitter")} className={btn} aria-label="Share on X">
        <Twitter className="w-4 h-4" />
      </button>
      <button onClick={() => share("whatsapp")} className={btn} aria-label="Share on WhatsApp">
        <MessageCircle className="w-4 h-4" />
      </button>
      <button onClick={copy} className={btn} aria-label="Copy link">
        {copied ? <Check className="w-4 h-4 text-savings" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
