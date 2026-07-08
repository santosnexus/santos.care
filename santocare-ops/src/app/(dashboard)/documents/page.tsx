"use client";

import * as React from "react";
import { fetchWithAuth } from "@/lib/fetch-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import {
  Search, Plus, Download, Eye, FileText, File, Upload, X, Trash2, Folder, Loader2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocItem {
  id: string;
  title: string;
  category: string;
  fileType: string | null;
  size: number | null;
  createdAt: string;
  uploadedBy?: { name: string };
}

const CATEGORIES = [
  "All", "Operations Manual", "Email Templates", "WhatsApp Scripts",
  "Hospital Partners", "Ayurveda", "Marketing", "Blog Content",
  "Transportation", "Post-Treatment", "Medication/Equipment",
];

const typeIcon = (ft: string | null) => {
  if (!ft) return File;
  if (ft.includes("pdf")) return File;
  if (ft.includes("md") || ft.includes("markdown")) return FileText;
  return File;
};

const typeColor = (ft: string | null) => {
  if (!ft) return "bg-gray-100 text-gray-800";
  if (ft.includes("pdf")) return "bg-red-100 text-red-800";
  if (ft.includes("md")) return "bg-blue-100 text-blue-800";
  if (ft.includes("docx") || ft.includes("doc")) return "bg-indigo-100 text-indigo-800";
  return "bg-gray-100 text-gray-800";
};

const typeLabel = (ft: string | null) => {
  if (!ft) return "FILE";
  if (ft.includes("pdf")) return "PDF";
  if (ft.includes("md")) return "MD";
  if (ft.includes("docx")) return "DOCX";
  return ft.split("/").pop()?.toUpperCase() || "FILE";
};

const fmtSize = (bytes: number | null) => {
  if (!bytes) return "?";
  if (bytes < 1024) return `${bytes}B`;
  return `${Math.round(bytes / 1024)}KB`;
};

export default function DocumentsPage() {
  const [items, setItems] = React.useState<DocItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [newDocTitle, setNewDocTitle] = React.useState("");
  const [newDocCategory, setNewDocCategory] = React.useState("");
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewDoc, setPreviewDoc] = React.useState<DocItem | null>(null);
  const [previewContent, setPreviewContent] = React.useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<DocItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    params.set("limit", "100");
    try {
      const res = await fetchWithAuth(`/api/documents?${params}`);
      if (!res.ok) throw new Error("Failed to load documents");
      const json = await res.json();
      setItems(json.data ?? []);
    } catch (e: any) {
      setError(e.message ?? "Error loading documents");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  React.useEffect(() => { load(); }, [load]);

  const openUpload = () => {
    setUploadOpen(true);
    setUploadFile(null);
    setNewDocTitle("");
    setNewDocCategory("");
    setDragActive(false);
    setUploadError(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setUploadFile(f);
      if (!newDocTitle) setNewDocTitle(f.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setUploadFile(f);
      if (!newDocTitle) setNewDocTitle(f.name);
    }
  };

  const submitUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      fd.append("title", newDocTitle || uploadFile.name);
      fd.append("category", newDocCategory || "Uncategorized");
      const res = await fetchWithAuth("/api/documents/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Upload failed");
      }
      setUploadOpen(false);
      setUploadFile(null);
      await load();
    } catch (e: any) {
      setUploadError(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openPreview = async (doc: DocItem) => {
    setPreviewDoc(doc);
    setPreviewContent(null);
    setPreviewLoading(true);
    setPreviewOpen(true);
    try {
      const res = await fetchWithAuth(`/api/documents/${doc.id}`);
      if (!res.ok) throw new Error("Failed to load document");
      const json = await res.json();
      // Try to render text from file URL
      if (json.data?.filePath?.startsWith("data:")) {
        const match = json.data.filePath.match(/^data:[^;]+;base64,(.+)$/);
        if (match) {
          const decoded = atob(match[1]);
          setPreviewContent(decoded);
        }
      }
    } catch {
      setPreviewContent(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetchWithAuth(`/api/documents/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Failed to delete document");
      }
      setDeleteTarget(null);
      if (previewDoc?.id === deleteTarget.id) { setPreviewOpen(false); setPreviewDoc(null); }
      await load();
    } catch (e: any) {
      // ignore
    } finally {
      setDeleting(false);
    }
  };

  const filtered = items.filter((doc) => {
    if (selectedCategory !== "All" && doc.category !== selectedCategory) return false;
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) && !doc.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage operations manuals, templates, and resources</p>
        </div>
        <Button onClick={openUpload}><Plus className="h-4 w-4 mr-2" /> Add Document</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex flex-wrap h-auto">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="text-xs">{cat}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading documents...
        </div>
      )}

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((doc) => {
            const Icon = typeIcon(doc.fileType);
            return (
              <Card key={doc.id} className="group hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <Badge variant="outline" className={cn("text-xs", typeColor(doc.fileType))}>{typeLabel(doc.fileType)}</Badge>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openPreview(doc)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(doc)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-sm font-medium line-clamp-2 leading-tight">{doc.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Folder className="h-3 w-3" /> {doc.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{fmtSize(doc.size)}</span>
                    <span>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 h-8" onClick={() => openPreview(doc)}>
                    <Download className="h-3 w-3 mr-2" /> View
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">No documents found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search or filter" : "Upload your first document to get started"}
          </p>
          <Button onClick={openUpload}><Plus className="h-4 w-4 mr-2" /> Add Document</Button>
        </div>
      )}

      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Document">
        <div className="space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              uploadFile ? "bg-green-50 border-green-300" : ""
            )}
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById("doc-file-input")?.click()}
          >
            {uploadFile ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium">{uploadFile.name}</span>
                <span className="text-xs text-muted-foreground">({fmtSize(uploadFile.size)})</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setUploadFile(null); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Drag & drop or click to select</p>
                <p className="text-xs text-muted-foreground">Supported: MD, PDF, DOCX (max 5 MB)</p>
              </>
            )}
            <input id="doc-file-input" type="file" accept=".md,.pdf,.docx,.doc,.txt" onChange={handleFileSelect} className="hidden" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-title">Document Title</Label>
            <Input id="doc-title" value={newDocTitle} onChange={(e) => setNewDocTitle(e.target.value)} placeholder="Enter document title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doc-category">Category</Label>
            <select
              id="doc-category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={newDocCategory}
              onChange={(e) => setNewDocCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {uploadError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle className="h-4 w-4" /> {uploadError}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={uploading}>Cancel</Button>
          <Button onClick={submitUpload} disabled={uploading || !uploadFile}>
            {uploading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Uploading...</> : "Upload"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} title={previewDoc?.title}>
        <div className="space-y-4 max-w-3xl">
          {previewDoc && (
            <>
              <div className="flex items-center gap-3 pb-4 border-b">
                <Badge variant="outline" className={cn(typeColor(previewDoc.fileType))}>{typeLabel(previewDoc.fileType)}</Badge>
                <span className="text-sm text-muted-foreground">{previewDoc.category}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{fmtSize(previewDoc.size)}</span>
              </div>
              {previewLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
                </div>
              ) : previewContent ? (
                <div className="bg-muted/50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">{previewContent}</pre>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Preview not available for this file type.</p>
                  <a
                    href={`/api/documents/${previewDoc.id}/file`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline mt-2 inline-block"
                  >
                    Open file directly
                  </a>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <a href={`/api/documents/${previewDoc.id}/file`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download
                  </a>
                </Button>
                <Button variant="destructive" onClick={() => { setPreviewOpen(false); setDeleteTarget(previewDoc); }}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Document">
        <p className="text-sm">Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This permanently removes the document.</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
          <Button onClick={confirmDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
            {deleting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting...</> : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
