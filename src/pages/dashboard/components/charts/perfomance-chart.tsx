import { useMemo, useState } from "react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import type { DashboardSummary } from "../../interface/dashboard.interface";
import { getMonthlyData, getStageDistribution } from "./util";

interface PerformanceChartProps {
  summary: DashboardSummary;
}

type ChartType = "repairs" | "revenue" | "efficiency";

const PerformanceChart = ({ summary }: PerformanceChartProps) => {
  const [activeChart, setActiveChart] = useState<ChartType>("repairs");

  const completionRate = useMemo(() => {
    if (!summary.totalBookings) return 0;
    return Math.round((summary.completedCount / summary.totalBookings) * 100);
  }, [summary]);

  const monthlyData = useMemo(() => getMonthlyData(summary, completionRate), [summary, completionRate]);
  const stageDistribution = useMemo(() => getStageDistribution(summary), [summary]);

  const tabs: ChartType[] = ["repairs", "revenue", "efficiency"];

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-3">

      {/* Area chart */}
      <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Performance Analytics</h3>

          {/* Tab bar */}
          <div className="flex gap-1 bg-gray-100 dark:bg-white/[0.04] p-1 rounded-xl border border-gray-200 dark:border-white/[0.06]">
            {tabs.map((type) => (
              <button
                key={type}
                onClick={() => setActiveChart(type)}
                className={`px-4 py-1.5 rounded-[10px] text-sm font-semibold transition-all border-none cursor-pointer ${
                  activeChart === type
                    ? "bg-gradient-to-r from-black to-[#5079e8] hover:from-blue-600 hover:to-[#273C75] text-white shadow-sm"
                    : "bg-transparent text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,24,41,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
                color: "#f1f5f9",
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey={activeChart}
              stroke="#3B82F6"
              strokeWidth={2.5}
              fill="url(#colorGradient)"
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 7, stroke: "#3B82F6", strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-6 shadow-sm">
        <h3 className="mb-5 text-base font-bold text-gray-900 dark:text-white">Repair Distribution</h3>

        <ResponsiveContainer width="100%" height={180}>
          <RechartsPieChart>
            <Pie data={stageDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={76} dataKey="value" labelLine={false}>
              {stageDistribution.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,24,41,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                color: "#f1f5f9",
                fontSize: 12,
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          {stageDistribution.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-gray-700 dark:text-white/60">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;