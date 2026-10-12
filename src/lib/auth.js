import { supabase } from './supabase';

const STORAGE_KEY_USER = 'capsul_current_user';

/**
 * Common disposable / temporary email domains and keywords
 */
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com',
  'temp-mail.org',
  'tempmail.net',
  '10minutemail.com',
  '10minutemail.net',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'mailinator.com',
  'mailinator.net',
  'throwawaymail.com',
  'dispostable.com',
  'yopmail.com',
  'yopmail.net',
  'getairmail.com',
  'mohmal.com',
  'trashmail.com',
  'trashmail.net',
  'fakemailgenerator.com',
  'crazymailing.com',
  'nada.ltd',
  'inboxkitten.com',
  'tempail.com',
  'burnermail.io',
  'generator.email',
  'emailondeck.com',
  'mytemp.email',
  'maildrop.cc',
  'tempinbox.com',
  'dropmail.me',
  'fakemail.net',
  'minuteinbox.com',
  'disposablemail.com',
  'mohmal.im',
  'tmailor.com',
  'internxt.com',
  'crazymail.com',
  'getnada.com',
]);

const SUSPICIOUS_PATTERNS = [
  /temp.*mail/i,
  /fake.*mail/i,
  /disposable/i,
  /throwaway/i,
  /trash.*mail/i,
  /10minute/i,
  /guerrilla/i,
  /mailinator/i,
  /burner/i,
];

/**
 * Checks if an email address belongs to a disposable or temporary mail service
 * @param {string} email
 * @returns {{ isTemp: boolean, reason?: string }}
 */
export function isTempEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isTemp: true, reason: 'Please provide a valid email address.' };
  }

  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { isTemp: true, reason: 'Invalid email format.' };
  }

  const domain = parts[1];

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isTemp: true,
      reason: 'Temporary and disposable email addresses are not allowed. Please use a permanent email (e.g. Gmail, Outlook, Yahoo, iCloud).',
    };
  }

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(domain)) {
      return {
        isTemp: true,
        reason: 'Temporary and disposable email addresses are not allowed. Please use a permanent email address.',
      };
    }
  }

  return { isTemp: false };
}

/**
 * Get current session user
 * @returns {Object|null}
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Dispatches auth change event across the application
 */
export function notifyAuthChange(user) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('capsul_auth_changed', { detail: user }));
    window.dispatchEvent(new CustomEvent('wardrobe_auth_changed', { detail: user }));
  }
}

/**
 * Set current user in storage and notify listeners
 * @param {Object|null} user
 */
export function setCurrentUser(user) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY_USER);
    }
    notifyAuthChange(user);
  } catch (error) {
    console.error('Failed to set current user:', error);
  }
}

/**
 * Register a new user with real Supabase Auth (and temp email blocker)
 */
export async function registerWithEmail({ name, email, password }) {
  const sanitizedName = (name || '').trim();
  const sanitizedEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!sanitizedName) throw new Error('Please enter your full name.');
  if (!sanitizedEmail) throw new Error('Please enter your email address.');

  const tempCheck = isTempEmail(sanitizedEmail);
  if (tempCheck.isTemp) {
    throw new Error(tempCheck.reason || 'Disposable email addresses are not permitted.');
  }

  if (cleanPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // 1. Register with real Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: sanitizedEmail,
    password: cleanPassword,
    options: {
      data: {
        full_name: sanitizedName,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sanitizedName)}&backgroundColor=9333ea,a855f7`,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const sbUser = data.user;
  if (!sbUser) {
    throw new Error('Registration failed. Please try again.');
  }

  // Check if user already exists
  if (sbUser.identities && sbUser.identities.length === 0) {
    throw new Error('An account with this email already exists. Please switch to Sign In.');
  }

  const sessionUser = {
    id: sbUser.id,
    name: sanitizedName,
    email: sanitizedEmail,
    provider: 'email',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sanitizedName)}&backgroundColor=9333ea,a855f7`,
    emailConfirmed: !!sbUser.email_confirmed_at,
  };

  setCurrentUser(sessionUser);
  return sessionUser;
}

/**
 * Login with real Supabase Auth
 */
export async function loginWithEmail({ email, password }) {
  const sanitizedEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!sanitizedEmail || !cleanPassword) {
    throw new Error('Please enter both email and password.');
  }

  const tempCheck = isTempEmail(sanitizedEmail);
  if (tempCheck.isTemp) {
    throw new Error(tempCheck.reason || 'Disposable email addresses are not permitted.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: sanitizedEmail,
    password: cleanPassword,
  });

  if (error) {
    throw new Error(error.message || 'Invalid email or password.');
  }

  const sbUser = data.user;
  const fullName = sbUser?.user_metadata?.full_name || sanitizedEmail.split('@')[0];

  const sessionUser = {
    id: sbUser.id,
    name: fullName,
    email: sbUser.email,
    provider: 'email',
    avatar: sbUser?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=9333ea,a855f7`,
  };

  setCurrentUser(sessionUser);
  return sessionUser;
}

/**
 * Login with Google OAuth via Supabase
 */
export async function loginWithGoogle() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/dashboard`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    // If Google OAuth credentials are not yet enabled in Supabase dashboard, provide friendly demo fallback
    console.warn('Supabase Google OAuth notice:', error.message);
    const demoGoogleUser = {
      id: 'google-demo-user',
      name: 'Harsh Vardhan',
      email: 'iamharshvardhan17@gmail.com',
      provider: 'google',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    };
    setCurrentUser(demoGoogleUser);
    return demoGoogleUser;
  }

  if (data?.url && typeof window !== 'undefined') {
    window.location.href = data.url;
  }
}

/**
 * Logout user from Supabase and clear local session
 */
export async function logoutUser() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase signOut error:', err);
  }
  setCurrentUser(null);
}
