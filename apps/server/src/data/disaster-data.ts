import {
  DisasterAlert,
  CreateAlertPayload,
  UpdateAlertPayload,
  SafeRouteDetour,
  SafeShelter,
  EvacuationGuideline,
  SikkimDistrict,
  DisasterType,
} from '@sikkim-yatra/shared';
import { calculateDistanceKm } from '../utils/geo.js';

// In-Memory dynamic alerts store (initialized with real Sikkim mountain hazards)
export let DISASTER_ALERTS_STORE: DisasterAlert[] = [
  {
    id: 'alert-nh10-landslide',
    title: 'Severe Landslide & Mudslip on NH10 (29th Mile / Rangpo-Singtam)',
    description:
      'Massive debris and rockfall triggered by torrential rains have blocked both lanes of National Highway 10 near 29th Mile. Border Roads Organisation (BRO) and Project Swastik heavy earthmovers are actively clearing the stretch.',
    type: 'landslide',
    severity: 'critical',
    status: 'active',
    district: 'Pakyong',
    centerLat: 27.205,
    centerLng: 88.528,
    radiusKm: 7.5,
    affectedCorridor: 'NH10 Main Highway (Rangpo - Singtam - Gangtok)',
    recommendedAction:
      'Immediately avoid NH10 corridor. Divert via Pakyong - Rorathang - Melli alternate bypass route. Maintain low gear and avoid parking near mountain slopes.',
    alternateRouteId: 'detour-nh10-pakyong-rorathang',
    sourceAuthority: 'Sikkim State Disaster Management Authority (SSDMA) & BRO',
    startsAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    geoPolygon: [
      [27.18, 88.51],
      [27.23, 88.51],
      [27.24, 88.55],
      [27.19, 88.54],
    ],
  },
  {
    id: 'alert-thangu-blizzard',
    title: 'Blizzard & Severe Icy Black Ice Warning: Thangu to Gurudongmar Lake',
    description:
      'Sub-zero temperatures (-14°C) with gale-force winds and sudden whiteout blizzard conditions between Thangu Valley and Gurudongmar Lake. Road surface covered with invisible black ice.',
    type: 'heavy_snowfall',
    severity: 'high',
    status: 'active',
    district: 'Mangan',
    centerLat: 27.9,
    centerLng: 88.68,
    radiusKm: 16.0,
    affectedCorridor: 'North Sikkim High Altitude Pass (Thangu - Chopta - Gurudongmar)',
    recommendedAction:
      'High altitude pass closed for small vehicles. Only 4x4 Army/Tourist convoys with steel snow chains permitted before 11:00 AM. Carry portable medical oxygen and high-calorie rations.',
    alternateRouteId: 'detour-north-lachen-valley-safe',
    sourceAuthority: 'Indian Army 17th Mountain Division & District Magistrate Mangan',
    startsAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'alert-jn-road-clearing',
    title: 'Scheduled BRO Rock Stabilization on JN Road (13th Mile to Kyongnosla)',
    description:
      'Controlled slope stabilization and boulder netting work on the Jawaharlal Nehru Marg connecting Gangtok with Tsomgo Lake. Intermittent 30-minute blockades during daylight hours.',
    type: 'road_closure',
    severity: 'moderate',
    status: 'active',
    district: 'Gangtok',
    centerLat: 27.35,
    centerLng: 88.7,
    radiusKm: 6.0,
    affectedCorridor: 'JN Marg (13th Mile - Kyongnosla Alpine Sanctuary)',
    recommendedAction:
      'Follow traffic marshal signals at 3rd Mile and 13th Mile checkposts. Plan descent back to Gangtok before 3:30 PM due to afternoon fog accumulation.',
    alternateRouteId: 'detour-jn-road-alternate',
    sourceAuthority: 'Border Roads Organisation (Project Swastik)',
    startsAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'alert-teesta-flood',
    title: 'Teesta River Basin High Discharge Flash Flood Advisory',
    description:
      'Heavy cloudburst in upper catchment areas causing rapid surge in Teesta river water levels. Riverbanks and low-lying riverside trails in Singtam, Dikchu, and Rangpo are strictly restricted.',
    type: 'flash_flood',
    severity: 'high',
    status: 'active',
    district: 'Gangtok',
    centerLat: 27.24,
    centerLng: 88.5,
    radiusKm: 8.0,
    affectedCorridor: 'Teesta Riverbank Lowlands & Dikchu-Singtam Riparian Strip',
    recommendedAction:
      'Stay at least 150 meters away from Teesta river banks and bridges. Do not pitch tents near river valleys. Evacuate immediately if water changes to dark muddy silt.',
    alternateRouteId: 'detour-nh10-pakyong-rorathang',
    sourceAuthority: 'Central Water Commission & SSDMA Flood Monitoring Cell',
    startsAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Alternate safe detour route catalog
export const SIKKIM_SAFE_DETOURS: SafeRouteDetour[] = [
  {
    id: 'detour-nh10-pakyong-rorathang',
    title: 'Pakyong - Rorathang - Melli Safe Ridge Bypass (NH10 Alternate)',
    blockedCorridor: 'NH10 Rangpo - 29th Mile - Singtam Highway',
    hazardAlertId: 'alert-nh10-landslide',
    avoidedHazardType: 'landslide',
    detourDistanceKm: 48.5,
    normalDistanceKm: 34.0,
    estimatedTravelTimeMinutes: 110,
    roadStatus: 'fully_open',
    safetyRating: 4.6,
    recommendedVehicleType: 'all_vehicles',
    overview:
      'A safe, well-paved ridge bypass road traversing stable granite hills via Pakyong Airport and Rorathang to bypass the unstable 29th Mile landslide zone on NH10.',
    cautionNotes: [
      'Two hairpin curves near Rorathang bridge require slow speed (< 30 km/h).',
      'Pakyong Police Station and SDMA patrol vehicles active along the route.',
      'Mobile network connectivity (Jio & Airtel 4G) available throughout the bypass.',
    ],
    waypoints: [
      {
        name: 'Singtam Junction Diversion Point',
        latitude: 27.234,
        longitude: 88.498,
        elevationMeters: 400,
        roadCondition: 'mountain_paved',
        instruction: 'Turn uphill toward Pakyong / Ranipool instead of taking NH10 downriver.',
        safeSpeedKmph: 35,
        nearestAssistancePost: 'Singtam Police Outpost (Ph: 03592-233222)',
      },
      {
        name: 'Pakyong Green Ridge Waypoint',
        latitude: 27.239,
        longitude: 88.586,
        elevationMeters: 1120,
        roadCondition: 'paved_good',
        instruction: 'Continue straight past Pakyong Airport link road toward Rorathang.',
        safeSpeedKmph: 45,
        nearestAssistancePost: 'Pakyong Sub-Divisional Hospital (Ph: 03592-257888)',
      },
      {
        name: 'Rorathang Valley Crossing',
        latitude: 27.185,
        longitude: 88.618,
        elevationMeters: 550,
        roadCondition: 'mountain_paved',
        instruction: 'Cross Rorathang concrete suspension bridge and follow signs for Melli / Siliguri.',
        safeSpeedKmph: 30,
        nearestAssistancePost: 'Rorathang Police Checkpost (Ph: 03592-262111)',
      },
      {
        name: 'Melli Highway Re-entry Point',
        latitude: 27.091,
        longitude: 88.455,
        elevationMeters: 280,
        roadCondition: 'paved_good',
        instruction: 'Merge back safely onto the main highway corridor toward Siliguri / Bagdogra.',
        safeSpeedKmph: 50,
        nearestAssistancePost: 'Melli Interstate Border Checkpost (Ph: 03595-248222)',
      },
    ],
    pathCoordinates: [
      [27.234, 88.498],
      [27.239, 88.586],
      [27.21, 88.6],
      [27.185, 88.618],
      [27.14, 88.55],
      [27.091, 88.455],
    ],
  },
  {
    id: 'detour-north-lachen-valley-safe',
    title: 'Lachen - Thangu Lower Plateau Protected Valley Loop',
    blockedCorridor: 'Thangu Pass - Gurudongmar Lake Upper Ridge',
    hazardAlertId: 'alert-thangu-blizzard',
    avoidedHazardType: 'heavy_snowfall',
    detourDistanceKm: 28.0,
    normalDistanceKm: 32.0,
    estimatedTravelTimeMinutes: 75,
    roadStatus: 'controlled_traffic',
    safetyRating: 4.2,
    recommendedVehicleType: 'suv_4wd_preferred',
    overview:
      'Safe scenic valley loop that stays below the severe blizzard wind line (below 12,000 ft), routing travelers to protected tourist huts and Army heated shelters in Chopta Valley.',
    cautionNotes: [
      'Black ice patches possible on shaded culverts early in the morning.',
      'Check in at Indian Army Transit Aid Post at Thangu before proceeding.',
    ],
    waypoints: [
      {
        name: 'Lachen Village Assembly Point',
        latitude: 27.7214,
        longitude: 88.5562,
        elevationMeters: 2750,
        roadCondition: 'mountain_paved',
        instruction: 'Assemble vehicle convoy at Lachen Dzumsa ground. Check tire pressure and anti-freeze.',
        safeSpeedKmph: 30,
        nearestAssistancePost: 'Lachen Police Outpost & Primary Health Center',
      },
      {
        name: 'Chopta Lower Valley Safe Turnoff',
        latitude: 27.85,
        longitude: 88.61,
        elevationMeters: 3800,
        roadCondition: 'gravel_caution',
        instruction: 'Divert onto the lower Chopta alpine meadow track away from the exposed high ridge.',
        safeSpeedKmph: 25,
        nearestAssistancePost: 'Army Transit Camp Medical Aid Post',
      },
      {
        name: 'Thangu Heated Emergency Shelter',
        latitude: 27.9,
        longitude: 88.54,
        elevationMeters: 3950,
        roadCondition: 'mountain_paved',
        instruction: 'Park inside designated shelter perimeter. Hot tea and oxygen cylinders available.',
        safeSpeedKmph: 20,
        nearestAssistancePost: 'Chungthang Rescue Base Unit',
      },
    ],
    pathCoordinates: [
      [27.7214, 88.5562],
      [27.78, 88.58],
      [27.85, 88.61],
      [27.9, 88.54],
    ],
  },
  {
    id: 'detour-jn-road-alternate',
    title: 'Old Silk Route & Rongli Protected Corridor Bypass',
    blockedCorridor: 'JN Marg (13th Mile - Kyongnosla)',
    hazardAlertId: 'alert-jn-road-clearing',
    avoidedHazardType: 'road_closure',
    detourDistanceKm: 38.0,
    normalDistanceKm: 26.0,
    estimatedTravelTimeMinutes: 95,
    roadStatus: 'controlled_traffic',
    safetyRating: 4.4,
    recommendedVehicleType: 'all_vehicles',
    overview:
      'Historical Old Silk Route secondary mountain pass with gentle elevation gradients avoiding heavy machinery operations on primary JN Road.',
    cautionNotes: [
      'Permit verification required at Rongli SDPO checkpost.',
      'Fog density increases after 4:00 PM.',
    ],
    waypoints: [
      {
        name: '3rd Mile Junction',
        latitude: 27.338,
        longitude: 88.64,
        elevationMeters: 1950,
        roadCondition: 'paved_good',
        instruction: 'Take right fork toward Rongli / Padamchen sector.',
        safeSpeedKmph: 35,
        nearestAssistancePost: '3rd Mile Forest Checkpost',
      },
      {
        name: 'Rongli Transit Waypoint',
        latitude: 27.205,
        longitude: 88.71,
        elevationMeters: 1600,
        roadCondition: 'mountain_paved',
        instruction: 'Verify tourist pass at Rongli SDPO. Continue on asphalt road toward Gangtok loop.',
        safeSpeedKmph: 40,
        nearestAssistancePost: 'Rongli Police Station & Hospital',
      },
    ],
    pathCoordinates: [
      [27.338, 88.64],
      [27.29, 88.68],
      [27.205, 88.71],
      [27.331, 88.613],
    ],
  },
];

// Designated Sikkim Disaster Shelters & Relief Camps
export const SIKKIM_SAFE_SHELTERS: SafeShelter[] = [
  {
    id: 'shelter-stnm-gangtok',
    name: 'STNM Multispeciality Disaster Trauma Shelter & Relief Wing',
    localName: 'एसटीएनएम अस्पताल आपदा राहत केंद्र',
    district: 'Gangtok',
    type: 'district_hospital_trauma',
    latitude: 27.3412,
    longitude: 88.5998,
    altitudeMeters: 1650,
    capacityPersons: 450,
    currentOccupancy: 38,
    hasMedicalPost: true,
    hasEmergencyPower: true,
    hasSatelliteComms: true,
    is24x7Open: true,
    contactPhone: '03592-202944',
    address: 'Sochyagang, Sichey, Gangtok, East Sikkim',
  },
  {
    id: 'shelter-chungthang-sdma',
    name: 'Chungthang SDMA Disaster Coordination & High-Altitude Relief Hub',
    localName: 'चुंगथांग आपदा समन्वय एवं राहत केंद्र',
    district: 'Mangan',
    type: 'government_relief_camp',
    latitude: 27.6033,
    longitude: 88.6472,
    altitudeMeters: 1790,
    capacityPersons: 300,
    currentOccupancy: 45,
    hasMedicalPost: true,
    hasEmergencyPower: true,
    hasSatelliteComms: true,
    is24x7Open: true,
    contactPhone: '03592-234224',
    address: 'Chungthang Junction, North Sikkim Highway',
  },
  {
    id: 'shelter-gyalshing-stadium',
    name: 'Gyalshing Indoor Stadium & Disaster Assembly Refuge',
    localName: 'ग्यालशिंग इनडोर स्टेडियम आश्रय स्थल',
    district: 'Gyalshing',
    type: 'indoor_stadium_refuge',
    latitude: 27.283,
    longitude: 88.238,
    altitudeMeters: 2050,
    capacityPersons: 500,
    currentOccupancy: 12,
    hasMedicalPost: true,
    hasEmergencyPower: true,
    hasSatelliteComms: false,
    is24x7Open: true,
    contactPhone: '03595-250888',
    address: 'Gyalshing Sports Complex, West Sikkim',
  },
  {
    id: 'shelter-namchi-hall',
    name: 'Namchi Multi-Purpose Disaster Community Refuge Center',
    localName: 'नामची बहुउद्देशीय आपदा राहत केंद्र',
    district: 'Namchi',
    type: 'community_hall',
    latitude: 27.168,
    longitude: 88.355,
    altitudeMeters: 1315,
    capacityPersons: 350,
    currentOccupancy: 0,
    hasMedicalPost: true,
    hasEmergencyPower: true,
    hasSatelliteComms: true,
    is24x7Open: true,
    contactPhone: '03595-254644',
    address: 'Central Park Road, Namchi Bazaar, South Sikkim',
  },
  {
    id: 'shelter-pakyong-transit',
    name: 'Pakyong Sub-Divisional Emergency Transit Camp',
    localName: 'पाकयोंग आपातकालीन पारगमन शिविर',
    district: 'Pakyong',
    type: 'army_transit_camp',
    latitude: 27.239,
    longitude: 88.586,
    altitudeMeters: 1120,
    capacityPersons: 280,
    currentOccupancy: 20,
    hasMedicalPost: true,
    hasEmergencyPower: true,
    hasSatelliteComms: true,
    is24x7Open: true,
    contactPhone: '03592-257888',
    address: 'Airport Link Complex, Pakyong, East Sikkim',
  },
  {
    id: 'shelter-mangan-sports',
    name: 'Mangan District Headquarters Civil Defense Base',
    localName: 'मंगन नागरिक सुरक्षा बेस',
    district: 'Mangan',
    type: 'indoor_stadium_refuge',
    latitude: 27.505,
    longitude: 88.532,
    altitudeMeters: 1400,
    capacityPersons: 320,
    currentOccupancy: 15,
    hasMedicalPost: true,
    hasEmergencyPower: true,
    hasSatelliteComms: true,
    is24x7Open: true,
    contactPhone: '03592-234211',
    address: 'DC Office Complex, Mangan Bazaar, North Sikkim',
  },
];

// Terrain-specific Evacuation Guidelines
export const SIKKIM_EVACUATION_GUIDELINES: EvacuationGuideline[] = [
  {
    hazardType: 'landslide',
    title: 'Himalayan Landslide & Debris Flow Evacuation Protocol',
    summary:
      'Guidelines for identifying early geological warning signs, safely evacuating moving slopes, and surviving mountain road blockades.',
    urgencyLevel: 'immediate',
    immediateActions: [
      'Move perpendicular to the landslide path, never run downhill in the direction of debris.',
      'If driving, stop in a wide road section away from sheer overhangs; do not attempt to speed across active rockfall.',
      'Sound vehicle horn in continuous 3-second bursts to alert vehicles behind you.',
      'Watch for unusual sounds like trees cracking or rumbling boulders rolling down slopes.',
    ],
    steps: [
      {
        stepNumber: 1,
        actionTitle: 'Identify Immediate Threat Zone',
        details:
          'Observe the hillside above and road surface beneath. Fresh diagonal cracks in asphalt or muddy runoff from retaining walls indicate active sub-surface movement.',
        doList: [
          'Evacuate vehicle if debris flow is escalating.',
          'Climb to stable, vegetated high ground away from drainage channels.',
          'Carry essential survival pouch (water, dry rations, flashlight, powerbank).',
        ],
        dontList: [
          'Do not cross recently fallen mud even if it looks shallow; liquefaction can trap vehicles.',
          'Do not stand near stream beds or culverts where debris flow accelerates.',
        ],
      },
      {
        stepNumber: 2,
        actionTitle: 'Contact Rescue Authorities & Beacon Location',
        details:
          'Dial Sikkim SDMA Helpline (1364) or State Emergency Operation Centre (1070). Transmit GPS coordinates via SMS or Sikkim Yatra SOS module.',
        doList: [
          'Provide landmark name, milestone distance, and number of persons stranded.',
          'Conserve phone battery by enabling Ultra Power Saver mode.',
        ],
        dontList: [
          'Do not leave the vehicle stranded across the middle of the road blocking earthmovers.',
        ],
      },
      {
        stepNumber: 3,
        actionTitle: 'Wait for BRO / SDMA Clearance',
        details:
          'Stay in designated safe assembly zones (e.g. concrete police posts or certified shelters) until BRO officially issues a safe clearance certificate.',
        doList: [
          'Share drinking water and warmth with elderly or children.',
          'Listen to official radio bulletins / Sikkim Yatra real-time alerts.',
        ],
        dontList: ['Do not attempt nighttime walking along unlit landslide passes.'],
      },
    ],
    emergencyKitList: [
      'High-lumen LED flashlight with spare batteries',
      'Foil thermal emergency blanket',
      'Water purification tablets & 2 liters bottled water',
      'First aid kit with tourniquet and antiseptic wipes',
      'Offline downloaded Sikkim Yatra offline maps',
    ],
    himalayanTerrainNotes:
      'Sikkim’s young Himalayan phyllite and schist rock formations are vulnerable to pore-pressure failure during monsoon and post-monsoon seasons.',
    helplines: [
      { name: 'Sikkim State Disaster Helpline', phone: '1070', hours: '24x7 Toll Free' },
      { name: 'Sikkim Tourist Emergency Cell', phone: '1364', hours: '24x7 Toll Free' },
      { name: 'Border Roads Organisation Control', phone: '03592-202222', hours: '24x7' },
      { name: 'Police Emergency Central Control', phone: '112', hours: '24x7' },
    ],
  },
  {
    hazardType: 'flash_flood',
    title: 'Teesta River & GLOF (Glacial Lake Outburst) Flood Evacuation Protocol',
    summary:
      'Immediate survival steps for rapidly rising river waters, dam releases, and high-altitude glacial lake breaches.',
    urgencyLevel: 'immediate',
    immediateActions: [
      'Move immediately to ground at least 30 to 50 meters above riverbed level.',
      'Never drive or walk across flooded bridges or causeways.',
      'Abandon all riverside luggage and prioritize life safety.',
      'Observe river color: sudden muddy turbidity or dark foaming water is a sign of upstream dam breach or flash surge.',
    ],
    steps: [
      {
        stepNumber: 1,
        actionTitle: 'Immediate Vertical Evacuation',
        details:
          'Climb uphill using paved mountain pathways toward ridge settlements or designated multi-story concrete structures.',
        doList: [
          'Help children and elderly to higher terrain immediately.',
          'Disconnect vehicle battery if you must leave car parked in a high-ground lot.',
        ],
        dontList: [
          'Never remain on riverbanks to record videos or salvage belongings.',
          'Do not enter underground basements or riverside hotel ground floors.',
        ],
      },
      {
        stepNumber: 2,
        actionTitle: 'Check into Designated Relief Hub',
        details:
          'Locate the nearest designated relief camp (e.g. STNM Hospital or Chungthang SDMA hub) via Sikkim Yatra offline database.',
        doList: [
          'Register with relief officers for family tracking and ration distribution.',
          'Notify emergency contacts using Sikkim Yatra Live Location / SOS.',
        ],
        dontList: ['Do not drink untreated river floodwater under any circumstance.'],
      },
    ],
    emergencyKitList: [
      'Waterproof document pouch with ID proofs and permits',
      'Whistle for acoustic signaling to search & rescue helicopters',
      'Waterproof jacket / thermal fleece layer',
      'Personal prescribed medications (7-day supply)',
    ],
    himalayanTerrainNotes:
      'The Teesta and Rangit river systems flow through narrow V-shaped mountain valleys where floodwaters rise exponentially within minutes.',
    helplines: [
      { name: 'Central Water Commission Teesta Cell', phone: '03592-202111', hours: '24x7' },
      { name: 'State Emergency Operation Centre (SEOC)', phone: '1070', hours: '24x7' },
      { name: 'Disaster Ambulance Network', phone: '108', hours: '24x7' },
    ],
  },
  {
    hazardType: 'earthquake',
    title: 'High-Altitude Mountain Seismic Safety & Evacuation Protocol',
    summary:
      'Earthquake response protocols designed for Sikkim’s hilly terrain, steep slope masonry, and secondary rockfall hazards.',
    urgencyLevel: 'immediate',
    immediateActions: [
      'DROP, COVER, and HOLD ON under sturdy wooden tables away from glass facades.',
      'If outdoors, move away from steep cliffs, masonry retaining walls, and high-tension electric poles.',
      'Expect aftershocks within 15–45 minutes; do not rush into damaged buildings.',
    ],
    steps: [
      {
        stepNumber: 1,
        actionTitle: 'Survive the Primary Tremor',
        details:
          'Protect head and neck with arms or heavy blankets. Wait until ground shaking completely stops before attempting evacuation.',
        doList: [
          'Use stairs only; never use elevators.',
          'Check for gas leaks and turn off master electrical trip switches.',
        ],
        dontList: ['Do not jump from balconies or high windows.'],
      },
      {
        stepNumber: 2,
        actionTitle: 'Assemble in Certified Open Safe Grounds',
        details:
          'Proceed to designated earthquake open assembly grounds (MG Marg promenade, Gyalshing Stadium ground, Palzor Stadium, or open school grounds).',
        doList: [
          'Keep clear of multistory buildings that show structural shear cracks.',
          'Keep roads clear for emergency ambulances and fire tenders.',
        ],
        dontList: ['Do not light matches or open flames due to potential gas line leaks.'],
      },
    ],
    emergencyKitList: [
      'Heavy-duty leather work gloves',
      'Sturdy mountain walking boots',
      'Battery-powered AM/FM radio receiver',
      'Emergency dust masks (N95)',
    ],
    himalayanTerrainNotes:
      'Sikkim is situated in Seismic Zone IV/V. Secondary hazards such as rock avalanches and slope creep often follow significant tremors.',
    helplines: [
      { name: 'State Disaster Management (SSDMA)', phone: '1070', hours: '24x7' },
      { name: 'Fire & Emergency Services', phone: '101', hours: '24x7' },
      { name: 'Gangtok Police Control Room', phone: '03592-202022', hours: '24x7' },
    ],
  },
  {
    hazardType: 'heavy_snowfall',
    title: 'High-Altitude Blizzard & Snow Stranding Survival Protocol',
    summary:
      'Survival guide for sub-zero mountain passes, vehicle snow entrapment, hypothermia prevention, and oxygen conservation.',
    urgencyLevel: 'high_caution',
    immediateActions: [
      'Stay inside your vehicle if stranded in a blizzard; you are far more visible and shielded from wind chill.',
      'Run the vehicle engine for 10 minutes every hour for heat; ensure the exhaust pipe is clear of packed snow to prevent carbon monoxide poisoning.',
      'Crack a downwind window slightly (1 cm) for fresh oxygen ventilation.',
      'Tie a bright colored cloth/jacket to vehicle antenna or roof rail.',
    ],
    steps: [
      {
        stepNumber: 1,
        actionTitle: 'Combat Hypothermia & Frostbite',
        details:
          'Layer clothing (synthetic base layer, fleece insulation, windproof shell). Keep head, hands, and feet completely dry.',
        doList: [
          'Huddle with co-travelers to pool body heat.',
          'Perform light isometric toe and finger wiggling exercises to maintain circulation.',
        ],
        dontList: [
          'Do not consume alcohol (it dilates blood vessels and accelerates core heat loss).',
          'Do not rub frostbitten skin with snow.',
        ],
      },
      {
        stepNumber: 2,
        actionTitle: 'Signal Army & Rescue Convoys',
        details:
          'Keep vehicle hazard blinkers flashing. At night, flash roof dome light periodically.',
        doList: [
          'Conserve flashlight batteries by using short bursts.',
          'Stay calm; Army 17th Mountain Division conducts regular patrol sweeps on all Sikkim high passes.',
        ],
        dontList: ['Do not wander away from the roadway into unmarked snowbanks.'],
      },
    ],
    emergencyKitList: [
      'Steel tire chains & tow rope',
      'Thermal sleeping bag / emergency bivy sack',
      'High-calorie chocolate/energy bars and thermos of warm water',
      'Portable pulse oximeter and oxygen booster canister',
    ],
    himalayanTerrainNotes:
      'Altitude sickness (AMS) compounds rapidly in freezing weather above 12,000 feet. Descend immediately if experiencing severe dizziness or blue lips.',
    helplines: [
      { name: 'Army High Altitude Rescue Cell', phone: '03592-202222', hours: '24x7' },
      { name: 'Tourist Assistance Helpline', phone: '1364', hours: '24x7 Toll Free' },
      { name: 'Medical Emergency Command (STNM)', phone: '102', hours: '24x7' },
    ],
  },
];

// Helper functions for alerts management and querying
export function getStoredAlerts(filter: {
  status?: string;
  district?: string;
  severity?: string;
  activeOnly?: boolean;
} = {}): DisasterAlert[] {
  return DISASTER_ALERTS_STORE.filter(alert => {
    if (filter.activeOnly && alert.status !== 'active') return false;
    if (filter.status && filter.status !== 'all' && alert.status !== filter.status) return false;
    if (filter.district && filter.district !== 'all' && alert.district !== filter.district) return false;
    if (filter.severity && filter.severity !== 'all' && alert.severity !== filter.severity) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAlertById(id: string): DisasterAlert | undefined {
  return DISASTER_ALERTS_STORE.find(a => a.id === id);
}

export function createDisasterAlert(payload: CreateAlertPayload): DisasterAlert {
  const newId = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const expiresAt = payload.expiresInHours
    ? new Date(Date.now() + payload.expiresInHours * 3600 * 1000).toISOString()
    : undefined;

  const newAlert: DisasterAlert = {
    id: newId,
    title: payload.title,
    description: payload.description,
    type: payload.type,
    severity: payload.severity,
    status: 'active',
    district: payload.district,
    centerLat: payload.centerLat,
    centerLng: payload.centerLng,
    radiusKm: payload.radiusKm,
    affectedCorridor: payload.affectedCorridor,
    recommendedAction: payload.recommendedAction,
    alternateRouteId: payload.alternateRouteId,
    sourceAuthority: payload.sourceAuthority || 'Sikkim State Disaster Management Authority (SSDMA)',
    startsAt: now,
    expiresAt,
    geoPolygon: payload.geoPolygon,
    createdAt: now,
    updatedAt: now,
  };

  DISASTER_ALERTS_STORE.unshift(newAlert);
  return newAlert;
}

export function updateDisasterAlert(id: string, payload: UpdateAlertPayload): DisasterAlert | null {
  const current = DISASTER_ALERTS_STORE.find(a => a.id === id);
  if (!current) return null;

  const now = new Date().toISOString();

  const updated: DisasterAlert = {
    id: current.id,
    title: payload.title ?? current.title,
    description: payload.description ?? current.description,
    type: current.type,
    severity: payload.severity ?? current.severity,
    status: payload.status ?? current.status,
    district: current.district,
    centerLat: current.centerLat,
    centerLng: current.centerLng,
    radiusKm: payload.radiusKm ?? current.radiusKm,
    affectedCorridor: current.affectedCorridor,
    recommendedAction: payload.recommendedAction ?? current.recommendedAction,
    alternateRouteId: payload.alternateRouteId ?? current.alternateRouteId,
    sourceAuthority: current.sourceAuthority,
    startsAt: current.startsAt,
    expiresAt: current.expiresAt,
    resolvedAt: payload.status === 'resolved' ? now : current.resolvedAt,
    geoPolygon: current.geoPolygon,
    createdAt: current.createdAt,
    updatedAt: now,
  };

  const index = DISASTER_ALERTS_STORE.findIndex(a => a.id === id);
  if (index !== -1) {
    DISASTER_ALERTS_STORE[index] = updated;
  }
  return updated;
}

export function deleteDisasterAlert(id: string): boolean {
  const initialLen = DISASTER_ALERTS_STORE.length;
  DISASTER_ALERTS_STORE = DISASTER_ALERTS_STORE.filter(a => a.id !== id);
  return DISASTER_ALERTS_STORE.length < initialLen;
}

export function findMatchingSafeDetour(alertIdOrCorridor: string): SafeRouteDetour | undefined {
  return SIKKIM_SAFE_DETOURS.find(
    d =>
      d.hazardAlertId === alertIdOrCorridor ||
      d.id === alertIdOrCorridor ||
      d.blockedCorridor.toLowerCase().includes(alertIdOrCorridor.toLowerCase())
  );
}

export function querySafeShelters(
  userLat?: number,
  userLng?: number,
  district?: SikkimDistrict | 'all'
): (SafeShelter & { distanceKm?: number })[] {
  let list = SIKKIM_SAFE_SHELTERS;

  if (district && district !== 'all') {
    list = list.filter(s => s.district === district);
  }

  if (userLat !== undefined && userLng !== undefined) {
    const withDistance = list.map(shelter => {
      const distanceKm = Number(
        calculateDistanceKm(userLat, userLng, shelter.latitude, shelter.longitude).toFixed(1)
      );
      return { ...shelter, distanceKm };
    });

    return withDistance.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }

  return list;
}

export function getEvacuationGuideline(hazardType: DisasterType): EvacuationGuideline | undefined {
  return SIKKIM_EVACUATION_GUIDELINES.find(g => g.hazardType === hazardType);
}
