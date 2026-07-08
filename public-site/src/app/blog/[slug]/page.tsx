import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { ArrowLeft, Calendar, Clock, MessageCircle, Share2 } from "lucide-react";
import { getBlogPost, getRelatedPosts } from "@/lib/mdx";
import { getWhatsAppUrl } from "@/lib/utils";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/json-ld";
import TableOfContents from "@/components/TableOfContents";

export const dynamicParams = false;

export async function generateStaticParams() {
  const fs = await import("fs");
  const path = await import("path");
  const blogDir = path.join(process.cwd(), "src/content/blog");
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() || (e.isFile() && e.name.endsWith(".mdx")))
    .map((e) => ({
      slug: e.isDirectory() ? e.name : e.name.replace(/\.mdx$/, ""),
    }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.frontmatter.metaTitle,
    description: post.frontmatter.metaDescription,
    openGraph: {
      title: post.frontmatter.metaTitle,
      description: post.frontmatter.metaDescription,
    },
  };
}

const mdxComponents = {
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse my-8 rounded-xl overflow-hidden shadow-sm" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-brand-600 text-white" {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="text-left px-4 py-3 text-sm font-semibold" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="bg-brand-50 border-l-4 border-brand-500 rounded-r-xl px-6 py-5 my-8 not-italic" {...props} />
  ),
};

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const { frontmatter, content } = post;
  const related = getRelatedPosts(frontmatter.slug);

  return (
    <>
      <JsonLd data={articleSchema({ ...frontmatter, slug: params.slug })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://santos.care" },
          { name: "Blog", url: "https://santos.care/blog" },
          { name: frontmatter.title, url: `https://santos.care/blog/${params.slug}` },
        ])}
      />
      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-40">
        <div
          className="h-full bg-brand-600 transition-all duration-150"
          style={{ width: "0%" }}
          id="progress-bar"
        />
      </div>

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={frontmatter.image}
            alt={frontmatter.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-800/90 to-brand-700/80" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-sm text-brand-300 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-brand-200 truncate max-w-[200px] sm:max-w-none">{frontmatter.title}</span>
          </nav>
          <div className="flex items-center flex-wrap gap-3 text-sm text-brand-200 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {frontmatter.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {frontmatter.readTime}
            </span>
            <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs font-medium backdrop-blur">
              {frontmatter.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {frontmatter.title}
          </h1>
        </div>
      </section>

      <article className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:gap-10">
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <TableOfContents />
            </aside>
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="prose prose-gray max-w-none">
                <MDXRemote
                  source={content}
                  components={mdxComponents}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
                    },
                  }}
                />
              </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Published: <strong>{frontmatter.date}</strong> &middot; by{" "}
                <strong>{frontmatter.author}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 mr-1">Share:</span>
                <a
                  href={getWhatsAppUrl(
                    `I read this article: ${frontmatter.title} - https://santos.care/blog/${frontmatter.slug}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  title="Share on WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(frontmatter.title)}&url=https://santos.care/blog/${frontmatter.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share on X (Twitter)"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a
                  href={`https://linkedin.com/sharing/share-offsite/?url=https://santos.care/blog/${frontmatter.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(`https://santos.care/blog/${frontmatter.slug}`)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy link"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 bg-gradient-to-r from-brand-50 to-brand-100 rounded-xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Need a Personalized Treatment Plan?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our medical team will review your reports and provide a written treatment plan with
                  transparent pricing within 24 hours. Completely free and no obligation.
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
                    className="bg-green-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors text-center flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" /> Send Reports on WhatsApp
                  </a>
                </div>
              </div>
            </div>
            </div>
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
                  className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Calendar className="w-3 h-3" />
                    {r.date}
                    <span className="bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded text-xs ml-1">
                      {r.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors mb-2 line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('scroll', function() {
              var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
              var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
              var scrolled = (winScroll / height) * 100;
              var bar = document.getElementById('progress-bar');
              if (bar) bar.style.width = scrolled + '%';
            });
          `,
        }}
      />
    </>
  );
}
