import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Tourism Blog | Heal India",
  description: "Expert guides on medical treatment costs in India, hospital selection, visa processes, and patient stories. Compare costs and plan your treatment journey.",
};

export default function BlogPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Medical Tourism Blog
          </h1>
          <p className="text-xl text-brand-200 max-w-2xl">
            Expert guides, cost comparisons, and patient stories to help you plan your medical treatment in India.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="bg-gradient-to-br from-brand-600 to-brand-800 h-48 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <div className="text-3xl font-bold mb-1">{post.category.split(" ")[0]}</div>
                    <div className="text-sm opacity-75">Guide</div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <h2 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
                  <span className="text-sm font-medium text-brand-600 group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
