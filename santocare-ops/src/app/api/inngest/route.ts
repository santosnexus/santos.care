/**
 * Inngest webhook handler.
 * All background functions are registered here.
 */
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { inngestFunctions } from "@/inngest/functions/notifications";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: inngestFunctions,
});
