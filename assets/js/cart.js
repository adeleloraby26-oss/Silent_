// SILENT_ — Cart Module

const CART_KEY = 'silent_cart';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
}

export function addToCart(product, size, quantity = 1) {
  const cart = getCart();
  const key = `${product.id}-${size}`;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      image: product.images?.[0] || '',
      size,
      quantity,
      slug: product.slug
    });
  }
  saveCart(cart);
  showCartNotification();
}

export function removeFromCart(key) {
  const cart = getCart().filter(i => i.key !== key);
  saveCart(cart);
}

export function updateQuantity(key, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (item) {
    if (quantity <= 0) return removeFromCart(key);
    item.quantity = quantity;
    saveCart(cart);
  }
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartTotal() {
  return getCart().reduce((sum, i) => {
    const price = i.sale_price || i.price;
    return sum + price * i.quantity;
  }, 0);
}

export function applyCoupon(code, total) {
  // Placeholder — validate against Supabase in checkout
  return { discount: 0, final: total };
}

function showCartNotification() {
  const n = document.createElement('div');
  n.className = 'cart-notification';
  n.textContent = 'Added to cart';
  document.body.appendChild(n);
  requestAnimationFrame(() => n.classList.add('show'));
  setTimeout(() => {
    n.classList.remove('show');
    setTimeout(() => n.remove(), 400);
  }, 2000);
}

export function updateCartBadge() {
  document.querySelectorAll('.cart-count').forEach(el => {
    const count = getCartCount();
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}
