import React, { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../auth/store/store";
import { PageLoader } from "../../global/components/loader/page-loader";
import VerificationTab from "../verification/VerificationTab";

/* ─── Types ─── */
type ProfileData = {
  id?: string | number;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  role: string;
  avatar: string | null;
  bio: string;

  shopName: string;
  shopAddress: string;
  shopPhone: string;
  businessHours: string;
  specialization: string[];
};

type NotificationSettings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  cursorAnimation: boolean;
};

const defaultProfileData: ProfileData = {
  id: "",
  name: "",
  email: "",
  phone: "",
  location: "",
  joinDate: "",
  role: "",
  avatar: null,
  bio: "",
  shopName: "",
  shopAddress: "",
  shopPhone: "",
  businessHours: "",
  specialization: [],
};

const defaultNotifications: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  weeklyReports: true,
  cursorAnimation: true,
};

/* ─── Icons ─── */
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.58 4.9 2 2 0 0 1 3.55 2.73h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 5.69 5.69l1.06-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z" />
  </svg>
);
const IconMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconCamera = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const IconSave = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconBell = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconSettings = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconVerify = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

/* ─── Shared input style ─── */
const inputCls = (disabled: boolean) =>
  `w-full rounded-xl border ${
    disabled
      ? "border-gray-100 dark:border-white/[0.04] bg-gray-50 dark:bg-white/[0.02] text-gray-500 dark:text-white/40 cursor-not-allowed"
      : "border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
  } px-3.5 py-2.5 text-sm outline-none transition`;

/* ─── Field wrapper ─── */
const Field = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30">
      {label}
    </label>
    {icon ? (
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25 pointer-events-none">
          {icon}
        </span>
        <div className="[&>input]:pl-10 [&>textarea]:pl-10">{children}</div>
      </div>
    ) : (
      children
    )}
  </div>
);

/* ─── Toggle ─── */
const Toggle = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors border-none cursor-pointer flex-shrink-0 ${
      value ? "bg-blue-500" : "bg-gray-200 dark:bg-white/10"
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
        value ? "translate-x-4" : "translate-x-0.5"
      }`}
    />
  </button>
);

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [originalProfileData, setOriginalProfileData] = useState<ProfileData>(defaultProfileData);
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);

  const fullName = useAuthStore((state) => state.fullName);
  const email = useAuthStore((state) => state.email);
  const role = useAuthStore((state) => state.role);
  const phone = useAuthStore((state) => state.phone);
  const token = useAuthStore((state) => state.token);
  const shop = useAuthStore((state) => state.shop);

  const hasShop = !!shop;

  const tabs = useMemo(() => {
  const base = [
    { id: "personal", label: "Personal Info", icon: <IconUser /> },
    { id: "preferences", label: "Preferences", icon: <IconBell /> },
    { id: "security", label: "Security", icon: <IconShield /> },
  ];

  // Only show Business & Verification tabs for SHOP_OWNER
  if (hasShop && role === "SHOP_OWNER") {
    base.splice(1, 0, { id: "business", label: "Business", icon: <IconSettings /> });
    base.splice(2, 0, { id: "verification", label: "Verification", icon: <IconVerify /> });
  }

  return base;
}, [hasShop, role]);  // ← Don't forget to add 'role' to dependencies

  useEffect(() => {
    if (!hasShop && (activeTab === "business" || activeTab === "verification")) {
      setActiveTab("personal");
    }
  }, [hasShop, activeTab]);

  const formattedRole = useMemo(() => {
    if (!profileData.role) return "Member";
    return profileData.role.replaceAll("_", " ");
  }, [profileData.role]);

  const initials = useMemo(() => {
    if (!profileData.name?.trim()) return "U";
    const parts = profileData.name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [profileData.name]);

  const normalizeProfile = (data: any): ProfileData => {
    const authShop = data?.shop ?? null;

    const locationParts = [authShop?.area, authShop?.city, authShop?.state].filter(Boolean);

    const fullShopAddress = [
      authShop?.streetAddress,
      authShop?.area,
      authShop?.city,
      authShop?.state,
      authShop?.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      id: data?.id || data?._id || data?.userId || "",
      name: data?.name || data?.fullName || data?.username || fullName || "",
      email: data?.email || email || "",
      phone: data?.phone || data?.phoneNumber || phone || "",
      location: data?.location || data?.address || data?.city || locationParts.join(", ") || "",
      joinDate: data?.joinDate || data?.createdAt || data?.registeredAt || "",
      role: data?.role || role || "",
      avatar: data?.avatar || data?.profileImage || data?.image || null,
      bio: data?.bio || data?.about || authShop?.description || "",

      shopName: data?.shopName || data?.businessName || authShop?.name || "",
      shopAddress: data?.shopAddress || data?.businessAddress || fullShopAddress || "",
      shopPhone: data?.shopPhone || authShop?.phone || "",
      businessHours: data?.businessHours || "",
      specialization: Array.isArray(data?.specialization)
        ? data.specialization
        : Array.isArray(data?.specializations)
        ? data.specializations
        : [],
    };
  };

  useEffect(() => {
    const saved = localStorage.getItem("cursorAnimationEnabled");
    setNotifications((prev) => ({
      ...prev,
      cursorAnimation: saved === null ? true : saved === "true",
    }));
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);

      const local = normalizeProfile({
        fullName,
        email,
        role,
        phoneNumber: phone,
        shop,
      });

      setProfileData(local);
      setOriginalProfileData(local);

      try {
        const res = await fetch("http://localhost:8080/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const result = await res.json();
          const serverData = result?.data || result?.user || result;

          const merged = normalizeProfile({
            ...serverData,
            fullName: serverData?.fullName || local.name,
            email: serverData?.email || local.email,
            role: serverData?.role || local.role,
            phoneNumber: serverData?.phoneNumber || serverData?.phone || local.phone,
            shop: serverData?.shop || shop,
          });

          setProfileData(merged);
          setOriginalProfileData(merged);
        }
      } catch {
        // Keep local auth data if API fails
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [fullName, email, role, phone, shop, token]);

  const handleInput = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotification = (field: keyof NotificationSettings) => {
    setNotifications((prev) => {
      const next = { ...prev, [field]: !prev[field] };
      if (field === "cursorAnimation") {
        localStorage.setItem("cursorAnimationEnabled", String(next.cursorAnimation));
        window.dispatchEvent(new Event("cursor-setting-changed"));
      }
      return next;
    });
  };

  const handleCancel = () => {
    setProfileData(originalProfileData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        ...(hasShop
          ? {
              shopName: profileData.shopName,
              shopAddress: profileData.shopAddress,
              shopPhone: profileData.shopPhone,
              businessHours: profileData.businessHours,
              specialization: profileData.specialization,
            }
          : {}),
      };

      const res = await fetch("http://localhost:8080/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");

      const result = await res.json();
      const normalized = normalizeProfile({
        ...(result?.data || result?.user || payload),
        shop: shop,
      });

      setProfileData(normalized);
      setOriginalProfileData(normalized);
      localStorage.setItem("profile", JSON.stringify(result?.data || result?.user || payload));
      setIsEditing(false);
    } catch {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading profile…" />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] shadow-sm overflow-hidden">
        <div className="relative h-28 sm:h-36 bg-gradient-to-r from-[#0a0f1e] via-blue-950 to-indigo-600">
          <div className="absolute top-3 right-3">
            <button
              onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold border-none cursor-pointer transition shadow-sm ${
                isEditing
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-white/90 hover:bg-white text-gray-700"
              }`}
            >
              {isEditing ? (
                <>
                  <IconX /> Cancel
                </>
              ) : (
                <>
                  <IconEdit /> Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="absolute -bottom-8 left-5 sm:left-7">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-[#0f1829] p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-xl sm:text-2xl font-extrabold text-white">{initials}</span>
                  )}
                </div>
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow border-none cursor-pointer transition">
                <IconCamera />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 sm:pt-14 px-5 sm:px-7 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {profileData.name || "User"}
            </h2>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
              {formattedRole}
            </span>
            {profileData.bio && (
              <p className="mt-2 text-sm text-gray-500 dark:text-white/40 max-w-lg">{profileData.bio}</p>
            )}
          </div>

          <div className="text-sm text-right">
            <div className="text-xs text-gray-400 dark:text-white/30">Member since</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString() : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 dark:border-white/[0.06] px-5 overflow-x-auto">
          <nav className="flex gap-0.5 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all border-none cursor-pointer bg-transparent ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400 border-b-2"
                    : "border-transparent text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60"
                }`}
                style={{
                  borderBottom: activeTab === tab.id ? "2px solid #3b82f6" : "2px solid transparent",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-5 sm:p-7">
          {activeTab === "personal" && (
            <div className="space-y-5">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-2">
                Personal Information
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field label="Full Name" icon={<IconUser />}>
                  <input
                    type="text"
                    value={profileData.name}
                    disabled={!isEditing}
                    onChange={(e) => handleInput("name", e.target.value)}
                    className={inputCls(!isEditing) + " pl-10"}
                  />
                </Field>

                <Field label="Email Address" icon={<IconMail />}>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled={!isEditing}
                    onChange={(e) => handleInput("email", e.target.value)}
                    className={inputCls(!isEditing) + " pl-10"}
                  />
                </Field>

                <Field label="Phone Number" icon={<IconPhone />}>
                  <input
                    type="tel"
                    value={profileData.phone}
                    disabled={!isEditing}
                    onChange={(e) => handleInput("phone", e.target.value)}
                    className={inputCls(!isEditing) + " pl-10"}
                  />
                </Field>

                <Field label="Location" icon={<IconMapPin />}>
                  <input
                    type="text"
                    value={profileData.location}
                    disabled={!isEditing}
                    onChange={(e) => handleInput("location", e.target.value)}
                    className={inputCls(!isEditing) + " pl-10"}
                  />
                </Field>
              </div>

              <Field label="Bio">
                <textarea
                  rows={3}
                  value={profileData.bio}
                  disabled={!isEditing}
                  onChange={(e) => handleInput("bio", e.target.value)}
                  className={inputCls(!isEditing) + " resize-none"}
                />
              </Field>
            </div>
          )}

          {hasShop && activeTab === "business" && (
            <div className="space-y-5">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-2">
                Business Information
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field label="Shop Name">
                  <input
                    type="text"
                    value={profileData.shopName}
                    disabled={!isEditing}
                    onChange={(e) => handleInput("shopName", e.target.value)}
                    className={inputCls(!isEditing)}
                  />
                </Field>

                <Field label="Shop Phone">
                  <input
                    type="text"
                    value={profileData.shopPhone}
                    disabled={!isEditing}
                    onChange={(e) => handleInput("shopPhone", e.target.value)}
                    className={inputCls(!isEditing)}
                  />
                </Field>

                <Field label="Business Hours">
                  <input
                    type="text"
                    value={profileData.businessHours}
                    disabled={!isEditing}
                    onChange={(e) => handleInput("businessHours", e.target.value)}
                    className={inputCls(!isEditing)}
                  />
                </Field>
              </div>

              <Field label="Shop Address">
                <textarea
                  rows={3}
                  value={profileData.shopAddress}
                  disabled={!isEditing}
                  onChange={(e) => handleInput("shopAddress", e.target.value)}
                  className={inputCls(!isEditing) + " resize-none"}
                />
              </Field>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-2">
                  Specializations
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.specialization.length > 0 ? (
                    profileData.specialization.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-white/30">
                      No specialization set.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {hasShop && activeTab === "verification" && (
            <VerificationTab shopId={shop!.id} />
          )}

          {activeTab === "preferences" && (
            <div className="space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">
                Notification Preferences
              </div>

              {(Object.entries(notifications) as [keyof NotificationSettings, boolean][]).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-4 py-3.5"
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-white/80">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    </span>
                    <Toggle value={value} onChange={() => handleNotification(key)} />
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-2">
                Security Settings
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-4 py-4">
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Account Status
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <p className="text-sm text-gray-500 dark:text-white/40">
                    Your account is active and signed in.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-4 py-4">
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Login Sessions
                </div>
                <p className="text-xs text-gray-500 dark:text-white/40 mb-3">
                  Manage your active login sessions
                </p>
                <button className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold px-4 py-2 border-none cursor-pointer hover:bg-red-100 dark:hover:bg-red-500/20 transition">
                  View Sessions
                </button>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/[0.06] flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={handleCancel}
                className="rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-white/50 text-sm font-semibold px-5 py-2.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.08] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 border-none cursor-pointer transition shadow-sm"
              >
                <IconSave />
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;