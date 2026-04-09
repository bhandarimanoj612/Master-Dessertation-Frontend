import { axios_auth } from '../../../global/config';
import type { DashboardSummary } from '../interface/dashboard.interface';

export const dashboardService = {
  async getShopSummary(shopId: number) {
    const res = await axios_auth.get<DashboardSummary>(`/api/dashboard/shop/${shopId}/summary`);
    return res.data;
  },
};
