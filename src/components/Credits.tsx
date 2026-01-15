import React, { useState, useEffect } from 'react';
import { Info, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IconCredit {
  icon: string;
  creator: string;
  url: string;
}

const iconCredits: IconCredit[] = [
  { icon: 'Chest', creator: 'Andre Buand', url: 'https://thenounproject.com/icon/7994440/' },
  { icon: 'Biceps', creator: 'Andre Buand', url: 'https://thenounproject.com/icon/7994436/' },
  { icon: 'Lats', creator: 'Kmg Design', url: 'https://thenounproject.com/icon/7977964/' },
  { icon: 'Shoulders', creator: 'Symbolon', url: 'https://thenounproject.com/icon/3826963/' },
  { icon: 'Triceps', creator: 'Hafiz Nur Lutfianto', url: 'https://thenounproject.com/icon/7874542/' },
  { icon: 'Hamstrings', creator: 'Hafiz Nur Lutfianto', url: 'https://thenounproject.com/icon/7874535/' },
  { icon: 'Quads', creator: 'Rafiico Creative Studio', url: 'https://thenounproject.com/icon/4050080/' },
  { icon: 'Calves', creator: 'Hafiz Nur Lutfianto', url: 'https://thenounproject.com/icon/7874531/' },
  { icon: 'Glutes', creator: 'Hafiz Nur Lutfianto', url: 'https://thenounproject.com/icon/7874533/' },
  { icon: 'Forearms', creator: 'Hafiz Nur Lutfianto', url: 'https://thenounproject.com/icon/7874536/' },
  { icon: 'Abs', creator: 'Riyan Resdian', url: 'https://thenounproject.com/' },
  { icon: 'Obliques', creator: 'IconsHome', url: 'https://thenounproject.com/icon/8138114/' },
  { icon: 'Lower Back', creator: 'HideMaru', url: 'https://thenounproject.com/icon/8242925/' },
  { icon: 'Traps', creator: 'SAM Designs', url: 'https://thenounproject.com/' },
  { icon: 'Upper Back', creator: 'Maxicons', url: 'https://thenounproject.com/' },
];

export const Credits: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="View credits"
        className="credits-trigger"
      >
        <Info size={18} />
      </button>
      <style>{`
        .credits-trigger {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        .credits-trigger:hover,
        .credits-trigger:active {
          color: rgba(255, 255, 255, 0.8);
        }
        .credits-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .credits-item:hover,
        .credits-item:active {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                zIndex: 100,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '400px',
                maxHeight: '80vh',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #2d2640 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                zIndex: 101,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', margin: 0 }}>Credits</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close credits"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ overflowY: 'auto', flex: 1 }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '16px' }}>
                  Muscle icons from{' '}
                  <a
                    href="https://thenounproject.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#f97316', textDecoration: 'none' }}
                  >
                    The Noun Project
                  </a>
                  {' '}under{' '}
                  <a
                    href="https://creativecommons.org/licenses/by/3.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#f97316', textDecoration: 'none' }}
                  >
                    CC BY 3.0
                  </a>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {iconCredits.map((credit) => (
                    <a
                      key={credit.icon}
                      href={credit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="credits-item"
                    >
                      <span style={{ color: 'white', fontSize: '13px' }}>{credit.icon}</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {credit.creator}
                        <ExternalLink size={12} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
