import { Edit3, Eye, Package, Trash2, TrendingDown } from "lucide-react";


const InventoryTable = ({
  filteredItems,
  getStockLevel,
  getStatusColor,
  setSelectedItem,
  setShowDetailsModal,
  setItems,
  items,
}: {
  filteredItems: any;
  getStockLevel: any;
  getStatusColor: any;
  setSelectedItem: any;
  setShowDetailsModal: any;
  setItems: any;
  items: any;
}) => {
  return (
    <div className="bg-white dark:bg-neutral-900  rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-900">
            <tr>
              <th className="px-6  py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price & Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItems.map((item: any) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-neutral-800"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-neutral-300">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.sku} • {item.category}
                    </p>
                    <p className="text-xs text-gray-500">{item.location}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-bold dark:text-neutral-300">
                        {item.currentStock}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        /{item.maxStock}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getStockLevel(item.currentStock, item.minStock, item.maxStock).color}`}
                        style={{
                          width: getStockLevel(
                            item.currentStock,
                            item.minStock,
                            item.maxStock
                          ).width,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Min: {item.minStock}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium dark:text-neutral-500">
                      NPR {item.unitPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: NPR{" "}
                      {(item.currentStock * item.unitPrice).toLocaleString()}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium dark:text-neutral-500">
                      {item.supplier}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last: {item.lastRestocked}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm dark:text-gray-400">
                      {item.usedThisMonth} this month
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowDetailsModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-green-600"
                      title="Edit Item"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete Item"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${item.name}?`
                          )
                        ) {
                          setItems(items.filter((i: any) => i.id !== item.id));
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No items found matching your filters</p>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
