import React from "react";
import { colors } from "./util";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trendValue?: string;
  icon: React.ComponentType;
  color: "blue" | "yellow" | "green" | "purple";
}

export const StatCard = ({
  title,
  value,
  subtitle,
  trendValue,
  icon: Icon,
  color,
}: StatCardProps) => {
  const colorClasses = colors[color] || colors.blue;

  return (
    <div
      className={`group relative rounded-2xl border bg-white/70 p-6 shadow-xl backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-neutral-950 ${colorClasses.border}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-neutral-900 dark:to-neutral-950"></div>

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle ? <p className="text-sm font-medium text-gray-500">{subtitle}</p> : null}
          {trendValue ? (
            <div className="mt-3">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colorClasses.badge}`}>
                {trendValue}
              </span>
            </div>
          ) : null}
        </div>

        <div
          className={`rounded-2xl p-4 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 ${colorClasses.iconBg}`}
        >
          <div className={colorClasses.iconText}>
            <Icon />
          </div>
        </div>
      </div>
    </div>
  );
};