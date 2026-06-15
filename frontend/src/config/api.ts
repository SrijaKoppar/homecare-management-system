// src/config/api.ts
// Robust API base resolver that works across CRA (process.env), Vite (import.meta.env),
// or plain fallback. Safe for runtime in the browser.

function resolveApiBase(): string {
  // 1) CRA / Webpack style env (REACT_APP_*)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process?.env?.REACT_APP_API_BASE) {
      // @ts-ignore
      return process.env.REACT_APP_API_BASE;
    }
  } catch (_) {}

  // 2) Vite style env (import.meta.env)
  try {
    // @ts-ignore
    const im = (typeof import.meta !== 'undefined') ? (import.meta as any).env : null;
    if (im && im.VITE_API_BASE) return im.VITE_API_BASE;
    if (im && im.REACT_APP_API_BASE) return im.REACT_APP_API_BASE; // sometimes duplicated
  } catch (_) {}

  // 3) window global override (useful for Docker/dev pages)
  try {
    // @ts-ignore
    if (typeof window !== 'undefined' && (window as any).__API_BASE) return (window as any).__API_BASE;
  } catch (_) {}

  // 4) Default: same-origin (Vite dev server proxies /api → backend on :8000)
  return '';
}

export const API_BASE = resolveApiBase();
export default API_BASE;

/** Stub headers until auth is implemented (matches backend defaults). */
export const DEFAULT_ORG_ID = '00000000-0000-0000-0000-000000000000';
export const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

export function apiHeaders(extra?: HeadersInit): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const organizationId = typeof window !== 'undefined'
    ? localStorage.getItem('organization_id') || DEFAULT_ORG_ID
    : DEFAULT_ORG_ID;
  const userId = typeof window !== 'undefined'
    ? localStorage.getItem('user_id') || DEFAULT_USER_ID
    : DEFAULT_USER_ID;
  const headers: Record<string, string> = {
    'X-Organization-Id': organizationId,
    'X-User-Id': userId,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return {
    ...headers,
    ...extra,
  };
}

/**
 * Build a fetch-safe URL when API_BASE may be empty (Vite proxy / same-origin).
 * Avoids `new URL(relativePath)` which throws without a base.
 */
export function apiUrl(
  path: string,
  searchParams?: Record<string, string | undefined>
): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = API_BASE.replace(/\/$/, '');
  let url = base ? `${base}${normalized}` : normalized;

  if (!searchParams) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value != null && value !== '') params.set(key, value);
  }
  const query = params.toString();
  return query ? `${url}?${query}` : url;
}
