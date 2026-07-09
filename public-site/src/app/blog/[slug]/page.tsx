import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, MessageCircle, Share2, User } from "lucide-react";
import { getBlogPost, getAllBlogPosts, getRelatedPosts, precompileMdxToHtml } from "@/lib/mdx";
import { getWhatsAppUrl } from "@/lib/utils";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/json-ld";
import TableOfContents from "@/components/TableOfContents";
import AuthorBio from "@/components/AuthorBio";
import ArticleShareRail from "@/components/ArticleShareRail";
import InlineArticleCTA from "@/components/InlineArticleCTA";

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

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.frontmatter.slug }));
}

function wordCount(md: string): number {
  const text = md.replace(/[#>*_`~\-]/g, " ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const { frontmatter, content } = post;
  const htmlContent = precompileMdxToHtml(content);
  const words = wordCount(content);
  const related = getRelatedPosts(frontmatter.slug);

  // Insert a mid-article CTA at the paragraph nearest the middle of the post.
  const mid = htmlContent.indexOf("</p>", Math.floor(htmlContent.length / 2));
  const before = mid > -1 ? htmlContent.slice(0, mid + 4) : htmlContent;
  const after = mid > -1 ? htmlContent.slice(mid + 4) : "";

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
      <ArticleShareRail title={frontmatter.title} />

      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-40">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-accent transition-all duration-150"
          style={{ width: "0%" }}
          id="progress-bar"
        />
      </div>

      {/* ───── Editorial hero ───── */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-mesh animate-gradient-pan text-white">
        <div className="absolute inset-0">
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-900/85 to-brand-900/60" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-sm text-brand-200 mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-brand-100 truncate max-w-[200px] sm:max-w-none">{frontmatter.category}</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur mb-4">
            {frontmatter.category}
          </span>
          <h1 className="text-display-hero text-white leading-tight text-balance">{frontmatter.title}</h1>
          <p className="mt-5 text-body-lg text-white/75 max-w-2xl leading-relaxed">{frontmatter.excerpt}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-sm text-brand-100">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> {frontmatter.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {frontmatter.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {frontmatter.readTime}
            </span>
            <span className="text-brand-200/80">· {words} words</span>
          </div>
        </div>
      </section>

      <article className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:gap-12">
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <TableOfContents />
            </aside>
            <div className="flex-1 min-w-0 max-w-[44rem]">
              <div
                className="prose prose-gray blog-content"
                dangerouslySetInnerHTML={{ __html: before }}
              />
              <InlineArticleCTA source="BLOG_MID" />
              <div
                className="prose prose-gray blog-content"
                dangerouslySetInnerHTML={{ __html: after }}
              />
              <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6">
                <Share2 className="w-4 h-4 text-ink-light" />
                <span className="text-sm text-ink-muted">Found this useful? Share it with someone who needs it.</span>
                <a
                  href={getWhatsAppUrl(`Check out this article: ${frontmatter.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 text-savings font-medium text-sm hover:text-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Share on WhatsApp
                </a>
              </div>
              <AuthorBio author={frontmatter.author} />
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-16 bg-surface-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Keep reading</span>
                <h2 className="text-display-h2 text-ink mt-1">Related Articles</h2>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-brand-600 font-medium text-sm hover:gap-2.5 transition-all">
                View all <ArrowRightInline />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group bg-surface rounded-card border border-gray-100/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 text-ink text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur shadow-sm">
                      {r.category}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-ink-light mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-ink group-hover:text-brand-700 transition-colors mb-2 line-clamp-2 leading-snug">
                      {r.title}
                    </h3>
                    <p className="text-sm text-ink-muted line-clamp-2 mb-3 flex-1">{r.excerpt}</p>
                    <span className="text-sm font-medium text-brand-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      Read article <ArrowRightInline />
                    </span>
                  </div>
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

function ArrowRightInline() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
