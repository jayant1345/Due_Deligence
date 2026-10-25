# VALUEX CA Loan Verification & Contact Point Verification (CPV) Platform

A production-grade, highly concurrent Python backend and elegant light-themed PWA frontend for Chartered Accountant (CA) firms conducting Contact Point Verification (CPV) and Loan Document Scrutiny for empanelled banks (SBI, HDFC, ICICI, Axis).

Engineered for seamless deployment on **Railway.app**, connected to **Railway PostgreSQL** (via `asyncpg`) and **Railway Redis**, serving hundreds of concurrent field agents and office CA verifiers with a **Zero-Lag Request Policy** and asynchronous offloaded processing.

---

## 🌟 Key Features

### 1. Zero-Lag Operational Architecture (< 150ms)
- Multi-part file uploads stream directly to persistent storage (local volume or S3/Cloudflare R2).
- Initial metadata is instantly persisted to PostgreSQL via `asyncpg`.
- Background tasks are enqueued to Celery/Redis, returning an immediate `202 Accepted` response.

### 2. High-Accuracy, Cost-Effective Scanning with OpenRouter Gemini
- Powered by **OpenRouter Gemini 2.0 Flash Vision** (`google/gemini-2.0-flash-001` or `google/gemini-flash-1.5`) for forensic document analysis at fractions of a cent per document.
- **UIDAI Compliance**: Mandatory automatic regex & AI masking of the first 8 digits of Aadhaar numbers (`XXXX-XXXX-1234`).
- **Fuzzy Cross-Matching**: Automated similarity calculation (`rapidfuzz`) comparing extracted document fields (Name, Address, PAN, Meter Number) against master applicant records.
- Graceful offline fallback to local Tesseract OCR.

### 3. Progressive Web App (PWA) for Field Staff (Light Theme)
- Designed using **Google Stitch** with an elegant, light-themed institutional aesthetic (porcelain surfaces, royal sapphire accents, and trust emerald verified badges).
- **Precision GNSS Geofencing**: Real-time Haversine distance tracking against target property coordinates. Breached flag if distance exceeds 150 meters.
- **Indelible Hard Pixel Watermarking**: Solid bottom overlay banner burning Case Number, Agent Name & ID, IST Timestamp, Latitude/Longitude, and Geofence Status directly onto the photo pixels.
- **PWA Service Worker & Manifest**: Full standalone app capabilities, offline-ready caching, and background sync.

### 4. Desktop CA Scrutiny & Bank Certification Portal
- High-density 3-column executive audit workspace:
  - **Column 1**: Document OCR & UIDAI Masking Scrutiny.
  - **Column 2**: Geofence Satellite Radar & 4-Point Tamper-Proof Evidence Grid.
  - **Column 3**: CA Certification Desk with 5-point checklist, ICAI UDIN block, Class-3 DSC token status, and bank dossier export.
- **Certified ReportLab PDF Dossier**: Automatically compiled bank deliverable with CA letterhead, visit logs, photo grid, UDIN, and immutable **SHA-256 digital fingerprint**.

---

## 👥 User Roles, Simple Credentials & WhatsApp Dispatch Workflow

### 🔑 Default Credentials
| Role | Portal / Interface | Username / Alias | Default Password | Access Level |
|---|---|---|---|---|
| **Super Admin / CA Partner** | Desktop CA Scrutiny Desk (`/portal`) | `admin` (or `admin@valuexca.com`) | `admin@123` | Full access: Assign tasks, audit evidence, enter UDIN, certify & generate bank reports |
| **Field Verification Agent** | Mobile Field Agent PWA (`/pwa`) | `agent1` (or `agent.rajesh@valuexca.com`) | `agent1@123` | Mobile field access: View assigned tasks, capture GPS photos, upload borrower docs |

---

### 📲 End-to-End Operational Workflow

```
[1. Bank Loan Case Ingested / Created]
               │
               ▼
[2. CA Admin Assigns Task to Field Agent on Desktop Desk]
               │
               ▼
[3. Admin Clicks "Share via WhatsApp"]
       ├── Dispatches WhatsApp message to Agent's Phone
       ├── Includes Direct PWA Link (with Case ID)
       └── Includes Simple Credentials (agent1 / agent1@123)
               │
               ▼
[4. Field Agent Taps Link on Mobile Phone]
       ├── Opens Field Agent Mobile PWA
       ├── Logs in with agent1 / agent1@123
       ├── Captures Geotagged Site Photos (150m Geofence Checked)
       └── Uploads Borrower Documents (Electricity bill, Aadhaar, PAN)
               │
               ▼
[5. Instant Zero-Lag Storage on Server]
       ├── High-res photos watermarked with GPS & Timestamp
       ├── Documents securely persisted in server storage
       └── OpenRouter Gemini OCR runs in background
               │
               ▼
[6. CA Desktop Scrutiny & Certification]
       ├── CA checks inspection findings & OCR match on Desktop Desk
       ├── Affixes ICAI Member No. & UDIN
       └── Generates & Downloads Certified Bank Due Diligence PDF Report
```

#### WhatsApp Task Dispatch Message Format
```text
🏛️ VALUEX & CO. CHARTERED ACCOUNTANTS
📋 New Physical Verification Task
Case No: SBI-HL-2024-001 | Borrower: Rahul Sharma
📍 Property: Flat 402, Shivalik Heights, Bodakdev, Ahmedabad

📲 Field Agent Mobile PWA Link:
https://<your-app-domain>/pwa?case=SBI-HL-2024-001

🔑 Agent Credentials:
• Username: agent1
• Password: agent1@123

👉 Action Required: Open link, login, capture live GPS-watermarked photos, upload verification docs, and submit.
```

---

## 🏗️ System Architecture

```text
ca_loan_verification/
├── Procfile                      # Railway process declarations (web & worker)
├── railway.json                  # Railway deployment manifest
├── Dockerfile                    # Container with Tesseract and system dependencies
├── requirements.txt              # Production Python dependencies
├── alembic.ini                   # Database migrations configuration
├── README.md                     # Documentation
├── .env.example                  # Environment template (OpenRouter, DB, Redis)
├── app/
│   ├── main.py                   # FastAPI async app, lifespan, PWA routes
│   ├── api/
│   │   ├── deps.py               # RBAC & JWT bearer dependencies
│   │   └── v1/
│   │       ├── auth.py           # Argon2 login, token refresh, user register
│   │       ├── cases.py          # Loan case creation, listing, assignment
│   │       ├── agent_visits.py   # Check-in, checkout, zero-lag 202 upload
│   │       ├── scrutiny.py       # CA scrutiny dossier, remark updates
│   │       └── reports.py        # ReportLab PDF compile, SHA-256 download
│   ├── core/
│   │   ├── config.py             # Dynamic database URL parser, OpenRouter config
│   │   ├── database.py           # SQLAlchemy 2.0 async engine & connection pool
│   │   └── security.py           # Argon2id hashing & JWT token services
│   ├── models/
│   │   ├── user.py               # User and UserRole (SUPER_ADMIN, CA_VERIFIER, FIELD_AGENT)
│   │   ├── loan_case.py          # LoanCase, CaseStatus, VisitRecord
│   │   ├── document.py           # CaseDocument, DocumentType, VerificationStatus
│   │   └── report.py             # CertifiedReport (SHA-256, UDIN) & AuditLog
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── loan_case.py
│   │   ├── document.py
│   │   └── report.py
│   ├── services/
│   │   ├── geofence.py           # Haversine distance & 150m breach validation
│   │   ├── image_watermark.py    # Indelible pixel footer banner & thumbnails
│   │   ├── ocr_parser.py         # OpenRouter Gemini Vision & Aadhaar masking
│   │   ├── storage.py            # Local, S3, and Cloudflare R2 adapters
│   │   └── pdf_generator.py      # Bank-certified ReportLab PDF compiler
│   ├── static/
│   │   ├── index.html            # Unified portal launcher
│   │   ├── agent-pwa.html        # Field Agent Mobile PWA (Light Theme)
│   │   ├── ca-portal.html        # Desktop CA Scrutiny Desk (Light Theme)
│   │   ├── manifest.json         # PWA Web App Manifest
│   │   └── sw.js                 # PWA Service Worker (offline cache)
│   └── workers/
│       ├── celery_app.py         # Celery configuration with Redis
│       └── celery_tasks.py       # Asynchronous watermark, OCR, and PDF tasks
└── tests/
    ├── test_geofence.py          # Haversine distance unit tests
    ├── test_watermark.py         # Watermark rendering unit tests
    ├── test_pdf.py               # ReportLab PDF & SHA-256 unit tests
    └── test_ocr.py               # Aadhaar masking & fuzzy match tests
```

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your OpenRouter API key:
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=google/gemini-2.0-flash-001
```

### 3. Run FastAPI Dev Server
```bash
uvicorn app.main:app --reload --port 8000
```
- **Unified Portal Launcher**: [http://localhost:8000/](http://localhost:8000/)
- **Field Agent PWA**: [http://localhost:8000/pwa](http://localhost:8000/pwa)
- **Desktop CA Scrutiny Desk**: [http://localhost:8000/portal](http://localhost:8000/portal)
- **Interactive Swagger API**: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

### 4. Run Celery Worker (In a separate terminal)
```bash
celery -A app.workers.celery_app.celery_app worker --loglevel=info
```

### 5. Run Unit Tests
```bash
pytest
```

---

## ☁️ Deploying on Railway.app

1. **Connect GitHub Repository**: Link this repository in your Railway project dashboard.
2. **Add Railway PostgreSQL**: Add a PostgreSQL database service; Railway automatically provides the `DATABASE_URL` environment variable. The dynamic parser in `app/core/config.py` converts `postgres://` or `postgresql://` into `postgresql+asyncpg://` with connection pooling (`pool_size=20`, `max_overflow=10`).
3. **Add Railway Redis**: Add a Redis service; Railway automatically provisions `REDIS_URL`.
4. **Set Environment Variables**:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key.
   - `OPENROUTER_MODEL`: `google/gemini-2.0-flash-001` (cost-effective, ultra-fast vision).
   - `SECRET_KEY`: A strong 32+ character random string.
5. Railway reads `railway.json` and `Procfile` to deploy both the web Gunicorn workers and the Celery background worker seamlessly.
