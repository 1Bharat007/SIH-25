import {
  ApiResponse,
  MonasteryProfile,
  PanoramaScene,
  TraditionalAttire,
  SikkimFestival,
  MonasteryLineage,
  SikkimeseCommunity,
} from '@sikkim-yatra/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchMonasteries(filter: {
  lineage?: MonasteryLineage | 'all';
  district?: string;
  search?: string;
} = {}): Promise<MonasteryProfile[]> {
  const params = new URLSearchParams();
  if (filter.lineage && filter.lineage !== 'all') params.append('lineage', filter.lineage);
  if (filter.district && filter.district !== 'all') params.append('district', filter.district);
  if (filter.search) params.append('search', filter.search);

  const res = await fetch(`${API_BASE}/culture/monasteries${params.toString() ? `?${params.toString()}` : ''}`);
  if (!res.ok) throw new Error(`Failed to fetch monasteries: ${res.statusText}`);
  const json: ApiResponse<MonasteryProfile[]> = await res.json();
  return json.data || [];
}

export async function fetchMonasteryBySlug(
  slug: string
): Promise<{ monastery: MonasteryProfile; panoramaScene?: PanoramaScene }> {
  const res = await fetch(`${API_BASE}/culture/monasteries/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch monastery ${slug}`);
  const json: ApiResponse<{ monastery: MonasteryProfile; panoramaScene?: PanoramaScene }> = await res.json();
  if (!json.data) throw new Error('Monastery data not found');
  return json.data;
}

export async function fetchPanoramaScenes(): Promise<PanoramaScene[]> {
  const res = await fetch(`${API_BASE}/culture/panoramas`);
  if (!res.ok) throw new Error('Failed to fetch 360 panorama scenes');
  const json: ApiResponse<PanoramaScene[]> = await res.json();
  return json.data || [];
}

export async function fetchPanoramaById(id: string): Promise<PanoramaScene> {
  const res = await fetch(`${API_BASE}/culture/panoramas/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch panorama scene ${id}`);
  const json: ApiResponse<PanoramaScene> = await res.json();
  if (!json.data) throw new Error('Panorama scene not found');
  return json.data;
}

export async function fetchTraditionalAttire(filter: {
  community?: SikkimeseCommunity | 'all';
  gender?: string;
} = {}): Promise<TraditionalAttire[]> {
  const params = new URLSearchParams();
  if (filter.community && filter.community !== 'all') params.append('community', filter.community);
  if (filter.gender && filter.gender !== 'all') params.append('gender', filter.gender);

  const res = await fetch(`${API_BASE}/culture/attire${params.toString() ? `?${params.toString()}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch traditional attire');
  const json: ApiResponse<TraditionalAttire[]> = await res.json();
  return json.data || [];
}

export async function fetchFestivals(filter: {
  community?: string;
  month?: string;
  search?: string;
} = {}): Promise<SikkimFestival[]> {
  const params = new URLSearchParams();
  if (filter.community && filter.community !== 'all') params.append('community', filter.community);
  if (filter.month && filter.month !== 'all') params.append('month', filter.month);
  if (filter.search) params.append('search', filter.search);

  const res = await fetch(`${API_BASE}/culture/festivals${params.toString() ? `?${params.toString()}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch festival calendar');
  const json: ApiResponse<SikkimFestival[]> = await res.json();
  return json.data || [];
}
