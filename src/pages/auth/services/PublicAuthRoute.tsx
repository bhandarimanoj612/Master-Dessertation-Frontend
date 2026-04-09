import { Navigate } from "react-router-dom";
import Auth from "../auth";
import { useAuthStore } from "../store/store";
import { getDefaultRouteByRole } from "./auth.redirect";

export default function PublicAuthRoute() {
  const { hydrated, isAuthenticated, role } = useAuthStore();

  if (!hydrated) return null;

  if (isAuthenticated && role) {
    return <Navigate to={getDefaultRouteByRole(role)} replace />;
  }

  return <Auth />;
}