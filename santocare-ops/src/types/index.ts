import type {
  User,
  Patient,
  Task,
  Partner,
  Lead,
  Document,
  Note,
  StageChange,
  Communication,
  RoadmapItem,
  PipelineStage,
  TaskStatus,
  TaskPriority,
  TaskType,
  PartnerCategory,
  LeadSource,
  LeadStatus,
  Role,
  AgreementStatus,
} from "@prisma/client";

export type {
  User,
  Patient,
  Task,
  Partner,
  Lead,
  Document,
  Note,
  StageChange,
  Communication,
  RoadmapItem,
  PipelineStage,
  TaskStatus,
  TaskPriority,
  TaskType,
  PartnerCategory,
  LeadSource,
  LeadStatus,
  Role,
  AgreementStatus,
};

export interface PatientWithRelations extends Patient {
  assignedCoordinator?: User | null;
  stageHistory: StageChange[];
  tasks: Task[];
  documents: Document[];
  notes: Note[];
  communications: Communication[];
}

export interface TaskWithRelations extends Task {
  patient?: Patient | null;
  assignedTo: User;
  createdBy: User;
}

export interface PartnerWithRelations extends Partner {
  documents: Document[];
  notes: Note[];
}

export interface LeadWithConversion extends Lead {
  convertedPatient?: Patient | null;
}

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  pendingTasks: number;
  newLeadsThisWeek: number;
}

export interface PipelineStats {
  stage: PipelineStage;
  count: number;
  label: string;
  color: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  patients: number;
}

export interface TreatmentBreakdown {
  treatmentType: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface CountryBreakdown {
  country: string;
  patients: number;
  revenue: number;
}

export interface CoordinatorPerformance {
  name: string;
  patientsManaged: number;
  completedPatients: number;
  revenue: number;
}

export interface LeadSourceData {
  source: string;
  leads: number;
  conversions: number;
  conversionRate: number;
}
