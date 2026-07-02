// SILENT_ — Wishlist Module
import { supabase, getCurrentUser } from './supabase.js';

const LOCAL_KEY = 'silent_wishlist';

export async function getWishlist() {
  const user = await getCurrentUser();
  if (user) {
    const { data } = await supabase
      .from('wishlist')
      .select('product_id, products(id, name, slug, price, sale_price)')
      .eq('user_id', user.id);
    return data || [];
  }
  return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
}

export async function addToWishlist(productId) {
  const user = await getCurrentUser();
  if (user) {
    await supabase.from('wishlist').upsert({ user_id: user.id, product_id: productId });
  } else {
    const list = JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    if (!list.includes(productId)) {
      list.push(productId);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    }
  }
  updateWishlistButtons(productId, true);
}

export async function removeFromWishlist(productId) {
  const user = await getCurrentUser();
  if (user) {
    await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
  } else {
    const list = (JSON.parse(localStorage.getItem(LOCAL_KEY)) || []).filter(id => id !== productId);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  }
  updateWishlistButtons(productId, false);
}

export async function isInWishlist(productId) {
  const user = await getCurrentUser();
  if (user) {
    const { data } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();
    return !!data;
  }
  const list = JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
  return list.includes(productId);
}

export async function toggleWishlist(productId) {
  const inList = await isInWishlist(productId);
  if (inList) {
    await removeFromWishlist(productId);
    return false;
  } else {
    await addToWishlist(productId);
    return true;
  }
}

function updateWishlistButtons(productId, active) {
  document.querySelectorAll(`[data-wishlist="${productId}"]`).forEach(btn => {
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}
