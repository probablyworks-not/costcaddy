// C3 — ported verbatim from Super Admin Flow.dc.html's CATEGORY_RULES/classify
// (~line 1759). The deterministic floor for every finding: 10 keyword rules over
// `label + remark`, falling back to Operational Control / Medium when nothing matches.
// Pure and LLM-free — "LLM never computes" extends here to "the classifier isn't an
// LLM call either," since the category/severity/SLA/ownership must be the same every
// time the same checkpoint fails, not a matter of a model's mood.

export type Severity = 'High' | 'Medium' | 'Low';

export interface Finding {
  category: string;
  severity: Severity;
  impact: string;
  correctiveAction: string;
  sla: string;
  ownership: string;
}

interface CategoryRule {
  keywords: string[];
  category: string;
  severity: Severity;
  impact: string;
  correctiveAction: string;
  sla: string;
  ownership: string;
}

// Severity is High/Medium/Low only (R7, UX-006) — the mock's 'Critical' rows are
// downgraded to 'High' here rather than ported as a fourth value.
const CATEGORY_RULES: CategoryRule[] = [
  {
    keywords: ['temperature', 'cold', 'fridge', 'freezer', 'chiller'],
    category: 'Temperature & Expiry',
    severity: 'High',
    impact: 'Accelerated food spoilage, pathogen multiplication, and risk of serving compromised ingredients to patrons.',
    correctiveAction:
      'Calibrate the unit to safe operating limits (below 4°C), mount a visible physical thermometer, and initiate mandatory twice-daily temperature monitoring logs.',
    sla: 'Immediate (24 Hours)',
    ownership: 'Sous Chef / Kitchen Team',
  },
  {
    keywords: ['raw', 'cross', 'contamin', 'storage', 'stored'],
    category: 'Food Safety Risk',
    severity: 'High',
    impact: 'High risk of foodborne illness, pathogen cross-contamination, and regulatory closure.',
    correctiveAction:
      'Segregate the inventory immediately — separate raw meats from ready-to-eat and dairy products using dedicated units or clearly partitioned zones with strict raw vs. cooked storage rules.',
    sla: 'Immediate (24 Hours)',
    ownership: 'Kitchen Supervisor / Chef',
  },
  {
    keywords: ['label', 'fifo', 'expiry', 'expired', 'date'],
    category: 'Inventory Control',
    severity: 'High',
    impact: 'Expired or unlabelled stock enters production, creating consumer safety exposure and untracked wastage.',
    correctiveAction: 'Discard flagged stock on sight, reinstate date-labelling at receiving, and run a daily FIFO sweep signed off by the store keeper.',
    sla: 'Within 24 Hours',
    ownership: 'Store Keeper / Head Chef',
  },
  {
    keywords: ['hygiene', 'clean', 'grease', 'grooming', 'glove', 'hairnet', 'wipe'],
    category: 'Hygiene Standards',
    severity: 'High',
    impact: 'Bacterial breeding grounds, physical contamination of processed food, and standard operating failure.',
    correctiveAction:
      'Implement a strict daily deep-sanitation checklist, degrease small appliances after every operational shift, and replace soiled cloth wipes with sanitised microfibre or disposables.',
    sla: 'Within 24 Hours',
    ownership: 'Stewarding Head / Kitchen Crew',
  },
  {
    keywords: ['waste', 'bin', 'disposal', 'pest'],
    category: 'Statutory Compliance',
    severity: 'Medium',
    impact: 'Non-compliance with municipal waste norms and elevated pest-attraction risk at the service perimeter.',
    correctiveAction: 'Install labelled segregated bins at the service exit and retrain stewarding staff on the segregation policy.',
    sla: 'Within 5 Business Days',
    ownership: 'Stewarding Head',
  },
  {
    keywords: ['fire', 'extinguish', 'safety equipment', 'exit'],
    category: 'Statutory Compliance',
    severity: 'High',
    impact: 'Life-safety exposure and direct breach of fire-licence conditions.',
    correctiveAction: 'Service or replace the flagged equipment through the licensed vendor and re-tag with current inspection dates.',
    sla: 'Immediate (24 Hours)',
    ownership: 'Facility Manager',
  },
  {
    keywords: ['bill', 'sign-off', 'edit', 'void'],
    category: 'Revenue Control',
    severity: 'High',
    impact: 'Unauthorised bill edits create revenue leakage risk and weaken audit trail integrity.',
    correctiveAction: 'Enforce mandatory manager sign-off on every bill edit before closure and retrain billing staff on the exception workflow.',
    sla: 'Within 48 Hours',
    ownership: 'Restaurant Manager / Billing Team',
  },
  {
    keywords: ['discount', 'comp', 'waiver', 'non-chargeable'],
    category: 'Revenue Control',
    severity: 'Medium',
    impact: 'Discounts and comps above policy threshold erode net margin if left unchecked across outlets.',
    correctiveAction: 'Review the flagged bills with the manager on duty, confirm approvals were obtained, and recalibrate the POS discount alert threshold.',
    sla: 'Within 5 Business Days',
    ownership: 'Restaurant Manager',
  },
  {
    keywords: ['cancel', 'reason code'],
    category: 'Revenue Control',
    severity: 'High',
    impact: 'Missing reason codes obscure root causes and prevent SOP corrective tracking.',
    correctiveAction: 'Make reason codes mandatory at cancellation in the POS and review the cancellation log daily at shift close.',
    sla: 'Within 48 Hours',
    ownership: 'Restaurant Manager',
  },
  {
    keywords: ['stock', 'purchase', 'invoice', 'vendor', 'gst', 'weigh'],
    category: 'Inventory Control',
    severity: 'Medium',
    impact: 'Financial leakage, loss of variance tracking, and supplier unaccountability.',
    correctiveAction:
      'Procure and calibrate a commercial weighing scale, and enforce a mandatory item verification and weight-check log for all incoming raw material before vendor deliveries are accepted.',
    sla: 'Within 48 Hours',
    ownership: 'Store Keeper / Head Chef',
  },
];

const FALLBACK: Finding = {
  category: 'Operational Control',
  severity: 'Medium',
  impact: 'Deviation from the documented SOP, reducing operational consistency across shifts.',
  correctiveAction: 'Brief the shift team on the SOP clause, correct the deviation, and verify at the next audit cycle.',
  sla: 'Within 5 Business Days',
  ownership: 'Restaurant Manager',
};

export function classifyFinding(label: string, remark: string): Finding {
  const text = `${label} ${remark}`.toLowerCase();
  const rule = CATEGORY_RULES.find((r) => r.keywords.some((k) => text.includes(k)));
  if (!rule) return { ...FALLBACK };
  const { category, severity, impact, correctiveAction, sla, ownership } = rule;
  return { category, severity, impact, correctiveAction, sla, ownership };
}
