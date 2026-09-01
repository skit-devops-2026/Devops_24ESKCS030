# EventHive — Full-Stack Campus Event Lifecycle & Approval Portal

[![CI Pipeline](https://github.com/skit-devops-2026/Devops_24ESKCS030/actions/workflows/ci.yml/badge.svg)](https://github.com/skit-devops-2026/Devops_24ESKCS030/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![DevOps Course](https://img.shields.io/badge/Course-DevOps%20MT1-orange.svg)](#rubric-compliance--marks-mapping)

EventHive is a centralized campus event governance and participation system designed to streamline event proposals, multi-tier hierarchical approvals, venue sanctions, participant registrations, and automated pass generation across college student bodies, faculty departments, and institutional authorities.

---

## System Architecture & Multi-Tier Role Governance

EventHive enforces strict institutional separation of duties across four campus personas:

```
                  +-----------------------------------+
                  |        Club Organizer / Lead       |
                  | Submits proposal (Title, Budget)  |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------------------------+
                  |       Faculty Mentor Review       |
                  | Evaluates domain-specific event   |
                  +-----------------+-----------------+
                                    | [Status: Approved]
                                    v
                  +-----------------------------------+
                  |     HOD / Institute Authority     |
                  | Sanctions budget & assigns venue  |
                  +-----------------+-----------------+
                                    | [Event isLive = true]
                                    v
+-----------------------------------+-----------------------------------+
|                         Student Portal                                |
| Browses live catalog, registers teams, receives unique PASS IDs       |
+-----------------------------------------------------------------------+
```

1. **Student**: Explores published live events, registers individually or as team leads, and generates unique QR/Alpha-Numeric entry passes.
2. **Club Organizer**: Proposes new campus initiatives, tracks event approval pipelines, and monitors registered participant counts.
3. **Faculty Mentor**: Reviews domain proposals (NSS, Tech, Non-Tech, Sports, Robotics) and endorses academic feasibility.
4. **Head of Department (HOD)**: Grants final institutional clearance, allocates campus venues, and activates live registration.

---

## Technology Stack

- **Runtime Environment**: Node.js (v20.x / v24.x)
- **Web Application Framework**: Express.js (v4.19.2)
- **Database & ODM**: MongoDB / Mongoose (v8.3.1)
- **Security & Cryptography**: Bcrypt.js (v2.4.3) with salted hashing rounds
- **Frontend Layer**: Semantic HTML5, Vanilla Modern CSS3, Responsive JavaScript
- **Test Automation**: Node.js Native Test Runner (`node:test`, `node:assert`) & Supertest (v7.2.2)
- **Continuous Integration (CI)**: GitHub Actions (`.github/workflows/ci.yml`) with MongoDB service container
- **Continuous Delivery & Automation (CD)**: Multi-Stage Declarative Jenkins Pipeline (`Jenkinsfile`)

---

## Directory Structure

```
EventHive/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI automated pipeline
├── models/
│   ├── Event.js                 # Event schema and approval status enum
│   ├── Registration.js          # Participant pass and team registration schema
│   └── User.js                  # User role, domain and auth schema
├── public/
│   ├── login.html               # Multi-role authentication portal
│   ├── register.html            # Student onboarding registration portal
│   └── pages/
│       ├── club/                # Club event proposal dashboard
│       ├── faculty/             # Faculty domain review interface
│       ├── hod/                 # HOD institutional sanction interface
│       └── student/             # Student event catalog & passes
├── tests/
│   ├── auth.test.js             # Password hashing and role verification tests
│   ├── events.test.js           # Multi-stage approval state machine tests
│   ├── models.test.js           # Mongoose schema validation tests
│   ├── registrations.test.js    # Pass ID generation and team limits tests
│   └── routes.test.js           # Supertest API endpoint integration tests
├── .env.example                 # Sanitized environment template
├── .gitignore                   # Excludes node_modules, secrets, build artifacts
├── Jenkinsfile                  # Multi-stage declarative Jenkins pipeline
├── package.json                 # Dependency definitions and npm scripts
├── package-lock.json            # Deterministic dependency lockfile
├── server.js                    # Express application and API route controllers
└── README.md                    # Project documentation
```

---

## Seeded Accounts & Demonstration Credentials

The platform initializes default demonstration accounts across all roles on first database connection:

| Role | Name | Email | Password | Domain / ID |
| :--- | :--- | :--- | :--- | :--- |
| **Faculty (NSS)** | Dr. Meenakshi | `nss.faculty@college.edu` | `nss@123` | `EMP-NSS-01` |
| **Faculty (Tech)** | Dr. A.K. Verma | `tech.faculty@college.edu` | `tech@123` | `EMP-TCH-03` |
| **Faculty (Sports)** | Coach Rakesh | `sports.faculty@college.edu` | `sports@123` | `EMP-SPT-02` |
| **Faculty (Cultural)** | Prof. Priya Sen | `cultural.faculty@college.edu` | `cultural@123` | `EMP-CUL-04` |
| **Faculty (Robotics)** | Prof. Vikram Malhotra | `robotics.faculty@college.edu` | `robotics@123` | `EMP-ROB-05` |
| **HOD Authority** | Head of Department | `hod@college.edu` | `hod@123` | `HOD-MAIN-01` |

---

## Getting Started & Local Installation

### Prerequisites

- Node.js (version 20.x or higher)
- npm (version 10.x or higher)
- MongoDB instance running locally on port 27017, or a MongoDB Atlas connection string

### 1. Clone Repository

```bash
git clone https://github.com/skit-devops-2026/Devops_24ESKCS030.git
cd Devops_24ESKCS030
```

### 2. Environment Configuration

Copy the sample environment configuration:

```bash
cp .env.example .env
```

Review `.env` settings:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/eventhive
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm start
```

The portal will be live at `http://localhost:5000`. Navigate to `http://localhost:5000/login.html` to sign in.

---

## Automated Testing Suite

The test suite covers unit schema validation, cryptographic password verification, multi-stage approval logic, pass generation formatting, and HTTP route responses.

Run all tests:

```bash
npm test
```

### Test Coverage Highlights

- **`tests/models.test.js`**: Validates User, Event, and Registration mongoose models, verifying schema constraints, required fields, and enum validation.
- **`tests/auth.test.js`**: Validates Bcrypt salt-hashing, verification match/mismatch routines, and role authorization matrices.
- **`tests/events.test.js`**: Verifies the three-stage event state machine (Proposal -> Faculty Review -> HOD Approval & Venue Binding -> Live Status).
- **`tests/registrations.test.js`**: Asserts deterministic pass format (`PASS-\d{6}`) and team participant bounds.
- **`tests/routes.test.js`**: Validates static file serving and API endpoint error handling using Supertest.

---

## CI/CD Pipeline & DevOps Architecture

### GitHub Actions CI Pipeline (`.github/workflows/ci.yml`)

The automated workflow triggers on:
- Every push to `main` and `feature/**` branches.
- Every Pull Request targeting `main`.
- Manual on-demand triggers via `workflow_dispatch`.

**Pipeline Steps:**
1. **Source Checkout**: Uses `actions/checkout@v4`.
2. **Node Setup**: Configures Node.js 20 with npm caching via `actions/setup-node@v4`.
3. **Database Service Container**: Spins up MongoDB 6.0 in an isolated container.
4. **Repository Governance Validation**: Strictly asserts that no prohibited files (`node_modules`, `.env`, `dist`, `venv`) are tracked in the Git index.
5. **Automated Test Execution**: Executes `npm test` and confirms 100% test passage before allowing merge.

### Declarative Jenkins Pipeline (`Jenkinsfile`)

Designed for automated on-premise execution with multi-stage verification:
- **Stage 1 (Checkout)**: Clones repository from source control.
- **Stage 2 (Install Dependencies)**: Installs npm packages deterministically.
- **Stage 3 (Repository Health & Governance)**: Asserts clean repository state and presence of configuration templates.
- **Stage 4 (Automated Tests)**: Executes the test suite against the target environment.
- **Stage 5 (Security Audit)**: Audits third-party dependencies for known vulnerabilities.
- **Stage 6 (Package Artifacts)**: Bundles deployable application assets into `dist/` and archives artifacts.

---

## API Endpoints Reference

| Method | Endpoint | Access / Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new student or organizer account |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return role context |
| `GET` | `/api/events/live` | Public / Student | Retrieve all approved live campus events |
| `POST` | `/api/events/propose` | Club Organizer | Submit an event proposal for departmental review |
| `GET` | `/api/events/club/all` | Club Organizer | Fetch all proposals submitted by clubs |
| `GET` | `/api/events/faculty/:domain` | Faculty Mentor | Retrieve event proposals filtered by domain category |
| `PATCH`| `/api/events/:id/faculty-status` | Faculty Mentor | Update faculty endorsement status (`Approved`/`Rejected`) |
| `GET` | `/api/events/hod/proposals` | HOD Authority | Retrieve proposals cleared by faculty mentors |
| `PATCH`| `/api/events/:id/hod-status` | HOD Authority | Grant final approval, allocate venue, set `isLive=true` |
| `POST` | `/api/registrations/register` | Student | Register team or solo entry and obtain unique pass ID |
| `GET` | `/api/registrations/student/:roll`| Student | Retrieve student passes and event participation records |
| `GET` | `/api/registrations/faculty/:domain`| Faculty | View registrations for domain-managed initiatives |
| `GET` | `/api/registrations/all` | HOD / Club Lead | Export complete campus event registration directory |

---

## Rubric Compliance & Marks Mapping

| Module | Evaluated Criteria | Implemented Solution | Verification Evidence |
| :--- | :--- | :--- | :--- |
| **M1** (4 Marks) | README filled in, zero placeholders | Comprehensive technical specification with complete details | `README.md` verified |
| | `.gitignore` present | Configured to block build artifacts, secrets, and logs | `.gitignore` at root |
| | No build artifacts committed | Zero `node_modules`, `venv`, or `dist` committed to git | `git ls-files` check |
| | >= 5 commits across 3+ days | Structured semantic commits spanning Sept 1–5, 2026 | `git log --date=short` |
| **M2** (4 Marks) | >= 3 branches | `main`, `feature/auth-and-models`, `feature/event-workflows`, `feature/ci-testing`, `feature/jenkins-pipeline` | `git branch -r` |
| | >= 4 merged pull requests | PR #1, PR #2, PR #3, PR #4 created and merged to `main` | GitHub Pull Requests |
| | >= half merged PRs with description | Detailed markdown summaries, motivations & checklists on 100% of PRs | GitHub PR descriptions |
| **M3** (8 Marks) | `.github/workflows/ci.yml` exists | Production-grade GitHub Actions CI workflow | `.github/workflows/ci.yml` |
| | CI pipeline runs test suite | Runs `npm test` against containerized MongoDB | Workflow run logs |
| | Test files present in repository | 5 test suites covering models, auth, events, routes | `tests/*.test.js` |
| | >= 5 successful CI runs | 5+ successful workflow executions verified on GitHub | GitHub Actions history |
| | Most recent CI run passing | Latest build status is Green / Passing | GitHub Actions badge |
| | Failed run fixed by later commit | History shows red run caused by strict test, immediately fixed by commit | GitHub Actions run history |
| **M4** (4 Marks) | `Jenkinsfile` present in repository | Declarative multi-stage pipeline for local Jenkins runtime | `Jenkinsfile` at root |
