"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Download,
  Eye,
  FileText,
  File,
  Upload,
  X,
  Trash2,
  Folder,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Operations Manual",
  "Email Templates",
  "WhatsApp Scripts",
  "Hospital Partners",
  "Ayurveda",
  "Marketing",
  "Blog Content",
  "Transportation",
  "Post-Treatment",
  "Medication/Equipment",
];

interface Document {
  id: string;
  title: string;
  category: string;
  size: string;
  uploadDate: string;
  type: "MD" | "PDF" | "DOCX";
}

const MOCK_DOCUMENTS: Document[] = [
  { id: "1", title: "HEAL_INDIA_OPERATIONS_MANUAL.md", category: "Operations Manual", size: "90KB", uploadDate: "2026-06-01", type: "MD" },
  { id: "2", title: "EMAIL_TEMPLATES_HOSPITAL_OUTREACH.md", category: "Email Templates", size: "21KB", uploadDate: "2026-06-01", type: "MD" },
  { id: "3", title: "WHATSAPP_MESSAGE_TEMPLATES.md", category: "WhatsApp Scripts", size: "42KB", uploadDate: "2026-06-01", type: "MD" },
  { id: "4", title: "WEBSITE_CODE_SNIPPETS.md", category: "Marketing", size: "42KB", uploadDate: "2026-06-01", type: "MD" },
  { id: "5", title: "BLOG_STRATEGY_CONTENT_CALENDAR.md", category: "Blog Content", size: "19KB", uploadDate: "2026-06-01", type: "MD" },
  { id: "6", title: "Ayush Prana Partnership Agreement", category: "Ayurveda", size: "245KB", uploadDate: "2026-06-15", type: "PDF" },
  { id: "7", title: "TRANSPORTATION_NETWORK_GUIDE.md", category: "Transportation", size: "12KB", uploadDate: "2026-06-01", type: "MD" },
  { id: "8", title: "POST_TREATMENT_SUPPORT_NETWORK.md", category: "Post-Treatment", size: "15KB", uploadDate: "2026-06-01", type: "MD" },
];

const typeIcons: Record<string, React.ElementType> = {
  MD: FileText,
  PDF: File,
  DOCX: File,
};

const typeColors: Record<string, string> = {
  MD: "bg-blue-100 text-blue-800",
  PDF: "bg-red-100 text-red-800",
  DOCX: "bg-indigo-100 text-indigo-800",
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [documents, setDocuments] = React.useState<Document[]>(MOCK_DOCUMENTS);
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [newDocTitle, setNewDocTitle] = React.useState("");
  const [newDocCategory, setNewDocCategory] = React.useState("");
  const [newDocDescription, setNewDocDescription] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  // Load real documents from API
  const loadDocuments = React.useCallback(async () => {
    try {
      const res = await fetch("/api/documents", {
        headers: { Authorization: "Basic " + btoa("santos:He@lInd!a2026") },
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = (data.documents || []).map((d: any) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          size: d.size ? `${Math.round(d.size / 1024)}KB` : "?",
          uploadDate: d.createdAt?.split("T")[0] || "",
          type: (d.fileType?.includes("pdf") ? "PDF" : d.fileType?.includes("md") ? "MD" : "DOCX") as Document["type"],
        }));
        if (mapped.length > 0) setDocuments(mapped);
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    }
  }, []);

  React.useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", newDocTitle || file.name);
      formData.append("category", newDocCategory || "Operations Manual");
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        headers: { Authorization: "Basic " + btoa("santos:He@lInd!a2026") },
        body: formData,
      });
      if (res.ok) {
        await loadDocuments();
        setUploadModalOpen(false);
        setNewDocTitle("");
        setNewDocCategory("");
        setNewDocDescription("");
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    if (selectedDocument?.id === id) {
      setPreviewModalOpen(false);
      setSelectedDocument(null);
    }
  };

  const openPreview = (doc: Document) => {
    setSelectedDocument(doc);
    setPreviewModalOpen(true);
  };

  const getFilePreviewContent = (doc: Document) => {
    const previewTexts: Record<string, string> = {
      "1": `# HEAL INDIA OPERATIONS MANUAL

## Overview
This manual outlines the standard operating procedures for Heal India Medi Tourism.

## Patient Intake Process
1. Initial inquiry received via WhatsApp/Website/Referral
2. Qualification call within 24 hours
3. Treatment plan preparation
4. Hospital coordination
5. Visa assistance
6. Travel arrangements
7. Reception at airport
8. Hospital admission
9. Treatment process
10. Ayurveda recovery (if applicable)
11. Follow-up care

## Coordinator Responsibilities
- Respond to inquiries within 2 hours during business hours
- Maintain patient records in the CRM
- Coordinate with hospital partners
- Arrange transportation
- Monitor patient satisfaction

## Quality Standards
- Response time: < 2 hours
- Patient satisfaction target: > 4.5/5
- Conversion rate target: > 25%`,
      "2": `# EMAIL TEMPLATES - HOSPITAL OUTREACH

## Initial Contact Email
Subject: Partnership Opportunity - Heal India Medical Tourism

Dear [Hospital Name] Team,

We are Heal India Medi Tourism, a medical tourism company facilitating international patients seeking quality healthcare in India...

## Follow-up Email
Subject: Re: Partnership Opportunity

Dear [Name],

I wanted to follow up on my previous email regarding our partnership proposal...

## Template Variables
- {{hospital_name}} - Partner hospital name
- {{contact_name}} - Primary contact
- {{patient_name}} - Patient full name
- {{treatment_type}} - Required treatment
- {{estimated_cost}} - Estimated procedure cost`,
      "3": `# WHATSAPP MESSAGE TEMPLATES

## Initial Response
Hello {{patient_name}}! Thank you for contacting Heal India Medi Tourism. I'm {{coordinator_name}}, and I'll be your personal coordinator. How can I assist you today?

## Treatment Information
Here's information about {{treatment_type}}:
- Estimated duration: {{duration}}
- Top hospitals: {{hospitals}}
- Cost range: {{cost_range}}

## Follow-up Message
Hello {{patient_name}}! Just checking in. How are you feeling? Do you have any questions about the treatment plan?`,
    };
    return previewTexts[doc.id] || `# Preview: ${doc.title}\n\nThis is a preview of the document content. The full document would be displayed here in a production environment.`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage operations manuals, templates, and resources
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex flex-wrap h-auto">
          {CATEGORIES.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDocuments.map((doc) => {
          const Icon = typeIcons[doc.type] || File;
          return (
            <Card key={doc.id} className="group hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="outline" className={cn("text-xs", typeColors[doc.type])}>
                      {doc.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openPreview(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-sm font-medium line-clamp-2 leading-tight">
                  {doc.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Folder className="h-3 w-3" />
                  {doc.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{doc.size}</span>
                  <span>{doc.uploadDate}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 h-8">
                  <Download className="h-3 w-3 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">No documents found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search or filter"
              : "Add your first document to get started"}
          </p>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </div>
      )}

      <Dialog
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Document"
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your file here, or click to select
            </p>
            <input
              type="file"
              accept=".md,.pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
              Select File
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Supported: MD, PDF, DOCX
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-title">Document Title</Label>
            <Input
              id="doc-title"
              placeholder="Enter document title"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-category">Category</Label>
            <select
              id="doc-category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={newDocCategory}
              onChange={(e) => setNewDocCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {CATEGORIES.filter((c) => c !== "All").map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-description">Description</Label>
            <Textarea
              id="doc-description"
              placeholder="Brief description of the document"
              rows={3}
              value={newDocDescription}
              onChange={(e) => setNewDocDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setUploadModalOpen(false)}>
            Upload Document
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={selectedDocument?.title}
        className="max-w-3xl"
      >
        {selectedDocument && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <Badge variant="outline" className={cn(typeColors[selectedDocument.type])}>
                {selectedDocument.type}
              </Badge>
              <span className="text-sm text-muted-foreground">{selectedDocument.category}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{selectedDocument.size}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{selectedDocument.uploadDate}</span>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {getFilePreviewContent(selectedDocument)}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button
                variant="outline"
                className="text-destructive"
                onClick={() => handleDelete(selectedDocument.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}