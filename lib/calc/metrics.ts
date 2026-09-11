import type { ComputedMetrics, MetricDef, MetricValues } from './types';

// Ported verbatim from Super Admin Flow.dc.html's mtdNum (~line 1901).
export function parseMetricValue(v: unknown): number | null {
  if (v === null || v === undefined || String(v).trim() === '') return null;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isNaN(n) ? null : n;
}

// The derived cascade, ported verbatim from Super Admin Flow.dc.html's computeMetrics
// (~line 1908) — see EXECUTION.md F7 for the formulas. Calculated is never typed: this
// is the only place a total is derived (invariant). Nulls propagate: a group with no
// entered values sums to null, never 0 — callers format that as "—", never "₹0".
export function computeMetrics(defs: MetricDef[], values: MetricValues | null | undefined): ComputedMetrics {
  const vals = values ?? {};
  const get = (id: string) => parseMetricValue(vals[id]);
  const inSection = (section: MetricDef['section']) => defs.filter((d) => d.section === section);

  const sum = (list: MetricDef[]): number | null => {
    let total: number | null = null;
    list.forEach((d) => {
      const n = get(d.id);
      if (n !== null) total = (total === null ? 0 : total) + n;
    });
    return total;
  };

  const add = (a: number | null, b: number | null): number | null =>
    a === null && b === null ? null : (a || 0) + (b || 0);

  const covers = sum(inSection('covers'));

  const salesRows = inSection('sales');
  const netSale = sum(salesRows);
  const barSale = sum(salesRows.filter((d) => d.revGroup === 'bar'));
  const kitchenSale = sum(salesRows.filter((d) => d.revGroup !== 'bar'));

  const discountRows = inSection('discount');
  const totalDiscounts = sum(discountRows);

  const taxRows = inSection('tax');
  const totalTaxes = sum(taxRows.filter((d) => d.kind !== 'charge'));
  const totalCharges = sum(taxRows.filter((d) => d.kind === 'charge'));

  const grossInner = add(add(netSale, totalCharges), totalTaxes);
  const grossSale =
    netSale === null && totalTaxes === null && totalCharges === null && totalDiscounts === null
      ? null
      : (grossInner ?? 0) - (totalDiscounts || 0);

  const costRows = inSection('cost');
  const barCost = sum(costRows.filter((d) => d.group === 'bar'));
  const kitchenCost = sum(costRows.filter((d) => d.group === 'kitchen'));
  const ncCost = sum(costRows.filter((d) => d.group === 'nc'));
  const fnbCost = barCost === null && kitchenCost === null ? null : add(barCost, kitchenCost);
  const netFnbCost = fnbCost === null ? null : fnbCost - (ncCost || 0);

  const byId: Record<string, number | null> = {};
  defs.forEach((d) => {
    byId[d.id] = get(d.id);
  });

  return {
    byId,
    covers,
    netSale,
    barSale,
    kitchenSale,
    totalDiscounts,
    totalTaxes,
    totalCharges,
    grossSale,
    barCost,
    kitchenCost,
    ncCost,
    fnbCost,
    netFnbCost,
  };
}

// Ported verbatim from Super Admin Flow.dc.html's metricDen (~line 1933) — resolves a
// cost row's % denominator: the fixed net/bar/kitchen sale, or another metric's own value.
export function metricDen(computed: ComputedMetrics, den: string | null | undefined): number | null {
  if (!den) return null;
  if (den === 'net') return computed.netSale;
  if (den === 'bar') return computed.barSale;
  if (den === 'kitchen') return computed.kitchenSale;
  return computed.byId[den] === undefined ? null : computed.byId[den];
}
