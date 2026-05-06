const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';
const PORT = import.meta.env.VITE_API_PORT || null;
const VERCEL_ENV = import.meta.env.VERCEL_ENV || null;

const FULL_URL = (PORT)? `${BASE_URL}:${PORT}` : `${BASE_URL}`;
export const API_URL = (PORT)? `${BASE_URL}:${PORT}/api` : `${BASE_URL}/api`;

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${FULL_URL}${endpoint}`;
  
  const token = localStorage.getItem('token');
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...Object.fromEntries(new Headers(options.headers || {}).entries()),
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const request = {
    ...options,
    headers,
    credentials: 'include'
  }

  const response = await fetch(url, request);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    const errorMsg = errorData.message || errorData.error || response.statusText
    const error = new Error(errorMsg) as ApiError;

    error.status = response.status;
    error.data = errorData;

    // Detect expired JWT or invalid token
    if (response.status === 400 && errorMsg?.includes('Invalid JWT token')) {
      console.error(error)
      window.dispatchEvent(new CustomEvent('auth-token-expired'));
    }

    throw error;
  }

  return response.json();
}
