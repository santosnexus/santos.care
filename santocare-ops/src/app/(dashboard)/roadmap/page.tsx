"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  Target,
  Calendar,
  ChevronRight,
  FileText,
  Building2,
  TrendingUp,
  BarChart3,
  Zap,
} from "lucide-react";

const PHASES = [
  {
    id: 1,
    name: "Foundation",
    timeline: "Weeks 1-4",
    description: "Core infrastructure and partnerships",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
    status: "in_progress",
    progress: 60,
    milestones: [
      { id: "m1", title: "Hospital MOUs signed (Aster, Amrita, Rajagiri)", status: "completed", note: "Aster signed, Amrita follow-up scheduled" },
      { id: "m2", title: "Ayush Prana partnership finalized", status: "completed", note: "Agreement in place, PAMS Protocol defined" },
      { id: "m3", title: "Website updated with partner sections", status: "in_progress", note: "Using WEBSITE_CODE_SNIPPETS.md" },
      { id: "m4", title: "Supabase database setup", status: "pending", note: "Schema ready, pending Vercel account" },
      { id: "m5", title: "Next.js project scaffolding", status: "completed", note: "Dashboard framework live" },
    ],
  },
  {
    id: 2,
    name: "Operations",
    timeline: "Weeks 5-8",
    description: "Full operational workflow live",
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
    status: "pending",
    progress: 0,
    milestones: [
      { id: "m6", title: "Patient pipeline system live", status: "pending" },
      { id: "m7", title: "Task management system live", status: "pending" },
      { id: "m8", title: "Document repository live", status: "pending" },
      { id: "m9", title: "Partner network operational", status: "pending" },
      { id: "m10", title: "Communication log system", status: "pending" },
    ],
  },
  {
    id: 3,
    name: "Marketing",
    timeline: "Weeks 9-12",
    description: "Marketing campaigns and lead generation",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
    status: "pending",
    progress: 0,
    milestones: [
      { id: "m11", title: "Blog content calendar active", status: "pending" },
      { id: "m12", title: "Social media campaigns running", status: "pending" },
      { id: "m13", title: "Lead generation campaigns active", status: "pending" },
      { id: "m14", title: "Marketing analytics tracking", status: "pending" },
      { id: "m15", title: "Kenya landing page live", status: "pending" },
    ],
  },
  {
    id: 4,
    name: "Analytics",
    timeline: "Weeks 13+",
    description: "Reporting and optimization",
    icon: BarChart3,
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
    status: "pending",
    progress: 0,
    milestones: [
      { id: "m16", title: "Revenue dashboards live", status: "pending" },
      { id: "m17", title: "Stakeholder reporting", status: "pending" },
      { id: "m18", title: "Mobile optimization", status: "pending" },
      { id: "m19", title: "Email/WhatsApp integrations", status: "pending" },
      { id: "m20", title: "Advanced analytics", status: "pending" },
    ],
  },
];

const statusStyles: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle2 },
  in_progress: { bg: "bg-blue-100", text: "text-blue-800", icon: AlertCircle },
  pending: { bg: "bg-gray-100", text: "text-gray-600", icon: Circle },
  delayed: { bg: "bg-red-100", text: "text-red-800", icon: AlertCircle },
};

const phaseStatusStyles: Record<string, string> = {
  completed: "bg-green-100 text-green-800 border-green-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-gray-100 text-gray-600 border-gray-200",
  at_risk: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function RoadmapPage() {
  const [expandedPhase, setExpandedPhase] = React.useState<number | null>(1);

  const totalProgress = Math.round(
    PHASES.reduce((acc, phase) => acc + phase.progress, 0) / PHASES.length
  );

  const daysRemaining = 90 - Math.floor((Date.now() - new Date("2026-06-29").getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">90-Day Roadmap</h1>
          <p className="text-muted-foreground">
            Implementation progress and milestone tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-3 py-1">
            <Clock className="h-4 w-4 mr-2" />
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Deadline passed"}
          </Badge>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Overall Progress
          </CardTitle>
          <CardDescription>Implementation completion across all phases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Progress</span>
              <span className="font-medium">{totalProgress}%</span>
            </div>
            <Progress value={totalProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Phase 1: Foundation</span>
              <span>Phase 2: Operations</span>
              <span>Phase 3: Marketing</span>
              <span>Phase 4: Analytics</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Cards */}
      <div className="grid gap-4">
        {PHASES.map((phase) => {
          const Icon = phase.icon;
          const isExpanded = expandedPhase === phase.id;

          return (
            <Card key={phase.id} className={phase.bgColor}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-background/50 ${phase.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{phase.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {phase.timeline}
                        <span className="mx-2">•</span>
                        {phase.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={phaseStatusStyles[phase.status]}>
                      {phase.status === "in_progress" ? "In Progress" : phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                    </Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{phase.progress}%</div>
                      <div className="text-xs text-muted-foreground">complete</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                    >
                      <ChevronRight className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="border-t pt-4">
                  <div className="space-y-3">
                    {phase.milestones.map((milestone) => {
                      const style = statusStyles[milestone.status];
                      const StatusIcon = style.icon;

                      return (
                        <div
                          key={milestone.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-background/30"
                        >
                          <StatusIcon className={`h-5 w-5 mt-0.5 ${phase.color}`} />
                          <div className="flex-1">
                            <div className={`font-medium ${milestone.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                              {milestone.title}
                            </div>
                            {"note" in milestone && milestone.note ? (
                              <div className="text-sm text-muted-foreground mt-1">
                                {milestone.note}
                              </div>
                            ) : null}
                          </div>
                          <Badge variant="outline" className={`${style.bg} ${style.text}`}>
                            {milestone.status.replace("_", " ")}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-green-600">2</div>
            <div className="text-sm text-muted-foreground">Milestones Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-blue-600">3</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-gray-400">15</div>
            <div className="text-sm text-muted-foreground">Remaining</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-amber-600">15</div>
            <div className="text-sm text-muted-foreground">Days Until Next Phase</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}