"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Plus, Search, FileSpreadsheet, CheckCircle, XCircle, Clock,
  AlertCircle, Loader2, Edit,   Trash2, X, PlusCircle,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/fetch-client";

type QuoteStatus = "DRAFT" | "SENT" | "VIEWED" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "CONVERTED";

interface QuoteRow {
  id: string;
  number: string;
  status: QuoteStatus;
  total: number;
  currency: string;
  patient?: { name: string };
  hospitalName?: string | null;
  createdAt: string;
  validUntil: string;
}

interface QuoteDetail extends QuoteRow {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  sentAt?: string | null;
  viewedAt?: string | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
  notes?: string | null;
  terms?: string | null;
  treatmentPlan?: string | null;
  lineItems: Array<{ id: string; description: string; quantity: number; unitPrice: number; total: number; category: string }>;
}

const STATUS_COLORS: Record<QuoteStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  VIEWED: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-500",
  CONVERTED: "bg-purple-100 text-purple-800",
};

const emptyLineItem = { description: "", quantity: 1, unitPrice: 0 };

export default function QuotesPage() {
  const [items, setItems] = React.useState<QuoteRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formPatientId, setFormPatientId] = React.useState("");
  const [formCurrency, setFormCurrency] = React.useState("USD");
  const [formTaxRate, setFormTaxRate] = React.useState("0");
  const [formValidUntil, setFormValidUntil] = React.useState("");
  const [formHospitalName, setFormHospitalName] = React.useState("");
  const [formTreatmentPlan, setFormTreatmentPlan] = React.useState("");
  const [formNotes, setFormNotes] = React.useState("");
  const [formLineItems, setFormLineItems] = React.useState<Array<{ description: string; quantity: number; unitPrice: number }>>([{ ...emptyLineItem }]);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<QuoteDetail | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<QuoteRow | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    params.set("limit", "100");
    try {
      const res = await fetchWithAuth(`/api/quotes?${params}`);
      if (!res.ok) throw new Error("Failed to load quotes");
      const json = await res.json();
      setItems(json.data ?? []);
    } catch (e: any) {
      setError(e.message ?? "Error loading quotes");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  React.useEffect(() => { load(); }, [load]);

  const filtered = items.filter((q) =>
    !search || q.number.toLowerCase().includes(search.toLowerCase()) || q.patient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: items.length,
    accepted: items.filter((q) => q.status === "ACCEPTED").length,
    pending: items.filter((q) => ["SENT", "VIEWED"].includes(q.status)).length,
    rejected: items.filter((q) => q.status === "REJECTED").length,
  };

  const openCreate = () => {
    setEditingId(null);
    setFormPatientId("");
    setFormCurrency("USD");
    setFormTaxRate("0");
    setFormValidUntil("");
    setFormHospitalName("");
    setFormTreatmentPlan("");
    setFormNotes("");
    setFormLineItems([{ ...emptyLineItem }]);
    setFormError(null);
    setFormOpen(true);
  };

  const addLineItem = () => setFormLineItems([...formLineItems, { ...emptyLineItem }]);
  const updateLineItem = (idx: number, field: string, value: any) => {
    const updated = [...formLineItems];
    (updated[idx] as any)[field] = value;
    setFormLineItems(updated);
  };
  const removeLineItem = (idx: number) => {
    if (formLineItems.length <= 1) return;
    setFormLineItems(formLineItems.filter((_, i) => i !== idx));
  };

  const submitForm = async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      const payload: Record<string, any> = {
        patientId: formPatientId || null,
        currency: formCurrency,
        taxRate: Number(formTaxRate),
        notes: formNotes || null,
        validUntil: formValidUntil ? new Date(formValidUntil).toISOString() : undefined,
        hospitalName: formHospitalName || null,
        treatmentPlan: formTreatmentPlan || null,
        lineItems: formLineItems.map((li) => ({
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
        })),
      };
      const res = editingId
        ? await fetchWithAuth(`/api/quotes/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await fetchWithAuth(`/api/quotes`, { method: "POST", body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save quote");
      setFormOpen(false);
      await load();
    } catch (e: any) {
      setFormError(e.message ?? "Error saving quote");
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (row: QuoteRow) => {
    setDetailOpen(true);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await fetchWithAuth(`/api/quotes/${row.id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load quote");
      setDetail(json.data);
    } catch (e: any) {
      setFormError(e.message);
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetchWithAuth(`/api/quotes/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Failed to delete quote");
      }
      setDeleteTarget(null);
      if (detail?.id === deleteTarget.id) { setDetailOpen(false); setDetail(null); }
      await load();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const updateStatus = async (id: string, status: QuoteStatus) => {
    try {
      const res = await fetchWithAuth(`/api/quotes/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error("Failed to update status");
      if (detail?.id === id) {
        const detailRes = await fetchWithAuth(`/api/quotes/${id}`);
        const detailJson = await detailRes.json();
        setDetail(detailJson.data);
      }
      await load();
    } catch (e: any) {
      setFormError(e.message);
    }
  };

  const fmtDate = (s?: string | null) => (s ? new Date(s).toLocaleDateString() : "—");
  const fmtMoney = (n: number | null | undefined, cur = "USD") => (n != null ? `${cur} ${n.toLocaleString()}` : "—");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotes</h1>
          <p className="text-muted-foreground">Create and manage treatment quotes</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> New Quote</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats.total}</p></div><FileSpreadsheet className="h-5 w-5 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Accepted</p><p className="text-2xl font-bold text-green-600">{stats.accepted}</p></div><CheckCircle className="h-5 w-5 text-green-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></div><Clock className="h-5 w-5 text-yellow-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Rejected</p><p className="text-2xl font-bold text-red-600">{stats.rejected}</p></div><XCircle className="h-5 w-5 text-red-500" /></div></CardContent></Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by quote # or patient..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select
          options={[
            { value: "", label: "All Status" },
            { value: "DRAFT", label: "Draft" },
            { value: "SENT", label: "Sent" },
            { value: "VIEWED", label: "Viewed" },
            { value: "ACCEPTED", label: "Accepted" },
            { value: "REJECTED", label: "Rejected" },
            { value: "EXPIRED", label: "Expired" },
            { value: "CONVERTED", label: "Converted" },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-[200px]"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading quotes...
        </div>
      )}

      {!loading && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="p-8 text-center text-muted-foreground">No quotes found</TableCell></TableRow>
                ) : (
                  filtered.map((q) => (
                    <TableRow key={q.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(q)}>
                      <TableCell className="font-medium font-mono text-sm">{q.number}</TableCell>
                      <TableCell>{q.patient?.name || "—"}</TableCell>
                      <TableCell>{q.hospitalName || "—"}</TableCell>
                      <TableCell><Badge variant="outline" className={STATUS_COLORS[q.status]}>{q.status}</Badge></TableCell>
                      <TableCell className="text-right font-medium">{fmtMoney(q.total, q.currency)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fmtDate(q.validUntil)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" title="Edit" onClick={() => { /* TODO: populate edit */ }}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" title="Delete" onClick={() => setDeleteTarget(q)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? "Edit Quote" : "New Quote"}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="q-patientId">Patient ID</Label>
                <Input id="q-patientId" value={formPatientId} onChange={(e) => setFormPatientId(e.target.value)} placeholder="Patient record ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-currency">Currency</Label>
                <Select
                  id="q-currency"
                  options={[{ value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "INR", label: "INR" }, { value: "GBP", label: "GBP" }]}
                  value={formCurrency}
                  onChange={(e) => setFormCurrency(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-tax">Tax Rate (%)</Label>
                <Input id="q-tax" type="number" min="0" max="100" value={formTaxRate} onChange={(e) => setFormTaxRate(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="q-hospital">Hospital Name</Label>
                <Input id="q-hospital" value={formHospitalName} onChange={(e) => setFormHospitalName(e.target.value)} placeholder="Aster Medcity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-valid">Valid Until</Label>
                <Input id="q-valid" type="date" value={formValidUntil} onChange={(e) => setFormValidUntil(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-plan">Treatment Plan</Label>
              <Textarea id="q-plan" value={formTreatmentPlan} onChange={(e) => setFormTreatmentPlan(e.target.value)} rows={2} placeholder="Treatment plan description..." />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Line Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLineItem}><PlusCircle className="h-3 w-3 mr-1" /> Add Item</Button>
              </div>
              {formLineItems.map((li, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-start">
                  <Input className="flex-[3]" placeholder="Description" value={li.description} onChange={(e) => updateLineItem(idx, "description", e.target.value)} required />
                  <Input className="flex-1" type="number" min="1" placeholder="Qty" value={li.quantity} onChange={(e) => updateLineItem(idx, "quantity", Number(e.target.value))} required />
                  <Input className="flex-1" type="number" min="0" step="0.01" placeholder="Price" value={li.unitPrice} onChange={(e) => updateLineItem(idx, "unitPrice", Number(e.target.value))} required />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeLineItem(idx)} disabled={formLineItems.length <= 1}><X className="h-4 w-4 text-red-500" /></Button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-notes">Notes</Label>
              <Textarea id="q-notes" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2} />
            </div>
            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="h-4 w-4" /> {formError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={submitForm} disabled={submitting || formLineItems.some((li) => !li.description)}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : editingId ? "Save Changes" : "Create Quote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} title={`Quote ${detail?.number ?? ""}`}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {detailLoading && <div className="flex items-center justify-center py-8 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...</div>}
          {detail && (
            <div className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={STATUS_COLORS[detail.status]}>{detail.status}</Badge></div>
                <div><span className="text-muted-foreground">Patient:</span> {detail.patient?.name || "—"}</div>
                <div><span className="text-muted-foreground">Hospital:</span> {detail.hospitalName || "—"}</div>
                <div><span className="text-muted-foreground">Valid Until:</span> {fmtDate(detail.validUntil)}</div>
                <div><span className="text-muted-foreground">Subtotal:</span> {fmtMoney(detail.subtotal, detail.currency)}</div>
                <div><span className="text-muted-foreground">Tax ({detail.taxRate}%):</span> {fmtMoney(detail.taxAmount, detail.currency)}</div>
                <div><span className="text-muted-foreground font-semibold">Total:</span> <span className="font-semibold">{fmtMoney(detail.total, detail.currency)}</span></div>
              </div>

              {detail.treatmentPlan && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Treatment Plan</h4>
                  <p className="text-sm text-muted-foreground">{detail.treatmentPlan}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-2">Line Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detail.lineItems.map((li) => (
                      <TableRow key={li.id}>
                        <TableCell>{li.description}</TableCell>
                        <TableCell className="text-right">{li.quantity}</TableCell>
                        <TableCell className="text-right">{fmtMoney(li.unitPrice, detail.currency)}</TableCell>
                        <TableCell className="text-right font-medium">{fmtMoney(li.total, detail.currency)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {detail.notes && <div><h4 className="text-sm font-semibold mb-1">Notes</h4><p className="text-sm text-muted-foreground">{detail.notes}</p></div>}

              <div className="flex flex-wrap gap-2 pt-2">
                {detail.status === "DRAFT" && (
                  <Button size="sm" onClick={() => updateStatus(detail.id, "SENT")}>Send Quote</Button>
                )}
                {detail.status === "SENT" && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(detail.id, "ACCEPTED")}>Accept</Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(detail.id, "REJECTED")}>Reject</Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => { setDetailOpen(false); /* TODO: edit */ }}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => { setDetailOpen(false); setDeleteTarget(detail); }}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Quote">
        <DialogContent>
          <p className="text-sm">Are you sure you want to delete <strong>{deleteTarget?.number}</strong>? This permanently removes the quote and its line items.</p>
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
