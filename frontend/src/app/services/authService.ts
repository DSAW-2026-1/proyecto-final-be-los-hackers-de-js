import { apiRequest } from './api';

export interface LoginResponse {
  token: string;
}

export interface LoginPayload {
  userOrEmail: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
