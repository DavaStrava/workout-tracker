import {
  Clock,
  Ruler,
  Heart,
  Flame,
  Mountain,
  Activity,
  Waves,
  Zap,
} from 'lucide-react';
import { Input } from './Input';
import type { CardioFieldConfig, SwimmingStrokeType } from '../types';

const fieldIcons: Record<string, React.ReactNode> = {
  distance: <Ruler size={20} />,
  duration: <Clock size={20} />,
  pace: <Activity size={20} />,
  speed: <Activity size={20} />,
  heartRate: <Heart size={20} />,
  calories: <Flame size={20} />,
  elevation: <Mountain size={20} />,
  cadence: <Zap size={20} />,
  laps: <Waves size={20} />,
  strokeType: <Waves size={20} />,
  strokeRate: <Activity size={20} />,
  strokes: <Activity size={20} />,
};

const fieldColors: Record<string, { bg: string; icon: string }> = {
  distance: { bg: 'rgba(59, 130, 246, 0.2)', icon: '#60a5fa' },
  duration: { bg: 'rgba(236, 72, 153, 0.2)', icon: '#f472b6' },
  pace: { bg: 'rgba(34, 197, 94, 0.2)', icon: '#22c55e' },
  speed: { bg: 'rgba(249, 115, 22, 0.2)', icon: '#fb923c' },
  heartRate: { bg: 'rgba(239, 68, 68, 0.2)', icon: '#ef4444' },
  calories: { bg: 'rgba(245, 158, 11, 0.2)', icon: '#f59e0b' },
  elevation: { bg: 'rgba(132, 204, 22, 0.2)', icon: '#84cc16' },
  cadence: { bg: 'rgba(168, 85, 247, 0.2)', icon: '#a855f7' },
  laps: { bg: 'rgba(6, 182, 212, 0.2)', icon: '#06b6d4' },
  strokeType: { bg: 'rgba(59, 130, 246, 0.2)', icon: '#3b82f6' },
  strokeRate: { bg: 'rgba(139, 92, 246, 0.2)', icon: '#8b5cf6' },
  strokes: { bg: 'rgba(20, 184, 166, 0.2)', icon: '#14b8a6' },
};

interface CardioFieldInputProps {
  field: CardioFieldConfig;
  value: number | string | undefined;
  computedValue?: string;
  onChange: (value: number | string) => void;
  disabled?: boolean;
}

export function CardioFieldInput({
  field,
  value,
  computedValue,
  onChange,
  disabled = false,
}: CardioFieldInputProps) {
  const colors = fieldColors[field.type] || { bg: 'rgba(255, 255, 255, 0.1)', icon: '#fff' };
  const icon = fieldIcons[field.type];

  // Stroke type dropdown
  if (field.type === 'strokeType') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: colors.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.icon,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <label
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {field.label}
          </label>
          <select
            value={(value as SwimmingStrokeType) || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            style={{
              width: '100%',
              marginTop: '4px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(30, 27, 50, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
            }}
          >
            <option value="">Select stroke</option>
            <option value="freestyle">Freestyle</option>
            <option value="backstroke">Backstroke</option>
            <option value="breaststroke">Breaststroke</option>
            <option value="butterfly">Butterfly</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>
    );
  }

  // Computed fields (read-only display)
  if (field.isComputed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: colors.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.icon,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <label
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {field.label}
          </label>
          <div
            style={{
              marginTop: '4px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              color: computedValue && computedValue !== '--' ? '#fff' : 'rgba(255, 255, 255, 0.4)',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {computedValue || '--'} {field.unit}
          </div>
        </div>
      </div>
    );
  }

  // Regular numeric input
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.icon,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <Input
          type="number"
          label={`${field.label}${field.unit ? ` (${field.unit})` : ''}`}
          placeholder={field.placeholder}
          value={value as number || ''}
          min={field.min}
          max={field.max}
          step={field.step || 1}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}
