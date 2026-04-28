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

export const userService = {
  async getProfile(): Promise<UserProfileResponse> {
    return apiRequest<UserProfileResponse>('/api/users/');
  },
  async getProfileByUid(uid: string): Promise<UserProfileResponse> {
    return apiRequest<UserProfileResponse>(`/api/users/${uid}`);
  }
};
