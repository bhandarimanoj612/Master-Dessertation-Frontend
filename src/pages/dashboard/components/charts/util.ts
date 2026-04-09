import type { DashboardSummary } from "../../interface/dashboard.interface";

export const getMonthlyData = (
  summary: DashboardSummary,
  completionRate: number
) => {
  const repairsBase = summary.totalBookings || 0;
  const revenueBase = summary.totalRevenue || 0;
  const efficiencyBase = completionRate || 0;

  return [
    {
      month: "Jan",
      repairs: Math.round(repairsBase * 0.35),
      revenue: Math.round(revenueBase * 0.22),
      efficiency: Math.round(efficiencyBase * 0.72),
    },
    {
      month: "Feb",
      repairs: Math.round(repairsBase * 0.48),
      revenue: Math.round(revenueBase * 0.35),
      efficiency: Math.round(efficiencyBase * 0.8),
    },
    {
      month: "Mar",
      repairs: Math.round(repairsBase * 0.56),
      revenue: Math.round(revenueBase * 0.44),
      efficiency: Math.round(efficiencyBase * 0.84),
    },
    {
      month: "Apr",
      repairs: Math.round(repairsBase * 0.62),
      revenue: Math.round(revenueBase * 0.55),
      efficiency: Math.round(efficiencyBase * 0.87),
    },
    {
      month: "May",
      repairs: Math.round(repairsBase * 0.76),
      revenue: Math.round(revenueBase * 0.7),
      efficiency: Math.round(efficiencyBase * 0.93),
    },
    {
      month: "Jun",
      repairs: repairsBase,
      revenue: Math.round(revenueBase),
      efficiency: efficiencyBase,
    },
  ];
};

export const getStageDistribution = (summary: DashboardSummary) => {
  const requested = summary.requestedCount;
  const inProgress =
    summary.estimateProvidedCount +
    summary.customerConfirmedCount +
    summary.confirmedCount +
    summary.inProgressCount;
  const completed = summary.completedCount + summary.paidCount;
  const cancelled = summary.cancelledCount;

  const total = requested + inProgress + completed + cancelled;

  if (!total) {
    return [
      { name: "Completed", value: 40, color: "#30498f" },
      { name: "In Progress", value: 30, color: "#5079e8" },
      { name: "Requested", value: 20, color: "#8ab6f9" },
      { name: "Cancelled", value: 10, color: "#c6d3f7" },

    ];
  }

  return [
     {
      name: "Completed",
      value: Math.round((completed / total) * 100),
      color: "#30498f",
    },
   
    {
      name: "In Progress",
      value: Math.round((inProgress / total) * 100),
      color: "#5079e8",
    },
    {
      name: "Requested",
      value: Math.round((requested / total) * 100),
      color: "#8ab6f9",
    },
    {
      name: "Cancelled",
      value: Math.round((cancelled / total) * 100),
      color: "#c6d3f7",
    },



   
  ];


};