import { AuditorShell } from '@/components/ui/AuditorShell';
import { AuditorLoginForm } from './AuditorLoginForm';

// B1 — auditor sign-in (screen key `login`). Wrong credentials keep the email and
// show one message; valid credentials land on `pending`.
export default function AuditorLoginPage() {
  return (
    <AuditorShell>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 520,
          padding: '40px 32px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: 'var(--font-ui-title)', fontSize: 'var(--text-login-title)', fontWeight: 600, marginBottom: 6 }}>
          F&amp;B Controller
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 'var(--space-11)' }}>Auditor sign in</div>
        <AuditorLoginForm />
      </div>
    </AuditorShell>
  );
}
