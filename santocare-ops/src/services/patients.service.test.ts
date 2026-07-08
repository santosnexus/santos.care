/**
 * Unit tests for patients.service.ts
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPatient, softDeletePatient, changePatientStage } from "@/services/patients.service";

vi.mock("@/lib/db", () => ({
  prisma: {
    patient: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    stageChange: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn().mockResolvedValue(undefined),
}));

import { prisma } from "@/lib/db";
const mockPrisma = prisma as any;

const basePatientInput = {
  tenantId: "t1",
  name: "Anita Kumar",
  country: "India",
  phone: "+91-9876543210",
  email: "anita@example.com",
  treatmentType: "Cardiac Surgery",
  createdById: "user-1",
};

describe("createPatient", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a patient with INQUIRY_RECEIVED stage by default", async () => {
    const mockPatient = { id: "p1", ...basePatientInput, stage: "INQUIRY_RECEIVED" };
    mockPrisma.patient.create.mockResolvedValue(mockPatient);
    mockPrisma.stageChange.create.mockResolvedValue({});

    const result = await createPatient(basePatientInput);

    expect(result).toEqual(mockPatient);
    expect(mockPrisma.patient.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          stage: "INQUIRY_RECEIVED",
          tenantId: "t1",
        }),
      })
    );
  });

  it("logs an initial stage change on creation", async () => {
    mockPrisma.patient.create.mockResolvedValue({ id: "p1", stage: "INQUIRY_RECEIVED" });
    mockPrisma.stageChange.create.mockResolvedValue({});

    await createPatient(basePatientInput);

    expect(mockPrisma.stageChange.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          toStage: "INQUIRY_RECEIVED",
          note: "Patient created",
        }),
      })
    );
  });

  it("generates a referenceNumber if not provided", async () => {
    mockPrisma.patient.create.mockResolvedValue({ id: "p1", referenceNumber: "HIMT-2026-1234" });
    mockPrisma.stageChange.create.mockResolvedValue({});

    await createPatient(basePatientInput);

    const callArgs = mockPrisma.patient.create.mock.calls[0][0];
    expect(callArgs.data.referenceNumber).toMatch(/^HIMT-\d{4}-\d{4}$/);
  });
});

describe("softDeletePatient", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws if patient not found", async () => {
    mockPrisma.patient.findUnique.mockResolvedValue(null);

    await expect(
      softDeletePatient("t1", "p-notfound", "user-1")
    ).rejects.toThrow("Patient not found");
  });

  it("throws if patient already deleted", async () => {
    mockPrisma.patient.findUnique.mockResolvedValue({
      id: "p1",
      deletedAt: new Date(),
    });

    await expect(softDeletePatient("t1", "p1", "user-1")).rejects.toThrow(
      "already deleted"
    );
  });

  it("sets deletedAt on the patient", async () => {
    mockPrisma.patient.findUnique.mockResolvedValue({ id: "p1", deletedAt: null });
    mockPrisma.patient.update.mockResolvedValue({ id: "p1", deletedAt: new Date() });

    await softDeletePatient("t1", "p1", "user-1");

    expect(mockPrisma.patient.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      })
    );
  });
});

describe("changePatientStage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws if patient not found", async () => {
    mockPrisma.patient.findUnique.mockResolvedValue(null);

    await expect(
      changePatientStage("t1", "p-bad", "QUALIFICATION", null, "user-1")
    ).rejects.toThrow("Patient not found");
  });

  it("throws if patient is soft-deleted", async () => {
    mockPrisma.patient.findUnique.mockResolvedValue({
      id: "p1",
      deletedAt: new Date(),
      stage: "INQUIRY_RECEIVED",
    });

    await expect(
      changePatientStage("t1", "p1", "QUALIFICATION", null, "user-1")
    ).rejects.toThrow("Patient has been deleted");
  });
});
