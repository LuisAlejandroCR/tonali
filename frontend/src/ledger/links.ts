// links.ts: builds the public URL printed in each batch QR code.
// Uses EXPO_PUBLIC_SITE_URL when set, the current site on web, and an app deep link otherwise.

import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export function batchPath(batchId: string): `/lote/${string}` {
  return `/lote/${encodeURIComponent(batchId)}`;
}

export function publicBatchUrl(batchId: string): string {
  const configured = process.env.EXPO_PUBLIC_SITE_URL;
  if (configured) return `${configured.replace(/\/+$/, '')}${batchPath(batchId)}`;
  if (Platform.OS === 'web' && typeof window !== 'undefined') return `${window.location.origin}${batchPath(batchId)}`;
  return Linking.createURL(batchPath(batchId));
}
