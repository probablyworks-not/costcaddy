import type { MetricDef, MetricUnit, MetricValues } from './types';
import { computeMetrics, metricDen } from './metrics';
import { formatINR } from './currency';

export type MetricSectionRow =
  | {
      kind: 'input';
      key: string;
      metricKey: string;
      label: string;
      unit: MetricUnit | null | undefined;
      sub: string;
      subLabel: string;
    }
  | {
      kind: 'derived';
      key: string;
      label: string;
      display: string;
      sub: string;
      subLabel: string;
    };

export interface MetricSectionGroup {
  key: string;
  title: string;
  note: string;
  rows: MetricSectionRow[];
}

// Ported verbatim from Super Admin Flow.dc.html's metricSections (~line 1940) — the
// grouped-panel layout (title/note per section, one input row per MetricDef, one
// derived total row) that drives both the auditor's Metrics step (B2) and the
// reviewer's as-captured view (C1). Never recomputes a figure itself — every value
// comes from computeMetrics (F7); this only shapes rows for display.
export function metricSections(defs: MetricDef[], values: MetricValues | null | undefined): MetricSectionGroup[] {
  const c = computeMetrics(defs, values);
  const covers = c.covers;
  const money = (n: number | null) => formatINR(n);
  const apc = (n: number | null) => (n !== null && covers ? formatINR(n / covers) : '—');
  const pct = (n: number | null, d: number | null) => (n !== null && d ? ((n / d) * 100).toFixed(2) + '%' : '—');

  const inSec = (sec: MetricDef['section']) => defs.filter((d) => d.section === sec);

  const inputRow = (d: MetricDef, sub = '—', subLabel = ''): MetricSectionRow => ({
    kind: 'input',
    key: d.id,
    metricKey: d.id,
    label: d.label,
    unit: d.unit,
    sub,
    subLabel,
  });
  const derivedRow = (
    key: string,
    label: string,
    val: number | null,
    isCount = false,
    sub = '—',
    subLabel = '',
  ): MetricSectionRow => ({
    kind: 'derived',
    key,
    label,
    display: isCount ? (val === null ? '—' : String(Math.round(val))) : money(val),
    sub,
    subLabel,
  });

  const out: MetricSectionGroup[] = [];

  const coverRows = inSec('covers');
  if (coverRows.length) {
    out.push({
      key: 'covers',
      title: 'Covers',
      note: 'Month-to-date only',
      rows: [...coverRows.map((d) => inputRow(d)), derivedRow('total-covers', 'TOTAL NO OF PAX', covers, true)],
    });
  }

  const salesRows = inSec('sales');
  if (salesRows.length) {
    out.push({
      key: 'sales',
      title: 'MTD Total Net Sale',
      note: 'APC calculated per cover',
      rows: [
        ...salesRows.map((d) => inputRow(d, apc(c.byId[d.id]), 'APC')),
        derivedRow('total-sales', 'NET SALES AT RESTAURANT', c.netSale, false, apc(c.netSale), 'APC'),
      ],
    });
  }

  const discountRows = inSec('discount');
  if (discountRows.length) {
    out.push({
      key: 'discount',
      title: 'Discounts',
      note: 'Deducted from gross sale',
      rows: [...discountRows.map((d) => inputRow(d)), derivedRow('total-discounts', 'TOTAL DISCOUNTS', c.totalDiscounts)],
    });
  }

  const taxRows = inSec('tax');
  if (taxRows.length) {
    out.push({
      key: 'tax',
      title: 'Charges & Taxes',
      note: '',
      rows: [
        ...taxRows.map((d) => inputRow(d)),
        derivedRow('total-taxes', 'Total Taxes', c.totalTaxes),
        derivedRow('total-gross', 'TOTAL GROSS SALE', c.grossSale, false, apc(c.grossSale), 'APC'),
      ],
    });
  }

  const costRows = inSec('cost');
  if (costRows.length) {
    const rows: MetricSectionRow[] = [];
    const barRows = costRows.filter((d) => d.group === 'bar');
    barRows.forEach((d) => rows.push(inputRow(d, pct(c.byId[d.id], metricDen(c, d.den)))));
    if (barRows.length) {
      rows.push(derivedRow('total-bar-cost', 'TOTAL BAR COST', c.barCost, false, pct(c.barCost, c.barSale)));
    }
    const kitchenRows = costRows.filter((d) => d.group === 'kitchen');
    kitchenRows.forEach((d) => rows.push(inputRow(d, pct(c.byId[d.id], metricDen(c, d.den)))));
    if (kitchenRows.length) {
      rows.push(derivedRow('total-kitchen-cost', 'TOTAL KITCHEN COST', c.kitchenCost, false, pct(c.kitchenCost, c.kitchenSale)));
    }
    rows.push(derivedRow('total-fnb-cost', 'TOTAL F&B COST', c.fnbCost, false, pct(c.fnbCost, c.netSale)));
    const ncRows = costRows.filter((d) => d.group === 'nc');
    ncRows.forEach((d) => rows.push(inputRow(d, pct(c.byId[d.id], metricDen(c, d.den)))));
    rows.push(derivedRow('total-net-fnb-cost', 'TOTAL NET F&B COST', c.netFnbCost, false, pct(c.netFnbCost, c.netSale)));
    out.push({ key: 'cost', title: 'Costing', note: 'Cost % against the matching revenue line', rows });
  }

  return out;
}
