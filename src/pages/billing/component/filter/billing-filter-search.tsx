import { Search } from "lucide-react";
import { useState } from "react";

const BillingFilterSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices by ID, customer name, or device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border dark:bg-neutral-800 dark:text-white border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 dark:bg-neutral-800 dark:text-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
          <option value="Partially Paid">Partially Paid</option>
        </select>
      </div>
    </div>
  );
};

export default BillingFilterSearch;
