import { Download, Plus } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [, setShowCreateModal] = useState(false);
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 dark:bg-neutral-900 max-sm:rounded-lg">
      <div className="flex items-center justify-between">
        <div className="max-sm:space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-300 max-sm:text-xl">
            Billing & Invoices
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 max-sm:text-xs">
            Manage invoices, payments, and financial records
          </p>
        </div>
        <div className="flex items-center space-x-3 max-sm:flex-col max-sm:space-y-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50   flex items-center space-x-2">
            <Download className="w-4 h-4 dark:text-neutral-400" />
            <span className="text-neutral-400 max-sm:text-xs">Export</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-black to-[#5079e8] text-white rounded-xl hover:from-blue-600 hover:to-[#273C75] transition-all duration-300 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span className="max-sm:text-xs">Create Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
