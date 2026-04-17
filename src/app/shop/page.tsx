'use client';

import { useSearchParams } from 'next/navigation';
import { CATALOGUE, CATEGORIES } from '@/lib/catalogue';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Suspense } from 'react';

function ShopContent() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const products =
    activeCategory === 'All'
      ? CATALOGUE
      : CATALOGUE.filter((p) => p.category === activeCategory);

  return (
    <div className="page-enter">
      {/* hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="divider-label max-w-[150px] mb-8">The Shop</div>
        <h1 className="font-display text-6xl md:text-8xl italic font-light leading-[0.95] mb-6">
          Every bottle, <br />
          <span className="text-moss">intentional.</span>
        </h1>
        <p className="text-lg text-ink-60 max-w-xl">
          14 formulas crafted for real daily needs. Browse by goal or explore
          everything.
        </p>
      </section>

      {/* filter bar */}
      <section className="border-y border-ink/10 bg-bone/80 backdrop-blur-sm sticky top-[104px] z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex gap-6 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={c === 'All' ? '/shop' : `/shop?category=${c}`}
              scroll={false}
              className={`text-sm tracking-wider uppercase whitespace-nowrap transition ${
                c === activeCategory
                  ? 'text-ink font-medium border-b-2 border-ink pb-1'
                  : 'text-ink-60 hover:text-ink'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24">
        <div className="flex justify-between items-baseline mb-10">
          <p className="text-sm text-ink-60">
            Showing <span className="text-ink font-medium">{products.length}</span>{' '}
            {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl italic text-ink-60">
              No products in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ShopContent />
    </Suspense>
  );
}
