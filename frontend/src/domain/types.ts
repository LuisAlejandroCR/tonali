// types.ts: shared domain types for the TONALI origin ledger.
// Mirrors what the Soroban contract will store: append-only events signed by the actor who knows the fact.

export type ActorRole = 'producer' | 'collector' | 'brand';

export interface Actor {
  id: string;
  role: ActorRole;
  label: string;
}

export interface Signature {
  signerId: string;
  method: 'simulated-passkey';
  value: string;
}

export type Ingredient = 'amaranto';

export interface DeliveryRegistered {
  kind: 'delivery_registered';
  seq: number;
  at: string;
  deliveryId: string;
  producerId: string;
  ingredient: Ingredient;
  grams: number;
  deliveredOn: string;
  photoHash: string | null;
  signature: Signature;
}

export interface DeliveryConfirmed {
  kind: 'delivery_confirmed';
  seq: number;
  at: string;
  deliveryId: string;
  collectorId: string;
  signature: Signature;
}

export interface DeliveryRejected {
  kind: 'delivery_rejected';
  seq: number;
  at: string;
  deliveryId: string;
  collectorId: string;
  reason: string;
  signature: Signature;
}

export interface BatchCreated {
  kind: 'batch_created';
  seq: number;
  at: string;
  batchId: string;
  brandId: string;
  producedOn: string;
  units: number;
  deliveryIds: string[];
  signature: Signature;
}

export type LedgerEvent = DeliveryRegistered | DeliveryConfirmed | DeliveryRejected | BatchCreated;

export type DeliveryStatus = 'pending' | 'confirmed' | 'rejected';

export interface DeliveryView {
  id: string;
  producerId: string;
  ingredient: Ingredient;
  grams: number;
  deliveredOn: string;
  photoHash: string | null;
  registeredAt: string;
  producerSignature: Signature;
  status: DeliveryStatus;
  review: {
    collectorId: string;
    at: string;
    reason: string | null;
    signature: Signature;
  } | null;
  batchIds: string[];
}

export interface BatchView {
  id: string;
  brandId: string;
  producedOn: string;
  units: number;
  deliveryIds: string[];
  createdAt: string;
  signature: Signature;
}

export interface LedgerState {
  deliveries: DeliveryView[];
  batches: BatchView[];
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
