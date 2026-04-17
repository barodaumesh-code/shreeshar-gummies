'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductActiveToggle({
  productId,
  initialActive,
}: {
  productId: string;
  initialActive: boolean;
}) {
  const [active, setActive] = useState(initialActive);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function toggle() {
    setSaving(true);
    const newValue = !active;
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: newValue }),
    });
    if (res.ok) {
      setActive(newValue);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0 ${
        active ? 'bg-moss' : 'bg-ink/20'
      } disabled:opacity-50`}
      title={active ? 'Active' : 'Hidden'}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
          active ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
