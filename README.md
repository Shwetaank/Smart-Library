<div align="center">

<br/>

# 📚 SmartLibrary

### Online Library Management System

**full-stack web application built on the MERN stack and Microsoft Azure.**

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Azure](https://img.shields.io/badge/Azure-Deployed-0089D6?style=flat-square&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)](https://github.com/features/actions)

<br/>

[🌐 Live ](https://yellow-ground-0ffdf2a00.7.azurestaticapps.net/) · [🐛 Report Bug](https://github.com/Shwetaank/Smart-Library/issues) · [✨ Request Feature](https://github.com/Shwetaank/Smart-Library/issues)

<br/>
</div>

---

<img width="1280" height="680" alt="SmartLibrary" src="https://github.com/user-attachments/assets/06269295-3643-4323-b9f7-0df163f9caab" />



## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
  - [Azure Setup](#azure-setup)
  - [CI/CD Pipeline](#cicd-pipeline)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

SmartLibrary is a full-featured **Online Library Management System** that enables library staff to manage a book catalog and allows members to browse, borrow, return, and reserve books — all through a clean, responsive web interface.

- Full-stack TypeScript development (React 18 + Node.js/Express)
- Relational database design with Prisma ORM on Azure SQL
- Secure JWT authentication with role-based access control
- Azure cloud deployment with zero-downtime CI/CD via GitHub Actions
- Production-level practices: input validation, audit logs, error handling, transactional writes

---

## ✨ Features

| Feature | Description |
|---|---|
| 📚 **Book Catalog** | Add, edit, soft-delete books with cover image upload to Azure Blob Storage |
| 🔍 **Search & Filter** | Search by title / author / ISBN; filter by genre and availability |
| 👤 **User Accounts** | Self-registration via Azure AD B2C; profile management |
| 🔐 **Role-Based Access** | Three roles: `USER`, `LIBRARIAN`, `ADMIN` — each with scoped permissions |
| 📦 **Borrow & Return** | Transactional borrow/return with `UPDLOCK` to prevent double-borrowing |
| 🔄 **Loan Renewals** | Up to 2 renewals per loan; blocked if reservation queue exists |
| 📅 **Reservations** | Hold queue when all copies are borrowed; 48-hour claim window |
| 💸 **Overdue Fines** | Auto-calculated at ₹5/day; viewable on account dashboard |
| 🖼️ **Cover Images** | Upload to Azure Blob Storage; served via time-limited SAS tokens |
| 📊 **Overdue Report** | Librarian view: all late loans sorted by days overdue |
| 🔎 **Audit Logs** | Every write operation (borrow, return, edit) tracked with user + timestamp |
| 📱 **Responsive UI** | Tailwind CSS + shadcn/ui — works on mobile, tablet, and desktop |
| 🚀 **CI/CD Pipeline** | 5-job GitHub Actions pipeline: lint → test → build → staging → production |

---

## 🛠️ Tech Stack

### Frontend (`client/`)

| Layer | Package | Version |
|---|---|---|
| Framework | React | 18.x |
| Build tool | Vite | 5.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS + shadcn/ui | 3.x |
| Server state | TanStack React Query | 5.x |
| Client state | Zustand | 4.x |
| Forms | React Hook Form + Zod | 7.x / 3.x |
| Auth | MSAL React (@azure/msal-react) | 2.x |
| HTTP | Axios | 1.x |
| Routing | React Router | 6.x |

### Backend (`server/`)

| Layer | Package | Version |
|---|---|---|
| Runtime | Node.js | 20 LTS |
| Framework | Express | 4.x |
| Language | TypeScript | 5.x |
| ORM | Prisma | 5.x |
| Validation | Zod | 3.x |
| Auth | jsonwebtoken + jwks-rsa | 9.x / 3.x |
| Storage SDK | @azure/storage-blob | 12.x |
| Security | Helmet + CORS | 7.x / 2.x |
| File upload | Multer | 1.x |
| Testing | Vitest + Supertest | 1.x |
| Dev server | tsx watch | 4.x |

### Cloud (Microsoft Azure)

| Service | Tier | Purpose |
|---|---|---|
| Azure App Service | Basic B1 (Linux) | Host the Express REST API |
| Azure Static Web Apps | Free | Host the React build (global CDN) |
| Azure SQL Database | Serverless, General Purpose | Relational data store |
| Azure Blob Storage | Standard LRS | Book cover images |

---

## 📁 Project Structure

```
library-system/                      ← Monorepo root
├── client/                          ← React 18 + Vite
│   ├── src/
│   │   ├── components/              ← BookCard, BorrowModal, Navbar, ProtectedRoute
│   │   ├── pages/                   ← Catalog, BookDetail, Account, Admin/
│   │   ├── hooks/                   ← useBooks, useBorrow, useAuth
│   │   └── lib/                     ← axios.ts, msalConfig.ts, schemas.ts
│   ├── vite.config.ts
│   └── package.json
│
├── server/                          ← Node.js + Express
│   ├── prisma/
│   │   ├── schema.prisma            ← 6 models, 3 enums, all indexes
│   │   └── seed.ts                  ← 6 genres + 14 sample books
│   ├── src/
│   │   ├── app.ts                   ← Express app, middleware, route mounting
│   │   ├── server.ts                ← HTTP entry point
│   │   ├── config/prisma.ts         ← Singleton PrismaClient
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   ← JWT validation + role guard
│   │   │   └── errorHandler.ts      ← Global Zod/Prisma/AppError → JSON
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── books.routes.ts      ← CRUD + cover image upload
│   │   │   ├── loans.routes.ts      ← borrow / return / renew / overdue
│   │   │   ├── users.routes.ts      ← profile + admin management
│   │   │   └── reservations.routes.ts
│   │   └── services/
│   │       └── storage.service.ts   ← Azure Blob upload / delete / SAS
│   ├── tsconfig.json
│   └── package.json
│
├── .github/workflows/
│   └── deploy.yml                   ← 5-job CI/CD pipeline
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Min Version | Install |
|---|---|---|
| Node.js | 20 LTS | [nodejs.org](https://nodejs.org) or `nvm install 20` |
| npm | 10+ | Bundled with Node.js |
| Git | 2.x | [git-scm.com](https://git-scm.com) |


### Environment Variables

Create `server/.env` by copying the example below. **Never commit `.env` to Git.**

```env
# ── Application ─────────────────────────────────────────────────────
NODE_ENV=development
PORT=3001

# ── Azure SQL Database ───────────────────────────────────────────────
# Format: sqlserver://<host>:1433;database=<db>;user=<u>;password=<p>;encrypt=true
DATABASE_URL="sqlserver://your-server.database.windows.net:1433;database=LibraryDB;user=adminuser;password=YourPassword!;encrypt=true;trustServerCertificate=false"

# ── Azure Blob Storage ───────────────────────────────────────────────
AZURE_STORAGE_ACCOUNT_NAME=librarycoversstorage
AZURE_STORAGE_ACCOUNT_KEY=your-storage-account-key==

# ── CORS ─────────────────────────────────────────────────────────────
ALLOWED_ORIGINS=http://localhost:5173,https://your-app.azurestaticapps.net


Create `client/.env.local` for the frontend:

```env
VITE_API_BASE_URL=http://localhost:3001

### Database Setup

```bash
cd server

# Push schema to create all 6 tables in Azure SQL
npx prisma db push

# Seed with 6 genres and 14 sample books
npm run db:seed

npm run db:studio
```
> **Quick test:** `curl http://localhost:3001/health` should return `{ "status": "ok" }`

---

## 📡 API Reference

All routes are prefixed with `/api/v1`. Auth levels: `Public` (no token), `USER+` (any logged-in user), `LIBRARIAN+`, `ADMIN`.

### Books

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/books` | Public | Paginated list. Query: `?search=&genreId=&available=true&page=1&limit=20` |
| `GET` | `/books/:id` | Public | Single book with availability count |
| `POST` | `/books` | LIBRARIAN+ | Create book |
| `PATCH` | `/books/:id` | LIBRARIAN+ | Partial update |
| `DELETE` | `/books/:id` | ADMIN | Soft-delete (blocked if active loans exist) |
| `POST` | `/books/:id/cover` | LIBRARIAN+ | Upload cover image (multipart, field: `cover`, max 5MB) |

### Loans

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/loans` | USER+ | Borrow — body: `{ bookId }`. Max 5 active loans per user. |
| `POST` | `/loans/:id/return` | USER+ | Return. Calculates fine at ₹5/overdue day. |
| `POST` | `/loans/:id/renew` | USER+ | Renew. Max 2 renewals. Blocked if reservation queue exists. |
| `GET` | `/loans` | USER+ | Users see own; librarians see all |
| `GET` | `/loans/overdue` | LIBRARIAN+ | All late loans with days overdue + estimated fine |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users/me` | USER+ | Profile + active loans |
| `PATCH` | `/users/me` | USER+ | Update name / phone |
| `GET` | `/users` | LIBRARIAN+ | Paginated list |
| `PATCH` | `/users/:id/role` | ADMIN | Promote / demote role |
| `DELETE` | `/users/:id` | ADMIN | Soft-delete |

### Reservations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/reservations` | USER+ | Place hold (only when `availableCopies = 0`) |
| `GET` | `/reservations` | USER+ | List holds |
| `DELETE` | `/reservations/:id` | USER+ | Cancel hold |

---

## ☁️ Deployment

### Azure Setup

Run these CLI commands once to provision all required resources:



### CI/CD Pipeline

The `.github/workflows/deploy.yml` pipeline has 5 jobs:

```
push to develop ──► lint-and-test ──► build-server ──► deploy-staging
                                  └──► build-client ──┘

push to main    ──► lint-and-test ──► build-server ──► deploy-prod (slot swap → auto-rollback)
                                  └──► build-client ──┘
```

## 🔒 Security

| Measure | Implementation |
|---|---|
| HTTPS enforced | `az webapp update --https-only true` + TLS 1.2 minimum |
| JWT validation | RS256 signature verified against Azure B2C JWKS public keys |
| Role-based access | `requireRole('LIBRARIAN', 'ADMIN')` middleware guard on every admin route |
| SQL firewall | Azure services + specific dev IPs only — never `0.0.0.0/0` |
| Encryption at rest | Azure SQL Transparent Data Encryption (TDE) — on by default |
| Encryption in transit | `encrypt=true` in DATABASE_URL; all Azure SQL connections require TLS |
| Secrets management | `.env` locally; Azure App Settings in production; Key Vault for critical secrets |
| Helmet.js headers | `app.use(helmet())` — sets CSP, X-Frame-Options, HSTS automatically |
| Input validation | Zod `schema.parse(req.body)` on every route before any business logic |
| SQL injection | Prisma parameterised queries — never string-concatenated SQL |
| CORS whitelist | `ALLOWED_ORIGINS` env var — explicit list, never `*` |
| Blob access | Container private; images served via time-limited SAS tokens (60 min) |
| Audit trail | `AuditLog` model records every write: who, what, when, payload snapshot |

---

## 🧪 Testing

```bash
cd server

# Run all tests once
npm test

# Watch mode (re-runs on save)
npm run test:watch

# Coverage report (outputs to server/coverage/)
npm run test:coverage
```

The CI pipeline runs tests against a **real SQL Server Docker container** (not mocks) on every push.

---

## 🤝 Contributing

Contributions are welcome and appreciated.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests where relevant
4. Run `npm test` and ensure all tests pass
5. Commit with a descriptive message: `git commit -m 'feat: add overdue email notifications'`
6. Push to your branch: `git push origin feature/your-feature-name`
7. Open a Pull Request — describe what changed and why

Please follow the existing code style (ESLint config is included) and keep PRs focused on a single change.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.

---

<div align="center">

**Built with React 18 · Node.js 20 · Prisma · Azure**

⭐ Star this repo if it helped you · 

</div>
