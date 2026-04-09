import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LoginResponse, Role, ShopAuthDetails } from "../../../global/interface";

type AuthState = {
  token: string | null;
  userId: number | null;
  role: Role | null;
  tenantId: number | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  shop: ShopAuthDetails | null;
  isAuthenticated: boolean;
  hydrated: boolean;

  setAuth: (data: LoginResponse) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      role: null,
      tenantId: null,
      fullName: null,
      email: null,
      phone: null,
      shop: null,
      isAuthenticated: false,
      hydrated: false,

      setAuth: (data) =>
        set({
          token: data.token,
          userId: data.userId,
          role: data.role,
          tenantId: data.tenantId ?? null,
          fullName: data.fullName ?? null,
          email: data.email ?? null,
          phone: data.phoneNumber ?? null,
          shop: data.shop ?? null,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          token: null,
          userId: null,
          role: null,
          tenantId: null,
          fullName: null,
          email: null,
          phone: null,
          shop: null,
          isAuthenticated: false,
        }),

      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "sajilo-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        role: state.role,
        tenantId: state.tenantId,
        fullName: state.fullName,
        email: state.email,
        phone: state.phone,
        shop: state.shop,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);