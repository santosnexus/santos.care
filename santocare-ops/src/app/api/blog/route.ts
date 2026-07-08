import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { createBlogPost, listBlogPosts } from "@/services/blog.service";

const ListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.enum(["createdAt", "title", "publishDate", "status"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]).optional(),
  author: z.string().optional().nullable(),
  publishDate: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "blog:read");
  if (!auth.ok) return auth.response;

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { page, limit, search, status, category, sortBy, sortDir } = parsed.data;

  const { posts, total } = await listBlogPosts(auth.user.tenantId, {
    page,
    pageSize: limit,
    search,
    status: status as any,
    category,
    sortBy,
    sortDir,
  });

  return NextResponse.json({
    data: posts,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "blog:create");
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreatePostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const post = await createBlogPost({
    ...parsed.data,
    tenantId: auth.user.tenantId,
    createdById: auth.user.id,
  });

  return NextResponse.json({ data: post }, { status: 201 });
}
