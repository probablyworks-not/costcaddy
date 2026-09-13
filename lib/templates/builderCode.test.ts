import { describe, expect, it } from 'vitest';
import { builderCatCode, checklistPointCode } from './builderCode';

describe('builderCatCode', () => {
  it('takes the first 3 letters of a single word, uppercased', () => {
    expect(builderCatCode('Kitchen')).toBe('KIT');
  });

  it('takes initials for multiple words, truncated to 3', () => {
    expect(builderCatCode('Purchase & Store')).toBe('PS');
    expect(builderCatCode('Point Of Sale Controls')).toBe('POS');
  });

  it('falls back to CAT for an empty name', () => {
    expect(builderCatCode('')).toBe('CAT');
    expect(builderCatCode(undefined)).toBe('CAT');
  });
});

describe('checklistPointCode', () => {
  it('zero-pads the 1-based index within the department', () => {
    expect(checklistPointCode('KIT', 0)).toBe('KIT-01');
    expect(checklistPointCode('KIT', 2)).toBe('KIT-03');
    expect(checklistPointCode('KIT', 10)).toBe('KIT-11');
  });
});
