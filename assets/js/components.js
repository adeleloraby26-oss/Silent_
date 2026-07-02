// SILENT_ — Shared HTML Components

export function renderNav(activePage = '') {
  return `
  <!-- Loading Screen -->
  <div id="loader">
    <div class="loader-logo">SILENT<span>_</span></div>
    <div class="loader-bar"></div>
  </div>

  <!-- Navigation -->
  <nav class="s-nav" id="main-nav" role="navigation" aria-label="Main navigation">
    <a href="/index.html" class="s-nav__logo" aria-label="SILENT_ Home">SILENT<span>_</span></a>

    <ul class="s-nav__links" role="list">
      <li><a href="/pages/shop.html" class="${activePage === 'shop' ? 'active' : ''}">Shop</a></li>
      <li><a href="/pages/collections.html" class="${activePage === 'collections' ? 'active' : ''}">Collections</a></li>
      <li><a href="/pages/lookbook.html" class="${activePage === 'lookbook' ? 'active' : ''}">Lookbook</a></li>
      <li><a href="/pages/about.html" class="${activePage === 'about' ? 'active' : ''}">About</a></li>
    </ul>

    <div class="s-nav__actions">
      <button class="s-nav__icon-btn" id="search-trigger" aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
      <a href="/pages/wishlist.html" class="s-nav__icon-btn" aria-label="Wishlist">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </a>
      <button class="s-nav__icon-btn" id="cart-trigger" aria-label="Cart">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <span class="cart-count" aria-live="polite"></span>
      </button>
      <a href="/auth/profile.html" class="s-nav__icon-btn" aria-label="Account">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </a>
      <button class="s-nav__hamburger" id="hamburger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- Mobile Navigation -->
  <div class="s-nav-mobile" id="mobile-nav" role="dialog" aria-modal="true" aria-label="Mobile menu">
    <ul class="s-nav-mobile__links" role="list">
      <li><a href="/index.html">Home</a></li>
      <li><a href="/pages/shop.html">Shop</a></li>
      <li><a href="/pages/collections.html">Collections</a></li>
      <li><a href="/pages/lookbook.html">Lookbook</a></li>
      <li><a href="/pages/about.html">About</a></li>
      <li><a href="/pages/contact.html">Contact</a></li>
      <li><a href="/pages/wishlist.html">Wishlist</a></li>
      <li><a href="/auth/profile.html">Account</a></li>
    </ul>
  </div>

  <!-- Search Overlay -->
  <div class="s-search-overlay" id="search-overlay" role="search" aria-modal="true">
    <div class="s-search-overlay__header">
      <input type="text" class="s-search-overlay__input" id="search-input" placeholder="Search products, collections..." autocomplete="off" aria-label="Search">
      <button class="s-search-overlay__close" id="search-close" aria-label="Close search">✕</button>
    </div>
    <div class="s-search-overlay__results" id="search-results" aria-live="polite"></div>
  </div>

  <!-- Cart Drawer -->
  <div class="cart-overlay" id="cart-overlay"></div>
  <aside class="cart-drawer" id="cart-drawer" role="complementary" aria-label="Shopping cart">
    <div class="cart-drawer__header">
      <span class="cart-drawer__title">Cart</span>
      <button class="cart-drawer__close" id="cart-close" aria-label="Close cart">✕</button>
    </div>
    <div id="cart-drawer-content">
      <!-- Populated by JS -->
    </div>
  </aside>

  <!-- WhatsApp Float -->
  <a id="whatsapp-float" href="#" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp support" title="Chat with us on WhatsApp">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>

  <!-- Newsletter Popup -->
  <div id="newsletter-popup" role="dialog" aria-modal="true" aria-label="Newsletter signup">
    <div class="newsletter-popup__box">
      <button class="newsletter-popup__close" id="nl-close" aria-label="Close">✕</button>
      <span class="s-eyebrow">Exclusive Access</span>
      <h2 class="s-subheading" style="margin-bottom:16px;font-size:28px;">Join the Inner Circle</h2>
      <p class="s-body" style="margin-bottom:32px;font-size:13px;">Be the first to know about new drops, exclusive releases, and behind-the-scenes access.</p>
      <div class="s-footer__newsletter" style="margin-bottom:16px;">
        <input type="email" id="nl-email" placeholder="Your email address">
        <button id="nl-submit">Join</button>
      </div>
      <p style="font-size:10px;color:var(--text-muted);letter-spacing:0.1em;">No spam. Unsubscribe anytime.</p>
    </div>
  </div>
  `;
}

export function renderFooter(settings = {}) {
  const year = new Date().getFullYear();
  return `
  <footer class="s-footer" role="contentinfo">
    <div class="s-footer__top" style="max-width:var(--max-width);margin:0 auto;">
      <div>
        <a href="/index.html" class="s-footer__logo">SILENT<span style="opacity:0.4">_</span></a>
        <p class="s-footer__tagline">
          Premium high-end streetwear.<br>
          Designed for those who move in silence.
        </p>
        <div class="s-footer__socials">
          ${settings.instagram_url ? `<a href="${settings.instagram_url}" target="_blank" rel="noopener" class="s-footer__social" aria-label="Instagram">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
            IG
          </a>` : ''}
          ${settings.twitter_url ? `<a href="${settings.twitter_url}" target="_blank" rel="noopener" class="s-footer__social" aria-label="X / Twitter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.639 5.906-5.639Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            X
          </a>` : ''}
          ${settings.tiktok_url ? `<a href="${settings.tiktok_url}" target="_blank" rel="noopener" class="s-footer__social" aria-label="TikTok">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.17a8.16 8.16 0 004.77 1.52V7.24a4.85 4.85 0 01-1-.55z"/></svg>
            TT
          </a>` : ''}
          ${settings.whatsapp_url ? `<a href="${settings.whatsapp_url}" target="_blank" rel="noopener" class="s-footer__social" aria-label="WhatsApp">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WA
          </a>` : ''}
        </div>
      </div>
      <div class="s-footer__col">
        <h4>Shop</h4>
        <ul>
          <li><a href="/pages/shop.html">All Products</a></li>
          <li><a href="/pages/collections.html">Collections</a></li>
          <li><a href="/pages/lookbook.html">Lookbook</a></li>
          <li><a href="/pages/shop.html?filter=new">New Arrivals</a></li>
          <li><a href="/pages/shop.html?filter=sale">Sale</a></li>
        </ul>
      </div>
      <div class="s-footer__col">
        <h4>Support</h4>
        <ul>
          <li><a href="/pages/faq.html">FAQ</a></li>
          <li><a href="/pages/contact.html">Contact</a></li>
          <li><a href="/pages/about.html">About Us</a></li>
          ${settings.support_email ? `<li><a href="mailto:${settings.support_email}">${settings.support_email}</a></li>` : ''}
          ${settings.phone ? `<li><a href="tel:${settings.phone}">${settings.phone}</a></li>` : ''}
        </ul>
      </div>
      <div class="s-footer__col">
        <h4>Newsletter</h4>
        <p class="s-body" style="font-size:12px;margin-bottom:16px;">Early access. New drops. Inner circle only.</p>
        <div class="s-footer__newsletter">
          <input type="email" id="footer-email" placeholder="Email address" aria-label="Email address for newsletter">
          <button id="footer-nl-submit">→</button>
        </div>
      </div>
    </div>
    <div class="s-footer__bottom" style="max-width:var(--max-width);margin:0 auto;">
      <span class="s-footer__copy">© ${year} SILENT_. ${settings.footer_text || 'All rights reserved.'}</span>
      <nav class="s-footer__legal" aria-label="Legal">
        <a href="/pages/privacy.html">Privacy</a>
        <a href="/pages/terms.html">Terms</a>
      </nav>
    </div>
  </footer>
  `;
}

export function renderHead({ title = 'SILENT_', description = 'Premium luxury streetwear.', canonical = '' } = {}) {
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — SILENT_</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#000000">
  ${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
  <meta property="og:title" content="${title} — SILENT_">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="/assets/images/og.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} — SILENT_">
  <meta name="twitter:description" content="${description}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/global.css">
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" href="/assets/images/favicon.ico">
  `;
}
