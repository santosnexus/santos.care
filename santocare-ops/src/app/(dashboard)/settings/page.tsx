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
  Search,
  Filter,
} from "lucide-react";

interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastActiveAt?: string;
  invitedAt?: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  user?: { name: string; email: string };
  createdAt: string;
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  MANAGER: "bg-blue-100 text-blue-800",
  COORDINATOR: "bg-blue-100 text-blue-800",
  SALES: "bg-green-100 text-green-800",
  FINANCE: "bg-amber-100 text-amber-800",
  MARKETING: "bg-pink-100 text-pink-800",
  STAKEHOLDER: "bg-gray-100 text-gray-800",
  VIEWER: "bg-gray-100 text-gray-600",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("general");
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [users, setUsers] = React.useState<TeamUser[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<AuditLogEntry[]>([]);
  const [loadingUsers, setLoadingUsers] = React.useState(false);
  const [loadingAudit, setLoadingAudit] = React.useState(false);
  const [inviteForm, setInviteForm] = React.useState({ name: "", email: "", role: "COORDINATOR" });

  React.useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "audit") fetchAuditLogs();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const res = await fetch("/api/audit-logs?limit=50");
      const data = await res.json();
      setAuditLogs(data.logs || []);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleInvite = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });
      if (res.ok) {
        setInviteModalOpen(false);
        setInviteForm({ name: "", email: "", role: "COORDINATOR" });
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to invite user:", error);
    }
  };

  const handleDeactivate = async (userId: string) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Team</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
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
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Tab */}
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
              {loadingUsers ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : (
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
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={roleColors[user.role]}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                            {user.isActive ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.isActive && (
                              <Button variant="ghost" size="icon" onClick={() => handleDeactivate(user.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Audit Log
              </CardTitle>
              <CardDescription>Track all system changes and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAudit ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : auditLogs.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No audit logs yet. Actions will be logged automatically.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant="outline" className={
                            log.action === "CREATE" ? "bg-green-100 text-green-800" :
                            log.action === "UPDATE" ? "bg-blue-100 text-blue-800" :
                            "bg-red-100 text-red-800"
                          }>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.entityType}</TableCell>
                        <TableCell>{log.user?.name || "System"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="mt-4">
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
                      <div className="font-medium">WhatsApp Integration</div>
                      <div className="text-sm text-muted-foreground">
                        Configure Twilio for WhatsApp Business API
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Service</CardTitle>
                <CardDescription>Configure email notifications via Resend</CardDescription>
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
                        Configure Resend API for transactional emails
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Invite User Modal */}
      <Dialog open={inviteModalOpen} onClose={() => setInviteModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteName">Full Name</Label>
              <Input
                id="inviteName"
                placeholder="Enter full name"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="name@company.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <select
                id="inviteRole"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              >
                <option value="COORDINATOR">Coordinator</option>
                <option value="SALES">Sales</option>
                <option value="MARKETING">Marketing</option>
                <option value="FINANCE">Finance</option>
                <option value="MANAGER">Manager</option>
                <option value="VIEWER">Viewer (Read Only)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
