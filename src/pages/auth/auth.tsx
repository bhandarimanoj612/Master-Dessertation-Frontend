import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  Lock,
  User2,
  Store,
  MapPin,
  Navigation,
  Map,
  PenLine,
  ChevronRight,
  Phone,
  FileText,
  Hash,
  
  Globe,
} from "lucide-react";

import Logo from "../../global/layout/appbar-component/logo";
import { authService } from "./services/auth.service";
import { useAuthStore } from "./store/store";
import { useAuthUIStore, getApiMessage } from "./store/auth.ui.store";
import { useToast } from "../../global/hooks/useToast";
import { getDefaultRouteByRole } from "./services/auth.redirect";

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
      <div className="w-full max-w-2xl rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-900 flex items-center justify-center">
              <Map size={17} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-neutral-900 dark:text-white text-sm">Pin Your Shop Location</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Drag the pin or click anywhere on the map</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-lg font-light"
          >
            ×
          </button>
        </div>

        {/* Map */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
              <div className="text-sm text-neutral-500">Loading map…</div>
            </div>
          )}
          <div ref={mapRef} style={{ height: 360, width: "100%" }} />

          {/* Locate Me button overlaid on map */}
          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="absolute top-3 right-3 z-[1000] flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-md text-neutral-800 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-950 transition"
          >
            <Navigation size={13} className={locating ? "animate-pulse text-blue-900" : "text-blue-900"} />
            {locating ? "Locating…" : "Use my location"}
          </button>
        </div>

        {/* Coords bar + confirm */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 text-xs font-medium">LAT</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">{coords.lat}</span>
            </div>
            <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 text-xs font-medium">LNG</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">{coords.lng}</span>
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

// ── Reverse geocode helper ────────────────────────────────────────────────────
async function reverseGeocode(lat: string, lng: string): Promise<Record<string, string>> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return { ...(data.address ?? {}), display_name: data.display_name ?? "" };
  } catch (e) {
    console.error("Reverse geocode failed:", e);
    return {};
  }
}

// ── Lat/Lng Input with mode toggle ───────────────────────────────────────────
type CoordMode = "map" | "manual";

function LatLngSection({
  lat, lng, setLat, setLng, mode, setMode, onMapConfirm,
}: {
  lat: string; lng: string;
  setLat: (v: string) => void;
  setLng: (v: string) => void;
  mode: CoordMode;
  setMode: (m: CoordMode) => void;
  onMapConfirm: (lat: string, lng: string) => void;
}) {
  const [showMap, setShowMap] = useState(false);

  const hasCoords = lat.trim() && lng.trim();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Shop Location
        </label>
        <div className="flex rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setMode("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold transition ${mode === "map" ? "bg-blue-900 text-white" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"}`}
          >
            <Map size={11} /> Map
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold transition ${mode === "manual" ? "bg-blue-900 text-white" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"}`}
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
              : "border-dashed border-neutral-300 dark:border-neutral-700 hover:border-blue-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${hasCoords ? "bg-blue-900" : "bg-neutral-100 dark:bg-neutral-800"}`}>
            <MapPin size={15} className={hasCoords ? "text-white" : "text-neutral-500"} />
          </div>
          {hasCoords ? (
            <div className="text-left">
              <div className="font-semibold text-neutral-900 dark:text-white text-xs">Location pinned</div>
              <div className="font-mono text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">{lat}, {lng}</div>
            </div>
          ) : (
            <div className="text-left">
              <div className="font-semibold text-neutral-700 dark:text-neutral-300 text-xs">Click to pin on map</div>
              <div className="text-neutral-400 text-xs mt-0.5">Drag or click to set exact coordinates</div>
            </div>
          )}
          {hasCoords && (
            <span className="ml-auto text-xs text-blue-900 dark:text-blue-400 font-semibold">Edit →</span>
          )}
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <SmallField label="Latitude" value={lat} placeholder="27.7172" onChange={setLat} icon={<Globe size={14} className="text-neutral-400" />} />
          <SmallField label="Longitude" value={lng} placeholder="85.3240" onChange={setLng} icon={<Globe size={14} className="text-neutral-400" />} />
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
            onMapConfirm(la, ln);
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
      <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{label}</label>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900/60 px-3 py-2.5">
        {icon}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-800" />
      <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
        {children}
      </span>
      <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
}

// ── Main Field ────────────────────────────────────────────────────────────────
function Field({
  label, value, placeholder, onChange, icon, type = "text",
}: {
  label: string; value: string; placeholder?: string;
  onChange: (v: string) => void; icon?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {label}
      </label>
      <div className="mt-1.5 flex items-center gap-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 px-4 py-3 focus-within:border-blue-900/50 dark:focus-within:border-blue-700/50 transition">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          className="w-full bg-transparent outline-none text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
}

// ── Auth Page ─────────────────────────────────────────────────────────────────
export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    mode, audience, fullName, phone,
    shopName, shopAddress, shopPhone,
    ownerFullName, ownerPhone,
    email, password, showPass, loading,
    area, city, state, postalCode, description, lat, lng,
    setMode, setAudience, setFullName, setPhone,
    setShopName, setShopAddress, setShopPhone,
    setOwnerFullName, setOwnerPhone,
    setEmail, setPassword, toggleShowPass,
    setLoading, resetForm,
    setArea, setCity, setState, setPostalCode,
    setDescription, setLat, setLng,
  } = useAuthUIStore();

  const toast = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const asParam = params.get("as");
    if (asParam === "customer" || asParam === "shop") setAudience(asParam);
  }, [location.search, setAudience]);

  const headerCopy = useMemo(() => {
    if (audience === "customer") {
      return {
        title: mode === "login" ? "Customer Login" : "Create Account",
        subtitle: mode === "login"
          ? "Track your repairs, status updates, and history."
          : "Sign up to request repairs and track progress.",
      };
    }
    return {
      title: mode === "login" ? "Shop Login" : "Register Your Shop",
      subtitle: mode === "login"
        ? "Manage repairs, technicians, customers and billing."
        : "Set up your shop profile and owner account.",
    };
  }, [audience, mode]);

  const [coordMode, setCoordMode] = useState<"map" | "manual">("map");

  const isShopSignup = mode === "signup" && audience === "shop";
  const isCustomerSignup = mode === "signup" && audience === "customer";

  const validateLogin = () => {
    if (!email.trim()) return "Email is required.";
    if (!password.trim()) return "Password is required.";
    return "";
  };

  const validateCustomerSignup = () => {
    if (!fullName.trim()) return "Full name is required.";
    if (!phone.trim()) return "Phone is required.";
    if (!email.trim()) return "Email is required.";
    if (!password.trim()) return "Password is required.";
    return "";
  };

  const validateShopSignup = () => {
    if (!shopName.trim()) return "Shop name is required.";
    if (!shopAddress.trim()) return "Shop street address is required.";
    if (coordMode === "manual") {
      if (!area.trim()) return "Area is required.";
      if (!city.trim()) return "City is required.";
      if (!state.trim()) return "State is required.";
      if (!postalCode.trim()) return "Postal code is required.";
    }
    if (!shopPhone.trim()) return "Shop phone is required.";
    if (!lat.trim()) return "Latitude is required.";
    if (!lng.trim()) return "Longitude is required.";
    if (!ownerFullName.trim()) return "Owner full name is required.";
    if (!ownerPhone.trim()) return "Owner phone is required.";
    if (!email.trim()) return "Owner email is required.";
    if (!password.trim()) return "Owner password is required.";
    if (Number.isNaN(Number(lat))) return "Latitude must be a valid number.";
    if (Number.isNaN(Number(lng))) return "Longitude must be a valid number.";
    return "";
  };

  const handleLogin = async () => {
    const err = validateLogin();
    if (err) { toast.warning(err); return; }
    setLoading(true);
    try {
      const data = await authService.login({ email: email.trim(), password });
      setAuth(data);
      const redirect = new URLSearchParams(location.search).get("redirect");
      navigate(redirect || getDefaultRouteByRole(data.role), { replace: true });
    } catch (err: any) {
      toast.error(getApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    const validationError = audience === "customer" ? validateCustomerSignup() : validateShopSignup();
    if (validationError) { toast.warning(validationError); return; }
    setLoading(true);
    try {
      if (audience === "customer") {
        await authService.registerCustomer({ fullName: fullName.trim(), email: email.trim(), password, phone: phone.trim() });
        const loginData = await authService.login({ email: email.trim(), password });
        setAuth(loginData);
        resetForm();
        navigate(getDefaultRouteByRole(loginData.role), { replace: true });
        return;
      }
      const shopAuth = await authService.registerShop({
        shopName: shopName.trim(), shopStreetAddress: shopAddress.trim(),
        area: area.trim(), city: city.trim(), state: state.trim(),
        postalCode: postalCode.trim(), shopPhone: shopPhone.trim(),
        description: description.trim(), lat: Number(lat), lng: Number(lng),
        ownerFullName: ownerFullName.trim(), ownerEmail: email.trim(),
        ownerPassword: password, ownerPhone: ownerPhone.trim(),
      });
      setAuth(shopAuth);
      resetForm();
      navigate(getDefaultRouteByRole(shopAuth.role), { replace: true });
    } catch (err: any) {
      toast.error(getApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Subtle background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-900/8 blur-[140px] dark:bg-blue-500/8" />
        <div className="absolute bottom-[-160px] right-[-100px] h-[500px] w-[500px] rounded-full bg-blue-900/5 blur-[120px] dark:bg-white/3" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div
            data-cursor="true"
            className="flex items-center gap-3 select-none cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Logo size={38} rounded={true} />
            <div>
              <div className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">Sajilo Tayaar</div>
              <div className="text-xs text-neutral-400 dark:text-neutral-500">Repair Shop Platform</div>
            </div>
          </div>
          <button
            data-cursor="true"
            className="rounded-xl px-4 py-2 text-sm font-semibold border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
            onClick={() => navigate("/")}
            type="button"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 items-start">

          {/* Left panel */}
          <div className="hidden lg:block rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950/50 p-8 sticky top-24">
            <div className="flex items-center gap-3">
              <Logo size={44} rounded={true} />
              <div>
                <div className="text-lg font-extrabold text-neutral-900 dark:text-white">Welcome</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">Choose who you are</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {(["shop", "customer"] as const).map((type) => (
                <button
                  key={type}
                  data-cursor="true"
                  type="button"
                  onClick={() => {
                    setAudience(type);
                    navigate(`/auth?as=${type}`);
                  }}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold border transition flex items-center justify-center gap-2 ${
                    audience === type
                      ? "bg-blue-900 text-white border-blue-900 shadow-lg shadow-blue-900/20"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  }`}
                >
                  {type === "shop" ? <Store size={15} /> : <User2 size={15} />}
                  {type === "shop" ? "Shop" : "Customer"}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white leading-tight">
                {audience === "shop" ? "For Repair Shops" : "For Customers"}
              </h2>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {audience === "shop"
                  ? "Register your shop and manage repairs, staff, technicians, billing and customers from one dashboard."
                  : "Send repair requests, track status updates, and view your repair history easily."}
              </p>

              <div className="mt-6 space-y-2.5">
                {[
                  ["Simple", "Easy interface for anyone"],
                  ["Private", "Your data stays protected"],
                  ...(audience === "shop" ? [["Instant", "Go live right away"]] : []),
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-center gap-3 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/80 dark:bg-neutral-900/40 px-4 py-3">
                    <div className="w-2 h-2 rounded-full bg-blue-900 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">{title}</span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400"> — {desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950/50 overflow-hidden w-full">
            {/* Form header */}
            <div className="flex items-start justify-between gap-4 px-8 pt-8 pb-6 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">{headerCopy.title}</div>
                <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{headerCopy.subtitle}</div>
              </div>
              <div className="flex rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex-shrink-0">
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    data-cursor="true"
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold transition ${
                      mode === m
                        ? "bg-blue-900 text-white"
                        : "bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    }`}
                    onClick={() => { setMode(m); }}
                  >
                    {m === "login" ? "Login" : "Sign up"}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-8 py-7">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  mode === "login" ? handleLogin() : handleSignup();
                }}
              >
                {/* Customer signup fields */}
                {isCustomerSignup && (
                  <>
                    <SectionLabel>Personal Details</SectionLabel>
                    <Field label="Full name" icon={<User2 size={16} className="text-neutral-400" />} value={fullName} placeholder="Your full name" onChange={setFullName} />
                    <Field label="Phone" icon={<Phone size={16} className="text-neutral-400" />} value={phone} placeholder="98xxxxxxxx" onChange={setPhone} />
                  </>
                )}

                {/* Shop signup fields */}
                {isShopSignup && (
                  <>
                    <SectionLabel>Shop Info</SectionLabel>

                    <Field label="Shop name" icon={<Store size={16} className="text-neutral-400" />} value={shopName} placeholder="EverestFixIt" onChange={setShopName} />
                    <Field label="Description" icon={<FileText size={16} className="text-neutral-400" />} value={description} placeholder="We repair phones, laptops, and accessories." onChange={setDescription} />
                    <Field label="Phone" icon={<Phone size={16} className="text-neutral-400" />} value={shopPhone} placeholder="98xxxxxxxx" onChange={setShopPhone} />

                    <SectionLabel>Location Coordinates</SectionLabel>
                    <LatLngSection
                      lat={lat}
                      lng={lng}
                      setLat={setLat}
                      setLng={setLng}
                      mode={coordMode}
                      setMode={setCoordMode}
                      onMapConfirm={async (la, ln) => {
                        const addr = await reverseGeocode(la, ln);
                        const resolvedArea =
                          addr.suburb || addr.neighbourhood || addr.quarter || addr.village || addr.town || "";
                        const resolvedCity =
                          addr.city || addr.town || addr.village || addr.county || "";
                        const resolvedState =
                          addr.state || addr.state_district || "";
                        const resolvedPostal = addr.postcode || "";
                        const resolvedStreet = (() => {
                          if (!addr.road) return addr.display_name || "";
                          const suffix = addr.suburb || addr.neighbourhood;
                          return suffix ? `${addr.road}, ${suffix}` : addr.road;
                        })();
                        if (resolvedArea) setArea(resolvedArea);
                        if (resolvedCity) setCity(resolvedCity);
                        if (resolvedState) setState(resolvedState);
                        if (resolvedPostal) setPostalCode(resolvedPostal);
                        if (resolvedStreet) setShopAddress(resolvedStreet);
                      }}
                    />

                    <SectionLabel>Address</SectionLabel>

                    <Field label="Street address" icon={<MapPin size={16} className="text-neutral-400" />} value={shopAddress} placeholder="Itahari-6, Sunsari" onChange={setShopAddress} />

                    {coordMode === "manual" && (
                      <div className="grid grid-cols-2 gap-3">
                        <SmallField label="Area" value={area} placeholder="Itahari-6" onChange={setArea} />
                        <SmallField label="City" value={city} placeholder="Sunsari" onChange={setCity} />
                        <SmallField label="State" value={state} placeholder="Koshi" onChange={setState} />
                        <SmallField label="Postal code" icon={<Hash size={14} className="text-neutral-400" />} value={postalCode} placeholder="56705" onChange={setPostalCode} />
                      </div>
                    )}

                    <SectionLabel>Owner Details</SectionLabel>
                    <Field label="Owner full name" icon={<User2 size={16} className="text-neutral-400" />} value={ownerFullName} placeholder="Owner name" onChange={setOwnerFullName} />
                    <Field label="Owner phone" icon={<Phone size={16} className="text-neutral-400" />} value={ownerPhone} placeholder="98xxxxxxxx" onChange={setOwnerPhone} />

                    <SectionLabel>Account Credentials</SectionLabel>
                  </>
                )}

                {/* Shared email/password */}
                <Field
                  label={audience === "shop" && mode === "signup" ? "Owner email" : "Email"}
                  icon={<Mail size={16} className="text-neutral-400" />}
                  value={email}
                  placeholder="you@example.com"
                  onChange={setEmail}
                  type="email"
                />

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Password</label>
                  <div className="mt-1.5 flex items-center gap-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 px-4 py-3 focus-within:border-blue-900/50 dark:focus-within:border-blue-700/50 transition">
                    <Lock size={16} className="text-neutral-400 flex-shrink-0" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-transparent outline-none text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400"
                    />
                    <button
                      data-cursor="true"
                      type="button"
                      onClick={toggleShowPass}
                      className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition flex-shrink-0"
                      aria-label="Toggle password visibility"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    data-cursor="true"
                    disabled={loading}
                    type="submit"
                    className={`w-full rounded-2xl px-6 py-3.5 font-semibold text-white transition flex items-center justify-center gap-2 text-sm ${
                      loading ? "bg-blue-900/60 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800 shadow-lg shadow-blue-900/25"
                    }`}
                  >
                    {loading
                      ? "Please wait…"
                      : mode === "login"
                        ? "Login"
                        : audience === "shop"
                          ? "Create shop account"
                          : "Create account"}
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </div>

                <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 pt-1">
                  {mode === "login" ? (
                    <>Don't have an account?{" "}
                      <button data-cursor="true" className="font-semibold text-blue-900 dark:text-blue-400 hover:underline" onClick={() => { setMode("signup"); }} type="button">
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>Already have an account?
                      <button data-cursor="true" className="font-semibold text-blue-900 dark:text-blue-400 hover:underline" onClick={() => { setMode("login"); }} type="button">
                        Login
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200/60 dark:border-neutral-800 mt-10">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-neutral-400 dark:text-neutral-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Sajilo Tayaar</span>
          <span>Private · Simple · Secure</span>
        </div>
      </footer>
    </div>
  );
}