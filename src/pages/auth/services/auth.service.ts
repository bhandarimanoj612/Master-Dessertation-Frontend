import { axios_auth } from "../../../global/config";
import type {
  LoginRequest,
  LoginResponse,
  RegisterCustomerRequest,
  RegisterShopRequest,
} from "../../../global/interface";

export const authService = {
  async login(payload: LoginRequest) {
    const res = await axios_auth.post<LoginResponse>("/api/auth/login", payload);
    return res.data;
  },

  async registerCustomer(payload: RegisterCustomerRequest) {
    const res = await axios_auth.post<string>(
      "/api/auth/register-customer",
      payload
    );
    return res.data;
  },

  async registerShop(payload: RegisterShopRequest) {
    const res = await axios_auth.post<LoginResponse>(
      "/api/auth/register-shop",
      payload
    );
    return res.data;
  },
};