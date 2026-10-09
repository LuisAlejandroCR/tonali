// demo-data.ts: fictional starting log so every screen has something to show on first launch.
// Built through the same commands the UI uses, so it always satisfies the ledger rules.

import {
  appendEvent,
  confirmDelivery,
  createBatch,
  registerDelivery,
  rejectDelivery,
  type Clock,
} from './ledger';
import type { LedgerEvent, Result } from './types';

export const DEMO_BATCH_ID = 'L-2026-001';

type Step = (events: readonly LedgerEvent[], clock: Clock) => Result<LedgerEvent>;

const at = (day: string, time: string): Clock => ({ now: `${day}T${time}:00.000-06:00`, today: day });

const STEPS: [Clock, Step][] = [
  [at('2026-09-21', '09:10'), (events, clock) => registerDelivery(events, {
    producerId: 'P-01', grams: 25_000, deliveredOn: '2026-09-21',
    photoHash: '9c146dcf13c48feedfd6da875f5fe9ab2ed32cad28a10210e4956182af3886bc',
  }, clock)],
  [at('2026-09-21', '11:40'), (events, clock) => confirmDelivery(events, { deliveryId: 'E-0001', collectorId: 'A-01' }, clock)],
  [at('2026-09-22', '08:55'), (events, clock) => registerDelivery(events, {
    producerId: 'P-02', grams: 18_500, deliveredOn: '2026-09-22',
    photoHash: '5a820eb92569b40d11d82e4e0e91acbb7c257fb3981986701e51717cb583149c',
  }, clock)],
  [at('2026-09-22', '12:05'), (events, clock) => confirmDelivery(events, { deliveryId: 'E-0002', collectorId: 'A-01' }, clock)],
  [at('2026-09-28', '10:20'), (events, clock) => registerDelivery(events, {
    producerId: 'P-03', grams: 12_000, deliveredOn: '2026-09-28', photoHash: null,
  }, clock)],
  [at('2026-09-28', '13:15'), (events, clock) => rejectDelivery(events, {
    deliveryId: 'E-0003', collectorId: 'A-01', reason: 'La báscula marcó 9.5 kg, no 12 kg.',
  }, clock)],
  [at('2026-09-30', '17:30'), (events, clock) => createBatch(events, {
    brandId: 'M-01', deliveryIds: ['E-0001', 'E-0002'], producedOn: '2026-09-30', units: 100,
  }, clock)],
  [at('2026-10-02', '09:45'), (events, clock) => registerDelivery(events, {
    producerId: 'P-01', grams: 20_000, deliveredOn: '2026-10-02',
    photoHash: '5e444fa1707c4f3e76cbc09eba2d99284d5318b02a75d151605504b8240a29a0',
  }, clock)],
  [at('2026-10-02', '12:30'), (events, clock) => confirmDelivery(events, { deliveryId: 'E-0004', collectorId: 'A-01' }, clock)],
  [at('2026-10-06', '08:30'), (events, clock) => registerDelivery(events, {
    producerId: 'P-02', grams: 15_000, deliveredOn: '2026-10-06',
    photoHash: 'aa3c65ae4d524aa98b309792d63d76e45fe6e3f50d9e91f40056a9b17d768a4f',
  }, clock)],
];

export function buildDemoLog(): LedgerEvent[] {
  let events: LedgerEvent[] = [];
  for (const [clock, step] of STEPS) {
    const result = step(events, clock);
    if (!result.ok) throw new Error(`Demo data is invalid: ${result.error}`);
    const appended = appendEvent(events, result.value);
    if (!appended.ok) throw new Error(`Demo data is invalid: ${appended.error}`);
    events = appended.value;
  }
  return events;
}
