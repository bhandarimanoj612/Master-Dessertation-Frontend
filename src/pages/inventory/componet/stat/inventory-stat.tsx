import { AlertTriangle, DollarSign, Package, Zap } from "lucide-react";


const InventoryStat = ({ stats }: { stats: any }) => {
  return (
    <div className="grid grid-cols-4 gap-6 mb-6 max-sm:grid-cols-1">
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalItems}
            </p>
          </div>
          <Package className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.lowStock}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.outOfStock}
            </p>
          </div>
          <Zap className="w-8 h-8 text-red-500" />
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-lg font-bold text-green-600">
              NPR {stats.totalValue.toLocaleString()}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-green-500" />
        </div>
      </div>
    </div>
  );
};

export default InventoryStat;
