
import { ICustomer } from "./interface";

const CustomerModal = ({
  show,
}: {
  show: boolean;
  type?: "view" | "create" | "edit";
  customer?: ICustomer | null;
  onClose?: () => void;
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-80 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white dark:bg-[#23272f]">
        {/* ...modal content */}
      </div>
    </div>
  );
};

export default CustomerModal;
