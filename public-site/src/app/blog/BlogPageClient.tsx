"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import type { BlogFrontmatter } from "@/lib/mdx";

const categories = [
  "All",
  "Cardiac Surgery",
  "Orthopedics",
  "Fertility",
  "Oncology",
  "Dental",
  "Cosmetic Surgery",
  "Visas & Travel",
];

const ITEMS_PER_PAGE = 6;

export default function BlogPageClient({ posts }: { posts: BlogFrontmatter[] }) {
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

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

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
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h2>
              <p className="text-gray-500">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
            </div>
          ) : (
            <>
              {featured && activeCategory === "All" && searchQuery === "" && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all mb-10"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="bg-gradient-to-br from-brand-500 to-brand-800 min-h-[280px] flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-white/20 mb-2">{featured.category.split(" ")[0]}</div>
                        <span className="inline-block bg-white/20 text-white text-sm px-3 py-1 rounded-full">
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

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeCategory !== "All" || searchQuery !== "" ? visiblePosts : rest).map(
                  (post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute top-3 left-3 bg-brand-600/90 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur">
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
                    onClick={handleLoadMore}
                    className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 hover:border-brand-300 transition-all"
                  >
                    Load More Articles ({filtered.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
