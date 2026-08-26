import { Request, Response } from 'express';
import {
  ApiResponse,
  SOSDispatchPayload,
  SOSDispatchResult,
  NearestEmergencyLookupResult,
  LiveLocationSession,
  SafetyRouteZone,
  SafetyRoutesFilterParams,
} from '@sikkim-yatra/shared';
import { SIKKIM_EMERGENCY_DATA } from '../data/sikkim-data.js';
import { LIVE_LOCATION_SESSIONS, querySafetyRoutes } from '../data/sikkim-safety-data.js';
import { sortEmergencyContactsByDistance, calculateDistanceKm } from '../utils/geo.js';

export async function dispatchSOS(
  req: Request,
  res: Response<ApiResponse<SOSDispatchResult>>
): Promise<void> {
  const payload: SOSDispatchPayload = req.body;

  if (payload.latitude === undefined || payload.longitude === undefined || !payload.emergencyType) {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'latitude, longitude, and emergencyType are required for SOS dispatch',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Sort emergency contacts to find closest police and hospital
  const sorted = sortEmergencyContactsByDistance(
    payload.latitude,
    payload.longitude,
    SIKKIM_EMERGENCY_DATA
  );

  const nearestPolice =
    sorted.find(c => c.type === 'police_station' || c.type === 'disaster_management_sdma') ||
    sorted[0]!;

  const nearestHospital = sorted.find(c => c.type === 'hospital') || sorted[1] || sorted[0]!;

  const sosId = `sos-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const confirmationCode = `SKM-SOS-${Math.floor(100000 + Math.random() * 900000)}`;

  const mapsUrl = `https://maps.google.com/?q=${payload.latitude},${payload.longitude}`;
  const smsPayload = `[EMERGENCY SOS - SIKKIM YATRA] I require immediate emergency assistance! Location: ${mapsUrl}${
    payload.altitudeMeters ? ` (Alt: ${payload.altitudeMeters}m)` : ''
  }. Reason: ${payload.emergencyType}.${
    payload.notes ? ` Note: ${payload.notes}.` : ''
  } Nearest Police: ${nearestPolice.name} (${nearestPolice.phone}). Helpline: 1364. Code: ${confirmationCode}`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(smsPayload)}`;

  const result: SOSDispatchResult = {
    sosId,
    status: 'DISPATCHED',
    timestamp: new Date().toISOString(),
    confirmationCode,
    nearestPolice,
    nearestHospital,
    notifiedContactsCount: payload.trustedContacts?.length || 0,
    smsPayloadPreview: smsPayload,
    whatsappShareUrl,
  };

  res.status(201).json({
    success: true,
    message: `SOS Emergency Broadcast successfully dispatched for ${payload.emergencyType}`,
    data: result,
    timestamp: new Date().toISOString(),
  });
}

export async function lookupNearestEmergency(
  req: Request,
  res: Response<ApiResponse<NearestEmergencyLookupResult>>
): Promise<void> {
  const latStr = req.query.lat as string | undefined;
  const lngStr = req.query.lng as string | undefined;

  const lat = latStr ? parseFloat(latStr) : 27.3314; // Default to Gangtok
  const lng = lngStr ? parseFloat(lngStr) : 88.6138;

  if (isNaN(lat) || isNaN(lng)) {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'lat and lng must be valid numbers',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const sorted = sortEmergencyContactsByDistance(lat, lng, SIKKIM_EMERGENCY_DATA);

  const nearestPolice =
    sorted.find(c => c.type === 'police_station' || c.type === 'disaster_management_sdma') ||
    sorted[0]!;

  const nearestHospital = sorted.find(c => c.type === 'hospital') || sorted[1] || sorted[0]!;

  const touristHelpline = sorted.find(c => c.type === 'tourist_helpline') || {
    id: 'em-1',
    name: 'Sikkim 24x7 Tourist Helpline',
    type: 'tourist_helpline' as const,
    phone: '1364',
    altPhone: '03592-209090',
    address: 'Directorate of Tourism, MG Marg, Gangtok',
    district: 'Gangtok' as const,
    latitude: 27.331,
    longitude: 88.6135,
    is24x7: true,
    distanceKm: calculateDistanceKm(lat, lng, 27.331, 88.6135),
  };

  const result: NearestEmergencyLookupResult = {
    nearestPolice,
    nearestHospital,
    touristHelpline,
    allNearby: sorted,
  };

  res.status(200).json({
    success: true,
    message: 'Nearest emergency contacts resolved based on GPS location',
    data: result,
    timestamp: new Date().toISOString(),
  });
}

export async function startLiveLocation(
  req: Request,
  res: Response<ApiResponse<LiveLocationSession>>
): Promise<void> {
  const {
    userId,
    userName,
    latitude,
    longitude,
    altitudeMeters,
    accuracyMeters,
    batteryLevel,
    durationMinutes = 60,
  } = req.body;

  if (latitude === undefined || longitude === undefined) {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'latitude and longitude are required to start live location sharing',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const token = `track_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
  const sessionId = `session_${Date.now().toString(36)}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

  const session: LiveLocationSession = {
    sessionId,
    token,
    userId,
    userName: userName || 'Sikkim Traveler',
    latitude: Number(latitude),
    longitude: Number(longitude),
    altitudeMeters: altitudeMeters ? Number(altitudeMeters) : undefined,
    accuracyMeters: accuracyMeters ? Number(accuracyMeters) : undefined,
    batteryLevel: batteryLevel ? Number(batteryLevel) : undefined,
    startedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    durationMinutes: Number(durationMinutes),
    isActive: true,
    shareableUrl: `/safety/track/${token}`,
  };

  LIVE_LOCATION_SESSIONS.set(token, session);

  res.status(201).json({
    success: true,
    message: `Live location sharing started for ${durationMinutes} minutes`,
    data: session,
    timestamp: new Date().toISOString(),
  });
}

export async function getLiveLocation(
  req: Request,
  res: Response<ApiResponse<LiveLocationSession>>
): Promise<void> {
  const { token } = req.params;

  if (!token || typeof token !== 'string') {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Tracking token is required',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const session = LIVE_LOCATION_SESSIONS.get(token);

  if (!session) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Live tracking session not found or expired',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Check expiration
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    session.isActive = false;
  }

  res.status(200).json({
    success: true,
    message: 'Live location tracking session retrieved',
    data: session,
    timestamp: new Date().toISOString(),
  });
}

export async function updateLiveLocation(
  req: Request,
  res: Response<ApiResponse<LiveLocationSession>>
): Promise<void> {
  const { token } = req.params;
  const { latitude, longitude, altitudeMeters, accuracyMeters, batteryLevel } = req.body;

  if (!token || typeof token !== 'string') {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Tracking token is required',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const session = LIVE_LOCATION_SESSIONS.get(token);

  if (!session) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Live tracking session not found',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    session.isActive = false;
    res.status(410).json({
      success: false,
      error: {
        code: 'SESSION_EXPIRED',
        message: 'Live location session has expired',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (latitude !== undefined) session.latitude = Number(latitude);
  if (longitude !== undefined) session.longitude = Number(longitude);
  if (altitudeMeters !== undefined) session.altitudeMeters = Number(altitudeMeters);
  if (accuracyMeters !== undefined) session.accuracyMeters = Number(accuracyMeters);
  if (batteryLevel !== undefined) session.batteryLevel = Number(batteryLevel);

  LIVE_LOCATION_SESSIONS.set(token, session);

  res.status(200).json({
    success: true,
    message: 'Live location coordinates updated successfully',
    data: session,
    timestamp: new Date().toISOString(),
  });
}

export async function getSafetyRoutes(
  req: Request,
  res: Response<ApiResponse<SafetyRouteZone[]>>
): Promise<void> {
  const { district, routeType, minSafetyRating, lightingLevel } = req.query;

  const filterParams: SafetyRoutesFilterParams = {
    district:
      typeof district === 'string' ? (district as SafetyRoutesFilterParams['district']) : undefined,
    routeType:
      typeof routeType === 'string'
        ? (routeType as SafetyRoutesFilterParams['routeType'])
        : undefined,
    minSafetyRating: minSafetyRating ? parseFloat(minSafetyRating as string) : undefined,
    lightingLevel:
      typeof lightingLevel === 'string'
        ? (lightingLevel as SafetyRoutesFilterParams['lightingLevel'])
        : undefined,
  };

  const routes = querySafetyRoutes(filterParams);

  res.status(200).json({
    success: true,
    message: `Retrieved ${routes.length} Sikkim safety route zones`,
    data: routes,
    timestamp: new Date().toISOString(),
  });
}
