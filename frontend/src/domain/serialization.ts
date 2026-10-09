// serialization.ts: reads the stored event log as untrusted input and rejects anything malformed.
// A log that fails shape or rule checks is discarded instead of being shown to the user.

import { verifyLog } from './ledger';
import type { LedgerEvent, Signature } from './types';

type Fields = Record<string, unknown>;

const isRecord = (value: unknown): value is Fields =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === 'string';
const isInteger = (value: unknown): value is number => Number.isInteger(value);

function isSignature(value: unknown): value is Signature {
  return (
    isRecord(value) &&
    isString(value.signerId) &&
    value.method === 'simulated-passkey' &&
    isString(value.value)
  );
}

function hasBase(value: Fields): boolean {
  return isInteger(value.seq) && isString(value.at) && isSignature(value.signature);
}

function isEvent(value: unknown): value is LedgerEvent {
  if (!isRecord(value) || !hasBase(value)) return false;
  switch (value.kind) {
    case 'delivery_registered':
      return (
        isString(value.deliveryId) &&
        isString(value.producerId) &&
        value.ingredient === 'amaranto' &&
        isInteger(value.grams) &&
        isString(value.deliveredOn) &&
        (value.photoHash === null || isString(value.photoHash))
      );
    case 'delivery_confirmed':
      return isString(value.deliveryId) && isString(value.collectorId);
    case 'delivery_rejected':
      return isString(value.deliveryId) && isString(value.collectorId) && isString(value.reason);
    case 'batch_created':
      return (
        isString(value.batchId) &&
        isString(value.brandId) &&
        isString(value.producedOn) &&
        isInteger(value.units) &&
        Array.isArray(value.deliveryIds) &&
        value.deliveryIds.every(isString)
      );
    default:
      return false;
  }
}

export function parseStoredEvents(raw: string): LedgerEvent[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed) || !parsed.every(isEvent)) return null;
  return verifyLog(parsed) === null ? parsed : null;
}

export function serializeEvents(events: readonly LedgerEvent[]): string {
  return JSON.stringify(events);
}
