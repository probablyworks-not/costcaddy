import { describe, expect, it } from 'vitest';
import { computeMetrics, metricDen } from './metrics';
import { formatINR, formatINRShort } from './currency';
import type { MetricDef, MetricValues } from './types';

// Seed data ported verbatim from Super Admin Flow.dc.html (DEFAULT_METRICS ~line 1283,
// MTD_FULL/MTD_EMPTY/MTD_PARTIAL ~line 1311) — the design's own worked example.
const DEFAULT_METRICS: MetricDef[] = [
  { id: 'm_pax', label: 'No of Pax', section: 'covers' },
  { id: 'm_food', label: 'Food Sales', section: 'sales', revGroup: 'kitchen' },
  { id: 'm_liquor', label: 'Liquor', section: 'sales', revGroup: 'bar' },
  { id: 'm_bev', label: 'Beverage Sales', section: 'sales', revGroup: 'bar' },
  { id: 'm_dfood', label: 'Food Discount', section: 'discount' },
  { id: 'm_dliq', label: 'Liquor Discount', section: 'discount' },
  { id: 'm_dbev', label: 'Beverage Discount', section: 'discount' },
  { id: 'm_sc', label: 'Service Charge', section: 'tax', kind: 'charge' },
  { id: 'm_sgst', label: 'SGST', section: 'tax' },
  { id: 'm_cgst', label: 'CGST', section: 'tax' },
  { id: 'm_vat', label: 'VAT', section: 'tax' },
  { id: 'm_cbev', label: 'Beverage', section: 'cost', group: 'bar', den: 'm_bev' },
  { id: 'm_cliq', label: 'Liquor', section: 'cost', group: 'bar', den: 'm_liquor' },
  { id: 'm_cper', label: 'Perishables and Provision', section: 'cost', group: 'bar', den: 'm_liquor' },
  { id: 'm_ckit', label: 'Food Kitchen', section: 'cost', group: 'kitchen', den: 'm_food' },
  { id: 'm_cstaff', label: 'Staff Food', section: 'cost', group: 'kitchen', den: 'm_food' },
  { id: 'm_cnc', label: 'Non Commercial Cost', section: 'cost', group: 'nc', den: 'net' },
];

const MTD_EMPTY: MetricValues = {};

const MTD_FULL: MetricValues = {
  m_pax: '222',
  m_food: '165151',
  m_liquor: '55642',
  m_bev: '27182',
  m_dfood: '6400',
  m_dliq: '2100',
  m_dbev: '900',
  m_sc: '20848',
  m_sgst: '5006',
  m_cgst: '5006',
  m_vat: '5564',
  m_cbev: '7308',
  m_cliq: '15790',
  m_cper: '10000',
  m_ckit: '51296',
  m_cstaff: '14000',
  m_cnc: '17500',
};

const MTD_PARTIAL: MetricValues = { m_pax: '184', m_food: '138420', m_liquor: '44210' };

describe('computeMetrics — MTD_FULL (design seed a1/a4)', () => {
  const c = computeMetrics(DEFAULT_METRICS, MTD_FULL);

  it('sums covers and sales', () => {
    expect(c.covers).toBe(222);
    expect(c.netSale).toBe(247975); // 165151 + 55642 + 27182
    expect(c.barSale).toBe(82824); // 55642 + 27182
    expect(c.kitchenSale).toBe(165151); // food only — revGroup !== 'bar'
  });

  it('sums discounts, taxes and charges', () => {
    expect(c.totalDiscounts).toBe(9400); // 6400 + 2100 + 900
    expect(c.totalTaxes).toBe(15576); // sgst + cgst + vat, charge excluded
    expect(c.totalCharges).toBe(20848); // service charge only
  });

  it('derives gross sale: net + charges + taxes - discounts', () => {
    expect(c.grossSale).toBe(274999);
  });

  it('sums bar/kitchen/nc cost and derives fnb/net-fnb cost', () => {
    expect(c.barCost).toBe(33098); // 7308 + 15790 + 10000
    expect(c.kitchenCost).toBe(65296); // 51296 + 14000
    expect(c.ncCost).toBe(17500);
    expect(c.fnbCost).toBe(98394); // bar + kitchen
    expect(c.netFnbCost).toBe(80894); // fnbCost - ncCost
  });

  it('resolves cost-row denominators via metricDen', () => {
    expect(metricDen(c, 'm_liquor')).toBe(55642);
    expect(metricDen(c, 'net')).toBe(247975);
    expect(metricDen(c, 'bar')).toBe(82824);
    expect(metricDen(c, 'kitchen')).toBe(165151);
    expect(metricDen(c, null)).toBeNull();
  });
});

describe('computeMetrics — null propagation', () => {
  it('an all-empty group sums to null, never 0', () => {
    const c = computeMetrics(DEFAULT_METRICS, MTD_EMPTY);
    expect(c.covers).toBeNull();
    expect(c.netSale).toBeNull();
    expect(c.totalDiscounts).toBeNull();
    expect(c.totalTaxes).toBeNull();
    expect(c.totalCharges).toBeNull();
    expect(c.grossSale).toBeNull();
    expect(c.barCost).toBeNull();
    expect(c.fnbCost).toBeNull();
    expect(c.netFnbCost).toBeNull();
  });

  it('undefined values behave the same as an empty object', () => {
    const c = computeMetrics(DEFAULT_METRICS, undefined);
    expect(c.covers).toBeNull();
    expect(c.grossSale).toBeNull();
  });

  it('a partially-filled group sums only the present values (design seed a3/a5)', () => {
    const c = computeMetrics(DEFAULT_METRICS, MTD_PARTIAL);
    expect(c.covers).toBe(184);
    expect(c.netSale).toBe(182630); // food + liquor; bev missing, not treated as 0
    expect(c.barSale).toBe(44210); // liquor only; bev missing
    expect(c.kitchenSale).toBe(138420);
    expect(c.totalDiscounts).toBeNull(); // no discount rows entered at all
    expect(c.totalTaxes).toBeNull();
    expect(c.totalCharges).toBeNull();
    // netSale present, taxes/charges/discounts all missing -> not the all-null case
    expect(c.grossSale).toBe(182630);
    expect(c.barCost).toBeNull();
    expect(c.fnbCost).toBeNull();
    expect(c.netFnbCost).toBeNull();
  });
});

describe('formatINR', () => {
  it('groups digits the Indian way with a ₹ prefix', () => {
    expect(formatINR(247975)).toBe('₹2,47,975');
    expect(formatINR(274999)).toBe('₹2,74,999');
    expect(formatINR(222)).toBe('₹222');
    expect(formatINR(0)).toBe('₹0');
  });

  it('renders null/undefined as an em dash, never ₹0', () => {
    expect(formatINR(null)).toBe('—');
    expect(formatINR(undefined)).toBe('—');
  });

  it('rounds and signs negatives', () => {
    expect(formatINR(1234.6)).toBe('₹1,235');
    expect(formatINR(-1234.6)).toBe('-₹1,235');
  });
});

describe('formatINRShort', () => {
  it('renders lakhs and crores with two decimals', () => {
    expect(formatINRShort(480000)).toBe('₹4.80L');
    expect(formatINRShort(11320000)).toBe('₹1.13Cr');
  });

  it('falls back to full formatting below one lakh', () => {
    expect(formatINRShort(24999)).toBe('₹24,999');
  });

  it('renders null/undefined as an em dash', () => {
    expect(formatINRShort(null)).toBe('—');
  });
});
