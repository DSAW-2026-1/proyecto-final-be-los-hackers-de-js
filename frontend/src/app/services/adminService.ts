import { apiRequest } from './api';

export interface AdminDashboardStats {
  totalUsers: number;
  activeSellers: number;
  totalProducts: number;
  totalSales: number;
}

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return apiRequest<AdminDashboardStats>('/api/admin/dashboard');
  },
};
