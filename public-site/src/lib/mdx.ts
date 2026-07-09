import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { rehypeCostBars } from "./rehype-cost-bars";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

const _htmlCache = new Map<string, string>();

let _allPostsCache: {
  frontmatter: BlogFrontmatter;
  content: string;
}[] | null = null;

export interface BlogFrontmatter {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  targetAudience?: string;
  primaryKeywords?: string;
  secondaryKeywords?: string;
}

export function precompileMdxToHtml(mdx: string): string {
  const cached = _htmlCache.get(mdx);
  if (cached) return cached;
  const html = String(unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeCostBars).use(rehypeStringify).processSync(mdx));
  _htmlCache.set(mdx, html);
  return html;
}

export function getBlogSlugs(): string[] {
  const entries = fs.readdirSync(BLOG_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() || (e.isFile() && e.name.endsWith(".mdx")))
    .map((e) => {
      if (e.isDirectory()) return e.name;
      return e.name.replace(/\.mdx$/, "");
    });
}

export function getBlogPost(slug: string): {
  frontmatter: BlogFrontmatter;
  content: string;
} | null {
  const possiblePaths = [
    path.join(BLOG_DIR, `${slug}.mdx`),
    path.join(BLOG_DIR, slug, "page.mdx"),
    path.join(BLOG_DIR, slug, "index.mdx"),
  ];

  let filePath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }
  if (!filePath) return null;

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  if (_allPostsCache) {
    const cached = _allPostsCache.find((p) => p.frontmatter.slug === slug);
    if (cached) return cached;
  }
  return { frontmatter: data as BlogFrontmatter, content };
}

export function getAllBlogPosts(): {
  frontmatter: BlogFrontmatter;
  content: string;
}[] {
  if (_allPostsCache) return _allPostsCache;
  const slugs = getBlogSlugs();
  _allPostsCache = slugs
    .map((slug) => getBlogPost(slug))
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
  return _allPostsCache;
}

export function getRelatedPosts(
  currentSlug: string,
  count = 3
): BlogFrontmatter[] {
  const current = getBlogPost(currentSlug);
  if (!current) return [];
  const all = getAllBlogPosts();
  return all
    .filter(
      (p) =>
        p.frontmatter.slug !== currentSlug &&
        p.frontmatter.category === current.frontmatter.category
    )
    .slice(0, count)
    .map((p) => p.frontmatter);
}
