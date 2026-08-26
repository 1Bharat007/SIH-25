import { Request, Response } from 'express';
import {
  ApiResponse,
  MonasteryProfile,
  PanoramaScene,
  TraditionalAttire,
  SikkimFestival,
  MonasteryLineage,
  SikkimeseCommunity,
} from '@sikkim-yatra/shared';
import {
  queryMonasteries,
  getMonasteryBySlug as findMonasteryBySlug,
  getPanoramaSceneById,
  queryTraditionalAttire,
  queryFestivals,
  SIKKIM_PANORAMA_SCENES,
} from '../data/culture-data.js';

export async function getMonasteries(
  req: Request,
  res: Response<ApiResponse<MonasteryProfile[]>>
): Promise<void> {
  const { lineage, district, search } = req.query;

  const monasteries = queryMonasteries({
    lineage: lineage as MonasteryLineage | 'all',
    district: district as string,
    search: search as string,
  });

  res.status(200).json({
    success: true,
    message: `Retrieved ${monasteries.length} sacred Sikkimese monasteries & heritage centers`,
    data: monasteries,
    timestamp: new Date().toISOString(),
  });
}

export async function getMonasteryBySlug(
  req: Request<{ slug: string }>,
  res: Response<ApiResponse<{ monastery: MonasteryProfile; panoramaScene?: PanoramaScene }>>
): Promise<void> {
  const { slug } = req.params;
  const monastery = findMonasteryBySlug(slug);

  if (!monastery) {
    res.status(404).json({
      success: false,
      message: `Monastery with identifier "${slug}" was not found`,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const panoramaScene = monastery.panoramaSceneId
    ? getPanoramaSceneById(monastery.panoramaSceneId)
    : getPanoramaSceneById(monastery.id);

  res.status(200).json({
    success: true,
    message: `Retrieved sacred monastery profile for ${monastery.name}`,
    data: { monastery, panoramaScene },
    timestamp: new Date().toISOString(),
  });
}

export async function getPanoramaScenes(
  _req: Request,
  res: Response<ApiResponse<PanoramaScene[]>>
): Promise<void> {
  res.status(200).json({
    success: true,
    message: `Retrieved ${SIKKIM_PANORAMA_SCENES.length} 360° virtual monastery interior panorama scenes`,
    data: SIKKIM_PANORAMA_SCENES,
    timestamp: new Date().toISOString(),
  });
}

export async function getPanoramaById(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<PanoramaScene>>
): Promise<void> {
  const { id } = req.params;
  const scene = getPanoramaSceneById(id);

  if (!scene) {
    res.status(404).json({
      success: false,
      message: `360° Panorama scene with ID "${id}" was not found`,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: `Retrieved 360° panorama scene for ${scene.sceneTitle}`,
    data: scene,
    timestamp: new Date().toISOString(),
  });
}

export async function getTraditionalAttire(
  req: Request,
  res: Response<ApiResponse<TraditionalAttire[]>>
): Promise<void> {
  const { community, gender } = req.query;

  const attire = queryTraditionalAttire({
    community: community as SikkimeseCommunity | 'all',
    gender: gender as string,
  });

  res.status(200).json({
    success: true,
    message: `Retrieved ${attire.length} traditional Sikkimese attire garments (Bhutia, Lepcha, Nepali)`,
    data: attire,
    timestamp: new Date().toISOString(),
  });
}

export async function getFestivals(
  req: Request,
  res: Response<ApiResponse<SikkimFestival[]>>
): Promise<void> {
  const { community, month, search } = req.query;

  const festivals = queryFestivals({
    community: community as string,
    month: month as string,
    search: search as string,
  });

  res.status(200).json({
    success: true,
    message: `Retrieved ${festivals.length} Sikkimese cultural festivals & Cham dance events`,
    data: festivals,
    timestamp: new Date().toISOString(),
  });
}
