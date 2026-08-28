/**
 * Traditional Sikkimese Garment Definitions and Anchor Metadata for AR Try-On Studio
 */

import { GarmentItem } from '@sikkim-yatra/shared';

export type { GarmentItem };

/**
 * Generate standalone SVG Data URI for traditional garments
 */
function createGarmentSvgDataUri(
  baseColor: string,
  trimColor: string,
  sashColor: string,
  innerColor: string,
  style: 'bakhu_male' | 'bakhu_female' | 'pangden' | 'lepcha_male' | 'lepcha_female' | 'daura' | 'gunyu' | 'child'
): string {
  let innerBody = '';

  switch (style) {
    case 'bakhu_male':
      innerBody = `
        <path d="M 120 180 L 15 290 L 65 340 L 165 240 Z" fill="${innerColor}" stroke="#0f172a" stroke-width="2"/>
        <path d="M 480 180 L 585 290 L 535 340 L 435 240 Z" fill="${innerColor}" stroke="#0f172a" stroke-width="2"/>
        <path d="M 230 120 C 170 125 140 145 130 160 L 140 380 L 120 520 L 100 810 C 100 830 130 840 200 840 L 400 840 C 470 840 500 830 500 810 L 480 520 L 460 380 L 470 160 C 460 145 430 125 370 120 Z" fill="${baseColor}" stroke="#1e293b" stroke-width="3"/>
        <path d="M 255 160 Q 340 190 390 280 L 430 380 L 400 480 L 370 480 L 360 290 Q 310 210 245 165 Z" fill="${trimColor}" opacity="0.3"/>
        <path d="M 245 165 Q 315 210 365 295 L 405 385" fill="none" stroke="${trimColor}" stroke-width="6" stroke-linecap="round"/>
        <rect x="135" y="440" width="330" height="55" rx="10" fill="${sashColor}" stroke="#78350f" stroke-width="2.5"/>
        <circle cx="300" cy="467" r="18" fill="#78350f" stroke="${trimColor}" stroke-width="3"/>
      `;
      break;

    case 'pangden':
    case 'bakhu_female':
      innerBody = `
        <path d="M 120 180 L 20 280 L 70 330 L 170 240 Z" fill="${innerColor}" stroke="#042f2e" stroke-width="2"/>
        <path d="M 480 180 L 580 280 L 530 330 L 430 240 Z" fill="${innerColor}" stroke="#042f2e" stroke-width="2"/>
        <path d="M 230 120 C 175 125 145 145 135 160 L 150 380 L 120 520 L 100 820 C 100 840 130 845 200 845 L 400 845 C 470 845 500 840 500 820 L 480 520 L 450 380 L 465 160 C 455 145 425 125 370 120 Z" fill="${baseColor}" stroke="#1f2937" stroke-width="3"/>
        <rect x="175" y="460" width="250" height="340" rx="6" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>
        <path d="M 175 485 L 425 485 M 175 510 L 425 510 M 175 535 L 425 535 M 175 560 L 425 560 M 175 585 L 425 585 M 175 610 L 425 610 M 175 635 L 425 635 M 175 660 L 425 660 M 175 685 L 425 685 M 175 710 L 425 710 M 175 735 L 425 735 M 175 760 L 425 760" stroke="#dc2626" stroke-width="8"/>
        <rect x="150" y="445" width="300" height="35" rx="8" fill="${sashColor}" stroke="#78350f" stroke-width="2"/>
      `;
      break;

    case 'lepcha_male':
      innerBody = `
        <path d="M 140 180 L 30 270 L 75 315 L 175 235 Z" fill="${innerColor}" stroke="#1e293b" stroke-width="2"/>
        <path d="M 460 180 L 570 270 L 525 315 L 425 235 Z" fill="${innerColor}" stroke="#1e293b" stroke-width="2"/>
        <path d="M 230 120 L 140 160 L 150 400 L 130 540 L 120 780 C 120 800 150 810 220 810 L 380 810 C 450 810 480 800 480 780 L 470 540 L 450 400 L 460 160 Z" fill="${baseColor}" stroke="#334155" stroke-width="3"/>
        <path d="M 140 160 L 470 540 L 420 540 L 140 210 Z" fill="${trimColor}" opacity="0.85"/>
        <path d="M 140 230 L 420 570 L 370 570 L 140 280 Z" fill="${trimColor}" opacity="0.85"/>
        <rect x="145" y="460" width="310" height="40" rx="8" fill="${sashColor}" stroke="#0f172a" stroke-width="2"/>
      `;
      break;

    case 'lepcha_female':
      innerBody = `
        <path d="M 130 180 L 35 275 L 80 320 L 175 235 Z" fill="${innerColor}" stroke="#064e3b" stroke-width="2"/>
        <path d="M 470 180 L 565 275 L 520 320 L 425 235 Z" fill="${innerColor}" stroke="#064e3b" stroke-width="2"/>
        <path d="M 230 120 C 175 125 145 145 135 160 L 145 380 L 130 520 L 110 820 C 110 840 140 845 200 845 L 400 845 C 460 845 490 840 490 820 L 470 520 L 455 380 L 465 160 Z" fill="${baseColor}" stroke="#064e3b" stroke-width="3"/>
        <path d="M 240 115 C 270 100 330 100 360 115 L 345 170 C 320 160 280 160 255 170 Z" fill="${innerColor}" stroke="#047857" stroke-width="2"/>
        <rect x="140" y="450" width="320" height="45" rx="8" fill="${sashColor}" stroke="#831843" stroke-width="2"/>
        <circle cx="300" cy="472" r="14" fill="#f43f5e" stroke="#ffe4e6" stroke-width="2"/>
      `;
      break;

    case 'daura':
      innerBody = `
        <path d="M 120 180 L 20 280 L 65 330 L 165 240 Z" fill="${innerColor}" stroke="#334155" stroke-width="2"/>
        <path d="M 480 180 L 580 280 L 535 330 L 435 240 Z" fill="${innerColor}" stroke="#334155" stroke-width="2"/>
        <path d="M 230 120 L 135 160 L 145 420 L 110 650 L 200 660 L 400 660 L 490 650 L 455 420 L 465 160 Z" fill="${innerColor}" stroke="#cbd5e1" stroke-width="2.5"/>
        <path d="M 230 125 L 145 165 L 155 460 L 250 470 L 260 200 L 340 200 L 350 470 L 445 460 L 455 165 L 370 125 Z" fill="${baseColor}" stroke="#0f172a" stroke-width="3"/>
        <circle cx="300" cy="240" r="5" fill="${trimColor}"/>
        <circle cx="300" cy="290" r="5" fill="${trimColor}"/>
        <circle cx="300" cy="340" r="5" fill="${trimColor}"/>
        <circle cx="300" cy="390" r="5" fill="${trimColor}"/>
        <circle cx="300" cy="440" r="5" fill="${trimColor}"/>
        <rect x="135" y="470" width="330" height="40" rx="6" fill="${sashColor}" stroke="#991b1b" stroke-width="2"/>
      `;
      break;

    case 'gunyu':
      innerBody = `
        <path d="M 120 180 L 25 285 L 70 330 L 165 240 Z" fill="${trimColor}" stroke="#831843" stroke-width="2"/>
        <path d="M 480 180 L 575 285 L 530 330 L 435 240 Z" fill="${trimColor}" stroke="#831843" stroke-width="2"/>
        <path d="M 230 120 L 140 160 L 150 370 L 450 370 L 460 160 L 370 120 Z" fill="${baseColor}" stroke="#500724" stroke-width="3"/>
        <path d="M 250 150 Q 300 230 360 270 L 440 370" fill="none" stroke="${trimColor}" stroke-width="5"/>
        <rect x="140" y="365" width="320" height="50" rx="8" fill="${sashColor}" stroke="#7f1d1d" stroke-width="2"/>
        <path d="M 150 415 L 100 820 C 100 840 130 845 200 845 L 400 845 C 470 845 500 840 500 820 L 450 415 Z" fill="#991b1b" stroke="#450a0a" stroke-width="3"/>
        <path d="M 100 805 L 500 805" stroke="${trimColor}" stroke-width="12"/>
      `;
      break;

    case 'child':
      innerBody = `
        <path d="M 130 190 L 35 280 L 75 320 L 165 245 Z" fill="${innerColor}" stroke="#334155" stroke-width="2"/>
        <path d="M 470 190 L 565 280 L 525 320 L 435 245 Z" fill="${innerColor}" stroke="#334155" stroke-width="2"/>
        <path d="M 230 130 C 175 135 145 155 135 170 L 145 380 L 130 500 L 120 730 C 120 750 150 755 210 755 L 390 755 C 450 755 480 750 480 730 L 470 500 L 455 380 L 465 170 Z" fill="${baseColor}" stroke="#1e293b" stroke-width="2.5"/>
        <rect x="140" y="430" width="320" height="40" rx="6" fill="${sashColor}" stroke="#78350f" stroke-width="2"/>
        <circle cx="300" cy="450" r="14" fill="#f59e0b" stroke="${trimColor}" stroke-width="2"/>
      `;
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="600" height="850">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <g filter="url(#shadow)">
      ${innerBody}
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const VENDOR_DHH_GANGTOK = {
  id: 'vendor-dhh-gangtok',
  name: 'Directorate of Handicrafts and Handlooms (DHH)',
  district: 'Gangtok' as const,
  address: 'Zero Point, National Highway 10, Gangtok 737101',
  contactPhone: '+91 3592 202931',
  rentalPricePerDay: '₹550 / day (complete set)',
  purchasePriceRange: '₹4,500 – ₹18,000 (authentic silk)',
  isGovtCertified: true,
  latitude: 27.3389,
  longitude: 88.6138,
};

const VENDOR_KANCHENJUNGA_SILK = {
  id: 'vendor-kanchenjunga-silk',
  name: 'Kanchenjunga Silk & Brocade Guild',
  district: 'Pakyong' as const,
  address: 'Bazaar Road, Singtam / Pakyong Cluster',
  contactPhone: '+91 98320 44512',
  rentalPricePerDay: '₹600 / day (with jewellery)',
  purchasePriceRange: '₹5,000 – ₹22,000',
  isGovtCertified: true,
  latitude: 27.2355,
  longitude: 88.4983,
};

const VENDOR_DZONGU_LEPCHA = {
  id: 'vendor-dzongu-lepcha',
  name: 'Dzongu Indigenous Lepcha Weavers Association',
  district: 'Mangan' as const,
  address: 'Passingdang, Dzongu Protected Reserve, North Sikkim',
  contactPhone: '+91 94341 88920',
  rentalPricePerDay: '₹450 / day (with Sumbok cap)',
  purchasePriceRange: '₹3,500 – ₹12,000 (natural nettle & cotton)',
  isGovtCertified: true,
  latitude: 27.5218,
  longitude: 88.5412,
};

const VENDOR_NAMCHI_DHAKA = {
  id: 'vendor-namchi-dhaka',
  name: 'Namchi Handloom & Dhaka Weaving Cooperative',
  district: 'Namchi' as const,
  address: 'Khadi Gramodyog Bhavan, Central Park, Namchi 737126',
  contactPhone: '+91 3595 254810',
  rentalPricePerDay: '₹500 / day (Daura + Askot + Topi)',
  purchasePriceRange: '₹3,200 – ₹9,500',
  isGovtCertified: true,
  latitude: 27.1667,
  longitude: 88.35,
};

const VENDOR_PELLING_STUDIO = {
  id: 'vendor-pelling-studio',
  name: 'Pelling Heritage Cultural Dress Studio',
  district: 'Gyalshing' as const,
  address: 'Near Pemayangtse Monastery Road, Upper Pelling',
  contactPhone: '+91 97330 12894',
  rentalPricePerDay: '₹400 / day (photo ready)',
  purchasePriceRange: '₹3,800 – ₹14,000',
  isGovtCertified: false,
  latitude: 27.3167,
  longitude: 88.2333,
};


export const SIKKIM_GARMENT_WARDROBE: GarmentItem[] = [
  {
    id: 'bhutia-men-bakhu-kho',
    name: 'Bhutia Men’s Bakhu (Kho) & Yentse',
    nativeName: 'བོད་ཆས (Kho)',
    community: 'Bhutia',
    categorySlug: 'bakhu-kho',
    gender: 'male',
    ageGroup: 'adult',
    imageUrl: createGarmentSvgDataUri('#1e3a8a', '#eab308', '#d97706', '#f8fafc', 'bakhu_male'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.14,
      leftShoulderX: 0.22,
      leftShoulderY: 0.18,
      rightShoulderX: 0.78,
      rightShoulderY: 0.18,
      waistCenterY: 0.54,
      widthScaleRatio: 1.85,
      heightScaleRatio: 2.1,
    },
    culturalDescription:
      'Heavy midnight-blue silk/wool robe tied securely at the waist with a woven gold Kera sash, worn over a crisp white standing-collar Honju shirt for formal gatherings and archery festivals.',
    festivalOccasions: ['Losar (New Year)', 'Pang Lhabsol', 'Drupka Teshi'],
    craftNotes: {
      materials: ['Handloom Pure Mulberry Silk', 'Tibetan Sheep Wool', 'Gold Thread Trim'],
      weavingTechnique: 'Pit-loom heavy warp with brocade border embroidery',
      producingRegion: 'Directorate of Handicrafts (Gangtok) & North Sikkim Valleys',
      originLore: 'Descended from trans-Himalayan royal robes designed to withstand high altitude winds while leaving arms free for archery and riding.',
      preservationStatus: 'Heritage Preserved',
    },
    localVendors: [VENDOR_DHH_GANGTOK, VENDOR_KANCHENJUNGA_SILK],
    isFeatured: true,
  },
  {
    id: 'bhutia-women-ceremonial-bakhu-pangden',
    name: 'Bhutia Ceremonial Bakhu & Pangden',
    nativeName: 'ཕང་གདན (Pangden)',
    community: 'Bhutia',
    categorySlug: 'bakhu-pangden',
    gender: 'female',
    ageGroup: 'adult',
    imageUrl: createGarmentSvgDataUri('#0f766e', '#f59e0b', '#dc2626', '#06b6d4', 'pangden'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.14,
      leftShoulderX: 0.22,
      leftShoulderY: 0.18,
      rightShoulderX: 0.78,
      rightShoulderY: 0.18,
      waistCenterY: 0.53,
      widthScaleRatio: 1.8,
      heightScaleRatio: 2.15,
    },
    culturalDescription:
      'Iconic sleeveless emerald silk Bakhu accompanied by the multi-colored handwoven wool Pangden apron, signifying marriage and cultural pride in Bhutia heritage.',
    festivalOccasions: ['Losar (New Year)', 'Traditional Weddings', 'Saga Dawa'],
    craftNotes: {
      materials: ['Fine Dyed Wool Weft', 'Turquoise Raw Silk', 'Embossed Gold Brocade'],
      weavingTechnique: 'Backstrap loom 3-striped geometric wool tapestry',
      producingRegion: 'Lachen, Lachung (Mangan) & Gangtok Handicrafts',
      originLore: 'The woven Pangden apron is presented during wedding ceremonies by the bride’s maternal family, carrying prayers of long life and prosperity.',
      preservationStatus: 'Thriving',
    },
    localVendors: [VENDOR_DHH_GANGTOK, VENDOR_PELLING_STUDIO],
    isFeatured: true,
  },
  {
    id: 'bhutia-women-festive-silk-bakhu',
    name: 'Bhutia Festive Brocade Silk Bakhu',
    nativeName: 'གྱོ་གོས (Ghyo-Bakhu)',
    community: 'Bhutia',
    categorySlug: 'bakhu-silk',
    gender: 'female',
    ageGroup: 'adult',
    imageUrl: createGarmentSvgDataUri('#991b1b', '#fbbf24', '#f59e0b', '#0d9488', 'bakhu_female'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.14,
      leftShoulderX: 0.22,
      leftShoulderY: 0.18,
      rightShoulderX: 0.78,
      rightShoulderY: 0.18,
      waistCenterY: 0.52,
      widthScaleRatio: 1.82,
      heightScaleRatio: 2.1,
    },
    culturalDescription:
      'Flowing royal crimson silk brocade Bakhu with gold lotus motifs and turquoise sleeves, worn by festive dancers during monastic celebrations.',
    festivalOccasions: ['Pang Lhabsol', 'Monastery Cham Dances', 'Losar'],
    craftNotes: {
      materials: ['Varanasi-Tibetan Brocade Silk', 'Natural Madder Root Dye'],
      weavingTechnique: 'Jacquard brocade with embossed eight auspicious symbols (Ashtamangala)',
      producingRegion: 'Singtam Silk Weavers Guild & Gangtok',
      originLore: 'Worn by court dancers during the sacred warrior dance of Mount Kanchenjunga (Pang Lhabsol).',
      preservationStatus: 'Heritage Preserved',
    },
    localVendors: [VENDOR_KANCHENJUNGA_SILK, VENDOR_DHH_GANGTOK],
    isFeatured: true,
  },
  {
    id: 'bhutia-child-junior-chuba',
    name: 'Junior Bhutia Silk Chuba & Kera',
    nativeName: 'བྱིས་པའི་ཆུ་བ (Chuba)',
    community: 'Bhutia',
    categorySlug: 'bakhu-child',
    gender: 'unisex',
    ageGroup: 'child',
    imageUrl: createGarmentSvgDataUri('#b45309', '#fef08a', '#dc2626', '#38bdf8', 'child'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.15,
      leftShoulderX: 0.24,
      leftShoulderY: 0.19,
      rightShoulderX: 0.76,
      rightShoulderY: 0.19,
      waistCenterY: 0.51,
      widthScaleRatio: 1.7,
      heightScaleRatio: 1.95,
    },
    culturalDescription:
      'Scaled lightweight amber silk robe with soft sash designed for children during traditional family prayers and monastic pilgrimages.',
    festivalOccasions: ['Losar', 'Family Ceremonies'],
    craftNotes: {
      materials: ['Lightweight Organic Silk', 'Soft Cotton Lining'],
      weavingTechnique: 'Breathable child-friendly handloom stitch',
      producingRegion: 'Directorate of Handicrafts (Gangtok)',
      originLore: 'Given to children during their first Losar celebration to receive elders’ blessings.',
      preservationStatus: 'Thriving',
    },
    localVendors: [VENDOR_DHH_GANGTOK],
  },
  {
    id: 'lepcha-men-thokro-dum',
    name: 'Lepcha Men’s Thokro-Dum & Yenthatse',
    nativeName: 'Thokro-Dum',
    community: 'Lepcha',
    categorySlug: 'thokro-dum',
    gender: 'male',
    ageGroup: 'adult',
    imageUrl: createGarmentSvgDataUri('#334155', '#991b1b', '#0f172a', '#f1f5f9', 'lepcha_male'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.14,
      leftShoulderX: 0.23,
      leftShoulderY: 0.18,
      rightShoulderX: 0.77,
      rightShoulderY: 0.18,
      waistCenterY: 0.54,
      widthScaleRatio: 1.75,
      heightScaleRatio: 2.05,
    },
    culturalDescription:
      'Handwoven white and maroon striped cotton fabric pinned across the left shoulder and cinched with a Gyaptuk belt, honoring the indigenous forest lore of Mount Tendong.',
    festivalOccasions: ['Tendong Lho Rum Faat', 'Namsoong (Lepcha New Year)'],
    craftNotes: {
      materials: ['Indigenous Himalayan Nettle Fibre (Sisnu)', 'Organic Cotton', 'Vegetable Dyes'],
      weavingTechnique: 'Traditional loin loom warp-faced weave',
      producingRegion: 'Dzongu Indigenous Reserve & Lingthem (Mangan)',
      originLore: 'Commemorates the flood legend of Tendong Hill where indigenous Lepcha ancestors were saved by sacred bamboo and hornbill spirits.',
      preservationStatus: 'Rare Indigenous',
    },
    localVendors: [VENDOR_DZONGU_LEPCHA, VENDOR_DHH_GANGTOK],
    isFeatured: true,
  },
  {
    id: 'lepcha-women-dumbun-dumdem',
    name: 'Lepcha Women’s Dumbun (Dumdem) & Tago',
    nativeName: 'Dumdem / Tago',
    community: 'Lepcha',
    categorySlug: 'dumbun-tago',
    gender: 'female',
    ageGroup: 'adult',
    imageUrl: createGarmentSvgDataUri('#064e3b', '#f43f5e', '#be185d', '#ecfdf5', 'lepcha_female'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.14,
      leftShoulderX: 0.22,
      leftShoulderY: 0.18,
      rightShoulderX: 0.78,
      rightShoulderY: 0.18,
      waistCenterY: 0.53,
      widthScaleRatio: 1.78,
      heightScaleRatio: 2.1,
    },
    culturalDescription:
      'Ankle-length sage-green handwoven cotton wrap paired with a loose high-collared Tago blouse and vibrant Nyamrek sash, celebrating the sacred flora of Kanchenjunga.',
    festivalOccasions: ['Namsoong (New Year)', 'Tendong Lho Rum Faat'],
    craftNotes: {
      materials: ['Hand-spun Cotton Yarn', 'Nettle Fibre Weave', 'Natural Bark Dyes'],
      weavingTechnique: 'Loin loom seamless tubular wrap with embroidered selvedge',
      producingRegion: 'Dzongu Weavers Guild & Mangan',
      originLore: 'Inspired by the graceful bamboo reeds and mountain orchid blossoms of Teesta valley.',
      preservationStatus: 'Heritage Preserved',
    },
    localVendors: [VENDOR_DZONGU_LEPCHA, VENDOR_PELLING_STUDIO],
    isFeatured: true,
  },
  {
    id: 'lepcha-child-junior-thokro',
    name: 'Junior Lepcha Striped Thokro-Dum',
    nativeName: 'Junior Thokro',
    community: 'Lepcha',
    categorySlug: 'thokro-child',
    gender: 'unisex',
    ageGroup: 'child',
    imageUrl: createGarmentSvgDataUri('#475569', '#be123c', '#1e293b', '#f8fafc', 'child'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.15,
      leftShoulderX: 0.24,
      leftShoulderY: 0.19,
      rightShoulderX: 0.76,
      rightShoulderY: 0.19,
      waistCenterY: 0.52,
      widthScaleRatio: 1.68,
      heightScaleRatio: 1.9,
    },
    culturalDescription:
      'Authentic miniature cross-body Lepcha handwoven weave with traditional diamond border embroidery for boys and girls.',
    festivalOccasions: ['Namsoong', 'Community Assemblies'],
    craftNotes: {
      materials: ['Pure Soft Cotton', 'Natural Dyes'],
      weavingTechnique: 'Miniature loin loom diamond motif',
      producingRegion: 'Dzongu Reserve (Mangan)',
      originLore: 'Worn during ancestral folklore storytelling around the hearth.',
      preservationStatus: 'Rare Indigenous',
    },
    localVendors: [VENDOR_DZONGU_LEPCHA],
  },
  {
    id: 'nepali-men-daura-suruwal-askot',
    name: 'Nepali Men’s Daura Suruwal & Askot Vest',
    nativeName: 'दौरा सुरुवाल र आस्कॉट',
    community: 'Nepali',
    categorySlug: 'daura-suruwal',
    gender: 'male',
    ageGroup: 'adult',
    imageUrl: createGarmentSvgDataUri('#0f172a', '#eab308', '#991b1b', '#f8fafc', 'daura'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.14,
      leftShoulderX: 0.23,
      leftShoulderY: 0.18,
      rightShoulderX: 0.77,
      rightShoulderY: 0.18,
      waistCenterY: 0.55,
      widthScaleRatio: 1.75,
      heightScaleRatio: 2.05,
    },
    culturalDescription:
      'Eight-string cross-tied pristine white cotton Daura tunic fitted with an embroidered black velvet Askot waistcoat and red Patuka sash for formal state ceremonies.',
    festivalOccasions: ['Dashain', 'Tihar', 'Bhanu Jayanti', 'Bagaicha'],
    craftNotes: {
      materials: ['100% Khadi Cotton', 'Micro-Velvet Askot', 'Brass Filigree Buttons'],
      weavingTechnique: 'Eight-knot auspicious binding (representing Astamatrika deities)',
      producingRegion: 'Namchi Handloom Cooperative & Rhenock Weavers',
      originLore: 'Each of the eight ties signifies protection from the eight guardian directions according to Vedic-Himalayan folklore.',
      preservationStatus: 'Thriving',
    },
    localVendors: [VENDOR_NAMCHI_DHAKA, VENDOR_DHH_GANGTOK],
    isFeatured: true,
  },
  {
    id: 'nepali-women-gunyu-cholo-patuka',
    name: 'Nepali Women’s Gunyu Cholo & Patuka',
    nativeName: 'गोन्यू चोलो र पटुका',
    community: 'Nepali',
    categorySlug: 'gunyu-cholo',
    gender: 'female',
    ageGroup: 'adult',
    imageUrl: createGarmentSvgDataUri('#831843', '#f59e0b', '#b91c1c', '#fdf2f8', 'gunyu'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.14,
      leftShoulderX: 0.22,
      leftShoulderY: 0.18,
      rightShoulderX: 0.78,
      rightShoulderY: 0.18,
      waistCenterY: 0.5,
      widthScaleRatio: 1.82,
      heightScaleRatio: 2.15,
    },
    culturalDescription:
      'Deep magenta velvet cross-tied Cholo blouse paired with a vibrant red gold-printed Gunyu skirt and Patuka sash, marking auspicious occasions and weddings.',
    festivalOccasions: ['Dashain', 'Tihar', 'Teej', 'Weddings'],
    craftNotes: {
      materials: ['Embroidered Silk Velvet', 'Gold-leaf Printed Cotton', 'Handloom Red Patuka'],
      weavingTechnique: 'Pleated flared fariya drape with reinforced waist gathering',
      producingRegion: 'Namchi & Gangtok Artisan Clusters',
      originLore: 'Presented during the coming-of-age ceremony (Gunyu Cholo Diyo) marking womanhood and cultural initiation.',
      preservationStatus: 'Thriving',
    },
    localVendors: [VENDOR_NAMCHI_DHAKA, VENDOR_PELLING_STUDIO],
    isFeatured: true,
  },
  {
    id: 'nepali-women-chaubandi-maruni',
    name: 'Nepali Chaubandi Cholo & Maruni Dress',
    nativeName: 'चौबन्दी चोलो',
    community: 'Nepali',
    categorySlug: 'chaubandi-cholo',
    gender: 'female',
    ageGroup: 'adult',
    imageUrl: createGarmentSvgDataUri('#9f1239', '#fbbf24', '#7f1d1d', '#fce7f3', 'gunyu'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.14,
      leftShoulderX: 0.22,
      leftShoulderY: 0.18,
      rightShoulderX: 0.78,
      rightShoulderY: 0.18,
      waistCenterY: 0.51,
      widthScaleRatio: 1.8,
      heightScaleRatio: 2.1,
    },
    culturalDescription:
      'Traditional four-tied Chaubandi bodice paired with pleated performance skirt, celebrated across Sikkim during harvest dances and Maruni folk rituals.',
    festivalOccasions: ['Tihar', 'Maghe Sankranti', 'Maruni Celebrations'],
    craftNotes: {
      materials: ['Crimson Cotton Broadcloth', 'Handwoven Gold Zari Border'],
      weavingTechnique: 'Four-string wrap with rhythmic dance pleats',
      producingRegion: 'Namchi Central Weavers & Rhenock',
      originLore: 'Worn by lead dancers in the historic Maruni dance depicting the victory of good over evil.',
      preservationStatus: 'Heritage Preserved',
    },
    localVendors: [VENDOR_NAMCHI_DHAKA, VENDOR_DHH_GANGTOK],
  },
  {
    id: 'nepali-boy-junior-daura',
    name: 'Junior Nepali Daura Suruwal & Dhaka Vest',
    nativeName: 'सानो दौरा सुरुवाल',
    community: 'Nepali',
    categorySlug: 'daura-child',
    gender: 'male',
    ageGroup: 'child',
    imageUrl: createGarmentSvgDataUri('#1e293b', '#f59e0b', '#dc2626', '#f8fafc', 'child'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.15,
      leftShoulderX: 0.24,
      leftShoulderY: 0.19,
      rightShoulderX: 0.76,
      rightShoulderY: 0.19,
      waistCenterY: 0.53,
      widthScaleRatio: 1.68,
      heightScaleRatio: 1.9,
    },
    culturalDescription:
      'Classic scaled cotton Daura Suruwal tunic with miniature Dhaka printed waistcoat for boys during Dashain blessings.',
    festivalOccasions: ['Dashain Tika', 'Tihar'],
    craftNotes: {
      materials: ['Soft Washed Cotton', 'Dhaka Patterned Vest'],
      weavingTechnique: 'Fitted miniature tailoring with soft inner seams',
      producingRegion: 'Namchi Handloom Cooperative',
      originLore: 'Worn when receiving rice Tika and Jamara blessings from family elders.',
      preservationStatus: 'Thriving',
    },
    localVendors: [VENDOR_NAMCHI_DHAKA],
  },
  {
    id: 'nepali-girl-junior-gunyu-cholo',
    name: 'Junior Nepali Gunyu Cholo & Pote',
    nativeName: 'सानो गोन्यू चोलो',
    community: 'Nepali',
    categorySlug: 'gunyu-child',
    gender: 'female',
    ageGroup: 'child',
    imageUrl: createGarmentSvgDataUri('#991b1b', '#fde047', '#b91c1c', '#fff1f2', 'child'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.15,
      leftShoulderX: 0.24,
      leftShoulderY: 0.19,
      rightShoulderX: 0.76,
      rightShoulderY: 0.19,
      waistCenterY: 0.52,
      widthScaleRatio: 1.7,
      heightScaleRatio: 1.92,
    },
    culturalDescription:
      'Miniature crimson and gold Gunyu Cholo with velvet bodice for young girls participating in cultural celebrations.',
    festivalOccasions: ['Teej', 'Dashain', 'School Cultural Days'],
    craftNotes: {
      materials: ['Ruby Velvet Bodice', 'Soft Printed Brocade Skirt'],
      weavingTechnique: 'Scaled traditional pattern with flexible elasticated inner waistband',
      producingRegion: 'Namchi & Gangtok Artisan Guilds',
      originLore: 'Worn by young girls during festive folk performances across Sikkim.',
      preservationStatus: 'Thriving',
    },
    localVendors: [VENDOR_NAMCHI_DHAKA, VENDOR_DHH_GANGTOK],
  },
];


export type GarmentDefinition = GarmentItem;

export const TEST_GARMENT_ITEM: GarmentItem = SIKKIM_GARMENT_WARDROBE[2] || SIKKIM_GARMENT_WARDROBE[0]!;

// -----------------------------------------------------------------------------
// TRADITIONAL HEADGEAR ASSETS & CALIBRATED ANCHORS
// -----------------------------------------------------------------------------

function createHeadgearSvgDataUri(type: 'dhaka_topi' | 'bhutia_hat' | 'lepcha_hat'): string {
  let content = '';

  switch (type) {
    case 'dhaka_topi':
      content = `
        <!-- Traditional Nepali Dhaka Topi (Faceted woven cap) -->
        <polygon points="50,180 150,40 350,40 450,180" fill="#991b1b" stroke="#0f172a" stroke-width="6"/>
        <!-- Dhaka geometric weave patterns -->
        <polygon points="100,160 170,60 330,60 400,160" fill="#0f172a"/>
        <path d="M 120 160 L 250 80 L 380 160" fill="none" stroke="#eab308" stroke-width="8"/>
        <circle cx="250" cy="110" r="16" fill="#eab308" stroke="#991b1b" stroke-width="3"/>
        <rect x="50" y="170" width="400" height="20" rx="4" fill="#7f1d1d" stroke="#0f172a" stroke-width="4"/>
      `;
      break;

    case 'bhutia_hat':
      content = `
        <!-- Traditional Bhutia Fur & Brocade Cap (Gyalshom) -->
        <path d="M 90 180 C 90 80 170 30 250 30 C 330 30 410 80 410 180 Z" fill="#b91c1c" stroke="#78350f" stroke-width="6"/>
        <!-- Gold Lotus Brocade Center -->
        <circle cx="250" cy="110" r="28" fill="#f59e0b" stroke="#78350f" stroke-width="4"/>
        <path d="M 235 110 Q 250 85 265 110 Q 250 135 235 110" fill="#dc2626"/>
        <!-- Fur Side Flaps (Turned up) -->
        <path d="M 60 190 Q 90 140 140 140 L 140 190 Z" fill="#d97706" stroke="#78350f" stroke-width="4"/>
        <path d="M 440 190 Q 410 140 360 140 L 360 190 Z" fill="#d97706" stroke="#78350f" stroke-width="4"/>
        <rect x="70" y="175" width="360" height="25" rx="8" fill="#f59e0b" stroke="#78350f" stroke-width="4"/>
      `;
      break;

    case 'lepcha_hat':
      content = `
        <!-- Traditional Lepcha Bamboo Woven Feather Hat (Sumbok) -->
        <ellipse cx="250" cy="170" rx="190" ry="40" fill="#d97706" stroke="#451a03" stroke-width="5"/>
        <path d="M 120 165 C 130 90 180 50 250 50 C 320 50 370 90 380 165 Z" fill="#fbbf24" stroke="#78350f" stroke-width="5"/>
        <!-- Bamboo Woven Grid -->
        <path d="M 170 150 Q 250 70 330 150 M 200 160 Q 250 90 300 160" fill="none" stroke="#92400e" stroke-width="4"/>
        <!-- Feather Ornament on Crown -->
        <path d="M 250 50 Q 290 10 320 0 Q 300 25 255 45" fill="#047857" stroke="#064e3b" stroke-width="2"/>
        <circle cx="250" cy="50" r="10" fill="#dc2626"/>
      `;
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 220" width="500" height="220">
    <defs>
      <filter id="headDrop" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
      </filter>
    </defs>
    <g filter="url(#headDrop)">
      ${content}
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SIKKIM_HEADGEAR_CATALOG = [
  {
    id: 'headgear-nepali-dhaka-topi',
    name: 'Traditional Nepali Dhaka Topi',
    nativeName: 'ढाका टोपी',
    community: 'Nepali' as const,
    imageUrl: createHeadgearSvgDataUri('dhaka_topi'),
    anchorPoints: {
      crownCenterX: 0.5,
      crownCenterY: 0.85,
      widthScaleRatio: 1.25,
      heightScaleRatio: 0.95,
      verticalHeadOffsetRatio: 0.78,
    },
    culturalLore: 'Iconic geometric handwoven Dhaka cotton cap representing the mountain peaks of the Himalayas, worn tilted proudly during festivals.',
  },
  {
    id: 'headgear-bhutia-gyalshom',
    name: 'Bhutia Ceremonial Gyalshom Hat',
    nativeName: 'རྒྱལ་ཞྭ (Gyal-Shom)',
    community: 'Bhutia' as const,
    imageUrl: createHeadgearSvgDataUri('bhutia_hat'),
    anchorPoints: {
      crownCenterX: 0.5,
      crownCenterY: 0.88,
      widthScaleRatio: 1.35,
      heightScaleRatio: 1.05,
      verticalHeadOffsetRatio: 0.82,
    },
    culturalLore: 'Traditional brocade silk and wool turned-ear cap worn during Losar celebrations and monastic festivals.',
  },
  {
    id: 'headgear-lepcha-sumbok',
    name: 'Lepcha Sumbok Bamboo Feather Hat',
    nativeName: 'Sumbok (Rong Hat)',
    community: 'Lepcha' as const,
    imageUrl: createHeadgearSvgDataUri('lepcha_hat'),
    anchorPoints: {
      crownCenterX: 0.5,
      crownCenterY: 0.85,
      widthScaleRatio: 1.3,
      heightScaleRatio: 1.0,
      verticalHeadOffsetRatio: 0.8,
    },
    culturalLore: 'Woven split-bamboo dome adorned with natural forest plumage honoring indigenous Lepcha forest heritage.',
  },
];

// -----------------------------------------------------------------------------
// SECONDARY GARMENT LAYERS (OVERLAYS / SASHES / WAISTCOATS)
// -----------------------------------------------------------------------------

function createLayerSvgDataUri(type: 'bhutia_pangden' | 'nepali_askot' | 'lepcha_sash'): string {
  let content = '';

  switch (type) {
    case 'bhutia_pangden':
      content = `
        <!-- Woven Wool Striped Pangden Apron with Gold Sash -->
        <rect x="170" y="440" width="260" height="360" rx="8" fill="#f59e0b" stroke="#78350f" stroke-width="3"/>
        <path d="M 170 470 L 430 470 M 170 500 L 430 500 M 170 530 L 430 530 M 170 560 L 430 560 M 170 590 L 430 590 M 170 620 L 430 620 M 170 650 L 430 650 M 170 680 L 430 680 M 170 710 L 430 710 M 170 740 L 430 740 M 170 770 L 430 770" stroke="#dc2626" stroke-width="10"/>
        <!-- Golden Waist Tie -->
        <rect x="130" y="425" width="340" height="35" rx="8" fill="#d97706" stroke="#78350f" stroke-width="2.5"/>
        <circle cx="300" cy="442" r="16" fill="#78350f" stroke="#fef08a" stroke-width="3"/>
      `;
      break;

    case 'nepali_askot':
      content = `
        <!-- Embroidered Black Velvet Askot Waistcoat -->
        <path d="M 230 125 L 145 165 L 155 470 L 250 480 L 260 200 L 340 200 L 350 480 L 445 470 L 455 165 L 370 125 Z" fill="#0f172a" stroke="#f59e0b" stroke-width="3.5"/>
        <!-- Brass Filigree Buttons -->
        <circle cx="300" cy="240" r="6" fill="#fbbf24" stroke="#78350f" stroke-width="1.5"/>
        <circle cx="300" cy="290" r="6" fill="#fbbf24" stroke="#78350f" stroke-width="1.5"/>
        <circle cx="300" cy="340" r="6" fill="#fbbf24" stroke="#78350f" stroke-width="1.5"/>
        <circle cx="300" cy="390" r="6" fill="#fbbf24" stroke="#78350f" stroke-width="1.5"/>
        <circle cx="300" cy="440" r="6" fill="#fbbf24" stroke="#78350f" stroke-width="1.5"/>
      `;
      break;

    case 'lepcha_sash':
      content = `
        <!-- Lepcha Diagonal Bamboo Gyaptuk Sash & Shoulder Drape -->
        <path d="M 140 160 L 470 540 L 410 540 L 140 220 Z" fill="#dc2626" opacity="0.9" stroke="#991b1b" stroke-width="2"/>
        <path d="M 140 240 L 410 570 L 350 570 L 140 300 Z" fill="#eab308" opacity="0.9"/>
        <rect x="140" y="460" width="320" height="40" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="300" cy="480" r="16" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>
      `;
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="600" height="850">
    <defs>
      <filter id="layerDrop" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <g filter="url(#layerDrop)">
      ${content}
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SIKKIM_LAYERS_CATALOG = [
  {
    id: 'layer-bhutia-pangden',
    name: 'Bhutia Woven Pangden Apron',
    layerType: 'apron' as const,
    community: 'Bhutia' as const,
    imageUrl: createLayerSvgDataUri('bhutia_pangden'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.14,
      leftShoulderX: 0.22,
      leftShoulderY: 0.18,
      rightShoulderX: 0.78,
      rightShoulderY: 0.18,
      waistCenterY: 0.53,
      widthScaleRatio: 1.8,
      heightScaleRatio: 2.15,
    },
    culturalLore: 'Three-striped vibrant wool apron traditionally tied around the waist by married Bhutia women.',
  },
  {
    id: 'layer-nepali-askot',
    name: 'Nepali Velvet Askot Waistcoat',
    layerType: 'outer_waistcoat' as const,
    community: 'Nepali' as const,
    imageUrl: createLayerSvgDataUri('nepali_askot'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.14,
      leftShoulderX: 0.23,
      leftShoulderY: 0.18,
      rightShoulderX: 0.77,
      rightShoulderY: 0.18,
      waistCenterY: 0.55,
      widthScaleRatio: 1.75,
      heightScaleRatio: 2.05,
    },
    culturalLore: 'Fitted black velvet waistcoat with golden brass buttons layered over the Daura tunic.',
  },
  {
    id: 'layer-lepcha-sash',
    name: 'Lepcha Ceremonial Gyaptuk Sash',
    layerType: 'sash' as const,
    community: 'Lepcha' as const,
    imageUrl: createLayerSvgDataUri('lepcha_sash'),
    anchorPoints: {
      neckCenterX: 0.5,
      neckCenterY: 0.14,
      leftShoulderX: 0.23,
      leftShoulderY: 0.18,
      rightShoulderX: 0.77,
      rightShoulderY: 0.18,
      waistCenterY: 0.54,
      widthScaleRatio: 1.75,
      heightScaleRatio: 2.05,
    },
    culturalLore: 'Traditional diagonal crimson and gold shoulder drape and woven waist belt.',
  },
];

// -----------------------------------------------------------------------------
// INSTANT IN-MEMORY IMAGE PRELOADER CACHE
// -----------------------------------------------------------------------------

const inMemoryImageCache = new Map<string, HTMLImageElement>();

export function getCachedImage(url: string): HTMLImageElement {
  let img = inMemoryImageCache.get(url);
  if (!img) {
    img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    inMemoryImageCache.set(url, img);
  }
  return img;
}

export function preloadAllWardrobeAssets(): void {
  if (typeof window === 'undefined') return;

  // Preload all 12 garments
  SIKKIM_GARMENT_WARDROBE.forEach((item) => {
    getCachedImage(item.imageUrl);
  });

  // Preload all headgears
  SIKKIM_HEADGEAR_CATALOG.forEach((item) => {
    getCachedImage(item.imageUrl);
  });

  // Preload all secondary layers
  SIKKIM_LAYERS_CATALOG.forEach((item) => {
    getCachedImage(item.imageUrl);
  });
}



