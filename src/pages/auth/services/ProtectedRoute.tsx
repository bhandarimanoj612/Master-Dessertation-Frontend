import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/store";
import type { Role } from "../../../global/interface";
import { getDefaultRouteByRole } from "./auth.redirect";

type ProtectedRouteProps = {
  allowedRoles?: Role[];
};

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { hydrated, isAuthenticated, role } = useAuthStore();

  if (!hydrated) return null;

  if (!isAuthenticated || !role) {
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getDefaultRouteByRole(role)} replace />;
  }

  return <Outlet />;
}