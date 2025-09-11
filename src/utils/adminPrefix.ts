// Generates and persists a random admin URL prefix like "/admin-abc12345"
// Stored in localStorage so it remains stable across reloads.
export function getAdminPrefix(): string {
  // Use a fixed, non-env prefix as requested
  const fixedPrefix = '/X9fL2qRv8tZw';
  if (typeof window === 'undefined') return fixedPrefix;
  const key = 'mugshop-admin-prefix';
  // Persist and enforce this value so any previous stored value is overridden
  try {
    localStorage.setItem(key, fixedPrefix);
  } catch {}
  // eslint-disable-next-line no-console
  console.info(`[Mugshop] Admin base path (fixed): ${fixedPrefix}`);
  return fixedPrefix;
}


