export type SikkimDistrict = 'Gangtok' | 'Mangan' | 'Namchi' | 'Gyalshing' | 'Pakyong' | 'Soreng';

export type PlaceCategory =
  | 'monastery'
  | 'cultural_heritage'
  | 'high_altitude_lake'
  | 'trekking_trail'
  | 'waterfall'
  | 'viewpoint'
  | 'wildlife_sanctuary'
  | 'town';

export type FilterCategory = 'all' | 'culture' | 'food' | 'stay' | 'safety' | 'hazard';

export type VendorType =
  | 'homestay'
  | 'restaurant_cafe'
  | 'taxi_driver'
  | 'handicraft_store'
  | 'trekking_guide'
  | 'equipment_rental';

export type EmergencyType =
  | 'police_station'
  | 'hospital'
  | 'tourist_helpline'
  | 'disaster_management_sdma'
  | 'mountain_rescue'
  | 'forest_checkpost';

export type AlertType =
  | 'landslide'
  | 'flash_flood'
  | 'earthquake'
  | 'road_closure'
  | 'heavy_snowfall'
  | 'weather_warning'
  | 'general_advisory';

export type AlertSeverity = 'info' | 'moderate' | 'high' | 'critical';

export interface VendorSummary {
  id: string;
  businessName: string;
  ownerName: string;
  type: VendorType;
  description?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  district: SikkimDistrict;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  pricingInfo?: string;
  images: string[];
  rating: number;
  placeId?: string;
}

export interface EmergencyContactSummary {
  id: string;
  name: string;
  type: EmergencyType;
  phone: string;
  altPhone?: string;
  address: string;
  district: SikkimDistrict;
  latitude: number;
  longitude: number;
  is24x7: boolean;
  description?: string;
  placeId?: string;
}

export interface HazardAlertSummary {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  severity: AlertSeverity;
  status: 'active' | 'resolved' | 'expired';
  district: SikkimDistrict;
  centerLat: number;
  centerLng: number;
  radiusKm?: number;
  startsAt: string;
  expiresAt?: string;
  placeId?: string;
}

export interface PlaceSummary {
  id: string;
  slug: string;
  name: string;
  localName?: string;
  district: SikkimDistrict;
  category: PlaceCategory;
  description: string;
  altitudeMeters?: number;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  thumbnailUrl: string;
  images: string[];
  permitRequired: boolean;
  permitType?: string;
  bestTimeToVisit?: string;
  openingHours?: string;
  entryFee?: string;
  offlineAvailable: boolean;
}

export interface PlaceDetailResponse extends PlaceSummary {
  history?: string;
  nearbyVendors: VendorSummary[];
  nearbyEmergencyContacts: EmergencyContactSummary[];
  activeAlerts: HazardAlertSummary[];
}

export type MapMarkerType =
  | 'monastery'
  | 'cultural'
  | 'food'
  | 'stay'
  | 'vendor'
  | 'hospital'
  | 'police'
  | 'helpline'
  | 'hazard_zone';

export interface MapFeatureItem {
  id: string;
  markerType: MapMarkerType;
  title: string;
  subtitle?: string;
  category: string;
  district: SikkimDistrict;
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  rating?: number;
  thumbnailUrl?: string;
  linkUrl?: string;
  phone?: string;
  severity?: AlertSeverity;
  radiusKm?: number;
  details?: Record<string, unknown>;
}

export interface MapLayersResponse {
  features: MapFeatureItem[];
  hazardZones: HazardAlertSummary[];
  statistics: {
    totalPlaces: number;
    totalVendors: number;
    totalEmergencyContacts: number;
    activeAlerts: number;
  };
}

export interface PlaceFilterParams {
  search?: string;
  category?: FilterCategory;
  district?: SikkimDistrict | 'all';
  permitRequired?: boolean;
}
