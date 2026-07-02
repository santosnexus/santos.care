"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Filter,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  Building2,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  FileText,
} from "lucide-react";

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
  "MS (Multiple Sclerosis)",
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

const MOCK_PATIENTS = [
  { id: "1", ref: "HIMT-2026-0042", name: "James Mwangi", country: "Kenya", phone: "+254 712 345 678", email: "james.mwangi@email.com", treatment: "Hip Replacement", stage: "CONFIRMATION", coordinator: "Priya Sharma", estimatedCost: 12500, inquiryDate: "2026-06-20" },
  { id: "2", ref: "HIMT-2026-0041", name: "Fatima Al-Hassan", country: "UAE", phone: "+971 50 123 4567", email: "fatima.h@email.com", treatment: "Cardiac Bypass", stage: "VISA_TRAVEL", coordinator: "Rahul Kumar", estimatedCost: 18000, inquiryDate: "2026-06-18" },
  { id: "3", ref: "HIMT-2026-0039", name: "Samuel Okonkwo", country: "Nigeria", phone: "+234 803 456 7890", email: "s.okonkwo@email.com", treatment: "MS Treatment", stage: "AYURVEDA_RECOVERY", coordinator: "Priya Sharma", estimatedCost: 15000, inquiryDate: "2026-05-15" },
  { id: "4", ref: "HIMT-2026-0043", name: "Anna Schmidt", country: "Germany", phone: "+49 170 1234567", email: "anna.schmidt@email.com", treatment: "Knee Replacement", stage: "INQUIRY_RECEIVED", coordinator: "Unassigned", estimatedCost: 11000, inquiryDate: "2026-06-28" },
  { id: "5", ref: "HIMT-2026-0040", name: "Grace Wanjiku", country: "Kenya", phone: "+254 722 987 654", email: "grace.w@email.com", treatment: "Spinal Surgery", stage: "QUALIFICATION", coordinator: "Rahul Kumar", estimatedCost: 22000, inquiryDate: "2026-06-10" },
  { id: "6", ref: "HIMT-2026-0038", name: "Kofi Mensah", country: "Ghana", phone: "+233 244 567 890", email: "kofi.mensah@email.com", treatment: "Heart Valve Replacement", stage: "TREATMENT_PLAN_SENT", coordinator: "Priya Sharma", estimatedCost: 16500, inquiryDate: "2026-06-05" },
  { id: "7", ref: "HIMT-2026-0037", name: "Olusegun Adeyemi", country: "Nigeria", phone: "+234 802 234 5678", email: "o.adeyemi@email.com", treatment: "Ayurveda & Wellness", stage: "ARRIVED_ADMITTED", coordinator: "Rahul Kumar", estimatedCost: 8000, inquiryDate: "2026-05-28" },
  { id: "8", ref: "HIMT-2026-0036", name: "Maria Fernandez", country: "UK", phone: "+44 7700 900123", email: "maria.f@email.com", treatment: "Spine Surgery", stage: "IN_TREATMENT", coordinator: "Priya Sharma", estimatedCost: 25000, inquiryDate: "2026-05-20" },
  { id: "9", ref: "HIMT-2026-0035", name: "Amara Diallo", country: "Tanzania", phone: "+255 755 123 456", email: "amara.diallo@email.com", treatment: "Fertility Treatment", stage: "COMPLETED_FOLLOWUP", coordinator: "Rahul Kumar", estimatedCost: 9500, inquiryDate: "2026-04-15" },
  { id: "10", ref: "HIMT-2026-0030", name: "Hans Mueller", country: "Germany", phone: "+49 160 9876543", email: "hans.m@email.com", treatment: "Cardiac Bypass", stage: "CLOSED", coordinator: "Priya Sharma", estimatedCost: 17000, inquiryDate: "2026-03-10" },
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

export default function PatientsPage() {
  const [view, setView] = React.useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [stageFilter, setStageFilter] = React.useState("");
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<typeof MOCK_PATIENTS[0] | null>(null);
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);

  const filteredPatients = MOCK_PATIENTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = !stageFilter || p.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const patientsByStage = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    patients: filteredPatients.filter((p) => p.stage === stage.id),
  }));

  const handlePatientClick = (patient: typeof MOCK_PATIENTS[0]) => {
    setSelectedPatient(patient);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage patient pipeline and track progress
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, reference, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          options={[
            { value: "", label: "All Stages" },
            ...PIPELINE_STAGES.map((s) => ({ value: s.id, label: s.label })),
          ]}
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="w-full md:w-[200px]"
        />
        <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "table")}>
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {patientsByStage.map((stage) => (
              <div key={stage.id} className="w-72 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                  <h3 className="font-semibold text-sm">{stage.label}</h3>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {stage.patients.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {stage.patients.map((patient) => (
                    <Card
                      key={patient.id}
                      className="cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => handlePatientClick(patient)}
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{patient.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {patient.country}
                            </p>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">
                            {patient.ref}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {patient.treatment}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-xs font-medium text-primary">
                            ${patient.estimatedCost.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {patient.coordinator}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stage.patients.length === 0 && (
                    <div className="border-2 border-dashed rounded-lg p-4 text-center text-sm text-muted-foreground">
                      No patients
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
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
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="cursor-pointer"
                    onClick={() => handlePatientClick(patient)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {patient.country}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {patient.ref}
                    </TableCell>
                    <TableCell>{patient.treatment}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={stageColors[patient.stage]}
                      >
                        {PIPELINE_STAGES.find((s) => s.id === patient.stage)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.coordinator}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${patient.estimatedCost.toLocaleString()}
                    </TableCell>
                    <TableCell>{patient.inquiryDate}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add Patient Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Patient">
        <DialogContent className="max-w-2xl">
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="Patient full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ref">Reference Number</Label>
                <Input id="ref" value="HIMT-2026-0044" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="patient@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" type="tel" placeholder="+254 700 123 456" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  id="country"
                  options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                  placeholder="Select country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment Type *</Label>
                <Select
                  id="treatment"
                  options={TREATMENT_TYPES.map((t) => ({ value: t, label: t }))}
                  placeholder="Select treatment"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital">Preferred Hospital</Label>
                <Input id="hospital" placeholder="e.g., Aster Medcity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Estimated Cost (USD)</Label>
                <Input id="cost" type="number" placeholder="15000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inquiry-date">Inquiry Date</Label>
                <Input id="inquiry-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coordinator">Assign Coordinator</Label>
                <Select
                  id="coordinator"
                  options={[
                    { value: "priya", label: "Priya Sharma" },
                    { value: "rahul", label: "Rahul Kumar" },
                    { value: "unassigned", label: "Unassigned" },
                  ]}
                  placeholder="Select coordinator"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Treatment Description</Label>
              <Textarea
                id="description"
                placeholder="Additional details about the treatment requirements..."
                rows={3}
              />
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddModalOpen(false)}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patient Detail Modal */}
      <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Patient Details">
        <DialogContent className="max-w-2xl">
          {selectedPatient && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    {selectedPatient.ref}
                  </p>
                </div>
                <Badge variant="outline" className={stageColors[selectedPatient.stage]}>
                  {PIPELINE_STAGES.find((s) => s.id === selectedPatient.stage)?.label}
                </Badge>
              </div>

              {/* Info Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Country</p>
                    <p className="font-medium">{selectedPatient.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedPatient.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedPatient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Cost</p>
                    <p className="font-medium">
                      ${selectedPatient.estimatedCost.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Treatment */}
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Treatment Information</h3>
                <p className="text-sm">{selectedPatient.treatment}</p>
              </div>

              {/* Timeline Placeholder */}
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium mb-3">Stage History</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">Jun 20 - Patient added to pipeline</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-sm">Jun 22 - Moved to Qualification</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Log Communication
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}