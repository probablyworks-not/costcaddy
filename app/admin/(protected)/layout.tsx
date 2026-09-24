import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { logout } from '@/lib/actions/session';
import { AppHeader } from '@/components/ui/AppHeader';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { NavLinks } from './NavLinks';

// Gate for every /admin/* screen except login. Screen keys map 1:1 to route segments
// (ARCHITECTURE §6) — `dashboard` is the one dead key and is never routed to.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'super_admin') {
    redirect('/admin/login');
  }

  return (
    <div>
      <div data-noprint="">
        <AppHeader>
          <RoleBadge>Super Admin</RoleBadge>
        </AppHeader>
      </div>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 57px)' }}>
        <div
          data-noprint=""
          style={{
            width: 220,
            borderRight: '1px solid var(--divider)',
            padding: '20px 0',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: 'var(--text-eyebrow)',
              color: 'var(--muted-2)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '0 20px',
              marginBottom: 10,
            }}
          >
            Super Admin
          </div>
          <NavLinks />
          <div
            style={{
              marginTop: 'auto',
              padding: '16px 20px 0 20px',
              borderTop: '1px solid var(--surface-alt-1)',
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </div>
            <form action={logout}>
              <button
                type="submit"
                style={{
                  marginTop: 7,
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
          </div>
        </div>
        <main style={{ flex: 1, padding: 'var(--page-padding-desktop)', maxWidth: 1040 }}>{children}</main>
      </div>
    </div>
  );
}
