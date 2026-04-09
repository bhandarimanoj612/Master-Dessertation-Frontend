import { useEffect, useMemo, useState } from "react";
import Header from "./components/header/Header";
import PerformanceOverview from "./components/overview/performance-overview";
import PerfomanceChart from "./components/charts/perfomance-chart";
import ActiveRepair from "./components/repair/active-repair";
import AddRepair from "./components/repair/add-repair";
import RecentNotification from "./components/notification/recent-notification";
import { useAuthStore } from "../auth/store/store";
import { dashboardService } from "./services/dashboard.service";
import type { DashboardSummary } from "./interface/dashboard.interface";
import { useToast } from "../../global/hooks/useToast";
import { PageLoader } from "../../global/components/loader/page-loader";

const emptySummary: DashboardSummary = {
  totalBookings: 0,
  requestedCount: 0,
  estimateProvidedCount: 0,
  customerConfirmedCount: 0,
  confirmedCount: 0,
  inProgressCount: 0,
  completedCount: 0,
  paidCount: 0,
  cancelledCount: 0,
  totalCustomers: 0,
  totalProducts: 0,
  lowStockProducts: 0,
  totalInvoices: 0,
  totalRevenue: 0,
};

const Dashboard = () => {
  const tenantId = useAuthStore((state) => state.tenantId);
  const role = useAuthStore((state) => state.role);
  const fullName = useAuthStore((state) => state.fullName);

  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    const loadSummary = async () => {
      if (!tenantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await dashboardService.getShopSummary(tenantId);
        setSummary(data);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load dashboard summary");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [tenantId]);

  const openRepairWork = useMemo(() => {
    return (
      summary.requestedCount +
      summary.estimateProvidedCount +
      summary.customerConfirmedCount +
      summary.confirmedCount +
      summary.inProgressCount
    );
  }, [summary]);

  if (!tenantId && role === "PLATFORM_ADMIN") {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-gray-200">
          Dashboard analytics are currently shop-based. Log in as a shop account to view live shop operations metrics.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-neutral-900 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* header of the dashboard */}
        <Header fullName={fullName} />

        {loading ? <PageLoader message="Loading dashboard…" /> : null}

        {/* overview section */}
        <PerformanceOverview summary={summary} />

        {/* chart of the performance */}
        <PerfomanceChart summary={summary} />

        {/* recent notification */}
        <RecentNotification summary={summary} />

        {/* active repairs */}
        <ActiveRepair summary={summary} openRepairWork={openRepairWork} />

        {/* quick actions */}
        <AddRepair />
      </div>
    </div>
  );
};

export default Dashboard;