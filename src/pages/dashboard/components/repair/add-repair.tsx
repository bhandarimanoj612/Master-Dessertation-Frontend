
import { useNavigate } from "react-router-dom";
import { Icons } from "../overview/components/icons";

const actions = [
  {
    label: "See Customer History",
    description: "View previous service history for each customer",
    route: "/app/customers",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-500/15",
    hoverRing: "hover:border-blue-200 dark:hover:border-blue-500/30",
    hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    Icon: Icons.Smartphone,
  },
  {
    label: "Schedule Appointment",
    description: "Arrange convenient appointment times for customers",
    route: "/app/appointments",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
    hoverRing: "hover:border-emerald-200 dark:hover:border-emerald-500/30",
    hoverText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    Icon: Icons.Calendar,
  },
  {
    label: "Generate Report",
    description: "Create detailed performance analytics reports",
    route: "/app/billing",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-100 dark:bg-violet-500/15",
    hoverRing: "hover:border-violet-200 dark:hover:border-violet-500/30",
    hoverText: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
    Icon: Icons.PieChart,
  },
];

const AddRepair = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 max-sm:mb-20">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => navigate(action.route)}
          className={`group flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${action.hoverRing} cursor-pointer`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${action.iconBg}`}>
            <span className={action.iconColor}><action.Icon /></span>
          </div>
          <div>
            <div className={`text-sm font-bold text-gray-900 dark:text-white transition-colors ${action.hoverText}`}>
              {action.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{action.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default AddRepair;