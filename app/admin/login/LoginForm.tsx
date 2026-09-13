'use client';

import { useActionState } from 'react';
import { login, type LoginState } from '@/lib/actions/auth';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form
      action={formAction}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-7)', marginTop: 'var(--space-11)' }}
    >
      <TextInput
        label="Work email"
        name="email"
        type="email"
        defaultValue={state.email}
        placeholder="you@fnbcontroller.com"
        required
      />
      <TextInput label="Password" name="password" type="password" placeholder="••••••••" required />
      {state.error && (
        <div style={{ fontSize: 12, color: 'var(--status-fail-fg-app)', fontWeight: 600 }}>{state.error}</div>
      )}
      <Button
        type="submit"
        disabled={pending}
        style={{ marginTop: 'var(--space-2)', padding: 13, fontSize: 14 }}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
