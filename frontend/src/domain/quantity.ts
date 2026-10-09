// quantity.ts: parses and formats user-typed amounts without floating-point math.
// Kilograms are stored as integer grams; bar counts as positive integers.

import type { Result } from './types';

const MAX_GRAMS = 10_000_000;
const MAX_UNITS = 100_000;
const KILOGRAMS_PATTERN = /^(\d{1,5})(?:[.,](\d{1,3}))?$/;
const UNITS_PATTERN = /^\d{1,6}$/;

export function parseKilograms(input: string): Result<number> {
  const match = KILOGRAMS_PATTERN.exec(input.trim());
  if (!match) {
    return { ok: false, error: 'Escribe la cantidad en kilos, por ejemplo 25 o 18.5.' };
  }
  const whole = Number(match[1]);
  const fraction = Number((match[2] ?? '').padEnd(3, '0'));
  const grams = whole * 1000 + fraction;
  if (grams === 0) {
    return { ok: false, error: 'La cantidad tiene que ser mayor que cero.' };
  }
  if (grams > MAX_GRAMS) {
    return { ok: false, error: 'La cantidad es demasiado grande para una entrega.' };
  }
  return { ok: true, value: grams };
}

export function formatKilograms(grams: number): string {
  const whole = Math.floor(grams / 1000);
  const fraction = String(grams % 1000).padStart(3, '0').replace(/0+$/, '');
  return fraction ? `${whole}.${fraction} kg` : `${whole} kg`;
}

export function parseUnits(input: string): Result<number> {
  const trimmed = input.trim();
  if (!UNITS_PATTERN.test(trimmed)) {
    return { ok: false, error: 'Escribe el número de barras con dígitos, por ejemplo 100.' };
  }
  const units = Number(trimmed);
  if (units === 0) {
    return { ok: false, error: 'El lote tiene que tener al menos una barra.' };
  }
  if (units > MAX_UNITS) {
    return { ok: false, error: 'El número de barras es demasiado grande para un lote.' };
  }
  return { ok: true, value: units };
}
