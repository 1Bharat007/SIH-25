import {
  PlaceSummary,
  MonasteryProfile,
  EmergencyContactSummary,
  OfflineFAQItem,
  SikkimDistrict,
} from '@sikkim-yatra/shared';

const DB_NAME = 'sikkim_yatra_offline_db_v1';
const DB_VERSION = 1;

export interface QueuedSyncAction {
  id: string;
  actionType: 'SOS_DISPATCH' | 'CHAT_QUERY' | 'PLACE_BOOKMARK' | 'OFFLINE_REPORT';
  endpoint: string;
  payload: Record<string, unknown>;
  timestamp: string;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  retryCount: number;
  errorMessage?: string;
}

export interface DownloadedRegionMeta {
  regionId: string;
  regionName: string;
  district: SikkimDistrict;
  downloadedAt: string;
  tileCount: number;
  placesCount: number;
  approxSizeBytes: number;
}

export interface MapTileRecord {
  key: string; // e.g. "osm_12_3050_1720"
  blob: Blob;
  mimeType: string;
  cachedAt: string;
}

let dbInstance: IDBDatabase | null = null;

export async function openOfflineDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is only accessible in browser runtime');
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Places Object Store
      if (!db.objectStoreNames.contains('places')) {
        const placeStore = db.createObjectStore('places', { keyPath: 'id' });
        placeStore.createIndex('slug', 'slug', { unique: true });
        placeStore.createIndex('district', 'district', { unique: false });
        placeStore.createIndex('category', 'category', { unique: false });
      }

      // 2. Monasteries Object Store
      if (!db.objectStoreNames.contains('monasteries')) {
        const monStore = db.createObjectStore('monasteries', { keyPath: 'id' });
        monStore.createIndex('slug', 'slug', { unique: true });
        monStore.createIndex('lineage', 'lineage', { unique: false });
      }

      // 3. Emergency Contacts Object Store
      if (!db.objectStoreNames.contains('emergency_contacts')) {
        const emStore = db.createObjectStore('emergency_contacts', { keyPath: 'id' });
        emStore.createIndex('district', 'district', { unique: false });
        emStore.createIndex('type', 'type', { unique: false });
      }

      // 4. Offline FAQs Object Store
      if (!db.objectStoreNames.contains('offline_faqs')) {
        const faqStore = db.createObjectStore('offline_faqs', { keyPath: 'id' });
        faqStore.createIndex('category', 'category', { unique: false });
      }

      // 5. Map Tiles Object Store
      if (!db.objectStoreNames.contains('map_tiles')) {
        db.createObjectStore('map_tiles', { keyPath: 'key' });
      }

      // 6. Background Sync Queue Object Store
      if (!db.objectStoreNames.contains('sync_queue')) {
        const queueStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
        queueStore.createIndex('status', 'status', { unique: false });
        queueStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 7. Downloaded Regions Meta Object Store
      if (!db.objectStoreNames.contains('downloaded_regions')) {
        db.createObjectStore('downloaded_regions', { keyPath: 'regionId' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

// -----------------------------------------------------------------------------
// GENERIC IDB OPERATIONS
// -----------------------------------------------------------------------------

export async function idbPut<T>(storeName: string, item: T): Promise<void> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function idbPutBatch<T>(storeName: string, items: T[]): Promise<void> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    for (const item of items) {
      store.put(item);
    }
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function idbGet<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function idbGetAll<T>(storeName: string): Promise<T[]> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result || []) as T[]);
    req.onerror = () => reject(req.error);
  });
}

export async function idbDelete(storeName: string, key: IDBValidKey): Promise<void> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function idbClear(storeName: string): Promise<void> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// -----------------------------------------------------------------------------
// PLACES & DATA CACHING
// -----------------------------------------------------------------------------

export async function cacheOfflinePlaces(places: PlaceSummary[]): Promise<void> {
  return idbPutBatch('places', places);
}

export async function getOfflinePlaces(district?: string): Promise<PlaceSummary[]> {
  const places = await idbGetAll<PlaceSummary>('places');
  if (district && district !== 'all') {
    return places.filter((p) => p.district === district);
  }
  return places;
}

export async function getOfflinePlaceBySlug(slug: string): Promise<PlaceSummary | undefined> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['places'], 'readonly');
    const store = transaction.objectStore('places');
    const index = store.index('slug');
    const req = index.get(slug);
    req.onsuccess = () => resolve(req.result as PlaceSummary | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function cacheOfflineMonasteries(monasteries: MonasteryProfile[]): Promise<void> {
  return idbPutBatch('monasteries', monasteries);
}

export async function getOfflineMonasteries(): Promise<MonasteryProfile[]> {
  return idbGetAll<MonasteryProfile>('monasteries');
}

export async function cacheOfflineEmergencyContacts(contacts: EmergencyContactSummary[]): Promise<void> {
  return idbPutBatch('emergency_contacts', contacts);
}

export async function getOfflineEmergencyContacts(): Promise<EmergencyContactSummary[]> {
  return idbGetAll<EmergencyContactSummary>('emergency_contacts');
}

export async function cacheOfflineFAQs(faqs: OfflineFAQItem[]): Promise<void> {
  return idbPutBatch('offline_faqs', faqs);
}

export async function getOfflineFAQs(): Promise<OfflineFAQItem[]> {
  return idbGetAll<OfflineFAQItem>('offline_faqs');
}

// -----------------------------------------------------------------------------
// MAP TILES CACHING
// -----------------------------------------------------------------------------

export async function saveOfflineMapTile(key: string, blob: Blob): Promise<void> {
  const record: MapTileRecord = {
    key,
    blob,
    mimeType: blob.type || 'image/png',
    cachedAt: new Date().toISOString(),
  };
  return idbPut('map_tiles', record);
}

export async function getOfflineMapTile(key: string): Promise<Blob | undefined> {
  const record = await idbGet<MapTileRecord>('map_tiles', key);
  return record?.blob;
}

// -----------------------------------------------------------------------------
// BACKGROUND SYNC QUEUE OPERATIONS
// -----------------------------------------------------------------------------

export async function enqueueSyncAction(action: Omit<QueuedSyncAction, 'id' | 'timestamp' | 'status' | 'retryCount'>): Promise<QueuedSyncAction> {
  const item: QueuedSyncAction = {
    ...action,
    id: `sync-action-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
    retryCount: 0,
  };
  await idbPut('sync_queue', item);
  return item;
}

export async function getPendingSyncActions(): Promise<QueuedSyncAction[]> {
  const all = await idbGetAll<QueuedSyncAction>('sync_queue');
  return all.filter((a) => a.status === 'pending' || a.status === 'failed');
}

export async function updateSyncAction(item: QueuedSyncAction): Promise<void> {
  return idbPut('sync_queue', item);
}

export async function removeSyncAction(id: string): Promise<void> {
  return idbDelete('sync_queue', id);
}

// -----------------------------------------------------------------------------
// REGIONAL PRE-DOWNLOAD METADATA
// -----------------------------------------------------------------------------

export async function saveDownloadedRegionMeta(meta: DownloadedRegionMeta): Promise<void> {
  return idbPut('downloaded_regions', meta);
}

export async function getDownloadedRegionsMeta(): Promise<DownloadedRegionMeta[]> {
  return idbGetAll<DownloadedRegionMeta>('downloaded_regions');
}

export async function removeDownloadedRegionMeta(regionId: string): Promise<void> {
  return idbDelete('downloaded_regions', regionId);
}

// -----------------------------------------------------------------------------
// STORAGE USAGE ESTIMATOR
// -----------------------------------------------------------------------------

export async function estimateOfflineStorageUsage(): Promise<{
  usageBytes: number;
  quotaBytes: number;
  usageMb: number;
  quotaMb: number;
  percentUsed: number;
}> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    const est = await navigator.storage.estimate();
    const usage = est.usage || 0;
    const quota = est.quota || 1;
    return {
      usageBytes: usage,
      quotaBytes: quota,
      usageMb: Number((usage / (1024 * 1024)).toFixed(2)),
      quotaMb: Number((quota / (1024 * 1024)).toFixed(2)),
      percentUsed: Number(((usage / quota) * 100).toFixed(1)),
    };
  }

  return {
    usageBytes: 0,
    quotaBytes: 0,
    usageMb: 0,
    quotaMb: 0,
    percentUsed: 0,
  };
}
