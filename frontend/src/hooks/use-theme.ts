// use-theme.ts: returns the TONALI palette that matches the device light/dark setting.

import { useColorScheme } from 'react-native';

import { Colors, type Palette } from '@/constants/theme';

export function useTheme(): Palette {
  return useColorScheme() === 'dark' ? Colors.dark : Colors.light;
}
