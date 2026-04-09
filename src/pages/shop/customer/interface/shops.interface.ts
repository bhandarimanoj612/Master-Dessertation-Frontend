export interface LatLng {
 lat?: number | null;
lng?: number | null;
}

export interface GeoLocationState {
  coords: LatLng | null;
  accuracy?: number | null;
  city?: string | null;
}

export interface Shop {
  id: number;
  name: string;
  address?: string | null;
  phone?: string | null;

  // optional if you store in backend
  lat?: number | null;
  lng?: number | null;

  // optional fields for UI
  isActive?: boolean;
  rating?: number | null;
  totalReviews?: number | null;
  distanceKm?: number | null; // computed by backend or frontend
}

export interface ShopsQuery {
  q?: string; // search text (city/area/name)
  lat?: number;
  lng?: number;
  radiusKm?: number; // optional
  page?: number;
  size?: number;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  path?: string;
  timestamp?: string;
}

export interface ShopSummary {
  id: number;
  name: string;
  address?: string | null;
  phone?: string | null;
  lat?: number | null;
  lng?: number | null;

  // optional UI fields
  rating?: number | null;
  distanceKm?: number | null;
  verified?: boolean | null;
}

export interface ShopDetails extends ShopSummary {
  description?: string | null;

  city?: string | null;
  area?: string | null;

  // future-proof
  services?: string[]; // e.g. ["Screen Repair", "Battery", ...]
  brands?: string[];   // e.g. ["Apple", "Samsung", ...]
  openingHours?: {
    label: string; // "Sun-Fri"
    open: string;  // "10:00"
    close: string; // "19:00"
  } | null;

  // counts (later)
  reviewCount?: number | null;
}