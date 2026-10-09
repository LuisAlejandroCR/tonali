// dates.ts: calendar-date helpers (YYYY-MM-DD) for deliveries and batches.
// Dates are plain local calendar days; comparisons are string-based to avoid time-zone drift.

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function isValidDate(input: string): boolean {
  const match = DATE_PATTERN.exec(input);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 2000 || month < 1 || month > 12 || day < 1) return false;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day <= daysInMonth;
}

export function toLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(input: string): string {
  const match = DATE_PATTERN.exec(input);
  if (!match) return input;
  return `${Number(match[3])} de ${MONTHS[Number(match[2]) - 1]} de ${match[1]}`;
}

const SHORT_MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function formatShortDate(input: string, currentYear: number = new Date().getFullYear()): string {
  const match = DATE_PATTERN.exec(input);
  if (!match) return input;
  const short = `${Number(match[3])} ${SHORT_MONTHS[Number(match[2]) - 1]}`;
  return Number(match[1]) === currentYear ? short : `${short} ${match[1]}`;
}

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${formatDate(toLocalDate(date))}, ${hours}:${minutes}`;
}
