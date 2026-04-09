import { useMemo } from "react";
import { useAppointmentStore } from "../../store";

/* ─── Icons ─── */
const IconList       = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IconPen        = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const IconBadge      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
const IconCheck      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconClock      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconReceipt    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="14" y2="13"/></svg>;
const IconDollar     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;

const CARDS = [
  { key: "total",        label: "Total",          iconBg: "bg-blue-500",    Icon: IconList },
  { key: "requested",    label: "Requested",       iconBg: "bg-slate-500",   Icon: IconPen },
  { key: "estimateSent", label: "Estimate Sent",   iconBg: "bg-amber-500",   Icon: IconBadge },
  { key: "confirmed",    label: "Confirmed",       iconBg: "bg-sky-500",     Icon: IconCheck },
  { key: "inProgress",   label: "In Progress",     iconBg: "bg-orange-500",  Icon: IconClock },
  { key: "completed",    label: "Completed",       iconBg: "bg-emerald-500", Icon: IconReceipt },
  { key: "paid",         label: "Paid",            iconBg: "bg-green-500",   Icon: IconDollar },
] as const;

const AppointmentStats = () => {
  const appointments = useAppointmentStore((state) => state.appointments);

  const stats = useMemo(() => ({
    total:        appointments.length,
    requested:    appointments.filter((a) => a.status === "requested").length,
    estimateSent: appointments.filter((a) => a.status === "estimate-sent").length,
    confirmed:    appointments.filter((a) => a.status === "confirmed" || a.status === "customer-confirmed").length,
    inProgress:   appointments.filter((a) => a.status === "in-progress").length,
    completed:    appointments.filter((a) => a.status === "completed").length,
    paid:         appointments.filter((a) => a.status === "paid").length,
  }), [appointments]);

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
      {CARDS.map(({ key, label, iconBg, Icon }) => (
        <div
          key={key}
          className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-4 flex flex-col gap-2.5 relative overflow-hidden shadow-sm"
        >
          <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-[0.08] ${iconBg}`} />
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${iconBg}`}>
            <Icon />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
              {stats[key]}
            </div>
            <div className="text-[11px] font-medium text-gray-500 dark:text-white/40 mt-1">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentStats;