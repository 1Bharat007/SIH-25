# 🏔️ Sikkim Yatra (सिक्किम यात्रा)

> **Smart, Offline-First Digital Tourism Platform for Sikkim**  
> Engineered for high-altitude connectivity resilience, cultural exploration, permit management, and real-time mountain navigation.

---

## 🏗️ Monorepo Architecture

```
SIH'25/
├── apps/
│   ├── web/                     # Next.js (App Router) + Tailwind CSS + TanStack Query + PWA
│   │   ├── public/              # PWA manifest, service workers, static icons
│   │   └── src/                 # App Router pages, components, hooks, providers
│   └── server/                  # Node.js + Express + TypeScript API + Prisma ORM
│       ├── prisma/              # PostgreSQL schema and migrations
│       └── src/                 # Controllers, routes, middleware, config
├── packages/
│   ├── shared/                  # Zero-drift TypeScript types, DTOs, and constants
│   └── tsconfig/                # Shared TypeScript compiler presets
├── .github/workflows/           # CI/CD pipelines (Lint, Typecheck, Build)
├── .env.example                 # Global environment variables template
├── turbo.json                   # Turborepo task pipeline
└── package.json                 # Workspaces configuration
```

---

## ⚡ Tech Stack

| Layer                | Technology                                      | Purpose                                           |
| -------------------- | ----------------------------------------------- | ------------------------------------------------- |
| **Frontend**         | Next.js 15 (App Router), React 19, Tailwind CSS | High-performance, responsive UI                   |
| **State / Fetching** | TanStack React Query v5                         | Offline caching, background synchronization       |
| **PWA / Offline**    | `@ducanh2912/next-pwa` (Workbox)                | Service worker, cache strategies, installable PWA |
| **Backend**          | Node.js, Express, TypeScript                    | RESTful API services                              |
| **Database**         | PostgreSQL + Prisma ORM                         | Relational data persistence & migrations          |
| **Monorepo**         | npm Workspaces + Turborepo                      | Fast build caching, shared dependencies & scripts |

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js**: `v20.0.0` or later
- **npm**: `v10.0.0` or later
- **PostgreSQL**: (Optional for initial health check, required for database operations)

### 2. Installation

```bash
# Clone the repository and install all workspace dependencies
npm install
```

### 3. Environment Variables

Copy `.env.example` to configure your environment:

```bash
cp .env.example .env
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env.local
```

### 4. Database Setup (Prisma)

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to PostgreSQL database (when database is running)
npm run db:push
```

### 5. Running in Development

```bash
# Start both Web and Server concurrently with Turborepo
npm run dev

# Or run individual workspaces:
npm run dev:web      # Next.js Web on http://localhost:3000
npm run dev:server   # Express API on http://localhost:5000
```

### 6. Verifying Connectivity

- Open `http://localhost:3000` in your browser.
- The homepage will display real-time health connectivity with the Express backend (`/api/v1/health`), database standby status, and PWA offline readiness.

---

## 🛠️ Available Scripts

| Command                | Action                                                |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Runs all apps concurrently in dev mode                |
| `npm run build`        | Builds all packages and Next.js/Express apps          |
| `npm run lint`         | Runs ESLint across all workspaces                     |
| `npm run typecheck`    | Validates TypeScript types across the entire monorepo |
| `npm run format`       | Formats all files with Prettier                       |
| `npm run format:check` | Verifies code formatting in CI                        |
| `npm run db:generate`  | Generates Prisma client types                         |
| `npm run db:push`      | Synchronizes Prisma schema with database              |
| `npm run db:studio`    | Opens Prisma Studio GUI                               |

---

## 📄 License

ISC / Private
