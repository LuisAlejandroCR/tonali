// actors.ts: fictional demo accounts, one per actor, identified by code instead of personal name.
// Real accounts will be passkey smart wallets on Stellar testnet; nothing personal goes on-chain.

import type { Actor, ActorRole } from './types';

export const ACTORS: readonly Actor[] = [
  { id: 'P-01', role: 'producer', label: 'Productor P-01' },
  { id: 'P-02', role: 'producer', label: 'Productor P-02' },
  { id: 'P-03', role: 'producer', label: 'Productor P-03' },
  { id: 'A-01', role: 'collector', label: 'Acopiador A-01' },
  { id: 'M-01', role: 'brand', label: 'TONALI' },
];

export function findActor(id: string): Actor | undefined {
  return ACTORS.find((actor) => actor.id === id);
}

export function actorsByRole(role: ActorRole): Actor[] {
  return ACTORS.filter((actor) => actor.role === role);
}

export function actorLabel(id: string): string {
  return findActor(id)?.label ?? id;
}
