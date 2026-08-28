import {
  SOSDispatchPayload,
  SOSDispatchResult,
  NearestEmergencyLookupResult,
  LiveLocationSession,
  SafetyRouteZone,
  SafetyRoutesFilterParams,
} from '@sikkim-yatra/shared';
import { fetchApi } from '../lib/api-client';

export const safetyService = {
  async dispatchSOS(payload: SOSDispatchPayload): Promise<SOSDispatchResult> {
    return fetchApi<SOSDispatchResult>('/safety/sos', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getNearestEmergency(lat: number, lng: number): Promise<NearestEmergencyLookupResult> {
    return fetchApi<NearestEmergencyLookupResult>(`/safety/nearest?lat=${lat}&lng=${lng}`);
  },

  async startLiveLocation(data: {
    userId?: string;
    userName?: string;
    latitude: number;
    longitude: number;
    altitudeMeters?: number;
    accuracyMeters?: number;
    batteryLevel?: number;
    durationMinutes?: number;
  }): Promise<LiveLocationSession> {
    return fetchApi<LiveLocationSession>('/safety/live-location/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async createLiveLocationSession(data: {
    userId?: string;
    userName?: string;
    latitude: number;
    longitude: number;
    altitudeMeters?: number;
    accuracyMeters?: number;
    batteryLevel?: number;
    durationMinutes?: number;
  }): Promise<LiveLocationSession> {
    return this.startLiveLocation(data);
  },

  async getLiveLocation(token: string): Promise<LiveLocationSession> {
    return fetchApi<LiveLocationSession>(`/safety/live-location/${token}`);
  },

  async updateLiveLocation(
    token: string,
    coords: {
      latitude: number;
      longitude: number;
      altitudeMeters?: number;
      accuracyMeters?: number;
      batteryLevel?: number;
    }
  ): Promise<LiveLocationSession> {
    return fetchApi<LiveLocationSession>(`/safety/live-location/${token}/update`, {
      method: 'POST',
      body: JSON.stringify(coords),
    });
  },

  async endLiveLocationSession(token: string): Promise<LiveLocationSession> {
    return fetchApi<LiveLocationSession>(`/safety/live-location/${token}/end`, {
      method: 'POST',
    });
  },

  async getSafetyRoutes(params: SafetyRoutesFilterParams = {}): Promise<SafetyRouteZone[]> {
    const query = new URLSearchParams();
    if (params.district && params.district !== 'all') query.set('district', params.district);
    if (params.routeType && params.routeType !== 'all') query.set('routeType', params.routeType);
    if (params.minSafetyRating) query.set('minSafetyRating', String(params.minSafetyRating));
    if (params.lightingLevel && params.lightingLevel !== 'all')
      query.set('lightingLevel', params.lightingLevel);

    const queryString = query.toString();
    const endpoint = queryString ? `/safety/routes?${queryString}` : '/safety/routes';

    return fetchApi<SafetyRouteZone[]>(endpoint);
  },
};
