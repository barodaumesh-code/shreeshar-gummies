import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createAdminClient } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/lib/utils';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import OrderStatusEditor from '@/components/OrderStatusEditor';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  // Fetch product images for the items
  const slugs = (items || []).map((i) => i.product_slug).filter(Boolean) as string[];
  let products: { slug: string; image_url: string | null }[] = [];
  if (slugs.length > 0) {
    const { data } = await supabase
      .from('products')
      .select('slug, image_url')
      .in('slug', slugs);
    products = data || [];
  }

  const imageMap = new Map(products.map((p) => [p.slug, p.image_url]));

  const shipping = order.shipping_address || {};

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-xs tracking-widest uppercase text-ink-60 hover:text-ink inline-flex items-center gap-2 mb-6"
      >
        <ArrowLeft size={14} /> Back to orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-6 mb-10 pb-6 border-b border-ink/10">
        <div>
          <div className="divider-label max-w-[110px] mb-3">Order</div>
          <h1 className="font-display text-5xl italic font-light mb-2">
            {order.order_number}
          </h1>
          <p className="text-sm text-ink-60">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className={`badge badge-${order.status}`}>{order.status}</span>
          <span
            className={`badge badge-${
              order.payment_status === 'paid'
                ? 'paid'
                : order.payment_status === 'refunded'
                ? 'refunded'
                : 'pending'
            }`}
          >
            Payment: {order.payment_status}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT — items & summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-ink/10 rounded-sm">
            <div className="px-6 py-4 border-b border-ink/10">
              <h2 className="font-display text-xl italic">Items</h2>
            </div>
            <div className="divide-y divide-ink/5">
              {(items || []).map((item) => {
                const img = imageMap.get(item.product_slug || '') ||
                  (item.product_slug ? `/products/${item.product_slug}.png` : null);
                return (
                  <div key={item.id} className="px-6 py-4 flex gap-4 items-center">
                    <div className="relative w-16 h-16 bg-cream rounded-sm flex-shrink-0 overflow-hidden">
                      {img && (
                        <Image
                          src={img}
                          alt={item.product_name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-xs text-ink-60">
                        {formatPrice(item.unit_price_cents)} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium text-right">
                      {formatPrice(item.total_cents)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="px-6 py-4 border-t border-ink/10 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-60">Subtotal</span>
                <span>{formatPrice(order.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-60">Shipping</span>
                <span>
                  {order.shipping_cents === 0
                    ? 'Free'
                    : formatPrice(order.shipping_cents)}
                </span>
              </div>
              {order.tax_cents > 0 && (
                <div className="flex justify-between">
                  <span className="text-ink-60">Tax</span>
                  <span>{formatPrice(order.tax_cents)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-ink/10 font-display text-xl italic">
                <span>Total</span>
                <span>{formatPrice(order.total_cents)}</span>
              </div>
            </div>
          </div>

          {/* Stripe reference */}
          {order.stripe_session_id && (
            <div className="bg-cream/50 border border-ink/5 rounded-sm p-5 text-xs text-ink-60 space-y-1 font-mono">
              <div>
                Stripe session:{' '}
                <span className="text-ink">{order.stripe_session_id}</span>
              </div>
              {order.stripe_payment_intent && (
                <div>
                  Payment intent:{' '}
                  <span className="text-ink">{order.stripe_payment_intent}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — customer + fulfillment */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white border border-ink/10 rounded-sm">
            <div className="px-5 py-3 border-b border-ink/10">
              <h2 className="font-display text-lg italic">Customer</h2>
            </div>
            <div className="px-5 py-4 text-sm space-y-3">
              {order.customer_name && (
                <div className="font-medium">{order.customer_name}</div>
              )}
              <div className="flex items-start gap-2 text-ink-60">
                <Mail size={14} className="mt-0.5 flex-shrink-0" />
                <a href={`mailto:${order.customer_email}`} className="break-all hover:text-ink">
                  {order.customer_email}
                </a>
              </div>
              {order.customer_phone && (
                <div className="flex items-start gap-2 text-ink-60">
                  <Phone size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{order.customer_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping address */}
          {shipping && shipping.line1 && (
            <div className="bg-white border border-ink/10 rounded-sm">
              <div className="px-5 py-3 border-b border-ink/10">
                <h2 className="font-display text-lg italic">Shipping</h2>
              </div>
              <div className="px-5 py-4 text-sm text-ink-60 flex gap-2 items-start">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <div>
                  {shipping.name && <div className="text-ink font-medium">{shipping.name}</div>}
                  <div>{shipping.line1}</div>
                  {shipping.line2 && <div>{shipping.line2}</div>}
                  <div>
                    {[shipping.city, shipping.state, shipping.postal_code]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                  {shipping.country && <div>{shipping.country}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Fulfillment editor */}
          <OrderStatusEditor
            orderId={order.id}
            currentStatus={order.status}
            currentTracking={order.tracking_number}
            currentCarrier={order.carrier}
            currentNotes={order.notes}
          />
        </div>
      </div>
    </div>
  );
}
