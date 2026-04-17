import Image from 'next/image';
import Link from 'next/link';
import { CATALOGUE } from '@/lib/catalogue';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Heart } from 'lucide-react';

export default function HomePage() {
  const featured = CATALOGUE.slice(0, 4);
  const categories = [
    { name: 'Immunity', slug: 'Immunity', image: '/products/elderberry-immunity.png' },
    { name: 'Sleep', slug: 'Sleep', image: '/products/melatonin-gummies.png' },
    { name: 'Stress', slug: 'Stress', image: '/products/ashwagandha-calm-focus.png' },
    { name: 'Energy', slug: 'Energy', image: '/products/energy-blend-gummies.png' },
  ];

  return (
    <div className="page-enter">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden grain">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-24 md:pt-16 md:pb-32 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <div className="divider-label mb-8 max-w-[200px]">Est. 2024</div>
              <h1 className="font-display italic font-light leading-[0.95] text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] tracking-tight">
                Nourish <br />
                <span className="text-moss">naturally.</span>
              </h1>
              <p className="mt-8 text-lg text-ink-60 max-w-lg leading-relaxed">
                Small-batch wellness gummies crafted with ancient herbs and clinical
                science. No synthetic dyes. No shortcuts. Just pure nourishment.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/shop" className="btn-primary">
                  Shop the Collection <ArrowRight size={16} />
                </Link>
                <Link href="/about" className="btn-secondary">
                  Our Story
                </Link>
              </div>

              {/* trust bar */}
              <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <div className="font-display text-3xl italic">10k+</div>
                  <div className="text-xs text-ink-60 tracking-wider uppercase mt-1">
                    Happy Customers
                  </div>
                </div>
                <div>
                  <div className="font-display text-3xl italic">4.9★</div>
                  <div className="text-xs text-ink-60 tracking-wider uppercase mt-1">
                    Avg. Rating
                  </div>
                </div>
                <div>
                  <div className="font-display text-3xl italic">14</div>
                  <div className="text-xs text-ink-60 tracking-wider uppercase mt-1">
                    Wellness Formulas
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-sm overflow-hidden">
                <Image
                  src="/banners/collection-hero.png"
                  alt="Shreeshar Wellness Collection"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* floating caption */}
              <div className="absolute -bottom-6 -left-4 md:left-8 bg-bone shadow-xl px-6 py-5 max-w-[260px] rounded-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Leaf size={16} className="text-moss" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-[0.3em] uppercase">Made Clean</span>
                </div>
                <p className="text-sm leading-snug">
                  Vegan · Gluten-free · Non-GMO · Third-party tested
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="py-6 border-y border-ink/10 bg-cream/40 overflow-hidden">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 px-8 whitespace-nowrap font-display italic text-2xl md:text-3xl">
              <span>Immune Support</span>
              <span className="text-moss">✦</span>
              <span>Restful Sleep</span>
              <span className="text-moss">✦</span>
              <span>Daily Greens</span>
              <span className="text-moss">✦</span>
              <span>Stress Relief</span>
              <span className="text-moss">✦</span>
              <span>Clean Energy</span>
              <span className="text-moss">✦</span>
              <span>Natural Recovery</span>
              <span className="text-moss">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="divider-label max-w-[180px] mb-6">Bestsellers</div>
            <h2 className="font-display text-5xl md:text-6xl italic font-light leading-tight">
              Loved by thousands.
            </h2>
          </div>
          <Link href="/shop" className="link-underline text-sm tracking-wider uppercase">
            Shop All Products →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="bg-cream/50 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="divider-label max-w-[200px] mx-auto mb-6">Shop by Goal</div>
            <h2 className="font-display text-5xl md:text-6xl italic font-light leading-tight">
              What do you need <br /> today?
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-bone"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-bone">
                  <h3 className="font-display text-3xl italic">{c.name}</h3>
                  <p className="text-xs tracking-widest uppercase mt-1 opacity-80">
                    Shop Now →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STORY / VALUES ============ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-square rounded-sm overflow-hidden order-2 lg:order-1">
            <Image
              src="/banners/family-shot.png"
              alt="Shreeshar full range"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="divider-label max-w-[200px] mb-6">The Shreeshar Way</div>
            <h2 className="font-display text-5xl md:text-6xl italic font-light leading-tight mb-8">
              Ancient wisdom, <br />
              <span className="text-moss">modern proof.</span>
            </h2>
            <p className="text-lg text-ink-60 leading-relaxed mb-10">
              Every formula begins with ingredients used for centuries — ashwagandha,
              elderberry, turmeric, spirulina — and is then validated by clinical
              research and third-party testing. The result is wellness you can taste
              and trust.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Leaf className="text-moss flex-shrink-0 mt-1" size={20} strokeWidth={1.5} />
                <div>
                  <h4 className="font-display text-lg italic mb-1">Clean Sourcing</h4>
                  <p className="text-sm text-ink-60">Organic herbs from trusted farms worldwide.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <ShieldCheck className="text-moss flex-shrink-0 mt-1" size={20} strokeWidth={1.5} />
                <div>
                  <h4 className="font-display text-lg italic mb-1">Lab Tested</h4>
                  <p className="text-sm text-ink-60">Every batch verified for purity and potency.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Sparkles className="text-moss flex-shrink-0 mt-1" size={20} strokeWidth={1.5} />
                <div>
                  <h4 className="font-display text-lg italic mb-1">Small Batch</h4>
                  <p className="text-sm text-ink-60">Made fresh. Shipped fast.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Heart className="text-moss flex-shrink-0 mt-1" size={20} strokeWidth={1.5} />
                <div>
                  <h4 className="font-display text-lg italic mb-1">Taste-First</h4>
                  <p className="text-sm text-ink-60">If it doesn't taste great, we don't ship it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-moss text-bone py-24 md:py-32 grain relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase opacity-70 mb-4">
              ★ ★ ★ ★ ★ · Verified Reviews
            </p>
            <h2 className="font-display text-4xl md:text-6xl italic font-light leading-tight">
              "Finally — gummies <br /> I actually trust."
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                q: 'The ashwagandha changed my sleep. I feel more balanced and less wired at the end of the day.',
                n: 'Priya R.',
                p: 'Verified Buyer',
              },
              {
                q: "My kids ask for the tropical immunity gummies. Zero fights. And I know they're getting something good.",
                n: 'Marcus T.',
                p: 'Verified Buyer',
              },
              {
                q: 'Packaging is gorgeous, taste is clean, and I love that everything is third-party tested.',
                n: 'Sofia L.',
                p: 'Verified Buyer',
              },
            ].map((t, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="font-display italic text-xl leading-relaxed mb-6">"{t.q}"</p>
                <div className="text-sm opacity-80">
                  <div className="font-medium">{t.n}</div>
                  <div className="text-xs tracking-wider uppercase opacity-70 mt-0.5">{t.p}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BOTTOM CTA ============ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32 text-center">
        <div className="divider-label max-w-[180px] mx-auto mb-8">Begin Your Ritual</div>
        <h2 className="font-display text-5xl md:text-7xl italic font-light leading-tight mb-8">
          Small steps. <br /> Real change.
        </h2>
        <p className="text-lg text-ink-60 max-w-xl mx-auto mb-10">
          Find the formula that fits your day. Free shipping over $50. 30-day satisfaction guarantee.
        </p>
        <Link href="/shop" className="btn-primary">
          Shop the Collection <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
