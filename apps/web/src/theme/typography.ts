/**
 * TungaOS Design System — Typography Tokens
 */

export const fontFamily = {
  heading: 'var(--font-playfair), "Playfair Display", Georgia, serif',
  body: 'var(--font-inter), "Inter", system-ui, sans-serif',
  mono: 'ui-monospace, "Cascadia Code", monospace',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const typography = {
  display: {
    fontSize: '3.75rem',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.heading,
  },
  h1: {
    fontSize: '2.25rem',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.heading,
  },
  h2: {
    fontSize: '1.875rem',
    lineHeight: '1.25',
    letterSpacing: '-0.01em',
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.heading,
  },
  h3: {
    fontSize: '1.5rem',
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.heading,
  },
  h4: {
    fontSize: '1.25rem',
    lineHeight: '1.4',
    letterSpacing: '0',
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.heading,
  },
  h5: {
    fontSize: '1.125rem',
    lineHeight: '1.4',
    letterSpacing: '0',
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.body,
  },
  h6: {
    fontSize: '1rem',
    lineHeight: '1.5',
    letterSpacing: '0.01em',
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.body,
  },
  body: {
    fontSize: '0.875rem',
    lineHeight: '1.6',
    letterSpacing: '0',
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.body,
  },
  bodyLg: {
    fontSize: '1rem',
    lineHeight: '1.6',
    letterSpacing: '0',
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.body,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.body,
  },
  label: {
    fontSize: '0.8125rem',
    lineHeight: '1.4',
    letterSpacing: '0.01em',
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.body,
  },
  button: {
    fontSize: '0.875rem',
    lineHeight: '1',
    letterSpacing: '0.02em',
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.body,
  },
  table: {
    fontSize: '0.8125rem',
    lineHeight: '1.5',
    letterSpacing: '0',
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.body,
  },
  sidebar: {
    fontSize: '0.8125rem',
    lineHeight: '1.4',
    letterSpacing: '0.04em',
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.body,
  },
} as const;

/** Responsive type scale multipliers */
export const responsiveScale = {
  sm: 0.875,
  md: 1,
  lg: 1.125,
  xl: 1.25,
} as const;
