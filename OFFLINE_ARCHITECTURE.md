# Sikkim Yatra - Offline-First Architecture & Engineering Specification

## 1. Executive Summary & Problem Context

High-altitude Himalayan travel in Sikkim is characterized by frequent, unpredictable cellular and data connectivity dropouts. Critical transit corridors such as the North Sikkim Highway (Chungthang - Lachen - Gurudongmar), JN Marg (Gangtok - Tsomgo - Nathu La), and Dzongri trekking routes routinely experience 0-bar network blackouts.

Traditional travel applications fail completely under these conditions. Sikkim Yatra implements a **Tiered Offline-First Architecture** designed to ensure that 100% of safety-critical navigation, emergency directories, monastic cultural guides, and AI chatbot knowledge remain operational without active internet.

---

## 2. Multi-Tier Storage Architecture

The platform partitions data across three specialized browser storage tiers:

```
+-------------------------------------------------------------------------+
|                          SIKKIM YATRA CLIENT                            |
+-------------------------------------------------------------------------+
       |                                      |                     |
       v                                      v                     v
+-----------------------+           +-------------------+   +-------------+
|    TIER 1: WORKBOX    |           | TIER 2: INDEXEDDB |   |   TIER 3:   |
|     CACHE STORAGE     |           | (sikkim_yatra_db) |   | LOCALSTORAGE|
+-----------------------+           +-------------------+   +-------------+
| • OSM / Carto Tiles   |           | • Places Store    |   | • Language  |
| • Next.js App Shell   |           | • Monasteries     |   | • Flags     |
| • Font & Icon Bundles |           | • Emergency Posts |   | • Auth Token|
| • API JSON Fallbacks  |           | • Tile Blobs      |   +-------------+
+-----------------------+           | • Sync Queue      |
                                    | • Region Metadata |
                                    +-------------------+
```

### Tier 1: Service Worker & Workbox Cache Storage
Managed via `@ducanh2912/next-pwa` in `apps/web/next.config.mjs`:
- **Map Tiles (`osm-map-tiles-v1` & `carto-map-tiles-v1`)**:
  - Strategy: `CacheFirst`
  - Scope: `https://*.tile.openstreetmap.org/*` and `https://*.basemaps.cartocdn.com/*`
  - Expiration: Max 2,500 tiles, 30-day Time-To-Live (TTL).
- **API Endpoints (`sikkim-api-cache-v1`)**:
  - Strategy: `NetworkFirst` (3-second network timeout with automatic fallback to cache).
  - Scope: `/api/v1/places`, `/api/v1/culture/*`, `/api/v1/safety/*`, `/api/v1/alerts`, `/api/v1/chat/offline-kb`.
  - Expiration: Max 300 entries, 7-day TTL.
- **Static Assets & Fonts (`sikkim-static-images-v1`, `sikkim-static-fonts-v1`)**:
  - Strategy: `CacheFirst` (60-day TTL).

### Tier 2: IndexedDB Engine (`sikkim_yatra_offline_db_v1`)
Managed via `apps/web/src/lib/indexed-db.ts`:
- `places`: Full place profiles indexed by `id`, `slug`, `district`, and `category`.
- `monasteries`: Monastic lineages, relic catalogs, and sacred etiquette codes.
- `emergency_contacts`: Police stations, trauma hospitals, and relief shelters with GPS coordinates.
- `offline_faqs`: Multilingual FAQ knowledge base (English, Hindi, Nepali).
- `map_tiles`: Binary raster image blobs keyed by tile coordinates (`osm_{z}_{x}_{y}`).
- `sync_queue`: Transactional action queue for offline write operations.
- `downloaded_regions`: Metadata records tracking pre-downloaded regional packages.

### Tier 3: LocalStorage
- User language preference (`sikkim_user_chat_lang`).
- Onboarding status flags (`sikkim_chat_lang_prompted`).
- Cached recent conversation history snippet (`sikkim_chat_history_v1`).

---

## 3. Background Sync Queue & Offline Mutation Protocol

When the user performs write actions without network connectivity, actions are not dropped. Instead, they enter the IndexedDB transactional `sync_queue`.

### Supported Queued Action Types:
1. `SOS_DISPATCH`: Emergency distress triggers sent while out of cellular range.
2. `CHAT_QUERY`: Travel inquiries submitted to the AI companion.
3. `PLACE_BOOKMARK`: Saved travel itineraries and destination bookmarks.
4. `OFFLINE_REPORT`: Road hazard and weather condition reports.

### Queue Processing Flow:
```
[User Action Taken Offline]
            │
            ▼
[Enqueue to IndexedDB: sync_queue (status: 'pending')]
            │
            ▼
[OfflineStatusBanner displays pending badge: "X actions queued"]
            │
            ▼
[Browser Event: 'online' fires OR User clicks 'Sync Now']
            │
            ▼
[flushSyncQueue() processes queue FIFO]
            │
    ┌───────┴───────┐
    ▼               ▼
[HTTP 200 OK]    [Network Error]
    │               │
    ▼               ▼
[Remove from     [Increment retryCount,
 sync_queue]      keep status: 'failed']
```

---

## 4. Proactive Regional Pre-Download Subsystem

Travelers can pre-download regional data bundles before departing urban centers (e.g. Gangtok or Siliguri) via the `/offline-settings` management panel.

### Available Regional Packages:

| Region Bundle | Target District | Bounding Box [Lat, Lng] | Tile Zoom Range | Approx Size |
| :--- | :--- | :--- | :--- | :--- |
| **North Sikkim** | Mangan | `[27.50, 88.40]` to `[28.02, 88.75]` | Zooms 10–12 | ~8.5 MB |
| **Gangtok & East Sikkim** | Gangtok / Pakyong | `[27.25, 88.52]` to `[27.42, 88.82]` | Zooms 10–13 | ~12.0 MB |
| **West Sikkim** | Gyalshing / Soreng | `[27.20, 88.18]` to `[27.40, 88.38]` | Zooms 10–12 | ~7.2 MB |
| **South Sikkim** | Namchi | `[27.12, 88.32]` to `[27.32, 88.52]` | Zooms 10–12 | ~6.8 MB |

### Pre-Download Execution Algorithm:
1. Synchronizes place records, homestays, and craft vendors for the district into IndexedDB.
2. Caches monastery histories, relic descriptions, and etiquette codes into IndexedDB.
3. Preloads emergency contacts, hospital coordinates, and police posts into IndexedDB.
4. Converts geographic bounding boxes into Slippy Map tile coordinates ($x, y, z$).
5. Fetches raster tile images with controlled batch concurrency (4 parallel requests) and stores them as binary blobs in IndexedDB.
6. Records `DownloadedRegionMeta` and updates the real-time storage quota estimator.

---

## 5. Visual Indicators & User Feedback

1. **Top-Level Status Banner (`OfflineStatusBanner.tsx`)**:
   - Amber alert bar rendered when offline: *"Offline Mode Active: Serving places and emergency data from local IndexedDB cache."*
   - Badges showing exact number of queued pending actions.
   - One-tap "Sync Now" button when connection is restored.
2. **In-Chat Source Indicator**:
   - Chatbot messages indicate whether answers were generated live via `Claude AI Grounded` or served from `Offline Local Cache`.
3. **Storage Usage Meter (`/offline-settings`)**:
   - Real-time display of MBs consumed versus browser quota limits.

---

## 6. Known Limitations & Fallback Strategies

1. **Live WebSocket Alerts**:
   - WebSockets require active TCP connections. While offline, the app displays the last known cached hazard advisories. New alerts are received immediately upon network reconnection.
2. **Browser Storage Eviction**:
   - Mobile browsers under low-disk-space conditions may evict cache data. To minimize eviction risk, the app uses persistent IndexedDB storage where supported.
3. **Deep 360° High-Resolution VR Panoramas**:
   - 360° equirectangular HDR images are large (~5-15MB each). The offline package caches essential hotspot metadata and lightweight preview textures; full 4K panoramas are progressively streamed when connected.
