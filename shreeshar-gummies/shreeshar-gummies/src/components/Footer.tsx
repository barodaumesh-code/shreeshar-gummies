import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-cream mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        {/* top band */}
        <div className="grid md:grid-cols-12 gap-12 mb-16 pb-16 border-b border-ink/10">
          <div className="md:col-span-5">
            <h2 className="font-display text-4xl md:text-5xl italic font-light leading-tight mb-4">
              Nourish naturally, <br /> live fully.
            </h2>
            <p className="text-ink-60 max-w-md leading-relaxed">
              Join 10,000+ wellness-minded people getting our monthly ritual guide,
              new product drops, and 15% off your first order.
            </p>
          </div>
          <div className="md:col-span-7 flex items-center">
            <form className="w-full flex gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 bg-transparent border-b border-ink/30 pb-3 focus:outline-none focus:border-ink placeholder:text-ink/40"
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <span className="font-display text-3xl italic">shreeshar</span>
            <p className="mt-4 text-ink-60 text-sm max-w-xs leading-relaxed">
              Crafted in small batches with ancient herbs and clinical science.
              Nourish naturally.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.25em] uppercase mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-ink-60">
              <li><Link href="/shop" className="hover:text-ink">All Gummies</Link></li>
              <li><Link href="/shop?category=Immunity" className="hover:text-ink">Immunity</Link></li>
              <li><Link href="/shop?category=Sleep" className="hover:text-ink">Sleep</Link></li>
              <li><Link href="/shop?category=Stress" className="hover:text-ink">Stress</Link></li>
              <li><Link href="/shop?category=Energy" className="hover:text-ink">Energy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.25em] uppercase mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-ink-60">
              <li><Link href="/about" className="hover:text-ink">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-ink">Contact</Link></li>
              <li><Link href="/shop" className="hover:text-ink">Ingredients</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.25em] uppercase mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-ink-60">
              <li><Link href="/contact" className="hover:text-ink">Shipping</Link></li>
              <li><Link href="/contact" className="hover:text-ink">Returns</Link></li>
              <li><Link href="/contact" className="hover:text-ink">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ink/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-ink-60">
          <div>© {new Date().getFullYear()} Shreeshar LLC. All rights reserved.</div>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
