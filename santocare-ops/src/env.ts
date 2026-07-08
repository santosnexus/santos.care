/**
 * Environment variable validation.
 * Required vars throw in production. In development, missing vars
 * are warned but allow mock-mode startup.
 *
 * All secrets come from environment — never hardcoded.
 */

const REQUIRED_IN_PRODUCTION = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "OPS_AUTH_USER",
  "OPS_AUTH_PASS",
] as const;

const OPTIONAL_INTEGRATION_VARS = [
  // Email
  "RESEND_API_KEY",
  // Payments
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  // Twilio
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_WHATSAPP_FROM",
  "TWILIO_SMS_FROM",
  // Background jobs
  "INNGEST_EVENT_KEY",
  "INNGEST_SIGNING_KEY",
  // Error tracking
  "SENTRY_DSN",
  "NEXT_PUBLIC_SENTRY_DSN",
  // Storage
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  // Compliance
  "FIELD_ENCRYPTION_KEY",
  // Exchange rates
  "OPEN_EXCHANGE_RATES_APP_ID",
  // Rate limiting
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  // Retention policy
  "DATA_RETENTION_YEARS",
] as const;

const missingRequired: string[] = [];
const missingIntegration: string[] = [];

for (const name of REQUIRED_IN_PRODUCTION) {
  if (!process.env[name]) {
    missingRequired.push(name);
  }
}

for (const name of OPTIONAL_INTEGRATION_VARS) {
  if (!process.env[name]) {
    missingIntegration.push(name);
  }
}

if (missingRequired.length > 0) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `[env] Missing required environment variables: ${missingRequired.join(", ")}. ` +
        "Set them in your deployment environment."
    );
  }
  console.warn(
    `[env] Warning: Missing required vars (mock mode active): ${missingRequired.join(", ")}`
  );
}

if (missingIntegration.length > 0 && process.env.NODE_ENV === "development") {
  // Only log a summary, not every individual var, to reduce noise
  console.info(
    `[env] ${missingIntegration.length} integration vars not set (email, payments, WhatsApp, etc. will be mocked).`
  );
}
