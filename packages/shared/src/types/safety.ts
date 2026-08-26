import { EmergencyContactSummary, SikkimDistrict } from './tourism.js';

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  notifyViaSms: boolean;
  notifyViaWhatsapp: boolean;
}

export type SafetyRouteType =
  | 'well_lit_promenade'
  | 'safe_tourist_corridor'
  | 'daylight_preferred_scenic'
  | 'avoid_after_dark'
  | 'high_altitude_mountain_pass';

export type LightingLevel = 'high' | 'medium' | 'low' | 'unlit';

export interface SafetyRouteZone {
  id: string;
  name: string;
  district: SikkimDistrict;
  routeType: SafetyRouteType;
  safetyRating: number; // 1.0 to 5.0 (data-driven score)
  lightingLevel: LightingLevel;
  recommendedHours: string;
  advisory: string;
  curfewActive: boolean;
  nearestPolicePost: string;
  nearestHospital: string;
  patrolFrequency: string;
  tags: string[];
  coordinates: [number, number][]; // LineString or Polygon anchor points
}

export type EmergencyDistressType =
  | 'Medical Emergency'
  | 'Stranded in Snow / Landslide'
  | 'Vehicle Breakdown'
  | 'Harassment / Security Threat'
  | 'Lost in Mountain Trail'
  | 'Other Emergency';

export interface SOSDispatchPayload {
  userId?: string;
  userName?: string;
  userPhone?: string;
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  accuracyMeters?: number;
  batteryLevel?: number;
  emergencyType: EmergencyDistressType;
  notes?: string;
  notifyTrustedContacts?: boolean;
  trustedContacts?: TrustedContact[];
}

export interface SOSDispatchResult {
  sosId: string;
  status: 'DISPATCHED' | 'ACKNOWLEDGED';
  timestamp: string;
  confirmationCode: string;
  nearestPolice: EmergencyContactSummary & { distanceKm: number };
  nearestHospital: EmergencyContactSummary & { distanceKm: number };
  notifiedContactsCount: number;
  smsPayloadPreview: string;
  whatsappShareUrl: string;
}

export interface NearestEmergencyLookupResult {
  nearestPolice: EmergencyContactSummary & { distanceKm: number };
  nearestHospital: EmergencyContactSummary & { distanceKm: number };
  touristHelpline: EmergencyContactSummary & { distanceKm: number };
  allNearby: (EmergencyContactSummary & { distanceKm: number })[];
}

export interface LiveLocationSession {
  sessionId: string;
  token: string;
  userId?: string;
  userName?: string;
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  accuracyMeters?: number;
  batteryLevel?: number;
  startedAt: string;
  expiresAt: string;
  durationMinutes: number;
  isActive: boolean;
  shareableUrl: string;
}

export interface SafetyRoutesFilterParams {
  district?: SikkimDistrict | 'all';
  routeType?: SafetyRouteType | 'all';
  minSafetyRating?: number;
  lightingLevel?: LightingLevel | 'all';
}
