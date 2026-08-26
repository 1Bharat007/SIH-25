import {
  PrismaClient,
  Role,
  District,
  PlaceCategory,
  VendorType,
  EmergencyType,
  AlertType,
  AlertSeverity,
  AlertStatus,
  SOSStatus,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding Sikkim Yatra database with authentic Sikkim tourism data...');

  // Clean existing records (in dependency order)
  await prisma.sOSRequest.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.review.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.place.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ---------------------------------------------------------------------------
  // 1. CREATE USERS
  // ---------------------------------------------------------------------------
  const adminPasswordHash = await bcrypt.hash('Admin@12345', 10);
  const vendorPasswordHash = await bcrypt.hash('Vendor@12345', 10);
  const touristPasswordHash = await bcrypt.hash('Tourist@12345', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Tenzing Norbu (SDMA Admin)',
      email: 'admin@sikkimyatra.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      phone: '+91 94340 12345',
    },
  });

  const vendorUser = await prisma.user.create({
    data: {
      name: 'Karma Bhutia',
      email: 'vendor@sikkimyatra.com',
      passwordHash: vendorPasswordHash,
      role: Role.VENDOR,
      phone: '+91 98320 67890',
    },
  });

  const touristUser = await prisma.user.create({
    data: {
      name: 'Ananya Sharma',
      email: 'tourist@sikkimyatra.com',
      passwordHash: touristPasswordHash,
      role: Role.TOURIST,
      phone: '+91 98765 43210',
    },
  });

  // eslint-disable-next-line no-console
  console.log('✅ Created initial users for all roles (Admin, Vendor, Tourist)');

  // ---------------------------------------------------------------------------
  // 2. CREATE SIKKIM PLACES
  // ---------------------------------------------------------------------------
  const rumtek = await prisma.place.create({
    data: {
      slug: 'rumtek-monastery',
      name: 'Rumtek Monastery',
      localName: 'རུམ་ཐེག་དགོན་པ (Dharma Chakra Centre)',
      district: District.GANGTOK,
      category: PlaceCategory.MONASTERY,
      description:
        'The largest monastery in Sikkim and the main seat of the Karma Kagyu lineage in exile. Perched atop a hill facing Gangtok, it features priceless murals, sacred Buddhist relics, and a 16th Karmapa Golden Stupa.',
      history:
        'Originally built in the mid-1700s under the 12th Karmapa and rebuilt in the 1960s by the 16th Gyalwa Karmapa after arriving from Tsurphu, Tibet.',
      altitudeMeters: 1500,
      latitude: 27.3023,
      longitude: 88.5492,
      rating: 4.8,
      reviewCount: 420,
      thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200',
        'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1200',
      ],
      permitRequired: false,
      bestTimeToVisit: 'October to May',
      openingHours: '6:00 AM - 6:00 PM',
      entryFee: '₹10 for Indians, ₹50 for Foreign Nationals',
      offlineAvailable: true,
    },
  });

  const pemayangtse = await prisma.place.create({
    data: {
      slug: 'pemayangtse-monastery',
      name: 'Pemayangtse Monastery',
      localName: 'པདྨ་ཡང་རྩེ (Sublime Perfect Lotus)',
      district: District.GYALSHING,
      category: PlaceCategory.MONASTERY,
      description:
        'One of the oldest premier Nyingma monasteries in Sikkim, overlooking the snow-capped Kanchenjunga range. Houses the famous seven-tiered wooden masterpiece depicting Zandogpalri (Guru Rinpoche’s Heavenly Abode).',
      history:
        'Planned and designed by Lama Lhatsun Chempo in the 17th century, consecrated in 1705.',
      altitudeMeters: 2085,
      latitude: 27.306,
      longitude: 88.2483,
      rating: 4.7,
      reviewCount: 310,
      thumbnailUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?q=80&w=800',
      images: ['https://images.unsplash.com/photo-1605649487212-47bdab064df8?q=80&w=1200'],
      permitRequired: false,
      bestTimeToVisit: 'March to June, September to December',
      openingHours: '7:00 AM - 5:00 PM',
      entryFee: '₹20 per person',
      offlineAvailable: true,
    },
  });

  const mgMarg = await prisma.place.create({
    data: {
      slug: 'mg-marg-gangtok',
      name: 'MG Marg & Gangtok Promenade',
      localName: 'महात्मा गांधी मार्ग (गாङटोक)',
      district: District.GANGTOK,
      category: PlaceCategory.TOWN,
      description:
        'The pedestrian-only open-air mall of Sikkim’s capital, lined with vibrant cafes, local Sikkimese eateries, souvenir shops, and the central Directorate of Sikkim Tourism Information Centre.',
      altitudeMeters: 1650,
      latitude: 27.3314,
      longitude: 88.6138,
      rating: 4.9,
      reviewCount: 1250,
      thumbnailUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=800',
      images: ['https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=1200'],
      permitRequired: false,
      bestTimeToVisit: 'Year-round (Best: Oct - Apr)',
      openingHours: 'Open 24 hours (Shops 9:00 AM - 8:30 PM)',
      entryFee: 'Free',
      offlineAvailable: true,
    },
  });

  const gurudongmar = await prisma.place.create({
    data: {
      slug: 'gurudongmar-lake',
      name: 'Gurudongmar Lake',
      localName: 'གུ་རུ་གདོང་དམར (Guru Rinpoche Lake)',
      district: District.MANGAN,
      category: PlaceCategory.HIGH_ALTITUDE_LAKE,
      description:
        'One of the highest lakes in the world at 17,800 feet (5,430 m), surrounded by Tibetan plateau peaks. Revered by Buddhists, Sikhs, and Hindus, a part of the lake remains unfrozen even in freezing sub-zero winters.',
      altitudeMeters: 5430,
      latitude: 27.9942,
      longitude: 88.7107,
      rating: 4.9,
      reviewCount: 580,
      thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
      images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200'],
      permitRequired: true,
      permitType: 'Protected Area Permit (PAP) issued via Chungthang / Gangtok Tourism Dept',
      bestTimeToVisit: 'April to June, October to mid-November',
      openingHours: 'Morning hours only (must exit by 1:00 PM due to high winds)',
      entryFee: 'Permit charges apply via registered Sikkim tour operators',
      offlineAvailable: true,
    },
  });

  const tsomgo = await prisma.place.create({
    data: {
      slug: 'tsomgo-lake',
      name: 'Tsomgo Lake (Changu Lake)',
      localName: 'མཚོ་མགོ (Source of the Lake)',
      district: District.GANGTOK,
      category: PlaceCategory.HIGH_ALTITUDE_LAKE,
      description:
        'A sacred glacial lake located at 12,310 feet on the highway to Nathu La Pass. The lake reflects the changing seasons and surrounding alpine terrain with traditional decorated yak safaris.',
      altitudeMeters: 3753,
      latitude: 27.3742,
      longitude: 88.7619,
      rating: 4.6,
      reviewCount: 940,
      thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
      images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200'],
      permitRequired: true,
      permitType: 'Protected Area Permit (PAP) required for all visitors',
      bestTimeToVisit: 'March to May, October to December',
      openingHours: '7:30 AM - 3:00 PM',
      entryFee: 'Permit pass required',
      offlineAvailable: true,
    },
  });

  const charDham = await prisma.place.create({
    data: {
      slug: 'namchi-char-dham',
      name: 'Siddhesvara Dhaam (Namchi Char Dham)',
      localName: 'नामची चार धाम (सोलफोक)',
      district: District.NAMCHI,
      category: PlaceCategory.CULTURAL_HERITAGE,
      description:
        'A grand pilgrimage complex perched atop Solophok Hill featuring an 87-foot statue of Lord Shiva overlooking replicas of the four sacred Dhams of India (Badrinath, Jagannath, Dwarka, Rameshwaram) and the 12 Jyotirlingas.',
      altitudeMeters: 1315,
      latitude: 27.1648,
      longitude: 88.3512,
      rating: 4.8,
      reviewCount: 780,
      thumbnailUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?q=80&w=800',
      images: ['https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?q=80&w=1200'],
      permitRequired: false,
      bestTimeToVisit: 'October to May',
      openingHours: '6:30 AM - 8:00 PM',
      entryFee: '₹50 per adult',
      offlineAvailable: true,
    },
  });

  // eslint-disable-next-line no-console
  console.log('✅ Created 6 realistic Sikkim places');

  // ---------------------------------------------------------------------------
  // 3. CREATE LOCAL VENDORS
  // ---------------------------------------------------------------------------
  await prisma.vendor.createMany({
    data: [
      {
        businessName: 'Dharma Chakra Heritage Homestay',
        ownerName: 'Karma Bhutia',
        type: VendorType.HOMESTAY,
        description:
          'Traditional Sikkimese wooden homestay overlooking Rumtek valley with organic homemade meals.',
        phone: '+91 98320 67890',
        whatsapp: '+919832067890',
        address: 'Rumtek Monastery Road, Sajong, Gangtok District',
        district: District.GANGTOK,
        latitude: 27.3015,
        longitude: 88.548,
        isVerified: true,
        pricingInfo: '₹1,500 - ₹2,800 / night (includes breakfast & dinner)',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800'],
        rating: 4.9,
        placeId: rumtek.id,
        userId: vendorUser.id,
      },
      {
        businessName: 'Mount Pandim View Homestay Pelling',
        ownerName: 'Passang Lepcha',
        type: VendorType.HOMESTAY,
        description:
          'Cozy retreat 5 minutes from Pemayangtse with unobstructed sunrise views of Kanchenjunga.',
        phone: '+91 94341 88990',
        whatsapp: '+919434188990',
        address: 'Near Helipad, Upper Pelling, Gyalshing District',
        district: District.GYALSHING,
        latitude: 27.3075,
        longitude: 88.245,
        isVerified: true,
        pricingInfo: '₹2,000 / night',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800'],
        rating: 4.8,
        placeId: pemayangtse.id,
      },
      {
        businessName: 'Taste of Sikkim Traditional Restaurant & Bakery',
        ownerName: 'Doma Wangchuk',
        type: VendorType.RESTAURANT_CAFE,
        description:
          'Authentic Momos, Thukpa, Gundruk soup, and organic butter tea situated on MG Marg.',
        phone: '+91 98323 11223',
        address: 'MG Marg Central Promenade, Gangtok',
        district: District.GANGTOK,
        latitude: 27.3318,
        longitude: 88.6142,
        isVerified: true,
        pricingInfo: '₹200 - ₹600 per person',
        images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800'],
        rating: 4.7,
        placeId: mgMarg.id,
      },
      {
        businessName: 'Lachen Yak & Snow Expeditions',
        ownerName: 'Chewang Lachenpa',
        type: VendorType.TREKKING_GUIDE,
        description:
          'Certified mountain expedition guides specializing in Gurudongmar Lake, Chopta Valley, and Green Lake treks.',
        phone: '+91 94750 99887',
        whatsapp: '+919475099887',
        address: 'Lachen Village Center, Mangan District',
        district: District.MANGAN,
        latitude: 27.7214,
        longitude: 88.5562,
        isVerified: true,
        pricingInfo: 'Custom package based on permit & vehicle requirement',
        images: ['https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=800'],
        rating: 5.0,
        placeId: gurudongmar.id,
      },
      {
        businessName: 'JN Road 4x4 Mountain Cabs Union',
        ownerName: 'Bikash Subba',
        type: VendorType.TAXI_DRIVER,
        description:
          'Government approved 4WD Scorpio/Innova transfers for Tsomgo Lake, Baba Mandir, and Nathu La.',
        phone: '+91 97330 44556',
        address: 'Vajra Cinema Taxi Stand, Gangtok',
        district: District.GANGTOK,
        latitude: 27.338,
        longitude: 88.615,
        isVerified: true,
        pricingInfo: '₹3,500 - ₹5,500 per reserved vehicle (including permits)',
        images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800'],
        rating: 4.6,
        placeId: tsomgo.id,
      },
    ],
  });

  // eslint-disable-next-line no-console
  console.log('✅ Created local Sikkim vendors (Homestays, Cabs, Guides, Cafes)');

  // ---------------------------------------------------------------------------
  // 4. CREATE EMERGENCY CONTACTS & HELPLINES
  // ---------------------------------------------------------------------------
  await prisma.emergencyContact.createMany({
    data: [
      {
        name: 'Sikkim 24x7 Tourist Assistance Helpline',
        type: EmergencyType.TOURIST_HELPLINE,
        phone: '1364',
        altPhone: '03592-209090',
        address: 'Directorate of Tourism, MG Marg, Gangtok',
        district: District.GANGTOK,
        latitude: 27.331,
        longitude: 88.6135,
        is24x7: true,
        description:
          'State government dedicated toll-free line for tourist distress and permit queries.',
      },
      {
        name: 'Gangtok Sadar Police Station',
        type: EmergencyType.POLICE_STATION,
        phone: '03592-202022',
        altPhone: '112',
        address: 'NH10, Gangtok',
        district: District.GANGTOK,
        latitude: 27.3295,
        longitude: 88.612,
        is24x7: true,
        description: 'Central Gangtok police control room.',
      },
      {
        name: 'STNM Multispeciality Government Hospital (Sohyak)',
        type: EmergencyType.HOSPITAL,
        phone: '03592-202944',
        altPhone: '102',
        address: 'Sochyagang, Sichey, Gangtok',
        district: District.GANGTOK,
        latitude: 27.3412,
        longitude: 88.5998,
        is24x7: true,
        description:
          'Premier tertiary hospital in Sikkim equipped with trauma center and high altitude ICU.',
      },
      {
        name: 'Chungthang Police & Disaster Rescue Sub-Division',
        type: EmergencyType.DISASTER_MANAGEMENT_SDMA,
        phone: '03592-234224',
        altPhone: '112',
        address: 'Chungthang Junction, North Sikkim',
        district: District.MANGAN,
        latitude: 27.6033,
        longitude: 88.6472,
        is24x7: true,
        description: 'Gateway emergency checkpost for Lachen, Lachung, and Gurudongmar.',
      },
      {
        name: 'Gyalshing District Hospital',
        type: EmergencyType.HOSPITAL,
        phone: '03595-250888',
        altPhone: '108',
        address: 'Gyalshing Bazaar, West Sikkim',
        district: District.GYALSHING,
        latitude: 27.283,
        longitude: 88.238,
        is24x7: true,
        description: 'District hospital servicing Pelling, Pemayangtse, and Yuksom sectors.',
      },
      {
        name: 'Namchi District Hospital',
        type: EmergencyType.HOSPITAL,
        phone: '03595-254644',
        altPhone: '102',
        address: 'Namchi Headquarters, South Sikkim',
        district: District.NAMCHI,
        latitude: 27.168,
        longitude: 88.355,
        is24x7: true,
        description: 'Full emergency ward and ambulance services for South Sikkim.',
      },
    ],
  });

  // eslint-disable-next-line no-console
  console.log('✅ Created emergency helplines & district response teams');

  // ---------------------------------------------------------------------------
  // 5. CREATE ACTIVE DISASTER / WEATHER ALERTS
  // ---------------------------------------------------------------------------
  await prisma.alert.create({
    data: {
      title: 'Heavy Snowfall & Sub-Zero Advisory on Thangu-Gurudongmar Road',
      description:
        'Severe snowfall between Thangu and Gurudongmar Lake has caused black ice conditions. Only high-ground-clearance 4WD vehicles with snow chains are allowed past Thangu checkpost until 12:00 PM.',
      type: AlertType.HEAVY_SNOWFALL,
      severity: AlertSeverity.HIGH,
      status: AlertStatus.ACTIVE,
      district: District.MANGAN,
      centerLat: 27.9,
      centerLng: 88.68,
      radiusKm: 15.0,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Active for 24 hours
      placeId: gurudongmar.id,
      createdById: adminUser.id,
    },
  });

  await prisma.alert.create({
    data: {
      title: 'Scheduled Road Maintenance on JN Road towards Tsomgo Lake',
      description:
        'BRO (Border Roads Organisation) routine clearing between 13th Mile and Kyongnosla. One-way traffic movement active between 10:00 AM and 1:00 PM.',
      type: AlertType.ROAD_CLOSURE,
      severity: AlertSeverity.MODERATE,
      status: AlertStatus.ACTIVE,
      district: District.GANGTOK,
      centerLat: 27.35,
      centerLng: 88.7,
      radiusKm: 8.0,
      startsAt: new Date(),
      placeId: tsomgo.id,
      createdById: adminUser.id,
    },
  });

  // eslint-disable-next-line no-console
  console.log('✅ Created active hazard alerts for North & East Sikkim corridors');

  // ---------------------------------------------------------------------------
  // 6. CREATE SAMPLE SOS REQUEST
  // ---------------------------------------------------------------------------
  await prisma.sOSRequest.create({
    data: {
      userId: touristUser.id,
      latitude: 27.9123,
      longitude: 88.6945,
      altitudeMeters: 4850,
      accuracyMeters: 12.5,
      batteryLevel: 42,
      emergencyType: 'Acute Mountain Sickness (AMS) / Oxygen support needed',
      notes:
        'Traveler experiencing dizziness and low oxygen at high altitude near Thangu pass. Accompanied by local driver.',
      status: SOSStatus.ACKNOWLEDGED,
      resolvedById: adminUser.id,
      resolutionNotes: 'Alert dispatched to Chungthang medical post and Thangu Army Aid checkpost.',
    },
  });

  // eslint-disable-next-line no-console
  console.log('✅ Created sample SOS emergency record');

  // eslint-disable-next-line no-console
  console.log('🎉 Sikkim Yatra Database Seeding Completed Successfully!');
}

main()
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
