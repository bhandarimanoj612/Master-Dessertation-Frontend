import http from "./http";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  role: string;
  tenantId: number | null;
}

export const loginApi = async (data: LoginRequest) => {
  const res = await http.post<LoginResponse>("/auth/login", data);
  return res.data;
};