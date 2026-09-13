import type { MetricDef, MetricValues } from '@/lib/calc/types';
import { computeMetrics, parseMetricValue } from '@/lib/calc/metrics';
import {
  addFigures,
  divideFigures,
  figure,
  multiplyFigures,
  percentFigure,
  subtractFigures,
  type ReportFigure,
} from './figure';

// C2 — a pure (auditSnapshot, operationalImports) → reportDraft module built ON TOP OF
// F7's computeMetrics, never reimplementing its cascade. F7 gives audit-wide totals
// (netSale, barSale, kitchenSale, totalTaxes, totalCharges, totalDiscounts, grossSale,
// bar/kitchen/nc cost); this module's only new arithmetic is the per-revenue-group
// breakdown Audit report v4.dc.html §1's matrix needs — taxes and service charge
// allocated pro-rata on each group's share of net sales, same formula the report's own
// note states ("taxes/service-charge allocated pro-rata on net sales; APC on covers").
// No I/O: callers (C1's review screen, later C3/C4) load defs/values/files themselves.

export type RevenueGroupKey = 'kitchen' | 'bar';

export interface RevenueGroupTotals {
  label: string;
  sales: ReportFigure;
  discount: ReportFigure;
  netSales: ReportFigure; // report's own concept: sales − discount, not F7's `netSale` field
  taxes: ReportFigure;
  serviceCharge: ReportFigure;
  grossSale: ReportFigure; // netSales + taxes + serviceCharge
  apc: ReportFigure; // grossSale / covers
}

export interface RevenueGroupRow extends RevenueGroupTotals {
  key: RevenueGroupKey;
}

export interface FinancialDraftKpis {
  covers: ReportFigure;
  grossSale: ReportFigure;
  netSale: ReportFigure; // F7's own field: Σ sales rows, pre-discount
  barSale: ReportFigure;
  kitchenSale: ReportFigure;
  totalDiscounts: ReportFigure;
  totalTaxes: ReportFigure;
  totalCharges: ReportFigure;
  apcGross: ReportFigure;
  apcNet: ReportFigure;
}

export interface CostingDraft {
  barCost: ReportFigure;
  kitchenCost: ReportFigure;
  ncCost: ReportFigure;
  fnbCost: ReportFigure;
  netFnbCost: ReportFigure;
  barCostPct: ReportFigure; // of barSale
  kitchenCostPct: ReportFigure; // of kitchenSale
  fnbCostPct: ReportFigure; // of netSale
  netFnbCostPct: ReportFigure; // of netSale
}

export interface OperationalFileSummary {
  type: string;
  period: string;
  parsed: boolean;
  coverageSummary: string | null;
}

export interface FinancialReportDraft {
  kpis: FinancialDraftKpis;
  revenueMatrix: { rows: RevenueGroupRow[]; total: RevenueGroupTotals };
  costing: CostingDraft;
  operationalFiles: OperationalFileSummary[];
}

// Null-propagating sum over a list of metric ids, mirroring F7's own `sum` (an
// all-missing list is 'needs-data', never 0; present values add up as they are).
function sumFigure(defs: MetricDef[], values: MetricValues, ids: string[]): ReportFigure {
  let total: number | null = null;
  for (const id of ids) {
    const n = parseMetricValue(values[id]);
    if (n !== null) total = (total ?? 0) + n;
  }
  return figure(total);
}

function buildGroupRow(
  key: RevenueGroupKey,
  label: string,
  defs: MetricDef[],
  values: MetricValues,
  groupSales: ReportFigure,
  totalNetSaleAcrossGroups: ReportFigure,
  totalDiscounts: ReportFigure,
  totalTaxes: ReportFigure,
  totalCharges: ReportFigure,
  covers: ReportFigure,
): RevenueGroupRow {
  const discountRows = defs.filter((d) => d.section === 'discount');
  const taggedIds = discountRows.filter((d) => d.revGroup === key).map((d) => d.id);
  const untaggedIds = discountRows.filter((d) => !d.revGroup).map((d) => d.id);

  const taggedDiscount = sumFigure(defs, values, taggedIds);
  const share = divideFigures(groupSales, totalNetSaleAcrossGroups);
  const untaggedTotal = sumFigure(defs, values, untaggedIds);
  const allocatedUntagged = multiplyFigures(untaggedTotal, share);

  // A group's discount is "needs data" only when neither a direct tag nor a share of
  // the untagged pool can be resolved — not just because one of the two is absent.
  const discount: ReportFigure =
    taggedDiscount.status === 'ok' || allocatedUntagged.status === 'ok'
      ? figure((taggedDiscount.status === 'ok' ? taggedDiscount.value : 0) + (allocatedUntagged.status === 'ok' ? allocatedUntagged.value : 0))
      : discountRows.length === 0
        ? figure(0) // template has no discount metrics at all — nothing to allocate, not missing data
        : { status: 'needs-data' };

  const taxes = multiplyFigures(totalTaxes, share);
  const serviceCharge = multiplyFigures(totalCharges, share);
  const netSales = subtractFigures(groupSales, discount);
  const grossSale = addFigures(addFigures(netSales, taxes), serviceCharge);
  const apc = divideFigures(grossSale, covers);

  return { key, label, sales: groupSales, discount, netSales, taxes, serviceCharge, grossSale, apc };
}

export function buildFinancialReportDraft(
  defs: MetricDef[],
  values: MetricValues | null | undefined,
  operationalFiles: OperationalFileSummary[],
): FinancialReportDraft {
  const vals = values ?? {};
  const c = computeMetrics(defs, vals);

  const covers = figure(c.covers);
  const netSale = figure(c.netSale);
  const barSale = figure(c.barSale);
  const kitchenSale = figure(c.kitchenSale);
  const totalDiscounts = figure(c.totalDiscounts);
  const totalTaxes = figure(c.totalTaxes);
  const totalCharges = figure(c.totalCharges);
  const grossSale = figure(c.grossSale);

  const rows: RevenueGroupRow[] = [];
  const hasKitchenSales = defs.some((d) => d.section === 'sales' && d.revGroup !== 'bar');
  const hasBarSales = defs.some((d) => d.section === 'sales' && d.revGroup === 'bar');
  if (hasKitchenSales) {
    rows.push(buildGroupRow('kitchen', 'Kitchen', defs, vals, kitchenSale, netSale, totalDiscounts, totalTaxes, totalCharges, covers));
  }
  if (hasBarSales) {
    rows.push(buildGroupRow('bar', 'Bar', defs, vals, barSale, netSale, totalDiscounts, totalTaxes, totalCharges, covers));
  }

  const total: RevenueGroupTotals = {
    label: 'Total',
    sales: netSale,
    discount: totalDiscounts,
    netSales: subtractFigures(netSale, totalDiscounts),
    taxes: totalTaxes,
    serviceCharge: totalCharges,
    grossSale,
    apc: divideFigures(grossSale, covers),
  };

  const barCost = figure(c.barCost);
  const kitchenCost = figure(c.kitchenCost);
  const ncCost = figure(c.ncCost);
  const fnbCost = figure(c.fnbCost);
  const netFnbCost = figure(c.netFnbCost);

  return {
    kpis: {
      covers,
      grossSale,
      netSale,
      barSale,
      kitchenSale,
      totalDiscounts,
      totalTaxes,
      totalCharges,
      apcGross: divideFigures(grossSale, covers),
      apcNet: divideFigures(netSale, covers),
    },
    revenueMatrix: { rows, total },
    costing: {
      barCost,
      kitchenCost,
      ncCost,
      fnbCost,
      netFnbCost,
      barCostPct: percentFigure(barCost, barSale),
      kitchenCostPct: percentFigure(kitchenCost, kitchenSale),
      fnbCostPct: percentFigure(fnbCost, netSale),
      netFnbCostPct: percentFigure(netFnbCost, netSale),
    },
    operationalFiles,
  };
}
