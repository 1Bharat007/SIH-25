import { Request, Response } from 'express';
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
import {
  getStoredAlerts,
  getAlertById as findAlertById,
  createDisasterAlert,
  updateDisasterAlert,
  deleteDisasterAlert,
  SIKKIM_SAFE_DETOURS,
  findMatchingSafeDetour,
  querySafeShelters,
  SIKKIM_EVACUATION_GUIDELINES,
  getEvacuationGuideline,
} from '../data/disaster-data.js';
import {
  broadcastAlertCreated,
  broadcastAlertUpdated,
  broadcastAlertDeleted,
} from '../utils/disaster-ws.js';
import { calculateDistanceKm } from '../utils/geo.js';

// SSE Clients for streaming alerts fallback
const sseClients: Response[] = [];

export async function getAlerts(
  req: Request,
  res: Response<ApiResponse<DisasterAlert[]>>
): Promise<void> {
  const { status, district, severity, active } = req.query;

  const alerts = getStoredAlerts({
    status: status as string,
    district: district as string,
    severity: severity as string,
    activeOnly: active === 'true' || active === '1',
  });

  res.status(200).json({
    success: true,
    message: `Retrieved ${alerts.length} disaster & hazard alerts`,
    data: alerts,
    timestamp: new Date().toISOString(),
  });
}

export async function getAlertById(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<{ alert: DisasterAlert; matchingDetour?: SafeRouteDetour }>>
): Promise<void> {
  const { id } = req.params;
  const alert = findAlertById(id);

  if (!alert) {
    res.status(404).json({
      success: false,
      message: `Disaster alert with ID "${id}" was not found`,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const matchingDetour = alert.alternateRouteId
    ? findMatchingSafeDetour(alert.alternateRouteId)
    : findMatchingSafeDetour(alert.id);

  res.status(200).json({
    success: true,
    message: 'Retrieved alert details',
    data: { alert, matchingDetour },
    timestamp: new Date().toISOString(),
  });
}

export async function createAlert(
  req: Request<unknown, unknown, CreateAlertPayload>,
  res: Response<ApiResponse<DisasterAlert>>
): Promise<void> {
  const payload = req.body;

  if (
    !payload.title ||
    !payload.description ||
    !payload.type ||
    !payload.severity ||
    !payload.district ||
    payload.centerLat === undefined ||
    payload.centerLng === undefined
  ) {
    res.status(400).json({
      success: false,
      message:
        'Missing required alert fields (title, description, type, severity, district, centerLat, centerLng)',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const newAlert = createDisasterAlert({
    ...payload,
    radiusKm: payload.radiusKm || 5.0,
    affectedCorridor: payload.affectedCorridor || `${payload.district} Mountain Corridor`,
    recommendedAction:
      payload.recommendedAction ||
      'Exercise extreme caution, check local road advisory before transit.',
  });

  // Broadcast instantly via WebSocket to all active tourists and users
  broadcastAlertCreated(newAlert);

  // Notify SSE clients
  notifySSE('ALERT_CREATED', newAlert);

  res.status(201).json({
    success: true,
    message: 'Disaster advisory created and broadcasted in real-time across Sikkim network',
    data: newAlert,
    timestamp: new Date().toISOString(),
  });
}

export async function updateAlert(
  req: Request<{ id: string }, unknown, UpdateAlertPayload>,
  res: Response<ApiResponse<DisasterAlert>>
): Promise<void> {
  const { id } = req.params;
  const payload = req.body;

  const updated = updateDisasterAlert(id, payload);

  if (!updated) {
    res.status(404).json({
      success: false,
      message: `Cannot update: Alert with ID "${id}" does not exist`,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Broadcast update or resolution
  broadcastAlertUpdated(updated);
  notifySSE('ALERT_UPDATED', updated);

  res.status(200).json({
    success: true,
    message: `Disaster alert status successfully updated to ${updated.status}`,
    data: updated,
    timestamp: new Date().toISOString(),
  });
}

export async function deleteAlert(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<{ id: string }>>
): Promise<void> {
  const { id } = req.params;
  const deleted = deleteDisasterAlert(id);

  if (!deleted) {
    res.status(404).json({
      success: false,
      message: `Cannot delete: Alert with ID "${id}" was not found`,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  broadcastAlertDeleted(id);
  notifySSE('ALERT_DELETED', { id });

  res.status(200).json({
    success: true,
    message: 'Alert removed from system and active broadcast',
    data: { id },
    timestamp: new Date().toISOString(),
  });
}

export async function getSafeRouteDetours(
  req: Request,
  res: Response<ApiResponse<SafeRouteDetour[]>>
): Promise<void> {
  const { alertId, corridor } = req.query;

  let detours = SIKKIM_SAFE_DETOURS;

  if (alertId) {
    detours = detours.filter(d => d.hazardAlertId === alertId || d.id === alertId);
  }

  if (corridor) {
    const q = (corridor as string).toLowerCase();
    detours = detours.filter(
      d =>
        d.blockedCorridor.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.overview.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    message: `Retrieved ${detours.length} alternate safe-route detours avoiding mountain hazard zones`,
    data: detours,
    timestamp: new Date().toISOString(),
  });
}

export async function getDetourById(
  req: Request,
  res: Response<ApiResponse<SafeRouteDetour>>
): Promise<void> {
  const { id } = req.params;
  const detour = SIKKIM_SAFE_DETOURS.find(d => d.id === id);

  if (!detour) {
    res.status(404).json({
      success: false,
      message: `Safe detour with ID "${id}" was not found`,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Retrieved safe route detour waypoint navigation details',
    data: detour,
    timestamp: new Date().toISOString(),
  });
}

export async function getEvacuationGuidelines(
  req: Request,
  res: Response<ApiResponse<EvacuationGuideline[] | EvacuationGuideline>>
): Promise<void> {
  const { hazardType } = req.query;

  if (hazardType) {
    const guideline = getEvacuationGuideline(hazardType as DisasterType);
    if (!guideline) {
      res.status(404).json({
        success: false,
        message: `Evacuation guideline for hazard "${hazardType}" not found`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Retrieved evacuation guidelines for ${hazardType}`,
      data: guideline,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Retrieved comprehensive Himalayan evacuation and survival manuals',
    data: SIKKIM_EVACUATION_GUIDELINES,
    timestamp: new Date().toISOString(),
  });
}

export async function getSafeShelters(
  req: Request,
  res: Response<ApiResponse<(SafeShelter & { distanceKm?: number })[]>>
): Promise<void> {
  const { lat, lng, district } = req.query;

  const userLat = lat ? Number(lat) : undefined;
  const userLng = lng ? Number(lng) : undefined;

  const shelters = querySafeShelters(userLat, userLng, district as SikkimDistrict);

  res.status(200).json({
    success: true,
    message: `Retrieved ${shelters.length} designated disaster relief centers and emergency shelters`,
    data: shelters,
    timestamp: new Date().toISOString(),
  });
}

export async function checkProximity(
  req: Request,
  res: Response<ApiResponse<AlertProximityResult>>
): Promise<void> {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    res.status(400).json({
      success: false,
      message: 'Query parameters "lat" and "lng" are required for proximity calculation',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const userLat = Number(lat);
  const userLng = Number(lng);

  const activeAlerts = getStoredAlerts({ activeOnly: true });

  let nearestAlert: DisasterAlert | undefined;
  let minDistanceKm = Infinity;

  for (const alert of activeAlerts) {
    const distance = calculateDistanceKm(userLat, userLng, alert.centerLat, alert.centerLng);
    if (distance < minDistanceKm) {
      minDistanceKm = distance;
      nearestAlert = alert;
    }
  }

  if (!nearestAlert) {
    res.status(200).json({
      success: true,
      message: 'No active hazards recorded in Sikkim territory',
      data: {
        isInDangerZone: false,
        isInWarningZone: false,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const roundedDistance = Number(minDistanceKm.toFixed(1));
  const isInDangerZone = minDistanceKm <= (nearestAlert.radiusKm || 5.0);
  const isInWarningZone = minDistanceKm <= (nearestAlert.radiusKm || 5.0) + 10.0;

  const alternateRoute = nearestAlert.alternateRouteId
    ? findMatchingSafeDetour(nearestAlert.alternateRouteId)
    : findMatchingSafeDetour(nearestAlert.id);

  res.status(200).json({
    success: true,
    message: isInDangerZone
      ? `🚨 WARNING: You are within the active hazard radius (${roundedDistance} km) of "${nearestAlert.title}"`
      : isInWarningZone
      ? `⚠️ ADVISORY: Active hazard detected ${roundedDistance} km away`
      : 'All clear: You are outside active hazard zones',
    data: {
      isInDangerZone,
      isInWarningZone,
      nearestAlert,
      distanceKm: roundedDistance,
      recommendedAction: nearestAlert.recommendedAction,
      alternateRoute,
    },
    timestamp: new Date().toISOString(),
  });
}

// Server-Sent Events (SSE) for streaming alerts fallback
export function streamAlerts(_req: Request, res: Response): void {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  sseClients.push(res);

  // Send initial snapshot
  const activeAlerts = getStoredAlerts({ activeOnly: true });
  res.write(`data: ${JSON.stringify({ type: 'INITIAL_STATE', alerts: activeAlerts })}\n\n`);

  _req.on('close', () => {
    const index = sseClients.indexOf(res);
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
  });
}

function notifySSE(eventType: string, data: unknown): void {
  const message = `data: ${JSON.stringify({ type: eventType, data, timestamp: new Date().toISOString() })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      // client dropped
    }
  }
}
