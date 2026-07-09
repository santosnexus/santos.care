"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogFrontmatter } from "@/lib/mdx";
import NewsletterBand from "@/components/NewsletterBand";

const ITEMS_PER_PAGE = 6;

export default function BlogPageClient({ posts }: { posts: BlogFrontmatter[] }) {
  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return ["All", ...Array.from(cats).sort()];
  }, [posts]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [posts]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery, posts]);

  const visiblePosts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const featured = visiblePosts.length > 0 ? visiblePosts[0] : null;
  const rest = featured ? visiblePosts.slice(1) : visiblePosts;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1600&q=80"
            alt="Medical professional reviewing documents"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-800/90 to-brand-700/80" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Medical Tourism Blog
          </h1>
          <p className="text-xl text-brand-200 max-w-2xl">
            Real patient experiences, expert cost guides, and practical advice for your medical
            treatment journey to India.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                  {cat !== "All" && (
                    <span className="ml-1.5 text-xs opacity-70">({categoryCounts[cat] || 0})</span>
                  )}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"} found
            {activeCategory !== "All" && ` in ${activeCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h2>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
               {featured && activeCategory === "All" && searchQuery === "" && (
                 <Link
                   href={`/blog/${featured.slug}`}
                   className="group block bg-white rounded-card overflow-hidden border border-gray-100/60 shadow-card hover:shadow-card-hover transition-all mb-10"
                 >
                   <div className="grid md:grid-cols-2">
                        <div className="relative min-h-[280px] overflow-hidden">
                        <Image
                          src={featured.image}
                          alt={featured.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                       <div className="absolute bottom-4 left-4">
                         <span className="inline-block bg-brand-600 text-white text-sm px-3 py-1 rounded-full">
                           Featured Article
                         </span>
                       </div>
                     </div>
                     <div className="p-8 flex flex-col justify-center">
                       <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                         <span className="flex items-center gap-1">
                           <Calendar className="w-3 h-3" />
                           {featured.date}
                         </span>
                         <span className="flex items-center gap-1">
                           <Clock className="w-3 h-3" />
                           {featured.readTime}
                         </span>
                         <span className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded text-xs font-medium">
                           {featured.category}
                         </span>
                       </div>
                       <h2 className="text-2xl font-bold text-gray-900 group-hover:text-brand-700 transition-colors mb-3">
                         {featured.title}
                       </h2>
                       <p className="text-gray-600 mb-4 line-clamp-3">{featured.excerpt}</p>
                       <span className="text-sm font-medium text-brand-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                         Read Full Article <ArrowRight className="w-4 h-4" />
                       </span>
                     </div>
                   </div>
                 </Link>
               )}

              <NewsletterBand />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeCategory !== "All" || searchQuery !== "" ? visiblePosts : rest).map(
                  (post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group bg-white rounded-card overflow-hidden border border-gray-100/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    >
                       <div className="relative h-44 overflow-hidden">
                         <Image
                           src={post.image}
                           alt={post.title}
                           fill
                           sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                           className="object-cover group-hover:scale-105 transition-transform duration-300"
                           loading="lazy"
                         />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium backdrop-blur shadow-sm">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <h2 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors mb-2 line-clamp-2 flex-1">
                          {post.title}
                        </h2>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                        <span className="text-sm font-medium text-brand-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                          Read More <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  )
                )}
              </div>

              {hasMore && (
                <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                  className="bg-white border border-gray-200 text-gray-700 px-7 py-3.5 rounded-pill font-medium hover:bg-surface-soft hover:border-brand-300 transition-all"
                >
                  Load More Articles ({filtered.length - visibleCount} remaining)
                </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Closing CTA band */}
      <section className="relative overflow-hidden bg-mesh animate-gradient-pan text-white">
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative text-center">
          <h2 className="text-display-h2 text-white mb-4 text-balance">
            Ready to plan your treatment in India?
          </h2>
          <p className="text-white/75 text-body-lg mb-8 max-w-2xl mx-auto">
            Explore our guides, then get a free, written treatment plan with transparent pricing — within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-brand-700 px-8 py-4 rounded-pill font-semibold hover:bg-brand-50 transition-all active:scale-95 inline-flex items-center justify-center gap-2"
            >
              Get Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/treatments"
              className="bg-white/10 text-white px-8 py-4 rounded-pill font-semibold hover:bg-white/20 transition-all active:scale-95 inline-flex items-center justify-center gap-2 border border-white/30"
            >
              Browse Treatments
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
