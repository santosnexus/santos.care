import { getAllBlogPosts } from "@/lib/mdx";
import BlogPageClient from "./BlogPageClient";

export default function BlogPage() {
  const posts = getAllBlogPosts().map((p) => p.frontmatter);
  return <BlogPageClient posts={posts} />;
}
