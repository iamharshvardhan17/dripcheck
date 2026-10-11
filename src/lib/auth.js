import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY_USER = 'wardrobe_current_user';
const STORAGE_KEY_USERS = 'wardrobe_registered_users';

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

  // Check exact domain blacklist
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isTemp: true,
      reason: 'Temporary and disposable email addresses are not allowed. Please use a permanent email (e.g. Gmail, Outlook, Yahoo, iCloud).',
    };
  }

  // Check pattern heuristic
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
 * Get current logged in user
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
 * Get all registered users from storage
 * @returns {Array}
 */
export function getRegisteredUsers() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to get registered users:', error);
    return [];
  }
}

/**
 * Dispatches a custom auth change event
 */
function notifyAuthChange(user) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('wardrobe_auth_changed', { detail: user }));
  }
}

/**
 * Set current user and notify
 * @param {Object|null} user
 */
function setCurrentUser(user) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY_USER);
    }
    notifyAuthChange(user);
  } catch (error) {
    console.error('Failed to save current user:', error);
  }
}

/**
 * Register a new user with Email and Password
 * Enforces NO TEMP / DISPOSABLE EMAIL rule
 */
export function registerWithEmail({ name, email, password }) {
  const sanitizedName = (name || '').trim();
  const sanitizedEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!sanitizedName) {
    throw new Error('Please enter your full name.');
  }

  if (!sanitizedEmail) {
    throw new Error('Please enter your email address.');
  }

  // Check temp email
  const tempCheck = isTempEmail(sanitizedEmail);
  if (tempCheck.isTemp) {
    throw new Error(tempCheck.reason || 'Disposable email addresses are not permitted.');
  }

  if (cleanPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email === sanitizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists. Please log in.');
  }

  const newUser = {
    id: uuidv4(),
    name: sanitizedName,
    email: sanitizedEmail,
    password: cleanPassword, // In client demo store
    provider: 'email',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sanitizedName)}&backgroundColor=9333ea,a855f7`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }

  const sessionUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    provider: newUser.provider,
    avatar: newUser.avatar,
  };

  setCurrentUser(sessionUser);
  return sessionUser;
}

/**
 * Login with Email and Password
 */
export function loginWithEmail({ email, password }) {
  const sanitizedEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!sanitizedEmail || !cleanPassword) {
    throw new Error('Please enter both email and password.');
  }

  const users = getRegisteredUsers();
  const found = users.find((u) => u.email === sanitizedEmail && u.password === cleanPassword);

  if (!found) {
    // If not found in store, verify temp email isn't used
    const tempCheck = isTempEmail(sanitizedEmail);
    if (tempCheck.isTemp) {
      throw new Error(tempCheck.reason || 'Disposable email addresses are not permitted.');
    }
    throw new Error('Invalid email or password. Please check your credentials or create an account.');
  }

  const sessionUser = {
    id: found.id,
    name: found.name,
    email: found.email,
    provider: found.provider,
    avatar: found.avatar,
  };

  setCurrentUser(sessionUser);
  return sessionUser;
}

/**
 * Login with Google
 * Supports custom Google profile or one-click verified Google authentication
 */
export function loginWithGoogle(customGoogleProfile = null) {
  const googleUser = customGoogleProfile || {
    id: uuidv4(),
    name: 'Harsh Vardhan',
    email: 'iamharshvardhan17@gmail.com',
    provider: 'google',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date().toISOString(),
  };

  // Ensure Google email is never disposable
  const tempCheck = isTempEmail(googleUser.email);
  if (tempCheck.isTemp) {
    throw new Error('Google account must have a valid non-disposable email address.');
  }

  const users = getRegisteredUsers();
  const existingIdx = users.findIndex((u) => u.email === googleUser.email);
  if (existingIdx === -1) {
    users.push(googleUser);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }
  }

  const sessionUser = {
    id: googleUser.id,
    name: googleUser.name,
    email: googleUser.email,
    provider: 'google',
    avatar: googleUser.avatar,
  };

  setCurrentUser(sessionUser);
  return sessionUser;
}

/**
 * Logout the current user
 */
export function logoutUser() {
  setCurrentUser(null);
}
