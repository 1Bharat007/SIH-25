import { EmergencyContactSummary } from '@sikkim-yatra/shared';

/**
 * Calculates the great-circle distance between two points on the Earth's surface using the Haversine formula.
 * @returns Distance in kilometers rounded to two decimal places
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export interface EmergencyContactWithDistance extends EmergencyContactSummary {
  distanceKm: number;
}

export function sortEmergencyContactsByDistance(
  userLat: number,
  userLng: number,
  contacts: EmergencyContactSummary[]
): EmergencyContactWithDistance[] {
  return contacts
    .map(contact => ({
      ...contact,
      distanceKm: calculateDistanceKm(userLat, userLng, contact.latitude, contact.longitude),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
