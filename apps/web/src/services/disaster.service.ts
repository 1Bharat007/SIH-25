import {
  ApiResponse,
  DisasterAlert,
  CreateAlertPayload,
  UpdateAlertPayload,
  SafeRouteDetour,
  SafeShelter,
  EvacuationGuideline,
  AlertProximityResult,
  SikkimDistrict,
  DisasterType,
} from '@sikkim-yatra/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchDisasterAlerts(filter: {
  status?: string;
  district?: string;
  severity?: string;
  active?: boolean;
} = {}): Promise<DisasterAlert[]> {
  const params = new URLSearchParams();
  if (filter.status) params.append('status', filter.status);
  if (filter.district) params.append('district', filter.district);
  if (filter.severity) params.append('severity', filter.severity);
  if (filter.active !== undefined) params.append('active', String(filter.active));

  const url = `${API_BASE}/alerts${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch alerts: ${res.statusText}`);
  const json: ApiResponse<DisasterAlert[]> = await res.json();
  return json.data || [];
}

export async function fetchAlertById(
  id: string
): Promise<{ alert: DisasterAlert; matchingDetour?: SafeRouteDetour }> {
  const res = await fetch(`${API_BASE}/alerts/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch alert ${id}: ${res.statusText}`);
  const json: ApiResponse<{ alert: DisasterAlert; matchingDetour?: SafeRouteDetour }> = await res.json();
  if (!json.data) throw new Error('No alert data received');
  return json.data;
}

export async function createDisasterAlert(payload: CreateAlertPayload): Promise<DisasterAlert> {
  const res = await fetch(`${API_BASE}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.message || 'Failed to create alert');
  }
  const json: ApiResponse<DisasterAlert> = await res.json();
  if (!json.data) throw new Error('No alert created');
  return json.data;
}

export async function updateDisasterAlert(
  id: string,
  payload: UpdateAlertPayload
): Promise<DisasterAlert> {
  const res = await fetch(`${API_BASE}/alerts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to update alert: ${res.statusText}`);
  const json: ApiResponse<DisasterAlert> = await res.json();
  if (!json.data) throw new Error('No updated alert data');
  return json.data;
}

export async function deleteDisasterAlert(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/alerts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete alert: ${res.statusText}`);
}

export async function fetchSafeRouteDetours(params: {
  alertId?: string;
  corridor?: string;
} = {}): Promise<SafeRouteDetour[]> {
  const query = new URLSearchParams();
  if (params.alertId) query.append('alertId', params.alertId);
  if (params.corridor) query.append('corridor', params.corridor);

  const res = await fetch(`${API_BASE}/alerts/detours${query.toString() ? `?${query.toString()}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch safe detours');
  const json: ApiResponse<SafeRouteDetour[]> = await res.json();
  return json.data || [];
}

export async function fetchDetourById(id: string): Promise<SafeRouteDetour> {
  const res = await fetch(`${API_BASE}/alerts/detours/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch detour ${id}`);
  const json: ApiResponse<SafeRouteDetour> = await res.json();
  if (!json.data) throw new Error('Detour not found');
  return json.data;
}

export async function fetchEvacuationGuidelines(
  hazardType?: DisasterType
): Promise<EvacuationGuideline[]> {
  const query = hazardType ? `?hazardType=${hazardType}` : '';
  const res = await fetch(`${API_BASE}/alerts/guidelines${query}`);
  if (!res.ok) throw new Error('Failed to fetch evacuation guidelines');
  const json: ApiResponse<EvacuationGuideline[] | EvacuationGuideline> = await res.json();
  if (Array.isArray(json.data)) return json.data;
  if (json.data) return [json.data];
  return [];
}

export async function fetchSafeShelters(
  lat?: number,
  lng?: number,
  district?: SikkimDistrict | 'all'
): Promise<(SafeShelter & { distanceKm?: number })[]> {
  const params = new URLSearchParams();
  if (lat !== undefined) params.append('lat', String(lat));
  if (lng !== undefined) params.append('lng', String(lng));
  if (district && district !== 'all') params.append('district', district);

  const res = await fetch(`${API_BASE}/alerts/shelters${params.toString() ? `?${params.toString()}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch safe shelters');
  const json: ApiResponse<(SafeShelter & { distanceKm?: number })[]> = await res.json();
  return json.data || [];
}

export async function checkAlertProximity(
  lat: number,
  lng: number
): Promise<AlertProximityResult> {
  const res = await fetch(`${API_BASE}/alerts/proximity?lat=${lat}&lng=${lng}`);
  if (!res.ok) throw new Error('Failed to check hazard proximity');
  const json: ApiResponse<AlertProximityResult> = await res.json();
  if (!json.data) throw new Error('No proximity result returned');
  return json.data;
}
