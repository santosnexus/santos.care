import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Share2, MessageCircle } from "lucide-react";
import { blogPosts, getRelatedPosts } from "@/data/blog-posts";
import { getWhatsAppUrl } from "@/lib/utils";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

function renderContent(content: string) {
  const lines = content.split("\n\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) {
      return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{line.replace("## ", "")}</h2>;
    }
    if (line.startsWith("### ")) {
      return <h3 key={i} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{line.replace("### ", "")}</h3>;
    }
    if (line.startsWith("| ")) {
      const rows = line.split("\n").filter((r) => r.startsWith("|"));
      const headers = rows[0].split("|").filter(Boolean).map((h) => h.trim());
      const bodyRows = rows.slice(2).map((r) => r.split("|").filter(Boolean).map((c) => c.trim()));
      return (
        <div key={i} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-50">
                {headers.map((h, j) => (
                  <th key={j} className="text-left px-4 py-2 font-semibold text-gray-700 border border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, r) => (
                <tr key={r} className="border-b border-gray-100">
                  {row.map((cell, c) => (
                    <td key={c} className="px-4 py-2 text-gray-700 border border-gray-200">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (line.startsWith("- ")) {
      const items = line.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="list-disc list-inside space-y-1 my-3 text-gray-700">
          {items.map((item, j) => (
            <li key={j}>{item.replace("- ", "")}</li>
          ))}
        </ul>
      );
    }
    if (line.startsWith("**")) {
      return <p key={i} className="text-gray-700 leading-relaxed mb-4">{line.replace(/\*\*/g, "")}</p>;
    }
    return <p key={i} className="text-gray-700 leading-relaxed mb-4">{line}</p>;
  });
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug);

  return (
    <>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-brand-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 text-sm text-brand-200 mb-4">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime}</span>
            <span className="bg-brand-700 text-brand-200 px-2 py-0.5 rounded text-xs">{post.category}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      <article className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            {renderContent(post.content)}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Published: {post.date} &middot; by {post.author}
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={getWhatsAppUrl(`I read this article: ${post.title} - https://santos.care/blog/${post.slug}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                >
                  <Share2 className="w-4 h-4" /> Share on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 bg-brand-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need a Personalized Treatment Plan?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our medical team will review your reports and provide a written treatment plan with transparent pricing within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors text-center"
              >
                Get Free Consultation
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors text-center"
              >
                <MessageCircle className="w-4 h-4 inline mr-1" /> Send Reports on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Calendar className="w-3 h-3" />{r.date}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{r.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
