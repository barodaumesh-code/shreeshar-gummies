import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase';
import type Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, supabase);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('stripe_session_id', session.id);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent) {
          await supabase
            .from('orders')
            .update({ payment_status: 'refunded', status: 'refunded' })
            .eq('stripe_payment_intent', charge.payment_intent as string);
        }
        break;
      }
      default:
        // no-op for other events
        break;
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createAdminClient>
) {
  const customerEmail = session.customer_details?.email || session.customer_email || '';
  const customerName = session.customer_details?.name || null;
  const customerPhone = session.customer_details?.phone || null;
  const shipping = session.shipping_details?.address
    ? {
        name: session.shipping_details.name,
        line1: session.shipping_details.address.line1,
        line2: session.shipping_details.address.line2,
        city: session.shipping_details.address.city,
        state: session.shipping_details.address.state,
        postal_code: session.shipping_details.address.postal_code,
        country: session.shipping_details.address.country,
      }
    : null;

  // Upsert customer
  let customerId: string | null = null;
  if (customerEmail) {
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customerEmail)
      .maybeSingle();

    if (existing) {
      customerId = existing.id;
      await supabase
        .from('customers')
        .update({ full_name: customerName, phone: customerPhone })
        .eq('id', existing.id);
    } else {
      const { data: created } = await supabase
        .from('customers')
        .insert({
          email: customerEmail,
          full_name: customerName,
          phone: customerPhone,
        })
        .select('id')
        .single();
      if (created) customerId = created.id;
    }
  }

  // Update order
  const subtotal = session.amount_subtotal ?? 0;
  const total = session.amount_total ?? 0;
  const shippingCost = (session.shipping_cost?.amount_total ?? 0) as number;
  const tax = (session.total_details?.amount_tax ?? 0) as number;

  await supabase
    .from('orders')
    .update({
      customer_id: customerId,
      customer_email: customerEmail,
      customer_name: customerName,
      customer_phone: customerPhone,
      shipping_address: shipping,
      stripe_payment_intent: session.payment_intent as string,
      subtotal_cents: subtotal,
      shipping_cents: shippingCost,
      tax_cents: tax,
      total_cents: total,
      status: 'paid',
      payment_status: 'paid',
    })
    .eq('stripe_session_id', session.id);
}
