import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { rehypeCostBars } from "./rehype-cost-bars";
import { remarkPullquote } from "./remark-pullquote";

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
  const html = String(unified().use(remarkParse).use(remarkGfm).use(remarkPullquote).use(remarkRehype).use(rehypeCostBars).use(rehypeStringify).processSync(mdx));
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

// ---------------------------------------------------------------------------
// Internal-linking helpers for country / treatment detail pages
// ---------------------------------------------------------------------------

const countryGuideSlugs: Record<string, string[]> = {
  kenya: [
    "medical-trip-india-from-kenya-guide",
    "india-medical-visa-guide-kenya-tanzania",
    "patient-story-margaret-heart-surgery-kenya",
    "cardiac-bypass-surgery-africa",
    "cancer-treatment-africa",
  ],
  tanzania: [
    "medical-tourism-tanzania-india-guide",
    "india-medical-visa-guide-kenya-tanzania",
    "cardiac-bypass-surgery-africa",
    "cancer-treatment-africa",
  ],
  nigeria: [
    "cardiac-bypass-surgery-africa",
    "cancer-treatment-africa",
    "cancer-treatment-india-doctor-profiles-hospitals",
  ],
  uae: [
    "heart-bypass-surgery-cost-in-india",
    "knee-hip-replacement-cost-india-uk-uae",
    "dental-tourism-kerala",
    "medical-tourism-india-vs-thailand-turkey",
  ],
  uk: [
    "why-europeans-choose-india-surgery",
    "affordable-ivf-treatment-india-uk-europe",
    "dental-tourism-kerala-full-guide",
    "knee-hip-replacement-cost-india-uk-uae",
    "patient-story-saved-40000-india-surgery",
  ],
  oman: [
    "joint-replacement-oman-gcc",
    "medical-tourism-india-vs-thailand-turkey",
    "dental-tourism-kerala",
  ],
};

const treatmentGuideSlugs: Record<string, string[]> = {
  cardiac: [
    "heart-bypass-surgery-cost-in-india",
    "cardiac-bypass-surgery-africa",
    "patient-story-margaret-heart-surgery-kenya",
  ],
  orthopedics: [
    "knee-hip-replacement-cost-india-uk-uae",
    "joint-replacement-oman-gcc",
    "orthopedic-surgery-india-hip-knee-spine-comparison",
    "spine-surgery-india-cost-hospitals-recovery",
  ],
  ivf: [
    "ivf-treatment-cost-india-international-patients",
    "affordable-ivf-treatment-india-uk-europe",
    "ivf-success-rates-india-data",
  ],
  oncology: [
    "cancer-treatment-india-doctor-profiles-hospitals",
    "cancer-treatment-africa",
    "brain-tumor-surgery-india-cost-hospitals",
  ],
  cosmetic: ["cosmetic-surgery-cost-india-international-patients"],
  dental: ["dental-tourism-kerala-full-guide", "dental-tourism-kerala"],
  "weight-loss": ["ayush-prana-post-surgery-ayurveda-recovery"],
  neurology: [
    "ms-treatment-india-cost-guide",
    "brain-tumor-surgery-india-cost-hospitals",
  ],
};

function fillFromSlugs(
  slugs: string[],
  extras: { category: string; count: number }
): BlogFrontmatter[] {
  const all = getAllBlogPosts();
  const ordered = slugs
    .map((s) => all.find((p) => p.frontmatter.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const used = new Set(ordered.map((p) => p.frontmatter.slug));
  const fallback = all.filter(
    (p) =>
      !used.has(p.frontmatter.slug) &&
      (p.frontmatter.category === extras.category ||
        p.frontmatter.category === "Patient Guides" ||
        p.frontmatter.category === "Country Guides")
  );
  return [...ordered, ...fallback]
    .slice(0, extras.count)
    .map((p) => p.frontmatter);
}

export function getPostsByCountry(
  countrySlug: string,
  count = 4
): BlogFrontmatter[] {
  return fillFromSlugs(countryGuideSlugs[countrySlug] ?? [], {
    category: "Country Guides",
    count,
  });
}

export function getPostsByTreatment(
  treatmentSlug: string,
  count = 4
): BlogFrontmatter[] {
  return fillFromSlugs(treatmentGuideSlugs[treatmentSlug] ?? [], {
    category: "Patient Guides",
    count,
  });
}
