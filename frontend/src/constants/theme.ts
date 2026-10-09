// theme.ts: TONALI color tokens for light and dark mode, spacing scale and content width.
// Cacao browns and amaranth red, with status colors that keep contrast in both modes.

export const Colors = {
  light: {
    background: '#FBF6EE',
    surface: '#FFFFFF',
    surfaceMuted: '#F3EADF',
    border: '#E4D6C5',
    text: '#2B1A12',
    textMuted: '#6E5A4E',
    primary: '#8C1D40',
    onPrimary: '#FFFFFF',
    primarySoft: '#F6E3EA',
    success: '#2F6B3B',
    successSoft: '#E3F0E5',
    warning: '#7A4F00',
    warningSoft: '#FBEFD5',
    danger: '#A12C2C',
    dangerSoft: '#F8E1E1',
  },
  dark: {
    background: '#17110E',
    surface: '#221915',
    surfaceMuted: '#2C211B',
    border: '#3E2F27',
    text: '#F6EDE4',
    textMuted: '#BFAEA2',
    primary: '#E58AA6',
    onPrimary: '#2B0A16',
    primarySoft: '#3A1A26',
    success: '#8FD19E',
    successSoft: '#1C2E20',
    warning: '#F0C36B',
    warningSoft: '#33280F',
    danger: '#F19A9A',
    dangerSoft: '#3A1A1A',
  },
} as const;

export type Palette = { [K in keyof typeof Colors.light]: string };

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 14,
  pill: 999,
} as const;

export const MaxContentWidth = 560;
