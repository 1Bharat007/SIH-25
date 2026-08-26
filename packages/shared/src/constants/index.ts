import { SikkimDistrict } from '../types/tourism.js';

export const APP_METADATA = {
  name: 'Sikkim Yatra',
  tagline: 'Smart Offline-First Digital Tourism Platform for Sikkim',
  version: '0.1.0',
} as const;

export const SIKKIM_DISTRICTS: readonly SikkimDistrict[] = [
  'Gangtok',
  'Mangan',
  'Namchi',
  'Gyalshing',
  'Pakyong',
  'Soreng',
] as const;

export const API_ENDPOINTS = {
  HEALTH: '/health',
  PLACES: '/places',
  PERMITS: '/permits',
  OFFLINE_BUNDLES: '/offline/bundles',
} as const;
