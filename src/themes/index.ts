export type ThemeName = 'dark-space' | 'light-minimal' | 'vibrant-sunset' | 'soft-pastel';

export interface Theme {
  name: ThemeName;
  displayName: string;
  description: string;
  colors: {
    // Backgrounds
    bgApp: string;
    bgSubtle: string;
    bgCard: string;
    bgElevated: string;

    // Brand
    primary: string;
    primaryGlow: string;
    accent: string;
    accentGlow: string;
    danger: string;
    warn: string;

    // Text
    textMain: string;
    textSecondary: string;
    textMuted: string;

    // Borders
    border: string;
    borderHover: string;
  };
  effects: {
    glassBlur: string;
    backgroundGradient: string;
    shadowStyle: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  'dark-space': {
    name: 'dark-space',
    displayName: 'Dark Space',
    description: 'Current - Premium dark with glass morphism',
    colors: {
      bgApp: '#09090b',
      bgSubtle: '#18181b',
      bgCard: 'rgba(24, 24, 27, 0.6)',
      bgElevated: 'rgba(39, 39, 42, 0.6)',
      primary: '#3b82f6',
      primaryGlow: 'rgba(59, 130, 246, 0.4)',
      accent: '#10b981',
      accentGlow: 'rgba(16, 185, 129, 0.4)',
      danger: '#ef4444',
      warn: '#f59e0b',
      textMain: '#fafafa',
      textSecondary: '#a1a1aa',
      textMuted: '#52525b',
      border: 'rgba(255, 255, 255, 0.08)',
      borderHover: 'rgba(255, 255, 255, 0.15)',
    },
    effects: {
      glassBlur: '16px',
      backgroundGradient: `
        radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 40%),
        radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1), transparent 30%)
      `,
      shadowStyle: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },

  'light-minimal': {
    name: 'light-minimal',
    displayName: 'Clean Minimal',
    description: 'Apple Health inspired - Crisp and professional',
    colors: {
      bgApp: '#fafafa',
      bgSubtle: '#f5f5f5',
      bgCard: '#ffffff',
      bgElevated: '#ffffff',
      primary: '#0066ff',
      primaryGlow: 'rgba(0, 102, 255, 0.15)',
      accent: '#10b981',
      accentGlow: 'rgba(16, 185, 129, 0.15)',
      danger: '#ef4444',
      warn: '#f59e0b',
      textMain: '#1a1a1a',
      textSecondary: '#6b6b6b',
      textMuted: '#a3a3a3',
      border: 'rgba(0, 0, 0, 0.08)',
      borderHover: 'rgba(0, 0, 0, 0.15)',
    },
    effects: {
      glassBlur: '0px',
      backgroundGradient: 'none',
      shadowStyle: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    },
  },

  'vibrant-sunset': {
    name: 'vibrant-sunset',
    displayName: 'Vibrant Sunset',
    description: 'Spotify inspired - Bold and energetic',
    colors: {
      bgApp: '#1a1625',
      bgSubtle: '#2d2640',
      bgCard: '#2d2640',
      bgElevated: '#3d3452',
      primary: '#f97316',
      primaryGlow: 'rgba(249, 115, 22, 0.4)',
      accent: '#ec4899',
      accentGlow: 'rgba(236, 72, 153, 0.4)',
      danger: '#ef4444',
      warn: '#fbbf24',
      textMain: '#ffffff',
      textSecondary: '#d1d5db',
      textMuted: '#9ca3af',
      border: 'rgba(236, 72, 153, 0.2)',
      borderHover: 'rgba(236, 72, 153, 0.4)',
    },
    effects: {
      glassBlur: '12px',
      backgroundGradient: `
        radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.15), transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.15), transparent 50%)
      `,
      shadowStyle: '0 8px 16px -4px rgba(236, 72, 153, 0.3)',
    },
  },

  'soft-pastel': {
    name: 'soft-pastel',
    displayName: 'Soft Pastel',
    description: 'Calm app inspired - Gentle and sophisticated',
    colors: {
      bgApp: '#e8eef5',
      bgSubtle: '#dce4ed',
      bgCard: '#f0f4f9',
      bgElevated: '#ffffff',
      primary: '#667eea',
      primaryGlow: 'rgba(102, 126, 234, 0.3)',
      accent: '#48bb78',
      accentGlow: 'rgba(72, 187, 120, 0.3)',
      danger: '#fc8181',
      warn: '#ed8936',
      textMain: '#2d3748',
      textSecondary: '#718096',
      textMuted: '#a0aec0',
      border: 'rgba(160, 174, 192, 0.3)',
      borderHover: 'rgba(160, 174, 192, 0.5)',
    },
    effects: {
      glassBlur: '8px',
      backgroundGradient: `
        radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.08), transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(72, 187, 120, 0.08), transparent 50%)
      `,
      shadowStyle: '6px 6px 12px rgba(163, 177, 198, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.5)',
    },
  },
};
