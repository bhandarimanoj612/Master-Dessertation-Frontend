export type Role =
  | "PLATFORM_ADMIN"
  | "SHOP_OWNER"
  | "SHOP_STAFF"
  | "TECHNICIAN"
  | "CUSTOMER";

export interface LoginRequest {
  email: string;
  password: string;
}

export type ShopAuthDetails = {
  id: number;
  name: string;
  streetAddress: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  description: string;
  lat: number;
  lng: number;
  verified: boolean;
  isActive: boolean;
};

export type LoginResponse = {
  token: string;
  userId: number;
  role: string;
  email: string;
  phoneNumber: string;
  tenantId: number | null;
  fullName: string;
  shop: ShopAuthDetails | null;
};
export interface AuthState {
  token: string | null;
  userId: number | null;
  role: Role | null;
  tenantId: number | null;
  isAuthenticated: boolean;

  setAuth: (data: LoginResponse) => void;
  clearAuth: () => void;
}