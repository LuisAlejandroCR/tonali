// dates.spec.ts: fixed-input checks for calendar-date validation and Spanish formatting.

import { describe, expect, it } from 'vitest';

import { formatDate, formatShortDate, isValidDate, toLocalDate } from '../../src/domain/dates';

describe('isValidDate', () => {
  it('accepts real calendar days', () => {
    expect(isValidDate('2026-10-08')).toBe(true);
    expect(isValidDate('2028-02-29')).toBe(true);
  });

  it('rejects impossible or malformed days', () => {
    for (const input of ['2026-02-30', '2027-02-29', '2026-13-01', '2026-00-10', '2026-1-5', '08/10/2026', '']) {
      expect(isValidDate(input)).toBe(false);
    }
  });
});

describe('formatDate', () => {
  it('writes the day in Spanish', () => {
    expect(formatDate('2026-09-30')).toBe('30 de septiembre de 2026');
  });
});

describe('formatShortDate', () => {
  it('drops the year only when it is the current one', () => {
    expect(formatShortDate('2026-10-02', 2026)).toBe('2 oct');
    expect(formatShortDate('2025-12-31', 2026)).toBe('31 dic 2025');
  });
});

describe('toLocalDate', () => {
  it('uses the local calendar day', () => {
    expect(toLocalDate(new Date(2026, 9, 8, 23, 59))).toBe('2026-10-08');
  });
});
