import {
  PlaceSummary,
  VendorSummary,
  EmergencyContactSummary,
  HazardAlertSummary,
  PlaceDetailResponse,
  MapFeatureItem,
  MapLayersResponse,
  PlaceFilterParams,
} from '@sikkim-yatra/shared';

export const SIKKIM_PLACES_DATA: PlaceSummary[] = [
  {
    id: 'place-rumtek',
    slug: 'rumtek-monastery',
    name: 'Rumtek Monastery',
    localName: 'རུམ་ཐེག་དགོན་པ (Dharma Chakra Centre)',
    district: 'Gangtok',
    category: 'monastery',
    description:
      'The largest monastery in Sikkim and the premier seat of the Karma Kagyu lineage in exile. Perched atop a green hill facing Gangtok, it features sacred Buddhist murals, golden stupas, and peaceful mountain chanting halls.',
    altitudeMeters: 1500,
    latitude: 27.3023,
    longitude: 88.5492,
    rating: 4.8,
    reviewCount: 420,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1200',
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1200',
    ],
    permitRequired: false,
    bestTimeToVisit: 'October to May',
    openingHours: '6:00 AM - 6:00 PM',
    entryFee: '₹10 for Indians, ₹50 for Foreign Nationals',
    offlineAvailable: true,
  },
  {
    id: 'place-pemayangtse',
    slug: 'pemayangtse-monastery',
    name: 'Pemayangtse Monastery',
    localName: 'པདྨ་ཡང་རྩེ (Sublime Perfect Lotus)',
    district: 'Gyalshing',
    category: 'monastery',
    description:
      'One of the oldest premier Nyingma monasteries in Sikkim, overlooking the snow-capped Kanchenjunga range. Houses the famous seven-tiered wooden masterpiece depicting Zandogpalri (Guru Rinpoche’s Heavenly Abode).',
    altitudeMeters: 2085,
    latitude: 27.306,
    longitude: 88.2483,
    rating: 4.7,
    reviewCount: 310,
    thumbnailUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?q=80&w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
    ],
    permitRequired: false,
    bestTimeToVisit: 'March to June, September to December',
    openingHours: '7:00 AM - 5:00 PM',
    entryFee: '₹20 per person',
    offlineAvailable: true,
  },
  {
    id: 'place-mgmarg',
    slug: 'mg-marg-gangtok',
    name: 'MG Marg & Gangtok Promenade',
    localName: 'महात्मा गांधी मार्ग (गंगटोक)',
    district: 'Gangtok',
    category: 'town',
    description:
      'The pedestrian-only open-air mall of Sikkim’s capital, lined with vibrant cafes, local Sikkimese eateries, souvenir shops, and the central Directorate of Sikkim Tourism Information Centre.',
    altitudeMeters: 1650,
    latitude: 27.3314,
    longitude: 88.6138,
    rating: 4.9,
    reviewCount: 1250,
    thumbnailUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=1200',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
    ],
    permitRequired: false,
    bestTimeToVisit: 'Year-round (Best: Oct - Apr)',
    openingHours: 'Open 24 hours (Shops 9:00 AM - 8:30 PM)',
    entryFee: 'Free',
    offlineAvailable: true,
  },
  {
    id: 'place-gurudongmar',
    slug: 'gurudongmar-lake',
    name: 'Gurudongmar Lake',
    localName: 'གུ་རུ་གདོང་དམར (Sacred High Altitude Lake)',
    district: 'Mangan',
    category: 'high_altitude_lake',
    description:
      'One of the highest lakes in the world at 17,800 feet (5,430 m), surrounded by Tibetan plateau peaks. Revered by Buddhists, Sikhs, and Hindus, a part of the lake remains unfrozen even in freezing sub-zero winters.',
    altitudeMeters: 5430,
    latitude: 27.9942,
    longitude: 88.7107,
    rating: 4.9,
    reviewCount: 580,
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
      'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1200',
    ],
    permitRequired: true,
    permitType: 'Protected Area Permit (PAP) issued via Chungthang / Gangtok Tourism Dept',
    bestTimeToVisit: 'April to June, October to mid-November',
    openingHours: 'Morning hours only (must exit by 1:00 PM due to high mountain winds)',
    entryFee: 'Permit charges apply via registered Sikkim tour operators',
    offlineAvailable: true,
  },
  {
    id: 'place-tsomgo',
    slug: 'tsomgo-lake',
    name: 'Tsomgo Lake (Changu Lake)',
    localName: 'མཚོ་མགོ (Source of the Lake)',
    district: 'Gangtok',
    category: 'high_altitude_lake',
    description:
      'A sacred glacial lake located at 12,310 feet on the scenic highway towards Nathu La Pass. The pristine water mirrors changing Himalayan seasons, surrounded by alpine rhododendrons and decorated yak safaris.',
    altitudeMeters: 3753,
    latitude: 27.3742,
    longitude: 88.7619,
    rating: 4.6,
    reviewCount: 940,
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200',
    ],
    permitRequired: true,
    permitType: 'Protected Area Permit (PAP) required for all travelers',
    bestTimeToVisit: 'March to May, October to December',
    openingHours: '7:30 AM - 3:00 PM',
    entryFee: 'Permit pass required',
    offlineAvailable: true,
  },
  {
    id: 'place-chardham',
    slug: 'namchi-char-dham',
    name: 'Siddhesvara Dhaam (Namchi Char Dham)',
    localName: 'नामची चार धाम (सोलफोक)',
    district: 'Namchi',
    category: 'cultural_heritage',
    description:
      'A majestic pilgrimage and cultural complex perched atop Solophok Hill featuring an 87-foot statue of Lord Shiva overlooking replicas of India’s four sacred Dhams and the 12 Jyotirlingas.',
    altitudeMeters: 1315,
    latitude: 27.1648,
    longitude: 88.3512,
    rating: 4.8,
    reviewCount: 780,
    thumbnailUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?q=80&w=1200',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
    ],
    permitRequired: false,
    bestTimeToVisit: 'October to May',
    openingHours: '6:30 AM - 8:00 PM',
    entryFee: '₹50 per adult',
    offlineAvailable: true,
  },
];

export const SIKKIM_HISTORIES: Record<string, string> = {
  'rumtek-monastery':
    'Originally founded by the 12th Gyalwa Karmapa Changchub Dorje in the mid-18th century. When His Holiness the 16th Karmapa Rangjung Rigpe Dorje arrived in Sikkim in 1959 after leaving Tibet, he rebuilt Rumtek as the primary seat of the Karma Kagyu lineage in exile. The shrine houses ancient sacred manuscripts, thangkas, and the Golden Stupa containing the holy relics of the 16th Karmapa.',
  'pemayangtse-monastery':
    'Designed by Lama Lhatsun Chempo in the 17th century and consecrated in 1705, Pemayangtse is the premier monastery of the Nyingma order in Sikkim. Only Ta-Sang monks of pure Tibetan/Sikkimese heritage could be initiated here. On the top floor stands the legendary Sangtokpalri, a seven-tiered intricate wooden sculpture hand-carved by Dungzin Rinpoche depicting Guru Padmasambhava’s celestial mansion.',
  'mg-marg-gangtok':
    'Named after Mahatma Gandhi, MG Marg is the historic commercial and social nerve center of Sikkim. It was completely transformed into India’s first pedestrianized, litter-free and spit-free zone, setting national standards for sustainable Himalayan town planning and vibrant evening community life.',
  'gurudongmar-lake':
    'Situated at 17,800 feet near the Tibetan border, the lake is sanctified by Guru Padmasambhava (Guru Rinpoche), who visited in the 8th century and touched a corner of the freezing lake to provide potable water to locals throughout the bitter winter. Even in -25°C winters, that exact portion remains liquid. It was also visited by Guru Nanak in the 15th century during his third Udasi.',
  'tsomgo-lake':
    'In the Bhutia language, Tsomgo translates to "Source of the Lake". In ancient times, Buddhist lamas predicted future political and weather events by closely observing the changing colors of the lake water. The surrounding alpine slopes bloom with native blue poppies, primulas, and rhododendrons from April to June.',
  'namchi-char-dham':
    'Conceived to promote spiritual and cultural tourism in South Sikkim, the complex on Solophok hill blends traditional Vedic temple architecture with Himalayan stonework. Solophok hill is spiritually significant as the legendary place where Arjuna performed penance to receive the Pashupatastra weapon from Lord Shiva.',
};

export const SIKKIM_VENDORS_DATA: VendorSummary[] = [
  {
    id: 'vendor-1',
    businessName: 'Dharma Chakra Heritage Homestay',
    ownerName: 'Karma Bhutia',
    type: 'homestay',
    description:
      'Authentic Sikkimese wooden homestay with direct view of Rumtek valley. Serves organic home-cooked meals with locally brewed herbal teas.',
    phone: '+91 98320 67890',
    whatsapp: '+919832067890',
    address: 'Monastery Road, Sajong, Gangtok District',
    district: 'Gangtok',
    latitude: 27.3015,
    longitude: 88.548,
    isVerified: true,
    pricingInfo: '₹1,500 - ₹2,800 / night (includes breakfast & dinner)',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800'],
    rating: 4.9,
    placeId: 'place-rumtek',
  },
  {
    id: 'vendor-2',
    businessName: 'Mount Pandim View Homestay Pelling',
    ownerName: 'Passang Lepcha',
    type: 'homestay',
    description:
      'Cozy alpine stay 5 minutes from Pemayangtse with unobstructed sunrise panoramas of Mt. Kanchenjunga and organic kitchen garden.',
    phone: '+91 94341 88990',
    whatsapp: '+919434188990',
    address: 'Near Helipad, Upper Pelling, Gyalshing District',
    district: 'Gyalshing',
    latitude: 27.3075,
    longitude: 88.245,
    isVerified: true,
    pricingInfo: '₹2,000 / night',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800'],
    rating: 4.8,
    placeId: 'place-pemayangtse',
  },
  {
    id: 'vendor-3',
    businessName: 'The Square Sikkim Cafe & Bakery',
    ownerName: 'Doma Wangchuk',
    type: 'restaurant_cafe',
    description:
      'Authentic Momos, Thukpa, Gundruk fermented soup, organic Tingmo, and artisanal Himalayan coffee overlooking the promenade.',
    phone: '+91 98323 11223',
    whatsapp: '+919832311223',
    address: 'MG Marg Central Promenade, Gangtok',
    district: 'Gangtok',
    latitude: 27.3318,
    longitude: 88.6142,
    isVerified: true,
    pricingInfo: '₹200 - ₹600 per person',
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800'],
    rating: 4.7,
    placeId: 'place-mgmarg',
  },
  {
    id: 'vendor-4',
    businessName: 'Lachen High-Altitude Trekking & Guides',
    ownerName: 'Chewang Lachenpa',
    type: 'trekking_guide',
    description:
      'Govt-certified high altitude expedition guides with oxygen cylinders, permit processing, and 4WD vehicles for Gurudongmar & Chopta Valley.',
    phone: '+91 94750 99887',
    whatsapp: '+919475099887',
    address: 'Lachen Village Center, Mangan District',
    district: 'Mangan',
    latitude: 27.7214,
    longitude: 88.5562,
    isVerified: true,
    pricingInfo: 'Custom packages based on group size and vehicle requirement',
    images: ['https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=800'],
    rating: 5.0,
    placeId: 'place-gurudongmar',
  },
  {
    id: 'vendor-5',
    businessName: 'JN Road Mountain 4x4 Cab Drivers Union',
    ownerName: 'Bikash Subba',
    type: 'taxi_driver',
    description:
      'All-weather 4WD Scorpio and Innova tourist transfers with snow chains for Tsomgo Lake, Baba Mandir, and Nathu La Pass.',
    phone: '+91 97330 44556',
    whatsapp: '+919733044556',
    address: 'Vajra Stand, Gangtok',
    district: 'Gangtok',
    latitude: 27.338,
    longitude: 88.615,
    isVerified: true,
    pricingInfo: '₹3,500 - ₹5,500 per reserved vehicle (including permits)',
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800'],
    rating: 4.6,
    placeId: 'place-tsomgo',
  },
  {
    id: 'vendor-6',
    businessName: 'Char Dham Pilgrim Homestay & Organic Kitchen',
    ownerName: 'Sunita Rai',
    type: 'homestay',
    description:
      'Pure vegetarian peaceful homestay situated 800m from Siddhesvara Dhaam with stunning valley and temple views.',
    phone: '+91 94348 22334',
    whatsapp: '+919434822334',
    address: 'Solophok Road, Namchi District',
    district: 'Namchi',
    latitude: 27.163,
    longitude: 88.353,
    isVerified: true,
    pricingInfo: '₹1,200 - ₹2,000 / night',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800'],
    rating: 4.8,
    placeId: 'place-chardham',
  },
];

export const SIKKIM_EMERGENCY_DATA: EmergencyContactSummary[] = [
  {
    id: 'em-1',
    name: 'Sikkim 24x7 Tourist Assistance Helpline',
    type: 'tourist_helpline',
    phone: '1364',
    altPhone: '03592-209090',
    address: 'Directorate of Tourism, MG Marg, Gangtok',
    district: 'Gangtok',
    latitude: 27.331,
    longitude: 88.6135,
    is24x7: true,
    description:
      'State government toll-free line for tourist distress, permit clarifications, and rescue dispatch.',
    placeId: 'place-mgmarg',
  },
  {
    id: 'em-2',
    name: 'Gangtok Sadar Police Station',
    type: 'police_station',
    phone: '03592-202022',
    altPhone: '112',
    address: 'NH10, Gangtok',
    district: 'Gangtok',
    latitude: 27.3295,
    longitude: 88.612,
    is24x7: true,
    description: 'Central Gangtok emergency police control room.',
    placeId: 'place-mgmarg',
  },
  {
    id: 'em-3',
    name: 'STNM Multispeciality Government Hospital',
    type: 'hospital',
    phone: '03592-202944',
    altPhone: '102',
    address: 'Sochyagang, Sichey, Gangtok',
    district: 'Gangtok',
    latitude: 27.3412,
    longitude: 88.5998,
    is24x7: true,
    description:
      'Premier tertiary hospital in Sikkim with 24x7 Trauma Center and high-altitude ICU facilities.',
    placeId: 'place-rumtek',
  },
  {
    id: 'em-4',
    name: 'Chungthang Police & Disaster Rescue Post',
    type: 'disaster_management_sdma',
    phone: '03592-234224',
    altPhone: '112',
    address: 'Chungthang Junction, North Sikkim',
    district: 'Mangan',
    latitude: 27.6033,
    longitude: 88.6472,
    is24x7: true,
    description:
      'Gateway emergency checkpost and high-altitude rescue coordination for Lachen and Gurudongmar.',
    placeId: 'place-gurudongmar',
  },
  {
    id: 'em-5',
    name: 'Gyalshing District Hospital & Trauma Center',
    type: 'hospital',
    phone: '03595-250888',
    altPhone: '108',
    address: 'Gyalshing Bazaar, West Sikkim',
    district: 'Gyalshing',
    latitude: 27.283,
    longitude: 88.238,
    is24x7: true,
    description: 'District emergency ward servicing Pelling, Pemayangtse, and Yuksom sectors.',
    placeId: 'place-pemayangtse',
  },
  {
    id: 'em-6',
    name: 'Kyongnosla Army & Police High Altitude Checkpost',
    type: 'mountain_rescue',
    phone: '03592-202222',
    altPhone: '112',
    address: 'JN Road, Kyongnosla, East Sikkim',
    district: 'Gangtok',
    latitude: 27.37,
    longitude: 88.75,
    is24x7: true,
    description:
      'High altitude medical aid post with emergency oxygen facilities on the Tsomgo-Nathu La route.',
    placeId: 'place-tsomgo',
  },
  {
    id: 'em-7',
    name: 'Namchi District Hospital',
    type: 'hospital',
    phone: '03595-254644',
    altPhone: '102',
    address: 'Namchi Headquarters, South Sikkim',
    district: 'Namchi',
    latitude: 27.168,
    longitude: 88.355,
    is24x7: true,
    description: 'Full emergency ward and ambulance services for South Sikkim.',
    placeId: 'place-chardham',
  },
];

export const SIKKIM_HAZARD_ALERTS: HazardAlertSummary[] = [
  {
    id: 'alert-1',
    title: 'Heavy Snowfall & Sub-Zero Advisory on Thangu-Gurudongmar Pass',
    description:
      'Severe snowfall and sub-zero temperatures near Thangu pass (13,000 ft). Only high-ground-clearance 4WD vehicles with snow chains are allowed past Thangu checkpost before 11:30 AM.',
    type: 'heavy_snowfall',
    severity: 'high',
    status: 'active',
    district: 'Mangan',
    centerLat: 27.9,
    centerLng: 88.68,
    radiusKm: 16.0,
    startsAt: new Date().toISOString(),
    placeId: 'place-gurudongmar',
  },
  {
    id: 'alert-2',
    title: 'Scheduled Road Clearing by BRO on JN Road (13th Mile to Kyongnosla)',
    description:
      'Border Roads Organisation (BRO) routine debris clearance. One-way controlled traffic flow active between 10:00 AM and 1:00 PM.',
    type: 'road_closure',
    severity: 'moderate',
    status: 'active',
    district: 'Gangtok',
    centerLat: 27.35,
    centerLng: 88.7,
    radiusKm: 8.0,
    startsAt: new Date().toISOString(),
    placeId: 'place-tsomgo',
  },
];

// Helper functions to query data
export function queryPlaces(params: PlaceFilterParams = {}): PlaceSummary[] {
  const { search, category, district, permitRequired } = params;

  return SIKKIM_PLACES_DATA.filter(place => {
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      const matchName = place.name.toLowerCase().includes(q);
      const matchLocal = place.localName?.toLowerCase().includes(q);
      const matchDesc = place.description.toLowerCase().includes(q);
      const matchDistrict = place.district.toLowerCase().includes(q);
      if (!matchName && !matchLocal && !matchDesc && !matchDistrict) {
        return false;
      }
    }

    if (district && district !== 'all') {
      if (place.district.toLowerCase() !== district.toLowerCase()) {
        return false;
      }
    }

    if (permitRequired !== undefined) {
      if (place.permitRequired !== permitRequired) {
        return false;
      }
    }

    if (category && category !== 'all') {
      if (category === 'culture') {
        return place.category === 'monastery' || place.category === 'cultural_heritage';
      }
      if (category === 'stay') {
        return place.category === 'town';
      }
      if (category === 'food') {
        return place.category === 'town';
      }
      if (category === 'safety') {
        return false; // Safety matches emergency contacts, filtered in unified view
      }
      if (category === 'hazard') {
        return place.slug === 'gurudongmar-lake' || place.slug === 'tsomgo-lake';
      }
    }

    return true;
  });
}

export function queryPlaceDetailBySlug(slug: string): PlaceDetailResponse | null {
  const place = SIKKIM_PLACES_DATA.find(p => p.slug === slug);
  if (!place) {
    return null;
  }

  const nearbyVendors = SIKKIM_VENDORS_DATA.filter(v => v.placeId === place.id);
  const nearbyEmergencyContacts = SIKKIM_EMERGENCY_DATA.filter(e => e.placeId === place.id);
  const activeAlerts = SIKKIM_HAZARD_ALERTS.filter(a => a.placeId === place.id);
  const history = SIKKIM_HISTORIES[place.slug] || place.description;

  return {
    ...place,
    history,
    nearbyVendors,
    nearbyEmergencyContacts,
    activeAlerts,
  };
}

export function queryMapLayers(): MapLayersResponse {
  const features: MapFeatureItem[] = [];

  // 1. Add Places as map features
  for (const place of SIKKIM_PLACES_DATA) {
    features.push({
      id: place.id,
      markerType:
        place.category === 'monastery'
          ? 'monastery'
          : place.category === 'cultural_heritage'
            ? 'cultural'
            : 'monastery',
      title: place.name,
      subtitle: place.localName || `${place.district} District`,
      category: place.category,
      district: place.district,
      latitude: place.latitude,
      longitude: place.longitude,
      altitudeMeters: place.altitudeMeters,
      rating: place.rating,
      thumbnailUrl: place.thumbnailUrl,
      linkUrl: `/places/${place.slug}`,
    });
  }

  // 2. Add Vendors as map features
  for (const vendor of SIKKIM_VENDORS_DATA) {
    if (vendor.latitude && vendor.longitude) {
      features.push({
        id: vendor.id,
        markerType:
          vendor.type === 'homestay'
            ? 'stay'
            : vendor.type === 'restaurant_cafe'
              ? 'food'
              : 'vendor',
        title: vendor.businessName,
        subtitle: `${vendor.ownerName} • ${vendor.pricingInfo || 'Verified Local Vendor'}`,
        category: vendor.type,
        district: vendor.district,
        latitude: vendor.latitude,
        longitude: vendor.longitude,
        rating: vendor.rating,
        thumbnailUrl: vendor.images[0],
        phone: vendor.phone,
        details: {
          whatsapp: vendor.whatsapp,
          address: vendor.address,
        },
      });
    }
  }

  // 3. Add Emergency Contacts as map features
  for (const contact of SIKKIM_EMERGENCY_DATA) {
    features.push({
      id: contact.id,
      markerType:
        contact.type === 'hospital'
          ? 'hospital'
          : contact.type === 'police_station'
            ? 'police'
            : 'helpline',
      title: contact.name,
      subtitle: `${contact.phone} • 24x7 Helpline`,
      category: contact.type,
      district: contact.district,
      latitude: contact.latitude,
      longitude: contact.longitude,
      phone: contact.phone,
      details: {
        address: contact.address,
        altPhone: contact.altPhone,
        description: contact.description,
      },
    });
  }

  return {
    features,
    hazardZones: SIKKIM_HAZARD_ALERTS,
    statistics: {
      totalPlaces: SIKKIM_PLACES_DATA.length,
      totalVendors: SIKKIM_VENDORS_DATA.length,
      totalEmergencyContacts: SIKKIM_EMERGENCY_DATA.length,
      activeAlerts: SIKKIM_HAZARD_ALERTS.length,
    },
  };
}
