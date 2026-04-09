import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Circle, MapContainer, Marker, Popup, TileLayer, useMap,
} from "react-leaflet";
import L from "leaflet";
import { useShopsStore } from "./store/shops.store";
import { defaultMarkerIcon } from "./utils/leafletIcons";
import "./shops.leaflet.css";
import {
  MapPin, Search, Navigation, List, Map as MapIcon,
  ArrowRight, Star, Phone, ShieldCheck, ChevronLeft,
  ChevronRight, Wrench, SlidersHorizontal, X, Loader2,
  CheckCircle2, LocateFixed,
} from "lucide-react";

type ViewMode = "list" | "map";
type LatLngTuple = [number, number];

type ShopLike = {
  id: number;
  name: string;
  address?: string | null;
  phone?: string | null;
  rating?: number | string | null;
  distanceKm?: number | null;
  lat?: number | null;
  lng?: number | null;
  imageUrl?: string | null;
  verified?: boolean;
  services?: string[] | null;
};

const ITEMS_PER_PAGE = 6;
const FALLBACK_CENTER: LatLngTuple = [27.7172, 85.324];

function getShopInitials(name?: string | null) {
  if (!name?.trim()) return "SH";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
const GRADIENTS = [
  "from-blue-700 via-blue-600 to-indigo-500",
  "from-indigo-700 via-violet-600 to-purple-500",
  "from-sky-600 via-cyan-500 to-teal-500",
  "from-emerald-600 via-teal-600 to-cyan-600",
];
const getGradient = (name?: string | null) =>
  GRADIENTS[(name?.length ?? 0) % GRADIENTS.length];

/* ─── Shop thumbnail ─── */
function ShopThumb({ shop, size = "md" }: { shop: ShopLike; size?: "sm" | "md" }) {
  const initials = getShopInitials(shop.name);
  const gradient = getGradient(shop.name);
  const cls = size === "sm" ? "h-20 w-24" : "h-24 w-28";
  if (shop.imageUrl) {
    return (
      <div className={`${cls} overflow-hidden rounded-2xl border border-gray-100 dark:border-white/[0.06] flex-shrink-0`}>
        <img src={shop.imageUrl} alt={shop.name} className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`relative ${cls} overflow-hidden rounded-2xl bg-gradient-to-br flex-shrink-0 ${gradient}`}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative flex h-full flex-col items-center justify-center text-white">
        <div className="text-lg font-extrabold">{initials}</div>
        <div className="mt-0.5 px-2 text-center line-clamp-1 text-[10px] font-medium opacity-80">{shop.name}</div>
      </div>
    </div>
  );
}

/* ─── Chip ─── */
const Chip = ({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) => (
  <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-gray-500 dark:text-white/40">
    {icon}{text}
  </div>
);

/* ─── Distance badge ─── */
const DistanceBadge = ({ km }: { km: number }) => (
  <div className="inline-flex items-center gap-1 rounded-full bg-blue-900/10 dark:bg-blue-400/10 border border-blue-900/15 dark:border-blue-400/15 px-2.5 py-1 text-[11px] font-bold text-blue-900 dark:text-blue-400">
    <MapPin size={9} />{km.toFixed(1)} km away
  </div>
);

/* ─── Shop card ─── */
function ShopCard({ shop, onClick }: { shop: ShopLike; onClick: () => void }) {
  const services = shop.services?.length ? shop.services.slice(0, 3) : ["Screen", "Battery", "Software"];
  return (
    <div
      role="button" tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="group rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/30 cursor-pointer"
    >
      <div className="flex gap-4">
        <ShopThumb shop={shop} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">{shop.name}</h3>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${shop.verified === false ? "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40" : "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"}`}>
                  <ShieldCheck size={10} />{shop.verified === false ? "Listed" : "Verified"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-400 dark:text-white/30 line-clamp-1">{shop.address ?? "Address not set"}</p>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-blue-500 dark:text-blue-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              View <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Chip icon={<Phone size={10} />} text={shop.phone ?? "—"} />
            <Chip icon={<Star size={10} />} text={shop.rating ?? "4.7"} />
            {typeof shop.distanceKm === "number" && <DistanceBadge km={shop.distanceKm} />}
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {services.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                <Wrench size={9} />{s}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 dark:text-white/25">Professional repair partner</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="flex items-center gap-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 px-3 py-1.5 text-xs font-semibold text-white border-none cursor-pointer transition shadow-sm"
            >
              View details <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Pagination ─── */
function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (v: number) => void }) {
  if (totalPages <= 1) return null;
  const base = "h-9 min-w-9 rounded-xl text-xs font-semibold transition border-none cursor-pointer";
  const active = "bg-blue-900 text-white shadow-sm";
  const inactive = "border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.08]";
  return (
    <div className="mt-6 flex items-center justify-center gap-1.5">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className={`${base} ${inactive} flex items-center gap-1 px-3 disabled:opacity-40`}>
        <ChevronLeft size={13} /> Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onPageChange(p)} className={`${base} px-3 ${p === currentPage ? active : inactive}`}>{p}</button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className={`${base} ${inactive} flex items-center gap-1 px-3 disabled:opacity-40`}>
        Next <ChevronRight size={13} />
      </button>
    </div>
  );
}

/* ─── Map helpers ─── */
function RecenterMap({ center, zoom = 15 }: { center: LatLngTuple; zoom?: number }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom, { animate: true }); }, [center, zoom, map]);
  return null;
}
function FitMapToPoints({ points }: { points: LatLngTuple[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    map.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
  }, [points, map]);
  return null;
}
const userMarkerIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:9999px;background:#1e3a8a;border:3px solid white;box-shadow:0 0 0 6px rgba(30,58,138,0.2)"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9],
});

/* ─── Location Banner ─── */
function LocationBanner({ onUseLocation, loading, hasLocation, coords }: {
  onUseLocation: () => void;
  loading: boolean;
  hasLocation: boolean;
  coords: { lat: number; lng: number } | null;
}) {
  if (hasLocation && coords) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 px-4 py-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={15} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Location active</div>
          <div className="text-[10px] text-emerald-700/70 dark:text-emerald-400/60 font-mono mt-0.5">
            {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </div>
        </div>
        <button
          onClick={onUseLocation}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-white dark:bg-emerald-900/20 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition cursor-pointer"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <LocateFixed size={12} />}
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl border border-blue-900/15 dark:border-blue-400/15 bg-blue-900/5 dark:bg-blue-400/5 px-4 py-4">
      <div className="w-9 h-9 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0">
        <Navigation size={16} className="text-white" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-gray-900 dark:text-white">Find shops near you</div>
        <div className="text-xs text-gray-500 dark:text-white/40 mt-0.5">
          Allow location access to automatically sort shops by distance and see the closest ones first.
        </div>
      </div>
      <button
        onClick={onUseLocation}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-60 px-4 py-2.5 text-sm font-semibold text-white border-none cursor-pointer transition shadow-sm shadow-blue-900/20 flex-shrink-0"
      >
        {loading
          ? <><Loader2 size={14} className="animate-spin" /> Locating…</>
          : <><LocateFixed size={14} /> Use my location</>
        }
      </button>
    </div>
  );
}

/* ─── Empty state ─── */
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-10 text-center shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
        <Search size={20} className="text-gray-400" />
      </div>
      <div className="text-sm font-bold text-gray-700 dark:text-white/60 mb-1">No shops found</div>
      <p className="text-xs text-gray-400 dark:text-white/30 mb-4">Try a different search term or increase the radius.</p>
      <button onClick={onClear} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-4 py-2 text-xs font-semibold text-gray-600 dark:text-white/50 hover:bg-gray-50 transition cursor-pointer">
        <X size={12} /> Clear search
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════ */
export default function ShopsPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [locating, setLocating] = useState(false);

  const { loading, errorMsg, query, geo, shops, setQueryText, setRadius, requestLocation, fetchShops } = useShopsStore();

  useEffect(() => { fetchShops(); }, []);
  useEffect(() => { setCurrentPage(1); }, [shops.length, query.q, query.radiusKm, view]);

  const onUseLocation = async () => {
    setLocating(true);
    try {
      await requestLocation();
      await fetchShops();
      setView("map");
    } finally {
      setLocating(false);
    }
  };

  const center = useMemo<LatLngTuple>(() =>
    geo.coords ? [geo.coords.lat as number, geo.coords.lng as number] : FALLBACK_CENTER, [geo.coords]);

  const userPoint = useMemo<LatLngTuple | null>(() =>
    geo.coords ? [geo.coords.lat as number, geo.coords.lng as number] : null, [geo.coords]);

  const mappableShops = useMemo(() =>
    shops.filter((s): s is typeof s & { lat: number; lng: number } =>
      typeof s.lat === "number" && typeof s.lng === "number"), [shops]);

  const mapPoints = useMemo<LatLngTuple[]>(() => {
    const pts: LatLngTuple[] = userPoint ? [userPoint] : [];
    mappableShops.forEach((s) => pts.push([s.lat, s.lng]));
    return pts;
  }, [userPoint, mappableShops]);

  const totalPages = Math.max(1, Math.ceil(shops.length / ITEMS_PER_PAGE));
  const paginatedShops = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return shops.slice(start, start + ITEMS_PER_PAGE);
  }, [shops, currentPage]);

  const inputCls = "w-full bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25";

  return (
    <div className="p-4 sm:p-6 space-y-5 min-h-screen">

      {/* ── Hero search card ── */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-blue-900" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-900/10 dark:bg-blue-500/15 text-blue-900 dark:text-blue-400 mb-3">
                Repair shop discovery
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Find a repair shop
              </h1>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-white/40 max-w-xl">
                Discover trusted repair partners nearby, compare options, and book with confidence.
              </p>
            </div>

            {/* View toggle */}
            <div className="flex gap-1 bg-gray-100 dark:bg-white/[0.04] p-1 rounded-xl border border-gray-200 dark:border-white/[0.06] w-fit">
              {([["list", <List size={14} />, "List"], ["map", <MapIcon size={14} />, "Map"]] as const).map(([v, icon, label]) => (
                <button key={v} onClick={() => setView(v as ViewMode)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-semibold transition border-none cursor-pointer ${view === v ? "bg-blue-900 text-white shadow-sm" : "bg-transparent text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60"}`}>
                  {icon}{label}
                </button>
              ))}
            </div>
          </div>

          {/* Location banner */}
          <div className="mt-5">
            <LocationBanner
              onUseLocation={onUseLocation}
              loading={locating}
              hasLocation={!!geo.coords}
              coords={geo.coords as { lat: number; lng: number } | null}
            />
          </div>

          {/* Search bar */}
          <div className="mt-4 rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal size={13} className="text-gray-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">Search filters</span>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-1.5 block">Area / city / shop name</label>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-3.5 py-2.5 focus-within:border-blue-900/40 transition">
                  <Search size={14} className="text-gray-400 flex-shrink-0" />
                  <input value={query.q ?? ""} onChange={(e) => setQueryText(e.target.value)} placeholder="Itahari, Dharan, Kathmandu..." className={inputCls} />
                  {query.q && (
                    <button onClick={() => setQueryText("")} className="text-gray-300 hover:text-gray-500 transition border-none bg-transparent cursor-pointer flex-shrink-0">
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-1.5 block">Radius (km)</label>
                <div className="flex items-center rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-3.5 py-2.5 focus-within:border-blue-900/40 transition">
                  <input type="number" value={query.radiusKm ?? 10} min={1} max={50} onChange={(e) => setRadius(Number(e.target.value || 10))} className={inputCls} />
                </div>
              </div>

              <div className="lg:col-span-3 flex gap-2 items-end">
                <button onClick={fetchShops} disabled={loading}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-sm font-semibold text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.08] disabled:opacity-50 transition cursor-pointer py-2.5">
                  {loading ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Search"}
                </button>
                <button onClick={onUseLocation} disabled={locating}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-sm font-semibold text-white disabled:opacity-50 transition border-none cursor-pointer shadow-sm py-2.5">
                  {locating ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
                  {locating ? "…" : "Near me"}
                </button>
              </div>
            </div>

            {/* Status row */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 dark:text-white/25">
              <div className="flex items-center gap-1.5">
                <MapPin size={11} />
                {geo.coords
                  ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">Showing shops near your location</span>
                  : "Search manually or use live location to find nearby shops."}
              </div>
              <span className="px-2.5 py-1 rounded-full border border-gray-100 dark:border-white/[0.05] bg-white dark:bg-white/[0.04] text-[10px] font-bold text-gray-600 dark:text-white/40">
                {shops.length} {shops.length === 1 ? "shop" : "shops"} found
              </span>
            </div>

            {errorMsg && (
              <div className="mt-3 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <X size={14} />{errorMsg}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {view === "map" ? (
        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 dark:border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapIcon size={15} className="text-blue-900 dark:text-blue-400" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">Map view</span>
              <span className="text-[10px] font-semibold text-gray-400 dark:text-white/30 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.05]">
                {mappableShops.length} pinned
              </span>
            </div>
            {userPoint && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-900 ring-2 ring-blue-900/20" />
                Your location active
              </div>
            )}
          </div>
          <div className="h-[520px] overflow-hidden">
            <MapContainer center={center} zoom={12} className="h-full w-full">
              <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <RecenterMap center={center} zoom={15} />
              {mapPoints.length >= 2 && <FitMapToPoints points={mapPoints} />}
              {userPoint && (
                <>
                  <Marker position={userPoint} icon={userMarkerIcon}>
                    <Popup>
                      <div className="font-bold text-gray-900 text-sm">📍 Your location</div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">{userPoint[0].toFixed(5)}, {userPoint[1].toFixed(5)}</div>
                    </Popup>
                  </Marker>
                  <Circle center={userPoint} radius={(query.radiusKm ?? 10) * 1000} pathOptions={{ color: "#1e3a8a", fillColor: "#1e3a8a", fillOpacity: 0.05, dashArray: "6 4" }} />
                </>
              )}
              {mappableShops.map((s) => (
                <Marker key={s.id} position={[s.lat, s.lng]} icon={defaultMarkerIcon}>
                  <Popup>
                    <div className="w-52 text-gray-900 space-y-2">
                      <ShopThumb shop={s} size="sm" />
                      <div className="font-bold text-sm">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.address ?? ""}</div>
                      {typeof s.distanceKm === "number" && (
                        <div className="text-xs font-semibold text-blue-900">📍 {s.distanceKm.toFixed(1)} km away</div>
                      )}
                      <button onClick={() => navigate(`/app/shops/${s.id}`)}
                        className="w-full rounded-xl bg-blue-900 px-3 py-1.5 text-xs font-semibold text-white border-none cursor-pointer hover:bg-blue-800 transition">
                        View details →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          {mappableShops.length === 0 && (
            <div className="p-4 text-sm text-gray-400 dark:text-white/30 text-center">No shops with coordinates yet.</div>
          )}
        </div>
      ) : (
        <>
          {loading && (
            <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-10 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={24} className="text-blue-900 animate-spin" />
                <span className="text-sm text-gray-400 dark:text-white/30">Finding shops…</span>
              </div>
            </div>
          )}
          {!loading && shops.length === 0 && (
            <EmptyState onClear={() => { setQueryText(""); fetchShops(); }} />
          )}
          {!loading && shops.length > 0 && (
            <>
              {/* Sort hint */}
              {geo.coords && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/30 px-1">
                  <LocateFixed size={12} className="text-blue-900 dark:text-blue-400" />
                  Sorted by distance from your location
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {paginatedShops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} onClick={() => navigate(`/app/shops/${shop.id}`)} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
        </>
      )}
    </div>
  );
}