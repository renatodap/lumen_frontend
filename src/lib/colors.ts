/**
 * LUMEN Design System Color Palette
 * @module lib/colors
 */

/**
 * Primary color palette - Petroleum Blue
 */
export const petroleum = {
  50: '#E8EAED',
  100: '#C5CAD3',
  200: '#9FA7B5',
  300: '#788497',
  400: '#5A6980',
  500: '#3C4F69',
  600: '#344861',
  700: '#2A3F56',
  800: '#21364C',
  900: '#0A0E1A', // Background
} as const;

/**
 * Accent color palette - Golden
 */
export const golden = {
  50: '#FEFDFB',
  100: '#FCF9F3',
  200: '#F9F3E7',
  300: '#F5E6D3', // Primary accent
  400: '#F0D9BF',
  500: '#EBCCAB',
  600: '#E6BF97',
  700: '#E1B283',
  800: '#DCA56F',
  900: '#D7985B',
} as const;

/**
 * Semantic color palette
 */
export const semantic = {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

/**
 * Neutral color palette
 */
export const neutral = {
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

/**
 * Get color with opacity
 * @param color - Hex color code
 * @param opacity - Opacity value (0-1)
 * @returns RGBA color string
 */
export function withOpacity(color: string, opacity: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * LUMEN theme configuration
 */
export const theme = {
  colors: {
    background: petroleum[900],
    foreground: golden[300],
    primary: petroleum[600],
    secondary: golden[300],
    accent: golden[400],
    muted: petroleum[700],
    border: petroleum[600],
    input: petroleum[800],
    ring: golden[300],
    success: semantic.success,
    error: semantic.error,
    warning: semantic.warning,
    info: semantic.info,
  },
} as const;

export type ThemeColor = keyof typeof theme.colors;
