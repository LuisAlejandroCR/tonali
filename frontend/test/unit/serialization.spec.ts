// serialization.spec.ts: fixed-input checks for reading the stored log back.

import { describe, expect, it } from 'vitest';

import { buildDemoLog } from '../../src/domain/demo-data';
import { parseStoredEvents, serializeEvents } from '../../src/domain/serialization';

describe('parseStoredEvents', () => {
  it('round-trips a valid log', () => {
    const events = buildDemoLog();
    expect(parseStoredEvents(serializeEvents(events))).toEqual(events);
  });

  it('rejects broken JSON and wrong shapes', () => {
    for (const raw of ['', '{', 'null', '{}', '[1]', '[{"kind":"delivery_registered"}]']) {
      expect(parseStoredEvents(raw)).toBeNull();
    }
  });

  it('rejects a log that breaks a rule, such as a batch with an unconfirmed delivery', () => {
    const events = buildDemoLog();
    const tampered = events.filter((event) => !(event.kind === 'delivery_confirmed' && event.deliveryId === 'E-0001'));
    const renumbered = tampered.map((event, index) => ({ ...event, seq: index + 1 }));
    expect(parseStoredEvents(JSON.stringify(renumbered))).toBeNull();
  });
});
