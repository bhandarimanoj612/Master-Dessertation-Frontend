import { create } from "zustand";
import type { ShopDetails } from "../interface/shops.interface";
import { shopService } from "../services/shop.service";

type Status = "idle" | "loading" | "success" | "error";

interface ShopDetailsState {
  status: Status;
  errorMsg: string;
  shop: ShopDetails | null;

  fetchShop: (shopId: number) => Promise<void>;
  clear: () => void;
}

export const useShopDetailsStore = create<ShopDetailsState>((set) => ({
  status: "idle",
  errorMsg: "",
  shop: null,

  fetchShop: async (shopId) => {
    set({ status: "loading", errorMsg: "" });
    try {
      const shop = await shopService.getShopById(shopId);

      // safe UI defaults
      const normalized: ShopDetails = {
        ...shop,
        verified: shop.verified ?? true,
        rating: shop.rating ?? 4.7,
        reviewCount: shop.reviewCount ?? 0,
      };

      set({ shop: normalized, status: "success" });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load shop details.";
      set({ status: "error", errorMsg: msg });
    }
  },

  clear: () => set({ status: "idle", errorMsg: "", shop: null }),
}));