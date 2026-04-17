'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from './types';

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  remove: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  subtotalCents: () => number;
  itemCount: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hydrated: false,
      add: (item, qty = 1) => {
        const existing = get().items.find((i) => i.slug === item.slug);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.slug === item.slug ? { ...i, quantity: i.quantity + qty } : i
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: qty }], isOpen: true });
        }
      },
      remove: (slug) => set({ items: get().items.filter((i) => i.slug !== slug) }),
      updateQty: (slug, qty) => {
        if (qty <= 0) return get().remove(slug);
        set({
          items: get().items.map((i) =>
            i.slug === slug ? { ...i, quantity: qty } : i
          ),
        });
      },
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      subtotalCents: () => get().items.reduce((s, i) => s + i.price_cents * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    {
      name: 'shreeshar-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
