# Sikkim Yatra (Sikkimese Digital Tourism Platform)

> **Smart, Offline-First Digital Tourism & High-Altitude Disaster-Resilient Navigation Platform for Sikkim**  
> Developed for Smart India Hackathon 2025 (SIH'25) | Theme: Travel & Tourism / Heritage & Culture / Disaster Management

---

## 1. Problem Statement Alignment

- **Domain / Theme**: Travel & Tourism, Heritage & Culture, Disaster Management
- **Target Region**: State of Sikkim, India (High-Altitude Mountain Corridors across Gangtok, Mangan, Gyalshing, Namchi, Pakyong, and Soreng districts)
- **Problem Statement Description**:  
  High-altitude Himalayan tourism in Sikkim is burdened by three critical bottlenecks:
  1. **Cellular and Data Dropouts**: Extreme terrain causes frequent zero-connectivity blackouts in vital routes (North Sikkim Highway, Gurudongmar, Tsomgo Lake, Nathu La), rendering standard mapping and travel apps non-functional.
  2. **Unpredictable Mountain Hazards**: Monsoon landslides (e.g., NH10 29th Mile), glacial lake outburst floods (GLOFs), and winter blizzards block key transit arteries without real-time proximity alerts or safe detour routing.
  3. **Threat to Indigenous Monastic Heritage**: Sacred monastic histories, relic context, and traditional living culture (Bhutia, Lepcha, Nepali communities) lack interactive, modern digital curation for visiting pilgrims and tourists.

---

## 2. Solution Overview

**Sikkim Yatra** is a production-grade, full-stack Progressive Web Application (PWA) and backend platform that solves these challenges through:

- **Tiered Offline-First Architecture**: IndexedDB storage (`sikkim_yatra_offline_db_v1`) coupled with Workbox Service Worker caching to ensure 100% functionality for maps, place directories, monastery lore, and emergency contacts during connectivity dropouts.
- **Transactional Background Sync**: Queues offline distress SOS triggers, chatbot inquiries, and place bookmarks, automatically syncing them when network connectivity is restored.
- **Proactive Regional Pre-Downloading**: Dedicated control center for pre-caching regional data bundles and bounding-box tile pyramids before departing urban hubs.
- **Real-Time Mountain Disaster Management**: Instant WebSocket broadcasting, GPS-geofenced proximity hazard warnings, alternate mountain detour routing around blocked passes, and 72-hour survival evacuation protocols.
- **Persistent Safety & SOS Response Center**: One-tap emergency dispatch, automated Haversine distance calculations to nearest 24x7 police stations and trauma hospitals, and timed live location tracking.
- **Cultural Heritage & 360-Degree VR Pilgrimage**: Three.js WebGL spherical equirectangular monastery interior viewer with interactive 3D relic hotspots, traditional attire virtual try-on studio, and festival Cham dance calendar.
- **Multilingual AI Travel Companion**: Anthropic Claude API integration with dynamic location-grounding in English, Hindi, and Nepali, backed by an offline local Q&A fallback engine.

---

## 3. Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Next.js 15 PWA Client (apps/web)"]
        UI["React 19 Tailwind UI"]
        SW["Workbox Service Worker"]
        IDB[("IndexedDB Storage Engine")]
        BSQ["Background Sync Queue"]
        THREE["Three.js 360° VR Viewer"]
        MAP["Leaflet Map Engine"]
        
        UI --> MAP
        UI --> THREE
        UI --> BSQ
        BSQ --> IDB
        UI <--> IDB
        UI <--> SW
    end

    subgraph Network ["Network Boundary"]
        REST["REST API (HTTP/2)"]
        WS["WebSocket Stream (/ws/alerts)"]
        CLAUDE["Anthropic Claude API (LLM)"]
    end

    subgraph Backend ["Node.js Express Server (apps/server)"]
        API["Express API Routing Layer"]
        AUTH["NextAuth + JWT Session Guard"]
        GEO["Haversine Geofencing Engine"]
        DETOUR["Safe Alternate Detour Matcher"]
        ALERT_HUB["WebSocket Broadcast Hub"]
        PRISMA["Prisma ORM 6.x"]
        
        API --> AUTH
        API --> GEO
        API --> DETOUR
        API --> ALERT_HUB
        API --> PRISMA
        API --> CLAUDE
    end

    subgraph Database ["Persistence Layer"]
        PG[("PostgreSQL Database")]
        PRISMA --> PG
    end

    SW <--> REST
    REST <--> API
    UI <--> WS
    WS <--> ALERT_HUB
```

---

## 4. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router), React 19 | High-performance server/client rendered UI |
| **Styling & Design** | Tailwind CSS, Lucide Icons | Clean, dark glassmorphism aesthetic |
| **State & Cache** | TanStack React Query v5 | Server state caching, optimistic updates |
| **Offline Storage** | IndexedDB, Workbox PWA | Tile caching, offline database, background queue |
| **3D / VR** | Three.js WebGL | 360-degree spherical monastery panorama tours |
| **Mapping Engine** | Leaflet, React-Leaflet | Raster map layer explorer, detour visualizer |
| **Backend API** | Node.js 20+, Express.js 4.x, TypeScript 5.7 | RESTful micro-services and domain logic |
| **Real-Time** | Native WebSockets (`ws`), Server-Sent Events | Live hazard broadcast and telemetry sharing |
| **AI LLM** | Anthropic Claude SDK (`@anthropic-ai/sdk`) | Multilingual, location-grounded companion |
| **ORM & Database** | Prisma ORM 6.4, PostgreSQL | Relational schema and migrations |
| **Monorepo Engine** | Turborepo, npm Workspaces | Incremental builds, shared TypeScript presets |

---

## 5. Monorepo Structure

```
SIH'25/
├── apps/
│   ├── web/                          # Next.js 15 PWA Frontend
│   │   ├── public/                   # Manifest, icons, service worker
│   │   └── src/
│   │       ├── app/                  # App Router pages (explore, safety, disaster, culture, offline-settings)
│   │       ├── components/           # UI components (map, safety, disaster, culture, chat, offline)
│   │       ├── hooks/                # React hooks (useNetworkSync, useAIChatCompanion, useRealtimeAlerts)
│   │       ├── lib/                  # IndexedDB engine, API client, auth configuration
│   │       └── services/             # API and offline caching services
│   └── server/                       # Express Node.js Backend API
│       ├── prisma/                   # PostgreSQL schema and seed script
│       └── src/
│           ├── controllers/          # Business logic (places, safety, alerts, culture, chat)
│           ├── data/                 # Seed data and offline knowledge bases
│           ├── routes/               # Express routing
│           └── __tests__/            # Automated test suite (27 passing tests)
├── packages/
│   ├── shared/                       # Zero-drift TypeScript contracts and DTOs
│   └── tsconfig/                     # Shared TypeScript presets
├── .github/workflows/                # GitHub Actions CI workflow
├── OFFLINE_ARCHITECTURE.md           # Deep-dive offline specification
├── LICENSE                           # MIT License
├── package.json                      # Workspace configuration
└── turbo.json                        # Turborepo task pipeline
```

---

## 6. Local Setup & Quick Start

### Prerequisites
- Node.js `v20.0.0` or higher
- npm `v10.0.0` or higher
- PostgreSQL (Optional for initial development; seed mocks run out of the box)

### Installation
```bash
# Clone the repository
git clone https://github.com/1Bharat007/SIH-25.git
cd SIH-25

# Install all workspace dependencies
npm install

# Copy environment variable templates
cp .env.example .env
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env.local
```

### Database Setup
```bash
# Generate Prisma Client types
npm run db:generate

# Push schema to PostgreSQL database (if running)
npm run db:push
```

### Running Locally
```bash
# Start Web (Next.js) and Server (Express) concurrently
npm run dev

# Or run individual apps:
npm run dev:web       # Next.js Frontend on http://localhost:3000
npm run dev:server    # Express API on http://localhost:5000
```

### Automated Testing & Linting
```bash
# Run all 27 unit and integration tests
npm run test

# Validate TypeScript types across all 3 packages
npm run typecheck

# Run ESLint across monorepo
npm run lint
```

---

## 7. Production Deployment Plan

### Architecture Overview

```
[Vercel Global Edge Network] ──(HTTPS)──> Next.js 15 PWA Client (apps/web)
                                                  │
                                                  ├──(REST & WebSocket)──> [Railway / Render] Express Server (apps/server)
                                                  │                                │
                                                  └──(Cache)                       └──> [Neon / Supabase] PostgreSQL DB
                                                      IndexedDB + ServiceWorker
```

### Step 1: Database Deployment (Neon / Supabase / Railway Postgres)
1. Provision a managed PostgreSQL instance on **Neon** (https://neon.tech) or **Supabase** (https://supabase.com).
2. Obtain the connection string URI: `postgresql://user:password@host:5432/sikkim_yatra?sslmode=require`.

### Step 2: Backend API Deployment (Railway or Render)
1. Link your GitHub repository to **Railway** (https://railway.app) or **Render** (https://render.com).
2. Set Root Directory to `apps/server`.
3. Set Build Command: `npm install && npm run build`.
4. Set Start Command: `npm run start` (starts `node dist/index.js`).
5. Configure Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `CORS_ORIGIN`: Your production frontend domain (e.g., `https://sikkim-yatra.vercel.app`)
   - `JWT_SECRET`: A secure random 64-character secret
   - `ANTHROPIC_API_KEY`: Your Anthropic Claude API Key

### Step 3: Frontend PWA Deployment (Vercel)
1. Import the repository into **Vercel** (https://vercel.com).
2. Set Root Directory to `apps/web`.
3. Framework Preset: **Next.js**.
4. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-api.railway.app/api/v1`
   - `NEXTAUTH_URL`: `https://sikkim-yatra.vercel.app`
   - `NEXTAUTH_SECRET`: Same secure secret as backend
5. Click **Deploy**. Vercel will build the production bundle and deploy service workers globally.

---

## 8. Final Feature Checklist vs. Problem Statement

| Problem Area | Feature Implemented | Module / File Location | Status |
| :--- | :--- | :--- | :--- |
| **Connectivity Blackouts** | IndexedDB Storage & Workbox Cache | `apps/web/src/lib/indexed-db.ts`, `next.config.mjs` | Verified |
| **Offline Actions** | Transactional Background Sync Queue | `apps/web/src/services/sync-queue.service.ts` | Verified |
| **Remote Travel Prep** | Regional Data & Map Pre-Download Center | `apps/web/src/app/offline-settings/page.tsx` | Verified |
| **High-Altitude Disasters** | Real-Time WebSocket Alerts & Geofencing | `apps/web/src/app/disaster/page.tsx`, `alerts.controller.ts` | Verified |
| **Blocked Mountain Passes** | Dynamic Safe Alternate Detour Routing | `apps/web/src/components/disaster/SafeRouteNavigationModal.tsx` | Verified |
| **Disaster Survival** | 72-Hour Evacuation Protocols & Relief Camps | `apps/server/src/data/disaster-data.ts` | Verified |
| **Traveler Distress** | Persistent Floating SOS with GPS Dispatch | `apps/web/src/components/safety/FloatingSOSButton.tsx` | Verified |
| **Emergency Directory** | Haversine Nearest Police & Hospital Lookup | `apps/server/src/controllers/safety.controller.ts` | Verified |
| **Monastery Preservation** | Three.js WebGL 360° Panorama Viewer | `apps/web/src/components/culture/PanoramaViewer360.tsx` | Verified |
| **Living Culture** | Traditional Attire AR Try-On Studio | `apps/web/src/components/culture/AttireTryOnStudio.tsx` | Verified |
| **Sacred Calendar** | Lunar Festival & Cham Dance Tracker | `apps/web/src/components/culture/FestivalCalendar.tsx` | Verified |
| **Smart Assistance** | Multilingual Claude AI Chat Companion | `apps/web/src/components/chat/AIChatCompanionWidget.tsx` | Verified |
| **Multilingual UX** | Native English, Hindi, and Nepali Support | `apps/server/src/controllers/chat.controller.ts` | Verified |

---

## 9. Team & Credits

- **Project Lead & Full-Stack Architect**: Bharat Bhushan
- **Hackathon**: Smart India Hackathon 2025 (SIH'25)
- **Domain Partners**: Government of Sikkim (Department of Tourism & Civil Aviation) & Ministry of Tourism, Government of India
- **Repository**: [https://github.com/1Bharat007/SIH-25](https://github.com/1Bharat007/SIH-25)

---

## 10. License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
