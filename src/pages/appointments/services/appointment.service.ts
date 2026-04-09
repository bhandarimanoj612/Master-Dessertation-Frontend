import { axios_auth } from "../../../global/config";
import type { Role } from "../../../global/interface";
import type { BackendBooking, BackendRepairStatus, TechnicianOption } from "../interface";

export const appointmentService = {
  // Keeping booking API calls here makes the UI components smaller and easier to maintain.
  async getAppointments(params: {
    userId: number | null;
    role: Role | null;
    tenantId: number | null;
  }) {
    const { userId, role, tenantId } = params;

    if (role === "CUSTOMER") {
      if (!userId) return [] as BackendBooking[];
      const res = await axios_auth.get<BackendBooking[]>(`/api/bookings/mine?userId=${userId}`);
      return res.data;
    }

    if (role === "PLATFORM_ADMIN") {
      const res = await axios_auth.get<BackendBooking[]>(`/api/bookings`);
      return res.data;
    }

    if (!tenantId) return [] as BackendBooking[];
    const res = await axios_auth.get<BackendBooking[]>(`/api/bookings/shop/${tenantId}`);
    return res.data;
  },

  async getTechniciansForShop(shopId: number) {
    const res = await axios_auth.get<TechnicianOption[]>(`/api/admin/technicians/shop/${shopId}`);
    return res.data;
  },

  async provideEstimate(bookingId: number, payload: { estimatedPrice: number; technicianNote?: string; changedBy?: string }) {
    const res = await axios_auth.patch(`/api/bookings/${bookingId}/estimate`, payload);
    return res.data;
  },

  async confirmEstimate(bookingId: number, payload: { userId: number; changedBy?: string }) {
    const res = await axios_auth.patch(`/api/bookings/${bookingId}/confirm-estimate`, payload);
    return res.data;
  },

  async assignTechnician(bookingId: number, payload: { technicianId: number; changedBy?: string; remarks?: string }) {
    const res = await axios_auth.patch(`/api/bookings/admin/${bookingId}/assign-technician`, payload);
    return res.data;
  },

  async updateStatus(bookingId: number, payload: { status: BackendRepairStatus; changedBy?: string; remarks?: string }) {
    const res = await axios_auth.patch(`/api/bookings/${bookingId}/status`, payload);
    return res.data;
  },

  async pay(bookingId: number, payload: { finalPrice: number; paymentMethod?: string; changedBy?: string }) {
    const res = await axios_auth.patch(`/api/bookings/${bookingId}/pay`, payload);
    return res.data;
  },

  async cancelAsCustomer(bookingId: number, payload: { userId: number; changedBy?: string; remarks?: string }) {
    const res = await axios_auth.patch(`/api/bookings/${bookingId}/cancel`, payload);
    return res.data;
  },

  async cancelAsAdmin(bookingId: number, payload: { changedBy?: string; remarks?: string }) {
    const res = await axios_auth.patch(`/api/bookings/admin/${bookingId}/cancel`, payload);
    return res.data;
  },
};
