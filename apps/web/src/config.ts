export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const API_KEY = import.meta.env.VITE_VIBEGUARD_API_KEY || '';

export async function fetchApi(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  if (API_KEY) {
    headers.set('Authorization', `Bearer ${API_KEY}`);
  }
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });
}
