/**
 * Email integration via Resend.
 * Falls back to console logging when RESEND_API_KEY is not set (dev mode).
 *
 * All email sending goes through this module — never call Resend directly.
 */
import { logger } from "@/lib/logger";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "Santos Care <no-reply@santos.care>";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

/**
 * Send a transactional email.
 * In dev/test without RESEND_API_KEY, logs to console only.
 */
export async function sendEmail(input: SendEmailInput): Promise<{ id?: string; mocked?: boolean }> {
  if (!RESEND_API_KEY) {
    logger.info("[email] Mock mode — would send:", {
      to: input.to,
      subject: input.subject,
    });
    return { mocked: true };
  }

  try {
    // Dynamic import to avoid crashing when resend is not installed
    const { Resend } = await import("resend");
    const resend = new Resend(RESEND_API_KEY);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      ...(input.text ? { text: input.text } : {}),
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    });

    logger.info("[email] Sent", { id: result.data?.id, to: input.to });
    return { id: result.data?.id };
  } catch (err) {
    logger.error("[email] Failed to send email", err);
    throw err;
  }
}

// ─── Email templates ──────────────────────────────────────────────────────────

export function welcomePatientEmail(patientName: string, refNumber: string): SendEmailInput {
  return {
    subject: `Welcome to Santos Care — Reference #${refNumber}`,
    html: `
      <h1>Welcome, ${patientName}!</h1>
      <p>Your inquiry has been received. Your reference number is <strong>${refNumber}</strong>.</p>
      <p>Our team will reach out to you within 24 hours.</p>
      <p>Best regards,<br>Santos Care Team</p>
    `,
    text: `Welcome, ${patientName}! Your reference number is ${refNumber}. We'll be in touch within 24 hours.`,
    to: "", // Caller fills in
  };
}

export function invoiceSentEmail(patientName: string, invoiceNumber: string, amount: string, currency: string): SendEmailInput {
  return {
    subject: `Invoice #${invoiceNumber} from Santos Care`,
    html: `
      <h1>Invoice #${invoiceNumber}</h1>
      <p>Dear ${patientName},</p>
      <p>Please find attached your invoice for <strong>${currency} ${amount}</strong>.</p>
      <p>Best regards,<br>Santos Care Finance Team</p>
    `,
    text: `Invoice #${invoiceNumber} for ${currency} ${amount} has been sent to you.`,
    to: "", // Caller fills in
  };
}

export function appointmentReminderEmail(patientName: string, date: string, location: string): SendEmailInput {
  return {
    subject: `Appointment Reminder — ${date}`,
    html: `
      <h1>Appointment Reminder</h1>
      <p>Dear ${patientName},</p>
      <p>This is a reminder for your appointment on <strong>${date}</strong> at <strong>${location}</strong>.</p>
      <p>Best regards,<br>Santos Care Team</p>
    `,
    text: `Reminder: Appointment on ${date} at ${location}.`,
    to: "", // Caller fills in
  };
}
