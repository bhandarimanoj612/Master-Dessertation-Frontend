import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../auth/store/store";

const IconCalendar = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const AppointmentHeader = () => {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);
  const isCustomer = role === "CUSTOMER";

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          <span className="text-blue-500"><IconCalendar /></span>
          Appointment Management
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-white/40">
          {isCustomer
            ? "Track your repair request, approve estimates, and pay after completion."
            : "Manage repair requests, provide estimates, assign technicians, and update repair progress."}
        </p>
      </div>

      {isCustomer && (
        <button
          onClick={() => navigate("/app/shops")}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-black to-[#5079e8] hover:from-blue-600 hover:to-[#273C75] text-white text-sm font-semibold px-4 py-2.5 border-none cursor-pointer transition-all shadow-sm flex-shrink-0"
        >
          <IconPlus /> New Appointment
        </button>
      )}
    </div>
  );
};

export default AppointmentHeader;