// bytes.ts: base64 decoding and hex helpers used to fingerprint photos on the device.
// Pure TypeScript so it behaves the same on Hermes, the browser and Node tests.

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const LOOKUP = new Map([...ALPHABET].map((char, index) => [char, index]));
const SHA256_HEX = /^[0-9a-f]{64}$/;

export function decodeBase64(input: string): Uint8Array<ArrayBuffer> | null {
  const clean = input.replace(/\s+/g, '');
  if (clean.length % 4 !== 0) return null;
  const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  const body = clean.slice(0, clean.length - padding);
  const bytes = new Uint8Array((clean.length / 4) * 3 - padding);
  let buffer = 0;
  let bits = 0;
  let offset = 0;
  for (const char of body) {
    const value = LOOKUP.get(char);
    if (value === undefined) return null;
    buffer = ((buffer << 6) | value) & 0xffffff;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes[offset++] = (buffer >> bits) & 0xff;
    }
  }
  return offset === bytes.length ? bytes : null;
}

export function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function isSha256Hex(value: string): boolean {
  return SHA256_HEX.test(value);
}

export function shortHash(hash: string): string {
  return hash.length > 16 ? `${hash.slice(0, 8)}…${hash.slice(-8)}` : hash;
}
