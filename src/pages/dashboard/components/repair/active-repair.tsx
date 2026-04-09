import { useMemo } from "react";
import { Icons } from "../overview/components/icons";
import type { DashboardSummary } from "../../interface/dashboard.interface";

interface ActiveRepairProps {
  summary: DashboardSummary;
  openRepairWork: number;
}

const ActiveRepair = ({ summary, openRepairWork }: ActiveRepairProps) => {
  const rows = useMemo(() => [
    {
      id: "REQ", label: "Requested",
      count: summary.requestedCount,
      progress: summary.totalBookings ? Math.round((summary.requestedCount / summary.totalBookings) * 100) : 0,
      status: "Pending Review", statusBadge: "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
      priority: summary.requestedCount > 0 ? "High" : "Low",
      eta: "Today",
    },
    {
      id: "EST", label: "Estimate Sent",
      count: summary.estimateProvidedCount,
      progress: summary.totalBookings ? Math.round((summary.estimateProvidedCount / summary.totalBookings) * 100) : 0,
      status: "Awaiting Customer", statusBadge: "bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400",
      priority: summary.estimateProvidedCount > 0 ? "Medium" : "Low",
      eta: "1 day",
    },
    {
      id: "CNF", label: "Confirmed",
      count: summary.confirmedCount + summary.customerConfirmedCount,
      progress: summary.totalBookings ? Math.round(((summary.confirmedCount + summary.customerConfirmedCount) / summary.totalBookings) * 100) : 0,
      status: "Ready for Work", statusBadge: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400",
      priority: "Medium",
      eta: "1–2 days",
    },
    {
      id: "PRG", label: "In Progress",
      count: summary.inProgressCount,
      progress: summary.totalBookings ? Math.round((summary.inProgressCount / summary.totalBookings) * 100) : 0,
      status: "Active", statusBadge: "bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400",
      priority: summary.inProgressCount > 0 ? "High" : "Low",
      eta: "2–3 days",
    },
    {
      id: "CMP", label: "Completed",
      count: summary.completedCount,
      progress: summary.totalBookings ? Math.round((summary.completedCount / summary.totalBookings) * 100) : 0,
      status: "Done", statusBadge: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
      priority: "Low",
      eta: "Closed",
    },
  ], [summary]);

  const priorityBadge = (p: string) =>
    p === "High"   ? "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400" :
    p === "Medium" ? "bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400" :
                     "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40";

  const progressColor = (v: number) =>
    v >= 80 ? "bg-emerald-500" : v >= 50 ? "bg-blue-500" : "bg-amber-500";

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-6 shadow-sm">

      {/* Header */}
      <div className="mb-5 flex items-center gap-2.5">
        <span className="text-blue-500"><Icons.Activity /></span>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Active Repairs</h3>
      </div>

      {/* Summary strip */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "Open Repair Work", value: openRepairWork,          color: "text-blue-500" },
          { label: "Paid Repairs",     value: summary.paidCount,       color: "text-emerald-500" },
          { label: "Cancelled",        value: summary.cancelledCount,  color: "text-red-500" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-4 py-3">
            <div className="text-xs font-medium text-gray-500 dark:text-white/40 mb-1">{item.label}</div>
            <div className={`text-2xl font-extrabold ${item.color}`}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-white/[0.05]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                {["Stage", "Pipeline Stage", "Count", "Progress", "Status", "Priority", "ETA"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 bg-gray-50 dark:bg-white/[0.02] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-sm font-semibold text-blue-500">{row.id}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">{row.label}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900 dark:text-white">{row.count}</td>

                  {/* Progress bar */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <div className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-white/10">
                        <div
                          className={`h-1.5 rounded-full transition-all ${progressColor(row.progress)}`}
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-white/40 w-8">{row.progress}%</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${row.statusBadge}`}>{row.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${priorityBadge(row.priority)}`}>{row.priority}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-medium text-gray-500 dark:text-white/40 whitespace-nowrap">{row.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveRepair;