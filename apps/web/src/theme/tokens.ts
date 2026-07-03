/**
 * TungaOS Design System — Master Token Export
 */

import { brand, colors, semantic } from './colors';
import { fontFamily, fontWeight, responsiveScale, typography } from './typography';

/** 8-point grid spacing system */
export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
} as const;

export const radius = {
  none: '0',
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px — Tunga default
  xl: '1rem', // 16px
  '2xl': '1.25rem', // 20px
  pill: '9999px',
  circle: '50%',
} as const;

export const shadows = {
  card: '0 1px 3px rgba(0, 31, 63, 0.06), 0 1px 2px rgba(0, 31, 63, 0.04)',
  floating: '0 4px 24px rgba(0, 31, 63, 0.08)',
  dialog: '0 8px 40px rgba(0, 31, 63, 0.16)',
  dropdown: '0 4px 16px rgba(0, 31, 63, 0.12)',
  navigation: '0 2px 8px rgba(0, 31, 63, 0.06)',
  inner: 'inset 0 2px 4px rgba(0, 31, 63, 0.06)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const tokens = {
  brand,
  colors,
  semantic,
  spacing,
  radius,
  shadows,
  breakpoints,
  zIndex,
  transitions,
  fontFamily,
  fontWeight,
  typography,
  responsiveScale,
} as const;

export type DesignTokens = typeof tokens;

export { brand, colors, semantic, fontFamily, fontWeight, typography, responsiveScale };
