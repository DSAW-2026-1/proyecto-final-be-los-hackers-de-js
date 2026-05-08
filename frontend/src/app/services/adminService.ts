import { apiRequest } from './api';

export interface AdminDashboardStats {
  totalUsers: number;
  activeSellers: number;
  totalProducts: number;
  totalSales: number;
}

export interface AdminReport {
  reportID: string;
  reporterID: string;
  type: 'productReport' | 'userReport';
  reportedID: string;
  category: string;
  reportTitle: string;
  reportBody: string;
}

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return apiRequest<AdminDashboardStats>('/api/admin/dashboard');
  },

  async deleteProduct(productID: string): Promise<void> {
    return apiRequest<void>(`/api/admin/products/${productID}/`, {
      method: 'DELETE',
    });
  },

  async suspendUser(uid: string, reason: string): Promise<void> {
    return apiRequest<void>(`/api/admin/users/${uid}/suspend`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  async getReport(reportID: string): Promise<AdminReport> {
    return apiRequest<AdminReport>(`/api/admin/reports/${reportID}`);
  },
};
