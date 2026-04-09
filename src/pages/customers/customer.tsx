import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../auth/store/store';
import { customerService, type ShopCustomerSummary } from './services/customer.service';
import { useToast } from '../../global/hooks/useToast';
import { PageLoader } from '../../global/components/loader/page-loader';

const currency = new Intl.NumberFormat('en-NP', {
  style: 'currency',
  currency: 'NPR',
  maximumFractionDigits: 0,
});

/* ─── Icons ─── */
const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconTool = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);
const IconDollar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
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
const IconMail = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

/* ─── Status badge colours ─── */
const STATUS_BADGE: Record<string, string> = {
  CONFIRMED:     'bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400',
  DIAGNOSIS:     'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400',
  IN_PROGRESS:   'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
  WAITING_PARTS: 'bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400',
  READY:         'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  COMPLETED:     'bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400',
  DELIVERED:     'bg-teal-100 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400',
  CANCELLED:     'bg-red-100 dark:bg-red-500/15 text-red-500 dark:text-red-400',
  PAID:          'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
};
const statusBadge = (s?: string) => STATUS_BADGE[s ?? ''] ?? 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40';

/* ─── Avatar ─── */
const Avatar = ({ name }: { name: string }) => {
  const initials = (name || '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-500">
      {initials}
    </div>
  );
};

/* ─── Stat Card ─── */
const StatCard = ({ label, value, iconBg, icon }: { label: string; value: string; iconBg: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-5 flex flex-col gap-3 relative overflow-hidden shadow-sm">
    <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-[0.08] ${iconBg}`} />
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${iconBg}`}>{icon}</div>
    <div>
      <div className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none">{value}</div>
      <div className="text-xs font-medium text-gray-500 dark:text-white/40 mt-1">{label}</div>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════ */
const Customer = () => {
  const tenantId = useAuthStore((state) => state.tenantId);
  const role = useAuthStore((state) => state.role);
  const [customers, setCustomers] = useState<ShopCustomerSummary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      if (!tenantId) { setLoading(false); return; }
      try {
        setLoading(true);
        const data = await customerService.getShopCustomers(tenantId);
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tenantId]);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((c) =>
      [c.customerName, c.customerPhone, c.customerEmail, c.latestRepairStatus]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term)),
    );
  }, [customers, search]);

  const stats = useMemo(() => ({
    total:    filteredCustomers.length,
    repairs:  filteredCustomers.reduce((s, c) => s + (Number(c.totalRepairs) || 0), 0),
    revenue:  filteredCustomers.reduce((s, c) => s + (Number(c.totalSpent) || 0), 0),
    visited:  filteredCustomers.filter((c) => c.lastVisit).length,
  }), [filteredCustomers]);

  if (!tenantId && role === 'PLATFORM_ADMIN') {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-white/40">
        Customer view is shop-based. Log in as a shop account to see the customer book for that shop.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
            Customer records built from bookings — including repair count and spend history.
          </p>
        </div>
        {/* Search */}
        <div className="relative md:w-80">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25 pointer-events-none"><IconSearch /></span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email, status…"
            className="w-full rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Customers"       value={String(stats.total)}              iconBg="bg-blue-500"    icon={<IconUsers />} />
        <StatCard label="Total Repairs"          value={String(stats.repairs)}            iconBg="bg-indigo-500"  icon={<IconTool />} />
        <StatCard label="Revenue From Repairs"   value={currency.format(stats.revenue)}  iconBg="bg-emerald-500" icon={<IconDollar />} />
        <StatCard label="Customers With Visits"  value={String(stats.visited)}            iconBg="bg-amber-500"   icon={<IconCalendar />} />
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] shadow-sm overflow-hidden">

        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]">
          <h2 className="font-bold text-gray-900 dark:text-white">Customer Book</h2>
          <span className="text-xs font-semibold text-gray-400 dark:text-white/30">{filteredCustomers.length} records</span>
        </div>

        {loading ? (
          <PageLoader message="Loading customers…" />
        ) : filteredCustomers.length === 0 ? (
          <div className="px-5 py-10 text-sm text-center text-gray-400 dark:text-white/30">
            {search ? 'No customers match your search.' : 'No customers found for this shop yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                  {['Customer', 'Contact', 'Repairs', 'Spent', 'Last Visit', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 bg-gray-50 dark:bg-white/[0.02] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr
                    key={`${customer.customerUserId ?? 'guest'}-${customer.customerPhone}-${index}`}
                    className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Customer */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={customer.customerName || '?'} />
                        <div>
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">
                            {customer.customerName || 'Guest customer'}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                            ID: {customer.customerUserId ?? 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-white/60">
                        <span className="text-gray-400 dark:text-white/25"><IconPhone /></span>
                        {customer.customerPhone || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/30 mt-1">
                        <span className="text-gray-300 dark:text-white/20"><IconMail /></span>
                        {customer.customerEmail || 'No email'}
                      </div>
                    </td>

                    {/* Repairs */}
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{customer.totalRepairs}</span>
                    </td>

                    {/* Spent */}
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {currency.format(Number(customer.totalSpent) || 0)}
                      </span>
                    </td>

                    {/* Last visit */}
                    <td className="px-5 py-3.5">
                      {customer.lastVisit ? (
                        <div>
                          <div className="text-xs font-medium text-gray-700 dark:text-white/60">
                            {new Date(customer.lastVisit).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-white/30">
                            {new Date(customer.lastVisit).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 dark:text-white/20">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full ${statusBadge(customer.latestRepairStatus ?? undefined)}`}>
                        {customer.latestRepairStatus?.replace(/_/g, ' ') || 'UNKNOWN'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer count */}
            <div className="px-5 py-3 border-t border-gray-50 dark:border-white/[0.04] text-xs text-gray-400 dark:text-white/25">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customer;