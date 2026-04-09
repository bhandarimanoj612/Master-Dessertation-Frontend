import { Laptop, Monitor, Smartphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../../auth/store/store";
import { getStatusInfo, statusOptions } from "../../features/status";
import { useAppointmentModalStore } from "../modal/store";
import { useAppointmentStore } from "../../store";
import { appointmentService } from "../../services/appointment.service";
import { mapBookingToAppointment } from "../../utils/mapper";
import { useToast } from "../../../../global/hooks/useToast";
import { PageLoader } from "../../../../global/components/loader/page-loader";

/* ─── Icons ─── */
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconPhone = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.58 4.9 2 2 0 0 1 3.55 2.73h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 5.69 5.69l1.06-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconClock = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconChevLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IconChevRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ─── Pagination ─── */
const ITEMS_PER_PAGE = 5;

const Pagination = ({
  page, totalPages, total, onPrev, onNext, onPage,
}: {
  page: number; totalPages: number; total: number;
  onPrev: () => void; onNext: () => void; onPage: (p: number) => void;
}) => {
  const from = Math.min((page - 1) * ITEMS_PER_PAGE + 1, total);
  const to   = Math.min(page * ITEMS_PER_PAGE, total);

  const pages: (number | "…")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="px-5 py-3 border-t border-gray-50 dark:border-white/[0.04] flex items-center justify-between">
      <span className="text-xs text-gray-400 dark:text-white/25">
        Showing {total === 0 ? 0 : from}–{to} of {total} appointments
      </span>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev} disabled={page === 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-gray-500 dark:text-white/40 hover:border-blue-300 dark:hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer">
            <IconChevLeft />
          </button>
          {pages.map((p, i) =>
            p === "…"
              ? <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-xs text-gray-400 dark:text-white/25">…</span>
              : <button
                  key={p}
                  onClick={() => onPage(p as number)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition cursor-pointer border
                    ${page === p
                      ? "bg-gradient-to-r from-black to-[#5079e8] border-transparent text-white"
                      : "border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-gray-500 dark:text-white/40 hover:border-blue-300 dark:hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400"}`}>
                  {p}
                </button>
          )}
          <button
            onClick={onNext} disabled={page === totalPages}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-gray-500 dark:text-white/40 hover:border-blue-300 dark:hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer">
            <IconChevRight />
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── Avatar ─── */
const Avatar = ({ name }: { name: string }) => {
  const initials = (name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-500">
      {initials}
    </div>
  );
};

const inputCls = "rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition";

const AppointmentList = () => {
  const userId   = useAuthStore((state) => state.userId);
  const role     = useAuthStore((state) => state.role);
  const tenantId = useAuthStore((state) => state.tenantId);

  const appointments        = useAppointmentStore((state) => state.appointments);
  const loading             = useAppointmentStore((state) => state.loading);
  const setAppointments     = useAppointmentStore((state) => state.setAppointments);
  const setLoading          = useAppointmentStore((state) => state.setLoading);
  const setError            = useAppointmentStore((state) => state.setError);
  const searchTerm          = useAppointmentStore((state) => state.searchTerm);
  const setSearchTerm       = useAppointmentStore((state) => state.setSearchTerm);
  const filterStatus        = useAppointmentStore((state) => state.filterStatus);
  const setFilterStatus     = useAppointmentStore((state) => state.setFilterStatus);
  const filterDate          = useAppointmentStore((state) => state.filterDate);
  const setFilterDate       = useAppointmentStore((state) => state.setFilterDate);

  const setOpen                = useAppointmentModalStore((state) => state.setOpen);
  const setSelectedAppointment = useAppointmentModalStore((state) => state.setSelectedAppointment);

  const toast = useToast();

  // Pagination
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [searchTerm, filterStatus, filterDate]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await appointmentService.getAppointments({ userId, role, tenantId });
        setAppointments(data.map(mapBookingToAppointment));
      } catch (err: any) {
        toast.error(err?.response?.data?.message || err?.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, [userId, role, tenantId, setAppointments, setError, setLoading]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        appt.customerName.toLowerCase().includes(search) ||
        appt.phone.includes(searchTerm) ||
        appt.deviceModel.toLowerCase().includes(search) ||
        appt.deviceType.toLowerCase().includes(search) ||
        appt.shopName.toLowerCase().includes(search) ||
        appt.backendStatus.toLowerCase().includes(search);
      const matchesStatus = filterStatus === "all" || appt.status === filterStatus;
      const matchesDate   = !filterDate || appt.appointmentDate === filterDate;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, searchTerm, filterStatus, filterDate]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE));
  const pagedAppointments = filteredAppointments.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const deviceIcons: Record<string, any> = {
    Mobile: Smartphone, Laptop: Laptop, TV: Monitor, Tablet: Monitor,
  };

  const openViewModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setOpen(true);
  };

  if (loading) {
    return <PageLoader message="Loading appointments…" />;
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-5 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25 pointer-events-none"><IconSearch /></span>
            <input
              type="text"
              placeholder="Search customer, phone, shop, device, status…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inputCls + " w-full pl-9"}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={inputCls + " cursor-pointer"}
          >
            <option value="all">All Status</option>
            {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] shadow-sm overflow-hidden max-sm:mb-20">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-white/[0.06]">
          <span className="text-sm font-bold text-gray-900 dark:text-white">Appointments</span>
          <span className="text-xs font-semibold text-gray-400 dark:text-white/30">{filteredAppointments.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                {["Customer", "Device", "Date & Time", "Status", "Shop", "Service", "Actions"].map((h, i) => (
                  <th key={h} className={`px-5 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 bg-gray-50 dark:bg-white/[0.02] whitespace-nowrap ${i === 6 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-sm text-center text-gray-400 dark:text-white/30">
                    No appointments found.
                  </td>
                </tr>
              ) : pagedAppointments.map((appt) => {
                const statusInfo  = getStatusInfo(appt.status);
                const DeviceIcon  = deviceIcons[appt.deviceType] || Smartphone;
                const StatusIcon  = statusInfo.icon;
                return (
                  <tr key={appt.id} className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors">

                    {/* Customer */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={appt.customerName} />
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{appt.customerName}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-white/30 mt-0.5">
                            <IconPhone />{appt.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Device */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 dark:text-white/25"><DeviceIcon size={15} /></span>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{appt.deviceModel}</div>
                          <div className="text-xs text-gray-400 dark:text-white/30">{appt.deviceType}</div>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-white/60">
                        <span className="text-gray-400 dark:text-white/25"><IconCalendar /></span>
                        {appt.appointmentDate}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-white/30 mt-1">
                        <IconClock />{appt.appointmentTime}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                        <StatusIcon size={11} />
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* Shop */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-700 dark:text-white/60">{appt.shopName}</td>

                    {/* Service mode */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${appt.serviceMode === "HOME_PICKUP" ? "bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40"}`}>
                        {appt.serviceMode === "HOME_PICKUP" ? "Home Pickup" : "In Store"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <button
                        onClick={() => openViewModal(appt)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-black to-[#5079e8] hover:from-blue-600 hover:to-[#273C75] text-white text-xs font-semibold px-3.5 py-1.5 border-none cursor-pointer transition-all shadow-sm"
                      >
                        <IconEye /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ── Pagination ── */}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={filteredAppointments.length}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onPage={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;