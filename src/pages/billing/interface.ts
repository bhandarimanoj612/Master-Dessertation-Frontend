// ─── types/billing.ts ────────────────────────────────────────────────────────

export type PaymentMethod = "CASH" | "CARD" | "ONLINE";

export interface BillingProduct {
  id: number;
  name: string;
  sku?: string;
  category?: string;
  sellingPrice: number;
  stockQty: number;
}

export interface BillingInvoiceItem {
  id: number;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  product: BillingProduct;
}

export interface BillingInvoice {
  id: number;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: PaymentMethod;
  subTotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  createdAt: string;
  items: BillingInvoiceItem[];
}

export interface CartEntry {
  qty: number;
}

// ─── store/interface.ts ───────────────────────────────────────────────────────

export interface IBilling {
  /* ── remote data ── */
  products: BillingProduct[];
  invoices: BillingInvoice[];
  selectedInvoice: BillingInvoice | null;

  /* ── UI state ── */
  loading: boolean;
  creating: boolean;
  error: string;
  productSearch: string;

  /* ── new-invoice form ── */
  cart: Record<number, number>; // productId → qty
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  discount: string;
  tax: string;

  /* ── derived (computed via selectors, not stored) ── */
  // Use selectCartCount / selectTotals / selectSelectedItems helpers below

  /* ── actions ── */
  loadData: (tenantId: number) => Promise<void>;
  openInvoice: (tenantId: number, invoiceId: number) => Promise<void>;
  closeInvoice: () => void;
  createInvoice: (tenantId: number) => Promise<void>;

  setCart: (productId: number, qty: number) => void;
  incrementCart: (productId: number, max: number) => void;
  decrementCart: (productId: number) => void;

  setCustomerName: (v: string) => void;
  setCustomerPhone: (v: string) => void;
  setPaymentMethod: (v: PaymentMethod) => void;
  setDiscount: (v: string) => void;
  setTax: (v: string) => void;
  setProductSearch: (v: string) => void;
  clearError: () => void;
}