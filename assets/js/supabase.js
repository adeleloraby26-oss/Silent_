// SILENT_ — Supabase Configuration
// Replace these values with your actual Supabase project credentials

export const SUPABASE_URL = 'https://ptaoirikmaqozgvhskmb.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0YW9pcmlrbWFxb3pndmhza21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTkyMTYsImV4cCI6MjA5ODIzNTIxNn0.BP9X1IadI2n47HQF2kJJNERsdTHdP5aYTv_1PB4VojQ';

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  return data?.role === 'admin';
}

export async function requireAuth(redirectTo = '/auth/login.html') {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = redirectTo;
    return null;
  }
  return user;
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    window.location.href = '/index.html';
    return false;
  }
  return true;
}
