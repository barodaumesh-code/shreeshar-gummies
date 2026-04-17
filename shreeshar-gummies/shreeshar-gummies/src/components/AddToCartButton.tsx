'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-store';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';

export default function AddToCartButton({
  product,
}: {
  product: Omit<Product, 'id' | 'created_at'>;
}) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center border border-ink/20 rounded-full px-2 self-start sm:self-stretch">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="px-3 py-2 hover:text-moss"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="px-4 text-base min-w-[3rem] text-center">{qty}</span>
        <button
          onClick={() => setQty(qty + 1)}
          className="px-3 py-2 hover:text-moss"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        onClick={() =>
          add(
            {
              slug: product.slug,
              name: product.name,
              price_cents: product.price_cents,
              image_url: product.image_url,
            },
            qty
          )
        }
        className="btn-primary flex-1 justify-center"
      >
        <ShoppingBag size={16} /> Add to Bag
      </button>
    </div>
  );
}
