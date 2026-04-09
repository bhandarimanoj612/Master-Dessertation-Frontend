import type { Role } from "../../../global/interface";

export function getDefaultRouteByRole(role: Role | null | undefined) {
  switch (role) {
    case "CUSTOMER":
      return "/app/shops";
      

    case "SHOP_OWNER":
      return "/app/dashboard";

    case "SHOP_STAFF":
      return "/app/appointments";

    case "TECHNICIAN":
      return "/app/repairs";

    case "PLATFORM_ADMIN":
      return "/app/admin";

    default:
      return "/";
  }
}