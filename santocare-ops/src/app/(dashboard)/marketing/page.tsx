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
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Plus,
  Search,
  Calendar,
  FileText,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  ArrowRight,
} from "lucide-react";

const MOCK_LEADS = [
  { id: "1", name: "David Kimani", country: "Kenya", email: "david.k@email.com", phone: "+254 700 111 222", source: "WhatsApp", treatmentInterest: "Hip Replacement", budgetRange: "$10,000-$15,000", status: "qualified", createdAt: "2026-06-25" },
  { id: "2", name: "Sarah Oduya", country: "Nigeria", email: "sarah.o@email.com", phone: "+234 800 222 333", source: "Website", treatmentInterest: "Cardiac Bypass", budgetRange: "$15,000-$20,000", status: "new", createdAt: "2026-06-27" },
  { id: "3", name: "Michael Brown", country: "UK", email: "m.brown@email.com", phone: "+44 7700 900123", source: "Google Ads", treatmentInterest: "Knee Replacement", budgetRange: "$12,000-$18,000", status: "contacted", createdAt: "2026-06-20" },
  { id: "4", name: "Blessing Adeyemi", country: "Ghana", email: "b.adeyemi@email.com", phone: "+233 200 333 444", source: "Facebook", treatmentInterest: "MS Treatment", budgetRange: "$15,000-$25,000", status: "qualified", createdAt: "2026-06-15" },
  { id: "5", name: "Emma Watson", country: "Germany", email: "emma.w@email.com", phone: "+49 160 444 555", source: "Referral", treatmentInterest: "Spine Surgery", budgetRange: "$20,000-$30,000", status: "converted", createdAt: "2026-05-10" },
  { id: "6", name: "James Ochieng", country: "Kenya", email: "james.o@email.com", phone: "+254 711 444 555", source: "WhatsApp", treatmentInterest: "Ayurveda", budgetRange: "$5,000-$8,000", status: "new", createdAt: "2026-06-28" },
];

const MOCK_CAMPAIGNS = [
  { id: "1", name: "Kenya Medical Tourism Q2", status: "active", platform: "Facebook/Instagram", budget: 5000, spent: 3200, leadsGenerated: 45, startDate: "2026-04-01", endDate: "2026-06-30" },
  { id: "2", name: "MS Treatment Awareness", status: "active", platform: "Google Ads", budget: 3000, spent: 1800, leadsGenerated: 28, startDate: "2026-05-01", endDate: "2026-07-31" },
  { id: "3", name: "UK Winter Campaign", status: "paused", platform: "Facebook/Instagram", budget: 4000, spent: 1500, leadsGenerated: 22, startDate: "2026-06-15", endDate: "2026-08-31" },
];

const MOCK_CONTENT = [
  { id: "1", title: "MS Treatment in India: Complete Guide 2026", type: "Blog", status: "published", publishDate: "2026-06-15", author: "Priya" },
  { id: "2", title: "Heart Bypass Cost in India vs UK", type: "Blog", status: "scheduled", publishDate: "2026-07-01", author: "Rahul" },
  { id: "3", title: "Why Kenya Patients Choose India", type: "Blog", status: "draft", publishDate: "2026-07-10", author: "Priya" },
  { id: "4", title: "Patient Testimonial: James from Kenya", type: "Social", status: "published", publishDate: "2026-06-20", author: "Marketing" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  qualified: "bg-purple-100 text-purple-800",
  converted: "bg-green-100 text-green-800",
  lost: "bg-gray-100 text-gray-800",
};

const CAMPAIGN_STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  paused: "bg-amber-100 text-amber-800",
  completed: "bg-gray-100 text-gray-800",
};

const TYPE_COLORS: Record<string, string> = {
  Blog: "bg-blue-100 text-blue-800",
  Social: "bg-green-100 text-green-800",
  Email: "bg-purple-100 text-purple-800",
};

const CONTENT_STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-amber-100 text-amber-800",
  published: "bg-green-100 text-green-800",
};

const SOURCES = ["WhatsApp", "Website", "Google Ads", "Facebook", "Instagram", "Referral", "Email Campaign"];
const TREATMENTS = ["Hip Replacement", "Knee Replacement", "Cardiac Bypass", "Spine Surgery", "MS Treatment", "Ayurveda", "Heart Valve Replacement", "Cancer Treatment", "Fertility Treatment"];
const COUNTRIES = ["Kenya", "Nigeria", "Ghana", "UK", "Germany", "Tanzania", "Uganda", "Ethiopia", "South Africa", "UAE", "Saudi Arabia", "France"];
const BUDGET_RANGES = ["$5,000-$8,000", "$8,000-$12,000", "$10,000-$15,000", "$12,000-$18,000", "$15,000-$20,000", "$20,000-$30,000", "$30,000+"];

export default function MarketingPage() {
  const [leadSearch, setLeadSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [addLeadModalOpen, setAddLeadModalOpen] = React.useState(false);
  const [addCampaignModalOpen, setAddCampaignModalOpen] = React.useState(false);
  const [addContentModalOpen, setAddContentModalOpen] = React.useState(false);

  const filteredLeads = MOCK_LEADS.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.country.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.email.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statsCards = [
    { title: "New Leads This Week", value: "12", change: "+25%", icon: Users, trend: "up" },
    { title: "Qualified Leads", value: "8", change: "+15%", icon: Target, trend: "up" },
    { title: "Conversion Rate", value: "32%", change: "+5%", icon: TrendingUp, trend: "up" },
    { title: "Pipeline Value", value: "$145K", change: "+22%", icon: DollarSign, trend: "up" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing</h1>
          <p className="text-muted-foreground">
            Manage leads, campaigns, and content calendar
          </p>
        </div>
      </div>

      <Tabs defaultValue="leads">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="content">Content Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last week
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, country, or email..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              options={[
                { value: "", label: "All Statuses" },
                { value: "new", label: "New" },
                { value: "contacted", label: "Contacted" },
                { value: "qualified", label: "Qualified" },
                { value: "converted", label: "Converted" },
                { value: "lost", label: "Lost" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-[180px]"
            />
            <Button onClick={() => setAddLeadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Treatment Interest</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {lead.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.country}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>{lead.treatmentInterest}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={STATUS_COLORS[lead.status]}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.createdAt}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredLeads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No leads found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={addLeadModalOpen} onClose={() => setAddLeadModalOpen(false)} title="Add New Lead">
            <DialogContent className="max-w-2xl">
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="lead-name">Full Name *</Label>
                    <Input id="lead-name" placeholder="Lead full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead-email">Email *</Label>
                    <Input id="lead-email" type="email" placeholder="lead@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead-phone">Phone *</Label>
                    <Input id="lead-phone" type="tel" placeholder="+254 700 123 456" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead-country">Country *</Label>
                    <Select
                      id="lead-country"
                      options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                      placeholder="Select country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead-source">Source *</Label>
                    <Select
                      id="lead-source"
                      options={SOURCES.map((s) => ({ value: s, label: s }))}
                      placeholder="Select source"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead-treatment">Treatment Interest *</Label>
                    <Select
                      id="lead-treatment"
                      options={TREATMENTS.map((t) => ({ value: t, label: t }))}
                      placeholder="Select treatment"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead-budget">Budget Range</Label>
                    <Select
                      id="lead-budget"
                      options={BUDGET_RANGES.map((b) => ({ value: b, label: b }))}
                      placeholder="Select budget range"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead-status">Initial Status</Label>
                    <Select
                      id="lead-status"
                      options={[
                        { value: "new", label: "New" },
                        { value: "contacted", label: "Contacted" },
                        { value: "qualified", label: "Qualified" },
                      ]}
                      placeholder="Select status"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-notes">Notes</Label>
                  <Textarea
                    id="lead-notes"
                    placeholder="Additional notes about this lead..."
                    rows={3}
                  />
                </div>
              </form>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddLeadModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setAddLeadModalOpen(false)}>Add Lead</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setAddCampaignModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Campaign
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_CAMPAIGNS.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription className="mt-1">{campaign.platform}</CardDescription>
                    </div>
                    <Badge variant="outline" className={CAMPAIGN_STATUS_COLORS[campaign.status]}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">
                        ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Leads Generated</p>
                      <p className="text-xl font-bold">{campaign.leadsGenerated}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CPL</p>
                      <p className="text-xl font-bold">
                        ${campaign.budget > 0 ? Math.round(campaign.spent / campaign.leadsGenerated) : 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-sm">
                    <span className="text-muted-foreground">
                      {campaign.startDate} - {campaign.endDate}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={addCampaignModalOpen} onClose={() => setAddCampaignModalOpen(false)} title="Add New Campaign">
            <DialogContent className="max-w-2xl">
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="campaign-name">Campaign Name *</Label>
                    <Input id="campaign-name" placeholder="e.g., Kenya Medical Tourism Q3" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-platform">Platform *</Label>
                    <Select
                      id="campaign-platform"
                      options={[
                        { value: "facebook/instagram", label: "Facebook/Instagram" },
                        { value: "google-ads", label: "Google Ads" },
                        { value: "email", label: "Email Campaign" },
                        { value: "linkedin", label: "LinkedIn" },
                        { value: "multi", label: "Multi-Channel" },
                      ]}
                      placeholder="Select platform"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-status">Status</Label>
                    <Select
                      id="campaign-status"
                      options={[
                        { value: "active", label: "Active" },
                        { value: "paused", label: "Paused" },
                        { value: "completed", label: "Completed" },
                      ]}
                      placeholder="Select status"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-budget">Total Budget (USD) *</Label>
                    <Input id="campaign-budget" type="number" placeholder="5000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-spent">Already Spent (USD)</Label>
                    <Input id="campaign-spent" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-start">Start Date *</Label>
                    <Input id="campaign-start" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-end">End Date *</Label>
                    <Input id="campaign-end" type="date" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-objectives">Campaign Objectives</Label>
                  <Textarea
                    id="campaign-objectives"
                    placeholder="Describe the main goals and target audience for this campaign..."
                    rows={3}
                  />
                </div>
              </form>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddCampaignModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setAddCampaignModalOpen(false)}>Create Campaign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Manage your blog posts, patient stories, and content calendar
            </p>
            <a href="/marketing/blog">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Manage Blog
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{MOCK_CONTENT.filter(c => c.status === "published").length}</div>
                <p className="text-xs text-muted-foreground mt-1">28 total articles on public site</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{MOCK_CONTENT.filter(c => c.status === "scheduled").length}</div>
                <p className="text-xs text-muted-foreground mt-1">Upcoming publications</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{MOCK_CONTENT.filter(c => c.status === "draft").length}</div>
                <p className="text-xs text-muted-foreground mt-1">Needs review or scheduling</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Publish Date</TableHead>
                    <TableHead>Author</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_CONTENT.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {content.type === "Blog" && <FileText className="h-4 w-4 text-muted-foreground" />}
                          {content.type === "Social" && <Users className="h-4 w-4 text-muted-foreground" />}
                          {content.type === "Email" && <Mail className="h-4 w-4 text-muted-foreground" />}
                          <span className="font-medium">{content.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={TYPE_COLORS[content.type]}>
                          {content.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={CONTENT_STATUS_COLORS[content.status]}>
                          {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {content.publishDate}
                        </div>
                      </TableCell>
                      <TableCell>{content.author}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}