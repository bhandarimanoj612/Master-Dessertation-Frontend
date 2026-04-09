/**
 * Centralised route definitions for the application.
 *
 * All page-level components are lazily imported here so Vite creates a
 * separate chunk for each route.  The Suspense boundary in App.tsx renders
 * a PageLoader while the chunk is being fetched, and the ErrorBoundary
 * wrapping each segment handles chunk-load failures gracefully.
 */

import { lazy } from "react";

// ─── Shared / cross-role ──────────────────────────────────────────────────────
export const LazyProfile = lazy(() => import("@/pages/profile/profile"));
export const LazyAppointments = lazy(
  () => import("@/pages/appointments/appointments")
);
export const LazyDashboard = lazy(
  () => import("@/pages/dashboard/Dashboard")
);

// ─── Customer ─────────────────────────────────────────────────────────────────
export const LazyShopsList = lazy(
  () => import("@/pages/shop/customer/ShopsList")
);
export const LazyShopDetails = lazy(
  () => import("@/pages/shop/customer/ShopDetails")
);
export const LazyBookingPage = lazy(
  () => import("@/pages/booking/BookingPage")
);

// ─── Shop owner / staff / admin ───────────────────────────────────────────────
export const LazyCustomer = lazy(
  () => import("@/pages/customers/customer")
);
export const LazyInventory = lazy(
  () => import("@/pages/inventory/inventory")
);

export const LazyTechnicians = lazy(
  () => import("@/pages/technicians/technicians")
);
export const LazyBilling = lazy(() => import("@/pages/billing/billing"));

// ─── Technician / owner / admin ───────────────────────────────────────────────
export const LazyRepairs = lazy(() => import("@/pages/repairs/repairs"));

// ─── Platform admin ───────────────────────────────────────────────────────────
export const LazySuperAdmin = lazy(
  () => import("@/pages/superAdmin/superadmin")
);
