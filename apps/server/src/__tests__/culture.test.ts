import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  queryMonasteries,
  getMonasteryBySlug,
  getPanoramaSceneById,
  queryTraditionalAttire,
  queryFestivals,
  SIKKIM_PANORAMA_SCENES,
} from '../data/culture-data.js';
import { SIKKIM_GARMENT_CATALOG, queryGarments } from '../data/garment-catalog.js';



describe('Cultural & AR Module - Sacred Monasteries & Lineages', () => {
  it('should retrieve all registered monasteries with required spiritual properties', () => {
    const monasteries = queryMonasteries();
    assert.ok(monasteries.length >= 5, 'Expected at least 5 monasteries');

    for (const m of monasteries) {
      assert.ok(m.id && m.slug && m.name);
      assert.ok(m.lineage);
      assert.ok(m.sacredRelics.length > 0, `Monastery ${m.name} must have documented relics`);
      assert.ok(m.etiquetteRules.length > 0, `Monastery ${m.name} must have etiquette rules`);
      assert.ok(m.visitingHours);
    }
  });

  it('should filter monasteries by Nyingma and Karma Kagyu lineages', () => {
    const nyingma = queryMonasteries({ lineage: 'Nyingma' });
    assert.ok(nyingma.length >= 3);
    for (const m of nyingma) {
      assert.strictEqual(m.lineage, 'Nyingma');
    }

    const kagyu = queryMonasteries({ lineage: 'Karma Kagyu' });
    assert.ok(kagyu.length >= 1);
    assert.strictEqual(kagyu[0]?.name, 'Rumtek Monastery');
  });

  it('should retrieve Rumtek Monastery by slug with relics and etiquette', () => {
    const rumtek = getMonasteryBySlug('rumtek-monastery');
    assert.ok(rumtek);
    assert.strictEqual(rumtek.district, 'Gangtok');
    assert.strictEqual(rumtek.foundedYear, 1740);

    const goldStupa = rumtek.sacredRelics.find((r) => r.name.includes('Golden Reliquary'));
    assert.ok(goldStupa, 'Golden Stupa relic must be present');
  });
});

describe('Cultural & AR Module - 360° Panorama Scenes & 3D Hotspots', () => {
  it('should have 360 panorama scenes with valid spherical pitch and yaw coordinates', () => {
    assert.ok(SIKKIM_PANORAMA_SCENES.length >= 2);

    for (const scene of SIKKIM_PANORAMA_SCENES) {
      assert.ok(scene.id && scene.monasteryId && scene.sceneTitle);
      assert.ok(scene.panoramaImageUrl);
      assert.ok(scene.initialView);
      assert.ok(scene.hotspots.length > 0, `Scene ${scene.id} must have hotspots`);

      for (const h of scene.hotspots) {
        assert.ok(h.pitch >= -90 && h.pitch <= 90, `Pitch ${h.pitch} out of bounds`);
        assert.ok(h.yaw >= -180 && h.yaw <= 180, `Yaw ${h.yaw} out of bounds`);
        assert.ok(h.title && h.description);
      }
    }
  });

  it('should retrieve Rumtek 360 scene with Karmapa Throne and 108 Butter Lamp hotspots', () => {
    const rumtekScene = getPanoramaSceneById('panorama-rumtek-main');
    assert.ok(rumtekScene);
    assert.strictEqual(rumtekScene.monasteryName, 'Rumtek Monastery');

    const throne = rumtekScene.hotspots.find((h) => h.id === 'hotspot-throne');
    assert.ok(throne);
    assert.strictEqual(throne.category, 'altar');

    const butterLamps = rumtekScene.hotspots.find((h) => h.id === 'hotspot-butter-lamps');
    assert.ok(butterLamps);
  });
});

describe('Cultural & AR Module - Traditional Attire & Festivals', () => {
  it('should contain traditional attire for Bhutia, Lepcha, and Nepali communities', () => {
    const communities = ['Bhutia', 'Lepcha', 'Nepali'] as const;

    for (const c of communities) {
      const attire = queryTraditionalAttire({ community: c });
      assert.ok(attire.length >= 1, `Expected attire for ${c}`);
      assert.strictEqual(attire[0]?.community, c);
      assert.ok(attire[0]?.pieces.length >= 2, `${c} attire must have component pieces`);
    }
  });

  it('should query Sikkim festival calendar including Losoong and Pang Lhabsol', () => {
    const festivals = queryFestivals();
    assert.ok(festivals.length >= 4);

    const losoong = festivals.find((f) => f.id === 'fest-losoong');
    assert.ok(losoong);
    assert.ok(losoong.chamDancesFeatured && losoong.chamDancesFeatured.length > 0);

    const pangLhabsol = festivals.find((f) => f.id === 'fest-pang-lhabsol');
    assert.ok(pangLhabsol);
    assert.ok(
      pangLhabsol.shortSummary.includes('Kanchenjunga') ||
        pangLhabsol.name.includes('Kanchenjunga')
    );
  });

  it('should contain 12 traditional garments across Bhutia, Lepcha, and Nepali communities with valid anchor metadata', () => {
    assert.strictEqual(SIKKIM_GARMENT_CATALOG.length, 12, 'Expected exactly 12 traditional outfits in wardrobe');

    for (const g of SIKKIM_GARMENT_CATALOG) {
      assert.ok(g.id && g.name && g.community && g.categorySlug && g.gender && g.ageGroup);
      assert.ok(g.imageUrl.startsWith('data:image/svg+xml'));
      assert.ok(g.culturalDescription);
      assert.ok(g.festivalOccasions.length > 0);

      // Validate calibrated anchor coordinates
      const anchors = g.anchorPoints;
      assert.strictEqual(anchors.neckCenterX, 0.5, `${g.id} neckCenterX must be 0.5`);
      assert.ok(anchors.neckCenterY >= 0.1 && anchors.neckCenterY <= 0.25, `${g.id} neckCenterY out of bounds`);
      assert.ok(anchors.leftShoulderX >= 0.15 && anchors.leftShoulderX <= 0.35, `${g.id} leftShoulderX out of bounds`);
      assert.ok(anchors.rightShoulderX >= 0.65 && anchors.rightShoulderX <= 0.85, `${g.id} rightShoulderX out of bounds`);
      assert.ok(anchors.widthScaleRatio >= 1.5 && anchors.widthScaleRatio <= 2.2, `${g.id} widthScaleRatio out of bounds`);
      assert.ok(anchors.heightScaleRatio >= 1.7 && anchors.heightScaleRatio <= 2.4, `${g.id} heightScaleRatio out of bounds`);
    }
  });

  it('should correctly filter garments by community, gender, and age group', () => {
    const bhutiaWomen = queryGarments({ community: 'Bhutia', gender: 'female' });
    assert.ok(bhutiaWomen.length >= 2, 'Expected at least 2 Bhutia women outfits');
    for (const item of bhutiaWomen) {
      assert.strictEqual(item.community, 'Bhutia');
      assert.ok(item.gender === 'female' || item.gender === 'unisex');
    }


    const lepchaMen = queryGarments({ community: 'Lepcha', gender: 'male' });
    assert.ok(lepchaMen.length >= 1);
    assert.strictEqual(lepchaMen[0]?.id, 'lepcha-men-thokro-dum');

    const nepaliChildren = queryGarments({ community: 'Nepali', ageGroup: 'child' });
    assert.strictEqual(nepaliChildren.length, 2, 'Expected 2 Nepali children outfits');

    const searchResult = queryGarments({ search: 'Daura' });
    assert.ok(searchResult.length >= 2);
  });
});

