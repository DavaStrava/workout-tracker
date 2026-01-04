import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../useTheme';
import { themes } from '../../themes';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Clear any existing CSS variables
    document.documentElement.style.cssText = '';
    document.body.style.backgroundImage = '';
  });

  it('should throw error when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within ThemeProvider');
  });

  it('should provide default theme (vibrant-sunset)', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.themeName).toBe('vibrant-sunset');
    expect(result.current.currentTheme).toEqual(themes['vibrant-sunset']);
  });

  it('should load theme from localStorage', () => {
    localStorageMock.setItem('workout-tracker-theme', 'light-minimal');

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.themeName).toBe('light-minimal');
  });

  it('should update theme and persist to localStorage', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme('dark-space');
    });

    expect(result.current.themeName).toBe('dark-space');
    expect(localStorageMock.getItem('workout-tracker-theme')).toBe('dark-space');
  });

  it('should cycle through themes', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    // Start with vibrant-sunset
    expect(result.current.themeName).toBe('vibrant-sunset');

    // Cycle to next (soft-pastel)
    act(() => {
      result.current.cycleTheme();
    });
    expect(result.current.themeName).toBe('soft-pastel');

    // Cycle to next (dark-space)
    act(() => {
      result.current.cycleTheme();
    });
    expect(result.current.themeName).toBe('dark-space');

    // Cycle to next (light-minimal)
    act(() => {
      result.current.cycleTheme();
    });
    expect(result.current.themeName).toBe('light-minimal');

    // Cycle back to vibrant-sunset
    act(() => {
      result.current.cycleTheme();
    });
    expect(result.current.themeName).toBe('vibrant-sunset');
  });

  it('should apply CSS variables to document root', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    const root = document.documentElement;
    const theme = themes['vibrant-sunset'];

    expect(root.style.getPropertyValue('--color-bg-app')).toBe(theme.colors.bgApp);
    expect(root.style.getPropertyValue('--color-primary')).toBe(theme.colors.primary);
    expect(root.style.getPropertyValue('--color-text-main')).toBe(theme.colors.textMain);
    expect(root.style.getPropertyValue('--glass-blur')).toBe(theme.effects.glassBlur);
  });

  it('should update CSS variables when theme changes', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme('light-minimal');
    });

    const root = document.documentElement;
    const theme = themes['light-minimal'];

    expect(root.style.getPropertyValue('--color-bg-app')).toBe(theme.colors.bgApp);
    expect(root.style.getPropertyValue('--color-primary')).toBe(theme.colors.primary);
  });

  it('should apply background gradient to body', () => {
    renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    const theme = themes['vibrant-sunset'];
    expect(document.body.style.backgroundImage).toContain('radial-gradient');
  });
});
