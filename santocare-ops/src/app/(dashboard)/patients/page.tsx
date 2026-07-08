"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  MoreHorizontal,
  ChevronRight,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/fetch-client";

const PIPELINE_STAGES = [
  { id: "INQUIRY_RECEIVED", label: "Inquiry", color: "bg-blue-500" },
  { id: "QUALIFICATION", label: "Qualification", color: "bg-amber-500" },
  { id: "TREATMENT_PLAN_SENT", label: "Treatment Plan", color: "bg-purple-500" },
  { id: "CONFIRMATION", label: "Confirmation", color: "bg-orange-500" },
  { id: "VISA_TRAVEL", label: "Visa & Travel", color: "bg-cyan-500" },
  { id: "ARRIVED_ADMITTED", label: "Arrived", color: "bg-teal-500" },
  { id: "IN_TREATMENT", label: "In Treatment", color: "bg-red-500" },
  { id: "AYURVEDA_RECOVERY", label: "Ayurveda", color: "bg-green-500" },
  { id: "COMPLETED_FOLLOWUP", label: "Follow-up", color: "bg-emerald-500" },
  { id: "CLOSED", label: "Closed", color: "bg-gray-500" },
];

const TREATMENT_TYPES = [
  "Orthopedic (Hip/Knee Replacement)",
  "Cardiac (Heart Bypass/Valve)",
  "Neurology (Spine/Neuro)",
  "Oncology (Cancer Treatment)",
  "Ayurveda & Wellness",
  "Fertility Treatment",
  "Dental",
  "Ophthalmology",
  "General Surgery",
  "Other",
];

const COUNTRIES = [
  "Kenya", "Tanzania", "Uganda", "Nigeria", "Ghana", "Ethiopia", "South Africa",
  "United Kingdom", "Germany", "France", "UAE", "Saudi Arabia", "Other",
];

const stageColors: Record<string, string> = {
  INQUIRY_RECEIVED: "bg-blue-100 text-blue-800",
  QUALIFICATION: "bg-amber-100 text-amber-800",
  TREATMENT_PLAN_SENT: "bg-purple-100 text-purple-800",
  CONFIRMATION: "bg-orange-100 text-orange-800",
  VISA_TRAVEL: "bg-cyan-100 text-cyan-800",
  ARRIVED_ADMITTED: "bg-teal-100 text-teal-800",
  IN_TREATMENT: "bg-red-100 text-red-800",
  AYURVEDA_RECOVERY: "bg-green-100 text-green-800",
  COMPLETED_FOLLOWUP: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

interface PatientRow {
  id: string;
  referenceNumber: string;
  name: string;
  country: string;
  phone: string;
  email: string;
  treatmentType: string;
  stage: string;
  estimatedCost: number | null;
  inquiryDate: string;
  assignedCoordinator?: { id: string; name: string } | null;
}

interface PatientDetail extends PatientRow {
  whatsapp?: string | null;
  treatmentDescription?: string | null;
  preferredHospital?: string | null;
  expectedTravelDate?: string | null;
  actualTravelDate?: string | null;
  dischargeDate?: string | null;
  depositReceived?: boolean;
  depositAmount?: number | null;
  finalCost?: number | null;
  stageHistory?: Array<{
    id: string;
    fromStage: string | null;
    toStage: string;
    changedAt: string;
    note: string | null;
  }>;
  notes?: Array<{ id: string; content: string; createdAt: string; createdBy?: { name: string } }>;
  tasks?: Array<{ id: string; title: string; status: string; dueDate: string }>;
  invoices?: Array<{ id: string; number: string; status: string; total: number }>;
  quotes?: Array<{ id: string; number: string; status: string; total: number }>;
}

interface Coordinator { id: string; name: string; email: string; role: string }

const emptyForm = {
  name: "", email: "", phone: "", whatsapp: "", country: "Kenya",
  treatmentType: "Orthopedic (Hip/Knee Replacement)", treatmentDescription: "",
  preferredHospital: "", estimatedCost: "", assignedCoordinatorId: "",
  expectedTravelDate: "",
};

export default function PatientsPage() {
  const [view, setView] = React.useState<"kanban" | "table">("table");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [stageFilter, setStageFilter] = React.useState("");
  const [countryFilter, setCountryFilter] = React.useState("");

  const [patients, setPatients] = React.useState<PatientRow[]>([]);
  const [coordinators, setCoordinators] = React.useState<Coordinator[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<PatientDetail | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<PatientRow | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const loadPatients = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (stageFilter) params.set("stage", stageFilter);
    if (countryFilter) params.set("country", countryFilter);
    params.set("limit", "100");
    try {
      const res = await fetchWithAuth(`/api/patients?${params}`);
      if (!res.ok) throw new Error("Failed to load patients");
      const json = await res.json();
      setPatients(json.data ?? []);
    } catch (e: any) {
      setError(e.message ?? "Error loading patients");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, stageFilter, countryFilter]);

  const loadCoordinators = React.useCallback(async () => {
    try {
      const res = await fetchWithAuth(`/api/users`);
      if (!res.ok) return;
      const json = await res.json();
      setCoordinators((json.users ?? []).filter((u: Coordinator) => u.role === "COORDINATOR" || u.role === "ADMIN" || u.role === "MANAGER"));
    } catch {
      // Non-fatal; coordinator dropdown just stays empty
    }
  }, []);

  React.useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  React.useEffect(() => {
    loadCoordinators();
  }, [loadCoordinators]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (p: PatientRow) => {
    setEditingId(p.id);
    setForm({
      name: p.name, email: p.email, phone: p.phone, whatsapp: "",
      country: p.country, treatmentType: p.treatmentType, treatmentDescription: "",
      preferredHospital: "", estimatedCost: p.estimatedCost != null ? String(p.estimatedCost) : "",
      assignedCoordinatorId: p.assignedCoordinator?.id ?? "",
      expectedTravelDate: "",
    });
    setFormError(null);
    setFormOpen(true);
  };

  const submitForm = async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone,
        whatsapp: form.whatsapp || undefined,
        country: form.country,
        treatmentType: form.treatmentType,
        treatmentDescription: form.treatmentDescription || undefined,
        preferredHospital: form.preferredHospital || undefined,
        estimatedCost: form.estimatedCost ? Number(form.estimatedCost) : undefined,
        assignedCoordinatorId: form.assignedCoordinatorId || undefined,
        expectedTravelDate: form.expectedTravelDate || undefined,
      };
      const res = editingId
        ? await fetchWithAuth(`/api/patients/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await fetchWithAuth(`/api/patients`, { method: "POST", body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save patient");
      setFormOpen(false);
      await loadPatients();
    } catch (e: any) {
      setFormError(e.message ?? "Error saving patient");
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (p: PatientRow) => {
    setDetailOpen(true);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await fetchWithAuth(`/api/patients/${p.id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load patient");
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
      const res = await fetchWithAuth(`/api/patients/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Failed to delete patient");
      }
      setDeleteTarget(null);
      await loadPatients();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const patientsByStage = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    patients: patients.filter((p) => p.stage === stage.id),
  }));

  const fmtDate = (s?: string | null) => (s ? new Date(s).toLocaleDateString() : "—");
  const fmtMoney = (n: number | null | undefined) => (n != null ? `$${n.toLocaleString()}` : "—");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage patient pipeline and track progress</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Patient
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, reference, or country..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Select
          options={[{ value: "", label: "All Stages" }, ...PIPELINE_STAGES.map((s) => ({ value: s.id, label: s.label }))]}
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="w-full md:w-[200px]"
        />
        <Select
          options={[{ value: "", label: "All Countries" }, ...COUNTRIES.map((c) => ({ value: c, label: c }))]}
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="w-full md:w-[180px]"
        />
        <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "table")}>
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-4 animate-spin mr-2" /> Loading patients...
        </div>
      )}

      {!loading && view === "kanban" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {patientsByStage.map((stage) => (
              <div key={stage.id} className="w-72 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                  <h3 className="font-semibold text-sm">{stage.label}</h3>
                  <Badge variant="secondary" className="ml-auto text-xs">{stage.patients.length}</Badge>
                </div>
                <div className="space-y-3">
                  {stage.patients.map((patient) => (
                    <Card key={patient.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => openDetail(patient)}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{patient.name}</p>
                            <p className="text-xs text-muted-foreground">{patient.country}</p>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">{patient.referenceNumber}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{patient.treatmentType}</div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-xs font-medium text-primary">{fmtMoney(patient.estimatedCost)}</span>
                          <span className="text-xs text-muted-foreground">{patient.assignedCoordinator?.name ?? "Unassigned"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stage.patients.length === 0 && (
                    <div className="border-2 border-dashed rounded-lg p-4 text-center text-sm text-muted-foreground">No patients</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && view === "table" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Coordinator</TableHead>
                  <TableHead className="text-right">Est. Cost</TableHead>
                  <TableHead>Inquiry Date</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-xs text-muted-foreground">{patient.country}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{patient.referenceNumber}</TableCell>
                    <TableCell>{patient.treatmentType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={stageColors[patient.stage]}>
                        {PIPELINE_STAGES.find((s) => s.id === patient.stage)?.label ?? patient.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.assignedCoordinator?.name ?? "Unassigned"}</TableCell>
                    <TableCell className="text-right font-medium">{fmtMoney(patient.estimatedCost)}</TableCell>
                    <TableCell>{fmtDate(patient.inquiryDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" title="View detail" onClick={() => openDetail(patient)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Link href={`/patients/${patient.id}`} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" title="Full page"><MoreHorizontal className="h-4 w-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="sm" title="Edit" onClick={() => openEdit(patient)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" title="Delete" onClick={() => setDeleteTarget(patient)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? "Edit Patient" : "Add New Patient"}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="patient@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 700 123 456" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="(optional)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select id="country" options={COUNTRIES.map((c) => ({ value: c, label: c }))} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment Type *</Label>
                <Select id="treatment" options={TREATMENT_TYPES.map((t) => ({ value: t, label: t }))} value={form.treatmentType} onChange={(e) => setForm({ ...form, treatmentType: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital">Preferred Hospital</Label>
                <Input id="hospital" value={form.preferredHospital} onChange={(e) => setForm({ ...form, preferredHospital: e.target.value })} placeholder="e.g., Aster Medcity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Estimated Cost (USD)</Label>
                <Input id="cost" type="number" value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} placeholder="15000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="travel-date">Expected Travel Date</Label>
                <Input id="travel-date" type="date" value={form.expectedTravelDate} onChange={(e) => setForm({ ...form, expectedTravelDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coordinator">Assign Coordinator</Label>
                <Select
                  id="coordinator"
                  options={[{ value: "", label: "Unassigned" }, ...coordinators.map((c) => ({ value: c.id, label: c.name }))]}
                  value={form.assignedCoordinatorId}
                  onChange={(e) => setForm({ ...form, assignedCoordinatorId: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Treatment Description</Label>
              <Textarea id="description" value={form.treatmentDescription} onChange={(e) => setForm({ ...form, treatmentDescription: e.target.value })} placeholder="Additional details..." rows={3} />
            </div>
            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="h-4 w-4" /> {formError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={submitForm} disabled={submitting || !form.name || !form.phone}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : editingId ? "Save Changes" : "Create Patient"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} title="Patient Detail">
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {detailLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-4 animate-spin mr-2" /> Loading...
            </div>
          )}
          {detail && (
            <div className="space-y-6">
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div><span className="text-muted-foreground">Reference:</span> <span className="font-mono">{detail.referenceNumber}</span></div>
                <div><span className="text-muted-foreground">Stage:</span> <Badge variant="outline" className={stageColors[detail.stage]}>{PIPELINE_STAGES.find((s) => s.id === detail.stage)?.label ?? detail.stage}</Badge></div>
                <div><span className="text-muted-foreground">Name:</span> {detail.name}</div>
                <div><span className="text-muted-foreground">Country:</span> {detail.country}</div>
                <div><span className="text-muted-foreground">Phone:</span> {detail.phone}</div>
                <div><span className="text-muted-foreground">Email:</span> {detail.email || "—"}</div>
                <div><span className="text-muted-foreground">WhatsApp:</span> {detail.whatsapp || "—"}</div>
                <div><span className="text-muted-foreground">Treatment:</span> {detail.treatmentType}</div>
                <div><span className="text-muted-foreground">Hospital:</span> {detail.preferredHospital || "—"}</div>
                <div><span className="text-muted-foreground">Est. Cost:</span> {fmtMoney(detail.estimatedCost)}</div>
                <div><span className="text-muted-foreground">Travel Date:</span> {fmtDate(detail.expectedTravelDate)}</div>
                <div><span className="text-muted-foreground">Coordinator:</span> {detail.assignedCoordinator?.name ?? "Unassigned"}</div>
              </div>

              {detail.treatmentDescription && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Treatment Description</h4>
                  <p className="text-sm text-muted-foreground">{detail.treatmentDescription}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-2">Stage History</h4>
                {detail.stageHistory && detail.stageHistory.length > 0 ? (
                  <ol className="relative border-l border-gray-200 ml-2 space-y-3">
                    {detail.stageHistory.map((h) => (
                      <li key={h.id} className="ml-4">
                        <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary" />
                        <p className="text-sm font-medium">
                          {PIPELINE_STAGES.find((s) => s.id === h.toStage)?.label ?? h.toStage}
                          {h.fromStage && <span className="text-muted-foreground"> (from {PIPELINE_STAGES.find((s) => s.id === h.fromStage)?.label ?? h.fromStage})</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(h.changedAt).toLocaleString()}</p>
                        {h.note && <p className="text-xs mt-1">{h.note}</p>}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-muted-foreground">No stage changes recorded.</p>
                )}
              </div>

              {(detail.notes?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Recent Notes</h4>
                  <ul className="space-y-2">
                    {detail.notes!.slice(0, 5).map((n) => (
                      <li key={n.id} className="text-sm p-2 bg-muted rounded">
                        <p>{n.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">— {n.createdBy?.name ?? "Unknown"}, {fmtDate(n.createdAt)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(detail.tasks?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Open Tasks</h4>
                  <ul className="space-y-1 text-sm">
                    {detail.tasks!.map((t) => (
                      <li key={t.id} className="flex justify-between p-2 bg-muted rounded">
                        <span>{t.title}</span>
                        <span className="text-xs text-muted-foreground">{t.status} · due {fmtDate(t.dueDate)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Patient">
        <DialogContent>
          <p className="text-sm">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong> ({deleteTarget?.referenceNumber})?
            The patient will be soft-deleted and excluded from default queries. Audit history is preserved.
          </p>
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