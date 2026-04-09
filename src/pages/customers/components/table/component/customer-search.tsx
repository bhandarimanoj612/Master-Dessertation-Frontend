import { Search } from "lucide-react";

const CustomerSearch = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  statusOptions,
  sortBy,
  setSortBy,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  statusOptions: { value: string; label: string }[];
  sortBy: string;
  setSortBy: (v: string) => void;
}) => {
  return (
    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border dark:text-neutral-300 dark:bg-neutral-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border dark:bg-neutral-800 dark:text-neutral-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          {statusOptions.map((status: any) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border dark:bg-neutral-800 dark:text-neutral-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Sort by Name</option>
          <option value="totalSpent">Sort by Spending</option>
          <option value="totalRepairs">Sort by Repairs</option>
          <option value="lastVisit">Sort by Last Visit</option>
        </select>
      </div>
    </div>
  );
};

export default CustomerSearch;
