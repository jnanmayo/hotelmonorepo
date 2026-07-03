/**
 * TungaOS Design System — Color Tokens
 * Luxury Navy + Gold palette with full shade scales (50–900)
 */

export const brand = {
  name: 'TungaOS',
  vendor: 'Sharada Sama Solutions',
  logo: '/brand/tunga-logo.svg',
  logoMark: '/brand/tunga-logo.svg',
} as const;

/** Generate HSL-based shade map from base hex */
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

type ShadeScale = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;

function buildShades(baseHex: string, hue: number): ShadeScale {
  const lightnessMap: Record<number, number> = {
    50: 97,
    100: 94,
    200: 86,
    300: 74,
    400: 62,
    500: 50,
    600: 42,
    700: 34,
    800: 26,
    900: 18,
  };
  const [, sat] = hexToHsl(baseHex);
  const result = {} as ShadeScale;
  for (const [shade, light] of Object.entries(lightnessMap)) {
    const s = Number(shade) <= 300 ? Math.max(sat - 20, 10) : sat;
    result[Number(shade) as keyof ShadeScale] = `hsl(${hue} ${s}% ${light}%)`;
  }
  result[500] = baseHex.startsWith('#') ? baseHex : baseHex;
  return result;
}

export const colors = {
  primary: buildShades('#001F3F', 210),
  secondary: buildShades('#C9A227', 45),
  success: buildShades('#16A34A', 142),
  warning: buildShades('#EA580C', 25),
  danger: buildShades('#DC2626', 0),
  info: buildShades('#0EA5E9', 199),
  neutral: buildShades('#64748B', 215),
} as const;

export const semantic = {
  background: '#FFFFFF',
  backgroundMuted: '#F8FAFC',
  sidebar: '#001F3F',
  sidebarForeground: '#F8FAFC',
  sidebarActive: '#C9A227',
  card: '#FFFFFF',
  border: '#E2E8F0',
  borderHover: '#CBD5E1',
  disabled: '#94A3B8',
  focus: '#C9A227',
  text: {
    primary: '#001F3F',
    secondary: '#475569',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },
} as const;

export type ColorScale = keyof typeof colors;
