import { SikkimDistrict } from './tourism.js';

export type MonasteryLineage =
  | 'Nyingma'
  | 'Karma Kagyu'
  | 'Gelug'
  | 'Sakya'
  | 'Drukpa Kagyu'
  | 'Ecumenical';

export interface MonasteryEtiquetteRule {
  rule: string;
  category: 'dress' | 'behavior' | 'photography' | 'prayer';
  description: string;
}

export interface SacredRelic {
  name: string;
  tibetanName?: string;
  description: string;
  century: string;
  significance: string;
  imageUrl?: string;
}

export interface PanoramaHotspot {
  id: string;
  title: string;
  tibetanTitle?: string;
  description: string;
  pitch: number; // Vertical angle in degrees (-90 to 90)
  yaw: number; // Horizontal angle in degrees (-180 to 180)
  category: 'altar' | 'relic' | 'mural' | 'manuscript' | 'architecture';
  audioLoreSnippet?: string;
  imageUrl?: string;
}

export interface PanoramaScene {
  id: string;
  monasteryId: string;
  monasteryName: string;
  sceneTitle: string;
  roomName: string;
  panoramaImageUrl: string;
  thumbnailUrl: string;
  initialView: {
    pitch: number;
    yaw: number;
    fov: number;
  };
  hotspots: PanoramaHotspot[];
  ambientAudioUrl?: string;
  description: string;
}

export interface MonasteryProfile {
  id: string;
  slug: string;
  name: string;
  localName: string;
  district: SikkimDistrict;
  lineage: MonasteryLineage;
  foundedYear: number;
  founder: string;
  altitudeMeters: number;
  latitude: number;
  longitude: number;
  description: string;
  architecturalStyle: string;
  sacredRelics: SacredRelic[];
  etiquetteRules: MonasteryEtiquetteRule[];
  images: string[];
  panoramaSceneId?: string;
  annualChamDanceMonth?: string;
  visitingHours: string;
  entryFee: string;
}

export type SikkimeseCommunity = 'Bhutia' | 'Lepcha' | 'Nepali';

export type AttireGender = 'unisex' | 'female' | 'male';

export interface AttireGarmentPiece {
  name: string;
  localName: string;
  type: 'main_robe' | 'inner_shirt' | 'waistband' | 'headgear' | 'jacket' | 'jewelry';
  description: string;
  material: string;
  colorOptions: string[];
  imageUrl?: string;
}

export interface TraditionalAttire {
  id: string;
  name: string;
  localName: string;
  community: SikkimeseCommunity;
  gender: AttireGender;
  occasion: 'Festive & Ceremonial' | 'Traditional Wedding' | 'Daily Cultural' | 'Cham Ritual';
  overview: string;
  culturalLore: string;
  textileTechnique: string;
  pieces: AttireGarmentPiece[];
  thumbnailUrl: string;
  overlayAssetUrl: string;
  headgearAssetUrl?: string;
  jewelryAssetUrl?: string;
}

export interface SikkimFestival {
  id: string;
  name: string;
  localName: string;
  community: SikkimeseCommunity | 'All Communities' | 'Buddhist' | 'Indigenous';
  monthRange: string;
  approximateDates2025: string;
  approximateDates2026: string;
  tibetanLunarDate?: string;
  shortSummary: string;
  significance: string;
  ritualsAndCelebrations: string[];
  chamDancesFeatured?: string[];
  primeMonasteries: string[];
  district: SikkimDistrict | 'All Districts';
  images: string[];
}
