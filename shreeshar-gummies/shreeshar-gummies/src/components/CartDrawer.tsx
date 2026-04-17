'use client';

import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, remove, subtotalCents, hydrated } = useCart();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Checkout failed');
    } catch (e) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const subtotal = hydrated ? subtotalCents() : 0;
  const freeShip = subtotal >= 5000;
  const toFreeShip = 5000 - subtotal;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
      />

      {/* drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[440px] bg-bone flex flex-col shadow-2xl">
        {/* header */}
        <div className="p-6 flex items-center justify-between border-b border-ink/10">
          <div>
            <h2 className="font-display text-2xl italic">Your Bag</h2>
            <p className="text-xs text-ink-60 mt-0.5">
              {items.length === 0 ? 'Empty' : `${items.length} item${items.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <button onClick={closeCart} className="p-2 hover:text-moss" aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {/* free shipping bar */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-cream/50 border-b border-ink/5">
            {freeShip ? (
              <p className="text-xs tracking-wider uppercase text-moss">
                ✓ You've unlocked free shipping
              </p>
            ) : (
              <>
                <p className="text-xs tracking-wider uppercase mb-2">
                  Add {formatPrice(toFreeShip)} for free shipping
                </p>
                <div className="h-1 bg-ink/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-moss transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* items list */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag size={48} strokeWidth={1} className="text-ink/30 mb-4" />
              <h3 className="font-display text-2xl italic mb-2">Your bag is empty</h3>
              <p className="text-ink-60 text-sm mb-6">Start exploring our wellness range.</p>
              <Link href="/shop" onClick={closeCart} className="btn-primary">
                Shop All
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-ink/5">
              {items.map((item) => (
                <div key={item.slug} className="p-6 flex gap-4">
                  <div className="relative w-24 h-24 bg-cream rounded flex-shrink-0 overflow-hidden">
                    {item.image_url && (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-base leading-tight mb-1">{item.name}</h3>
                      <p className="text-sm">{formatPrice(item.price_cents)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-ink/20 rounded-full">
                        <button
                          onClick={() => updateQty(item.slug, item.quantity - 1)}
                          className="px-3 py-1.5 hover:text-moss"
                          aria-label="Decrease"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.slug, item.quantity + 1)}
                          className="px-3 py-1.5 hover:text-moss"
                          aria-label="Increase"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.slug)}
                        className="text-xs text-ink-60 hover:text-rust underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-ink/10 bg-bone">
            <div className="flex justify-between mb-2">
              <span className="text-ink-60">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-ink-60 mb-4">Shipping and taxes calculated at checkout.</p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? 'Redirecting…' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
