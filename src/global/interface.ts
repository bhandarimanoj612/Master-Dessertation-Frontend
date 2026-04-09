export interface IGlobalStore {
    activeUrl:string;
    setActiveUrl:(url:string)=>void;
    started:boolean;
    setStarted:(started:boolean)=>void;
    expanded:boolean;
    setExpanded:(expanded:boolean)=>void;
}

export type Role =
  | "PLATFORM_ADMIN"
  | "SHOP_OWNER"
  | "SHOP_STAFF"
  | "TECHNICIAN"
  | "CUSTOMER";

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

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = {
  token: string;
  userId: number;
  role: Role;
  email: string;
  phoneNumber: string;
  tenantId: number | null;
  fullName: string;
  shop: ShopAuthDetails | null;
};
export interface RegisterCustomerRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export type RegisterShopRequest = {
  shopName: string;
  shopStreetAddress: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  shopPhone: string;
  description: string;
  lat: number;
  lng: number;
  ownerFullName: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerPhone: string;
};

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  path?: string;
  timestamp?: string;
}