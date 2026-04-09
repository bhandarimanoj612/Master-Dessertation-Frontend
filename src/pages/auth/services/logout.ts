import { useAuthStore } from "../store/store";
import { toast } from "../../../global/utils/toast.utils";

export function logoutUser() {
  useAuthStore.getState().clearAuth();
  toast.success("Logged out successfully");
}