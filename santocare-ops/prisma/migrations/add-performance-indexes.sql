-- Database performance indexes
-- Run this in Supabase SQL Editor (or via psql) to speed up common queries

-- Patient indexes
CREATE INDEX IF NOT EXISTS "patients_stage_idx" ON "patients" ("stage");
CREATE INDEX IF NOT EXISTS "patients_country_idx" ON "patients" ("country");
CREATE INDEX IF NOT EXISTS "patients_assignedCoordinatorId_idx" ON "patients" ("assignedCoordinatorId");
CREATE INDEX IF NOT EXISTS "patients_inquiryDate_idx" ON "patients" ("inquiryDate" DESC);
CREATE INDEX IF NOT EXISTS "patients_stage_assignedCoordinatorId_idx" ON "patients" ("stage", "assignedCoordinatorId");

-- Lead indexes
CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "leads" ("status");
CREATE INDEX IF NOT EXISTS "leads_source_idx" ON "leads" ("source");
CREATE INDEX IF NOT EXISTS "leads_createdAt_idx" ON "leads" ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "leads_status_createdAt_idx" ON "leads" ("status", "createdAt" DESC);

-- Task indexes
CREATE INDEX IF NOT EXISTS "tasks_assignedToId_idx" ON "tasks" ("assignedToId");
CREATE INDEX IF NOT EXISTS "tasks_status_idx" ON "tasks" ("status");
CREATE INDEX IF NOT EXISTS "tasks_dueDate_idx" ON "tasks" ("dueDate");
CREATE INDEX IF NOT EXISTS "tasks_assignedToId_status_idx" ON "tasks" ("assignedToId", "status");

-- Document indexes
CREATE INDEX IF NOT EXISTS "documents_category_idx" ON "documents" ("category");
CREATE INDEX IF NOT EXISTS "documents_patientId_idx" ON "documents" ("patientId");
CREATE INDEX IF NOT EXISTS "documents_partnerId_idx" ON "documents" ("partnerId");

-- Communication indexes
CREATE INDEX IF NOT EXISTS "communications_patientId_createdAt_idx" ON "communications" ("patientId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "communications_type_idx" ON "communications" ("type");

-- Note indexes
CREATE INDEX IF NOT EXISTS "notes_patientId_idx" ON "notes" ("patientId");
CREATE INDEX IF NOT EXISTS "notes_partnerId_idx" ON "notes" ("partnerId");

-- Partner indexes
CREATE INDEX IF NOT EXISTS "partners_category_idx" ON "partners" ("category");
CREATE INDEX IF NOT EXISTS "partners_agreementStatus_idx" ON "partners" ("agreementStatus");
CREATE INDEX IF NOT EXISTS "partners_category_agreementStatus_idx" ON "partners" ("category", "agreementStatus");

-- StageChange indexes
CREATE INDEX IF NOT EXISTS "stage_changes_patientId_idx" ON "stage_changes" ("patientId");
CREATE INDEX IF NOT EXISTS "stage_changes_changedAt_idx" ON "stage_changes" ("changedAt" DESC);

-- AnalyticsEvent indexes
CREATE INDEX IF NOT EXISTS "analytics_events_eventType_idx" ON "analytics_events" ("eventType");
CREATE INDEX IF NOT EXISTS "analytics_events_createdAt_idx" ON "analytics_events" ("createdAt" DESC);
