import { createAdminClient } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, Package, TrendingUp, Users, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

type Status = 'all' | 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: Status; q?: string };
}) {
  const status = (searchParams.status || 'all') as Status;
  const q = searchParams.q?.trim() || '';

  const supabase = createAdminClient();

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (status !== 'all') query = query.eq('status', status);
  if (q) query = query.or(`order_number.ilike.%${q}%,customer_email.ilike.%${q}%`);

  const { data: orders } = await query;

  // Stats
  const { data: allOrders } = await supabase
    .from('orders')
    .select('status, total_cents, payment_status, customer_email');

  const stats = {
    total: allOrders?.length || 0,
    paid: allOrders?.filter((o) => o.payment_status === 'paid').length || 0,
    revenue:
      allOrders
        ?.filter((o) => o.payment_status === 'paid')
        .reduce((s, o) => s + (o.total_cents || 0), 0) || 0,
    customers: new Set(allOrders?.map((o) => o.customer_email)).size || 0,
    toFulfill: allOrders?.filter((o) => o.status === 'paid' || o.status === 'processing').length || 0,
  };

  const statusTabs: { key: Status; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'paid', label: 'To Fulfill', count: stats.toFulfill },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'refunded', label: 'Refunded' },
    { key: 'pending', label: 'Pending' },
  ];

  return (
    <div>
      <div className="mb-10">
        <div className="divider-label max-w-[120px] mb-4">Dashboard</div>
        <h1 className="font-display text-5xl italic font-light mb-2">Orders</h1>
        <p className="text-sm text-ink-60">Manage, fulfill, and track every order.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<DollarSign size={18} strokeWidth={1.5} />}
          label="Revenue"
          value={formatPrice(stats.revenue)}
        />
        <StatCard
          icon={<Package size={18} strokeWidth={1.5} />}
          label="Orders"
          value={String(stats.total)}
        />
        <StatCard
          icon={<TrendingUp size={18} strokeWidth={1.5} />}
          label="To Fulfill"
          value={String(stats.toFulfill)}
          highlight
        />
        <StatCard
          icon={<Users size={18} strokeWidth={1.5} />}
          label="Customers"
          value={String(stats.customers)}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 mb-6 pb-3">
        {statusTabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === 'all' ? '/admin/orders' : `/admin/orders?status=${tab.key}`}
            className={`text-xs tracking-wider uppercase px-3 py-1.5 rounded-full transition ${
              status === tab.key
                ? 'bg-ink text-bone'
                : 'text-ink-60 hover:text-ink hover:bg-cream/60'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 opacity-60">({tab.count})</span>
            )}
          </Link>
        ))}

        <form action="/admin/orders" method="get" className="ml-auto">
          {status !== 'all' && <input type="hidden" name="status" value={status} />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search order # or email"
            className="text-xs px-3 py-1.5 border border-ink/15 rounded-full w-56 focus:outline-none focus:border-ink"
          />
        </form>
      </div>

      {/* Orders table */}
      {!orders || orders.length === 0 ? (
        <div className="bg-cream/40 rounded-sm p-16 text-center">
          <Package size={40} strokeWidth={1} className="mx-auto text-ink/30 mb-4" />
          <p className="font-display text-2xl italic mb-2">No orders yet</p>
          <p className="text-sm text-ink-60">
            Orders will appear here once your first customer checks out.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-ink/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/40 text-[11px] tracking-widest uppercase text-ink-60">
                <tr>
                  <th className="text-left px-5 py-4">Order</th>
                  <th className="text-left px-5 py-4">Date</th>
                  <th className="text-left px-5 py-4">Customer</th>
                  <th className="text-left px-5 py-4">Status</th>
                  <th className="text-left px-5 py-4">Payment</th>
                  <th className="text-right px-5 py-4">Total</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream/20 transition">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-mono text-xs font-medium hover:text-moss"
                      >
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-ink-60 text-xs">
                      {formatDate(o.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium">{o.customer_name || '—'}</div>
                      <div className="text-xs text-ink-60">{o.customer_email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge badge-${o.status}`}>{o.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge badge-${o.payment_status === 'paid' ? 'paid' : o.payment_status === 'refunded' ? 'refunded' : 'pending'}`}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-medium">
                      {formatPrice(o.total_cents)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-ink-60 hover:text-ink"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-sm border ${
        highlight
          ? 'bg-moss text-bone border-moss'
          : 'bg-white border-ink/10'
      }`}
    >
      <div
        className={`flex items-center gap-2 text-[11px] tracking-widest uppercase mb-3 ${
          highlight ? 'opacity-80' : 'text-ink-60'
        }`}
      >
        {icon}
        {label}
      </div>
      <div className="font-display text-3xl italic">{value}</div>
    </div>
  );
}
