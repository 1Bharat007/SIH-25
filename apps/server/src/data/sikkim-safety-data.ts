import {
  SafetyRouteZone,
  SafetyRoutesFilterParams,
  LiveLocationSession,
} from '@sikkim-yatra/shared';

export const SIKKIM_SAFETY_ROUTES: SafetyRouteZone[] = [
  {
    id: 'route-mgmarg',
    name: 'MG Marg & Ridge Promenade Safe Corridor',
    district: 'Gangtok',
    routeType: 'well_lit_promenade',
    safetyRating: 4.9,
    lightingLevel: 'high',
    recommendedHours: '6:00 AM - 10:30 PM',
    advisory:
      'Safest pedestrian boulevard in Sikkim with continuous CCTV surveillance, high street lighting, and dedicated 24x7 Tourist Police assistance booths.',
    curfewActive: false,
    nearestPolicePost: 'Gangtok Sadar Police Station (0.3 km)',
    nearestHospital: 'STNM Multispeciality Government Hospital (1.5 km)',
    patrolFrequency: 'Continuous 24x7 Tourist Police Foot Beat',
    tags: ['Well-Lit', 'Pedestrian Only', '24x7 Tourist Police', 'CCTV Monitored', 'High Density'],
    coordinates: [
      [27.3314, 88.6138],
      [27.3325, 88.6145],
      [27.3302, 88.6125],
    ],
  },
  {
    id: 'route-namchi-central',
    name: 'Namchi Central Heritage & Char Dham Loop',
    district: 'Namchi',
    routeType: 'well_lit_promenade',
    safetyRating: 4.7,
    lightingLevel: 'high',
    recommendedHours: '6:00 AM - 9:00 PM',
    advisory:
      'Well-maintained pilgrimage and town corridor with active solar street lighting, low traffic speed limit, and frequent police monitoring.',
    curfewActive: false,
    nearestPolicePost: 'Namchi Police Station (0.6 km)',
    nearestHospital: 'Namchi District Hospital (0.8 km)',
    patrolFrequency: 'Regular 30-min Police Mobile Patrol',
    tags: ['Well-Lit', 'Pilgrim Safe Zone', 'Family Friendly', 'Solar Lit'],
    coordinates: [
      [27.1648, 88.3512],
      [27.168, 88.355],
      [27.163, 88.353],
    ],
  },
  {
    id: 'route-ravangla-buddha-park',
    name: 'Ravangla Buddha Park Cultural Corridor',
    district: 'Namchi',
    routeType: 'safe_tourist_corridor',
    safetyRating: 4.5,
    lightingLevel: 'medium',
    recommendedHours: '6:30 AM - 7:30 PM',
    advisory:
      'Peaceful scenic road connecting Ravangla town to Buddha Park. Well-paved with moderate lighting; pleasant for evening walks until dusk.',
    curfewActive: false,
    nearestPolicePost: 'Ravangla Police Station (1.0 km)',
    nearestHospital: 'Ravangla Primary Health Centre (1.2 km)',
    patrolFrequency: 'Hourly Police Checkpost Patrols',
    tags: ['Safe Corridor', 'Monastery Route', 'Scenic Walk'],
    coordinates: [
      [27.305, 88.363],
      [27.308, 88.368],
    ],
  },
  {
    id: 'route-pelling-pemayangtse',
    name: 'Pelling to Pemayangtse & Rabdentse Ridge',
    district: 'Gyalshing',
    routeType: 'daylight_preferred_scenic',
    safetyRating: 4.2,
    lightingLevel: 'medium',
    recommendedHours: '6:00 AM - 6:30 PM (Daylight Recommended)',
    advisory:
      'Stunning forest ridge road with moderate lighting. Safe during daylight; caution advised after 7:00 PM due to mountain mist and hairpin turns.',
    curfewActive: false,
    nearestPolicePost: 'Pelling Police Outpost (1.2 km)',
    nearestHospital: 'Gyalshing District Hospital (5.4 km)',
    patrolFrequency: 'Hourly Mobile Checkposts',
    tags: ['Daylight Preferred', 'Forest Ridge', 'Scenic Sunrise'],
    coordinates: [
      [27.306, 88.2483],
      [27.3075, 88.245],
      [27.283, 88.238],
    ],
  },
  {
    id: 'route-tsomgo-nathula',
    name: '13th Mile to Tsomgo Lake Corridor (JN Road)',
    district: 'Gangtok',
    routeType: 'avoid_after_dark',
    safetyRating: 2.8,
    lightingLevel: 'unlit',
    recommendedHours: '7:00 AM - 3:00 PM Only',
    advisory:
      'AVOID AFTER DARK: High-altitude mountain pass prone to dense evening fog, rapid sub-zero drops, and black ice. Checkposts strictly prohibit entry past 3:30 PM.',
    curfewActive: true,
    nearestPolicePost: 'Kyongnosla Police & Army Checkpost (3.2 km)',
    nearestHospital: 'Army High Altitude Aid Post Kyongnosla (3.2 km)',
    patrolFrequency: 'Border Roads Organisation (BRO) & Army Patrols',
    tags: [
      'Avoid After Dark',
      'High Altitude Fog',
      'Black Ice Hazard',
      'Curfew Active',
      'PAP Required',
    ],
    coordinates: [
      [27.35, 28.7],
      [27.3742, 88.7619],
    ],
  },
  {
    id: 'route-thangu-gurudongmar',
    name: 'Thangu to Gurudongmar Lake High Plateau Road',
    district: 'Mangan',
    routeType: 'high_altitude_mountain_pass',
    safetyRating: 1.9,
    lightingLevel: 'unlit',
    recommendedHours: '6:30 AM - 12:00 PM Strictly',
    advisory:
      'EXTREME HIGH-ALTITUDE DANGER ZONE AFTER DARK: Extreme sub-zero temperatures (-15°C), acute mountain sickness (17,800 ft), zero cellular coverage, unlit rocky roads. Night travel strictly banned by District Administration.',
    curfewActive: true,
    nearestPolicePost: 'Chungthang Police Station (28 km) / Thangu Military Post',
    nearestHospital: 'Indian Army High-Altitude Medical Post, Thangu (12 km)',
    patrolFrequency: 'Indian Army Border Patrols Only',
    tags: [
      'Strictly Day Only',
      'Night Ban Enforced',
      'Sub-Zero Hazard',
      'Zero Cell Coverage',
      'AMS Risk',
    ],
    coordinates: [
      [27.9, 88.68],
      [27.9942, 88.7107],
    ],
  },
];

// In-Memory Live Location Sessions Store (TTL managed)
export const LIVE_LOCATION_SESSIONS = new Map<string, LiveLocationSession>();

export function querySafetyRoutes(params: SafetyRoutesFilterParams = {}): SafetyRouteZone[] {
  const { district, routeType, minSafetyRating, lightingLevel } = params;

  return SIKKIM_SAFETY_ROUTES.filter(route => {
    if (district && district !== 'all') {
      if (route.district.toLowerCase() !== district.toLowerCase()) {
        return false;
      }
    }

    if (routeType && routeType !== 'all') {
      if (route.routeType !== routeType) {
        return false;
      }
    }

    if (minSafetyRating !== undefined) {
      if (route.safetyRating < minSafetyRating) {
        return false;
      }
    }

    if (lightingLevel && lightingLevel !== 'all') {
      if (route.lightingLevel !== lightingLevel) {
        return false;
      }
    }

    return true;
  });
}
