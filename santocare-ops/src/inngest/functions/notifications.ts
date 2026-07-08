/**
 * Inngest notification functions (Inngest SDK v3).
 *
 * v3 API: inngest.createFunction(
 *   { id, name, triggers: [{ event: "event/name" }], ...otherOptions },
 *   { event: "event/name" },
 *   async ({ event, step }) => { ... }
 * )
 */
import { inngest } from "@/inngest/client";
import { sendEmail, welcomePatientEmail, invoiceSentEmail } from "@/lib/email";
import { sendWhatsApp, templates } from "@/lib/whatsapp";

// ─── Patient: Welcome on creation ────────────────────────────────────────────

export const onPatientCreated = inngest.createFunction(
  {
    id: "patient-created-notify",
    name: "Notify: Patient Created",
  },
  { event: "patient/created" },
  async ({ event, step }: { event: any; step: any }) => {
    const { name, email, phone, whatsapp, referenceNumber } = event.data;
    const results: Record<string, unknown> = {};

    if (email) {
      const template = welcomePatientEmail(name, referenceNumber);
      results.email = await sendEmail({ ...template, to: email });
    }

    const whatsappNumber = whatsapp || phone;
    if (whatsappNumber) {
      results.whatsapp = await sendWhatsApp({
        to: whatsappNumber,
        body: templates.welcomeWhatsApp(name, referenceNumber),
      });
    }

    return results;
  }
);

// ─── Patient: Stage change notification ──────────────────────────────────────

export const onPatientStageChanged = inngest.createFunction(
  {
    id: "patient-stage-changed-notify",
    name: "Notify: Patient Stage Changed",
  },
  { event: "patient/stage-changed" },
  async ({ event, step }: { event: any; step: any }) => {
    const { patientName, patientPhone, toStage } = event.data;

    const stageLabels: Record<string, string> = {
      CONFIRMATION: "Confirmed — Treatment Planned",
      VISA_TRAVEL: "Visa & Travel Ready",
      ARRIVED_ADMITTED: "Arrived & Admitted",
      IN_TREATMENT: "In Treatment",
      AYURVEDA_RECOVERY: "Recovery Phase",
      COMPLETED_FOLLOWUP: "Treatment Completed",
    };

    const label = stageLabels[toStage];
    if (!label) return { skipped: true, reason: "No notification for this stage" };

    const results: Record<string, unknown> = {};
    if (patientPhone) {
      results.whatsapp = await sendWhatsApp({
        to: patientPhone,
        body: templates.stageUpdate(patientName, label),
      }).catch(() => ({ error: "WhatsApp delivery failed" }));
    }

    return results;
  }
);

// ─── Invoice: Sent notification ───────────────────────────────────────────────

export const onInvoiceSent = inngest.createFunction(
  {
    id: "invoice-sent-notify",
    name: "Notify: Invoice Sent",
  },
  { event: "invoice/sent" },
  async ({ event, step }: { event: any; step: any }) => {
    const { patientEmail, patientName, amount, currency, invoiceNumber } = event.data;
    const results: Record<string, unknown> = {};

    if (patientEmail) {
      const template = invoiceSentEmail(patientName, invoiceNumber, amount.toFixed(2), currency);
      results.email = await sendEmail({ ...template, to: patientEmail });
    }

    return results;
  }
);

// ─── Lead: Drip nurture sequence ─────────────────────────────────────────────

export const leadDripSequence = inngest.createFunction(
  {
    id: "lead-drip-sequence",
    name: "Lead: Drip Nurture Sequence",
    throttle: {
      limit: 100,
      period: "1m",
    },
  },
  { event: "lead/created" },
  async ({ event, step }: { event: any; step: any }) => {
    const { name, email, leadId } = event.data;
    if (!email) return { skipped: true, reason: "No email address" };

    // Day 1 — immediate intro
    await step.run("send-day1-email", () =>
      sendEmail({
        to: email,
        subject: "Your Medical Tourism Journey Starts Here",
        html: `<p>Dear ${name},</p><p>Thank you for your interest in Santos Care. We specialise in connecting patients with world-class medical facilities in India at a fraction of Western costs.</p>`,
        text: `Dear ${name}, thank you for your interest in Santos Care.`,
      })
    );

    // Day 3 — follow-up
    await step.sleep("wait-3-days", "3d");
    await step.run("send-day3-followup", () =>
      sendEmail({
        to: email,
        subject: "Your Free Medical Tourism Consultation",
        html: `<p>Dear ${name},</p><p>We'd love to connect and discuss how we can help with your treatment in India. Reply to schedule a free consultation.</p>`,
        text: `Dear ${name}, let us help you with your treatment journey.`,
      })
    );

    // Day 7 — social proof
    await step.sleep("wait-7-days", "4d");
    await step.run("send-day7-social-proof", () =>
      sendEmail({
        to: email,
        subject: "How We Helped 500+ International Patients",
        html: `<p>Dear ${name},</p><p>We've helped over 500 patients from around the world receive world-class treatment in India.</p>`,
        text: `Dear ${name}, we've helped 500+ international patients.`,
      })
    );

    return { leadId, sequences: 3 };
  }
);

// ─── Partner: Agreement expiry alert ─────────────────────────────────────────

export const onPartnerAgreementExpiring = inngest.createFunction(
  {
    id: "partner-agreement-expiring",
    name: "Alert: Partner Agreement Expiring",
  },
  { event: "partner/agreement-expiring" },
  async ({ event, step }: { event: any; step: any }) => {
    const { partnerName, expiresAt, daysLeft } = event.data;
    // TODO: Notify admin email list once admin user lookup is available
    console.info(
      `[inngest] Partner agreement expiring: ${partnerName} — ${daysLeft} days left (${expiresAt})`
    );
    return { partnerName, daysLeft };
  }
);

// ─── Exports ─────────────────────────────────────────────────────────────────

export const inngestFunctions = [
  onPatientCreated,
  onPatientStageChanged,
  onInvoiceSent,
  leadDripSequence,
  onPartnerAgreementExpiring,
];
