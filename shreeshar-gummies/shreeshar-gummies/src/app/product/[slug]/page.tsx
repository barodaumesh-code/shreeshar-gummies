import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CATALOGUE, getProductBySlug } from '@/lib/catalogue';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/AddToCartButton';
import { Leaf, ShieldCheck, Sparkles, Clock } from 'lucide-react';

export async function generateStaticParams() {
  return CATALOGUE.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = CATALOGUE.filter(
    (p) => p.slug !== product.slug && p.category === product.category
  ).slice(0, 4);

  return (
    <div className="page-enter">
      {/* breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-4">
        <div className="text-xs tracking-wider uppercase text-ink-60">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-ink">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </div>
      </div>

      {/* main product */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20">
          {/* images */}
          <div className="relative aspect-square bg-cream rounded-sm overflow-hidden">
            {product.image_url && (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>

          {/* details */}
          <div className="flex flex-col justify-center">
            <div className="divider-label max-w-[140px] mb-6">{product.category}</div>
            <h1 className="font-display text-5xl md:text-6xl italic font-light leading-[1] mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-ink-60 mb-8 italic font-display">
              {product.tagline}
            </p>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-4xl">{formatPrice(product.price_cents)}</span>
              {product.compare_at_cents && product.compare_at_cents > product.price_cents && (
                <>
                  <span className="text-lg text-ink-60 line-through">
                    {formatPrice(product.compare_at_cents)}
                  </span>
                  <span className="bg-moss text-bone px-2 py-0.5 text-xs tracking-widest uppercase rounded">
                    Save{' '}
                    {Math.round(
                      ((product.compare_at_cents - product.price_cents) /
                        product.compare_at_cents) *
                        100
                    )}
                    %
                  </span>
                </>
              )}
            </div>

            <p className="text-base text-ink leading-relaxed mb-8">{product.description}</p>

            {/* benefits */}
            {product.benefits.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {product.benefits.map((b) => (
                  <div
                    key={b}
                    className="text-center px-3 py-4 bg-cream rounded-sm"
                  >
                    <p className="text-[11px] tracking-widest uppercase font-medium">
                      {b}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* cta */}
            <AddToCartButton product={product} />

            {/* meta */}
            <div className="mt-10 space-y-5 border-t border-ink/10 pt-8">
              <div className="flex gap-4 items-start">
                <Leaf size={18} className="text-moss mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium">Vegan · Gluten-free · Non-GMO</p>
                  <p className="text-xs text-ink-60">Made in an FDA-registered facility.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <ShieldCheck size={18} className="text-moss mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium">30-Day Satisfaction Guarantee</p>
                  <p className="text-xs text-ink-60">Not loving it? Full refund, no questions.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Sparkles size={18} className="text-moss mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium">Free Shipping $50+</p>
                  <p className="text-xs text-ink-60">Ships within 1-2 business days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* details / ingredients */}
      <section className="bg-cream/50 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="divider-label max-w-[140px] mb-6">The Formula</div>
              <h3 className="font-display text-3xl italic mb-4">Ingredients</h3>
              <p className="text-ink leading-relaxed">{product.ingredients}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock size={14} />
                <span className="text-[11px] tracking-[0.25em] uppercase">How to Take</span>
              </div>
              <h3 className="font-display text-3xl italic mb-4">Daily Ritual</h3>
              <p className="text-ink leading-relaxed">{product.suggested_use}</p>
              <p className="text-sm text-ink-60 mt-4">
                Consistency matters. Take daily for at least 30 days to feel the full benefit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* related products */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-display text-4xl md:text-5xl italic font-light leading-tight">
              You might also love
            </h2>
            <Link href="/shop" className="link-underline text-sm tracking-wider uppercase">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {related.map((p) => (
              <ProductCardServer key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// simple server-rendered card for related (no add-to-cart interactivity to keep RSC boundary clean)
function ProductCardServer({ product }: { product: (typeof CATALOGUE)[number] }) {
  return (
    <Link href={`/product/${product.slug}`} className="product-card group block">
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
      </div>
      <p className="text-[10px] tracking-[0.25em] uppercase text-ink-60 mb-2">
        {product.category}
      </p>
      <h3 className="font-display text-xl italic leading-tight mb-2">{product.name}</h3>
      <span className="text-base font-medium">{formatPrice(product.price_cents)}</span>
    </Link>
  );
}
