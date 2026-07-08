import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function generateRefNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `HIMT-${year}-${random}`;
}

export const PIPELINE_STAGES = [
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
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const STAGE_LABELS: Record<PipelineStage, string> = {
  INQUIRY_RECEIVED: "Inquiry Received",
  QUALIFICATION: "Qualification",
  TREATMENT_PLAN_SENT: "Treatment Plan Sent",
  CONFIRMATION: "Confirmation / Deposit",
  VISA_TRAVEL: "Visa & Travel",
  ARRIVED_ADMITTED: "Arrived / Admitted",
  IN_TREATMENT: "In Treatment",
  AYURVEDA_RECOVERY: "Ayurveda Recovery",
  COMPLETED_FOLLOWUP: "Completed / Follow-up",
  CLOSED: "Closed",
};

export const STAGE_COLORS: Record<PipelineStage, string> = {
  INQUIRY_RECEIVED: "bg-blue-100 text-blue-800 border-blue-200",
  QUALIFICATION: "bg-amber-100 text-amber-800 border-amber-200",
  TREATMENT_PLAN_SENT: "bg-purple-100 text-purple-800 border-purple-200",
  CONFIRMATION: "bg-orange-100 text-orange-800 border-orange-200",
  VISA_TRAVEL: "bg-cyan-100 text-cyan-800 border-cyan-200",
  ARRIVED_ADMITTED: "bg-teal-100 text-teal-800 border-teal-200",
  IN_TREATMENT: "bg-red-100 text-red-800 border-red-200",
  AYURVEDA_RECOVERY: "bg-green-100 text-green-800 border-green-200",
  COMPLETED_FOLLOWUP: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CLOSED: "bg-gray-100 text-gray-800 border-gray-200",
};

export const TREATMENT_TYPES = [
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
  "Other",
] as const;

export type TreatmentType = (typeof TREATMENT_TYPES)[number];

export const COUNTRIES = [
  "Kenya",
  "Tanzania",
  "Uganda",
  "Nigeria",
  "Ghana",
  "Ethiopia",
  "South Africa",
  "United Kingdom",
  "Germany",
  "France",
  "UAE",
  "Saudi Arabia",
  "Other",
] as const;

export const PARTNER_CATEGORIES = [
  "hospital",
  "ayurveda",
  "lab",
  "transport",
  "nursing",
  "equipment",
] as const;

export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number];

export const LEAD_SOURCES = [
  "WhatsApp",
  "Website",
  "Facebook",
  "Google Ads",
  "Referral",
  "Partner Hospital",
  "Exhibition",
  "Other",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ["pending", "in_progress", "completed", "cancelled"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/**
 * Convert a string to a URL-safe slug.
 * e.g. "Apollo Hospitals" → "apollo-hospitals"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}