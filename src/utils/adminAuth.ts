const SESSION_KEY = 'mugshop-admin-session';
const LOCK_KEY = 'mugshop-admin-lock';

export type AdminSession = {
  issuedAt: number; // ms
  expiresAt: number; // ms
  ua: string;
};

export function isLocked(): boolean {
  const until = Number(localStorage.getItem(LOCK_KEY) || '0');
  return Date.now() < until;
}

export function lockFor(ms: number) {
  localStorage.setItem(LOCK_KEY, String(Date.now() + ms));
}

export function setSession(ttlMinutes = 60) {
  const now = Date.now();
  const sess: AdminSession = {
    issuedAt: now,
    expiresAt: now + ttlMinutes * 60 * 1000,
    ua: navigator.userAgent
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sess));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const sess = JSON.parse(raw) as AdminSession;
    if (Date.now() > sess.expiresAt) return false;
    if (sess.ua !== navigator.userAgent) return false;
    return true;
  } catch {
    return false;
  }
}


