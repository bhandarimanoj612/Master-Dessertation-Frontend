export type UiAppointmentStatus =
  | "requested"
  | "estimate-sent"
  | "customer-confirmed"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "paid"
  | "cancelled";

export type BackendRepairStatus =
  | "REQUESTED"
  | "ESTIMATE_PROVIDED"
  | "CUSTOMER_CONFIRMED"
  | "CONFIRMED"
  | "PICKUP_SCHEDULED"
  | "PICKED_UP"
  | "DROPPED_OFF"
  | "RECEIVED_AT_SHOP"
  | "DIAGNOSIS"
  | "IN_PROGRESS"
  | "WAITING_PARTS"
  | "READY"
  | "DELIVERING"
  | "DELIVERED"
  | "COMPLETED"
  | "PAID"
  | "CANCELLED";

export interface BackendBooking {
  id: number;
  shop: {
    id: number;
    name: string;
    streetAddress: string | null;
    area: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    phone: string | null;
    avgRating: number;
    ratingCount: number;
    isActive: boolean;
    createdAt: string;
    lat: number | null;
    lng: number | null;
    verified: boolean;
    description: string | null;
  };
  assignedTechnician: {
    id: number;
    fullName: string;
    phone: string;
    specialization: string;
  } | null;
  customerUserId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  bookingType: "APPOINTMENT" | "DIRECT_REQUEST";
  serviceMode: "IN_STORE" | "HOME_PICKUP";
  deviceCategory: string;
  deviceModel: string | null;
  issueDescription: string;
  pickupAddress: string | null;
  preferredDateTime: string;
  repairStatus: BackendRepairStatus;
  estimatedPrice?: number | null;
  technicianNote?: string | null;
  customerApprovedEstimate?: boolean | null;
  finalPrice?: number | null;
  paid?: boolean | null;
  paymentMethod?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

export interface TechnicianOption {
  id: number;
  fullName: string;
  phone: string;
  specialization: string;
}

export interface AppointmentItem {
  id: number;
  shopId: number;
  shopName: string;
  customerUserId: number;
  customerName: string;
  phone: string;
  email: string;
  deviceType: string;
  deviceModel: string;
  issueDescription: string;
  appointmentDate: string;
  appointmentTime: string;
  status: UiAppointmentStatus;
  backendStatus: BackendRepairStatus;
  serviceMode: "IN_STORE" | "HOME_PICKUP";
  pickupAddress: string;
  assignedTechnicianId: number | null;
  assignedTechnician: string;
  estimatedPrice: number | null;
  technicianNote: string;
  customerApprovedEstimate: boolean;
  finalPrice: number | null;
  paid: boolean;
  paymentMethod: string;
  paidAt: string;
  createdAt: string;
}

export interface AppointmentState {
  appointments: AppointmentItem[];
  loading: boolean;
  error: string;
  searchTerm: string;
  filterStatus: string;
  filterDate: string;
  setAppointments: (appointments: AppointmentItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  setFilterStatus: (filterStatus: string) => void;
  setFilterDate: (filterDate: string) => void;
  resetFilters: () => void;
}

export interface AppointmentModalState {
  open: boolean;
  selectedAppointment: AppointmentItem | null;
  setOpen: (open: boolean) => void;
  setSelectedAppointment: (appointment: AppointmentItem | null) => void;
}
