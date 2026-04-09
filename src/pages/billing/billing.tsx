import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { axios_auth } from "../../global/config";
import { useAuthStore } from "../auth/store/store";
import { useToast } from "../../global/hooks/useToast";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
type PaymentMethod = "CASH" | "CARD" | "ONLINE";
type Tab = "pos" | "history" | "analytics";

type Product = {
  id: number; name: string; sku?: string; category?: string;
  sellingPrice: number; costPrice?: number; stockQty: number;
  brand?: string; model?: string; active?: boolean;
};
type InvoiceItem = { id: number; qty: number; unitPrice: number; lineTotal: number; product: Product };
type Invoice = {
  id: number; customerName?: string; customerPhone?: string;
  paymentMethod: PaymentMethod; subTotal: number; discount: number;
  tax: number; grandTotal: number; createdAt: string; items: InvoiceItem[]; notes?: string;
};
type CartItem = { product: Product; qty: number; unitPrice: number };

/* ─── Pagination config ──────────────────────────────────────────────────────── */
const PRODUCTS_PER_PAGE = 12;
const INVOICES_PER_PAGE = 8;

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
const Ico = {
  Search:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Trash:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Plus:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Receipt:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="14" y2="13"/></svg>,
  Print:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Close:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Cash:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Card:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  Mobile:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  Chart:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  History:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Grid:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  List:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Discount:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="2"/><circle cx="15" cy="15" r="2"/><line x1="5" y1="19" x2="19" y2="5"/></svg>,
  ChevLeft:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmt     = (n: number) => `Rs. ${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtFull = (n: number) => `Rs. ${Number(n).toFixed(2)}`;

/* ─── Payment meta ────────────────────────────────────────────────────────── */
const PAY: Record<PaymentMethod, { label: string; color: string; bg: string; Icon: React.FC }> = {
  CASH:   { label:"Cash",   color:"text-emerald-600 dark:text-emerald-400", bg:"bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20", Icon: Ico.Cash   },
  CARD:   { label:"Card",   color:"text-blue-600 dark:text-blue-400",       bg:"bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20",             Icon: Ico.Card   },
  ONLINE: { label:"Online", color:"text-violet-600 dark:text-violet-400",   bg:"bg-violet-50 border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20",     Icon: Ico.Mobile },
};

/* ─── Shared classes (same pattern as AppointmentStats) ──────────────────── */
const card          = "rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] shadow-sm";
const inputCls      = "w-full rounded-xl border border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/15 transition";
const divider       = "border-gray-100 dark:border-white/[0.06]";
const textPrimary   = "text-gray-900 dark:text-white";
const textSecondary = "text-gray-500 dark:text-white/50";
const textMuted     = "text-gray-400 dark:text-white/25";
const textLabel     = "text-gray-400 dark:text-white/30";

/* ─── Pagination component ───────────────────────────────────────────────── */
const Pagination = ({
  page, totalPages, total, perPage, label,
  onPrev, onNext, onPage,
}: {
  page: number; totalPages: number; total: number; perPage: number; label: string;
  onPrev: () => void; onNext: () => void; onPage: (p: number) => void;
}) => {
  if (totalPages <= 1) return null;
  const from = (page - 1) * perPage + 1;
  const to   = Math.min(page * perPage, total);

  // Build page numbers with ellipsis
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
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
      <span className={`text-xs ${textMuted}`}>
        Showing {from}–{to} of {total} {label}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev} disabled={page === 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-gray-500 dark:text-white/40 hover:border-cyan-300 dark:hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer">
          <Ico.ChevLeft/>
        </button>
        {pages.map((p, i) =>
          p === "…"
            ? <span key={`e${i}`} className={`w-7 h-7 flex items-center justify-center text-xs ${textMuted}`}>…</span>
            : <button key={p} onClick={() => onPage(p as number)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition cursor-pointer border
                  ${page === p
                    ? "bg-cyan-500 border-cyan-500 text-white"
                    : "border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-gray-500 dark:text-white/40 hover:border-cyan-300 dark:hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400"}`}>
                {p}
              </button>
        )}
        <button
          onClick={onNext} disabled={page === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-gray-500 dark:text-white/40 hover:border-cyan-300 dark:hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer">
          <Ico.ChevRight/>
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════ */
const Billing = () => {
  const tenantId = useAuthStore((s) => s.tenantId);

  const [products, setProducts]   = useState<Product[]>([]);
  const [invoices, setInvoices]   = useState<Invoice[]>([]);
  const [loading, setLoading]     = useState(true);

  const toast = useToast();

  // POS state
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [customerName, setCustomerName]   = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [discountType, setDiscountType]   = useState<"flat"|"percent">("flat");
  const [discountValue, setDiscountValue] = useState("0");
  const [taxPercent, setTaxPercent]       = useState("13");
  const [notes, setNotes]         = useState("");
  const [creating, setCreating]   = useState(false);
  const [successInvoice, setSuccessInvoice] = useState<Invoice | null>(null);

  // UI state
  const [tab, setTab]             = useState<Tab>("pos");
  const [productSearch, setProductSearch]   = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode]   = useState<"grid"|"list">("grid");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [historySearch, setHistorySearch]     = useState("");
  const [historyPayFilter, setHistoryPayFilter] = useState("ALL");

  // Pagination state
  const [productPage, setProductPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ── Load ── */
  const load = useCallback(async () => {
    if (!tenantId) return;
    try {
      setLoading(true);
      const [pRes, iRes] = await Promise.all([
        axios_auth.get<Product[]>(`/api/inventory/products/shop/${tenantId}`),
        axios_auth.get<Invoice[]>(`/api/pos/invoices/shop/${tenantId}`),
      ]);
      const allProducts = Array.isArray(pRes.data) ? pRes.data : [];
      setProducts(allProducts.filter((p) => p.active !== false));
      setInvoices(Array.isArray(iRes.data) ? iRes.data : []);
    } catch (e: any) { toast.error(e?.response?.data?.message || "Failed to load data"); }
    finally { setLoading(false); }
  }, [tenantId]);

  useEffect(() => { void load(); }, [load]);

  /* ── Dynamic categories — built from actual product data ── */
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category || "Other").filter(Boolean)));
    return ["All", ...cats.sort()];
  }, [products]);

  // Reset product page when filter changes
  useEffect(() => { setProductPage(1); }, [productSearch, activeCategory]);
  // Reset history page when filter changes
  useEffect(() => { setHistoryPage(1); }, [historySearch, historyPayFilter]);

  /* ── Cart logic ── */
  const addToCart = (product: Product) => {
    if (product.stockQty <= 0) return;
    setCart((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) {
        if (ex.qty >= product.stockQty) return prev;
        return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1, unitPrice: product.sellingPrice }];
    });
  };
  const updateQty = (pid: number, qty: number) => {
    if (qty <= 0) return setCart((p) => p.filter((i) => i.product.id !== pid));
    const prod = products.find((p) => p.id === pid);
    if (!prod) return;
    setCart((p) => p.map((i) => i.product.id === pid ? { ...i, qty: Math.min(qty, prod.stockQty) } : i));
  };
  const updatePrice = (pid: number, price: number) =>
    setCart((p) => p.map((i) => i.product.id === pid ? { ...i, unitPrice: Math.max(0, price) } : i));
  const removeFromCart = (pid: number) => setCart((p) => p.filter((i) => i.product.id !== pid));
  const clearCart = () => {
    setCart([]); setCustomerName(""); setCustomerPhone(""); setNotes("");
    setDiscountValue("0"); setTaxPercent("13"); setPaymentMethod("CASH");
  };

  /* ── Totals ── */
  const totals = useMemo(() => {
    const subTotal    = cart.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    const discNum     = Number(discountValue || 0);
    const discountAmt = discountType === "percent" ? (subTotal * discNum) / 100 : discNum;
    const taxableAmt  = Math.max(0, subTotal - discountAmt);
    const taxAmt      = (taxableAmt * Number(taxPercent || 0)) / 100;
    const grandTotal  = Math.max(0, taxableAmt + taxAmt);
    const itemCount   = cart.reduce((s, i) => s + i.qty, 0);
    return { subTotal, discountAmt, taxAmt, grandTotal, itemCount };
  }, [cart, discountValue, discountType, taxPercent]);

  /* ── Filtered + paginated products ── */
  const filteredProducts = useMemo(() =>
    products.filter((p) => {
      const ms = [p.name, p.sku||"", p.category||"", p.brand||"", p.model||""]
        .join(" ").toLowerCase().includes(productSearch.toLowerCase());
      // "All" shows everything; otherwise match category exactly (case-insensitive)
      const mc = activeCategory === "All" ||
        (p.category||"Other").toLowerCase() === activeCategory.toLowerCase();
      return ms && mc;
    }), [products, productSearch, activeCategory]);

  const productTotalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const pagedProducts     = filteredProducts.slice(
    (productPage - 1) * PRODUCTS_PER_PAGE,
    productPage * PRODUCTS_PER_PAGE,
  );

  /* ── Filtered + paginated invoices ── */
  const filteredInvoices = useMemo(() =>
    invoices.filter((inv) => {
      const ms = [inv.customerName||"", inv.customerPhone||"", String(inv.id)]
        .join(" ").toLowerCase().includes(historySearch.toLowerCase());
      return ms && (historyPayFilter === "ALL" || inv.paymentMethod === historyPayFilter);
    }), [invoices, historySearch, historyPayFilter]);

  const historyTotalPages = Math.max(1, Math.ceil(filteredInvoices.length / INVOICES_PER_PAGE));
  const pagedInvoices     = filteredInvoices.slice(
    (historyPage - 1) * INVOICES_PER_PAGE,
    historyPage * INVOICES_PER_PAGE,
  );

  /* ── Analytics ── */
  const analytics = useMemo(() => {
    const totalRevenue  = invoices.reduce((s, inv) => s + Number(inv.grandTotal), 0);
    const totalOrders   = invoices.length;
    const avgOrder      = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const today         = new Date().toDateString();
    const todayInvoices = invoices.filter((inv) => new Date(inv.createdAt).toDateString() === today);
    const todayRevenue  = todayInvoices.reduce((s, inv) => s + Number(inv.grandTotal), 0);
    const payBreakdown  = { CASH: 0, CARD: 0, ONLINE: 0 } as Record<string,number>;
    invoices.forEach((inv) => { payBreakdown[inv.paymentMethod] = (payBreakdown[inv.paymentMethod]||0) + Number(inv.grandTotal); });
    const productSales: Record<number,{name:string;qty:number;revenue:number}> = {};
    invoices.forEach((inv) => inv.items.forEach((item) => {
      if (!productSales[item.product.id]) productSales[item.product.id] = { name: item.product.name, qty: 0, revenue: 0 };
      productSales[item.product.id].qty     += item.qty;
      productSales[item.product.id].revenue += Number(item.lineTotal);
    }));
    const topProducts = Object.values(productSales).sort((a,b) => b.revenue - a.revenue).slice(0,5);
    const last7: {date:string;revenue:number}[] = [];
    for (let i = 6; i >= 0; i--) {
      const dd = new Date(); dd.setDate(dd.getDate() - i);
      const ds = dd.toDateString();
      last7.push({ date: dd.toLocaleDateString("en-US",{weekday:"short"}), revenue: invoices.filter((inv) => new Date(inv.createdAt).toDateString()===ds).reduce((s,inv)=>s+Number(inv.grandTotal),0) });
    }
    return { totalRevenue, totalOrders, avgOrder, todayRevenue, todayOrders: todayInvoices.length, payBreakdown, topProducts, last7 };
  }, [invoices]);

  /* ── Create invoice ── */
  const createInvoice = async () => {
    if (!tenantId || cart.length === 0) return;
    setCreating(true);
    try {
      const res = await axios_auth.post("/api/pos/invoices", {
        shopId: tenantId, tenantId,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        paymentMethod, discount: totals.discountAmt, tax: totals.taxAmt, notes,
        items: cart.map((i) => ({ productId: i.product.id, qty: i.qty, unitPrice: i.unitPrice })),
      });
      setSuccessInvoice(res.data); clearCart(); await load();
    } catch (e: any) { toast.error(e?.response?.data?.message || "Failed to create invoice"); }
    finally { setCreating(false); }
  };

  /* ── Print ── */
  const printInvoice = (inv: Invoice) => {
    const w = window.open("","_blank"); if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Invoice #${inv.id}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Courier New',monospace;font-size:12px;padding:20px;max-width:320px;margin:0 auto}.hdr{text-align:center;border-bottom:2px dashed #000;padding-bottom:10px;margin-bottom:10px}.inf div{display:flex;justify-content:space-between;margin-bottom:3px}table{width:100%;border-collapse:collapse;margin:10px 0}th{border-top:1px dashed #000;border-bottom:1px dashed #000;padding:4px 0;text-align:left}td{padding:3px 0}.tot{border-top:1px dashed #000;padding-top:8px}.row{display:flex;justify-content:space-between;padding:2px 0}.grand{font-size:14px;font-weight:bold;border-top:2px solid #000;margin-top:6px;padding-top:6px}.ftr{text-align:center;margin-top:16px;border-top:2px dashed #000;padding-top:10px;font-size:11px}</style>
    </head><body>
    <div class="hdr"><b style="font-size:18px">⚡ SAJILO TAYAAR</b><br><span style="font-size:11px">Invoice #${inv.id} · ${new Date(inv.createdAt).toLocaleString()}</span></div>
    <div class="inf"><div><span>Customer:</span><span>${inv.customerName||"Walk-in"}</span></div>${inv.customerPhone?`<div><span>Phone:</span><span>${inv.customerPhone}</span></div>`:""}<div><span>Payment:</span><span>${inv.paymentMethod}</span></div></div>
    <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>${inv.items.map((it)=>`<tr><td>${it.product.name}</td><td>${it.qty}</td><td>${Number(it.unitPrice).toFixed(0)}</td><td>${Number(it.lineTotal).toFixed(0)}</td></tr>`).join("")}</tbody></table>
    <div class="tot"><div class="row"><span>Subtotal</span><span>Rs. ${Number(inv.subTotal).toFixed(2)}</span></div><div class="row"><span>Discount</span><span>- Rs. ${Number(inv.discount).toFixed(2)}</span></div><div class="row"><span>VAT</span><span>+ Rs. ${Number(inv.tax).toFixed(2)}</span></div><div class="row grand"><span>GRAND TOTAL</span><span>Rs. ${Number(inv.grandTotal).toFixed(2)}</span></div></div>
    <div class="ftr">Thank you for your purchase!<br><span style="font-size:10px">Exchange within 7 days | Repair Service Available</span></div>
    </body></html>`);
    w.document.close(); w.print();
  };

  /* ── Category emoji (fallback for any category string) ── */
  const catEmoji = (cat?: string) => {
    const c = (cat||"").toLowerCase();
    if (c.includes("phone") || c.includes("mobile") || c.includes("iphone")) return "📱";
    if (c.includes("laptop"))  return "💻";
    if (c.includes("audio") || c.includes("headphone") || c.includes("speaker")) return "🎧";
    if (c.includes("tablet"))  return "📟";
    if (c.includes("cable") || c.includes("accessory") || c.includes("accessories")) return "🔌";
    if (c.includes("camera"))  return "📷";
    if (c.includes("watch"))   return "⌚";
    if (c.includes("battery")) return "🔋";
    return "⚡";
  };

  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080c14] text-gray-900 dark:text-white transition-colors">

      {/* ── Top Bar ── */}
      <div className={`border-b ${divider} bg-white/90 dark:bg-[#0b1120]/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between sticky top-0 z-40`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">⚡</div>
          <div>
            <div className={`text-sm font-bold ${textPrimary}`}>Sajilo Tayaar POS</div>
            <div className={`text-[10px] ${textMuted}`}>Electronics & Mobile</div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/[0.04] rounded-xl p-1 border border-gray-200 dark:border-white/[0.06]">
          {([
            { key:"pos",       label:"POS",       Icon: Ico.Receipt },
            { key:"history",   label:"History",   Icon: Ico.History },
            { key:"analytics", label:"Analytics", Icon: Ico.Chart   },
          ] as { key:Tab; label:string; Icon:React.FC }[]).map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all border-none cursor-pointer
                ${tab === key ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm" : "text-gray-500 dark:text-white/40 hover:text-gray-800 dark:hover:text-white/70 bg-transparent"}`}>
              <Icon/>{label}
            </button>
          ))}
        </div>

        <div className={`flex items-center gap-2 text-xs ${textMuted}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"/>Live
        </div>
      </div>

      {/* ══════════════════════════ POS TAB ══════════════════════════ */}
      {tab === "pos" && (
        <div className="flex h-[calc(100vh-57px)]">

          {/* LEFT — product catalog */}
          <div className={`flex-1 flex flex-col border-r ${divider} overflow-hidden`}>

            {/* Search + filters */}
            <div className={`p-4 border-b ${divider} space-y-3`}>
              <div className="relative">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted} pointer-events-none`}><Ico.Search/></span>
                <input ref={searchRef} className={inputCls+" pl-9"} placeholder="Search by name, SKU, brand, model..."
                  value={productSearch} onChange={(e) => setProductSearch(e.target.value)}/>
              </div>

              {/* ── Dynamic category pills built from real product data ── */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all border cursor-pointer capitalize
                      ${activeCategory === cat
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
                        : "border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/40 hover:text-gray-800 dark:hover:text-white/70 bg-transparent"}`}>
                    {cat}
                  </button>
                ))}
                <div className="ml-auto flex-shrink-0 flex items-center gap-1 border border-gray-200 dark:border-white/[0.06] rounded-lg p-0.5">
                  <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors cursor-pointer border-none ${viewMode==="grid"?"bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white":"text-gray-400 dark:text-white/30"}`}><Ico.Grid/></button>
                  <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors cursor-pointer border-none ${viewMode==="list"?"bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white":"text-gray-400 dark:text-white/30"}`}><Ico.List/></button>
                </div>
              </div>
            </div>

            {/* Products + pagination */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Array.from({length:6}).map((_,i) => <div key={i} className="rounded-xl border border-gray-100 dark:border-white/[0.06] bg-gray-100 dark:bg-white/[0.03] h-32 animate-pulse"/>)}
                </div>
              ) : viewMode === "grid" ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 flex-1">
                    {pagedProducts.map((product) => {
                      const inCart = cart.find((i) => i.product.id === product.id);
                      const oos    = product.stockQty <= 0;
                      return (
                        <button key={product.id} onClick={() => addToCart(product)} disabled={oos}
                          className={`group text-left rounded-xl border p-3 transition-all relative overflow-hidden cursor-pointer
                            ${oos
                              ? "opacity-40 cursor-not-allowed border-gray-100 dark:border-white/[0.04] bg-gray-50 dark:bg-white/[0.01]"
                              : inCart
                                ? "border-cyan-300 dark:border-cyan-500/40 bg-cyan-50 dark:bg-cyan-500/[0.07]"
                                : "border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] hover:border-cyan-300 dark:hover:border-white/20 hover:shadow-sm"}`}>
                          {inCart && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">{inCart.qty}</div>}
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-lg mb-2">{catEmoji(product.category)}</div>
                          <div className={`text-xs font-semibold ${textPrimary} truncate`}>{product.name}</div>
                          {product.category && <div className={`text-[10px] ${textMuted} mt-0.5 capitalize`}>{product.category}</div>}
                          <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mt-2">{fmt(product.sellingPrice)}</div>
                          <div className={`text-[10px] mt-1 font-medium ${product.stockQty<=5?"text-orange-500":"text-gray-400 dark:text-white/30"}`}>Stock: {product.stockQty}</div>
                        </button>
                      );
                    })}
                  </div>
                  <Pagination
                    page={productPage} totalPages={productTotalPages}
                    total={filteredProducts.length} perPage={PRODUCTS_PER_PAGE} label="products"
                    onPrev={() => setProductPage((p) => Math.max(1, p-1))}
                    onNext={() => setProductPage((p) => Math.min(productTotalPages, p+1))}
                    onPage={setProductPage}
                  />
                </>
              ) : (
                <>
                  <div className="space-y-2 flex-1">
                    {pagedProducts.map((product) => {
                      const inCart = cart.find((i) => i.product.id === product.id);
                      const oos    = product.stockQty <= 0;
                      return (
                        <button key={product.id} onClick={() => addToCart(product)} disabled={oos}
                          className={`w-full text-left rounded-xl border px-4 py-3 transition-all flex items-center gap-4 cursor-pointer
                            ${oos
                              ? "opacity-40 cursor-not-allowed border-gray-100 dark:border-white/[0.04]"
                              : inCart
                                ? "border-cyan-300 dark:border-cyan-500/40 bg-cyan-50 dark:bg-cyan-500/[0.07]"
                                : "border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-cyan-200 dark:hover:border-white/20 hover:shadow-sm"}`}>
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-base flex-shrink-0">{catEmoji(product.category)}</div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-semibold ${textPrimary} truncate`}>{product.name}</div>
                            <div className={`text-[10px] ${textMuted} capitalize`}>{product.sku ? `${product.sku} · ` : ""}{product.category}</div>
                          </div>
                          <div className={`text-[10px] ${product.stockQty<=5?"text-orange-500":textMuted}`}>Stk:{product.stockQty}</div>
                          <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex-shrink-0">{fmt(product.sellingPrice)}</div>
                          {inCart && <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">{inCart.qty}</div>}
                        </button>
                      );
                    })}
                  </div>
                  <Pagination
                    page={productPage} totalPages={productTotalPages}
                    total={filteredProducts.length} perPage={PRODUCTS_PER_PAGE} label="products"
                    onPrev={() => setProductPage((p) => Math.max(1, p-1))}
                    onNext={() => setProductPage((p) => Math.min(productTotalPages, p+1))}
                    onPage={setProductPage}
                  />
                </>
              )}
              {filteredProducts.length===0 && !loading && <div className={`text-center py-16 ${textMuted} text-sm`}>No products found</div>}
            </div>
          </div>

          {/* RIGHT — cart + checkout */}
          <div className={`w-96 flex flex-col bg-gray-50 dark:bg-[#090d16] border-l ${divider}`}>
            <div className={`p-4 border-b ${divider} space-y-2`}>
              <div className={`text-[10px] font-semibold tracking-widest uppercase ${textLabel} mb-3`}>Customer</div>
              <input className={inputCls} placeholder="Customer name (optional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)}/>
              <input className={inputCls} placeholder="Phone number (optional)"  value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}/>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className={`flex flex-col items-center justify-center h-full ${textMuted} text-sm gap-3`}>
                  <div className="text-4xl opacity-20">🛒</div>
                  <div>Tap products to add to cart</div>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-semibold ${textPrimary} truncate`}>{item.product.name}</div>
                          <div className={`text-[10px] ${textMuted} capitalize`}>{item.product.category}</div>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} className={`bg-transparent border-none cursor-pointer ${textMuted} hover:text-red-500 transition-colors p-0.5`}><Ico.Trash/></button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(item.product.id, item.qty-1)} className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-gray-500 dark:text-white/60 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-500 transition-colors cursor-pointer border-none"><Ico.Minus/></button>
                          <input type="number" min={1} max={item.product.stockQty} value={item.qty}
                            onChange={(e) => updateQty(item.product.id, Number(e.target.value))}
                            className="w-10 text-center bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08] rounded-md py-0.5 text-xs text-gray-900 dark:text-white outline-none focus:border-cyan-500/50"/>
                          <button onClick={() => updateQty(item.product.id, item.qty+1)} className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-gray-500 dark:text-white/60 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 hover:text-emerald-500 transition-colors cursor-pointer border-none"><Ico.Plus/></button>
                        </div>
                        <div className="flex-1 relative">
                          <span className={`absolute left-2 top-1/2 -translate-y-1/2 text-[10px] ${textMuted}`}>Rs.</span>
                          <input type="number" value={item.unitPrice}
                            onChange={(e) => updatePrice(item.product.id, Number(e.target.value))}
                            className="w-full pl-7 pr-2 bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08] rounded-md py-1 text-xs text-gray-900 dark:text-white outline-none focus:border-cyan-500/50 text-right"/>
                        </div>
                        <div className={`text-xs font-bold ${textPrimary} min-w-[56px] text-right`}>{fmt(item.qty*item.unitPrice)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`border-t ${divider} p-4 space-y-3`}>
              {/* Discount row */}
              <div className="flex items-center gap-2">
                <span className={textMuted}><Ico.Discount/></span>
                <div className="flex rounded-lg border border-gray-200 dark:border-white/[0.08] overflow-hidden text-[10px] font-semibold">
                  <button onClick={() => setDiscountType("flat")} className={`px-2.5 py-1 transition-colors cursor-pointer border-none ${discountType==="flat"?"bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white":"text-gray-400 dark:text-white/30 bg-transparent"}`}>Rs.</button>
                  <button onClick={() => setDiscountType("percent")} className={`px-2.5 py-1 transition-colors cursor-pointer border-none ${discountType==="percent"?"bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white":"text-gray-400 dark:text-white/30 bg-transparent"}`}>%</button>
                </div>
                <input type="number" placeholder="Discount" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)}
                  className="flex-1 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.07] text-gray-900 dark:text-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-500/50"/>
                <div className={`text-xs ${textSecondary} flex items-center gap-1`}>
                  <span>VAT%</span>
                  <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)}
                    className="w-12 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.07] text-gray-900 dark:text-white rounded-lg px-2 py-1.5 text-xs outline-none focus:border-cyan-500/50"/>
                </div>
              </div>

              {/* Payment method */}
              <div className="grid grid-cols-3 gap-2">
                {(["CASH","CARD","ONLINE"] as PaymentMethod[]).map((m) => (
                  <button key={m} onClick={() => setPaymentMethod(m)}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all cursor-pointer
                      ${paymentMethod===m ? `${PAY[m].bg} ${PAY[m].color}` : "border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-white/30 bg-transparent hover:border-gray-300 dark:hover:border-white/20"}`}>
                    {React.createElement(PAY[m].Icon)}
                    <span className="text-[10px] font-semibold">{PAY[m].label}</span>
                  </button>
                ))}
              </div>

              {/* Notes */}
              <textarea placeholder="Order notes (optional)..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                className="w-full bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.07] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 rounded-xl px-3 py-2 text-xs outline-none focus:border-cyan-500/50 resize-none"/>

              {/* Totals */}
              <div className="rounded-xl border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] p-3 space-y-1.5">
                <div className={`flex justify-between text-xs ${textSecondary}`}><span>Subtotal ({totals.itemCount} items)</span><span>{fmtFull(totals.subTotal)}</span></div>
                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400"><span>Discount ({discountType==="percent"?`${discountValue}%`:"flat"})</span><span>− {fmtFull(totals.discountAmt)}</span></div>
                <div className={`flex justify-between text-xs ${textSecondary}`}><span>VAT ({taxPercent}%)</span><span>+ {fmtFull(totals.taxAmt)}</span></div>
                <div className={`flex justify-between text-sm font-bold ${textPrimary} border-t border-gray-200 dark:border-white/[0.06] pt-2 mt-2`}>
                  <span>Grand Total</span><span className="text-cyan-600 dark:text-cyan-400">{fmtFull(totals.grandTotal)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={clearCart} disabled={cart.length===0}
                  className="flex-shrink-0 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-white/40 text-xs font-semibold hover:border-red-300 dark:hover:border-red-500/30 hover:text-red-500 transition-all cursor-pointer bg-transparent disabled:opacity-30 disabled:cursor-not-allowed">
                  Clear
                </button>
                <button onClick={createInvoice} disabled={creating||cart.length===0}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all cursor-pointer border-none shadow-md">
                  <Ico.Receipt/>
                  {creating?"Processing…":`Charge ${fmtFull(totals.grandTotal)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════ HISTORY TAB ══════════════════════════ */}
      {tab === "history" && (
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted} pointer-events-none`}><Ico.Search/></span>
              <input className={inputCls+" pl-9"} placeholder="Search by customer, phone, or invoice #..."
                value={historySearch} onChange={(e) => setHistorySearch(e.target.value)}/>
            </div>
            <div className="flex gap-1 border border-gray-200 dark:border-white/[0.07] rounded-xl p-1 bg-gray-100 dark:bg-white/[0.03]">
              {["ALL","CASH","CARD","ONLINE"].map((f) => (
                <button key={f} onClick={() => setHistoryPayFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none
                    ${historyPayFilter===f ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-400 dark:text-white/30 bg-transparent hover:text-gray-700 dark:hover:text-white/60"}`}>{f}</button>
              ))}
            </div>
          </div>

          {/* Invoice list */}
          <div className="space-y-3">
            {pagedInvoices.map((inv) => (
              <div key={inv.id} className={`${card} hover:shadow-md transition-all`}>
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setSelectedInvoice(selectedInvoice?.id===inv.id?null:inv)}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-600 dark:text-cyan-400">#{inv.id}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${textPrimary}`}>{inv.customerName||"Walk-in Customer"}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${PAY[inv.paymentMethod].bg} ${PAY[inv.paymentMethod].color}`}>{PAY[inv.paymentMethod].label}</span>
                    </div>
                    <div className={`text-xs ${textMuted} mt-0.5`}>
                      {inv.customerPhone&&`${inv.customerPhone} · `}
                      {new Date(inv.createdAt).toLocaleString()} · {inv.items.length} item{inv.items.length!==1?"s":""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-base font-bold ${textPrimary}`}>{fmtFull(inv.grandTotal)}</div>
                    {Number(inv.discount)>0 && <div className="text-[10px] text-emerald-600 dark:text-emerald-400">-{fmtFull(inv.discount)} disc</div>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); printInvoice(inv); }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/30 transition-all cursor-pointer bg-transparent">
                    <Ico.Print/>
                  </button>
                </div>
                {selectedInvoice?.id===inv.id && (
                  <div className="px-5 pb-4 border-t border-gray-100 dark:border-white/[0.05]">
                    <div className="mt-3 space-y-1.5">
                      {inv.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <span className={textSecondary}>{item.product.name}</span>
                          <span className={textMuted}>{item.qty} × {fmtFull(item.unitPrice)}</span>
                          <span className={`${textPrimary} font-semibold`}>{fmtFull(item.lineTotal)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.05] grid grid-cols-3 gap-2 text-xs text-center">
                      <div><div className={textMuted}>Subtotal</div><div className={`font-semibold ${textPrimary}`}>{fmtFull(inv.subTotal)}</div></div>
                      <div><div className={textMuted}>Discount</div><div className="font-semibold text-emerald-600 dark:text-emerald-400">−{fmtFull(inv.discount)}</div></div>
                      <div><div className={textMuted}>Tax</div><div className={`font-semibold ${textPrimary}`}>+{fmtFull(inv.tax)}</div></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredInvoices.length===0 && <div className={`text-center py-20 ${textMuted} text-sm`}>No invoices found</div>}
          </div>

          {/* ── History pagination ── */}
          <Pagination
            page={historyPage} totalPages={historyTotalPages}
            total={filteredInvoices.length} perPage={INVOICES_PER_PAGE} label="invoices"
            onPrev={() => setHistoryPage((p) => Math.max(1, p-1))}
            onNext={() => setHistoryPage((p) => Math.min(historyTotalPages, p+1))}
            onPage={setHistoryPage}
          />
        </div>
      )}

      {/* ══════════════════════════ ANALYTICS TAB ══════════════════════════ */}
      {tab === "analytics" && (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label:"Total Revenue", value:fmt(analytics.totalRevenue), sub:"All time",            iconBg:"bg-cyan-500"    },
              { label:"Today's Sales", value:fmt(analytics.todayRevenue), sub:`${analytics.todayOrders} orders`, iconBg:"bg-emerald-500" },
              { label:"Total Orders",  value:String(analytics.totalOrders), sub:"All invoices",      iconBg:"bg-violet-500"  },
              { label:"Avg. Order",    value:fmt(analytics.avgOrder),     sub:"Per invoice",          iconBg:"bg-orange-500"  },
            ].map((kpi) => (
              <div key={kpi.label} className={`${card} p-5 flex flex-col gap-2 relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-[0.08] ${kpi.iconBg}`}/>
                <div className={`text-xs font-medium ${textSecondary}`}>{kpi.label}</div>
                <div className={`text-2xl font-extrabold ${textPrimary} leading-none`}>{kpi.value}</div>
                <div className={`text-xs ${textMuted}`}>{kpi.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className={`${card} p-5`}>
              <div className={`text-sm font-bold ${textPrimary} mb-4`}>Revenue — Last 7 Days</div>
              <div className="flex items-end gap-2 h-32">
                {(() => {
                  const max = Math.max(...analytics.last7.map((d) => d.revenue), 1);
                  return analytics.last7.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`text-[9px] ${textMuted} font-semibold`}>{d.revenue>0?fmt(d.revenue).replace("Rs. ",""):""}</div>
                      <div className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400" style={{height:`${Math.max(4,(d.revenue/max)*100)}%`,opacity:0.7+(i/7)*0.3}}/>
                      <div className={`text-[9px] ${textMuted}`}>{d.date}</div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            <div className={`${card} p-5`}>
              <div className={`text-sm font-bold ${textPrimary} mb-4`}>Payment Breakdown</div>
              <div className="space-y-3">
                {(["CASH","CARD","ONLINE"] as PaymentMethod[]).map((m) => {
                  const val   = analytics.payBreakdown[m] || 0;
                  const total = Object.values(analytics.payBreakdown).reduce((s,v)=>s+v,0);
                  const pct   = total > 0 ? (val/total)*100 : 0;
                  return (
                    <div key={m}>
                      <div className="flex items-center justify-between mb-1">
                        <div className={`flex items-center gap-2 text-xs font-semibold ${PAY[m].color}`}>{React.createElement(PAY[m].Icon)}{PAY[m].label}</div>
                        <div className={`text-xs ${textSecondary}`}>{fmt(val)} <span className={textMuted}>({pct.toFixed(0)}%)</span></div>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/[0.06]">
                        <div className={`h-full rounded-full ${m==="CASH"?"bg-emerald-500":m==="CARD"?"bg-blue-500":"bg-violet-500"}`} style={{width:`${pct}%`}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${card} p-5 md:col-span-2`}>
              <div className={`text-sm font-bold ${textPrimary} mb-4`}>Top Selling Products</div>
              <div className="space-y-2">
                {analytics.topProducts.length===0 && <div className={`text-sm ${textMuted} text-center py-6`}>No sales data yet</div>}
                {analytics.topProducts.map((p, i) => {
                  const maxRev = analytics.topProducts[0]?.revenue || 1;
                  return (
                    <div key={p.name} className="flex items-center gap-4">
                      <div className={`w-6 text-xs font-bold ${textMuted} text-center`}>#{i+1}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-semibold ${textPrimary} truncate max-w-[200px]`}>{p.name}</span>
                          <span className={`text-xs ${textSecondary}`}>{p.qty} sold · {fmt(p.revenue)}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/[0.06]">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{width:`${(p.revenue/maxRev)*100}%`}}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Modal ── */}
      {successInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0d1425] shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-3xl mx-auto mb-4 text-white font-bold">✓</div>
              <div className={`text-xl font-extrabold ${textPrimary}`}>Payment Successful!</div>
              <div className={`text-sm ${textMuted} mt-1`}>Invoice #{successInvoice.id} created</div>
              <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-4">{fmtFull(successInvoice.grandTotal)}</div>
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold mt-2 px-3 py-1 rounded-full border ${PAY[successInvoice.paymentMethod].bg} ${PAY[successInvoice.paymentMethod].color}`}>
                {successInvoice.paymentMethod}
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => { printInvoice(successInvoice); setSuccessInvoice(null); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.10] text-gray-500 dark:text-white/60 text-sm font-semibold hover:border-gray-300 dark:hover:border-white/30 hover:text-gray-800 dark:hover:text-white transition-all cursor-pointer bg-transparent">
                <Ico.Print/> Print
              </button>
              <button onClick={() => setSuccessInvoice(null)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold cursor-pointer border-none">
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;