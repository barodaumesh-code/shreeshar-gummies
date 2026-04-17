'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2 } from 'lucide-react';

type Props = {
  orderId: string;
  currentStatus: string;
  currentTracking: string | null;
  currentCarrier: string | null;
  currentNotes: string | null;
};

const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const CARRIERS = ['', 'USPS', 'UPS', 'FedEx', 'DHL', 'India Post', 'Blue Dart', 'Delhivery', 'Other'];

export default function OrderStatusEditor({
  orderId,
  currentStatus,
  currentTracking,
  currentCarrier,
  currentNotes,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(currentTracking || '');
  const [carrier, setCarrier] = useState(currentCarrier || '');
  const [notes, setNotes] = useState(currentNotes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        tracking_number: tracking || null,
        carrier: carrier || null,
        notes: notes || null,
      }),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to save');
    }
    setSaving(false);
  }

  // quick-action: mark paid → processing, or processing → shipped
  async function handleQuickAction(nextStatus: string) {
    setStatus(nextStatus);
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: nextStatus,
        tracking_number: tracking || null,
        carrier: carrier || null,
        notes: notes || null,
      }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="bg-white border border-ink/10 rounded-sm">
      <div className="px-5 py-3 border-b border-ink/10 flex items-center justify-between">
        <h2 className="font-display text-lg italic">Fulfillment</h2>
        {saved && (
          <span className="text-xs text-moss flex items-center gap-1">
            <CheckCircle2 size={14} /> Saved
          </span>
        )}
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Quick actions */}
        {(currentStatus === 'paid' || currentStatus === 'processing') && (
          <div className="flex gap-2">
            {currentStatus === 'paid' && (
              <button
                onClick={() => handleQuickAction('processing')}
                disabled={saving}
                className="text-xs tracking-wider uppercase px-3 py-2 bg-ink text-bone rounded-full hover:bg-moss disabled:opacity-50"
              >
                Start Fulfillment
              </button>
            )}
            {currentStatus === 'processing' && tracking && carrier && (
              <button
                onClick={() => handleQuickAction('shipped')}
                disabled={saving}
                className="text-xs tracking-wider uppercase px-3 py-2 bg-moss text-bone rounded-full hover:opacity-90 disabled:opacity-50"
              >
                Mark as Shipped
              </button>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs tracking-widest uppercase mb-2 text-ink-60">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2 text-ink-60">
              Carrier
            </label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="input-field"
            >
              {CARRIERS.map((c) => (
                <option key={c} value={c}>
                  {c || '—'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2 text-ink-60">
              Tracking #
            </label>
            <input
              type="text"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="1Z999AA10123456784"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase mb-2 text-ink-60">
            Internal notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Private notes (customer won't see)"
            className="input-field resize-none"
          />
        </div>

        {error && (
          <div className="text-sm text-rust bg-rust/5 px-3 py-2 rounded-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full justify-center text-xs"
        >
          <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
