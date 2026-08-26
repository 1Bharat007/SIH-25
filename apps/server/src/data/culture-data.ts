import {
  MonasteryProfile,
  PanoramaScene,
  TraditionalAttire,
  SikkimFestival,
  SikkimeseCommunity,
  MonasteryLineage,
} from '@sikkim-yatra/shared';

// -----------------------------------------------------------------------------
// SIKKIM SACRED MONASTERIES
// -----------------------------------------------------------------------------
export const SIKKIM_MONASTERIES_DATA: MonasteryProfile[] = [
  {
    id: 'monastery-rumtek',
    slug: 'rumtek-monastery',
    name: 'Rumtek Monastery',
    localName: 'རུམ་ཐེག་དགོན་པ (Dharma Chakra Centre)',
    district: 'Gangtok',
    lineage: 'Karma Kagyu',
    foundedYear: 1740,
    founder: '12th Gyalwa Karmapa Changchub Dorje (Rebuilt by 16th Karmapa in 1966)',
    altitudeMeters: 1500,
    latitude: 27.3023,
    longitude: 88.5492,
    description:
      'The largest monastery in Sikkim and the principal seat of the Karma Kagyu lineage in exile. Reconstructed to replicate Tsurphu Monastery in Tibet, it features vibrant multi-story murals, traditional Tibetan wood carvings, golden stupas, and peaceful mountain chanting halls.',
    architecturalStyle: 'Traditional Tibetan Buddhist Courtyard Monastery with Chinese-influenced Golden Pagoda Roof',
    sacredRelics: [
      {
        name: 'Golden Reliquary Stupa of the 16th Karmapa',
        tibetanName: 'གསེར་གདུང་ (Serdung)',
        description: 'A 13-foot pure gold reliquary studded with turquoise, coral, and ancient rubies containing the sacred bone relics of H.H. the 16th Karmapa.',
        century: '20th Century (1982)',
        significance: 'One of the most sacred pilgrimage sites for Tibetan Buddhist practitioners globally.',
      },
      {
        name: 'Sacred Black Crown Relic (Vajra Mukut)',
        tibetanName: 'ཞྭ་ནག་ (Zhanag)',
        description: 'Woven from the hair of 100,000 dakinis; according to legend, it hovers slightly above the head of the Karmapa during the sacred Black Hat ceremony.',
        century: '15th Century (Gift from Ming Emperor Yongle)',
        significance: 'Believed to grant liberation upon sight (Thongdrol).',
      },
      {
        name: 'Ancient Kangyur and Tengyur Woodblock Treatises',
        description: 'Over 300 volumes of handwritten illuminated canonical scriptures preserved in silk wrapping.',
        century: '17th - 18th Century',
        significance: 'Preserves rare Tantric teachings and Buddhist logic manuals.',
      },
    ],
    etiquetteRules: [
      {
        rule: 'Always circumambulate the monastery and stupas clockwise',
        category: 'prayer',
        description: 'Keeping sacred shrines on your right side generates spiritual merit and shows respect for Dharma.',
      },
      {
        rule: 'Remove shoes and headwear before entering main shrine halls',
        category: 'dress',
        description: 'Maintain cleanliness in sacred chanting spaces; dress modestly covering shoulders and knees.',
      },
      {
        rule: 'Photography is strictly prohibited inside inner prayer chambers',
        category: 'photography',
        description: 'Courtyards and exteriors are open for photography; inner altar sanctums must be respected.',
      },
      {
        rule: 'Maintain silence during monk chanting assemblies',
        category: 'behavior',
        description: 'Switch mobile phones to silent mode; do not step across monks’ meditation cushions.',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1200',
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1200',
    ],
    panoramaSceneId: 'panorama-rumtek-main',
    annualChamDanceMonth: 'December / January (Tibetan 10th Month Dungchen Cham)',
    visitingHours: '6:00 AM - 6:00 PM Daily',
    entryFee: '₹10 (Indian Citizens), ₹50 (Foreign Nationals)',
  },
  {
    id: 'monastery-pemayangtse',
    slug: 'pemayangtse-monastery',
    name: 'Pemayangtse Monastery',
    localName: 'པདྨ་ཡང་རྩེ (Sublime Perfect Lotus)',
    district: 'Gyalshing',
    lineage: 'Nyingma',
    foundedYear: 1705,
    founder: 'Lhatsun Chempo (Consecrated during the reign of 3rd Chogyal Chakdor Namgyal)',
    altitudeMeters: 2085,
    latitude: 27.306,
    longitude: 88.2483,
    description:
      'One of the oldest and most prestigious Nyingma monasteries in Sikkim. Located near Pelling with panoramic views of Mount Kanchenjunga, it was historically reserved only for "Ta-Sang" monks (celibate monks of pure Sikkimese lineage).',
    architecturalStyle: 'Three-Story Traditional Stone & Himalayan Cedar Monastery',
    sacredRelics: [
      {
        name: 'Sangtokpalri (Zandog Palri) 7-Tiered Wooden Celestial Palace',
        tibetanName: 'ཟངས་མདོག་དཔལ་རི',
        description: 'A breathtaking 7-tiered masterwork hand-carved over 5 years by Dungzin Rinpoche, representing Guru Padmasambhava’s Copper-Colored Mountain Abode complete with rainbow halls, deities, and dragons.',
        century: 'Late 19th Century',
        significance: 'Regarded as a national artistic and spiritual treasure of Sikkim.',
      },
      {
        name: 'Padmasambhava Guru Tsokye Dorje Sacred Statue',
        description: 'Gold-leaf clay sculpture depicting the peaceful Lake-Born manifestation of Guru Rinpoche.',
        century: '18th Century',
        significance: 'Consecrated during the Chogyal kingdom.',
      },
    ],
    etiquetteRules: [
      {
        rule: 'Never touch ancient wood sculptures or thangka silk fringes',
        category: 'behavior',
        description: 'Centuries-old natural mineral pigments and delicate woodcarvings require preservation.',
      },
      {
        rule: 'Spin prayer wheels only in a clockwise direction',
        category: 'prayer',
        description: 'Spinning clockwise releases the inscribed mantra "Om Mani Padme Hum" into the cosmos.',
      },
      {
        rule: 'Speak in hushed tones inside the Sangtokpalri chamber',
        category: 'behavior',
        description: 'The third floor is a deeply revered meditation sanctuary.',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?q=80&w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
    ],
    panoramaSceneId: 'panorama-pemayangtse-shrine',
    annualChamDanceMonth: 'February (28th & 29th day of the 12th Tibetan lunar month)',
    visitingHours: '7:00 AM - 5:00 PM Daily',
    entryFee: '₹20 per adult',
  },
  {
    id: 'monastery-tashiding',
    slug: 'tashiding-monastery',
    name: 'Tashiding Monastery',
    localName: 'བཀྲ་ཤིས་ལྡིང་ (The Devoted Central Glory)',
    district: 'Gyalshing',
    lineage: 'Nyingma',
    foundedYear: 1641,
    founder: 'Ngadak Sempa Chempo Phunshok Rigzing',
    altitudeMeters: 1465,
    latitude: 27.318,
    longitude: 88.297,
    description:
      'Perched on a conical mountain ridge between the Rathong and Rangeet rivers, Tashiding is spiritually considered the sacred navel of Sikkim. Legend states that even a single glance at its holy Chorten cleanses the sins of a lifetime.',
    architecturalStyle: 'Sacred Ridge Hilltop Shrine with Circumambulating Chorten Stupa Gardens',
    sacredRelics: [
      {
        name: 'Thongwa Rangdol Chorten (Liberation on Sight Stupa)',
        tibetanName: 'མཐོང་བ་རང་གྲོལ་མཆོད་རྟེན',
        description: 'Sacred white stupa housing relics of Buddha Manjushri and Guru Rinpoche.',
        century: '17th Century',
        significance: 'Believed to wash away negative karma upon visual sight.',
      },
      {
        name: 'Bhumchu Sacred Holy Water Urn',
        description: 'Ancient bronze vessel containing holy water blessed by Guru Rinpoche. Once a year during the Bhumchu Festival, the sealed urn is opened to divine the coming year’s fortune.',
        century: '8th Century Consecration',
        significance: 'Central relic of the sacred Bhumchu festival of Sikkim.',
      },
    ],
    etiquetteRules: [
      {
        rule: 'Circumambulate the Chorten Garden 3, 7, or 108 times',
        category: 'prayer',
        description: 'Devotees recite the Padmasambhava mantra while circling the white stone stupas.',
      },
      {
        rule: 'Do not sit or climb on stupa stone plinths',
        category: 'behavior',
        description: 'Chortens are embodiments of the enlightened mind of the Buddha.',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200',
    ],
    panoramaSceneId: 'panorama-tashiding-chorten',
    annualChamDanceMonth: 'March (Bhumchu Festival - 14th/15th day of 1st Tibetan Month)',
    visitingHours: '6:30 AM - 5:30 PM Daily',
    entryFee: 'Free (Donations appreciated)',
  },
  {
    id: 'monastery-enchey',
    slug: 'enchey-monastery',
    name: 'Enchey Monastery',
    localName: 'དགོན་གནས་དགོན་པ (The Solitary Temple)',
    district: 'Gangtok',
    lineage: 'Nyingma',
    foundedYear: 1840,
    founder: 'Lama Drupthob Karpo (Tantric Master renowned for his flying powers)',
    altitudeMeters: 1750,
    latitude: 27.345,
    longitude: 88.625,
    description:
      'Nestled on a forested pine ridge overlooking Gangtok city, Enchey is believed to be protected by the mountain guardian deity Kanchenjunga and Yabdean. The monastery comes alive during the vibrant Detor Cham dance.',
    architecturalStyle: 'Pagoda Style with Carved Dragon Eaves and Tibetan Murals',
    sacredRelics: [
      {
        name: 'Protective Statues of Lokapalas (Four Heavenly Kings)',
        description: 'Four fierce guardian deity statues safeguarding the four cardinal directions.',
        century: '19th Century',
        significance: 'Protectors of Sikkim state peace and prosperity.',
      },
    ],
    etiquetteRules: [
      {
        rule: 'Ring temple bell only once upon entering',
        category: 'prayer',
        description: 'Wakes the spiritual awareness before starting morning prostrations.',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1200',
    ],
    annualChamDanceMonth: 'January (18th & 19th days of the 12th lunar month)',
    visitingHours: '6:00 AM - 6:00 PM Daily',
    entryFee: 'Free',
  },
  {
    id: 'monastery-dubdi',
    slug: 'dubdi-monastery',
    name: 'Dubdi Monastery (The Retreat)',
    localName: 'གྲུབ་སྡེ་ (Yuksom Hermitage)',
    district: 'Gyalshing',
    lineage: 'Nyingma',
    foundedYear: 1642,
    founder: 'Lhatsun Chempo',
    altitudeMeters: 2100,
    latitude: 27.375,
    longitude: 88.225,
    description:
      'The earliest monastery established in Sikkim, perched atop a dense oak ridge near Yuksom (the first capital of the Kingdom of Sikkim). Reached by a scenic 45-minute stone forest trek.',
    architecturalStyle: 'Stone-Mural Hermitage Sanctuary',
    sacredRelics: [
      {
        name: 'Original Hand-Painted Frescoes of the 3 Founding Lamas',
        description: 'Historical portraits of the three holy lamas who consecrated Phuntsog Namgyal as first king of Sikkim.',
        century: '17th Century',
        significance: 'Foundational historical documentation of Sikkim state.',
      },
    ],
    etiquetteRules: [
      {
        rule: 'Maintain total silence in the surrounding sacred forest trail',
        category: 'behavior',
        description: 'The ancient hermitage trail is dedicated to silent walking meditation.',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    ],
    visitingHours: '7:00 AM - 4:00 PM Daily',
    entryFee: 'Free',
  },
];

// -----------------------------------------------------------------------------
// 360° PANORAMA VIRTUAL SCENES
// -----------------------------------------------------------------------------
export const SIKKIM_PANORAMA_SCENES: PanoramaScene[] = [
  {
    id: 'panorama-rumtek-main',
    monasteryId: 'monastery-rumtek',
    monasteryName: 'Rumtek Monastery',
    sceneTitle: 'Main Chanting Hall & Golden Throne Sanctuary',
    roomName: 'Dharma Chakra Main Shrine',
    panoramaImageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2400',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
    initialView: { pitch: 0, yaw: 0, fov: 75 },
    description:
      'Step inside the sacred grand assembly hall of Rumtek Monastery. Gaze upon the Golden Throne of the Gyalwa Karmapa, towering statues of Shakyamuni Buddha, and centuries of silk thangka murals.',
    hotspots: [
      {
        id: 'hotspot-throne',
        title: 'Throne of His Holiness the Gyalwa Karmapa',
        tibetanTitle: 'རྒྱལ་བ་ཀརྨ་པའི་བཞུགས་ཁྲི',
        description: 'The ceremonial brocade seat where the Gyalwa Karmapa presides over major Kagyu prayers and the sacred Vajra Crown ritual.',
        pitch: -5,
        yaw: 0,
        category: 'altar',
        audioLoreSnippet: 'Deep chanting sounds of the Mahakala puja echo from this sanctum during sunset.',
      },
      {
        id: 'hotspot-buddha-statue',
        title: 'Shakyamuni Buddha Central Gilded Statue',
        tibetanTitle: 'སངས་རྒྱས་བཅོམ་ལྡན་འདས',
        description: 'A 10-foot gilded bronze statue depicting the historical Buddha in the Bhumisparsha (earth-touching) mudra.',
        pitch: 12,
        yaw: -15,
        category: 'relic',
      },
      {
        id: 'hotspot-butter-lamps',
        title: 'Perpetual 108 Silver Butter Lamp Altar',
        tibetanTitle: 'མཆོད་མེ',
        description: 'Illuminated daily with clarified butter to symbolize the dispelling of the darkness of spiritual ignorance.',
        pitch: -18,
        yaw: 25,
        category: 'altar',
      },
      {
        id: 'hotspot-thangkas',
        title: 'Kagyu Golden Rosary Lineage Murals',
        tibetanTitle: 'བཀའ་བརྒྱུད་གསེར་ཕྲེང་',
        description: 'Intricate silk murals tracing the spiritual lineage from Tilopa, Naropa, Marpa the Translator, and Milarepa.',
        pitch: 20,
        yaw: 85,
        category: 'mural',
      },
      {
        id: 'hotspot-kangyur',
        title: 'Sacred Kangyur Manuscript Alcove',
        tibetanTitle: 'བཀའ་འགྱུར',
        description: 'Hand-carved cedar cubicles housing 108 volumes of Buddha’s spoken teachings wrapped in saffron silk.',
        pitch: 5,
        yaw: -85,
        category: 'manuscript',
      },
    ],
  },
  {
    id: 'panorama-pemayangtse-shrine',
    monasteryId: 'monastery-pemayangtse',
    monasteryName: 'Pemayangtse Monastery',
    sceneTitle: 'Sangtokpalri Celestial Abode & Guru Padmasambhava Sanctum',
    roomName: 'Upper Reliquary Chamber (3rd Floor)',
    panoramaImageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?q=80&w=2400',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?q=80&w=800',
    initialView: { pitch: 5, yaw: 10, fov: 70 },
    description:
      'Immerse in the upper sanctuary housing the legendary 7-tiered hand-carved wooden Sangtokpalri (Guru Rinpoche’s Celestial Abode).',
    hotspots: [
      {
        id: 'hotspot-sangtokpalri',
        title: 'Sangtokpalri 7-Tiered Wooden Masterpiece',
        tibetanTitle: 'ཟངས་མདོག་དཔལ་རིའི་ཞིང་བཀོད',
        description: 'Hand-carved by Dungzin Rinpoche over five years. Depicts the celestial palace with rainbows, deities, dakinis, and peaceful Buddhas.',
        pitch: 10,
        yaw: 0,
        category: 'relic',
      },
      {
        id: 'hotspot-guru-rinpoche',
        title: 'Guru Rinpoche Consecration Shrine',
        tibetanTitle: 'གུ་རུ་རིན་པོ་ཆེ',
        description: 'Ancient bronze statue holding the vajra and skullcup, radiating spiritual tranquility across West Sikkim.',
        pitch: -8,
        yaw: -40,
        category: 'altar',
      },
    ],
  },
  {
    id: 'panorama-tashiding-chorten',
    monasteryId: 'monastery-tashiding',
    monasteryName: 'Tashiding Monastery',
    sceneTitle: 'Thongwa Rangdol Sacred Stupa Garden',
    roomName: 'Outer Sanctum & Chorten Ridge',
    panoramaImageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2400',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
    initialView: { pitch: 0, yaw: -30, fov: 80 },
    description:
      'Breathe in the high-altitude peace of the Tashiding Stupa Garden overlooking the Rathong river gorge.',
    hotspots: [
      {
        id: 'hotspot-thongwa-chorten',
        title: 'Thongwa Rangdol Chorten (Liberation on Sight)',
        tibetanTitle: 'མཐོང་བ་རང་གྲོལ་མཆོད་རྟེན',
        description: 'The premier whitewashed reliquary stupa said to cleanse bad karma upon visual perception.',
        pitch: 5,
        yaw: -20,
        category: 'relic',
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// TRADITIONAL SIKKIMESE ATTIRE CATALOG (Bhutia, Lepcha, Nepali)
// -----------------------------------------------------------------------------
export const SIKKIM_TRADITIONAL_ATTIRE_DATA: TraditionalAttire[] = [
  {
    id: 'attire-bhutia-bakhu-female',
    name: 'Bhutia Female Bakhu & Honju Ensemble',
    localName: 'བྷོ་ཊའི་བཀའ་ཁུ། (Bhutia Kho & Honju)',
    community: 'Bhutia',
    gender: 'female',
    occasion: 'Festive & Ceremonial',
    overview:
      'The Bakhu (also called Kho) is an elegant, flowing wrap-around silk or fine brocade dress tied at the waist with a sash called Kera. Married women traditionally wear a colorful handwoven striped apron called Pangden.',
    culturalLore:
      'Originated from Tibetan aristocratic gowns, the Bhutia Bakhu in Sikkim evolved into a distinct high-Himalayan garment favored for royal court banquets, Losoong new year, and family weddings.',
    textileTechnique:
      'Woven on traditional frame looms using raw mulberry silk and golden metallic brocade threads with dragon and lotus motifs.',
    pieces: [
      {
        name: 'Bakhu (Main Gown)',
        localName: 'Kho (ཁོ)',
        type: 'main_robe',
        description: 'Full-length sleeveless silk gown tailored with deep back pleats and fastened with silver clasps.',
        material: 'Raw Mulberry Silk & Brocade',
        colorOptions: ['Royal Emerald Green', 'Imperial Maroon', 'Deep Indigo Blue', 'Monastery Amber'],
      },
      {
        name: 'Honju (Inner Silk Shirt)',
        localName: 'Honju (ཧོན་འཇུ)',
        type: 'inner_shirt',
        description: 'High-collared, long-sleeved satin blouse whose contrasting sleeves fold back gracefully.',
        material: 'Pure Chinese Silk Satin',
        colorOptions: ['Golden Saffron', 'Ruby Crimson', 'Pearl White', 'Lotus Pink'],
      },
      {
        name: 'Pangden (Striped Apron)',
        localName: 'Pangden (པང་གདན)',
        type: 'waistband',
        description: 'Tri-panel geometric striped woven apron signifying married status, tied gracefully at the front.',
        material: 'Yak & Sheep Fine Wool',
        colorOptions: ['Traditional Multicolor Rainbow', 'Jewel Tone Stripes'],
      },
      {
        name: 'Khao (Amulet Box Pendant) & Kantalo Earrings',
        localName: 'Khao (གའུ)',
        type: 'jewelry',
        description: 'Solid silver and gold filigree pendant set with genuine Himalayan turquoise and coral.',
        material: 'Hallmarked Sterling Silver & Tibetan Turquoise',
        colorOptions: ['Antique Silver Turquoise'],
      },
      {
        name: 'Shambo (Fur-Lined Velvet Hat)',
        localName: 'Shambo (ཞྭ་མོ)',
        type: 'headgear',
        description: 'Traditional brocade ceremonial hat with four velvet ear flaps trimmed with soft sheep fleece.',
        material: 'Brocade & Velvet',
        colorOptions: ['Golden Brocade Maroon Flaps'],
      },
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
    overlayAssetUrl: '/images/attire/bhutia_female_bakhu.svg',
    headgearAssetUrl: '/images/attire/bhutia_shambo_hat.svg',
    jewelryAssetUrl: '/images/attire/bhutia_khao_amulet.svg',
  },
  {
    id: 'attire-bhutia-bakhu-male',
    name: 'Bhutia Male Bakhu & Yentse Ensemble',
    localName: 'བྷོ་ཊའི་ཕོ་ཁོ། (Bhutia Male Kho)',
    community: 'Bhutia',
    gender: 'male',
    occasion: 'Festive & Ceremonial',
    overview:
      'A commanding, long-sleeved robe gathered at the waist with a wide leather or silk belt (Kera), forming a roomy pouch (Ambag) in front to carry holy scriptures, a wooden tea bowl, or a khukuri knife.',
    culturalLore:
      'Worn by Bhutia nobility, village elders (Pipon), and lamas during formal festivals. The deep pouch provided practical utility during high-altitude horse caravans across Nathu La.',
    textileTechnique: 'Heavy spun woolen tweed or rich damask silk with woven geometric endless knot (Shrivatsa) patterns.',
    pieces: [
      {
        name: 'Male Bakhu / Kho',
        localName: 'Pho Kho (ཕོ་ཁོ)',
        type: 'main_robe',
        description: 'Ankle-length heavy silk/tweed robe crossed left-over-right and cinched at the hip.',
        material: 'Hand-loomed Himalayan Wool or Damask Silk',
        colorOptions: ['Charcoal Slate', 'Tibetan Maroon', 'Navy Blue', 'Forest Olive'],
      },
      {
        name: 'Yentse (Inner Silk Shirt)',
        localName: 'Yentse',
        type: 'inner_shirt',
        description: 'Mandarin-collared inner shirt with long cuffs extending beyond the outer robe.',
        material: 'Linen or Satin Silk',
        colorOptions: ['Snow White', 'Cream Gold'],
      },
      {
        name: 'Kera (Woven Waist Sash)',
        localName: 'Kera (སྐེད་རག)',
        type: 'waistband',
        description: 'Wide woven belt with tasseled fringe securing the upper robe into a pouch.',
        material: 'Tightly woven wool',
        colorOptions: ['Crimson Red', 'Golden Yellow'],
      },
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=800',
    overlayAssetUrl: '/images/attire/bhutia_male_bakhu.svg',
    headgearAssetUrl: '/images/attire/bhutia_shambo_hat.svg',
  },
  {
    id: 'attire-lepcha-dumvum-female',
    name: 'Lepcha Female Dumvum & Tago Ensemble',
    localName: 'Dumvum & Tago (རོང་གི་གོས་ཆེན)',
    community: 'Lepcha',
    gender: 'female',
    occasion: 'Daily Cultural',
    overview:
      'The indigenous attire of the Rong (Lepcha) people of Mayel Lyang (Sikkim). Ankle-length graceful dress pinned at the shoulder with a silver brooch, worn over a loose jacket (Tago).',
    culturalLore:
      'The Lepchas are the original indigenous inhabitants of Sikkim. Their dress patterns reflect sacred natural elements — bamboo shoots, mountain streams, and the holy white snowy peaks of Mount Kanchenjunga.',
    textileTechnique: 'Natural vegetable-dyed wild nettle (Poo) and hand-spun organic cotton woven on backstrap looms.',
    pieces: [
      {
        name: 'Dumvum (Main Lepcha Dress)',
        localName: 'Dumvum',
        type: 'main_robe',
        description: 'Graceful single-piece woven drape pinned with an engraved silver pin (Gyap-chhyu).',
        material: 'Organic Hand-spun Cotton & Nettle Fiber',
        colorOptions: ['Nature Sage Green', 'Earthy Ochre', 'Terracotta Orange', 'Indigo Blue'],
      },
      {
        name: 'Tago (Inner Blouse/Jacket)',
        localName: 'Tago',
        type: 'inner_shirt',
        description: 'Loose-fitting jacket with contrasting collar and sleeve cuffs.',
        material: 'Soft Handwoven Cotton',
        colorOptions: ['Ivory White', 'Sky Azure'],
      },
      {
        name: 'Gyaptok (Lepcha Bamboo & Feather Cap)',
        localName: 'Gyaptok',
        type: 'headgear',
        description: 'Fine woven bamboo cane hat decorated with peacock feathers and turquoise stones.',
        material: 'Mountain Bamboo & Sacred Feathers',
        colorOptions: ['Natural Bamboo with Feather Plume'],
      },
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=800',
    overlayAssetUrl: '/images/attire/lepcha_female_dumvum.svg',
    headgearAssetUrl: '/images/attire/lepcha_gyaptok_hat.svg',
  },
  {
    id: 'attire-nepali-daura-suruwal',
    name: 'Nepali Daura Suruwal & Dhaka Topi Ensemble',
    localName: 'दौरा सुरुवाल र ढाका टोपी',
    community: 'Nepali',
    gender: 'male',
    occasion: 'Festive & Ceremonial',
    overview:
      'The historic traditional dress of the Sikkimese Nepali community. The Daura is an eight-tied upper tunic symbolizing the Ashtamangala (eight auspicious signs), paired with tapered Suruwal trousers and an intricate Dhaka Topi.',
    culturalLore:
      'Each of the 8 strings (Tunas) tied across the Daura carries spiritual symbolism of health, protection, and devotion. Worn during Dashain, Tihar, and civic state occasions.',
    textileTechnique: 'Handwoven Palpali Dhaka geometric jacquard weave with intricate geometric zig-zags.',
    pieces: [
      {
        name: 'Daura (Eight-Tied Double-Breasted Tunic)',
        localName: 'दौरा (Daura)',
        type: 'main_robe',
        description: 'Cross-folded double breasted tunic secured with 8 sacred ribbon ties.',
        material: 'High-grade Cotton or Woolen Blend',
        colorOptions: ['Classic Charcoal Gray', 'Off-White Ivory', 'Deep Navy'],
      },
      {
        name: 'Suruwal (Tapered Trousers)',
        localName: 'सुरुवाल (Suruwal)',
        type: 'waistband',
        description: 'Comfortable loose-fitting trousers at the thighs tapering tightly at the calves and ankles.',
        material: 'Matching Cotton / Wool',
        colorOptions: ['Matching Daura Fabric'],
      },
      {
        name: 'Dhaka Topi (Geometric Woven Crown Hat)',
        localName: 'ढाका टोपी (Dhaka Topi)',
        type: 'headgear',
        description: 'Iconic hexagonal hat woven with vibrant geometric thread patterns representing Mount Kanchenjunga.',
        material: '100% Handloom Palpali Dhaka Cotton',
        colorOptions: ['Multicolor Red Geometric', 'Silver Grey Dhaka'],
      },
      {
        name: 'Patuka (Waist Sash)',
        localName: 'पटुका (Patuka)',
        type: 'waistband',
        description: 'Long cotton cloth wrapped firmly around the waist to support the lower back during mountain walks.',
        material: 'Fine Cotton Weave',
        colorOptions: ['Crisp White', 'Saffron Yellow'],
      },
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?q=80&w=800',
    overlayAssetUrl: '/images/attire/nepali_male_daura.svg',
    headgearAssetUrl: '/images/attire/nepali_dhaka_topi.svg',
  },
];

// -----------------------------------------------------------------------------
// SIKKIM FESTIVALS & CULTURAL CALENDAR
// -----------------------------------------------------------------------------
export const SIKKIM_FESTIVALS_DATA: SikkimFestival[] = [
  {
    id: 'fest-losoong',
    name: 'Losoong / Namsoong (Sikkimese New Year)',
    localName: 'ལོ་གསར / རོང་ལོ་གསར (Losoong / Namsoong)',
    community: 'All Communities',
    monthRange: 'December - January',
    approximateDates2025: 'December 28 – 31, 2025',
    approximateDates2026: 'December 17 – 21, 2026',
    tibetanLunarDate: '10th Month, 28th to 30th day',
    shortSummary:
      'The joyous agrarian harvest festival and Sikkim New Year celebrated with sacred Black Hat Cham masked dances at Rumtek, Phodong, and Enchey monasteries.',
    significance:
      'Marks the end of the agricultural harvest season and ushers in divine prosperity. Buddhist monks perform Cham masked dances to banish malevolent spirits and cleanse the land for the new year.',
    ritualsAndCelebrations: [
      'Gouthuk Sacred 9-Ingredient Porridge cooked on the eve to cast away misfortune.',
      'Black Hat Sorcerer (Zhanag) and Wrathful Mahakala sacred Cham dances.',
      'Archery competitions (Dha) and folk music performances in traditional Bakhu and Dumvum attire.',
      'Butter lamp illuminations across every village household.',
    ],
    chamDancesFeatured: [
      'Zhanag Black Hat Sacred Mask Dance',
      'Kagyed Wrathful Protector Deity Cham',
      'Mahakala Dance of the Cosmic Wheel',
    ],
    primeMonasteries: ['Rumtek Monastery', 'Enchey Monastery', 'Phodong Monastery', 'Rinchenpong Monastery'],
    district: 'All Districts',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=800',
    ],
  },
  {
    id: 'fest-pang-lhabsol',
    name: 'Pang Lhabsol (Veneration of Mount Kanchenjunga)',
    localName: 'དཔང་ལྷ་གསོལ (Guardian Mountain Homage)',
    community: 'Buddhist',
    monthRange: 'August - September',
    approximateDates2025: 'September 7, 2025',
    approximateDates2026: 'August 27, 2026',
    tibetanLunarDate: '7th Month, 15th day (Full Moon)',
    shortSummary:
      'Unique to Sikkim, Pang Lhabsol commemorates the blood brotherhood pact between the Bhutias and Lepchas, and venerates Mount Kanchenjunga as the supreme guardian deity (Dzo-nga).',
    significance:
      'Instituted by the 3rd Chogyal Chakdor Namgyal. Features the spectacular "Pangtoed" Warrior Dance where lamas brandish swords and shields in blazing gold armor.',
    ritualsAndCelebrations: [
      'Pangtoed Martial Sword Dance performed in full armor with war cries.',
      'Ceremonial invocation of Dzonga (the fierce red-faced deity of Kanchenjunga).',
      'Public readings of the historic Kabi Longstok Blood Brotherhood Treaty.',
    ],
    chamDancesFeatured: ['Pangtoed Sacred Warrior Dance', 'Dzonga Mountain Guardian Cham'],
    primeMonasteries: ['Pemayangtse Monastery', 'Tsuklakhang Palace Monastery (Gangtok)', 'Tashiding Monastery'],
    district: 'Gangtok',
    images: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?q=80&w=800',
    ],
  },
  {
    id: 'fest-saga-dawa',
    name: 'Saga Dawa (The Triple Blessed Festival)',
    localName: 'ས་ག་ཟླ་བ (Month of Merits)',
    community: 'Buddhist',
    monthRange: 'May - June',
    approximateDates2025: 'June 11, 2025',
    approximateDates2026: 'May 31, 2026',
    tibetanLunarDate: '4th Month (Saga Month), 15th day (Full Moon)',
    shortSummary:
      'The holiest month in Tibetan Buddhism commemorating the Birth, Enlightenment, and Mahaparinirvana of Shakyamuni Buddha. All positive deeds earn 100,000-fold karmic merit.',
    significance:
      'A grand holy procession carrying sacred golden volumes of the Kangyur and Tengyur winds through the streets of Gangtok, accompanied by horns, cymbals, and incense.',
    ritualsAndCelebrations: [
      'Grand Holy Scripture (Kangyur) circumambulation procession through Gangtok.',
      'Butter lamp offerings and release of captive fish/birds (Tsethar life-saving).',
      'Strict vegetarianism observed by lamas and local residents.',
    ],
    chamDancesFeatured: ['Guru Tsokye Dorje Peaceful Manifestation Cham'],
    primeMonasteries: ['Rumtek Monastery', 'Enchey Monastery', 'Tsuklakhang Monastery', 'Pemayangtse Monastery'],
    district: 'All Districts',
    images: [
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=800',
    ],
  },
  {
    id: 'fest-tendong-lho-rum-faat',
    name: 'Tendong Lho Rum Faat (Worship of Mount Tendong)',
    localName: 'Tendong Lho Rum Faat (ཏེན་དོང་གསོལ་མཆོད)',
    community: 'Lepcha',
    monthRange: 'August',
    approximateDates2025: 'August 8, 2025',
    approximateDates2026: 'August 8, 2026',
    shortSummary:
      'The ancient indigenous thanksgiving festival of the Lepcha tribe honoring Mount Tendong ("The Raised Horn"), which saved the Lepchas from a mythological catastrophic flood.',
    significance:
      'Priests (Bongthing) and priestesses (Mun) offer prayers, bamboo shoots, and sacred spirits to nature spirits atop Tendong Peak in South Sikkim.',
    ritualsAndCelebrations: [
      'Pilgrimage hike up Mount Tendong through rhododendron forests.',
      'Traditional Lepcha folk drama and Tungbuk musical instrument recitals.',
      'Eco-cultural exhibitions showcasing indigenous herbs and bamboo handicrafts.',
    ],
    primeMonasteries: ['Tendong Hill Sanctuary', 'Namchi Cultural Center'],
    district: 'Namchi',
    images: [
      'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?q=80&w=800',
    ],
  },
  {
    id: 'fest-maghey-sankranti',
    name: 'Maghey Sankranti (Jorethang Confluence Mela)',
    localName: 'माघे संक्रान्ति (मकर संक्रान्ति)',
    community: 'Nepali',
    monthRange: 'January',
    approximateDates2025: 'January 14 – 16, 2025',
    approximateDates2026: 'January 14 – 16, 2026',
    shortSummary:
      'A major winter solstice festival celebrated with holy river baths at the sacred confluence of the Teesta and Rangeet rivers, traditional foods (Tarul roots, Sel Roti), and the famous Jorethang Cultural Tourism Expo.',
    significance:
      'Marks the transition of the Sun into Capricorn (Makara) and the beginning of longer, warmer spring days in the Himalayas.',
    ritualsAndCelebrations: [
      'Dawn dip in sacred river confluences (Tribeni Sangam).',
      'Eating yam roots (Tarul), sesame laddoos (Til ko Laddu), and crispy rice donuts (Sel Roti).',
      'Jorethang Handloom & Paragliding Sports Festival.',
    ],
    primeMonasteries: ['Rangeet Riverfront Jorethang', 'Solophok Char Dham'],
    district: 'Namchi',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
    ],
  },
];

// -----------------------------------------------------------------------------
// HELPER QUERY FUNCTIONS
// -----------------------------------------------------------------------------
export function queryMonasteries(filter: {
  lineage?: MonasteryLineage | 'all';
  district?: string;
  search?: string;
} = {}): MonasteryProfile[] {
  return SIKKIM_MONASTERIES_DATA.filter((m) => {
    if (filter.lineage && filter.lineage !== 'all' && m.lineage !== filter.lineage) return false;
    if (filter.district && filter.district !== 'all' && m.district !== filter.district) return false;
    if (filter.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase().trim();
      const matchName = m.name.toLowerCase().includes(q);
      const matchLocal = m.localName.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      const matchFounder = m.founder.toLowerCase().includes(q);
      if (!matchName && !matchLocal && !matchDesc && !matchFounder) return false;
    }
    return true;
  });
}

export function getMonasteryBySlug(slug: string): MonasteryProfile | undefined {
  return SIKKIM_MONASTERIES_DATA.find((m) => m.slug === slug || m.id === slug);
}

export function getPanoramaSceneById(idOrMonasteryId: string): PanoramaScene | undefined {
  return SIKKIM_PANORAMA_SCENES.find(
    (p) => p.id === idOrMonasteryId || p.monasteryId === idOrMonasteryId
  );
}

export function queryTraditionalAttire(filter: {
  community?: SikkimeseCommunity | 'all';
  gender?: string;
} = {}): TraditionalAttire[] {
  return SIKKIM_TRADITIONAL_ATTIRE_DATA.filter((a) => {
    if (filter.community && filter.community !== 'all' && a.community !== filter.community) return false;
    if (filter.gender && filter.gender !== 'all' && a.gender !== filter.gender) return false;
    return true;
  });
}

export function queryFestivals(filter: {
  community?: string;
  month?: string;
  search?: string;
} = {}): SikkimFestival[] {
  return SIKKIM_FESTIVALS_DATA.filter((f) => {
    if (filter.community && filter.community !== 'all' && f.community !== filter.community && f.community !== 'All Communities') {
      return false;
    }
    if (filter.month && filter.month !== 'all') {
      if (!f.monthRange.toLowerCase().includes(filter.month.toLowerCase())) return false;
    }
    if (filter.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase().trim();
      const matchName = f.name.toLowerCase().includes(q);
      const matchSummary = f.shortSummary.toLowerCase().includes(q);
      const matchSignificance = f.significance.toLowerCase().includes(q);
      if (!matchName && !matchSummary && !matchSignificance) return false;
    }
    return true;
  });
}
