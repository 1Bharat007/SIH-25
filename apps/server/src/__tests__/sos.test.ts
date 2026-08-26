import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDistanceKm, sortEmergencyContactsByDistance } from '../utils/geo.js';
import { SIKKIM_EMERGENCY_DATA } from '../data/sikkim-data.js';
import { querySafetyRoutes } from '../data/sikkim-safety-data.js';

describe('Safety Module - Geo & Nearest Emergency Tests', () => {
  it('should accurately calculate distance in km using Haversine formula', () => {
    // Distance between Gangtok Sadar (27.3314, 88.6138) and Rumtek (27.3023, 88.5492)
    const distanceKm = calculateDistanceKm(27.3314, 88.6138, 27.3023, 88.5492);
    assert.ok(
      distanceKm > 6 && distanceKm < 10,
      `Expected distance between 6-10 km, got ${distanceKm} km`
    );
  });

  it('should return 0 km distance for identical coordinates', () => {
    const distanceKm = calculateDistanceKm(27.3314, 88.6138, 27.3314, 88.6138);
    assert.strictEqual(distanceKm, 0);
  });

  it('should identify Gangtok Sadar Police and STNM Hospital when traveler is in Gangtok', () => {
    const travelerGps = { lat: 27.3314, lng: 88.6138 };
    const sorted = sortEmergencyContactsByDistance(
      travelerGps.lat,
      travelerGps.lng,
      SIKKIM_EMERGENCY_DATA
    );

    assert.ok(sorted.length > 0);

    const nearestPolice = sorted.find(
      c => c.type === 'police_station' || c.type === 'disaster_management_sdma'
    );
    assert.ok(nearestPolice);
    assert.strictEqual(nearestPolice.name, 'Gangtok Sadar Police Station');
    assert.ok(
      nearestPolice.distanceKm < 1.0,
      `Expected close proximity < 1km, got ${nearestPolice.distanceKm} km`
    );

    const nearestHospital = sorted.find(c => c.type === 'hospital');
    assert.ok(nearestHospital);
    assert.strictEqual(nearestHospital.name, 'STNM Multispeciality Government Hospital');
  });

  it('should identify Chungthang Police and Rescue Post when traveler is in North Sikkim (Mangan)', () => {
    const travelerGps = { lat: 27.9942, lng: 88.7107 }; // Gurudongmar Lake
    const sorted = sortEmergencyContactsByDistance(
      travelerGps.lat,
      travelerGps.lng,
      SIKKIM_EMERGENCY_DATA
    );

    const nearestPolice = sorted.find(
      c => c.type === 'police_station' || c.type === 'disaster_management_sdma'
    );
    assert.ok(nearestPolice);
    assert.strictEqual(nearestPolice.name, 'Chungthang Police & Disaster Rescue Post');
  });

  it('should identify Gyalshing District Hospital when traveler is in West Sikkim (Pelling)', () => {
    const travelerGps = { lat: 27.306, lng: 88.2483 }; // Pemayangtse
    const sorted = sortEmergencyContactsByDistance(
      travelerGps.lat,
      travelerGps.lng,
      SIKKIM_EMERGENCY_DATA
    );

    const nearestHospital = sorted.find(c => c.type === 'hospital');
    assert.ok(nearestHospital);
    assert.strictEqual(nearestHospital.name, 'Gyalshing District Hospital & Trauma Center');
  });
});

describe('Safety Module - Data-Driven Safe Routes & Avoid-After-Dark Zones', () => {
  it('should filter only high-safety well-lit routes when minSafetyRating is 4.5', () => {
    const safeRoutes = querySafetyRoutes({ minSafetyRating: 4.5 });
    assert.ok(safeRoutes.length >= 2);
    for (const route of safeRoutes) {
      assert.ok(route.safetyRating >= 4.5);
      assert.strictEqual(route.curfewActive, false);
    }
  });

  it('should identify avoid-after-dark high altitude zones with active curfews', () => {
    const avoidDarkRoutes = querySafetyRoutes({ routeType: 'avoid_after_dark' });
    assert.ok(avoidDarkRoutes.length > 0);
    const tsomgoCorridor = avoidDarkRoutes.find(r => r.id === 'route-tsomgo-nathula');
    assert.ok(tsomgoCorridor);
    assert.strictEqual(tsomgoCorridor.curfewActive, true);
    assert.strictEqual(tsomgoCorridor.lightingLevel, 'unlit');
    assert.ok(tsomgoCorridor.safetyRating < 3.0);
  });

  it('should identify high-altitude danger passes with severe night travel bans', () => {
    const dangerPasses = querySafetyRoutes({ routeType: 'high_altitude_mountain_pass' });
    assert.ok(dangerPasses.length > 0);
    const thanguPass = dangerPasses.find(r => r.id === 'route-thangu-gurudongmar');
    assert.ok(thanguPass);
    assert.strictEqual(thanguPass.safetyRating, 1.9);
    assert.strictEqual(thanguPass.curfewActive, true);
    assert.ok(thanguPass.tags.includes('Zero Cell Coverage'));
  });
});
