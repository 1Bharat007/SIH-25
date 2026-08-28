/**
 * Test Garment Definitions and Anchor Metadatas for Real-Time AR Try-On Studio
 */

export interface GarmentDefinition {
  id: string;
  name: string;
  community: string;
  description: string;
  imageUrl: string;
  /**
   * Reference anchor configuration on the garment's source image (normalized 0.0 to 1.0)
   */
  anchors: {
    /** Collar/Neckline center point */
    neckCenterX: number;
    neckCenterY: number;
    /** Left shoulder anchor */
    leftShoulderX: number;
    leftShoulderY: number;
    /** Right shoulder anchor */
    rightShoulderX: number;
    rightShoulderY: number;
    /** Waist / Sash center point */
    waistCenterY: number;
    /** Default width expansion multiplier relative to shoulder distance */
    widthScaleRatio: number;
    /** Default height expansion multiplier relative to torso length (shoulder-to-hip) */
    heightScaleRatio: number;
  };
}

/**
 * High-definition standalone SVG data URI for Traditional Bhutia Silk Bakhu & Kera
 * Crimson Red Brocade with Gold Lotus Embossing, Jade Collar & Golden Silk Sash
 */
export const DEFAULT_TEST_GARMENT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="600" height="850">
  <defs>
    <!-- Rich Brocade Gradients -->
    <linearGradient id="brocadeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b91c1c"/>
      <stop offset="45%" stop-color="#991b1b"/>
      <stop offset="100%" stop-color="#7f1d1d"/>
    </linearGradient>
    <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="silkSash" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="innerCollar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="100%" stop-color="#115e59"/>
    </linearGradient>
    <!-- Gold Lotus Pattern -->
    <pattern id="lotusMotif" width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="30" cy="30" r="4" fill="#fbbf24" opacity="0.45"/>
      <path d="M30 18 C25 24 25 32 30 38 C35 32 35 24 30 18 Z" fill="#fbbf24" opacity="0.4"/>
      <path d="M18 30 C24 25 32 25 38 30 C32 35 24 35 18 30 Z" fill="#fbbf24" opacity="0.4"/>
    </pattern>
    <!-- Drop Shadow Filter -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Group with Shadow -->
  <g filter="url(#shadow)">
    <!-- Inner Silk Blouse (Honju) Sleeves extending outward -->
    <path d="M 120 180 L 20 280 L 70 330 L 170 240 Z" fill="#0d9488" stroke="#042f2e" stroke-width="2"/>
    <path d="M 480 180 L 580 280 L 530 330 L 430 240 Z" fill="#0d9488" stroke="#042f2e" stroke-width="2"/>
    <!-- Gold Sleeve Cuffs -->
    <polygon points="20,280 70,330 85,315 35,265" fill="url(#goldTrim)"/>
    <polygon points="580,280 530,330 515,315 565,265" fill="url(#goldTrim)"/>

    <!-- Main Bakhu Robe Outer Body Silhouette -->
    <!-- Shoulders: Left (130, 150), Right (470, 150), Neck (300, 120) -->
    <path d="M 230 120 
             C 170 125 140 145 130 160 
             L 145 380 
             L 110 520 
             L 90 790 
             C 90 820 120 830 200 830
             L 400 830
             C 480 830 510 820 510 790
             L 490 520
             L 455 380
             L 470 160
             C 460 145 430 125 370 120
             Z" 
          fill="url(#brocadeGlow)" 
          stroke="#450a0a" 
          stroke-width="3"/>

    <!-- Lotus Brocade Overlay Pattern -->
    <path d="M 230 120 
             C 170 125 140 145 130 160 
             L 145 380 
             L 110 520 
             L 90 790 
             C 90 820 120 830 200 830
             L 400 830
             C 480 830 510 820 510 790
             L 490 520
             L 455 380
             L 470 160
             C 460 145 430 125 370 120
             Z" 
          fill="url(#lotusMotif)"/>

    <!-- Inner Turquoise Standing Mandarin Collar -->
    <path d="M 240 115 C 270 100 330 100 360 115 L 345 170 C 320 160 280 160 255 170 Z" 
          fill="url(#innerCollar)" 
          stroke="#134e4a" 
          stroke-width="2"/>

    <!-- Cross-Over Front Lapel (Left over Right Tibetan/Bhutia Style) -->
    <path d="M 255 160 
             Q 340 190 390 280 
             L 430 380 
             L 400 480 
             L 370 480 
             L 360 290 
             Q 310 210 245 165 Z" 
          fill="#7f1d1d" 
          stroke="url(#goldTrim)" 
          stroke-width="4"/>

    <!-- Gold Lapel Border Trim -->
    <path d="M 245 165 Q 315 210 365 295 L 405 385" 
          fill="none" 
          stroke="url(#goldTrim)" 
          stroke-width="6" 
          stroke-linecap="round"/>

    <!-- Center Waist Sash (Kera) Tied at Abdomen / Hips -->
    <rect x="135" y="440" width="330" height="60" rx="12" fill="url(#silkSash)" stroke="#78350f" stroke-width="2.5"/>
    <!-- Decorative Sash Folds and Knot -->
    <path d="M 140 455 L 460 455 M 140 475 L 460 475 M 140 485 L 460 485" stroke="#b45309" stroke-width="1.5" opacity="0.6"/>
    
    <!-- Central Ornamental Buckle / Knot Brocade -->
    <circle cx="300" cy="470" r="22" fill="#78350f" stroke="url(#goldTrim)" stroke-width="4"/>
    <circle cx="300" cy="470" r="12" fill="#0d9488" stroke="#fef08a" stroke-width="2"/>

    <!-- Hanging Sash Ribbon Tails -->
    <path d="M 285 490 L 275 620 L 305 615 L 300 490 Z" fill="url(#silkSash)" stroke="#78350f" stroke-width="1.5"/>
    <path d="M 300 490 L 305 640 L 335 635 L 315 490 Z" fill="#d97706" stroke="#78350f" stroke-width="1.5"/>

    <!-- Lower Robe Pleats & Hemline Border -->
    <path d="M 200 500 L 180 825 M 260 500 L 250 828 M 340 500 L 350 828 M 400 500 L 420 825" 
          stroke="#450a0a" 
          stroke-width="2" 
          opacity="0.5"/>

    <!-- Gold Hem Border at Foot -->
    <path d="M 90 790 C 90 820 120 830 200 830 L 400 830 C 480 830 510 820 510 790 L 510 805 C 510 835 480 845 400 845 L 200 845 C 120 845 90 835 90 805 Z" 
          fill="url(#goldTrim)"/>
  </g>
</svg>`;

export const DEFAULT_TEST_GARMENT_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  DEFAULT_TEST_GARMENT_SVG
)}`;

export const TEST_GARMENT_ITEM: GarmentDefinition = {
  id: 'test-bhutia-bakhu-silk',
  name: 'Traditional Royal Silk Bakhu & Honju',
  community: 'Bhutia Community',
  description:
    'Authentic full-length royal crimson silk brocade robe with turquoise inner blouse, ceremonial golden lotus motifs, and traditional woven Kera sash.',
  imageUrl: DEFAULT_TEST_GARMENT_DATA_URI,
  anchors: {
    neckCenterX: 0.5, // 300 / 600
    neckCenterY: 0.14, // 120 / 850
    leftShoulderX: 0.22, // 130 / 600
    leftShoulderY: 0.18, // 150 / 850
    rightShoulderX: 0.78, // 470 / 600
    rightShoulderY: 0.18, // 150 / 850
    waistCenterY: 0.55, // 470 / 850
    widthScaleRatio: 1.85, // Width relative to shoulder distance
    heightScaleRatio: 2.1, // Total height relative to shoulder-to-hip torso length
  },
};
