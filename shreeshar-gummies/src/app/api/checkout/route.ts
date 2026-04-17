import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase';
import { getProductBySlug } from '@/lib/catalogue';
import type { CartItem } from '@/lib/types';
import { generateOrderNumber } from '@/lib/utils';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: CartItem[] = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    // VALIDATE prices server-side — never trust client-supplied prices.
    // We look each item up in the static catalogue (which mirrors DB seed).
    // In production you'd look up from Supabase `products` table here.
    const validatedItems = items.map((item) => {
      const product = getProductBySlug(item.slug);
      if (!product) throw new Error(`Unknown product: ${item.slug}`);
      if (!item.quantity || item.quantity < 1) throw new Error('Invalid quantity');
      return {
        slug: item.slug,
        name: product.name,
        price_cents: product.price_cents, // server-validated price
        image_url: product.image_url,
        quantity: item.quantity,
      };
    });

    const orderNumber = generateOrderNumber();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: validatedItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image_url
              ? [`${siteUrl}${item.image_url}`]
              : undefined,
          },
          unit_amount: item.price_cents,
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'IN', 'GB', 'AU', 'NZ'],
      },
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free shipping ($50+)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 599, currency: 'usd' },
            display_name: 'Standard shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      allow_promotion_codes: true,
      automatic_tax: { enabled: false }, // enable in Stripe dashboard when ready
      metadata: {
        order_number: orderNumber,
        items: JSON.stringify(
          validatedItems.map((i) => ({
            slug: i.slug,
            qty: i.quantity,
            price: i.price_cents,
            name: i.name,
          }))
        ),
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop`,
    });

    // Pre-create a pending order row so we can track abandoned carts.
    const supabase = createAdminClient();
    const subtotal = validatedItems.reduce(
      (s, i) => s + i.price_cents * i.quantity,
      0
    );

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_email: 'pending@checkout',
        stripe_session_id: session.id,
        subtotal_cents: subtotal,
        total_cents: subtotal,
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select()
      .single();

    if (!orderErr && order) {
      await supabase.from('order_items').insert(
        validatedItems.map((item) => ({
          order_id: order.id,
          product_slug: item.slug,
          product_name: item.name,
          quantity: item.quantity,
          unit_price_cents: item.price_cents,
          total_cents: item.price_cents * item.quantity,
        }))
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
