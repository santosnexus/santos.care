import type { MetadataRoute } from "next";
import { treatmentList } from "@/data/treatments";
import { countryList } from "@/data/countries";
import { blogPosts } from "@/data/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://santos.care";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/about", "/contact", "/blog", "/countries", "/faq", "/visa-guide", "/privacy"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1.0 : 0.8,
    })
  );

  const treatmentRoutes = treatmentList.map((t) => ({
    url: `${SITE_URL}/treatments/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const countryRoutes = countryList.map((c) => ({
    url: `${SITE_URL}/countries/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = blogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...treatmentRoutes, ...countryRoutes, ...blogRoutes];
}
