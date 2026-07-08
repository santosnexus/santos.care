"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Search,
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface VisaApplication {
  id: string;
  patientId: string;
  type: string;
  status: string;
  country: string;
  embassy: string | null;
  applicationDate: string | null;
  submittedDate: string | null;
  decisionDate: string | null;
  visaExpiryDate: string | null;
  frroRegistered: boolean;
  remarks: string | null;
  attendantCount: number;
  patient: { id: string; name: string; referenceNumber: string };
  documents: { id: string; name: string; status: string }[];
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  DOCUMENTS_COLLECTED: { label: "Docs Collected", color: "bg-blue-100 text-blue-800", icon: <FileText className="h-3 w-3" /> },
  SUBMITTED: { label: "Submitted", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" /> },
  IN_REVIEW: { label: "In Review", color: "bg-purple-100 text-purple-800", icon: <Search className="h-3 w-3" /> },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-3 w-3" /> },
  STAMPED: { label: "Stamped", color: "bg-emerald-100 text-emerald-800", icon: <FileText className="h-3 w-3" /> },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3" /> },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-600", icon: <XCircle className="h-3 w-3" /> },
};

export default function VisaPage() {
  const [applications, setApplications] = React.useState<VisaApplication[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [showCreate, setShowCreate] = React.useState(false);
  const [selectedApp, setSelectedApp] = React.useState<VisaApplication | null>(null);
  const [creating, setCreating] = React.useState(false);

  const [form, setForm] = React.useState({
    patientId: "",
    patientName: "",
    type: "MEDICAL",
    country: "",
    embassy: "",
    attendantCount: 0,
    remarks: "",
  });

  const fetchApplications = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/visa?${params}`);
      if (!res.ok) throw new Error("Failed to fetch visa applications");
      const json = await res.json();
      setApplications(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  React.useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/visa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create visa application");
      setShowCreate(false);
      setForm({ patientId: "", patientName: "", type: "MEDICAL", country: "", embassy: "", attendantCount: 0, remarks: "" });
      fetchApplications();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/visa/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchApplications();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const stats = React.useMemo(() => {
    const total = applications.length;
    const active = applications.filter((a) => !["REJECTED", "CANCELLED", "STAMPED"].includes(a.status)).length;
    const approved = applications.filter((a) => a.status === "APPROVED" || a.status === "STAMPED").length;
    const frroPending = applications.filter((a) => a.status === "APPROVED" && !a.frroRegistered).length;
    return { total, active, approved, frroPending };
  }, [applications]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visa Management</h1>
          <p className="text-muted-foreground">Track visa applications and immigration status</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved/Stamped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">FRRO Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.frroPending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="w-[180px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value === "all" ? "" : e.target.value)}
        >
          <option value="all">All statuses</option>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto text-destructive mb-2" />
              <p className="text-destructive">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchApplications}>Retry</Button>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No visa applications found</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowCreate(true)}>
                Create First Application
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Attendants</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => {
                  const cfg = statusConfig[app.status] || statusConfig.DOCUMENTS_COLLECTED;
                  return (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="font-medium">{app.patient.name}</div>
                        <div className="text-xs text-muted-foreground">{app.patient.referenceNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {app.country}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{app.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cfg.color}>
                          <span className="flex items-center gap-1">
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {app.submittedDate ? new Date(app.submittedDate).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {app.visaExpiryDate ? new Date(app.visaExpiryDate).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>{app.attendantCount}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                            View
                          </Button>
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

      {/* Create Dialog */}
      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Visa Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Input placeholder="Search and select patient..." value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
              <p className="text-xs text-muted-foreground">Enter patient ID or name</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Visa Type</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="MEDICAL">Medical</option>
                  <option value="TOURIST">Tourist</option>
                  <option value="ATTENDANT">Attendant</option>
                  <option value="BUSINESS">Business</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input placeholder="e.g., India" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Embassy / Consulate</Label>
              <Input placeholder="Embassy location" value={form.embassy} onChange={(e) => setForm({ ...form, embassy: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Attendants</Label>
                <Input type="number" min={0} value={form.attendantCount} onChange={(e) => setForm({ ...form, attendantCount: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Input placeholder="Additional notes..." value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating || !form.country}>
              {creating ? "Creating..." : "Create Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Visa — {selectedApp.patient.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className={(statusConfig[selectedApp.status] || statusConfig.DOCUMENTS_COLLECTED).color}>
                        {(statusConfig[selectedApp.status] || statusConfig.DOCUMENTS_COLLECTED).label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <div className="mt-1 font-medium">{selectedApp.type}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Country</Label>
                    <div className="mt-1 font-medium">{selectedApp.country}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Embassy</Label>
                    <div className="mt-1">{selectedApp.embassy || "-"}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Attendants</Label>
                    <div className="mt-1">{selectedApp.attendantCount}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">FRRO Registered</Label>
                    <div className="mt-1">{selectedApp.frroRegistered ? "Yes" : "No"}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Status Actions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["DOCUMENTS_COLLECTED", "SUBMITTED", "IN_REVIEW", "APPROVED", "STAMPED", "REJECTED", "CANCELLED"].map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={selectedApp.status === s ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedApp.id, s)}
                        disabled={selectedApp.status === s}
                      >
                        {(statusConfig[s] || {}).label || s}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedApp.documents.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Documents</Label>
                    <div className="mt-2 space-y-1">
                      {selectedApp.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{doc.name}</span>
                          <Badge variant="outline">{doc.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApp.remarks && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Remarks</Label>
                    <p className="mt-1 text-sm">{selectedApp.remarks}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
