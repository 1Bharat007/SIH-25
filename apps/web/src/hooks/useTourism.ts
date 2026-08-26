import { useQuery } from '@tanstack/react-query';
import { PlaceFilterParams } from '@sikkim-yatra/shared';
import { tourismService } from '../services/tourism.service';

export function usePlacesQuery(params: PlaceFilterParams = {}) {
  return useQuery({
    queryKey: ['places', params],
    queryFn: () => tourismService.getPlaces(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePlaceDetailQuery(slug: string) {
  return useQuery({
    queryKey: ['place', slug],
    queryFn: () => tourismService.getPlaceBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useMapLayersQuery() {
  return useQuery({
    queryKey: ['map-layers'],
    queryFn: () => tourismService.getMapLayers(),
    staleTime: 1000 * 60 * 5,
  });
}
