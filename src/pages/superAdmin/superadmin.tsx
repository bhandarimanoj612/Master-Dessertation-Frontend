import { useEffect, useMemo, useState, useRef } from "react";
import {
  superAdminApi,
  type UserResponse,
  type ShopAdminResponse,
  type ShopDetailsResponse,
  type UpdateUserRequest,
  type CreateShopRequest,
} from "./adminApi";
import { Check, X, AlertCircle, Loader2, ChevronLeft, ChevronRight, Map, MapPin, Navigation, Globe, PenLine } from "lucide-react";
import { PendingVerificationsTab } from "../verification/VerificationTab";

type TabKey = "overview" | "shops" | "users" | "verifications";
type ToastType = "success" | "error" | "info";
type CoordMode = "map" | "manual";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const ROLES = [
  "PLATFORM_ADMIN",
  "SHOP_OWNER",
  "SHOP_STAFF",
  "TECHNICIAN",
  "CUSTOMER",
] as const;

const ITEMS_PER_PAGE = 10;

const emptyUserForm: UpdateUserRequest = {
  fullName: "", email: "", phone: "", role: "CUSTOMER",
};

const roleBadge: Record<string, string> = {
  PLATFORM_ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  SHOP_OWNER: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  SHOP_STAFF: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  TECHNICIAN: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  CUSTOMER: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
};

// ── Map Picker Modal ──────────────────────────────────────────────────────────
function MapPickerModal({
  initialLat,
  initialLng,
  onConfirm,
  onClose,
}: {
  initialLat: string;
  initialLng: string;
  onConfirm: (lat: string, lng: string) => void;
  onClose: () => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [coords, setCoords] = useState({
    lat: initialLat || "27.7172",
    lng: initialLng || "85.3240",
  });
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  // Load Leaflet dynamically
  useEffect(() => {
    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(linkEl);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      if (!mapRef.current) return;
      const L = (window as any).L;
      const lat = parseFloat(coords.lat) || 27.7172;
      const lng = parseFloat(coords.lng) || 85.324;

      const map = L.map(mapRef.current).setView([lat, lng], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:32px;height:32px;background:#1e3a8a;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
      markerRef.current = marker;
      leafletMap.current = map;
      setLoading(false);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setCoords({
          lat: pos.lat.toFixed(6),
          lng: pos.lng.toFixed(6),
        });
      });

      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        setCoords({
          lat: e.latlng.lat.toFixed(6),
          lng: e.latlng.lng.toFixed(6),
        });
      });
    };
    document.head.appendChild(script);

    return () => {
      if (leafletMap.current) leafletMap.current.remove();
    };
  }, []);

  const handleLocateMe = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setCoords({ lat, lng });
        if (leafletMap.current && markerRef.current) {
          leafletMap.current.setView([parseFloat(lat), parseFloat(lng)], 16);
          markerRef.current.setLatLng([parseFloat(lat), parseFloat(lng)]);
        }
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-900 flex items-center justify-center">
              <Map size={17} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">Pin Your Shop Location</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Drag the pin or click anywhere on the map</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-lg font-light"
          >
            ×
          </button>
        </div>

        {/* Map */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
              <div className="text-sm text-slate-500">Loading map…</div>
            </div>
          )}
          <div ref={mapRef} style={{ height: 360, width: "100%" }} />

          {/* Locate Me button overlaid on map */}
          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="absolute top-3 right-3 z-[1000] flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md text-slate-800 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-950 transition"
          >
            <Navigation size={13} className={locating ? "animate-pulse text-blue-900" : "text-blue-900"} />
            {locating ? "Locating…" : "Use my location"}
          </button>
        </div>

        {/* Coords bar + confirm */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-xs font-medium">LAT</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{coords.lat}</span>
            </div>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-xs font-medium">LNG</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{coords.lng}</span>
            </div>
          </div>
          <button
            onClick={() => onConfirm(coords.lat, coords.lng)}
            className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold bg-blue-900 hover:bg-blue-800 text-white transition"
          >
            Confirm location <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Lat/Lng Input with mode toggle ───────────────────────────────────────────
function LatLngSection({
  lat, lng, setLat, setLng,
}: {
  lat: string; lng: string;
  setLat: (v: string) => void;
  setLng: (v: string) => void;
}) {
  const [mode, setMode] = useState<CoordMode>("map");
  const [showMap, setShowMap] = useState(false);

  const hasCoords = lat.trim() && lng.trim();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Shop Location
        </label>
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setMode("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold transition ${mode === "map" ? "bg-blue-900 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <Map size={11} /> Map
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold transition ${mode === "manual" ? "bg-blue-900 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <PenLine size={11} /> Manual
          </button>
        </div>
      </div>

      {mode === "map" ? (
        <button
          type="button"
          onClick={() => setShowMap(true)}
          className={`w-full rounded-2xl border transition flex items-center gap-3 px-4 py-3.5 text-sm ${
            hasCoords
              ? "border-blue-900/30 bg-blue-900/5 dark:bg-blue-900/10"
              : "border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-900/40 hover:bg-slate-50 dark:hover:bg-slate-900"
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${hasCoords ? "bg-blue-900" : "bg-slate-100 dark:bg-slate-800"}`}>
            <MapPin size={15} className={hasCoords ? "text-white" : "text-slate-500"} />
          </div>
          {hasCoords ? (
            <div className="text-left">
              <div className="font-semibold text-slate-900 dark:text-white text-xs">Location pinned</div>
              <div className="font-mono text-slate-500 dark:text-slate-400 text-xs mt-0.5">{lat}, {lng}</div>
            </div>
          ) : (
            <div className="text-left">
              <div className="font-semibold text-slate-700 dark:text-slate-300 text-xs">Click to pin on map</div>
              <div className="text-slate-400 text-xs mt-0.5">Drag or click to set exact coordinates</div>
            </div>
          )}
          {hasCoords && (
            <span className="ml-auto text-xs text-blue-900 dark:text-blue-400 font-semibold">Edit →</span>
          )}
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <SmallField label="Latitude" value={lat} placeholder="27.7172" onChange={setLat} icon={<Globe size={14} className="text-slate-400" />} />
          <SmallField label="Longitude" value={lng} placeholder="85.3240" onChange={setLng} icon={<Globe size={14} className="text-slate-400" />} />
        </div>
      )}

      {showMap && (
        <MapPickerModal
          initialLat={lat}
          initialLng={lng}
          onConfirm={(la, ln) => {
            setLat(la);
            setLng(ln);
            setShowMap(false);
          }}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}

// ── Small field for compact pairs ─────────────────────────────────────────────
function SmallField({ label, value, placeholder, onChange, icon }: {
  label: string; value: string; placeholder?: string;
  onChange: (v: string) => void; icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-3 py-2.5">
        {icon}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

// ── Toast Component ──────────────────────────────────────────────────────────
const Toast = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
    error: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  }[toast.type];

  const textColor = {
    success: "text-green-700 dark:text-green-300",
    error: "text-red-700 dark:text-red-300",
    info: "text-blue-700 dark:text-blue-300",
  }[toast.type];

  const Icon = {
    success: Check,
    error: X,
    info: AlertCircle,
  }[toast.type];

  return (
    <div
      className={`rounded-xl border ${bgColor} ${textColor} px-4 py-3 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top duration-300`}
    >
      <Icon size={20} />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-current opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  );
};

// ── Toast Container ──────────────────────────────────────────────────────────
const ToastContainer = ({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) => (
  <div className="fixed top-4 right-4 z-40 space-y-3 max-w-sm">
    {toasts.map((toast) => (
      <Toast
        key={toast.id}
        toast={toast}
        onClose={() => onClose(toast.id)}
      />
    ))}
  </div>
);

// ── Sub-components ────────────────────────────────────────────────────────────

type StatCardProps = { title: string; value: number; color?: string };
const StatCard = ({ title, value, color = "text-slate-900 dark:text-white" }: StatCardProps) => (
  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 hover:shadow-md transition-shadow">
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
    <h3 className={`mt-3 text-4xl font-bold ${color}`}>{value.toLocaleString()}</h3>
  </div>
);

type InputProps = { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string };
const Input = ({ label, value, onChange, type = "text", placeholder }: InputProps) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-900"
    />
  </label>
);

type ModalProps = { title: string; onClose: () => void; children: React.ReactNode; size?: "sm" | "md" | "lg" };
const Modal = ({ title, onClose, children, size = "md" }: ModalProps) => {
  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className={`w-full ${sizeClass} rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ── Pagination Component ──────────────────────────────────────────────────────
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let page = i + 1;
          if (totalPages > 5) {
            if (currentPage > 3) {
              page = currentPage - 2 + i;
            }
            if (page > totalPages) return null;
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [shops, setShops] = useState<ShopAdminResponse[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingShops, setLoadingShops] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [userSearch, setUserSearch] = useState("");
  const [shopSearch, setShopSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [shopPage, setShopPage] = useState(1);

  // Modals
  const [pwdModal, setPwdModal] = useState(false);
  const [pwdUserId, setPwdUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const [editUserModal, setEditUserModal] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUserForm, setEditUserForm] = useState<UpdateUserRequest>(emptyUserForm);

  const [editShopModal, setEditShopModal] = useState(false);
  const [editingShop, setEditingShop] = useState<ShopDetailsResponse | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [loadingShopDetails, setLoadingShopDetails] = useState(false);

  const stats = useMemo(() => ({
    platformAdmins: users.filter(u => u.role === "PLATFORM_ADMIN").length,
    owners: users.filter(u => u.role === "SHOP_OWNER").length,
    staff: users.filter(u => u.role === "SHOP_STAFF").length,
    technicians: users.filter(u => u.role === "TECHNICIAN").length,
    customers: users.filter(u => u.role === "CUSTOMER").length,
    activeUsers: users.filter(u => u.isActive).length,
    activeShops: shops.filter(s => s.isActive).length,
    verifiedShops: shops.filter(s => s.verified).length,
  }), [users, shops]);

  const filteredUsers = useMemo(() =>
    users.filter(u =>
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
    ), [users, userSearch]);

  const filteredShops = useMemo(() =>
    shops.filter(s =>
      s.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
      (s.city ?? "").toLowerCase().includes(shopSearch.toLowerCase())
    ), [shops, shopSearch]);

  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, userPage]);

  const paginatedShops = useMemo(() => {
    const start = (shopPage - 1) * ITEMS_PER_PAGE;
    return filteredShops.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredShops, shopPage]);

  const userPageCount = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const shopPageCount = Math.ceil(filteredShops.length / ITEMS_PER_PAGE);

  const addToast = (message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      setUsers(await superAdminApi.getAllUsers());
      setUserPage(1);
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to load users", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadShops = async () => {
    try {
      setLoadingShops(true);
      setShops(await superAdminApi.getAllShops());
      setShopPage(1);
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to load shops", "error");
    } finally {
      setLoadingShops(false);
    }
  };

  const loadAll = async () => {
    await Promise.all([loadUsers(), loadShops()]);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ── User actions ──────────────────────────────────────────────────────────

  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`Permanently delete user "${name}"?`)) return;
    try {
      setSaving(true);
      await superAdminApi.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      addToast(`User "${name}" deleted successfully`, "success");
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to delete user", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleUser = async (id: number, name: string, isActive: boolean) => {
    try {
      setSaving(true);
      await superAdminApi.toggleUserActive(id);
      setUsers(prev =>
        prev.map(u =>
          u.id === id ? { ...u, isActive: !u.isActive } : u
        )
      );
      addToast(`${name} ${!isActive ? "activated" : "deactivated"}`, "success");
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to update status", "error");
    } finally {
      setSaving(false);
    }
  };

  const openEditUser = (user: UserResponse) => {
    setEditUserId(user.id);
    setEditUserForm({ fullName: user.fullName, email: user.email, phone: user.phone, role: user.role });
    setEditUserModal(true);
  };

  const handleEditUserSave = async () => {
    if (!editUserId) return;
    try {
      setSaving(true);
      const updated = await superAdminApi.updateUser(editUserId, editUserForm);
      setUsers(prev => prev.map(u => u.id === editUserId ? updated : u));
      setEditUserModal(false);
      addToast("User updated successfully", "success");
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to update user", "error");
    } finally {
      setSaving(false);
    }
  };

  const openPwdModal = (id: number) => {
    setPwdUserId(id);
    setNewPassword("");
    setPwdModal(true);
  };

  const handlePasswordSave = async () => {
    if (!pwdUserId || !newPassword.trim()) return;
    try {
      setSaving(true);
      await superAdminApi.changeUserPassword(pwdUserId, newPassword);
      setPwdModal(false);
      addToast("Password changed successfully", "success");
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to change password", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Shop actions ──────────────────────────────────────────────────────────

  const handleDeleteShop = async (id: number, name: string) => {
    if (!confirm(`Permanently delete shop "${name}" and all its data?`)) return;
    try {
      setSaving(true);
      await superAdminApi.deleteShop(id);
      setShops(prev => prev.filter(s => s.id !== id));
      addToast(`Shop "${name}" deleted successfully`, "success");
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to delete shop", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleShopActive = async (id: number, name: string, isActive: boolean) => {
    try {
      setSaving(true);
      await superAdminApi.toggleShopActive(id);
      setShops(prev =>
        prev.map(s =>
          s.id === id ? { ...s, isActive: !s.isActive } : s
        )
      );
      addToast(`${name} ${!isActive ? "activated" : "deactivated"}`, "success");
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to update shop", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleShopVerified = async (id: number, name: string, verified: boolean) => {
    try {
      setSaving(true);
      await superAdminApi.toggleShopVerified(id);
      setShops(prev =>
        prev.map(s =>
          s.id === id ? { ...s, verified: !s.verified } : s
        )
      );
      addToast(`${name} ${!verified ? "verified" : "unverified"}`, "success");
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to update verification", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEditShopClick = async (shopId: number) => {
    try {
      setLoadingShopDetails(true);
      const data = await superAdminApi.getShopById(shopId);
      setSelectedShopId(shopId);
      setEditingShop(data);
      setEditShopModal(true);
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to load shop details", "error");
    } finally {
      setLoadingShopDetails(false);
    }
  };

  const closeShopModal = () => {
    setEditShopModal(false);
    setEditingShop(null);
    setSelectedShopId(null);
  };

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShopId || !editingShop) return;

    try {
      setSaving(true);

      const payload: CreateShopRequest = {
        name: editingShop.name || "",
        streetAddress: editingShop.streetAddress || "",
        area: editingShop.area || "",
        city: editingShop.city || "",
        state: editingShop.state || "",
        postalCode: editingShop.postalCode || "",
        phone: editingShop.phone || "",
        description: editingShop.description || "",
        lat: editingShop.lat,
        lng: editingShop.lng,
      };

      await superAdminApi.updateShop(selectedShopId, payload);
      closeShopModal();
      await loadShops();
      addToast("Shop updated successfully", "success");
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to update shop", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Platform Admin</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Manage all users and shops across the platform
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadAll}
              disabled={loadingUsers || loadingShops}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loadingUsers || loadingShops ? <Loader2 size={16} className="animate-spin" /> : null}
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          {(["overview", "shops", "users", "verifications"] as TabKey[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab}
              {tab === "users" && ` (${users.length})`}
              {tab === "shops" && ` (${shops.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value={users.length} color="text-blue-600" />
          <StatCard title="Active Users" value={stats.activeUsers} color="text-green-600" />
          <StatCard title="Total Shops" value={shops.length} color="text-purple-600" />
          <StatCard title="Verified Shops" value={stats.verifiedShops} color="text-amber-600" />
          <StatCard title="Active Shops" value={stats.activeShops} color="text-emerald-600" />
          <StatCard title="Platform Admins" value={stats.platformAdmins} color="text-indigo-600" />
          <StatCard title="Shop Owners" value={stats.owners} color="text-pink-600" />
          <StatCard title="Shop Staff" value={stats.staff} color="text-cyan-600" />
          <StatCard title="Technicians" value={stats.technicians} color="text-orange-600" />
          <StatCard title="Customers" value={stats.customers} color="text-red-600" />
        </div>
      )}

      {/* ── SHOPS TAB ── */}
      {activeTab === "shops" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Shops</h2>
            {loadingShops && <Loader2 className="animate-spin text-blue-600" size={24} />}
          </div>

          <input
            className="mb-6 w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-900"
            placeholder="Search by name or city..."
            value={shopSearch}
            onChange={e => {
              setShopSearch(e.target.value);
              setShopPage(1);
            }}
          />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">City</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Verified</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {paginatedShops.map(shop => (
                  <tr key={shop.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{shop.id}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">{shop.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{shop.city || "—"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{shop.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        shop.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}>
                        {shop.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        shop.verified
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {shop.verified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(shop.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleEditShopClick(shop.id)}
                          disabled={loadingShopDetails || saving}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleShopVerified(shop.id, shop.name, shop.verified)}
                          disabled={saving}
                          className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-50 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800 transition-colors"
                        >
                          {shop.verified ? "Unverify" : "Verify"}
                        </button>
                        <button
                          onClick={() => handleToggleShopActive(shop.id, shop.name, shop.isActive)}
                          disabled={saving}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                            shop.isActive
                              ? "bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-300 dark:hover:bg-orange-800"
                              : "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                          }`}
                        >
                          {shop.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteShop(shop.id, shop.name)}
                          disabled={saving}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loadingShops && filteredShops.length === 0 && (
              <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">No shops found.</p>
            )}
          </div>

          <Pagination
            currentPage={shopPage}
            totalPages={shopPageCount}
            onPageChange={setShopPage}
          />
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === "users" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Users</h2>
            {loadingUsers && <Loader2 className="animate-spin text-blue-600" size={24} />}
          </div>

          <input
            className="mb-6 w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-900"
            placeholder="Search by name, email or role..."
            value={userSearch}
            onChange={e => {
              setUserSearch(e.target.value);
              setUserPage(1);
            }}
          />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{user.id}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">{user.fullName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{user.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleBadge[user.role] ?? roleBadge.CUSTOMER}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => openEditUser(user)}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openPwdModal(user.id)}
                          className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800 transition-colors"
                        >
                          Pwd
                        </button>
                        <button
                          onClick={() => handleToggleUser(user.id, user.fullName, user.isActive)}
                          disabled={saving}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                            user.isActive
                              ? "bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-300 dark:hover:bg-orange-800"
                              : "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                          }`}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.fullName)}
                          disabled={saving}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loadingUsers && filteredUsers.length === 0 && (
              <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">No users found.</p>
            )}
          </div>

          <Pagination
            currentPage={userPage}
            totalPages={userPageCount}
            onPageChange={setUserPage}
          />
        </div>
      )}

      {/* ── VERIFICATIONS TAB ── */}
      {activeTab === "verifications" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <PendingVerificationsTab />
        </div>
      )}

      {/* ── EDIT USER MODAL ── */}
      {editUserModal && (
        <Modal title="Edit User" onClose={() => setEditUserModal(false)}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={editUserForm.fullName}
              onChange={v => setEditUserForm(p => ({ ...p, fullName: v }))}
            />
            <Input
              label="Email"
              value={editUserForm.email}
              onChange={v => setEditUserForm(p => ({ ...p, email: v }))}
            />
            <Input
              label="Phone"
              value={editUserForm.phone}
              onChange={v => setEditUserForm(p => ({ ...p, phone: v }))}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Role</span>
              <select
                value={editUserForm.role}
                onChange={e => setEditUserForm(p => ({ ...p, role: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-900"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setEditUserModal(false)}
              className="rounded-lg px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditUserSave}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── CHANGE PASSWORD MODAL ── */}
      {pwdModal && (
        <Modal title="Change Password" onClose={() => setPwdModal(false)}>
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Enter new password"
          />
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setPwdModal(false)}
              className="rounded-lg px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordSave}
              disabled={saving || !newPassword.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── EDIT SHOP MODAL ── */}
      {editShopModal && editingShop && (
        <Modal title={`Edit Shop: ${editingShop.name}`} onClose={closeShopModal} size="lg">
          {loadingShopDetails ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <form onSubmit={handleUpdateShop} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Basic Information</h3>
                <Input
                  label="Shop Name"
                  value={editingShop.name || ""}
                  onChange={v => setEditingShop(prev => prev ? { ...prev, name: v } : prev)}
                  placeholder="Enter shop name"
                />
                <Input
                  label="Phone"
                  value={editingShop.phone || ""}
                  onChange={v => setEditingShop(prev => prev ? { ...prev, phone: v } : prev)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Address</h3>
                <Input
                  label="Street Address"
                  value={editingShop.streetAddress || ""}
                  onChange={v => setEditingShop(prev => prev ? { ...prev, streetAddress: v } : prev)}
                  placeholder="Enter street address"
                />
                <Input
                  label="Area"
                  value={editingShop.area || ""}
                  onChange={v => setEditingShop(prev => prev ? { ...prev, area: v } : prev)}
                  placeholder="Enter area"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={editingShop.city || ""}
                    onChange={v => setEditingShop(prev => prev ? { ...prev, city: v } : prev)}
                    placeholder="Enter city"
                  />
                  <Input
                    label="State"
                    value={editingShop.state || ""}
                    onChange={v => setEditingShop(prev => prev ? { ...prev, state: v } : prev)}
                    placeholder="Enter state"
                  />
                </div>
                <Input
                  label="Postal Code"
                  value={editingShop.postalCode || ""}
                  onChange={v => setEditingShop(prev => prev ? { ...prev, postalCode: v } : prev)}
                  placeholder="Enter postal code"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Location Coordinates</h3>
                <LatLngSection 
                  lat={editingShop.lat?.toString() ?? ""}
                  lng={editingShop.lng?.toString() ?? ""}
                  setLat={v => setEditingShop(prev => prev ? { ...prev, lat: v === "" ? null : Number(v) } : prev)}
                  setLng={v => setEditingShop(prev => prev ? { ...prev, lng: v === "" ? null : Number(v) } : prev)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Description</h3>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Shop Description</span>
                  <textarea
                    value={editingShop.description || ""}
                    onChange={e => setEditingShop(prev => prev ? { ...prev, description: e.target.value } : prev)}
                    placeholder="Enter shop description"
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving..." : "Update Shop"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    closeShopModal();
                    handleToggleShopActive(editingShop.id, editingShop.name, editingShop.isActive);
                  }}
                  className={`rounded-lg px-6 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                    editingShop.isActive ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {editingShop.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    closeShopModal();
                    handleToggleShopVerified(editingShop.id, editingShop.name, editingShop.verified);
                  }}
                  className="rounded-lg bg-amber-500 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {editingShop.verified ? "Unverify" : "Verify"}
                </button>
                <button
                  type="button"
                  onClick={closeShopModal}
                  className="rounded-lg bg-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default SuperAdmin;