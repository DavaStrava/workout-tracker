import type { CardioFieldType } from '../types';

/**
 * Calculate pace in seconds per kilometer
 * @param distanceMeters Distance in meters
 * @param durationSeconds Duration in seconds
 * @returns Pace in seconds per km, or null if invalid
 */
export function calculatePace(distanceMeters: number, durationSeconds: number): number | null {
  if (!distanceMeters || !durationSeconds || distanceMeters <= 0) return null;
  const distanceKm = distanceMeters / 1000;
  return durationSeconds / distanceKm;
}

/**
 * Format pace as "M:SS" string
 */
export function formatPace(paceSecondsPerKm: number | null): string {
  if (!paceSecondsPerKm || paceSecondsPerKm <= 0) return '--:--';
  const minutes = Math.floor(paceSecondsPerKm / 60);
  const seconds = Math.round(paceSecondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate rowing pace (time per 500m)
 * @param distanceMeters Distance in meters
 * @param durationSeconds Duration in seconds
 * @returns Pace in seconds per 500m, or null if invalid
 */
export function calculateRowingPace(distanceMeters: number, durationSeconds: number): number | null {
  if (!distanceMeters || !durationSeconds || distanceMeters <= 0) return null;
  return (durationSeconds / distanceMeters) * 500;
}

/**
 * Format rowing pace as "M:SS" string (per 500m)
 */
export function formatRowingPace(pacePer500m: number | null): string {
  if (!pacePer500m || pacePer500m <= 0) return '--:--';
  const minutes = Math.floor(pacePer500m / 60);
  const seconds = Math.round(pacePer500m % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate average speed in km/h
 * @param distanceMeters Distance in meters
 * @param durationSeconds Duration in seconds
 * @returns Speed in km/h, or null if invalid
 */
export function calculateSpeed(distanceMeters: number, durationSeconds: number): number | null {
  if (!distanceMeters || !durationSeconds || durationSeconds <= 0) return null;
  const distanceKm = distanceMeters / 1000;
  const durationHours = durationSeconds / 3600;
  return distanceKm / durationHours;
}

/**
 * Format speed as "XX.X" string
 */
export function formatSpeed(speedKmh: number | null): string {
  if (!speedKmh || speedKmh <= 0) return '--.-';
  return speedKmh.toFixed(1);
}

/**
 * Format duration from seconds to "HH:MM:SS" or "MM:SS"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format distance for display based on sport
 * @param meters Distance in meters
 * @param sportId Sport identifier (swimming uses meters, others use km)
 */
export function formatDistance(meters: number, sportId?: string): string {
  if (!meters || meters <= 0) return '--';
  // Swimming and rowing display in meters
  if (sportId === 'swimming' || sportId === 'rowing') {
    return `${Math.round(meters)}`;
  }
  // Others display in km with one decimal
  return (meters / 1000).toFixed(1);
}

/**
 * Convert display value to storage value
 * @param type Field type
 * @param displayValue Value as shown in UI
 * @param sportId Sport identifier (affects distance conversion)
 */
export function displayToStorage(type: CardioFieldType, displayValue: number, sportId?: string): number {
  switch (type) {
    case 'distance':
      // Swimming and rowing input is already in meters
      if (sportId === 'swimming' || sportId === 'rowing') {
        return displayValue;
      }
      // Others input in km, convert to meters
      return displayValue * 1000;
    case 'duration':
      // Input in minutes, store as seconds
      return displayValue * 60;
    default:
      return displayValue;
  }
}

/**
 * Convert storage value to display value
 * @param type Field type
 * @param storageValue Value as stored (meters, seconds)
 * @param sportId Sport identifier (affects distance conversion)
 */
export function storageToDisplay(type: CardioFieldType, storageValue: number, sportId?: string): number {
  switch (type) {
    case 'distance':
      // Swimming and rowing display in meters
      if (sportId === 'swimming' || sportId === 'rowing') {
        return storageValue;
      }
      // Others display in km
      return storageValue / 1000;
    case 'duration':
      // Store in seconds, display in minutes
      return storageValue / 60;
    default:
      return storageValue;
  }
}

/**
 * Get computed field value for display
 * @param fieldType The computed field type
 * @param distance Distance in meters
 * @param duration Duration in seconds
 * @param sportId Sport identifier
 */
export function getComputedValue(
  fieldType: CardioFieldType,
  distance: number | undefined,
  duration: number | undefined,
  sportId: string
): string {
  if (!distance || !duration) return '--';

  switch (fieldType) {
    case 'pace':
      // Rowing uses /500m pace, others use /km
      if (sportId === 'rowing') {
        return formatRowingPace(calculateRowingPace(distance, duration));
      }
      return formatPace(calculatePace(distance, duration));
    case 'speed':
      return formatSpeed(calculateSpeed(distance, duration));
    default:
      return '--';
  }
}
