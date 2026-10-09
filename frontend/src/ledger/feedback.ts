// feedback.ts: confirms a saved action to the user; announces it to screen readers and, if enabled, taps lightly.
// Haptics are optional, native-only and never fire for rejections or for opening a public batch page.

import * as Haptics from 'expo-haptics';
import { AccessibilityInfo, Platform } from 'react-native';

export type FeedbackKind = 'saved' | 'neutral';

export function confirmToUser(message: string, kind: FeedbackKind, hapticsEnabled: boolean): void {
  AccessibilityInfo.announceForAccessibility(message);
  if (!hapticsEnabled || kind !== 'saved' || Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
}
