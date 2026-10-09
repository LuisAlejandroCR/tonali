// ledger.spec.ts: one behaviour per test for the append-only origin log and its rules.

import { describe, expect, it } from 'vitest';

import { buildDemoLog, DEMO_BATCH_ID } from '../../src/domain/demo-data';
import {
  appendEvent,
  confirmDelivery,
  createBatch,
  deriveState,
  getBatchOrigin,
  registerDelivery,
  rejectDelivery,
  verifyLog,
} from '../../src/domain/ledger';
import type { LedgerEvent } from '../../src/domain/types';

const clock = { now: '2026-10-08T10:00:00.000-06:00', today: '2026-10-08' };

function apply(events: LedgerEvent[], result: { ok: boolean; value?: LedgerEvent; error?: string }): LedgerEvent[] {
  if (!result.ok || !result.value) throw new Error(result.error);
  const appended = appendEvent(events, result.value);
  if (!appended.ok) throw new Error(appended.error);
  return appended.value;
}

function registered(): LedgerEvent[] {
  return apply([], registerDelivery([], { producerId: 'P-01', grams: 10_000, deliveredOn: '2026-10-07', photoHash: null }, clock));
}

describe('registerDelivery', () => {
  it('creates a pending delivery signed by the producer', () => {
    const state = deriveState(registered());
    expect(state.deliveries).toHaveLength(1);
    expect(state.deliveries[0]).toMatchObject({ id: 'E-0001', status: 'pending', producerId: 'P-01' });
    expect(state.deliveries[0].producerSignature.signerId).toBe('P-01');
  });

  it('rejects a collector registering on behalf of a producer', () => {
    const result = registerDelivery([], { producerId: 'A-01', grams: 1000, deliveredOn: '2026-10-07', photoHash: null }, clock);
    expect(result.ok).toBe(false);
  });

  it('rejects a future delivery date', () => {
    const result = registerDelivery([], { producerId: 'P-01', grams: 1000, deliveredOn: '2026-10-09', photoHash: null }, clock);
    expect(result.ok).toBe(false);
  });

  it('rejects a photo fingerprint that is not SHA-256 hex', () => {
    const result = registerDelivery([], { producerId: 'P-01', grams: 1000, deliveredOn: '2026-10-07', photoHash: 'foto.jpg' }, clock);
    expect(result.ok).toBe(false);
  });
});

describe('reviewing a delivery', () => {
  it('confirms a pending delivery once', () => {
    const events = apply(registered(), confirmDelivery(registered(), { deliveryId: 'E-0001', collectorId: 'A-01' }, clock));
    expect(deriveState(events).deliveries[0].status).toBe('confirmed');
    expect(confirmDelivery(events, { deliveryId: 'E-0001', collectorId: 'A-01' }, clock).ok).toBe(false);
  });

  it('requires a reason to reject', () => {
    const blank = rejectDelivery(registered(), { deliveryId: 'E-0001', collectorId: 'A-01', reason: '   ' }, clock);
    expect(blank.ok).toBe(false);
    const events = apply(registered(), rejectDelivery(registered(), { deliveryId: 'E-0001', collectorId: 'A-01', reason: ' Peso distinto ' }, clock));
    expect(deriveState(events).deliveries[0].review?.reason).toBe('Peso distinto');
  });

  it('only lets the collector review', () => {
    expect(confirmDelivery(registered(), { deliveryId: 'E-0001', collectorId: 'P-01' }, clock).ok).toBe(false);
  });
});

describe('createBatch', () => {
  it('refuses a pending delivery', () => {
    const result = createBatch(registered(), { brandId: 'M-01', deliveryIds: ['E-0001'], producedOn: '2026-10-08', units: 100 }, clock);
    expect(result).toEqual({ ok: false, error: 'La entrega E-0001 no está confirmada.' });
  });

  it('links confirmed deliveries and numbers the batch by year', () => {
    let events = registered();
    events = apply(events, confirmDelivery(events, { deliveryId: 'E-0001', collectorId: 'A-01' }, clock));
    events = apply(events, createBatch(events, { brandId: 'M-01', deliveryIds: ['E-0001'], producedOn: '2026-10-08', units: 80 }, clock));
    const state = deriveState(events);
    expect(state.batches[0].id).toBe('L-2026-001');
    expect(state.deliveries[0].batchIds).toEqual(['L-2026-001']);
  });

  it('refuses a production date before a linked delivery', () => {
    let events = registered();
    events = apply(events, confirmDelivery(events, { deliveryId: 'E-0001', collectorId: 'A-01' }, clock));
    const result = createBatch(events, { brandId: 'M-01', deliveryIds: ['E-0001'], producedOn: '2026-10-06', units: 80 }, clock);
    expect(result.ok).toBe(false);
  });
});

describe('appendEvent', () => {
  it('refuses an event signed against an older log', () => {
    const stale = registerDelivery([], { producerId: 'P-02', grams: 1000, deliveredOn: '2026-10-07', photoHash: null }, clock);
    if (!stale.ok) throw new Error(stale.error);
    expect(appendEvent(registered(), stale.value).ok).toBe(false);
  });
});

describe('demo log', () => {
  it('passes the same rules as user-made logs', () => {
    expect(verifyLog(buildDemoLog())).toBeNull();
  });

  it('exposes the demo batch origin for the public page', () => {
    const origin = getBatchOrigin(deriveState(buildDemoLog()), DEMO_BATCH_ID);
    expect(origin?.producerIds).toEqual(['P-01', 'P-02']);
    expect(origin?.totalGrams).toBe(43_500);
  });

  it('returns null for an unknown batch', () => {
    expect(getBatchOrigin(deriveState(buildDemoLog()), 'L-1999-001')).toBeNull();
  });
});
