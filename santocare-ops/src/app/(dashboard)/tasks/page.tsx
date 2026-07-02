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
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
  User,
  Briefcase,
  MessageSquare,
  FilterIcon,
} from "lucide-react";

const MOCK_TASKS = [
  { id: "1", title: "Follow up with James Mwangi", description: "Confirm travel dates and visa status", type: "patient", patientRef: "HIMT-2026-0042", patientName: "James Mwangi", assignedTo: "Priya Sharma", dueDate: "2026-06-29", priority: "high", status: "pending" },
  { id: "2", title: "Send treatment plan to Anna Schmidt", description: "Include cost breakdown and hospital options", type: "patient", patientRef: "HIMT-2026-0043", patientName: "Anna Schmidt", assignedTo: "Rahul Kumar", dueDate: "2026-06-30", priority: "medium", status: "pending" },
  { id: "3", title: "Confirm airport pickup for Samuel", description: "Arrange pickup from Cochin airport", type: "patient", patientRef: "HIMT-2026-0039", patientName: "Samuel Okonkwo", assignedTo: "Priya Sharma", dueDate: "2026-07-02", priority: "high", status: "pending" },
  { id: "4", title: "Schedule telemedicine for Fatima", description: "Video call to discuss pre-travel instructions", type: "patient", patientRef: "HIMT-2026-0041", patientName: "Fatima Al-Hassan", assignedTo: "Rahul Kumar", dueDate: "2026-07-03", priority: "medium", status: "pending" },
  { id: "5", title: "Review hospital MOU with Aster Medcity", description: "Final review before signing", type: "partner", partnerName: "Aster Medcity", assignedTo: "Admin", dueDate: "2026-07-01", priority: "high", status: "in_progress" },
  { id: "6", title: "Update MS treatment page on website", description: "Add Ayush Prana as recovery partner", type: "marketing", assignedTo: "Priya Sharma", dueDate: "2026-07-05", priority: "low", status: "pending" },
  { id: "7", title: "Prepare investor report", description: "Q2 summary for stakeholders", type: "general", assignedTo: "Admin", dueDate: "2026-07-10", priority: "medium", status: "pending" },
  { id: "8", title: "Send welcome email to Grace Wanjiku", description: "Include travel checklist and contacts", type: "patient", patientRef: "HIMT-2026-0040", patientName: "Grace Wanjiku", assignedTo: "Priya Sharma", dueDate: "2026-06-28", priority: "medium", status: "completed" },
];

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-amber-100 text-amber-800",
  urgent: "bg-red-100 text-red-800",
};

const priorityIcons: Record<string, React.ElementType> = {
  low: Circle,
  medium: Circle,
  high: AlertCircle,
  urgent: AlertCircle,
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

export default function TasksPage() {
  const [view, setView] = React.useState<"list" | "calendar">("list");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [filterPriority, setFilterPriority] = React.useState("");
  const [filterType, setFilterType] = React.useState("");
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<typeof MOCK_TASKS[0] | null>(null);
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);

  const filteredTasks = MOCK_TASKS.filter((t) => {
    const matchesStatus = !filterStatus || t.status === filterStatus;
    const matchesPriority = !filterPriority || t.priority === filterPriority;
    const matchesType = !filterType || t.type === filterType;
    return matchesStatus && matchesPriority && matchesType;
  });

  const pendingTasks = filteredTasks.filter((t) => t.status === "pending" || t.status === "in_progress");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  const handleTaskClick = (task: typeof MOCK_TASKS[0]) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    console.log("Status change:", taskId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage team tasks and track completion
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-9" />
        </div>
        <Select
          options={[
            { value: "", label: "All Status" },
            { value: "pending", label: "Pending" },
            { value: "in_progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
          ]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        />
        <Select
          options={[
            { value: "", label: "All Priority" },
            { value: "urgent", label: "Urgent" },
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
          ]}
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        />
        <Select
          options={[
            { value: "", label: "All Types" },
            { value: "patient", label: "Patient" },
            { value: "partner", label: "Partner" },
            { value: "marketing", label: "Marketing" },
            { value: "general", label: "General" },
          ]}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        />
      </div>

      {/* Tasks List */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          <TabsTrigger value="all">All ({filteredTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <div className="grid gap-4">
            {pendingTasks.map((task) => {
              const PriorityIcon = priorityIcons[task.priority];
              return (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleTaskClick(task)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <button
                        className={`mt-1 ${
                          task.status === "completed" ? "text-green-600" : "text-muted-foreground hover:text-primary"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, task.status === "completed" ? "pending" : "completed");
                        }}
                      >
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </h3>
                          <Badge variant="outline" className={priorityColors[task.priority]}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {task.patientRef && (
                            <span className="font-mono">{task.patientRef}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {task.assignedTo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {task.dueDate}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusColors[task.status]}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {pendingTasks.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active tasks. Great job!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="grid gap-4">
            {completedTasks.map((task) => (
              <Card key={task.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium line-through text-muted-foreground">
                        {task.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Completed</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      className="cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      <TableCell>
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          {task.patientRef && (
                            <div className="text-xs text-muted-foreground font-mono">
                              {task.patientRef}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.type}</Badge>
                      </TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[task.status]}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Task Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Task">
        <DialogContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input id="title" placeholder="What needs to be done?" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Additional details..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  id="type"
                  options={[
                    { value: "general", label: "General" },
                    { value: "patient", label: "Patient" },
                    { value: "partner", label: "Partner" },
                    { value: "marketing", label: "Marketing" },
                  ]}
                  placeholder="Select type"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  id="priority"
                  options={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                    { value: "urgent", label: "Urgent" },
                  ]}
                  placeholder="Select priority"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Assigned To</Label>
                <Select
                  id="assignee"
                  options={[
                    { value: "priya", label: "Priya Sharma" },
                    { value: "rahul", label: "Rahul Kumar" },
                    { value: "admin", label: "Admin" },
                  ]}
                  placeholder="Select assignee"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due">Due Date</Label>
                <Input id="due" type="date" />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setAddModalOpen(false)}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}