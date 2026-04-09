import React, { useMemo } from "react";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiPackage,
  FiTool,
  FiShield,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { User2, UserSearch } from "lucide-react";
import { useGlobalStore } from "../store";
import { IGlobalStore } from "../interface";
import { useAuthStore } from "../../pages/auth/store/store";
import type { Role } from "../../global/interface";

type MenuItem = {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: Role[];
};

const Sidebar: React.FC = () => {
  const location = useLocation();

  const expanded = useGlobalStore((state: IGlobalStore) => state.expanded);
  const setExpanded = useGlobalStore(
    (state: IGlobalStore) => state.setExpanded,
  );

  const role = useAuthStore((state) => state.role);

  const homePath =
    role === "CUSTOMER"
      ? "/app/shops"
      : role === "PLATFORM_ADMIN"
        ? "/app/admin"
        : "/app/dashboard";

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        key: "home",
        label: "Home",
        path: homePath,
        icon: <FiHome className="text-xl" />,
        roles: ["CUSTOMER", "SHOP_OWNER", "SHOP_STAFF"],
      },
      {
        key: "admin",
        label: "Admin",
        path: "/app/admin",
        icon: <FiShield className="text-xl" />,
        roles: ["PLATFORM_ADMIN"],
      },
      {
        key: "appointments",
        label: "Appointments",
        path: "/app/appointments",
        icon: <FiCalendar className="text-xl" />,
        roles: ["CUSTOMER", "SHOP_OWNER", "SHOP_STAFF"],
      },
      {
        key: "customers",
        label: "Customers",
        path: "/app/customers",
        icon: <FiUsers className="text-xl" />,
        roles: ["SHOP_OWNER", "SHOP_STAFF"],
      },
      {
        key: "inventory",
        label: "Inventory",
        path: "/app/inventory",
        icon: <FiPackage className="text-xl" />,
        roles: ["SHOP_OWNER", "SHOP_STAFF"],
      },
      {
        key: "billing",
        label: "Billing",
        path: "/app/billing",
        icon: <LiaFileInvoiceDollarSolid className="text-xl" />,
        roles: ["SHOP_OWNER", "SHOP_STAFF"],
      },
      {
        key: "repairs",
        label: "Repairs",
        path: "/app/repairs",
        icon: <FiTool className="text-xl" />,
        roles: ["TECHNICIAN", "SHOP_OWNER"],
      },
      {
        key: "technicians",
        label: "Technicians",
        path: "/app/technicians",
        icon: <UserSearch className="text-xl" />,
        roles: ["SHOP_OWNER"],
      },
      {
        key: "profile",
        label: "Profile",
        path: "/app/profile",
        icon: <User2 className="text-xl" />,
        roles: [
          "CUSTOMER",
          "SHOP_OWNER",
          "SHOP_STAFF",
          "TECHNICIAN",
          "PLATFORM_ADMIN",
        ],
      },
    ],
    [homePath],
  );

  const visibleMenuItems = menuItems.filter((item) =>
    role ? item.roles.includes(role) : false,
  );

  const isActive = (path: string) => {
    if (path === "/app/dashboard") {
      return location.pathname === "/app/dashboard";
    }

    if (path === "/app/admin") {
      return location.pathname.startsWith("/app/admin");
    }

    if (path === "/app/shops") {
      return (
        location.pathname === "/app" ||
        location.pathname.startsWith("/app/shops")
      );
    }

    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`
        ${expanded ? "md:w-28 md:min-w-[20em] lg:min-w-64 xl:min-w-[13em]" : "md:w-16"}
        md:h-screen
        max-sm:h-16 max-sm:w-full max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0
        md:flex-col md:sticky md:top-0
        z-30
      `}
    >
      <motion.div
        className={`${
          expanded
            ? "md:w-28 md:min-w-[20em] lg:min-w-64 xl:min-w-[13em]"
            : "mb-8 hidden md:flex items-center justify-center"
        } max-sm:hidden`}
      >
        <div
          className={`${
            expanded
              ? "flex flex-col items-center rounded-t-2xl md:bg-[#060606] shadow-lg dark:bg-gray-800 dark:text-white"
              : "flex flex-col items-center rounded-2xl md:bg-[#060606] shadow-lg dark:bg-gray-800 dark:text-white"
          }`}
        >
          <motion.div
            className="mt-1 flex h-8 w-7 items-center justify-center rounded-full bg-gradient-to-r from-blue-900 to-gray-700 p-1 shadow-lg"
            initial={{ rotate: 190 }}
            whileHover={{ rotate: 12 }}
            transition={{ type: "spring", stiffness: 600 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 22"
              strokeWidth="2"
              stroke="white"
              className="h-4 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </motion.div>

          <div className="flex flex-col items-center p-1">
            <span className="p-1 text-center font-mono text-xs font-extrabold tracking-wide text-white">
              Sajilo
            </span>
            <span className="-mt-1 ml-4 text-[10px] font-normal text-white">
              Tyaar
            </span>
          </div>

          <motion.div
            className="m-2 mt-3 flex h-4 w-2 items-center justify-center rounded-full bg-gradient-to-r from-blue-900 to-gray-700 p-1 shadow-lg max-sm:hidden"
            initial={{ rotate: 190 }}
            whileHover={{ rotate: 20 }}
            transition={{ type: "keyframes", stiffness: 600 }}
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className="cursor-pointer rounded-lg bg-blue-900 p-1.5 text-white hover:bg-blue-950 dark:hover:bg-blue-950"
            >
              {expanded ? "❮" : "❯"}
            </button>
          </motion.div>
        </div>
      </motion.div>

      <nav
        className={`
          ${expanded ? "md:h-[85%] md:rounded-b-3xl" : "md:h-[80%] md:rounded-3xl"}
          md:bg-[#060606] md:text-white md:flex md:flex-col md:items-center md:justify-between
          dark:bg-gray-800 dark:text-white 
          max-sm:h-full max-sm:bg-[#060606] max-sm:text-white max-sm:flex max-sm:items-center max-sm:justify-center max-sm:rounded-t-3xl
        `}
      >
        <div
          className="
            md:flex md:flex-col md:justify-evenly md:items-center md:space-y-4 mt-14
            max-sm:flex max-sm:flex-row max-sm:justify-around max-sm:w-full max-sm:items-center max-sm:px-4
          "
        >
          {visibleMenuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <motion.div
                key={item.key}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                title={item.label}
                className={`${expanded && active ? "rounded-lg p-2 md:bg-white" : ""}`}
              >
                <Link
                  to={item.path}
                  className="group flex items-center justify-center"
                >
                  <div
                    className={`flex justify-center rounded-full p-2 max-sm:p-1 max-sm:m-1 ${
                      active ? "bg-white text-black" : "bg-[#060606] text-white"
                    } ${expanded ? "md:mr-4" : "m-2"}`}
                  >
                    {item.icon}
                  </div>

                  {expanded && active && (
                    <span
                      className={`hidden md:block ml-3 text-sm ${
                        active ? "text-black" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>

                {active && !expanded && (
                  <span className="md:hidden flex justify-center text-xs text-white mt-1 text-center leading-tight">
                    {item.label}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;