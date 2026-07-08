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
  Plus, Search, Receipt, DollarSign, Clock, CheckCircle, AlertCircle, Loader2, Edit, Trash2, X, PlusCircle,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/fetch-client";

type InvoiceStatus = "DRAFT" | "SENT" | "VIEWED" | "PARTIAL" | "PAID" | "OVERDUE" | "CANCELLED";

interface InvoiceRow {
  id: string;
  number: string;
  status: InvoiceStatus;
  total: number;
  amountPaid: number;
  currency: string;
  patient?: { name: string };
  createdAt: string;
  dueDate: string;
}

interface InvoiceDetail extends InvoiceRow {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  issueDate: string;
  sentAt?: string | null;
  viewedAt?: string | null;
  paidAt?: string | null;
  notes?: string | null;
  terms?: string | null;
  lineItems: Array<{ id: string; description: string; quantity: number; unitPrice: number; total: number; category: string }>;
  payments: Array<{ id: string; amount: number; method: string; reference?: string | null; receivedAt: string }>;
}

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  VIEWED: "bg-yellow-100 text-yellow-800",
  PARTIAL: "bg-orange-100 text-orange-800",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-500",
};

const emptyLineItem = { description: "", quantity: 1, unitPrice: 0 };

export default function InvoicesPage() {
  const [items, setItems] = React.useState<InvoiceRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formPatientId, setFormPatientId] = React.useState("");
  const [formCurrency, setFormCurrency] = React.useState("USD");
  const [formTaxRate, setFormTaxRate] = React.useState("0");
  const [formDueDate, setFormDueDate] = React.useState("");
  const [formNotes, setFormNotes] = React.useState("");
  const [formLineItems, setFormLineItems] = React.useState<Array<{ description: string; quantity: number; unitPrice: number }>>([{ ...emptyLineItem }]);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<InvoiceDetail | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<InvoiceRow | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const [payModalOpen, setPayModalOpen] = React.useState(false);
  const [payAmount, setPayAmount] = React.useState("");
  const [payMethod, setPayMethod] = React.useState("BANK_TRANSFER");
  const [payRef, setPayRef] = React.useState("");
  const [paySubmitting, setPaySubmitting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    params.set("limit", "100");
    try {
      const res = await fetchWithAuth(`/api/invoices?${params}`);
      if (!res.ok) throw new Error("Failed to load invoices");
      const json = await res.json();
      setItems(json.data ?? []);
    } catch (e: any) {
      setError(e.message ?? "Error loading invoices");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  React.useEffect(() => { load(); }, [load]);

  const filtered = items.filter((i) =>
    !search || i.number.toLowerCase().includes(search.toLowerCase()) || i.patient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: items.length,
    paid: items.filter((i) => i.status === "PAID").length,
    pending: items.filter((i) => ["SENT", "VIEWED", "PARTIAL"].includes(i.status)).length,
    overdue: items.filter((i) => i.status === "OVERDUE").length,
    revenue: items.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amountPaid, 0),
  };

  const openCreate = () => {
    setEditingId(null);
    setFormPatientId("");
    setFormCurrency("USD");
    setFormTaxRate("0");
    setFormDueDate("");
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
      const payload = {
        patientId: formPatientId,
        currency: formCurrency,
        taxRate: Number(formTaxRate),
        notes: formNotes || null,
        dueDate: formDueDate ? new Date(formDueDate).toISOString() : undefined,
        lineItems: formLineItems.map((li) => ({
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
        })),
      };
      const res = editingId
        ? await fetchWithAuth(`/api/invoices/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await fetchWithAuth(`/api/invoices`, { method: "POST", body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save invoice");
      setFormOpen(false);
      await load();
    } catch (e: any) {
      setFormError(e.message ?? "Error saving invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (row: InvoiceRow) => {
    setDetailOpen(true);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await fetchWithAuth(`/api/invoices/${row.id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load invoice");
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
      const res = await fetchWithAuth(`/api/invoices/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Failed to delete invoice");
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

  const submitPayment = async () => {
    if (!detail || !payAmount) return;
    setPaySubmitting(true);
    try {
      const res = await fetchWithAuth(`/api/invoices/${detail.id}/payments`, {
        method: "POST",
        body: JSON.stringify({ amount: Number(payAmount), method: payMethod, reference: payRef || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to record payment");
      setPayModalOpen(false);
      setPayAmount("");
      setPayRef("");
      // Refresh detail
      const detailRes = await fetchWithAuth(`/api/invoices/${detail.id}`);
      const detailJson = await detailRes.json();
      setDetail(detailJson.data);
      await load();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setPaySubmitting(false);
    }
  };

  const fmtDate = (s?: string | null) => (s ? new Date(s).toLocaleDateString() : "—");
  const fmtMoney = (n: number | null | undefined, cur = "USD") => (n != null ? `${cur} ${n.toLocaleString()}` : "—");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage invoices and track payments</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> New Invoice</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats.total}</p></div><Receipt className="h-5 w-5 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Paid</p><p className="text-2xl font-bold text-green-600">{stats.paid}</p></div><CheckCircle className="h-5 w-5 text-green-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></div><Clock className="h-5 w-5 text-yellow-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Overdue</p><p className="text-2xl font-bold text-red-600">{stats.overdue}</p></div><AlertCircle className="h-5 w-5 text-red-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Revenue</p><p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p></div><DollarSign className="h-5 w-5 text-muted-foreground" /></div></CardContent></Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by invoice # or patient..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select
          options={[
            { value: "", label: "All Status" },
            { value: "DRAFT", label: "Draft" },
            { value: "SENT", label: "Sent" },
            { value: "VIEWED", label: "Viewed" },
            { value: "PARTIAL", label: "Partial" },
            { value: "PAID", label: "Paid" },
            { value: "OVERDUE", label: "Overdue" },
            { value: "CANCELLED", label: "Cancelled" },
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
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading invoices...
        </div>
      )}

      {!loading && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="p-8 text-center text-muted-foreground">No invoices found</TableCell></TableRow>
                ) : (
                  filtered.map((inv) => (
                    <TableRow key={inv.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(inv)}>
                      <TableCell className="font-medium font-mono text-sm">{inv.number}</TableCell>
                      <TableCell>{inv.patient?.name || "—"}</TableCell>
                      <TableCell><Badge variant="outline" className={STATUS_COLORS[inv.status]}>{inv.status}</Badge></TableCell>
                      <TableCell className="text-right font-medium">{fmtMoney(inv.total, inv.currency)}</TableCell>
                      <TableCell className="text-right">{fmtMoney(inv.amountPaid, inv.currency)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fmtDate(inv.dueDate)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" title="Edit" onClick={() => { openCreate(); /* TODO: populate edit */ }}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" title="Delete" onClick={() => setDeleteTarget(inv)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
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

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? "Edit Invoice" : "New Invoice"}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="inv-patientId">Patient ID *</Label>
                <Input id="inv-patientId" value={formPatientId} onChange={(e) => setFormPatientId(e.target.value)} placeholder="Patient record ID" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-currency">Currency</Label>
                <Select
                  id="inv-currency"
                  options={[{ value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "INR", label: "INR" }, { value: "GBP", label: "GBP" }]}
                  value={formCurrency}
                  onChange={(e) => setFormCurrency(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-tax">Tax Rate (%)</Label>
                <Input id="inv-tax" type="number" min="0" max="100" value={formTaxRate} onChange={(e) => setFormTaxRate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-due">Due Date</Label>
              <Input id="inv-due" type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} />
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
              <Label htmlFor="inv-notes">Notes</Label>
              <Textarea id="inv-notes" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2} />
            </div>
            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="h-4 w-4" /> {formError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={submitForm} disabled={submitting || !formPatientId || formLineItems.some((li) => !li.description)}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : editingId ? "Save Changes" : "Create Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} title={`Invoice ${detail?.number ?? ""}`}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {detailLoading && <div className="flex items-center justify-center py-8 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...</div>}
          {detail && (
            <div className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={STATUS_COLORS[detail.status]}>{detail.status}</Badge></div>
                <div><span className="text-muted-foreground">Patient:</span> {detail.patient?.name || "—"}</div>
                <div><span className="text-muted-foreground">Issue Date:</span> {fmtDate(detail.issueDate)}</div>
                <div><span className="text-muted-foreground">Due Date:</span> {fmtDate(detail.dueDate)}</div>
                <div><span className="text-muted-foreground">Subtotal:</span> {fmtMoney(detail.subtotal, detail.currency)}</div>
                <div><span className="text-muted-foreground">Tax ({detail.taxRate}%):</span> {fmtMoney(detail.taxAmount, detail.currency)}</div>
                <div><span className="text-muted-foreground font-semibold">Total:</span> <span className="font-semibold">{fmtMoney(detail.total, detail.currency)}</span></div>
                <div><span className="text-muted-foreground font-semibold">Paid:</span> <span className="font-semibold text-green-600">{fmtMoney(detail.amountPaid, detail.currency)}</span></div>
                {detail.notes && <div className="md:col-span-2"><span className="text-muted-foreground">Notes:</span> {detail.notes}</div>}
              </div>

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

              {detail.payments.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Payments</h4>
                  <ul className="space-y-1 text-sm">
                    {detail.payments.map((p) => (
                      <li key={p.id} className="flex justify-between p-2 bg-muted rounded">
                        <span>{fmtMoney(p.amount, detail.currency)} via {p.method}{p.reference ? ` (${p.reference})` : ""}</span>
                        <span className="text-xs text-muted-foreground">{fmtDate(p.receivedAt)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {detail.status !== "PAID" && detail.status !== "CANCELLED" && (
                  <Button size="sm" onClick={() => { setPayAmount(""); setPayMethod("BANK_TRANSFER"); setPayRef(""); setPayModalOpen(true); }}>
                    <DollarSign className="h-4 w-4 mr-2" /> Record Payment
                  </Button>
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

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Invoice">
        <DialogContent>
          <p className="text-sm">Are you sure you want to delete <strong>{deleteTarget?.number}</strong>? This permanently removes the invoice and its line items.</p>
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

      <Dialog open={payModalOpen} onClose={() => setPayModalOpen(false)} title="Record Payment">
        <DialogContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input type="number" min="0.01" step="0.01" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <Label>Method</Label>
              <Select
                options={[
                  { value: "BANK_TRANSFER", label: "Bank Transfer" },
                  { value: "CARD", label: "Card" },
                  { value: "CASH", label: "Cash" },
                  { value: "CHEQUE", label: "Cheque" },
                  { value: "INSURANCE", label: "Insurance" },
                  { value: "OTHER", label: "Other" },
                ]}
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Reference (optional)</Label>
              <Input value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="Transaction reference" />
            </div>
            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="h-4 w-4" /> {formError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayModalOpen(false)} disabled={paySubmitting}>Cancel</Button>
            <Button onClick={submitPayment} disabled={paySubmitting || !payAmount}>
              {paySubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Recording...</> : "Record Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
