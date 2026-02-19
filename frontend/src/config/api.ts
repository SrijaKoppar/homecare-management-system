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

  // 4) Default fallback (local dev)
  return 'http://127.0.0.1:5000';
}

export const API_BASE = resolveApiBase();
export default API_BASE;
