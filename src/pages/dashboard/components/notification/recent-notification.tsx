import { useMemo, useState } from "react";
import type { DashboardSummary } from "../../interface/dashboard.interface";

interface RecentNotificationProps {
  summary: DashboardSummary;
}

const RecentNotification = ({ summary }: RecentNotificationProps) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "repairs" | "updates">("all");

  const notificationData = useMemo(() => [
    {
      id: 1, type: "repairs",
      title: "New repair requests",
      message: `${summary.requestedCount} repair request(s) are waiting for review.`,
      time: "Just now",
      status: summary.requestedCount > 0 ? "Needs Attention" : "Stable",
      accent: summary.requestedCount > 0 ? "bg-blue-500" : "bg-slate-400",
      badge: summary.requestedCount > 0
        ? "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400"
        : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40",
    },
    {
      id: 2, type: "repairs",
      title: "Repairs in progress",
      message: `${summary.inProgressCount} repair(s) are currently being worked on.`,
      time: "Today",
      status: summary.inProgressCount > 0 ? "Busy" : "Normal",
      accent: "bg-amber-500",
      badge: "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
    },
    {
      id: 3, type: "updates",
      title: "Completed jobs",
      message: `${summary.completedCount} repair(s) have been completed successfully.`,
      time: "Today",
      status: "Completed",
      accent: "bg-emerald-500",
      badge: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    },
    {
      id: 4, type: "updates",
      title: "Stock alert",
      message: summary.lowStockProducts > 0
        ? `${summary.lowStockProducts} product(s) are low in stock.`
        : "Inventory levels look good right now.",
      time: "This week",
      status: summary.lowStockProducts > 0 ? "Needs Attention" : "Healthy",
      accent: summary.lowStockProducts > 0 ? "bg-red-500" : "bg-emerald-500",
      badge: summary.lowStockProducts > 0
        ? "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400"
        : "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    },
    {
      id: 5, type: "updates",
      title: "Customer growth",
      message: `Your shop currently has ${summary.totalCustomers} customer(s) and ${summary.totalInvoices} invoice(s).`,
      time: "This month",
      status: "Growth",
      accent: "bg-violet-500",
      badge: "bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400",
    },
  ], [summary]);

  const filtered = useMemo(() =>
    activeFilter === "all" ? notificationData : notificationData.filter((n) => n.type === activeFilter),
    [activeFilter, notificationData],
  );

  const tabs = ["all", "repairs", "updates"] as const;

  return (
    <div className="mb-8 mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">

      {/* Notification feed */}
      <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4 flex-wrap">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Notifications</h3>

          <div className="flex gap-1 bg-gray-100 dark:bg-white/[0.04] p-1 rounded-xl border border-gray-200 dark:border-white/[0.06]">
            {tabs.map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3.5 py-1.5 rounded-[10px] text-sm font-semibold transition-all border-none cursor-pointer capitalize ${
                  activeFilter === type
                    ? "bg-gradient-to-r from-black to-[#5079e8] hover:from-blue-600 hover:to-[#273C75] text-white shadow-sm"
                    : "bg-transparent text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400 dark:text-white/30">No notifications for this filter.</div>
          ) : filtered.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-4 py-3.5 hover:bg-gray-100/60 dark:hover:bg-white/[0.05] transition-colors"
            >
              {/* Accent dot */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${n.accent}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{n.title}</span>
                  <span className="text-[11px] text-gray-400 dark:text-white/25 flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-white/40 mb-2">{n.message}</p>
                <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${n.badge}`}>{n.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.06] text-xs text-gray-400 dark:text-white/25">
          Showing {filtered.length} of {notificationData.length} notifications
        </div>
      </div>

      {/* Summary sidebar */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-6 shadow-sm">
        <h3 className="mb-5 text-base font-bold text-gray-900 dark:text-white">Notification Summary</h3>

        <div className="space-y-3">
          {[
            { label: "Pending", value: summary.requestedCount,   color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-500/[0.08]",    sub: "Repair requests waiting" },
            { label: "Completed", value: summary.completedCount, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/[0.08]", sub: "Successfully finished" },
            { label: "Priority", value: summary.lowStockProducts, color: "text-red-500",   bg: "bg-red-50 dark:bg-red-500/[0.08]",       sub: "Low stock items" },
            { label: activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1), value: filtered.length, color: "text-gray-500 dark:text-white/40", bg: "bg-gray-50 dark:bg-white/[0.03]", sub: "Filtered notifications" },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl p-4 ${item.bg}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-600 dark:text-white/50">{item.label}</span>
                <span className={`text-2xl font-extrabold ${item.color}`}>{item.value}</span>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-white/25">{item.sub}</p>
            </div>
          ))}

          {/* Quick actions */}
          <div className="pt-3 border-t border-gray-100 dark:border-white/[0.06]">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">Quick Actions</div>
            <div className="space-y-1.5">
              {["Mark all as read", "Clear old notifications", "Notification settings"].map((label) => (
                <button
                  key={label}
                  className="w-full rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.07] transition cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentNotification;