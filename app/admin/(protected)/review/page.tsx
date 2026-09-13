import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { listReviewQueue } from '@/lib/queries/review';

export default async function ReviewQueuePage() {
  const admin = await requireRole('super_admin');
  const rows = await listReviewQueue(admin.orgId);

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-ui-title)', fontSize: 'var(--text-screen-title)', fontWeight: 600, marginBottom: 2 }}>
        Review Queue
      </div>
      <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 'var(--space-11)' }}>
        Submitted audits awaiting review &amp; publish
      </div>

      {rows.length === 0 ? (
        <div style={{ color: 'var(--placeholder)', fontSize: 14, padding: '20px 0' }}>Nothing waiting for review.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--divider)' }}>
          {rows.map((a) => (
            <Link
              key={a.id}
              href={`/admin/review/${a.id}`}
              style={{
                padding: '16px 4px',
                borderBottom: '1px solid var(--divider)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{a.outletName}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  Submitted by {a.auditorName} · Due {a.dueDate}
                </div>
              </div>
              <div style={{ fontSize: 13, textDecoration: 'underline' }}>Review</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
