import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDistanceKm } from '../utils/geo.js';
import {
  getStoredAlerts,
  createDisasterAlert,
  updateDisasterAlert,
  deleteDisasterAlert,
  findMatchingSafeDetour,
  querySafeShelters,
  SIKKIM_EVACUATION_GUIDELINES,
} from '../data/disaster-data.js';

describe('Disaster Management Module - Alert Lifecycle & Storage', () => {
  it('should retrieve active disaster alerts', () => {
    const activeAlerts = getStoredAlerts({ activeOnly: true });
    assert.ok(activeAlerts.length >= 3, 'Expected at least 3 initial active alerts');

    const nh10Alert = activeAlerts.find(a => a.id === 'alert-nh10-landslide');
    assert.ok(nh10Alert, 'NH10 landslide alert must be present');
    assert.strictEqual(nh10Alert.type, 'landslide');
    assert.strictEqual(nh10Alert.severity, 'critical');
    assert.strictEqual(nh10Alert.status, 'active');
  });

  it('should filter alerts by district and severity', () => {
    const pakyongAlerts = getStoredAlerts({ district: 'Pakyong' });
    assert.ok(pakyongAlerts.length >= 1);
    assert.ok(pakyongAlerts[0]);
    assert.strictEqual(pakyongAlerts[0].district, 'Pakyong');

    const highAlerts = getStoredAlerts({ severity: 'high' });
    assert.ok(highAlerts.length >= 1);
    for (const a of highAlerts) {
      assert.strictEqual(a.severity, 'high');
    }
  });

  it('should create, update, and resolve a disaster alert', () => {
    const testAlert = createDisasterAlert({
      title: 'Sudden Mudflow near Dzongu Valley Link Road',
      description: 'Minor hillside mud runoff blocking single lane.',
      type: 'landslide',
      severity: 'moderate',
      district: 'Mangan',
      centerLat: 27.52,
      centerLng: 88.54,
      radiusKm: 4.0,
      affectedCorridor: 'Dzongu Tribal Reserve Link Road',
      recommendedAction: 'Proceed with low gear, follow local SDRF signals.',
    });

    assert.ok(testAlert.id.startsWith('alert-'));
    assert.strictEqual(testAlert.status, 'active');
    assert.strictEqual(testAlert.severity, 'moderate');

    // Update status to resolved
    const updated = updateDisasterAlert(testAlert.id, {
      status: 'resolved',
      recommendedAction: 'Road fully cleared by BRO JCB earthmovers.',
    });

    assert.ok(updated);
    assert.strictEqual(updated.status, 'resolved');
    assert.ok(updated.resolvedAt);

    // Delete alert
    const deleted = deleteDisasterAlert(testAlert.id);
    assert.strictEqual(deleted, true);
  });
});

describe('Disaster Management Module - Geofenced Proximity & Safe Detours', () => {
  it('should detect proximity to NH10 Landslide zone for traveler near Singtam', () => {
    // Traveler coordinates near 29th Mile / Singtam: 27.21, 88.525
    // Alert coordinates: 27.205, 88.528 (radius 7.5 km)
    const travelerLat = 27.21;
    const travelerLng = 88.525;

    const alertLat = 27.205;
    const alertLng = 88.528;
    const distanceKm = calculateDistanceKm(travelerLat, travelerLng, alertLat, alertLng);

    assert.ok(distanceKm < 2.0, `Traveler is within ${distanceKm} km, well inside danger zone`);
  });

  it('should find matching safe detour when NH10 is blocked', () => {
    const detour = findMatchingSafeDetour('detour-nh10-pakyong-rorathang');
    assert.ok(detour, 'Expected Pakyong-Rorathang safe detour');
    assert.strictEqual(detour.avoidedHazardType, 'landslide');
    assert.strictEqual(detour.roadStatus, 'fully_open');
    assert.ok(detour.safetyRating >= 4.5);
    assert.ok(detour.waypoints.length >= 3, 'Must have intermediate navigation waypoints');
    assert.ok(detour.pathCoordinates.length >= 4, 'Must have polyline route coordinates for map');
  });

  it('should match North Sikkim valley safe loop when Thangu blizzard is active', () => {
    const detour = findMatchingSafeDetour('alert-thangu-blizzard');
    assert.ok(detour, 'Expected North Sikkim valley detour');
    assert.strictEqual(detour.avoidedHazardType, 'heavy_snowfall');
    assert.strictEqual(detour.recommendedVehicleType, 'suv_4wd_preferred');
  });
});

describe('Disaster Management Module - Evacuation & Shelters Lookup', () => {
  it('should contain complete survival manuals for all key mountain hazard types', () => {
    const requiredHazards = ['landslide', 'flash_flood', 'earthquake', 'heavy_snowfall'];
    for (const type of requiredHazards) {
      const guideline = SIKKIM_EVACUATION_GUIDELINES.find(g => g.hazardType === type);
      assert.ok(guideline, `Evacuation guideline for ${type} must exist`);
      assert.ok(guideline.immediateActions.length >= 3);
      assert.ok(guideline.steps.length >= 2);
      assert.ok(guideline.emergencyKitList.length >= 3);
      assert.ok(guideline.helplines.length >= 2);
    }
  });

  it('should sort designated shelters by distance from traveler GPS', () => {
    // Traveler in Gangtok: 27.3314, 88.6138
    const shelters = querySafeShelters(27.3314, 88.6138);
    assert.ok(shelters.length >= 4);
    const closest = shelters[0];
    assert.ok(closest);

    // Closest shelter to Gangtok must be STNM Hospital Trauma Shelter (< 3km)
    assert.strictEqual(closest.id, 'shelter-stnm-gangtok');
    assert.ok(closest.distanceKm !== undefined && closest.distanceKm < 3.0);
    assert.strictEqual(closest.hasMedicalPost, true);
    assert.strictEqual(closest.is24x7Open, true);
  });
});
