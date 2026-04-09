import { axios_auth } from "../../../global/config";
import type {
  BookingResponse,
  CreateBookingRequest,
} from "../interface/booking.interface";

export const bookingService = {
  async createBooking(payload: CreateBookingRequest) {
    const res = await axios_auth.post<BookingResponse>("/api/bookings", payload);
    return res.data;
  },
};