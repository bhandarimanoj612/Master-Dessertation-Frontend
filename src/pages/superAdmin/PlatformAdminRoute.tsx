import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

const PlatformAdminRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "PLATFORM_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PlatformAdminRoute;