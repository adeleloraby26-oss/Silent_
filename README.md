# SILENT_ — Premium Luxury E-Commerce Platform

A complete, production-ready luxury fashion e-commerce platform built with vanilla HTML5, CSS3, JavaScript (ES6 Modules), and Supabase. No frameworks. No build step required.

---

## 🖤 Brand Identity

Minimal. Luxury. Dark. Premium. High-end streetwear aesthetic inspired by Rick Owens, Fear of God, COS, Saint Laurent, and A-COLD-WALL*.

---

## 📁 Project Structure

```
silent_/
├── index.html                  # Homepage
├── manifest.json                # PWA manifest
├── robots.txt
├── sitemap.xml
│
├── assets/
│   ├── css/                    # Global + page-specific stylesheets
│   │   ├── global.css          # Design system, nav, footer, buttons, etc.
│   │   ├── home.css
│   │   ├── shop.css
│   │   ├── product.css
│   │   ├── cart-page.css
│   │   ├── checkout.css
│   │   ├── auth.css
│   │   ├── profile.css
│   │   └── lookbook.css
│   ├── js/
│   │   ├── supabase.js         # Supabase client + auth helpers
│   │   ├── cart.js              # Cart state management (localStorage)
│   │   ├── wishlist.js          # Wishlist (Supabase + localStorage fallback)
│   │   ├── nav.js                # Nav, search, cart drawer, newsletter logic
│   │   ├── components.js        # Shared HTML templates (nav, footer)
│   │   └── utils.js             # Formatting, scroll reveal, cursor, etc.
│   └── images/
│
├── pages/
│   ├── shop.html
│   ├── product.html
│   ├── collections.html
│   ├── lookbook.html
│   ├── cart.html
│   ├── checkout.html
│   ├── order-confirmation.html
│   ├── wishlist.html
│   ├── about.html
│   ├── contact.html
│   ├── faq.html
│   ├── privacy.html
│   ├── terms.html
│   └── 404.html
│
├── auth/
│   ├── login.html
│   ├── register.html
│   ├── forgot.html
│   ├── profile.html
│   └── orders.html
│
├── admin/
│   ├── index.html               # Dashboard
│   ├── products.html
│   ├── orders.html
│   ├── customers.html
│   ├── inventory.html
│   ├── collections.html
│   ├── coupons.html
│   ├── newsletter.html
│   ├── analytics.html
│   ├── settings.html
│   ├── css/admin.css
│   └── js/admin-shared.js
│
└── sql/
    └── 001_initial_schema.sql   # Complete database schema
```

---

## 🚀 Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **anon public key** from Settings → API.

### 2. Run the Database Schema

1. Open the Supabase SQL Editor.
2. Copy the entire contents of `sql/001_initial_schema.sql`.
3. Paste and run it. This creates all tables, indexes, triggers, functions, RLS policies, and storage buckets.

### 3. Configure Supabase Credentials

Open `assets/js/supabase.js` and replace the placeholders:

```js
export const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
export const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### 4. Enable Authentication Providers

In Supabase Dashboard → Authentication → Providers:
- Enable **Email** (enabled by default).
- Enable **Google** OAuth if you want social login (configure OAuth client ID/secret).
- Under Authentication → URL Configuration, set your **Site URL** and **Redirect URLs** to match your deployed domain.

### 5. Create Your First Admin User

1. Register a normal account through `/auth/register.html` on your deployed site.
2. In the Supabase SQL Editor, run:
   ```sql
   update public.profiles set role = 'admin' where email = 'your-email@example.com';
   ```
3. You can now log in and access `/admin/index.html`.

### 6. Add Sample Products

Use the Admin Panel (`/admin/products.html`) to add products, categories, collections, images, and inventory. Or insert directly via SQL/Supabase Table Editor.

### 7. Storage Buckets

The schema automatically creates these public storage buckets:
- `products` — product images
- `lookbook` — lookbook/editorial images
- `banners` — hero banners, collection covers
- `videos` — product videos
- `avatars` — user avatars
- `logos` — brand logo

---

## 🌐 Deployment

This is a 100% static site (no build step, no server-side rendering) — it can be deployed to any static host.

### Option A: Netlify
1. Drag and drop the project folder into Netlify, or connect your Git repo.
2. Set the publish directory to the project root.
3. Add a `_redirects` file if you want clean URL handling (optional).

### Option B: Vercel
1. Import the project as a static site.
2. No build command needed — set "Output Directory" to `.` (root).

### Option C: Cloudflare Pages
1. Connect your Git repository.
2. Build command: (leave empty)
3. Build output directory: `/`

### Option D: GitHub Pages
1. Push the project to a GitHub repository.
2. Enable GitHub Pages in repo settings, pointing to the root or `/docs` folder.

**Important:** Since this uses ES6 modules (`type="module"`), the site must be served over HTTP(S) — opening `index.html` directly via `file://` will not work due to CORS restrictions on module imports. Use a local dev server during development:

```bash
# Python
python3 -m http.server 8000

# Node (http-server)
npx http-server -p 8000
```

Then visit `http://localhost:8000`.

---

## 💳 Payment Integration

The checkout page (`pages/checkout.html`) includes a payment form placeholder. To accept real payments:

1. **Stripe**: Use Stripe Elements or Stripe Checkout. Create a Supabase Edge Function to create a Payment Intent server-side, then confirm it client-side.
2. **PayPal**: Integrate the PayPal JS SDK directly in the checkout page.

Never process raw card numbers without PCI-compliant tooling (Stripe Elements, etc.) — the current form is a UI placeholder only.

---

## 📧 Email Integration (Newsletter & Transactional)

The newsletter signup stores emails in the `newsletter` table. To actually send campaigns:

1. Create a Supabase Edge Function that calls an email API (Resend, SendGrid, Postmark).
2. Trigger it from `admin/newsletter.html`'s "Send Campaign" button, or set up a Postgres trigger/webhook for transactional emails (order confirmations, shipping updates).

---

## 🔐 Security Notes

- All sensitive operations are protected by Supabase Row Level Security (RLS) policies — see `sql/001_initial_schema.sql`.
- Admin routes check `role = 'admin'` on the `profiles` table via the `requireAdmin()` helper in `assets/js/supabase.js`.
- Never expose your Supabase **service_role** key in client-side code — only the anon key belongs in `supabase.js`.
- Add rate limiting and CAPTCHA to auth forms in production (e.g., via Supabase Auth hooks or Cloudflare Turnstile).

---

## ⚡ Performance Notes

- All images should be served via Supabase Storage's CDN or an image optimization service (e.g., Cloudflare Images, Imgix) for production.
- Lazy loading (`loading="lazy"`) is applied to all below-the-fold images.
- Infinite scroll on the shop page paginates via Supabase `.range()` queries (12 products per page).
- Consider adding a service worker for offline caching to improve the PWA experience (manifest.json is already included).

---

## 🎨 Customization

All brand colors, spacing, and typography are controlled via CSS custom properties in `assets/css/global.css`:

```css
:root {
  --bg: #000000;
  --bg-card: #0d0d0d;
  --border: rgba(255,255,255,0.08);
  --text-primary: #ffffff;
  --text-secondary: #888888;
  --font: 'Helvetica Neue', 'Inter', -apple-system, Arial, sans-serif;
  /* ... */
}
```

Update the logo by uploading via Admin → Settings, or replace `assets/images/favicon.svg` and the `SILENT_` text logo throughout the nav/footer templates in `assets/js/components.js`.

---

## 📋 Feature Checklist

✅ Luxury dark-mode design system  
✅ Full product catalog with filters, sorting, infinite scroll  
✅ Product detail pages with gallery, zoom, size selector, reviews  
✅ Cart drawer + full cart page with coupon support  
✅ Multi-step checkout (guest + registered)  
✅ User authentication (email/password + Google OAuth)  
✅ User profile, order history, saved addresses, wishlist  
✅ Lookbook with lightbox gallery  
✅ Complete admin dashboard (products, orders, customers, inventory, coupons, newsletter, analytics, settings)  
✅ Editable website settings (social links, contact info, hero banner, logo) — no hardcoded values  
✅ WhatsApp floating button (scroll-triggered)  
✅ Newsletter popup + footer signup  
✅ Restock-ready inventory system  
✅ Countdown timer for next drop  
✅ Full Supabase schema with RLS, triggers, functions, views  
✅ SEO meta tags, Open Graph, robots.txt, sitemap.xml  
✅ PWA manifest  
✅ Fully responsive (mobile, tablet, desktop)  
✅ Custom cursor, scroll reveal animations, page transitions  
✅ Accessible markup (ARIA labels, semantic HTML, keyboard navigation)

---

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime, Row Level Security)
- **No frameworks**: No React, Vue, Angular, Bootstrap, or Tailwind

---

## 📄 License

This codebase is provided for the SILENT_ brand build. Customize and deploy as needed for your business.
