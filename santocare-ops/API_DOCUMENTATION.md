# API Documentation

> RESTful API reference for SantoCare Operations Hub

## Base URL

```
Local:    http://localhost:3000/api
Production: https://ops.santos.care/api
```

## Authentication

Currently, the API is open for local development. In production, all endpoints will require authentication via NextAuth.js session cookies.

```http
Cookie: next-auth.session-token=<token>
```

## Response Format

All responses are JSON. Successful responses return `{ data, ... }`. Errors return `{ error: string }` with appropriate HTTP status codes.

## Endpoints

### Patients API

#### `GET /api/patients`

List all patients with optional filters.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `stage` | string | Filter by pipeline stage (e.g., `CONFIRMATION`) |
| `country` | string | Filter by country |
| `search` | string | Search by name, email, or reference |
| `coordinatorId` | string | Filter by assigned coordinator |

**Example:**

```bash
curl "http://localhost:3000/api/patients?stage=CONFIRMATION&country=Kenya"
```

**Response:**

```json
{
  "patients": [
    {
      "id": "1",
      "ref": "HIMT-2026-0042",
      "name": "James Mwangi",
      "country": "Kenya",
      "phone": "+254 712 345 678",
      "email": "james.mwangi@email.com",
      "treatment": "Hip Replacement",
      "stage": "CONFIRMATION",
      "coordinator": "Priya Sharma",
      "estimatedCost": 12500,
      "inquiryDate": "2026-06-20"
    }
  ],
  "total": 1
}
```

#### `POST /api/patients`

Create a new patient.

**Request Body:**

```json
{
  "name": "John Doe",
  "country": "Kenya",
  "phone": "+254 700 123 456",
  "email": "john@email.com",
  "treatment": "Hip Replacement",
  "stage": "INQUIRY_RECEIVED",
  "coordinatorId": "user_id_123",
  "estimatedCost": 12000,
  "preferredHospital": "Aster Medcity"
}
```

**Response:** `201 Created`

```json
{
  "patient": {
    "id": "new_id",
    "ref": "HIMT-2026-0043",
    "name": "John Doe",
    "createdAt": "2026-06-29T10:30:00Z"
  }
}
```

#### `GET /api/patients/[id]`

Get a single patient by ID.

**Response:**

```json
{
  "patient": {
    "id": "1",
    "ref": "HIMT-2026-0042",
    "name": "James Mwangi",
    "stage": "CONFIRMATION",
    "stageHistory": [...],
    "documents": [...],
    "communications": [...],
    "notes": [...]
  }
}
```

#### `PUT /api/patients/[id]`

Update a patient.

**Request Body:** Any subset of patient fields.

**Response:**

```json
{
  "patient": { /* updated patient object */ }
}
```

#### `DELETE /api/patients/[id]`

Soft-delete or archive a patient.

**Response:**

```json
{
  "success": true,
  "id": "1"
}
```

---

### Tasks API

#### `GET /api/tasks`

List all tasks.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `pending`, `in_progress`, `completed`, `cancelled` |
| `priority` | string | `low`, `medium`, `high`, `urgent` |
| `type` | string | `patient`, `partner`, `marketing`, `general` |
| `assignedToId` | string | Filter by assignee |
| `patientId` | string | Filter by linked patient |

**Example:**

```bash
curl "http://localhost:3000/api/tasks?status=pending&priority=high"
```

**Response:**

```json
{
  "tasks": [
    {
      "id": "1",
      "title": "Follow up with James Mwangi",
      "type": "patient",
      "patientRef": "HIMT-2026-0042",
      "assignedTo": "Priya Sharma",
      "dueDate": "2026-06-29",
      "priority": "high",
      "status": "pending"
    }
  ],
  "total": 1
}
```

#### `POST /api/tasks`

Create a new task.

**Request Body:**

```json
{
  "title": "Send welcome email",
  "description": "Include travel checklist",
  "type": "patient",
  "priority": "medium",
  "status": "pending",
  "assignedToId": "user_123",
  "patientId": "patient_123",
  "dueDate": "2026-07-01"
}
```

#### `PUT /api/tasks/[id]`

Update a task (mark complete, change priority, etc.).

**Example:**

```bash
curl -X PUT "http://localhost:3000/api/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

#### `DELETE /api/tasks/[id]`

Delete a task.

---

### Partners API

#### `GET /api/partners`

List all partners.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | `hospital`, `ayurveda`, `lab`, `transport`, `nursing`, `equipment` |
| `agreementStatus` | string | `none`, `pending`, `signed`, `expired` |
| `search` | string | Search by name |

**Example:**

```bash
curl "http://localhost:3000/api/partners?category=hospital"
```

**Response:**

```json
{
  "partners": [
    {
      "id": "1",
      "name": "Aster Medcity",
      "category": "hospital",
      "contactPerson": "Dr. Prem Nair",
      "phone": "+91 484 400 8000",
      "email": "pren.nair@asterhospital.com",
      "agreementStatus": "signed",
      "commissionRate": 5,
      "totalPatientsReferred": 12,
      "totalRevenue": 180000
    }
  ],
  "total": 1
}
```

#### `POST /api/partners`

Create a new partner.

#### `PUT /api/partners/[id]`

Update a partner.

#### `DELETE /api/partners/[id]`

Delete a partner.

---

### Leads API

#### `GET /api/leads`

List all leads.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `source` | string | `WhatsApp`, `Website`, `Facebook`, `Google Ads`, `Referral`, etc. |
| `status` | string | `new`, `contacted`, `qualified`, `converted`, `lost` |
| `search` | string | Search by name or email |

**Example:**

```bash
curl "http://localhost:3000/api/leads?status=qualified"
```

**Response:**

```json
{
  "leads": [
    {
      "id": "1",
      "name": "David Kimani",
      "country": "Kenya",
      "email": "david.k@email.com",
      "phone": "+254 700 111 222",
      "source": "WhatsApp",
      "treatmentInterest": "Hip Replacement",
      "budgetRange": "$10,000-$15,000",
      "status": "qualified",
      "createdAt": "2026-06-25"
    }
  ],
  "total": 1
}
```

#### `POST /api/leads`

Create a new lead (typically called by website form submission).

#### `PUT /api/leads/[id]`

Update a lead status, qualification, or convert to patient.

#### `DELETE /api/leads/[id]`

Delete a lead.

---

### Documents API

#### `GET /api/documents`

List all documents.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Document category |
| `search` | string | Search by title |

**Example:**

```bash
curl "http://localhost:3000/api/documents?category=Operations+Manual"
```

**Response:**

```json
{
  "documents": [
    {
      "id": "1",
      "title": "HEAL_INDIA_OPERATIONS_MANUAL.md",
      "category": "Operations Manual",
      "size": "90KB",
      "uploadDate": "2026-06-01",
      "type": "MD"
    }
  ],
  "total": 1
}
```

#### `POST /api/documents`

Upload a new document (multipart/form-data).

#### `DELETE /api/documents/[id]`

Delete a document.

---

## Error Codes

| Status | Meaning |
|--------|---------|
| 200 | OK — Request succeeded |
| 201 | Created — Resource created |
| 400 | Bad Request — Invalid input |
| 401 | Unauthorized — Authentication required |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found — Resource doesn't exist |
| 500 | Server Error — Internal error |

**Error Response Format:**

```json
{
  "error": "Patient not found",
  "code": "PATIENT_NOT_FOUND",
  "details": { /* additional info */ }
}
```

---

## Pagination

List endpoints support pagination via:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page (max 100) |
| `sort` | string | `createdAt:desc` | Sort field and direction |

**Example:**

```bash
curl "http://localhost:3000/api/patients?page=2&limit=50&sort=name:asc"
```

**Response includes:**

```json
{
  "patients": [...],
  "total": 145,
  "page": 2,
  "limit": 50,
  "totalPages": 3
}
```

---

## Rate Limiting

Production API is rate-limited to:
- 100 requests per minute per IP
- 1000 requests per hour per IP
- 10,000 requests per day per IP

Rate limit headers in response:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625024400
```

---

## Webhooks (Planned)

Future webhook support for:
- New patient inquiry notifications
- Task assignment alerts
- Lead conversion events
- Partner MOU status changes

---

## SDK / Client Libraries

Currently no official SDK. Direct HTTP requests recommended.

Future plans:
- TypeScript SDK
- React hooks library (`usePatient`, `useTask`, etc.)
- CLI tool for common operations

---

**Last Updated:** June 29, 2026
