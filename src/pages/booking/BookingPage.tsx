import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Phone,
  Store,
  Truck,
  User,
  Wrench,
} from "lucide-react";

import { bookingService } from "./services/booking.service";
import type {
  BookingResponse,
  BookingType,
  CreateBookingRequest,
  ServiceMode,
} from "./interface/booking.interface";
import { useShopDetailsStore } from "../shop/customer/store/shop.details.store";
import { useAuthStore } from "../auth/store/store";
import { useToast } from "../../global/hooks/useToast";

function getMinDate() {
  return new Date().toISOString().split("T")[0];
}

function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getDefaultPreferredDateTime() {
  const d = new Date();
  d.setHours(d.getHours() + 2);
  d.setMinutes(0, 0, 0);
  return toDatetimeLocalValue(d);
}

function getShopInitials(name?: string | null) {
  if (!name?.trim()) return "SH";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getGradient(name?: string | null) {
  const gradients = [
    "from-slate-900 via-blue-800 to-indigo-700",
    "from-indigo-800 via-violet-700 to-fuchsia-700",
    "from-sky-700 via-cyan-600 to-teal-600",
    "from-emerald-700 via-teal-700 to-cyan-700",
  ];
  if (!name) return gradients[0];
  return gradients[name.length % gradients.length];
}

function ShopPreview({
  name,
  imageUrl,
}: {
  name?: string | null;
  imageUrl?: string | null;
}) {
  const initials = getShopInitials(name);
  const gradient = getGradient(name);

  if (imageUrl) {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-3xl border border-neutral-200/70 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
        <img src={imageUrl} alt={name || "Shop"} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        <div className="absolute left-4 bottom-3 text-white">
          <div className="text-lg font-bold">{name}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-32 w-full overflow-hidden rounded-3xl bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative flex h-full items-center gap-4 px-5 text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-lg font-extrabold">
          {initials}
        </div>
        <div>
          <div className="text-xl font-extrabold tracking-tight">
            {name || "Repair Shop"}
          </div>
          <div className="mt-1 text-sm text-white/85">Booking preview</div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
    />
  );
}

export default function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shopId = Number(searchParams.get("shopId"));
 
  const { shop, status, errorMsg, fetchShop, clear } = useShopDetailsStore();

  const fullName = useAuthStore((state) => state.fullName);
  const email = useAuthStore((state) => state.email);
  const phone = useAuthStore((state) => state.phone);
 const userId = useAuthStore((state) => state.userId);
  const [customerName, setCustomerName] = useState(fullName ?? "");
  const [customerPhone, setCustomerPhone] = useState(phone ?? "");
  const [customerEmail, setCustomerEmail] = useState(email ?? "");
  const [bookingType, setBookingType] = useState<BookingType>("APPOINTMENT");
  const [serviceMode, setServiceMode] = useState<ServiceMode>("IN_STORE");
  const [deviceCategory, setDeviceCategory] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [preferredDateTime, setPreferredDateTime] = useState(
    getDefaultPreferredDateTime()
  );

  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<BookingResponse | null>(null);

  useEffect(() => {
    if (!Number.isFinite(shopId) || shopId <= 0) return;
    fetchShop(shopId);
    return () => clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  useEffect(() => {
    if (fullName) setCustomerName(fullName);
    if (phone) setCustomerPhone(phone);
    if (email) setCustomerEmail(email);
  }, [fullName, phone, email]);

  useEffect(() => {
    if (status === "error" && errorMsg) {
      toast.error(errorMsg);
    }
  }, [status, errorMsg]);

  const minDate = useMemo(() => getMinDate(), []);

  const validate = () => {
    if (!Number.isFinite(shopId) || shopId <= 0) return "Invalid shop selected.";
    if (!customerName.trim()) return "Customer name is required.";
    if (!customerPhone.trim()) return "Customer phone is required.";
    if (!customerEmail.trim()) return "Customer email is required.";
    if (!deviceCategory.trim()) return "Device category is required.";
    if (!deviceModel.trim()) return "Device model is required.";
    if (!issueDescription.trim()) return "Issue description is required.";
    if (!preferredDateTime) return "Preferred date and time is required.";
    if (serviceMode === "HOME_PICKUP" && !pickupAddress.trim()) {
  return "Pickup address is required when pickup is selected.";
}
    return "";
  };

  const buildPayload = (): CreateBookingRequest => ({
    shopId,
     customerUserId: userId!,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    customerEmail: customerEmail.trim(),
    bookingType,
    serviceMode,
    deviceCategory: deviceCategory.trim(),
    deviceModel: deviceModel.trim(),
    issueDescription: issueDescription.trim(),
    pickupAddress: serviceMode === "HOME_PICKUP" ? pickupAddress.trim() : "",
    preferredDateTime: new Date(preferredDateTime).toISOString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      toast.warning(validationError);
      return;
    }

    try {
      setSubmitting(true);
      const res = await bookingService.createBooking(buildPayload());
      setSuccess(res);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create booking.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!Number.isFinite(shopId) || shopId <= 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          Invalid shop ID.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {success ? (
          <div className="mx-auto max-w-4xl rounded-[28px] border border-emerald-200 bg-white p-8 shadow-sm dark:border-emerald-900/40 dark:bg-neutral-950/70">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 size={28} />
              </div>

              <div className="flex-1">
                <div className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
                  Booking created successfully
                </div>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                  Your repair request has been submitted and is now waiting for shop review.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Booking ID
                </div>
                <div className="mt-2 text-xl font-bold">#{success.id}</div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Status
                </div>
                <div className="mt-2 text-xl font-bold text-blue-700 dark:text-blue-300">
                  {success.repairStatus}
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Shop
                </div>
                <div className="mt-2 text-lg font-bold">{success.shopName}</div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Preferred time
                </div>
                <div className="mt-2 text-lg font-bold">
                  {new Date(success.preferredDateTime).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/app/appointments")}
                className="rounded-2xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Go to appointments
              </button>

              <button
                onClick={() => navigate("/app/shops")}
                className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
              >
                Browse more shops
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/70">
                <div className="text-3xl font-black tracking-tight">Book repair</div>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Fill the details below to submit your repair request.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      <User size={16} />
                      Customer information
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field label="Full name">
                        <Input
                          value={customerName}
                          onChange={setCustomerName}
                          placeholder="Your full name"
                        />
                      </Field>

                      <Field label="Phone">
                        <Input
                          value={customerPhone}
                          onChange={setCustomerPhone}
                          placeholder="98xxxxxxxx"
                        />
                      </Field>

                      <div className="md:col-span-2">
                        <Field label="Email">
                          <Input
                            type="email"
                            value={customerEmail}
                            onChange={setCustomerEmail}
                            placeholder="you@example.com"
                          />
                        </Field>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      <Wrench size={16} />
                      Booking details
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field label="Booking type">
                        <select
                          value={bookingType}
                          onChange={(e) => setBookingType(e.target.value as BookingType)}
                          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                        >
                          <option value="APPOINTMENT">Appointment</option>
                          <option value="DIRECT_REQUEST">Direct request</option>
                        </select>
                      </Field>

                      <Field label="Service mode">
                        <select
                          value={serviceMode}
                          onChange={(e) => setServiceMode(e.target.value as ServiceMode)}
                          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                        >
                          <option value="IN_STORE">In store</option>
                          <option value="HOME_PICKUP">Pickup</option>
                        </select>
                      </Field>

                      <Field label="Device category">
                        <Input
                          value={deviceCategory}
                          onChange={setDeviceCategory}
                          placeholder="Mobile, Laptop, Tablet..."
                        />
                      </Field>

                      <Field label="Device model">
                        <Input
                          value={deviceModel}
                          onChange={setDeviceModel}
                          placeholder="iPhone 13, Dell Inspiron..."
                        />
                      </Field>

                      <div className="md:col-span-2">
                        <Field label="Issue description">
                          <TextArea
                            value={issueDescription}
                            onChange={setIssueDescription}
                            placeholder="Explain the issue clearly..."
                            rows={5}
                          />
                        </Field>
                      </div>

                      {serviceMode === "HOME_PICKUP" && (
                        <div className="md:col-span-2">
                          <Field label="Pickup address">
                            <TextArea
                              value={pickupAddress}
                              onChange={setPickupAddress}
                              placeholder="Enter pickup address"
                              rows={3}
                            />
                          </Field>
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <Field label="Preferred date and time">
                          <Input
                            type="datetime-local"
                            value={preferredDateTime}
                            onChange={setPreferredDateTime}
                          />
                          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                            Pick a time from {minDate} onward.
                          </div>
                        </Field>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Creating booking...
                        </>
                      ) : (
                        <>
                          Submit booking
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="xl:col-span-4">
              <div className="xl:sticky xl:top-24 space-y-4">
                <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/70">
                  {status === "loading" ? (
                    <div className="h-32 rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
                  ) : status === "error" ? (
                    <div className="h-32 rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
                  ) : shop ? (
                    <>
                      <ShopPreview
                        name={shop.name}
                        imageUrl={(shop as any).imageUrl ?? null}
                      />

                      <div className="mt-5">
                        <div className="text-xl font-extrabold">{shop.name}</div>
                        <div className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                          <div className="flex items-center gap-2">
                            <Store size={16} />
                            <span>{shop.address ?? "Address not set"}</span>
                          </div>

                          {shop.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={16} />
                              <span>{shop.phone}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Clock3 size={16} />
                            <span>
                              {shop.openingHours
                                ? `${shop.openingHours.label}: ${shop.openingHours.open} - ${shop.openingHours.close}`
                                : "Sun–Fri: 10:00 - 19:00"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>

                <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/70">
                  <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Booking summary
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-900">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={15} />
                        Booking type
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {bookingType}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-900">
                      <span className="inline-flex items-center gap-2">
                        <Truck size={15} />
                        Service mode
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {serviceMode}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-900">
                      <span>Preferred date</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {preferredDateTime ? new Date(preferredDateTime).toLocaleString() : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                    After submitting, your booking status will start as <span className="font-semibold">REQUESTED</span>.
                  </div>
                </div>

                <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/70">
                  <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Notes
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <li>• Be clear about the device issue.</li>
                    <li>• Pickup address is needed only for pickup service.</li>
                    <li>• The shop can review and update status later.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}