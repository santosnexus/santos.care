"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Calendar,
  FileText,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
} from "lucide-react";
import { formatDate, slugify } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
  category: string | null;
  author: string | null;
  publishDate: string | null;
  imageUrl: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SCHEDULED: "bg-amber-100 text-amber-800",
  PUBLISHED: "bg-green-100 text-green-800",
};

const CATEGORIES = [
  "Cost Guide",
  "Country Guide",
  "Patient Story",
  "Market Insight",
  "Treatment Guide",
  "How-To",
  "Other",
];

function BlogForm({ post, onSave, onCancel }: {
  post?: Partial<BlogPost>;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = React.useState(post?.title || "");
  const [slug, setSlug] = React.useState(post?.slug || "");
  const [excerpt, setExcerpt] = React.useState(post?.excerpt || "");
  const [content, setContent] = React.useState(post?.content || "");
  const [category, setCategory] = React.useState(post?.category || "");
  const [status, setStatus] = React.useState<string>(post?.status || "DRAFT");
  const [author, setAuthor] = React.useState(post?.author || "");
  const [publishDate, setPublishDate] = React.useState(
    post?.publishDate ? post.publishDate.slice(0, 10) : ""
  );
  const [imageUrl, setImageUrl] = React.useState(post?.imageUrl || "");
  const [tagsStr, setTagsStr] = React.useState(
    post?.tags?.join(", ") || ""
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!post?.slug) setSlug(slugify(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      slug: slug || undefined,
      excerpt: excerpt || null,
      content,
      category: category || null,
      status,
      author: author || null,
      publishDate: publishDate || null,
      imageUrl: imageUrl || null,
      tags: tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="blog-title">Title *</Label>
          <Input
            id="blog-title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g., MS Treatment in India: Complete Cost Guide 2026"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blog-slug">Slug</Label>
          <Input
            id="blog-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated from title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blog-status">Status</Label>
          <Select
            id="blog-status"
            options={[
              { value: "DRAFT", label: "Draft" },
              { value: "SCHEDULED", label: "Scheduled" },
              { value: "PUBLISHED", label: "Published" },
            ]}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blog-category">Category</Label>
          <Select
            id="blog-category"
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Select category"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blog-author">Author</Label>
          <Input
            id="blog-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blog-date">Publish Date</Label>
          <Input
            id="blog-date"
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="blog-image">Image URL</Label>
          <Input
            id="blog-image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="blog-excerpt">Excerpt</Label>
          <Textarea
            id="blog-excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description for blog cards and SEO..."
            rows={2}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="blog-tags">Tags (comma-separated)</Label>
          <Input
            id="blog-tags"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="MS, multiple sclerosis, cost guide"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="blog-content">Content (Markdown) *</Label>
          <Textarea
            id="blog-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Article Title\n\nWrite your article content in Markdown..."
            rows={12}
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {post?.id ? "Update Post" : "Create Post"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function BlogManagementPage() {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await fetch(`/api/blog?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setPosts(json.data || []);
      }
    } catch {
      // Fallback: page works with no API
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreate = async (data: any) => {
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setShowForm(false);
        fetchPosts();
      }
    } catch {
      // silent
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingPost) return;
    try {
      const res = await fetch(`/api/blog/${editingPost.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setEditingPost(null);
        fetchPosts();
      }
    } catch {
      // silent
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeletingId(null);
        fetchPosts();
      }
    } catch {
      // silent
    }
  };

  const filtered = posts.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your blog content for the public site
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          options={[
            { value: "", label: "All Statuses" },
            { value: "DRAFT", label: "Draft" },
            { value: "SCHEDULED", label: "Scheduled" },
            { value: "PUBLISHED", label: "Published" },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-[180px]"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead className="w-[120px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No blog posts found. Create your first post!
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-xs text-muted-foreground">
                            /{post.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.category ? (
                        <Badge variant="outline">{post.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_COLORS[post.status]}>
                        {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.author || "—"}</TableCell>
                    <TableCell>
                      {post.publishDate ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(post.publishDate)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Edit"
                          onClick={() => setEditingPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="View on site"
                          onClick={() =>
                            window.open(
                              `https://www.santos.care/blog/${post.slug}`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          title="Delete"
                          onClick={() => setDeletingId(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} title="Create Blog Post">
        <DialogContent className="max-w-3xl">
          <DialogTitle>Create New Blog Post</DialogTitle>
          <BlogForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingPost}
        onClose={() => setEditingPost(null)}
        title="Edit Blog Post"
      >
        <DialogContent className="max-w-3xl">
          <DialogTitle>Edit Blog Post</DialogTitle>
          {editingPost && (
            <BlogForm
              post={editingPost}
              onSave={handleUpdate}
              onCancel={() => setEditingPost(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete Blog Post"
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Are you sure?</DialogTitle>
          <p className="text-muted-foreground">
            This will permanently delete this blog post. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
