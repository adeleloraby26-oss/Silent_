// SILENT_ — Navigation & Global UI Controller
import { getCartCount, getCart, removeFromCart, updateQuantity, getCartTotal } from './cart.js';
import { updateCartBadge } from './cart.js';
import { formatPrice } from './utils.js';
import { supabase } from './supabase.js';

export function initNav() {
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  // Scroll behavior
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger
  hamburger?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.contains('open');
    mobileNav?.classList.toggle('open', !isOpen);
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close mobile nav on link click
  mobileNav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

export function initCart() {
  const trigger = document.getElementById('cart-trigger');
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const closeBtn = document.getElementById('cart-close');

  function openCart() {
    renderCartDrawer();
    drawer?.classList.add('open');
    overlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  trigger?.addEventListener('click', openCart);
  closeBtn?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);

  window.addEventListener('cartUpdated', () => {
    updateCartBadge();
    if (drawer?.classList.contains('open')) renderCartDrawer();
  });

  updateCartBadge();
}

function renderCartDrawer() {
  const content = document.getElementById('cart-drawer-content');
  if (!content) return;

  const cart = getCart();
  const total = getCartTotal();

  if (cart.length === 0) {
    content.innerHTML = `
      <div class="cart-empty">
        <svg class="cart-empty__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
        </svg>
        <p class="cart-empty__text">Your cart is empty</p>
        <a href="/pages/shop.html" class="s-btn">Continue Shopping</a>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div class="cart-drawer__items">
      ${cart.map(item => `
        <div class="cart-item" data-key="${item.key}">
          <div class="cart-item__image">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" loading="lazy">` : ''}
          </div>
          <div class="cart-item__details">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__meta">Size: ${item.size}</div>
            <div class="cart-item__qty">
              <button class="qty-minus" data-key="${item.key}" aria-label="Decrease quantity">−</button>
              <span>${item.quantity}</span>
              <button class="qty-plus" data-key="${item.key}" aria-label="Increase quantity">+</button>
            </div>
            <button class="cart-item__remove" data-key="${item.key}">Remove</button>
          </div>
          <div class="cart-item__price">${formatPrice((item.sale_price || item.price) * item.quantity)}</div>
        </div>
      `).join('')}
    </div>
    <div class="cart-drawer__footer">
      <div class="cart-subtotal">
        <span>Subtotal</span>
        <span class="amount">${formatPrice(total)}</span>
      </div>
      <p style="font-size:10px;color:var(--text-muted);letter-spacing:0.08em;margin-bottom:16px;text-transform:uppercase;">Shipping & taxes calculated at checkout</p>
      <a href="/pages/checkout.html" class="s-btn s-btn--primary s-btn--full" style="margin-bottom:12px;">Checkout</a>
      <a href="/pages/cart.html" class="s-btn s-btn--full">View Cart</a>
    </div>
  `;

  content.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const item = getCart().find(i => i.key === key);
      if (item) updateQuantity(key, item.quantity - 1);
    });
  });

  content.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const item = getCart().find(i => i.key === key);
      if (item) updateQuantity(key, item.quantity + 1);
    });
  });

  content.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.key));
  });
}

export function initSearch() {
  const trigger = document.getElementById('search-trigger');
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  const closeBtn = document.getElementById('search-close');
  const results = document.getElementById('search-results');

  let debounceTimer;

  function openSearch() {
    overlay?.classList.add('active');
    input?.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
    if (input) input.value = '';
    if (results) results.innerHTML = '';
  }

  trigger?.addEventListener('click', openSearch);
  closeBtn?.addEventListener('click', closeSearch);

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  input?.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => performSearch(input.value), 300);
  });

  async function performSearch(query) {
    if (!query || query.length < 2) {
      if (results) results.innerHTML = '';
      return;
    }

    const { data } = await supabase
      .from('products')
      .select('id, name, slug, price, sale_price, category_name')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(8);

    if (!results) return;

    if (!data || data.length === 0) {
      results.innerHTML = `<p class="s-body" style="text-align:center;padding:40px 0;">No results for "${query}"</p>`;
      return;
    }

    results.innerHTML = `
      <div style="margin-bottom:16px;">
        <span class="s-eyebrow">${data.length} Results for "${query}"</span>
      </div>
      <div class="product-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));">
        ${data.map(p => `
          <a href="/pages/product.html?slug=${p.slug}" class="product-card" onclick="closeSearch()">
            <div class="product-card__info">
              <div class="product-card__name">${p.name}</div>
              <div class="product-card__price">${formatPrice(p.sale_price || p.price)}</div>
            </div>
          </a>
        `).join('')}
      </div>
    `;
  }
}

export function initNewsletterPopup() {
  const popup = document.getElementById('newsletter-popup');
  const closeBtn = document.getElementById('nl-close');
  const submitBtn = document.getElementById('nl-submit');
  const emailInput = document.getElementById('nl-email');

  closeBtn?.addEventListener('click', () => popup?.classList.remove('active'));
  popup?.addEventListener('click', e => { if (e.target === popup) popup.classList.remove('active'); });

  submitBtn?.addEventListener('click', async () => {
    const email = emailInput?.value?.trim();
    if (!email || !email.includes('@')) return;

    await supabase.from('newsletter').upsert({ email, subscribed_at: new Date().toISOString() });
    popup?.classList.remove('active');
  });

  // Footer newsletter
  document.getElementById('footer-nl-submit')?.addEventListener('click', async () => {
    const email = document.getElementById('footer-email')?.value?.trim();
    if (!email || !email.includes('@')) return;
    await supabase.from('newsletter').upsert({ email });
    const btn = document.getElementById('footer-nl-submit');
    if (btn) btn.textContent = '✓';
  });
}

export function initAccordions() {
  document.querySelectorAll('.s-accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.s-accordion__item');
      const isOpen = item?.classList.contains('open');
      document.querySelectorAll('.s-accordion__item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item?.classList.add('open');
    });
  });
}

export async function loadSiteSettings() {
  const { data } = await supabase.from('website_settings').select('key, value');
  if (!data) return {};
  return Object.fromEntries(data.map(row => [row.key, row.value]));
}
