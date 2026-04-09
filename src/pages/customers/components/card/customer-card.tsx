import {
  Edit,
  Eye,
  Mail,
  MapPin,
  Phone,
  Star,
  Trash2,
  User,
} from "lucide-react";

const CustomerCard = ({
  filteredCustomers,
  getDeviceIcon,
  openViewModal,
  openEditModal,
  deleteCustomer,
  getStatusColor,
}: {
  filteredCustomers: any[];
  getDeviceIcon: (t: any) => any;
  openViewModal: (c: any) => void;
  openEditModal: (c: any) => void;
  deleteCustomer: (id: any) => void;
  getStatusColor: (s: any) => string;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCustomers.map((customer: any) => (
        <div
          key={customer.id}
          className="bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-400">
                    {customer.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}
                  >
                    {customer.status.charAt(0).toUpperCase() +
                      customer.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < customer.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={14} className="mr-2" />

                {customer.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={14} className="mr-2" />
                {customer.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={14} className="mr-2" />
                {customer.address}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-neutral-400">
                  {customer.totalRepairs}
                </div>
                <div className="text-xs text-gray-500">Total Repairs</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-neutral-400">
                  Rs. {customer.totalSpent.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Total Spent</div>
              </div>
            </div>

            {/* Recent Devices */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Recent Devices
              </h4>
              <div className="space-y-1">
                {customer.deviceHistory.slice(0, 2).map((device: any, index: any) => {
                  const DeviceIcon = getDeviceIcon(device.device);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center">
                        <DeviceIcon size={12} className="text-gray-400 mr-1" />
                        <span className="text-gray-600">{device.device}</span>
                      </div>
                      <span className="text-gray-500">
                        {device.repairs} repairs
                      </span>
                    </div>
                  );
                })}
                {customer.deviceHistory.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{customer.deviceHistory.length - 2} more devices
                  </div>
                )}
              </div>
            </div>

            {/* Last Visit */}
            <div className="mb-4">
              <div className="text-xs text-gray-500">
                Last visit: {new Date(customer.lastVisit).toLocaleDateString()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => openViewModal(customer)}
                className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center gap-1"
              >
                <Eye size={14} />
                View Details
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(customer)}
                  className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                  title="Edit"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => deleteCustomer(customer.id)}
                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerCard;
