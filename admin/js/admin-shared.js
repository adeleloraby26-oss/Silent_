// SILENT_ Admin — Shared Sidebar Component
export function renderAdminSidebar(active = '') {
  const links = [
    { section: 'Overview', items: [
      { href: '/admin/index.html', key: 'dashboard', label: 'Dashboard', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>' },
      { href: '/admin/analytics.html', key: 'analytics', label: 'Analytics', icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' }
    ]},
    { section: 'Catalog', items: [
      { href: '/admin/products.html', key: 'products', label: 'Products', icon: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>' },
      { href: '/admin/collections.html', key: 'collections', label: 'Collections', icon: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>' },
      { href: '/admin/inventory.html', key: 'inventory', label: 'Inventory', icon: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' }
    ]},
    { section: 'Commerce', items: [
      { href: '/admin/orders.html', key: 'orders', label: 'Orders', icon: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>' },
      { href: '/admin/customers.html', key: 'customers', label: 'Customers', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
      { href: '/admin/coupons.html', key: 'coupons', label: 'Coupons', icon: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>' }
    ]},
    { section: 'Content', items: [
      { href: '/admin/newsletter.html', key: 'newsletter', label: 'Newsletter', icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
      { href: '/admin/settings.html', key: 'settings', label: 'Settings', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' }
    ]}
  ];

  return `
  <aside class="admin-sidebar" id="admin-sidebar" aria-label="Admin navigation">
    <div class="admin-sidebar__logo">
      <span class="admin-sidebar__logo-text">SILENT<span style="opacity:0.3">_</span></span>
      <span class="admin-sidebar__badge">Admin</span>
    </div>
    <nav class="admin-nav" aria-label="Admin sections">
      ${links.map(group => `
        <div class="admin-nav__section">
          <span class="admin-nav__section-label">${group.section}</span>
          ${group.items.map(item => `
            <a href="${item.href}" class="admin-nav__link ${active === item.key ? 'active' : ''}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${item.icon}</svg>
              ${item.label}
            </a>
          `).join('')}
        </div>
      `).join('')}
    </nav>
    <div class="admin-sidebar__bottom">
      <div class="admin-sidebar__user">
        <div class="admin-sidebar__user-avatar">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <div id="admin-user-name" style="font-size:11px;color:rgba(255,255,255,0.6);">Admin</div>
          <button id="admin-signout" style="font-size:10px;color:rgba(255,255,255,0.25);background:none;border:none;letter-spacing:0.1em;cursor:pointer;padding:0;font-family:inherit;">Sign Out</button>
        </div>
      </div>
    </div>
  </aside>
  `;
}

export async function initAdminCommon() {
  const { supabase } = await import('/assets/js/supabase.js');
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
    const nameEl = document.getElementById('admin-user-name');
    if (nameEl) nameEl.textContent = profile?.full_name || user.email;
  }
  document.getElementById('admin-signout')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth/login.html';
  });
  const dateEl = document.getElementById('admin-date');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
