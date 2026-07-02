# MERN Migration Plan

A complete reference for migrating Heal India Medi Tourism from the current Next.js full-stack architecture to a true MERN stack (MongoDB + Express + React + Node).

> **Status:** Educational reference. The current production stack is **Next.js + PostgreSQL + Prisma + Supabase** (recommended and currently live at https://santos-care.vercel.app). This document is a guide for anyone who wants to study MERN, migrate later, or compare architectures.

---

## 1. Overview & Decision Framework

### What is MERN?

| Letter | Tech | Role |
|--------|------|------|
| **M** | MongoDB | NoSQL document database |
| **E** | Express | Node.js backend framework |
| **R** | React | Frontend SPA library |
| **N** | Node.js | JavaScript runtime |

### Current Stack vs MERN

| Layer | Current (Next.js Full-Stack) | MERN Equivalent |
|---|---|---|
| Frontend | Next.js + React (integrated) | **React** (standalone SPA via Vite) |
| Backend | Next.js API Routes (serverless) | **Express** (separate Node server) |
| Database | PostgreSQL via Supabase | **MongoDB** (via Atlas) |
| ORM/ODM | Prisma | **Mongoose** |
| Hosting | Vercel (both apps) | Vercel (frontend) + Render/Railway (backend) |

### When to migrate to MERN

✅ **Migrate if:**
- MERN is a learning goal (class, tutorial, portfolio)
- Team has more Express/MongoDB expertise than Next.js/Postgres
- Data is non-relational (flexible schema preferred)
- Need a fully separate API that other clients can consume

❌ **Don't migrate if:**
- Data is highly relational (patients → tasks → notes → documents — **your case**)
- Time-to-market matters (2-3 weeks vs 30 min for current setup)
- SEO matters for the frontend (React SPA = worse SEO than Next.js)
- You have production data in PostgreSQL (costly migration)

### Time & Cost

| Phase | Duration | Free Tier? |
|---|---|---|
| Backend (Express + Mongoose) | 1 week | Yes (Render free, MongoDB Atlas M0) |
| Frontend (React SPA) | 1 week | Yes (Vercel/Netlify free) |
| Deployment & migration | 2-3 days | — |
| **Total** | **2-3 weeks** | **$0** |

**Caveat:** Render free tier sleeps after 15 min of inactivity (slow first request). For production, use Render's $7/mo paid tier or switch to Railway.

---

## 2. Architecture Diagrams

### Current (Next.js full-stack)

```
┌──────────────────────────────────────────┐
│ Browser                                   │
│   ↓                                       │
│ Vercel (santos-care.vercel.app)          │
│   ├── Next.js (React UI)                  │
│   ├── API Routes (serverless)             │
│   └── Prisma → Supabase PostgreSQL         │
└──────────────────────────────────────────┘
```

### Target (MERN)

```
┌──────────────────────────────────────────┐
│ Browser                                   │
│   ↓                                       │
│ Vercel (santos-care-ops.vercel.app)     │
│   └── React SPA (Vite)                    │
│         ↓ fetch('/api/...')               │
│ Render (santos-care-api.onrender.com)    │
│   └── Express + Mongoose                  │
│         ↓                                │
│ MongoDB Atlas (cluster0.mongodb.net)    │
└──────────────────────────────────────────┘
```

### Data Flow Comparison

**Current (Next.js):**
```
React component → fetch('/api/patients')
                → Next.js API route (serverless function)
                → Prisma query
                → Supabase PostgreSQL
                → JSON response
```

**Target (MERN):**
```
React component → fetch('https://api.example.com/patients')
                → Express router
                → Mongoose query
                → MongoDB Atlas
                → JSON response
```

---

## 3. Database Schema Conversion (11 models)

The current Prisma schema has 11 entities. Here's the Prisma → Mongoose conversion for each.

### 3.1 User

**Prisma (current):**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  phone         String?
  role          Role      @default(COORDINATOR)
  avatar        String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  assignedPatients   Patient[]  @relation("AssignedCoordinator")
  createdTasks       Task[]     @relation("TaskCreator")
  assignedTasks      Task[]     @relation("TaskAssignee")
  uploadedDocuments  Document[] @relation("DocumentUploader")
  patientNotes       Note[]     @relation("NoteCreator")
  communications     Communication[]

  @@map("users")
}

enum Role {
  ADMIN
  MANAGER
  COORDINATOR
  MARKETING
  STAKEHOLDER
}
```

**Mongoose (target):**
```javascript
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    phone: { type: String, default: null },
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "COORDINATOR", "MARKETING", "STAKEHOLDER"],
      default: "COORDINATOR",
    },
    avatar: { type: String, default: null },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

export default mongoose.model("User", userSchema);
```

**Key differences:**
- Prisma uses `cuid()` strings; Mongoose uses `ObjectId` by default
- Mongoose has `select: false` to hide sensitive fields
- Mongoose's `pre("save")` hook replaces Prisma's lack of password hashing
- Timestamps via `{ timestamps: true }` option

### 3.2 Patient (most complex)

**Prisma:**
```prisma
model Patient {
  id                 String         @id @default(cuid())
  referenceNumber    String         @unique
  name               String
  country            String
  phone              String
  email              String
  whatsapp           String?
  treatmentType      String
  treatmentDescription String?
  preferredHospital  String?

  stage              PipelineStage  @default(INQUIRY_RECEIVED)
  stageHistory       StageChange[]
  assignedCoordinatorId String?
  assignedCoordinator   User?        @relation("AssignedCoordinator", fields: [assignedCoordinatorId], references: [id])

  estimatedCost      Float?
  depositReceived    Boolean        @default(false)
  depositAmount      Float?
  finalCost          Float?

  inquiryDate        DateTime       @default(now())
  expectedTravelDate DateTime?
  actualTravelDate   DateTime?
  dischargeDate      DateTime?

  documents          Document[]
  medicalReports     Document[]     @relation("MedicalReports")
  communications     Communication[]
  notes              Note[]
  followUpSchedule   DateTime[]
  telemedicineCompleted Boolean[]   @default([])

  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt

  tasks              Task[]

  @@map("patients")
}

enum PipelineStage {
  INQUIRY_RECEIVED
  QUALIFICATION
  TREATMENT_PLAN_SENT
  CONFIRMATION
  VISA_TRAVEL
  ARRIVED_ADMITTED
  IN_TREATMENT
  AYURVEDA_RECOVERY
  COMPLETED_FOLLOWUP
  CLOSED
}
```

**Mongoose:**
```javascript
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    referenceNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    whatsapp: { type: String, default: null },
    treatmentType: { type: String, required: true },
    treatmentDescription: { type: String, default: null },
    preferredHospital: { type: String, default: null },

    stage: {
      type: String,
      enum: [
        "INQUIRY_RECEIVED", "QUALIFICATION", "TREATMENT_PLAN_SENT",
        "CONFIRMATION", "VISA_TRAVEL", "ARRIVED_ADMITTED",
        "IN_TREATMENT", "AYURVEDA_RECOVERY", "COMPLETED_FOLLOWUP", "CLOSED",
      ],
      default: "INQUIRY_RECEIVED",
    },
    stageHistory: [
      {
        fromStage: String,
        toStage: String,
        changedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],

    assignedCoordinator: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    estimatedCost: { type: Number, default: null },
    depositReceived: { type: Boolean, default: false },
    depositAmount: { type: Number, default: null },
    finalCost: { type: Number, default: null },

    inquiryDate: { type: Date, default: Date.now },
    expectedTravelDate: { type: Date, default: null },
    actualTravelDate: { type: Date, default: null },
    dischargeDate: { type: Date, default: null },

    followUpSchedule: [{ type: Date }],
    telemedicineCompleted: [{ type: Date }],
  },
  { timestamps: true }
);

patientSchema.index({ stage: 1, assignedCoordinator: 1 });
patientSchema.index({ country: 1 });
patientSchema.index({ inquiryDate: -1 });

export default mongoose.model("Patient", patientSchema);
```

**Key decision:** `StageChange` is a separate model in Prisma, but **embedded as `stageHistory` array** in Mongoose. This is a common Mongoose pattern — use embedded docs for 1-to-many data that's always read with the parent.

### 3.3 Task

**Prisma:**
```prisma
model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  type        TaskType   @default(GENERAL)

  patientId   String?
  patient     Patient?   @relation(fields: [patientId], references: [id], onDelete: Cascade)

  assignedToId  String
  assignedTo    User      @relation("TaskAssignee", fields: [assignedToId], references: [id])

  createdById   String
  createdBy      User      @relation("TaskCreator", fields: [createdById], references: [id])

  status      TaskStatus @default(PENDING)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime

  completedAt DateTime?
  recurring   RecurringType?

  dependsOn   String[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("tasks")
}
```

**Mongoose:**
```javascript
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: null },
    type: { type: String, enum: ["PATIENT", "GENERAL", "MARKETING", "PARTNER"], default: "GENERAL" },

    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: { type: String, enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"], default: "PENDING" },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "URGENT"], default: "MEDIUM" },
    dueDate: { type: Date, required: true },

    completedAt: { type: Date, default: null },
    recurring: { type: String, enum: ["DAILY", "WEEKLY", "MONTHLY", null], default: null },

    dependsOn: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueDate: 1 });

export default mongoose.model("Task", taskSchema);
```

### 3.4 Lead

**Prisma:**
```prisma
model Lead {
  id           String   @id @default(cuid())
  source       LeadSource
  campaign     String?

  name         String
  country      String?
  email        String?
  phone        String?

  status       LeadStatus @default(NEW)

  treatmentInterest String?
  budgetRange       String?

  convertedToPatientId String?
  conversionDate       DateTime?

  utmSource   String?
  utmMedium   String?
  utmCampaign String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("leads")
}

enum LeadSource { WHATSAPP WEBSITE FACEBOOK GOOGLE_ADS REFERRAL PARTNER_HOSPITAL EXHIBITION OTHER }
enum LeadStatus { NEW CONTACTED QUALIFIED CONVERTED LOST }
```

**Mongoose:**
```javascript
const leadSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["WHATSAPP", "WEBSITE", "FACEBOOK", "GOOGLE_ADS", "REFERRAL", "PARTNER_HOSPITAL", "EXHIBITION", "OTHER"],
      required: true,
    },
    campaign: { type: String, default: null },

    name: { type: String, required: true },
    country: { type: String, default: null },
    email: { type: String, default: null, lowercase: true },
    phone: { type: String, default: null },

    status: { type: String, enum: ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"], default: "NEW" },

    treatmentInterest: { type: String, default: null },
    budgetRange: { type: String, default: null },

    convertedToPatient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
    conversionDate: { type: Date, default: null },

    utmSource: { type: String, default: null },
    utmMedium: { type: String, default: null },
    utmCampaign: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
```

### 3.5 Partner

**Prisma:**
```prisma
model Partner {
  id             String   @id @default(cuid())
  name           String
  category       PartnerCategory
  contactPerson  String?
  phone          String?
  email          String?
  address        String?

  agreementStatus AgreementStatus @default(NONE)
  agreementDate   DateTime?
  commissionRate  Float?

  totalPatientsReferred Int    @default(0)
  totalRevenue         Float   @default(0)
  responseTime         Int?
  satisfactionScore    Float?

  documents       Document[]
  notes           Note[]

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("partners")
}

enum PartnerCategory { HOSPITAL AYURVEDA LAB TRANSPORT NURSING EQUIPMENT }
enum AgreementStatus { NONE PENDING SIGNED EXPIRED }
```

**Mongoose:**
```javascript
const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["HOSPITAL", "AYURVEDA", "LAB", "TRANSPORT", "NURSING", "EQUIPMENT"], required: true },
    contactPerson: { type: String, default: null },
    phone: { type: String, default: null },
    email: { type: String, default: null, lowercase: true },
    address: { type: String, default: null },

    agreementStatus: { type: String, enum: ["NONE", "PENDING", "SIGNED", "EXPIRED"], default: "NONE" },
    agreementDate: { type: Date, default: null },
    commissionRate: { type: Number, default: null },

    totalPatientsReferred: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    responseTime: { type: Number, default: null },
    satisfactionScore: { type: Number, default: null },
  },
  { timestamps: true }
);

partnerSchema.index({ category: 1, agreementStatus: 1 });

export default mongoose.model("Partner", partnerSchema);
```

### 3.6 Document

**Prisma:**
```prisma
model Document {
  id         String   @id @default(cuid())
  title      String
  category   String
  filePath   String
  fileType   String?
  size       Int?

  patientId  String?
  patient    Patient? @relation(fields: [patientId], references: [id], onDelete: Cascade)
  medicalReports Patient[] @relation("MedicalReports")

  partnerId  String?
  partner    Partner? @relation(fields: [partnerId], references: [id], onDelete: Cascade)

  uploadedById String
  uploadedBy   User   @relation("DocumentUploader", fields: [uploadedById], references: [id])

  isPublic   Boolean @default(false)

  createdAt  DateTime @default(now())

  @@map("documents")
}
```

**Mongoose:**
```javascript
const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, default: null },
    size: { type: Number, default: null },

    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: "Partner", default: null },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    isPublic: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Document", documentSchema);
```

**Note:** The Prisma `medicalReports` is a many-to-many self-relation (Patient ↔ Document). In Mongoose, you can:
- Use a separate `MedicalReport` collection with `{ patientId, documentId }`
- Or add `medicalReports: [ObjectId]` array on Patient

### 3.7 Note (polymorphic)

**Prisma:**
```prisma
model Note {
  id         String   @id @default(cuid())
  content    String

  patientId  String?
  patient    Patient? @relation(fields: [patientId], references: [id], onDelete: Cascade)

  partnerId  String?
  partner    Partner? @relation(fields: [partnerId], references: [id], onDelete: Cascade)

  createdById String
  createdBy   User    @relation("NoteCreator", fields: [createdById], references: [id])

  createdAt  DateTime @default(now())

  @@map("notes")
}
```

**Mongoose:**
```javascript
const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: "Partner", default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

noteSchema.pre("validate", function (next) {
  if (!this.patient && !this.partner) {
    return next(new Error("Note must be linked to a patient or partner"));
  }
  next();
});

export default mongoose.model("Note", noteSchema);
```

### 3.8 Communication

**Prisma:**
```prisma
model Communication {
  id         String   @id @default(cuid())
  patientId  String
  patient    Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)

  type       CommType
  direction  CommDirection
  content    String

  createdById String
  createdBy   User    @relation(fields: [createdById], references: [id])

  createdAt  DateTime @default(now())

  @@map("communications")
}

enum CommType { WHATSAPP EMAIL CALL MESSAGE }
enum CommDirection { INBOUND OUTBOUND }
```

**Mongoose:**
```javascript
const communicationSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    type: { type: String, enum: ["WHATSAPP", "EMAIL", "CALL", "MESSAGE"], required: true },
    direction: { type: String, enum: ["INBOUND", "OUTBOUND"], required: true },
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

communicationSchema.index({ patient: 1, createdAt: -1 });

export default mongoose.model("Communication", communicationSchema);
```

### 3.9 RoadmapItem

**Prisma:**
```prisma
model RoadmapItem {
  id          String   @id @default(cuid())
  phase       Int
  title       String
  description String?
  milestone   String
  status      RoadmapStatus @default(PENDING)
  completedAt DateTime?
  dueDate     DateTime
  order       Int

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("roadmap_items")
}

enum RoadmapStatus { PENDING IN_PROGRESS COMPLETED DELAYED }
```

**Mongoose:**
```javascript
const roadmapItemSchema = new mongoose.Schema(
  {
    phase: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    milestone: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "DELAYED"], default: "PENDING" },
    completedAt: { type: Date, default: null },
    dueDate: { type: Date, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

roadmapItemSchema.index({ phase: 1, order: 1 });

export default mongoose.model("RoadmapItem", roadmapItemSchema);
```

### 3.10 AnalyticsEvent

**Prisma:**
```prisma
model AnalyticsEvent {
  id         String   @id @default(cuid())
  eventType  String
  eventData  Json
  userId     String?
  patientId  String?
  createdAt  DateTime @default(now())

  @@map("analytics_events")
}
```

**Mongoose:**
```javascript
const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true, index: true },
    eventData: { type: mongoose.Schema.Types.Mixed, default: {} },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

analyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export default mongoose.model("AnalyticsEvent", analyticsEventSchema);
```

**Note:** Use `Mixed` type for `eventData` (free-form JSON). TTL index is a MongoDB-specific feature — auto-delete old events.

### 3.11 Connection between models (was StageChange)

**Prisma (separate model):**
```prisma
model StageChange {
  id         String   @id @default(cuid())
  patientId  String
  patient    Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  fromStage  PipelineStage?
  toStage    PipelineStage
  changedAt  DateTime @default(now())
  note       String?
}
```

**Mongoose (embedded — see Patient model above):** Already shown in 3.2. The `stageHistory` array on Patient replaces this.

**Alternative (if you need a separate collection):**
```javascript
const stageChangeSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    fromStage: { type: String, default: null },
    toStage: { type: String, required: true },
    note: { type: String, default: null },
  },
  { timestamps: { createdAt: "changedAt", updatedAt: false } }
);

export default mongoose.model("StageChange", stageChangeSchema);
```

---

## 4. Express Router Patterns

The current Next.js API has 14 routes. Here are the equivalent Express routers.

### 4.1 Server entry point

**Current (Next.js — `src/app/api/patients/route.ts`):**
```typescript
import { NextResponse } from "next/server";
import { store } from "@/lib/db";

export async function GET(request: Request) {
  const patients = await store.patients.list();
  return NextResponse.json({ patients });
}

export async function POST(request: Request) {
  const body = await request.json();
  const created = await store.patients.create(body);
  return NextResponse.json({ patient: created }, { status: 201 });
}
```

**Target (Express — `backend/src/server.js`):**
```javascript
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import leadRoutes from "./routes/leads.js";
import partnerRoutes from "./routes/partners.js";
import taskRoutes from "./routes/tasks.js";
import documentRoutes from "./routes/documents.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({
  origin: [
    "https://santos-care-web.vercel.app",
    "https://santos-care-ops.vercel.app",
    "http://localhost:5173",
  ],
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
```

### 4.2 Patients router (CRUD)

**`backend/src/routes/patients.js`:**
```javascript
import express from "express";
import Patient from "../models/Patient.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/patients?stage=...&country=...&search=...
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { stage, country, coordinatorId, search } = req.query;
    const filter = {};
    if (stage) filter.stage = stage;
    if (country) filter.country = country;
    if (coordinatorId) filter.assignedCoordinator = coordinatorId;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { referenceNumber: { $regex: search, $options: "i" } },
      ];
    }
    const patients = await Patient.find(filter).sort({ inquiryDate: -1 });
    res.json({ patients, total: patients.length });
  } catch (err) { next(err); }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("assignedCoordinator", "name email");
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json({ patient });
  } catch (err) { next(err); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const refNumber = `HIMT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    const patient = new Patient({ ...req.body, referenceNumber: refNumber });
    await patient.save();
    res.status(201).json({ patient });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json({ patient });
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
```

### 4.3 Auth middleware

**`backend/src/middleware/auth.js`:**
```javascript
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Insufficient permissions" });
  }
  next();
};
```

### 4.4 Auth routes

**`backend/src/routes/auth.js`:**
```javascript
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
```

### 4.5 Public lead capture (no auth)

**`backend/src/routes/leads.js`:**
```javascript
import express from "express";
import Lead from "../models/Lead.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/capture", async (req, res) => {
  try {
    const lead = new Lead({ ...req.body, source: req.body.source || "WEBSITE" });
    await lead.save();
    res.status(201).json({ success: true, lead: { id: lead._id, name: lead.name } });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});

router.get("/", requireAuth, async (req, res, next) => {
  // ... same as patients but for leads
});

export default router;
```

---

## 5. React SPA Conversion

### 5.1 Project setup with Vite

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install react-router-dom @tanstack/react-query axios tailwindcss
```

### 5.2 Routing

**Current (Next.js — file-based):**
```
src/app/(dashboard)/
├── layout.tsx
├── page.tsx              → /
├── patients/page.tsx     → /patients
├── tasks/page.tsx        → /tasks
├── partners/page.tsx     → /partners
└── ...
```

**Target (React Router):**
```tsx
// src/main.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Tasks from "./pages/Tasks";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### 5.3 Auth context (replaces Next.js cookie auth)

**`frontend/src/auth/AuthContext.tsx`:**
```tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../api/client";

interface User { id: string; email: string; name: string; role: string; }
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/auth/me").then((res) => setUser(res.data.user)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

### 5.4 Data fetching (replaces Server Components)

**Current (Next.js — Server Component):**
```tsx
async function getPatients() {
  const res = await fetch("/api/patients", { headers: { authorization: "..." } });
  return res.json();
}

export default async function PatientsPage() {
  const { patients } = await getPatients();
  return <div>{patients.map(p => <div key={p.id}>{p.name}</div>)}</div>;
}
```

**Target (React + TanStack Query):**
```tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export default function Patients() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["patients"],
    queryFn: () => api.get("/patients").then(r => r.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading patients</div>;

  return (
    <div>
      {data.patients.map((p: any) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

### 5.5 API client

**`frontend/src/api/client.ts`:**
```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
```

### 5.6 Reusing the 14 UI components

The 14 Radix-based UI components in `santocare-ops/src/components/ui/` work identically in React. Copy them to `frontend/src/components/ui/`:

```bash
cp -r santocare-ops/src/components/ui/ frontend/src/components/ui/
```

Components: `Avatar`, `Badge`, `Button`, `Card`, `Dialog`, `Input`, `Label`, `Progress`, `Select`, `Skeleton`, `Table`, `Tabs`, `Textarea`, `DropdownMenu`.

---

## 6. Deployment Playbook

### 6.1 MongoDB Atlas setup

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Add a database user
4. Whitelist IP: `0.0.0.0/0` (or specific IPs)
5. Get connection string: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/santos-care`

### 6.2 Backend deployment (Render)

**`backend/Dockerfile`:** (optional, for faster cold starts)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["node", "src/server.js"]
```

**Or use Render's auto-detect:**
1. Go to https://render.com
2. New Web Service → connect GitHub repo
3. Root directory: `backend`
4. Build: `npm install`
5. Start: `node src/server.js`
6. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS`
7. Free tier sleeps after 15 min — upgrade to $7/mo for production

### 6.3 Frontend deployment (Vercel)

```bash
cd frontend
vercel --prod
```

Set env: `VITE_API_URL=https://santos-care-api.onrender.com`

### 6.4 Environment variables summary

**Backend (.env):**
```
PORT=4000
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/santos-care
JWT_SECRET=<openssl rand -base64 32>
CORS_ORIGINS=https://santos-care-web.vercel.app,https://santos-care-ops.vercel.app
```

**Frontend (.env):**
```
VITE_API_URL=https://santos-care-api.onrender.com
```

---

## 7. Migration Phases (2-3 weeks)

### Phase 1: Backend foundation (Day 1-2)
- Initialize `backend/` with Express + Mongoose
- Set up MongoDB Atlas cluster
- Create connection helper
- Add auth middleware
- Add error handler
- Add CORS

### Phase 2: Models (Day 3-4)
- Convert all 11 Prisma models to Mongoose
- Add indexes
- Add timestamps
- Add virtuals (e.g., `id` from `_id`)

### Phase 3: Routes (Day 5-7)
- Auth routes (login, me)
- Patients routes (CRUD)
- Leads routes (CRUD + public capture)
- Partners routes (CRUD)
- Tasks routes (CRUD)
- Documents routes (CRUD)
- Analytics routes
- Seed script

### Phase 4: Backend deployment (Day 8)
- Push to GitHub
- Deploy to Render
- Test all endpoints
- Verify CORS

### Phase 5: Frontend setup (Day 9-10)
- Initialize Vite + React + TypeScript
- Set up Tailwind
- Set up React Router
- Set up TanStack Query
- Copy 14 UI components
- Create auth context

### Phase 6: Frontend pages (Day 11-14)
- Login page
- Layout (sidebar, header)
- Dashboard
- Patients (list + detail)
- Tasks
- Partners
- Leads
- Documents
- Marketing
- Analytics
- Roadmap
- Settings

### Phase 7: Frontend deployment (Day 15)
- Configure env vars
- Deploy to Vercel
- Test all routes
- Test lead capture flow end-to-end

### Phase 8: Data migration (Day 16)
- Export from PostgreSQL
- Transform to MongoDB format
- Import via seed script
- Verify counts match

---

## 8. Pros & Cons Summary

### MERN Pros
- Industry-standard stack, lots of tutorials
- MongoDB flexible schema (good for evolving data)
- Standalone Express API (consumable by mobile apps, partners)
- Full JavaScript/TypeScript across the stack
- Easy to find developers

### MERN Cons
- 2-3 weeks of work vs 30 min for current setup
- Two deployment targets (more complexity)
- React SPA = worse SEO (only matters for public site, which stays Next.js)
- Render free tier sleeps (slow cold starts)
- MongoDB worse for highly relational data (your data IS relational)

### Current Stack (Recommended) Pros
- Single framework (Next.js does frontend + backend)
- Serverless = auto-scaling, no server management
- PostgreSQL = strong consistency, transactions, JOINs
- Built-in SEO via Next.js metadata
- Already deployed and working
- Free tier on Vercel + Supabase

### Current Stack Cons
- Not "MERN" (uses Postgres instead of MongoDB)
- Vercel serverless = cold starts (mitigated by edge caching)
- Vendor lock-in to Vercel + Supabase

---

## 9. Decision Cheat-Sheet

| Question | MERN | Current Stack |
|----------|------|---------------|
| Need a working backend today? | 2-3 weeks | 30 minutes |
| Is MERN a learning goal? | Use this guide | — |
| Is data highly relational? | MongoDB overhead | Postgres + Prisma |
| Need standalone API? | Express | Could expose Next.js API |
| Want best SEO? | React SPA | Next.js SSR |
| Prefer SQL? | — | PostgreSQL |
| Prefer NoSQL? | MongoDB | — |
| Tight team (1-3 people)? | More moving parts | Simpler |

---

## 10. Current Production Status (Reference)

The current production is **NOT MERN**. It's:

- **Frontend:** Next.js 14 (React + TypeScript) at https://santos-care-web.vercel.app
- **Backend:** Next.js API Routes at https://santos-care.vercel.app
- **Database:** PostgreSQL via Supabase (free tier)
- **Auth:** JWT in HTTP-only cookies (jose) + bcryptjs
- **ORM:** Prisma 5.18
- **Hosting:** Vercel (both apps)

**Status:** Live, connected to real Supabase database, accepting leads, persisting data across cold starts.

To migrate to MERN, follow phases 1-8 above. Estimated effort: **2-3 weeks**.

---

*Document version: 1.0 — July 2026*
*For: Heal India Medi Tourism*
