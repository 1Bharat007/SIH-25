import {
  PlaceSummary,
  PlaceDetailResponse,
  MapLayersResponse,
  PlaceFilterParams,
} from '@sikkim-yatra/shared';
import { fetchApi } from '../lib/api-client';

export const tourismService = {
  async getPlaces(params: PlaceFilterParams = {}): Promise<PlaceSummary[]> {
    const query = new URLSearchParams();

    if (params.search) query.set('search', params.search);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.district && params.district !== 'all') query.set('district', params.district);
    if (params.permitRequired !== undefined)
      query.set('permitRequired', String(params.permitRequired));

    const queryString = query.toString();
    const endpoint = queryString ? `/places?${queryString}` : '/places';

    return fetchApi<PlaceSummary[]>(endpoint);
  },

  async getPlaceBySlug(slug: string): Promise<PlaceDetailResponse> {
    return fetchApi<PlaceDetailResponse>(`/places/${slug}`);
  },

  async getMapLayers(): Promise<MapLayersResponse> {
    return fetchApi<MapLayersResponse>('/map/layers');
  },
};
