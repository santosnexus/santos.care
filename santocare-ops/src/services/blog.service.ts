import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";
import type { BlogPostStatus } from "@prisma/client";

export interface CreateBlogPostInput {
  tenantId: string;
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string;
  imageUrl?: string | null;
  category?: string | null;
  tags?: string[];
  status?: BlogPostStatus;
  author?: string | null;
  publishDate?: string | null;
  createdById: string;
}

function generateSlug(title: string): string {
  let slug = slugify(title);
  if (!slug) slug = `post-${Date.now()}`;
  return slug;
}

export async function createBlogPost(input: CreateBlogPostInput) {
  const { createdById, ...rest } = input;
  const slug = rest.slug || generateSlug(rest.title);

  const post = await prisma.blogPost.create({
    data: {
      ...rest,
      slug,
      tags: rest.tags || [],
      publishDate: rest.publishDate ? new Date(rest.publishDate) : null,
    },
  });

  await logAudit({
    tenantId: input.tenantId,
    userId: createdById,
    action: "CREATE",
    entityType: "BlogPost",
    entityId: post.id,
    after: { title: post.title, slug: post.slug, status: post.status },
  });

  return post;
}

export async function updateBlogPost(
  tenantId: string,
  id: string,
  data: Partial<Omit<CreateBlogPostInput, "tenantId" | "createdById">>,
  updatedById: string
) {
  const before = await prisma.blogPost.findUnique({ where: { id, tenantId } });
  if (!before) throw new Error("Blog post not found");

  const updateData: any = { ...data };
  if (data.publishDate !== undefined) {
    updateData.publishDate = data.publishDate ? new Date(data.publishDate) : null;
  }
  if (data.slug) {
    updateData.slug = data.slug;
  }

  const post = await prisma.blogPost.update({
    where: { id, tenantId },
    data: updateData,
  });

  await logAudit({
    tenantId,
    userId: updatedById,
    action: "UPDATE",
    entityType: "BlogPost",
    entityId: id,
    before: { title: before.title, status: before.status },
    after: { title: post.title, status: post.status },
  });

  return post;
}

export async function deleteBlogPost(tenantId: string, id: string, deletedById: string) {
  const post = await prisma.blogPost.findUnique({ where: { id, tenantId } });
  if (!post) throw new Error("Blog post not found");

  await prisma.blogPost.delete({ where: { id, tenantId } });

  await logAudit({
    tenantId,
    userId: deletedById,
    action: "DELETE",
    entityType: "BlogPost",
    entityId: id,
    before: { title: post.title, slug: post.slug },
  });

  return { id };
}

export async function getBlogPost(tenantId: string, id: string) {
  return prisma.blogPost.findFirst({ where: { id, tenantId } });
}

export async function getBlogPostBySlug(slug: string, tenantId?: string) {
  const where: any = { slug };
  if (tenantId) where.tenantId = tenantId;
  return prisma.blogPost.findFirst({ where });
}

export interface ListBlogPostsOptions {
  status?: BlogPostStatus;
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export async function listBlogPosts(
  tenantId: string,
  opts: ListBlogPostsOptions = {}
) {
  const {
    status,
    category,
    search,
    page = 1,
    pageSize = 20,
    sortBy = "createdAt",
    sortDir = "desc",
  } = opts;

  const where: any = { tenantId };
  if (status) where.status = status;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: any = {};
  orderBy[sortBy] = sortDir;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { posts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
