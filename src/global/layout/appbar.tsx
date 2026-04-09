import { useMemo, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import DarkModeToggle from "./appbar-component/dark-mode-toggle";
import { logoutUser } from "../../pages/auth/services/logout";
import { useAuthStore } from "../../pages/auth/store/store";


/* ─── Icons ─── */
const IconProfile = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const AppBar = () => {
  const navigate = useNavigate();
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fullName = useAuthStore((state) => state.fullName);
  const role = useAuthStore((state) => state.role);
  const email = useAuthStore((state) => state.email);

  const firstName = useMemo(() => {
    if (!fullName?.trim()) return "User";
    return fullName.trim().split(" ")[0];
  }, [fullName]);

  const initials = useMemo(() => {
    if (!fullName?.trim()) return "U";
    const parts = fullName.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [fullName]);

  const roleLabel = useMemo(() => {
    if (!role) return "Member";
    return role.replaceAll("_", " ");
  }, [role]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileVisible(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  return (
    <header className="flex items-center justify-between py-2">
      <div />

      <div className="flex items-center gap-3">

        {/* Profile button */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsProfileVisible((v) => !v)}
            className="flex items-center gap-2.5 rounded-full border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-2 py-1.5 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-white/[0.08] transition cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/40 dark:ring-white/10 flex-shrink-0">
              {initials}
            </div>

            {/* Name + role */}
            <div className="hidden md:block text-left leading-tight">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{firstName}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40">{roleLabel}</div>
            </div>

            <ChevronDown
              size={14}
              className={`hidden md:block text-gray-400 dark:text-white/30 transition-transform ${isProfileVisible ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {isProfileVisible && (
            <div className="absolute right-0 z-50 mt-2.5 w-72 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0f1829] shadow-2xl overflow-hidden">

              {/* Profile header */}
              <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  {/* Large avatar */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-base font-bold text-white shadow-md flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{fullName || "User"}</div>
                    <div className="text-xs text-gray-500 dark:text-white/40 truncate mt-0.5">{email || "No email"}</div>
                    <span className="mt-1.5 inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                <Link
                  to="/app/profile"
                  onClick={() => setIsProfileVisible(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition"
                >
                  <span className="text-gray-400 dark:text-white/30"><IconProfile /></span>
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition border-none bg-transparent cursor-pointer mt-0.5"
                >
                  <IconLogout />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <DarkModeToggle />
      </div>
    </header>
  );
};

export default AppBar;