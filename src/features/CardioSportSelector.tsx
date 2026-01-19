import { motion } from 'framer-motion';
import { ChevronLeft, Home } from 'lucide-react';
import { Button } from '../components/Button';
import { SportIcon } from '../components/SportIcon';
import { CARDIO_SPORTS } from '../data/cardioSports';

interface CardioSportSelectorProps {
  onSelect: (sportId: string) => void;
  onBack: () => void;
  onGoHome: () => void;
}

export function CardioSportSelector({ onSelect, onBack, onGoHome }: CardioSportSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back">
          <ChevronLeft size={24} />
        </Button>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', flex: 1 }}>
          Select Activity
        </h2>
        <Button variant="ghost" size="icon" onClick={onGoHome} aria-label="Go to home">
          <Home size={24} />
        </Button>
      </div>

      {/* Sport Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
      >
        {CARDIO_SPORTS.map((sport, index) => (
          <motion.button
            key={sport.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(sport.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 8px',
              borderRadius: '16px',
              background: 'rgba(30, 27, 50, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minHeight: '100px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = sport.color;
              e.currentTarget.style.background = `${sport.color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.background = 'rgba(30, 27, 50, 0.8)';
            }}
            aria-label={`Select ${sport.name}`}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: `${sport.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
              }}
            >
              <SportIcon iconName={sport.icon} size={26} color={sport.color} />
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#fff',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {sport.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
