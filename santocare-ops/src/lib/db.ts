import { PrismaClient } from "@prisma/client";
import {
  mockPatients,
  mockLeads,
  mockPartners,
  mockTasks,
  mockDocuments,
  mockUsers,
} from "@/lib/data";

/**
 * Database adapter. Tries to use Prisma + Supabase PostgreSQL.
 * Falls back to in-memory mock data if DATABASE_URL is not set or unreachable.
 *
 * Set DATABASE_URL in .env to enable real database.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const HAS_DATABASE = !!process.env.DATABASE_URL;

function createPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = HAS_DATABASE
  ? globalForPrisma.prisma ?? createPrisma()
  : (null as unknown as PrismaClient);

if (HAS_DATABASE && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const isDatabaseEnabled = HAS_DATABASE;
export const isMockMode = !HAS_DATABASE;

export default prisma;

/* -------------------------------------------------------------------------- */
/*  Data access helpers with mock fallback                                   */
/* -------------------------------------------------------------------------- */

type PatientRecord = Record<string, any>;
type LeadRecord = Record<string, any>;
type PartnerRecord = Record<string, any>;
type TaskRecord = Record<string, any>;
type DocumentRecord = Record<string, any>;
type UserRecord = Record<string, any>;

let mockDataStore = {
  patients: [...mockPatients] as PatientRecord[],
  leads: [...mockLeads] as LeadRecord[],
  partners: [...mockPartners] as PartnerRecord[],
  tasks: [...mockTasks] as TaskRecord[],
  documents: [...mockDocuments] as DocumentRecord[],
  users: [...mockUsers] as UserRecord[],
};

export const store = {
  patients: {
    list: async () => (prisma ? prisma.patient.findMany() : mockDataStore.patients),
    find: async (id: string) => {
      if (prisma) return prisma.patient.findUnique({ where: { id } });
      return mockDataStore.patients.find((p) => p.id === id) || null;
    },
    create: async (data: Partial<PatientRecord>) => {
      if (prisma) return prisma.patient.create({ data: data as any });
      const newPatient = { id: Date.now().toString(), ...data } as PatientRecord;
      mockDataStore.patients.push(newPatient);
      return newPatient;
    },
    update: async (id: string, data: Partial<PatientRecord>) => {
      if (prisma) return prisma.patient.update({ where: { id }, data: data as any });
      const idx = mockDataStore.patients.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      mockDataStore.patients[idx] = { ...mockDataStore.patients[idx], ...data };
      return mockDataStore.patients[idx];
    },
    delete: async (id: string) => {
      if (prisma) return prisma.patient.delete({ where: { id } });
      mockDataStore.patients = mockDataStore.patients.filter((p) => p.id !== id);
      return { id };
    },
  },
  leads: {
    list: async () => (prisma ? prisma.lead.findMany() : mockDataStore.leads),
    find: async (id: string) => {
      if (prisma) return prisma.lead.findUnique({ where: { id } });
      return mockDataStore.leads.find((l) => l.id === id) || null;
    },
    create: async (data: Partial<LeadRecord>) => {
      if (prisma) return prisma.lead.create({ data: data as any });
      const newLead = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data } as LeadRecord;
      mockDataStore.leads.unshift(newLead);
      return newLead;
    },
    update: async (id: string, data: Partial<LeadRecord>) => {
      if (prisma) return prisma.lead.update({ where: { id }, data: data as any });
      const idx = mockDataStore.leads.findIndex((l) => l.id === id);
      if (idx === -1) return null;
      mockDataStore.leads[idx] = { ...mockDataStore.leads[idx], ...data };
      return mockDataStore.leads[idx];
    },
    delete: async (id: string) => {
      if (prisma) return prisma.lead.delete({ where: { id } });
      mockDataStore.leads = mockDataStore.leads.filter((l) => l.id !== id);
      return { id };
    },
  },
  partners: {
    list: async () => (prisma ? prisma.partner.findMany() : mockDataStore.partners),
    find: async (id: string) => {
      if (prisma) return prisma.partner.findUnique({ where: { id } });
      return mockDataStore.partners.find((p) => p.id === id) || null;
    },
    create: async (data: Partial<PartnerRecord>) => {
      if (prisma) return prisma.partner.create({ data: data as any });
      const newPartner = { id: Date.now().toString(), ...data } as PartnerRecord;
      mockDataStore.partners.push(newPartner);
      return newPartner;
    },
    update: async (id: string, data: Partial<PartnerRecord>) => {
      if (prisma) return prisma.partner.update({ where: { id }, data: data as any });
      const idx = mockDataStore.partners.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      mockDataStore.partners[idx] = { ...mockDataStore.partners[idx], ...data };
      return mockDataStore.partners[idx];
    },
    delete: async (id: string) => {
      if (prisma) return prisma.partner.delete({ where: { id } });
      mockDataStore.partners = mockDataStore.partners.filter((p) => p.id !== id);
      return { id };
    },
  },
  tasks: {
    list: async () => (prisma ? prisma.task.findMany() : mockDataStore.tasks),
    find: async (id: string) => {
      if (prisma) return prisma.task.findUnique({ where: { id } });
      return mockDataStore.tasks.find((t) => t.id === id) || null;
    },
    create: async (data: Partial<TaskRecord>) => {
      if (prisma) return prisma.task.create({ data: data as any });
      const newTask = { id: Date.now().toString(), ...data } as TaskRecord;
      mockDataStore.tasks.push(newTask);
      return newTask;
    },
    update: async (id: string, data: Partial<TaskRecord>) => {
      if (prisma) return prisma.task.update({ where: { id }, data: data as any });
      const idx = mockDataStore.tasks.findIndex((t) => t.id === id);
      if (idx === -1) return null;
      mockDataStore.tasks[idx] = { ...mockDataStore.tasks[idx], ...data };
      return mockDataStore.tasks[idx];
    },
    delete: async (id: string) => {
      if (prisma) return prisma.task.delete({ where: { id } });
      mockDataStore.tasks = mockDataStore.tasks.filter((t) => t.id !== id);
      return { id };
    },
  },
  documents: {
    list: async () => (prisma ? prisma.document.findMany() : mockDataStore.documents),
    find: async (id: string) => {
      if (prisma) return prisma.document.findUnique({ where: { id } });
      return mockDataStore.documents.find((d) => d.id === id) || null;
    },
    create: async (data: Partial<DocumentRecord>) => {
      if (prisma) return prisma.document.create({ data: data as any });
      const newDoc = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data } as DocumentRecord;
      mockDataStore.documents.push(newDoc);
      return newDoc;
    },
    delete: async (id: string) => {
      if (prisma) return prisma.document.delete({ where: { id } });
      mockDataStore.documents = mockDataStore.documents.filter((d) => d.id !== id);
      return { id };
    },
  },
  users: {
    list: async () => (prisma ? prisma.user.findMany() : mockDataStore.users),
    find: async (id: string) => {
      if (prisma) return prisma.user.findUnique({ where: { id } });
      return mockDataStore.users.find((u) => u.id === id) || null;
    },
    findByEmail: async (email: string) => {
      if (prisma) return prisma.user.findUnique({ where: { email } });
      return mockDataStore.users.find((u) => u.email === email) || null;
    },
  },
};
