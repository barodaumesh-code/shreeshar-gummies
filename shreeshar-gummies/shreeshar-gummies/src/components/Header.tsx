'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const { toggleCart, itemCount, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const count = hydrated ? itemCount() : 0;

  return (
    <>
      {/* announcement bar */}
      <div className="bg-ink text-bone text-center py-2 text-[11px] tracking-[0.25em] uppercase font-light">
        Free shipping on orders $50+ &nbsp;·&nbsp; 30-day satisfaction guarantee
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-bone/95 backdrop-blur-md border-b border-ink/5' : 'bg-bone'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* left — mobile menu */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -ml-2"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* left — desktop nav */}
          <nav className="hidden md:flex items-center gap-10 text-[13px] tracking-wide">
            <Link href="/shop" className="link-underline hover:text-moss">Shop All</Link>
            <Link href="/shop?category=Immunity" className="link-underline hover:text-moss">Immunity</Link>
            <Link href="/shop?category=Sleep" className="link-underline hover:text-moss">Sleep</Link>
            <Link href="/shop?category=Stress" className="link-underline hover:text-moss">Stress</Link>
            <Link href="/about" className="link-underline hover:text-moss">Our Story</Link>
          </nav>

          {/* logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span className="font-display text-3xl md:text-4xl italic font-light tracking-tight">
              shreeshar
            </span>
          </Link>

          {/* right actions */}
          <div className="flex items-center gap-4">
            <button aria-label="Search" className="hidden md:block p-2 hover:text-moss transition">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={toggleCart}
              className="relative p-2 hover:text-moss transition"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-moss text-bone text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-bone p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-12">
              <span className="font-display text-2xl italic">shreeshar</span>
              <button onClick={() => setMobileOpen(false)}><X size={22} /></button>
            </div>
            <nav className="flex flex-col gap-6 text-lg font-display">
              <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop All</Link>
              <Link href="/shop?category=Immunity" onClick={() => setMobileOpen(false)}>Immunity</Link>
              <Link href="/shop?category=Sleep" onClick={() => setMobileOpen(false)}>Sleep</Link>
              <Link href="/shop?category=Stress" onClick={() => setMobileOpen(false)}>Stress</Link>
              <Link href="/shop?category=Energy" onClick={() => setMobileOpen(false)}>Energy</Link>
              <Link href="/shop?category=Wellness" onClick={() => setMobileOpen(false)}>Wellness</Link>
              <div className="h-px bg-ink/10 my-2" />
              <Link href="/about" onClick={() => setMobileOpen(false)}>Our Story</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
