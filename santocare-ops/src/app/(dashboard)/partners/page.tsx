"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  Users,
  DollarSign,
  FileText,
  Clock,
  Star,
  Edit,
  Trash2,
  ChevronRight,
  AlertCircle,
  Loader2,
  Globe,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/fetch-client";

type PartnerCategory = "HOSPITAL" | "AYURVEDA" | "LAB" | "TRANSPORT" | "NURSING" | "EQUIPMENT";
type AgreementStatus = "NONE" | "PENDING" | "SIGNED" | "EXPIRED";

const CATEGORIES: { value: PartnerCategory | "all"; label: string }[] = [
  { value: "all", label: "All Partners" },
  { value: "HOSPITAL", label: "Hospitals" },
  { value: "AYURVEDA", label: "Ayurveda" },
  { value: "LAB", label: "Labs" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "NURSING", label: "Nursing" },
  { value: "EQUIPMENT", label: "Equipment" },
];

const CATEGORY_LABELS: Record<PartnerCategory, string> = {
  HOSPITAL: "Hospital",
  AYURVEDA: "Ayurveda",
  LAB: "Lab",
  TRANSPORT: "Transport",
  NURSING: "Nursing",
  EQUIPMENT: "Equipment",
};

const CATEGORY_COLORS: Record<PartnerCategory, string> = {
  HOSPITAL: "bg-blue-100 text-blue-800",
  AYURVEDA: "bg-green-100 text-green-800",
  LAB: "bg-purple-100 text-purple-800",
  TRANSPORT: "bg-orange-100 text-orange-800",
  NURSING: "bg-pink-100 text-pink-800",
  EQUIPMENT: "bg-yellow-100 text-yellow-800",
};

const AGREEMENT_LABELS: Record<AgreementStatus, string> = {
  NONE: "No Agreement",
  PENDING: "Pending",
  SIGNED: "Signed",
  EXPIRED: "Expired",
};

const AGREEMENT_COLORS: Record<AgreementStatus, string> = {
  NONE: "bg-gray-100 text-gray-800",
  PENDING: "bg-amber-100 text-amber-800",
  SIGNED: "bg-green-100 text-green-800",
  EXPIRED: "bg-red-100 text-red-800",
};

interface PartnerRow {
  id: string;
  name: string;
  category: PartnerCategory;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  agreementStatus: AgreementStatus;
  agreementExpiresAt: string | null;
  commissionRate: number | null;
  totalPatientsReferred: number;
  totalRevenue: number;
  satisfactionScore: number | null;
  isPubliclyListed: boolean;
  createdAt: string;
}

interface PartnerDetail extends PartnerRow {
  website: string | null;
  description: string | null;
  specializations: string[];
  agreementDate: string | null;
  responseTime: number | null;
  slug: string | null;
  notes?: Array<{ id: string; content: string; createdAt: string; createdBy?: { name: string } }>;
  documents?: Array<{ id: string; name: string; type: string; createdAt: string }>;
  _count?: { itineraryEvents: number };
}

const emptyForm = {
  name: "", category: "HOSPITAL" as PartnerCategory, contactPerson: "",
  phone: "", email: "", address: "", website: "", description: "",
  commissionRate: "", agreementStatus: "PENDING" as AgreementStatus,
  agreementDate: "", agreementExpiresAt: "", isPubliclyListed: false,
};

export default function PartnersPage() {
  const [partners, setPartners] = React.useState<PartnerRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<PartnerCategory | "all">("all");

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<PartnerDetail | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<PartnerRow | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const loadPartners = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    params.set("limit", "100");
    try {
      const res = await fetchWithAuth(`/api/partners?${params}`);
      if (!res.ok) throw new Error("Failed to load partners");
      const json = await res.json();
      setPartners(json.data ?? []);
    } catch (e: any) {
      setError(e.message ?? "Error loading partners");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter]);

  React.useEffect(() => {
    loadPartners();
  }, [loadPartners]);

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.contactPerson?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (p.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalPartners: partners.length,
    activeMOUs: partners.filter((p) => p.agreementStatus === "SIGNED").length,
    totalPatientsReferred: partners.reduce((sum, p) => sum + p.totalPatientsReferred, 0),
    totalRevenue: partners.reduce((sum, p) => sum + p.totalRevenue, 0),
    expiringSoon: partners.filter(
      (p) =>
        p.agreementStatus === "SIGNED" &&
        p.agreementExpiresAt &&
        new Date(p.agreementExpiresAt) <= new Date(Date.now() + 30 * 86_400_000)
    ).length,
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (p: PartnerRow) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      contactPerson: p.contactPerson ?? "",
      phone: p.phone ?? "",
      email: p.email ?? "",
      address: p.address ?? "",
      website: "",
      description: "",
      commissionRate: p.commissionRate != null ? String(p.commissionRate) : "",
      agreementStatus: p.agreementStatus,
      agreementDate: "",
      agreementExpiresAt: p.agreementExpiresAt ?? "",
      isPubliclyListed: p.isPubliclyListed,
    });
    setFormError(null);
    setFormOpen(true);
  };

  const submitForm = async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      const payload: Record<string, any> = {
        name: form.name,
        category: form.category,
        agreementStatus: form.agreementStatus,
        isPubliclyListed: form.isPubliclyListed,
      };
      if (form.contactPerson) payload.contactPerson = form.contactPerson;
      if (form.phone) payload.phone = form.phone;
      if (form.email) payload.email = form.email;
      if (form.address) payload.address = form.address;
      if (form.website) payload.website = form.website;
      if (form.description) payload.description = form.description;
      if (form.commissionRate) payload.commissionRate = Number(form.commissionRate);
      if (form.agreementDate) payload.agreementDate = new Date(form.agreementDate).toISOString();
      if (form.agreementExpiresAt) payload.agreementExpiresAt = new Date(form.agreementExpiresAt).toISOString();

      const res = editingId
        ? await fetchWithAuth(`/api/partners/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await fetchWithAuth(`/api/partners`, { method: "POST", body: JSON.stringify(payload) });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save partner");
      setFormOpen(false);
      await loadPartners();
    } catch (e: any) {
      setFormError(e.message ?? "Error saving partner");
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (p: PartnerRow) => {
    setDetailOpen(true);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await fetchWithAuth(`/api/partners/${p.id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load partner");
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
      const res = await fetchWithAuth(`/api/partners/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Failed to delete partner");
      }
      setDeleteTarget(null);
      if (detail?.id === deleteTarget.id) {
        setDetailOpen(false);
        setDetail(null);
      }
      await loadPartners();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const daysUntilExpiry = (dateStr: string | null): number | null => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diff / 86_400_000);
  };

  const fmtDate = (s?: string | null) => (s ? new Date(s).toLocaleDateString() : "—");
  const fmtMoney = (n: number | null | undefined) => (n != null ? `$${n.toLocaleString()}` : "—");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
          <p className="text-muted-foreground">Manage healthcare partners and service providers</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Partners</p>
                <p className="text-2xl font-bold">{stats.totalPartners}</p>
              </div>
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active MOUs</p>
                <p className="text-2xl font-bold">{stats.activeMOUs}</p>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Patients Referred</p>
                <p className="text-2xl font-bold">{stats.totalPatientsReferred}</p>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Partner Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className={`text-2xl font-bold ${stats.expiringSoon > 0 ? "text-red-600" : ""}`}>
                  {stats.expiringSoon}
                </p>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, contact, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as PartnerCategory | "all")}
          className="w-full md:w-[200px]"
        />
      </div>

      <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as PartnerCategory | "all")}>
        <TabsList>
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
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
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading partners...
        </div>
      )}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPartners.map((partner) => {
            const daysLeft = daysUntilExpiry(partner.agreementExpiresAt);
            return (
              <Card key={partner.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{partner.name}</h3>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className={CATEGORY_COLORS[partner.category]}>
                          {CATEGORY_LABELS[partner.category]}
                        </Badge>
                        <Badge variant="outline" className={AGREEMENT_COLORS[partner.agreementStatus]}>
                          {AGREEMENT_LABELS[partner.agreementStatus]}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {daysLeft !== null && daysLeft <= 30 && partner.agreementStatus === "SIGNED" && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                      <AlertCircle className="h-3 w-3" />
                      {daysLeft <= 0 ? "Agreement expired" : `${daysLeft} days left`}
                    </div>
                  )}

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" />
                      {partner.totalPatientsReferred} patients
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5" />
                      {fmtMoney(partner.totalRevenue)}
                    </div>
                    {partner.satisfactionScore && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                        {partner.satisfactionScore}/5
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t space-y-1 text-sm">
                    {partner.contactPerson && <p className="font-medium">{partner.contactPerson}</p>}
                    {partner.phone && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3 w-3" /> {partner.phone}
                      </div>
                    )}
                    {partner.email && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3 w-3" /> {partner.email}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openDetail(partner)}>
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(partner)} title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(partner)} title="Delete">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && filteredPartners.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No partners found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Partner
          </Button>
        </div>
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? "Edit Partner" : "Add New Partner"}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Partner Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aster Medcity" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  id="category"
                  options={CATEGORIES.filter((c) => c.value !== "all").map((c) => ({ value: c.value, label: c.label }))}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as PartnerCategory })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} placeholder="Dr. Prem Nair" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 484 400 8000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contact@partner.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Kochi, Kerala" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://asterhospital.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input id="commissionRate" type="number" step="0.1" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: e.target.value })} placeholder="5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agreementStatus">Agreement Status</Label>
                <Select
                  id="agreementStatus"
                  options={[
                    { value: "NONE", label: "No Agreement" },
                    { value: "PENDING", label: "Pending" },
                    { value: "SIGNED", label: "Signed" },
                    { value: "EXPIRED", label: "Expired" },
                  ]}
                  value={form.agreementStatus}
                  onChange={(e) => setForm({ ...form, agreementStatus: e.target.value as AgreementStatus })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agreementDate">Agreement Date</Label>
                <Input id="agreementDate" type="date" value={form.agreementDate} onChange={(e) => setForm({ ...form, agreementDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agreementExpiresAt">Agreement Expiry</Label>
                <Input id="agreementExpiresAt" type="date" value={form.agreementExpiresAt} onChange={(e) => setForm({ ...form, agreementExpiresAt: e.target.value })} />
              </div>
              <div className="space-y-2 flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPubliclyListed}
                    onChange={(e) => setForm({ ...form, isPubliclyListed: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">List in public directory</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Partner description..." rows={3} />
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
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : editingId ? "Save Changes" : "Create Partner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} title="Partner Details">
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {detailLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
            </div>
          )}
          {detail && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{detail.name}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className={CATEGORY_COLORS[detail.category]}>
                      {CATEGORY_LABELS[detail.category]}
                    </Badge>
                    <Badge variant="outline" className={AGREEMENT_COLORS[detail.agreementStatus]}>
                      {AGREEMENT_LABELS[detail.agreementStatus]}
                    </Badge>
                    {detail.isPubliclyListed && (
                      <Badge variant="outline" className="bg-teal-100 text-teal-800">
                        <Globe className="h-3 w-3 mr-1" /> Public
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {detail.agreementExpiresAt && detail.agreementStatus === "SIGNED" && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  daysUntilExpiry(detail.agreementExpiresAt)! <= 30
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  <Clock className="h-4 w-4" />
                  Agreement {daysUntilExpiry(detail.agreementExpiresAt)! <= 0
                    ? "expired"
                    : `expires in ${daysUntilExpiry(detail.agreementExpiresAt)} days`}
                  ({fmtDate(detail.agreementExpiresAt)})
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div><span className="text-muted-foreground">Phone:</span> {detail.phone || "—"}</div>
                <div><span className="text-muted-foreground">Email:</span> {detail.email || "—"}</div>
                <div><span className="text-muted-foreground">Address:</span> {detail.address || "—"}</div>
                <div><span className="text-muted-foreground">Website:</span> {detail.website || "—"}</div>
                <div><span className="text-muted-foreground">Contact:</span> {detail.contactPerson || "—"}</div>
                <div><span className="text-muted-foreground">Commission:</span> {detail.commissionRate != null ? `${detail.commissionRate}%` : "—"}</div>
                <div><span className="text-muted-foreground">Response Time:</span> {detail.responseTime != null ? `${detail.responseTime}h` : "—"}</div>
                <div><span className="text-muted-foreground">Satisfaction:</span> {detail.satisfactionScore != null ? `${detail.satisfactionScore}/5` : "—"}</div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Referred</p>
                    <p className="font-medium">{detail.totalPatientsReferred}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-medium">{fmtMoney(detail.totalRevenue)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Itinerary Events</p>
                    <p className="font-medium">{detail._count?.itineraryEvents ?? 0}</p>
                  </div>
                </div>
              </div>

              {detail.description && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{detail.description}</p>
                </div>
              )}

              {detail.specializations && detail.specializations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {detail.specializations.map((s, i) => (
                      <Badge key={i} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

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

              {(detail.documents?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Documents</h4>
                  <ul className="space-y-1 text-sm">
                    {detail.documents!.slice(0, 5).map((d) => (
                      <li key={d.id} className="flex justify-between p-2 bg-muted rounded">
                        <span>{d.name}</span>
                        <span className="text-xs text-muted-foreground">{d.type} · {fmtDate(d.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => { setDetailOpen(false); openEdit(detail); }}>
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

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Partner">
        <DialogContent>
          <p className="text-sm">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
            The partner will be soft-deleted and excluded from default queries. Audit history is preserved.
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
