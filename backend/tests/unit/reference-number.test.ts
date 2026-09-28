import { describe, it, expect } from 'vitest';
import { generateReferenceNumber } from '../../src/shared/utilities/reference-number.js';

describe('generateReferenceNumber', () => {
  it('prefixes with HF and hall code', () => {
    const ref = generateReferenceNumber('AKU', new Date('2026-09-08T12:00:00Z'));
    expect(ref).toMatch(/^HF-AKU-20260908-\d{4}$/);
  });

  it('generates different suffixes on repeated calls', () => {
    const refs = new Set();
    for (let i = 0; i < 20; i++) {
      refs.add(generateReferenceNumber('LEG'));
    }
    expect(refs.size).toBeGreaterThan(1);
  });
});
