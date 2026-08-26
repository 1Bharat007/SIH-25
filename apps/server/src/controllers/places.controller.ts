import { Request, Response } from 'express';
import {
  ApiResponse,
  PlaceSummary,
  PlaceDetailResponse,
  PlaceFilterParams,
} from '@sikkim-yatra/shared';
import { queryPlaces, queryPlaceDetailBySlug } from '../data/sikkim-data.js';

export async function getPlaces(
  req: Request,
  res: Response<ApiResponse<PlaceSummary[]>>
): Promise<void> {
  const { search, category, district, permitRequired } = req.query;

  const filterParams: PlaceFilterParams = {
    search: typeof search === 'string' ? search : undefined,
    category:
      typeof category === 'string' ? (category as PlaceFilterParams['category']) : undefined,
    district:
      typeof district === 'string' ? (district as PlaceFilterParams['district']) : undefined,
    permitRequired: permitRequired !== undefined ? permitRequired === 'true' : undefined,
  };

  const places = queryPlaces(filterParams);

  res.status(200).json({
    success: true,
    message: `Retrieved ${places.length} Sikkim places`,
    data: places,
    timestamp: new Date().toISOString(),
  });
}

export async function getPlaceBySlug(
  req: Request,
  res: Response<ApiResponse<PlaceDetailResponse>>
): Promise<void> {
  const { slug } = req.params;

  if (!slug || typeof slug !== 'string') {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Place slug is required',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const placeDetail = queryPlaceDetailBySlug(slug);

  if (!placeDetail) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Place with slug '${slug}' not found`,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: `Place details for ${placeDetail.name}`,
    data: placeDetail,
    timestamp: new Date().toISOString(),
  });
}
