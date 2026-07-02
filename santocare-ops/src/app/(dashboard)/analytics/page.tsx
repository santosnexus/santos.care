"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Users,
  TrendingUp,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const revenueByMonth = [
  { month: "Jan", revenue: 8500, patients: 3 },
  { month: "Feb", revenue: 12000, patients: 4 },
  { month: "Mar", revenue: 9800, patients: 3 },
  { month: "Apr", revenue: 15500, patients: 5 },
  { month: "May", revenue: 18200, patients: 6 },
  { month: "Jun", revenue: 14500, patients: 4 },
  { month: "Jul", revenue: 22000, patients: 7, projected: true },
  { month: "Aug", revenue: 25000, patients: 8, projected: true },
  { month: "Sep", revenue: 28000, patients: 9, projected: true },
  { month: "Oct", revenue: 30000, patients: 10, projected: true },
  { month: "Nov", revenue: 32000, patients: 11, projected: true },
  { month: "Dec", revenue: 35000, patients: 12, projected: true },
];

const treatmentRevenue = [
  { name: "Orthopedic", revenue: 33775, percentage: 35 },
  { name: "Cardiac", revenue: 24125, percentage: 25 },
  { name: "Neurology/MS", revenue: 19300, percentage: 20 },
  { name: "Ayurveda", revenue: 14475, percentage: 15 },
  { name: "Other", revenue: 4825, percentage: 5 },
];

const countryRevenue = [
  { country: "Kenya", revenue: 32000, patients: 8 },
  { country: "UK", revenue: 28000, patients: 4 },
  { country: "Nigeria", revenue: 22000, patients: 5 },
  { country: "Germany", revenue: 15000, patients: 2 },
  { country: "Uganda", revenue: 12500, patients: 3 },
  { country: "Tanzania", revenue: 8500, patients: 2 },
];

const leadSourceData = [
  { source: "WhatsApp", leads: 35, color: "#25D366" },
  { source: "Website", leads: 28, color: "#3b82f6" },
  { source: "Facebook", leads: 20, color: "#1877f2" },
  { source: "Google Ads", leads: 15, color: "#ea4335" },
  { source: "Referral", leads: 12, color: "#8b5cf6" },
];

const coordinatorPerformance = [
  { name: "Priya Sharma", patientsManaged: 18, completedPatients: 14, revenue: 76500, satisfaction: 4.7 },
  { name: "Rahul Kumar", patientsManaged: 15, completedPatients: 12, revenue: 64500, satisfaction: 4.5 },
];

const funnelData = [
  { stage: "Inquiry", count: 120, rate: 100 },
  { stage: "Qualified", count: 85, rate: 71 },
  { stage: "Proposal Sent", count: 62, rate: 52 },
  { stage: "Negotiation", count: 45, rate: 38 },
  { stage: "Confirmed", count: 32, rate: 27 },
  { stage: "Completed", count: 29, rate: 24 },
];

const monthlyVolume = [
  { month: "Jan", patients: 3 },
  { month: "Feb", patients: 4 },
  { month: "Mar", patients: 3 },
  { month: "Apr", patients: 5 },
  { month: "May", patients: 6 },
  { month: "Jun", patients: 4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === "revenue" || entry.name === "Revenue" ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="font-semibold">{data.month}</p>
        <p className="text-sm text-green-600">Revenue: {formatCurrency(data.revenue)}</p>
        <p className="text-sm text-blue-600">Patients: {data.patients}</p>
        {data.projected && <Badge variant="secondary" className="mt-1 text-xs">Projected</Badge>}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const totalRevenue = revenueByMonth.reduce((sum, m) => sum + m.revenue, 0);
  const totalPatients = revenueByMonth.reduce((sum, m) => sum + m.patients, 0);
  const avgRevenuePerPatient = totalRevenue / totalPatients;
  const overallConversion = 24;
  const satisfaction = 4.6;

  const totalLeads = leadSourceData.reduce((sum, l) => sum + l.leads, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track performance metrics and business insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue YTD
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Revenue per Patient
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(Math.round(avgRevenuePerPatient))}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              Based on {totalPatients} patients
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallConversion}%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2.1% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Patient Satisfaction
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{satisfaction}/5</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +0.2 from last period
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueByMonth}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Treatment Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={treatmentRevenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tickFormatter={(v) => `$${v / 1000}k`} className="text-xs" />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="country" className="text-xs" />
                  <YAxis tickFormatter={(v) => `$${v / 1000}k`} className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                    {countryRevenue.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8b5cf6" : "#a78bfa"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelData.map((stage, index) => {
                const width = (stage.count / funnelData[0].count) * 100;
                const colors = [
                  "bg-blue-500",
                  "bg-amber-500",
                  "bg-purple-500",
                  "bg-orange-500",
                  "bg-cyan-500",
                  "bg-green-500",
                ];
                return (
                  <div key={stage.stage} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stage.count}</span>
                        {index > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {stage.rate}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[index]} rounded-full transition-all`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Coordinator Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coordinator</TableHead>
                  <TableHead className="text-right">Patients Managed</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                  <TableHead className="text-right">Completion Rate</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Satisfaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coordinatorPerformance.map((coordinator) => (
                  <TableRow key={coordinator.name}>
                    <TableCell className="font-medium">{coordinator.name}</TableCell>
                    <TableCell className="text-right">{coordinator.patientsManaged}</TableCell>
                    <TableCell className="text-right">{coordinator.completedPatients}</TableCell>
                    <TableCell className="text-right">
                      {Math.round((coordinator.completedPatients / coordinator.patientsManaged) * 100)}%
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(coordinator.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span>{coordinator.satisfaction}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Source Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="leads"
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {leadSourceData.map((source) => (
                <div key={source.source} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span>{source.source}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {source.leads} ({Math.round((source.leads / totalLeads) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Patient Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVolume}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="patients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}