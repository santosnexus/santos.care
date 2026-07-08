import { PrismaClient } from "@prisma/client";
import {
  mockPatients,
  mockLeads,
  mockPartners,
  mockTasks,
  mockDocuments,
  mockUsers,
  mockBlogPosts,
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
type BlogPostRecord = Record<string, any>;

let mockDataStore = {
  patients: [...mockPatients] as PatientRecord[],
  leads: [...mockLeads] as LeadRecord[],
  partners: [...mockPartners] as PartnerRecord[],
  tasks: [...mockTasks] as TaskRecord[],
  documents: [...mockDocuments] as DocumentRecord[],
  users: [...mockUsers] as UserRecord[],
  blogPosts: [...mockBlogPosts] as BlogPostRecord[],
};

export const store = {
  patients: {
    list: async (tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.patient.findMany({ where: { tenantId } });
        }
        return prisma.patient.findMany();
      }
      
      if (tenantId) {
        return mockDataStore.patients.filter((p) => (p as any).tenantId === tenantId);
      }
      return mockDataStore.patients;
    },
    find: async (id: string, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.patient.findFirst({ where: { id, tenantId } });
        }
        return prisma.patient.findUnique({ where: { id } });
      }
      
      const patient = mockDataStore.patients.find((p) => p.id === id);
      if (!patient) return null;
      if (tenantId && (patient as any).tenantId !== tenantId) return null;
      return patient;
    },
    create: async (data: Partial<PatientRecord>) => {
      if (prisma) return prisma.patient.create({ data: data as any });
      const newPatient = { id: Date.now().toString(), ...data } as PatientRecord;
      mockDataStore.patients.push(newPatient);
      return newPatient;
    },
    update: async (id: string, data: Partial<PatientRecord>, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.patient.update({ where: { id, tenantId }, data: data as any });
        }
        return prisma.patient.update({ where: { id }, data: data as any });
      }
      const idx = mockDataStore.patients.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      if (tenantId && (mockDataStore.patients[idx] as any).tenantId !== tenantId) return null;
      mockDataStore.patients[idx] = { ...mockDataStore.patients[idx], ...data };
      return mockDataStore.patients[idx];
    },
    delete: async (id: string, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.patient.delete({ where: { id, tenantId } });
        }
        return prisma.patient.delete({ where: { id } });
      }
      const idx = mockDataStore.patients.findIndex((p) => p.id === id);
      if (idx === -1) return { id };
      if (tenantId && (mockDataStore.patients[idx] as any).tenantId !== tenantId) return { id };
      mockDataStore.patients = mockDataStore.patients.filter((p) => p.id !== id);
      return { id };
    },
  },
  leads: {
    list: async (tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.lead.findMany({ where: { tenantId } });
        }
        return prisma.lead.findMany();
      }
      
      if (tenantId) {
        return mockDataStore.leads.filter((l) => (l as any).tenantId === tenantId);
      }
      return mockDataStore.leads;
    },
    find: async (id: string, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.lead.findFirst({ where: { id, tenantId } });
        }
        return prisma.lead.findUnique({ where: { id } });
      }
      
      const lead = mockDataStore.leads.find((l) => l.id === id);
      if (!lead) return null;
      if (tenantId && (lead as any).tenantId !== tenantId) return null;
      return lead;
    },
    create: async (data: Partial<LeadRecord>) => {
      if (prisma) return prisma.lead.create({ data: data as any });
      const newLead = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data } as LeadRecord;
      mockDataStore.leads.unshift(newLead);
      return newLead;
    },
    update: async (id: string, data: Partial<LeadRecord>, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.lead.update({ where: { id, tenantId }, data: data as any });
        }
        return prisma.lead.update({ where: { id }, data: data as any });
      }
      const idx = mockDataStore.leads.findIndex((l) => l.id === id);
      if (idx === -1) return null;
      if (tenantId && (mockDataStore.leads[idx] as any).tenantId !== tenantId) return null;
      mockDataStore.leads[idx] = { ...mockDataStore.leads[idx], ...data };
      return mockDataStore.leads[idx];
    },
    delete: async (id: string, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.lead.delete({ where: { id, tenantId } });
        }
        return prisma.lead.delete({ where: { id } });
      }
      const idx = mockDataStore.leads.findIndex((l) => l.id === id);
      if (idx === -1) return { id };
      if (tenantId && (mockDataStore.leads[idx] as any).tenantId !== tenantId) return { id };
      mockDataStore.leads = mockDataStore.leads.filter((l) => l.id !== id);
      return { id };
    },
  },
  partners: {
    list: async (tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.partner.findMany({ where: { tenantId } });
        }
        return prisma.partner.findMany();
      }
      
      if (tenantId) {
        return mockDataStore.partners.filter((p) => (p as any).tenantId === tenantId);
      }
      return mockDataStore.partners;
    },
    find: async (id: string, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.partner.findFirst({ where: { id, tenantId } });
        }
        return prisma.partner.findUnique({ where: { id } });
      }
      
      const partner = mockDataStore.partners.find((p) => p.id === id);
      if (!partner) return null;
      if (tenantId && (partner as any).tenantId !== tenantId) return null;
      return partner;
    },
    create: async (data: Partial<PartnerRecord>) => {
      if (prisma) return prisma.partner.create({ data: data as any });
      const newPartner = { id: Date.now().toString(), ...data } as PartnerRecord;
      mockDataStore.partners.push(newPartner);
      return newPartner;
    },
    update: async (id: string, data: Partial<PartnerRecord>, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.partner.update({ where: { id, tenantId }, data: data as any });
        }
        return prisma.partner.update({ where: { id }, data: data as any });
      }
      const idx = mockDataStore.partners.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      if (tenantId && (mockDataStore.partners[idx] as any).tenantId !== tenantId) return null;
      mockDataStore.partners[idx] = { ...mockDataStore.partners[idx], ...data };
      return mockDataStore.partners[idx];
    },
    delete: async (id: string, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.partner.delete({ where: { id, tenantId } });
        }
        return prisma.partner.delete({ where: { id } });
      }
      const idx = mockDataStore.partners.findIndex((p) => p.id === id);
      if (idx === -1) return { id };
      if (tenantId && (mockDataStore.partners[idx] as any).tenantId !== tenantId) return { id };
      mockDataStore.partners = mockDataStore.partners.filter((p) => p.id !== id);
      return { id };
    },
  },
  tasks: {
    list: async (tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.task.findMany({ where: { tenantId } });
        }
        return prisma.task.findMany();
      }
      
      if (tenantId) {
        return mockDataStore.tasks.filter((t) => (t as any).tenantId === tenantId);
      }
      return mockDataStore.tasks;
    },
    find: async (id: string, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.task.findFirst({ where: { id, tenantId } });
        }
        return prisma.task.findUnique({ where: { id } });
      }
      
      const task = mockDataStore.tasks.find((t) => t.id === id);
      if (!task) return null;
      if (tenantId && (task as any).tenantId !== tenantId) return null;
      return task;
    },
    create: async (data: Partial<TaskRecord>) => {
      if (prisma) return prisma.task.create({ data: data as any });
      const newTask = { id: Date.now().toString(), ...data } as TaskRecord;
      mockDataStore.tasks.push(newTask);
      return newTask;
    },
    update: async (id: string, data: Partial<TaskRecord>, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.task.update({ where: { id, tenantId }, data: data as any });
        }
        return prisma.task.update({ where: { id }, data: data as any });
      }
      const idx = mockDataStore.tasks.findIndex((t) => t.id === id);
      if (idx === -1) return null;
      if (tenantId && (mockDataStore.tasks[idx] as any).tenantId !== tenantId) return null;
      mockDataStore.tasks[idx] = { ...mockDataStore.tasks[idx], ...data };
      return mockDataStore.tasks[idx];
    },
    delete: async (id: string, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.task.delete({ where: { id, tenantId } });
        }
        return prisma.task.delete({ where: { id } });
      }
      const idx = mockDataStore.tasks.findIndex((t) => t.id === id);
      if (idx === -1) return { id };
      if (tenantId && (mockDataStore.tasks[idx] as any).tenantId !== tenantId) return { id };
      mockDataStore.tasks = mockDataStore.tasks.filter((t) => t.id !== id);
      return { id };
    },
  },
  users: {
    list: async (tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.user.findMany({ where: { tenantId } });
        }
        return prisma.user.findMany();
      }
      
      if (tenantId) {
        return mockDataStore.users.filter((u) => (u as any).tenantId === tenantId);
      }
      return mockDataStore.users;
    },
    find: async (id: string, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.user.findFirst({ where: { id, tenantId } });
        }
        return prisma.user.findUnique({ where: { id } });
      }
      
      const user = mockDataStore.users.find((u) => u.id === id);
      if (!user) return null;
      if (tenantId && (user as any).tenantId !== tenantId) return null;
      return user;
    },
    findByEmail: async (email: string, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.user.findFirst({ where: { email, tenantId } });
        }
        return prisma.user.findFirst({ where: { email } });
      }
      
      const user = mockDataStore.users.find((u) => u.email === email);
      if (!user) return null;
      if (tenantId && (user as any).tenantId !== tenantId) return null;
      return user;
    },
    create: async (data: any) => {
      if (prisma) return prisma.user.create({ data });
      const newUser = { id: Date.now().toString(), ...data } as UserRecord;
      mockDataStore.users.push(newUser);
      return newUser;
    },
    update: async (id: string, data: any, tenantId?: string) => {
      if (prisma) {
        if (tenantId) {
          return prisma.user.update({ where: { id, tenantId }, data });
        }
        return prisma.user.update({ where: { id }, data });
      }
      const idx = mockDataStore.users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      if (tenantId && (mockDataStore.users[idx] as any).tenantId !== tenantId) return null;
      mockDataStore.users[idx] = { ...mockDataStore.users[idx], ...data };
      return mockDataStore.users[idx];
    },
  },
  invoices: {
    list: async (tenantId?: string) => {
      if (prisma) {
        const where: any = {};
        if (tenantId) where.tenantId = tenantId;
        return prisma.invoice.findMany({
          where,
          include: { patient: true, lineItems: true, payments: true },
          orderBy: { createdAt: "desc" },
        });
      }
      return [];
    },
    find: async (id: string, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.invoice.findFirst({
          where,
          include: { patient: true, lineItems: true, payments: true },
        });
      }
      return null;
    },
    create: async (data: any) => {
      if (prisma) {
        const { lineItems, ...invoiceData } = data;
        return prisma.invoice.create({
          data: {
            ...invoiceData,
            lineItems: lineItems ? { create: lineItems } : undefined,
          },
          include: { lineItems: true, payments: true },
        });
      }
      return { id: Date.now().toString(), ...data };
    },
    update: async (id: string, data: any, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.invoice.update({ where, data, include: { lineItems: true, payments: true } });
      }
      return null;
    },
    delete: async (id: string, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.invoice.delete({ where });
      }
      return { id };
    },
    generateNumber: async (tenantId: string) => {
      const year = new Date().getFullYear();
      if (prisma) {
        const count = await prisma.invoice.count({ where: { tenantId } });
        return `INV-${year}-${String(count + 1).padStart(4, "0")}`;
      }
      return `INV-${year}-0001`;
    },
  },
  quotes: {
    list: async (tenantId?: string) => {
      if (prisma) {
        const where: any = {};
        if (tenantId) where.tenantId = tenantId;
        return prisma.quote.findMany({
          where,
          include: { patient: true, lineItems: true },
          orderBy: { createdAt: "desc" },
        });
      }
      return [];
    },
    find: async (id: string, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.quote.findFirst({
          where,
          include: { patient: true, lineItems: true },
        });
      }
      return null;
    },
    create: async (data: any) => {
      if (prisma) {
        const { lineItems, ...quoteData } = data;
        return prisma.quote.create({
          data: {
            ...quoteData,
            lineItems: lineItems ? { create: lineItems } : undefined,
          },
          include: { lineItems: true },
        });
      }
      return { id: Date.now().toString(), ...data };
    },
    update: async (id: string, data: any, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.quote.update({ where, data, include: { lineItems: true } });
      }
      return null;
    },
    delete: async (id: string, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.quote.delete({ where });
      }
      return { id };
    },
    generateNumber: async (tenantId: string) => {
      const year = new Date().getFullYear();
      if (prisma) {
        const count = await prisma.quote.count({ where: { tenantId } });
        return `QUO-${year}-${String(count + 1).padStart(4, "0")}`;
      }
      return `QUO-${year}-0001`;
    },
  },
  messages: {
    list: async (tenantId?: string, patientId?: string) => {
      if (prisma) {
        const where: any = {};
        if (tenantId) where.tenantId = tenantId;
        if (patientId) where.patientId = patientId;
        return prisma.message.findMany({
          where,
          orderBy: { createdAt: "desc" },
        });
      }
      return [];
    },
    find: async (id: string, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.message.findFirst({ where });
      }
      return null;
    },
    create: async (data: any) => {
      if (prisma) return prisma.message.create({ data });
      return { id: Date.now().toString(), ...data };
    },
    update: async (id: string, data: any, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.message.update({ where, data });
      }
      return null;
    },
    getThreads: async (tenantId?: string) => {
      if (prisma) {
        const where: any = {};
        if (tenantId) where.tenantId = tenantId;
        return prisma.message.groupBy({
          by: ["threadId"],
          where,
          _count: true,
          orderBy: { threadId: "asc" },
        });
      }
      return [];
    },
  },
  payments: {
    list: async (tenantId?: string, invoiceId?: string) => {
      if (prisma) {
        const where: any = {};
        if (tenantId) where.tenantId = tenantId;
        if (invoiceId) where.invoiceId = invoiceId;
        return prisma.payment.findMany({ where, orderBy: { receivedAt: "desc" } });
      }
      return [];
    },
    create: async (data: any) => {
      if (prisma) return prisma.payment.create({ data });
      return { id: Date.now().toString(), ...data };
    },
  },
  blogPosts: {
    list: async (tenantId?: string) => {
      if (prisma) {
        const where: any = {};
        if (tenantId) where.tenantId = tenantId;
        return prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" } });
      }
      if (tenantId) {
        return mockDataStore.blogPosts.filter((p) => (p as any).tenantId === tenantId);
      }
      return mockDataStore.blogPosts;
    },
    find: async (id: string, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.blogPost.findFirst({ where });
      }
      const post = mockDataStore.blogPosts.find((p) => p.id === id);
      if (!post) return null;
      if (tenantId && (post as any).tenantId !== tenantId) return null;
      return post;
    },
    findBySlug: async (slug: string, tenantId?: string) => {
      if (prisma) {
        const where: any = { slug };
        if (tenantId) where.tenantId = tenantId;
        return prisma.blogPost.findFirst({ where });
      }
      const post = mockDataStore.blogPosts.find((p) => (p as any).slug === slug);
      if (!post) return null;
      if (tenantId && (post as any).tenantId !== tenantId) return null;
      return post;
    },
    create: async (data: Partial<BlogPostRecord>) => {
      if (prisma) return prisma.blogPost.create({ data: data as any });
      const newPost = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data } as BlogPostRecord;
      mockDataStore.blogPosts.unshift(newPost);
      return newPost;
    },
    update: async (id: string, data: Partial<BlogPostRecord>, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.blogPost.update({ where, data: data as any });
      }
      const idx = mockDataStore.blogPosts.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      if (tenantId && (mockDataStore.blogPosts[idx] as any).tenantId !== tenantId) return null;
      mockDataStore.blogPosts[idx] = { ...mockDataStore.blogPosts[idx], ...data };
      return mockDataStore.blogPosts[idx];
    },
    delete: async (id: string, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.blogPost.delete({ where });
      }
      const idx = mockDataStore.blogPosts.findIndex((p) => p.id === id);
      if (idx === -1) return { id };
      if (tenantId && (mockDataStore.blogPosts[idx] as any).tenantId !== tenantId) return { id };
      mockDataStore.blogPosts = mockDataStore.blogPosts.filter((p) => p.id !== id);
      return { id };
    },
  },
  documents: {
    list: async (tenantId?: string, patientId?: string) => {
      if (prisma) {
        const where: any = {};
        if (tenantId) where.tenantId = tenantId;
        if (patientId) where.patientId = patientId;
        return prisma.document.findMany({ where, orderBy: { createdAt: "desc" } });
      }
      return [];
    },
    find: async (id: string, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.document.findFirst({ where });
      }
      return null;
    },
    create: async (data: any) => {
      if (prisma) return prisma.document.create({ data });
      return { id: Date.now().toString(), ...data };
    },
    delete: async (id: string, tenantId?: string) => {
      if (prisma) {
        const where: any = { id };
        if (tenantId) where.tenantId = tenantId;
        return prisma.document.delete({ where });
      }
      return { id };
    },
  },
};
