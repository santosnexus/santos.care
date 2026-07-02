"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
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
  Settings,
  User,
  Building2,
  Bell,
  Shield,
  Database,
  Globe,
  Mail,
  Phone,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
} from "lucide-react";

const MOCK_USERS = [
  { id: "1", name: "Admin User", email: "admin@santos.care", role: "Admin", status: "active", lastActive: "2026-06-29 10:30" },
  { id: "2", name: "Priya Sharma", email: "priya@santos.care", role: "Coordinator", status: "active", lastActive: "2026-06-29 09:15" },
  { id: "3", name: "Rahul Kumar", email: "rahul@santos.care", role: "Coordinator", status: "active", lastActive: "2026-06-29 08:45" },
  { id: "4", name: "Marketing Team", email: "marketing@santos.care", role: "Marketing", status: "active", lastActive: "2026-06-28 16:00" },
  { id: "5", name: "Investor View", email: "investor@santos.care", role: "Stakeholder", status: "active", lastActive: "2026-06-25 14:30" },
];

const roleColors: Record<string, string> = {
  Admin: "bg-purple-100 text-purple-800",
  Coordinator: "bg-blue-100 text-blue-800",
  Marketing: "bg-green-100 text-green-800",
  Stakeholder: "bg-amber-100 text-amber-800",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("general");
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="mt-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization
                </CardTitle>
                <CardDescription>Basic information about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input id="orgName" defaultValue="SantoCare - Heal India Medi Tourism" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://santos.care" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input id="email" type="email" defaultValue="info@santos.care" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">WhatsApp</Label>
                    <Input id="phone" type="tel" defaultValue="+91 80890 84080" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      id="timezone"
                      options={[
                        { value: "Asia/Kolkata", label: "Asia/Kolkata (GMT+5:30)" },
                        { value: "Africa/Nairobi", label: "Africa/Nairobi (GMT+3)" },
                        { value: "Europe/London", label: "Europe/London (GMT+0)" },
                        { value: "UTC", label: "UTC (GMT+0)" },
                      ]}
                      value="Asia/Kolkata"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      id="currency"
                      options={[
                        { value: "USD", label: "USD ($)" },
                        { value: "EUR", label: "EUR (€)" },
                        { value: "GBP", label: "GBP (£)" },
                        { value: "INR", label: "INR (₹)" },
                      ]}
                      value="USD"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Target Markets
                </CardTitle>
                <CardDescription>Primary markets for patient acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["Kenya", "Tanzania", "Uganda", "Nigeria", "Ghana", "United Kingdom", "Germany", "France"].map((market) => (
                    <Badge key={market} variant="outline" className="px-3 py-1">
                      {market}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage user access and permissions</CardDescription>
                </div>
                <Button onClick={() => setInviteModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_USERS.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={roleColors[user.role]}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                          {user.status === "active" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastActive}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="mt-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Stages</CardTitle>
                <CardDescription>Configure patient pipeline stages</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Stage Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { order: 1, name: "Inquiry Received", desc: "Initial inquiry received" },
                      { order: 2, name: "Qualification", desc: "Reviewing medical reports" },
                      { order: 3, name: "Treatment Plan Sent", desc: "Treatment plan delivered" },
                      { order: 4, name: "Confirmation", desc: "Patient confirmed, deposit received" },
                      { order: 5, name: "Visa & Travel", desc: "Visa processing and travel arrangements" },
                      { order: 6, name: "Arrived/Admitted", desc: "Patient arrived and admitted" },
                      { order: 7, name: "In Treatment", desc: "Undergoing treatment/surgery" },
                      { order: 8, name: "Ayurveda Recovery", desc: "Post-treatment Ayurveda recovery" },
                      { order: 9, name: "Completed/Follow-up", desc: "Treatment complete, follow-up care" },
                      { order: 10, name: "Closed", desc: "Case closed" },
                    ].map((stage) => (
                      <TableRow key={stage.order}>
                        <TableCell className="font-medium">{stage.order}</TableCell>
                        <TableCell>{stage.name}</TableCell>
                        <TableCell className="text-muted-foreground">{stage.desc}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Treatment Types</CardTitle>
                <CardDescription>Available treatment categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
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
                  ].map((treatment) => (
                    <Badge key={treatment} variant="outline">
                      {treatment}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="mt-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Business</CardTitle>
                <CardDescription>Connect your WhatsApp Business account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-[#25D366] flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">WhatsApp Connected</div>
                      <div className="text-sm text-muted-foreground">
                        +91 80890 84080
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Service</CardTitle>
                <CardDescription>Configure email notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Email Service</div>
                      <div className="text-sm text-muted-foreground">
                        Using system default
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar Sync</CardTitle>
                <CardDescription>Sync with Google Calendar or Outlook</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-background border flex items-center justify-center">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium">No calendar connected</div>
                      <div className="text-sm text-muted-foreground">
                        Connect to sync appointments
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="mt-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Backup
                </CardTitle>
                <CardDescription>Manage database backups and exports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">Last Backup</div>
                    <div className="text-sm text-muted-foreground">
                      2026-06-29 08:00 AM (Automatic)
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Now
                  </Button>
                  <Button variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-Backup Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Daily Automatic Backup</div>
                    <div className="text-sm text-muted-foreground">
                      Backups run every day at midnight IST
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Invite User Modal */}
      <Dialog open={inviteModalOpen} onClose={() => setInviteModalOpen(false)} title="Invite Team Member">
        <DialogContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteName">Full Name</Label>
              <Input id="inviteName" placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input id="inviteEmail" type="email" placeholder="name@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select
                id="inviteRole"
                options={[
                  { value: "coordinator", label: "Coordinator" },
                  { value: "marketing", label: "Marketing" },
                  { value: "stakeholder", label: "Stakeholder (View Only)" },
                ]}
                placeholder="Select role"
              />
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setInviteModalOpen(false)}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}