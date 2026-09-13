import { describe, expect, it } from 'vitest';
import { metricSections } from './sections';
import type { MetricDef, MetricValues } from './types';

// Same seed as metrics.test.ts (Super Admin Flow.dc.html DEFAULT_METRICS / MTD_FULL).
const DEFAULT_METRICS: MetricDef[] = [
  { id: 'm_pax', label: 'No of Pax', section: 'covers' },
  { id: 'm_food', label: 'Food Sales', section: 'sales', revGroup: 'kitchen' },
  { id: 'm_liquor', label: 'Liquor', section: 'sales', revGroup: 'bar' },
  { id: 'm_bev', label: 'Beverage Sales', section: 'sales', revGroup: 'bar' },
  { id: 'm_dfood', label: 'Food Discount', section: 'discount' },
  { id: 'm_sc', label: 'Service Charge', section: 'tax', kind: 'charge' },
  { id: 'm_sgst', label: 'SGST', section: 'tax' },
  { id: 'm_cbev', label: 'Beverage', section: 'cost', group: 'bar', den: 'm_bev' },
  { id: 'm_ckit', label: 'Food Kitchen', section: 'cost', group: 'kitchen', den: 'm_food' },
  { id: 'm_cnc', label: 'Non Commercial Cost', section: 'cost', group: 'nc', den: 'net' },
];

const MTD_FULL: MetricValues = {
  m_pax: '222',
  m_food: '165151',
  m_liquor: '55642',
  m_bev: '27182',
  m_dfood: '6400',
  m_sc: '20848',
  m_sgst: '5006',
  m_cbev: '7308',
  m_ckit: '51296',
  m_cnc: '17500',
};

describe('metricSections — MTD_FULL', () => {
  const sections = metricSections(DEFAULT_METRICS, MTD_FULL);
  const byKey = Object.fromEntries(sections.map((s) => [s.key, s]));

  it('emits one section per section with rows present, in a fixed order', () => {
    expect(sections.map((s) => s.key)).toEqual(['covers', 'sales', 'discount', 'tax', 'cost']);
  });

  it('covers: input row + a count-formatted (no ₹) total row', () => {
    const covers = byKey.covers;
    expect(covers.rows).toHaveLength(2);
    expect(covers.rows[1]).toMatchObject({ kind: 'derived', label: 'TOTAL NO OF PAX', display: '222' });
  });

  it('sales: each input row and the total carry an APC sub-figure', () => {
    const sales = byKey.sales;
    const food = sales.rows.find((r) => r.kind === 'input' && r.metricKey === 'm_food');
    expect(food).toMatchObject({ subLabel: 'APC', sub: '₹744' }); // 165151/222 = 743.9...
    const total = sales.rows[sales.rows.length - 1];
    expect(total).toMatchObject({ kind: 'derived', label: 'NET SALES AT RESTAURANT', display: '₹2,47,975', subLabel: 'APC' });
  });

  it('tax: carries two derived rows — an unlabelled total and gross sale with APC', () => {
    const tax = byKey.tax;
    expect(tax.rows.at(-2)).toMatchObject({ label: 'Total Taxes', display: '₹5,006', sub: '—' });
    expect(tax.rows.at(-1)).toMatchObject({ label: 'TOTAL GROSS SALE', subLabel: 'APC' });
  });

  it('cost: input rows carry a % sub against their denominator; totals present per group', () => {
    const cost = byKey.cost;
    const bev = cost.rows.find((r) => r.kind === 'input' && r.metricKey === 'm_cbev');
    expect(bev).toMatchObject({ sub: '26.89%' }); // 7308 / 27182
    const labels = cost.rows.map((r) => r.label);
    expect(labels).toContain('TOTAL BAR COST');
    expect(labels).toContain('TOTAL KITCHEN COST');
    expect(labels).toContain('TOTAL F&B COST');
    expect(labels).toContain('TOTAL NET F&B COST');
  });
});

describe('metricSections — empty values', () => {
  it('never throws, and un-entered cost rows show no sub (denominator missing)', () => {
    const sections = metricSections(DEFAULT_METRICS, {});
    const cost = sections.find((s) => s.key === 'cost')!;
    const bev = cost.rows.find((r) => r.kind === 'input' && r.metricKey === 'm_cbev');
    expect(bev).toMatchObject({ sub: '—' });
  });

  it('omits a section entirely when its template defines no rows for it', () => {
    const noCost = DEFAULT_METRICS.filter((d) => d.section !== 'cost');
    const sections = metricSections(noCost, {});
    expect(sections.map((s) => s.key)).not.toContain('cost');
  });
});
