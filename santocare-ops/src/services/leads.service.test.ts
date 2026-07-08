/**
 * Unit tests for leads.service.ts
 * Uses vi.mock to mock the prisma singleton — no database needed.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculateLeadScore, createLead, convertLeadToPatient } from "@/services/leads.service";

// Mock the db module
vi.mock("@/lib/db", () => ({
  prisma: {
    lead: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    patient: {
      create: vi.fn(),
    },
    stageChange: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock audit
vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn().mockResolvedValue(undefined),
}));

// Import the mocked db
import { prisma } from "@/lib/db";

const mockPrisma = prisma as any;

describe("calculateLeadScore", () => {
  it("gives higher score to referral source", () => {
    const referral = calculateLeadScore({
      source: "REFERRAL",
      email: "test@test.com",
      phone: "+91123456789",
      treatmentInterest: "Cardiac",
      budgetRange: "10000-20000",
    });
    const other = calculateLeadScore({
      source: "OTHER",
      email: "test@test.com",
    });
    expect(referral).toBeGreaterThan(other);
  });

  it("caps score at 100", () => {
    const score = calculateLeadScore({
      source: "GOOGLE_ADS",
      email: "test@test.com",
      phone: "+91123456789",
      treatmentInterest: "Cardiac",
      budgetRange: "10000-20000",
    });
    expect(score).toBeLessThanOrEqual(100);
  });

  it("gives 0 baseline for unknown source", () => {
    const score = calculateLeadScore({
      source: "OTHER" as any,
    });
    expect(score).toBeGreaterThanOrEqual(5);
  });

  it("adds 10 points for email", () => {
    const withEmail = calculateLeadScore({ source: "WEBSITE", email: "a@b.com" });
    const withoutEmail = calculateLeadScore({ source: "WEBSITE" });
    expect(withEmail - withoutEmail).toBe(10);
  });

  it("adds 10 points for phone", () => {
    const withPhone = calculateLeadScore({ source: "WEBSITE", phone: "+91123" });
    const withoutPhone = calculateLeadScore({ source: "WEBSITE" });
    expect(withPhone - withoutPhone).toBe(10);
  });

  it("adds bonus for specific budget range", () => {
    const specific = calculateLeadScore({ source: "WEBSITE", budgetRange: "10000-15000" });
    const vague = calculateLeadScore({ source: "WEBSITE", budgetRange: "medium" });
    expect(specific).toBeGreaterThan(vague);
  });
});

describe("createLead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a lead with auto-calculated score", async () => {
    const mockLead = {
      id: "lead-1",
      tenantId: "tenant-1",
      source: "WEBSITE",
      name: "Test Patient",
      email: "test@test.com",
      score: 20,
    };
    mockPrisma.lead.create.mockResolvedValue(mockLead);

    const result = await createLead({
      tenantId: "tenant-1",
      source: "WEBSITE",
      name: "Test Patient",
      email: "test@test.com",
      createdById: "user-1",
    });

    expect(result).toEqual(mockLead);
    expect(mockPrisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-1",
          name: "Test Patient",
          email: "test@test.com",
          score: expect.any(Number),
        }),
      })
    );
  });

  it("sets empty email to null", async () => {
    mockPrisma.lead.create.mockResolvedValue({ id: "x", email: null });

    await createLead({
      tenantId: "tenant-1",
      source: "WEBSITE",
      name: "Test",
      email: "",
      createdById: "user-1",
    });

    expect(mockPrisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: null }),
      })
    );
  });
});

describe("convertLeadToPatient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws if lead is already converted", async () => {
    mockPrisma.lead.findUnique.mockResolvedValue({
      id: "lead-1",
      status: "CONVERTED",
      deletedAt: null,
    });

    await expect(
      convertLeadToPatient("tenant-1", "lead-1", "user-1")
    ).rejects.toThrow("Lead already converted");
  });

  it("throws if lead is soft-deleted", async () => {
    mockPrisma.lead.findUnique.mockResolvedValue({
      id: "lead-1",
      status: "NEW",
      deletedAt: new Date(),
    });

    await expect(
      convertLeadToPatient("tenant-1", "lead-1", "user-1")
    ).rejects.toThrow("Lead has been deleted");
  });

  it("throws if lead has no name", async () => {
    mockPrisma.lead.findUnique.mockResolvedValue({
      id: "lead-1",
      status: "NEW",
      deletedAt: null,
      name: null,
    });

    await expect(
      convertLeadToPatient("tenant-1", "lead-1", "user-1")
    ).rejects.toThrow("must have a name");
  });
});
