import React from 'react';
import { usePreferences } from '../hooks/usePreferences';

export const UnitToggle: React.FC = () => {
  const { unitSystem, setUnitSystem } = usePreferences();

  const handleToggle = () => {
    setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric');
  };

  const displayText = unitSystem === 'metric' ? 'kg / km' : 'lbs / mi';

  return (
    <button
      onClick={handleToggle}
      aria-label={`Current units: ${displayText}. Click to switch to ${unitSystem === 'metric' ? 'imperial' : 'metric'} units.`}
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        zIndex: 40,
        padding: '10px 16px',
        borderRadius: '24px',
        background: 'rgba(30, 27, 50, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {displayText}
    </button>
  );
};
