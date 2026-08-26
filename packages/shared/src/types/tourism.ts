export type SikkimDistrict = 'Gangtok' | 'Mangan' | 'Namchi' | 'Gyalshing' | 'Pakyong' | 'Soreng';

export type PlaceCategory =
  | 'monastery'
  | 'high_altitude_lake'
  | 'trekking_trail'
  | 'waterfall'
  | 'viewpoint'
  | 'wildlife_sanctuary'
  | 'cultural_heritage'
  | 'homestay';

export interface PlaceSummary {
  id: string;
  name: string;
  localName?: string;
  district: SikkimDistrict;
  category: PlaceCategory;
  altitudeMeters?: number;
  latitude: number;
  longitude: number;
  rating: number;
  thumbnailUrl: string;
  permitRequired: boolean;
  offlineAvailable: boolean;
}

export interface PermitRule {
  id: string;
  name: string;
  applicableAreas: string[];
  requiresProtectedAreaPermit: boolean;
  requiresRestrictedAreaPermit: boolean;
  issuedBy: string;
}

export interface OfflineBundleMetadata {
  bundleId: string;
  district: SikkimDistrict;
  version: number;
  sizeBytes: number;
  updatedAt: string;
}
