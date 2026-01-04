import React, { createContext, useContext, useEffect, useState } from 'react';
import { themes, type ThemeName, type Theme } from '../themes';

interface ThemeContextType {
  currentTheme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('workout-tracker-theme');
    return (saved as ThemeName) || 'vibrant-sunset';
  });

  const currentTheme = themes[themeName];

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
    localStorage.setItem('workout-tracker-theme', name);
  };

  const cycleTheme = () => {
    const themeNames: ThemeName[] = ['dark-space', 'light-minimal', 'vibrant-sunset', 'soft-pastel'];
    const currentIndex = themeNames.indexOf(themeName);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    setTheme(themeNames[nextIndex]);
  };

  // Apply CSS variables to document root
  useEffect(() => {
    const root = document.documentElement;

    // Apply colors
    root.style.setProperty('--color-bg-app', currentTheme.colors.bgApp);
    root.style.setProperty('--color-bg-subtle', currentTheme.colors.bgSubtle);
    root.style.setProperty('--color-bg-card', currentTheme.colors.bgCard);
    root.style.setProperty('--color-bg-elevated', currentTheme.colors.bgElevated);

    root.style.setProperty('--color-primary', currentTheme.colors.primary);
    root.style.setProperty('--color-primary-glow', currentTheme.colors.primaryGlow);
    root.style.setProperty('--color-accent', currentTheme.colors.accent);
    root.style.setProperty('--color-accent-glow', currentTheme.colors.accentGlow);
    root.style.setProperty('--color-danger', currentTheme.colors.danger);
    root.style.setProperty('--color-warn', currentTheme.colors.warn);

    root.style.setProperty('--color-text-main', currentTheme.colors.textMain);
    root.style.setProperty('--color-text-secondary', currentTheme.colors.textSecondary);
    root.style.setProperty('--color-text-muted', currentTheme.colors.textMuted);

    root.style.setProperty('--color-border', currentTheme.colors.border);
    root.style.setProperty('--color-border-hover', currentTheme.colors.borderHover);

    // Apply effects
    root.style.setProperty('--glass-blur', currentTheme.effects.glassBlur);
    root.style.setProperty('--glass-shadow', currentTheme.effects.shadowStyle);

    // Apply background gradient to body
    document.body.style.backgroundImage = currentTheme.effects.backgroundGradient;
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, themeName, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
