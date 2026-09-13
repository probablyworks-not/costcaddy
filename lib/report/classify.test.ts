import { describe, expect, it } from 'vitest';
import { classifyFinding } from './classify';

describe('classifyFinding', () => {
  it('matches a keyword rule case-insensitively across label + remark', () => {
    const f = classifyFinding('Temperature Control', 'Walk-in fridge reading 9°C at close');
    expect(f.category).toBe('Temperature & Expiry');
    expect(f.severity).toBe('High');
    expect(f.sla).toBe('Immediate (24 Hours)');
    expect(f.ownership).toBe('Sous Chef / Kitchen Team');
  });

  it('matches on the remark even when the label carries no keyword', () => {
    const f = classifyFinding('Other Observations - Kitchen', 'Vendor invoice missing the GST number');
    expect(f.category).toBe('Inventory Control');
    expect(f.severity).toBe('Medium');
  });

  it('falls back to Operational Control / Medium when nothing matches', () => {
    const f = classifyFinding('Key Control', 'Sign-in/out log active and enforced for dry store, liquor cage and master keys.');
    expect(f.category).toBe('Operational Control');
    expect(f.severity).toBe('Medium');
  });

  it('never returns Critical — severity is High/Medium/Low only (R7/UX-006)', () => {
    const f = classifyFinding('Fire Safety', 'Extinguisher inspection tag expired');
    expect(['High', 'Medium', 'Low']).toContain(f.severity);
  });

  it('matches the Food Safety Risk rule on cross-contamination language', () => {
    const f = classifyFinding('Cross-Contamination', 'Raw chicken stored above ready-to-eat salads');
    expect(f.category).toBe('Food Safety Risk');
  });
});
