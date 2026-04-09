import { axios_no_auth } from "../../../../global/config";
import type { Shop, ShopDetails, ShopsQuery  } from "../interface/shops.interface";

function buildParams(q: ShopsQuery) {
  const params = new URLSearchParams();
  if (q.q) params.set("q", q.q);
  if (typeof q.lat === "number") params.set("lat", String(q.lat));
  if (typeof q.lng === "number") params.set("lng", String(q.lng));
  if (typeof q.radiusKm === "number") params.set("radiusKm", String(q.radiusKm));
  if (typeof q.page === "number") params.set("page", String(q.page));
  if (typeof q.size === "number") params.set("size", String(q.size));
  return params;
}

export const shopService = {
  async list(q: ShopsQuery) {
    // Backend should accept /api/shops?q=&lat=&lng=&radiusKm=
    // If your backend returns Page<Shop>, adjust types.
    const params = buildParams(q);
    const res = await axios_no_auth.get<Shop[]>(`/api/shops?${params.toString()}`);
    return res.data;
  },

  async getById(id: number) {
    const res = await axios_no_auth.get<Shop>(`/api/shops/${id}`);
    return res.data;
  },

   async getShopById(id: number): Promise<ShopDetails> {
    // change this if your backend route differs
    const res = await axios_no_auth.get(`/api/shops/${id}`);
    return res.data;
  },
};