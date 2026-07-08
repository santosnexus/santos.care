"use client";

import * as React from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/fetch-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  Mail,
  Phone,
  Globe,
  Calendar,
  UserPlus,
  Tag,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Lead {
  id: string;
  source: string;
  campaign?: string | null;
  name: string;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
  status: string;
  score?: number;
  treatmentInterest?: string | null;
  budgetRange?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  convertedToPatientId?: string | null;
  lastContactAt?: string | null;
  createdAt: string;
}

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  NEW: { label: "New", class: "bg-blue-100 text-blue-800 border-blue-200" },
  CONTACTED: { label: "Contacted", class: "bg-amber-100 text-amber-800 border-amber-200" },
  QUALIFIED: { label: "Qualified", class: "bg-purple-100 text-purple-800 border-purple-200" },
  CONVERTED: { label: "Converted", class: "bg-green-100 text-green-800 border-green-200" },
  LOST: { label: "Lost", class: "bg-gray-100 text-gray-800 border-gray-200" },
};

const SOURCE_LABELS: Record<string, string> = {
  WHATSAPP: "WhatsApp",
  WEBSITE: "Website",
  FACEBOOK: "Facebook",
  GOOGLE_ADS: "Google Ads",
  REFERRAL: "Referral",
  PARTNER_HOSPITAL: "Partner Hospital",
  EXHIBITION: "Exhibition",
  OTHER: "Other",
};

const SOURCE_OPTIONS = Object.keys(SOURCE_LABELS).map((v) => ({ value: v, label: SOURCE_LABELS[v] }));
const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

const emptyForm = {
  name: "", email: "", phone: "", country: "", source: "WEBSITE",
  treatmentInterest: "", budgetRange: "", campaign: "",
  utmSource: "", utmMedium: "", utmCampaign: "",
  status: "NEW", score: "",
};

export default function LeadsPage() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [sourceFilter, setSourceFilter] = React.useState<string>("");

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<Lead | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<Lead | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [convertingId, setConvertingId] = React.useState<string | null>(null);

  const loadLeads = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (sourceFilter) params.set("source", sourceFilter);
      params.set("limit", "100");
      const res = await fetchWithAuth(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data.data ?? data.leads ?? []);
    } catch (err) {
      setFormError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sourceFilter]);

  React.useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const filteredLeads = leads.filter((lead) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(s) ||
      lead.email?.toLowerCase().includes(s) ||
      lead.phone?.toLowerCase().includes(s) ||
      lead.treatmentInterest?.toLowerCase().includes(s) ||
      lead.country?.toLowerCase().includes(s)
    );
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "NEW").length,
    qualified: leads.filter((l) => l.status === "QUALIFIED").length,
    converted: leads.filter((l) => l.status === "CONVERTED").length,
    conversionRate: leads.length > 0 ? Math.round((leads.filter((l) => l.status === "CONVERTED").length / leads.length) * 100) : 0,
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setForm({
      name: lead.name, email: lead.email ?? "", phone: lead.phone ?? "", country: lead.country ?? "",
      source: lead.source, treatmentInterest: lead.treatmentInterest ?? "", budgetRange: lead.budgetRange ?? "",
      campaign: lead.campaign ?? "", utmSource: lead.utmSource ?? "", utmMedium: lead.utmMedium ?? "",
      utmCampaign: lead.utmCampaign ?? "", status: lead.status, score: lead.score != null ? String(lead.score) : "",
    });
    setFormError(null);
    setFormOpen(true);
  };

  const submitForm = async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      const payload: any = {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        country: form.country || undefined,
        source: form.source,
        treatmentInterest: form.treatmentInterest || undefined,
        budgetRange: form.budgetRange || undefined,
        campaign: form.campaign || undefined,
        utmSource: form.utmSource || undefined,
        utmMedium: form.utmMedium || undefined,
        utmCampaign: form.utmCampaign || undefined,
      };
      if (editingId) {
        payload.status = form.status;
        if (form.score) payload.score = Number(form.score);
      }
      const res = editingId
        ? await fetchWithAuth(`/api/leads/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await fetchWithAuth(`/api/leads`, { method: "POST", body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save lead");
      setFormOpen(false);
      await loadLeads();
    } catch (e: any) {
      setFormError(e.message ?? "Error saving lead");
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (lead: Lead) => {
    setDetailOpen(true);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await fetchWithAuth(`/api/leads/${lead.id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load lead");
      setDetail(json.data);
    } catch (e: any) {
      setFormError(e.message);
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleConvert = async (leadId: string) => {
    if (!confirm("Convert this lead to a patient? This will create a new patient record.")) return;
    setConvertingId(leadId);
    try {
      const res = await fetchWithAuth(`/api/leads/${leadId}/convert`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        await loadLeads();
        if (data.patient?.id) {
          window.location.href = "/patients";
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to convert lead");
      }
    } catch (err) {
      alert("Failed to convert lead");
    } finally {
      setConvertingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetchWithAuth(`/api/leads/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Failed to delete lead");
      }
      setDeleteTarget(null);
      await loadLeads();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const scoreColor = (score?: number) => {
    if (score == null) return "text-muted-foreground";
    if (score >= 70) return "text-green-600 font-semibold";
    if (score >= 40) return "text-amber-600";
    return "text-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Marketing inquiries and conversion tracking</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> New Lead
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Leads</p><p className="text-2xl font-bold mt-1">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">New</p><p className="text-2xl font-bold mt-1 text-blue-600">{stats.new}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Qualified</p><p className="text-2xl font-bold mt-1 text-purple-600">{stats.qualified}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Converted</p><p className="text-2xl font-bold mt-1 text-green-600">{stats.converted}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Conv. Rate</p><p className="text-2xl font-bold mt-1">{stats.conversionRate}%</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, email, phone, treatment, country..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <Select options={[{ value: "", label: "All Statuses" }, ...STATUS_OPTIONS]} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-[160px]" />
            <Select options={[{ value: "", label: "All Sources" }, ...SOURCE_OPTIONS]} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="w-[180px]" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground"><Loader2 className="h-5 w-4 animate-spin inline mr-2" /> Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {leads.length === 0 ? "No leads yet. Click 'New Lead' to add one or wait for forms to come in." : "No leads match your filters."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const statusInfo = STATUS_BADGE[lead.status] || STATUS_BADGE.NEW;
                  return (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="font-medium">{lead.name}</div>
                        {lead.budgetRange && <div className="text-xs text-muted-foreground mt-0.5">Budget: {lead.budgetRange}</div>}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5 text-sm">
                          {lead.email && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline truncate max-w-[180px]">{lead.email}</a>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} className="text-green-600 hover:underline">{lead.phone}</a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs">{SOURCE_LABELS[lead.source] ?? lead.source}</span>
                        </div>
                        {lead.campaign && <div className="text-xs text-muted-foreground mt-0.5">{lead.campaign}</div>}
                      </TableCell>
                      <TableCell>{lead.treatmentInterest ? <span className="text-sm">{lead.treatmentInterest}</span> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                      <TableCell>{lead.country ? <div className="flex items-center gap-1.5 text-sm"><Globe className="h-3 w-3 text-muted-foreground" />{lead.country}</div> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                      <TableCell><span className={`text-sm ${scoreColor(lead.score)}`}>{lead.score ?? "—"}</span></TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusInfo.class}>{statusInfo.label}</Badge>
                        {lead.status === "CONVERTED" && lead.convertedToPatientId && (
                          <Link href={`/patients`} className="block text-xs text-blue-600 hover:underline mt-1">→ Patient</Link>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {lead.status !== "CONVERTED" && (
                            <Button variant="ghost" size="sm" title="Convert to patient" onClick={() => handleConvert(lead.id)} disabled={convertingId === lead.id}>
                              <UserPlus className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" title="View detail" onClick={() => openDetail(lead)}><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" title="Edit" onClick={() => openEdit(lead)}><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" title="Delete" onClick={() => setDeleteTarget(lead)}><Trash2 className="h-3.5 w-3.5 text-red-600" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? "Edit Lead" : "New Lead"}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source *</Label>
                <Select id="source" options={SOURCE_OPTIONS} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="lead@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 700 123 456" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g., Kenya" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment Interest</Label>
                <Input id="treatment" value={form.treatmentInterest} onChange={(e) => setForm({ ...form, treatmentInterest: e.target.value })} placeholder="e.g., Knee replacement" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Input id="budget" value={form.budgetRange} onChange={(e) => setForm({ ...form, budgetRange: e.target.value })} placeholder="e.g., 10000-15000 USD" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign</Label>
                <Input id="campaign" value={form.campaign} onChange={(e) => setForm({ ...form, campaign: e.target.value })} placeholder="e.g., kenya-cardiac-q2" />
              </div>
              {editingId && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select id="status" options={STATUS_OPTIONS} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="score">Score (0-100, auto-calculated on create)</Label>
                    <Input id="score" type="number" min={0} max={100} value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="utmSource">UTM Source</Label>
                <Input id="utmSource" value={form.utmSource} onChange={(e) => setForm({ ...form, utmSource: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="utmMedium">UTM Medium</Label>
                <Input id="utmMedium" value={form.utmMedium} onChange={(e) => setForm({ ...form, utmMedium: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="utmCampaign">UTM Campaign</Label>
                <Input id="utmCampaign" value={form.utmCampaign} onChange={(e) => setForm({ ...form, utmCampaign: e.target.value })} />
              </div>
            </div>
            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="h-4 w-4" /> {formError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={submitForm} disabled={submitting || !form.name}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : editingId ? "Save Changes" : "Create Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} title="Lead Detail">
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {detailLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-4 animate-spin mr-2" /> Loading...
            </div>
          )}
          {detail && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div><span className="text-muted-foreground">Name:</span> {detail.name}</div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={STATUS_BADGE[detail.status]?.class}>{STATUS_BADGE[detail.status]?.label ?? detail.status}</Badge></div>
                <div><span className="text-muted-foreground">Source:</span> {SOURCE_LABELS[detail.source] ?? detail.source}</div>
                <div><span className="text-muted-foreground">Score:</span> <span className={scoreColor(detail.score)}>{detail.score ?? "—"}</span></div>
                <div><span className="text-muted-foreground">Email:</span> {detail.email || "—"}</div>
                <div><span className="text-muted-foreground">Phone:</span> {detail.phone || "—"}</div>
                <div><span className="text-muted-foreground">Country:</span> {detail.country || "—"}</div>
                <div><span className="text-muted-foreground">Treatment Interest:</span> {detail.treatmentInterest || "—"}</div>
                <div><span className="text-muted-foreground">Budget Range:</span> {detail.budgetRange || "—"}</div>
                <div><span className="text-muted-foreground">Campaign:</span> {detail.campaign || "—"}</div>
                <div><span className="text-muted-foreground">UTM Source:</span> {detail.utmSource || "—"}</div>
                <div><span className="text-muted-foreground">UTM Medium:</span> {detail.utmMedium || "—"}</div>
                <div><span className="text-muted-foreground">UTM Campaign:</span> {detail.utmCampaign || "—"}</div>
                <div><span className="text-muted-foreground">Created:</span> {new Date(detail.createdAt).toLocaleString()}</div>
                <div><span className="text-muted-foreground">Last Contact:</span> {detail.lastContactAt ? new Date(detail.lastContactAt).toLocaleString() : "—"}</div>
              </div>
              {detail.convertedToPatientId && (
                <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                  Converted to patient. <Link href={`/patients`} className="text-green-700 underline">View patient</Link>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Lead">
        <DialogContent>
          <p className="text-sm">Soft-delete <strong>{deleteTarget?.name}</strong>? The lead will be excluded from default queries. Audit history preserved.</p>
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mt-3">
              <AlertCircle className="h-4 w-4" /> {formError}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button onClick={confirmDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting...</> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}