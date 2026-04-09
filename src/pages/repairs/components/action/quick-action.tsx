import { Plus, Search, Settings, TrendingUp } from "lucide-react";


const QuickAction = ({ setShowAddModal, setCurrentView }: { setShowAddModal: (v: boolean) => void; setCurrentView: (v: string) => void }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center"
        >
          <Plus className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">New Repair</span>
        </button>

        <button
          onClick={() => setCurrentView("repairs")}
          className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center"
        >
          <Search className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">
            View All Repairs
          </span>
        </button>

        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center">
          <TrendingUp className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">Reports</span>
        </button>

        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center">
          <Settings className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default QuickAction;
