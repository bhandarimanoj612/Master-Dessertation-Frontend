import React, { useEffect, useMemo, useState } from "react";
import { appointmentService } from "../appointments/services/appointment.service";
import { mapBookingToAppointment } from "../appointments/utils/mapper";
import type { AppointmentItem, BackendRepairStatus } from "../appointments/interface";
import { useAuthStore } from "../auth/store/store";
import { useToast } from "../../global/hooks/useToast";
import { PageLoader } from "../../global/components/loader/page-loader";

/* ─── Status config ─── */
const STATUS_META: Record<string, { label: string; dot: string; badge: string }> = {
  CONFIRMED:      { label: "Confirmed",       dot: "bg-sky-500",     badge: "bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400" },
  DIAGNOSIS:      { label: "Diagnosis",       dot: "bg-violet-500",  badge: "bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400" },
  IN_PROGRESS:    { label: "In Progress",     dot: "bg-amber-500",   badge: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  WAITING_PARTS:  { label: "Waiting Parts",   dot: "bg-orange-500",  badge: "bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  READY:          { label: "Ready",           dot: "bg-emerald-500", badge: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  COMPLETED:      { label: "Completed",       dot: "bg-green-500",   badge: "bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400" },
  DELIVERED:      { label: "Delivered",       dot: "bg-teal-500",    badge: "bg-teal-100 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400" },
};

const getMeta = (status: string) =>
  STATUS_META[status] ?? { label: status, dot: "bg-gray-400", badge: "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40" };

/* ─── Icons ─── */
const IconTool = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const IconList = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconUser = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconPhone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.58 4.9 2 2 0 0 1 3.55 2.73h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 5.69 5.69l1.06-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconDollar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconWrench = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

/* ─── Stat Card ─── */
const StatCard = ({ label, value, icon, iconBg }: { label: string; value: number; icon: React.ReactNode; iconBg: string }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-5 flex flex-col gap-3 relative overflow-hidden shadow-sm">
    <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-[0.08] ${iconBg}`} />
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${iconBg}`}>{icon}</div>
    <div>
      <div className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{value}</div>
      <div className="text-xs font-medium text-gray-500 dark:text-white/40 mt-1">{label}</div>
    </div>
  </div>
);

/* ─── Status Badge ─── */
const StatusBadge = ({ status }: { status: string }) => {
  const meta = getMeta(status);
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full ${meta.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
};

/* ─── Info row ─── */
const InfoRow = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/40">
    <span className="text-gray-400 dark:text-white/25">{icon}</span>
    <span>{children}</span>
  </div>
);

/* ─── Repair Card ─── */
const RepairCard = ({
  repair,
  remark,
  onRemarkChange,
  onUpdateStatus,
}: {
  repair: AppointmentItem;
  remark: string;
  onRemarkChange: (v: string) => void;
  onUpdateStatus: (status: BackendRepairStatus) => void;
}) => {
  const isDone = ["READY", "COMPLETED", "DELIVERED"].includes(repair.backendStatus);

  return (
    <div className={`rounded-2xl border bg-white dark:bg-white/[0.04] shadow-sm overflow-hidden transition-opacity ${isDone ? "opacity-75" : ""} ${isDone ? "border-gray-100 dark:border-white/[0.04]" : "border-gray-200 dark:border-white/[0.07]"}`}>

      {/* Card top accent bar */}
      <div className={`h-0.5 w-full ${getMeta(repair.backendStatus).dot}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-gray-900 dark:text-white truncate">
                {repair.deviceType} — {repair.deviceModel}
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5 line-clamp-2">{repair.issueDescription}</p>
          </div>
          <StatusBadge status={repair.backendStatus} />
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
          <InfoRow icon={<IconUser />}>
            <span className="text-gray-700 dark:text-white/70 font-medium">{repair.customerName}</span>
          </InfoRow>
          <InfoRow icon={<IconPhone />}>
            {repair.phone || "—"}
          </InfoRow>
          <InfoRow icon={<IconCalendar />}>
            {repair.appointmentDate} {repair.appointmentTime}
          </InfoRow>
          <InfoRow icon={<IconDollar />}>
            {repair.estimatedPrice ? `Rs. ${repair.estimatedPrice}` : "No estimate"}
          </InfoRow>
          <InfoRow icon={<IconWrench />}>
            {repair.assignedTechnician || "Unassigned"}
          </InfoRow>
          <InfoRow icon={<IconCheck />}>
            Customer: {repair.customerApprovedEstimate ? <span className="text-emerald-500 font-semibold">Approved</span> : <span className="text-gray-400 dark:text-white/30">Pending</span>}
          </InfoRow>
        </div>

        {/* Remarks */}
        <textarea
          rows={2}
          className="w-full rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-none"
          placeholder="Add technician remarks before updating status…"
          value={remark}
          onChange={(e) => onRemarkChange(e.target.value)}
        />

        {/* Action buttons */}
        {!isDone && (
          <div className="mt-3 flex flex-wrap gap-2">
            {repair.backendStatus !== "IN_PROGRESS" && (
              <button
                onClick={() => onUpdateStatus("IN_PROGRESS")}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 border-none cursor-pointer transition-all shadow-sm"
              >
                <IconTool /> Mark In Progress
              </button>
            )}
            <button
              onClick={() => onUpdateStatus("COMPLETED")}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 border-none cursor-pointer transition-all shadow-sm"
            >
              <IconCheck /> Mark Completed
            </button>
          </div>
        )}

        {isDone && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <IconCheck /> Job closed
          </div>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════ */
const Repairs = () => {
  const userId = useAuthStore((s) => s.userId);
  const role = useAuthStore((s) => s.role);
  const tenantId = useAuthStore((s) => s.tenantId);
  const fullName = useAuthStore((s) => s.fullName);
  const [repairs, setRepairs] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  const toast = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments({ userId, role, tenantId });
      const mapped = data
        .map(mapBookingToAppointment)
        .filter(
          (item) =>
            item.backendStatus !== "REQUESTED" &&
            item.backendStatus !== "ESTIMATE_PROVIDED" &&
            item.backendStatus !== "CUSTOMER_CONFIRMED" &&
            item.backendStatus !== "CANCELLED" &&
            item.backendStatus !== "PAID",
        );
      setRepairs(mapped);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load repairs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [userId, role, tenantId]);

  const updateStatus = async (bookingId: number, status: BackendRepairStatus) => {
    try {
      await appointmentService.updateStatus(bookingId, {
        status,
        changedBy: fullName || role || "Technician",
        remarks: remarks[bookingId] || "",
      });
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update repair");
    }
  };

  const grouped = useMemo(() => ({
    active: repairs.filter((r) => !["READY", "COMPLETED", "DELIVERED"].includes(r.backendStatus)),
    done:   repairs.filter((r) =>  ["READY", "COMPLETED", "DELIVERED"].includes(r.backendStatus)),
  }), [repairs]);

  const visible = filter === "active" ? grouped.active : filter === "done" ? grouped.done : [...grouped.active, ...grouped.done];

  const tabs: { key: typeof filter; label: string; count: number }[] = [
    { key: "all",    label: "All Jobs",       count: repairs.length },
    { key: "active", label: "Active",         count: grouped.active.length },
    { key: "done",   label: "Ready / Done",   count: grouped.done.length },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Repair Workboard</h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
          Technicians and shop managers can update diagnosis, progress, waiting parts, ready, and completed stages here.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="All Repair Jobs" value={repairs.length}       iconBg="bg-blue-500"    icon={<IconList />} />
        <StatCard label="Active Jobs"     value={grouped.active.length} iconBg="bg-amber-500"   icon={<IconTool />} />
        <StatCard label="Ready / Done"    value={grouped.done.length}   iconBg="bg-emerald-500" icon={<IconCheck />} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-white/[0.04] p-1 rounded-xl border border-gray-200 dark:border-white/[0.06] w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all border-none cursor-pointer ${
              filter === t.key
                ? "bg-gradient-to-r from-black to-[#5079e8] text-white shadow-sm"
                : "bg-transparent text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60"
            }`}
          >
            {t.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === t.key ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/30"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {loading ? (
        <PageLoader message="Loading repairs…" />
      ) : visible.length === 0 ? (
        <div className="text-sm text-gray-400 dark:text-white/30 py-8 text-center">No repair jobs found.</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.map((repair) => (
            <RepairCard
              key={repair.id}
              repair={repair}
              remark={remarks[repair.id] || ""}
              onRemarkChange={(v) => setRemarks((prev) => ({ ...prev, [repair.id]: v }))}
              onUpdateStatus={(status) => updateStatus(repair.id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Repairs;