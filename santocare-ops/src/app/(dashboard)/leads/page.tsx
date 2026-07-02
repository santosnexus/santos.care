"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Mail,
  Phone,
  Globe,
  Calendar,
  UserPlus,
  Tag,
  TrendingUp,
  MoreHorizontal,
  Eye,
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
  treatmentInterest?: string | null;
  budgetRange?: string | null;
  utmSource?: string | null;
  utmCampaign?: string | null;
  convertedToPatientId?: string | null;
  createdAt: string;
}

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  NEW: { label: "New", class: "bg-blue-100 text-blue-800 border-blue-200" },
  CONTACTED: { label: "Contacted", class: "bg-amber-100 text-amber-800 border-amber-200" },
  QUALIFIED: { label: "Qualified", class: "bg-purple-100 text-purple-800 border-purple-200" },
  CONVERTED: { label: "Converted", class: "bg-green-100 text-green-800 border-green-200" },
  LOST: { label: "Lost", class: "bg-gray-100 text-gray-800 border-gray-200" },
};

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  WHATSAPP: <span className="text-green-600 font-semibold text-xs">WA</span>,
  WEBSITE: <Globe className="h-3.5 w-3.5 text-blue-500" />,
  FACEBOOK: <span className="text-blue-700 font-semibold text-xs">FB</span>,
  GOOGLE_ADS: <span className="text-yellow-600 font-semibold text-xs">G</span>,
  REFERRAL: <Tag className="h-3.5 w-3.5 text-purple-500" />,
  PARTNER_HOSPITAL: <span className="text-pink-600 font-semibold text-xs">PH</span>,
  EXHIBITION: <span className="text-orange-600 font-semibold text-xs">EX</span>,
  OTHER: <span className="text-gray-500 font-semibold text-xs">?</span>,
};

export default function LeadsPage() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [sourceFilter, setSourceFilter] = React.useState<string>("");

  const loadLeads = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (sourceFilter) params.set("source", sourceFilter);
      const res = await fetch(`/api/leads?${params}`, {
        headers: { Authorization: "Basic " + btoa("santos:He@lInd!a2026") },
      });
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error("Failed to load leads:", err);
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
    conversionRate: leads.length > 0
      ? Math.round((leads.filter((l) => l.status === "CONVERTED").length / leads.length) * 100)
      : 0,
  };

  const [convertingId, setConvertingId] = React.useState<string | null>(null);

  const handleConvert = async (leadId: string) => {
    if (!confirm("Convert this lead to a patient? This will create a new patient record.")) return;
    setConvertingId(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}/convert`, {
        method: "POST",
        headers: { Authorization: "Basic " + btoa("santos:He@lInd!a2026") },
      });
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
      console.error("Convert failed:", err);
      alert("Failed to convert lead");
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Marketing inquiries and conversion tracking</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> New Lead
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Leads</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">New</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{stats.new}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Qualified</p>
            <p className="text-2xl font-bold mt-1 text-purple-600">{stats.qualified}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Converted</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{stats.converted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Conv. Rate</p>
            <p className="text-2xl font-bold mt-1">{stats.conversionRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone, treatment, country..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="CONVERTED">Converted</option>
                <option value="LOST">Lost</option>
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
              >
                <option value="">All Sources</option>
                <option value="WEBSITE">Website</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="GOOGLE_ADS">Google Ads</option>
                <option value="REFERRAL">Referral</option>
                <option value="PARTNER_HOSPITAL">Partner Hospital</option>
                <option value="EXHIBITION">Exhibition</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {leads.length === 0 ? "No leads yet. They'll appear here when forms are submitted." : "No leads match your filters."}
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
                        {lead.budgetRange && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Budget: {lead.budgetRange}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5 text-sm">
                          {lead.email && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline truncate max-w-[180px]">
                                {lead.email}
                              </a>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} className="text-green-600 hover:underline">
                                {lead.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {SOURCE_ICONS[lead.source] || SOURCE_ICONS.OTHER}
                          <span className="text-xs">{lead.source.replace(/_/g, " ")}</span>
                        </div>
                        {lead.campaign && (
                          <div className="text-xs text-muted-foreground mt-0.5">{lead.campaign}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {lead.treatmentInterest ? (
                          <span className="text-sm">{lead.treatmentInterest}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {lead.country ? (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            {lead.country}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusInfo.class}>
                          {statusInfo.label}
                        </Badge>
                        {lead.status === "CONVERTED" && lead.convertedToPatientId && (
                          <Link
                            href={`/patients`}
                            className="block text-xs text-blue-600 hover:underline mt-1"
                          >
                            → Patient
                          </Link>
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
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Convert to patient"
                              onClick={() => handleConvert(lead.id)}
                              disabled={convertingId === lead.id}
                            >
                              <UserPlus className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" title="View">
                            <Eye className="h-3.5 w-3.5" />
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
    </div>
  );
}
