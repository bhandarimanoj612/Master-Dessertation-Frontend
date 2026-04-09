import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "./components/stat-card";
import { Icons } from "./components/icons";
import type { DashboardSummary } from "../../interface/dashboard.interface";

interface PerformanceOverviewProps {
  summary: DashboardSummary;
}

const currency = new Intl.NumberFormat("en-NP", {
  style: "currency",
  currency: "NPR",
  maximumFractionDigits: 0,
});

const PerformanceOverview = ({ summary }: PerformanceOverviewProps) => {
  const navigate = useNavigate();

  const averageRevenuePerInvoice = useMemo(() => {
    if (!summary.totalInvoices) return 0;
    return summary.totalRevenue / summary.totalInvoices;
  }, [summary]);

  return (
    <div className="mb-8 mt-8 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-6 shadow-sm">
      {/* Header row */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="flex items-center gap-2.5 text-xl font-bold text-gray-900 dark:text-white">
          <span className="text-blue-500">
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
            </svg>
          </span>
          Performance Overview
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate("/app/customers")}
            className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-4 py-2 text-sm font-semibold text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition cursor-pointer"
          >
            <Icons.CheckCircle />
            Customers
          </button>
          <button
            onClick={() => navigate("/app/appointments")}
            className="flex items-center rounded-xl bg-gradient-to-r from-black to-[#5079e8] px-4 py-2 text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-[#273C75]"
          >
            <Icons.Plus />
            <span className="ml-2 font-medium">Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Repairs"
          value={String(summary.totalBookings)}
          subtitle="All bookings"
          icon={Icons.Wrench}
          color="blue"
          trendValue={`${summary.requestedCount} pending`}
        />
        <StatCard
          title="In Progress"
          value={String(summary.inProgressCount)}
          subtitle="Active repairs"
          icon={Icons.Clock}
          color="yellow"
          trendValue={`${summary.confirmedCount} confirmed`}
        />
        <StatCard
          title="Completed"
          value={String(summary.completedCount)}
          subtitle={`Success rate: ${summary.totalBookings ? Math.round((summary.completedCount / summary.totalBookings) * 100) : 0}%`}
          icon={Icons.CheckCircle}
          color="green"
          trendValue={`${summary.paidCount} paid`}
        />
        <StatCard
          title="Monthly Revenue"
          value={currency.format(Number(summary.totalRevenue) || 0)}
          subtitle={`Avg invoice: ${currency.format(averageRevenuePerInvoice || 0)}`}
          icon={Icons.DollarSign}
          color="purple"
          trendValue={`${summary.totalInvoices} invoices`}
        />
      </div>
    </div>
  );
};

export default PerformanceOverview;