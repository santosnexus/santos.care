"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  DollarSign,
  TrendingUp,
  CheckSquare,
  UserPlus,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Building2,
  FileText,
  Target,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Funnel,
  FunnelChart,
  LabelList,
} from "recharts";

const pipelineData = [
  { stage: "Inquiry", count: 8, fill: "#3b82f6" },
  { stage: "Qualification", count: 5, fill: "#f59e0b" },
  { stage: "Treatment Plan", count: 4, fill: "#8b5cf6" },
  { stage: "Confirmation", count: 3, fill: "#f97316" },
  { stage: "Visa & Travel", count: 2, fill: "#06b6d4" },
  { stage: "Arrived", count: 2, fill: "#14b8a6" },
  { stage: "In Treatment", count: 1, fill: "#ef4444" },
  { stage: "Ayurveda", count: 1, fill: "#22c55e" },
  { stage: "Follow-up", count: 2, fill: "#10b981" },
  { stage: "Closed", count: 12, fill: "#6b7280" },
];

const revenueData = [
  { month: "Jan", revenue: 8500, patients: 3 },
  { month: "Feb", revenue: 12000, patients: 4 },
  { month: "Mar", revenue: 9800, patients: 3 },
  { month: "Apr", revenue: 15500, patients: 5 },
  { month: "May", revenue: 18200, patients: 6 },
  { month: "Jun", revenue: 14500, patients: 4 },
];

const treatmentData = [
  { name: "Orthopedic", value: 35, color: "#3b82f6" },
  { name: "Cardiac", value: 25, color: "#ef4444" },
  { name: "Neurology/MS", value: 20, color: "#8b5cf6" },
  { name: "Ayurveda", value: 15, color: "#22c55e" },
  { name: "Other", value: 5, color: "#6b7280" },
];

const countryData = [
  { country: "Kenya", patients: 8, revenue: 32000 },
  { country: "Nigeria", patients: 5, revenue: 22000 },
  { country: "Uganda", patients: 3, revenue: 12500 },
  { country: "UK", patients: 4, revenue: 28000 },
  { country: "Germany", patients: 2, revenue: 15000 },
  { country: "Tanzania", patients: 2, revenue: 8500 },
];

const recentPatients = [
  { name: "James Mwangi", country: "Kenya", treatment: "Hip Replacement", stage: "CONFIRMATION", ref: "HIMT-2026-0042", value: 12500 },
  { name: "Fatima Al-Hassan", country: "UAE", treatment: "Cardiac Bypass", stage: "VISA_TRAVEL", ref: "HIMT-2026-0041", value: 18000 },
  { name: "Samuel Okonkwo", country: "Nigeria", treatment: "MS Treatment", stage: "AYURVEDA_RECOVERY", ref: "HIMT-2026-0039", value: 15000 },
  { name: "Anna Schmidt", country: "Germany", treatment: "Knee Replacement", stage: "INQUIRY_RECEIVED", ref: "HIMT-2026-0043", value: 11000 },
  { name: "Grace Wanjiku", country: "Kenya", treatment: "Spinal Surgery", stage: "QUALIFICATION", ref: "HIMT-2026-0040", value: 22000 },
];

const upcomingTasks = [
  { title: "Follow up with James Mwangi", due: "Today", priority: "high", patient: "HIMT-2026-0042" },
  { title: "Send treatment plan to Anna Schmidt", due: "Tomorrow", priority: "medium", patient: "HIMT-2026-0043" },
  { title: "Confirm airport pickup for Samuel", due: "Jul 2", priority: "high", patient: "HIMT-2026-0039" },
  { title: "Schedule telemedicine for Fatima", due: "Jul 3", priority: "medium", patient: "HIMT-2026-0041" },
];

const stageLabels: Record<string, string> = {
  INQUIRY_RECEIVED: "Inquiry",
  QUALIFICATION: "Qualification",
  TREATMENT_PLAN_SENT: "Treatment Plan",
  CONFIRMATION: "Confirmation",
  VISA_TRAVEL: "Visa & Travel",
  ARRIVED_ADMITTED: "Arrived",
  IN_TREATMENT: "In Treatment",
  AYURVEDA_RECOVERY: "Ayurveda",
  COMPLETED_FOLLOWUP: "Follow-up",
  CLOSED: "Closed",
};

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

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {changeType === "up" ? (
              <ArrowUpRight className="h-3 w-3 text-green-600" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-600" />
            )}
            <span className={changeType === "up" ? "text-green-600" : "text-red-600"}>
              {change}
            </span>{" "}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [pipelineView, setPipelineView] = React.useState("chart");

  const totalPatients = pipelineData.reduce((acc, item) => acc + item.count, 0);
  const totalRevenue = revenueData.reduce((acc, item) => acc + item.revenue, 0);
  const monthlyRevenue = revenueData[revenueData.length - 1]?.revenue || 0;
  const activePatients = pipelineData.slice(0, 8).reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your patients.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
            <Clock className="h-3 w-3 mr-1" />
            Q2 2026
          </Badge>
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            <Target className="h-3 w-3 mr-1" />
            On Track
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={totalPatients.toString()}
          change="12%"
          changeType="up"
          icon={Users}
        />
        <StatCard
          title="Active Patients"
          value={activePatients.toString()}
          change="8%"
          changeType="up"
          icon={Activity}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${monthlyRevenue.toLocaleString()}`}
          change="15%"
          changeType="up"
          icon={DollarSign}
        />
        <StatCard
          title="Conversion Rate"
          value="24%"
          change="3%"
          changeType="up"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and patient count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Breakdown */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Treatment Categories</CardTitle>
            <CardDescription>Distribution by treatment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={treatmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {treatmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {treatmentData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Patient Pipeline</CardTitle>
              <CardDescription>
                {totalPatients} total patients across all stages
              </CardDescription>
            </div>
            <Tabs value={pipelineView} onValueChange={setPipelineView}>
              <TabsList>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {pipelineView === "chart" ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="stage" type="category" width={100} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Patients</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pipelineData.map((item) => (
                  <TableRow key={item.stage}>
                    <TableCell className="font-medium">{item.stage}</TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                    <TableCell className="text-right">
                      {((item.count / totalPatients) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Bottom Row: Recent Patients + Upcoming Tasks + Country Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Patients */}
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Latest patient activity</CardDescription>
              </div>
              <a href="/patients" className="text-sm text-primary hover:underline">
                View all
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Est. Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPatients.map((patient) => (
                  <TableRow key={patient.ref}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {patient.country}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.treatment}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={stageColors[patient.stage]}
                      >
                        {stageLabels[patient.stage]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${patient.value.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tasks Due</CardTitle>
                <CardDescription>Upcoming action items</CardDescription>
              </div>
              <a href="/tasks" className="text-sm text-primary hover:underline">
                View all
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                >
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full ${
                      task.priority === "high" ? "bg-red-500" : "bg-amber-500"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{task.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {task.due}
                      <span className="text-muted-foreground/50">•</span>
                      <span className="font-mono">{task.patient}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Patients by Country</CardTitle>
          <CardDescription>
            Geographic distribution of patient origins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="country" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="patients" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}