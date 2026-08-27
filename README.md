# Sikkim Yatra (Sikkimese Digital Tourism Platform)

> **Smart, Offline-First Digital Tourism Platform for Sikkim**  
> Engineered for high-altitude connectivity resilience, cultural exploration, emergency response, and real-time mountain navigation.

---

## Key Modules Implemented

- **Tourism Discovery and Interactive Map**: Leaflet-based geospatial explorer with custom layer filtering (monasteries, homestays, medical posts, food vendors), rich heritage profiles, and community vendor integration.
- **Safety and SOS Emergency Response**: Persistent floating SOS emergency trigger, real-time Haversine distance calculations for nearest police stations and trauma hospitals, trusted emergency contacts manager, and timed live location sharing.
- **Disaster Management and Hazard Response**: Admin hazard broadcast system, dual-channel real-time delivery via native WebSockets with Server-Sent Events fallback, GPS-geofenced proximity detection, turn-by-turn safe detour routing around mountain road closures, and terrain evacuation protocols.
- **Cultural Heritage and AR Module**: Three.js WebGL 360-degree equirectangular monastery interior viewer with interactive 3D relic hotspots, traditional Sikkimese attire virtual try-on studio supporting live webcam and photo upload, and an annual festival and monastic Cham dance calendar.

---

## Monorepo Architecture

```
SIH'25/
├── apps/
│   ├── web/                     # Next.js 15 (App Router) + Tailwind CSS + TanStack Query + PWA + Three.js
│   │   ├── public/              # PWA manifest, service workers, static assets
│   │   └── src/                 # App Router pages, components, hooks, services
│   └── server/                  # Node.js + Express + TypeScript API + Prisma ORM + WebSockets
│       ├── prisma/              # PostgreSQL schema and migrations
│       └── src/                 # Controllers, routes, middleware, data stores, tests
├── packages/
│   ├── shared/                  # Shared TypeScript types, DTO contracts, and constants
│   └── tsconfig/                # Shared TypeScript compiler configuration
├── .github/workflows/           # CI/CD pipelines (Lint, Typecheck, Test, Build)
├── .env.example                 # Global environment variables template
├── turbo.json                   # Turborepo task pipeline
└── package.json                 # Workspaces configuration
```

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS | High-performance responsive user interface |
| **State / Fetching** | TanStack React Query v5 | Offline caching and background synchronization |
| **PWA / Offline** | `@ducanh2912/next-pwa` (Workbox) | Service worker, cache strategies, installable PWA |
| **3D / Visualization** | Three.js | 360-degree spherical equirectangular monastery panorama viewer |
| **Mapping** | Leaflet, React-Leaflet | Offline-compatible geospatial maps and route visualizer |
| **Backend** | Node.js, Express, TypeScript | RESTful API services and domain logic |
| **Real-Time** | WebSockets (`ws`), Server-Sent Events | Live emergency alerts and proximity broadcasts |
| **Database** | PostgreSQL + Prisma ORM | Relational data persistence and schema migrations |
| **Monorepo** | npm Workspaces + Turborepo | Build caching, shared packages, and unified scripting |

---

## Quick Start

### 1. Prerequisites

- **Node.js**: `v20.0.0` or later
- **npm**: `v10.0.0` or later
- **PostgreSQL**: (Optional for development seed data, required for production persistence)

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

# Push schema to PostgreSQL database
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

---

## Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs all applications concurrently in development mode |
| `npm run build` | Builds all packages and Next.js / Express applications |
| `npm run test` | Runs all 23 automated unit and integration tests |
| `npm run lint` | Runs ESLint across all workspaces |
| `npm run typecheck` | Validates TypeScript types across the entire monorepo |
| `npm run db:generate` | Generates Prisma client types |
| `npm run db:push` | Synchronizes Prisma schema with database |
| `npm run db:studio` | Opens Prisma Studio GUI |

---

## License

Private / Smart India Hackathon 2025
