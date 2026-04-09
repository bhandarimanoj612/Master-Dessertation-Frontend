export type BookingType = "APPOINTMENT" | "DIRECT_REQUEST";
// export type ServiceMode = "IN_STORE" | "PICKUP";
export type ServiceMode = "IN_STORE" | "HOME_PICKUP";
export interface CreateBookingRequest {
  shopId: number;
  customerUserId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  bookingType: BookingType;
  serviceMode: ServiceMode;
  deviceCategory: string;
  deviceModel: string;
  issueDescription: string;
  pickupAddress: string;
  preferredDateTime: string;
}

export interface BookingResponse {
  id: number;
  shopId: number;
  shopName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  bookingType: BookingType;
  serviceMode: ServiceMode;
  deviceCategory: string;
  deviceModel: string;
  issueDescription: string;
  pickupAddress: string;
  preferredDateTime: string;
  repairStatus: string;
  createdAt: string;
}