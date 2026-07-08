import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "",
  project: process.env.SENTRY_PROJECT || "santocare-ops",
  silent: true,
  hideSourceMaps: true,
  widenClientFileUpload: true,
  disableLogger: true,
  tunnelRoute: "/monitoring",
});
