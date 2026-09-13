import { describe, expect, it } from 'vitest';
import { buildCostingBreakdown } from './costingBreakdown';
import type { MetricDef, MetricValues } from '@/lib/calc/types';

// Same seed as lib/calc/metrics.test.ts / lib/report/financialDraft.test.ts.
const DEFAULT_METRICS: MetricDef[] = [
  { id: 'm_pax', label: 'No of Pax', section: 'covers' },
  { id: 'm_food', label: 'Food Sales', section: 'sales', revGroup: 'kitchen' },
  { id: 'm_liquor', label: 'Liquor', section: 'sales', revGroup: 'bar' },
  { id: 'm_bev', label: 'Beverage Sales', section: 'sales', revGroup: 'bar' },
  { id: 'm_cbev', label: 'Beverage', section: 'cost', group: 'bar', den: 'm_bev' },
  { id: 'm_cliq', label: 'Liquor', section: 'cost', group: 'bar', den: 'm_liquor' },
  { id: 'm_cper', label: 'Perishables and Provision', section: 'cost', group: 'bar', den: 'm_liquor' },
  { id: 'm_ckit', label: 'Food Kitchen', section: 'cost', group: 'kitchen', den: 'm_food' },
  { id: 'm_cstaff', label: 'Staff Food', section: 'cost', group: 'kitchen', den: 'm_food' },
  { id: 'm_cnc', label: 'Non Commercial Cost', section: 'cost', group: 'nc', den: 'net' },
];

const MTD_FULL: MetricValues = {
  m_pax: '222',
  m_food: '165151',
  m_liquor: '55642',
  m_bev: '27182',
  m_cbev: '7308',
  m_cliq: '15790',
  m_cper: '10000',
  m_ckit: '51296',
  m_cstaff: '14000',
  m_cnc: '17500',
};

function ok(f: { status: string; value?: number }): number {
  expect(f.status).toBe('ok');
  return f.value as number;
}

describe('buildCostingBreakdown', () => {
  const b = buildCostingBreakdown(DEFAULT_METRICS, MTD_FULL);

  it('groups bar cost items and totals them against bar sale', () => {
    expect(b.bar).not.toBeNull();
    expect(b.bar!.items.map((i) => i.label)).toEqual(['Beverage', 'Liquor', 'Perishables and Provision']);
    expect(ok(b.bar!.total)).toBe(33098);
    expect(ok(b.bar!.totalPct)).toBeCloseTo((33098 / 82824) * 100, 5);
  });

  it('resolves each line item\'s % against its own den, not the group total', () => {
    const beverage = b.bar!.items.find((i) => i.label === 'Beverage')!;
    expect(ok(beverage.value)).toBe(7308);
    expect(ok(beverage.pct)).toBeCloseTo((7308 / 27182) * 100, 5); // den: m_bev

    const liquor = b.bar!.items.find((i) => i.label === 'Liquor')!;
    expect(ok(liquor.pct)).toBeCloseTo((15790 / 55642) * 100, 5); // den: m_liquor
  });

  it('groups kitchen cost items and totals them against kitchen sale', () => {
    expect(b.kitchen).not.toBeNull();
    expect(ok(b.kitchen!.total)).toBe(65296);
    expect(ok(b.kitchen!.totalPct)).toBeCloseTo((65296 / 165151) * 100, 5);
  });

  it('derives Total F&B Cost and Total Net F&B Cost against net sale', () => {
    expect(ok(b.fnbTotal)).toBe(98394);
    expect(ok(b.fnbTotalPct)).toBeCloseTo((98394 / 247975) * 100, 5);
    expect(ok(b.netFnbTotal)).toBe(80894);
    expect(ok(b.netFnbTotalPct)).toBeCloseTo((80894 / 247975) * 100, 5);
  });

  it('lists the non-commercial adjustment against its own den (net)', () => {
    expect(b.nonCommercial).toHaveLength(1);
    expect(ok(b.nonCommercial[0].value)).toBe(17500);
    expect(ok(b.nonCommercial[0].pct)).toBeCloseTo((17500 / 247975) * 100, 5);
  });

  it('omits a group entirely when the template has no cost rows for it', () => {
    const kitchenOnly: MetricDef[] = [
      { id: 'm_pax', label: 'Pax', section: 'covers' },
      { id: 'm_food', label: 'Food Sales', section: 'sales', revGroup: 'kitchen' },
      { id: 'm_ckit', label: 'Food Kitchen', section: 'cost', group: 'kitchen', den: 'm_food' },
    ];
    const breakdown = buildCostingBreakdown(kitchenOnly, { m_pax: '10', m_food: '5000', m_ckit: '2000' });
    expect(breakdown.bar).toBeNull();
    expect(breakdown.kitchen).not.toBeNull();
  });

  it('an all-empty audit needs data everywhere, never ₹0', () => {
    const breakdown = buildCostingBreakdown(DEFAULT_METRICS, {});
    expect(breakdown.bar!.total.status).toBe('needs-data');
    expect(breakdown.fnbTotal.status).toBe('needs-data');
    expect(breakdown.netFnbTotal.status).toBe('needs-data');
  });
});
