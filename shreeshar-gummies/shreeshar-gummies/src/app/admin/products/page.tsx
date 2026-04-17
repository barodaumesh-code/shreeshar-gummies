import Image from 'next/image';
import { createAdminClient } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import ProductActiveToggle from '@/components/ProductActiveToggle';
import { CATALOGUE } from '@/lib/catalogue';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .order('name');

  // If DB is empty, show catalogue as seed preview
  const products = dbProducts && dbProducts.length > 0
    ? dbProducts
    : CATALOGUE.map((p) => ({ ...p, id: p.slug }));
  const fromDb = dbProducts && dbProducts.length > 0;

  return (
    <div>
      <div className="mb-10">
        <div className="divider-label max-w-[120px] mb-4">Catalogue</div>
        <h1 className="font-display text-5xl italic font-light mb-2">Products</h1>
        <p className="text-sm text-ink-60">
          {fromDb
            ? `${products.length} products in the catalogue.`
            : 'DB not seeded yet — showing static catalogue. Run the seed SQL to populate.'}
        </p>
      </div>

      {!fromDb && (
        <div className="bg-clay/10 border border-clay/40 text-ink rounded-sm p-4 mb-6 text-sm">
          <strong className="font-medium">Heads up:</strong> the <code className="bg-white px-1.5 py-0.5 rounded text-xs">products</code> table is
          empty. Run <code className="bg-white px-1.5 py-0.5 rounded text-xs">supabase/schema.sql</code> in your Supabase SQL editor
          to seed all 14 products. Until then, the storefront uses the static catalogue.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p: any) => (
          <div
            key={p.id}
            className="bg-white border border-ink/10 rounded-sm p-4 flex gap-4"
          >
            <div className="relative w-20 h-20 bg-cream rounded-sm flex-shrink-0 overflow-hidden">
              {p.image_url && (
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-display text-lg italic leading-tight truncate">
                    {p.name}
                  </div>
                  <div className="text-[10px] tracking-widest uppercase text-ink-60">
                    {p.category}
                  </div>
                </div>
                {fromDb && (
                  <ProductActiveToggle
                    productId={p.id}
                    initialActive={p.active}
                  />
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-2 text-sm">
                <span className="font-medium">{formatPrice(p.price_cents)}</span>
                {p.compare_at_cents && p.compare_at_cents > p.price_cents && (
                  <span className="text-ink-60 line-through text-xs">
                    {formatPrice(p.compare_at_cents)}
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs text-ink-60">
                Stock: {p.stock ?? '—'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
