import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { auditorLogout } from '@/lib/actions/session';
import { AppHeader } from '@/components/ui/AppHeader';
import { RoleBadge } from '@/components/ui/RoleBadge';

// Gate for every /auditor/* screen except login (B1). One responsive component
// tree — layout differs mobile/laptop via CSS only (UX-001), never role or data.
export default async function AuditorLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'auditor') {
    redirect('/auditor/login');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <AppHeader>
        <RoleBadge>Auditor · {user.name}</RoleBadge>
        <form action={auditorLogout}>
          <button
            type="submit"
            style={{
              border: 'none',
              background: 'none',
              padding: 0,
              color: 'var(--muted)',
              fontSize: 12,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </form>
      </AppHeader>
      <div style={{ flex: 1, display: 'flex' }}>{children}</div>
    </div>
  );
}
