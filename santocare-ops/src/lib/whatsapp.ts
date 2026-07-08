/**
 * WhatsApp and SMS integration via Twilio.
 * Falls back to console logging when credentials are not set.
 *
 * All messaging goes through this module.
 */
import { logger } from "@/lib/logger";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886"; // Twilio sandbox default
const SMS_FROM = process.env.TWILIO_SMS_FROM;

let _client: any = null;

function getTwilio() {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return null;
  }
  if (!_client) {
    const twilio = require("twilio");
    _client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  return _client;
}

export type SendWhatsAppInput = {
  to: string; // E.164 format, e.g. "+919876543210"
  body: string;
  mediaUrl?: string;
};

/**
 * Send a WhatsApp message via Twilio.
 */
export async function sendWhatsApp(input: SendWhatsAppInput): Promise<{
  sid?: string;
  mocked?: boolean;
}> {
  const client = getTwilio();

  if (!client) {
    logger.info("[whatsapp] Mock mode — would send:", {
      to: input.to,
      body: input.body.substring(0, 50) + "...",
    });
    return { mocked: true };
  }

  try {
    const toWhatsApp = input.to.startsWith("whatsapp:") ? input.to : `whatsapp:${input.to}`;
    const message = await client.messages.create({
      from: WHATSAPP_FROM,
      to: toWhatsApp,
      body: input.body,
      ...(input.mediaUrl ? { mediaUrl: [input.mediaUrl] } : {}),
    });

    logger.info("[whatsapp] Message sent", { sid: message.sid });
    return { sid: message.sid };
  } catch (err) {
    logger.error("[whatsapp] Failed to send message", err);
    throw err;
  }
}

export type SendSMSInput = {
  to: string; // E.164 format
  body: string;
};

/**
 * Send an SMS via Twilio.
 */
export async function sendSMS(input: SendSMSInput): Promise<{
  sid?: string;
  mocked?: boolean;
}> {
  const client = getTwilio();

  if (!client || !SMS_FROM) {
    logger.info("[sms] Mock mode — would send:", {
      to: input.to,
      body: input.body.substring(0, 50),
    });
    return { mocked: true };
  }

  try {
    const message = await client.messages.create({
      from: SMS_FROM,
      to: input.to,
      body: input.body,
    });

    logger.info("[sms] Message sent", { sid: message.sid });
    return { sid: message.sid };
  } catch (err) {
    logger.error("[sms] Failed to send SMS", err);
    throw err;
  }
}

// ─── Message templates ────────────────────────────────────────────────────────

export const templates = {
  welcomeWhatsApp: (name: string, refNumber: string) =>
    `Hello ${name}! 👋 Welcome to Santos Care. Your reference number is *${refNumber}*. Our team will contact you within 24 hours. Reply STOP to unsubscribe.`,

  invoiceSent: (name: string, amount: string, currency: string) =>
    `Dear ${name}, your invoice for ${currency} ${amount} has been sent. Please check your email or contact us for the payment link.`,

  appointmentReminder: (name: string, date: string, location: string) =>
    `Reminder: Dear ${name}, you have an appointment on *${date}* at *${location}*. Please confirm your attendance.`,

  travelConfirmation: (name: string, date: string) =>
    `Dear ${name}, your travel to India is confirmed for *${date}*. Our team will coordinate pickup. Safe travels! ✈️`,

  stageUpdate: (name: string, stage: string) =>
    `Dear ${name}, your treatment status has been updated to: *${stage}*. Contact us for any questions.`,
};
