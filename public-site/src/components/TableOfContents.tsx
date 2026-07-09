"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const headings = document.querySelectorAll("article h2, article h3");
    const tocItems: TocItem[] = Array.from(headings).map((h) => ({
      id: h.id,
      text: (h as HTMLElement).innerText || "",
      level: h.tagName === "H2" ? 2 : 3,
    }));
    setItems(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (items.length < 2) return null;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-6 z-50 lg:hidden p-3 rounded-full bg-surface border border-surface-muted shadow-lg"
        aria-label="Table of contents"
      >
        <List className="w-5 h-5 text-ink-muted" />
      </button>

      {/* Desktop sidebar */}
      <nav className="hidden lg:block sticky top-24 w-56 flex-shrink-0 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h3 className="text-sm font-semibold text-ink mb-3 uppercase tracking-wider">
          On this page
        </h3>
        <ul className="space-y-1 border-l-2 border-surface-muted">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`block text-sm py-1.5 transition-colors ${
                  item.level === 3 ? "pl-6" : "pl-3"
                } ${
                  activeId === item.id
                    ? "text-brand-600 border-l-2 -ml-0.5 border-brand-600 font-medium"
                    : "text-ink-light hover:text-ink border-l-2 -ml-0.5 border-transparent"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl shadow-xl z-50 lg:hidden max-h-[50vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">
                On this page
              </h3>
              <button onClick={() => setOpen(false)} className="text-ink-light hover:text-ink-muted">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                      setOpen(false);
                    }}
                    className={`block text-sm py-1.5 ${
                      item.level === 3 ? "pl-4" : ""
                    } ${
                      activeId === item.id ? "text-brand-600 font-medium" : "text-ink-muted"
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
