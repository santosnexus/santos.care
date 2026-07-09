import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, MessageCircle, Share2 } from "lucide-react";
import { getBlogPost, getAllBlogPosts, getRelatedPosts, precompileMdxToHtml } from "@/lib/mdx";
import { getWhatsAppUrl } from "@/lib/utils";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/json-ld";
import TableOfContents from "@/components/TableOfContents";
import AuthorBio from "@/components/AuthorBio";

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

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const { frontmatter, content } = post;
  const htmlContent = precompileMdxToHtml(content);
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
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
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
              <div
                className="prose prose-gray max-w-none blog-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
              <AuthorBio author={frontmatter.author} />
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
