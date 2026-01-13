import React from 'react';
import type { Equipment } from '../../types';

interface EquipmentBadgeProps {
  equipment: Equipment;
  size?: number;
}

// Small monochrome icons for equipment badges (16-20px)
export const EquipmentBadge: React.FC<EquipmentBadgeProps> = ({ equipment, size = 14 }) => {
  const icons: Record<Equipment, React.ReactNode> = {
    barbell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="1" y="9" width="4" height="6" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="19" y="9" width="4" height="6" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="5" y="11" width="14" height="2" rx="0.5" fill="currentColor" />
      </svg>
    ),
    dumbbell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="8" width="4" height="8" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="18" y="8" width="4" height="8" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="6" y="10" width="12" height="4" rx="1" fill="currentColor" />
      </svg>
    ),
    cable: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="12" y1="10" x2="12" y2="22" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="18" width="8" height="4" rx="1" fill="currentColor" opacity="0.8" />
      </svg>
    ),
    machine: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="7" y="7" width="10" height="6" rx="1" fill="currentColor" opacity="0.6" />
        <circle cx="12" cy="17" r="2" fill="currentColor" />
      </svg>
    ),
    bodyweight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="5" r="3" fill="currentColor" />
        <line x1="12" y1="8" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="10" x2="6" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="10" x2="18" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="15" x2="8" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="15" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    kettlebell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 6 Q8 2 12 2 Q16 2 16 6" stroke="currentColor" strokeWidth="2" fill="none" />
        <ellipse cx="12" cy="15" rx="7" ry="7" fill="currentColor" opacity="0.8" />
        <ellipse cx="12" cy="14" rx="3" ry="2" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    resistance_band: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 12 Q8 6 12 12 Q16 18 20 12" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="4" cy="12" r="2" fill="currentColor" />
        <circle cx="20" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
    ez_bar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="1" y="9" width="4" height="6" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="19" y="9" width="4" height="6" rx="1" fill="currentColor" opacity="0.8" />
        <path d="M5 12 L8 10 L12 12 L16 10 L19 12" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  };

  return <>{icons[equipment]}</>;
};

// Equipment label text
export const equipmentLabels: Record<Equipment, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  cable: 'Cable',
  machine: 'Machine',
  bodyweight: 'Bodyweight',
  kettlebell: 'Kettlebell',
  resistance_band: 'Band',
  ez_bar: 'EZ Bar',
};
