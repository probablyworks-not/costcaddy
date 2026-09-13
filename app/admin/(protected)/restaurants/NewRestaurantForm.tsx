'use client';

import { useActionState, useEffect, useState } from 'react';
import { createRestaurant, type CreateRestaurantState } from '@/lib/actions/restaurants';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';

const initialState: CreateRestaurantState = {};

// A2: the "+ New Restaurant" button lives in the header row and stays visible whether
// the panel is open or not (Super Admin Flow.dc.html:399-404) — it's the same toggle,
// not swapped out for the form. The panel itself has no Cancel; the toggle button closes
// it (:1566), and a successful create closes it too, resetting the fields (:1572).
export function NewRestaurantForm() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-10)',
          gap: 'var(--space-8)',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-ui-title)', fontSize: 'var(--text-screen-title)', fontWeight: 600 }}>
            Restaurants
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
            Create a restaurant, then run audits under it
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => setOpen((v) => !v)}
          style={{ border: '1px solid var(--ink)', color: 'var(--ink)', padding: '10px 16px' }}
        >
          + New Restaurant
        </Button>
      </div>

      {open && (
        <RestaurantForm
          key={formKey}
          onCreated={() => {
            setOpen(false);
            setFormKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}

function RestaurantForm({ onCreated }: { onCreated: () => void }) {
  const [state, formAction, pending] = useActionState(createRestaurant, initialState);

  useEffect(() => {
    if (state.created) onCreated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.created]);

  return (
    <form
      action={formAction}
      style={{
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-8)',
        marginBottom: 'var(--space-10)',
        background: 'var(--surface-alt-2)',
        display: 'flex',
        gap: 'var(--space-6)',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
      }}
    >
      <TextInput label="Restaurant name" name="name" placeholder="e.g. Harbour House" required style={{ flex: 1, minWidth: 200 }} />
      <TextInput label="Location" name="city" placeholder="e.g. Bandra, Mumbai" style={{ flex: 1, minWidth: 160 }} />
      <Button type="submit" disabled={pending}>
        {pending ? 'Creating…' : 'Create'}
      </Button>
      {state.error && (
        <div style={{ width: '100%', fontSize: 12, color: 'var(--status-fail-fg-app)', fontWeight: 600 }}>
          {state.error}
        </div>
      )}
    </form>
  );
}
