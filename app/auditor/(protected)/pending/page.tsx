import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { AuditorShell } from '@/components/ui/AuditorShell';
import { ListRow } from '@/components/ui/ListRow';
import { OverdueMarker } from '@/components/ui/OverdueMarker';
import { listAuditorAudits, isOverdue, type AuditorAuditRow } from '@/lib/queries/audits';

const RESTAURANT_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--navy-700)" strokeWidth="1.8" style={{ flexShrink: 0 }}>
    <path d="M3 9l1-5h16l1 5" />
    <path d="M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9" />
    <path d="M9 20v-6h6v6" />
  </svg>
);

// B1 — pending list (screen key `pending`). Sorted by due date ascending; recently
// submitted sits below in its own section.
export default async function AuditorPendingPage() {
  const user = await getCurrentUser();
  if (!user) return null; // layout already redirects; narrows the type below

  const audits = await listAuditorAudits(user.orgId, user.id);
  const pending = audits
    .filter((a) => a.status === 'assigned' || a.status === 'in-progress')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const submittedHistory = audits
    .filter((a) => a.status === 'submitted' || a.status === 'published')
    .sort((a, b) => (b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0))
    .slice(0, 5);

  return (
    <AuditorShell>
      <div style={{ padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-ui-title)', fontSize: 'var(--text-panel-title)', fontWeight: 600 }}>
          Pending Audits
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2, marginBottom: 22 }}>{user.name}</div>

        {pending.length === 0 ? (
          <div style={{ color: 'var(--placeholder)', fontSize: 13, padding: '20px 0' }}>
            Nothing assigned to you right now.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--divider)' }}>
            {pending.map((a) => (
              <PendingRow key={a.id} audit={a} />
            ))}
          </div>
        )}

        {submittedHistory.length > 0 && (
          <>
            <div
              style={{
                fontSize: 12,
                color: 'var(--muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginTop: 30,
                marginBottom: 10,
              }}
            >
              Recently Submitted
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--divider)' }}>
              {submittedHistory.map((a) => (
                <HistoryRow key={a.id} audit={a} />
              ))}
            </div>
          </>
        )}
      </div>
    </AuditorShell>
  );
}

function PendingRow({ audit }: { audit: AuditorAuditRow }) {
  const overdue = isOverdue(audit);
  const chip = audit.status === 'in-progress' ? IN_PROGRESS_CHIP : ASSIGNED_CHIP;
  return (
    <Link href={`/auditor/checklist/${audit.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListRow
        icon={RESTAURANT_ICON}
        title={audit.outletName}
        meta={
          <>
            Due {audit.dueDate} · {audit.itemsDone} of {audit.itemsTotal} items
            {overdue && (
              <div style={{ marginTop: 6 }}>
                <OverdueMarker />
              </div>
            )}
          </>
        }
        status={<Chip {...chip} />}
      />
    </Link>
  );
}

function HistoryRow({ audit }: { audit: AuditorAuditRow }) {
  const chip = audit.status === 'published' ? PUBLISHED_CHIP : SUBMITTED_CHIP;
  return (
    <Link href={`/auditor/report/${audit.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListRow
        icon={RESTAURANT_ICON}
        title={audit.outletName}
        meta={
          <>
            Due {audit.dueDate}
            <PolishStatus state={audit.polishState} />
          </>
        }
        status={<Chip {...chip} />}
      />
    </Link>
  );
}

// B6 — the one status indicator this package adds outside the submit flow itself
// (reviewQueue gets its own copy of this once C1 exists).
function PolishStatus({ state }: { state: AuditorAuditRow['polishState'] }) {
  if (state === 'polishing') {
    return <div style={{ fontSize: 11, color: 'var(--hint)', marginTop: 3 }}>Polishing remarks…</div>;
  }
  if (state === 'failed') {
    return <div style={{ fontSize: 11, color: 'var(--status-observation-fg)', marginTop: 3 }}>Remarks kept as typed — polish failed</div>;
  }
  return null;
}

const ASSIGNED_CHIP = { bg: 'var(--surface)', color: 'var(--ink-3)', border: 'var(--border)', label: 'ASSIGNED' };
const IN_PROGRESS_CHIP = { bg: '#fffbeb', color: '#b45309', border: '#fde68a', label: 'IN PROGRESS' };
const SUBMITTED_CHIP = { bg: 'var(--navy-chip)', color: 'var(--navy-700)', border: 'var(--navy-border)', label: 'SUBMITTED' };
const PUBLISHED_CHIP = { bg: 'var(--navy-700)', color: 'var(--surface)', border: 'var(--navy-700)', label: 'PUBLISHED' };

function Chip({ bg, color, border, label }: { bg: string; color: string; border: string; label: string }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
        padding: '5px 9px',
        borderRadius: 'var(--radius-pill)',
        whiteSpace: 'nowrap',
        background: bg,
        color,
        border: `1px solid ${border}`,
      }}
    >
      {label}
    </div>
  );
}
