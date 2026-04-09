export interface DashboardSummary {
  totalBookings: number;
  requestedCount: number;
  estimateProvidedCount: number;
  customerConfirmedCount: number;
  confirmedCount: number;
  inProgressCount: number;
  completedCount: number;
  paidCount: number;
  cancelledCount: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  totalInvoices: number;
  totalRevenue: number;
}
