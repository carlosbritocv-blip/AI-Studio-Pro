// constants/theme.ts
export const COLORS = {
  background: '#0a0a0f',
  surface: '#13131a',
  surfaceLight: '#1e1e2e',
  primary: '#7c3aed',
  primaryLight: '#a855f7',
  primaryGlow: '#7c3aed40',
  accent: '#06b6d4',
  accentGlow: '#06b6d440',
  gold: '#f59e0b',
  success: '#10b981',
  error: '#ef4444',
  text: '#ffffff',
  textSecondary: '#9ca3af',
  textMuted: '#4b5563',
  border: '#1f2937',
  borderLight: '#374151',
  gradient1: '#7c3aed',
  gradient2: '#a855f7',
  gradient3: '#06b6d4',
};

export const FONTS = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const API_CONFIG = {
  OPENAI_BASE_URL: 'https://api.openai.com/v1',
  STABILITY_BASE_URL: 'https://api.stability.ai/v1',
  RUNWAY_BASE_URL: 'https://api.runwayml.com/v1',
};
