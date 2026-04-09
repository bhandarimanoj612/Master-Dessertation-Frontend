import { Navigate } from "react-router-dom";
import GettingStarted from "../../gettingstarted/GettingStarted";
import { useAuthStore } from "../store/store";
import { getDefaultRouteByRole } from "./auth.redirect";

export default function PublicEntryRoute() {
  const { hydrated, isAuthenticated, role } = useAuthStore();

  if (!hydrated) return null;

  if (isAuthenticated && role) {
    return <Navigate to={getDefaultRouteByRole(role)} replace />;
  }

  return <GettingStarted />;
}