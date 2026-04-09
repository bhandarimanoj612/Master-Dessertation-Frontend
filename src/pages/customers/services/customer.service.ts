import { axios_auth } from '../../../global/config';

export interface ShopCustomerSummary {
  customerUserId: number | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalRepairs: number;
  totalSpent: number;
  lastVisit: string | null;
  latestRepairStatus: string | null;
}

export const customerService = {
  async getShopCustomers(shopId: number) {
    const res = await axios_auth.get<ShopCustomerSummary[]>(`/api/customers/shop/${shopId}`);
    return res.data;
  },
};
