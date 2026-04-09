import { Edit3, Eye, Zap } from "lucide-react";


const RepairTable = ({
  filteredRepairs,
  getDeviceIcon,
  getStatusColor,
  getPriorityColor,
  setShowDetailsModal,
  setSelectedRepair,
  getDaysOverdue,
}: {
  filteredRepairs: any[];
  getDeviceIcon: any;
  getStatusColor: any;
  getPriorityColor: any;
  setShowDetailsModal: any;
  setSelectedRepair: any;
  getDaysOverdue: any;
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Repair ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Device
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Problem
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Technician
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cost
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRepairs.map((repair) => {
              const daysOverdue = getDaysOverdue(
                repair.estimatedDelivery,
                repair.status
              );
              return (
                <tr key={repair.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="font-medium text-blue-600">
                        #{repair.id}
                      </span>
                      {repair.isUrgent && (
                        <Zap className="w-4 h-4 text-red-500 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {repair.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {repair.customerPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {getDeviceIcon(repair.deviceType)}
                      <div className="ml-2">
                        <div className="font-medium">{repair.deviceBrand}</div>
                        <div className="text-sm text-gray-500">
                          {repair.deviceModel}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="text-sm text-gray-900 max-w-xs truncate"
                      title={repair.problem}
                    >
                      {repair.problem}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(repair.status)}`}
                    >
                      {repair.status}
                    </span>
                    {daysOverdue > 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        {daysOverdue} days overdue
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-medium ${getPriorityColor(repair.priority)}`}
                    >
                      {repair.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {repair.technicianAssigned}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-medium">
                        NPR {repair.estimatedCost.toLocaleString()}
                      </div>
                      {repair.advancePayment > 0 && (
                        <div className="text-green-600">
                          Paid: NPR {repair.advancePayment.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRepair(repair);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepairTable;
