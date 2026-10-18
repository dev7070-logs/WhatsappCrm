import { describe, expect, it } from 'vitest';

import { validateContactInput } from './contact-input';

describe('validateContactInput', () => {
  it('accepts a normal body', () => {
    expect(validateContactInput({ name: 'Aisha', email: 'a@b.co', tags: ['vip'] })).toBeNull();
  });
  it('rejects oversized tag lists and long tags', () => {
    expect(validateContactInput({ tags: Array.from({ length: 51 }, (_, i) => `t${i}`) })).toMatch(/at most 50/);
    expect(validateContactInput({ tags: ['x'.repeat(51)] })).toMatch(/at most 50 characters/);
    expect(validateContactInput({ tags: 'vip' })).toMatch(/array/);
  });
  it('rejects long fields and bad emails', () => {
    expect(validateContactInput({ name: 'x'.repeat(201) })).toMatch(/'name'/);
    expect(validateContactInput({ email: 'not-an-email' })).toMatch(/'email'/);
  });
});
