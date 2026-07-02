"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  X,
} from "lucide-react";

type PartnerCategory = "hospital" | "ayurveda" | "lab" | "transport" | "nursing" | "equipment";
type AgreementStatus = "none" | "pending" | "signed" | "expired";

interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  agreementStatus: AgreementStatus;
  agreementDate?: string;
  commissionRate?: number;
  totalPatientsReferred: number;
  totalRevenue: number;
  responseTime?: number;
  satisfactionScore?: number;
  createdAt: string;
}

const MOCK_PARTNERS: Partner[] = [
  { id: "1", name: "Aster Medcity", category: "hospital", contactPerson: "Dr. Prem Nair", phone: "+91 484 400 8000", email: "pren.nair@asterhospital.com", address: "Kochi, Kerala", agreementStatus: "signed", commissionRate: 5, totalPatientsReferred: 12, totalRevenue: 180000, satisfactionScore: 4.5, createdAt: "2024-01-15" },
  { id: "2", name: "Amrita Hospital", category: "hospital", contactPerson: "Dr. Sanjay Chand", phone: "+91 487 242 8000", email: "sanjay@amrita.edu", address: "Kochi, Kerala", agreementStatus: "signed", commissionRate: 4, totalPatientsReferred: 8, totalRevenue: 120000, satisfactionScore: 4.7, createdAt: "2024-02-01" },
  { id: "3", name: "Rajagiri Hospital", category: "hospital", contactPerson: "Fr. James", phone: "+91 484 618 5000", email: "rajagiri@rajagiri.edu", address: "Kochi, Kerala", agreementStatus: "signed", commissionRate: 5, totalPatientsReferred: 6, totalRevenue: 90000, satisfactionScore: 4.3, createdAt: "2024-01-20" },
  { id: "4", name: "Ayush Prana", category: "ayurveda", contactPerson: "Dr. Manu Nair", phone: "+91 484 274 1234", email: "info@ayushprana.com", address: "Kochi, Kerala", agreementStatus: "signed", commissionRate: 10, totalPatientsReferred: 15, totalRevenue: 45000, satisfactionScore: 4.8, createdAt: "2024-03-01" },
  { id: "5", name: "Metropolis Labs", category: "lab", contactPerson: "Rajesh Kumar", phone: "+91 22 4154 1234", email: "rajesh@metropolis.in", address: "Mumbai, Maharashtra", agreementStatus: "pending", totalPatientsReferred: 20, totalRevenue: 8000, createdAt: "2024-04-15" },
  { id: "6", name: "Caring Hands Nursing", category: "nursing", contactPerson: "Mary Thomas", phone: "+91 484 274 5678", email: "mary@caringhands.com", address: "Kochi, Kerala", agreementStatus: "signed", commissionRate: 15, totalPatientsReferred: 10, totalRevenue: 15000, satisfactionScore: 4.6, createdAt: "2024-02-10" },
  { id: "7", name: "Kochi Car Rentals", category: "transport", contactPerson: "Ravi Kumar", phone: "+91 484 274 9999", email: "ravi@kochicars.com", address: "Kochi, Kerala", agreementStatus: "signed", commissionRate: 0, totalPatientsReferred: 25, totalRevenue: 12500, satisfactionScore: 4.2, createdAt: "2024-01-05" },
  { id: "8", name: "MedEq Solutions", category: "equipment", contactPerson: "Suresh Patel", phone: "+91 22 4154 5678", email: "suresh@medeq.in", address: "Mumbai, Maharashtra", agreementStatus: "pending", totalPatientsReferred: 0, totalRevenue: 0, createdAt: "2024-05-01" },
];

const CATEGORIES: { value: PartnerCategory | "all"; label: string }[] = [
  { value: "all", label: "All Partners" },
  { value: "hospital", label: "Hospitals" },
  { value: "ayurveda", label: "Ayurveda" },
  { value: "lab", label: "Labs" },
  { value: "transport", label: "Transport" },
  { value: "nursing", label: "Nursing" },
  { value: "equipment", label: "Equipment" },
];

const CATEGORY_COLORS: Record<PartnerCategory, string> = {
  hospital: "bg-blue-100 text-blue-800",
  ayurveda: "bg-green-100 text-green-800",
  lab: "bg-purple-100 text-purple-800",
  transport: "bg-orange-100 text-orange-800",
  nursing: "bg-pink-100 text-pink-800",
  equipment: "bg-yellow-100 text-yellow-800",
};

const AGREEMENT_COLORS: Record<AgreementStatus, string> = {
  none: "bg-gray-100 text-gray-800",
  pending: "bg-amber-100 text-amber-800",
  signed: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800",
};

const AGREEMENT_LABELS: Record<AgreementStatus, string> = {
  none: "No Agreement",
  pending: "Pending",
  signed: "Signed",
  expired: "Expired",
};

export default function PartnersPage() {
  const [partners, setPartners] = React.useState<Partner[]>(MOCK_PARTNERS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<PartnerCategory | "all">("all");
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedPartner, setSelectedPartner] = React.useState<Partner | null>(null);

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalPartners: partners.length,
    activeMOUs: partners.filter((p) => p.agreementStatus === "signed").length,
    totalPatientsReferred: partners.reduce((sum, p) => sum + p.totalPatientsReferred, 0),
    totalRevenue: partners.reduce((sum, p) => sum + p.totalRevenue, 0),
  };

  const handleViewDetails = (partner: Partner) => {
    setSelectedPartner(partner);
    setDetailModalOpen(true);
  };

  const handleDeletePartner = (id: string) => {
    setPartners(partners.filter((p) => p.id !== id));
    if (selectedPartner?.id === id) {
      setDetailModalOpen(false);
      setSelectedPartner(null);
    }
  };

  const handleAddPartner = (formData: FormData) => {
    const newPartner: Partner = {
      id: String(partners.length + 1),
      name: formData.get("name") as string,
      category: formData.get("category") as PartnerCategory,
      contactPerson: formData.get("contactPerson") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      agreementStatus: formData.get("agreementStatus") as AgreementStatus,
      commissionRate: formData.get("commissionRate") ? Number(formData.get("commissionRate")) : undefined,
      totalPatientsReferred: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPartners([...partners, newPartner]);
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
          <p className="text-muted-foreground">
            Manage healthcare partners and service providers
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPartners}</div>
            <p className="text-xs text-muted-foreground">Active partnerships</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active MOUs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMOUs}</div>
            <p className="text-xs text-muted-foreground">Signed agreements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Referred</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatientsReferred}</div>
            <p className="text-xs text-muted-foreground">Total referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total generated</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg">{partner.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="outline" className={CATEGORY_COLORS[partner.category]}>
                    {partner.category.charAt(0).toUpperCase() + partner.category.slice(1)}
                  </Badge>
                  <Badge variant="outline" className={AGREEMENT_COLORS[partner.agreementStatus]}>
                    {AGREEMENT_LABELS[partner.agreementStatus]}
                  </Badge>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{partner.totalPatientsReferred} patients referred</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">${partner.totalRevenue.toLocaleString()} revenue</span>
              </div>
              {partner.satisfactionScore && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-muted-foreground">{partner.satisfactionScore}/5 satisfaction</span>
                </div>
              )}
              <div className="pt-3 border-t space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{partner.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {partner.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {partner.email}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetails(partner)}>
                  View Details
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeletePartner(partner.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No partners found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Partner
          </Button>
        </div>
      )}

      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Partner">
        <DialogContent className="max-w-2xl">
          <form
            id="add-partner-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddPartner(new FormData(e.currentTarget));
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Partner Name *</Label>
                <Input id="name" name="name" placeholder="e.g., Aster Medcity" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  id="category"
                  name="category"
                  options={CATEGORIES.filter((c) => c.value !== "all").map((c) => ({
                    value: c.value,
                    label: c.label,
                  }))}
                  placeholder="Select category"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input id="contactPerson" name="contactPerson" placeholder="Dr. Prem Nair" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+91 484 400 8000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" placeholder="contact@partner.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" placeholder="Kochi, Kerala" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agreementStatus">Agreement Status</Label>
                <Select
                  id="agreementStatus"
                  name="agreementStatus"
                  options={[
                    { value: "none", label: "No Agreement" },
                    { value: "pending", label: "Pending" },
                    { value: "signed", label: "Signed" },
                    { value: "expired", label: "Expired" },
                  ]}
                  placeholder="Select status"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input id="commissionRate" name="commissionRate" type="number" step="0.1" placeholder="5" />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="add-partner-form">
              Add Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Partner Details">
        <DialogContent className="max-w-2xl">
          {selectedPartner && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedPartner.name}</h2>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className={CATEGORY_COLORS[selectedPartner.category]}>
                      {selectedPartner.category.charAt(0).toUpperCase() + selectedPartner.category.slice(1)}
                    </Badge>
                    <Badge variant="outline" className={AGREEMENT_COLORS[selectedPartner.agreementStatus]}>
                      {AGREEMENT_LABELS[selectedPartner.agreementStatus]}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Patients Referred</p>
                    <p className="font-medium">{selectedPartner.totalPatientsReferred}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="font-medium">${selectedPartner.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
                {selectedPartner.commissionRate !== undefined && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Commission Rate</p>
                      <p className="font-medium">{selectedPartner.commissionRate}%</p>
                    </div>
                  </div>
                )}
                {selectedPartner.satisfactionScore && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Satisfaction Score</p>
                      <p className="font-medium">{selectedPartner.satisfactionScore}/5</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg border">
                <h3 className="font-medium mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm w-32">Contact Person:</span>
                    <span className="text-sm">{selectedPartner.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedPartner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedPartner.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedPartner.address}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <h3 className="font-medium mb-3">Agreement Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm w-32">Status:</span>
                    <Badge variant="outline" className={AGREEMENT_COLORS[selectedPartner.agreementStatus]}>
                      {AGREEMENT_LABELS[selectedPartner.agreementStatus]}
                    </Badge>
                  </div>
                  {selectedPartner.agreementDate && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm w-32">Agreement Date:</span>
                      <span className="text-sm">{selectedPartner.agreementDate}</span>
                    </div>
                  )}
                  {selectedPartner.commissionRate !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm w-32">Commission Rate:</span>
                      <span className="text-sm">{selectedPartner.commissionRate}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeletePartner(selectedPartner.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}