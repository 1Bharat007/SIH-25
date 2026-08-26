import { SikkimDistrict } from './tourism.js';

export type DisasterType =
  | 'landslide'
  | 'flash_flood'
  | 'earthquake'
  | 'road_closure'
  | 'heavy_snowfall'
  | 'weather_warning'
  | 'general_advisory';

export type DisasterSeverity = 'info' | 'moderate' | 'high' | 'critical';

export type DisasterStatus = 'active' | 'resolved' | 'expired';

export interface DisasterAlert {
  id: string;
  title: string;
  description: string;
  type: DisasterType;
  severity: DisasterSeverity;
  status: DisasterStatus;
  district: SikkimDistrict;
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  affectedCorridor: string;
  recommendedAction: string;
  alternateRouteId?: string;
  sourceAuthority: string;
  startsAt: string;
  expiresAt?: string;
  resolvedAt?: string;
  geoPolygon?: [number, number][];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertPayload {
  title: string;
  description: string;
  type: DisasterType;
  severity: DisasterSeverity;
  district: SikkimDistrict;
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  affectedCorridor: string;
  recommendedAction: string;
  alternateRouteId?: string;
  sourceAuthority?: string;
  expiresInHours?: number;
  geoPolygon?: [number, number][];
}

export interface UpdateAlertPayload {
  title?: string;
  description?: string;
  severity?: DisasterSeverity;
  status?: DisasterStatus;
  recommendedAction?: string;
  alternateRouteId?: string;
  radiusKm?: number;
}

export interface DetourWaypoint {
  name: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  roadCondition: 'paved_good' | 'mountain_paved' | 'gravel_caution' | 'single_lane_slow';
  instruction: string;
  safeSpeedKmph: number;
  nearestAssistancePost?: string;
}

export interface SafeRouteDetour {
  id: string;
  title: string;
  blockedCorridor: string;
  hazardAlertId?: string;
  avoidedHazardType: DisasterType;
  detourDistanceKm: number;
  normalDistanceKm: number;
  estimatedTravelTimeMinutes: number;
  roadStatus: 'fully_open' | 'controlled_traffic' | 'caution_advisory';
  safetyRating: number; // 1.0 to 5.0
  recommendedVehicleType: 'all_vehicles' | 'suv_4wd_preferred' | '4wd_with_chains_only';
  overview: string;
  cautionNotes: string[];
  waypoints: DetourWaypoint[];
  pathCoordinates: [number, number][];
}

export interface EvacuationStep {
  stepNumber: number;
  actionTitle: string;
  details: string;
  doList: string[];
  dontList: string[];
}

export interface EvacuationGuideline {
  hazardType: DisasterType;
  title: string;
  summary: string;
  urgencyLevel: 'immediate' | 'high_caution' | 'precautionary';
  immediateActions: string[];
  steps: EvacuationStep[];
  emergencyKitList: string[];
  himalayanTerrainNotes: string;
  helplines: {
    name: string;
    phone: string;
    hours: string;
  }[];
}

export interface SafeShelter {
  id: string;
  name: string;
  localName?: string;
  district: SikkimDistrict;
  type: 'government_relief_camp' | 'district_hospital_trauma' | 'indoor_stadium_refuge' | 'army_transit_camp' | 'community_hall';
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  capacityPersons: number;
  currentOccupancy: number;
  hasMedicalPost: boolean;
  hasEmergencyPower: boolean;
  hasSatelliteComms: boolean;
  is24x7Open: boolean;
  contactPhone: string;
  address: string;
  distanceKm?: number;
}

export interface AlertProximityResult {
  isInDangerZone: boolean;
  isInWarningZone: boolean;
  nearestAlert?: DisasterAlert;
  distanceKm?: number;
  recommendedAction?: string;
  alternateRoute?: SafeRouteDetour;
}

export type WSAlertEventType =
  | 'ALERT_CREATED'
  | 'ALERT_UPDATED'
  | 'ALERT_RESOLVED'
  | 'ALERT_DELETED'
  | 'HEARTBEAT'
  | 'INITIAL_STATE';

export interface WSAlertMessage {
  type: WSAlertEventType;
  payload: {
    alert?: DisasterAlert;
    alerts?: DisasterAlert[];
    alertId?: string;
    timestamp: string;
    message?: string;
  };
}
