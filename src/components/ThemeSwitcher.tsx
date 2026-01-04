import React, { useState } from 'react';
import { Palette, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { themes, type ThemeName } from '../themes';

export const ThemeSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { themeName, setTheme } = useTheme();

  const themeOptions: ThemeName[] = ['dark-space', 'light-minimal', 'vibrant-sunset', 'soft-pastel'];

  return (
    <>
      {/* Floating Theme Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-[100] w-12 h-12 rounded-full glass-panel flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Palette size={20} style={{ color: 'var(--color-primary)' }} />
      </motion.button>

      {/* Theme Selection Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[101]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-20 right-4 z-[102] w-80 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center gap-2">
                  <Palette size={20} style={{ color: 'var(--color-primary)' }} />
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-main)' }}>
                    Choose Theme
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
                >
                  <X size={18} style={{ color: 'var(--color-text-secondary)' }} />
                </button>
              </div>

              {/* Theme Options */}
              <div className="p-3 space-y-2">
                {themeOptions.map((name) => {
                  const theme = themes[name];
                  const isActive = themeName === name;

                  return (
                    <motion.button
                      key={name}
                      onClick={() => {
                        setTheme(name);
                        setIsOpen(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3 rounded-xl text-left transition-all relative overflow-hidden"
                      style={{
                        backgroundColor: isActive ? 'var(--color-primary-glow)' : 'transparent',
                        border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      }}
                    >
                      {/* Preview Color Bar */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex gap-1">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: theme.colors.accent }}
                          />
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: theme.colors.bgApp }}
                          />
                        </div>
                        {isActive && (
                          <span
                            className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: 'var(--color-primary)',
                              color: '#fff',
                            }}
                          >
                            Active
                          </span>
                        )}
                      </div>

                      {/* Theme Info */}
                      <div>
                        <div
                          className="font-semibold text-sm mb-0.5"
                          style={{ color: 'var(--color-text-main)' }}
                        >
                          {theme.displayName}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {theme.description}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer Tip */}
              <div
                className="p-3 border-t text-xs text-center"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                Your theme preference is saved locally
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
