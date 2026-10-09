// bytes.spec.ts: fixed-input checks for base64 decoding and hash helpers.

import { describe, expect, it } from 'vitest';

import { decodeBase64, isSha256Hex, shortHash, toHex } from '../../src/domain/bytes';

describe('decodeBase64', () => {
  it('decodes padded and unpadded blocks', () => {
    expect([...(decodeBase64('TWFu') ?? [])]).toEqual([77, 97, 110]);
    expect([...(decodeBase64('TWE=') ?? [])]).toEqual([77, 97]);
    expect([...(decodeBase64('TQ==') ?? [])]).toEqual([77]);
  });

  it('rejects malformed input', () => {
    for (const input of ['TWF', 'T@==', '====', 'A===', 'TQ=A']) {
      expect(decodeBase64(input)).toBeNull();
    }
  });
});

describe('hash helpers', () => {
  it('formats and validates SHA-256 hex', () => {
    const hex = toHex(new Uint8Array(32).fill(171).buffer);
    expect(hex).toBe('ab'.repeat(32));
    expect(isSha256Hex(hex)).toBe(true);
    expect(isSha256Hex('AB'.repeat(32))).toBe(false);
    expect(shortHash(hex)).toBe('abababab…abababab');
  });
});
