import type { AppointmentItem, BackendBooking, BackendRepairStatus, UiAppointmentStatus } from "../interface";

export function mapRepairStatusToUiStatus(status: BackendRepairStatus): UiAppointmentStatus {
  switch (status) {
    case "REQUESTED":
      return "requested";
    case "ESTIMATE_PROVIDED":
      return "estimate-sent";
    case "CUSTOMER_CONFIRMED":
      return "customer-confirmed";
    case "CONFIRMED":
      return "confirmed";
    case "IN_PROGRESS":
    case "DIAGNOSIS":
    case "WAITING_PARTS":
    case "PICKUP_SCHEDULED":
    case "PICKED_UP":
    case "DROPPED_OFF":
    case "RECEIVED_AT_SHOP":
    case "DELIVERING":
      return "in-progress";
    case "READY":
    case "DELIVERED":
    case "COMPLETED":
      return "completed";
    case "PAID":
      return "paid";
    case "CANCELLED":
      return "cancelled";
    default:
      return "requested";
  }
}

export function mapBookingToAppointment(booking: BackendBooking): AppointmentItem {
  const date = new Date(booking.preferredDateTime);
  const appointmentDate = Number.isNaN(date.getTime())
    ? ""
    : date.toISOString().split("T")[0];
  const appointmentTime = Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

  return {
    id: booking.id,
    shopId: booking.shop.id,
    shopName: booking.shop.name,
    customerUserId: booking.customerUserId,
    customerName: booking.customerName,
    phone: booking.customerPhone,
    email: booking.customerEmail,
    deviceType: booking.deviceCategory,
    deviceModel: booking.deviceModel || "N/A",
    issueDescription: booking.issueDescription,
    appointmentDate,
    appointmentTime,
    status: mapRepairStatusToUiStatus(booking.repairStatus),
    backendStatus: booking.repairStatus,
    serviceMode: booking.serviceMode,
    pickupAddress: booking.pickupAddress || "",
    assignedTechnicianId: booking.assignedTechnician?.id ?? null,
    assignedTechnician: booking.assignedTechnician?.fullName || "",
    estimatedPrice: booking.estimatedPrice ?? null,
    technicianNote: booking.technicianNote ?? "",
    customerApprovedEstimate: Boolean(booking.customerApprovedEstimate),
    finalPrice: booking.finalPrice ?? null,
    paid: Boolean(booking.paid),
    paymentMethod: booking.paymentMethod ?? "",
    paidAt: booking.paidAt ?? "",
    createdAt: booking.createdAt,
  };
}
