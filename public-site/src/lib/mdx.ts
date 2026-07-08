import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

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
  return { frontmatter: data as BlogFrontmatter, content };
}

export function getAllBlogPosts(): {
  frontmatter: BlogFrontmatter;
  content: string;
}[] {
  const slugs = getBlogSlugs();
  return slugs
    .map((slug) => getBlogPost(slug))
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
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
