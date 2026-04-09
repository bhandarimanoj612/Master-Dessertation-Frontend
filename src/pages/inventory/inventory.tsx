import React, { useEffect, useMemo, useState } from "react";
import { axios_auth } from "../../global/config";
import { useAuthStore } from "../auth/store/store";
import { useToast } from "../../global/hooks/useToast";
import { PageLoader } from "../../global/components/loader/page-loader";

type Product = {
  id: number;
  name: string;
  sku?: string | null;
  category?: string | null;
  sellingPrice: number;
  costPrice?: number | null;
  stockQty: number;
  active: boolean;
  createdAt?: string;
};

type ProductForm = {
  name: string; sku: string; category: string; sellingPrice: string;
  costPrice: string; stockQty: string; active: boolean;
};

const emptyForm: ProductForm = {
  name: "", sku: "", category: "", sellingPrice: "", costPrice: "", stockQty: "0", active: true,
};

/* ─── Pagination config ── */
const ITEMS_PER_PAGE = 10;

/* ─── Icons ─── */
const IconBox      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IconAlert    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IconX        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const IconDollar   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IconPlus     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconSearch   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconEdit     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconClose    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconChevLeft = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconChevRight= () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

/* ─── Pagination component ── */
const Pagination = ({
  page, totalPages, total, onPrev, onNext, onPage,
}: {
  page: number; totalPages: number; total: number;
  onPrev: () => void; onNext: () => void; onPage: (p: number) => void;
}) => {
  const from = Math.min((page - 1) * ITEMS_PER_PAGE + 1, total);
  const to   = Math.min(page * ITEMS_PER_PAGE, total);

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
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
        Showing {total === 0 ? 0 : from}–{to} of {total} products
      </span>

      {/* Only render page buttons when there is more than one page */}
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

/* ─── Stock status ── */
const getStockStatus = (qty: number) => {
  if (qty === 0) return { label: "Out of Stock", badge: "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400",       dot: "bg-red-500"    };
  if (qty <= 5)  return { label: "Low Stock",    badge: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400", dot: "bg-amber-500"  };
  return             { label: "In Stock",     badge: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" };
};

/* ─── Stat Card ── */
const StatCard = ({ label, value, iconBg, icon }: { label: string; value: React.ReactNode; iconBg: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-5 flex flex-col gap-3 relative overflow-hidden shadow-sm">
    <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-[0.08] ${iconBg}`} />
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${iconBg}`}>{icon}</div>
    <div>
      <div className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{value}</div>
      <div className="text-xs font-medium text-gray-500 dark:text-white/40 mt-1">{label}</div>
    </div>
  </div>
);

/* ─── Form Field ── */
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const inputCls  = "w-full rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition";
const selectCls = inputCls + " cursor-pointer";

/* ════════════════════════════════════════════════════════ */
const Inventory = () => {
  const tenantId = useAuthStore((s) => s.tenantId);
  const role     = useAuthStore((s) => s.role);

  const [items, setItems]                   = useState<Product[]>([]);
  const [searchTerm, setSearchTerm]         = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy]                 = useState("name");
  const [sortOrder, setSortOrder]           = useState<"asc"|"desc">("asc");
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [showForm, setShowForm]             = useState(false);
  const [editing, setEditing]               = useState<Product | null>(null);
  const [form, setForm]                     = useState<ProductForm>(emptyForm);

  const toast = useToast();

  // Pagination
  const [page, setPage] = useState(1);

  // Reset page whenever any filter changes
  useEffect(() => { setPage(1); }, [searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const canManage = role === "SHOP_OWNER" || role === "SHOP_STAFF" || role === "PLATFORM_ADMIN";

  const load = async () => {
    if (!tenantId && role !== "PLATFORM_ADMIN") return;
    try {
      setLoading(true);
      const endpoint = role === "PLATFORM_ADMIN"
        ? "/api/inventory/products"
        : `/api/inventory/products/shop/${tenantId}`;
      const res = await axios_auth.get<Product[]>(endpoint);
      setItems(res.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [tenantId, role]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category || "General")))],
    [items],
  );

  const filteredItems = useMemo(() => {
    return [...items]
      .filter((item) => {
        const matchesSearch    = [item.name, item.sku || "", item.category || ""].join(" ").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory  = selectedCategory === "All" || (item.category || "General") === selectedCategory;
        const status           = item.stockQty === 0 ? "Out of Stock" : item.stockQty <= 5 ? "Low Stock" : "In Stock";
        const matchesStatus    = selectedStatus === "All" || status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        const fa: any = sortBy === "unitPrice" ? Number(a.sellingPrice) : sortBy === "currentStock" ? a.stockQty : (a as any)[sortBy];
        const fb: any = sortBy === "unitPrice" ? Number(b.sellingPrice) : sortBy === "currentStock" ? b.stockQty : (b as any)[sortBy];
        if (typeof fa === "string") return sortOrder === "asc" ? fa.localeCompare(fb) : fb.localeCompare(fa);
        return sortOrder === "asc" ? fa - fb : fb - fa;
      });
  }, [items, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // Paginated slice
  const totalPages   = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const pagedItems   = filteredItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    totalItems:  items.length,
    lowStock:    items.filter((i) => i.stockQty > 0 && i.stockQty <= 5).length,
    outOfStock:  items.filter((i) => i.stockQty === 0).length,
    totalValue:  items.reduce((sum, i) => sum + i.stockQty * Number(i.sellingPrice || 0), 0),
  }), [items]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit   = (item: Product) => {
    setEditing(item);
    setForm({ name: item.name, sku: item.sku || "", category: item.category || "", sellingPrice: String(item.sellingPrice ?? ""), costPrice: item.costPrice == null ? "" : String(item.costPrice), stockQty: String(item.stockQty ?? 0), active: !!item.active });
    setShowForm(true);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId && role !== "PLATFORM_ADMIN") return;
    try {
      setSaving(true);
      const payload = { shopId: tenantId, name: form.name, sku: form.sku || null, category: form.category || null, sellingPrice: Number(form.sellingPrice || 0), costPrice: form.costPrice ? Number(form.costPrice) : null, stockQty: Number(form.stockQty || 0), active: form.active };
      if (editing) { await axios_auth.put(`/api/inventory/products/${editing.id}`, payload); toast.success("Product updated"); }
      else         { await axios_auth.post("/api/inventory/products", payload); toast.success("Product added"); }
      setShowForm(false); setForm(emptyForm); setEditing(null);
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const adjustStock = async (item: Product, delta: number) => {
    if (!tenantId) return;
    try { await axios_auth.patch(`/api/inventory/products/${item.id}/stock`, { shopId: tenantId, delta }); await load(); }
    catch (e: any) { toast.error(e?.response?.data?.message || "Failed to update stock"); }
  };

  const deleteProduct = async (item: Product) => {
    if (!tenantId || !window.confirm(`Delete ${item.name}?`)) return;
    try { await axios_auth.delete(`/api/inventory/products/${item.id}?shopId=${tenantId}`); toast.success("Product deleted"); await load(); }
    catch (e: any) { toast.error(e?.response?.data?.message || "Failed to delete product"); }
  };

  const toggleActive = async (item: Product) => {
    if (!tenantId) return;
    try { await axios_auth.patch(`/api/inventory/products/${item.id}/toggle-active?shopId=${tenantId}`); await load(); }
    catch (e: any) { toast.error(e?.response?.data?.message || "Failed to change active state"); }
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-1">Manage products, stock levels, and active items for your shop.</p>
        </div>
        {canManage && role !== "PLATFORM_ADMIN" && (
          <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-black to-[#5079e8] hover:from-blue-600 hover:to-[#273C75] text-white text-sm font-semibold px-5 py-2.5 border-none cursor-pointer transition-all shadow-sm">
            <IconPlus /> Add Product
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Items"  value={stats.totalItems}                      iconBg="bg-blue-500"    icon={<IconBox />}    />
        <StatCard label="Low Stock"    value={stats.lowStock}                        iconBg="bg-amber-500"   icon={<IconAlert />}  />
        <StatCard label="Out of Stock" value={stats.outOfStock}                      iconBg="bg-red-500"     icon={<IconX />}      />
        <StatCard label="Total Value"  value={`Rs. ${stats.totalValue.toFixed(0)}`}  iconBg="bg-emerald-500" icon={<IconDollar />} />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25 pointer-events-none"><IconSearch /></span>
            <input className={inputCls + " pl-9"} placeholder="Search name, SKU, category…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className={selectCls} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select className={selectCls} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <select className={selectCls} value={`${sortBy}-${sortOrder}`} onChange={(e) => { const [f, o] = e.target.value.split("-"); setSortBy(f); setSortOrder(o as "asc"|"desc"); }}>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="currentStock-asc">Stock (Low–High)</option>
            <option value="currentStock-desc">Stock (High–Low)</option>
            <option value="unitPrice-asc">Price (Low–High)</option>
            <option value="unitPrice-desc">Price (High–Low)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                {["Product", "Price", "Stock", "Status", "Active", "Actions"].map((h, i) => (
                  <th key={h} className={`px-5 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 bg-gray-50 dark:bg-white/[0.02] ${i === 5 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10"><PageLoader message="Loading inventory…" /></td></tr>
              ) : pagedItems.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-sm text-center text-gray-400 dark:text-white/30">No products found.</td></tr>
              ) : pagedItems.map((item) => {
                const stock = getStockStatus(item.stockQty);
                return (
                  <tr key={item.id} className={`border-b border-gray-50 dark:border-white/[0.04] transition-colors hover:bg-gray-50/60 dark:hover:bg-white/[0.02] ${!item.active ? "opacity-50" : ""}`}>

                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                        {item.sku ? <span className="font-mono">{item.sku}</span> : "No SKU"}
                        {item.category && <> &nbsp;·&nbsp; {item.category}</>}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">Rs. {Number(item.sellingPrice).toFixed(2)}</div>
                      {item.costPrice != null && <div className="text-xs text-gray-400 dark:text-white/30 mt-0.5">Cost: Rs. {Number(item.costPrice).toFixed(2)}</div>}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{item.stockQty}</div>
                      {tenantId && canManage && role !== "PLATFORM_ADMIN" && (
                        <div className="mt-1.5 flex gap-1.5">
                          <button onClick={() => adjustStock(item, 1)}  className="w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-white/50 text-xs font-bold hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 transition cursor-pointer">+</button>
                          <button onClick={() => adjustStock(item, -1)} className="w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-white/50 text-xs font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition cursor-pointer">−</button>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${stock.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stock.dot}`} />{stock.label}
                      </span>
                    </td>

                    {/* Active */}
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${item.active ? "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-white/30"}`}>
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      {tenantId && canManage && role !== "PLATFORM_ADMIN" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEdit(item)} title="Edit" className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-white/40 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition cursor-pointer"><IconEdit /></button>
                          <button onClick={() => toggleActive(item)} title={item.active ? "Disable" : "Enable"}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/[0.08] cursor-pointer transition ${item.active ? "bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-white/40 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400" : "bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-white/40 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"}`}>
                            {item.active ? "Disable" : "Enable"}
                          </button>
                          <button onClick={() => deleteProduct(item)} title="Delete" className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-white/40 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition cursor-pointer"><IconTrash /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!loading && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={filteredItems.length}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onPage={setPage}
          />
        )}
      </div>

      {/* ─── Modal ─── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0f1829] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editing ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white border-none cursor-pointer transition"><IconClose /></button>
            </div>
            <form onSubmit={saveProduct} className="p-6 grid grid-cols-2 gap-4">
              <Field label="Name *"><input required className={inputCls} placeholder="e.g. iPhone Screen" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="SKU"><input className={inputCls} placeholder="e.g. IPH-SCR-14" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></Field>
              <Field label="Category"><input className={inputCls} placeholder="e.g. Screens" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
              <Field label="Selling Price *"><input required type="number" min="0" step="0.01" className={inputCls} placeholder="0.00" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} /></Field>
              <Field label="Cost Price"><input type="number" min="0" step="0.01" className={inputCls} placeholder="0.00" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} /></Field>
              <Field label="Stock Qty"><input type="number" min="0" className={inputCls} placeholder="0" value={form.stockQty} onChange={(e) => setForm({ ...form, stockQty: e.target.value })} /></Field>
              <label className="col-span-2 flex items-center gap-3 cursor-pointer select-none">
                <div onClick={() => setForm({ ...form, active: !form.active })} className={`relative w-10 h-5 rounded-full transition-colors ${form.active ? "bg-blue-500" : "bg-gray-200 dark:bg-white/10"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-gray-700 dark:text-white/70 font-medium">Product is active</span>
              </label>
              <button type="submit" disabled={saving} className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-black to-[#5079e8] hover:from-blue-600 hover:to-[#273C75] disabled:opacity-60 text-white text-sm font-semibold py-2.5 border-none cursor-pointer transition-all shadow-sm">
                {saving ? "Saving…" : editing ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;