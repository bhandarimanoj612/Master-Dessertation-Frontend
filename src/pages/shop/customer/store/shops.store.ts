import { create } from "zustand";
import type { ApiErrorResponse, GeoLocationState, Shop, ShopsQuery } from "../interface/shops.interface";
import { shopService } from "../services/shop.service";

function getApiMessage(err: any) {
  const data = err?.response?.data as ApiErrorResponse | undefined;
  return data?.message || data?.error || err?.message || "Something went wrong.";
}

type ShopsState = {
  // UI state
  loading: boolean;
  errorMsg: string;

  // filters
  query: ShopsQuery;

  // location
  geo: GeoLocationState;

  // results
  shops: Shop[];

  // actions
  setQueryText: (q: string) => void;
  setRadius: (km: number) => void;

  requestLocation: () => Promise<void>;
  fetchShops: () => Promise<void>;
  reset: () => void;
};

const DEFAULT_QUERY: ShopsQuery = { q: "", radiusKm: 10, page: 0, size: 50 };

export const useShopsStore = create<ShopsState>((set, get) => ({
  loading: false,
  errorMsg: "",
  query: DEFAULT_QUERY,
  geo: { coords: null, accuracy: null, city: null },
  shops: [],

  setQueryText: (q) => set((s) => ({ query: { ...s.query, q } })),
  setRadius: (km) => set((s) => ({ query: { ...s.query, radiusKm: km } })),

  requestLocation: async () => {
    set({ errorMsg: "" });

    if (!navigator.geolocation) {
      set({ errorMsg: "Geolocation not supported in this browser." });
      return;
    }

    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          set({
            geo: {
              coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
              accuracy: pos.coords.accuracy,
              city: null,
            },
          });
          resolve();
        },
        (err) => {
          // Don’t block the app. User can still search manually.
          set({ errorMsg: err.message || "Location permission denied." });
          resolve();
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  },

  fetchShops: async () => {
    const { query, geo } = get();
    set({ loading: true, errorMsg: "" });

    try {
      const data = await shopService.list({
        ...query,
        lat: geo.coords?.lat ?? undefined,
        lng: geo.coords?.lng ?? undefined,
      });

      set({ shops: data });
    } catch (err: any) {
      set({ errorMsg: getApiMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  reset: () =>
    set({
      loading: false,
      errorMsg: "",
      query: DEFAULT_QUERY,
      geo: { coords: null, accuracy: null, city: null },
      shops: [],
    }),
}));