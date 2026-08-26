'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { SafeRouteDetour } from '@sikkim-yatra/shared';
import { useRealtimeAlerts } from './useRealtimeAlerts';
import { fetchSafeRouteDetours } from '../services/disaster.service';

export interface SimulatedLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export const SIKKIM_GPS_PRESETS: SimulatedLocation[] = [
  {
    name: 'Gangtok MG Marg Promenade',
    lat: 27.3314,
    lng: 88.6138,
    description: 'Capital center — Safe zone',
  },
  {
    name: '29th Mile NH10 (Near Landslide)',
    lat: 27.21,
    lng: 88.525,
    description: 'Directly in the NH10 Landslide Danger Zone (< 2 km)',
  },
  {
    name: 'Thangu Valley High Pass (Blizzard Area)',
    lat: 27.91,
    lng: 88.67,
    description: 'Directly in the North Sikkim Blizzard Warning Zone',
  },
  {
    name: 'Singtam Riverside Junction',
    lat: 27.234,
    lng: 88.498,
    description: 'Near Teesta River basin flash flood advisory (< 3 km)',
  },
  {
    name: 'Pemayangtse Monastery (Pelling)',
    lat: 27.306,
    lng: 88.2483,
    description: 'West Sikkim quiet mountain sector — All clear',
  },
];

function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useAlertProximity() {
  const { activeAlerts } = useRealtimeAlerts();
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 27.3314, // Default Gangtok MG Marg
    lng: 88.6138,
  });
  const [activePresetName, setActivePresetName] = useState<string>('Gangtok MG Marg Promenade');
  const [isUsingLiveGps, setIsUsingLiveGps] = useState<boolean>(false);
  const [detours, setDetours] = useState<SafeRouteDetour[]>([]);

  // Load detours
  useEffect(() => {
    fetchSafeRouteDetours()
      .then((data) => setDetours(data))
      .catch((err) => console.warn('[Proximity] Failed to load detours:', err));
  }, []);

  // Request browser GPS
  const enableLiveGps = useCallback(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsUsingLiveGps(true);
          setActivePresetName('Live GPS Location');
        },
        (err) => {
          console.warn('[GPS] Geolocation error:', err.message);
          setIsUsingLiveGps(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  const selectPresetLocation = useCallback((preset: SimulatedLocation) => {
    setIsUsingLiveGps(false);
    setCurrentCoords({ lat: preset.lat, lng: preset.lng });
    setActivePresetName(preset.name);
  }, []);

  // Calculate distances & proximity
  const proximityAnalysis = useMemo(() => {
    if (!activeAlerts || activeAlerts.length === 0) {
      return {
        isInDangerZone: false,
        isInWarningZone: false,
        nearestAlert: null,
        distanceKm: null,
        alternateRoute: null,
        allNearbyAlerts: [],
      };
    }

    const calculated = activeAlerts.map((alert) => {
      const dist = calculateHaversineKm(
        currentCoords.lat,
        currentCoords.lng,
        alert.centerLat,
        alert.centerLng
      );
      const radius = alert.radiusKm || 5.0;
      const isInside = dist <= radius;
      const isNear = dist <= radius + 10.0;
      return {
        alert,
        distanceKm: Number(dist.toFixed(1)),
        isInside,
        isNear,
      };
    });

    calculated.sort((a, b) => a.distanceKm - b.distanceKm);

    const nearest = calculated[0];
    if (!nearest) {
      return {
        isInDangerZone: false,
        isInWarningZone: false,
        nearestAlert: null,
        distanceKm: null,
        alternateRoute: null,
        allNearbyAlerts: [],
      };
    }

    const matchingDetour = nearest.alert.alternateRouteId
      ? detours.find((d) => d.id === nearest.alert.alternateRouteId)
      : detours.find(
          (d) =>
            d.hazardAlertId === nearest.alert.id ||
            d.blockedCorridor.toLowerCase().includes(nearest.alert.affectedCorridor.toLowerCase())
        );

    return {
      isInDangerZone: nearest.isInside,
      isInWarningZone: nearest.isNear,
      nearestAlert: nearest.alert,
      distanceKm: nearest.distanceKm,
      alternateRoute: matchingDetour || null,
      allNearbyAlerts: calculated,
    };
  }, [activeAlerts, currentCoords, detours]);

  return {
    currentCoords,
    activePresetName,
    isUsingLiveGps,
    enableLiveGps,
    selectPresetLocation,
    presets: SIKKIM_GPS_PRESETS,
    ...proximityAnalysis,
  };
}
