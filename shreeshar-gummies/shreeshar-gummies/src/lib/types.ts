export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string | null;
  description: string | null;
  price_cents: number;
  compare_at_cents: number | null;
  currency: string;
  image_url: string | null;
  stock: number;
  active: boolean;
  benefits: string[];
  ingredients: string | null;
  suggested_use: string | null;
  created_at: string;
};

export type CartItem = {
  slug: string;
  name: string;
  price_cents: number;
  image_url: string | null;
  quantity: number;
};

export type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  shipping_address: ShippingAddress | null;
  stripe_session_id: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  currency: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  tracking_number: string | null;
  carrier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ShippingAddress = {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_slug: string | null;
  product_name: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
};

export type OrderWithItems = Order & { items: OrderItem[] };
