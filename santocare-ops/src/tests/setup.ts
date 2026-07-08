// Global test setup for vitest
// Sets up vi.mock stubs for external dependencies

import { vi } from "vitest";

// Mock environment variables for tests
// NODE_ENV is set to "test" by vitest itself; do not reassign
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.NEXTAUTH_SECRET = "test-secret-at-least-32-characters-long!!";
process.env.OPS_AUTH_USER = "test";
process.env.OPS_AUTH_PASS = "test";
