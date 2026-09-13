// A report-surface value that is either present or explicitly missing. Never collapse
// a missing figure to 0 — CLAUDE.md invariant "N/A is neither fail nor blank" has a
// financial-reporting counterpart here: "no data" reaches the report as 'needs-data',
// never as ₹0 (EXECUTION.md C2 done-when).
export type ReportFigure = { status: 'ok'; value: number } | { status: 'needs-data' };

export const NEEDS_DATA: ReportFigure = { status: 'needs-data' };

export function figure(value: number | null | undefined): ReportFigure {
  return value === null || value === undefined ? NEEDS_DATA : { status: 'ok', value };
}

export function figureValue(f: ReportFigure): number | null {
  return f.status === 'ok' ? f.value : null;
}

export function addFigures(a: ReportFigure, b: ReportFigure): ReportFigure {
  return a.status === 'ok' && b.status === 'ok' ? figure(a.value + b.value) : NEEDS_DATA;
}

export function subtractFigures(a: ReportFigure, b: ReportFigure): ReportFigure {
  return a.status === 'ok' && b.status === 'ok' ? figure(a.value - b.value) : NEEDS_DATA;
}

export function multiplyFigures(a: ReportFigure, b: ReportFigure): ReportFigure {
  return a.status === 'ok' && b.status === 'ok' ? figure(a.value * b.value) : NEEDS_DATA;
}

// A ratio needs both sides present and a non-zero denominator — dividing by an absent
// or zero total isn't "the answer is 0", it's "we can't answer yet".
export function divideFigures(a: ReportFigure, b: ReportFigure): ReportFigure {
  if (a.status !== 'ok' || b.status !== 'ok' || b.value === 0) return NEEDS_DATA;
  return figure(a.value / b.value);
}

export function percentFigure(part: ReportFigure, whole: ReportFigure): ReportFigure {
  const ratio = divideFigures(part, whole);
  return ratio.status === 'ok' ? figure(ratio.value * 100) : NEEDS_DATA;
}
