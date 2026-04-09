import { create } from "zustand";


export type Mode = "login" | "signup";
export type Audience = "shop" | "customer";

type AuthUIState = {
  mode: Mode;
  audience: Audience;

  fullName: string;
  phone: string;

  shopName: string;
  shopAddress: string;
  shopPhone: string;

  ownerFullName: string;
  ownerPhone: string;

  email: string;
  password: string;

  showPass: boolean;
  loading: boolean;
  errorMsg: string;

  area: string;
  city: string;
  state: string;
  postalCode: string;
  description: string;
  lat: string;
  lng: string;
  setMode: (m: Mode) => void;
  setAudience: (a: Audience) => void;

  setFullName: (v: string) => void;
  setPhone: (v: string) => void;

  setShopName: (v: string) => void;
  setShopAddress: (v: string) => void;
  setShopPhone: (v: string) => void;

  setOwnerFullName: (v: string) => void;
  setOwnerPhone: (v: string) => void;

  setEmail: (v: string) => void;
  setPassword: (v: string) => void;

  toggleShowPass: () => void;
  setLoading: (v: boolean) => void;
  setErrorMsg: (msg: string) => void;
  resetError: () => void;
  resetForm: () => void;

  setArea: (v: string) => void;
  setCity: (v: string) => void;
  setState: (v: string) => void;
  setPostalCode: (v: string) => void;
  setDescription: (v: string) => void;
  setLat: (v: string) => void;
  setLng: (v: string) => void;
};

export function getApiMessage(err: any) {
  const data = err?.response?.data as any;

  if (data?.validationErrors) {
    return Object.values(data.validationErrors).join(" | ");
  }

  return (
    data?.message ||
    data?.error ||
    err?.message ||
    "Something went wrong. Please try again."
  );
}

export const useAuthUIStore = create<AuthUIState>((set, get) => ({
  mode: "login",
  audience: "shop",

  fullName: "",
  phone: "",

  shopName: "",
  shopAddress: "",
  shopPhone: "",

  ownerFullName: "",
  ownerPhone: "",

  email: "",
  password: "",

  showPass: false,
  loading: false,
  errorMsg: "",

  area: "",
  city: "",
  state: "",
  postalCode: "",
  description: "",
  lat: "",
  lng: "",

  setMode: (mode) => set({ mode, errorMsg: "" }),
  setAudience: (audience) => set({ audience, errorMsg: "" }),

  setFullName: (fullName) => set({ fullName }),
  setPhone: (phone) => set({ phone }),

  setShopName: (shopName) => set({ shopName }),
  setShopAddress: (shopAddress) => set({ shopAddress }),
  setShopPhone: (shopPhone) => set({ shopPhone }),

  setOwnerFullName: (ownerFullName) => set({ ownerFullName }),
  setOwnerPhone: (ownerPhone) => set({ ownerPhone }),

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),

  toggleShowPass: () => set({ showPass: !get().showPass }),
  setLoading: (loading) => set({ loading }),
  setErrorMsg: (errorMsg) => set({ errorMsg }),
  resetError: () => set({ errorMsg: "" }),

  setArea: (area) => set({ area }),
  setCity: (city) => set({ city }),
  setState: (state) => set({ state }),
  setPostalCode: (postalCode) => set({ postalCode }),
  setDescription: (description) => set({ description }),
  setLat: (lat) => set({ lat }),
  setLng: (lng) => set({ lng }),

  resetForm: () =>
    set({
      fullName: "",
      phone: "",
      shopName: "",
      shopAddress: "",
      shopPhone: "",
      area: "",
      city: "",
      state: "",
      postalCode: "",
      description: "",
      lat: "",
      lng: "",
      ownerFullName: "",
      ownerPhone: "",
      email: "",
      password: "",
      errorMsg: "",
      loading: false,
      showPass: false,
    }),
}));
