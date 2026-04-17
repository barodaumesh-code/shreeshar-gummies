import Link from 'next/link';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { CheckCircle2, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  let orderNumber: string | null = null;
  let email: string | null = null;
  let total: number | null = null;

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      email = session.customer_details?.email ?? null;
      total = session.amount_total;

      const supabase = createAdminClient();
      const { data } = await supabase
        .from('orders')
        .select('order_number')
        .eq('stripe_session_id', sessionId)
        .maybeSingle();
      orderNumber = data?.order_number ?? null;
    } catch (e) {
      console.error('Success page lookup failed:', e);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-xl text-center page-enter">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-moss/10 rounded-full mb-8">
          <CheckCircle2 size={40} className="text-moss" strokeWidth={1.5} />
        </div>

        <div className="divider-label max-w-[180px] mx-auto mb-6">Order Confirmed</div>
        <h1 className="font-display text-5xl md:text-6xl italic font-light leading-tight mb-6">
          Thank you.
        </h1>
        <p className="text-lg text-ink-60 mb-8 leading-relaxed">
          Your order is confirmed and our team is getting it ready.
          {email && (
            <>
              {' '}
              A receipt has been sent to <span className="text-ink">{email}</span>.
            </>
          )}
        </p>

        {(orderNumber || total) && (
          <div className="bg-cream/60 rounded-sm p-6 mb-10 text-left inline-block">
            {orderNumber && (
              <div className="flex justify-between gap-12 mb-2">
                <span className="text-xs tracking-widest uppercase text-ink-60">
                  Order
                </span>
                <span className="font-mono font-medium">{orderNumber}</span>
              </div>
            )}
            {total != null && (
              <div className="flex justify-between gap-12">
                <span className="text-xs tracking-widest uppercase text-ink-60">
                  Total
                </span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-start gap-3 bg-bone border border-ink/10 rounded-sm p-5 mb-10 text-left">
          <Package size={20} className="text-moss flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium">What happens next</p>
            <p className="text-sm text-ink-60">
              We'll ship within 1–2 business days and email you a tracking number.
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
          <Link href="/shop" className="btn-primary">
            Keep Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
