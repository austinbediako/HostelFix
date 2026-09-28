import crypto from 'node:crypto';

export function generateReferenceNumber(hallCode: string, date = new Date()): string {
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = crypto.randomInt(0, 10_000);
  const sequence = String(random).padStart(4, '0');
  return `HF-${hallCode}-${ymd}-${sequence}`;
}
