import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../../pages/auth/store/store";

const http = axios.create({
  baseURL: "http://localhost:8080/api",
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default http;