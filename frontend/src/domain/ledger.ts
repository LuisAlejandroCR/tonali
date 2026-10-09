// ledger.ts: append-only origin log for deliveries, collector reviews and batches.
// Applies the rules the Soroban contract will enforce: nothing is edited and a batch only links confirmed deliveries.

import { findActor } from './actors';
import { isSha256Hex } from './bytes';
import { isValidDate } from './dates';
import type {
  ActorRole,
  BatchCreated,
  BatchView,
  DeliveryConfirmed,
  DeliveryRegistered,
  DeliveryRejected,
  DeliveryView,
  LedgerEvent,
  LedgerState,
  Result,
  Signature,
} from './types';

export interface Clock {
  now: string;
  today: string;
}

export interface RegisterDeliveryInput {
  producerId: string;
  grams: number;
  deliveredOn: string;
  photoHash: string | null;
}

export interface ReviewDeliveryInput {
  deliveryId: string;
  collectorId: string;
}

export interface CreateBatchInput {
  brandId: string;
  deliveryIds: string[];
  producedOn: string;
  units: number;
}

const MAX_REASON_LENGTH = 200;
const MAX_UNITS = 100_000;
const NO_DATE_LIMIT = '9999-12-31';

type Unsigned<T> = Omit<T, 'signature'>;

export function simulateSignature(signerId: string, payload: string): Signature {
  let hash = 0x811c9dc5;
  for (let index = 0; index < payload.length; index++) {
    hash ^= payload.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return { signerId, method: 'simulated-passkey', value: `sim-${hash.toString(16).padStart(8, '0')}` };
}

function sign<T extends LedgerEvent>(draft: Unsigned<T>, signerId: string): T {
  return { ...draft, signature: simulateSignature(signerId, JSON.stringify(draft)) } as T;
}

export function deriveState(events: readonly LedgerEvent[]): LedgerState {
  const deliveries = new Map<string, DeliveryView>();
  const batches: BatchView[] = [];
  for (const event of events) {
    switch (event.kind) {
      case 'delivery_registered':
        deliveries.set(event.deliveryId, {
          id: event.deliveryId,
          producerId: event.producerId,
          ingredient: event.ingredient,
          grams: event.grams,
          deliveredOn: event.deliveredOn,
          photoHash: event.photoHash,
          registeredAt: event.at,
          producerSignature: event.signature,
          status: 'pending',
          review: null,
          batchIds: [],
        });
        break;
      case 'delivery_confirmed':
      case 'delivery_rejected': {
        const delivery = deliveries.get(event.deliveryId);
        if (!delivery || delivery.status !== 'pending') break;
        delivery.status = event.kind === 'delivery_confirmed' ? 'confirmed' : 'rejected';
        delivery.review = {
          collectorId: event.collectorId,
          at: event.at,
          reason: event.kind === 'delivery_rejected' ? event.reason : null,
          signature: event.signature,
        };
        break;
      }
      case 'batch_created':
        batches.push({
          id: event.batchId,
          brandId: event.brandId,
          producedOn: event.producedOn,
          units: event.units,
          deliveryIds: [...event.deliveryIds],
          createdAt: event.at,
          signature: event.signature,
        });
        for (const deliveryId of event.deliveryIds) {
          deliveries.get(deliveryId)?.batchIds.push(event.batchId);
        }
        break;
    }
  }
  return { deliveries: [...deliveries.values()], batches };
}

function requireRole(actorId: string, role: ActorRole, message: string): string | null {
  return findActor(actorId)?.role === role ? null : message;
}

function checkRegister(input: RegisterDeliveryInput, today: string): string | null {
  return (
    requireRole(input.producerId, 'producer', 'Sólo un productor puede registrar una entrega.') ??
    (!Number.isInteger(input.grams) || input.grams <= 0 ? 'La cantidad tiene que ser mayor que cero.' : null) ??
    (!isValidDate(input.deliveredOn) ? 'La fecha de entrega no es válida (usa AAAA-MM-DD).' : null) ??
    (input.deliveredOn > today ? 'La fecha de entrega no puede ser futura.' : null) ??
    (input.photoHash !== null && !isSha256Hex(input.photoHash) ? 'La huella de la foto no es válida.' : null)
  );
}

function checkReview(state: LedgerState, input: ReviewDeliveryInput): string | null {
  const roleError = requireRole(input.collectorId, 'collector', 'Sólo el acopiador puede revisar una entrega.');
  if (roleError) return roleError;
  const delivery = state.deliveries.find((item) => item.id === input.deliveryId);
  if (!delivery) return `No existe la entrega ${input.deliveryId}.`;
  if (delivery.status !== 'pending') return `La entrega ${input.deliveryId} ya fue revisada.`;
  return null;
}

function checkReason(reason: string): string | null {
  const trimmed = reason.trim();
  if (trimmed.length === 0) return 'Escribe el motivo del rechazo.';
  if (trimmed.length > MAX_REASON_LENGTH) return `El motivo no puede pasar de ${MAX_REASON_LENGTH} caracteres.`;
  return null;
}

function checkBatch(state: LedgerState, input: CreateBatchInput, today: string): string | null {
  const roleError = requireRole(input.brandId, 'brand', 'Sólo la marca puede crear un lote.');
  if (roleError) return roleError;
  if (input.deliveryIds.length === 0) return 'Elige al menos una entrega confirmada.';
  if (new Set(input.deliveryIds).size !== input.deliveryIds.length) return 'Una entrega aparece dos veces en el lote.';
  if (!isValidDate(input.producedOn)) return 'La fecha de elaboración no es válida (usa AAAA-MM-DD).';
  if (input.producedOn > today) return 'La fecha de elaboración no puede ser futura.';
  if (!Number.isInteger(input.units) || input.units <= 0 || input.units > MAX_UNITS) {
    return 'El número de barras no es válido.';
  }
  for (const deliveryId of input.deliveryIds) {
    const delivery = state.deliveries.find((item) => item.id === deliveryId);
    if (!delivery || delivery.status !== 'confirmed') return `La entrega ${deliveryId} no está confirmada.`;
    if (delivery.deliveredOn > input.producedOn) {
      return `El lote no puede elaborarse antes de la entrega ${deliveryId}.`;
    }
  }
  return null;
}

function nextDeliveryId(events: readonly LedgerEvent[]): string {
  const count = events.filter((event) => event.kind === 'delivery_registered').length;
  return `E-${String(count + 1).padStart(4, '0')}`;
}

function nextBatchId(events: readonly LedgerEvent[], producedOn: string): string {
  const year = producedOn.slice(0, 4);
  const count = events.filter((event) => event.kind === 'batch_created' && event.producedOn.startsWith(year)).length;
  return `L-${year}-${String(count + 1).padStart(3, '0')}`;
}

export function registerDelivery(
  events: readonly LedgerEvent[],
  input: RegisterDeliveryInput,
  clock: Clock,
): Result<DeliveryRegistered> {
  const error = checkRegister(input, clock.today);
  if (error) return { ok: false, error };
  const draft: Unsigned<DeliveryRegistered> = {
    kind: 'delivery_registered',
    seq: events.length + 1,
    at: clock.now,
    deliveryId: nextDeliveryId(events),
    producerId: input.producerId,
    ingredient: 'amaranto',
    grams: input.grams,
    deliveredOn: input.deliveredOn,
    photoHash: input.photoHash,
  };
  return { ok: true, value: sign(draft, input.producerId) };
}

export function confirmDelivery(
  events: readonly LedgerEvent[],
  input: ReviewDeliveryInput,
  clock: Clock,
): Result<DeliveryConfirmed> {
  const error = checkReview(deriveState(events), input);
  if (error) return { ok: false, error };
  const draft: Unsigned<DeliveryConfirmed> = {
    kind: 'delivery_confirmed',
    seq: events.length + 1,
    at: clock.now,
    deliveryId: input.deliveryId,
    collectorId: input.collectorId,
  };
  return { ok: true, value: sign(draft, input.collectorId) };
}

export function rejectDelivery(
  events: readonly LedgerEvent[],
  input: ReviewDeliveryInput & { reason: string },
  clock: Clock,
): Result<DeliveryRejected> {
  const error = checkReview(deriveState(events), input) ?? checkReason(input.reason);
  if (error) return { ok: false, error };
  const draft: Unsigned<DeliveryRejected> = {
    kind: 'delivery_rejected',
    seq: events.length + 1,
    at: clock.now,
    deliveryId: input.deliveryId,
    collectorId: input.collectorId,
    reason: input.reason.trim(),
  };
  return { ok: true, value: sign(draft, input.collectorId) };
}

export function createBatch(
  events: readonly LedgerEvent[],
  input: CreateBatchInput,
  clock: Clock,
): Result<BatchCreated> {
  const error = checkBatch(deriveState(events), input, clock.today);
  if (error) return { ok: false, error };
  const draft: Unsigned<BatchCreated> = {
    kind: 'batch_created',
    seq: events.length + 1,
    at: clock.now,
    batchId: nextBatchId(events, input.producedOn),
    brandId: input.brandId,
    producedOn: input.producedOn,
    units: input.units,
    deliveryIds: [...input.deliveryIds],
  };
  return { ok: true, value: sign(draft, input.brandId) };
}

export function appendEvent(events: readonly LedgerEvent[], event: LedgerEvent): Result<LedgerEvent[]> {
  if (event.seq !== events.length + 1) {
    return { ok: false, error: 'El registro cambió mientras firmabas. Intenta de nuevo.' };
  }
  return { ok: true, value: [...events, event] };
}

export function verifyLog(events: readonly LedgerEvent[]): string | null {
  for (let index = 0; index < events.length; index++) {
    const event = events[index];
    const prefix = events.slice(0, index);
    if (event.seq !== index + 1) return `El evento ${index + 1} está fuera de orden.`;
    let error: string | null = null;
    switch (event.kind) {
      case 'delivery_registered':
        error = checkRegister(event, NO_DATE_LIMIT);
        if (!error && event.deliveryId !== nextDeliveryId(prefix)) error = 'Identificador de entrega inesperado.';
        break;
      case 'delivery_confirmed':
        error = checkReview(deriveState(prefix), event);
        break;
      case 'delivery_rejected':
        error = checkReview(deriveState(prefix), event) ?? checkReason(event.reason);
        break;
      case 'batch_created':
        error = checkBatch(deriveState(prefix), event, NO_DATE_LIMIT);
        if (!error && event.batchId !== nextBatchId(prefix, event.producedOn)) error = 'Identificador de lote inesperado.';
        break;
    }
    if (error) return `Evento ${event.seq}: ${error}`;
  }
  return null;
}

export interface BatchOrigin {
  batch: BatchView;
  deliveries: DeliveryView[];
  totalGrams: number;
  producerIds: string[];
}

export function getBatchOrigin(state: LedgerState, batchId: string): BatchOrigin | null {
  const batch = state.batches.find((item) => item.id === batchId);
  if (!batch) return null;
  const deliveries = batch.deliveryIds
    .map((id) => state.deliveries.find((item) => item.id === id))
    .filter((item): item is DeliveryView => item !== undefined);
  return {
    batch,
    deliveries,
    totalGrams: deliveries.reduce((sum, item) => sum + item.grams, 0),
    producerIds: [...new Set(deliveries.map((item) => item.producerId))],
  };
}
