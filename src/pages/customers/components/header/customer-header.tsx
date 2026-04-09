import { Users, UserPlus } from "lucide-react";
import { useState } from "react";

const CustomerHeader = () => {
  const [, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [, setSelectedCustomer] = useState(null);
  const [, setModalType] = useState("view");
  const [, setShowModal] = useState(false);
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    });
    setSelectedCustomer(null);
    setModalType("view");
  };

  const openCreateModal = () => {
    resetForm();
    setModalType("create");
    setShowModal(true);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Users className="text-blue-600" size={32} />
          Customer Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your customer database and relationships
        </p>
      </div>
      <button
        onClick={openCreateModal}
        className="flex items-center px-4 py-2 bg-gradient-to-r from-black to-[#5079e8] text-white rounded-xl hover:from-blue-600 hover:to-[#273C75] transition-all duration-300 shadow-lg"
      >
        <UserPlus size={20} />
        Add New Customer
      </button>
    </div>
  );
};

export default CustomerHeader;
