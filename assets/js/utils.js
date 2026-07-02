// SILENT_ — Global Utilities

// Format currency
export function formatPrice(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(amount);
}

// Debounce
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Slugify
export function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Truncate text
export function truncate(str, max = 80) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

// Get URL param
export function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

// Show toast notification
export function toast(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.s-toast');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = `s-toast s-toast--${type}`;
  el.textContent = message;
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('visible'));
  });

  setTimeout(() => {
    el.classList.remove('visible');
    setTimeout(() => el.remove(), 500);
  }, duration);
}

// Animate on scroll
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

// Custom cursor
export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  const cursor = document.createElement('div');
  cursor.className = 's-cursor';
  const cursorDot = document.createElement('div');
  cursorDot.className = 's-cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.transform = `translate(${curX}px, ${curY}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, [role="button"], .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

// Smooth page transitions
export function initPageTransitions() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || link.target === '_blank') return;
    
    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  });

  window.addEventListener('pageshow', () => {
    setTimeout(() => overlay.classList.remove('active'), 50);
  });
}

// Loading screen
export function initLoadingScreen() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 800);
    }, 1200);
  });
}

// WhatsApp floating button visibility
export function initWhatsAppButton() {
  const btn = document.getElementById('whatsapp-float');
  if (!btn) return;
  
  let shown = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300 && !shown) {
      btn.classList.add('visible');
      shown = true;
    } else if (window.scrollY <= 300 && shown) {
      btn.classList.remove('visible');
      shown = false;
    }
  });
}

// Newsletter popup
export function initNewsletterPopup() {
  if (sessionStorage.getItem('nl_shown')) return;
  setTimeout(() => {
    const popup = document.getElementById('newsletter-popup');
    if (popup) {
      popup.classList.add('active');
      sessionStorage.setItem('nl_shown', '1');
    }
  }, 8000);
}

// Recently viewed
export function trackRecentlyViewed(product) {
  const KEY = 'silent_recent';
  let list = JSON.parse(localStorage.getItem(KEY)) || [];
  list = [product, ...list.filter(p => p.id !== product.id)].slice(0, 8);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getRecentlyViewed() {
  return JSON.parse(localStorage.getItem('silent_recent')) || [];
}
