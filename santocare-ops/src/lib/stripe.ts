/**
 * Stripe payment integration.
 * Falls back to mock mode when STRIPE_SECRET_KEY is not set.
 *
 * All Stripe calls go through this module — never use stripe directly in routes.
 */
import { logger } from "@/lib/logger";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

let _stripe: any = null;

function getStripe() {
  if (!STRIPE_SECRET_KEY) {
    return null;
  }
  if (!_stripe) {
    // Dynamic import to avoid crashing on startup without the key
    const Stripe = require("stripe");
    _stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

export type CreatePaymentIntentInput = {
  amount: number; // in smallest currency unit (e.g., cents)
  currency: string;
  metadata?: Record<string, string>;
  description?: string;
  receiptEmail?: string;
};

/**
 * Create a Stripe PaymentIntent for a patient invoice.
 */
export async function createPaymentIntent(input: CreatePaymentIntentInput): Promise<{
  clientSecret: string | null;
  id: string;
  mocked?: boolean;
}> {
  const stripe = getStripe();

  if (!stripe) {
    logger.info("[stripe] Mock mode — would create PaymentIntent:", input);
    return {
      clientSecret: "pi_mock_secret_123",
      id: "pi_mock_123",
      mocked: true,
    };
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(input.amount * 100), // Convert to cents
      currency: input.currency.toLowerCase(),
      metadata: input.metadata || {},
      description: input.description,
      receipt_email: input.receiptEmail,
      automatic_payment_methods: { enabled: true },
    });

    logger.info("[stripe] PaymentIntent created", { id: intent.id });
    return { clientSecret: intent.client_secret, id: intent.id };
  } catch (err) {
    logger.error("[stripe] Failed to create PaymentIntent", err);
    throw err;
  }
}

/**
 * Verify a Stripe webhook signature and parse the event.
 * Returns null if the signature is invalid.
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): any | null {
  const stripe = getStripe();
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    logger.warn("[stripe] Webhook verification skipped — no keys configured");
    // In mock mode, try to parse the payload as JSON
    try {
      return typeof payload === "string" ? JSON.parse(payload) : JSON.parse(payload.toString());
    } catch {
      return null;
    }
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error("[stripe] Webhook signature verification failed", err);
    return null;
  }
}
