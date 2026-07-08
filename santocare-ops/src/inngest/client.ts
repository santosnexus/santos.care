/**
 * Inngest client and function registration.
 * Inngest handles all background jobs: notifications, drip sequences,
 * agreement expiry alerts, data retention, etc.
 */
import { Inngest } from "inngest";

// ─── Client ───────────────────────────────────────────────────────────────────

export const inngest = new Inngest({
  id: "santos-care",
  name: "Santos Care",
  // The signing key is set via INNGEST_SIGNING_KEY env var automatically
  // The event key is set via INNGEST_EVENT_KEY env var automatically
});

// ─── Typed event definitions ──────────────────────────────────────────────────

export type SantosEvents = {
  "patient/created": {
    data: {
      patientId: string;
      tenantId: string;
      name: string;
      email: string;
      phone: string;
      whatsapp?: string | null;
      referenceNumber: string;
      coordinatorId?: string | null;
    };
  };
  "patient/stage-changed": {
    data: {
      patientId: string;
      tenantId: string;
      fromStage: string;
      toStage: string;
      patientName: string;
      patientEmail: string;
      patientPhone: string;
      coordinatorId?: string | null;
    };
  };
  "lead/created": {
    data: {
      leadId: string;
      tenantId: string;
      name: string;
      email?: string | null;
      phone?: string | null;
      source: string;
    };
  };
  "invoice/sent": {
    data: {
      invoiceId: string;
      tenantId: string;
      patientId: string;
      patientEmail: string;
      patientName: string;
      amount: number;
      currency: string;
      invoiceNumber: string;
    };
  };
  "payment/received": {
    data: {
      paymentId: string;
      invoiceId: string;
      tenantId: string;
      patientId: string;
      patientEmail: string;
      patientName: string;
      amount: number;
      currency: string;
    };
  };
  "partner/agreement-expiring": {
    data: {
      partnerId: string;
      tenantId: string;
      partnerName: string;
      expiresAt: string;
      daysLeft: number;
    };
  };
  "task/overdue": {
    data: {
      taskId: string;
      tenantId: string;
      assignedToEmail: string;
      taskTitle: string;
      dueDate: string;
    };
  };
  "retention/purge-due": {
    data: {
      tenantId: string;
      cutoffDate: string;
    };
  };
};
