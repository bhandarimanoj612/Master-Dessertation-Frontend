import React, { useEffect, useMemo, useState } from "react";
import { axios_auth } from "../../global/config";
import { useAuthStore } from "../auth/store/store";
import { useToast } from "../../global/hooks/useToast";
import { PageLoader } from "../../global/components/loader/page-loader";

type Tech = {
  id: number;
  fullName: string;
  phone?: string;
  specialization?: string;
};

type ShopUser = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: "SHOP_STAFF" | "TECHNICIAN";
  isActive: boolean;
  shopId: number;
};

/* ─── Icons ─── */
const IconWrench = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const IconUser = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconShield = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconPhone = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.58 4.9 2 2 0 0 1 3.55 2.73h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 5.69 5.69l1.06-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z" />
  </svg>
);
const IconMail = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ─── Avatar ─── */
const Avatar = ({ name, accent = false }: { name: string; accent?: boolean }) => {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
      style={{ background: accent ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "linear-gradient(135deg,#64748b,#475569)" }}
    >
      {initials}
    </div>
  );
};

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

/* ─── Input ─── */
const Field = ({ placeholder, value, onChange, type = "text" }: { placeholder: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
  />
);

/* ─── Select ─── */
const SelectField = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer"
  >
    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

/* ─── Role Badge ─── */
const RoleBadge = ({ role }: { role: string }) => (
  <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-md ${role === "TECHNICIAN" ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40"}`}>
    {role === "TECHNICIAN" ? "Technician" : "Staff"}
  </span>
);

/* ─── Card wrapper ─── */
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

/* ─── Section label ─── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mb-4">{children}</div>
);

/* ════════════════════════════════════════════════════════ */
const Technicians = () => {
  const tenantId = useAuthStore((s) => s.tenantId);
  const role = useAuthStore((s) => s.role);
  const [technicians, setTechnicians] = useState<Tech[]>([]);
  const [users, setUsers] = useState<ShopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"technician" | "staff">("technician");
  const [techForm, setTechForm] = useState({ fullName: "", phone: "", specialization: "", email: "", password: "" });
  const [staffForm, setStaffForm] = useState({ fullName: "", email: "", phone: "", password: "", role: "SHOP_STAFF" as "SHOP_STAFF" | "TECHNICIAN" });

  const toast = useToast();

  const load = async () => {
    if (!tenantId) return;
    try {
      setLoading(true);
      const [techRes, userRes] = await Promise.all([
        axios_auth.get<Tech[]>(`/api/admin/technicians/shop/${tenantId}`),
        axios_auth.get<ShopUser[]>(`/api/admin/shop-users/shop/${tenantId}`),
      ]);
      setTechnicians(techRes.data);
      setUsers(userRes.data.filter((u) => u.role === "SHOP_STAFF" || u.role === "TECHNICIAN"));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [tenantId]);

  const summary = useMemo(() => ({
    technicians: technicians.length,
    teamUsers: users.length,
    activeUsers: users.filter((u) => u.isActive).length,
    techLogins: users.filter((u) => u.role === "TECHNICIAN").length,
  }), [technicians, users]);

  const handleCreateTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    try {
      await axios_auth.post("/api/admin/technicians", { shopId: tenantId, ...techForm });
      setTechForm({ fullName: "", phone: "", specialization: "", email: "", password: "" });
      toast.success("Technician created successfully");
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create technician");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    try {
      await axios_auth.post("/api/admin/shop-users", { shopId: tenantId, ...staffForm });
      setStaffForm({ fullName: "", email: "", phone: "", password: "", role: "SHOP_STAFF" });
      toast.success("Staff account created successfully");
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create staff account");
    }
  };

  const toggleUser = async (userId: number) => {
    try {
      await axios_auth.patch(`/api/admin/shop-users/${userId}/toggle-active`);
      toast.success("User status updated");
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update user");
    }
  };

  if (role !== "SHOP_OWNER" && role !== "PLATFORM_ADMIN") {
    return <div className="p-8 text-sm text-gray-500 dark:text-white/30">Only shop owners or admins can manage team members.</div>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Team Management</h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-1">Manage technician profiles, logins, and staff accounts for your shop.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Technician Profiles" value={summary.technicians} iconBg="bg-blue-500" icon={<IconWrench />} />
        <StatCard label="Team Accounts" value={summary.teamUsers} iconBg="bg-indigo-500" icon={<IconUser />} />
        <StatCard label="Active Accounts" value={summary.activeUsers} iconBg="bg-emerald-500" icon={<IconShield />} />
        <StatCard label="Technician Logins" value={summary.techLogins} iconBg="bg-amber-500" icon={<IconWrench />} />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* LEFT — form */}
        <Card>
          {/* Tab bar */}
          <div className="flex gap-1 bg-gray-100 dark:bg-white/[0.04] p-1 rounded-xl border border-gray-200 dark:border-white/[0.06] w-fit mb-5">
            {(["technician", "staff"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-[10px] text-sm font-semibold transition-all border-none cursor-pointer ${
                  activeTab === t
                    ? "bg-gradient-to-r from-black to-[#5079e8] text-white shadow-sm"
                    : "bg-transparent text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60"
                }`}
              >
                {t === "technician" ? "Technician Profile" : "Staff / Login"}
              </button>
            ))}
          </div>

          {activeTab === "technician" ? (
            <form onSubmit={handleCreateTechnician} className="space-y-3">
              <SectionLabel>New Technician Profile</SectionLabel>
              <Field placeholder="Full name *" value={techForm.fullName} onChange={(v) => setTechForm({ ...techForm, fullName: v })} />
              <Field placeholder="Phone number" value={techForm.phone} onChange={(v) => setTechForm({ ...techForm, phone: v })} />
              <Field placeholder="Specialization (e.g. Engine, Brakes)" value={techForm.specialization} onChange={(v) => setTechForm({ ...techForm, specialization: v })} />
              <div className="pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mb-3">Optional Login Credentials</div>
                <div className="space-y-3">
                  <Field placeholder="Email address" value={techForm.email} onChange={(v) => setTechForm({ ...techForm, email: v })} />
                  <Field type="password" placeholder="Password" value={techForm.password} onChange={(v) => setTechForm({ ...techForm, password: v })} />
                </div>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-black to-[#5079e8] hover:from-blue-600 hover:to-[#273C75] text-white text-sm font-semibold py-2.5 border-none cursor-pointer transition-all shadow-sm mt-1">
                <IconPlus /> Create Technician
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateUser} className="space-y-3">
              <SectionLabel>New Staff / Login Account</SectionLabel>
              <Field placeholder="Full name *" value={staffForm.fullName} onChange={(v) => setStaffForm({ ...staffForm, fullName: v })} />
              <Field placeholder="Email address *" value={staffForm.email} onChange={(v) => setStaffForm({ ...staffForm, email: v })} />
              <Field placeholder="Phone number" value={staffForm.phone} onChange={(v) => setStaffForm({ ...staffForm, phone: v })} />
              <Field type="password" placeholder="Password *" value={staffForm.password} onChange={(v) => setStaffForm({ ...staffForm, password: v })} />
              <SelectField
                value={staffForm.role}
                onChange={(v) => setStaffForm({ ...staffForm, role: v as "SHOP_STAFF" | "TECHNICIAN" })}
                options={[{ value: "SHOP_STAFF", label: "Shop Staff" }, { value: "TECHNICIAN", label: "Technician Login" }]}
              />
              <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-black to-[#5079e8] hover:from-blue-600 hover:to-[#273C75] text-white text-sm font-semibold py-2.5 border-none cursor-pointer transition-all shadow-sm mt-1">
                <IconPlus /> Create Account
              </button>
            </form>
          )}
        </Card>

        {/* RIGHT — lists */}
        <div className="flex flex-col gap-4">

          {/* Technician profiles list */}
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <SectionLabel>Technician Profiles</SectionLabel>
              <span className="text-xs font-semibold text-gray-400 dark:text-white/30 -mt-3">{technicians.length} total</span>
            </div>
            {loading ? (
              <PageLoader message="Loading…" className="py-5" />
            ) : technicians.length === 0 ? (
              <p className="text-sm text-center py-5 text-gray-300 dark:text-white/20">No technicians added yet.</p>
            ) : (
              <div className="space-y-2.5">
                {technicians.map((tech) => (
                  <div key={tech.id} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-3.5 py-3">
                    <Avatar name={tech.fullName} accent />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">{tech.fullName}</div>
                      <div className="text-xs text-blue-500 dark:text-blue-400 font-medium mt-0.5">{tech.specialization || "General Repair"}</div>
                    </div>
                    {tech.phone && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-white/30 flex-shrink-0">
                        <IconPhone /> {tech.phone}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Staff & logins list */}
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <SectionLabel>Staff &amp; Logins</SectionLabel>
              <span className="text-xs font-semibold text-gray-400 dark:text-white/30 -mt-3">{users.length} total</span>
            </div>
            {loading ? (
              <PageLoader message="Loading…" className="py-5" />
            ) : users.length === 0 ? (
              <p className="text-sm text-center py-5 text-gray-300 dark:text-white/20">No staff accounts created yet.</p>
            ) : (
              <div className="space-y-2.5">
                {users.map((user) => (
                  <div key={user.id} className={`flex items-center gap-3 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-3.5 py-3 transition-opacity ${!user.isActive ? "opacity-50" : ""}`}>
                    <Avatar name={user.fullName} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{user.fullName}</span>
                        <RoleBadge role={user.role} />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-white/30 mt-0.5">
                        <IconMail /> {user.email}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleUser(user.id)}
                      className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-lg border-none cursor-pointer transition-all ${
                        user.isActive
                          ? "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20"
                          : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                      }`}
                    >
                      {user.isActive ? "Disable" : "Enable"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Technicians;