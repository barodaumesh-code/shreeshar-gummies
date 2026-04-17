# Shreeshar Gummies — Full-Stack Storefront

A production-ready e-commerce site for Shreeshar LLC, built on **Next.js 14 (App Router)**, **Supabase** (orders + customers + products), and **Stripe Checkout**.

- 🎨 **White/cream wellness theme** — custom Fraunces × DM Sans typography, grain textures, refined motion
- 🛒 **14 product catalogue** — full product pages, filterable shop, cart drawer with free-shipping progress
- 💳 **Stripe Checkout** — server-validated prices, shipping collection, phone collection
- 🗄️ **Supabase** — customers, orders, order_items, products with RLS; admin access via service-role key
- 🔐 **Admin dashboard** at `/admin` — orders table, fulfillment workflow, tracking numbers, product management
- 📧 **Webhook-driven** — `checkout.session.completed` auto-creates customers, attaches orders

---

## Prerequisites

- **Node.js 18.17+** and **npm** (or pnpm/yarn)
- A **Supabase** project (free tier is fine)
- A **Stripe** account (test mode is fine for development)
- A **Vercel** account (for deployment)

---

## 1 · Install

```bash
npm install
```

---

## 2 · Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.
   This creates `customers`, `products`, `orders`, `order_items` tables, indexes, RLS policies, and seeds all 14 Shreeshar products.
3. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ server-only, never expose to client)

---

## 3 · Set up Stripe

1. From the [Stripe Dashboard](https://dashboard.stripe.com/apikeys), copy:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`
2. For **local development** with webhooks, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   The CLI will print a `whsec_...` secret — use that as `STRIPE_WEBHOOK_SECRET`.
3. For **production**, create a webhook endpoint in the Stripe Dashboard:
   - Endpoint URL: `https://your-domain.com/api/webhook`
   - Events to listen to: `checkout.session.completed`, `checkout.session.expired`, `charge.refunded`
   - Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

---

## 4 · Environment variables

Copy `.env.example` → `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin
ADMIN_PASSWORD=pick-a-strong-passphrase
ADMIN_SESSION_SECRET=random-32-plus-character-string
```

Generate a strong `ADMIN_SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## 5 · Run locally

```bash
# in one terminal
npm run dev

# in another (to forward Stripe webhooks)
stripe listen --forward-to localhost:3000/api/webhook
```

Visit:
- **Storefront**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login

Use a [Stripe test card](https://stripe.com/docs/testing#cards): `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.

---

## 6 · Deploy to Vercel

1. Push this repo to GitHub.
2. Import into Vercel: [vercel.com/new](https://vercel.com/new).
3. Add **all** environment variables from `.env.local` to Vercel → Project Settings → Environment Variables. Set `NEXT_PUBLIC_SITE_URL` to your final production URL (e.g. `https://shreeshar.com`).
4. Deploy.
5. Back in Stripe Dashboard → Webhooks → create the production webhook pointing to `https://your-domain.com/api/webhook` and copy its signing secret into Vercel's `STRIPE_WEBHOOK_SECRET`.
6. Redeploy after updating the secret.

---

## Project structure

```
shreeshar-gummies/
├── public/
│   ├── products/            # 13 product images (green-gummies.png, ashwagandha-calm-focus.png, …)
│   └── banners/             # 3 banner images
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── checkout/        POST — creates Stripe session, pre-records pending order
│   │   │   ├── webhook/         POST — Stripe → updates order to paid, creates customer
│   │   │   └── admin/
│   │   │       ├── login/       POST/DELETE — admin auth
│   │   │       ├── orders/[id]/ PATCH — update status, tracking
│   │   │       └── products/[id]/ PATCH — toggle active, update stock/price
│   │   ├── admin/
│   │   │   ├── login/           /admin/login
│   │   │   ├── orders/          /admin/orders + /admin/orders/[id]
│   │   │   └── products/        /admin/products
│   │   ├── about/
│   │   ├── contact/
│   │   ├── product/[slug]/
│   │   ├── shop/
│   │   ├── success/             post-checkout confirmation
│   │   ├── layout.tsx           header, footer, cart drawer
│   │   ├── page.tsx             homepage
│   │   └── globals.css          theme, fonts, components
│   ├── components/          Header, Footer, CartDrawer, ProductCard, OrderStatusEditor, …
│   ├── lib/
│   │   ├── supabase.ts          browser + admin clients
│   │   ├── stripe.ts
│   │   ├── cart-store.ts        Zustand + localStorage
│   │   ├── admin-auth.ts        HMAC-signed cookie sessions
│   │   ├── catalogue.ts         static mirror of DB products
│   │   ├── types.ts
│   │   └── utils.ts
│   └── middleware.ts            /admin/* route protection
├── supabase/
│   └── schema.sql           full DDL + seed data
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## How checkout works

1. User adds items → Zustand cart persists to localStorage.
2. User clicks "Checkout" → `POST /api/checkout`:
   - Server re-validates every price against the catalogue (never trusts client)
   - Creates a Stripe Checkout Session with shipping & phone collection
   - Pre-inserts a `pending` order + `order_items` rows in Supabase with the Stripe session ID
3. User pays on Stripe's hosted page.
4. Stripe fires `checkout.session.completed` → `POST /api/webhook`:
   - Webhook signature verified
   - Upserts the customer (keyed by email)
   - Updates the pending order: attaches `customer_id`, shipping address, totals, marks `status = 'paid'`
5. User lands on `/success?session_id=…` which shows the order number.
6. Admin sees the order in `/admin/orders` as **Paid / To Fulfill**.

---

## Admin fulfillment workflow

At `/admin/orders`:

- **Stats cards** — revenue, total orders, orders awaiting fulfillment, unique customers
- **Tab filters** — All, To Fulfill (paid), Shipped, Delivered, Cancelled, Refunded, Pending
- **Search** — by order number or customer email

Open any order to:
- See line items with thumbnails, shipping address, customer contact, Stripe IDs
- **Quick action buttons**: "Start Fulfillment" (paid → processing), "Mark as Shipped" (processing → shipped, once tracking + carrier are filled)
- Edit status, carrier, tracking number, internal notes — saved via `PATCH /api/admin/orders/[id]`

At `/admin/products`, toggle products on/off — flipping `active = false` immediately removes them from the storefront (RLS policy enforces it).

---

## Security notes

- **RLS is on** for all four tables. The public (anon key) can only read `products WHERE active = true`. Everything else — orders, customers, order_items — is inaccessible to the browser and only reachable via API routes using the service-role key.
- **Prices are re-validated server-side** in `/api/checkout` before the Stripe session is created. You cannot manipulate cart prices from the client.
- **Stripe webhook signatures** are verified with `STRIPE_WEBHOOK_SECRET` before any DB writes happen.
- **Admin auth** uses an HMAC-signed cookie (no session DB needed). Sessions last 8 hours. All `/admin/*` and `/api/admin/*` routes are protected by middleware + explicit checks.
- **Timing-safe password comparison** is used on admin login.

---

## Customizing

- **Products**: edit `src/lib/catalogue.ts` and re-run `supabase/schema.sql` (the seed uses `on conflict update`), or edit rows directly in the Supabase dashboard.
- **Theme colors**: edit CSS variables in `src/app/globals.css` and `theme.extend.colors` in `tailwind.config.js`.
- **Fonts**: change the Google Fonts imports in `src/app/layout.tsx`.
- **Shipping rates**: edit the `shipping_options` array in `src/app/api/checkout/route.ts`.
- **Tax**: enable `automatic_tax: { enabled: true }` in the checkout session (set up tax in Stripe Dashboard first).

---

## License

Copyright © Shreeshar LLC. All rights reserved.
