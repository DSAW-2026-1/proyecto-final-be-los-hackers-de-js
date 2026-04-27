const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

export const API_URL = `${BASE_URL}:${PORT}/api`;

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}:${PORT}${endpoint}`;
  
  const token = localStorage.getItem('token');
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...Object.fromEntries(new Headers(options.headers || {}).entries()),
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || response.statusText) as ApiError;
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}
