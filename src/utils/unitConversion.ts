import type { UnitSystem } from '../types';

// Conversion factors
const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 1 / KG_TO_LBS;
const METERS_TO_MILES = 0.000621371;
const MILES_TO_METERS = 1 / METERS_TO_MILES;
const METERS_TO_YARDS = 1.09361;
const YARDS_TO_METERS = 1 / METERS_TO_YARDS;
const METERS_TO_KM = 0.001;
const KM_TO_METERS = 1000;

// Sports that use meters/yards for distance (not km/mi)
const METER_BASED_SPORTS = ['swimming', 'rowing'];

// ====================
// Basic Conversions
// ====================

export function kgToLbs(kg: number): number {
  return kg * KG_TO_LBS;
}

export function lbsToKg(lbs: number): number {
  return lbs * LBS_TO_KG;
}

export function metersToMiles(meters: number): number {
  return meters * METERS_TO_MILES;
}

export function milesToMeters(miles: number): number {
  return miles * MILES_TO_METERS;
}

export function metersToYards(meters: number): number {
  return meters * METERS_TO_YARDS;
}

export function yardsToMeters(yards: number): number {
  return yards * YARDS_TO_METERS;
}

export function metersToKm(meters: number): number {
  return meters * METERS_TO_KM;
}

export function kmToMeters(km: number): number {
  return km * KM_TO_METERS;
}

// ====================
// Display Functions
// ====================

/**
 * Convert kg (storage) to display unit
 */
export function displayWeight(kg: number, unitSystem: UnitSystem): number {
  if (unitSystem === 'imperial') {
    return Math.round(kgToLbs(kg) * 10) / 10; // Round to 1 decimal
  }
  return Math.round(kg * 10) / 10;
}

/**
 * Convert input value to kg (storage)
 */
export function storageWeight(value: number, unitSystem: UnitSystem): number {
  if (unitSystem === 'imperial') {
    return lbsToKg(value);
  }
  return value;
}

/**
 * Convert meters (storage) to display unit
 * @param sportId - Optional sport ID to determine if meters/yards should be used
 */
export function displayDistance(
  meters: number,
  unitSystem: UnitSystem,
  sportId?: string
): number {
  const useMeterYard = sportId && METER_BASED_SPORTS.includes(sportId);

  if (unitSystem === 'imperial') {
    if (useMeterYard) {
      // Swimming/rowing: meters -> yards
      return Math.round(metersToYards(meters));
    }
    // Other sports: meters -> miles
    return Math.round(metersToMiles(meters) * 100) / 100; // 2 decimals for miles
  }

  if (useMeterYard) {
    // Metric, meter-based sports: keep as meters
    return Math.round(meters);
  }
  // Metric, other sports: meters -> km
  return Math.round(metersToKm(meters) * 100) / 100; // 2 decimals for km
}

/**
 * Convert input value to meters (storage)
 * @param sportId - Optional sport ID to determine if meters/yards are being used
 */
export function storageDistance(
  value: number,
  unitSystem: UnitSystem,
  sportId?: string
): number {
  const useMeterYard = sportId && METER_BASED_SPORTS.includes(sportId);

  if (unitSystem === 'imperial') {
    if (useMeterYard) {
      // Swimming/rowing: yards -> meters
      return yardsToMeters(value);
    }
    // Other sports: miles -> meters
    return milesToMeters(value);
  }

  if (useMeterYard) {
    // Metric, meter-based sports: already in meters
    return value;
  }
  // Metric, other sports: km -> meters
  return kmToMeters(value);
}

// ====================
// Unit Labels
// ====================

export function getWeightUnit(unitSystem: UnitSystem): string {
  return unitSystem === 'imperial' ? 'lbs' : 'kg';
}

export function getDistanceUnit(unitSystem: UnitSystem, sportId?: string): string {
  const useMeterYard = sportId && METER_BASED_SPORTS.includes(sportId);

  if (unitSystem === 'imperial') {
    return useMeterYard ? 'yd' : 'mi';
  }
  return useMeterYard ? 'm' : 'km';
}

// ====================
// Input Constraints
// ====================

interface InputConstraints {
  min: number;
  max: number;
  step: number;
}

export function getWeightConstraints(unitSystem: UnitSystem): InputConstraints {
  if (unitSystem === 'imperial') {
    return { min: 0, max: 2205, step: 0.5 }; // ~1000 kg in lbs
  }
  return { min: 0, max: 1000, step: 0.5 };
}

export function getDistanceConstraints(
  unitSystem: UnitSystem,
  sportId?: string
): InputConstraints {
  const useMeterYard = sportId && METER_BASED_SPORTS.includes(sportId);

  if (unitSystem === 'imperial') {
    if (useMeterYard) {
      return { min: 0, max: 21872, step: 25 }; // ~20000m in yards
    }
    return { min: 0, max: 311, step: 0.1 }; // ~500km in miles
  }

  if (useMeterYard) {
    return { min: 0, max: 20000, step: 25 };
  }
  return { min: 0, max: 500, step: 0.1 };
}

// ====================
// Formatting Helpers
// ====================

/**
 * Format volume value with unit for display
 */
export function formatVolumeWithUnit(
  volumeInKg: number,
  unitSystem: UnitSystem
): string {
  const unit = getWeightUnit(unitSystem);
  const value = displayWeight(volumeInKg, unitSystem);

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M ${unit}`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k ${unit}`;
  }
  return `${value} ${unit}`;
}

/**
 * Format distance value with unit for display
 */
export function formatDistanceWithUnit(
  meters: number,
  unitSystem: UnitSystem,
  sportId?: string
): string {
  const unit = getDistanceUnit(unitSystem, sportId);
  const value = displayDistance(meters, unitSystem, sportId);
  return `${value} ${unit}`;
}
