// photo.ts: lets the producer take or pick a delivery photo and fingerprints it on the device (SHA-256).
// The image never leaves the phone; only the hex fingerprint is written to the origin log.

import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';

import { decodeBase64, toHex } from '@/domain/bytes';
import type { Result } from '@/domain/types';

export interface PickedPhoto {
  uri: string;
  hash: string;
}

export type PhotoSource = 'camera' | 'library';

async function readBytes(asset: ImagePicker.ImagePickerAsset): Promise<Uint8Array<ArrayBuffer> | null> {
  if (asset.file) return new Uint8Array(await asset.file.arrayBuffer());
  return asset.base64 ? decodeBase64(asset.base64) : null;
}

export async function pickAndHashPhoto(source: PhotoSource): Promise<Result<PickedPhoto> | null> {
  try {
    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return { ok: false, error: 'Sin permiso para usar la cámara.' };
    }
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: 'images', base64: true, quality: 0.7 };
    const picked =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    if (picked.canceled || picked.assets.length === 0) return null;
    const asset = picked.assets[0];
    const bytes = await readBytes(asset);
    if (!bytes) return { ok: false, error: 'No se pudo leer la foto.' };
    const digest = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, bytes);
    return { ok: true, value: { uri: asset.uri, hash: toHex(digest) } };
  } catch {
    return { ok: false, error: 'No se pudo calcular la huella de la foto en este dispositivo.' };
  }
}
