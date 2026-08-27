import {
  SikkimDistrict,
  PlaceSummary,
  MonasteryProfile,
  EmergencyContactSummary,
  OfflineFAQItem,
  ApiResponse,
} from '@sikkim-yatra/shared';
import {
  cacheOfflinePlaces,
  cacheOfflineMonasteries,
  cacheOfflineEmergencyContacts,
  cacheOfflineFAQs,
  saveOfflineMapTile,
  saveDownloadedRegionMeta,
  getDownloadedRegionsMeta,
  removeDownloadedRegionMeta,
  DownloadedRegionMeta,
} from '../lib/indexed-db';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface RegionalBundleConfig {
  id: string;
  name: string;
  district: SikkimDistrict;
  description: string;
  estimatedMb: number;
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  zoomRange: [number, number];
  highlights: string[];
}

export const REGIONAL_BUNDLES: RegionalBundleConfig[] = [
  {
    id: 'region-north-sikkim',
    name: 'North Sikkim (Mangan & High Valleys)',
    district: 'Mangan',
    description:
      'Lachen, Lachung, Gurudongmar Lake, Yumthang Valley, Zero Point, and high-altitude mountain passes.',
    estimatedMb: 8.5,
    bounds: {
      minLat: 27.5,
      maxLat: 28.02,
      minLng: 88.4,
      maxLng: 88.75,
    },
    zoomRange: [10, 12],
    highlights: [
      'Gurudongmar High-Altitude Safety Guide',
      'Yumthang Valley & Lachen Staging Map',
      'Mangan Emergency & Police Contacts',
      'Chungthang Road Closure Bypass Data',
    ],
  },
  {
    id: 'region-east-sikkim',
    name: 'Gangtok & East Sikkim (JN Marg Corridor)',
    district: 'Gangtok',
    description:
      'MG Marg, Rumtek Dharma Chakra Centre, Tsomgo Lake, Nathu La border pass, and Pakyong Airport.',
    estimatedMb: 12.0,
    bounds: {
      minLat: 27.25,
      maxLat: 27.42,
      minLng: 88.52,
      maxLng: 88.82,
    },
    zoomRange: [10, 13],
    highlights: [
      'Rumtek 360 Monastery Interior Hotspots',
      'Nathu La & Tsomgo Permit Verification Docs',
      'STNM State Hospital 24x7 Trauma Guide',
      'Gangtok Sadar Police Directory',
    ],
  },
  {
    id: 'region-west-sikkim',
    name: 'West Sikkim (Pelling & Heritage Triangle)',
    district: 'Gyalshing',
    description:
      'Pelling, Pemayangtse Monastery, Yuksom Coronation Throne, Tashiding Holy Hill, and Rabdentse Ruins.',
    estimatedMb: 7.2,
    bounds: {
      minLat: 27.2,
      maxLat: 27.4,
      minLng: 88.18,
      maxLng: 88.38,
    },
    zoomRange: [10, 12],
    highlights: [
      'Pemayangtse Monastery & Sangtokpalri Guide',
      'Yuksom Historical Trekking Corridors',
      'Gyalshing District Hospital Contacts',
      'Local Homestay & Craft Vendor Network',
    ],
  },
  {
    id: 'region-south-sikkim',
    name: 'South Sikkim (Namchi & Ravangla)',
    district: 'Namchi',
    description:
      'Char Dham Pilgrimage Complex, Samdruptse Giant Guru Statue, Buddha Park Ravangla, and Temi Tea Estate.',
    estimatedMb: 6.8,
    bounds: {
      minLat: 27.12,
      maxLat: 27.32,
      minLng: 88.32,
      maxLng: 88.52,
    },
    zoomRange: [10, 12],
    highlights: [
      'Char Dham & Samdruptse Cultural Guide',
      'Ravangla Buddha Park Tour Guide',
      'Namchi District Hospital Contacts',
      'Tea Garden Eco-Trails Map',
    ],
  },
];

// -----------------------------------------------------------------------------
// TILE COORDINATE MATH
// -----------------------------------------------------------------------------

function long2tile(lon: number, zoom: number): number {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function lat2tile(lat: number, zoom: number): number {
  return Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
}

// -----------------------------------------------------------------------------
// DOWNLOAD ENGINE
// -----------------------------------------------------------------------------

export async function downloadRegionalBundle(
  config: RegionalBundleConfig,
  onProgress?: (percent: number, statusText: string) => void
): Promise<DownloadedRegionMeta> {
  onProgress?.(5, `Connecting and synchronizing metadata for ${config.name}...`);

  let placesCount = 0;
  let approxBytes = 0;

  // 1. Fetch & Store Places for the District
  try {
    const placesRes = await fetch(`${API_BASE}/places?district=${config.district}`);
    if (placesRes.ok) {
      const pJson: ApiResponse<PlaceSummary[]> = await placesRes.json();
      if (pJson.data && Array.isArray(pJson.data)) {
        await cacheOfflinePlaces(pJson.data);
        placesCount = pJson.data.length;
        approxBytes += JSON.stringify(pJson.data).length;
      }
    }
  } catch (err) {
    console.warn('[RegionDownload] Places fetch error:', err);
  }

  onProgress?.(25, 'Caching monastery histories and 360 hotspots...');

  // 2. Fetch & Store Monasteries
  try {
    const monRes = await fetch(`${API_BASE}/culture/monasteries`);
    if (monRes.ok) {
      const mJson: ApiResponse<MonasteryProfile[]> = await monRes.json();
      if (mJson.data && Array.isArray(mJson.data)) {
        await cacheOfflineMonasteries(mJson.data);
        approxBytes += JSON.stringify(mJson.data).length;
      }
    }
  } catch (err) {
    console.warn('[RegionDownload] Monasteries fetch error:', err);
  }

  onProgress?.(40, 'Caching 24x7 emergency contacts and hospital coordinates...');

  // 3. Fetch & Store Emergency Contacts & Helplines
  try {
    const emRes = await fetch(`${API_BASE}/safety/emergency-contacts`);
    if (emRes.ok) {
      const eJson: ApiResponse<EmergencyContactSummary[]> = await emRes.json();
      if (eJson.data && Array.isArray(eJson.data)) {
        await cacheOfflineEmergencyContacts(eJson.data);
        approxBytes += JSON.stringify(eJson.data).length;
      }
    }
  } catch (err) {
    console.warn('[RegionDownload] Emergency contacts fetch error:', err);
  }

  // 4. Fetch & Store Chatbot Offline FAQ Knowledge Base
  try {
    const faqRes = await fetch(`${API_BASE}/chat/offline-kb`);
    if (faqRes.ok) {
      const fJson: ApiResponse<OfflineFAQItem[]> = await faqRes.json();
      if (fJson.data && Array.isArray(fJson.data)) {
        await cacheOfflineFAQs(fJson.data);
        approxBytes += JSON.stringify(fJson.data).length;
      }
    }
  } catch (err) {
    console.warn('[RegionDownload] FAQs fetch error:', err);
  }

  onProgress?.(55, 'Generating raster map tile pyramid...');

  // 5. Download Map Tiles for the Region's Bounding Box
  const [minZoom, maxZoom] = config.zoomRange;
  const tileCoords: Array<{ z: number; x: number; y: number }> = [];

  for (let z = minZoom; z <= maxZoom; z++) {
    const minX = long2tile(config.bounds.minLng, z);
    const maxX = long2tile(config.bounds.maxLng, z);
    const minY = lat2tile(config.bounds.maxLat, z);
    const maxY = lat2tile(config.bounds.minLat, z);

    for (let x = Math.min(minX, maxX); x <= Math.max(minX, maxX); x++) {
      for (let y = Math.min(minY, maxY); y <= Math.max(minY, maxY); y++) {
        tileCoords.push({ z, x, y });
      }
    }
  }

  const totalTiles = tileCoords.length;
  let downloadedTiles = 0;

  // Fetch in concurrency-controlled batches
  const BATCH_SIZE = 4;
  for (let i = 0; i < tileCoords.length; i += BATCH_SIZE) {
    const batch = tileCoords.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (coord) => {
        const key = `osm_${coord.z}_${coord.x}_${coord.y}`;
        const subdomains = ['a', 'b', 'c'];
        const s = subdomains[(coord.x + coord.y) % 3];
        const tileUrl = `https://${s}.tile.openstreetmap.org/${coord.z}/${coord.x}/${coord.y}.png`;

        try {
          const res = await fetch(tileUrl, { mode: 'cors' });
          if (res.ok) {
            const blob = await res.blob();
            await saveOfflineMapTile(key, blob);
            approxBytes += blob.size;
          }
        } catch {
          // If tile fetch fails, continue without blocking
        } finally {
          downloadedTiles += 1;
        }
      })
    );

    const percent = Math.min(95, Math.round(55 + (downloadedTiles / Math.max(1, totalTiles)) * 40));
    onProgress?.(percent, `Cached ${downloadedTiles}/${totalTiles} map tiles...`);
  }

  const meta: DownloadedRegionMeta = {
    regionId: config.id,
    regionName: config.name,
    district: config.district,
    downloadedAt: new Date().toISOString(),
    tileCount: downloadedTiles,
    placesCount,
    approxSizeBytes: approxBytes || Math.round(config.estimatedMb * 1024 * 1024),
  };

  await saveDownloadedRegionMeta(meta);

  onProgress?.(100, `Successfully downloaded bundle for ${config.name}!`);
  return meta;
}

export async function deleteRegionalBundle(regionId: string): Promise<void> {
  await removeDownloadedRegionMeta(regionId);
}

export async function listDownloadedRegions(): Promise<DownloadedRegionMeta[]> {
  return getDownloadedRegionsMeta();
}
