const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

export const API_URL = `${BASE_URL}:${PORT}/api`;

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}:${PORT}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
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
