-- ============================================================
-- SILENT_ — Complete Supabase Database Schema
-- Premium Luxury E-commerce Platform
-- ============================================================
-- Run this in the Supabase SQL Editor, or via the CLI:
--   supabase db push
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  role text default 'customer' check (role in ('customer', 'admin')),
  newsletter_opt_in boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Collections
create table public.collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  cover_image text,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Products
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  materials text,
  care_instructions text,
  price numeric(10,2) not null check (price >= 0),
  sale_price numeric(10,2) check (sale_price >= 0),
  category_slug text references public.categories(slug) on delete set null,
  category_name text,
  collection_slug text references public.collections(slug) on delete set null,
  sku text unique,
  is_active boolean default true,
  is_bestseller boolean default false,
  sales_count int default 0,
  video_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_products_slug on public.products(slug);
create index idx_products_category on public.products(category_slug);
create index idx_products_collection on public.products(collection_slug);
create index idx_products_active on public.products(is_active);
create index idx_products_created on public.products(created_at desc);

-- Product Images
create table public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade not null,
  image_url text not null,
  alt_text text,
  is_primary boolean default false,
  display_order int default 0,
  created_at timestamptz default now()
);

create index idx_product_images_product on public.product_images(product_id);

-- Inventory (per product per size)
create table public.inventory (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade not null,
  size text not null check (size in ('XS','S','M','L','XL','XXL')),
  quantity int not null default 0 check (quantity >= 0),
  updated_at timestamptz default now(),
  unique(product_id, size)
);

create index idx_inventory_product on public.inventory(product_id);
create index idx_inventory_low_stock on public.inventory(quantity) where quantity < 5;

-- Orders
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  status text default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled')),
  subtotal numeric(10,2) not null default 0,
  shipping_cost numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  coupon_code text,
  shipping_address jsonb,
  shipping_method text default 'standard',
  payment_status text default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  tracking_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_orders_user on public.orders(user_id);
create index idx_orders_email on public.orders(email);
create index idx_orders_status on public.orders(status);
create index idx_orders_created on public.orders(created_at desc);

-- Order Items
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  size text not null,
  quantity int not null check (quantity > 0),
  price numeric(10,2) not null,
  created_at timestamptz default now()
);

create index idx_order_items_order on public.order_items(order_id);

-- Wishlist
create table public.wishlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

create index idx_wishlist_user on public.wishlist(user_id);

-- Addresses
create table public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  address text not null,
  address2 text,
  city text not null,
  state text not null,
  zip text not null,
  country text not null,
  phone text,
  is_default boolean default false,
  created_at timestamptz default now()
);

create index idx_addresses_user on public.addresses(user_id);

-- Reviews
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  is_approved boolean default true,
  created_at timestamptz default now()
);

create index idx_reviews_product on public.reviews(product_id);

-- Coupons
create table public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  type text not null check (type in ('percentage','fixed')),
  value numeric(10,2) not null check (value >= 0),
  minimum_amount numeric(10,2),
  usage_limit int,
  uses_count int default 0,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index idx_coupons_code on public.coupons(code);

-- Newsletter
create table public.newsletter (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  subscribed_at timestamptz default now(),
  is_active boolean default true
);

-- Notifications (restock alerts, etc)
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  email text,
  product_id uuid references public.products(id) on delete cascade,
  size text,
  type text default 'restock' check (type in ('restock','order_update','promo')),
  is_sent boolean default false,
  created_at timestamptz default now()
);

create index idx_notifications_product on public.notifications(product_id);

-- Lookbook
create table public.lookbook (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  caption text,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Website Settings (key-value store for site config)
create table public.website_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- ============================================================
-- VIEWS
-- ============================================================

-- Product catalog view with aggregated stock
create or replace view public.product_catalog as
select
  p.*,
  coalesce(sum(i.quantity), 0) as total_stock,
  coalesce(avg(r.rating), 0) as avg_rating,
  count(distinct r.id) as review_count
from public.products p
left join public.inventory i on i.product_id = p.id
left join public.reviews r on r.product_id = p.id and r.is_approved = true
group by p.id;

-- Order summary view for admin dashboard
create or replace view public.order_summary as
select
  date_trunc('day', created_at) as order_date,
  count(*) as order_count,
  sum(total) as total_revenue
from public.orders
where status != 'cancelled'
group by date_trunc('day', created_at)
order by order_date desc;

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, newsletter_opt_in)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'newsletter')::boolean, false)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_products
  before update on public.products
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_orders
  before update on public.orders
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Decrement inventory on order placement
create or replace function public.decrement_inventory()
returns trigger as $$
begin
  update public.inventory
  set quantity = greatest(0, quantity - new.quantity)
  where product_id = new.product_id and size = new.size;

  update public.products
  set sales_count = sales_count + new.quantity
  where id = new.product_id;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_order_item_created
  after insert on public.order_items
  for each row execute procedure public.decrement_inventory();

-- Increment coupon usage
create or replace function public.increment_coupon_usage(coupon_code text)
returns void as $$
begin
  update public.coupons
  set uses_count = uses_count + 1
  where code = coupon_code;
end;
$$ language plpgsql security definer;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist enable row level security;
alter table public.addresses enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.newsletter enable row level security;
alter table public.notifications enable row level security;
alter table public.lookbook enable row level security;
alter table public.website_settings enable row level security;

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- PROFILES policies
create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Admins can update any profile"
  on public.profiles for update using (public.is_admin());

-- CATEGORIES policies (public read, admin write)
create policy "Anyone can view active categories"
  on public.categories for select using (is_active = true or public.is_admin());
create policy "Admins can manage categories"
  on public.categories for all using (public.is_admin());

-- COLLECTIONS policies
create policy "Anyone can view active collections"
  on public.collections for select using (is_active = true or public.is_admin());
create policy "Admins can manage collections"
  on public.collections for all using (public.is_admin());

-- PRODUCTS policies
create policy "Anyone can view active products"
  on public.products for select using (is_active = true or public.is_admin());
create policy "Admins can manage products"
  on public.products for all using (public.is_admin());

-- PRODUCT IMAGES policies
create policy "Anyone can view product images"
  on public.product_images for select using (true);
create policy "Admins can manage product images"
  on public.product_images for all using (public.is_admin());

-- INVENTORY policies
create policy "Anyone can view inventory"
  on public.inventory for select using (true);
create policy "Admins can manage inventory"
  on public.inventory for all using (public.is_admin());

-- ORDERS policies
create policy "Users can view their own orders"
  on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "Anyone can create an order"
  on public.orders for insert with check (true);
create policy "Admins can update orders"
  on public.orders for update using (public.is_admin());

-- ORDER ITEMS policies
create policy "Users can view their own order items"
  on public.order_items for select using (
    exists (select 1 from public.orders where orders.id = order_items.order_id and (orders.user_id = auth.uid() or public.is_admin()))
  );
create policy "Anyone can create order items"
  on public.order_items for insert with check (true);

-- WISHLIST policies
create policy "Users can manage their own wishlist"
  on public.wishlist for all using (auth.uid() = user_id);

-- ADDRESSES policies
create policy "Users can manage their own addresses"
  on public.addresses for all using (auth.uid() = user_id);

-- REVIEWS policies
create policy "Anyone can view approved reviews"
  on public.reviews for select using (is_approved = true or public.is_admin());
create policy "Authenticated users can create reviews"
  on public.reviews for insert with check (auth.uid() = user_id);
create policy "Admins can manage reviews"
  on public.reviews for all using (public.is_admin());

-- COUPONS policies
create policy "Anyone can view active coupons"
  on public.coupons for select using (is_active = true or public.is_admin());
create policy "Admins can manage coupons"
  on public.coupons for all using (public.is_admin());

-- NEWSLETTER policies
create policy "Anyone can subscribe"
  on public.newsletter for insert with check (true);
create policy "Anyone can update their own subscription by email"
  on public.newsletter for update using (true);
create policy "Admins can view all subscribers"
  on public.newsletter for select using (public.is_admin());

-- NOTIFICATIONS policies
create policy "Users can manage their own notifications"
  on public.notifications for all using (auth.uid() = user_id or public.is_admin());
create policy "Anyone can request restock notification"
  on public.notifications for insert with check (true);

-- LOOKBOOK policies
create policy "Anyone can view active lookbook items"
  on public.lookbook for select using (is_active = true or public.is_admin());
create policy "Admins can manage lookbook"
  on public.lookbook for all using (public.is_admin());

-- WEBSITE SETTINGS policies
create policy "Anyone can view settings"
  on public.website_settings for select using (true);
create policy "Admins can manage settings"
  on public.website_settings for all using (public.is_admin());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Run these via the Supabase dashboard Storage section, or via SQL:

insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('lookbook', 'lookbook', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('banners', 'banners', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('videos', 'videos', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('logos', 'logos', true) on conflict do nothing;

-- Storage policies: public read, admin write
create policy "Public read access for products bucket"
  on storage.objects for select using (bucket_id = 'products');
create policy "Admins can upload to products bucket"
  on storage.objects for insert with check (bucket_id = 'products' and public.is_admin());
create policy "Admins can update products bucket"
  on storage.objects for update using (bucket_id = 'products' and public.is_admin());
create policy "Admins can delete from products bucket"
  on storage.objects for delete using (bucket_id = 'products' and public.is_admin());

create policy "Public read access for lookbook bucket"
  on storage.objects for select using (bucket_id = 'lookbook');
create policy "Admins can manage lookbook bucket"
  on storage.objects for all using (bucket_id = 'lookbook' and public.is_admin());

create policy "Public read access for banners bucket"
  on storage.objects for select using (bucket_id = 'banners');
create policy "Admins can manage banners bucket"
  on storage.objects for all using (bucket_id = 'banners' and public.is_admin());

create policy "Public read access for videos bucket"
  on storage.objects for select using (bucket_id = 'videos');
create policy "Admins can manage videos bucket"
  on storage.objects for all using (bucket_id = 'videos' and public.is_admin());

create policy "Public read access for avatars bucket"
  on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload their own avatar"
  on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Public read access for logos bucket"
  on storage.objects for select using (bucket_id = 'logos');
create policy "Admins can manage logos bucket"
  on storage.objects for all using (bucket_id = 'logos' and public.is_admin());

-- ============================================================
-- SEED DATA (sample categories, collections, settings)
-- ============================================================

insert into public.categories (name, slug, display_order) values
  ('Outerwear', 'outerwear', 1),
  ('Hoodies', 'hoodies', 2),
  ('T-Shirts', 't-shirts', 3),
  ('Pants', 'pants', 4),
  ('Accessories', 'accessories', 5)
on conflict (slug) do nothing;

insert into public.collections (name, slug, description, display_order) values
  ('SS25 Essentials', 'ss25-essentials', 'Core pieces for the new season.', 1),
  ('Noir Series', 'noir-series', 'Monochrome statement pieces.', 2),
  ('Archive', 'archive', 'Limited reissues from past drops.', 3)
on conflict (slug) do nothing;

insert into public.website_settings (key, value) values
  ('instagram_url', 'https://instagram.com/silent'),
  ('twitter_url', 'https://x.com/silent'),
  ('tiktok_url', 'https://tiktok.com/@silent'),
  ('whatsapp_url', 'https://wa.me/10000000000'),
  ('support_email', 'support@silent-brand.com'),
  ('phone', '+1 (000) 000-0000'),
  ('store_address', '123 Fashion Avenue, New York, NY 10001'),
  ('footer_text', 'All rights reserved.')
on conflict (key) do nothing;

-- ============================================================
-- MAKE A USER ADMIN (run manually after they sign up)
-- ============================================================
-- update public.profiles set role = 'admin' where email = 'your-admin-email@example.com';
