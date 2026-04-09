import axios from "axios";
import { useAuthStore } from "../pages/auth/store/store";

export const base_url = `http://localhost:8080`;

export const axios_auth = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axios_no_auth = axios.create({
  baseURL: base_url,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const axios_auth_form = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

const attachAuthHeader = (config: any) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

axios_auth.interceptors.request.use(attachAuthHeader);
axios_no_auth.interceptors.request.use(attachAuthHeader);
axios_auth_form.interceptors.request.use(attachAuthHeader);

export const BusinessName = "Sajilo Tayaar";
