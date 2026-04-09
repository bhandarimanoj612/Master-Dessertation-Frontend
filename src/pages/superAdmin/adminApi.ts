const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

function getToken() {
  return (
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.token ||
    ""
  );
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.message || data.error || JSON.stringify(data);
    } catch {
      try { message = await response.text(); } catch { message = "Request failed"; }
    }
    throw new Error(message);
  }

  if (response.status === 204) return {} as T;
  
  // Try to parse as JSON, if it fails, return empty object
  try {
    return await response.json();
  } catch {
    // If response is plain text (like "Shop deleted"), just return empty object
    // The component handles this with real-time state updates
    return {} as T;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserResponse = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  shopId: number | null;
  shopName: string | null;
  createdAt: string;
};

export type ShopAdminResponse = {
  id: number;
  name: string;
  city: string | null;
  phone: string | null;
  isActive: boolean;
  verified: boolean;
  createdAt: string;
};

export type ShopListResponse = {
  id: number;
  name: string;
  shortAddress: string;
  phone: string;
  avgRating: number;
  ratingCount: number;
  lat: number | null;
  lng: number | null;
  verified: boolean;
};

export type ShopDetailsResponse = {
  id: number;
  name: string;
  streetAddress: string | null;
  area: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  phone: string | null;
  description: string | null;
  avgRating: number;
  ratingCount: number;
  lat: number | null;
  lng: number | null;
  verified: boolean;
  isActive: boolean;
};

export type CreateShopRequest = {
  name: string;
  streetAddress: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  description: string;
  lat: number | null;
  lng: number | null;
};

export type UpdateShopRequest = Partial<CreateShopRequest> & { name?: string };

export type UpdateUserRequest = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
};

// ── Existing shop/auth API (keep working for other pages) ─────────────────────

export const adminApi = {
  getAllUsers: () => apiFetch<UserResponse[]>("/api/auth"),

  getShops: () => apiFetch<ShopListResponse[]>("/api/shops"),

  getShopById: (id: number) =>
    apiFetch<ShopDetailsResponse>(`/api/shops/${id}`),

  createShop: (payload: CreateShopRequest) =>
    apiFetch<ShopDetailsResponse>("/api/shops", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateShop: (id: number, payload: UpdateShopRequest) =>
    apiFetch<ShopDetailsResponse>(`/api/shops/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  setShopVerified: (id: number, value: boolean) =>
    apiFetch<ShopDetailsResponse>(`/api/shops/${id}/verified?value=${value}`, {
      method: "PATCH",
    }),

  setShopActive: (id: number, value: boolean) =>
    apiFetch<ShopDetailsResponse>(`/api/shops/${id}/active?value=${value}`, {
      method: "PATCH",
    }),
};

// ── SuperAdmin API — all hits /api/superadmin/** ──────────────────────────────

export const superAdminApi = {
  getAllUsers: () =>
    apiFetch<UserResponse[]>("/api/superadmin/users"),

  deleteUser: (id: number) =>
    apiFetch<string>(`/api/superadmin/users/${id}`, { method: "DELETE" }),

  toggleUserActive: (id: number) =>
    apiFetch<string>(`/api/superadmin/users/${id}/toggle-active`, {
      method: "PATCH",
    }),

  changeUserPassword: (id: number, newPassword: string) =>
    apiFetch<string>(`/api/superadmin/users/${id}/password`, {
      method: "PATCH",
      body: JSON.stringify({ newPassword }),
    }),

  updateUser: (id: number, payload: UpdateUserRequest) =>
    apiFetch<UserResponse>(`/api/superadmin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  getAllShops: () =>
    apiFetch<ShopAdminResponse[]>("/api/superadmin/shops"),

  getShopById: (id: number) =>
    apiFetch<ShopDetailsResponse>(`/api/superadmin/shops/${id}`),

  createShop: (payload: CreateShopRequest) =>
    apiFetch<ShopDetailsResponse>("/api/superadmin/shops", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateShop: (id: number, payload: UpdateShopRequest) =>
    apiFetch<ShopDetailsResponse>(`/api/superadmin/shops/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteShop: (id: number) =>
    apiFetch<string>(`/api/superadmin/shops/${id}`, { method: "DELETE" }),

  toggleShopActive: (id: number) =>
    apiFetch<string>(`/api/superadmin/shops/${id}/toggle-active`, {
      method: "PATCH",
    }),

  toggleShopVerified: (id: number) =>
    apiFetch<string>(`/api/superadmin/shops/${id}/toggle-verified`, {
      method: "PATCH",
    }),
};