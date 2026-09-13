'use client';

import { useActionState } from 'react';
import { auditorLogin, type LoginState } from '@/lib/actions/auth';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';

const initialState: LoginState = {};

export function AuditorLoginForm() {
  const [state, formAction, pending] = useActionState(auditorLogin, initialState);

  return (
    <form
      action={formAction}
      style={{
        width: '100%',
        maxWidth: 280,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        textAlign: 'left',
      }}
    >
      <TextInput
        label="Email"
        name="email"
        type="email"
        defaultValue={state.email}
        placeholder="riya.sharma@fnbcontroller.com"
        required
      />
      <TextInput label="Password" name="password" type="password" placeholder="••••••••" required />
      {state.error && (
        <div style={{ fontSize: 12, color: 'var(--status-fail-fg-app)', fontWeight: 600 }}>{state.error}</div>
      )}
      <Button type="submit" disabled={pending} style={{ marginTop: 'var(--space-2)', padding: 13, fontSize: 14 }}>
        {pending ? 'Signing in…' : 'Log In'}
      </Button>
    </form>
  );
}
