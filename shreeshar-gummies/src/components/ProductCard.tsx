'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

type Props = { product: Omit<Product, 'id' | 'created_at'> };

export default function ProductCard({ product }: Props) {
  const { add } = useCart();

  return (
    <div className="product-card group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-cream overflow-hidden rounded-sm mb-5">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover product-image"
            />
          )}
          {product.compare_at_cents && product.compare_at_cents > product.price_cents && (
            <div className="absolute top-4 left-4 bg-ink text-bone px-3 py-1 text-[10px] tracking-widest uppercase">
              Save{' '}
              {Math.round(
                ((product.compare_at_cents - product.price_cents) /
                  product.compare_at_cents) *
                  100
              )}
              %
            </div>
          )}
        </div>

        <div className="px-1">
          <p className="text-[10px] tracking-[0.25em] uppercase text-ink-60 mb-2">
            {product.category}
          </p>
          <h3 className="font-display text-xl md:text-2xl italic leading-tight mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-ink-60 mb-4 line-clamp-1">{product.tagline}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-medium">{formatPrice(product.price_cents)}</span>
            {product.compare_at_cents && product.compare_at_cents > product.price_cents && (
              <span className="text-sm text-ink-60 line-through">
                {formatPrice(product.compare_at_cents)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          add({
            slug: product.slug,
            name: product.name,
            price_cents: product.price_cents,
            image_url: product.image_url,
          });
        }}
        className="mt-4 w-full text-[11px] tracking-[0.2em] uppercase py-3 border border-ink/20 rounded-full hover:bg-ink hover:text-bone transition-all duration-300"
      >
        Add to Bag
      </button>
    </div>
  );
}
