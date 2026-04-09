import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, MapPin, Phone, ShieldCheck,
  Star, Clock, Wrench, Smartphone, Map as MapIcon, Image as ImageIcon,
  CheckCircle2, LocateFixed,
} from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { defaultMarkerIcon } from "./utils/leafletIcons";
import "./shops.leaflet.css";
import { useShopDetailsStore } from "./store/shop.details.store";

type Tab = "overview" | "location";

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
const getGradient = (name?: string | null) => GRADIENTS[(name?.length ?? 0) % GRADIENTS.length];

/* ─── Hero ─── */
function ShopHeroImage({ name, imageUrl }: { name?: string | null; imageUrl?: string | null }) {
  const initials = getShopInitials(name);
  const gradient = getGradient(name);
  if (imageUrl) {
    return (
      <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-gray-100 dark:border-white/[0.06]">
        <img src={imageUrl} alt={name || "Shop"} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-5 bottom-4 text-xl font-extrabold text-white">{name}</div>
      </div>
    );
  }
  return (
    <div className={`relative h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute right-6 top-6 w-20 h-20 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute left-6 bottom-6 w-16 h-16 rounded-full bg-black/10 blur-xl" />
      <div className="relative flex h-full items-center gap-5 px-7">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-extrabold text-white backdrop-blur-sm flex-shrink-0">
          {initials}
        </div>
        <div className="text-white">
          <div className="text-2xl font-extrabold tracking-tight">{name || "Repair Shop"}</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
            <ImageIcon size={12} /> Shop profile
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Chips / sections ─── */
const InfoChip = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-white/40">
    {icon}<span>{children}</span>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] p-5">
    <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">{title}</div>
    {children}
  </div>
);

const Skeleton = () => (
  <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-6 shadow-sm space-y-4 animate-pulse">
    <div className="h-8 w-48 rounded-xl bg-gray-100 dark:bg-white/10" />
    <div className="h-4 w-72 rounded-xl bg-gray-100 dark:bg-white/[0.06]" />
    <div className="h-44 rounded-2xl bg-gray-100 dark:bg-white/[0.06]" />
    <div className="grid grid-cols-3 gap-3">
      {[1,2,3].map(i => <div key={i} className="h-8 rounded-xl bg-gray-100 dark:bg-white/[0.06]" />)}
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════ */
export default function ShopDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const shopId = Number(params.id);

  const { status, errorMsg, shop, fetchShop, clear } = useShopDetailsStore();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!Number.isFinite(shopId)) return;
    fetchShop(shopId);
    return () => clear();
  }, [shopId]);

  const coords = useMemo(() => {
    if (!shop) return null;
    if (typeof shop.lat === "number" && typeof shop.lng === "number") return [shop.lat, shop.lng] as [number, number];
    return null;
  }, [shop]);

  return (
    <div className="p-4 sm:p-6 space-y-5 min-h-screen">

      {status === "loading" && <Skeleton />}

      {status === "error" && (
        <div className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-5 py-4 text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {status === "success" && shop && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">

          {/* ── Main column ── */}
          <div className="xl:col-span-8 space-y-5">
            <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-blue-900" />
              <div className="p-5 sm:p-6">

                {/* Back + heading row */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-4 py-2 text-sm font-semibold text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition cursor-pointer">
                    <ArrowLeft size={14} /> Back to shops
                  </button>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${shop.verified ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40"}`}>
                    <ShieldCheck size={11} />{shop.verified ? "Verified" : "Listed"}
                  </span>
                </div>

                <ShopHeroImage name={shop.name} imageUrl={(shop as any).imageUrl ?? null} />

                {/* Name + info */}
                <div className="mt-5">
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">{shop.name ?? "Shop"}</h1>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <InfoChip icon={<MapPin size={11} />}>{shop.address ?? "Address not set"}</InfoChip>
                    {shop.phone && <InfoChip icon={<Phone size={11} />}>{shop.phone}</InfoChip>}
                    <InfoChip icon={<Star size={11} />}>{shop.rating ?? 4.7} ({shop.reviewCount ?? 0} reviews)</InfoChip>
                    {typeof shop.distanceKm === "number" && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-blue-900/10 dark:bg-blue-400/10 border border-blue-900/15 px-3 py-1.5 text-xs font-bold text-blue-900 dark:text-blue-400">
                        <LocateFixed size={11} />{shop.distanceKm.toFixed(1)} km from you
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-5 flex gap-1 bg-gray-100 dark:bg-white/[0.04] p-1 rounded-xl border border-gray-200 dark:border-white/[0.06] w-fit">
                  {([["overview", null, "Overview"], ["location", <MapIcon size={13} />, "Location"]] as const).map(([t, icon, label]) => (
                    <button key={t} onClick={() => setTab(t as Tab)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-semibold transition border-none cursor-pointer ${tab === t ? "bg-blue-900 text-white shadow-sm" : "bg-transparent text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60"}`}>
                      {icon}{label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {tab === "overview" ? (
                  <div className="mt-5 space-y-4">
                    <Section title="About this shop">
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-white/50">
                        {shop.description ?? "This repair shop is ready to help with device issues. Book a repair and track your progress easily."}
                      </p>
                    </Section>

                    <Section title="Services offered">
                      <div className="flex flex-wrap gap-2">
                        {(shop.services?.length ? shop.services : ["Screen Repair", "Battery Replacement", "Charging Port", "Software Issue"]).map((x) => (
                          <span key={x} className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-500/15 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <Wrench size={11} />{x}
                          </span>
                        ))}
                      </div>
                    </Section>

                    <Section title="Supported brands">
                      <div className="flex flex-wrap gap-2">
                        {(shop.brands?.length ? shop.brands : ["Apple", "Samsung", "Xiaomi", "Oppo"]).map((x) => (
                          <span key={x} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-white/60">
                            <Smartphone size={11} />{x}
                          </span>
                        ))}
                      </div>
                    </Section>
                  </div>
                ) : (
                  <div className="mt-5">
                    {coords ? (
                      <>
                        <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-white/[0.05] h-[380px]">
                          <MapContainer center={coords} zoom={14} className="h-full w-full">
                            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={coords} icon={defaultMarkerIcon}>
                              <Popup>
                                <div className="text-gray-900">
                                  <div className="font-bold">{shop.name}</div>
                                  <div className="text-xs text-gray-500">{shop.address ?? ""}</div>
                                </div>
                              </Popup>
                            </Marker>
                          </MapContainer>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-white/30">
                          <MapPin size={12} className="text-blue-900 dark:text-blue-400" />
                          <span className="font-mono">{coords[0].toFixed(6)}, {coords[1].toFixed(6)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] p-8 text-center">
                        <MapIcon size={24} className="text-gray-300 dark:text-white/20 mx-auto mb-3" />
                        <p className="text-sm text-gray-400 dark:text-white/30">
                          This shop hasn't set coordinates yet. <br />
                          <code className="text-xs font-semibold">lat/lng</code> must be added in the backend.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="xl:col-span-4">
            <div className="xl:sticky xl:top-24 space-y-4">

              {/* Book CTA */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] shadow-sm overflow-hidden">
                <div className="h-1 w-full bg-blue-900" />
                <div className="bg-blue-900 px-6 py-5 text-white">
                  <div className="text-base font-extrabold">Ready to repair?</div>
                  <div className="mt-1 text-sm text-blue-200/80">Book a repair and track progress in real time.</div>
                </div>
                <div className="p-5 space-y-3">
                  <button
                    onClick={() => navigate(`/app/bookings/new?shopId=${shop.id}`)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-900 hover:bg-blue-800 px-4 py-3 text-sm font-semibold text-white border-none cursor-pointer transition shadow-sm shadow-blue-900/20"
                  >
                    Book repair <ArrowRight size={15} />
                  </button>
                  {shop.phone && (
                    <a href={`tel:${shop.phone}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition">
                      <Phone size={14} /> Call shop
                    </a>
                  )}
                </div>
              </div>

              {/* Working hours */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">
                  <Clock size={13} /> Working Hours
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-4 py-3 text-sm text-gray-700 dark:text-white/60">
                  {shop.openingHours
                    ? `${shop.openingHours.label}: ${shop.openingHours.open} – ${shop.openingHours.close}`
                    : "Sun–Fri: 10:00 – 19:00"}
                </div>
                <p className="mt-2 text-[11px] text-gray-400 dark:text-white/25">Hours are approximate until updated by the shop.</p>
              </div>

              {/* Why choose */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-5 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">Why choose this shop?</div>
                <div className="space-y-2">
                  {[
                    "Verified profile with a customer-safe booking flow.",
                    "Clear repair services with supported brand list.",
                    "Easy to contact with simple repair status tracking.",
                  ].map((text) => (
                    <div key={text} className="flex items-start gap-2.5 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-3.5 py-3 text-xs text-gray-600 dark:text-white/50">
                      <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Location quick view */}
              {coords && (
                <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-5 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">Location</div>
                  <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-white/[0.05] h-28">
                    <MapContainer center={coords} zoom={14} className="h-full w-full" zoomControl={false} scrollWheelZoom={false} dragging={false}>
                      <TileLayer attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={coords} icon={defaultMarkerIcon} />
                    </MapContainer>
                  </div>
                  <button onClick={() => setTab("location")}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] px-3 py-2 text-xs font-semibold text-gray-600 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition cursor-pointer">
                    <MapIcon size={12} /> View full map
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 dark:border-white/[0.05] pt-5 flex items-center justify-between text-[11px] text-gray-400 dark:text-white/20">
        <span>© {new Date().getFullYear()} Sajilo Tayaar</span>
        <span>Private · Simple · Secure</span>
      </div>
    </div>
  );
}