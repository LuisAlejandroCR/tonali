// input.fuzz.spec.ts: arbitrary and malformed input for everything that parses text from outside the code.
// Typed amounts, base64 photo data and the stored log must never throw and never yield out-of-range values.

import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { decodeBase64 } from '../../src/domain/bytes';
import { buildDemoLog } from '../../src/domain/demo-data';
import { formatKilograms, parseKilograms, parseUnits } from '../../src/domain/quantity';
import { parseStoredEvents, serializeEvents } from '../../src/domain/serialization';

describe('parseKilograms with arbitrary text', () => {
  it('never throws and only returns positive integer grams within range', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const result = parseKilograms(input);
        if (result.ok) {
          expect(Number.isInteger(result.value)).toBe(true);
          expect(result.value).toBeGreaterThan(0);
          expect(result.value).toBeLessThanOrEqual(10_000_000);
        }
      }),
    );
  });

  it('round-trips every valid gram amount through its formatted text', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10_000_000 }), (grams) => {
        expect(parseKilograms(formatKilograms(grams).replace(' kg', ''))).toEqual({ ok: true, value: grams });
      }),
    );
  });
});

describe('parseUnits with arbitrary text', () => {
  it('never throws and only returns positive integers', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const result = parseUnits(input);
        if (result.ok) expect(Number.isInteger(result.value) && result.value > 0).toBe(true);
      }),
    );
  });
});

describe('decodeBase64 with arbitrary input', () => {
  it('matches the reference decoder for every byte array', () => {
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 512 }), (bytes) => {
        const encoded = btoa(String.fromCharCode(...bytes));
        expect([...(decodeBase64(encoded) ?? [-1])]).toEqual([...bytes]);
      }),
    );
  });

  it('never throws on arbitrary strings', () => {
    fc.assert(fc.property(fc.string(), (input) => void decodeBase64(input)));
  });
});

describe('parseStoredEvents with corrupted storage', () => {
  it('never throws on arbitrary text', () => {
    fc.assert(fc.property(fc.string(), (raw) => void parseStoredEvents(raw)));
  });

  it('never throws on arbitrary JSON values', () => {
    fc.assert(fc.property(fc.json(), (raw) => void parseStoredEvents(raw)));
  });

  it('rejects or safely accepts the demo log with one field mutated', () => {
    const events = buildDemoLog();
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: events.length - 1 }),
        fc.constantFrom('seq', 'kind', 'grams', 'deliveryId', 'deliveredOn', 'units', 'deliveryIds', 'signature'),
        fc.jsonValue(),
        (index, field, value) => {
          const mutated = events.map((event, position) => (position === index ? { ...event, [field]: value } : event));
          const parsed = parseStoredEvents(serializeEvents(mutated as typeof events));
          if (parsed !== null) expect(parsed).toHaveLength(events.length);
        },
      ),
    );
  });
});
