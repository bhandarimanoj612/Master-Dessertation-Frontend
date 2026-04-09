export interface DeviceHistory {
  device: string;
  repairs: number;
  lastRepair: string;
}
export interface ICustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalRepairs: number;
  totalSpent: number;
  status: "active" | "inactive";
  rating: number;
  lastVisit: string;
  deviceHistory: DeviceHistory[];
  notes: string;
}
