-- =====================================================================
-- SHREESHAR GUMMIES — Supabase Schema
-- Run this entire file in the Supabase SQL Editor.
-- =====================================================================

-- Customers table
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  unique(email)
);

-- Products table (seed data managed from admin or inserted below)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  description text,
  tagline text,
  price_cents integer not null,
  compare_at_cents integer,
  currency text not null default 'usd',
  image_url text,
  stock integer not null default 100,
  active boolean not null default true,
  benefits text[] default '{}',
  ingredients text,
  suggested_use text,
  created_at timestamptz not null default now()
);

-- Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references public.customers(id) on delete set null,
  customer_email text not null,
  customer_name text,
  customer_phone text,
  shipping_address jsonb,
  stripe_session_id text unique,
  stripe_payment_intent text,
  subtotal_cents integer not null,
  shipping_cents integer not null default 0,
  tax_cents integer not null default 0,
  total_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'pending'
    check (status in ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','paid','failed','refunded')),
  tracking_number text,
  carrier text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_slug text,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null,
  total_cents integer not null,
  created_at timestamptz not null default now()
);

-- Auto-update updated_at on orders
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Indexes
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_customer_email on public.orders(customer_email);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_active on public.products(active);

-- Row Level Security
-- Public can READ active products only. Everything else stays server-only (service role).
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.customers enable row level security;

drop policy if exists "public read active products" on public.products;
create policy "public read active products"
  on public.products for select
  using (active = true);

-- orders, order_items, customers: NO public policies.
-- API routes use the service-role key to access these.

-- =====================================================================
-- SEED DATA — 14 Shreeshar products
-- =====================================================================
insert into public.products (slug, name, category, tagline, description, price_cents, compare_at_cents, image_url, benefits, ingredients, suggested_use) values
('green-gummies', 'Green Gummies', 'Wellness',
 'Nourish naturally with leafy-green goodness',
 'A daily dose of kale and spirulina in a delicious gummy. Built for immune support, digestive health, and gentle recovery.',
 2499, 2999, '/products/green-gummies.png',
 array['Immune Support','Digestive Health','Recovery'],
 'Kale extract, spirulina, organic cane sugar, tapioca syrup, pectin, citric acid, natural flavors.',
 'Take 2 gummies daily with or without food.'),

('spirulina-daily-greens', 'Spirulina Daily Greens', 'Wellness',
 'Your daily greens, reimagined',
 'Spirulina, wheatgrass, and moringa packed into a single gummy. Designed for energy, detox and digestion.',
 2699, 3199, '/products/spirulina-daily-greens.png',
 array['Digestive Health','Energy Boost','Detox Support'],
 'Spirulina powder, wheatgrass, moringa leaf, organic cane sugar, pectin, natural lemon flavor.',
 'Take 2 gummies daily, preferably in the morning.'),

('melatonin-sleep-well', 'Melatonin Sleep Well', 'Sleep',
 'Drift off the natural way',
 'A gentle melatonin blend with chamomile and L-theanine for deeper rest and smooth mornings.',
 2299, 2799, '/products/melatonin-sleep-well.png',
 array['Sleep Quality','Refreshed','Recovery'],
 'Melatonin (3mg), chamomile extract, L-theanine, passionflower, pectin, natural berry flavor.',
 'Take 1 gummy 30 minutes before bedtime.'),

('melatonin-gummies', 'Melatonin Gummies', 'Sleep',
 'Deep sleep, starry nights',
 'Our classic melatonin formula — simple, effective, and free of synthetic dyes.',
 1999, 2499, '/products/melatonin-gummies.png',
 array['Deep Sleep','Recovery','Rest'],
 'Melatonin (5mg), organic cane sugar, pectin, tapioca syrup, natural grape flavor.',
 'Take 1 gummy 30 minutes before bedtime.'),

('ginger-turmeric-gummies', 'Ginger & Turmeric Gummies', 'Immunity',
 'Ancient roots, modern recovery',
 'Cold-pressed ginger root and turmeric with black pepper for enhanced absorption. Anti-inflammatory support.',
 2599, 2999, '/products/ginger-turmeric-gummies.png',
 array['Anti-inflammatory','Immune Boost','Joint Support'],
 'Ginger root extract, turmeric extract (95% curcumin), black pepper extract, pectin, honey.',
 'Take 2 gummies daily with meals.'),

('ashwagandha-calm-focus', 'Ashwagandha Calm & Focus', 'Stress',
 'Balance. Stress relief. Fresh focus.',
 'KSM-66 ashwagandha for steady calm and sharper focus during demanding days.',
 2799, 3299, '/products/ashwagandha-calm-focus.png',
 array['Balance','Stress Relief','Focus'],
 'KSM-66 ashwagandha root extract (600mg), L-theanine, rhodiola, pectin.',
 'Take 2 gummies daily, morning or evening.'),

('ashwagandha-gummies', 'Ashwagandha Gummies', 'Stress',
 'Stress, calm, focus — in one bite',
 'Traditional Ayurvedic ashwagandha in a simple daily gummy.',
 2499, 2899, '/products/ashwagandha-gummies.png',
 array['Stress Relief','Calm','Focus'],
 'Ashwagandha root extract (500mg), organic cane sugar, pectin, natural caramel flavor.',
 'Take 2 gummies daily.'),

('energy-blend-gummies', 'Energy Blend Gummies', 'Energy',
 'Clean energy, all-day focus',
 'Lion''s mane, cordyceps, and B12 for clean, crash-free energy. No jitters. No caffeine crash.',
 2699, 3199, '/products/energy-blend-gummies.png',
 array['Sustained Energy','Focus','No Crash'],
 'Lion''s mane mushroom, cordyceps, B12, B6, natural dates, pectin.',
 'Take 2 gummies in the morning.'),

('elderberry-immunity', 'Elderberry Immunity', 'Immunity',
 '60-count immune defense',
 'Concentrated black elderberry with vitamin C and zinc. The classic immune tonic.',
 2899, 3499, '/products/elderberry-immunity.png',
 array['Elderberry','Immune Defense','Antioxidant'],
 'Black elderberry extract, vitamin C, zinc, pectin, natural berry flavor.',
 'Take 2 gummies daily during cold season.'),

('zinc-plus-defense', 'Zinc Plus Defense', 'Immunity',
 'Daily supplement. Immune and recovery.',
 'High-potency zinc with copper balance for immune resilience and cellular recovery.',
 1999, 2399, '/products/zinc-plus-defense.png',
 array['Immune Defense','Recovery Support','Vitality'],
 'Zinc gluconate (15mg), copper, vitamin D3, pectin.',
 'Take 1 gummy daily with food.'),

('zinc-zinc-gummies', 'Zinc Zinc Gummies', 'Immunity',
 'Double dose, double defense',
 'A higher-potency zinc gummy for people who want concentrated immune support.',
 2199, 2599, '/products/zinc-zinc-gummies.png',
 array['Immune Boost','Zinc','Recovery'],
 'Zinc gluconate (22mg), vitamin C, pectin, natural citrus flavor.',
 'Take 1 gummy daily.'),

('zinc-vitamin-c', 'Zinc & Vitamin C Gummies', 'Immunity',
 'Citrus sunshine in a gummy',
 'The classic immunity duo — zinc and vitamin C — in a bright, citrus-forward gummy.',
 2099, 2499, '/products/zinc-vitamin-c.png',
 array['Immune Boost','Antioxidant','Energy'],
 'Zinc, vitamin C (from acerola cherry), orange peel extract, pectin.',
 'Take 2 gummies daily.'),

('tropical-immunity', 'Tropical Immunity Gummies', 'Immunity',
 'Island vibes, immune support',
 'Pineapple, acerola, and elderberry in a sun-bright tropical gummy kids and adults both love.',
 2399, 2799, '/products/tropical-immunity.png',
 array['Kid-Friendly','Tropical Flavor','Immune Support'],
 'Pineapple extract, acerola cherry, elderberry, vitamin C, pectin.',
 'Take 2 gummies daily.')
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  tagline = excluded.tagline,
  description = excluded.description,
  price_cents = excluded.price_cents,
  compare_at_cents = excluded.compare_at_cents,
  image_url = excluded.image_url,
  benefits = excluded.benefits,
  ingredients = excluded.ingredients,
  suggested_use = excluded.suggested_use;
