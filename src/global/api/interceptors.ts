import { useAuthStore } from "../../pages/auth/store/store";
import { axios_no_auth } from "../config";


export function setupAxiosInterceptors() {
  axios_no_auth.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}