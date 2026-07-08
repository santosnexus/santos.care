import { z } from "zod";

// ─── Patient ──────────────────────────────────────────────────────────────────

export const PatientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  whatsapp: z.string().optional().nullable(),
  treatmentType: z.string().min(1, "Treatment type is required"),
  treatmentDescription: z.string().optional().nullable(),
  preferredHospital: z.string().optional().nullable(),
  stage: z.string().optional(),
  estimatedCost: z.number().positive("Cost must be positive").optional().nullable(),
  referenceNumber: z.string().optional(),
  assignedCoordinatorId: z.string().optional().nullable(),
  expectedTravelDate: z.string().datetime({ offset: true }).optional().nullable(),
  depositReceived: z.boolean().optional(),
  depositAmount: z.number().min(0).optional().nullable(),
  finalCost: z.number().min(0).optional().nullable(),
});

export const PatientUpdateSchema = PatientSchema.partial();

export const StageChangeSchema = z.object({
  toStage: z.enum([
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
  ]),
  note: z.string().optional().nullable(),
});

// ─── Lead ─────────────────────────────────────────────────────────────────────

export const LeadSchema = z.object({
  source: z
    .enum(["WHATSAPP", "WEBSITE", "FACEBOOK", "GOOGLE_ADS", "REFERRAL", "PARTNER_HOSPITAL", "EXHIBITION", "OTHER"])
    .optional()
    .default("WEBSITE"),
  campaign: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  country: z.string().optional().nullable(),
  email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  treatmentInterest: z.string().optional().nullable(),
  budgetRange: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
});

export const LeadUpdateSchema = LeadSchema.partial().extend({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"]).optional(),
  score: z.number().min(0).max(100).optional(),
  lastContactAt: z.string().datetime({ offset: true }).optional().nullable(),
});

// ─── Partner ──────────────────────────────────────────────────────────────────

export const PartnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["HOSPITAL", "AYURVEDA", "LAB", "TRANSPORT", "NURSING", "EQUIPMENT"]),
  contactPerson: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable(),
  website: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  description: z.string().optional().nullable(),
  specializations: z.array(z.string()).optional().default([]),
  agreementStatus: z.enum(["NONE", "PENDING", "SIGNED", "EXPIRED"]).optional(),
  agreementDate: z.string().datetime({ offset: true }).optional().nullable(),
  agreementExpiresAt: z.string().datetime({ offset: true }).optional().nullable(),
  commissionRate: z.number().min(0).max(100).optional().nullable(),
  isPubliclyListed: z.boolean().optional().default(false),
  slug: z.string().optional().nullable(),
});

export const PartnerUpdateSchema = PartnerSchema.partial();

// ─── Task ─────────────────────────────────────────────────────────────────────

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  type: z.enum(["PATIENT", "GENERAL", "MARKETING", "PARTNER"]).optional().default("GENERAL"),
  patientId: z.string().optional().nullable(),
  assignedToId: z.string().min(1, "Assignee is required"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional().default("MEDIUM"),
  dueDate: z.string().min(1, "Due date is required"),
  recurring: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional().nullable(),
});

export const TaskUpdateSchema = TaskSchema.partial();

// ─── Document ─────────────────────────────────────────────────────────────────

export const DocumentUploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  patientId: z.string().optional().nullable(),
  partnerId: z.string().optional().nullable(),
  isPublic: z.boolean().optional().default(false),
});

// ─── Invoice ──────────────────────────────────────────────────────────────────

export const InvoiceLineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().min(0, "Unit price must be non-negative"),
  category: z
    .enum(["SURGERY", "HOSPITAL", "HOTEL", "TRANSPORT", "VISA", "SERVICE", "OTHER"])
    .optional()
    .default("SERVICE"),
  refId: z.string().optional().nullable(),
});

export const InvoiceSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  lineItems: z.array(InvoiceLineItemSchema).min(1, "At least one line item is required"),
  currency: z.string().length(3, "Currency must be ISO 4217 code").optional().default("USD"),
  taxRate: z.number().min(0).max(100).optional().default(0),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  dueDate: z.string().optional(),
});

export const InvoiceUpdateSchema = z.object({
  status: z
    .enum(["DRAFT", "SENT", "VIEWED", "PARTIAL", "PAID", "OVERDUE", "CANCELLED"])
    .optional(),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  dueDate: z.string().optional(),
});

// ─── Quote ────────────────────────────────────────────────────────────────────

export const QuoteLineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().min(0, "Unit price must be non-negative"),
  category: z
    .enum(["SURGERY", "HOSPITAL", "HOTEL", "TRANSPORT", "VISA", "SERVICE", "OTHER"])
    .optional()
    .default("SERVICE"),
});

export const QuoteSchema = z.object({
  patientId: z.string().optional().nullable(),
  lineItems: z.array(QuoteLineItemSchema).min(1, "At least one line item is required"),
  currency: z.string().length(3, "Currency must be ISO 4217 code").optional().default("USD"),
  taxRate: z.number().min(0).max(100).optional().default(0),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  validUntil: z.string().optional(),
  treatmentPlan: z.string().optional().nullable(),
  hospitalName: z.string().optional().nullable(),
});

export const QuoteUpdateSchema = z.object({
  status: z
    .enum(["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED", "EXPIRED", "CONVERTED"])
    .optional(),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
});

// ─── Message ──────────────────────────────────────────────────────────────────

export const MessageSchema = z.object({
  channel: z.enum(["WHATSAPP", "EMAIL", "SMS", "INTERNAL"]),
  direction: z.enum(["INBOUND", "OUTBOUND"]).optional().default("OUTBOUND"),
  patientId: z.string().optional().nullable(),
  leadId: z.string().optional().nullable(),
  toAddress: z.string().optional().nullable(),
  toPhone: z.string().optional().nullable(),
  fromAddress: z.string().optional().nullable(),
  fromPhone: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  bodyHtml: z.string().optional().nullable(),
  bodyText: z.string().min(1, "Message body is required"),
  threadId: z.string().optional().nullable(),
  inReplyToId: z.string().optional().nullable(),
  template: z.string().optional().nullable(),
  variables: z.record(z.string()).optional().nullable(),
});

// ─── Itinerary ────────────────────────────────────────────────────────────────

export const ItineraryEventSchema = z.object({
  type: z.enum(["FLIGHT", "HOTEL", "PROCEDURE", "CONSULTATION", "DISCHARGE", "VISA", "TRANSPORT", "OTHER"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  date: z.string().min(1, "Date is required"),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  partnerId: z.string().optional().nullable(),
  documentIds: z.array(z.string()).optional().default([]),
  order: z.number().int().min(0).optional().default(0),
  status: z.enum(["PLANNED", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional().default("PLANNED"),
});

export const ItineraryEventUpdateSchema = ItineraryEventSchema.partial();

// ─── Consent ──────────────────────────────────────────────────────────────────

export const ConsentSchema = z.object({
  type: z.enum(["DATA_PROCESSING", "MARKETING", "TELEMEDICINE", "RESEARCH", "THIRD_PARTY_SHARING"]),
  granted: z.boolean(),
  notes: z.string().optional().nullable(),
});

// ─── Payment ──────────────────────────────────────────────────────────────────

export const PaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3).optional().default("USD"),
  method: z.enum(["BANK_TRANSFER", "CARD", "CASH", "CHEQUE", "INSURANCE", "OTHER"]).optional().default("BANK_TRANSFER"),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  receivedAt: z.string().optional(),
});
