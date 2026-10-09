// ledger.invariant.spec.ts: properties that hold for every sequence of user actions on the origin log.
// Append-only history, batches only over confirmed deliveries, and reviews that never go back to pending.

import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { buildDemoLog } from '../../src/domain/demo-data';
import {
  appendEvent,
  confirmDelivery,
  createBatch,
  deriveState,
  registerDelivery,
  rejectDelivery,
  verifyLog,
} from '../../src/domain/ledger';
import type { LedgerEvent, Result } from '../../src/domain/types';

const clock = { now: '2026-10-08T10:00:00.000-06:00', today: '2026-10-08' };
const actorIds = ['P-01', 'P-02', 'P-03', 'A-01', 'M-01', 'X-99'];
const dates = ['2026-09-01', '2026-09-30', '2026-10-08', '2026-10-09', '2026-02-30'];

const deliveryRef = fc.integer({ min: 1, max: 12 }).map((n) => `E-${String(n).padStart(4, '0')}`);

const action = fc.oneof(
  fc.record({
    type: fc.constant('register' as const),
    actor: fc.constantFrom(...actorIds),
    grams: fc.integer({ min: -5, max: 50_000 }),
    date: fc.constantFrom(...dates),
  }),
  fc.record({ type: fc.constant('confirm' as const), actor: fc.constantFrom(...actorIds), delivery: deliveryRef }),
  fc.record({
    type: fc.constant('reject' as const),
    actor: fc.constantFrom(...actorIds),
    delivery: deliveryRef,
    reason: fc.string({ maxLength: 220 }),
  }),
  fc.record({
    type: fc.constant('batch' as const),
    actor: fc.constantFrom(...actorIds),
    deliveries: fc.array(deliveryRef, { maxLength: 4 }),
    date: fc.constantFrom(...dates),
    units: fc.integer({ min: -1, max: 200 }),
  }),
);

type Action = typeof action extends fc.Arbitrary<infer T> ? T : never;

function run(events: readonly LedgerEvent[], step: Action): Result<LedgerEvent> {
  switch (step.type) {
    case 'register':
      return registerDelivery(events, { producerId: step.actor, grams: step.grams, deliveredOn: step.date, photoHash: null }, clock);
    case 'confirm':
      return confirmDelivery(events, { deliveryId: step.delivery, collectorId: step.actor }, clock);
    case 'reject':
      return rejectDelivery(events, { deliveryId: step.delivery, collectorId: step.actor, reason: step.reason }, clock);
    case 'batch':
      return createBatch(events, { brandId: step.actor, deliveryIds: step.deliveries, producedOn: step.date, units: step.units }, clock);
  }
}

describe('origin log invariants', () => {
  it('holds for every sequence of accepted and refused actions', () => {
    fc.assert(
      fc.property(fc.boolean(), fc.array(action, { maxLength: 40 }), (fromDemo, steps) => {
        let events: LedgerEvent[] = fromDemo ? buildDemoLog() : [];
        for (const step of steps) {
          const before = events;
          const previousStatuses = new Map(deriveState(before).deliveries.map((item) => [item.id, item.status]));
          const result = run(events, step);
          if (!result.ok) continue;
          const appended = appendEvent(events, result.value);
          expect(appended.ok).toBe(true);
          if (!appended.ok) continue;
          events = appended.value;

          expect(events.slice(0, before.length)).toEqual(before);
          expect(events).toHaveLength(before.length + 1);

          const state = deriveState(events);
          for (const delivery of state.deliveries) {
            const previous = previousStatuses.get(delivery.id);
            if (previous && previous !== 'pending') expect(delivery.status).toBe(previous);
          }
          for (const batch of state.batches) {
            for (const id of batch.deliveryIds) {
              expect(state.deliveries.find((item) => item.id === id)?.status).toBe('confirmed');
            }
          }
          for (const delivery of state.deliveries) {
            expect(delivery.deliveredOn <= clock.today).toBe(true);
          }
        }
        expect(verifyLog(events)).toBeNull();
      }),
      { numRuns: 300 },
    );
  });
});
