// quantity.spec.ts: fixed-input checks for kilogram and bar-count parsing and formatting.

import { describe, expect, it } from 'vitest';

import { formatKilograms, parseKilograms, parseUnits } from '../../src/domain/quantity';

describe('parseKilograms', () => {
  it('reads whole and decimal kilograms as integer grams', () => {
    expect(parseKilograms('25')).toEqual({ ok: true, value: 25_000 });
    expect(parseKilograms('18.5')).toEqual({ ok: true, value: 18_500 });
    expect(parseKilograms(' 0.125 ')).toEqual({ ok: true, value: 125 });
  });

  it('accepts a decimal comma', () => {
    expect(parseKilograms('18,5')).toEqual({ ok: true, value: 18_500 });
  });

  it('rejects zero, negatives, text and too many decimals', () => {
    for (const input of ['0', '0.000', '-3', 'diez', '', '1.2345', '1e3', '10001']) {
      expect(parseKilograms(input).ok).toBe(false);
    }
  });
});

describe('formatKilograms', () => {
  it('drops trailing zeros', () => {
    expect(formatKilograms(25_000)).toBe('25 kg');
    expect(formatKilograms(18_500)).toBe('18.5 kg');
    expect(formatKilograms(125)).toBe('0.125 kg');
  });
});

describe('parseUnits', () => {
  it('reads positive integers only', () => {
    expect(parseUnits('100')).toEqual({ ok: true, value: 100 });
    for (const input of ['0', '-1', '1.5', 'cien', '', '1000000']) {
      expect(parseUnits(input).ok).toBe(false);
    }
  });
});
