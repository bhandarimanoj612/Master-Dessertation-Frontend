

const RecentRepair = ({
  //   setCurrentView,
  repairs,
  getDeviceIcon,
  getStatusColor,
}: {
  repairs: any[];
  getDeviceIcon: (t: any) => any;
  getStatusColor: (s: any) => any;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Repairs</h2>
        <button
          //   onClick={() => setCurrentView("repairs")}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All →
        </button>
      </div>
      <div className="space-y-3">
        {repairs.slice(0, 5).map((repair: any) => (
          <div
            key={repair.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {getDeviceIcon(repair.deviceType)}
              <div>
                <div className="font-medium">{repair.customerName}</div>
                <div className="text-sm text-gray-600">
                  {repair.deviceBrand} {repair.deviceModel}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(repair.status)}`}
              >
                {repair.status}
              </div>
              <div className="text-sm text-gray-600 mt-1">#{repair.id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRepair;
