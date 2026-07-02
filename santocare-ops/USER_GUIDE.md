# User Guide

> End-user manual for SantoCare Operations Hub

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Home](#dashboard-home)
3. [Patient Pipeline](#patient-pipeline)
4. [Task Management](#task-management)
5. [Partner Network](#partner-network)
6. [Marketing Module](#marketing-module)
7. [Document Repository](#document-repository)
8. [Analytics](#analytics)
9. [90-Day Roadmap](#90-day-roadmap)
10. [Settings](#settings)
11. [Common Workflows](#common-workflows)

---

## Getting Started

### Accessing the Hub

1. Open your browser and navigate to `https://ops.santos.care` (or your configured URL)
2. Log in with your credentials
3. You'll land on the Dashboard home page

### Navigation

The left sidebar contains all main modules:
- **Dashboard** — Overview and KPIs
- **Patients** — Patient pipeline
- **Tasks** — Action items
- **Partners** — Partner network
- **Marketing** — Leads and campaigns
- **Documents** — SOPs and templates
- **Analytics** — Reports and insights
- **Roadmap** — 90-day implementation tracker
- **Settings** — System configuration

On mobile, tap the menu icon (top-left) to open the sidebar.

---

## Dashboard Home

The home page provides an at-a-glance view of your business:

### KPI Cards (Top Row)

| Card | What It Shows |
|------|---------------|
| **Total Patients** | All patients across all stages |
| **Active Patients** | Patients in active stages (Inquiry → Ayurveda) |
| **Monthly Revenue** | Current month's revenue |
| **Conversion Rate** | Inquiry → Patient conversion % |

Each card shows the trend (up/down arrow with percentage vs. last month).

### Revenue Chart

- Area chart showing monthly revenue
- Hover over data points for exact values
- Tooltip also shows patient count

### Treatment Categories

- Pie chart showing distribution by treatment type
- Color-coded legend at bottom
- Percentages displayed in legend

### Patient Pipeline

Switch between **Chart** (horizontal bars) and **Table** views to see patient count by stage.

### Recent Patients

Latest 5 patients with:
- Name and country
- Treatment type
- Current stage (color-coded badge)
- Estimated value

Click "View all" to see the full patient list.

### Tasks Due

Upcoming tasks with priority indicators:
- Red dot — High priority
- Amber dot — Medium priority

### Patients by Country

Bar chart showing patient count by country of origin.

---

## Patient Pipeline

### Pipeline Stages

```
1. INQUIRY          → Patient made initial contact
2. QUALIFICATION    → Reviewing medical reports
3. TREATMENT PLAN   → Plan delivered to patient
4. CONFIRMATION     → Patient confirmed, deposit received
5. VISA & TRAVEL    → Visa processing, flight bookings
6. ARRIVED          → Patient arrived in India, admitted
7. IN TREATMENT     → Surgery/procedure in progress
8. AYURVEDA         → Post-treatment recovery
9. FOLLOW-UP        → Returned home, follow-up care
10. CLOSED          → Case closed
```

### Views

**Kanban View** (Default)
- Each stage is a column
- Patients shown as cards
- Cards display: Name, country, reference #, treatment, value, coordinator
- Click any card to open patient details

**Table View**
- All patients in a sortable list
- Columns: Patient, Reference, Treatment, Stage, Coordinator, Cost, Date
- Click row to open patient details

### Adding a Patient

1. Click **"Add Patient"** button (top right)
2. Fill in the form:
   - **Name** (required)
   - **Email** (required)
   - **Phone** (required)
   - **Country** (required, dropdown)
   - **Treatment Type** (required, dropdown)
   - **Preferred Hospital** (optional)
   - **Estimated Cost** (USD)
   - **Coordinator** (assignment)
   - **Description** (treatment details)
3. Click **"Add Patient"** to save

A reference number (HIMT-YYYY-####) is auto-generated.

### Patient Details

Click any patient card to open the detail modal showing:
- Name, reference number, current stage badge
- Contact info (country, email, phone)
- Estimated cost
- Treatment information
- Stage history (timeline)
- Action buttons:
  - **Documents** — View uploaded files
  - **Log Communication** — Record a call, message, etc.
  - **Edit** — Modify patient details

### Filtering and Search

- **Search** by name, reference number, or country
- **Stage filter** to show only one stage
- **View toggle** between Kanban and Table

---

## Task Management

### Task Properties

| Field | Options |
|-------|---------|
| **Type** | Patient, Partner, Marketing, General |
| **Priority** | Low, Medium, High, Urgent |
| **Status** | Pending, In Progress, Completed |
| **Due Date** | Any date |
| **Assignee** | Any team member |
| **Patient** (optional) | Linked patient reference |

### Tabs

- **Active** — Pending + In Progress tasks
- **Completed** — Done tasks
- **All** — Every task

### Adding a Task

1. Click **"Add Task"** button
2. Fill in:
   - **Title** (required)
   - **Description**
   - **Type**, **Priority**, **Assignee**, **Due Date**
3. Click **"Add Task"**

### Marking Tasks Complete

Click the circle icon next to a task to mark it complete/incomplete. Completed tasks are struck through.

### Filters

Use the dropdown filters to view tasks by:
- **Status** (Pending, In Progress, Completed)
- **Priority** (Urgent, High, Medium, Low)
- **Type** (Patient, Partner, Marketing, General)

---

## Partner Network

### Partner Categories

| Category | Examples |
|----------|----------|
| **Hospital** | Aster Medcity, Amrita, Rajagiri |
| **Ayurveda** | Ayush Prana |
| **Lab** | Metropolis, Dr. Lal, Lancet |
| **Transport** | Car rental services |
| **Nursing** | In-home nursing agencies |
| **Equipment** | Medical equipment rental |

### Stats Cards

- **Total Partners** — All partners
- **Active MOUs** — Signed agreements
- **Patients Referred** — Total patients sent to partners
- **Partner Revenue** — Total revenue generated

### Partner Cards

Each card shows:
- Partner name
- Category badge
- Contact person and phone
- Agreement status (Signed/Pending/None/Expired)
- Commission rate
- Total patients referred
- Satisfaction score (1-5)

### Adding a Partner

1. Click **"Add Partner"**
2. Fill in: Name, Category, Contact Person, Phone, Email, Address, Agreement Status, Commission Rate
3. Save

---

## Marketing Module

### Tab 1: Leads

**Stats:**
- New leads this week
- Qualified leads
- Conversion rate
- Pipeline value (sum of qualified leads' estimated values)

**Lead Table:**

| Column | Description |
|--------|-------------|
| Name | Lead's full name |
| Country | Origin country |
| Source | WhatsApp, Website, Facebook, etc. |
| Treatment Interest | What they're interested in |
| Status | New, Contacted, Qualified, Converted, Lost |
| Date | Inquiry date |

**Status Workflow:**
```
New → Contacted → Qualified → Converted
                              ↘ Lost
```

### Tab 2: Campaigns

Each campaign card shows:
- Campaign name
- Status (Active/Paused/Completed)
- Platform (Facebook, Google, etc.)
- Budget vs. Spent (progress bar)
- Leads generated
- Cost per Lead (CPL)
- Date range

### Tab 3: Content Calendar

| Type | Blog, Social, Email |
|------|---------------------|
| Status | Draft, Scheduled, Published |

Use this to track your content marketing schedule.

---

## Document Repository

### Categories

| Category | Content |
|----------|---------|
| Operations Manual | Main SOPs |
| Email Templates | Hospital outreach, patient communication |
| WhatsApp Scripts | Pre-built WhatsApp messages |
| Hospital Partners | MOUs, agreements |
| Ayurveda | Ayush Prana partnership docs |
| Marketing | Campaign materials |
| Blog Content | SEO articles |
| Transportation | Partner network |
| Post-Treatment | Recovery resources |
| Medication/Equipment | Sourcing guides |

### Document Cards

Each shows:
- Title with file type icon (MD/PDF/DOCX)
- Category
- File size
- Upload date
- Preview / Download buttons

### Search and Filter

- **Search** by title (real-time)
- **Category tabs** to filter
- **Upload** button to add new docs

---

## Analytics

### Revenue Analytics

- **Monthly Revenue** — Line chart with 6 months actual + 6 months projected
- **Revenue by Treatment** — Horizontal bar chart
- **Revenue by Country** — Bar chart

### Pipeline Analytics

- **Funnel** — Patient flow through stages
- **Conversion Rate** — Per-stage conversion

### Performance

- **Coordinator Performance** — Table showing patients managed and revenue by coordinator
- **Lead Source Breakdown** — Donut chart

### Key Metrics (Top Cards)

- **Total Revenue YTD**
- **Average Revenue per Patient**
- **Overall Conversion Rate**
- **Patient Satisfaction** (1-5 stars)

---

## 90-Day Roadmap

### Overview

Track implementation progress across 4 phases:

1. **Foundation** (Weeks 1-4) — Partnerships, infrastructure
2. **Operations** (Weeks 5-8) — Workflow systems
3. **Marketing** (Weeks 9-12) — Campaigns and content
4. **Analytics** (Weeks 13+) — Reporting and optimization

### Phase Cards

Each phase shows:
- Phase name and timeline
- Description
- Progress percentage
- Status badge (Completed, In Progress, Pending, At Risk)
- Days remaining until deadline
- Expandable milestone list

### Milestone Status

- ✅ **Completed** — Green checkmark
- 🔄 **In Progress** — Blue dot
- ⏳ **Pending** — Empty circle
- ⚠️ **Delayed** — Red warning

Click the chevron to expand/collapse a phase's milestone details.

### Quick Stats

- Total milestones completed
- In progress
- Remaining
- Days until next phase

---

## Settings

### General Tab

- Organization name
- Contact email and WhatsApp
- Timezone
- Currency
- Target markets (chip-based)

### Users Tab

- View all team members
- See role, status, last active
- **Invite User** button to send invitations
- Edit / Delete user actions

### Pipeline Tab

- View and edit pipeline stages
- Manage treatment types
- Reorder stages as needed

### Integrations Tab

- **WhatsApp Business** — Connected/Not Connected status
- **Email Service** — Configure SMTP
- **Calendar Sync** — Google Calendar / Outlook

### Backup Tab

- Last backup date and time
- Manual backup button
- Auto-backup toggle
- Export data option

---

## Common Workflows

### Workflow 1: New Patient Inquiry

1. Patient contacts you via WhatsApp
2. Open **Patients** page
3. Click **"Add Patient"**
4. Fill in patient details
5. Assign a coordinator
6. Save
7. Patient now appears in the "Inquiry" column of the Kanban
8. Create follow-up tasks in **Tasks**

### Workflow 2: Moving Patient Through Pipeline

1. Open **Patients** → **Kanban** view
2. When patient completes a stage, move them to the next column
3. Update status notes
4. Create tasks for the next stage's activities

### Workflow 3: Tracking Hospital Referrals

1. Open **Partners** page
2. Filter by "Hospital" category
3. View patient counts and revenue per hospital
4. Use this data to optimize commission agreements

### Workflow 4: Monthly Reporting

1. Open **Analytics** page
2. Review revenue trends
3. Check conversion rates
4. Export to PDF (coming soon)
5. Share with stakeholders

### Workflow 5: Lead Follow-up

1. Open **Marketing** → **Leads** tab
2. Filter by status (e.g., "New" leads)
3. Click a lead to view details
4. Update status to "Contacted" after reaching out
5. Move to "Qualified" when treatment plan is sent
6. Convert to Patient when they confirm

---

## Tips & Best Practices

1. **Daily Routine**
   - Check Dashboard for new leads
   - Review tasks due today
   - Update patient stages
   - Log communications

2. **Weekly Review**
   - Check Analytics for trends
   - Review Roadmap progress
   - Update campaign status

3. **Best Practices**
   - Always log communications with patients
   - Keep patient contact info up to date
   - Use priority flags on tasks
   - Document everything in Notes

4. **Mobile Use**
   - The dashboard is mobile-responsive
   - Best for quick checks and updates
   - Use full desktop for data entry

---

**Need help?** Contact your system administrator or refer to the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for technical details.

**Last Updated:** June 29, 2026
