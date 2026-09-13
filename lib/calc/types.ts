// Mirrors the design file's MetricDef field names exactly (Super Admin Flow.dc.html
// DEFAULT_METRICS, ~line 1283) — computeMetrics is a verbatim port and reads these
// same fields, so callers map their own row shape (e.g. db/schema's templateMetrics,
// which uses `costGroup` to dodge the SQL-ish `group` name) onto this before calling in.
export type MetricSection = 'covers' | 'sales' | 'discount' | 'tax' | 'cost';
export type MetricRevGroup = 'bar' | 'kitchen';
export type MetricKind = 'tax' | 'charge';
export type MetricCostGroup = 'bar' | 'kitchen' | 'nc';
export type MetricUnit = 'currency' | 'count' | 'number' | 'percent';

export interface MetricDef {
  id: string;
  label: string;
  section: MetricSection;
  revGroup?: MetricRevGroup | null;
  kind?: MetricKind | null;
  group?: MetricCostGroup | null;
  den?: string | null; // 'net' | 'bar' | 'kitchen' | another MetricDef's id
  unit?: MetricUnit | null;
}

// Raw entered figures, keyed by MetricDef id — string as typed, or already-parsed
// number/null. Never a computed total (those come only from computeMetrics).
export type MetricValues = Record<string, string | number | null | undefined>;

export interface ComputedMetrics {
  byId: Record<string, number | null>;
  covers: number | null;
  netSale: number | null;
  barSale: number | null;
  kitchenSale: number | null;
  totalDiscounts: number | null;
  totalTaxes: number | null;
  totalCharges: number | null;
  grossSale: number | null;
  barCost: number | null;
  kitchenCost: number | null;
  ncCost: number | null;
  fnbCost: number | null;
  netFnbCost: number | null;
}
