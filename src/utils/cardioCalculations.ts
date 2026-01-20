import type { CardioFieldType, UnitSystem } from '../types';

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

// Conversion constants
const MILES_TO_METERS = 1609.34;
const YARDS_TO_METERS = 0.9144;

/**
 * Convert display value to storage value
 * @param type Field type
 * @param displayValue Value as shown in UI
 * @param sportId Sport identifier (affects distance conversion)
 * @param unitSystem Unit system (metric or imperial)
 */
export function displayToStorage(type: CardioFieldType, displayValue: number, sportId?: string, unitSystem: UnitSystem = 'metric'): number {
  switch (type) {
    case 'distance':
      // Swimming and rowing use m/yd
      if (sportId === 'swimming' || sportId === 'rowing') {
        if (unitSystem === 'imperial') {
          // Input in yards, convert to meters
          return displayValue * YARDS_TO_METERS;
        }
        // Metric: input already in meters
        return displayValue;
      }
      // Other sports use km/mi
      if (unitSystem === 'imperial') {
        // Input in miles, convert to meters
        return displayValue * MILES_TO_METERS;
      }
      // Metric: input in km, convert to meters
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
 * @param unitSystem Unit system (metric or imperial)
 */
export function storageToDisplay(type: CardioFieldType, storageValue: number, sportId?: string, unitSystem: UnitSystem = 'metric'): number {
  switch (type) {
    case 'distance':
      // Swimming and rowing display in m/yd
      if (sportId === 'swimming' || sportId === 'rowing') {
        if (unitSystem === 'imperial') {
          // Convert meters to yards
          return storageValue / YARDS_TO_METERS;
        }
        // Metric: display in meters
        return storageValue;
      }
      // Other sports display in km/mi
      if (unitSystem === 'imperial') {
        // Convert meters to miles
        return storageValue / MILES_TO_METERS;
      }
      // Metric: display in km
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

/**
 * Get the distance unit for a sport based on unit system
 * @param sportId Sport identifier
 * @param unitSystem Unit system (metric or imperial)
 */
export function getDistanceUnitForSport(sportId?: string, unitSystem: UnitSystem = 'metric'): string {
  const useMeterYard = sportId === 'swimming' || sportId === 'rowing';

  if (unitSystem === 'imperial') {
    return useMeterYard ? 'yd' : 'mi';
  }
  return useMeterYard ? 'm' : 'km';
}

/**
 * Get pace unit for display based on sport and unit system
 * @param sportId Sport identifier
 * @param unitSystem Unit system (metric or imperial)
 */
export function getPaceUnitForSport(sportId?: string, unitSystem: UnitSystem = 'metric'): string {
  if (sportId === 'rowing') {
    // Rowing always uses /500m regardless of unit system (standard for rowing)
    return '/500m';
  }
  return unitSystem === 'imperial' ? 'min/mi' : 'min/km';
}

/**
 * Get speed unit based on unit system
 * @param unitSystem Unit system (metric or imperial)
 */
export function getSpeedUnit(unitSystem: UnitSystem = 'metric'): string {
  return unitSystem === 'imperial' ? 'mph' : 'km/h';
}
