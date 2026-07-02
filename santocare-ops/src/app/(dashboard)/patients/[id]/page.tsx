"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  Building2,
  Edit,
  FileText,
  CheckSquare,
  MessageSquare,
  Activity,
  Clock,
  TrendingUp,
  User,
  Stethoscope,
  Plane,
} from "lucide-react";
import { STAGE_LABELS, STAGE_COLORS, formatCurrency, formatDate } from "@/lib/utils";

interface Patient {
  id: string;
  referenceNumber: string;
  name: string;
  country: string;
  phone: string;
  email: string;
  whatsapp?: string | null;
  treatmentType: string;
  treatmentDescription?: string | null;
  preferredHospital?: string | null;
  stage: string;
  estimatedCost?: number | null;
  depositReceived: boolean;
  depositAmount?: number | null;
  finalCost?: number | null;
  inquiryDate: string;
  expectedTravelDate?: string | null;
  actualTravelDate?: string | null;
  dischargeDate?: string | null;
  assignedCoordinatorId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate: string;
  assignedToId: string;
}

interface Document {
  id: string;
  title: string;
  category: string;
  fileType?: string | null;
  createdAt: string;
  uploadedById: string;
  patientId?: string | null;
}

const PIPELINE_STAGES = [
  "INQUIRY_RECEIVED",
  "QUALIFICATION",
  "TREATMENT_PLAN_SENT",
  "CONFIRMATION",
  "VISA_TRAVEL",
  "ARRIVED_ADMITTED",
  "IN_TREATMENT",
  "AYURVEDA_RECOVERY",
  "COMPLETED_FOLLOWUP",
  "CLOSED",
];

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: "Basic " + btoa("santos:He@lInd!a2026") };
        const [patientRes, tasksRes, docsRes] = await Promise.all([
          fetch(`/api/patients/${id}`, { headers }),
          fetch(`/api/tasks?patientId=${id}`, { headers }),
          fetch(`/api/documents`, { headers }),
        ]);
        const patientData = await patientRes.json();
        const tasksData = await tasksRes.json();
        const docsData = await docsRes.json();
        setPatient(patientData.patient);
        setTasks(tasksData.tasks || []);
        setDocuments((docsData.documents || []).filter((d: Document) => d.patientId === id));
      } catch (err) {
        console.error("Failed to load patient:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading patient...</div>;
  }
  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Patient not found.</p>
        <Button className="mt-4" onClick={() => router.push("/patients")}>
          Back to Patients
        </Button>
      </div>
    );
  }

  const currentStageIndex = PIPELINE_STAGES.indexOf(patient.stage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/patients")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
              <Badge variant="outline" className="text-xs">
                {patient.referenceNumber}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {patient.treatmentType} &middot; {patient.country}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button size="sm">
            <MessageSquare className="h-4 w-4 mr-2" /> Contact
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pipeline progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" /> Pipeline Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                {PIPELINE_STAGES.map((stage, i) => {
                  const isPast = i < currentStageIndex;
                  const isCurrent = i === currentStageIndex;
                  return (
                    <div key={stage} className="flex items-center flex-shrink-0">
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                          isCurrent
                            ? "bg-brand-600 text-white"
                            : isPast
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {STAGE_LABELS[stage as keyof typeof STAGE_LABELS]}
                      </div>
                      {i < PIPELINE_STAGES.length - 1 && (
                        <div
                          className={`w-4 h-0.5 mx-1 ${
                            isPast || isCurrent ? "bg-green-300" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" /> Tasks ({tasks.length})
                </CardTitle>
                <Button variant="ghost" size="sm">
                  + Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => {
                    const priorityColor =
                      task.priority === "URGENT"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "HIGH"
                        ? "bg-orange-100 text-orange-800"
                        : task.priority === "MEDIUM"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-800";
                    return (
                      <div key={task.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                        <div
                          className={`mt-0.5 w-2 h-2 rounded-full ${
                            task.status === "COMPLETED" ? "bg-green-500" : "bg-amber-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm">{task.title}</p>
                            <Badge variant="outline" className={`text-xs ${priorityColor}`}>
                              {task.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.status}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {task.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Due: {formatDate(task.dueDate)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Documents ({documents.length})
                </CardTitle>
                <Button variant="ghost" size="sm">
                  + Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents yet.</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.category} &middot; {formatDate(doc.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Contact card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${patient.email}`} className="text-blue-600 hover:underline">
                  {patient.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${patient.phone}`} className="text-blue-600 hover:underline">
                  {patient.phone}
                </a>
              </div>
              {patient.whatsapp && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  <a
                    href={`https://wa.me/${patient.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    WhatsApp: {patient.whatsapp}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{patient.country}</span>
              </div>
            </CardContent>
          </Card>

          {/* Treatment card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5" /> Treatment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Type</p>
                <p className="font-medium">{patient.treatmentType}</p>
              </div>
              {patient.treatmentDescription && (
                <div>
                  <p className="text-muted-foreground text-xs">Description</p>
                  <p>{patient.treatmentDescription}</p>
                </div>
              )}
              {patient.preferredHospital && (
                <div>
                  <p className="text-muted-foreground text-xs">Preferred Hospital</p>
                  <p className="font-medium flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> {patient.preferredHospital}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" /> Financial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {patient.estimatedCost != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated cost</span>
                  <span className="font-medium">{formatCurrency(patient.estimatedCost)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deposit received</span>
                <span>
                  {patient.depositReceived ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700">
                      No
                    </Badge>
                  )}
                </span>
              </div>
              {patient.depositAmount != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit amount</span>
                  <span className="font-medium">{formatCurrency(patient.depositAmount)}</span>
                </div>
              )}
              {patient.finalCost != null && (
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Final cost</span>
                  <span className="font-bold text-lg">{formatCurrency(patient.finalCost)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Inquiry received</p>
                  <p>{formatDate(patient.inquiryDate)}</p>
                </div>
              </div>
              {patient.expectedTravelDate && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Plane className="h-3 w-3" /> Expected travel
                    </p>
                    <p>{formatDate(patient.expectedTravelDate)}</p>
                  </div>
                </div>
              )}
              {patient.actualTravelDate && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Actual travel</p>
                    <p>{formatDate(patient.actualTravelDate)}</p>
                  </div>
                </div>
              )}
              {patient.dischargeDate && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Discharge</p>
                    <p>{formatDate(patient.dischargeDate)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
