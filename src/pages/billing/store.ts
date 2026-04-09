import { create } from "zustand";
import { axios_auth } from "../../global/config";
import type {
  BillingInvoice,
  BillingProduct,
  IBilling,
  PaymentMethod,
} from "./interface";

// ─── Selectors (call outside the store to keep re-renders cheap) ──────────────

export const selectFilteredProducts = (
  products: BillingProduct[],
  search: string
) =>
  products.filter((p) =>
    [p.name, p.sku ?? "", p.category ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

export const selectSelectedItems = (
  products: BillingProduct[],
  cart: Record<number, number>
) =>
  products
    .filter((p) => (cart[p.id] ?? 0) > 0)
    .map((p) => ({
      productId: p.id,
      name: p.name,
      qty: cart[p.id],
      unitPrice: Number(p.sellingPrice),
      lineTotal: cart[p.id] * Number(p.sellingPrice),
    }));

export const selectTotals = (
  products: BillingProduct[],
  cart: Record<number, number>,
  discount: string,
  tax: string
) => {
  const items = selectSelectedItems(products, cart);
  const subTotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const discountValue = Number(discount || 0);
  const taxValue = Number(tax || 0);
  return {
    subTotal,
    discountValue,
    taxValue,
    grandTotal: Math.max(0, subTotal - discountValue + taxValue),
  };
};

export const selectCartCount = (cart: Record<number, number>) =>
  Object.values(cart).reduce((s, v) => s + (v || 0), 0);

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBillingStore = create<IBilling>((set, get) => ({
  /* state */
  products: [],
  invoices: [],
  selectedInvoice: null,
  loading: false,
  creating: false,
  error: "",
  productSearch: "",
  cart: {},
  customerName: "",
  customerPhone: "",
  paymentMethod: "CASH",
  discount: "0",
  tax: "0",

  /* ── data loading ── */
  loadData: async (tenantId) => {
    if (!tenantId) return;
    set({ loading: true, error: "" });
    try {
      const [productRes, invoiceRes] = await Promise.all([
        axios_auth.get<BillingProduct[]>(
          `/api/inventory/products/shop/${tenantId}`
        ),
        axios_auth.get<BillingInvoice[]>(
          `/api/pos/invoices/shop/${tenantId}`
        ),
      ]);
      set({
        products: Array.isArray(productRes.data) ? productRes.data : [],
        invoices: Array.isArray(invoiceRes.data) ? invoiceRes.data : [],
      });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Failed to load billing data" });
    } finally {
      set({ loading: false });
    }
  },

  openInvoice: async (tenantId, invoiceId) => {
    try {
      const res = await axios_auth.get<BillingInvoice>(
        `/api/pos/invoices/shop/${tenantId}/${invoiceId}`
      );
      set({ selectedInvoice: res.data });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Failed to load invoice" });
    }
  },

  closeInvoice: () => set({ selectedInvoice: null }),

  createInvoice: async (tenantId) => {
    const { products, cart, customerName, customerPhone, paymentMethod, discount, tax } =
      get();
    const items = selectSelectedItems(products, cart);
    if (!tenantId || items.length === 0) return;

    set({ creating: true, error: "" });
    try {
      await axios_auth.post("/api/pos/invoices", {
        shopId: tenantId,
        customerName,
        customerPhone,
        paymentMethod,
        discount: Number(discount || 0),
        tax: Number(tax || 0),
        items: items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          unitPrice: i.unitPrice,
        })),
      });
      // Reset form
      set({
        cart: {},
        customerName: "",
        customerPhone: "",
        discount: "0",
        tax: "0",
      });
      // Refresh lists
      await get().loadData(tenantId);
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Failed to create invoice" });
    } finally {
      set({ creating: false });
    }
  },

  /* ── cart mutations ── */
  setCart: (productId, qty) =>
    set((s) => ({ cart: { ...s.cart, [productId]: Math.max(0, qty) } })),

  incrementCart: (productId, max) =>
    set((s) => ({
      cart: {
        ...s.cart,
        [productId]: Math.min(max, (s.cart[productId] ?? 0) + 1),
      },
    })),

  decrementCart: (productId) =>
    set((s) => ({
      cart: {
        ...s.cart,
        [productId]: Math.max(0, (s.cart[productId] ?? 0) - 1),
      },
    })),

  /* ── form field setters ── */
  setCustomerName: (v) => set({ customerName: v }),
  setCustomerPhone: (v) => set({ customerPhone: v }),
  setPaymentMethod: (v: PaymentMethod) => set({ paymentMethod: v }),
  setDiscount: (v) => set({ discount: v }),
  setTax: (v) => set({ tax: v }),
  setProductSearch: (v) => set({ productSearch: v }),
  clearError: () => set({ error: "" }),
}));