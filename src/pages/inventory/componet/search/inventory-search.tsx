import { Download, Plus, Search, Upload } from "lucide-react";

const InventorySearch = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories,
  sortBy,
  setSortBy,
  setSortOrder,
  sortOrder,
  setShowAddModal,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  categories: string[];
  sortBy: string;
  setSortBy: (value: string) => void;
  setSortOrder: (value: string) => void;
  sortOrder: string;
  setShowAddModal: (value: boolean) => void;
}) => {
  return (
    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items, SKU, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border dark:bg-neutral-800 dark:text-white border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-80"
            />
          </div>

          {/* Filters */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 dark:bg-neutral-800 dark:text-neutral-400 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {categories.map((cat: string) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 dark:bg-neutral-800 dark:text-neutral-400 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order);
            }}
            className="border border-gray-300 dark:bg-neutral-800 dark:text-neutral-400 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="currentStock-asc">Stock (Low-High)</option>
            <option value="currentStock-desc">Stock (High-Low)</option>
            <option value="unitPrice-asc">Price (Low-High)</option>
            <option value="unitPrice-desc">Price (High-Low)</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 dark:bg-neutral-800 dark:text-neutral-400 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:bg-neutral-800 dark:text-neutral-400 rounded-lg hover:bg-gray-50 flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-black to-[#5079e8] text-white rounded-xl hover:from-blue-600 hover:to-[#273C75] transition-all duration-300 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventorySearch;
