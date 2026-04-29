import { apiRequest } from './api';

export interface UserProfileResponse {
  username: string;
  email: string;
  isSeller: boolean;
  career: string | null;
  photo: string | null;
  reputation: string | null;
  sales: number;
}

export interface UpdateProfileRequest {
  username?: string;
  career?: string;
  photo?: string;
}

export const userService = {
  async getProfile(): Promise<UserProfileResponse> {
    return apiRequest<UserProfileResponse>('/api/users/');
  },
  async getProfileByUid(uid: string): Promise<UserProfileResponse> {
    return apiRequest<UserProfileResponse>(`/api/users/${uid}`);
  },
  async updateProfile(data: UpdateProfileRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/api/users', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async registerAsSeller(): Promise<{ token: string }> {
    return apiRequest<{ token: string }>('/api/seller/register', {
      method: 'PATCH',
    });
  }
};
