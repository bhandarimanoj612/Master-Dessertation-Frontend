import { Users, Activity, Clock, DollarSign, TrendingUp } from "lucide-react";
import { ICustomer } from "../modal/interface";

const CustomerStat = ({ customers }: { customers: ICustomer[] }) => {
  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    inactive: customers.filter((c) => c.status === "inactive").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgSpending:
      customers.length > 0
        ? Math.round(
            customers.reduce((sum, c) => sum + c.totalSpent, 0) /
              customers.length
          )
        : 0,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm dark:text-neutral-300">
              Total Customers
            </p>
            <p className="text-2xl font-bold text-gray-900  dark:text-neutral-300">
              {stats.total}
            </p>
          </div>
          <Users className="text-blue-600" size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900  p-4 rounded-lg shadow border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm dark:text-neutral-300">
              Active
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-neutral-300">
              {stats.active}
            </p>
          </div>
          <Activity className="text-green-600" size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm dark:text-neutral-300">
              Inactive
            </p>
            <p className="text-2xl font-bold text-gray-900  dark:text-neutral-300">
              {stats.inactive}
            </p>
          </div>
          <Clock className="text-red-600" size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm dark:text-neutral-300">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-gray-900  dark:text-neutral-300">
              Rs. {stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <DollarSign className="text-purple-600" size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm dark:text-neutral-300">
              Avg Spending
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-neutral-300">
              Rs. {stats.avgSpending.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="text-orange-600" size={24} />
        </div>
      </div>
    </div>
  );
};

export default CustomerStat;
