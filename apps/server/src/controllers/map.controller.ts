import { Request, Response } from 'express';
import { ApiResponse, MapLayersResponse } from '@sikkim-yatra/shared';
import { queryMapLayers } from '../data/sikkim-data.js';

export async function getMapLayers(
  _req: Request,
  res: Response<ApiResponse<MapLayersResponse>>
): Promise<void> {
  const mapData = queryMapLayers();

  res.status(200).json({
    success: true,
    message: 'Retrieved Sikkim interactive map layers and hazard overlays',
    data: mapData,
    timestamp: new Date().toISOString(),
  });
}
