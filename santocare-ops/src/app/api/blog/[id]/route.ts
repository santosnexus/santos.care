import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { getBlogPost, updateBlogPost, deleteBlogPost } from "@/services/blog.service";

const UpdatePostSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1).optional(),
  imageUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]).optional(),
  author: z.string().optional().nullable(),
  publishDate: z.string().optional().nullable(),
}).strict();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "blog:read");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const post = await getBlogPost(auth.user.tenantId, id);
  if (!post) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  return NextResponse.json({ data: post });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "blog:update");
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdatePostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const updated = await updateBlogPost(auth.user.tenantId, id, parsed.data, auth.user.id);
  return NextResponse.json({ data: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "blog:delete");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await deleteBlogPost(auth.user.tenantId, id, auth.user.id);

  return NextResponse.json({ success: true });
}
