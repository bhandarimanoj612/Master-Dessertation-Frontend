import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Shell components – always loaded eagerly (tiny, needed on first paint)
import { LoadingScreen } from "@/global/components/loader/loading-screen";
import { PageLoader } from "@/global/components/loader/page-loader";
import Layout from "@/global/layout/layout";
import ToastProvider from "@/global/components/toast/Toast.Provider";
import { Cursor } from "@/global/components/cursor/cursor";
import ErrorBoundary from "@/global/components/errors/ErrorBoundary";

// Route guards – lightweight wrappers; stay static to ensure synchronous auth checks
import PublicEntryRoute from "@/pages/auth/services/PublicEntryRoute";
import PublicAuthRoute from "@/pages/auth/services/PublicAuthRoute";
import ProtectedRoute from "@/pages/auth/services/ProtectedRoute";

// Lazy page components (each becomes its own JS chunk)
import {
  LazyProfile,
  LazyAppointments,
  LazyDashboard,
  LazyShopsList,
  LazyShopDetails,
  LazyBookingPage,
  LazyCustomer,
  LazyInventory,
  LazyTechnicians,
  LazyBilling,
  LazyRepairs,
  LazySuperAdmin,
} from "@/routes";

import { useGlobalStore } from "@/global/store";
import type { IGlobalStore } from "@/global/interface";

function App() {
  const started = useGlobalStore((state: IGlobalStore) => state.started);
  const setStarted = useGlobalStore((state: IGlobalStore) => state.setStarted);

  return (
    <ToastProvider>
      <Router>
        <div className="flex flex-col h-screen m-0.5 max-sm:m-1 rounded-2xl border-4 border-t-neutral-950 dark:border-t-neutral-200 dark:border-r-neutral-700 dark:border-l-neutral-700 dark:border-b-neutral-700 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden">
          <LoadingScreen started={started} setStarted={setStarted} />

          <main className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<PublicEntryRoute />} />
                <Route path="/getting-started" element={<PublicEntryRoute />} />
                <Route path="/auth" element={<PublicAuthRoute />} />

                <Route path="/app" element={<Layout />}>
                  {/* routes for all logged-in users */}
                  <Route
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          "CUSTOMER",
                          "SHOP_OWNER",
                          "SHOP_STAFF",
                          "TECHNICIAN",
                          "PLATFORM_ADMIN",
                        ]}
                      />
                    }
                  >
                    <Route
                      path="profile"
                      element={
                        <ErrorBoundary>
                          <LazyProfile />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="appointments"
                      element={
                        <ErrorBoundary>
                          <LazyAppointments />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="payments"
                      element={
                        <ErrorBoundary>
                          <LazyDashboard />
                        </ErrorBoundary>
                      }
                    />
                  </Route>

                  {/* customer routes */}
                  <Route
                    element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}
                  >
                    <Route
                      index
                      element={
                        <ErrorBoundary>
                          <LazyShopsList />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="shops"
                      element={
                        <ErrorBoundary>
                          <LazyShopsList />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="shops/:id"
                      element={
                        <ErrorBoundary>
                          <LazyShopDetails />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="bookings/new"
                      element={
                        <ErrorBoundary>
                          <LazyBookingPage />
                        </ErrorBoundary>
                      }
                    />
                  </Route>

                  {/* shop owner / staff / admin routes */}
                  <Route
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          "SHOP_OWNER",
                          "SHOP_STAFF",
                          "PLATFORM_ADMIN",
                        ]}
                      />
                    }
                  >
                    <Route
                      path="dashboard"
                      element={
                        <ErrorBoundary>
                          <LazyDashboard />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="customers"
                      element={
                        <ErrorBoundary>
                          <LazyCustomer />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="inventory"
                      element={
                        <ErrorBoundary>
                          <LazyInventory />
                        </ErrorBoundary>
                      }
                    />
                    
                    <Route
                      path="technicians"
                      element={
                        <ErrorBoundary>
                          <LazyTechnicians />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="billing"
                      element={
                        <ErrorBoundary>
                          <LazyBilling />
                        </ErrorBoundary>
                      }
                    />
                  </Route>

                  {/* technician / owner / admin routes */}
                  <Route
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          "TECHNICIAN",
                          "SHOP_OWNER",
                          "PLATFORM_ADMIN",
                        ]}
                      />
                    }
                  >
                    <Route
                      path="repairs"
                      element={
                        <ErrorBoundary>
                          <LazyRepairs />
                        </ErrorBoundary>
                      }
                    />
                  </Route>

                  {/* platform admin only */}
                  <Route
                    element={
                      <ProtectedRoute allowedRoles={["PLATFORM_ADMIN"]} />
                    }
                  >
                    <Route
                      path="admin"
                      element={
                        <ErrorBoundary>
                          <LazySuperAdmin />
                        </ErrorBoundary>
                      }
                    />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </main>
        </div>

        <Cursor />
      </Router>
    </ToastProvider>
  );
}

export default App;
